// javascript
import fetch from 'node-fetch';
import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

// --- CONFIGURATION ---
const port = process.env.PORT || 3002;
const mongoUri = process.env.MONGODB_URI;
const apiKey = process.env.GEMINI_API_KEY;

const chatModel = 'gemini-2.0-flash';
const embeddingModel = 'text-embedding-004';
const EMBEDDING_DIMENSIONS = 768;

if (!mongoUri || !apiKey) {
  console.error("Missing MONGODB_URI or GEMINI_API_KEY in .env file");
  process.exit(1);
}

// --- MONGO CLIENT ---
const mongoClient = new MongoClient(mongoUri);
let db;

async function connectToDb() {
  try {
    await mongoClient.connect();
    console.log("Pinged your deployment. Connected to MongoDB!");
    db = mongoClient.db("placements");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

// =======================================================
// ✅ COSINE SIMILARITY IMPLEMENTATION
// =======================================================
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    console.error("Vector length mismatch");
    return -1;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }

  const similarity = dot / (Math.sqrt(normA) * Math.sqrt(normB));
  return similarity;
}

// =======================================================
// ✅ GEMINI HELPERS
// =======================================================

async function callGemini(prompt, userInput) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${chatModel}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      { role: "user", parts: [{ text: prompt }] },
      { role: "model", parts: [{ text: "OK, I will follow these instructions." }] },
      { role: "user", parts: [{ text: userInput }] }
    ]
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${await response.text()}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function getEmbedding(text) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${embeddingModel}:embedContent?key=${apiKey}`;

  const payload = { content: { parts: [{ text }] } };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Embedding failed: ${await response.text()}`);
  }

  const data = await response.json();
  return data.embedding.values;
}

// =======================================================
// ✅ RAG AGENT PROMPT
// =======================================================
const RAG_AGENT_PROMPT = `
You are a helpful placement-analysis assistant.

You will be given CONTEXT containing:
• Offer details
• Student details
• Company details

Rules:
1. Answer ONLY from the provided context.
2. If not found, reply: 
   "I'm sorry, I couldn't find any relevant information based on the documents provided."
3. Give clean summaries, bullet points, CTC values, roles, sectors.
4. Do not hallucinate or invent any information.
`;

// =======================================================
// ✅ MANUAL COSINE-SIMILARITY RAG PIPELINE
// =======================================================
async function runRagPipeline(userInput) {
  console.log(`[RAG] Running: "${userInput}"`);

  // 1. Embed input
  const queryEmbedding = await getEmbedding(userInput);
  if (!queryEmbedding) throw new Error("Failed to embed user input");

  const offersCollection = db.collection("offers");

  // 2. Fetch candidate docs WITH embeddings
  const candidates = await offersCollection.find(
    {},
    {
      projection: {
        docEmbedding: 1,
        student_id: 1,
        company_id: 1,
        role: 1,
        ctc_lpa: 1,
        stipend_kpm: 1,
        duration: 1,
        details: 1
      }
    }
  ).toArray();

  if (candidates.length === 0) {
    return { confidence: 0, answer: "No documents found.", context: [] };
  }

  // 3. Compute cosine similarity
  const scored = candidates.map(doc => ({
    ...doc,
    similarity: cosineSimilarity(queryEmbedding, doc.docEmbedding)
  }));

  // 4. Sort by similarity
  scored.sort((a, b) => b.similarity - a.similarity);

  // 5. Keep top N
  const topDocs = scored.slice(0, 5);

  const enriched = [];

  // 6. JOIN student + company for each doc
  for (const doc of topDocs) {
    const student = await db.collection("students").findOne({ _id: doc.student_id });
    const company = await db.collection("companies").findOne({ company_id: doc.company_id });

    enriched.push({
      similarity: doc.similarity,
      role: doc.role,
      ctc_lpa: doc.ctc_lpa,
      stipend_kpm: doc.stipend_kpm,
      duration: doc.duration,
      details: doc.details,
      student_name: student?.name,
      student_branch: student?.branch,
      student_cgpa: student?.cgpa,
      company_name: company?.name,
      company_sector: company?.sector
    });
  }

  // 7. Build context for Gemini
  const contextBlock = enriched.map(d => JSON.stringify(d)).join("\n\n");

  const finalPrompt = `
Context:
${contextBlock}

User Question:
${userInput}
  `;

  const answer = await callGemini(RAG_AGENT_PROMPT, finalPrompt);

  return {
    confidence: enriched[0]?.similarity ?? 0,
    answer,
    context: enriched
  };
}

// =======================================================
// ✅ EXPRESS API
// =======================================================
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Placement RAG Backend with cosine similarity is running ✅");
});

app.post('/api/rag-placements-answer', async (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: "userInput is required" });
  }

  try {
    const result = await runRagPipeline(userInput);
    return res.json({ status: "success", ...result });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({
      error: "Error during RAG execution",
      details: err.message
    });
  }
});

// =======================================================
// ✅ START SERVER
// =======================================================
connectToDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;
const apiKey = process.env.GEMINI_API_KEY;
const embeddingModel = 'text-embedding-004'; 
const EMBEDDING_DIMENSIONS = 768;

if (!mongoUri || !apiKey) {
  console.error("Missing MONGODB_URI or GEMINI_API_KEY in .env file");
  process.exit(1);
}

const mongoClient = new MongoClient(mongoUri);

async function getEmbedding(text) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${embeddingModel}:embedContent?key=${apiKey}`;

  const payload = {
    content: {
      parts: [{ text: text }]
    }
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini Embedding API failed: ${response.status} ${errorBody}`);
    }

    const result = await response.json();
    return result.embedding.values;
  } catch (error) {
    console.error(`Error getting embedding for text: ${text.substring(0, 20)}...`, error.message);
    return null;
  }
}

function createTextForEmbedding(offer, student, company) {
  return `
    Student Offer Details:
    Name: ${student.name}, Roll No: ${student._id}, Branch: ${student.branch}, CGPA: ${student.cgpa}.
    Company: ${company.name}, Sector: ${company.sector}, HQ: ${company.hq_city}.
    Offer Role: ${offer.role}, CTC (LPA): ${offer.ctc_lpa}, Stipend (KPM): ${offer.stipend_kpm}.
    Duration: ${offer.duration}, Offer Details: ${offer.details}.
  `.trim().replace(/\s+/g, ' ');
}

async function createEmbeddings() {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB Atlas.");
    const db = mongoClient.db("placements"); // Explicitly use 'placements' database
    const offersCollection = db.collection("offers");

    console.log("Starting embedding process via aggregation pipeline...");

    // Aggregation pipeline to join all three collections and process
    const pipeline = [
      { $match: { docEmbedding: { $exists: false } } }, // Only process offers without an embedding
      
      // 1. Join with students collection
      {
        $lookup: {
          from: "students",
          localField: "student_id",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },
      
      // 2. Join with companies collection
      {
        $lookup: {
          from: "companies",
          localField: "company_id",
          foreignField: "company_id",
          as: "company"
        }
      },
      { $unwind: "$company" },
      
      // 3. Project the necessary fields for embedding and update
      {
        $project: {
          _id: 1,
          offer: "$$ROOT", // Keep the original offer document
          student: "$student",
          company: "$company"
        }
      }
    ];

    const cursor = offersCollection.aggregate(pipeline, { allowDiskUse: true });
    
    let count = 0;
    
    for await (const doc of cursor) {
      const { offer, student, company } = doc;
      
      console.log(`Processing offer for ${student.name} at ${company.name}`);
      
      // 1. Create the rich text string
      const textToEmbed = createTextForEmbedding(offer, student, company);

      // 2. Get the embedding
      const embedding = await getEmbedding(textToEmbed);

      if (embedding && embedding.length === EMBEDDING_DIMENSIONS) {
        // 3. Save the embedding back to the original offer document
        await offersCollection.updateOne(
          { _id: offer._id },
          { $set: { docEmbedding: embedding } }
        );
        count++;
        console.log(`  -> Successfully saved embedding for offer ID: ${offer._id}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit delay
    }

    if (count === 0) {
        console.log("All offers already have embeddings or no new offers found.");
    } else {
        console.log(`\nSuccessfully created embeddings for ${count} new offers.`);
    }

  } catch (err) {
    console.error("An error occurred during embedding process:", err);
  } finally {
    await mongoClient.close();
    console.log("Disconnected from MongoDB.");
  }
}

createEmbeddings();
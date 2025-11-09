import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// Serve static files from frontend/dist (MUST be before API routes)
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// --- CONFIGURATION ---
const apiKey = process.env.GEMINI_API_KEY;
const mongoUri = process.env.MONGODB_URI;

if (!apiKey || !mongoUri) {
  console.error("Missing GEMINI_API_KEY or MONGODB_URI");
  process.exit(1);
}

const chatModel = 'gemini-2.0-flash';
const embeddingModel = 'text-embedding-004';

// --- DATABASE CONNECTION ---
const mongoClient = new MongoClient(mongoUri);
let db;
let memory, tools, planner;

(async () => {
  try {
    await mongoClient.connect();
    db = mongoClient.db("Employees");
    await mongoClient.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB!");
    
    // Initialize agent components AFTER database connection
    memory = new AgentMemory(db);
    tools = new AgentTools(db, apiKey);
    planner = new AgentPlanner(tools, memory, apiKey);
    console.log("🤖 AI Agent initialized!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
})();

// ===========================================
// AI AGENT ARCHITECTURE
// ===========================================

// --- AGENT MEMORY ---
class AgentMemory {
  constructor(db) {
    this.collection = db.collection("AgentMemory");
  }

  async storeInteraction(sessionId, userId, role, content) {
    await this.collection.insertOne({
      sessionId,
      userId,
      role,
      content,
      timestamp: new Date()
    });
  }

  async getSessionHistory(sessionId, limit = 10) {
    const history = await this.collection
      .find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    return history.reverse();
  }

  async clearSession(sessionId) {
    await this.collection.deleteMany({ sessionId });
  }
}

// --- AGENT TOOLS ---
class AgentTools {
  constructor(db, apiKey) {
    this.db = db;
    this.apiKey = apiKey;
  }

  // Tool 1: Vector Search
  async vectorSearchTool(query, collectionName = "managers", limit = 3) {
    try {
      console.log(`[Tool:VectorSearch] Query: "${query}" on ${collectionName}`);
      
      // Get embedding for query
      const queryVector = await this.getEmbedding(query);
      
      // Perform vector search
      const collection = this.db.collection(collectionName);
      const results = await collection.aggregate([
        {
          "$vectorSearch": {
            "index": "vectorIndex",
            "path": "docEmbedding",
            "queryVector": queryVector,
            "numCandidates": 50,
            "limit": limit
          }
        },
        {
          "$project": {
            "docEmbedding": 0,
            "score": { "$meta": "vectorSearchScore" }
          }
        }
      ]).toArray();

      return {
        success: true,
        data: results,
        count: results.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Tool 2: Database Query
  async databaseQueryTool(nlQuery, collectionName = "managers", limit = 10) {
    try {
      console.log(`[Tool:DatabaseQuery] NL Query: "${nlQuery}" on ${collectionName}`);
      
      // Convert NL to MongoDB query using LLM
      const mongoQuery = await this.nlToMongoQuery(nlQuery);
      
      // Execute query
      const collection = this.db.collection(collectionName);
      const results = await collection
        .find(mongoQuery)
        .project({ docEmbedding: 0 })
        .limit(limit)
        .toArray();

      return {
        success: true,
        data: results,
        query: mongoQuery,
        count: results.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Tool 3: Update Database
  async updateDatabaseTool(nlUpdate, collectionName = "managers") {
    try {
      console.log(`[Tool:UpdateDatabase] NL Update: "${nlUpdate}" on ${collectionName}`);
      
      // Convert NL to MongoDB update operation
      const updateOp = await this.nlToMongoUpdate(nlUpdate);
      
      // Safety check
      if (!updateOp.filter || Object.keys(updateOp.filter).length === 0) {
        return {
          success: false,
          error: "Update filter is too broad. Please be more specific."
        };
      }

      // Execute update
      const collection = this.db.collection(collectionName);
      const result = await collection.updateMany(updateOp.filter, updateOp.update);

      // Re-sync embeddings if needed
      if (result.modifiedCount > 0) {
        await this.resyncEmbeddings(collection, updateOp.filter);
      }

      return {
        success: true,
        modifiedCount: result.modifiedCount,
        matched: result.matchedCount
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Tool 4: Calculator
  calculatorTool(expression) {
    try {
      console.log(`[Tool:Calculator] Expression: "${expression}"`);
      
      // Sanitize expression
      const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, '');
      
      // Evaluate
      const result = eval(sanitized);
      
      return {
        success: true,
        result: result,
        expression: sanitized
      };
    } catch (error) {
      return {
        success: false,
        error: "Invalid mathematical expression"
      };
    }
  }

  // Tool 5: Aggregation
  async aggregationTool(nlQuery, collectionName = "managers") {
    try {
      console.log(`[Tool:Aggregation] NL Query: "${nlQuery}" on ${collectionName}`);
      
      // Convert NL to aggregation pipeline
      const pipeline = await this.nlToAggregation(nlQuery);
      
      const collection = this.db.collection(collectionName);
      const results = await collection.aggregate(pipeline).toArray();

      return {
        success: true,
        data: results,
        pipeline: pipeline
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper: Get embedding
  async getEmbedding(text) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${embeddingModel}:embedContent?key=${this.apiKey}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: { parts: [{ text: text }] }
      })
    });
    const result = await response.json();
    return result.embedding.values;
  }

  // Helper: NL to MongoDB Query
  async nlToMongoQuery(nlQuery) {
    const prompt = `Convert this natural language query to a MongoDB find filter JSON:
"${nlQuery}"

Rules:
- Output ONLY valid JSON
- Use case-insensitive regex for Name fields
- Handle CTC as numbers
- Branch codes: CO=Computer Science, IT=Information Technology, etc.

Examples:
"Find people with CTC > 50" → {"CTC": {"$gt": 50}}
"People in CO branch" → {"Branch": "CO"}
"Name contains John" → {"Name": {"$regex": "John", "$options": "i"}}`;

    const result = await this.callLLM(prompt, true);
    return result;
  }

  // Helper: NL to MongoDB Update
  async nlToMongoUpdate(nlUpdate) {
    const prompt = `Convert this natural language update to MongoDB update operation JSON:
"${nlUpdate}"

Output format: {"filter": {...}, "update": {"$set": {...}}}

Rules:
- Filter MUST be specific (use Name or unique field)
- For Name field, use simple case-insensitive regex: {"Name": {"$regex": "John Doe", "$options": "i"}}
- Only use $set operator
- If filter is vague, return empty: {"filter": {}, "update": {}}
- Keep regex patterns simple, avoid complex escaping

Examples:
"Change CTC for John Doe to 70" → {"filter": {"Name": {"$regex": "John Doe", "$options": "i"}}, "update": {"$set": {"CTC": 70}}}
"Update branch for Jane Smith to IT" → {"filter": {"Name": {"$regex": "Jane Smith", "$options": "i"}}, "update": {"$set": {"Branch": "IT"}}}
"Set company for Kangan Gupta to Microsoft" → {"filter": {"Name": {"$regex": "Kangan Gupta", "$options": "i"}}, "update": {"$set": {"Company": "Microsoft"}}}`;

    try {
      const result = await this.callLLM(prompt, true);
      return result;
    } catch (error) {
      console.error("Error parsing update JSON:", error.message);
      // Return a safe empty result
      return {"filter": {}, "update": {}};
    }
  }

  // Helper: NL to Aggregation
  async nlToAggregation(nlQuery) {
    const prompt = `Convert this natural language query to MongoDB aggregation pipeline JSON:
"${nlQuery}"

Output ONLY valid JSON array of pipeline stages.

Examples:
"Average CTC by branch" → [{"$group": {"_id": "$Branch", "avgCTC": {"$avg": "$CTC"}}}]
"Count people per company" → [{"$group": {"_id": "$Company", "count": {"$sum": 1}}}]`;

    const result = await this.callLLM(prompt, true);
    return result;
  }

  // Helper: Re-sync embeddings
  async resyncEmbeddings(collection, filter) {
    const docs = await collection.find(filter).toArray();
    for (const doc of docs) {
      const text = `Name: ${doc.Name}, Branch: ${doc.Branch}, Role: ${doc.Role}, Company: ${doc.Company}, CTC: ${doc.CTC}`;
      const embedding = await this.getEmbedding(text);
      await collection.updateOne({ _id: doc._id }, { $set: { docEmbedding: embedding } });
    }
  }

  // Helper: Call LLM
  async callLLM(prompt, isJson = false) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${chatModel}:generateContent?key=${this.apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: isJson ? "application/json" : "text/plain"
          }
        })
      });
      
      const result = await response.json();
      
      // Check for errors or missing candidates
      if (!result.candidates || result.candidates.length === 0) {
        console.error("LLM Error:", result);
        throw new Error(result.error?.message || "No response from LLM");
      }
      
      const text = result.candidates[0].content.parts[0].text;
      return isJson ? JSON.parse(text) : text;
    } catch (error) {
      console.error("LLM Call Error:", error.message);
      throw error;
    }
  }
}

// --- AGENT PLANNING ---
class AgentPlanner {
  constructor(tools, memory, apiKey) {
    this.tools = tools;
    this.memory = memory;
    this.apiKey = apiKey;
  }

  async plan(userQuery, sessionId, userId) {
    console.log(`\n[Agent] Processing: "${userQuery}"`);
    
    // Step 1: Get session history for context
    const history = await this.memory.getSessionHistory(sessionId);
    const contextStr = this.formatHistory(history);

    // Step 2: Select appropriate tool
    const toolChoice = await this.selectTool(userQuery, contextStr);
    console.log(`[Agent] Tool selected: ${toolChoice.tool}, Limit: ${toolChoice.limit || 'default'}`);

    // Step 3: Execute tool
    let toolResult;
    const limit = toolChoice.limit || 5; // Default to 5 if not specified
    
    switch (toolChoice.tool) {
      case 'vector_search':
        toolResult = await this.tools.vectorSearchTool(userQuery, toolChoice.collection, limit);
        break;
      case 'database_query':
        toolResult = await this.tools.databaseQueryTool(userQuery, toolChoice.collection, limit);
        break;
      case 'update_database':
        toolResult = await this.tools.updateDatabaseTool(userQuery, toolChoice.collection);
        break;
      case 'calculator':
        toolResult = this.tools.calculatorTool(toolChoice.expression || userQuery);
        break;
      case 'aggregation':
        toolResult = await this.tools.aggregationTool(userQuery, toolChoice.collection);
        break;
      default:
        toolResult = { success: false, error: "Unknown tool" };
    }

    // Step 4: Generate natural language response
    const response = await this.generateResponse(userQuery, toolResult, contextStr);

    // Step 5: Store interaction in memory
    await this.memory.storeInteraction(sessionId, userId, 'user', userQuery);
    await this.memory.storeInteraction(sessionId, userId, 'assistant', response.answer);

    return {
      answer: response.answer,
      toolUsed: toolChoice.tool,
      toolResult: toolResult,
      confidence: response.confidence
    };
  }

  async selectTool(query, context) {
    const prompt = `You are a tool selector for an AI agent. Given a user query and conversation history, select the most appropriate tool and determine result limit.

Available tools:
1. vector_search - Semantic search for questions about people, roles, companies (e.g., "Tell me about John", "Who works at Google?")
2. database_query - Structured queries with filters (e.g., "Find people with CTC > 50", "Show CO branch")
3. update_database - Update records (e.g., "Change John's CTC to 70", "Update branch for Jane")
4. calculator - Math calculations (e.g., "What is 123+456?", "Calculate 20% of 500")
5. aggregation - Statistics and grouping (e.g., "Average CTC by branch", "Count per company")

Conversation history:
${context}

User query: "${query}"

Determine limit based on query specificity:
- If asking about a SPECIFIC person (e.g., "Tell me about John Doe") → limit: 1
- If asking "who works at [company]" → limit: 5
- If asking with filters like "CTC > X" → limit: 10
- General queries → limit: 5

Output JSON: {"tool": "tool_name", "collection": "managers", "limit": number, "expression": "math_expr_if_calculator"}`;

    return await this.tools.callLLM(prompt, true);
  }

  async generateResponse(query, toolResult, context) {
    const prompt = `You are a helpful AI assistant. Generate a natural language answer based on the tool execution result.

Conversation history:
${context}

User query: "${query}"

Tool result: ${JSON.stringify(toolResult, null, 2)}

Generate a concise, helpful answer. If data is returned, summarize key points. If it's a calculation, show the result clearly.`;

    const answer = await this.tools.callLLM(prompt, false);
    
    return {
      answer: answer,
      confidence: toolResult.success ? 0.9 : 0.3
    };
  }

  formatHistory(history) {
    if (!history || history.length === 0) return "No previous conversation.";
    return history.map(h => `${h.role}: ${h.content}`).join('\n');
  }
}

// ===========================================
// API ENDPOINTS
// ===========================================

app.get('/', (req, res) => {
  res.send('🤖 QueryChain AI Agent is running!');
});

// Main AI Agent endpoint
app.post('/api/agent', async (req, res) => {
  const { userInput, sessionId, userId } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: "userInput is required" });
  }

  // Check if agent is initialized
  if (!planner || !memory || !tools) {
    return res.status(503).json({ 
      error: "AI Agent is still initializing. Please wait a moment and try again." 
    });
  }

  const session = sessionId || `session_${Date.now()}`;
  const user = userId || "anonymous";

  try {
    const result = await planner.plan(userInput, session, user);
    res.json({
      success: true,
      sessionId: session,
      ...result
    });
  } catch (error) {
    console.error(`[Agent Error] ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Dedicated Update endpoint
app.post('/api/update', async (req, res) => {
  const { userInput, sessionId, collectionName = "managers" } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: "userInput is required" });
  }

  // Check if agent is initialized
  if (!tools) {
    return res.status(503).json({ 
      error: "AI Agent is still initializing. Please wait a moment and try again." 
    });
  }

  const session = sessionId || `session_${Date.now()}`;

  try {
    console.log(`[Update Mode] Processing: "${userInput}"`);
    
    // Directly call the update tool
    const result = await tools.updateDatabaseTool(userInput, collectionName);

    if (result.success) {
      const message = result.modifiedCount > 0
        ? `✅ Successfully updated ${result.modifiedCount} record(s).`
        : `ℹ️ Found ${result.matched} matching record(s) but no changes were needed.`;

      // Store in memory if memory is available
      if (memory) {
        await memory.storeInteraction(session, 'user', 'user', userInput);
        await memory.storeInteraction(session, 'user', 'assistant', message);
      }

      res.json({
        success: true,
        sessionId: session,
        message: message,
        modifiedCount: result.modifiedCount,
        matchedCount: result.matched
      });
    } else {
      throw new Error(result.error || 'Update failed');
    }
  } catch (error) {
    console.error(`[Update Error] ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get session history
app.get('/api/agent/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await memory.getSessionHistory(sessionId, 50);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear session
app.delete('/api/agent/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await memory.clearSession(sessionId);
    res.json({ success: true, message: "Session cleared" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    agent: 'ready',
    database: db ? 'connected' : 'disconnected'
  });
});

// Catch-all route - serve frontend for any non-API routes (MUST be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// --- START SERVER ---
app.listen(port, () => {
  console.log(`🤖 QueryChain AI Agent Backend listening on http://localhost:${port}`);
});

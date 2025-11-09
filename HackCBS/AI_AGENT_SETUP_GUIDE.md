# 🤖 AI Agent System - Complete Setup Guide

You now have a **full AI Agent backend** based on MongoDB's agent architecture! This is way more powerful than the
previous system.

---

## 🎉 What's New?

### **AI Agent Features:**

1. **5 Intelligent Tools:**
    - 🔍 **Vector Search** - Semantic search for people, roles, companies
    - 📊 **Database Query** - Structured queries with filters
    - ✏️ **Update Database** - Safe updates with validation
    - 🧮 **Calculator** - Math calculations
    - 📈 **Aggregation** - Statistics and grouping

2. **Smart Planning:**
    - Agent automatically selects the best tool for your query
    - Understands context from conversation history
    - Generates natural language responses

3. **Memory System:**
    - Remembers your conversation across messages
    - Stores all interactions in MongoDB
    - Uses session IDs for continuity

4. **Autonomous Execution:**
    - Agent reasons through complex tasks
    - Chains multiple operations if needed
    - Self-corrects based on results

---

## 🚀 How to Run

### **Option 1: Run Locally (Development)**

#### **1. Start the AI Agent Backend**

```bash
cd /Users/aryanbaglane/Developer/HackCBS
node ai_agent_backend.js
```

Should see:

```
✅ Connected to MongoDB!
🤖 QueryChain AI Agent Backend listening on http://localhost:3002
```

#### **2. Start the React Frontend**

```bash
cd frontend
npm run dev
```

Opens at: `http://localhost:5173`

#### **3. Test the Agent**

Try these queries:

- "Find people with CTC > 50"
- "What is 123 + 456?"
- "Tell me about John Doe"
- "Average CTC by branch"
- "Change John's CTC to 70"

---

### **Option 2: Deploy to Production (Render)**

#### **1. Update Frontend Config**

Edit `frontend/src/config.js`:

```javascript
return 'https://your-ai-agent-backend.onrender.com'; // Line 14
```

#### **2. Deploy AI Agent Backend**

Push to GitHub:

```bash
git add .
git commit -m "Add AI Agent backend"
git push origin main
```

On Render:

1. Create **new Web Service** (separate from old backend)
2. Name: `querychain-ai-agent`
3. Start Command: `node ai_agent_backend.js`
4. Environment variables:
    - `GEMINI_API_KEY`
    - `MONGODB_URI`
    - `NODE_ENV=production`

#### **3. Deploy Frontend**

Same process as before - it will automatically use the new agent endpoint!

---

## 📊 API Endpoints

### **Main Agent Endpoint**

```http
POST /api/agent
```

**Request:**

```json
{
  "userInput": "Find people with CTC > 50",
  "sessionId": "session_12345",
  "userId": "user_001"
}
```

**Response:**

```json
{
  "success": true,
  "sessionId": "session_12345",
  "answer": "I found 5 people with CTC greater than 50...",
  "toolUsed": "database_query",
  "toolResult": {
    "success": true,
    "data": [...],
    "count": 5
  },
  "confidence": 0.9
}
```

### **Get Session History**

```http
GET /api/agent/history/:sessionId
```

### **Clear Session**

```http
DELETE /api/agent/session/:sessionId
```

### **Health Check**

```http
GET /api/health
```

---

## 🎯 Example Queries

### **Vector Search (Semantic)**

```
"Tell me about John Doe"
"Who works at Google?"
"Find software engineers"
```

### **Database Query (Structured)**

```
"Find people with CTC > 50"
"Show me CO branch people"
"List managers with CGPA > 8"
```

### **Calculator**

```
"What is 123 + 456?"
"Calculate 20% of 500"
"(100 + 50) * 2"
```

### **Aggregation (Analytics)**

```
"Average CTC by branch"
"Count people per company"
"Total employees in each role"
```

### **Updates**

```
"Change John Doe's CTC to 70"
"Update Jane Smith's branch to IT"
"Set Sarah's role to Manager"
```

---

## 🧠 How the Agent Works

```
User Query: "Find people with CTC > 50"
          ↓
1. MEMORY: Agent retrieves conversation history
          ↓
2. PLANNING: Agent selects best tool (database_query)
          ↓
3. TOOL EXECUTION: Runs MongoDB query
          ↓
4. RESPONSE GENERATION: Creates natural language answer
          ↓
5. MEMORY STORAGE: Saves interaction for future reference
          ↓
Response: "I found 5 people with CTC greater than 50..."
```

---

## 🆚 Old vs New System

| Feature | Old System | New AI Agent |
|---------|------------|--------------|
| **Tools** | 2 (Query, Update) | 5 (Query, Vector Search, Update, Calculator, Aggregation) |
| **Intelligence** | Fixed paths | Autonomous planning |
| **Memory** | None | Full session memory |
| **Flexibility** | Limited | Handles any type of query |
| **Context** | No context | Remembers conversation |
| **Natural Language** | Basic | Advanced understanding |

---

## 🔧 Architecture

```
Frontend (React)
    ↓
API Gateway (/api/agent)
    ↓
Agent Planner
    ├── Memory (Session history)
    ├── Tool Selector (LLM-based)
    └── Response Generator
    ↓
Agent Tools
    ├── Vector Search Tool
    ├── Database Query Tool
    ├── Update Database Tool
    ├── Calculator Tool
    └── Aggregation Tool
    ↓
MongoDB
    ├── Data Collections (managers, employees)
    └── Memory Collection (AgentMemory)
```

---

## 📝 Key Files

| File | Purpose |
|------|---------|
| `ai_agent_backend.js` | Main AI Agent backend (NEW!) |
| `frontend/src/components/InputArea.jsx` | Updated to use agent endpoint |
| `frontend/src/components/Message.jsx` | Updated to display agent responses |
| `frontend/src/components/Sidebar.jsx` | Updated with new examples |

---

## ✅ Testing Checklist

After starting both servers, test:

### **Vector Search**

- [ ] "Tell me about [name]" - Returns person details
- [ ] "Who works at [company]?" - Finds employees

### **Database Query**

- [ ] "Find people with CTC > 50" - Returns filtered results
- [ ] "Show CO branch" - Returns branch-specific data

### **Calculator**

- [ ] "What is 123+456?" - Returns 579
- [ ] "Calculate 20% of 500" - Returns 100

### **Aggregation**

- [ ] "Average CTC by branch" - Returns statistics
- [ ] "Count per company" - Returns grouped counts

### **Updates**

- [ ] "Change [name]'s CTC to 70" - Updates record
- [ ] "Update [name]'s branch to IT" - Updates field

### **Memory**

- [ ] Ask follow-up questions - Agent remembers context
- [ ] "What did I just ask?" - Agent recalls previous query

---

## 🎊 What You Can Do Now

1. **Ask Any Question:**
    - Natural language queries
    - No need to specify query type
    - Agent figures it out!

2. **Do Calculations:**
    - Math operations inline
    - No separate calculator needed

3. **Get Analytics:**
    - Aggregations and statistics
    - Grouping and counting

4. **Update Records:**
    - Safe, validated updates
    - Automatic re-embedding

5. **Have Conversations:**
    - Agent remembers context
    - Follow-up questions work
    - Natural dialogue flow

---

## 🚀 Quick Start Commands

```bash
# Terminal 1: Start AI Agent Backend
node ai_agent_backend.js

# Terminal 2: Start Frontend
cd frontend && npm run dev

# Open browser
http://localhost:5173

# Try these:
# - "Find people with CTC > 50"
# - "What is 100+200?"
# - "Average CTC by branch"
```

---

## 🆘 Troubleshooting

### **Agent not responding?**

- Check backend is running on port 3002
- Verify MongoDB connection
- Check GEMINI_API_KEY is set

### **Tools failing?**

- Vector search: Ensure embeddings exist in MongoDB
- Database query: Check collection exists
- Updates: Ensure specific filters (names)

### **Memory not working?**

- Check AgentMemory collection exists
- Verify sessionId is being sent
- Check localStorage for session ID

---

## 📚 Next Steps

1. **Add More Tools:**
    - Web search tool
    - Email sender tool
    - Report generator tool

2. **Improve Planning:**
    - Multi-step reasoning
    - Chain of thought
    - Self-correction loops

3. **Enhanced Memory:**
    - Long-term memory
    - Semantic memory search
    - User preferences storage

4. **Multi-Agent:**
    - Specialized agents
    - Agent collaboration
    - Task delegation

---

**Your AI Agent is ready to use! 🤖✨**

This is a production-grade AI agent system based on MongoDB's official architecture!

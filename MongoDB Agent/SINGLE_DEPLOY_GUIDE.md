# 🚀 Single Deployment Guide for Render

## ✅ One URL for Everything!

Your QueryChain AI is now configured to deploy as a **single service** on Render. Both frontend and backend will be
accessible from **ONE URL**.

---

## 🎯 What Changed

### **Before:**

- ❌ Two separate deployments
- ❌ Backend: `https://backend.onrender.com`
- ❌ Frontend: `https://frontend.onrender.com`
- ❌ CORS issues
- ❌ Two services to manage

### **After:**

- ✅ **ONE deployment**
- ✅ **ONE URL**: `https://your-app.onrender.com`
- ✅ Frontend served from root: `/`
- ✅ Backend API at: `/api/*`
- ✅ No CORS issues
- ✅ Simple to manage

---

## 📁 Project Structure

```
HackCBS/
├── ai_agent_backend.js       ← Backend server (serves both API + static files)
├── frontend/
│   ├── dist/                 ← Built frontend (created by npm run build)
│   │   ├── index.html
│   │   └── assets/
│   ├── src/
│   │   ├── config.js        ← Auto-detects API URL
│   │   └── components/
│   └── package.json
├── package.json              ← Root package.json
├── render.yaml               ← Single service configuration
└── .env                      ← Environment variables
```

---

## 🚀 Deploy to Render - Step by Step

### **Step 1: Push to GitHub**

```bash
# Make sure everything is committed
git add .
git commit -m "Configure for single Render deployment"
git push origin main
```

### **Step 2: Create Web Service on Render**

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository

### **Step 3: Configure the Service**

| Setting | Value |
|---------|-------|
| **Name** | `querychain-ai` (or your choice) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | Leave empty (use root) |
| **Environment** | `Node` |
| **Build Command** | `npm install && cd frontend && npm install && npm run build && cd ..` |
| **Start Command** | `node ai_agent_backend.js` |

### **Step 4: Add Environment Variables**

Click **"Advanced"** → **"Add Environment Variable"**

Add these 3 variables:

```
Key: GEMINI_API_KEY
Value: AIzaSyA6TPCplnfQYywzG0aUlPd_1Yrq7ou06JU

Key: MONGODB_URI
Value: mongodb+srv://sudhanshus7907_db_user:PO45IOdVujb2vw6h@cluster0.b5wxlty.mongodb.net/Employees?appName=Cluster0

Key: NODE_ENV
Value: production
```

### **Step 5: Deploy!**

Click **"Create Web Service"**

Render will:

1. Install root dependencies
2. Build the frontend
3. Start the backend server
4. Serve frontend from backend

**Wait 3-5 minutes for deployment...**

---

## 🌐 Access Your App

After deployment, you'll get ONE URL:

```
https://querychain-ai-xxxx.onrender.com
```

### **What's Available:**

| URL | What It Serves |
|-----|----------------|
| `https://your-app.onrender.com` | Frontend UI (React app) |
| `https://your-app.onrender.com/api/agent` | AI Agent endpoint |
| `https://your-app.onrender.com/api/update` | Update endpoint |
| `https://your-app.onrender.com/api/health` | Health check |

---

## ✅ How It Works

### **Backend Serves Everything:**

```javascript
// Static files (frontend)
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// API routes
app.post('/api/agent', ...);
app.post('/api/update', ...);

// Catch-all for SPA (serves index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});
```

### **Frontend Auto-Detects API:**

```javascript
// config.js
if (localhost) {
  return 'http://localhost:3002';  // Development
} else {
  return window.location.origin;   // Production (same server!)
}
```

---

## 🧪 Test After Deployment

### **1. Visit Your App**

```
https://your-app.onrender.com
```

Should show: Beautiful React UI ✅

### **2. Test Query Mode**

- Try: "Find people with CTC > 50"
- Should show: Data table with results ✅

### **3. Test Update Mode**

- Click: "✏️ Update Mode"
- Try: "Change CTC for John Doe to 80"
- Should show: Update summary ✅

### **4. Check API Directly**

```bash
curl https://your-app.onrender.com/api/health
```

Should return: `{"status":"healthy"}` ✅

---

## 📊 Build Process

When Render deploys, it runs:

```bash
# 1. Install backend dependencies
npm install

# 2. Go to frontend and install
cd frontend
npm install

# 3. Build frontend (creates dist/)
npm run build

# 4. Go back to root
cd ..

# 5. Start server (serves API + static files)
node ai_agent_backend.js
```

---

## 🎯 Advantages of Single Deployment

✅ **One URL** - Easy to share and remember  
✅ **No CORS** - Frontend and API on same origin  
✅ **Simpler** - One service to manage  
✅ **Cheaper** - One service = one bill  
✅ **Faster** - No cross-origin requests  
✅ **SSL** - One certificate for everything

---

## 🔧 Local Development

### **Development Mode** (separate servers):

```bash
# Terminal 1: Backend
node ai_agent_backend.js

# Terminal 2: Frontend (with hot reload)
cd frontend
npm run dev
```

### **Production Mode** (single server):

```bash
# Build frontend
cd frontend
npm run build
cd ..

# Start backend (serves both)
node ai_agent_backend.js

# Open: http://localhost:3002
```

---

## 📝 Files Modified for Single Deployment

### **Backend:**

- ✅ `ai_agent_backend.js` - Added static file serving
- ✅ Added catch-all route for SPA

### **Frontend:**

- ✅ `frontend/src/config.js` - Auto-detects API URL
- ✅ Built to `frontend/dist/`

### **Configuration:**

- ✅ `render.yaml` - Single service config
- ✅ Combined build command

---

## 🐛 Troubleshooting

### **Issue: Frontend not loading**

- Check build succeeded: `cd frontend && npm run build`
- Check dist folder exists: `ls frontend/dist/`
- Check backend is serving static files

### **Issue: API not working**

- Check environment variables are set in Render
- Check backend logs in Render dashboard
- Test health endpoint: `/api/health`

### **Issue: Build fails on Render**

- Check `frontend/package.json` exists
- Check all dependencies are listed
- Check Node version compatibility

---

## 🎊 Ready to Deploy!

Your app is now configured for **single deployment**!

### **Quick Deploy:**

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for single Render deployment"
git push

# 2. Create Web Service on Render
# 3. Add environment variables
# 4. Deploy!
```

**You'll get ONE URL that serves everything!** 🚀

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Deploying Node.js Apps](https://render.com/docs/deploy-node-express-app)
- [Environment Variables](https://render.com/docs/environment-variables)

---

**Your QueryChain AI is ready for single-URL deployment on Render!** ✅🎉

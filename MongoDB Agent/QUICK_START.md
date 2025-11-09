# ⚡ Quick Start Guide

Get QueryChain AI up and running in 5 minutes!

## 🚀 Local Development

### 1. Clone & Install

```bash
# If you haven't cloned yet
git clone https://github.com/YOUR_USERNAME/querychain-ai.git
cd querychain-ai

# Install dependencies
npm install
```

### 2. Set Up Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
PORT=3001
NODE_ENV=development
```

### 3. Start Backend

```bash
npm start
```

You should see:

```
Pinged your deployment. You successfully connected to MongoDB!
QueryChain AI Backend listening on http://localhost:3001
```

### 4. Open Frontend

Open `index.html` in your browser, or use a local server:

```bash
# Option 1: Direct open
open index.html

# Option 2: Python server
python3 -m http.server 8000
# Then visit: http://localhost:8000

# Option 3: Node http-server
npx http-server -p 8000
# Then visit: http://localhost:8000
```

### 5. Test It Out! 🎉

Click on example queries or try your own:

- "Find all managers with CTC greater than 50 LPA"
- "Tell me about Kangan Gupta"
- "Show me people in CO branch"

---

## 🌐 Deploy to Production

### Option A: Deploy to Render (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/querychain-ai.git
   git push -u origin main
   ```

2. **Deploy Backend:**
    - Go to https://render.com
    - New → Web Service
    - Connect GitHub repo
    - Add environment variables
    - Deploy!

3. **Deploy Frontend:**
    - New → Static Site
    - Connect same repo
    - Deploy!
    - Update `config.js` with backend URL

📚 **Detailed guide:** See [DEPLOYMENT.md](DEPLOYMENT.md)

### Option B: Deploy Frontend to GitHub Pages

1. **Update config.js** with your Render backend URL

2. **Enable GitHub Pages:**
    - Go to repo Settings → Pages
    - Select branch: `main`
    - Save

3. **Access at:**
   ```
   https://YOUR_USERNAME.github.io/querychain-ai
   ```

---

## 🔧 Troubleshooting

### Backend won't start?

```bash
# Check if port is in use
lsof -ti:3001

# Kill existing process
kill -9 <PID>

# Try again
npm start
```

### Can't connect to MongoDB?

- Check your connection string in `.env`
- Verify network access in MongoDB Atlas (allow 0.0.0.0/0)
- Test connection: `mongosh "YOUR_CONNECTION_STRING"`

### Frontend can't reach backend?

- Ensure backend is running (visit http://localhost:3001)
- Check browser console for errors
- Verify CORS is enabled in backend

### API Key issues?

- Get Gemini API key: https://makersuite.google.com/app/apikey
- Make sure it's in `.env` file
- Restart backend after adding key

---

## 📚 Next Steps

- ✅ **Local testing done?** → See [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md)
- 🚀 **Ready to deploy?** → See [DEPLOYMENT.md](DEPLOYMENT.md)
- 📖 **Want to customize?** → See [README.md](README.md)

---

## 🆘 Need Help?

- 📖 Check [README.md](README.md) for full documentation
- ✅ Review [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md)
- 🚀 Read [DEPLOYMENT.md](DEPLOYMENT.md) for deployment details

---

**Happy querying! 🎉**

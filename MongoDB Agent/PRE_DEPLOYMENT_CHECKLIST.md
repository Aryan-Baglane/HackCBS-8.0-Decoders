# Pre-Deployment Checklist ✅

Before deploying your QueryChain AI application, make sure you've completed all these steps:

## 📋 Prerequisites

- [ ] **Node.js installed** (v18 or higher)
  ```bash
  node --version  # Should be >= 18.0.0
  ```

- [ ] **Git installed**
  ```bash
  git --version
  ```

- [ ] **GitHub account created** at https://github.com

- [ ] **Render account created** at https://render.com

## 🔑 API Keys & Credentials

- [ ] **Gemini API Key obtained**
    - Get it from: https://makersuite.google.com/app/apikey
    - Test it works with a simple API call

- [ ] **MongoDB Atlas setup**
    - Database created: `Employees`
    - Collections created: `managers`, `Permissions`, `AuditLogs`
    - Vector Search Index created: `vectorIndex` on `managers.docEmbedding`
    - Connection string ready
    - Network access configured (allow connections from anywhere: 0.0.0.0/0)

## 📁 Files Check

- [ ] **All required files present:**
  ```
  ✓ gemini_backend.js
  ✓ index.html
  ✓ config.js
  ✓ package.json
  ✓ package-lock.json
  ✓ .gitignore
  ✓ .env.example
  ✓ README.md
  ✓ DEPLOYMENT.md
  ✓ render.yaml
  ```

- [ ] **No sensitive files in repository**
    - `.env` file is NOT added to Git
    - No API keys in code
    - No hardcoded passwords

## 🧪 Local Testing

- [ ] **Backend runs locally**
  ```bash
  node gemini_backend.js
  ```
    - Server starts on port 3001
    - MongoDB connection successful
    - No errors in console

- [ ] **Frontend works locally**
    - Open `index.html` in browser
    - Can connect to backend
    - Example queries work
    - No console errors

- [ ] **Test all features:**
    - [ ] Query mode works
    - [ ] Update mode works
    - [ ] Data displays correctly in tables
    - [ ] Error messages show properly
    - [ ] Confidence scores display

## 📝 Configuration

- [ ] **config.js updated**
    - Contains correct API_URL logic
    - Localhost URL for development
    - Production URL placeholder ready

- [ ] **CORS enabled in backend**
    - Check `gemini_backend.js` has CORS middleware
    - Allows requests from any origin (or your specific frontend URL)

- [ ] **Port configuration correct**
    - Backend uses `process.env.PORT || 3001`

## 🔐 Environment Variables

Create a `.env` file locally with:

```env
GEMINI_API_KEY=your_key_here
MONGODB_URI=your_connection_string_here
PORT=3001
NODE_ENV=development
```

- [ ] All variables set correctly
- [ ] Values work (test the app)
- [ ] Ready to add to Render (don't commit `.env`!)

## 🗂️ Git Repository

- [ ] **Repository initialized**
  ```bash
  git init
  ```

- [ ] **All files added**
  ```bash
  git add .
  ```

- [ ] **Initial commit made**
  ```bash
  git commit -m "Initial commit - QueryChain AI"
  ```

- [ ] **GitHub repository created**

- [ ] **Pushed to GitHub**
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/querychain-ai.git
  git branch -M main
  git push -u origin main
  ```

## 🚀 Ready for Render

- [ ] **Repository is public** (or Render has access to private repos)

- [ ] **Have environment variables ready to paste:**
    - GEMINI_API_KEY
    - MONGODB_URI
    - NODE_ENV
    - PORT

- [ ] **Know your backend URL format:**
    - Will be: `https://YOUR-SERVICE-NAME.onrender.com`
    - Ready to update `config.js` with this URL

## 📊 Database Ready

- [ ] **Sample data in MongoDB**
    - At least a few documents in `managers` collection
    - Documents have embeddings (`docEmbedding` field)

- [ ] **Permissions set up**
  ```json
  {
    "role": "Admin",
    "allowedCollections": ["*"]
  }
  ```

- [ ] **Vector Search Index created**
    - Index name: `vectorIndex`
    - Path: `docEmbedding`
    - Dimensions: 768
    - Similarity: cosine

## 🎨 Frontend Final Check

- [ ] **Example queries are relevant** to your data

- [ ] **Collection names match** your MongoDB collections

- [ ] **Branding updated** (if desired)
    - Title in `index.html`
    - Colors/theme (if customized)

## 📖 Documentation

- [ ] **README.md reviewed**
    - Instructions are clear
    - Links work
    - Examples match your setup

- [ ] **DEPLOYMENT.md reviewed**
    - Understand all steps
    - Have questions answered

## ✨ Final Steps

Once everything above is checked:

1. **Go to Render Dashboard**
2. **Follow DEPLOYMENT.md step by step**
3. **Test deployed application**
4. **Share your link!** 🎉

---

## 🆘 If Something's Not Working

- [ ] Check `.gitignore` includes `.env`
- [ ] Verify no `node_modules` committed to Git
- [ ] Ensure `package-lock.json` is committed
- [ ] Test backend API with curl/Postman
- [ ] Check browser console for frontend errors
- [ ] Review Render logs for backend errors

---

**Once all boxes are checked, you're ready to deploy! 🚀**

Proceed to [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

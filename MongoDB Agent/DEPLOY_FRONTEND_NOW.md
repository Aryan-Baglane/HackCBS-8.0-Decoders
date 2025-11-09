# 🚀 Deploy Frontend to Render - DO THIS NOW!

## Your Backend URL

First, you need to know your **actual** backend URL from Render.

### Find Your Backend URL:

1. Go to https://dashboard.render.com
2. Click on your backend service (e.g., "querychain-backend")
3. Copy the URL at the top (looks like: `https://querychain-backend-XXXX.onrender.com`)

### Update Config (If Needed):

If your backend URL is **NOT** exactly `https://querychain-backend.onrender.com`, update it:

```bash
# Edit frontend/src/config.js line 14
# Change: return 'https://querychain-backend.onrender.com';
# To: return 'https://YOUR-ACTUAL-BACKEND-URL.onrender.com';
```

---

## 🎯 Deploy Frontend - Follow These Exact Steps

### Step 1: Go to Render Dashboard

Open this link: https://dashboard.render.com/

### Step 2: Create New Static Site

Click the **"New +"** button (top right) → Select **"Static Site"**

### Step 3: Connect Repository

- If asked, connect your GitHub account
- Select your repository: **"HackCBS"** (or whatever you named it)
- Click **"Connect"**

### Step 4: Configure Static Site

Fill in these **EXACT** values:

| Field | Value to Enter |
|-------|----------------|
| **Name** | `querychain-frontend` |
| **Branch** | `main` |
| **Root Directory** | `frontend` ⚠️ IMPORTANT! |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Auto-Deploy** | Yes (leave checked) |

⚠️ **CRITICAL:** Make sure **Root Directory** is set to `frontend` (not blank!)

### Step 5: Create Static Site

Click the blue **"Create Static Site"** button at the bottom

### Step 6: Wait for Deployment

- You'll see build logs streaming
- Wait 2-3 minutes
- Look for "Your site is live" message

### Step 7: Get Your URL

After deployment completes:

- Your frontend will be at: `https://querychain-frontend.onrender.com`
- Click the URL to visit your app!

---

## ✅ What You Should See

### At Backend URL (`https://querychain-backend-xxx.onrender.com`):

```
QueryChain AI Backend is running.
```

This is CORRECT! ✅ Don't visit this URL for the app.

### At Frontend URL (`https://querychain-frontend.onrender.com`):

- Purple gradient background ✅
- "🔮 QueryChain AI" title ✅
- Sidebar with example queries ✅
- Chat interface ✅

---

## 🧪 Test Your Deployment

1. **Visit frontend URL** (NOT backend URL!)
2. **Click an example query** (e.g., "Find managers with CTC > 50 LPA")
3. **Should see:**
    - Loading spinner appears
    - Results display in a table
    - No errors in browser console (F12)

---

## 🐛 Troubleshooting

### Problem: Build fails with "Cannot find module"

**Solution:** Make sure "Root Directory" is set to `frontend`

### Problem: Page loads but can't connect to backend

**Solution:**

1. Check backend URL in `frontend/src/config.js` line 14
2. Make sure backend is running (visit backend URL directly)
3. Check browser console for actual error

### Problem: Getting 404 errors

**Solution:** This is already configured in `render.yaml` - should work automatically

### Problem: CORS errors

**Solution:** Backend already has CORS enabled ✅ Should work!

---

## 📊 Summary of Your Setup

After deployment you'll have:

```
┌────────────────────────────────────────────┐
│  FRONTEND (Static Site)                    │
│  https://querychain-frontend.onrender.com  │  ← Users visit THIS
│  - Shows beautiful React UI                │
│  - Users interact with this                │
│                                             │
│  ↓ Makes API calls to ↓                    │
│                                             │
│  BACKEND (Web Service)                     │
│  https://querychain-backend.onrender.com   │  ← Hidden API
│  - Processes queries                       │
│  - Talks to MongoDB                        │
│  - Returns data                            │
└─────────────��──────────────────────────────┘
```

---

## 🎉 Done!

Once you complete these steps:

- ✅ Frontend deployed on Render
- ✅ Beautiful UI accessible to everyone
- ✅ Connected to your backend
- ✅ Full-stack app is live!

**Share your frontend URL with others to show them your project! 🚀**

---

## ⚡ Alternative: Deploy to Vercel (Faster!)

If Render is too slow or you want instant deployment:

```bash
cd frontend
npm install -g vercel
vercel
```

Follow the prompts, and you'll have it deployed in 30 seconds!

---

**Need help?** The detailed guide is in `frontend/DEPLOYMENT.md`

**Ready?** Go to https://dashboard.render.com and follow Step 1-7 above! 🎯

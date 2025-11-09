# ✅ Frontend Deployment Checklist

Follow this checklist to deploy your React frontend to Render.

---

## 📋 Pre-Deployment

- [ ] **Backend is deployed** on Render
- [ ] **Know your backend URL** (e.g., `https://querychain-backend-xxx.onrender.com`)
- [ ] **Code is pushed** to GitHub (`git push origin main`)
- [ ] **Build works locally** (`cd frontend && npm run build` ✅ Already tested!)

---

## 🚀 Deployment Steps

### [ ] Step 1: Open Render Dashboard

Go to: https://dashboard.render.com/

### [ ] Step 2: Create Static Site

Click **"New +"** → **"Static Site"**

### [ ] Step 3: Connect GitHub

- Connect your GitHub account (if not already)
- Select repository: **HackCBS** (or your repo name)

### [ ] Step 4: Configure Settings

Enter these EXACT values:

```
Name: querychain-frontend
Branch: main
Root Directory: frontend        ⚠️ CRITICAL!
Build Command: npm install && npm run build
Publish Directory: dist
```

### [ ] Step 5: Create

Click **"Create Static Site"** button

### [ ] Step 6: Wait

Wait 2-3 minutes for build to complete

### [ ] Step 7: Get URL

Copy your frontend URL: `https://querychain-frontend.onrender.com`

---

## ✅ Testing

### [ ] Test 1: Frontend Loads

- [ ] Visit frontend URL
- [ ] See purple gradient background
- [ ] See "🔮 QueryChain AI" title
- [ ] See sidebar with examples
- [ ] No errors in console (F12)

### [ ] Test 2: Backend Connection

- [ ] Click an example query
- [ ] See loading spinner
- [ ] See results in table
- [ ] No CORS errors

### [ ] Test 3: All Features

- [ ] Query mode works
- [ ] Update mode works
- [ ] Enter key works
- [ ] Tables display correctly

---

## 🎊 Success!

If all checkboxes above are checked, you're done!

**Your URLs:**

- Frontend: `https://querychain-frontend.onrender.com` ← Share this!
- Backend: `https://querychain-backend.onrender.com` ← API only

---

## 🐛 Having Issues?

| Issue | Solution |
|-------|----------|
| Build fails | Check "Root Directory" = `frontend` |
| Can't connect to backend | Update `frontend/src/config.js` with correct backend URL |
| 404 errors | Already configured - should work |
| CORS errors | Already configured - should work |

---

## ⚡ Quick Alternative: Vercel

Too slow on Render? Deploy to Vercel instead:

```bash
cd frontend
npm install -g vercel
vercel
```

Done in 30 seconds! 🚀

---

**Ready to deploy?** Start with Step 1 above!

# 🚀 Frontend Deployment Guide

Complete guide to deploy QueryChain AI React frontend to various platforms.

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] Backend is deployed and you have the URL
- [ ] You've tested the app locally (`npm run dev`)
- [ ] All dependencies are installed (`npm install`)
- [ ] The app builds successfully (`npm run build`)
- [ ] Backend URL is updated in `src/config.js`

---

## 🎯 Option 1: Deploy to Render (Recommended)

### Step 1: Update Backend URL

Edit `src/config.js` and update line 14 with your actual backend URL:

```javascript
// Priority 3: Production - UPDATE THIS with your Render backend URL
return 'https://YOUR-ACTUAL-BACKEND-URL.onrender.com';
```

### Step 2: Push to GitHub

```bash
# From the root directory (not frontend)
git add .
git commit -m "Add React frontend ready for deployment"
git push origin main
```

### Step 3: Create Render Static Site

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `querychain-frontend` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

5. Click **"Create Static Site"**
6. Wait 2-5 minutes for deployment

### Step 4: Get Your URL

Your frontend will be live at:

```
https://querychain-frontend.onrender.com
```

### Step 5: Test

Visit your URL and try:

- Clicking example queries
- Typing custom queries
- Both Query and Update modes

---

## 🎯 Option 2: Deploy to Vercel (Fastest)

### Why Vercel?

- ⚡ Fastest deployment (< 1 minute)
- 🆓 Free forever for personal projects
- 🔄 Automatic deployments on push
- 🌐 Global CDN

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Update Backend URL** in `src/config.js`

3. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow the prompts:**
    - Setup and deploy? **Y**
    - Which scope? Select your account
    - Link to existing project? **N**
    - Project name? `querychain-frontend` (or custom)
    - Directory? `./` (current)
    - Override build settings? **N**

5. **Done!** Your URL: `https://querychain-frontend.vercel.app`

### For Production:

```bash
vercel --prod
```

---

## 🎯 Option 3: Deploy to Netlify

### Steps:

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Update Backend URL** in `src/config.js`

3. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

4. **Deploy**
   ```bash
   netlify deploy
   ```

5. **Follow prompts:**
    - Create & configure a new site? **Y**
    - Team? Select your team
    - Site name? `querychain-frontend` (or custom)
    - Publish directory? `dist`

6. **Deploy to production:**
   ```bash
   netlify deploy --prod
   ```

7. **Your URL:** `https://querychain-frontend.netlify.app`

---

## 🎯 Option 4: GitHub Pages (Free, but needs configuration)

### Steps:

1. **Install gh-pages**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. **Update package.json**

   Add these fields:
   ```json
   {
     "homepage": "https://YOUR_USERNAME.github.io/querychain-ai",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.js**

   Add base path:
   ```javascript
   export default defineConfig({
     base: '/querychain-ai/',  // Your repo name
     plugins: [react()],
     // ... rest
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
    - Go to repo Settings → Pages
    - Source: `gh-pages` branch
    - Save

6. **Your URL:** `https://YOUR_USERNAME.github.io/querychain-ai`

---

## ⚙️ Environment Variables (Optional)

### For Render:

Add environment variable in Render dashboard:

- Key: `VITE_API_URL`
- Value: `https://your-backend-url.onrender.com`

### For Vercel:

```bash
vercel env add VITE_API_URL
# Enter value: https://your-backend-url.onrender.com
```

### For Netlify:

In Netlify dashboard:

- Site settings → Environment variables
- Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`

---

## 🔧 Important Configuration

### Update Backend URL

**Method 1: Edit config.js (Recommended)**

```javascript
// frontend/src/config.js
return 'https://your-actual-backend-url.onrender.com';
```

**Method 2: Use Environment Variable**

Create `.env.production`:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## ✅ Post-Deployment Testing

### 1. Check Frontend Loads

Visit your deployed URL and verify:

- [ ] Page loads without errors
- [ ] Purple gradient background visible
- [ ] Sidebar shows example queries
- [ ] Chat area displays empty state

### 2. Check Browser Console

Open DevTools (F12) → Console:

- [ ] No errors shown
- [ ] No CORS errors

### 3. Test Backend Connection

Click an example query:

- [ ] Loading spinner appears
- [ ] Response displays correctly
- [ ] No connection errors

### 4. Test All Features

- [ ] Query mode works
- [ ] Update mode works
- [ ] Manual input works
- [ ] Enter key works
- [ ] Data tables render
- [ ] Confidence badges show

---

## 🐛 Troubleshooting

### ❌ Build Fails

```bash
# Clear everything and rebuild
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

### ❌ CORS Errors

**Symptom:**

```
Access to XMLHttpRequest at 'https://backend...' from origin 'https://frontend...' 
has been blocked by CORS policy
```

**Solution:** Backend CORS is already configured ✅
But verify in `gemini_backend.js`:

```javascript
res.header('Access-Control-Allow-Origin', '*');
```

### ❌ Connection Refused

**Symptom:** `ERR_CONNECTION_REFUSED` or `Network Error`

**Check:**

1. Is backend running? Visit backend URL directly
2. Is backend URL correct in `config.js`?
3. Check browser console for actual URL being called

### ❌ 404 on Refresh

**Symptom:** Refreshing page shows 404

**Solution:** This is already fixed in our configs:

- `render.yaml` has rewrite rules ✅
- `vercel.json` has rewrite rules ✅
- `netlify.toml` has redirect rules ✅

---

## 📊 Deployment Comparison

| Platform | Speed | Cost | Setup | Auto-Deploy | CDN |
|----------|-------|------|-------|-------------|-----|
| **Vercel** | ⚡⚡⚡ | Free | Easy | Yes | Global |
| **Netlify** | ⚡⚡ | Free | Easy | Yes | Global |
| **Render** | ⚡ | Free | Medium | Yes | Regional |
| **GitHub Pages** | ⚡ | Free | Hard | Manual | GitHub |

**Recommendation:** Use **Vercel** for fastest deployment and best DX.

---

## 🚀 Quick Deploy Commands

### Vercel (Fastest - 1 minute)

```bash
cd frontend
npm install -g vercel
vercel
```

### Netlify

```bash
cd frontend
npm install -g netlify-cli
netlify deploy --prod
```

### Render

Push to GitHub → Create Static Site on Render dashboard

---

## 📝 Full Deployment Example

```bash
# 1. Update backend URL
# Edit frontend/src/config.js line 14

# 2. Test build locally
cd frontend
npm install
npm run build

# 3. Test built version
npm run preview
# Visit http://localhost:4173 and test

# 4. Deploy to Vercel (recommended)
vercel

# 5. Done! 🎉
```

---

## 🎊 After Deployment

1. **Share your links:**
    - Backend: `https://querychain-backend.onrender.com`
    - Frontend: `https://querychain-frontend.vercel.app`

2. **Update documentation** with actual URLs

3. **Test end-to-end** functionality

4. **Monitor logs** for any issues

---

## 📚 Additional Resources

- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Render Static Sites](https://render.com/docs/static-sites)

---

**🎉 Your React frontend is ready to deploy!**

Choose your platform and follow the steps above. Vercel is recommended for the fastest and easiest deployment.

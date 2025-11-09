# Deployment Guide for Render

This guide will help you deploy QueryChain AI to Render.

## Prerequisites

- GitHub account
- Render account (sign up at https://render.com)
- Gemini API Key
- MongoDB Atlas connection string

## Step 1: Prepare Your Repository

### 1.1 Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit - QueryChain AI"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `querychain-ai`)
3. Do NOT initialize with README (we already have one)

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/querychain-ai.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Render

### 2.1 Create New Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `querychain-ai` repository

### 2.2 Configure Web Service

Fill in the following settings:

- **Name**: `querychain-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node gemini_backend.js`
- **Instance Type**: `Free` (or upgrade as needed)

### 2.3 Add Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | Your Gemini API key |
| `MONGODB_URI` | Your MongoDB connection string |
| `NODE_ENV` | `production` |
| `PORT` | `3001` |

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Note your service URL: `https://querychain-backend.onrender.com` (or similar)

## Step 3: Deploy Frontend to Render (Static Site)

### 3.1 Update config.js

Before deploying the frontend, update `config.js` with your backend URL:

```javascript
const config = {
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3001'
        : 'https://YOUR-BACKEND-URL.onrender.com' // Replace with actual URL
};
```

Commit and push:

```bash
git add config.js
git commit -m "Update backend URL"
git push
```

### 3.2 Create Static Site

1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Select the `querychain-ai` repository

### 3.3 Configure Static Site

- **Name**: `querychain-frontend`
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Build Command**: Leave empty (or use `echo "No build needed"`)
- **Publish Directory**: `.` (current directory)

### 3.4 Deploy

1. Click **"Create Static Site"**
2. Wait for deployment
3. Your frontend will be available at: `https://querychain-frontend.onrender.com`

## Alternative: Deploy Frontend with GitHub Pages

### Option A: GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to **Pages** section
3. Select branch: `main`
4. Select folder: `/ (root)`
5. Click **Save**
6. Your site will be available at: `https://YOUR_USERNAME.github.io/querychain-ai`

## Step 4: Verify Deployment

### Test Backend

Visit your backend URL:

```
https://querychain-backend.onrender.com
```

You should see: "QueryChain AI Backend is running."

### Test API Endpoint

Use curl or Postman:

```bash
curl -X POST https://querychain-backend.onrender.com/api/hybrid-query \
  -H "Content-Type: application/json" \
  -d '{
    "userInput": "Find all managers with CTC greater than 50",
    "collectionName": "managers"
  }'
```

### Test Frontend

1. Visit your frontend URL
2. Try example queries
3. Check browser console for any errors

## Step 5: Custom Domain (Optional)

### For Backend:

1. Go to your web service settings on Render
2. Click **"Custom Domain"**
3. Add your domain (e.g., `api.yourdomai n.com`)
4. Update DNS records as instructed

### For Frontend:

1. Go to your static site settings
2. Click **"Custom Domain"**
3. Add your domain (e.g., `app.yourdomain.com`)
4. Update DNS records as instructed

## Important Notes

### Free Tier Limitations

- **Render Free Tier**: Services spin down after 15 minutes of inactivity
- **First request**: May take 30-60 seconds (cold start)
- **Consider upgrading** for production use

### CORS Configuration

The backend is already configured with CORS headers to accept requests from any origin. If you want to restrict it to
your frontend domain only:

```javascript
// In gemini_backend.js
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://your-frontend-url.onrender.com');
  // ... rest of CORS config
});
```

### Environment Variables Security

- Never commit `.env` file to Git
- Use Render's environment variables feature
- Rotate API keys regularly

## Troubleshooting

### Backend not starting?

Check logs in Render dashboard:

1. Go to your web service
2. Click **"Logs"** tab
3. Look for errors

Common issues:

- Missing environment variables
- MongoDB connection string incorrect
- Port configuration issues

### Frontend can't connect to backend?

1. Check browser console for CORS errors
2. Verify backend URL in `config.js` is correct
3. Ensure backend is running (visit the URL directly)
4. Check that CORS is properly configured

### Cold starts taking too long?

- Upgrade to paid tier on Render
- Consider using a cron job to ping your service every 10 minutes
- Use services like UptimeRobot to keep it alive

## Post-Deployment Checklist

- [ ] Backend is accessible
- [ ] API endpoints return correct responses
- [ ] Frontend loads properly
- [ ] Frontend can communicate with backend
- [ ] Example queries work
- [ ] Update queries work (if needed)
- [ ] MongoDB connection is stable
- [ ] Environment variables are set correctly
- [ ] Error handling works as expected

## Monitoring

### Render Metrics

Monitor your services in Render dashboard:

- CPU usage
- Memory usage
- Request count
- Error rate

### MongoDB Atlas

Monitor your database:

- Connection count
- Query performance
- Storage usage

## Updates and Maintenance

### To update your deployment:

```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push
```

Render will automatically detect changes and redeploy.

### Manual Redeploy

If needed, you can manually redeploy from Render dashboard:

1. Go to your service
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**

## Support

If you encounter issues:

- Check Render documentation: https://render.com/docs
- Check MongoDB Atlas docs: https://docs.atlas.mongodb.com
- Review application logs in Render dashboard

## Cost Optimization

### Free Tier Tips

- Use a single web service for backend
- Use GitHub Pages (free) for frontend instead of Render Static Site
- Monitor usage to stay within limits

### Paid Tier Benefits

- No cold starts
- Better performance
- More resources
- Custom domains included
- Priority support

---

**Congratulations! Your QueryChain AI is now deployed! 🚀**

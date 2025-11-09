# QueryChain AI - React Frontend

Modern React frontend for QueryChain AI natural language database query system.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure API URL (Optional)

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3001
```

Or update `src/config.js` directly with your backend URL.

### 3. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ChatArea.jsx
│   │   ├── Message.jsx
│   │   ├── ResultTable.jsx
│   │   └── InputArea.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── config.js
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Features

- ✨ Modern React with Hooks
- 🎯 Component-based architecture
- 🔄 Real-time API integration with Axios
- 💅 Beautiful gradient UI with smooth animations
- 📱 Fully responsive design
- ⚡ Fast development with Vite
- 🚀 Optimized production builds

## 🔧 Configuration

### Backend API URL

The frontend automatically detects the environment:

- **Development** (localhost): Uses `http://localhost:3001`
- **Production**: Uses your deployed backend URL

Update `src/config.js` to change the production URL:

```javascript
const config = {
  API_URL: import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' 
      ? 'http://localhost:3001'
      : 'https://YOUR-BACKEND-URL.onrender.com') // Update this
};
```

## 📦 Deployment

### Deploy to Render

1. Update `config.js` with your backend URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder to Render Static Site

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 🛠️ Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **CSS3** - Styling

## 🔗 API Endpoints

The frontend communicates with these backend endpoints:

- `POST /api/hybrid-query` - Natural language queries
- `POST /api/update-query` - Database updates

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🎯 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | Auto-detected |

## 🚧 Troubleshooting

### Cannot connect to backend

1. Ensure backend is running on port 3001
2. Check CORS is enabled in backend
3. Verify API URL in `config.js`

### Build errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

---

**Built with ❤️ using React & Vite**

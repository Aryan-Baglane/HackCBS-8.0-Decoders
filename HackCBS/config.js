// Configuration for frontend
const config = {
    // Use environment variable if available, otherwise default to localhost
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3001'
        : 'https://querychain-backend.onrender.com' // Replace with your actual Render URL
};

// Make it available globally
window.APP_CONFIG = config;

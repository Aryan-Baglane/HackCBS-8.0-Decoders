// Configuration for API URL
const getApiUrl = () => {
  // Priority 1: Environment variable (for different deployments)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Priority 2: Check if we're on localhost (development)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3002';
  }
  
  // Priority 3: Production - same server (use relative path or current origin)
  return window.location.origin;
};

const config = {
  API_URL: getApiUrl()
};

window.APP_CONFIG = config;

export default config;

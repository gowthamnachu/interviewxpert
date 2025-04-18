const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production'
    ? '/.netlify/functions/api'  // Updated to use relative path
    : 'http://localhost:3001/api',
  isDevelopment: process.env.NODE_ENV === 'development'
};

export default config;

const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production'
    ? 'https://interviewxpert.netlify.app/.netlify/functions/api'  // Updated Netlify functions path
    : 'http://localhost:3001/api',
  isDevelopment: process.env.NODE_ENV === 'development'
};

export default config;

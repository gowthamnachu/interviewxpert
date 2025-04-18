const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production'
    ? 'https://interviewxpert.netlify.app/.netlify/functions/api'
    : 'http://localhost:3001/api'
};

export default config;

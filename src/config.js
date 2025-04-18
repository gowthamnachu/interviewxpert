const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production'
    ? 'https://interviewxpert.netlify.app/.netlify/functions/api'
    : 'http://localhost:3001/api',
  isDevelopment: process.env.NODE_ENV === 'development',
  netlifyFunctionUrl: '/.netlify/functions/api'
};

export default config;

const config = {
  apiUrl: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001/api'
    : 'https://interviewxpert.netlify.app/.netlify/functions/api'
};

export default config;

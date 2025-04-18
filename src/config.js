const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  apiUrl: isDevelopment 
    ? 'http://localhost:3001/api'
    : '/.netlify/functions/api'
};

export default config;

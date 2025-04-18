const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  apiUrl: isDevelopment 
    ? 'http://localhost:3001/api'
    : process.env.REACT_APP_API_URL || '/.netlify/functions/api'
};

export default config;

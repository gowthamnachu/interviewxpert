const isDevelopment = process.env.NODE_ENV === 'development';
const isNetlify = process.env.REACT_APP_NETLIFY === 'true';

const config = {
  apiUrl: isDevelopment
    ? 'http://localhost:3001/api'
    : isNetlify
      ? '/.netlify/functions/api'
      : '/api',
  // Add other configuration options here
};

export { config };

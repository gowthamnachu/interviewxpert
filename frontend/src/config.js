const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  apiUrl: isDevelopment 
    ? 'http://localhost:3001/api'
    : '/api'  // Simplified URL that works with redirects
};

export default config;

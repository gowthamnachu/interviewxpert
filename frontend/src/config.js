const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  apiUrl: isDevelopment 
    ? 'http://localhost:5000/api'
    : '/api'  // Changed to relative path for production
};

export default config;

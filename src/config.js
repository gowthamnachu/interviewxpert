const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/.netlify/functions/api';  // Remove full URL to use relative path
  }
  return 'http://localhost:3001/api';
};

export const config = {
  apiUrl: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api' 
    : '/.netlify/functions/api'
};

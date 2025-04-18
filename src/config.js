const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://interviewxpert.netlify.app/.netlify/functions/api';
  }
  return 'http://localhost:3001/api';
};

export const config = {
  apiUrl: getApiUrl(),
  env: process.env.NODE_ENV || 'development'
};

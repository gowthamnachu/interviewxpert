const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://interviewxpertbackend.netlify.app/.netlify/functions/api';
  }
  return 'http://localhost:3001/api';
};

export const config = {
  apiUrl: getApiUrl(),
  env: process.env.NODE_ENV || 'development'
};

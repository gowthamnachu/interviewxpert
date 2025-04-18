const getApiUrl = () => {
  if (process.env.REACT_APP_ENV === 'production') {
    return 'https://interviewxpertbackend.netlify.app/.netlify/functions/api';
  }
  return 'http://localhost:3001/api';
};

const config = {
  apiUrl: getApiUrl(),
  env: process.env.REACT_APP_ENV || 'development'
};

export default config;

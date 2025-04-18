const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
};

export const config = {
  apiUrl: getApiUrl(),
  env: process.env.REACT_APP_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET
};

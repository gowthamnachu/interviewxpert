const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  apiUrl: isDevelopment 
    ? 'http://localhost:5000/api'
    : 'https://interviewxpert.vercel.app/api'
};

export default config;

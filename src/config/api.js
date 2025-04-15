const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://interviewxpert.vercel.app/api'
  : 'http://localhost:3001/api';

export default API_BASE_URL;

const getApiUrl = () => {
  // Check if running on Netlify
  const isNetlify = window.location.hostname.includes('netlify.app');
  
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001/api';
  }

  // For Netlify deployment
  return '/.netlify/functions/api';
};

export const config = {
  apiUrl: getApiUrl(),
  env: process.env.NODE_ENV || 'development',
  endpoints: {
    login: '/login',
    register: '/register',
    questions: '/questions',
    resume: '/resume',
    certificates: '/certificates',
    certificatesUser: '/certificates/user',
    verify: '/certificates/verify'
  }
};

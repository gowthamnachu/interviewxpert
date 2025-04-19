const getApiUrl = () => {
  // Check if running in development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001/api';
  }

  // For production/Netlify deployment - always use the Netlify functions path
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

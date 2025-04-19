const getApiUrl = () => {
  // Check if running on Netlify
  const isNetlify = Boolean(process.env.REACT_APP_NETLIFY || window.location.hostname.includes('netlify.app'));
  
  // Check if running in development
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    return 'http://localhost:3001/api';
  }

  // For production/Netlify
  if (isNetlify) {
    // Use relative path for Netlify functions
    return '/.netlify/functions/api';
  }

  // Fallback for other production environments
  return `${window.location.origin}/api`;
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
  },
  timeouts: {
    request: 30000, // 30 seconds
    session: 24 * 60 * 60 * 1000 // 24 hours
  },
  retryAttempts: 3
};

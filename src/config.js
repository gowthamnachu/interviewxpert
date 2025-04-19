const isDevelopment = process.env.NODE_ENV === 'development';
const isNetlify = !!process.env.REACT_APP_NETLIFY;

export const config = {
  apiUrl: isDevelopment 
    ? 'http://localhost:3001/api'
    : isNetlify 
      ? '/.netlify/functions/api'
      : `${window.location.origin}/api`,
  endpoints: {
    resume: '/resume',
    certificates: '/certificates',
    certificatesUser: '/certificates/user',
    login: '/login',
    register: '/register'
  }
};

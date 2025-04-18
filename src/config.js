const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  apiUrl: isDevelopment ? 'http://localhost:3001/api' : '/.netlify/functions/api',
  timeout: 30000, // 30 second timeout
  retryAttempts: 3,
  retryDelay: 1000, // 1 second between retries
  endpoints: {
    questions: '/questions',
    health: '/health'
  }
};

export const fetchWithRetry = async (url, options = {}, attempts = config.retryAttempts) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: config.timeout
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (attempts > 1) {
      await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      return fetchWithRetry(url, options, attempts - 1);
    }
    throw error;
  }
};

export default config;

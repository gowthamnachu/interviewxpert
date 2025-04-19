import { config } from '../config';

const apiService = {
  async request(endpoint, options = {}) {
    const url = `${config.apiUrl}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };

    const defaultOptions = {
      headers: defaultHeaders,
      timeout: config.timeouts.request,
      ...options
    };

    let attempts = 0;
    while (attempts < config.retryAttempts) {
      try {
        const response = await fetch(url, defaultOptions);
        
        // Handle 401 Unauthorized
        if (response.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }

        // Handle other error responses
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        attempts++;
        
        // Don't retry on authentication errors
        if (error.message.includes('Session expired')) {
          throw error;
        }

        // Only retry on network errors or 5xx server errors
        if (attempts === config.retryAttempts || 
            (!error.message.includes('Failed to fetch') && error.message.includes('status: 5'))) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }
  },

  // Authentication endpoints
  async login(credentials) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async register(userData) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Protected endpoints
  async getQuestions(domain) {
    return this.request(`/questions${domain ? `?domain=${domain}` : ''}`);
  },

  async getResume() {
    return this.request('/resume');
  },

  async saveResume(resumeData) {
    return this.request('/resume', {
      method: 'POST',
      body: JSON.stringify(resumeData)
    });
  },

  async updateResume(resumeData) {
    return this.request('/resume', {
      method: 'PUT',
      body: JSON.stringify(resumeData)
    });
  },

  async deleteResume() {
    return this.request('/resume', {
      method: 'DELETE'
    });
  },

  async getCertificates() {
    return this.request('/certificates/user');
  },

  async verifyCertificate(id) {
    return this.request(`/certificates/verify/${id}`);
  }
};

export default apiService;
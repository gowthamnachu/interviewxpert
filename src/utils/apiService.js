import { config } from '../config';

const apiService = {
  async request(endpoint, options = {}) {
    const url = `${config.apiUrl}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };

    const defaultOptions = {
      headers: defaultHeaders,
      credentials: 'include',
      ...options
    };

    let attempts = 0;
    while (attempts < (config.retryAttempts || 3)) {
      try {
        const response = await fetch(url, defaultOptions);
        
        // Check content type to handle HTML responses
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          console.error('Received HTML instead of JSON');
          throw new Error('Invalid server response format');
        }

        // Handle 401 Unauthorized
        if (response.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }

        // Try to parse response as JSON
        let errorData;
        let responseData;
        const text = await response.text();
        
        try {
          responseData = text ? JSON.parse(text) : {};
        } catch (e) {
          console.error('Failed to parse response:', text);
          throw new Error('Invalid JSON response from server');
        }

        // Handle error responses
        if (!response.ok) {
          throw new Error(responseData.error || `Request failed with status ${response.status}`);
        }

        return responseData;
      } catch (error) {
        attempts++;
        console.error(`API request failed (attempt ${attempts}):`, error);

        // Don't retry on authentication errors
        if (error.message.includes('Session expired')) {
          throw error;
        }

        // Don't retry on invalid JSON/HTML responses
        if (error.message.includes('Invalid JSON') || error.message.includes('Invalid server response format')) {
          throw new Error('Server returned an invalid response. Please try again later.');
        }

        // Only retry on network errors or 5xx server errors
        if (attempts === (config.retryAttempts || 3) || 
            (!error.message.includes('Failed to fetch') && !error.message.includes('status: 5'))) {
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
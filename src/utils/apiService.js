import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://interviewxpertbackend.netlify.app/.netlify/functions/api'
  : 'http://localhost:3001/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Auth
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),

  // Questions
  getQuestions: (domain) => api.get(`/questions?domain=${domain}`),
  
  // Resume
  getResume: () => api.get('/resume'),
  createResume: (data) => api.post('/resume', data),
  updateResume: (data) => api.put('/resume', data),
  deleteResume: () => api.delete('/resume'),
  
  // Certificates
  getCertificates: () => api.get('/certificates/user'),
  getCertificate: (id) => api.get(`/certificates/verify/${id}`),
  createCertificate: (data) => api.post('/certificates', data),
  deleteCertificate: (id) => api.delete(`/certificates/${id}`),
  
  // Mock Tests
  getMockQuestions: (domain) => api.get(`/mock-questions?domain=${domain}`),
  submitMockTest: (data) => api.post('/mock-test/submit', data),
  
  // Interview
  startInterview: (domain) => api.post('/interview/start', { domain }),
  submitInterview: (data) => api.post('/interview/submit', data)
};

export default apiService;

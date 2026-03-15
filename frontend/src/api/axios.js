import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Reject non-JSON responses (e.g. HTML fallback from Vercel)
api.interceptors.response.use((response) => {
  const ct = response.headers['content-type'] || '';
  if (!ct.includes('application/json')) {
    return Promise.reject(new Error('API returned non-JSON response'));
  }
  return response;
});

export default api;


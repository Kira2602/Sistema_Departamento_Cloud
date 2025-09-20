// frontend/src/services/api.js
import axios from 'axios';

// Usa VITE_API_URL si existe; si no, mismo dominio + /api (Vercel)
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.origin.replace(/\/$/, '')}/api`;

console.log('🔎 api baseURL =', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  console.log('➡️', (config.method || 'GET').toUpperCase(), config.baseURL + config.url);
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log('✅', res.status, res.config.url);
    return res;
  },
  (err) => {
    console.error('❌', err.response?.status, err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;

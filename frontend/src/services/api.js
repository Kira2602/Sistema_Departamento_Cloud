// src/services/api.js
import axios from 'axios';

// 1) Si definiste VITE_API_URL en tu .env o en Vercel, la usa.
// 2) Si no, usa el dominio actual del navegador + /api (funciona en Vercel Functions).
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.origin.replace(/\/$/, '')}/api`;

console.log('🔎 api baseURL =', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para log de requests
api.interceptors.request.use(
  (config) => {
    console.log(
      '➡️ Request:',
      (config.method || 'GET').toUpperCase(),
      config.baseURL + config.url
    );
    return config;
  },
  (error) => {
    console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para log de responses y errores
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en response:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default api;

// src/services/api.js
import axios from 'axios';

// Configuración base del API - funciona tanto en desarrollo como en producción
const API_BASE_URL = import.meta.env.PROD 
  ? '/api' // En producción (Vercel), usar ruta relativa
  : 'http://localhost:3000'; // En desarrollo, usar localhost sin /api

console.log('🔧 API configurada con URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para agregar headers básicos (sin autenticación)
api.interceptors.request.use(
  (config) => {
    console.log('� Request sin autenticación:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response exitosa:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error en response:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    return Promise.reject(error);
  }
);

export default api;
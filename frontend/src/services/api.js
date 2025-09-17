// src/services/api.js
import axios from 'axios';

// Configuración base del API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('🔧 API configurada con URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token agregado al request:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No hay token en localStorage');
    }
    console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
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
    
    if (error.response?.status === 401) {
      console.log('🔒 Token inválido o expirado - limpiando localStorage');
      // Token inválido o expirado
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Redirigir al login si es necesario
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
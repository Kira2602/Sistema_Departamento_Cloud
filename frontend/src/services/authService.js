// src/services/authService.js
import api from './api.js';

export const authService = {
  // Registro de usuario
  async signup(email, password, userData = {}) {
    const response = await api.post('/auth/signup', {
      email,
      password,
      data: userData
    });
    return response.data;
  },

  // Iniciar sesión
  async signin(email, password) {
    const response = await api.post('/auth/signin', {
      email,
      password
    });
    
    // Guardar token y usuario en localStorage
    if (response.data.session) {
      localStorage.setItem('access_token', response.data.session.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Cerrar sesión
  async signout() {
    try {
      await api.post('/auth/signout');
    } finally {
      // Limpiar localStorage independientemente de la respuesta
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const response = await api.get('/auth/user');
    return response.data;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  // Obtener usuario del localStorage
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default authService;
// src/services/profileService.js
import api from './api.js';

export const profileService = {
  // Obtener todos los perfiles
  async getAllProfiles() {
    const response = await api.get('/profiles');
    return response.data;
  },

  // Obtener mi perfil
  async getMyProfile() {
    const response = await api.get('/profiles/me');
    return response.data;
  },

  // Obtener perfil por user_id
  async getProfileByUserId(userId) {
    const response = await api.get(`/profiles/${userId}`);
    return response.data;
  },

  // Crear o actualizar perfil
  async createOrUpdateProfile(profileData) {
    const response = await api.post('/profiles', profileData);
    return response.data;
  },

  // Actualizar mi perfil
  async updateMyProfile(profileData) {
    const response = await api.put('/profiles', profileData);
    return response.data;
  }
};

export default profileService;
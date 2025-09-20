// src/services/cloudService.js
import api from './api.js';

export const cloudService = {
  // Obtener todos los recursos del usuario actual
  async getMyResources() {
    const response = await api.get('/cloud');
    return response.data;
  },

  // Obtener todos los recursos (sin autenticación)
  async getAllResources() {
    const response = await api.get('/cloud');
    return response.data;
  },

  // Obtener un recurso específico por ID
  async getResourceById(id) {
    const response = await api.get(`/cloud/${id}`); // <-- backticks
    return response.data;
  },

  // Crear un nuevo recurso
  async createResource(resourceData) {
    const response = await api.post('/cloud', resourceData);
    return response.data;
  },

  // Actualizar un recurso existente
  async updateResource(id, resourceData) {
    const response = await api.put(`/cloud/${id}`, resourceData); // <-- backticks
    return response.data;
  },

  // Eliminar un recurso
  async deleteResource(id) {
    console.log('🗑️ cloudService.deleteResource llamado con ID:', id);
    try {
      const response = await api.delete(`/cloud/${id}`); // <-- backticks
      console.log('✅ Respuesta exitosa del DELETE:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en cloudService.deleteResource:', error);
      if (error.response) {
        console.error('📄 Datos de respuesta de error:', error.response.data);
        console.error('🔢 Status de error:', error.response.status);
      }
      throw error;
    }
  }
};

export default cloudService;

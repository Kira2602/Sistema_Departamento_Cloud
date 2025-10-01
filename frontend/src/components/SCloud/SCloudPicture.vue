<!-- src/components/SCloud/SCloudPicture.vue -->
<template>
  <div class="scloud-picture">
    <div class="picture-container">
      <img 
        src="../../img/diagram0.jpeg"
        alt="Sistema de Registro de Dominios Diagram"
        class="diagram-image"
        @click="showPictureDetails"
      />
    </div>
    
    <!-- Picture Details Modal -->
    <div v-if="showModal" class="picture-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Sistema de Registro de Dominios</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <p>El sistema permite recibir solicitudes, validarlas y asignar dominios de acuerdo con normativas establecidas.</p>
          <p>Su función principal es transformar una solicitud de dominio en un dominio registrado y disponible para uso en Internet.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SCloudPicture',
  data() {
    return {
      showModal: false
    }
  },
  methods: {
    showPictureDetails() {
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    }
  }
}
</script>

<style scoped>
.scloud-picture {
  padding: 20px;
  text-align: center;
}

.picture-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.diagram-image {
  max-width: 100%;
  height: auto;
  cursor: pointer;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.diagram-image:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.picture-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: #f0f0f0;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #555;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .modal-header h3 {
    font-size: 1.2rem;
  }
  
  .modal-body {
    padding: 15px;
  }
}
</style>

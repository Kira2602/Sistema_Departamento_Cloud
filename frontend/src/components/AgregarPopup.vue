<template>
  <div class="profile-popup">
    <div class="popup-wrapper">
      <div class="popup-content">
        <!-- Botón de cerrar -->
        <button class="close-btn" @click="$emit('close')">×</button>

        <h2>Agregar Recurso Cloud</h2>

        <!-- Indicador de pasos -->
        <div class="steps-indicator">
          <span :class="{ active: step === 1 }">1</span>
          <span :class="{ active: step === 2 }">2</span>
          <span :class="{ active: step === 3 }">3</span>
        </div>

        <!-- Paso 1 -->
        <div v-if="step === 1">
          <form @submit.prevent="goToStep(2)">
            <div class="form-group">
              <label for="codigo">Código de recurso</label>
              <input id="codigo" v-model="form.codigo" type="text" required />
            </div>
            <div class="form-group">
              <label for="proveedor">Proveedor Cloud</label>
              <select id="proveedor" v-model="form.proveedor" required>
                <option value="">Selecciona...</option>
                <option>AWS</option>
                <option>Azure</option>
                <option>GCP</option>
              </select>
            </div>
            <div class="form-group">
              <label for="servicio">Servicio/Producto</label>
              <input id="servicio" v-model="form.servicio" type="text" placeholder="EC2, BigQuery, VM, etc." required />
            </div>
            <div class="form-group">
              <label for="id">ID de recurso</label>
              <input id="id" v-model="form.idRecurso" type="text" required />
            </div>
            <div class="button-group">
              <button type="submit" class="btn-edit">Siguiente</button>
            </div>
          </form>
        </div>

        <!-- Paso 2 -->
        <div v-else-if="step === 2">
          <form @submit.prevent="goToStep(3)">
            <div class="form-group">
              <label for="region">Región/Zona</label>
              <input id="region" v-model="form.region" type="text" required />
            </div>
            <div class="form-group">
              <label for="estado">Estado</label>
              <select id="estado" v-model="form.estado" required>
                <option value="">Selecciona...</option>
                <option>Activo</option>
                <option>Detenido</option>
                <option>Eliminado</option>
              </select>
            </div>
            <div class="form-group">
              <label for="responsable">Responsable</label>
              <input id="responsable" v-model="form.responsable" type="text" required />
            </div>
            <div class="form-group">
              <label for="costo">Costo mensual estimado</label>
              <input id="costo" v-model="form.costo" type="number" required />
            </div>
            <div class="button-group2">
              <button type="button" class="btn-edit" @click="goToStep(1)">Atrás</button>
              <button type="submit" class="btn-edit">Siguiente</button>
            </div>
          </form>
        </div>

        <!-- Paso 3 -->
        <div v-else-if="step === 3">
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="fechaInicio">Fecha de inicio</label>
              <input id="fechaInicio" v-model="form.fechaInicio" type="date" required />
            </div>
            <div class="form-group">
              <label for="fechaFin">Fecha fin de contrato</label>
              <input id="fechaFin" v-model="form.fechaFin" type="date" required />
            </div>
            <div class="form-group">
              <label for="garantia">Garantía</label>
              <input id="garantia" v-model="form.garantia" type="text" />
            </div>
            <div class="form-group">
              <label for="notas">Notas</label>
              <textarea id="notas" v-model="form.notas"></textarea>
            </div>
            <div class="button-group2">
              <button type="button" class="btn-edit" @click="goToStep(2)">Atrás</button>
              <button type="submit" class="btn-edit">Registrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "AgregarPopup",
  data() {
    return {
      step: 1,
      form: {
        codigo: "",
        proveedor: "",
        servicio: "",
        idRecurso: "",
        region: "",
        estado: "",
        responsable: "",
        costo: "",
        fechaInicio: "",
        fechaFin: "",
        garantia: "",
        notas: "",
      },
    };
  },
  methods: {
    goToStep(num) {
      this.step = num;
    },
    submitForm() {
      console.log("Formulario enviado:", this.form);

      // SweetAlert2 con colores personalizados
      Swal.fire({
        icon: "success",
        title: "Recurso registrado",
        text: "El recurso se ha registrado correctamente.",
        confirmButtonColor: "#e0c58f", // mismo color que los botones
        confirmButtonText: "Aceptar",
        background: "#fff7f7",
        color: "#3c507d",
      });

      this.$emit("close");
    },
  },
};
</script>

<style scoped>
/* === Igual que antes === */
.profile-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-wrapper {
  position: relative;
  width: 420px;
  max-height: 90vh;
}

.popup-content {
  background: #fff7f7;
  padding: 20px;
  border-radius: 15px;
  width: 100%;
  box-shadow: 0 0 40px -10px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

h2 {
  color: #3c507d;
  font-size: 20px;
  text-align: center;
  margin-bottom: 15px;
}

.steps-indicator {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 15px;
}
.steps-indicator span {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #3c507d;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #3c507d;
}
.steps-indicator span.active {
  background: #6d7da1;
  color: #fff;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.form-group label {
  font-size: 13px;
  color: #112250;
  margin-bottom: 4px;
  font-weight: bold;
}
.form-group input,
.form-group select,
.form-group textarea {
  font-size: 14px;
  padding: 8px;
  border: 2px solid #3c507d;
  border-radius: 8px;
  background-color: #f0f0f0;
  width: 100%;
  box-sizing: border-box;
}
textarea {
  resize: vertical;
}

.button-group,
.button-group2 {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}
.btn-edit {
  background-color: #e0c58f;
  color: #f5f0e9;
  border: none;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-edit:hover {
  background-color: #d9cbc2;
  color: #fff;
}
</style>

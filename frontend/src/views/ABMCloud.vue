<!-- src/views/ABMCloud.vue -->
<template>
  <div>
    <header>
      <NavbarComponent />
    </header>

    <!-- HERO compacto -->
    <section class="hero">
      <div class="hero-content">
        <h1>RECURSOS CLOUD</h1>
        <p class="hero-description">
          Administra y lleva el control de tus recursos en la nube con un seguimiento completo de costos, responsables y estados.
        </p>
      </div>

      <div class="lottie-container1 hero-lottie">
        <!-- Usa dotlottie-player para .lottie -->
        <dotlottie-player
          src="https://lottie.host/979f5ed5-33a0-4269-97cc-ab37bf745cae/LBEqcMWhbp.lottie"
          autoplay
          loop
          style="width: 200px; height: 200px"
        />
      </div>
    </section>

    <!-- TABLA DE RECURSOS -->
    <div class="historial-actividades">
      <div class="acciones">
        <button class="btn accion-btn" @click="isAgregarOpen = true">Agregar</button>

        <template v-if="!editMode">
          <button class="btn accion-btn" @click="onModificar">Modificar</button>
          <button class="btn accion-btn eliminar" @click="onEliminar">Eliminar</button>
        </template>

        <template v-else>
          <button class="btn accion-btn ok" @click="onGuardarCambios">Guardar</button>
          <button class="btn accion-btn cancelar" @click="onCancelarEdicion">Cancelar</button>
        </template>
      </div>

      <div class="tabla-actividades">
        <table>
          <thead>
            <tr>
              <th style="width:60px">Sel.</th>
              <th>Código de recurso</th>
              <th>Proveedor Cloud</th>
              <th>Servicio/Producto</th>
              <th>ID de recurso</th>
              <th>Región/Zona</th>
              <th>Estado</th>
              <th>Responsable</th>
              <th>Costo mensual estimado</th>
              <th>Fecha de inicio</th>
              <th>Fecha fin de contrato</th>
              <th>Garantía</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(r, idx) in recursos"
              :key="idx"
              :class="{ selected: selectedIndex === idx }"
              @click="selectedIndex = idx"
            >
              <td>
                <input
                  type="radio"
                  name="sel"
                  :checked="selectedIndex === idx"
                  @change="selectedIndex = idx"
                />
              </td>

              <template v-if="editMode && selectedIndex === idx">
                <td><input class="cell-input" v-model="editedRow.codigo" /></td>
                <td>
                  <select class="cell-input" v-model="editedRow.proveedor">
                    <option>AWS</option><option>Azure</option><option>GCP</option>
                  </select>
                </td>
                <td><input class="cell-input" v-model="editedRow.servicio" /></td>
                <td><input class="cell-input" v-model="editedRow.idRecurso" /></td>
                <td><input class="cell-input" v-model="editedRow.region" /></td>
                <td>
                  <select class="cell-input" v-model="editedRow.estado">
                    <option>Activo</option><option>Detenido</option><option>Eliminado</option>
                  </select>
                </td>
                <td><input class="cell-input" v-model="editedRow.responsable" /></td>
                <td><input class="cell-input" v-model="editedRow.costo" /></td>
                <td><input class="cell-input" type="date" v-model="editedRow.fechaInicio" /></td>
                <td><input class="cell-input" type="date" v-model="editedRow.fechaFin" /></td>
                <td><input class="cell-input" v-model="editedRow.garantia" /></td>
                <td><input class="cell-input" v-model="editedRow.notas" /></td>
              </template>

              <template v-else>
                <td>{{ r.codigo }}</td>
                <td>{{ r.proveedor }}</td>
                <td>{{ r.servicio }}</td>
                <td>{{ r.idRecurso }}</td>
                <td>{{ r.region }}</td>
                <td>{{ r.estado }}</td>
                <td>{{ r.responsable }}</td>
                <td>{{ r.costo }}</td>
                <td>{{ r.fechaInicio }}</td>
                <td>{{ r.fechaFin }}</td>
                <td>{{ r.garantia }}</td>
                <td>{{ r.notas }}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-container">
        <ul class="pagination">
          <li class="page-item disabled"><a class="page-link page-prev">«</a></li>
          <li class="page-item active"><a class="page-link">1</a></li>
          <li class="page-item"><a class="page-link">2</a></li>
          <li class="page-item"><a class="page-link">3</a></li>
          <li class="page-item"><a class="page-link page-next">»</a></li>
        </ul>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-content">
        <p>© 2024 Grupo CloudCare. Todos los derechos reservados.</p>
      </div>
    </footer>

    <AgregarPopup
      v-if="isAgregarOpen"
      @close="isAgregarOpen = false"
      @guardar="onAgregarRecurso"
    />
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import NavbarComponent from '@/components/NavbarComponent.vue'
import AgregarPopup from '@/components/AgregarPopup.vue'

export default {
  name: 'ABMCloud',
  components: { NavbarComponent, AgregarPopup },
  data() {
    return {
      isAgregarOpen: false,
      selectedIndex: null,
      editMode: false,
      editedRow: null,
      recursos: [
        { codigo: 'CR-001', proveedor: 'AWS', servicio: 'EC2', idRecurso: 'i-0abc123def456', region: 'us-east-1', estado: 'Activo', responsable: 'Juan Pérez', costo: '$120', fechaInicio: '2024-01-10', fechaFin: '2025-01-10', garantia: '1 año', notas: 'Servidor principal de pruebas' },
        { codigo: 'CR-002', proveedor: 'GCP', servicio: 'BigQuery', idRecurso: 'bq-789xyz', region: 'us-central1', estado: 'Activo', responsable: 'María López', costo: '$80', fechaInicio: '2023-07-01', fechaFin: '2024-07-01', garantia: '6 meses', notas: 'Dataset de analítica' },
        { codigo: 'CR-003', proveedor: 'Azure', servicio: 'VM', idRecurso: 'vm-123abc', region: 'eastus', estado: 'Detenido', responsable: 'Carlos Gómez', costo: '$50', fechaInicio: '2024-03-15', fechaFin: '2025-03-15', garantia: '2 años', notas: 'Servidor temporal' }
      ]
    }
  },
  mounted() {
    // Cargar el web-component de dotLottie si no existe aún
    if (!customElements.get('dotlottie-player')) {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.js'
      document.head.appendChild(s)
    }
  },
  methods: {
    onAgregarRecurso(nuevo) {
      this.recursos.unshift(nuevo)
      this.isAgregarOpen = false
      Swal.fire({
        icon: 'success',
        title: 'Recurso registrado',
        text: 'El recurso se ha agregado correctamente.',
        background: '#fff7f7',
        color: '#3c507d',
        confirmButtonColor: '#e0c58f',
        confirmButtonText: 'Aceptar'
      })
    },
    onModificar() {
      if (this.selectedIndex === null) {
        return Swal.fire({
          icon: 'info',
          title: 'Selecciona un registro',
          text: 'Por favor selecciona una fila para modificar.',
          background: '#fff7f7',
          color: '#3c507d',
          confirmButtonColor: '#e0c58f'
        })
      }
      this.editMode = true
      this.editedRow = { ...this.recursos[this.selectedIndex] }
    },
    onGuardarCambios() {
      const req = ['codigo', 'proveedor', 'servicio', 'idRecurso']
      const falta = req.find(k => !String(this.editedRow[k] || '').trim())
      if (falta) {
        return Swal.fire({
          icon: 'warning',
          title: 'Completa los campos',
          text: 'Revisa código, proveedor, servicio e ID de recurso.',
          background: '#fff7f7',
          color: '#3c507d',
          confirmButtonColor: '#e0c58f'
        })
      }
      this.recursos.splice(this.selectedIndex, 1, { ...this.editedRow })
      this.editMode = false
      this.editedRow = null
      Swal.fire({
        icon: 'success',
        title: 'Cambios guardados',
        text: 'El recurso fue actualizado correctamente.',
        background: '#fff7f7',
        color: '#3c507d',
        confirmButtonColor: '#e0c58f'
      })
    },
    onCancelarEdicion() {
      this.editMode = false
      this.editedRow = null
    },
    onEliminar() {
      if (this.selectedIndex === null) {
        return Swal.fire({
          icon: 'info',
          title: 'Selecciona un registro',
          text: 'Elige una fila para eliminar.',
          background: '#fff7f7',
          color: '#3c507d',
          confirmButtonColor: '#e0c58f'
        })
      }
      const fila = this.recursos[this.selectedIndex]
      Swal.fire({
        icon: 'warning',
        title: '¿Eliminar recurso?',
        html: `Se eliminará <b>${fila.codigo}</b> (${fila.proveedor} / ${fila.servicio}).`,
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: '#fff7f7',
        color: '#3c507d',
        confirmButtonColor: '#e0c58f',
        cancelButtonColor: '#a85350'
      }).then(res => {
        if (res.isConfirmed) {
          this.recursos.splice(this.selectedIndex, 1)
          this.selectedIndex = null
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El recurso fue eliminado correctamente.',
            background: '#fff7f7',
            color: '#3c507d',
            confirmButtonColor: '#e0c58f'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
* { font-family: 'Poppins', sans-serif; padding: 0; margin: 0; }
:global(body) { padding-top: 120px; }

/* Radio personalizado */
input[type="radio"]{
  appearance:none; -webkit-appearance:none; -moz-appearance:none;
  width:18px;height:18px;border:2px solid #3c507d;border-radius:50%;
  background:#fff;position:relative;cursor:pointer;transition:.2s;
}
input[type="radio"]:checked{background:#3c507d;border-color:#3c507d}
input[type="radio"]:checked::after{
  content:"";position:absolute;top:4px;left:4px;width:8px;height:8px;
  background:#fff;border-radius:50%;
}

/* HERO */
.hero{display:flex;align-items:center;background:#3c5070;padding:10px 20px;
  margin:0 auto 15px;border-radius:12px;margin-left:20px;margin-right:20px;min-height:150px}
.hero-content{flex:1;display:flex;flex-direction:column;align-items:flex-start;padding-left:30px}
.hero h1{font-size:2rem;color:#fff;margin:0}
.hero-description{font-size:.9rem;color:#fff;margin-top:6px}
.hero-lottie{display:flex;justify-content:flex-end;align-items:center;width:30%}

/* Contenedor */
.historial-actividades{background:#d9cbc2;padding:20px;border-radius:15px;max-width:1200px;margin:0 auto}

/* Botones */
.acciones{display:flex;gap:12px;margin-bottom:15px}
.accion-btn{padding:10px 20px;border:none;border-radius:8px;font-weight:600;cursor:pointer;transition:.2s}
.accion-btn:hover{opacity:.92}
.accion-btn{background:#849cc4;color:#252525}
.accion-btn.eliminar{background:#a85350;color:#fff}
.accion-btn.ok{background:#6aa972;color:#fff}
.accion-btn.cancelar{background:#b8b8b8;color:#333}

/* Tabla */
.tabla-actividades{overflow-x:auto;padding:20px;background:rgba(255,255,255,.85);border-radius:15px;box-shadow:0 4px 10px rgba(0,0,0,.1)}
table{width:100%;border-collapse:collapse;font-size:.9rem}
th,td{padding:10px;text-align:center;border-bottom:1px solid #4f6281}
th{background:#4f6281;color:#fff;font-weight:bold;white-space:nowrap}
tr:nth-child(even){background:#f9f9f9}
tr:hover{background:#f1f1f1}
tr.selected{outline:3px solid #3c5070;outline-offset:-3px}
.cell-input{width:100%;padding:6px 8px;border:2px solid #3c5070;border-radius:6px;background:#f0f0f0;font-size:.9rem;box-sizing:border-box}

/* Paginación */
.pagination-container{margin-top:20px;display:flex;justify-content:center;align-items:center;padding:10px 0}
.pagination{display:flex;list-style:none;padding:0}
.page-item{margin:0 5px;cursor:pointer}
.page-item.disabled .page-link{cursor:not-allowed;opacity:.6}
.page-link{padding:8px 12px;background:#fff;border:1px solid #ddd;border-radius:5px;color:#263d42;transition:.3s}
.page-link:hover{background:#3c5070;color:#fff}
.page-item.active .page-link{background:#3c5070;color:#fff;border:1px solid #3c5070}

/* Footer */
.footer{background:#112250;padding:30px 10px;text-align:center;color:#fff;margin-top:30px;border-radius:8px}
.footer-content{font-size:14px}
</style>

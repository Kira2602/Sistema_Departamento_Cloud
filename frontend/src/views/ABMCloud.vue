<!-- src/views/ABMCloud.vue -->
<template>
  <div>
    <header>
      <NavbarComponent />
    </header>

    <!-- HERO con fondo 3D/parallax aplicado -->
    <section class="hero hero-parallax">
      <div class="hero-parallax__bg" aria-hidden="true"></div>
      <div class="hero-parallax__scrim" aria-hidden="true"></div>

      <div class="hero-inner">
        <div class="hero-content">
          <h1>RECURSOS CLOUD</h1>
          <p class="hero-description">
            Administra y lleva el control de tus recursos en la nube con un seguimiento completo de costos, responsables y estados.
          </p>
        </div>

        <div class="lottie-container1 hero-lottie">
          <dotlottie-player
            src="https://lottie.host/1db45383-d967-49f1-960e-5f2cdda11099/AOWyIri1vh.lottie"
            autoplay
            loop
            style="width: 200px; height: 200px"
          />
        </div>
      </div>
    </section>

    <!-- ===== CONTENEDOR DE FILTROS ===== -->
    <div class="panel-filtros">
      <div class="filtros-toolbar">
             <button class="btn accion-btn scloud-btn" @click="goToSCloud" style="margin-right: 16px;">Documentacion </button>
        <div class="filtros-head">
          <span class="filtros-label">Filtros:</span>
          <button class="btn accion-btn ok" @click="aplicarFiltros">Aplicar</button>
          <button class="btn accion-btn cancelar" @click="limpiarFiltros">Limpiar</button>
        </div>

        <div class="filtro-inline f-col-4">
          <label>Buscar Registro</label>
          <input
            type="text"
            v-model="filtroIdRecurso"
            placeholder="Ej: CR-001, rds-prod-01…"
            class="custom-input"
          />
        </div>

        <div class="filtro-inline f-col-2">
          <label>Proveedor</label>
          <input
            v-model="filtroProveedor"
            type="text"
            placeholder="AWS, Azure, GCP…"
            class="custom-input"
          />
        </div>

        <div class="filtro-inline f-col-2">
          <label>Estado</label>
          <select v-model="filtroEstado" class="custom-select">
            <option value="">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="En Actualización">En Actualización</option>
          </select>
        </div>

        <div class="filtro-inline f-col-2">
          <label>Responsable</label>
          <select v-model="filtroResponsable" class="custom-select">
            <option value="">Todos</option>
            <option>Yudith Noa</option>
            <option>Rosario Calisaya</option>
            <option>Alan Marquez</option>
            <option>Jorge Flores</option>
            <option>Jesus Meriles</option>
            <option>CIO</option>
          </select>
        </div>
      </div>
    </div>

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

      <div class="tabla-actividades" @click="clearSelectionOnEmptyClick">
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
            <tr v-if="loading">
              <td colspan="13" style="text-align: center; padding: 40px;">
                <div style="color: #3c507d; font-size: 16px;">
                  🔄 Cargando recursos...
                </div>
              </td>
            </tr>
            <tr v-else-if="recursos.length === 0">
              <td colspan="13" style="text-align: center; padding: 40px;">
                <div style="color: #666; font-size: 16px;">
                  No hay recursos disponibles. ¡Agrega el primero!
                </div>
              </td>
            </tr>
            <tr v-else-if="recursosFiltrados.length === 0">
              <td colspan="13" style="text-align: center; padding: 40px;">
                <div style="color: #666; font-size: 16px;">
                  No hay recursos que coincidan con los filtros.
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="(r, idx) in paginatedRecursos"
              :key="r.id || idx"
              :class="{ selected: selectedIndex === startIndex + idx }"
              @click="selectedIndex = startIndex + idx"
            >
              <td>
                <input
                  type="radio"
                  name="sel"
                  :checked="selectedIndex === startIndex + idx"
                  @change="selectedIndex = startIndex + idx"
                />
              </td>

              <!-- Edición -->
              <template v-if="editMode && selectedIndex === startIndex + idx">
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
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="En Actualización">En Actualización</option>
                  </select>
                </td>
                <td><input class="cell-input" v-model="editedRow.responsable" /></td>
                <td><input class="cell-input" v-model="editedRow.costo" /></td>
                <td><input class="cell-input" type="date" v-model="editedRow.fechaInicio" /></td>
                <td><input class="cell-input" type="date" v-model="editedRow.fechaFin" /></td>
                <td><input class="cell-input" v-model="editedRow.garantia" /></td>
                <td><input class="cell-input" v-model="editedRow.notas" /></td>
              </template>

              <!-- Lectura -->
              <template v-else>
                <td>{{ r.codigo }}</td>
                <td>{{ r.proveedor }}</td>
                <td>{{ r.servicio }}</td>
                <td>{{ r.idRecurso }}</td>
                <td>{{ r.region }}</td>
                <td>{{ r.estado }}</td>
                <td>{{ r.responsable }}</td>
                <td class="currency">{{ formatUSD(r.costo) }}</td>
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
          <li
            class="page-item"
            :class="{ disabled: currentPage === 1 }"
            @click="prevPage"
          >
            <a class="page-link page-prev">«</a>
          </li>
          <li
            v-for="p in totalPages"
            :key="p"
            class="page-item"
            :class="{ active: currentPage === p }"
            @click="changePage(p)"
          >
            <a class="page-link">{{ p }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
            @click="nextPage"
          >
            <a class="page-link page-next">»</a>
          </li>
        </ul>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-content">
        <p>© 2025 Team If...Else | Cloud Department. Todos los derechos reservados.</p>
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
import { cloudService } from '@/services/cloudService.js'
import { mapBackendToFrontend, mapFrontendToBackend } from '@/utils/fieldMapper.js'

// === Mixin de colores para TODAS las alertas de este componente ===
const swal = Swal.mixin({
  background: '#fff7f7',
  color: '#3c507d',
  confirmButtonColor: '#e0c58f', // dorado suave
  cancelButtonColor: '#b8b8b8',  // gris suave
  confirmButtonText: 'Aceptar',
  cancelButtonText: 'Cancelar'
})

export default {
  name: 'ABMCloud',
  components: { NavbarComponent, AgregarPopup },
  data() {
    return {
      isAgregarOpen: false,
      selectedIndex: null,
      editMode: false,
      editedRow: null,
      recursos: [],
      loading: false,
      user: null,

      // filtros
      filtroIdRecurso: '',     // texto: ahora busca en TODOS los campos
      filtroProveedor: '',     // texto
      filtroEstado: '',        // select
      filtroResponsable: '',   // select
      filtroFechaRef: '',      // date (vigente ese día)

      // paginación
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    // Filtra los recursos basado en los filtros seleccionados
    recursosFiltrados() {
      let recursos = this.recursos

      // 🔎 Buscar por texto en TODOS los campos relevantes
      if (this.filtroIdRecurso && this.filtroIdRecurso.trim() !== '') {
        const q = this.norm(this.filtroIdRecurso)
        recursos = recursos.filter(recurso => {
          // Campos a considerar en la búsqueda global
          const campos = [
            recurso.id,               // por si quieres buscar por id interno
            recurso.codigo,
            recurso.idRecurso,
            recurso.proveedor,
            recurso.servicio,
            recurso.region,
            recurso.estado,
            recurso.responsable,
            recurso.costo,
            recurso.fechaInicio,
            recurso.fechaFin,
            recurso.garantia,
            recurso.notas
          ]
          return campos.some(v => this.norm(v).includes(q))
        })
      }

      // Proveedor por texto (contiene)
      if (this.filtroProveedor && this.filtroProveedor.trim() !== '') {
        const prov = this.filtroProveedor.toLowerCase().trim()
        recursos = recursos.filter(recurso =>
          recurso.proveedor?.toLowerCase().includes(prov)
        )
      }

      // Estado (insensible a acentos/mayúsculas/espacios)
      if (this.filtroEstado && this.filtroEstado !== '') {
        const target = this.norm(this.filtroEstado)
        recursos = recursos.filter(recurso => this.norm(recurso.estado) === target)
      }

      // Responsable exacto (puedes usar norm() si quieres tolerancia)
      if (this.filtroResponsable && this.filtroResponsable !== '') {
        recursos = recursos.filter(recurso => recurso.responsable === this.filtroResponsable)
      }

      // Fecha “vigente ese día”: filtroFechaRef ∈ [fechaInicio, fechaFin]
      if (this.filtroFechaRef) {
        const dRef = new Date(this.filtroFechaRef)
        recursos = recursos.filter(r => {
          const fi = r.fechaInicio ? new Date(r.fechaInicio) : null
          const ff = r.fechaFin ? new Date(r.fechaFin) : null
          return !!fi &&
            this.onlyDate(dRef) >= this.onlyDate(fi) &&
            (ff ? this.onlyDate(dRef) <= this.onlyDate(ff) : true)
        })
      }

      return recursos
    },

    // paginación computada
    startIndex() { return (this.currentPage - 1) * this.pageSize },
    paginatedRecursos() {
      return this.recursosFiltrados.slice(this.startIndex, this.startIndex + this.pageSize)
    },
    totalPages() { return Math.max(1, Math.ceil(this.recursosFiltrados.length / this.pageSize)) }
  },
  async mounted() {
    // Cargar el web-component de dotLottie si no existe aún
    if (!customElements.get('dotlottie-player')) {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.js'
      document.head.appendChild(s)
    }

    // Cargar recursos directamente (sin romper tu flujo actual)
    await this.loadRecursos()
  },
  methods: {
    onlyDate(d) { const nd = new Date(d); nd.setHours(0,0,0,0); return nd },

    // Normaliza cadenas: quita acentos, pasa a minúsculas y recorta
    norm(str) {
      return String(str ?? '')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .trim()
    },

    async loadRecursos() {
      this.loading = true
      try {
        const response = await cloudService.getAllResources()
        if (Array.isArray(response)) {
          this.recursos = response.map(mapBackendToFrontend)
        }
      } catch (error) {
        let errorMessage = 'No se pudieron cargar los recursos.'
        if (error.response?.data?.error) errorMessage = error.response.data.error
        swal.fire({
          icon: 'error',
          title: 'Error al cargar recursos',
          text: errorMessage
        })
      } finally {
        this.loading = false
      }
    },

    async onAgregarRecurso(nuevo) {
      try {
        const backendData = mapFrontendToBackend(nuevo)
        const response = await cloudService.createResource(backendData)
        const nuevoRecurso = mapBackendToFrontend(response)
        this.recursos.unshift(nuevoRecurso)
        this.isAgregarOpen = false
        swal.fire({
          icon: 'success',
          title: 'Recurso registrado',
          text: 'El recurso se ha agregado correctamente.'
        })
      } catch (error) {
        swal.fire({
          icon: 'error',
          title: 'Error al crear recurso',
          text: error.response?.data?.error || 'No se pudo crear el recurso.'
        })
      }
    },

    onModificar() {
      if (this.selectedIndex === null || this.selectedIndex === -1) {
        return swal.fire({
          icon: 'info',
          title: 'Selecciona un registro',
          text: 'Por favor selecciona una fila para modificar.'
        })
      }
      this.editMode = true
      this.editedRow = { ...this.recursosFiltrados[this.selectedIndex] }
    },

    async onGuardarCambios() {
      const req = ['codigo', 'proveedor', 'servicio', 'idRecurso'];
      const falta = req.find(k => !String(this.editedRow[k] || '').trim());
      if (falta) {
        return swal.fire({
          icon: 'warning',
          title: 'Completa los campos',
          text: 'Revisa código, proveedor, servicio e ID de recurso.'
        });
      }

      try {
        const backendData = mapFrontendToBackend(this.editedRow);
        const recursoId = this.recursosFiltrados[this.selectedIndex].id;

        const payload = await cloudService.updateResource(recursoId, backendData);
        // Soporta ambas respuestas: {…}  o  { success:true, data:{…} }
        const updated = payload?.data ?? payload;
        const recursoActualizado = mapBackendToFrontend(updated);

        // Reemplaza por índice REAL en this.recursos
        const realIdx = this.recursos.findIndex(r => r.id === recursoId);
        if (realIdx !== -1) this.recursos.splice(realIdx, 1, recursoActualizado);

        this.editMode = false;
        this.editedRow = null;

        swal.fire({
          icon: 'success',
          title: 'Cambios guardados',
          text: 'El recurso fue actualizado correctamente.'
        });
      } catch (error) {
        swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: error.response?.data?.error || 'No se pudo actualizar el recurso.'
        });
      }
    },

    onCancelarEdicion() {
      this.editMode = false
      this.editedRow = null
    },

    async onEliminar() {
      // Verifica selección
      if (this.selectedIndex === -1 || this.selectedIndex === null) {
        return swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: 'Por favor selecciona un recurso para eliminar'
        })
      }

      const recurso = this.recursosFiltrados[this.selectedIndex]
      if (!recurso?.id) {
        return swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se puede eliminar el recurso: ID no válido'
        })
      }

      try {
        const result = await swal.fire({
          title: '¿Estás seguro?',
          text: `¿Quieres eliminar el recurso "${recurso.codigo || recurso.id}"?`,
          icon: 'warning',
          showCancelButton: true
          // Colores vienen del mixin (confirm/cancel)
        })

        if (result.isConfirmed) {
          const response = await cloudService.deleteResource(recurso.id)
          if (response.success) {
            await swal.fire({
              title: '¡Eliminado!',
              text: 'El recurso ha sido eliminado correctamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            })
            // Recargar lista conservando funcionalidad
            this.selectedIndex = -1
            await this.loadRecursos()
          } else {
            throw new Error(response.error || 'Error desconocido')
          }
        }
      } catch (error) {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al eliminar el recurso: ${error.message}`
        })
      }
    },

    aplicarFiltros() {
      // feedback + reset de paginación/selección
      this.selectedIndex = -1
      this.currentPage = 1
      // (El filtrado es reactivo vía recursosFiltrados)
    },

    limpiarFiltros() {
      this.filtroIdRecurso = ''
      this.filtroProveedor = ''
      this.filtroEstado = ''
      this.filtroResponsable = ''
      this.filtroFechaRef = ''
      this.selectedIndex = -1
      this.currentPage = 1
    },
    formatUSD(value) {
      if (value == null || value === '') return '-'
      // Limpia cualquier símbolo o texto previo ($, espacios, etc.)
      const num = Number(String(value).replace(/[^\d.-]/g, ''))
      if (Number.isNaN(num)) return String(value)
      const formatted = num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      // Forzamos prefijo USD (sin depender de toLocaleString con currency)
      return `USD ${formatted}`
    },



    // paginación
    changePage(p) {
      if (p < 1 || p > this.totalPages) return
      this.currentPage = p
      this.selectedIndex = null
    },
    nextPage() { this.changePage(this.currentPage + 1) },
    prevPage() { this.changePage(this.currentPage - 1) },

    clearSelectionOnEmptyClick(event) {
      if (
        event.target.closest('tr') ||
        event.target.closest('input') ||
        event.target.closest('select') ||
        event.target.closest('button')
      ) return
      this.selectedIndex = -1
     },

    goToSCloud() {
      this.$router.push('/scloud')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
* { font-family: 'Poppins', sans-serif; padding: 0; margin: 0; }
:global(body) { padding-top: 120px; }

/* ===== HERO con parallax 3D (diseño aplicado) ===== */
.hero{
  position: relative;
  border-radius: 16px;
  margin: 0 20px 18px;
  min-height: 180px;
  overflow: hidden;
}
.hero-parallax{
  perspective: 1px;
  transform-style: preserve-3d;
}
.hero-parallax__bg{
  position: absolute;
  inset: 0;
  background-image: url('../img/background.jpg'); /* tu imagen */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: translateZ(-0.6px) scale(1.6);
  transform-origin: center;
  will-change: transform;
  z-index: -2;
}
.hero-parallax__scrim{
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 100%);
  z-index: -1;
  pointer-events: none;
}
.hero-inner{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 20px;
}
.hero-content{flex:1;display:flex;flex-direction:column;align-items:flex-start;padding-left:30px}
.hero h1{font-size:2rem;color:#fff;margin:0}
.hero-description{font-size:.9rem;color:#fff;margin-top:6px}
.hero-lottie{display:flex;justify-content:flex-end;align-items:center;width:30%}

/* Fallback si no hay soporte para perspectiva */
@supports not (perspective: 1px) {
  .hero-parallax__bg{
    position: fixed;
    top: 80px; left: 0; right: 0;
    height: 260px;
    transform: none;
    background-attachment: fixed;
  }
}
@media (prefers-reduced-motion: reduce){
  .hero-parallax__bg{ transform: none; }
  .hero-parallax__scrim{ background: rgba(0,0,0,0.35); }
}

/* ===== Contenedor de filtros arriba del contenedor de tabla ===== */
.panel-filtros{
  max-width: 1200px;
  margin: 0 auto 12px; /* centrado y separación respecto a la tabla */
}

/* Contenedor principal de la tabla/acciones/paginación */
.historial-actividades{
  background:#d9cbc2;
  padding:20px;
  border-radius:15px;
  max-width:1200px;
  margin:0 auto;
}

/* ===== Barra de filtros en GRID (diseño aplicado) ===== */
.filtros-toolbar{
  display:grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items:end;
  gap:12px 16px;
  background:#e7ddd7;
  padding:14px;
  border-radius:12px;
  box-shadow:0 4px 10px rgba(0,0,0,.08);
}
.filtros-head{
  grid-column: 1 / -1;
  display:flex;
  justify-content:flex-end;
  align-items:center;
  gap:10px;
  margin-bottom:4px;
}
.filtros-label{
  color:#3c5070;
  font-weight:700;
  letter-spacing:.2px;
}
.filtro-inline{display:flex;flex-direction:column;gap:6px}
.filtro-inline label{ font-weight:600; color:#3c5070; font-size:.9rem; }
.f-col-4 { grid-column: span 4; min-width: 280px; }
.f-col-2 { grid-column: span 2; min-width: 180px; }

.custom-select,.custom-input{
  padding:9px 10px;border:2px solid #b8a89d;border-radius:10px;background:#fff;
  font-size:14px;color:#333;transition:border-color .2s, box-shadow .2s;
}
.custom-select:focus,.custom-input:focus{outline:none;border-color:#4f6281;box-shadow:0 0 0 3px rgba(79,98,129,.15)}

/* Botones de acción */
.acciones{display:flex;gap:12px;margin-bottom:15px}
.accion-btn{padding:10px 20px;border:none;border-radius:8px;font-weight:600;cursor:pointer;transition:.2s}
.accion-btn:hover{opacity:.92}
.accion-btn{background:#849cc4;color:#252525}
.accion-btn.eliminar{background:#a85350;color:#fff}
.accion-btn.ok{background:#6aa972;color:#fff}
.accion-btn.cancelar{background:#b8b8b8;color:#333}
/* Botón Documentación más largo */
.accion-btn.scloud-btn{
  background:#3c5070;
  color:#fff;
  padding:12px 28px;      /* más “gordito” */
  min-width: 200px;       /* <- largo mínimo */
  display:inline-flex;    /* centra el texto */
  align-items:center;
  justify-content:center;
}

/* Tabla */
.tabla-actividades{overflow-x:auto;padding:20px;background:rgba(255,255,255,.85);border-radius:15px;box-shadow:0 4px 10px rgba(0,0,0,.1)}
table{width:100%;border-collapse:collapse;font-size:.9rem}
th,td{padding:10px;text-align:center;border-bottom:1px solid #4f6281}
th{background:#4f6281;color:#fff;font-weight:bold;white-space:nowrap}
tr:nth-child(even){background:#f9f9f9}
tr:hover{background:#f1f1f1}
tr.selected{outline:3px solid #3c5070;outline-offset:-3px}
.cell-input{width:100%;padding:6px 8px;border:2px solid #3c5070;border-radius:6px;background:#f0f0f0;font-size:.9rem;box-sizing:border-box}

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

/* Evita que alguna regla global anteponga el símbolo $ */
td.currency::before {
  content: none !important;
}

/* Responsive */
@media (max-width: 1024px){
  .hero-inner{ padding: 12px 16px; }
  .filtros-toolbar{ grid-template-columns: repeat(6, 1fr); }
  .f-col-4 { grid-column: 1 / -1; }
  .f-col-2 { grid-column: span 3; }
}
@media (max-width: 640px){
  .hero-lottie{ display: none; } /* más espacio al texto en móviles */
  .hero-inner{ padding: 12px; }
  .filtros-toolbar{ grid-template-columns: repeat(1, 1fr); }
  .f-col-4, .f-col-2 { grid-column: 1 / -1; }
  .filtros-head{ justify-content: flex-start; gap:8px; }
}

</style>

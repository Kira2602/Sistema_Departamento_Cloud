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
        <dotlottie-player
          src="https://lottie.host/1db45383-d967-49f1-960e-5f2cdda11099/AOWyIri1vh.lottie"
          autoplay
          loop
          style="width: 200px; height: 200px"
        />
      </div>
    </section>

    <!-- CONTENEDOR PRINCIPAL -->
    <div class="historial-actividades">
      <!-- Acciones -->
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

      <div class="contenedor-principal">
        <!-- ===== Barra de Filtros ===== -->
        <div class="filtros-toolbar">
          <!-- Encabezado superior derecha -->
          <div class="filtros-head">
            <span class="filtros-label">Filtros:</span>
            <button class="btn accion-btn ok" @click="aplicarFiltros">Aplicar</button>
            <button class="btn accion-btn cancelar" @click="limpiarFiltros">Limpiar</button>
          </div>

          <div class="filtro-inline f-col-4">
            <label>Buscar (código, servicio, notas, ID)</label>
            <input
              type="text"
              v-model="filtros.search"
              placeholder="Buscar…"
              class="custom-input"
            />
          </div>

          <div class="filtro-inline f-col-2">
            <label>Proveedor</label>
            <select v-model="filtros.proveedor" class="custom-select">
              <option value="">Todos</option>
              <option v-for="p in proveedoresUnicos" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>

          <div class="filtro-inline f-col-2">
            <label>Estado</label>
            <select v-model="filtros.estado" class="custom-select">
              <option value="">Todos</option>
              <option v-for="e in estadosUnicos" :key="e" :value="e">{{ e }}</option>
            </select>
          </div>

          <div class="filtro-inline f-col-2">
            <label>Responsable</label>
            <select v-model="filtros.responsable" class="custom-select">
              <option value="">Todos</option>
              <option v-for="r in responsablesUnicos" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>

          <div class="filtro-inline f-col-2">
            <label>Fecha (vigente ese día)</label>
            <input type="date" v-model="filtros.fechaRef" class="custom-input" />
          </div>
        </div>

        <!-- ===== Tabla ===== -->
        <div class="tabla-actividades tabla-con-borde">
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
                  <div style="color: #3c507d; font-size: 16px;">🔄 Cargando recursos...</div>
                </td>
              </tr>

              <tr v-else-if="displayedRecursos.length === 0">
                <td colspan="13" style="text-align: center; padding: 40px;">
                  <div style="color: #666; font-size: 16px;">No hay recursos que coincidan con los filtros.</div>
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
                      <option>Activo</option>
                      <option>Inactivo</option>
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
      </div>

      <!-- Paginación -->
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
        <p>© 2025 Departamento Cloud. Todos los derechos reservados.</p>
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
import { authService } from '@/services/authService.js'
import { mapBackendToFrontend, mapFrontendToBackend } from '@/utils/fieldMapper.js'

export default {
  name: 'ABMCloud',
  components: { NavbarComponent, AgregarPopup },
  data() {
    return {
      isAgregarOpen: false,
      selectedIndex: null, // índice global dentro de displayedRecursos
      editMode: false,
      editedRow: null,
      recursos: [],
      loading: false,
      user: null,

      // filtros
      filtros: {
        search: '',
        proveedor: '',
        estado: '',
        responsable: '',
        fechaRef: '' // fecha “vigente ese día”
      },

      // paginación
      currentPage: 1,
      pageSize: 10,

      aplicarKey: 0
    }
  },
  computed: {
    proveedoresUnicos() { return this.uniquesFrom(this.recursos.map(r => r.proveedor)) },
    estadosUnicos() { return this.uniquesFrom(this.recursos.map(r => r.estado)) },
    responsablesUnicos() { return this.uniquesFrom(this.recursos.map(r => r.responsable)) },

    displayedRecursos() {
      // fuerza recomputación cuando se pulse Aplicar
      // eslint-disable-next-line no-unused-expressions
      this.aplicarKey

      const f = this.filtros
      const dRef = f.fechaRef ? new Date(f.fechaRef) : null

      return this.recursos.filter(r => {
        const searchOk =
          !f.search ||
          [r.codigo, r.servicio, r.notas, r.idRecurso]
            .filter(Boolean)
            .some(val => String(val).toLowerCase().includes(f.search.toLowerCase()))

        const provOk = !f.proveedor || r.proveedor === f.proveedor
        const estOk = !f.estado || r.estado === f.estado
        const respOk = !f.responsable || r.responsable === f.responsable

        // Fecha “vigente ese día”: dRef ∈ [fechaInicio, fechaFin]
        let fechaOk = true
        if (dRef) {
          const fi = r.fechaInicio ? new Date(r.fechaInicio) : null
          const ff = r.fechaFin ? new Date(r.fechaFin) : null
          fechaOk =
            !!fi &&
            this.onlyDate(dRef) >= this.onlyDate(fi) &&
            (ff ? this.onlyDate(dRef) <= this.onlyDate(ff) : true)
        }

        return searchOk && provOk && estOk && respOk && fechaOk
      })
    },

    // paginación computada
    startIndex() {
      return (this.currentPage - 1) * this.pageSize
    },
    paginatedRecursos() {
      return this.displayedRecursos.slice(this.startIndex, this.startIndex + this.pageSize)
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.displayedRecursos.length / this.pageSize))
    }
  },
  async mounted() {
    // Cargar dotlottie (para el hero)
    if (!customElements.get('dotlottie-player')) {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.js'
      document.head.appendChild(s)
    }

    if (!authService.isAuthenticated()) {
      await this.$router.push('/login')
      return
    }

    this.user = authService.getUser()
    await this.loadRecursos()
  },
  methods: {
    onlyDate(d) { const nd = new Date(d); nd.setHours(0,0,0,0); return nd },
    uniquesFrom(arr) {
      return [...new Set(arr.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)))
    },

    aplicarFiltros() {
      this.aplicarKey++
      this.currentPage = 1
      this.selectedIndex = null
    },
    limpiarFiltros() {
      this.filtros = { search: '', proveedor: '', estado: '', responsable: '', fechaRef: '' }
      this.aplicarKey++
      this.currentPage = 1
      this.selectedIndex = null
    },

    // paginador
    changePage(p) {
      if (p < 1 || p > this.totalPages) return
      this.currentPage = p
      this.selectedIndex = null
    },
    nextPage() { this.changePage(this.currentPage + 1) },
    prevPage() { this.changePage(this.currentPage - 1) },

    async loadRecursos() {
      this.loading = true
      try {
        const response = await cloudService.getAllResources()
        if (response.success) this.recursos = response.data.map(mapBackendToFrontend)
      } catch (error) {
        let errorMessage = 'No se pudieron cargar los recursos.'
        if (error.response?.status === 401) {
          errorMessage = 'Sesión expirada. Debes iniciar sesión nuevamente.'
          localStorage.removeItem('access_token'); localStorage.removeItem('user')
          await this.$router.push('/login'); return
        } else if (error.response?.data?.error) errorMessage = error.response.data.error
        Swal.fire({ icon: 'error', title: 'Error al cargar recursos', text: errorMessage, background: '#fff7f7', color: '#3c507d', confirmButtonColor: '#e0c58f' })
      } finally { this.loading = false }
    },

    async onAgregarRecurso(nuevo) {
      try {
        const backendData = mapFrontendToBackend(nuevo)
        const response = await cloudService.createResource(backendData)
        const nuevoRecurso = mapBackendToFrontend(response)
        this.recursos.unshift(nuevoRecurso)
        this.isAgregarOpen = false
        Swal.fire({ icon: 'success', title: 'Recurso registrado', text: 'El recurso se ha agregado correctamente.', background: '#fff7f7', color: '#3c507d', confirmButtonColor: '#e0c58f', confirmButtonText: 'Aceptar' })
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error al crear recurso', text: error.response?.data?.error || 'No se pudo crear el recurso.', background: '#fff7f7', color: '#3c507d', confirmButtonColor: '#e0c58f' })
      }
    },

    onModificar() {
      if (this.selectedIndex === null) {
        return Swal.fire({ icon: 'info', title: 'Selecciona un registro', text: 'Por favor selecciona una fila para modificar.', background: '#fff7f7', color: '#3c507d', confirmButtonColor: '#e0c58f' })
      }
      this.editMode = true
      this.editedRow = { ...this.displayedRecursos[this.selectedIndex] }
    },

    async onGuardarCambios() {
      const req = ['codigo', 'proveedor', 'servicio', 'idRecurso']
      const falta = req.find(k => !String(this.editedRow[k] || '').trim())
      if (falta) {
        return Swal.fire({ icon: 'warning', title: 'Completa los campos', text: 'Revisa código, proveedor, servicio e ID de recurso.', background: '#fff7f7', color: '#3c507d', confirmButtonColor: '#e0c58f' })
      }

      try {
        const backendData = mapFrontendToBackend(this.editedRow)
        const original = this.recursos.find(r => r.id === this.editedRow.id)
        const recursoId = original?.id
        const response = await cloudService.updateResource(recursoId, backendData)
        const recursoActualizado = mapBackendToFrontend(response.data)
        const idxReal = this.recursos.findIndex(r => r.id === recursoId)
        if (idxReal !== -1) this.recursos.splice(idxReal, 1, recursoActualizado)
        this.editMode = false; this.editedRow = null
        Swal.fire({ icon: 'success', title: 'Cambios guardados', text: 'El recurso fue actualizado correctamente.', background: '#fff7f7', color: '#3c507d', confirmButtonColor: '#e0c58f' })
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error al actualizar', text: error.response?.data?.error || 'No se pudo actualizar el recurso.', background: '#fff7f7', color: '#3c507d', confirmButtonColor: '#e0c58f' })
      }
    },

    onCancelarEdicion() { this.editMode = false; this.editedRow = null },

    async onEliminar() {
      if (this.selectedIndex === -1 || this.selectedIndex === null) {
        return Swal.fire({ title: 'Atención', text: 'Por favor selecciona un recurso para eliminar', icon: 'warning' })
      }

      const recurso = this.displayedRecursos[this.selectedIndex]
      if (!recurso?.id) {
        return Swal.fire({ title: 'Error', text: 'No se puede eliminar el recurso: ID no válido', icon: 'error' })
      }

      try {
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: `¿Quieres eliminar el recurso "${recurso.codigo || recurso.id}"?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        })

        if (result.isConfirmed) {
          const response = await cloudService.deleteResource(recurso.id)
          if (response.success) {
            await Swal.fire({ title: '¡Eliminado!', text: 'El recurso ha sido eliminado correctamente', icon: 'success', timer: 2000, showConfirmButton: false })
            const idxReal = this.recursos.findIndex(r => r.id === recurso.id)
            if (idxReal !== -1) this.recursos.splice(idxReal, 1)
            this.selectedIndex = -1
          } else {
            throw new Error(response.error || 'Error desconocido')
          }
        }
      } catch (error) {
        Swal.fire({ title: 'Error', text: `Error al eliminar el recurso: ${error.message}`, icon: 'error' })
      }
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

/* Contenedor principal */
.historial-actividades{background:#d9cbc2;padding:20px;border-radius:15px;max-width:1200px;margin:0 auto}
.contenedor-principal{display:flex;flex-direction:column;gap:14px}

/* ===== Barra de filtros en GRID ===== */
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

/* Campos */
.filtro-inline{display:flex;flex-direction:column;gap:6px}
.filtro-inline label{ font-weight:600; color:#3c5070; font-size:.9rem; }

/* spans de columnas (desktop) */
.f-col-4 { grid-column: span 4; min-width: 280px; }
.f-col-2 { grid-column: span 2; min-width: 180px; }

/* Inputs/Selects */
.custom-select,.custom-input{
  padding:9px 10px;border:2px solid #b8a89d;border-radius:10px;background:#fff;
  font-size:14px;color:#333;transition:border-color .2s, box-shadow .2s;
}
.custom-select:focus,.custom-input:focus{outline:none;border-color:#4f6281;box-shadow:0 0 0 3px rgba(79,98,129,.15)}

/* Tabla */
.tabla-actividades{flex:1;overflow-x:auto;padding:20px;background:rgba(255,255,255,.85);border-radius:15px;box-shadow:0 4px 10px rgba(0,0,0,.1)}
.tabla-con-borde{ border-top:4px solid #cdbfb6; border-radius:12px; }
table{width:100%;border-collapse:collapse;font-size:.9rem}
th,td{padding:10px;text-align:center;border-bottom:1px solid #4f6281}
th{background:#4f6281;color:#fff;font-weight:bold;white-space:nowrap}
tr:nth-child(even){background:#f9f9f9}
tr:hover{background:#f1f1f1}
tr.selected{outline:3px solid #3c5070;outline-offset:-3px}
.cell-input{width:100%;padding:6px 8px;border:2px solid #3c5070;border-radius:6px;background:#f0f0f0;font-size:.9rem;box-sizing:border-box}

/* Botones generales */
.acciones{display:flex;gap:12px;margin-bottom:15px}
.accion-btn{padding:10px 20px;border:none;border-radius:8px;font-weight:600;cursor:pointer;transition:.2s}
.accion-btn:hover{opacity:.92}
.accion-btn{background:#849cc4;color:#252525}
.accion-btn.eliminar{background:#a85350;color:#fff}
.accion-btn.ok{background:#6aa972;color:#fff}
.accion-btn.cancelar{background:#b8b8b8;color:#333}

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

/* Responsive */
@media (max-width: 1024px){
  .filtros-toolbar{
    grid-template-columns: repeat(6, 1fr);
  }
  .f-col-4 { grid-column: 1 / -1; }
  .f-col-2 { grid-column: span 3; }
}
@media (max-width: 640px){
  .filtros-toolbar{
    grid-template-columns: repeat(1, 1fr);
  }
  .f-col-4, .f-col-2 { grid-column: 1 / -1; }
  .filtros-head{ justify-content: flex-start; gap:8px; }
}
</style>

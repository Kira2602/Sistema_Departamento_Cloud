<!-- src/views/ABMCloud.vue -->
<template>
  <div>
    <header>
      <NavbarComponent />
    </header>

    <!-- HERO com              :class="{ selected: selectedIndex === idx }"
              @click.stop="selectedIndex = idx">cto -->
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
      <!-- Filtros de búsqueda - ARRIBA de los botones -->
      <div class="filtros-container">
        <div class="filtro-group">
          <label>Código Recurso:</label>
                      <input 
              type="text" 
              v-model="filtroIdRecurso" 
              placeholder="Buscar por Código (CR-001) o ID de recurso..."
              class="filtro-input"
            >
        </div>
        
        <div class="filtro-group">
          <label>Proveedor:</label>
          <input v-model="filtroProveedor" type="text" placeholder="AWS, Azure, GCP..." class="filtro-input" />
        </div>
        
        <div class="filtro-group">
          <label>Estado:</label>
          <select v-model="filtroEstado" class="filtro-select">
            <option value="">Todos</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
        
        <div class="filtro-group">
          <label>Responsable:</label>
          <select v-model="filtroResponsable" class="filtro-select">
            <option value="">Todos</option>
            <option>Yudith Noa</option>
            <option>Rosario Calisaya</option>
            <option>Alan Marquez</option>
            <option>Jorge Flores</option>
            <option>Jesus Meriles</option>
            <option>CIO</option>
          </select>
        </div>
        
        <div class="filtro-buttons">
          <button class="btn-filtro buscar" @click="aplicarFiltros">🔍 Buscar</button>
          <button class="btn-filtro limpiar" @click="limpiarFiltros">🗑️ Limpiar</button>
        </div>
      </div>

      <!-- Botones de acción - ABAJO de los filtros -->
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
            <tr
              v-else
              v-for="(r, idx) in recursosFiltrados"
              :key="r.id || idx"
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
      filtroIdRecurso: '',  // Filtro por ID de recurso
      filtroProveedor: '',  // Filtro por proveedor
      filtroEstado: '',     // Filtro por estado  
      filtroResponsable: '' // Filtro por responsable
    }
  },
  computed: {
    // Filtra los recursos basado en los filtros seleccionados
    recursosFiltrados() {
      let recursos = this.recursos;
      
      // Filtro por ID de recurso (texto que contenga) - buscar tanto en idRecurso como en codigo
      if (this.filtroIdRecurso && this.filtroIdRecurso.trim() !== '') {
        const filtroId = this.filtroIdRecurso.toLowerCase().trim();
        recursos = recursos.filter(recurso => 
          recurso.idRecurso?.toLowerCase().includes(filtroId) || 
          recurso.codigo?.toLowerCase().includes(filtroId)
        );
      }
      
      // Filtro por proveedor (texto que contenga)
      if (this.filtroProveedor && this.filtroProveedor.trim() !== '') {
        const filtroProveedor = this.filtroProveedor.toLowerCase().trim();
        recursos = recursos.filter(recurso => 
          recurso.proveedor?.toLowerCase().includes(filtroProveedor)
        );
      }
      
      // Filtro por estado (exacto)
      if (this.filtroEstado && this.filtroEstado !== '') {
        recursos = recursos.filter(recurso => 
          recurso.estado === this.filtroEstado
        );
      }
      
      // Filtro por responsable (exacto)
      if (this.filtroResponsable && this.filtroResponsable !== '') {
        recursos = recursos.filter(recurso => 
          recurso.responsable === this.filtroResponsable
        );
      }
      
      return recursos;
    }
  },
  async mounted() {
    console.log('🚀 ===== COMPONENTE ABMCloud MONTADO =====')
    console.log('🚀 ===== SIN AUTENTICACIÓN =====')
    
    // Cargar el web-component de dotLottie si no existe aún
    if (!customElements.get('dotlottie-player')) {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.js'
      document.head.appendChild(s)
    }

    // Cargar recursos directamente sin autenticación
    console.log('🔄 Llamando a loadRecursos...')
    await this.loadRecursos()
    console.log('✅ loadRecursos completado')
  },
  methods: {
    async loadRecursos() {
      this.loading = true
      try {
        console.log('🔄 Cargando recursos sin autenticación...')
        
        const response = await cloudService.getAllResources()
        console.log('✅ Respuesta del servidor:', response)
        
        // El backend devuelve directamente el array, no necesita response.success
        if (Array.isArray(response)) {
          console.log('📥 Datos del backend:', response)
          console.log('📥 Primer recurso:', response[0])
          
          this.recursos = response.map(recurso => {
            console.log('🔄 Mapeando recurso:', recurso)
            const mapped = mapBackendToFrontend(recurso)
            console.log('✅ Recurso mapeado:', mapped)
            return mapped
          })
          console.log('📦 Total recursos cargados:', this.recursos.length)
        } else {
          console.warn('⚠️ Respuesta no es un array:', response)
        }
      } catch (error) {
        console.error('❌ Error loading recursos:', error)
        console.error('Response data:', error.response?.data)
        console.error('Response status:', error.response?.status)
        
        let errorMessage = 'No se pudieron cargar los recursos.'
        
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error
        } else {
          errorMessage = 'Error al cargar recursos. Intenta de nuevo.'
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar recursos',
          text: errorMessage,
          background: '#fff7f7',
          color: '#3c507d',
          confirmButtonColor: '#e0c58f'
        })
      } finally {
        this.loading = false
      }
    },
    async onAgregarRecurso(nuevo) {
      try {
        const backendData = mapFrontendToBackend(nuevo)
        const response = await cloudService.createResource(backendData)
        
        // Agregar el nuevo recurso al inicio de la lista
        const nuevoRecurso = mapBackendToFrontend(response)
        this.recursos.unshift(nuevoRecurso)
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
      } catch (error) {
        console.error('Error creating resource:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error al crear recurso',
          text: error.response?.data?.error || 'No se pudo crear el recurso.',
          background: '#fff7f7',
          color: '#3c507d',
          confirmButtonColor: '#e0c58f'
        })
      }
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
      this.editedRow = { ...this.recursosFiltrados[this.selectedIndex] }
    },
    async onGuardarCambios() {
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

      try {
        console.log('💾 ==============================================');
        console.log('💾 GUARDANDO CAMBIOS');
        console.log('📝 Datos editados (editedRow):', this.editedRow);
        console.log('💰 Campo costo:', this.editedRow.costo);
        console.log('🔄 Mapeando a backend...');
        
        const backendData = mapFrontendToBackend(this.editedRow);
        console.log('📤 Datos mapeados para backend:', backendData);
        console.log('💰 Campo costo_mensual_estimado mapeado:', backendData.costo_mensual_estimado);
        
        const recursoId = this.recursosFiltrados[this.selectedIndex].id;
        console.log('🔍 ID del recurso a actualizar:', recursoId);
        
        const response = await cloudService.updateResource(recursoId, backendData);
        console.log('📥 Respuesta del servidor:', response);
        
        // Actualizar el recurso en la lista
        const recursoActualizado = mapBackendToFrontend(response.data);
        console.log('🔄 Recurso actualizado mapeado:', recursoActualizado);
        console.log('💰 Costo actualizado:', recursoActualizado.costo);
        
        this.recursos.splice(this.selectedIndex, 1, recursoActualizado);
        this.editMode = false;
        this.editedRow = null;
        console.log('💾 ==============================================');
        
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados',
          text: 'El recurso fue actualizado correctamente.',
          background: '#fff7f7',
          color: '#3c507d',
          confirmButtonColor: '#e0c58f'
        })
      } catch (error) {
        console.error('Error updating resource:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: error.response?.data?.error || 'No se pudo actualizar el recurso.',
          background: '#fff7f7',
          color: '#3c507d',
          confirmButtonColor: '#e0c58f'
        })
      }
    },
    onCancelarEdicion() {
      this.editMode = false
      this.editedRow = null
    },
    async onEliminar() {
            console.log('🗑️ Iniciando eliminación...');
            console.log('📍 Índice seleccionado:', this.selectedIndex);
            
            // Verificar que hay una fila seleccionada
            if (this.selectedIndex === -1) {
                console.warn('⚠️ No hay recurso seleccionado');
                Swal.fire({
                    title: 'Atención',
                    text: 'Por favor selecciona un recurso para eliminar',
                    icon: 'warning'
                });
                return;
            }
            
            const recurso = this.recursosFiltrados[this.selectedIndex];
            console.log('🗑️ Recurso a eliminar:', recurso);
            console.log('🔍 Recurso seleccionado:', recurso);
            console.log('   - ID:', recurso.id);
            console.log('   - Código:', recurso.codigo_recurso);
            console.log('   - Responsable (nombre):', recurso.responsable);
            
            // Verificar que tenemos un ID válido
            if (!recurso.id) {
                console.error('❌ ERROR: recurso.id es undefined');
                Swal.fire({
                    title: 'Error',
                    text: 'No se puede eliminar el recurso: ID no válido',
                    icon: 'error'
                });
                return;
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
                });

                if (result.isConfirmed) {
                    console.log('✅ Confirmación recibida, llamando a cloudService.deleteResource con ID:', recurso.id);
                    
                    const response = await cloudService.deleteResource(recurso.id);
                    console.log('🔄 Respuesta del servidor:', response);

                    if (response.success) {
                        console.log('🎉 Eliminación exitosa según respuesta del servidor');
                        
                        // Mostrar mensaje de éxito
                        await Swal.fire({
                            title: '¡Eliminado!',
                            text: 'El recurso ha sido eliminado correctamente',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });

                        // Limpiar selección y recargar la lista
                        this.selectedIndex = -1;
                        console.log('🔄 Recargando lista de recursos...');
                        await this.loadRecursos();
                        console.log('✅ Lista recargada');
                    } else {
                        console.error('❌ Eliminación falló según respuesta del servidor:', response);
                        throw new Error(response.error || 'Error desconocido');
                    }
                }
            } catch (error) {
                console.error('💥 Error durante eliminación:', error);
                Swal.fire({
                    title: 'Error',
                    text: `Error al eliminar el recurso: ${error.message}`,
                    icon: 'error'
                });
            }
        },

        aplicarFiltros() {
            // Los filtros se aplican automáticamente a través de la computed property
            // Pero forzamos una actualización para mostrar feedback al usuario
            console.log('🔍 Aplicando filtros:', {
                id: this.filtroIdRecurso,
                proveedor: this.filtroProveedor,
                estado: this.filtroEstado,
                responsable: this.filtroResponsable
            });
            
            // Limpiar selección al aplicar filtros
            this.selectedIndex = -1;
            
            // Mostrar resultados
            const resultados = this.recursosFiltrados.length;
            console.log(`✅ Filtros aplicados. Mostrando ${resultados} recursos`);
            
            if (resultados === 0 && (this.filtroIdRecurso || this.filtroProveedor || this.filtroEstado || this.filtroResponsable)) {
                console.warn('⚠️ No se encontraron recursos que coincidan con los filtros');
            }
        },
        
        limpiarFiltros() {
            this.filtroIdRecurso = '';
            this.filtroProveedor = '';
            this.filtroEstado = '';
            this.filtroResponsable = '';
            this.selectedIndex = -1; // También limpiar selección
            console.log('🗑️ Filtros y selección limpiados');
        },

        clearSelectionOnEmptyClick(event) {
            // Solo deseleccionar si se hace clic en el área vacía (no en filas o inputs)
            if (event.target.closest('tr') || event.target.closest('input') || event.target.closest('select') || event.target.closest('button')) {
                return; // No deseleccionar si se hizo clic en una fila o control
            }
            this.selectedIndex = -1;
            console.log('👆 Selección limpiada por click en área vacía');
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

/* Filtros de búsqueda */
.filtros-container {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  flex-wrap: wrap;
  align-items: end;
}

.filtro-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filtro-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #3c5070;
  margin: 0;
}

.filtro-select {
  padding: 8px 12px;
  border: 2px solid #3c5070;
  border-radius: 6px;
  font-size: 0.9rem;
  background: #fff;
  transition: all 0.3s ease;
  min-width: 120px;
}

.filtro-select:focus {
  outline: none;
  border-color: #2a4056;
  box-shadow: 0 0 0 3px rgba(60, 80, 112, 0.1);
}

.filtro-select:hover {
  border-color: #2a4056;
}

/* Estilos para inputs de texto */
.filtro-input {
  padding: 8px 12px;
  border: 2px solid #3c5070;
  border-radius: 6px;
  font-size: 0.9rem;
  background: #fff;
  transition: all 0.3s ease;
  min-width: 150px;
}

.filtro-input:focus {
  outline: none;
  border-color: #2a4056;
  box-shadow: 0 0 0 3px rgba(60, 80, 112, 0.1);
}

.filtro-input:hover {
  border-color: #2a4056;
}

.filtro-input::placeholder {
  color: #999;
  font-style: italic;
}

/* Contenedor de botones de filtro */
.filtro-buttons {
  display: flex;
  gap: 10px;
  align-items: end;
}

.btn-filtro {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-filtro.buscar {
  background: #28a745;
  color: white;
}

.btn-filtro.buscar:hover {
  background: #218838;
  transform: translateY(-1px);
}

.btn-filtro.limpiar {
  background: #6c757d;
  color: white;
}

.btn-filtro.limpiar:hover {
  background: #545b62;
  transform: translateY(-1px);
}

/* Separación entre filtros y botones */
.acciones {
  margin-top: 0;
}
</style>

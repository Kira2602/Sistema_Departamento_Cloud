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
      <!-- FILTROS DE BÚSQUEDA -->
      <div class="filtros-section">
        <div class="filtros-container">
          <div class="filtro-group">
            <label>🔍 Buscar por código:</label>
            <input 
              v-model="filtros.codigo" 
              type="text" 
              placeholder="Ej: CR-001"
              class="filtro-input"
            />
          </div>
          
          <div class="filtro-group">
            <label>☁️ Proveedor:</label>
            <select v-model="filtros.proveedor" class="filtro-select">
              <option value="">Todos</option>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="GCP">GCP</option>
            </select>
          </div>
          
          <div class="filtro-group">
            <label>📊 Estado:</label>
            <select v-model="filtros.estado" class="filtro-select">
              <option value="">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          
          <div class="filtro-group">
            <label>👤 Responsable:</label>
            <select v-model="filtros.responsable" class="filtro-select">
              <option value="">Todos</option>
              <option value="Yudith Noa">Yudith Noa</option>
              <option value="Rosario Calisaya">Rosario Calisaya</option>
              <option value="Alan Marquez">Alan Marquez</option>
              <option value="Jorge Flores">Jorge Flores</option>
              <option value="Jesus Meriles">Jesus Meriles</option>
              <option value="CIO">CIO</option>
            </select>
          </div>
          
          <div class="filtro-group">
            <button class="btn-limpiar" @click="limpiarFiltros">🗑️ Limpiar</button>
          </div>
        </div>
      </div>

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
            <tr v-if="loading">
              <td colspan="13" style="text-align: center; padding: 40px;">
                <div style="color: #3c507d; font-size: 16px;">
                  🔄 Cargando recursos...
                </div>
              </td>
            </tr>
            <tr v-else-if="recursosFiltrados.length === 0">
              <td colspan="13" style="text-align: center; padding: 40px;">
                <div style="color: #666; font-size: 16px;">
                  🔍 No hay recursos que coincidan con los filtros aplicados.
                  <br><small>Prueba ajustando los criterios de búsqueda.</small>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="(r, idx) in recursosFiltrados"
              :key="r.id || idx"
              :class="{ selected: selectedResourceId === r.id }"
              @click="selectedResourceId = r.id"
            >
              <td>
                <input
                  type="radio"
                  name="sel"
                  :checked="selectedResourceId === r.id"
                  @change="selectedResourceId = r.id"
                />
              </td>

              <template v-if="editMode && selectedResourceId === r.id">
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
                <td>
                  <select class="cell-input" v-model="editedRow.responsable">
                    <option value="">Seleccionar...</option>
                    <option>Yudith Noa</option>
                    <option>Rosario Calisaya</option>
                    <option>Alan Marquez</option>
                    <option>Jorge Flores</option>
                    <option>Jesus Meriles</option>
                    <option>CIO</option>
                  </select>
                </td>
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
import { cloudService } from '@/services/cloudService.js'
import { authService } from '@/services/authService.js'
import { mapBackendToFrontend, mapFrontendToBackend } from '@/utils/fieldMapper.js'

export default {
  name: 'ABMCloud',
  components: { NavbarComponent, AgregarPopup },
  data() {
    return {
      isAgregarOpen: false,
      selectedResourceId: null,
      editMode: false,
      editedRow: null,
      recursos: [],
      loading: false,
      user: null,
      filtros: {
        codigo: '',
        proveedor: '',
        estado: '',
        responsable: ''
      }
    }
  },
  computed: {
    recursosFiltrados() {
      return this.recursos.filter(recurso => {
        const matchCodigo = !this.filtros.codigo || 
          recurso.codigo.toLowerCase().includes(this.filtros.codigo.toLowerCase());
        
        const matchProveedor = !this.filtros.proveedor || 
          recurso.proveedor === this.filtros.proveedor;
          
        const matchEstado = !this.filtros.estado || 
          recurso.estado === this.filtros.estado;
          
        const matchResponsable = !this.filtros.responsable || 
          recurso.responsable === this.filtros.responsable;
        
        return matchCodigo && matchProveedor && matchEstado && matchResponsable;
      });
    },
    recursoSeleccionado() {
      return this.recursos.find(recurso => recurso.id === this.selectedResourceId) || null;
    }
  },
  async mounted() {
    // Cargar el web-component de dotLottie si no existe aún
    if (!customElements.get('dotlottie-player')) {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.js'
      document.head.appendChild(s)
    }

    // Verificar autenticación
    if (!authService.isAuthenticated()) {
      await this.$router.push('/login')
      return
    }

    this.user = authService.getUser()
    await this.loadRecursos()
  },
  methods: {
    async loadRecursos() {
      this.loading = true
      try {
        console.log('🔄 Cargando recursos...')
        console.log('Token en localStorage:', localStorage.getItem('access_token'))
        
        const response = await cloudService.getAllResources() // Usar getAllResources para ver todos los recursos
        console.log('✅ Respuesta del servidor:', response)
        
        if (response.success) {
          console.log('📥 Datos RAW del backend ANTES del mapeo:', response.data)
          console.log('📥 Primer recurso raw:', response.data[0])
          
          this.recursos = response.data.map(recurso => {
            console.log('🔄 Mapeando recurso raw:', recurso)
            const mapped = mapBackendToFrontend(recurso)
            console.log('✅ Recurso mapeado:', mapped)
            return mapped
          })
          console.log('📦 Recursos mapeados final:', this.recursos)
        } else {
          console.warn('⚠️ Respuesta sin éxito:', response)
        }
      } catch (error) {
        console.error('❌ Error loading recursos:', error)
        console.error('Response data:', error.response?.data)
        console.error('Response status:', error.response?.status)
        console.error('Response headers:', error.response?.headers)
        
        let errorMessage = 'No se pudieron cargar los recursos.'
        
        if (error.response?.status === 401) {
          errorMessage = 'Sesión expirada. Debes iniciar sesión nuevamente.'
          // Limpiar localStorage y redirigir al login
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
          await this.$router.push('/login')
          return
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error
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
      if (!this.selectedResourceId) {
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
      this.editedRow = { ...this.recursoSeleccionado }
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
        
        const recursoId = this.editedRow.id;
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
            console.log('📍 ID del recurso seleccionado:', this.selectedResourceId);
            
            // Verificar que hay una fila seleccionada
            if (!this.selectedResourceId) {
                console.warn('⚠️ No hay recurso seleccionado');
                Swal.fire({
                    title: 'Atención',
                    text: 'Por favor selecciona un recurso para eliminar',
                    icon: 'warning'
                });
                return;
            }
            
            const recurso = this.recursoSeleccionado;
            console.log('🗑️ Recurso a eliminar:', recurso);
            console.log('🔍 Verificando campos del recurso:');
            console.log('   - ID:', recurso.id);
            console.log('   - Código:', recurso.codigo);
            console.log('   - Responsable User ID:', recurso.responsable_user_id);
            console.log('   - Responsable (nombre):', recurso.responsable);
            
            // Verificar información del usuario actual
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('👤 Usuario actual:', currentUser);
            console.log('🔄 Comparación de usuarios:');
            console.log('   - Usuario actual ID:', currentUser.id);
            console.log('   - Dueño del recurso ID:', recurso.responsable_user_id);
            console.log('   - ¿Son iguales?', currentUser.id === recurso.responsable_user_id);
            
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
                        this.selectedResourceId = null;
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
        limpiarFiltros() {
            this.filtros = {
                codigo: '',
                proveedor: '',
                estado: '',
                responsable: ''
            };
            // Limpiar también la selección
            this.selectedResourceId = null;
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
.filtros-section {
  margin-bottom: 20px;
  background: rgba(255, 247, 247, 0.9);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.filtros-container {
  display: flex;
  gap: 15px;
  align-items: end;
  flex-wrap: wrap;
}

.filtro-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.filtro-group label {
  color: #3c507d;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
}

.filtro-input,
.filtro-select {
  padding: 8px 12px;
  border: 2px solid #3c507d;
  border-radius: 8px;
  background: #f0f0f0;
  font-size: 14px;
  color: #3c507d;
  transition: all 0.3s ease;
}

.filtro-input:focus,
.filtro-select:focus {
  outline: none;
  border-color: #6d7da1;
  background: #fff;
  box-shadow: 0 0 8px rgba(60, 80, 125, 0.2);
}

.btn-limpiar {
  background: #a85350;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  height: fit-content;
}

.btn-limpiar:hover {
  background: #964a47;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(168, 83, 80, 0.3);
}

@media (max-width: 768px) {
  .filtros-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filtro-group {
    min-width: auto;
  }
}
</style>

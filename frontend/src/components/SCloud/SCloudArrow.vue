<!-- src/components/SCloud/SCloudArrow.vue -->
<template>
  <div class="scloud-arrow">
    <div class="arrow-header">
      <div class="format-tabs">
        <div class="format-label">FORMATS:</div>
        <div class="format-tab active">TABULAR</div>
        <div class="format-tab">HIERARCHICAL</div>
      </div>
    </div>

    <div class="arrow-content">
      <div class="arrow-title">
        <h2>Arrow</h2>
      </div>

      <div class="arrow-section">
        <h3>Arrow</h3>
      </div>

      <div class="arrow-table">
        <table class="arrows-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Definition</th>
              <th>UOW Facts</th>
              <th>UOW Objects</th>
              <th>UOW Constraints</th>
              <th>UOW Description</th>
              <th>Branches From</th>
              <th>Joined From</th>
              <th>Renamed From</th>
              <th>Source Object</th>
              <th>Branches Into</th>
              <th>Joined Into</th>
              <th>Renamed To</th>
              <th>Destination Object</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(arrow, index) in arrows" :key="index">
              <td class="arrow-name">{{ arrow.name }}</td>
              <td class="arrow-definition">{{ arrow.definition }}</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td class="arrow-link">&nbsp;</td>
              <td class="arrow-link">&nbsp;</td>
              <td class="arrow-link">&nbsp;</td>
              <td class="arrow-link">
                <img v-if="arrow.hasSourceLink" src="../../img/link.jpeg" alt="Link" class="link-icon" />
              </td>
              <td class="arrow-link">&nbsp;</td>
              <td class="arrow-link">&nbsp;</td>
              <td class="arrow-link">&nbsp;</td>
              <td class="arrow-link">
                <img v-if="arrow.hasDestinationLink" src="../../img/link.jpeg" alt="Link" class="link-icon" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Link Tables -->
      <div v-for="(linkTable, index) in linkTables" :key="index" class="link-table-section">
        <div class="link-table-header">
          <h4>{{ linkTable.title }}</h4>
        </div>
        <table class="link-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Conn. Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(link, linkIndex) in linkTable.links" :key="linkIndex">
              <td>{{ link.name }}</td>
              <td>{{ link.type }}</td>
              <td>{{ link.connType }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SCloudArrow',
  data() {
    return {
      arrows: [
        {
          name: 'Datos del usuario',
          definition: 'Información personal o institucional que respalda la solicitud, como nombre, NIT, número de cédula, correo electrónico, entidad u organización solicitante.',
          hasSourceLink: true,
          hasDestinationLink: false
        },
        {
          name: 'Dominio (registrado/asignado)',
          definition: 'Resultado final del proceso, que consiste en la asignación oficial del nombre de dominio solicitado, siempre que cumpla con las políticas establecidas, quedando habilitado para su uso en Internet.',
          hasSourceLink: false,
          hasDestinationLink: true
        },
        {
          name: 'Manuales',
          definition: 'Procedimientos operativos, guías y formularios establecidos para que el personal técnico o administrativo ejecute correctamente el proceso de registro de dominios.',
          hasSourceLink: true,
          hasDestinationLink: false
        },
        {
          name: 'Normativa de ADSIB',
          definition: 'Disposiciones legales y administrativas de la Agencia para el Desarrollo de la Sociedad de la Información en Bolivia, que supervisa y regula el proceso de registro de dominios en el país.',
          hasSourceLink: true,
          hasDestinationLink: false
        },
        {
          name: 'Políticas de registro de dominios de NIC Bolivia',
          definition: 'Lineamientos que regulan la disponibilidad, validez y formato de los nombres de dominio, estableciendo restricciones técnicas y legales.',
          hasSourceLink: true,
          hasDestinationLink: false
        },
        {
          name: 'Presupuesto / pago disponible',
          definition: 'Recursos económicos que el solicitante destina para cubrir las tarifas de registro y mantenimiento del dominio, según la normativa vigente.',
          hasSourceLink: true,
          hasDestinationLink: false
        },
        {
          name: 'Solicitud de dominio',
          definition: 'Es el requerimiento formal que presenta el usuario para registrar un nombre de dominio específico. Incluye la indicación del nombre deseado y su propósito.',
          hasSourceLink: true,
          hasDestinationLink: false
        },
        {
          name: 'TIC (Tecnologías de la Información y Comunicación)',
          definition: 'Infraestructura tecnológica utilizada para gestionar la base de datos de dominios, verificar disponibilidad, procesar solicitudes y garantizar la conexión a Internet',
          hasSourceLink: true,
          hasDestinationLink: false
        }
      ],
      linkTables: [
        {
          title: 'Source Object(s) of "Datos del usuario" Arrow',
          links: [
            { name: '{ Input Border }', type: '', connType: '' }
          ]
        },
        {
          title: 'Destination Object(s) of "Dominio (registrado/asignado)" Arrow',
          links: [
            { name: '{ Output Border }', type: '', connType: '{ Input Border }' }
          ]
        },
        {
          title: 'Source Object(s) of "Manuales" Arrow',
          links: [
            { name: '{ Mechanism Border }', type: '', connType: '' }
          ]
        },
        {
          title: 'Source Object(s) of "Normativa de ADSIB" Arrow',
          links: [
            { name: '{ Control Border }', type: '', connType: '' }
          ]
        },
        {
          title: 'Source Object(s) of "Políticas de registro de dominios de NIC Bolivia" Arrow',
          links: [
            { name: '{ Control Border }', type: '', connType: '' }
          ]
        },
        {
          title: 'Source Object(s) of "Presupuesto / pago disponible" Arrow',
          links: [
            { name: '{ Input Border }', type: '', connType: '' }
          ]
        },
        {
          title: 'Source Object(s) of "Solicitud de dominio" Arrow',
          links: [
            { name: '{ Input Border }', type: '', connType: '' }
          ]
        },
        {
          title: 'Source Object(s) of "TIC (Tecnologías de la Información y Comunicación)" Arrow',
          links: [
            { name: '{ Mechanism Border }', type: '', connType: '' }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
.scloud-arrow {
  padding: 20px;
  background: #fff;
  min-height: 100%;
}

.arrow-header {
  margin-bottom: 20px;
}

.format-tabs {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #9E9ECF;
  padding: 8px 12px;
  border-radius: 4px;
}

.format-label {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

.format-tab {
  padding: 4px 8px;
  background: #9E9ECF;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.format-tab.active {
  background: #64b1ff;
  color: #000;
  font-weight: bold;
}

.format-tab:hover:not(.active) {
  background: #b8b8d8;
}

.arrow-content {
  background: #fff;
}

.arrow-title {
  background: #ffffaa;
  border: 2px solid #000;
  padding: 10px;
  margin-bottom: 10px;
}

.arrow-title h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #000;
  font-family: 'Times New Roman', serif;
}

.arrow-section {
  background: #a0a0a4;
  border: 2px solid #000;
  padding: 10px;
  margin-bottom: 20px;
}

.arrow-section h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #000;
  font-family: 'Times New Roman', serif;
}

.arrow-table {
  margin-top: 20px;
  overflow-x: auto;
  max-width: 100%;
  width: 100%;
}

.arrows-table {
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  border: 2px solid #000;
  font-size: 11px;
  table-layout: fixed;
}

.arrows-table th {
  background: #64b1ff;
  color: #000;
  padding: 6px 3px;
  text-align: left;
  font-weight: bold;
  border: 2px solid #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrows-table td {
  background: #fff;
  color: #000;
  padding: 6px 3px;
  border: 2px solid #000;
  vertical-align: top;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrows-table tr:nth-child(even) td {
  background: #f9f9f9;
}

.arrows-table tr:hover td {
  background: #f0f8ff;
}

.arrow-name {
  font-weight: bold;
  min-width: 120px;
}

.arrow-definition {
  max-width: 200px;
  min-width: 150px;
  word-wrap: break-word;
  line-height: 1.4;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow-link {
  text-align: center;
  width: 60px;
  min-width: 60px;
  max-width: 60px;
}

.link-icon {
  width: 16px;
  height: 16px;
}

.link-table-section {
  margin-top: 30px;
}

.link-table-header {
  background: #a0a0a4;
  border: 2px solid #000;
  padding: 8px;
  margin-bottom: 10px;
}

.link-table-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #000;
  font-family: 'Times New Roman', serif;
}

.link-table {
  width: 100%;
  border-collapse: collapse;
  border: 2px solid #000;
  font-size: 12px;
}

.link-table th {
  background: #64b1ff;
  color: #000;
  padding: 8px;
  text-align: left;
  font-weight: bold;
  border: 2px solid #000;
}

.link-table td {
  background: #fff;
  color: #000;
  padding: 8px;
  border: 2px solid #000;
}

.link-table tr:nth-child(even) td {
  background: #f9f9f9;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .arrows-table {
    font-size: 9px;
  }
  
  .arrows-table th,
  .arrows-table td {
    padding: 4px 2px;
  }
  
  .arrow-definition {
    max-width: 150px;
    min-width: 120px;
  }
  
  .arrow-link {
    width: 50px;
    min-width: 50px;
    max-width: 50px;
  }
}

@media (max-width: 768px) {
  .scloud-arrow {
    padding: 15px;
  }
  
  .format-tabs {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .arrows-table {
    font-size: 8px;
  }
  
  .arrow-definition {
    max-width: 120px;
    min-width: 100px;
  }
  
  .arrow-link {
    width: 40px;
    min-width: 40px;
    max-width: 40px;
  }
  
  .arrow-name {
    min-width: 100px;
  }
}
</style>

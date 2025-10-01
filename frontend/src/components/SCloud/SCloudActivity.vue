<!-- src/components/SCloud/SCloudActivity.vue -->
<template>
  <div class="scloud-activity">
    <div class="activity-header">
      <div class="format-tabs">
        <div class="format-label">FORMATS:</div>
        <div class="format-tab active">TABULAR</div>
        <div class="format-tab">HIERARCHICAL</div>
      </div>
    </div>

    <div class="activity-content">
      <div class="activity-title">
        <h2>Activity</h2>
      </div>

      <div class="activity-section">
        <h3>Activity</h3>
      </div>

      <div class="activity-table">
        <table class="activities-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Number</th>
              <th>Definition</th>
              <th>Source</th>
              <th>Author</th>
              <th>UOW Facts</th>
              <th>UOW Objects</th>
              <th>UOW Constraints</th>
              <th>UOW Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="activity-name">Sistema de Registro de Dominios</td>
              <td>A0</td>
              <td class="activity-definition">
                Sistema de Registro de Dominios: El sistema permite recibir solicitudes, validarlas y asignar dominios de acuerdo con normativas establecidas. Su función principal es transformar una solicitud de dominio en un dominio registrado y disponible para uso en Internet, garantizando que el procedimiento siga controles técnicos y administrativos predefinidos.
              </td>
              <td>&nbsp;</td>
              <td>JESUS</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SCloudActivity',
  data() {
    return {
      // Activity data can be added here if needed
    }
  }
}
</script>

<style scoped>
.scloud-activity {
  padding: 20px;
  background: #fff;
  min-height: 100%;
}

.activity-header {
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

.activity-content {
  background: #fff;
}

.activity-title {
  background: #ffffaa;
  border: 2px solid #000;
  padding: 10px;
  margin-bottom: 10px;
}

.activity-title h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #000;
  font-family: 'Times New Roman', serif;
}

.activity-section {
  background: #a0a0a4;
  border: 2px solid #000;
  padding: 10px;
  margin-bottom: 20px;
}

.activity-section h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #000;
  font-family: 'Times New Roman', serif;
}

.activity-table {
  margin-top: 20px;
  overflow-x: auto;
}

.activities-table {
  width: 100%;
  border-collapse: collapse;
  border: 2px solid #000;
  font-size: 12px;
}

.activities-table th {
  background: #64b1ff;
  color: #000;
  padding: 8px 4px;
  text-align: left;
  font-weight: bold;
  border: 2px solid #000;
  white-space: nowrap;
}

.activities-table td {
  background: #fff;
  color: #000;
  padding: 8px 4px;
  border: 2px solid #000;
  vertical-align: top;
}

.activities-table tr:nth-child(even) td {
  background: #f9f9f9;
}

.activities-table tr:hover td {
  background: #f0f8ff;
}

.activity-name {
  font-weight: bold;
  min-width: 150px;
}

.activity-definition {
  max-width: 300px;
  word-wrap: break-word;
  line-height: 1.4;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .activities-table {
    font-size: 10px;
  }
  
  .activities-table th,
  .activities-table td {
    padding: 6px 2px;
  }
}

@media (max-width: 768px) {
  .scloud-activity {
    padding: 15px;
  }
  
  .format-tabs {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .activities-table {
    font-size: 9px;
  }
  
  .activity-definition {
    max-width: 200px;
  }
}
</style>

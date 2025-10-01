<!-- src/components/SCloud/SCloudModel.vue -->
<template>
  <div class="scloud-model">
    <div class="model-header">
      <div class="format-tabs">
        <div class="format-label">FORMATS:</div>
        <div class="format-tab active">TABULAR</div>
        <div class="format-tab">HIERARCHICAL</div>
      </div>
    </div>

    <div class="model-content">
      <div class="model-title">
        <h2>Model</h2>
      </div>

      <div class="model-section">
        <h3>Model</h3>
      </div>

      <div class="model-properties">
        <table class="properties-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>CLoud</td>
            </tr>
            <tr>
              <td>Definition</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>Scope</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>Viewpoint</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>Purpose</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>Source</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>Author</td>
              <td>JESUS</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SCloudModel',
  data() {
    return {
      // Model data can be added here if needed
    }
  }
}
</script>

<style scoped>
.scloud-model {
  padding: 20px;
  background: #fff;
  min-height: 100%;
}

.model-header {
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

.model-content {
  background: #fff;
}

.model-title {
  background: #ffffaa;
  border: 2px solid #000;
  padding: 10px;
  margin-bottom: 10px;
}

.model-title h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #000;
  font-family: 'Times New Roman', serif;
}

.model-section {
  background: #a0a0a4;
  border: 2px solid #000;
  padding: 10px;
  margin-bottom: 20px;
}

.model-section h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #000;
  font-family: 'Times New Roman', serif;
}

.model-properties {
  margin-top: 20px;
}

.properties-table {
  width: 100%;
  border-collapse: collapse;
  border: 2px solid #000;
}

.properties-table th {
  background: #64b1ff;
  color: #000;
  padding: 12px;
  text-align: left;
  font-weight: bold;
  border: 2px solid #000;
  font-size: 14px;
}

.properties-table td {
  background: #fff;
  color: #000;
  padding: 12px;
  border: 2px solid #000;
  font-size: 14px;
}

.properties-table tr:nth-child(even) td {
  background: #f9f9f9;
}

.properties-table tr:hover td {
  background: #f0f8ff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .scloud-model {
    padding: 15px;
  }
  
  .format-tabs {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .properties-table {
    font-size: 12px;
  }
  
  .properties-table th,
  .properties-table td {
    padding: 8px;
  }
}
</style>

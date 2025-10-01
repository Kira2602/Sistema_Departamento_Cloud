<!-- src/views/SCloud.vue -->
<template>
  <div class="scloud-container">
    <header>
      <NavbarComponent />
    </header>

    <div class="scloud-layout">
      <!-- Navigation Sidebar -->
      <div class="scloud-sidebar">
        <div class="sidebar-header">
          <img src="../img/logoHagenCo.png" alt="Company Logo" class="company-logo" />
        </div>
        
        <div class="sidebar-content">
          <div class="sidebar-nav">
            <button class="btn back-btn" @click="goToABMCloud">← Recursos Cloud</button>
          </div>
          
          <h3>Report Components:</h3>
          <nav class="component-nav">
            <ul>
              <li>
                <a href="#" @click.prevent="showSection('picture')" 
                   :class="{ active: currentSection === 'picture' }">
                  1. Seccion Idef0
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="showSection('model')" 
                   :class="{ active: currentSection === 'model' }">
                  2. Seccion Modelos
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="showSection('activity')" 
                   :class="{ active: currentSection === 'activity' }">
                  3. Seccion de actividades
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="showSection('arrow')" 
                   :class="{ active: currentSection === 'arrow' }">
                  4. Seccion de Arrows
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="scloud-main">
        <div class="main-header">
          <h1>Departamento Cloud</h1>
        </div>
        
        <div class="main-content">
          <!-- Picture Section -->
          <SCloudPicture v-if="currentSection === 'picture'" />
          
          <!-- Model Section -->
          <SCloudModel v-if="currentSection === 'model'" />
          
          <!-- Activity Section -->
          <SCloudActivity v-if="currentSection === 'activity'" />
          
          <!-- Arrow Section -->
          <SCloudArrow v-if="currentSection === 'arrow'" />
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-content">
        <p>© 2025 Team If...Else | Cloud Department. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import NavbarComponent from '@/components/NavbarComponent.vue'
import SCloudPicture from '@/components/SCloud/SCloudPicture.vue'
import SCloudModel from '@/components/SCloud/SCloudModel.vue'
import SCloudActivity from '@/components/SCloud/SCloudActivity.vue'
import SCloudArrow from '@/components/SCloud/SCloudArrow.vue'

export default {
  name: 'SCloud',
  components: {
    NavbarComponent,
    SCloudPicture,
    SCloudModel,
    SCloudActivity,
    SCloudArrow
  },
  data() {
    return {
      currentSection: 'picture' // Default to picture section
    }
  },
  methods: {
    showSection(section) {
      this.currentSection = section
    },
    goToABMCloud() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
  padding: 0;
  margin: 0;
}

:global(body) {
  padding-top: 120px;
}

.scloud-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.scloud-layout {
  display: flex;
  min-height: calc(100vh - 200px);
}

.scloud-sidebar {
  width: 200px;
  background: #7aa9d8;
  color: #fff;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.sidebar-header {
  text-align: center;
  margin-bottom: 20px;
}

.company-logo {
  max-width: 100px;
  height: auto;
}

.sidebar-nav {
  margin-bottom: 20px;
}

.back-btn {
  width: 100%;
  padding: 10px 15px;
  background: #e0c58f;
  color: #2c2b2b;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.back-btn:hover {
  background: #c9b57a;
  transform: translateY(-1px);
}

.sidebar-content h3 {
  color: #fff;
  margin-bottom: 15px;
  font-size: 14px;
}

.component-nav ul {
  list-style: none;
  padding: 0;
}

.component-nav li {
  margin-bottom: 10px;
}

.component-nav a {
  color: #fff;
  text-decoration: none;
  display: block;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
  font-size: 12px;
}

.component-nav a:hover,
.component-nav a.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.scloud-main {
  flex: 1;
  background: #7aa9d8;
  display: flex;
  flex-direction: column;
}

.main-header {
  text-align: center;
  padding: 40px 20px;
  background: #7aa9d8;
}

.main-header h1 {
  font-size: 3rem;
  color: #000;
  font-weight: bold;
  font-family: 'Times New Roman', serif;
}

.main-content {
  flex: 1;
  background: #fff;
  margin: 0 20px 20px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.footer {
  background: #112250;
  padding: 30px 10px;
  text-align: center;
  color: #fff;
  margin-top: 30px;
  border-radius: 8px;
}

.footer-content {
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .scloud-layout {
    flex-direction: column;
  }
  
  .scloud-sidebar {
    width: 100%;
    padding: 15px;
  }
  
  .main-header h1 {
    font-size: 2rem;
  }
  
  .main-content {
    margin: 10px;
  }
}
</style>

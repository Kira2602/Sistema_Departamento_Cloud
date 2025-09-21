<template>
  <header>
    <nav>
      <div class="container">
        <!-- Toggle puro CSS (oculto) -->
        <input id="nav-toggle" type="checkbox" class="nav-toggle-checkbox" aria-label="Abrir/cerrar menú" />

        <ul class="nav-list">
          <!-- Izquierda: Logo + Wordmark -->
          <li class="nav-logo">
            <a class="logo" href="#" aria-label="Home">
              <img class="logo-img" src="../img/logo_cloud.png" alt="Logo Grafos" />
            </a>

            <span class="brand-wordmark">Departamento Cloud</span>

            <!-- Botón hamburguesa -->
            <label class="btn nav-toggle" for="nav-toggle" aria-label="Abrir/cerrar menú">
              <i class="fa fa-bars"></i>
            </label>
          </li>

          <!-- Derecha: Botón de cerrar sesión -->
          <li class="nav-center">
            <button class="logout-btn" @click="logout">Cerrar sesión</button>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import Swal from 'sweetalert2'

// Mismo esquema de colores que en ABMCloud.vue
const swal = Swal.mixin({
  background: '#fff7f7',
  color: '#3c507d',
  confirmButtonColor: '#e0c58f', // dorado suave
  cancelButtonColor: '#b8b8b8',  // gris suave
  confirmButtonText: 'Aceptar',
  cancelButtonText: 'Cancelar'
})

function logout() {
  swal.fire({
    title: '¿Estás seguro?',
    text: 'Tu sesión se cerrará y volverás al inicio.',
    icon: 'warning',
    showCancelButton: true
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = 'https://calidad-software-frontend.pages.dev'
    }
  })
}
</script>

<style lang="scss" scoped>
$primary-color: #c8d9e6;
$primary-color-light: rgba($primary-color, 0.2);
$shadow-color: #e1e5ee;
$break-point: 768px;

@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300&family=Poppins:wght@300&family=Bellota:wght@300;400;700&display=swap");

*,
*::before,
*::after { box-sizing: border-box; margin: 0; padding: 0; }

.container { max-width: 1200px; padding: 0; margin: 0 auto; }
ul, li { list-style: none; }
.nav-toggle-checkbox { display: none; }
.nav-toggle-checkbox:checked ~ .nav-list .nav-center { display: block !important; }

nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  width: 100%;
  z-index: 50;
  font-family: "Poppins", sans-serif;

  background: rgba(60, 80, 112, 0.85);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);

  .nav-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    min-height: 72px;
    width: 100%;

    .nav-logo {
      display: flex; align-items: center; gap: 0.75rem;

      .logo { display: inline-flex; align-items: center; text-decoration: none; cursor: default; }
      .logo-img {
        height: 36px; width: auto; opacity: .95;
        transition: transform .2s ease, filter .2s ease, opacity .2s ease;
      }
      .logo:hover .logo-img,
      .logo:focus .logo-img {
        transform: scale(1.06);
        filter: drop-shadow(0 0 10px rgba(200, 217, 230, 0.7));
        opacity: 1;
      }

      .brand-wordmark {
        font-family: "Bellota", cursive;
        font-weight: 700;
        font-size: 1.35rem;
        line-height: 1;
        letter-spacing: 0.02em;
        color: #ffffff;
        margin-left: 0.1rem;
        transform: translateY(1px);
        text-shadow: 0 0 6px rgba(200, 217, 230, 0.35);
      }

      .nav-toggle { display: none; margin-left: .25rem; cursor: pointer; }
    }

    .nav-center {
      display: flex;
      align-items: center;
    }
  }
}

/* Botón Cerrar sesión */
.logout-btn {
  padding: 0.6rem 1.2rem;
  background-color: #e0c58f;
  color: #2c2b2b;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.logout-btn:hover {
  background-color: #c9302c;
  color: #c8d9e6;
}

@media screen and (max-width: $break-point) {
  nav { padding: 0.6rem 0; }
  .nav-list { flex-direction: row; }
  .nav-center { margin-top: 0; }
}
</style>

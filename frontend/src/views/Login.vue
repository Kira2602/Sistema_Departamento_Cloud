<template>
  <div class="login-page">
    <div class="login-container">
      <!-- FORM -->
      <div class="login-form">
        <div class="login-form-inner">
          <div class="logo" aria-label="logo">
            <img src="../img/logo_cloud.png" alt="Logo Cloud" />
          </div>

          <h1>Iniciar Sesión</h1>
          <p class="body-text">Departamento de Cloud ☁️🖥️</p>

          <form @submit.prevent="onSubmit">
            <div class="login-form-group">
              <label for="username">Email <span class="required-star">*</span></label>
              <input
                id="username"
                type="email"
                placeholder="Ingresa tu email"
                v-model.trim="form.username"
                :disabled="loading"
                required
              />
            </div>

            <div class="login-form-group">
              <label for="pwd">Password <span class="required-star">*</span></label>
              <input
                id="pwd"
                :type="showPwd ? 'text' : 'password'"
                placeholder="Mínimo 8 caracteres"
                v-model="form.password"
                :disabled="loading"
                minlength="8"
                required
              />
            </div>
            <button 
              type="submit" 
              class="rounded-button login-cta" 
              :disabled="loading"
              :class="{ 'loading': loading }"
            >
              {{ loading ? '🔄 Iniciando sesión...' : 'Ingresar' }}
            </button>
          </form>
        </div>
      </div>

      <!-- ONBOARDING -->
      <div class="onboarding">
        <Swiper
          class="swiper-container"
          :modules="modules"
          :speed="600"
          :loop="true"
          :autoplay="{ delay: 3500, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          parallax
        >
          <!-- Slide 1 -->
          <SwiperSlide class="swiper-slide color-1">
            <div class="slide-image" data-swiper-parallax="-40%">
              <dotlottie-player
                class="lottie-box"
                autoplay
                loop
                mode="normal"
                background="transparent"
                src="https://lottie.host/cca2f728-108a-4655-a4dc-47039766e85d/70OBLSi0ef.lottie"
                aria-label="Animación Lottie 1"
              ></dotlottie-player>
            </div>
          </SwiperSlide>

          <!-- Slide 2 -->
          <SwiperSlide class="swiper-slide color-1">
            <div class="slide-image" data-swiper-parallax="-40%">
              <dotlottie-player
                class="lottie-box"
                autoplay
                loop
                mode="normal"
                background="transparent"
                src="https://lottie.host/0e5e8aa3-92ff-494a-ad03-343c2aeb8a0f/eNAqbCHXUR.lottie"
                aria-label="Animación Lottie 2"
              ></dotlottie-player>
            </div>
          </SwiperSlide>

          <!-- Slide 3 -->
          <SwiperSlide class="swiper-slide color-1">
            <div class="slide-image" data-swiper-parallax="-40%">
              <dotlottie-player
                class="lottie-box"
                autoplay
                loop
                mode="normal"
                background="transparent"
                src="https://lottie.host/3de65b8c-31c2-4eb1-bf48-d0ec0ca2925b/N69HliporY.lottie"
                aria-label="Animación Lottie 3"
              ></dotlottie-player>
            </div>
          </SwiperSlide>

          <div class="swiper-pagination" slot="pagination"></div>
        </Swiper>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, Parallax } from 'swiper/modules'
import { authService } from '@/services/authService.js'
import Swal from 'sweetalert2'
import 'swiper/css'
import 'swiper/css/pagination'

const modules = [Pagination, Autoplay, Parallax]

const form = reactive({
  username: '',
  password: '',
  remember: true,
})
const showPwd = ref(false)
const loading = ref(false)

const router = useRouter()

async function onSubmit() {
  if (loading.value) return
  
  // Validaciones básicas
  if (!form.username.trim() || !form.password.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Por favor ingresa tu email y contraseña.',
      background: '#fff7f7',
      color: '#3c507d',
      confirmButtonColor: '#e0c58f'
    })
    return
  }

  loading.value = true

  try {
    // Intentar autenticarse con el backend
    const response = await authService.signin(form.username, form.password)
    
    if (response.session && response.user) {
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Has iniciado sesión correctamente.',
        background: '#fff7f7',
        color: '#3c507d',
        confirmButtonColor: '#e0c58f',
        timer: 2000,
        showConfirmButton: false
      })

      // Navegar al ABM Cloud después de un breve delay
      setTimeout(() => {
        router.push({ name: 'abm-cloud' })
      }, 1500)
    }
  } catch (error) {
    console.error('Error de autenticación:', error)
    
    let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.'
    
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error
    } else if (error.message) {
      errorMessage = error.message
    }

    Swal.fire({
      icon: 'error',
      title: 'Error de autenticación',
      text: errorMessage,
      background: '#fff7f7',
      color: '#3c507d',
      confirmButtonColor: '#e0c58f'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Montserrat:wght@300;400;600;700&family=Bellota:wght@300;400;700&display=swap");

:root {
  --ff: "Poppins", "Montserrat", "Bellota", sans-serif;
  --bodybg: #fff;
  --primary-color: #3c507d;
  --grey: #112250;
  --placeholder: #3c507d;
  --white: #fff;
  --text: #333;
  --slider-bg: #eff3ff;
  --login-cta-hover: #112250;
}

* { margin: 0; padding: 0; }

html, body, #app { height: 100%; }

html, body {
  font-family: var(--ff) !important; 
  background: var(--bodybg);
}

h1, h2, h3, p, label, input, button, a, span, div {
  font-family: var(--ff) !important;
}

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background: var(--bodybg);
}

.login-container {
  display: flex;
  max-width: 1200px;
  background: var(--white);
  margin: 0 auto;
  width: 100%;
  min-width: 320px;
  min-height: 100vh;
  border-top: 1px solid transparent;
}

.logo img { height: 70px; width: 70px; object-fit: contain; display: block; }

.login-form {
  width: 50%;
  box-sizing: border-box;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  background: var(--white);
}

.login-form .login-form-inner { max-width: 380px; width: 95%; }

.login-cta {
  color: var(--white);
  text-decoration: none;
  border: 1px solid var(--primary-color);
  margin: 25px 0 35px;
  background: var(--primary-color);
  width: 100%;
  border-radius: 50px;
  padding: 13px 20px;
}
.login-cta:hover { background: var(--login-cta-hover); }
.login-cta:disabled { 
  opacity: 0.7; 
  cursor: not-allowed; 
  background: var(--grey);
}
.login-cta.loading {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.onboarding { flex: 1; background: var(--slider-bg); display: none; width: 50%; }

.onboarding .swiper-container { width: 100%; height: 100%; margin-left: auto; margin-right: auto; }
.onboarding .swiper-slide {
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  color: var(--text);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.onboarding .swiper-pagination-bullet-active { background-color: var(--primary-color); }

.slide-image {
  width: 100%;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
}

.lottie-box {
  width: clamp(320px, 80%, 700px);
  height: clamp(280px, 65vh, 560px);
}

.slide-content { width: 60%; text-align: center; }
.slide-content h2 { font-size: 22px; font-weight: 500; margin-bottom: 15px; }
.slide-content p { font-size: 16px; line-height: 22px; font-weight: 300; }

.swiper-pagination-bullets { bottom: 30px !important; }

.login-form .login-form-inner h1 { margin-bottom: 20px; margin-top: 10px; }
.login-form-group { position: relative; display: flex; flex-direction: column; margin-bottom: 20px; }
.login-form-group label { font-size: 14px; font-weight: 500; color: var(--text); margin-bottom: 10px; }

.login-form-group input {
  padding: 13px 20px;
  box-sizing: border-box;
  border: 1px solid var(--grey);
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
  transition: linear 0.2s;
}
.login-form-group input:focus { outline: none; border: 1px solid var(--primary-color); }
.login-form-group input::placeholder { color: var(--placeholder); font-weight: 300; font-size: 14px; }

/* responsive */
@media screen and (min-width: 768px) { .onboarding { display: flex; } }
@media screen and (max-width: 767px) { .login-container { min-height: 100vh; } }
@media screen and (width: 768px) {
  .onboarding { order: 0; }
  .login-form { order: 1; }
  .login-container { min-height: 100vh; }
}
@media screen and (max-width: 420px) {
  .login-form { padding: 20px; }
  .login-form-group { margin-bottom: 16px; }
  .login-container { margin: 0; }
}
</style>

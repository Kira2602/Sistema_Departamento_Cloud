import { createRouter, createWebHistory } from 'vue-router'
import ABMCloud from '../views/ABMCloud.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/abm-cloud',
      name: 'ABMCloud',
      component: ABMCloud
    },
  ],
})

export default router

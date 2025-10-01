import { createRouter, createWebHistory } from 'vue-router'
import ABMCloud from '../views/ABMCloud.vue'
import Login from '../views/Login.vue'
import SCloud from '../views/SCloud.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'ABMCloud',
      component: ABMCloud
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/scloud',
      name: 'SCloud',
      component: SCloud
    },
  ],
})

export default router

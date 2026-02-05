import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/employee',
      name: 'employee',
      component: () => import('@/views/employee/EmployeeDashboard.vue'),
    },
    {
      path: '/manager',
      name: 'manager',
      component: () => import('@/views/manager/ManagerDashboard.vue'),
    },
  ],
})

export default router

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
    // Employee routes
    {
      path: '/employee',
      name: 'employee',
      component: () => import('@/views/employee/EmployeeDashboard.vue'),
    },
    {
      path: '/employee/lottery',
      name: 'employee-lottery',
      component: () => import('@/views/employee/EmployeeLottery.vue'),
    },
    {
      path: '/employee/leaderboard',
      name: 'employee-leaderboard',
      component: () => import('@/views/employee/EmployeeLeaderboard.vue'),
    },
    // Manager routes
    {
      path: '/manager',
      name: 'manager',
      component: () => import('@/views/manager/ManagerDashboard.vue'),
    },
    {
      path: '/manager/reviews',
      name: 'manager-reviews',
      component: () => import('@/views/manager/ManagerReviews.vue'),
    },
    {
      path: '/manager/leaderboard',
      name: 'manager-leaderboard',
      component: () => import('@/views/manager/ManagerLeaderboard.vue'),
    },
  ],
})

export default router

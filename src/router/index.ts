import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import * as authService from '@/lib/services/auth.service'
import { useUserStore, useGameStore, useRewardStore, useLeaderboardStore } from '@/stores'

// Track if stores have been initialized
let storesInitialized = false

// Initialize all stores
async function initializeStores(profile: Awaited<ReturnType<typeof authService.getCurrentProfile>>) {
  if (storesInitialized || !profile) return

  const userStore = useUserStore()
  const gameStore = useGameStore()
  const rewardStore = useRewardStore()
  const leaderboardStore = useLeaderboardStore()

  // Set current user
  userStore.setCurrentUser(profile)

  // Fetch all data in parallel
  await Promise.all([
    userStore.fetchUsers(),
    userStore.fetchMonthlyEarnings(),
    gameStore.fetchAll(),
    rewardStore.fetchAll(),
    leaderboardStore.fetchHistory(),
  ])

  storesInitialized = true
}

// Reset stores initialization flag on logout
export function resetStoresInitialized() {
  storesInitialized = false
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    // Auth routes
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterPage.vue'),
      meta: { guest: true },
    },
    // Employee routes
    {
      path: '/employee',
      name: 'employee',
      component: () => import('@/views/employee/EmployeeDashboard.vue'),
      meta: { requiresAuth: true, role: 'employee' },
    },
    {
      path: '/employee/leaderboard',
      name: 'employee-leaderboard',
      component: () => import('@/views/employee/EmployeeLeaderboard.vue'),
      meta: { requiresAuth: true, role: 'employee' },
    },
    {
      path: '/employee/lottery',
      name: 'employee-lottery',
      component: () => import('@/views/employee/EmployeeLottery.vue'),
      meta: { requiresAuth: true, role: 'employee' },
    },
    {
      path: '/employee/redeem',
      name: 'employee-redeem',
      component: () => import('@/views/employee/EmployeeRedeem.vue'),
      meta: { requiresAuth: true, role: 'employee' },
    },
    // Manager routes
    {
      path: '/manager',
      name: 'manager',
      component: () => import('@/views/manager/ManagerDashboard.vue'),
      meta: { requiresAuth: true, role: 'manager' },
    },
    {
      path: '/manager/reviews',
      name: 'manager-reviews',
      component: () => import('@/views/manager/ManagerReviews.vue'),
      meta: { requiresAuth: true, role: 'manager' },
    },
    {
      path: '/manager/leaderboard',
      name: 'manager-leaderboard',
      component: () => import('@/views/manager/ManagerLeaderboard.vue'),
      meta: { requiresAuth: true, role: 'manager' },
    },
    {
      path: '/manager/rewards',
      name: 'manager-rewards',
      component: () => import('@/views/manager/ManagerRewards.vue'),
      meta: { requiresAuth: true, role: 'manager' },
    },
  ],
})

// Navigation guard
router.beforeEach(async (to, _from, next) => {
  // Handle home route - redirect based on auth status
  if (to.path === '/') {
    try {
      const profile = await authService.getCurrentProfile()
      if (profile) {
        // Logged in - go to dashboard based on role
        await initializeStores(profile)
        return next({ name: profile.role === 'manager' ? 'manager' : 'employee' })
      } else {
        // Not logged in - go to login
        return next({ name: 'login' })
      }
    } catch {
      return next({ name: 'login' })
    }
  }

  // Skip auth check for guest routes
  if (to.meta.guest) {
    try {
      const profile = await authService.getCurrentProfile()
      if (profile) {
        // Already logged in, initialize stores and redirect to dashboard
        await initializeStores(profile)
        return next({ name: profile.role === 'manager' ? 'manager' : 'employee' })
      }
    } catch {
      // Ignore errors for guest routes
    }
    return next()
  }

  // Check auth for protected routes
  if (to.meta.requiresAuth) {
    try {
      const profile = await authService.getCurrentProfile()

      if (!profile) {
        return next({ name: 'login', query: { redirect: to.fullPath } })
      }

      // Initialize stores if not already done
      await initializeStores(profile)

      // Check role if specified
      if (to.meta.role && profile.role !== to.meta.role) {
        return next({ name: profile.role === 'manager' ? 'manager' : 'employee' })
      }

      return next()
    } catch {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }
  }

  next()
})

export default router

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([
    { id: '1', name: 'Hiếu', role: 'employee', coins: 150, streak: 3 },
    { id: '2', name: 'Linh', role: 'employee', coins: 280, streak: 5 },
    { id: '3', name: 'Nam', role: 'employee', coins: 95, streak: 1 },
    { id: '4', name: 'Trang', role: 'employee', coins: 120, streak: 2 },
    { id: '5', name: 'Minh', role: 'manager', coins: 0, streak: 0 },
  ])

  const currentUser = ref<User | null>(users.value[0] ?? null)

  // Getters
  const employees = computed(() =>
    users.value.filter(u => u.role === 'employee')
  )

  const leaderboard = computed(() =>
    [...employees.value].sort((a, b) => b.coins - a.coins)
  )

  const isManager = computed(() =>
    currentUser.value?.role === 'manager'
  )

  // Actions
  const setCurrentUser = (userId: string) => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      currentUser.value = user
    }
  }

  const switchRole = (role: 'employee' | 'manager') => {
    if (role === 'manager') {
      const manager = users.value.find(u => u.role === 'manager')
      if (manager) {
        currentUser.value = manager
      }
    } else {
      const employee = users.value.find(u => u.role === 'employee')
      if (employee) {
        currentUser.value = employee
      }
    }
  }

  const addCoins = (userId: string, amount: number) => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.coins += amount
    }
  }

  const updateStreak = (userId: string) => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.streak += 1
    }
  }

  return {
    // State
    users,
    currentUser,
    // Getters
    employees,
    leaderboard,
    isManager,
    // Actions
    setCurrentUser,
    switchRole,
    addCoins,
    updateStreak,
  }
})

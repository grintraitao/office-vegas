import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([
    { id: '1', name: 'Quoc', nickname: 'Tiểu Nhân', role: 'employee', coins: 150 },
    { id: '2', name: 'Tín', nickname: 'Thầy Tín', role: 'employee', coins: 280 },
    { id: '3', name: 'Long', nickname: 'Vietlish Expert', role: 'employee', coins: 95 },
    { id: '4', name: 'Tùng', nickname: 'Tung Tung Tung Sahur', role: 'employee', coins: 120 },
    { id: '5', name: 'Hiếu', nickname: 'Hiếu thứ 3', role: 'manager', coins: 0 },
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
  }
})

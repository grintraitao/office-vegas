import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { DbUser } from '@/types/database'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<DbUser[]>([])
  const currentUser = ref<DbUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const employees = computed(() => users.value.filter((u) => u.role === 'employee'))

  const managers = computed(() => users.value.filter((u) => u.role === 'manager'))

  const leaderboard = computed(() => [...employees.value].sort((a, b) => b.coins - a.coins))

  const isManager = computed(() => currentUser.value?.role === 'manager')

  const isAuthenticated = computed(() => !!currentUser.value)

  // Actions

  // Fetch all users
  const fetchUsers = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .order('coins', { ascending: false })

      if (fetchError) throw fetchError

      users.value = data ?? []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch users'
      console.error('fetchUsers error:', e)
    } finally {
      loading.value = false
    }
  }

  // Fetch current user by auth_id
  const fetchCurrentUser = async (authId: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .single()

      if (fetchError) throw fetchError

      currentUser.value = data
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch current user'
      console.error('fetchCurrentUser error:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  // Set current user (for switching in demo mode or after login)
  const setCurrentUser = (user: DbUser | null) => {
    currentUser.value = user
  }

  // Add coins to user
  const addCoins = async (userId: string, amount: number) => {
    try {
      // Find user in local state
      const user = users.value.find((u) => u.id === userId)
      if (!user) return false

      const newCoins = user.coins + amount

      // Update in database
      const { error: updateError } = await supabase
        .from('users')
        .update({ coins: newCoins })
        .eq('id', userId)

      if (updateError) throw updateError

      // Update local state
      user.coins = newCoins

      // Update currentUser if it's the same user
      if (currentUser.value?.id === userId) {
        currentUser.value.coins = newCoins
      }

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update coins'
      console.error('addCoins error:', e)
      return false
    }
  }

  // Update user profile
  const updateProfile = async (userId: string, updates: Partial<Pick<DbUser, 'name' | 'nickname'>>) => {
    try {
      loading.value = true
      error.value = null

      const { error: updateError } = await supabase.from('users').update(updates).eq('id', userId)

      if (updateError) throw updateError

      // Update local state
      const user = users.value.find((u) => u.id === userId)
      if (user) {
        Object.assign(user, updates)
      }

      if (currentUser.value?.id === userId) {
        Object.assign(currentUser.value, updates)
      }

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update profile'
      console.error('updateProfile error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  // Clear state (on logout)
  const clearState = () => {
    currentUser.value = null
    users.value = []
    error.value = null
  }

  // Get user by ID
  const getUserById = (userId: string) => {
    return users.value.find((u) => u.id === userId)
  }

  return {
    // State
    users,
    currentUser,
    loading,
    error,
    // Getters
    employees,
    managers,
    leaderboard,
    isManager,
    isAuthenticated,
    // Actions
    fetchUsers,
    fetchCurrentUser,
    setCurrentUser,
    addCoins,
    updateProfile,
    clearState,
    getUserById,
  }
})

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
  const monthlyEarnings = ref<Map<string, number>>(new Map())

  // Getters
  const employees = computed(() => users.value.filter((u) => u.role === 'employee'))

  const managers = computed(() => users.value.filter((u) => u.role === 'manager'))

  // Leaderboard sorted by monthly earnings (not current coins)
  const leaderboard = computed(() => {
    return [...employees.value]
      .map((emp) => ({
        ...emp,
        monthlyCoins: monthlyEarnings.value.get(emp.id) ?? 0,
      }))
      .sort((a, b) => b.monthlyCoins - a.monthlyCoins)
  })

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
    monthlyEarnings.value = new Map()
    error.value = null
  }

  // Add to monthly earnings (when a new positive transaction happens)
  const addMonthlyEarnings = (userId: string, amount: number) => {
    if (amount > 0) {
      const current = monthlyEarnings.value.get(userId) ?? 0
      monthlyEarnings.value.set(userId, current + amount)
    }
  }

  // Fetch monthly earnings for all users (current month)
  const fetchMonthlyEarnings = async () => {
    try {
      // Get first day of current month
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      // Fetch positive transactions (earnings) for current month
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('user_id, amount')
        .gte('created_at', firstDayOfMonth)
        .gt('amount', 0) // Only positive amounts (earnings)

      if (fetchError) throw fetchError

      // Sum earnings by user
      const earnings = new Map<string, number>()
      for (const tx of data ?? []) {
        const current = earnings.get(tx.user_id) ?? 0
        earnings.set(tx.user_id, current + tx.amount)
      }

      monthlyEarnings.value = earnings
    } catch (e) {
      console.error('fetchMonthlyEarnings error:', e)
    }
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
    monthlyEarnings,
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
    fetchMonthlyEarnings,
    addMonthlyEarnings,
  }
})

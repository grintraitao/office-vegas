import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

// Auth state
const authUser = ref<User | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Initialize auth state
const initAuth = async () => {
  try {
    loading.value = true
    error.value = null

    // Get current session
    const { data: { session } } = await supabase.auth.getSession()
    authUser.value = session?.user ?? null

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      authUser.value = session?.user ?? null
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Auth initialization failed'
  } finally {
    loading.value = false
  }
}

export function useAuth() {
  // Computed
  const isAuthenticated = computed(() => !!authUser.value)
  const userEmail = computed(() => authUser.value?.email ?? null)

  // Sign up with email/password
  const signUp = async (
    email: string,
    password: string,
    metadata?: { name?: string; nickname?: string; role?: 'employee' | 'manager' }
  ) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (signUpError) throw signUpError

      return { success: true, user: data.user }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Sign up failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      return { success: true, user: data.user }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Sign in failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      loading.value = true
      error.value = null

      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError

      authUser.value = null
      return { success: true }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Sign out failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      loading.value = true
      error.value = null

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
      if (resetError) throw resetError

      return { success: true }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Reset password failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    authUser,
    loading,
    error,
    // Computed
    isAuthenticated,
    userEmail,
    // Actions
    initAuth,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }
}

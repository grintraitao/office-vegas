import { supabase } from '@/lib/supabase'
import type { DbUser } from '@/types/database'

interface SignUpParams {
  email: string
  password: string
  name: string
  nickname: string
  role: 'employee' | 'manager'
}

interface SignInParams {
  email: string
  password: string
}

interface AuthResult {
  user: DbUser | null
  profile: DbUser
}

// Sign up new user
export async function signUp(params: SignUpParams): Promise<AuthResult> {
  const { email, password, name, nickname, role } = params

  // Create auth user with metadata
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        nickname,
        role,
      },
    },
  })

  if (error) throw error
  if (!data.user) throw new Error('Đăng ký thất bại')

  // Wait a moment for trigger to create profile
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Fetch the created profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', data.user.id)
    .single()

  if (profileError) throw profileError

  return { user: profile, profile }
}

// Sign in existing user
export async function signIn(params: SignInParams): Promise<AuthResult> {
  const { email, password } = params

  console.log('Signing in with:', email)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  console.log('Auth result:', { data, error })

  if (error) throw error
  if (!data.user) throw new Error('Đăng nhập thất bại')

  console.log('Fetching profile for auth_id:', data.user.id)

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', data.user.id)
    .single()

  console.log('Profile result:', { profile, profileError })

  if (profileError) throw profileError

  return { user: profile, profile }
}

// Sign out
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current session
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// Get current user profile
export async function getCurrentProfile(): Promise<DbUser | null> {
  const session = await getSession()
  if (!session?.user) return null

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', session.user.id)
    .single()

  if (error) return null
  return profile
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: DbUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', session.user.id)
        .single()

      callback(profile)
    } else {
      callback(null)
    }
  })
}

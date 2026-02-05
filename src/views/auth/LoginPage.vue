<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui'
import { useUserStore } from '@/stores'
import * as authService from '@/lib/services/auth.service'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Vui lòng nhập email và mật khẩu'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { profile } = await authService.signIn({
      email: email.value,
      password: password.value,
    })

    userStore.setCurrentUser(profile)

    // Navigate based on role
    if (profile.role === 'manager') {
      router.push('/manager')
    } else {
      router.push('/employee')
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Đăng nhập thất bại'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
    <div class="card shadow-2xl w-full max-w-md p-8">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-base">
          <span class="text-3xl">🎰</span> OfficeVegas
        </h1>
        <p class="text-muted mt-2">Đăng nhập để tiếp tục</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-base mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="email@company.com"
            class="w-full px-4 py-3 border border-theme rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            :disabled="loading"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-base mb-1">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-3 border border-theme rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            :disabled="loading"
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <!-- Submit -->
        <Button
          type="submit"
          variant="primary"
          size="lg"
          class="w-full"
          :disabled="loading"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Đang đăng nhập...
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            🚀 Đăng nhập
          </span>
        </Button>
      </form>

      <!-- Register link -->
      <div class="mt-6 text-center">
        <span class="text-muted">Chưa có tài khoản? </span>
        <router-link to="/register" class="text-indigo-600 hover:text-indigo-700 font-medium">
          Đăng ký
        </router-link>
      </div>
    </div>
  </div>
</template>

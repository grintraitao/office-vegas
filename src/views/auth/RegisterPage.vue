<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui'
import * as authService from '@/lib/services/auth.service'

const router = useRouter()

const name = ref('')
const nickname = ref('')
const email = ref('')
const password = ref('')
const role = ref<'employee' | 'manager'>('employee')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  if (!name.value || !nickname.value || !email.value || !password.value) {
    error.value = 'Vui lòng điền đầy đủ thông tin'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Mật khẩu phải có ít nhất 6 ký tự'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await authService.signUp({
      email: email.value,
      password: password.value,
      name: name.value,
      nickname: nickname.value,
      role: role.value,
    })

    // Navigate to login
    router.push('/login')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Đăng ký thất bại'
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
        <p class="text-muted mt-2">Tạo tài khoản mới</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-base mb-1">Tên</label>
          <input
            v-model="name"
            type="text"
            placeholder="Nguyễn Văn A"
            class="w-full px-4 py-3 border border-theme rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            :disabled="loading"
          />
        </div>

        <!-- Nickname -->
        <div>
          <label class="block text-sm font-medium text-base mb-1">Nickname</label>
          <input
            v-model="nickname"
            type="text"
            placeholder="AnhA"
            class="w-full px-4 py-3 border border-theme rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            :disabled="loading"
          />
        </div>

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
            placeholder="Tối thiểu 6 ký tự"
            class="w-full px-4 py-3 border border-theme rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            :disabled="loading"
          />
        </div>

        <!-- Role -->
        <div>
          <label class="block text-sm font-medium text-base mb-2">Vai trò</label>
          <div class="flex gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="role"
                type="radio"
                value="employee"
                class="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                :disabled="loading"
              />
              <span class="text-base">Employee</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="role"
                type="radio"
                value="manager"
                class="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                :disabled="loading"
              />
              <span class="text-base">Manager</span>
            </label>
          </div>
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
            Đang đăng ký...
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            📝 Đăng ký
          </span>
        </Button>
      </form>

      <!-- Login link -->
      <div class="mt-6 text-center">
        <span class="text-muted">Đã có tài khoản? </span>
        <router-link to="/login" class="text-indigo-600 hover:text-indigo-700 font-medium">
          Đăng nhập
        </router-link>
      </div>
    </div>
  </div>
</template>

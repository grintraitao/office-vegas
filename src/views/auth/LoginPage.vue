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

const features = [
  { icon: '🎯', title: 'Submit Outcomes', desc: 'Báo cáo công việc hàng ngày, nhận coins thưởng' },
  { icon: '🎰', title: 'Xổ số may mắn', desc: 'Thử vận may với coins, nhân đôi hoặc mất trắng!' },
  { icon: '🎁', title: 'Đổi thưởng thật', desc: 'Coffee, pizza, về sớm... đổi coins lấy đặc quyền' },
  { icon: '🏆', title: 'Leaderboard', desc: 'Cạnh tranh với đồng nghiệp, leo top nhận bonus' },
]

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
  <div class="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
    <!-- Floating decorations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 text-6xl animate-float opacity-20">🎰</div>
      <div class="absolute top-40 right-20 text-5xl animate-float-delayed opacity-20">💰</div>
      <div class="absolute bottom-32 left-1/4 text-4xl animate-float opacity-20">🎲</div>
      <div class="absolute bottom-20 right-1/3 text-5xl animate-float-delayed opacity-20">🏆</div>
      <div class="absolute top-1/3 left-1/3 text-3xl animate-float opacity-10">✨</div>
    </div>

    <div class="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-6 lg:p-12">
      <!-- Left side - Hero content -->
      <div class="flex-1 max-w-xl text-white text-center lg:text-left">
        <!-- Logo -->
        <div class="mb-6">
          <span class="text-7xl lg:text-8xl inline-block animate-bounce-slow">🎰</span>
        </div>

        <h1 class="text-4xl lg:text-6xl font-bold mb-4">
          Office<span class="text-yellow-300">Vegas</span>
        </h1>

        <p class="text-xl lg:text-2xl text-white/90 mb-6">
          Biến công việc nhàm chán thành cuộc chơi thú vị!
        </p>

        <p class="text-lg text-white/70 mb-8">
          Gamify your daily outcomes • Earn coins • Win rewards
        </p>

        <!-- Features grid -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left hover:bg-white/20 transition-all hover:scale-105"
          >
            <span class="text-3xl mb-2 block">{{ feature.icon }}</span>
            <h3 class="font-semibold text-white mb-1">{{ feature.title }}</h3>
            <p class="text-sm text-white/70">{{ feature.desc }}</p>
          </div>
        </div>

        <!-- Fun tagline -->
        <div class="hidden lg:block">
          <p class="text-white/60 text-sm italic">
            "Việc ngày mai, chớ để hôm nay..." - Một nô lệ văn phòng nào đó
          </p>
        </div>
      </div>

      <!-- Right side - Login form -->
      <div class="w-full max-w-md">
        <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
          <!-- Header -->
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Chào mừng trở lại!</h2>
            <p class="text-gray-500 mt-1">Đăng nhập để bắt đầu kiếm coins</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
                <input
                  v-model="email"
                  type="email"
                  placeholder="email@company.com"
                  class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 text-gray-900"
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input
                  v-model="password"
                  type="password"
                  placeholder="••••••••"
                  class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 text-gray-900"
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Error -->
            <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <span>⚠️</span>
              {{ error }}
            </div>

            <!-- Submit -->
            <Button
              type="submit"
              variant="primary"
              size="lg"
              class="w-full !py-4 !text-lg"
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
                🚀 Vào game thôi!
              </span>
            </Button>
          </form>

          <!-- Divider -->
          <div class="my-6 flex items-center gap-4">
            <div class="flex-1 h-px bg-gray-200"></div>
            <span class="text-gray-400 text-sm">hoặc</span>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>

          <!-- Register link -->
          <div class="text-center">
            <p class="text-gray-500 mb-3">Chưa có tài khoản?</p>
            <router-link
              to="/register"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-all hover:scale-105"
            >
              ✨ Tạo tài khoản mới
            </router-link>
          </div>

          <!-- Fun footer -->
          <div class="mt-6 pt-4 border-t border-gray-100 text-center">
            <p class="text-xs text-gray-400">
              🎲 Nhớ nhé: Làm nhiều = Coins nhiều = Thưởng nhiều!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-5deg); }
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 5s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}
</style>

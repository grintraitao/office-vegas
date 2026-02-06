<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { CoinDisplay } from '@/components/ui'
import { useThemeStore, useUserStore, themes } from '@/stores'
import { signOut } from '@/lib/services/auth.service'
import { resetStoresInitialized } from '@/router'
import type { User } from '@/types'

interface Props {
  user: User
}

defineProps<Props>()

const router = useRouter()
const userStore = useUserStore()

const emit = defineEmits<{
  'switch-role': [role: 'employee' | 'manager']
}>()

const themeStore = useThemeStore()
const showThemeDropdown = ref(false)
const themeDropdownRef = ref<HTMLElement | null>(null)

const toggleThemeDropdown = () => {
  showThemeDropdown.value = !showThemeDropdown.value
}

const selectTheme = (themeName: typeof themeStore.currentTheme) => {
  themeStore.setTheme(themeName)
  showThemeDropdown.value = false
}

const handleLogout = async () => {
  try {
    await signOut()
    userStore.clearState()
    resetStoresInitialized()
    router.push('/login')
  } catch (e) {
    console.error('Logout error:', e)
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (themeDropdownRef.value && !themeDropdownRef.value.contains(event.target as Node)) {
    showThemeDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-40 glass-dark h-16">
    <div class="max-w-5xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 text-xl font-bold">
        <span>🎰</span>
        <span class="text-gradient">OfficeVegas</span>
      </router-link>

      <div class="flex items-center gap-3 sm:gap-6">
        <CoinDisplay :amount="user.coins" size="md" />

        <!-- Theme Selector -->
        <div ref="themeDropdownRef" class="relative">
          <button
            class="flex items-center gap-1 px-2 py-1.5 rounded-lg card hover:brightness-110 transition-all"
            @click.stop="toggleThemeDropdown"
          >
            <span class="text-lg">{{ themeStore.getCurrentTheme()?.icon }}</span>
            <svg class="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="showThemeDropdown"
            class="absolute right-0 top-full mt-2 py-2 w-40 rounded-xl shadow-xl z-50 bg-elevated border border-theme"
          >
            <button
              v-for="theme in themes"
              :key="theme.name"
              class="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-elevated transition-colors"
              :class="themeStore.currentTheme === theme.name ? 'text-base bg-elevated' : 'text-muted'"
              @click="selectTheme(theme.name)"
            >
              <span>{{ theme.icon }}</span>
              <span>{{ theme.label }}</span>
              <span v-if="themeStore.currentTheme === theme.name" class="ml-auto text-primary">✓</span>
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <div class="text-right hidden sm:block">
            <div class="text-sm font-medium text-base">{{ user.nickname }}</div>
            <div class="text-xs text-muted capitalize">{{ user.role }}</div>
          </div>

          <div class="flex gap-1 card p-1">
            <button
              :class="[
                'px-3 py-1 text-sm font-medium rounded-md transition-all duration-200',
                user.role === 'employee'
                  ? 'btn-primary shadow-lg'
                  : 'text-muted hover:text-base hover:bg-elevated'
              ]"
              @click="emit('switch-role', 'employee')"
            >
              Employee
            </button>
            <button
              :class="[
                'px-3 py-1 text-sm font-medium rounded-md transition-all duration-200',
                user.role === 'manager'
                  ? 'btn-primary shadow-lg'
                  : 'text-muted hover:text-base hover:bg-elevated'
              ]"
              @click="emit('switch-role', 'manager')"
            >
              Manager
            </button>
          </div>

          <!-- Logout button -->
          <button
            class="p-2 rounded-lg card hover:brightness-110 transition-all text-muted hover:text-base"
            title="Đăng xuất"
            @click="handleLogout"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

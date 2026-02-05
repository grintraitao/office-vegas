<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { CoinDisplay } from '@/components/ui'
import type { User } from '@/types'

interface Props {
  user: User
}

defineProps<Props>()

const emit = defineEmits<{
  'switch-role': [role: 'employee' | 'manager']
}>()

// Theme management
const themes = [
  { name: 'light', icon: '☀️', label: 'Light' },
  { name: 'dark', icon: '🌙', label: 'Dark' },
  { name: 'night', icon: '🌃', label: 'Night' },
  { name: 'luxury', icon: '💎', label: 'Luxury' },
  { name: 'cyberpunk', icon: '🤖', label: 'Cyberpunk' },
  { name: 'synthwave', icon: '🌆', label: 'Synthwave' },
  { name: 'retro', icon: '📺', label: 'Retro' },
  { name: 'valentine', icon: '💕', label: 'Valentine' },
  { name: 'halloween', icon: '🎃', label: 'Halloween' },
  { name: 'garden', icon: '🌷', label: 'Garden' },
  { name: 'forest', icon: '🌲', label: 'Forest' },
  { name: 'aqua', icon: '💧', label: 'Aqua' },
  { name: 'dracula', icon: '🧛', label: 'Dracula' },
  { name: 'coffee', icon: '☕', label: 'Coffee' },
  { name: 'cupcake', icon: '🧁', label: 'Cupcake' },
]

const currentTheme = ref('night')
const isDropdownOpen = ref(false)

const currentThemeIcon = computed(() => {
  return themes.find(t => t.name === currentTheme.value)?.icon || '🎨'
})

onMounted(() => {
  const saved = localStorage.getItem('theme') || 'night'
  currentTheme.value = saved
  applyTheme(saved)
})

const applyTheme = (theme: string) => {
  document.querySelector('html')?.setAttribute('data-theme', theme)
}

const setTheme = (theme: string) => {
  currentTheme.value = theme
  applyTheme(theme)
  localStorage.setItem('theme', theme)
  isDropdownOpen.value = false
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-40 bg-base-100 border-b border-base-300 shadow-sm h-16">
    <div class="max-w-5xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 text-lg sm:text-xl font-bold text-base-content">
        <span>🎰</span>
        <span class="hidden sm:inline">OfficeVegas</span>
      </router-link>

      <div class="flex items-center gap-2 sm:gap-4">
        <!-- Theme Selector -->
        <div class="relative">
          <button
            class="btn btn-ghost btn-sm btn-circle"
            @click="toggleDropdown"
          >
            <span class="text-lg">{{ currentThemeIcon }}</span>
          </button>

          <!-- Backdrop -->
          <div
            v-if="isDropdownOpen"
            class="fixed inset-0 z-40"
            @click="closeDropdown"
          />

          <!-- Dropdown Menu -->
          <div
            v-if="isDropdownOpen"
            class="absolute right-0 top-full mt-2 z-50 w-48 max-h-72 overflow-y-auto rounded-lg bg-base-100 shadow-xl border border-base-300"
          >
            <div class="p-2 text-xs font-semibold text-base-content/60 uppercase">
              Chọn Theme
            </div>
            <div class="py-1">
              <button
                v-for="theme in themes"
                :key="theme.name"
                :class="[
                  'w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-base-200 transition-colors',
                  currentTheme === theme.name ? 'bg-primary/10 text-primary' : 'text-base-content'
                ]"
                @click="setTheme(theme.name)"
              >
                <span>{{ theme.icon }}</span>
                <span>{{ theme.label }}</span>
                <span v-if="currentTheme === theme.name" class="ml-auto text-primary">✓</span>
              </button>
            </div>
          </div>
        </div>

        <CoinDisplay :amount="user.coins" size="md" />

        <div class="flex items-center gap-2 sm:gap-3">
          <div class="text-right hidden sm:block">
            <div class="text-sm font-medium text-base-content">{{ user.nickname }}</div>
            <div class="text-xs text-base-content/60 capitalize">{{ user.role }}</div>
          </div>

          <div class="join">
            <button
              :class="[
                'join-item btn btn-xs sm:btn-sm',
                user.role === 'employee' ? 'btn-primary' : 'btn-ghost'
              ]"
              @click="emit('switch-role', 'employee')"
            >
              Employee
            </button>
            <button
              :class="[
                'join-item btn btn-xs sm:btn-sm',
                user.role === 'manager' ? 'btn-primary' : 'btn-ghost'
              ]"
              @click="emit('switch-role', 'manager')"
            >
              Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

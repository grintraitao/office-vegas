<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
  { name: 'corporate', icon: '🏢', label: 'Corporate' },
  { name: 'autumn', icon: '🍂', label: 'Autumn' },
  { name: 'business', icon: '💼', label: 'Business' },
  { name: 'acid', icon: '🧪', label: 'Acid' },
  { name: 'lemonade', icon: '🍋', label: 'Lemonade' },
  { name: 'fantasy', icon: '🧚', label: 'Fantasy' },
  { name: 'wireframe', icon: '📐', label: 'Wireframe' },
  { name: 'black', icon: '⬛', label: 'Black' },
  { name: 'cmyk', icon: '🎨', label: 'CMYK' },
  { name: 'pastel', icon: '🎀', label: 'Pastel' },
]

const currentTheme = ref('night')

onMounted(() => {
  const saved = localStorage.getItem('theme') || 'night'
  currentTheme.value = saved
  document.documentElement.setAttribute('data-theme', saved)
})

const setTheme = (theme: string) => {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

const getCurrentThemeIcon = () => {
  return themes.find(t => t.name === currentTheme.value)?.icon || '🎨'
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-40 bg-base-100 border-b border-base-300 shadow-sm h-16">
    <div class="max-w-5xl mx-auto h-full px-6 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 text-xl font-bold text-base-content">
        <span>🎰</span>
        <span>OfficeVegas</span>
      </router-link>

      <div class="flex items-center gap-4">
        <!-- Theme Selector -->
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-sm btn-circle">
            <span class="text-lg">{{ getCurrentThemeIcon() }}</span>
          </label>
          <ul tabindex="0" class="dropdown-content z-[100] menu p-2 shadow-lg bg-base-200 rounded-box w-52 max-h-80 overflow-y-auto">
            <li class="menu-title"><span>Chọn Theme</span></li>
            <li v-for="theme in themes" :key="theme.name">
              <button
                :class="['flex items-center gap-2', currentTheme === theme.name ? 'active' : '']"
                @click="setTheme(theme.name)"
              >
                <span>{{ theme.icon }}</span>
                <span>{{ theme.label }}</span>
                <span v-if="currentTheme === theme.name" class="ml-auto">✓</span>
              </button>
            </li>
          </ul>
        </div>

        <CoinDisplay :amount="user.coins" size="md" />

        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <div class="text-sm font-medium text-base-content">{{ user.nickname }}</div>
            <div class="text-xs text-base-content/60 capitalize">{{ user.role }}</div>
          </div>

          <div class="join">
            <button
              :class="[
                'join-item btn btn-sm',
                user.role === 'employee' ? 'btn-primary' : 'btn-ghost'
              ]"
              @click="emit('switch-role', 'employee')"
            >
              Employee
            </button>
            <button
              :class="[
                'join-item btn btn-sm',
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

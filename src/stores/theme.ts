import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeName = 'light' | 'dark' | 'vegas' | 'cyberpunk' | 'luxury'

export interface Theme {
  name: ThemeName
  label: string
  icon: string
}

export const themes: Theme[] = [
  { name: 'light', label: 'Light', icon: '☀️' },
  { name: 'dark', label: 'Dark', icon: '🌙' },
  { name: 'vegas', label: 'Vegas', icon: '🎰' },
  { name: 'cyberpunk', label: 'Cyberpunk', icon: '🤖' },
  { name: 'luxury', label: 'Luxury', icon: '💎' },
]

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeName>('vegas')

  // Load theme from localStorage on init
  const savedTheme = localStorage.getItem('theme') as ThemeName | null
  if (savedTheme && themes.some(t => t.name === savedTheme)) {
    currentTheme.value = savedTheme
  }

  // Apply theme to document
  const applyTheme = (theme: ThemeName) => {
    document.documentElement.setAttribute('data-theme', theme)
  }

  // Watch for theme changes and apply
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }, { immediate: true })

  const setTheme = (theme: ThemeName) => {
    currentTheme.value = theme
  }

  const getCurrentTheme = () => {
    return themes.find(t => t.name === currentTheme.value) || themes[0]
  }

  return {
    currentTheme,
    themes,
    setTheme,
    getCurrentTheme,
  }
})

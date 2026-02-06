<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppLayout } from '@/components/layout'
import { useUserStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// Pages that don't need layout
const isAuthPage = computed(() =>
  route.path === '/' ||
  route.path === '/login' ||
  route.path === '/register'
)
const currentUser = computed(() => userStore.currentUser)

const handleSwitchRole = (role: 'employee' | 'manager') => {
  // In real auth mode, users have fixed roles
  // This function is kept for navigation purposes
  router.push(`/${role}`)
}
</script>

<template>
  <!-- Auth pages (home, login, register) - no layout needed -->
  <RouterView v-if="isAuthPage" />

  <!-- App pages with layout -->
  <AppLayout
    v-else-if="currentUser"
    :user="currentUser"
    @switch-role="handleSwitchRole"
  >
    <RouterView />
  </AppLayout>

  <!-- Loading state for protected routes -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <p class="text-muted">Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppLayout } from '@/components/layout'
import { useUserStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isHomePage = computed(() => route.path === '/')

const handleSwitchRole = (role: 'employee' | 'manager') => {
  userStore.switchRole(role)
  router.push(`/${role}`)
}
</script>

<template>
  <RouterView v-if="isHomePage" />
  <AppLayout
    v-else
    :user="userStore.currentUser!"
    @switch-role="handleSwitchRole"
  >
    <RouterView />
  </AppLayout>
</template>

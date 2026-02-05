<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from './AppHeader.vue'
import type { User } from '@/types'

interface Props {
  user: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'switch-role': [role: 'employee' | 'manager']
}>()

const router = useRouter()

const handleSwitchRole = (role: 'employee' | 'manager') => {
  emit('switch-role', role)
  router.push(`/${role}`)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader :user="user" @switch-role="handleSwitchRole" />
    <main class="pt-16 px-6 py-8">
      <div class="max-w-5xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

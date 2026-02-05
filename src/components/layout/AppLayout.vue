<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import TabBar from './TabBar.vue'
import type { User } from '@/types'

interface Props {
  user: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'switch-role': [role: 'employee' | 'manager']
}>()

const router = useRouter()
const route = useRoute()

const showTabBar = computed(() => route.path !== '/')

const handleSwitchRole = (role: 'employee' | 'manager') => {
  emit('switch-role', role)
  router.push(`/${role}`)
}
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <AppHeader :user="user" @switch-role="handleSwitchRole" />

    <!-- Tab Bar (not shown on home page) -->
    <div v-if="showTabBar" class="pt-16">
      <TabBar />
    </div>

    <!-- Main Content -->
    <main :class="['px-6 py-8 pb-24 md:pb-8', showTabBar ? '' : 'pt-16']">
      <div class="max-w-5xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { CoinDisplay } from '@/components/ui'
import type { User } from '@/types'

interface Props {
  user: User
}

defineProps<Props>()

const emit = defineEmits<{
  'switch-role': [role: 'employee' | 'manager']
}>()
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm h-16">
    <div class="max-w-5xl mx-auto h-full px-6 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 text-xl font-bold text-gray-900">
        <span>🎰</span>
        <span>OfficeVegas</span>
      </router-link>

      <div class="flex items-center gap-6">
        <CoinDisplay :amount="user.coins" size="md" />

        <div class="flex items-center gap-3">
          <div class="text-right">
            <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
            <div class="text-xs text-gray-500 capitalize">{{ user.role }}</div>
          </div>

          <div class="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              :class="[
                'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                user.role === 'employee'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
              @click="emit('switch-role', 'employee')"
            >
              Employee
            </button>
            <button
              :class="[
                'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                user.role === 'manager'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
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

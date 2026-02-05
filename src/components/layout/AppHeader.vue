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
  <header class="fixed top-0 left-0 right-0 z-40 glass-dark h-16">
    <div class="max-w-5xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 text-xl font-bold">
        <span>🎰</span>
        <span class="text-gradient">OfficeVegas</span>
      </router-link>

      <div class="flex items-center gap-3 sm:gap-6">
        <CoinDisplay :amount="user.coins" size="md" />

        <div class="flex items-center gap-2 sm:gap-3">
          <div class="text-right hidden sm:block">
            <div class="text-sm font-medium text-white">{{ user.nickname }}</div>
            <div class="text-xs text-purple-300/70 capitalize">{{ user.role }}</div>
          </div>

          <div class="flex gap-1 glass rounded-lg p-1">
            <button
              :class="[
                'px-3 py-1 text-sm font-medium rounded-md transition-all duration-200',
                user.role === 'employee'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              ]"
              @click="emit('switch-role', 'employee')"
            >
              Employee
            </button>
            <button
              :class="[
                'px-3 py-1 text-sm font-medium rounded-md transition-all duration-200',
                user.role === 'manager'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
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

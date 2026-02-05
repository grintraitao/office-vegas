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
  <header class="fixed top-0 left-0 right-0 z-40 bg-base-100 border-b border-base-300 shadow-sm h-16">
    <div class="max-w-5xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 text-lg sm:text-xl font-bold text-base-content">
        <span>🎰</span>
        <span>OfficeVegas</span>
      </router-link>

      <div class="flex items-center gap-2 sm:gap-4">
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

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CoinDisplay } from '@/components/ui'
import { useUserStore, useGameStore } from '@/stores'

const userStore = useUserStore()
const gameStore = useGameStore()

const currentUser = computed(() => userStore.currentUser)

const rank = computed(() => {
  if (!currentUser.value) return 0
  const index = userStore.leaderboard.findIndex(u => u.id === currentUser.value!.id)
  return index + 1
})

const tasksDone = computed(() => {
  if (!currentUser.value) return 0
  return gameStore.getApprovedTasksCount(currentUser.value.id)
})
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <Card padding="md">
      <div class="text-center">
        <CoinDisplay :amount="currentUser?.coins ?? 0" size="lg" />
        <p class="text-sm text-gray-500 mt-1">Coins</p>
      </div>
    </Card>

    <Card padding="md">
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          <span class="text-lg">📊</span> #{{ rank }}
        </div>
        <p class="text-sm text-gray-500 mt-1">Rank</p>
      </div>
    </Card>

    <Card padding="md">
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          <span class="text-lg">✅</span> {{ tasksDone }}
        </div>
        <p class="text-sm text-gray-500 mt-1">Tasks Done</p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CoinDisplay } from '@/components/ui'
import { useUserStore } from '@/stores'
import LeaderboardChart from './LeaderboardChart.vue'

const userStore = useUserStore()

const leaderboard = computed(() => userStore.leaderboard)
const currentUser = computed(() => userStore.currentUser)

const currentMonth = new Date().toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })

const getRankEmoji = (rank: number) => {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

const getRankClass = (rank: number) => {
  if (rank === 1) return 'bg-yellow-500/10 border-yellow-500/30'
  if (rank === 2) return 'bg-surface border-theme-light'
  if (rank === 3) return 'bg-orange-500/10 border-orange-500/30'
  return 'bg-surface border-theme-light'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Current Month Leaderboard -->
    <Card padding="md">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-base">🏆 Leaderboard - {{ currentMonth }}</h3>
        </div>
      </template>

      <div class="space-y-2">
        <div
          v-for="(user, index) in leaderboard"
          :key="user.id"
          :class="[
            'flex items-center justify-between p-3 rounded-lg border transition-all',
            getRankClass(index + 1),
            user.id === currentUser?.id ? 'ring-2 ring-indigo-500 ring-offset-1' : '',
          ]"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl w-8 text-center">{{ getRankEmoji(index + 1) }}</span>
            <div>
              <span class="font-medium text-base">{{ user.nickname }}</span>
              <span v-if="user.id === currentUser?.id" class="text-xs text-indigo-600 ml-2">(Bạn)</span>
            </div>
          </div>
          <CoinDisplay :amount="user.coins" size="sm" />
        </div>
      </div>
    </Card>

    <!-- Historical Chart -->
    <LeaderboardChart />
  </div>
</template>

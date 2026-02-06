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
  // 5 colors that work well with all themes (light/dark/vegas/cyberpunk/luxury)
  const rankColors: Record<number, string> = {
    1: 'bg-yellow-500/15 border-yellow-500/40',   // 🥇 Gold
    2: 'bg-slate-400/15 border-slate-400/40',     // 🥈 Silver
    3: 'bg-orange-500/15 border-orange-500/40',   // 🥉 Bronze
    4: 'bg-blue-500/15 border-blue-500/40',       // 4th - Blue
    5: 'bg-purple-500/15 border-purple-500/40',   // 5th - Purple
  }
  return rankColors[rank] || 'bg-surface border-theme-light'
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
          <CoinDisplay :amount="user.monthlyCoins" size="sm" />
        </div>
      </div>
    </Card>

    <!-- Historical Chart -->
    <LeaderboardChart />
  </div>
</template>

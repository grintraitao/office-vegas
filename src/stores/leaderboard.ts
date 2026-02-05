import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface MonthlyTop {
  month: string
  nickname: string
  coins: number
  color: 'indigo' | 'emerald' | 'pink' | 'amber'
  isActive?: boolean
}

export const useLeaderboardStore = defineStore('leaderboard', () => {
  // Mock data for monthly top history
  const monthlyTopHistory = ref<MonthlyTop[]>([
    { month: 'Th8/2024', nickname: 'Vietlish Expert', coins: 120, color: 'amber' },
    { month: 'Th9/2024', nickname: 'Tung Tung Tung Sahur', coins: 185, color: 'pink' },
    { month: 'Th10/2024', nickname: 'Tung Tung Tung Sahur', coins: 150, color: 'pink' },
    { month: 'Th11/2024', nickname: 'Thầy Tín', coins: 320, color: 'indigo' },
    { month: 'Th12/2024', nickname: 'Thầy Tín', coins: 280, color: 'indigo' },
    { month: 'Th1/2025', nickname: 'Tiểu Nhân', coins: 210, color: 'emerald' },
    { month: 'Th2/2025', nickname: 'Thầy Tín', coins: 280, color: 'indigo', isActive: true },
  ])

  // Compute dominant winner
  const dominantWinner = computed(() => {
    const counts: Record<string, number> = {}
    monthlyTopHistory.value.forEach(m => {
      counts[m.nickname] = (counts[m.nickname] || 0) + 1
    })

    let maxCount = 0
    let winner = ''
    Object.entries(counts).forEach(([nickname, count]) => {
      if (count > maxCount) {
        maxCount = count
        winner = nickname
      }
    })

    return {
      nickname: winner,
      count: maxCount,
      total: monthlyTopHistory.value.length,
    }
  })

  // Max coins for chart scaling
  const maxCoins = computed(() => {
    return Math.max(...monthlyTopHistory.value.map(m => m.coins))
  })

  return {
    monthlyTopHistory,
    dominantWinner,
    maxCoins,
  }
})

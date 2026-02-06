import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { DbLeaderboardHistory } from '@/types/database'

export interface MonthlyTop {
  month: string
  nickname: string
  coins: number
  color: 'indigo' | 'emerald' | 'pink' | 'amber'
  isActive?: boolean
}

// Color palette for different users
const colorPalette: MonthlyTop['color'][] = ['indigo', 'emerald', 'pink', 'amber']

export const useLeaderboardStore = defineStore('leaderboard', () => {
  // State
  const monthlyTopHistory = ref<MonthlyTop[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Map nicknames to consistent colors
  const nicknameColors = ref<Record<string, MonthlyTop['color']>>({})
  let colorIndex = 0

  const getColorForNickname = (nickname: string): MonthlyTop['color'] => {
    if (!nicknameColors.value[nickname]) {
      nicknameColors.value[nickname] = colorPalette[colorIndex % colorPalette.length]!
      colorIndex++
    }
    return nicknameColors.value[nickname]!
  }

  // Convert database record to MonthlyTop
  const mapDbToMonthlyTop = (db: DbLeaderboardHistory, isLatest: boolean): MonthlyTop => {
    // Format month from YYYY-MM to ThM/YYYY format
    const parts = db.month.split('-')
    const year = parts[0] ?? ''
    const month = parts[1] ?? '01'
    const formattedMonth = `Th${parseInt(month)}/${year}`

    return {
      month: formattedMonth,
      nickname: db.nickname,
      coins: db.coins,
      color: getColorForNickname(db.nickname),
      isActive: isLatest,
    }
  }

  // Fetch leaderboard history
  const fetchHistory = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('leaderboard_history')
        .select('*')
        .eq('rank', 1) // Only get the top 1 for each month
        .order('month', { ascending: true })

      if (fetchError) throw fetchError

      // Reset color mapping for consistency
      nicknameColors.value = {}
      colorIndex = 0

      // Map to MonthlyTop with isActive on the latest entry
      monthlyTopHistory.value = (data ?? []).map((record, index, arr) =>
        mapDbToMonthlyTop(record, index === arr.length - 1)
      )
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch leaderboard history'
      console.error('fetchHistory error:', e)
    } finally {
      loading.value = false
    }
  }

  // Save current month's leaderboard snapshot
  const saveMonthlySnapshot = async (
    topUsers: Array<{ userId: string; nickname: string; coins: number; rank: number }>
  ) => {
    try {
      loading.value = true
      error.value = null

      const now = new Date()
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

      // Delete existing records for this month first
      await supabase.from('leaderboard_history').delete().eq('month', month)

      // Insert new records
      const records = topUsers.map((user) => ({
        month,
        user_id: user.userId,
        nickname: user.nickname,
        coins: user.coins,
        rank: user.rank,
      }))

      const { error: insertError } = await supabase.from('leaderboard_history').insert(records)

      if (insertError) throw insertError

      // Refresh history
      await fetchHistory()

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to save monthly snapshot'
      console.error('saveMonthlySnapshot error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  // Compute dominant winner
  const dominantWinner = computed(() => {
    const counts: Record<string, number> = {}
    monthlyTopHistory.value.forEach((m) => {
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
    if (monthlyTopHistory.value.length === 0) return 100
    return Math.max(...monthlyTopHistory.value.map((m) => m.coins))
  })

  return {
    // State
    monthlyTopHistory,
    loading,
    error,
    // Actions
    fetchHistory,
    saveMonthlySnapshot,
    // Getters
    dominantWinner,
    maxCoins,
  }
})

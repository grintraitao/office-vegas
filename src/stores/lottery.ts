import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LotteryBet, Transaction } from '@/types'
import { useUserStore } from './user'
import { useGameStore } from './game'

export const useLotteryStore = defineStore('lottery', () => {
  const userStore = useUserStore()
  const gameStore = useGameStore()

  // Helper to generate IDs
  const generateId = () => Math.random().toString(36).substring(2, 9)

  // State
  const isPlaying = ref(false)
  const lastResult = ref<{ number: number; won: boolean; payout: number } | null>(null)
  const history = ref<LotteryBet[]>([])

  // Getters
  const calculateMultiplier = (low: number, high: number): number => {
    const range = high - low
    if (range <= 0) return 0
    return Number(((1 / (range / 1000)) * 0.9).toFixed(2))
  }

  // Actions
  const placeBet = (userId: string, low: number, high: number, amount: number) => {
    const user = userStore.users.find(u => u.id === userId)
    if (!user || user.coins < amount) {
      return { success: false, message: 'Không đủ coins' }
    }

    isPlaying.value = true

    // Generate random number 1-1000
    const result = Math.floor(Math.random() * 1000) + 1
    const won = result >= low && result <= high
    const multiplier = calculateMultiplier(low, high)
    const payout = won ? Math.floor(amount * multiplier) : -amount

    // Update user coins
    userStore.addCoins(userId, payout)

    // Add transaction
    const transaction: Transaction = {
      id: generateId(),
      userId,
      amount: payout,
      type: won ? 'lottery_win' : 'lottery_lose',
      description: won
        ? `Lottery win! Range ${low}-${high}, number ${result}`
        : `Lottery lose. Range ${low}-${high}, number ${result}`,
      timestamp: new Date(),
    }
    gameStore.transactions.unshift(transaction)

    // Update game coins
    gameStore.updateGameCoins()

    // Add to history
    const bet: LotteryBet = {
      lowRange: low,
      highRange: high,
      betAmount: amount,
      multiplier,
      result,
      won,
    }
    history.value.unshift(bet)

    // Set last result
    lastResult.value = {
      number: result,
      won,
      payout: won ? payout : amount,
    }

    isPlaying.value = false

    return {
      success: true,
      result,
      won,
      payout,
      multiplier,
    }
  }

  const resetGame = () => {
    isPlaying.value = false
    lastResult.value = null
  }

  return {
    // State
    isPlaying,
    lastResult,
    history,
    // Getters
    calculateMultiplier,
    // Actions
    placeBet,
    resetGame,
  }
})

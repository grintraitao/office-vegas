import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LotteryBet } from '@/types'
import { supabase } from '@/lib/supabase'
import { useUserStore } from './user'
import { useGameStore } from './game'

export const useLotteryStore = defineStore('lottery', () => {
  const userStore = useUserStore()
  const gameStore = useGameStore()

  // State
  const isPlaying = ref(false)
  const lastResult = ref<{
    number: number
    won: boolean
    payout: number
    netGain: number
    betAmount: number
  } | null>(null)
  const history = ref<LotteryBet[]>([])

  // Getters - House edge 5%
  const calculateMultiplier = (low: number, high: number): number => {
    const range = high - low
    if (range <= 0) return 0
    return Number(((1 / (range / 1000)) * 0.95).toFixed(2))
  }

  // Actions
  const placeBet = async (userId: string, low: number, high: number, betAmount: number) => {
    const user = userStore.users.find(u => u.id === userId)
    if (!user || user.coins < betAmount) {
      return { success: false, message: 'Không đủ coins' }
    }

    isPlaying.value = true

    // Step 1: Deduct stake FIRST
    await userStore.addCoins(userId, -betAmount)

    // Step 2: Generate random number 1-1000
    const result = Math.floor(Math.random() * 1000) + 1

    // Step 3: Check win/lose
    const won = result >= low && result <= high
    const multiplier = calculateMultiplier(low, high)

    let payout = 0
    let netGain = -betAmount

    // Step 4: If win, add payout
    if (won) {
      payout = Math.floor(betAmount * multiplier)
      await userStore.addCoins(userId, payout)
      netGain = payout - betAmount
      // Track monthly earnings (only the net gain, not stake)
      userStore.addMonthlyEarnings(userId, netGain)
    }

    // Save transaction to Supabase
    const txType = won ? 'lottery_win' : 'lottery_lose'
    const txDescription = won
      ? `Lottery win! Range ${low}-${high}, number ${result}, +${netGain} coins`
      : `Lottery lose. Range ${low}-${high}, number ${result}, -${betAmount} coins`

    await supabase.from('transactions').insert({
      user_id: userId,
      game_id: gameStore.currentGame?.id ?? null,
      amount: netGain,
      type: txType,
      description: txDescription,
    })

    // Update game coins
    await gameStore.updateGameCoins()

    // Add to history
    const bet: LotteryBet = {
      lowRange: low,
      highRange: high,
      betAmount,
      multiplier,
      result,
      won,
    }
    history.value.unshift(bet)

    // Set last result
    lastResult.value = {
      number: result,
      won,
      payout,
      netGain,
      betAmount,
    }

    isPlaying.value = false

    return {
      success: true,
      result,
      won,
      payout,
      netGain,
      betAmount,
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

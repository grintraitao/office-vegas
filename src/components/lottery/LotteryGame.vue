<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, Button, CoinDisplay } from '@/components/ui'
import { useUserStore, useLotteryStore } from '@/stores'
import DualSlider from './DualSlider.vue'
import LotteryResult from './LotteryResult.vue'

const userStore = useUserStore()
const lotteryStore = useLotteryStore()

// State
const lowRange = ref(150)
const highRange = ref(450)
const betAmount = ref(10)
const customBet = ref('')
const isSpinning = ref(false)
const showResult = ref(false)
const resultMarker = ref<number | null>(null)
const isHit = ref<boolean | null>(null)

const result = ref<{
  number: number
  won: boolean
  payout: number
  netGain: number
  betAmount: number
  lowRange: number
  highRange: number
} | null>(null)

// Constants
const MIN_RANGE = 10
const MAX_RANGE = 940
const quickBets = [10, 25, 50]

// Computed
const currentUser = computed(() => userStore.currentUser)
const balance = computed(() => currentUser.value?.coins ?? 0)

const rangeSize = computed(() => highRange.value - lowRange.value)
const probability = computed(() => rangeSize.value / 1000)

// House edge 5%
const multiplier = computed(() => {
  if (probability.value <= 0) return 0
  return Number(((1 / probability.value) * 0.95).toFixed(2))
})

const potentialWin = computed(() => Math.floor(betAmount.value * multiplier.value))
const netGainIfWin = computed(() => potentialWin.value - betAmount.value)

// Risk level indicator
const riskLevel = computed(() => {
  if (multiplier.value < 1.01) {
    return { label: '❌ Lỗ chắc', color: 'text-red-600', blocked: true }
  } else if (multiplier.value < 1.5) {
    return { label: '⚠️ Rủi ro thấp', color: 'text-yellow-600', blocked: false }
  } else if (multiplier.value <= 5.0) {
    return { label: '✅ Hợp lý', color: 'text-green-600', blocked: false }
  } else {
    return { label: '🔥 Liều!', color: 'text-purple-600', blocked: false }
  }
})

const isRangeTooWide = computed(() => rangeSize.value > MAX_RANGE)
const isRangeTooSmall = computed(() => rangeSize.value < MIN_RANGE)

const isValidRange = computed(() =>
  lowRange.value >= 1 &&
  highRange.value <= 1000 &&
  lowRange.value < highRange.value &&
  !isRangeTooSmall.value &&
  !isRangeTooWide.value
)

const canSpin = computed(() =>
  isValidRange.value &&
  !riskLevel.value.blocked &&
  betAmount.value > 0 &&
  betAmount.value <= balance.value &&
  !isSpinning.value
)

// Note: Result marker is cleared when:
// 1. Starting a new spin (in spin function)
// 2. After closing result modal (with 2s delay in closeResult)

// Methods
const selectQuickBet = (amount: number) => {
  betAmount.value = Math.min(amount, balance.value)
  customBet.value = ''
}

const handleAllIn = () => {
  betAmount.value = balance.value
  customBet.value = ''
}

const handleCustomBet = (e: Event) => {
  const value = parseInt((e.target as HTMLInputElement).value)
  if (!isNaN(value) && value > 0) {
    betAmount.value = Math.min(value, balance.value)
  }
  customBet.value = (e.target as HTMLInputElement).value
}

const spin = async () => {
  if (!canSpin.value || !currentUser.value) return

  isSpinning.value = true
  resultMarker.value = null
  isHit.value = null

  // Dramatic delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  const spinResult = lotteryStore.placeBet(
    currentUser.value.id,
    lowRange.value,
    highRange.value,
    betAmount.value
  )

  if (spinResult.success) {
    // Show marker on slider first
    resultMarker.value = spinResult.result!
    isHit.value = spinResult.won!

    // Flash effect delay
    await new Promise(resolve => setTimeout(resolve, 500))

    result.value = {
      number: spinResult.result!,
      won: spinResult.won!,
      payout: spinResult.payout!,
      netGain: spinResult.netGain!,
      betAmount: spinResult.betAmount!,
      lowRange: lowRange.value,
      highRange: highRange.value,
    }
    showResult.value = true
  }

  isSpinning.value = false
}

const closeResult = () => {
  showResult.value = false
  result.value = null
  // Keep marker visible for a moment after closing modal
  setTimeout(() => {
    resultMarker.value = null
    isHit.value = null
  }, 2000)
}
</script>

<template>
  <Card title="🎰 Xổ số Low-High" padding="md">
    <div class="space-y-6">
      <!-- Dual Range Slider -->
      <div>
        <p class="text-sm font-medium text-base mb-2">
          Chọn khoảng số may mắn:
        </p>

        <DualSlider
          :min="1"
          :max="1000"
          v-model:low-value="lowRange"
          v-model:high-value="highRange"
          :min-gap="MIN_RANGE"
          :result-marker="resultMarker"
          :is-hit="isHit"
        />

        <!-- Range Info -->
        <div class="flex justify-between items-center mt-2 text-sm">
          <span class="text-muted">
            Khoảng: <span class="font-semibold">{{ rangeSize }}</span> số ({{ (probability * 100).toFixed(1) }}%)
          </span>
          <span class="font-semibold">
            Multiplier: <span class="text-indigo-600">x{{ multiplier }}</span>
          </span>
        </div>
      </div>

      <!-- Summary Box -->
      <div class="bg-surface rounded-lg p-4 border border-theme">
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-muted">📊 Xác suất:</span>
            <span class="font-semibold">{{ (probability * 100).toFixed(1) }}%</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted">💎 Multiplier:</span>
            <span class="font-semibold">x{{ multiplier }}</span>
            <span :class="['text-xs', riskLevel.color]">{{ riskLevel.label }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted">💰 Cược:</span>
            <span class="font-semibold">{{ betAmount }} coins</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-green-600">✅ Thắng:</span>
            <span class="font-semibold text-green-600">+{{ netGainIfWin }} coins</span>
          </div>
          <div class="col-span-2 flex items-center gap-2">
            <span class="text-red-600">❌ Thua:</span>
            <span class="font-semibold text-red-600">-{{ betAmount }} coins</span>
          </div>
        </div>
      </div>

      <!-- Bet Selection -->
      <div>
        <p class="text-sm font-medium text-base mb-2">Đặt cược:</p>
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="amount in quickBets"
            :key="amount"
            :disabled="amount > balance || isSpinning"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              betAmount === amount && !customBet
                ? 'bg-indigo-600 text-white'
                : amount > balance || isSpinning
                  ? 'bg-elevated text-faint cursor-not-allowed'
                  : 'bg-elevated text-base hover:brightness-110'
            ]"
            @click="selectQuickBet(amount)"
          >
            {{ amount }}
          </button>
          <button
            :disabled="balance === 0 || isSpinning"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              betAmount === balance && balance > 0 && !customBet
                ? 'bg-red-600 text-white'
                : balance === 0 || isSpinning
                  ? 'bg-elevated text-faint cursor-not-allowed'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
            ]"
            @click="handleAllIn"
          >
            All-in
          </button>
          <div class="flex items-center gap-1">
            <input
              type="number"
              :value="customBet"
              :disabled="isSpinning"
              placeholder="Khác"
              min="1"
              :max="balance"
              class="w-20 px-3 py-2 text-sm border border-theme rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-elevated disabled:cursor-not-allowed"
              @input="handleCustomBet"
            />
          </div>
        </div>
      </div>

      <!-- Balance -->
      <div class="flex items-center gap-2 py-2">
        <span class="text-muted">💰 Balance:</span>
        <CoinDisplay :amount="balance" size="md" />
      </div>

      <!-- Spin Button -->
      <Button
        variant="primary"
        size="lg"
        class="w-full"
        :disabled="!canSpin"
        @click="spin"
      >
        <span v-if="!isSpinning" class="flex items-center justify-center gap-2">
          🎲 QUAY SỐ - Cược {{ betAmount }} coins
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Đang quay...
        </span>
      </Button>

      <!-- Validation Messages -->
      <div v-if="isRangeTooSmall" class="text-center text-sm text-red-500">
        Khoảng quá nhỏ! Tối thiểu {{ MIN_RANGE }} số
      </div>
      <div v-else-if="isRangeTooWide" class="text-center text-sm text-red-500">
        Khoảng quá rộng, không có lãi! Tối đa {{ MAX_RANGE }} số
      </div>
      <div v-else-if="riskLevel.blocked" class="text-center text-sm text-red-500">
        Multiplier quá thấp, bạn sẽ lỗ chắc!
      </div>
      <div v-else-if="balance === 0" class="text-center text-sm text-red-500">
        Bạn hết coins rồi! Hãy submit task để kiếm thêm 💰
      </div>
      <div v-else-if="betAmount > balance" class="text-center text-sm text-red-500">
        Không đủ coins để đặt cược
      </div>
      <div v-else-if="betAmount < 1" class="text-center text-sm text-red-500">
        Cược tối thiểu 1 coin
      </div>
    </div>
  </Card>

  <!-- Result Modal -->
  <LotteryResult
    :isOpen="showResult"
    :result="result"
    @close="closeResult"
  />
</template>

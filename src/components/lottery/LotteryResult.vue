<script setup lang="ts">
import { Modal, Button } from '@/components/ui'

interface Result {
  number: number
  won: boolean
  payout: number
  netGain: number
  betAmount: number
  lowRange: number
  highRange: number
}

interface Props {
  isOpen: boolean
  result: Result | null
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Modal :isOpen="isOpen" @close="emit('close')">
    <div v-if="result" class="text-center py-4">
      <!-- Win State -->
      <template v-if="result.won">
        <div class="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 class="text-3xl font-bold text-green-500 mb-6">THẮNG!</h2>

        <div class="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
          <p class="text-muted mb-2">Số may mắn:</p>
          <p class="text-4xl font-bold text-green-500">{{ result.number }}</p>
        </div>

        <p class="text-muted mb-4">
          Khoảng bạn chọn:
          <span class="font-medium text-base">{{ result.lowRange }} - {{ result.highRange }}</span>
          <span class="text-green-500 ml-2">✅</span>
        </p>

        <div class="space-y-1 mb-6">
          <p class="text-muted">Cược: {{ result.betAmount }} coins</p>
          <p class="text-2xl font-bold text-green-500">Thắng: +{{ result.netGain }} coins</p>
        </div>

        <Button variant="primary" size="lg" @click="emit('close')">
          🎲 Chơi tiếp
        </Button>
      </template>

      <!-- Lose State -->
      <template v-else>
        <div class="text-6xl mb-4">💀</div>
        <h2 class="text-3xl font-bold text-red-500 mb-6">THUA!</h2>

        <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <p class="text-muted mb-2">Số may mắn:</p>
          <p class="text-4xl font-bold text-red-500">{{ result.number }}</p>
        </div>

        <p class="text-muted mb-4">
          Khoảng bạn chọn:
          <span class="font-medium text-base">{{ result.lowRange }} - {{ result.highRange }}</span>
          <span class="text-red-500 ml-2">❌</span>
        </p>

        <div class="mb-6">
          <p class="text-2xl font-bold text-red-500">Mất: -{{ result.betAmount }} coins</p>
        </div>

        <Button variant="secondary" size="lg" @click="emit('close')">
          🔄 Thử lại
        </Button>
      </template>
    </div>
  </Modal>
</template>

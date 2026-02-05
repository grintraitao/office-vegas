<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Badge } from '@/components/ui'
import { useGameStore } from '@/stores'
import type { Task } from '@/types'

interface Props {
  task: Task
}

const props = defineProps<Props>()

const gameStore = useGameStore()

const selectedReward = ref<number | null>(null)
const customReward = ref<string>('')
const isExpanded = ref(false)
const showSuccess = ref(false)
const showRejected = ref(false)

const quickRewards = [10, 25, 50]

const finalReward = computed(() => {
  if (selectedReward.value !== null) return selectedReward.value
  const custom = parseInt(customReward.value)
  return isNaN(custom) || custom <= 0 ? null : custom
})

const canApprove = computed(() => finalReward.value !== null && finalReward.value > 0)

const selectQuickReward = (amount: number) => {
  selectedReward.value = amount
  customReward.value = ''
}

const handleCustomInput = (e: Event) => {
  selectedReward.value = null
  customReward.value = (e.target as HTMLInputElement).value
}

const getRelativeTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  return `${days} ngày trước`
}

const handleApprove = () => {
  if (!canApprove.value || !finalReward.value) return

  gameStore.approveTask(props.task.id, finalReward.value)
  showSuccess.value = true
}

const handleReject = () => {
  gameStore.rejectTask(props.task.id)
  showRejected.value = true
}
</script>

<template>
  <div
    v-if="!showSuccess && !showRejected"
    class="bg-white border border-gray-200 rounded-xl p-5 space-y-4"
  >
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-gray-500">👤</span>
          <span class="font-medium text-gray-900">{{ task.userName }}</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mt-1">{{ task.title }}</h3>
      </div>
      <Badge variant="warning">Pending</Badge>
    </div>

    <!-- Outcome -->
    <div>
      <p class="text-sm text-gray-500 mb-1">Outcome:</p>
      <p
        :class="[
          'text-gray-700',
          !isExpanded && 'line-clamp-2'
        ]"
      >
        {{ task.outcome }}
      </p>
      <button
        v-if="task.outcome.length > 100"
        class="text-sm text-indigo-600 hover:text-indigo-800 mt-1"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? 'Thu gọn' : 'Xem thêm' }}
      </button>
    </div>

    <!-- Time -->
    <p class="text-sm text-gray-400">
      Submitted: {{ getRelativeTime(task.createdAt) }}
    </p>

    <!-- Reward Selection -->
    <div class="space-y-2">
      <p class="text-sm font-medium text-gray-700">Reward:</p>
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="amount in quickRewards"
          :key="amount"
          :class="[
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            selectedReward === amount
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
          @click="selectQuickReward(amount)"
        >
          {{ amount }}
        </button>
        <div class="flex items-center gap-1">
          <input
            type="number"
            :value="customReward"
            placeholder="Custom"
            min="1"
            class="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            @input="handleCustomInput"
          />
          <span class="text-sm text-gray-500">coins</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-3 pt-2">
      <Button variant="danger" size="sm" @click="handleReject">
        ❌ Reject
      </Button>
      <Button
        variant="primary"
        size="sm"
        :disabled="!canApprove"
        @click="handleApprove"
      >
        ✅ Approve{{ finalReward ? ` (+${finalReward})` : '' }}
      </Button>
    </div>
  </div>

  <!-- Success State -->
  <div
    v-else-if="showSuccess"
    class="bg-green-50 border border-green-200 rounded-xl p-5 text-center"
  >
    <div class="text-2xl mb-2">✅</div>
    <p class="text-green-800 font-medium">
      Đã approve task của {{ task.userName }}
    </p>
    <p class="text-green-600 text-sm">+{{ finalReward }} coins</p>
  </div>

  <!-- Rejected State -->
  <div
    v-else-if="showRejected"
    class="bg-red-50 border border-red-200 rounded-xl p-5 text-center"
  >
    <div class="text-2xl mb-2">❌</div>
    <p class="text-red-800 font-medium">
      Đã reject task của {{ task.userName }}
    </p>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

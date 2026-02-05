<script setup lang="ts">
import { computed } from 'vue'
import type { Reward } from '@/types'
import { useRewardStore, useUserStore } from '@/stores'
import { Card, Button, Badge } from '@/components/ui'

const props = defineProps<{
  reward: Reward
}>()

const emit = defineEmits<{
  redeem: [reward: Reward]
}>()

const rewardStore = useRewardStore()
const userStore = useUserStore()

const canAfford = computed(() => rewardStore.canAfford(props.reward.id))
const userCoins = computed(() => userStore.currentUser?.coins ?? 0)

const categoryColors: Record<string, string> = {
  fun: 'bg-yellow-100 text-yellow-800',
  privilege: 'bg-purple-100 text-purple-800',
  bonding: 'bg-blue-100 text-blue-800',
  status: 'bg-pink-100 text-pink-800',
  treat: 'bg-green-100 text-green-800',
}

const categoryLabels: Record<string, string> = {
  fun: 'Vui vẻ',
  privilege: 'Đặc quyền',
  bonding: 'Gắn kết',
  status: 'Danh hiệu',
  treat: 'Đãi ngộ',
}

const handleRedeem = () => {
  emit('redeem', props.reward)
}
</script>

<template>
  <Card class="flex flex-col h-full">
    <div class="flex items-start gap-3">
      <div class="text-3xl">{{ reward.icon }}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="font-semibold text-gray-900 truncate">{{ reward.name }}</h3>
        </div>
        <p class="text-sm text-gray-500 line-clamp-2">{{ reward.description }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 mt-3">
      <span :class="['text-xs px-2 py-0.5 rounded-full', categoryColors[reward.category]]">
        {{ categoryLabels[reward.category] }}
      </span>
      <span v-if="reward.stock !== null" class="text-xs text-gray-400">
        Còn {{ reward.stock }}
      </span>
    </div>

    <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
      <div class="flex items-center gap-1">
        <span class="text-lg font-bold text-amber-600">{{ reward.cost }}</span>
        <span class="text-amber-500">coins</span>
      </div>
      <Button
        :variant="canAfford ? 'primary' : 'secondary'"
        size="sm"
        :disabled="!canAfford"
        @click="handleRedeem"
      >
        {{ canAfford ? 'Đổi ngay' : `Cần ${reward.cost - userCoins} coins` }}
      </Button>
    </div>
  </Card>
</template>

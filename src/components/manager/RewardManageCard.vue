<script setup lang="ts">
import type { Reward } from '@/types'
import { useRewardStore } from '@/stores'
import { Card, Button } from '@/components/ui'

const props = defineProps<{
  reward: Reward
}>()

const emit = defineEmits<{
  edit: [reward: Reward]
}>()

const rewardStore = useRewardStore()

const categoryLabels: Record<string, string> = {
  fun: 'Vui vẻ',
  privilege: 'Đặc quyền',
  bonding: 'Gắn kết',
  status: 'Danh hiệu',
  treat: 'Đãi ngộ',
}

const handleToggle = () => {
  rewardStore.toggleRewardActive(props.reward.id)
}

const handleEdit = () => {
  emit('edit', props.reward)
}
</script>

<template>
  <Card :class="{ 'opacity-50': !reward.isActive }">
    <div class="flex items-start gap-3">
      <div class="text-2xl">{{ reward.icon }}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <h4 class="font-medium text-gray-900 truncate">{{ reward.name }}</h4>
          <span
            v-if="!reward.isActive"
            class="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full"
          >
            Tắt
          </span>
        </div>
        <p class="text-sm text-gray-500 truncate">{{ reward.description }}</p>
        <div class="flex items-center gap-3 mt-2 text-sm">
          <span class="text-amber-600 font-medium">{{ reward.cost }} coins</span>
          <span class="text-gray-400">•</span>
          <span class="text-gray-500">{{ categoryLabels[reward.category] }}</span>
          <span v-if="reward.stock !== null" class="text-gray-400">•</span>
          <span v-if="reward.stock !== null" class="text-gray-500">
            Còn {{ reward.stock }}
          </span>
        </div>
      </div>
      <div class="flex gap-2">
        <Button variant="secondary" size="sm" @click="handleEdit">
          Sửa
        </Button>
        <Button
          :variant="reward.isActive ? 'secondary' : 'primary'"
          size="sm"
          @click="handleToggle"
        >
          {{ reward.isActive ? 'Tắt' : 'Bật' }}
        </Button>
      </div>
    </div>
  </Card>
</template>

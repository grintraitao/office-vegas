<script setup lang="ts">
import { computed } from 'vue'
import { useRewardStore } from '@/stores'
import { Card, Badge } from '@/components/ui'

const rewardStore = useRewardStore()

const redemptions = computed(() => rewardStore.myRedemptions)

const statusConfig = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  fulfilled: { label: 'Đã nhận', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã huỷ', color: 'bg-red-100 text-red-800' },
} as const

const getStatusConfig = (status: string) => {
  return statusConfig[status as keyof typeof statusConfig] ?? statusConfig.pending
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div>
    <h3 class="font-semibold text-base mb-3">Lịch sử đổi thưởng</h3>

    <div v-if="redemptions.length === 0" class="text-center py-8 text-muted">
      Bạn chưa đổi thưởng nào
    </div>

    <div v-else class="space-y-3">
      <Card
        v-for="redemption in redemptions"
        :key="redemption.id"
        class="flex items-center gap-3"
      >
        <div class="text-2xl">
          {{ rewardStore.getRewardById(redemption.rewardId)?.icon }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-base truncate">
            {{ rewardStore.getRewardById(redemption.rewardId)?.name }}
          </p>
          <p class="text-xs text-muted">{{ formatDate(redemption.redeemedAt) }}</p>
        </div>
        <span
          :class="[
            'text-xs px-2 py-1 rounded-full',
            getStatusConfig(redemption.status).color,
          ]"
        >
          {{ getStatusConfig(redemption.status).label }}
        </span>
      </Card>
    </div>
  </div>
</template>

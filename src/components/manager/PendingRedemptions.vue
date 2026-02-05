<script setup lang="ts">
import { computed } from 'vue'
import { useRewardStore, useUserStore } from '@/stores'
import { Card, Button, Badge } from '@/components/ui'

const rewardStore = useRewardStore()
const userStore = useUserStore()

const pendingRedemptions = computed(() => rewardStore.pendingRedemptions)

const getUserName = (userId: string) => {
  const user = userStore.users.find(u => u.id === userId)
  return user?.nickname ?? 'Unknown'
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleFulfill = (redemptionId: string) => {
  rewardStore.fulfillRedemption(redemptionId)
}

const handleCancel = (redemptionId: string) => {
  rewardStore.cancelRedemption(redemptionId)
}
</script>

<template>
  <Card>
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-900">Yêu cầu đổi thưởng</h3>
      <Badge v-if="pendingRedemptions.length > 0" variant="warning">
        {{ pendingRedemptions.length }} chờ duyệt
      </Badge>
    </div>

    <div v-if="pendingRedemptions.length === 0" class="text-center py-8 text-gray-500">
      Không có yêu cầu nào đang chờ
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="redemption in pendingRedemptions"
        :key="redemption.id"
        class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
      >
        <div class="text-2xl">
          {{ rewardStore.getRewardById(redemption.rewardId)?.icon }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-900">
            {{ rewardStore.getRewardById(redemption.rewardId)?.name }}
          </p>
          <p class="text-sm text-gray-500">
            {{ getUserName(redemption.userId) }} • {{ formatDate(redemption.redeemedAt) }}
          </p>
        </div>
        <div class="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            @click="handleCancel(redemption.id)"
          >
            Huỷ
          </Button>
          <Button
            variant="primary"
            size="sm"
            @click="handleFulfill(redemption.id)"
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  </Card>
</template>

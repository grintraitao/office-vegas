<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '@/components/ui'
import { useGameStore } from '@/stores'

const gameStore = useGameStore()

const recentApproved = computed(() => {
  return gameStore.approvedTasks
    .slice()
    .sort((a, b) => new Date(b.reviewedAt!).getTime() - new Date(a.reviewedAt!).getTime())
    .slice(0, 5)
})

const getRelativeTime = (date: Date | null) => {
  if (!date) return ''
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  return `${days} ngày trước`
}
</script>

<template>
  <Card title="📜 Recently Approved" padding="md">
    <div v-if="recentApproved.length === 0" class="text-center py-4">
      <p class="text-faint text-sm">Chưa có task nào được duyệt</p>
    </div>

    <ul v-else class="space-y-3">
      <li
        v-for="task in recentApproved"
        :key="task.id"
        class="flex items-center justify-between py-2 border-b border-theme-light last:border-0"
      >
        <div class="flex items-center gap-2">
          <span class="text-muted">👤</span>
          <span class="font-medium text-base">{{ task.userName }}</span>
          <span class="text-faint">-</span>
          <span class="text-base">{{ task.title }}</span>
          <span class="text-green-600 font-medium">(+{{ task.reward }} 💰)</span>
        </div>
        <span class="text-sm text-faint">{{ getRelativeTime(task.reviewedAt) }}</span>
      </li>
    </ul>
  </Card>
</template>

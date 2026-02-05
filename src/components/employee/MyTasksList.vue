<script setup lang="ts">
import { computed } from 'vue'
import { Card, Badge } from '@/components/ui'
import { useUserStore, useGameStore } from '@/stores'

const userStore = useUserStore()
const gameStore = useGameStore()

const myTasks = computed(() => {
  if (!userStore.currentUser) return []
  return gameStore.getTasksByUser(userStore.currentUser.id)
})

const pendingTasks = computed(() =>
  myTasks.value.filter(t => t.status === 'pending')
)

const approvedTasks = computed(() =>
  myTasks.value.filter(t => t.status === 'approved')
)

const rejectedTasks = computed(() =>
  myTasks.value.filter(t => t.status === 'rejected')
)
</script>

<template>
  <Card title="📋 My Tasks" padding="md">
    <div class="space-y-6">
      <!-- Pending Tasks -->
      <div>
        <h4 class="text-sm font-medium text-gray-500 mb-2">Pending</h4>
        <div v-if="pendingTasks.length === 0" class="text-sm text-gray-400 italic">
          No pending tasks
        </div>
        <ul v-else class="space-y-2">
          <li
            v-for="task in pendingTasks"
            :key="task.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span class="text-gray-900">{{ task.title }}</span>
            <Badge variant="warning">Chờ duyệt</Badge>
          </li>
        </ul>
      </div>

      <!-- Approved Tasks -->
      <div>
        <h4 class="text-sm font-medium text-gray-500 mb-2">Approved</h4>
        <div v-if="approvedTasks.length === 0" class="text-sm text-gray-400 italic">
          No approved tasks yet
        </div>
        <ul v-else class="space-y-2">
          <li
            v-for="task in approvedTasks"
            :key="task.id"
            class="flex items-center justify-between p-3 bg-green-50 rounded-lg"
          >
            <div class="flex items-center gap-2">
              <span class="text-gray-900">{{ task.title }}</span>
              <span class="text-green-600 font-medium">+{{ task.reward }} 💰</span>
            </div>
            <Badge variant="success">Đã duyệt</Badge>
          </li>
        </ul>
      </div>

      <!-- Rejected Tasks -->
      <div v-if="rejectedTasks.length > 0">
        <h4 class="text-sm font-medium text-gray-500 mb-2">Rejected</h4>
        <ul class="space-y-2">
          <li
            v-for="task in rejectedTasks"
            :key="task.id"
            class="flex items-center justify-between p-3 bg-red-50 rounded-lg"
          >
            <span class="text-gray-900">{{ task.title }}</span>
            <Badge variant="danger">Từ chối</Badge>
          </li>
        </ul>
      </div>
    </div>
  </Card>
</template>

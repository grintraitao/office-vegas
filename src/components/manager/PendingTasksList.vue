<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '@/components/ui'
import { useGameStore } from '@/stores'
import PendingTaskCard from './PendingTaskCard.vue'

const gameStore = useGameStore()

const pendingTasks = computed(() => gameStore.pendingTasks)
</script>

<template>
  <Card title="📥 Pending Reviews" padding="md">
    <div v-if="pendingTasks.length === 0" class="text-center py-8">
      <div class="text-4xl mb-3">🎉</div>
      <p class="text-gray-500">Không có task nào chờ duyệt!</p>
    </div>

    <div v-else class="space-y-4">
      <PendingTaskCard
        v-for="task in pendingTasks"
        :key="task.id"
        :task="task"
      />
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '@/components/ui'
import { useUserStore, useGameStore } from '@/stores'

const userStore = useUserStore()
const gameStore = useGameStore()

const pendingCount = computed(() => gameStore.pendingTasks.length)
const approvedCount = computed(() => gameStore.approvedTasks.length)
const employeeCount = computed(() => userStore.employees.length)
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <Card padding="md">
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          <span class="text-lg">📥</span> {{ pendingCount }}
        </div>
        <p class="text-sm text-gray-500 mt-1">Pending</p>
      </div>
    </Card>

    <Card padding="md">
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          <span class="text-lg">✅</span> {{ approvedCount }}
        </div>
        <p class="text-sm text-gray-500 mt-1">Approved</p>
      </div>
    </Card>

    <Card padding="md">
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          <span class="text-lg">👥</span> {{ employeeCount }}
        </div>
        <p class="text-sm text-gray-500 mt-1">Employees</p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card } from '@/components/ui'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
      <p class="text-gray-600 mt-1">Review tasks and manage team games</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <Card title="Pending Reviews" padding="md">
        <div class="text-gray-500 text-sm">
          Task review section coming soon...
        </div>
      </Card>

      <Card title="Create Game" padding="md">
        <div class="text-gray-500 text-sm">
          Game creation section coming soon...
        </div>
      </Card>
    </div>

    <Card title="Team Progress" padding="md">
      <div class="text-gray-500 text-sm">
        Team progress tracking coming soon...
      </div>
    </Card>
  </div>
</template>

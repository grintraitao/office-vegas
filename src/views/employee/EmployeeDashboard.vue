<script setup lang="ts">
import { Card } from '@/components/ui'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
      <p class="text-gray-600 mt-1">Submit your daily outcomes and win coins!</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <Card title="My Tasks" padding="md">
        <div class="text-gray-500 text-sm">
          Task submission section coming soon...
        </div>
      </Card>

      <Card title="Lottery" padding="md">
        <div class="text-gray-500 text-sm">
          Lottery game section coming soon...
        </div>
      </Card>
    </div>

    <Card title="Leaderboard" padding="md">
      <div class="text-gray-500 text-sm">
        Team leaderboard coming soon...
      </div>
    </Card>
  </div>
</template>

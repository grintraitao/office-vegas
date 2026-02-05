<script setup lang="ts">
import { Leaderboard } from '@/components/shared'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Bảng Xếp Hạng</h1>
      <p class="text-gray-600 mt-1">Xem thứ hạng và lịch sử top 1 qua các tháng</p>
    </div>

    <Leaderboard />
  </div>
</template>

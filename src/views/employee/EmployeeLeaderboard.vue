<script setup lang="ts">
import { Leaderboard } from '@/components/shared'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-base">Bảng Xếp Hạng</h1>
      <p class="text-muted mt-1">Xem thứ hạng và lịch sử top 1 qua các tháng</p>
    </div>

    <Leaderboard />
  </div>
</template>

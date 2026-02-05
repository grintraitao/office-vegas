<script setup lang="ts">
import { LotteryGame } from '@/components/lottery'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-white">Xổ Số Low-High</h1>
      <p class="text-purple-200/70 mt-1">Thử vận may với coins của bạn!</p>
    </div>

    <LotteryGame />
  </div>
</template>

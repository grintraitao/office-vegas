<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores'
import { Card } from '@/components/ui'
import { RewardsList, MyRedemptions } from '@/components/redeem'

const userStore = useUserStore()
const currentUser = computed(() => userStore.currentUser)
</script>

<template>
  <div class="space-y-6">
    <!-- Header with coin balance -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Đổi Thưởng</h1>
        <p class="text-purple-200/70">Dùng coins để đổi các phần thưởng hấp dẫn</p>
      </div>
      <Card class="flex items-center gap-2 !bg-gradient-to-r !from-amber-500/20 !to-yellow-500/20 !border-amber-500/30">
        <span class="text-2xl">💰</span>
        <div>
          <p class="text-xs text-amber-300 font-medium">Số dư</p>
          <p class="text-xl font-bold text-amber-400">{{ currentUser?.coins ?? 0 }} coins</p>
        </div>
      </Card>
    </div>

    <!-- Rewards List -->
    <section>
      <RewardsList />
    </section>

    <!-- My Redemptions -->
    <section>
      <MyRedemptions />
    </section>
  </div>
</template>

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
        <h1 class="text-2xl font-bold text-gray-900">Đổi Thưởng</h1>
        <p class="text-gray-500">Dùng coins để đổi các phần thưởng hấp dẫn</p>
      </div>
      <Card class="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
        <span class="text-2xl">💰</span>
        <div>
          <p class="text-xs text-amber-600 font-medium">Số dư</p>
          <p class="text-xl font-bold text-amber-700">{{ currentUser?.coins ?? 0 }} coins</p>
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

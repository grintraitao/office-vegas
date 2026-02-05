<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Reward } from '@/types'
import { useRewardStore } from '@/stores'
import { Button } from '@/components/ui'
import { PendingRedemptions, RewardManageCard, AddRewardModal } from '@/components/manager'

const rewardStore = useRewardStore()

const showAddModal = ref(false)
const editingReward = ref<Reward | null>(null)

const allRewards = computed(() => rewardStore.rewards)

const handleAddNew = () => {
  editingReward.value = null
  showAddModal.value = true
}

const handleEdit = (reward: Reward) => {
  editingReward.value = reward
  showAddModal.value = true
}

const handleCloseModal = () => {
  showAddModal.value = false
  editingReward.value = null
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Quản lý Phần thưởng</h1>
        <p class="text-purple-200/70">Thêm, sửa và quản lý các phần thưởng cho team</p>
      </div>
      <Button variant="primary" @click="handleAddNew">
        + Thêm phần thưởng
      </Button>
    </div>

    <!-- Pending Redemptions -->
    <PendingRedemptions />

    <!-- All Rewards -->
    <div>
      <h3 class="font-semibold text-white mb-3">Danh sách phần thưởng ({{ allRewards.length }})</h3>
      <div class="space-y-3">
        <RewardManageCard
          v-for="reward in allRewards"
          :key="reward.id"
          :reward="reward"
          @edit="handleEdit"
        />
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <AddRewardModal
      :isOpen="showAddModal"
      :editReward="editingReward"
      @close="handleCloseModal"
    />
  </div>
</template>

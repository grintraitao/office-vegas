<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Reward, RewardCategory } from '@/types'
import { useRewardStore, useUserStore } from '@/stores'
import RewardCard from './RewardCard.vue'
import { Modal, Button } from '@/components/ui'

const rewardStore = useRewardStore()
const userStore = useUserStore()

const selectedCategory = ref<RewardCategory | 'all'>('all')
const showConfirmModal = ref(false)
const selectedReward = ref<Reward | null>(null)
const redeemSuccess = ref(false)

const categories: { value: RewardCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'Tất cả', icon: '🎯' },
  { value: 'fun', label: 'Vui vẻ', icon: '🎉' },
  { value: 'privilege', label: 'Đặc quyền', icon: '👑' },
  { value: 'bonding', label: 'Gắn kết', icon: '🤝' },
  { value: 'status', label: 'Danh hiệu', icon: '🏅' },
  { value: 'treat', label: 'Đãi ngộ', icon: '🍰' },
]

const filteredRewards = computed(() => {
  if (selectedCategory.value === 'all') {
    return rewardStore.activeRewards
  }
  return rewardStore.activeRewards.filter(r => r.category === selectedCategory.value)
})

const sortedRewards = computed(() =>
  [...filteredRewards.value].sort((a, b) => a.cost - b.cost)
)

const handleRedeemClick = (reward: Reward) => {
  selectedReward.value = reward
  redeemSuccess.value = false
  showConfirmModal.value = true
}

const confirmRedeem = () => {
  if (!selectedReward.value) return

  const result = rewardStore.redeemReward(selectedReward.value.id)
  if (result) {
    redeemSuccess.value = true
  }
}

const closeModal = () => {
  showConfirmModal.value = false
  selectedReward.value = null
  redeemSuccess.value = false
}
</script>

<template>
  <div>
    <!-- Category Filter -->
    <div class="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
      <button
        v-for="cat in categories"
        :key="cat.value"
        :class="[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
          selectedCategory === cat.value
            ? 'bg-indigo-600 text-white'
            : 'bg-elevated text-muted hover:brightness-110',
        ]"
        @click="selectedCategory = cat.value"
      >
        <span>{{ cat.icon }}</span>
        <span>{{ cat.label }}</span>
      </button>
    </div>

    <!-- Rewards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RewardCard
        v-for="reward in sortedRewards"
        :key="reward.id"
        :reward="reward"
        @redeem="handleRedeemClick"
      />
    </div>

    <div v-if="sortedRewards.length === 0" class="text-center py-12 text-muted">
      Không có phần thưởng nào trong danh mục này
    </div>

    <!-- Confirm Modal -->
    <Modal :isOpen="showConfirmModal" @close="closeModal">
      <template v-if="!redeemSuccess">
        <div class="text-center">
          <div class="text-5xl mb-4">{{ selectedReward?.icon }}</div>
          <h3 class="text-lg font-semibold text-base mb-2">
            Xác nhận đổi thưởng
          </h3>
          <p class="text-muted mb-4">
            Bạn muốn đổi <strong>{{ selectedReward?.cost }} coins</strong> lấy
            <strong>{{ selectedReward?.name }}</strong>?
          </p>
          <div class="flex gap-3 justify-center">
            <Button variant="secondary" @click="closeModal">Huỷ</Button>
            <Button variant="primary" @click="confirmRedeem">Xác nhận</Button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="text-center">
          <div class="text-5xl mb-4">🎉</div>
          <h3 class="text-lg font-semibold text-green-600 mb-2">
            Đổi thưởng thành công!
          </h3>
          <p class="text-muted mb-4">
            Bạn đã đổi <strong>{{ selectedReward?.name }}</strong>.<br />
            Manager sẽ xác nhận và trao thưởng cho bạn sớm nhất!
          </p>
          <Button variant="primary" @click="closeModal">Đóng</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

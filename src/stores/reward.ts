import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Reward, RewardRedemption } from '@/types'
import { useUserStore } from './user'

export const useRewardStore = defineStore('reward', () => {
  const userStore = useUserStore()

  const generateId = () => Math.random().toString(36).substring(2, 9)

  // Demo rewards
  const rewards = ref<Reward[]>([
    { id: 'r1', icon: '🪑', name: 'Chọn chỗ ngồi 1 tuần', description: 'Ngồi đâu tuỳ bạn', cost: 10, category: 'fun', stock: null, isActive: true, createdBy: '5' },
    { id: 'r2', icon: '📱', name: 'Skip 1 buổi họp', description: 'Bỏ qua 1 buổi họp không bắt buộc', cost: 15, category: 'privilege', stock: null, isActive: true, createdBy: '5' },
    { id: 'r3', icon: '🎁', name: 'Mystery gift', description: 'Quà ngẫu nhiên bất ngờ', cost: 25, category: 'fun', stock: 5, isActive: true, createdBy: '5' },
    { id: 'r4', icon: '🧋', name: 'Trà chiều cho 2-3 người', description: 'Rủ bạn đi trà chiều', cost: 30, category: 'bonding', stock: null, isActive: true, createdBy: '5' },
    { id: 'r5', icon: '💬', name: 'Shoutout từ manager', description: 'Được khen trước team', cost: 30, category: 'status', stock: null, isActive: true, createdBy: '5' },
    { id: 'r6', icon: '🔙', name: 'Về sớm 30 phút', description: 'Được về sớm 1 lần', cost: 40, category: 'privilege', stock: 3, isActive: true, createdBy: '5' },
    { id: 'r7', icon: '☕', name: 'Coffee/Trà sữa', description: 'Một ly bất kỳ dưới 50k', cost: 50, category: 'treat', stock: null, isActive: true, createdBy: '5' },
    { id: 'r8', icon: '🎮', name: 'Game break 30 phút', description: 'Cả team nghỉ chơi game', cost: 80, category: 'bonding', stock: null, isActive: true, createdBy: '5' },
    { id: 'r9', icon: '🍜', name: 'Bữa trưa free', description: 'Team trả bữa trưa', cost: 100, category: 'treat', stock: null, isActive: true, createdBy: '5' },
    { id: 'r10', icon: '🎬', name: 'Team movie break', description: 'Cả team xem phim giờ nghỉ', cost: 120, category: 'bonding', stock: 2, isActive: true, createdBy: '5' },
    { id: 'r11', icon: '🏆', name: 'Đặt tên feature/project', description: 'Đặt tên cho feature tiếp theo', cost: 150, category: 'status', stock: 1, isActive: true, createdBy: '5' },
    { id: 'r12', icon: '🍕', name: 'Pizza party cho team', description: 'Pizza cho cả team!', cost: 200, category: 'bonding', stock: 1, isActive: true, createdBy: '5' },
  ])

  const redemptions = ref<RewardRedemption[]>([])

  // Getters
  const activeRewards = computed(() =>
    rewards.value.filter(r => r.isActive && (r.stock === null || r.stock > 0))
  )

  const rewardsByCategory = computed(() => {
    const grouped: Record<string, Reward[]> = {}
    activeRewards.value.forEach(reward => {
      if (!grouped[reward.category]) {
        grouped[reward.category] = []
      }
      grouped[reward.category].push(reward)
    })
    return grouped
  })

  const myRedemptions = computed(() =>
    redemptions.value.filter(r => r.userId === userStore.currentUser?.id)
  )

  const pendingRedemptions = computed(() =>
    redemptions.value.filter(r => r.status === 'pending')
  )

  const canAfford = (rewardId: string) => {
    const reward = rewards.value.find(r => r.id === rewardId)
    if (!reward || !userStore.currentUser) return false
    return userStore.currentUser.coins >= reward.cost
  }

  const getRewardById = (id: string) => rewards.value.find(r => r.id === id)

  // Actions
  const redeemReward = (rewardId: string) => {
    const reward = rewards.value.find(r => r.id === rewardId)
    if (!reward || !userStore.currentUser) return null

    if (userStore.currentUser.coins < reward.cost) return null
    if (reward.stock !== null && reward.stock <= 0) return null

    // Deduct coins
    userStore.addCoins(userStore.currentUser.id, -reward.cost)

    // Reduce stock if limited
    if (reward.stock !== null) {
      reward.stock--
    }

    // Create redemption record
    const redemption: RewardRedemption = {
      id: generateId(),
      rewardId,
      userId: userStore.currentUser.id,
      redeemedAt: new Date(),
      status: 'pending',
    }
    redemptions.value.unshift(redemption)

    return redemption
  }

  const fulfillRedemption = (redemptionId: string) => {
    const redemption = redemptions.value.find(r => r.id === redemptionId)
    if (redemption) {
      redemption.status = 'fulfilled'
    }
  }

  const cancelRedemption = (redemptionId: string) => {
    const redemption = redemptions.value.find(r => r.id === redemptionId)
    if (!redemption) return

    const reward = rewards.value.find(r => r.id === redemption.rewardId)

    // Refund coins
    userStore.addCoins(redemption.userId, reward?.cost ?? 0)

    // Restore stock
    if (reward && reward.stock !== null) {
      reward.stock++
    }

    redemption.status = 'cancelled'
  }

  const addReward = (rewardData: Omit<Reward, 'id' | 'createdBy' | 'isActive'>) => {
    const newReward: Reward = {
      ...rewardData,
      id: generateId(),
      createdBy: userStore.currentUser?.id ?? '',
      isActive: true,
    }
    rewards.value.push(newReward)
    return newReward
  }

  const updateReward = (rewardId: string, updates: Partial<Reward>) => {
    const reward = rewards.value.find(r => r.id === rewardId)
    if (reward) {
      Object.assign(reward, updates)
    }
  }

  const toggleRewardActive = (rewardId: string) => {
    const reward = rewards.value.find(r => r.id === rewardId)
    if (reward) {
      reward.isActive = !reward.isActive
    }
  }

  return {
    // State
    rewards,
    redemptions,
    // Getters
    activeRewards,
    rewardsByCategory,
    myRedemptions,
    pendingRedemptions,
    canAfford,
    getRewardById,
    // Actions
    redeemReward,
    fulfillRedemption,
    cancelRedemption,
    addReward,
    updateReward,
    toggleRewardActive,
  }
})

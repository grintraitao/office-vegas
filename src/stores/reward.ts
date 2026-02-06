import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Reward, RewardRedemption } from '@/types'
import { supabase } from '@/lib/supabase'
import { mapDbRewardToReward, mapDbRedemptionToRedemption, mapRewardToDbReward } from '@/lib/helpers/mappers'
import { useUserStore } from './user'

export const useRewardStore = defineStore('reward', () => {
  const userStore = useUserStore()

  // State
  const rewards = ref<Reward[]>([])
  const redemptions = ref<RewardRedemption[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeRewards = computed(() =>
    rewards.value.filter((r) => r.isActive && (r.stock === null || r.stock > 0))
  )

  const rewardsByCategory = computed(() => {
    const grouped: Record<string, Reward[]> = {}
    activeRewards.value.forEach((reward) => {
      const category = reward.category
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category]!.push(reward)
    })
    return grouped
  })

  const myRedemptions = computed(() =>
    redemptions.value.filter((r) => r.userId === userStore.currentUser?.id)
  )

  const pendingRedemptions = computed(() => redemptions.value.filter((r) => r.status === 'pending'))

  const canAfford = (rewardId: string) => {
    const reward = rewards.value.find((r) => r.id === rewardId)
    if (!reward || !userStore.currentUser) return false
    return userStore.currentUser.coins >= reward.cost
  }

  const getRewardById = (id: string) => rewards.value.find((r) => r.id === id)

  // ============ FETCH ACTIONS ============

  const fetchRewards = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('rewards')
        .select('*')
        .order('cost', { ascending: true })

      if (fetchError) throw fetchError

      rewards.value = (data ?? []).map(mapDbRewardToReward)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch rewards'
      console.error('fetchRewards error:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchRedemptions = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('redemptions')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      redemptions.value = (data ?? []).map(mapDbRedemptionToRedemption)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch redemptions'
      console.error('fetchRedemptions error:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchAll = async () => {
    await Promise.all([fetchRewards(), fetchRedemptions()])
  }

  // ============ REWARD ACTIONS ============

  const addReward = async (rewardData: Omit<Reward, 'id' | 'createdBy' | 'isActive'>) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: insertError } = await supabase
        .from('rewards')
        .insert({
          icon: rewardData.icon,
          name: rewardData.name,
          description: rewardData.description,
          cost: rewardData.cost,
          category: rewardData.category,
          stock: rewardData.stock,
          is_active: true,
          created_by: userStore.currentUser?.id ?? '',
        })
        .select()
        .single()

      if (insertError) throw insertError

      const newReward = mapDbRewardToReward(data)
      rewards.value.push(newReward)

      return newReward
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to add reward'
      console.error('addReward error:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateReward = async (rewardId: string, updates: Partial<Reward>) => {
    try {
      loading.value = true
      error.value = null

      const dbUpdates = mapRewardToDbReward(updates)

      const { error: updateError } = await supabase.from('rewards').update(dbUpdates).eq('id', rewardId)

      if (updateError) throw updateError

      // Update local state
      const reward = rewards.value.find((r) => r.id === rewardId)
      if (reward) {
        Object.assign(reward, updates)
      }

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update reward'
      console.error('updateReward error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  const toggleRewardActive = async (rewardId: string) => {
    const reward = rewards.value.find((r) => r.id === rewardId)
    if (!reward) return false

    try {
      const newStatus = !reward.isActive

      const { error: updateError } = await supabase
        .from('rewards')
        .update({ is_active: newStatus })
        .eq('id', rewardId)

      if (updateError) throw updateError

      reward.isActive = newStatus
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to toggle reward'
      console.error('toggleRewardActive error:', e)
      return false
    }
  }

  // ============ REDEMPTION ACTIONS ============

  const redeemReward = async (rewardId: string) => {
    const reward = rewards.value.find((r) => r.id === rewardId)
    if (!reward || !userStore.currentUser) return null

    if (userStore.currentUser.coins < reward.cost) return null
    if (reward.stock !== null && reward.stock <= 0) return null

    try {
      loading.value = true
      error.value = null

      // Deduct coins from user
      await userStore.addCoins(userStore.currentUser.id, -reward.cost)

      // Reduce stock if limited
      if (reward.stock !== null) {
        const newStock = reward.stock - 1
        await supabase.from('rewards').update({ stock: newStock }).eq('id', rewardId)
        reward.stock = newStock
      }

      // Create redemption record
      const { data, error: insertError } = await supabase
        .from('redemptions')
        .insert({
          reward_id: rewardId,
          user_id: userStore.currentUser.id,
          status: 'pending',
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Create transaction for redemption
      await supabase.from('transactions').insert({
        user_id: userStore.currentUser.id,
        amount: -reward.cost,
        type: 'redemption',
        description: `Đổi thưởng: ${reward.name}`,
      })

      const redemption = mapDbRedemptionToRedemption(data)
      redemptions.value.unshift(redemption)

      return redemption
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to redeem reward'
      console.error('redeemReward error:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const fulfillRedemption = async (redemptionId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('redemptions')
        .update({ status: 'fulfilled' })
        .eq('id', redemptionId)

      if (updateError) throw updateError

      const redemption = redemptions.value.find((r) => r.id === redemptionId)
      if (redemption) {
        redemption.status = 'fulfilled'
      }

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fulfill redemption'
      console.error('fulfillRedemption error:', e)
      return false
    }
  }

  const cancelRedemption = async (redemptionId: string) => {
    const redemption = redemptions.value.find((r) => r.id === redemptionId)
    if (!redemption) return false

    const reward = rewards.value.find((r) => r.id === redemption.rewardId)

    try {
      loading.value = true
      error.value = null

      // Update status in database
      const { error: updateError } = await supabase
        .from('redemptions')
        .update({ status: 'cancelled' })
        .eq('id', redemptionId)

      if (updateError) throw updateError

      // Refund coins
      await userStore.addCoins(redemption.userId, reward?.cost ?? 0)

      // Restore stock
      if (reward && reward.stock !== null) {
        const newStock = reward.stock + 1
        await supabase.from('rewards').update({ stock: newStock }).eq('id', reward.id)
        reward.stock = newStock
      }

      // Update local state
      redemption.status = 'cancelled'

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to cancel redemption'
      console.error('cancelRedemption error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    rewards,
    redemptions,
    loading,
    error,
    // Getters
    activeRewards,
    rewardsByCategory,
    myRedemptions,
    pendingRedemptions,
    canAfford,
    getRewardById,
    // Fetch Actions
    fetchRewards,
    fetchRedemptions,
    fetchAll,
    // Reward Actions
    addReward,
    updateReward,
    toggleRewardActive,
    // Redemption Actions
    redeemReward,
    fulfillRedemption,
    cancelRedemption,
  }
})

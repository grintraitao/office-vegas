import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Game, Task, Transaction } from '@/types'
import type { Database } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { mapDbGameToGame, mapDbTaskToTask, mapDbTransactionToTransaction } from '@/lib/helpers/mappers'
import { useUserStore } from './user'

export const useGameStore = defineStore('game', () => {
  const userStore = useUserStore()

  // State
  const currentGame = ref<Game | null>(null)
  const tasks = ref<Task[]>([])
  const transactions = ref<Transaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const pendingTasks = computed(() => tasks.value.filter((t) => t.status === 'pending'))

  const approvedTasks = computed(() => tasks.value.filter((t) => t.status === 'approved'))

  const teamProgress = computed(() => {
    if (!currentGame.value) return 0
    return Math.min(100, (currentGame.value.currentCoins / currentGame.value.targetCoins) * 100)
  })

  const isGameActive = computed(() => {
    if (!currentGame.value) return false
    return currentGame.value.status === 'active' && new Date(currentGame.value.endDate) > new Date()
  })

  const daysRemaining = computed(() => {
    if (!currentGame.value) return 0
    const now = new Date()
    const end = new Date(currentGame.value.endDate)
    const diff = end.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  })

  const getTasksByUser = (userId: string) => {
    return tasks.value.filter((t) => t.userId === userId)
  }

  const getApprovedTasksCount = (userId: string) => {
    return tasks.value.filter((t) => t.userId === userId && t.status === 'approved').length
  }

  const teamContributions = computed(() => {
    const totalCoins = currentGame.value?.currentCoins || 0
    return userStore.employees
      .map((emp) => ({
        id: emp.id,
        name: emp.nickname,
        coins: emp.coins,
        percentage: totalCoins > 0 ? Math.round((emp.coins / totalCoins) * 100) : 0,
      }))
      .sort((a, b) => b.coins - a.coins)
  })

  // ============ FETCH ACTIONS ============

  const fetchCurrentGame = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (fetchError) throw fetchError

      currentGame.value = data ? mapDbGameToGame(data) : null
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch game'
      console.error('fetchCurrentGame error:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchTasks = async () => {
    try {
      loading.value = true
      error.value = null

      // Fetch tasks with user nicknames via join
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*, users(nickname)')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Cast to expected type since Supabase generated types don't include relationships
      type TaskWithUser = Database['public']['Tables']['tasks']['Row'] & {
        users?: { nickname: string }
      }
      tasks.value = ((data ?? []) as unknown as TaskWithUser[]).map(mapDbTaskToTask)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch tasks'
      console.error('fetchTasks error:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchTransactions = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (fetchError) throw fetchError

      transactions.value = (data ?? []).map(mapDbTransactionToTransaction)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch transactions'
      console.error('fetchTransactions error:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchAll = async () => {
    await Promise.all([fetchCurrentGame(), fetchTasks(), fetchTransactions()])
  }

  // ============ TASK ACTIONS ============

  const submitTask = async (taskData: { userId: string; userName: string; title: string; outcome: string }) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert({
          user_id: taskData.userId,
          game_id: currentGame.value?.id ?? null,
          title: taskData.title,
          outcome: taskData.outcome,
          status: 'pending',
          reward: 0,
        })
        .select('*, users(nickname)')
        .single()

      if (insertError) throw insertError

      // Cast to expected type
      type TaskWithUser = Database['public']['Tables']['tasks']['Row'] & {
        users?: { nickname: string }
      }
      const newTask = mapDbTaskToTask(data as unknown as TaskWithUser)
      tasks.value.unshift(newTask)

      return newTask
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to submit task'
      console.error('submitTask error:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const approveTask = async (taskId: string, reward: number) => {
    try {
      loading.value = true
      error.value = null

      const task = tasks.value.find((t) => t.id === taskId)
      if (!task) throw new Error('Task not found')

      const now = new Date().toISOString()

      // Update task in database
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          status: 'approved',
          reward: reward,
          reviewed_at: now,
        })
        .eq('id', taskId)

      if (updateError) throw updateError

      // Add coins to user
      await userStore.addCoins(task.userId, reward)

      // Create transaction
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: task.userId,
          game_id: currentGame.value?.id ?? null,
          amount: reward,
          type: 'task_reward',
          description: `Task approved: ${task.title}`,
        })
        .select()
        .single()

      if (txError) throw txError

      // Update local state
      task.status = 'approved'
      task.reward = reward
      task.reviewedAt = new Date(now)

      if (txData) {
        transactions.value.unshift(mapDbTransactionToTransaction(txData))
      }

      // Update game coins
      await updateGameCoins()

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to approve task'
      console.error('approveTask error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  const rejectTask = async (taskId: string) => {
    try {
      loading.value = true
      error.value = null

      const task = tasks.value.find((t) => t.id === taskId)
      if (!task) throw new Error('Task not found')

      const now = new Date().toISOString()

      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          status: 'rejected',
          reviewed_at: now,
        })
        .eq('id', taskId)

      if (updateError) throw updateError

      // Update local state
      task.status = 'rejected'
      task.reviewedAt = new Date(now)

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to reject task'
      console.error('rejectTask error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  // ============ GAME ACTIONS ============

  const createGame = async (gameData: Omit<Game, 'id' | 'currentCoins' | 'status'>) => {
    try {
      loading.value = true
      error.value = null

      const insertData: Database['public']['Tables']['games']['Insert'] = {
        name: gameData.name,
        target_coins: gameData.targetCoins,
        current_coins: 0,
        reward: gameData.reward,
        sponsor_type: gameData.sponsorType,
        sponsor: gameData.sponsor,
        start_date: gameData.startDate.toISOString().slice(0, 10),
        end_date: gameData.endDate.toISOString().slice(0, 10),
        bonus_top1: gameData.bonusTop1,
        bonus_top2: gameData.bonusTop2,
        bonus_top3: gameData.bonusTop3,
        status: 'active',
      }

      const { data, error: insertError } = await supabase
        .from('games')
        .insert(insertData)
        .select()
        .single()

      if (insertError) throw insertError

      currentGame.value = mapDbGameToGame(data)
      await updateGameCoins()

      return currentGame.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create game'
      console.error('createGame error:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateGame = async (updates: Partial<Omit<Game, 'id' | 'currentCoins' | 'status'>>) => {
    if (!currentGame.value) return false

    try {
      loading.value = true
      error.value = null

      const dbUpdates: Record<string, unknown> = {}
      if (updates.name !== undefined) dbUpdates.name = updates.name
      if (updates.targetCoins !== undefined) dbUpdates.target_coins = updates.targetCoins
      if (updates.reward !== undefined) dbUpdates.reward = updates.reward
      if (updates.sponsorType !== undefined) dbUpdates.sponsor_type = updates.sponsorType
      if (updates.sponsor !== undefined) dbUpdates.sponsor = updates.sponsor
      if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate.toISOString().split('T')[0]
      if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate.toISOString().split('T')[0]
      if (updates.bonusTop1 !== undefined) dbUpdates.bonus_top1 = updates.bonusTop1
      if (updates.bonusTop2 !== undefined) dbUpdates.bonus_top2 = updates.bonusTop2
      if (updates.bonusTop3 !== undefined) dbUpdates.bonus_top3 = updates.bonusTop3

      const { error: updateError } = await supabase
        .from('games')
        .update(dbUpdates)
        .eq('id', currentGame.value.id)

      if (updateError) throw updateError

      // Update local state
      Object.assign(currentGame.value, updates)

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update game'
      console.error('updateGame error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  const endGame = async () => {
    if (!currentGame.value) return false

    try {
      loading.value = true
      error.value = null

      // Distribute bonus to top 3
      const top3 = userStore.leaderboard.slice(0, 3)
      const bonuses = [currentGame.value.bonusTop1, currentGame.value.bonusTop2, currentGame.value.bonusTop3]

      for (let i = 0; i < top3.length; i++) {
        const user = top3[i]
        const bonus = bonuses[i] ?? 0

        if (!user || bonus <= 0) continue

        await userStore.addCoins(user.id, bonus)

        // Add transaction
        await supabase.from('transactions').insert({
          user_id: user.id,
          game_id: currentGame.value.id,
          amount: bonus,
          type: 'bonus',
          description: `🏆 Bonus Top ${i + 1}: ${currentGame.value.name}`,
        })
      }

      // Update game status
      const { error: updateError } = await supabase
        .from('games')
        .update({ status: 'ended' })
        .eq('id', currentGame.value.id)

      if (updateError) throw updateError

      currentGame.value = null

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to end game'
      console.error('endGame error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  const updateGameCoins = async () => {
    if (!currentGame.value) return

    const totalCoins = userStore.employees.reduce((sum, emp) => sum + emp.coins, 0)

    // Update in database
    await supabase.from('games').update({ current_coins: totalCoins }).eq('id', currentGame.value.id)

    // Update local state
    currentGame.value.currentCoins = totalCoins
  }

  return {
    // State
    currentGame,
    tasks,
    transactions,
    loading,
    error,
    // Getters
    pendingTasks,
    approvedTasks,
    teamProgress,
    isGameActive,
    daysRemaining,
    getTasksByUser,
    getApprovedTasksCount,
    teamContributions,
    // Fetch Actions
    fetchCurrentGame,
    fetchTasks,
    fetchTransactions,
    fetchAll,
    // Task Actions
    submitTask,
    approveTask,
    rejectTask,
    // Game Actions
    createGame,
    updateGame,
    endGame,
    updateGameCoins,
  }
})

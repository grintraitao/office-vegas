import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Game, Task, Transaction } from '@/types'
import { useUserStore } from './user'

export const useGameStore = defineStore('game', () => {
  const userStore = useUserStore()

  // Helper to generate IDs
  const generateId = () => Math.random().toString(36).substring(2, 9)

  // State
  const currentGame = ref<Game | null>({
    id: '1',
    name: 'Sprint Tháng 2',
    targetCoins: 500,
    currentCoins: 0,
    reward: 'Trà sữa cả team 🧋',
    sponsorType: 'self',
    sponsor: 'Hiếu thứ 3',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
    bonusTop1: 50,
    bonusTop2: 25,
    bonusTop3: 10,
    status: 'active',
  })

  const tasks = ref<Task[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Tiểu Nhân',
      title: 'Setup CI/CD',
      outcome: 'Đã setup GitHub Actions cho auto deploy',
      status: 'pending',
      reward: 0,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      reviewedAt: null,
    },
    {
      id: '2',
      userId: '2',
      userName: 'Thầy Tín',
      title: 'Design homepage',
      outcome: 'Hoàn thành mockup Figma cho trang chủ',
      status: 'pending',
      reward: 0,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      reviewedAt: null,
    },
    {
      id: '3',
      userId: '3',
      userName: 'Vietlish Expert',
      title: 'Fix bug login',
      outcome: 'Sửa lỗi không đăng nhập được trên Safari',
      status: 'approved',
      reward: 25,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      reviewedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    },
    {
      id: '4',
      userId: '4',
      userName: 'Tung Tung Tung Sahur',
      title: 'Viết docs API',
      outcome: 'Hoàn thành documentation cho 15 endpoints',
      status: 'approved',
      reward: 40,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      reviewedAt: new Date(Date.now() - 44 * 60 * 60 * 1000),
    },
  ])

  const transactions = ref<Transaction[]>([
    {
      id: '1',
      userId: '3',
      amount: 25,
      type: 'task_reward',
      description: 'Task approved: Fix bug login',
      timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
    },
    {
      id: '2',
      userId: '4',
      amount: 40,
      type: 'task_reward',
      description: 'Task approved: Viết docs API',
      timestamp: new Date(Date.now() - 44 * 60 * 60 * 1000),
    },
  ])

  // Getters
  const pendingTasks = computed(() =>
    tasks.value.filter(t => t.status === 'pending')
  )

  const approvedTasks = computed(() =>
    tasks.value.filter(t => t.status === 'approved')
  )

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
    return tasks.value.filter(t => t.userId === userId)
  }

  const getApprovedTasksCount = (userId: string) => {
    return tasks.value.filter(t => t.userId === userId && t.status === 'approved').length
  }

  const teamContributions = computed(() => {
    const totalCoins = currentGame.value?.currentCoins || 0
    return userStore.employees
      .map(emp => ({
        id: emp.id,
        name: emp.nickname,
        coins: emp.coins,
        percentage: totalCoins > 0 ? Math.round((emp.coins / totalCoins) * 100) : 0,
      }))
      .sort((a, b) => b.coins - a.coins)
  })

  // Actions
  const submitTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'status' | 'reward' | 'reviewedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      status: 'pending',
      reward: 0,
      createdAt: new Date(),
      reviewedAt: null,
    }
    tasks.value.unshift(newTask)
    return newTask
  }

  const approveTask = (taskId: string, reward: number) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task) return

    task.status = 'approved'
    task.reward = reward
    task.reviewedAt = new Date()

    // Add coins to user
    userStore.addCoins(task.userId, reward)

    // Add transaction
    const transaction: Transaction = {
      id: generateId(),
      userId: task.userId,
      amount: reward,
      type: 'task_reward',
      description: `Task approved: ${task.title}`,
      timestamp: new Date(),
    }
    transactions.value.unshift(transaction)

    // Update game coins
    updateGameCoins()
  }

  const rejectTask = (taskId: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task) return

    task.status = 'rejected'
    task.reviewedAt = new Date()
  }

  const createGame = (gameData: Omit<Game, 'id' | 'currentCoins' | 'status'>) => {
    currentGame.value = {
      ...gameData,
      id: generateId(),
      currentCoins: 0,
      status: 'active',
    }
    updateGameCoins()
  }

  const updateGame = (updates: Partial<Omit<Game, 'id' | 'currentCoins' | 'status'>>) => {
    if (!currentGame.value) return
    Object.assign(currentGame.value, updates)
  }

  const endGame = () => {
    if (!currentGame.value) return

    // Distribute bonus to top 3
    const top3 = userStore.leaderboard.slice(0, 3)
    const bonuses: number[] = [
      currentGame.value.bonusTop1,
      currentGame.value.bonusTop2,
      currentGame.value.bonusTop3,
    ]

    top3.forEach((user, index) => {
      const bonus = bonuses[index] ?? 0
      if (bonus > 0) {
        userStore.addCoins(user.id, bonus)

        // Add transaction
        const transaction: Transaction = {
          id: generateId(),
          userId: user.id,
          amount: bonus,
          type: 'task_reward',
          description: `🏆 Bonus Top ${index + 1}: ${currentGame.value?.name}`,
          timestamp: new Date(),
        }
        transactions.value.unshift(transaction)
      }
    })

    // Set game as ended
    currentGame.value.status = 'ended'
    currentGame.value = null
  }

  const updateGameCoins = () => {
    if (!currentGame.value) return

    const totalCoins = userStore.employees.reduce((sum, emp) => sum + emp.coins, 0)
    currentGame.value.currentCoins = totalCoins
  }

  // Initialize game coins
  updateGameCoins()

  return {
    // State
    currentGame,
    tasks,
    transactions,
    // Getters
    pendingTasks,
    approvedTasks,
    teamProgress,
    isGameActive,
    daysRemaining,
    getTasksByUser,
    getApprovedTasksCount,
    teamContributions,
    // Actions
    submitTask,
    approveTask,
    rejectTask,
    createGame,
    updateGame,
    endGame,
    updateGameCoins,
  }
})

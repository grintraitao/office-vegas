export interface User {
  id: string
  name: string
  role: 'employee' | 'manager'
  coins: number
  streak: number
}

export interface Task {
  id: string
  userId: string
  userName: string
  title: string
  outcome: string
  status: 'pending' | 'approved' | 'rejected'
  reward: number
  createdAt: Date
  reviewedAt: Date | null
}

export interface Game {
  id: string
  name: string
  targetCoins: number
  currentCoins: number
  reward: string
  sponsor: string
  startDate: Date
  endDate: Date
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: 'task_reward' | 'lottery_win' | 'lottery_lose'
  description: string
  timestamp: Date
}

export interface LotteryBet {
  lowRange: number
  highRange: number
  betAmount: number
  multiplier: number
  result: number | null
  won: boolean | null
}

/**
 * Mappers to convert between Database types (snake_case) and App types (camelCase)
 */

import type { DbGame, DbTask, DbTransaction, DbReward, DbRedemption } from '@/types/database'
import type { Game, Task, Transaction, Reward, RewardRedemption } from '@/types'

// ============ GAME ============

export function mapDbGameToGame(db: DbGame): Game {
  return {
    id: db.id,
    name: db.name,
    targetCoins: db.target_coins,
    currentCoins: db.current_coins,
    reward: db.reward,
    sponsorType: db.sponsor_type,
    sponsor: db.sponsor,
    startDate: new Date(db.start_date),
    endDate: new Date(db.end_date),
    bonusTop1: db.bonus_top1,
    bonusTop2: db.bonus_top2,
    bonusTop3: db.bonus_top3,
    status: db.status,
  }
}

export function mapGameToDbGame(game: Partial<Game>): Partial<DbGame> {
  const result: Partial<DbGame> = {}

  if (game.name !== undefined) result.name = game.name
  if (game.targetCoins !== undefined) result.target_coins = game.targetCoins
  if (game.currentCoins !== undefined) result.current_coins = game.currentCoins
  if (game.reward !== undefined) result.reward = game.reward
  if (game.sponsorType !== undefined) result.sponsor_type = game.sponsorType
  if (game.sponsor !== undefined) result.sponsor = game.sponsor
  if (game.startDate !== undefined) result.start_date = game.startDate.toISOString().split('T')[0]
  if (game.endDate !== undefined) result.end_date = game.endDate.toISOString().split('T')[0]
  if (game.bonusTop1 !== undefined) result.bonus_top1 = game.bonusTop1
  if (game.bonusTop2 !== undefined) result.bonus_top2 = game.bonusTop2
  if (game.bonusTop3 !== undefined) result.bonus_top3 = game.bonusTop3
  if (game.status !== undefined) result.status = game.status

  return result
}

// ============ TASK ============

export function mapDbTaskToTask(db: DbTask & { users?: { nickname: string } }): Task {
  return {
    id: db.id,
    userId: db.user_id,
    userName: db.users?.nickname ?? 'Unknown',
    title: db.title,
    outcome: db.outcome,
    status: db.status,
    reward: db.reward,
    createdAt: new Date(db.created_at),
    reviewedAt: db.reviewed_at ? new Date(db.reviewed_at) : null,
  }
}

// ============ TRANSACTION ============

export function mapDbTransactionToTransaction(db: DbTransaction): Transaction {
  return {
    id: db.id,
    userId: db.user_id,
    amount: db.amount,
    type: db.type as Transaction['type'],
    description: db.description,
    timestamp: new Date(db.created_at),
  }
}

// ============ REWARD ============

export function mapDbRewardToReward(db: DbReward): Reward {
  return {
    id: db.id,
    icon: db.icon,
    name: db.name,
    description: db.description,
    cost: db.cost,
    category: db.category,
    stock: db.stock,
    isActive: db.is_active,
    createdBy: db.created_by,
  }
}

export function mapRewardToDbReward(reward: Partial<Reward>): Partial<DbReward> {
  const result: Partial<DbReward> = {}

  if (reward.icon !== undefined) result.icon = reward.icon
  if (reward.name !== undefined) result.name = reward.name
  if (reward.description !== undefined) result.description = reward.description
  if (reward.cost !== undefined) result.cost = reward.cost
  if (reward.category !== undefined) result.category = reward.category
  if (reward.stock !== undefined) result.stock = reward.stock
  if (reward.isActive !== undefined) result.is_active = reward.isActive
  if (reward.createdBy !== undefined) result.created_by = reward.createdBy

  return result
}

// ============ REDEMPTION ============

export function mapDbRedemptionToRedemption(db: DbRedemption): RewardRedemption {
  return {
    id: db.id,
    rewardId: db.reward_id,
    userId: db.user_id,
    redeemedAt: new Date(db.created_at),
    status: db.status,
  }
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_id: string | null
          email: string
          name: string
          nickname: string
          role: 'employee' | 'manager'
          coins: number
          created_at: string
        }
        Insert: {
          id?: string
          auth_id?: string | null
          email: string
          name: string
          nickname: string
          role?: 'employee' | 'manager'
          coins?: number
          created_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          email?: string
          name?: string
          nickname?: string
          role?: 'employee' | 'manager'
          coins?: number
          created_at?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          id: string
          name: string
          target_coins: number
          current_coins: number
          reward: string
          sponsor_type: 'self' | 'company' | 'other'
          sponsor: string
          start_date: string
          end_date: string
          bonus_top1: number
          bonus_top2: number
          bonus_top3: number
          status: 'active' | 'ended'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          target_coins: number
          current_coins?: number
          reward: string
          sponsor_type: 'self' | 'company' | 'other'
          sponsor: string
          start_date: string
          end_date: string
          bonus_top1?: number
          bonus_top2?: number
          bonus_top3?: number
          status?: 'active' | 'ended'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          target_coins?: number
          current_coins?: number
          reward?: string
          sponsor_type?: 'self' | 'company' | 'other'
          sponsor?: string
          start_date?: string
          end_date?: string
          bonus_top1?: number
          bonus_top2?: number
          bonus_top3?: number
          status?: 'active' | 'ended'
          created_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          game_id: string | null
          title: string
          outcome: string
          status: 'pending' | 'approved' | 'rejected'
          reward: number
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          game_id?: string | null
          title: string
          outcome: string
          status?: 'pending' | 'approved' | 'rejected'
          reward?: number
          created_at?: string
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string | null
          title?: string
          outcome?: string
          status?: 'pending' | 'approved' | 'rejected'
          reward?: number
          created_at?: string
          reviewed_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          game_id: string | null
          amount: number
          type: 'task_reward' | 'lottery_win' | 'lottery_lose' | 'redemption' | 'bonus'
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id?: string | null
          amount: number
          type: 'task_reward' | 'lottery_win' | 'lottery_lose' | 'redemption' | 'bonus'
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string | null
          amount?: number
          type?: 'task_reward' | 'lottery_win' | 'lottery_lose' | 'redemption' | 'bonus'
          description?: string
          created_at?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          id: string
          icon: string
          name: string
          description: string
          cost: number
          category: 'fun' | 'privilege' | 'bonding' | 'status' | 'treat'
          stock: number | null
          is_active: boolean
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          icon: string
          name: string
          description: string
          cost: number
          category: 'fun' | 'privilege' | 'bonding' | 'status' | 'treat'
          stock?: number | null
          is_active?: boolean
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          icon?: string
          name?: string
          description?: string
          cost?: number
          category?: 'fun' | 'privilege' | 'bonding' | 'status' | 'treat'
          stock?: number | null
          is_active?: boolean
          created_by?: string
          created_at?: string
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          id: string
          reward_id: string
          user_id: string
          status: 'pending' | 'fulfilled' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          reward_id: string
          user_id: string
          status?: 'pending' | 'fulfilled' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          reward_id?: string
          user_id?: string
          status?: 'pending' | 'fulfilled' | 'cancelled'
          created_at?: string
        }
        Relationships: []
      }
      leaderboard_history: {
        Row: {
          id: string
          month: string
          user_id: string
          nickname: string
          coins: number
          rank: number
          created_at: string
        }
        Insert: {
          id?: string
          month: string
          user_id: string
          nickname: string
          coins: number
          rank?: number
          created_at?: string
        }
        Update: {
          id?: string
          month?: string
          user_id?: string
          nickname?: string
          coins?: number
          rank?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Convenient type aliases
export type DbUser = Tables<'users'>
export type DbGame = Tables<'games'>
export type DbTask = Tables<'tasks'>
export type DbTransaction = Tables<'transactions'>
export type DbReward = Tables<'rewards'>
export type DbRedemption = Tables<'redemptions'>
export type DbLeaderboardHistory = Tables<'leaderboard_history'>

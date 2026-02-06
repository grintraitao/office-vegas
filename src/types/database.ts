export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          nickname: string
          role: 'employee' | 'manager'
          coins: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          nickname: string
          role: 'employee' | 'manager'
          coins?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          nickname?: string
          role?: 'employee' | 'manager'
          coins?: number
          created_at?: string
        }
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
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          user_name: string
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
          user_name: string
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
          user_name?: string
          title?: string
          outcome?: string
          status?: 'pending' | 'approved' | 'rejected'
          reward?: number
          created_at?: string
          reviewed_at?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'task_reward' | 'lottery_win' | 'lottery_lose' | 'redemption'
          description: string
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'task_reward' | 'lottery_win' | 'lottery_lose' | 'redemption'
          description: string
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'task_reward' | 'lottery_win' | 'lottery_lose' | 'redemption'
          description?: string
          timestamp?: string
        }
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
      }
      redemptions: {
        Row: {
          id: string
          reward_id: string
          user_id: string
          redeemed_at: string
          status: 'pending' | 'fulfilled' | 'cancelled'
        }
        Insert: {
          id?: string
          reward_id: string
          user_id: string
          redeemed_at?: string
          status?: 'pending' | 'fulfilled' | 'cancelled'
        }
        Update: {
          id?: string
          reward_id?: string
          user_id?: string
          redeemed_at?: string
          status?: 'pending' | 'fulfilled' | 'cancelled'
        }
      }
      leaderboard_history: {
        Row: {
          id: string
          month: string
          user_id: string
          nickname: string
          coins: number
          color: string
        }
        Insert: {
          id?: string
          month: string
          user_id: string
          nickname: string
          coins: number
          color?: string
        }
        Update: {
          id?: string
          month?: string
          user_id?: string
          nickname?: string
          coins?: number
          color?: string
        }
      }
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

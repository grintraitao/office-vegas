-- =============================================
-- Office Vegas Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. USERS TABLE (linked to Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'manager')),
  coins INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. GAMES TABLE
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  target_coins INTEGER NOT NULL,
  current_coins INTEGER NOT NULL DEFAULT 0,
  reward TEXT NOT NULL,
  sponsor_type TEXT NOT NULL CHECK (sponsor_type IN ('self', 'company', 'other')),
  sponsor TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  bonus_top1 INTEGER NOT NULL DEFAULT 0,
  bonus_top2 INTEGER NOT NULL DEFAULT 0,
  bonus_top3 INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TASKS TABLE
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  outcome TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- 4. TRANSACTIONS TABLE
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('task_reward', 'lottery_win', 'lottery_lose', 'redemption', 'bonus')),
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. REWARDS TABLE
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  cost INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fun', 'privilege', 'bonding', 'status', 'treat')),
  stock INTEGER, -- NULL = unlimited
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. REDEMPTIONS TABLE
CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. LEADERBOARD HISTORY TABLE
CREATE TABLE leaderboard_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month TEXT NOT NULL, -- Format: 'YYYY-MM'
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  coins INTEGER NOT NULL,
  rank INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- INDEXES for better query performance
-- =============================================

CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_game_id ON tasks(game_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_rewards_category ON rewards(category);
CREATE INDEX idx_rewards_is_active ON rewards(is_active);
CREATE INDEX idx_redemptions_user_id ON redemptions(user_id);
CREATE INDEX idx_redemptions_status ON redemptions(status);
CREATE INDEX idx_leaderboard_history_month ON leaderboard_history(month);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_history ENABLE ROW LEVEL SECURITY;

-- Users: can read all, update own profile
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = auth_id);

-- Games: all authenticated users can read, managers can write
CREATE POLICY "Anyone can read games" ON games FOR SELECT USING (true);
CREATE POLICY "Anyone can insert games" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update games" ON games FOR UPDATE USING (true);

-- Tasks: all can read, own user can insert, managers can update
CREATE POLICY "Anyone can read tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tasks" ON tasks FOR UPDATE USING (true);

-- Transactions: all can read and insert
CREATE POLICY "Anyone can read transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert transactions" ON transactions FOR INSERT WITH CHECK (true);

-- Rewards: all can read, managers can write
CREATE POLICY "Anyone can read rewards" ON rewards FOR SELECT USING (true);
CREATE POLICY "Anyone can insert rewards" ON rewards FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update rewards" ON rewards FOR UPDATE USING (true);

-- Redemptions: all can read and insert
CREATE POLICY "Anyone can read redemptions" ON redemptions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert redemptions" ON redemptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update redemptions" ON redemptions FOR UPDATE USING (true);

-- Leaderboard: all can read
CREATE POLICY "Anyone can read leaderboard" ON leaderboard_history FOR SELECT USING (true);
CREATE POLICY "Anyone can insert leaderboard" ON leaderboard_history FOR INSERT WITH CHECK (true);

-- =============================================
-- FUNCTION: Auto-create user profile on signup
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, name, nickname, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

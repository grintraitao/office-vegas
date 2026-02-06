-- =============================================
-- Office Vegas Seed Data
-- Run this AFTER schema.sql
-- NOTE: Users are created via Auth signup, not seeded directly
-- =============================================

-- =============================================
-- SEED REWARDS (doesn't depend on users initially)
-- After first manager signs up, update created_by
-- =============================================

-- Temporary: Insert rewards with NULL created_by, update later
-- Or run this AFTER manager account is created

/*
  INSTRUCTIONS:
  1. First, create accounts via the app (signup)
  2. Get the manager's user ID from the users table
  3. Run the rewards seed with correct created_by ID
*/

-- =============================================
-- REWARDS SEED (run after manager account exists)
-- Replace 'MANAGER_USER_ID' with actual UUID
-- =============================================

/*
INSERT INTO rewards (icon, name, description, cost, category, stock, is_active, created_by) VALUES
  -- Fun
  ('💺', 'Chọn chỗ ngồi', 'Được chọn chỗ ngồi yêu thích trong 1 tuần', 50, 'fun', NULL, true, 'MANAGER_USER_ID'),
  ('🙈', 'Skip buổi họp', 'Được skip 1 buổi họp team (không phải họp quan trọng)', 100, 'fun', 2, true, 'MANAGER_USER_ID'),

  -- Privilege
  ('🏃', 'Về sớm 1 tiếng', 'Được về sớm 1 tiếng trong ngày bất kỳ', 80, 'privilege', NULL, true, 'MANAGER_USER_ID'),
  ('🎧', 'Headphone day', 'Một ngày làm việc không bị disturb', 60, 'privilege', NULL, true, 'MANAGER_USER_ID'),

  -- Bonding
  ('🧋', 'Trà chiều team', 'Team được đi trà chiều, công ty sponsor', 200, 'bonding', 1, true, 'MANAGER_USER_ID'),
  ('🎮', 'Game break 30p', '30 phút chơi game giữa giờ làm', 40, 'bonding', NULL, true, 'MANAGER_USER_ID'),
  ('🍕', 'Pizza party', 'Pizza party cho cả team', 500, 'bonding', 1, true, 'MANAGER_USER_ID'),

  -- Status
  ('📢', 'Shoutout', 'Được shoutout trên channel chung', 30, 'status', NULL, true, 'MANAGER_USER_ID'),
  ('✨', 'Đặt tên feature', 'Được đặt tên cho feature tiếp theo', 150, 'status', 1, true, 'MANAGER_USER_ID'),

  -- Treat
  ('☕', 'Coffee voucher', 'Voucher coffee shop gần văn phòng', 25, 'treat', 10, true, 'MANAGER_USER_ID'),
  ('🍜', 'Free lunch', 'Một bữa trưa miễn phí', 70, 'treat', 5, true, 'MANAGER_USER_ID'),
  ('🎁', 'Mystery gift', 'Quà bí ẩn từ manager', 100, 'treat', 3, true, 'MANAGER_USER_ID');
*/

-- =============================================
-- QUICK SEED SCRIPT (for demo/testing)
-- Run this in SQL Editor after creating accounts
-- =============================================

-- Step 1: Get manager user ID
-- SELECT id FROM users WHERE role = 'manager' LIMIT 1;

-- Step 2: Create a game
/*
INSERT INTO games (name, target_coins, reward, sponsor_type, sponsor, start_date, end_date, bonus_top1, bonus_top2, bonus_top3)
VALUES (
  'Sprint Tháng 2',
  2500,
  'Pizza Party 🍕',
  'company',
  'Công ty',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  50, 30, 20
);
*/

-- =============================================
-- HELPER: Seed rewards function (call after manager exists)
-- =============================================

CREATE OR REPLACE FUNCTION seed_rewards()
RETURNS void AS $$
DECLARE
  manager_id UUID;
BEGIN
  -- Get first manager
  SELECT id INTO manager_id FROM users WHERE role = 'manager' LIMIT 1;

  IF manager_id IS NULL THEN
    RAISE EXCEPTION 'No manager found. Create a manager account first.';
  END IF;

  -- Insert rewards
  INSERT INTO rewards (icon, name, description, cost, category, stock, is_active, created_by) VALUES
    ('💺', 'Chọn chỗ ngồi', 'Được chọn chỗ ngồi yêu thích trong 1 tuần', 50, 'fun', NULL, true, manager_id),
    ('🙈', 'Skip buổi họp', 'Được skip 1 buổi họp team', 100, 'fun', 2, true, manager_id),
    ('🏃', 'Về sớm 1 tiếng', 'Được về sớm 1 tiếng trong ngày bất kỳ', 80, 'privilege', NULL, true, manager_id),
    ('🎧', 'Headphone day', 'Một ngày làm việc không bị disturb', 60, 'privilege', NULL, true, manager_id),
    ('🧋', 'Trà chiều team', 'Team được đi trà chiều', 200, 'bonding', 1, true, manager_id),
    ('🎮', 'Game break 30p', '30 phút chơi game giữa giờ làm', 40, 'bonding', NULL, true, manager_id),
    ('🍕', 'Pizza party', 'Pizza party cho cả team', 500, 'bonding', 1, true, manager_id),
    ('📢', 'Shoutout', 'Được shoutout trên channel chung', 30, 'status', NULL, true, manager_id),
    ('✨', 'Đặt tên feature', 'Được đặt tên cho feature tiếp theo', 150, 'status', 1, true, manager_id),
    ('☕', 'Coffee voucher', 'Voucher coffee shop', 25, 'treat', 10, true, manager_id),
    ('🍜', 'Free lunch', 'Một bữa trưa miễn phí', 70, 'treat', 5, true, manager_id),
    ('🎁', 'Mystery gift', 'Quà bí ẩn từ manager', 100, 'treat', 3, true, manager_id);

  RAISE NOTICE 'Seeded 12 rewards successfully!';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- HELPER: Seed a demo game
-- =============================================

CREATE OR REPLACE FUNCTION seed_demo_game()
RETURNS void AS $$
BEGIN
  INSERT INTO games (name, target_coins, reward, sponsor_type, sponsor, start_date, end_date, bonus_top1, bonus_top2, bonus_top3)
  VALUES (
    'Sprint Tháng 2',
    2500,
    'Pizza Party 🍕',
    'company',
    'Công ty',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    50, 30, 20
  );

  RAISE NOTICE 'Demo game created!';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- USAGE:
-- 1. Run schema.sql first
-- 2. Create accounts via app (at least 1 manager)
-- 3. Run: SELECT seed_rewards();
-- 4. Run: SELECT seed_demo_game();
-- =============================================

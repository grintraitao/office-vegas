-- ============================================
-- OFFICE VEGAS - SQL EXAMPLES
-- Copy & paste vào SQL Editor để chạy
-- ============================================


-- ==================== USERS ====================

-- Tạo Manager mới
SELECT create_demo_user(
  'manager@company.com',   -- email
  'Password123',           -- password
  'Nguyễn Manager',        -- name
  'Boss',                  -- nickname
  'manager'                -- role
);

-- Tạo Employee mới
SELECT create_demo_user(
  'nhanvien@company.com',
  'Password123',
  'Trần Văn A',
  'Anh A',
  'employee'
);

-- Đổi role (employee ↔ manager)
UPDATE public.users SET role = 'manager' WHERE email = 'user@example.com';
UPDATE public.users SET role = 'employee' WHERE email = 'user@example.com';

-- Đổi nickname
UPDATE public.users SET nickname = 'Nickname Mới' WHERE email = 'user@example.com';


-- ==================== COINS ====================

-- Thêm coins cho user
UPDATE public.users SET coins = coins + 50 WHERE email = 'user@example.com';

-- Trừ coins
UPDATE public.users SET coins = coins - 20 WHERE email = 'user@example.com';

-- Set coins về số cụ thể
UPDATE public.users SET coins = 100 WHERE email = 'user@example.com';

-- Reset tất cả coins về 0 (đầu game mới)
UPDATE public.users SET coins = 0 WHERE role = 'employee';

-- Thêm coins cho nhiều người
UPDATE public.users SET coins = coins + 10
WHERE email IN ('user1@example.com', 'user2@example.com');


-- ==================== VIEWS ====================

-- Xem tất cả users
SELECT id, email, nickname, role, coins FROM public.users ORDER BY coins DESC;

-- Xem leaderboard (chỉ employees)
SELECT nickname, coins,
  ROW_NUMBER() OVER (ORDER BY coins DESC) as rank
FROM public.users
WHERE role = 'employee'
ORDER BY coins DESC;

-- Xem tasks pending
SELECT t.title, t.outcome, u.nickname, t.created_at
FROM tasks t
JOIN users u ON t.user_id = u.id
WHERE t.status = 'pending'
ORDER BY t.created_at DESC;

-- Xem tasks đã approved
SELECT t.title, t.reward, u.nickname, t.reviewed_at
FROM tasks t
JOIN users u ON t.user_id = u.id
WHERE t.status = 'approved'
ORDER BY t.reviewed_at DESC;


-- ==================== GAMES ====================

-- Tạo game mới
INSERT INTO games (name, target_coins, reward, sponsor_type, sponsor, start_date, end_date, bonus_top1, bonus_top2, bonus_top3)
VALUES (
  'Tháng 2 - Tết Edition',  -- tên game
  500,                       -- target coins
  'Pizza Party 🍕',          -- phần thưởng team
  'company',                 -- sponsor_type: self/company/other
  'Công ty ABC',             -- sponsor name
  '2025-02-01',              -- ngày bắt đầu
  '2025-02-28',              -- ngày kết thúc
  50,                        -- bonus top 1
  30,                        -- bonus top 2
  20                         -- bonus top 3
);

-- Kết thúc game
UPDATE games SET status = 'ended' WHERE id = 'game-id-here';

-- Xem game đang active
SELECT * FROM games WHERE status = 'active';


-- ==================== REWARDS ====================

-- Thêm reward mới
INSERT INTO rewards (icon, name, description, cost, category, stock, created_by)
VALUES (
  '☕',                      -- icon
  'Coffee Free',             -- tên
  'Một ly cà phê bất kỳ',    -- mô tả
  30,                        -- giá coins
  'treat',                   -- category: fun/privilege/bonding/status/treat
  NULL,                      -- stock (NULL = unlimited)
  (SELECT id FROM users WHERE role = 'manager' LIMIT 1)
);

-- Xem tất cả rewards
SELECT icon, name, cost, category, stock FROM rewards WHERE is_active = true ORDER BY cost;


-- ==================== CLEANUP ====================

-- Xóa user (cẩn thận!)
-- DELETE FROM public.users WHERE email = 'user@example.com';

-- Xóa tất cả tasks của 1 user
-- DELETE FROM tasks WHERE user_id = 'user-id-here';

-- Xóa game
-- DELETE FROM games WHERE id = 'game-id-here';

-- Seed 4 employee accounts
-- Note: These users won't have auth accounts, so they can't login via the app
-- For full functionality, register accounts via the app's /register page

-- Option 1: Insert demo users directly (for testing/display purposes)
INSERT INTO public.users (email, name, nickname, role, coins)
VALUES
  ('employee1@demo.com', 'Nguyễn Văn A', 'Anh A', 'employee', 50),
  ('employee2@demo.com', 'Trần Thị B', 'Chị B', 'employee', 75),
  ('employee3@demo.com', 'Lê Văn C', 'Anh C', 'employee', 120),
  ('employee4@demo.com', 'Phạm Thị D', 'Chị D', 'employee', 30)
ON CONFLICT (email) DO NOTHING;

-- Verify inserted users
SELECT id, email, nickname, role, coins FROM public.users ORDER BY created_at DESC;

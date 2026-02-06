-- ============================================
-- Create 4 Employee Accounts with Auth
-- Run this in Supabase SQL Editor
-- ============================================

-- Create extension if not exists (for password hashing)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to create auth user with profile
CREATE OR REPLACE FUNCTION create_demo_user(
  p_email TEXT,
  p_password TEXT,
  p_name TEXT,
  p_nickname TEXT,
  p_role TEXT DEFAULT 'employee'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Generate UUID for the user
  new_user_id := gen_random_uuid();

  -- Insert into auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    p_email,
    crypt(p_password, gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    jsonb_build_object('name', p_name, 'nickname', p_nickname, 'role', p_role),
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    ''
  )
  ON CONFLICT (email) DO NOTHING;

  -- Insert into auth.identities
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    new_user_id,
    p_email,
    jsonb_build_object('sub', new_user_id, 'email', p_email),
    'email',
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT DO NOTHING;

  RETURN new_user_id;
END;
$$;

-- ============================================
-- Create 4 Employee Accounts
-- Password: Demo@123
-- ============================================

SELECT create_demo_user('employee1@demo.com', 'Demo@123', 'Nguyễn Văn A', 'Anh A', 'employee');
SELECT create_demo_user('employee2@demo.com', 'Demo@123', 'Trần Thị B', 'Chị B', 'employee');
SELECT create_demo_user('employee3@demo.com', 'Demo@123', 'Lê Văn C', 'Anh C', 'employee');
SELECT create_demo_user('employee4@demo.com', 'Demo@123', 'Phạm Thị D', 'Chị D', 'employee');

-- Clean up function (optional - keep for future use)
-- DROP FUNCTION IF EXISTS create_demo_user;

-- ============================================
-- Verify created users
-- ============================================
SELECT
  u.id,
  u.email,
  u.raw_user_meta_data->>'nickname' as nickname,
  u.raw_user_meta_data->>'role' as role,
  u.created_at
FROM auth.users u
WHERE u.email LIKE '%@demo.com'
ORDER BY u.created_at DESC;

-- Check public.users (created by trigger)
SELECT id, email, nickname, role, coins
FROM public.users
WHERE email LIKE '%@demo.com'
ORDER BY created_at DESC;

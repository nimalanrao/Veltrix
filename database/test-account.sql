-- FIXED TEST ACCOUNT SCRIPT
-- This includes all the strict internal GoTrue fields (like is_super_admin, is_sso_user, and is_anonymous) 
-- to prevent the 500 Internal Server Error when you try to log in.

-- 1. Ensure the old corrupted user is deleted
DELETE FROM auth.users WHERE email = 'test@gmail.com';

-- 2. Insert the user correctly
INSERT INTO auth.users (
  instance_id, 
  id, 
  aud, 
  role, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  raw_app_meta_data, 
  raw_user_meta_data, 
  created_at, 
  updated_at, 
  confirmation_token, 
  email_change, 
  email_change_token_new, 
  recovery_token, 
  is_super_admin, 
  is_sso_user,
  is_anonymous
) VALUES (
  '00000000-0000-0000-0000-000000000000', 
  gen_random_uuid(), 
  'authenticated', 
  'authenticated', 
  'test@gmail.com', 
  crypt('test1234', gen_salt('bf')), 
  now(),
  '{"provider":"email","providers":["email"]}', 
  '{"name": "Test User"}', 
  now(), 
  now(),
  '', 
  '', 
  '', 
  '', 
  false, 
  false,
  false
);

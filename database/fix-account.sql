-- Run this in your Supabase SQL Editor to forcefully delete the corrupted account
-- This bypasses the API and removes it directly from the database level

DELETE FROM auth.users WHERE email = 'test@gmail.com';

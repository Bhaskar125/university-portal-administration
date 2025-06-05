-- Fix email confirmation for login issues
-- Run this in Supabase SQL Editor

-- First, check the user status
SELECT 
  id, 
  email, 
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'STUDENT_EMAIL_HERE';

-- Update only email_confirmed_at (confirmed_at is auto-generated)
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'STUDENT_EMAIL_HERE';

-- Verify the update worked
SELECT 
  id, 
  email, 
  email_confirmed_at,
  confirmed_at
FROM auth.users 
WHERE email = 'STUDENT_EMAIL_HERE'; 
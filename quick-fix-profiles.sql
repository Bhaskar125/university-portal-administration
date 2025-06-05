-- Quick fix for profiles foreign key constraint issue
-- Run this in Supabase SQL Editor

-- Remove the problematic foreign key constraint
ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;

-- Verify the constraint is gone by testing a profile creation
INSERT INTO profiles (id, email, first_name, last_name, role)
VALUES (gen_random_uuid(), 'test@example.com', 'Test', 'User', 'student');

-- Clean up the test record
DELETE FROM profiles WHERE email = 'test@example.com'; 
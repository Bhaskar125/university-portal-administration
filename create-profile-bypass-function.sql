-- Create RPC function to bypass foreign key constraint on profiles
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION create_profile_bypass(
  profile_id UUID,
  profile_email TEXT,
  profile_first_name TEXT,
  profile_last_name TEXT,
  profile_phone TEXT DEFAULT NULL,
  profile_role TEXT DEFAULT 'student'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_profile JSON;
BEGIN
  -- Disable foreign key checks temporarily (if possible)
  SET session_replication_role = replica;
  
  -- Insert profile directly
  INSERT INTO profiles (id, email, first_name, last_name, phone, role, created_at, updated_at)
  VALUES (profile_id, profile_email, profile_first_name, profile_last_name, profile_phone, profile_role, NOW(), NOW());
  
  -- Re-enable foreign key checks
  SET session_replication_role = DEFAULT;
  
  -- Return the created profile
  SELECT to_json(p.*) INTO result_profile
  FROM profiles p
  WHERE p.id = profile_id;
  
  RETURN result_profile;
EXCEPTION
  WHEN OTHERS THEN
    -- Re-enable foreign key checks in case of error
    SET session_replication_role = DEFAULT;
    RAISE;
END;
$$; 
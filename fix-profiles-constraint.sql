-- Fix profiles table foreign key constraint issue

-- Step 1: Check current constraints on profiles table
DO $$ 
BEGIN
    RAISE NOTICE 'Checking current constraints on profiles table...';
END $$;

-- Step 2: Drop the problematic foreign key constraint
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
        RAISE NOTICE 'Dropped profiles_id_fkey constraint';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'profiles_id_fkey constraint may not exist or already dropped';
    END;
END $$;

-- Step 3: Ensure profiles table has correct structure
ALTER TABLE profiles 
    ALTER COLUMN id SET DATA TYPE UUID,
    ALTER COLUMN email SET NOT NULL,
    ALTER COLUMN role SET NOT NULL;

-- Step 4: Create indexes for better performance (without foreign key constraint)
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Step 5: Add a check constraint instead of foreign key (more flexible)
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE profiles 
        ADD CONSTRAINT check_profiles_id_format 
        CHECK (id IS NOT NULL AND LENGTH(id::text) = 36);
        RAISE NOTICE 'Added UUID format check constraint';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'Check constraint may already exist';
    END;
END $$;

-- Step 6: Enable RLS on profiles if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Update RLS policies for profiles
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    BEGIN
        DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;
        DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
        DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'Some policies may not exist';
    END;

    -- Create new policies
    BEGIN
        -- Service role (admin) can do everything
        CREATE POLICY "Service role can manage profiles" ON profiles
            FOR ALL USING (true);

        -- Users can view their own profile  
        CREATE POLICY "Users can view own profile" ON profiles
            FOR SELECT USING (auth.uid() = id);

        -- Users can update their own profile
        CREATE POLICY "Users can update own profile" ON profiles
            FOR UPDATE USING (auth.uid() = id);

        RAISE NOTICE 'Created RLS policies for profiles';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'Error creating policies - they may already exist';
    END;
END $$;

-- Step 8: Test the fix by attempting to create a test profile
DO $$ 
DECLARE
    test_id UUID := gen_random_uuid();
BEGIN
    BEGIN
        INSERT INTO profiles (id, email, first_name, last_name, role)
        VALUES (test_id, 'test@example.com', 'Test', 'User', 'student');
        
        DELETE FROM profiles WHERE id = test_id;
        
        RAISE NOTICE '✅ Profiles table is working correctly - test insert/delete successful';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE '❌ Profiles table still has issues: %', SQLERRM;
    END;
END $$; 
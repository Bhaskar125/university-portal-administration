-- Fix professors table schema - add missing columns
-- Run this in Supabase SQL Editor

-- Add missing columns to professors table if they don't exist
DO $$ 
BEGIN
    -- Add experience column if it doesn't exist
    BEGIN
        ALTER TABLE professors ADD COLUMN experience INTEGER;
        RAISE NOTICE 'Added experience column to professors table';
    EXCEPTION 
        WHEN duplicate_column THEN 
            RAISE NOTICE 'experience column already exists in professors table';
    END;
    
    -- Add qualification column if it doesn't exist
    BEGIN
        ALTER TABLE professors ADD COLUMN qualification TEXT;
        RAISE NOTICE 'Added qualification column to professors table';
    EXCEPTION 
        WHEN duplicate_column THEN 
            RAISE NOTICE 'qualification column already exists in professors table';
    END;
    
    -- Add join_date column if it doesn't exist
    BEGIN
        ALTER TABLE professors ADD COLUMN join_date DATE;
        RAISE NOTICE 'Added join_date column to professors table';
    EXCEPTION 
        WHEN duplicate_column THEN 
            RAISE NOTICE 'join_date column already exists in professors table';
    END;
    
    -- Add salary column if it doesn't exist
    BEGIN
        ALTER TABLE professors ADD COLUMN salary DECIMAL(10,2);
        RAISE NOTICE 'Added salary column to professors table';
    EXCEPTION 
        WHEN duplicate_column THEN 
            RAISE NOTICE 'salary column already exists in professors table';
    END;
    
    -- Add specialization column if it doesn't exist
    BEGIN
        ALTER TABLE professors ADD COLUMN specialization TEXT;
        RAISE NOTICE 'Added specialization column to professors table';
    EXCEPTION 
        WHEN duplicate_column THEN 
            RAISE NOTICE 'specialization column already exists in professors table';
    END;
END $$;

-- Verify the table structure
DO $$
DECLARE
    col_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO col_count
    FROM information_schema.columns 
    WHERE table_name = 'professors' 
    AND table_schema = 'public';
    
    RAISE NOTICE 'professors table now has % columns', col_count;
    
    -- List all columns
    FOR col_record IN 
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'professors' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE 'Column: % (Type: %)', col_record.column_name, col_record.data_type;
    END LOOP;
END $$;

-- Recreate the professor_details view to include all columns
DROP VIEW IF EXISTS professor_details;

CREATE VIEW professor_details AS
SELECT 
    pr.id,
    pr.professor_id,
    pr.department_id,
    pr.specialization,
    pr.qualification,
    pr.experience,
    pr.join_date,
    pr.salary,
    pr.created_at,
    p.email,
    p.first_name,
    p.last_name,
    p.phone,
    p.avatar_url,
    d.name as department_name,
    d.code as department_code
FROM professors pr
JOIN profiles p ON pr.id = p.id
JOIN departments d ON pr.department_id = d.id;

-- Grant necessary permissions
GRANT SELECT ON professor_details TO authenticated;
GRANT ALL ON professor_details TO service_role;

RAISE NOTICE 'Professor table schema fix completed successfully!'; 
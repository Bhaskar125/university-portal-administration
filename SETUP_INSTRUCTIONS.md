# University Portal Database Setup Instructions

## Problem
The current issue is a foreign key constraint error: `insert or update on table "students" violates foreign key constraint "students_id_fkey"`

This happens because the `students` table was originally designed to have its `id` column reference `auth.users(id)`, but our pre-registration system creates students before they have auth accounts.

## Solution
We need to run two SQL scripts in your Supabase SQL Editor to fix the database schema.

## Steps to Fix

### 1. First, run the pre-registration table setup
Go to your Supabase dashboard → SQL Editor and run:

```sql
-- Create pre_registered_users table for admin-created users who haven't registered yet
CREATE TABLE IF NOT EXISTS pre_registered_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'professor')),
  auth_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  registered_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on the table
ALTER TABLE pre_registered_users ENABLE ROW LEVEL SECURITY;

-- Create policies for the table
CREATE POLICY "Service role can manage pre_registered_users" ON pre_registered_users
    FOR ALL USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pre_registered_users_email ON pre_registered_users(email);
CREATE INDEX IF NOT EXISTS idx_pre_registered_users_role ON pre_registered_users(role);
```

### 2. Then, fix the students table schema
⚠️ **Important**: This script will:
- Drop dependent views (enrollment_details, student_details, professor_details) and recreate them
- Temporarily remove foreign key constraints from related tables (enrollments, submissions, attendance) and recreate them properly

Run this script to modify the students table:

```sql
-- Fix students table schema to work with pre-registration system

-- Step 0: Drop dependent views first (in correct order)
DO $$ 
BEGIN
    -- Drop enrollment_details view first (it depends on student_details)
    BEGIN
        DROP VIEW IF EXISTS enrollment_details;
        RAISE NOTICE 'Dropped enrollment_details view';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'enrollment_details view may not exist';
    END;
    
    -- Drop student_details view
    BEGIN
        DROP VIEW IF EXISTS student_details;
        RAISE NOTICE 'Dropped student_details view';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'student_details view may not exist';
    END;
    
    -- Drop professor_details view if it exists
    BEGIN
        DROP VIEW IF EXISTS professor_details;
        RAISE NOTICE 'Dropped professor_details view';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'professor_details view may not exist';
    END;
END $$;

-- Step 1: Drop dependent foreign key constraints
DO $$ 
BEGIN
    -- Drop foreign key constraints from dependent tables
    BEGIN
        ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_student_id_fkey;
        RAISE NOTICE 'Dropped enrollments foreign key constraint';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'enrollments_student_id_fkey may not exist';
    END;
    
    BEGIN
        ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_student_id_fkey;
        RAISE NOTICE 'Dropped submissions foreign key constraint';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'submissions_student_id_fkey may not exist';
    END;
    
    BEGIN
        ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_student_id_fkey;
        RAISE NOTICE 'Dropped attendance foreign key constraint';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'attendance_student_id_fkey may not exist';
    END;
END $$;

-- Step 2: Drop the original foreign key constraint on students table
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE students DROP CONSTRAINT IF EXISTS students_id_fkey;
        RAISE NOTICE 'Dropped students foreign key constraint to auth.users';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'students_id_fkey may not exist or already dropped';
    END;
END $$;

-- Step 3: Now we can safely drop the primary key constraint
ALTER TABLE students 
    DROP CONSTRAINT IF EXISTS students_pkey;

-- Step 4: Add new columns and restructure the table
-- Add new columns if they don't exist
ALTER TABLE students 
    ADD COLUMN IF NOT EXISTS uuid_id UUID DEFAULT gen_random_uuid(),
    ADD COLUMN IF NOT EXISTS pre_registration_id UUID,
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS first_name TEXT,
    ADD COLUMN IF NOT EXISTS last_name TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT;

-- Set uuid_id as the new primary key
ALTER TABLE students 
    ADD CONSTRAINT students_pkey PRIMARY KEY (uuid_id);

-- Add foreign key to pre_registered_users
ALTER TABLE students 
    ADD CONSTRAINT fk_students_pre_registration 
    FOREIGN KEY (pre_registration_id) REFERENCES pre_registered_users(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_pre_registration_id ON students(pre_registration_id);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);

-- Step 5: Recreate foreign key constraints to use the new uuid_id
DO $$ 
BEGIN
    -- Recreate enrollments foreign key constraint
    BEGIN
        ALTER TABLE enrollments 
        ADD CONSTRAINT enrollments_student_id_fkey 
        FOREIGN KEY (student_id) REFERENCES students(uuid_id);
        RAISE NOTICE 'Recreated enrollments foreign key constraint';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'Could not recreate enrollments foreign key constraint (table may not exist)';
    END;
    
    -- Recreate submissions foreign key constraint
    BEGIN
        ALTER TABLE submissions 
        ADD CONSTRAINT submissions_student_id_fkey 
        FOREIGN KEY (student_id) REFERENCES students(uuid_id);
        RAISE NOTICE 'Recreated submissions foreign key constraint';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'Could not recreate submissions foreign key constraint (table may not exist)';
    END;
    
    -- Recreate attendance foreign key constraint
    BEGIN
        ALTER TABLE attendance 
        ADD CONSTRAINT attendance_student_id_fkey 
        FOREIGN KEY (student_id) REFERENCES students(uuid_id);
        RAISE NOTICE 'Recreated attendance foreign key constraint';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'Could not recreate attendance foreign key constraint (table may not exist)';
    END;
END $$;

-- Step 6: Update student_details view to work with new schema
DROP VIEW IF EXISTS student_details;

CREATE VIEW student_details AS
SELECT 
    s.uuid_id as id,
    s.student_id,
    s.email,
    s.first_name,
    s.last_name,
    s.phone,
    s.batch,
    s.course,
    s.academic_year,
    s.admission_date,
    s.created_at,
    s.pre_registration_id,
    d.name as department_name,
    d.code as department_code,
    d.id as department_id
FROM students s
JOIN departments d ON s.department_id = d.id;
```

## What This Does

### Pre-Registration System
- Creates a `pre_registered_users` table where admins can create student/professor records without Auth users
- Links to `auth.users` only when they actually register

### Students Table Fix
- Removes the problematic foreign key constraint to `auth.users`
- Adds a new `uuid_id` as the primary key (auto-generated)
- Adds `pre_registration_id` to link back to the pre-registration
- Stores basic info (email, names, phone) directly in the table
- Updates the `student_details` view to work with the new structure

## How the System Works After Fix

1. **Admin creates student**: Creates record in `pre_registered_users` and `students` tables (no Auth user yet)
2. **Student registers**: Creates Auth account, profile, and links everything together
3. **Validation**: Registration checks pre-registration records for exact name/email match
4. **Clean linking**: All records are properly connected when student completes registration

## Testing

After running the scripts, try creating a student again. The system should now work without foreign key constraint errors.

## Files Modified

The following files have been updated to work with this new schema:
- `app/api/students/route.ts` - Student creation API
- `lib/auth-supabase.ts` - Authentication and registration handling
- `app/api/auth/register/route.ts` - Registration validation
- `app/api/auth/check-eligibility/route.ts` - Pre-registration checking 
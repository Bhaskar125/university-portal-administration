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

-- Step 6: Recreate views with new schema
-- Create student_details view
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

-- Recreate professor_details view (if needed)
DO $$ 
BEGIN
    BEGIN
        CREATE VIEW professor_details AS
        SELECT 
            pr.*,
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
        RAISE NOTICE 'Recreated professor_details view';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'Could not recreate professor_details view (tables may not exist)';
    END;
END $$;

-- Recreate enrollment_details view (if needed)
DO $$ 
BEGIN
    BEGIN
        CREATE VIEW enrollment_details AS
        SELECT 
            e.id as enrollment_id,
            e.student_id,
            e.course_id,
            e.enrollment_date,
            e.status as enrollment_status,
            e.grade,
            e.created_at as enrollment_created_at,
            s.first_name || ' ' || s.last_name as student_name,
            s.email as student_email,
            s.student_id as student_roll_number,
            s.department_name as student_department,
            c.course_code,
            c.course_name,
            c.credits,
            c.semester,
            d.name as course_department_name,
            d.code as course_department_code
        FROM enrollments e
        JOIN student_details s ON e.student_id = s.id
        JOIN courses c ON e.course_id = c.id
        JOIN departments d ON c.department_id = d.id;
        RAISE NOTICE 'Recreated enrollment_details view';
    EXCEPTION 
        WHEN OTHERS THEN 
            RAISE NOTICE 'Could not recreate enrollment_details view (tables may not exist)';
    END;
END $$; 
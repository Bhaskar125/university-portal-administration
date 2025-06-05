# Supabase Database Setup Guide

This guide will help you connect your University Portal to Supabase database.

## Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Note down your project URL and API keys from Settings > API

## Step 2: Environment Variables

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Development configuration (set to false for production)
SKIP_AUTH=true
```

Replace the placeholder values with your actual Supabase credentials from:
**Supabase Dashboard > Settings > API**

## Step 3: Create Database Schema

Run the following SQL in your Supabase SQL Editor:

### 1. Create base tables:

```sql
-- Create departments table
CREATE TABLE public.departments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    code text UNIQUE NOT NULL,
    description text,
    head_id uuid,
    created_at timestamp with time zone DEFAULT now()
);

-- Create profiles table (for all users)
CREATE TABLE public.profiles (
    id uuid REFERENCES auth.users(id) PRIMARY KEY,
    email text UNIQUE NOT NULL,
    first_name text,
    last_name text,
    phone text,
    avatar_url text,
    role text NOT NULL CHECK (role IN ('student', 'professor', 'admin')),
    created_at timestamp with time zone DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
    id uuid REFERENCES auth.users(id) PRIMARY KEY,
    student_id text UNIQUE NOT NULL,
    department_id uuid REFERENCES public.departments(id) NOT NULL,
    batch text NOT NULL,
    semester integer NOT NULL,
    gpa decimal(3,2),
    status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
    created_at timestamp with time zone DEFAULT now()
);

-- Create professors table
CREATE TABLE public.professors (
    id uuid REFERENCES auth.users(id) PRIMARY KEY,
    professor_id text UNIQUE NOT NULL,
    department_id uuid REFERENCES public.departments(id) NOT NULL,
    specialization text,
    qualification text,
    experience integer,
    join_date date,
    salary decimal(10,2),
    created_at timestamp with time zone DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_code text UNIQUE NOT NULL,
    course_name text NOT NULL,
    department_id uuid REFERENCES public.departments(id) NOT NULL,
    credits integer NOT NULL,
    semester integer NOT NULL,
    description text,
    professor_id uuid REFERENCES public.professors(id),
    capacity integer DEFAULT 50,
    created_at timestamp with time zone DEFAULT now()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid REFERENCES public.students(id) NOT NULL,
    course_id uuid REFERENCES public.courses(id) NOT NULL,
    enrollment_date timestamp with time zone DEFAULT now(),
    status text DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
    grade text,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(student_id, course_id)
);

-- Optional: Additional info tables (uncomment if needed)
-- CREATE TABLE public.student_additional_info (
--     student_id uuid REFERENCES public.students(id) PRIMARY KEY,
--     address text,
--     date_of_birth date,
--     gender text,
--     blood_group text,
--     nationality text,
--     religion text,
--     category text,
--     father_name text,
--     father_occupation text,
--     father_phone text,
--     mother_name text,
--     mother_occupation text,
--     mother_phone text,
--     guardian_name text,
--     guardian_relation text,
--     guardian_phone text,
--     emergency_contact text,
--     created_at timestamp with time zone DEFAULT now()
-- );
```

### 2. Create views:

```sql
-- View for student details with department info
CREATE VIEW student_details AS
SELECT 
    s.*,
    p.email,
    p.first_name,
    p.last_name,
    p.phone,
    p.avatar_url,
    d.name as department_name,
    d.code as department_code
FROM public.students s
JOIN public.profiles p ON s.id = p.id
JOIN public.departments d ON s.department_id = d.id;

-- View for professor details with department info
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
FROM public.professors pr
JOIN public.profiles p ON pr.id = p.id
JOIN public.departments d ON pr.department_id = d.id;

-- View for enrollment details
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
FROM public.enrollments e
JOIN student_details s ON e.student_id = s.id
JOIN public.courses c ON e.course_id = c.id
JOIN public.departments d ON c.department_id = d.id;
```

### 3. Insert sample departments:

```sql
-- Insert sample departments
INSERT INTO public.departments (name, code, description) VALUES
('Computer Science', 'CS', 'Department of Computer Science and Engineering'),
('Electrical Engineering', 'EE', 'Department of Electrical Engineering'),
('Mechanical Engineering', 'ME', 'Department of Mechanical Engineering'),
('Civil Engineering', 'CE', 'Department of Civil Engineering'),
('Mathematics', 'MATH', 'Department of Mathematics'),
('Physics', 'PHY', 'Department of Physics'),
('Chemistry', 'CHEM', 'Department of Chemistry'),
('Biology', 'BIO', 'Department of Biology');
```

### 4. Set up Row Level Security (RLS):

```sql
-- Enable RLS on tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies (these will work after you set up auth)
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students can view own data" ON public.students
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Professors can view own data" ON public.professors
    FOR SELECT USING (auth.uid() = id);
```

## Step 4: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to the "Add New Student" page in the admin dashboard
3. Fill out the form and submit
4. Check your Supabase dashboard to see if the data was inserted

## Step 5: Enable Real Authentication

### Option A: Use Mock Authentication (Development)
Keep `SKIP_AUTH=true` in your `.env.local` for development testing.

**Updated Mock Credentials:**
- Admin: `admin@universityportal.edu`
- Professor: `professor.john@universityportal.edu`  
- Student: `student.alice@universityportal.edu`

### Option B: Enable Real Supabase Authentication
To enable real authentication:

1. Set `SKIP_AUTH=false` in your `.env.local`
2. Configure Supabase Auth in your dashboard:
   - Go to Authentication > Settings > User Signups
   - **DISABLE** "Enable email confirmations" (for testing)
   - Set site URL to `http://localhost:3000`
3. Test user registration:
   - Go to `/auth/register`
   - Create accounts with different roles
   - Users can immediately sign in without email verification
   - Users will be stored in both `auth.users` and `profiles` tables

**Note:** Re-enable email confirmation before going to production!

## Troubleshooting

### Common Issues:

1. **"relation does not exist" errors**: Make sure you've run all the SQL schema creation commands
2. **Permission denied errors**: Check your RLS policies and make sure you're using the service role key for admin operations
3. **Type mismatch errors**: Ensure all UUID fields are properly configured

### API Endpoints Available:

- `GET /api/students` - Fetch all students
- `POST /api/students` - Create new student
- `GET /api/professors` - Fetch all professors  
- `POST /api/professors` - Create new professor
- `GET /api/departments` - Fetch all departments

## Next Steps

1. Create more professors through the admin interface
2. Set up course creation functionality
3. Implement real authentication
4. Add data validation and error handling
5. Create backup and restore procedures

Your university portal is now connected to a real Supabase database! 🎉 
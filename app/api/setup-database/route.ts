import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    // Test if we can create the table by checking if it exists first
    const { error: testError } = await supabaseAdmin
      .from('pre_registered_users')
      .select('count')
      .limit(1)

    if (!testError) {
      return NextResponse.json({ 
        message: 'Pre-registration table already exists',
        status: 'ready'
      })
    }

    // If table doesn't exist (PGRST116), we need to create it manually
    if (testError.code === 'PGRST116') {
      return NextResponse.json({ 
        error: 'Database setup required',
        message: 'Please run the following SQL in your Supabase SQL Editor:',
        sql: `
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
        `,
        instructions: [
          '1. Go to your Supabase dashboard',
          '2. Navigate to SQL Editor',
          '3. Run the SQL script provided above',
          '4. Try creating a student again'
        ]
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Database error',
      details: testError.message 
    }, { status: 500 })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 
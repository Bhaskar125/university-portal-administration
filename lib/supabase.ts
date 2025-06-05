import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser usage (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable email confirmation for testing
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'student' | 'professor' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role: 'student' | 'professor' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'student' | 'professor' | 'admin'
          created_at?: string
        }
      }
      students: {
        Row: {
          id: string
          student_id: string
          department_id: string
          batch: string
          semester: number
          gpa: number | null
          status: 'active' | 'inactive' | 'graduated'
          created_at: string
        }
        Insert: {
          id: string
          student_id: string
          department_id: string
          batch: string
          semester: number
          gpa?: number | null
          status?: 'active' | 'inactive' | 'graduated'
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          department_id?: string
          batch?: string
          semester?: number
          gpa?: number | null
          status?: 'active' | 'inactive' | 'graduated'
          created_at?: string
        }
      }
      professors: {
        Row: {
          id: string
          professor_id: string
          department_id: string
          specialization: string | null
          qualification: string | null
          experience: number | null
          join_date: string | null
          salary: number | null
          created_at: string
        }
        Insert: {
          id: string
          professor_id: string
          department_id: string
          specialization?: string | null
          qualification?: string | null
          experience?: number | null
          join_date?: string | null
          salary?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          professor_id?: string
          department_id?: string
          specialization?: string | null
          qualification?: string | null
          experience?: number | null
          join_date?: string | null
          salary?: number | null
          created_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          code: string
          description: string | null
          head_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string | null
          head_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          description?: string | null
          head_id?: string | null
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          course_code: string
          course_name: string
          department_id: string
          credits: number
          semester: number
          description: string | null
          professor_id: string | null
          capacity: number
          created_at: string
        }
        Insert: {
          id?: string
          course_code: string
          course_name: string
          department_id: string
          credits: number
          semester: number
          description?: string | null
          professor_id?: string | null
          capacity?: number
          created_at?: string
        }
        Update: {
          id?: string
          course_code?: string
          course_name?: string
          department_id?: string
          credits?: number
          semester?: number
          description?: string | null
          professor_id?: string | null
          capacity?: number
          created_at?: string
        }
      }
    }
  }
} 
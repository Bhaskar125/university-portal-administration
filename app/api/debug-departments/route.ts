import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Check departments table
    const { data: departments, error: deptError } = await supabaseAdmin
      .from('departments')
      .select('*')
      .order('code', { ascending: true })

    // Check if specific department exists
    const { data: cseDept, error: cseError } = await supabaseAdmin
      .from('departments')
      .select('*')
      .eq('code', 'CSE')

    return NextResponse.json({
      all_departments: {
        data: departments || [],
        error: deptError?.message,
        count: departments?.length || 0
      },
      cse_department: {
        data: cseDept || [],
        error: cseError?.message,
        count: cseDept?.length || 0
      },
      department_lookup_test: {
        searching_for: 'CSE',
        found_multiple: cseDept && cseDept.length > 1,
        found_none: !cseDept || cseDept.length === 0
      }
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
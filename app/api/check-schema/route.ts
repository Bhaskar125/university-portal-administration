import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Check if pre_registered_users table exists
    const { error: preRegError } = await supabaseAdmin
      .from('pre_registered_users')
      .select('count')
      .limit(1)

    // Check students table structure by trying to select from it
    const { data: studentsCheck, error: studentsError } = await supabaseAdmin
      .from('students')
      .select('*')
      .limit(1)

    // Check what columns exist in students table by examining the error or success
    let studentsSchema = null
    let studentsHasEmail = false
    let studentsHasUuidId = false

    if (!studentsError && studentsCheck !== null) {
      // Table exists, let's check if it has our new columns
      const { error: schemaError } = await supabaseAdmin
        .from('students')
        .select('uuid_id, email, pre_registration_id')
        .limit(1)
      
      if (!schemaError) {
        studentsHasEmail = true
        studentsHasUuidId = true
        studentsSchema = 'new_schema'
      } else {
        studentsSchema = 'old_schema'
      }
    }

    return NextResponse.json({
      status: 'success',
      checks: {
        pre_registered_users: {
          exists: !preRegError,
          error: preRegError?.message || null
        },
        students: {
          exists: !studentsError,
          schema: studentsSchema,
          hasEmail: studentsHasEmail,
          hasUuidId: studentsHasUuidId,
          error: studentsError?.message || null
        }
      },
      instructions: {
        step1: !preRegError ? '✅ Pre-registration table exists' : '❌ Run database-setup.sql first',
        step2: studentsHasEmail ? '✅ Students table updated' : '❌ Run fix-students-schema.sql',
        next: !preRegError && studentsHasEmail ? 'Ready to create students!' : 'Run the setup scripts first'
      }
    })

  } catch (error) {
    console.error('Schema check error:', error)
    return NextResponse.json({
      error: 'Failed to check schema',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 
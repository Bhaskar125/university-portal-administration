import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Get all students
    const { data: students, error: studentsError } = await supabaseAdmin
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    // Get student_id values to check for duplicates
    const { data: studentIds, error: idsError } = await supabaseAdmin
      .from('students')
      .select('student_id')

    // Check table schema by trying to insert a test record (will fail but show us the required fields)
    const testData = {
      student_id: 'TEST_ID_SCHEMA_CHECK',
      department_id: '1d32e783-6018-400b-9262-de40eda9c80c', // CS department
      batch: '2024',
      course: 'B.Tech',
      academic_year: '1',
      admission_date: '2024-01-01'
    }

    const { error: schemaTestError } = await supabaseAdmin
      .from('students')
      .insert(testData)
      .select()

    // Try with new schema fields
    const newSchemaTestData = {
      ...testData,
      pre_registration_id: crypto.randomUUID(),
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      phone: '1234567890'
    }

    const { error: newSchemaTestError } = await supabaseAdmin
      .from('students')
      .insert(newSchemaTestData)
      .select()

    return NextResponse.json({
      existing_students: {
        data: students || [],
        error: studentsError?.message,
        count: students?.length || 0
      },
      student_ids: {
        data: studentIds || [],
        error: idsError?.message,
        unique_count: studentIds ? [...new Set(studentIds.map(s => s.student_id))].length : 0,
        total_count: studentIds?.length || 0
      },
      schema_tests: {
        basic_schema_error: schemaTestError?.message,
        basic_schema_details: schemaTestError?.details,
        basic_schema_hint: schemaTestError?.hint,
        basic_schema_code: schemaTestError?.code,
        
        new_schema_error: newSchemaTestError?.message,
        new_schema_details: newSchemaTestError?.details,
        new_schema_hint: newSchemaTestError?.hint,
        new_schema_code: newSchemaTestError?.code
      },
      recommendations: [
        schemaTestError ? `Basic schema issue: ${schemaTestError.message}` : "Basic schema appears valid",
        newSchemaTestError ? `New schema issue: ${newSchemaTestError.message}` : "New schema appears valid",
        studentIds && studentIds.length !== [...new Set(studentIds.map(s => s.student_id))].length 
          ? "DUPLICATE STUDENT IDs DETECTED" 
          : "No duplicate student IDs found"
      ]
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
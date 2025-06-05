import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🐛 DEBUG: Received request body:', JSON.stringify(body, null, 2))
    
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      batch,
      studentId,
      course,
      year,
      admissionDate
    } = body

    const debugInfo = {
      received_data: body,
      extracted_fields: {
        firstName,
        lastName,
        email,
        phone,
        department,
        batch,
        studentId,
        course,
        year,
        admissionDate
      }
    }

    console.log('🐛 DEBUG: Extracted fields:', debugInfo.extracted_fields)

    // Step 1: Check department exists
    console.log('🐛 DEBUG: Checking department:', department)
    const { data: deptData, error: deptError } = await supabaseAdmin
      .from('departments')
      .select('id')
      .eq('code', department)
      .single()

    if (deptError || !deptData) {
      console.error('🐛 DEBUG: Department error:', deptError)
      return NextResponse.json({ 
        error: 'Department validation failed',
        debug: {
          ...debugInfo,
          department_error: deptError,
          department_code_searched: department,
          department_found: !!deptData
        }
      }, { status: 400 })
    }

    console.log('🐛 DEBUG: Department found:', deptData)

    // Step 2: Check pre_registered_users table
    const { data: existingPreReg, error: checkError } = await supabaseAdmin
      .from('pre_registered_users')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (checkError) {
      console.error('🐛 DEBUG: Pre-registration check error:', checkError)
      return NextResponse.json({ 
        error: 'Pre-registration check failed',
        debug: {
          ...debugInfo,
          pre_registration_error: checkError
        }
      }, { status: 500 })
    }

    // Step 3: Create or use existing pre-registration
    let preRegUser
    let studentUserId
    
    if (existingPreReg) {
      preRegUser = existingPreReg
      studentUserId = existingPreReg.id
      console.log('🐛 DEBUG: Using existing pre-registration:', preRegUser.id)
    } else {
      const preRegId = crypto.randomUUID()
      studentUserId = preRegId
      
      console.log('🐛 DEBUG: Creating new pre-registration with ID:', preRegId)
      const { data: newPreReg, error: preRegError } = await supabaseAdmin
        .from('pre_registered_users')
        .insert({
          id: preRegId,
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          role: 'student'
        })
        .select()
        .single()

      if (preRegError) {
        console.error('🐛 DEBUG: Pre-registration creation error:', preRegError)
        return NextResponse.json({ 
          error: 'Pre-registration creation failed',
          debug: {
            ...debugInfo,
            pre_registration_creation_error: preRegError
          }
        }, { status: 500 })
      }
      preRegUser = newPreReg
      console.log('🐛 DEBUG: Pre-registration created successfully')
    }

    // Step 4: Try student creation with new schema
    console.log('🐛 DEBUG: Attempting student creation with new schema')
    const newSchemaData = {
      id: studentUserId, // Add the required ID field
      student_id: studentId,
      department_id: deptData.id,
      batch,
      course,
      academic_year: year,
      admission_date: admissionDate,
      pre_registration_id: studentUserId,
      email: email,
      first_name: firstName,
      last_name: lastName,
      phone: phone
    }
    
    console.log('🐛 DEBUG: New schema data:', newSchemaData)
    
    const newSchemaResult = await supabaseAdmin
      .from('students')
      .insert(newSchemaData)
      .select()
      .single()

    if (newSchemaResult.error) {
      console.error('🐛 DEBUG: New schema failed:', newSchemaResult.error)
      
      // Step 5: Try with old schema
      console.log('🐛 DEBUG: Attempting student creation with old schema')
      const oldSchemaData = {
        id: studentUserId,
        student_id: studentId,
        department_id: deptData.id,
        batch,
        course,
        academic_year: year,
        admission_date: admissionDate
      }
      
      console.log('🐛 DEBUG: Old schema data:', oldSchemaData)
      
      const oldSchemaResult = await supabaseAdmin
        .from('students')
        .insert(oldSchemaData)
        .select()
        .single()
      
      if (oldSchemaResult.error) {
        console.error('🐛 DEBUG: Old schema also failed:', oldSchemaResult.error)
        return NextResponse.json({ 
          error: 'Both schema attempts failed',
          debug: {
            ...debugInfo,
            new_schema_error: newSchemaResult.error,
            old_schema_error: oldSchemaResult.error,
            department_data: deptData,
            pre_registration_data: preRegUser
          }
        }, { status: 500 })
      }
      
      console.log('🐛 DEBUG: Old schema succeeded')
      return NextResponse.json({
        success: true,
        message: 'Student created with old schema',
        debug: {
          ...debugInfo,
          schema_used: 'old',
          student_data: oldSchemaResult.data
        }
      })
    }

    console.log('🐛 DEBUG: New schema succeeded')
    return NextResponse.json({
      success: true,
      message: 'Student created with new schema',
      debug: {
        ...debugInfo,
        schema_used: 'new',
        student_data: newSchemaResult.data
      }
    })

  } catch (error) {
    console.error('🐛 DEBUG: Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Unexpected error',
      debug: {
        error_message: error instanceof Error ? error.message : 'Unknown error',
        error_stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 })
  }
} 
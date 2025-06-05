import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: students, error } = await supabaseAdmin
      .from('student_details')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching students:', error)
      return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
    }

    return NextResponse.json({ students })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received student creation request:', body)
    
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

    // Check if a pre-registered user already exists
    const { data: existingPreReg, error: checkError } = await supabaseAdmin
      .from('pre_registered_users')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    // If table doesn't exist, provide helpful error message
    if (checkError && checkError.code === 'PGRST116') {
      return NextResponse.json({ 
        error: 'Pre-registration system not set up', 
        details: 'Please run the database setup script first. Check database-setup.sql file.' 
      }, { status: 500 })
    }

    if (checkError) {
      console.error('Error checking existing pre-registration:', checkError)
      return NextResponse.json({ 
        error: 'Failed to check existing registration', 
        details: checkError.message 
      }, { status: 500 })
    }

    let preRegUser
    let studentUserId
    
    if (existingPreReg) {
      // Use existing pre-registration
      preRegUser = existingPreReg
      studentUserId = existingPreReg.id
      console.log('Using existing pre-registration for student creation')
    } else {
      // Generate a UUID for the pre-registered user
      const preRegId = crypto.randomUUID()
      studentUserId = preRegId
      
      // Create pre-registered user record
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
        console.error('Error creating pre-registration:', preRegError)
        return NextResponse.json({ 
          error: 'Failed to create student registration', 
          details: preRegError.message 
        }, { status: 500 })
      }
      preRegUser = newPreReg
    }

    // Get department ID
    const { data: deptData, error: deptError } = await supabaseAdmin
      .from('departments')
      .select('id')
      .eq('code', department)
      .single()

    if (deptError || !deptData) {
      console.error('Error finding department:', deptError)
      return NextResponse.json({ 
        error: 'Department not found', 
        details: deptError?.message || `No department found with code: ${department}` 
      }, { status: 404 })
    }

    // Try to create student record with new schema first, fallback to old schema
    let student, studentError
    
    // First, try with new schema (includes email, names, pre_registration_id)
    const newSchemaResult = await supabaseAdmin
      .from('students')
      .insert({
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
      })
      .select()
      .single()

    if (newSchemaResult.error && newSchemaResult.error.message.includes('column')) {
      // New schema columns don't exist, try with original schema
      console.log('New schema not available, falling back to original schema')
      
      const oldSchemaResult = await supabaseAdmin
        .from('students')
        .insert({
          id: studentUserId, // Use pre-registration ID as the ID for now
          student_id: studentId,
          department_id: deptData.id,
          batch,
          course,
          academic_year: year,
          admission_date: admissionDate
        })
        .select()
        .single()
      
      student = oldSchemaResult.data
      studentError = oldSchemaResult.error
      
      if (studentError) {
        console.error('Original schema also failed:', studentError)
        return NextResponse.json({ 
          error: 'Database schema issue',
          details: 'Please run the database setup scripts. Check SETUP_INSTRUCTIONS.md',
          original_error: studentError.message
        }, { status: 500 })
      }
    } else {
      student = newSchemaResult.data
      studentError = newSchemaResult.error
    }

    if (studentError) {
      console.error('Error creating student:', studentError)
      // Rollback - delete the pre-registration only if we created it
      if (!existingPreReg) {
        await supabaseAdmin.from('pre_registered_users').delete().eq('id', studentUserId)
      }
      return NextResponse.json({ 
        error: 'Failed to create student record', 
        details: studentError.message 
      }, { status: 500 })
    }

    // Create additional student details if needed (commenting out for now since table may not exist)
    // const { data: studentDetails } = await supabaseAdmin
    //   .from('student_additional_info')
    //   .insert({
    //     student_id: studentUserId,
    //     address,
    //     date_of_birth: dateOfBirth,
    //     gender,
    //     blood_group: bloodGroup,
    //     nationality,
    //     religion,
    //     category,
    //     father_name: fatherName,
    //     father_occupation: fatherOccupation,
    //     father_phone: fatherPhone,
    //     mother_name: motherName,
    //     mother_occupation: motherOccupation,
    //     mother_phone: motherPhone,
    //     guardian_name: guardianName,
    //     guardian_relation: guardianRelation,
    //     guardian_phone: guardianPhone,
    //     emergency_contact: emergencyContact
    //   })

    // Note: If student_additional_info table doesn't exist, comment out the above block
    const studentDetails = null // Placeholder for now

    return NextResponse.json({ 
      message: 'Student created successfully',
      student: {
        id: studentUserId,
        preRegistration: preRegUser,
        student,
        studentDetails
      }
    })

  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
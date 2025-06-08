import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: professors, error } = await supabaseAdmin
      .from('professor_details')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching professors:', error)
      return NextResponse.json({ error: 'Failed to fetch professors' }, { status: 500 })
    }

    // Get course counts for each professor
    const { data: courseCounts, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('professor_id, id')

    if (courseError) {
      console.error('Error fetching course counts:', courseError)
    }

    // Create a map of professor ID to course count
    const courseCountMap = new Map()
    if (courseCounts) {
      courseCounts.forEach(course => {
        if (course.professor_id) {
          courseCountMap.set(course.professor_id, (courseCountMap.get(course.professor_id) || 0) + 1)
        }
      })
    }

    // Format the data to match the expected structure
    const formattedProfessors = professors?.map(prof => ({
      id: prof.professor_id || prof.id,
      name: `${prof.first_name || ''} ${prof.last_name || ''}`.trim(),
      email: prof.email,
      phone: prof.phone || '',
      departmentCode: prof.department_code || prof.code,
      department: prof.department_name || prof.name,
      specialization: prof.specialization || 'Not specified',
      experience: prof.experience_years || 0,
      joinDate: prof.join_date || prof.created_at,
      avatar: prof.avatar_url,
      activeCourses: courseCountMap.get(prof.id) || 0
    })) || []

    return NextResponse.json({ professors: formattedProfessors })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      // Personal Information
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      emergencyContact,
      emergencyPhone,
      
      // Professional Information
      professorId,
      department,
      specialization,
      qualification,
      experience,
      joinDate,
      previousInstitution,
      
      // Academic Information
      researchAreas,
      publications,
      certifications,
      salary,
      
      // Additional Information
      bloodGroup,
      nationality,
      biography
    } = body

    console.log('Creating professor with data:', { firstName, lastName, email, department, specialization })

    // Check if professor with this email already exists in pre_registered_users
    const { data: existingUser } = await supabaseAdmin
      .from('pre_registered_users')
      .select('email')
      .eq('email', email)
      .eq('role', 'professor')
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'A professor with this email already exists' }, { status: 400 })
    }

    // Check if professor ID already exists in professors table
    if (professorId) {
      const { data: existingProf } = await supabaseAdmin
        .from('professors')
        .select('professor_id')
        .eq('professor_id', professorId)
        .single()

      if (existingProf) {
        return NextResponse.json({ error: 'A professor with this ID already exists' }, { status: 400 })
      }
    }

    // Validate that department exists
    const { data: deptData, error: deptError } = await supabaseAdmin
      .from('departments')
      .select('id, name, code')
      .eq('code', department)
      .single()

    if (deptError || !deptData) {
      console.error('Department not found:', deptError)
      return NextResponse.json({ error: `Department '${department}' not found. Please ensure the department exists.` }, { status: 404 })
    }

    console.log('Found department:', deptData)

    // Generate unique UUID for this professor record
    const professorUuid = crypto.randomUUID()

    // Step 1: Create entry in pre_registered_users table
    const { error: preRegError } = await supabaseAdmin
      .from('pre_registered_users')
      .insert({
        id: professorUuid,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        role: 'professor'
      })
      .select()
      .single()

    if (preRegError) {
      console.error('Error creating pre-registered user:', preRegError)
      return NextResponse.json({ 
        error: 'Failed to create professor account. ' + (preRegError.message || 'Unknown database error') 
      }, { status: 500 })
    }

    // Step 2: Create entry in profiles table (bypassing auth constraint)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: professorUuid,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        role: 'professor'
      })
      .select()
      .single()

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // Try to clean up pre_registered_users if profile creation fails
      await supabaseAdmin.from('pre_registered_users').delete().eq('id', professorUuid)
      return NextResponse.json({ 
        error: 'Failed to create professor profile. ' + (profileError.message || 'Unknown database error') 
      }, { status: 500 })
    }

    // Step 3: Create entry in professors table
    const { data: professor, error: professorError } = await supabaseAdmin
      .from('professors')
      .insert({
        id: professorUuid,
        professor_id: professorId || `PROF${deptData.code}${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        department_id: deptData.id,
        specialization: specialization || null,
        qualification: qualification || null,
        experience_years: experience ? parseInt(experience) : null,
        join_date: joinDate || null,
        previous_institution: previousInstitution || null,
        research_areas: researchAreas || null,
        publications: publications || null,
        certifications: certifications || null,
        salary: salary ? parseFloat(salary) : null,
        date_of_birth: dateOfBirth || null,
        gender: gender || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip_code: zipCode || null,
        emergency_contact_name: emergencyContact || null,
        emergency_contact_phone: emergencyPhone || null,
        blood_group: bloodGroup || null,
        nationality: nationality || null,
        biography: biography || null
      })
      .select()
      .single()

    if (professorError) {
      console.error('Error creating professor record:', professorError)
      // Clean up previous records
      await supabaseAdmin.from('profiles').delete().eq('id', professorUuid)
      await supabaseAdmin.from('pre_registered_users').delete().eq('id', professorUuid)
      return NextResponse.json({ 
        error: 'Failed to create professor record. ' + (professorError.message || 'Unknown database error') 
      }, { status: 500 })
    }

    // All professor data is now stored directly in the professors table

    console.log('Professor created successfully:', professor)

    return NextResponse.json({ 
      message: 'Professor created successfully',
      professor: {
        id: professor.id,
        professorId: professor.professor_id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role: profile.role,
        department: deptData.name,
        departmentCode: deptData.code,
        specialization: professor.specialization,
        qualification: professor.qualification,
        experience: professor.experience_years,
        joinDate: professor.join_date,
        salary: professor.salary,
        created_at: professor.created_at
      }
    })

  } catch (error) {
    console.error('Error creating professor:', error)
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
} 
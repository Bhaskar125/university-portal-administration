import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

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

    return NextResponse.json({ professors })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      professorId,
      specialization,
      qualification,
      experience,
      joinDate,
      salary,
      address,
      dateOfBirth,
      gender,
      bloodGroup,
      nationality,
      previousInstitution,
      researchAreas,
      publications,
      certifications,
      biography
    } = body

    // Generate UUID for the user
    const userId = uuidv4()

    // Start a transaction by creating profile first
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
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
      return NextResponse.json({ error: 'Failed to create professor profile' }, { status: 500 })
    }

    // Get department ID
    const { data: deptData, error: deptError } = await supabaseAdmin
      .from('departments')
      .select('id')
      .eq('code', department)
      .single()

    if (deptError || !deptData) {
      console.error('Error finding department:', deptError)
      return NextResponse.json({ error: 'Department not found' }, { status: 404 })
    }

    // Create professor record
    const { data: professor, error: professorError } = await supabaseAdmin
      .from('professors')
      .insert({
        id: userId,
        professor_id: professorId,
        department_id: deptData.id,
        specialization,
        qualification,
        experience: experience ? parseInt(experience) : null,
        join_date: joinDate,
        salary: salary ? parseFloat(salary) : null
      })
      .select()
      .single()

    if (professorError) {
      console.error('Error creating professor:', professorError)
      // Rollback - delete the profile
      await supabaseAdmin.from('profiles').delete().eq('id', userId)
      return NextResponse.json({ error: 'Failed to create professor record' }, { status: 500 })
    }

    // Create additional professor details if needed
    const { data: professorDetails } = await supabaseAdmin
      .from('professor_additional_info')
      .insert({
        professor_id: userId,
        address,
        date_of_birth: dateOfBirth,
        gender,
        blood_group: bloodGroup,
        nationality,
        previous_institution: previousInstitution,
        research_areas: researchAreas,
        publications,
        certifications,
        biography
      })

    // Note: If professor_additional_info table doesn't exist, comment out the above block

    return NextResponse.json({ 
      message: 'Professor created successfully',
      professor: {
        id: userId,
        profile,
        professor,
        professorDetails
      }
    })

  } catch (error) {
    console.error('Error creating professor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
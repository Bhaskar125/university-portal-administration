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
      department
    } = body

    console.log('Creating professor with data:', { firstName, lastName, email, department })

    // Check if professor with this email already exists
    const { data: existingProfessor, error: checkError } = await supabaseAdmin
      .from('pre_registered_users')
      .select('email')
      .eq('email', email)
      .eq('role', 'professor')
      .single()

    if (existingProfessor) {
      return NextResponse.json({ error: 'A professor with this email already exists' }, { status: 400 })
    }

    // Note: checkError is expected when no professor is found, so we don't need to handle it

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

    // Create professor in pre_registered_users table
    const { data: professor, error: professorError } = await supabaseAdmin
      .from('pre_registered_users')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        role: 'professor'
      })
      .select()
      .single()

    if (professorError) {
      console.error('Error creating professor:', professorError)
      return NextResponse.json({ 
        error: 'Failed to create professor. ' + (professorError.message || 'Unknown database error') 
      }, { status: 500 })
    }

    console.log('Professor created successfully:', professor)

    return NextResponse.json({ 
      message: 'Professor created successfully',
      professor: {
        id: professor.id,
        email: professor.email,
        firstName: professor.first_name,
        lastName: professor.last_name,
        role: professor.role,
        department: deptData.name,
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
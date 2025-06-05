import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth-supabase'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phone, 
      department,
      batch,
      semester 
    } = body

    // Validation
    if (!firstName || !lastName || !email || !password || !department || !batch || !semester) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Create user with Supabase Auth and profile
    const result = await authService.signUp(email, password, {
      firstName,
      lastName,
      role: 'student',
      phone
    })

    // Get department ID
    const { data: deptData, error: deptError } = await supabaseAdmin
      .from('departments')
      .select('id')
      .eq('code', department)
      .single()

    if (deptError || !deptData) {
      console.error('Error finding department:', deptError)
      // Clean up - delete the auth user and profile
      await supabaseAdmin.auth.admin.deleteUser(result.user.id)
      await supabaseAdmin.from('profiles').delete().eq('id', result.user.id)
      return NextResponse.json({ error: 'Department not found' }, { status: 404 })
    }

    // Generate student ID
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const studentId = `${department}${batch}${randomNum}`

    // Create student record
    const { error: studentError } = await supabaseAdmin
      .from('students')
      .insert({
        id: result.user.id,
        student_id: studentId,
        department_id: deptData.id,
        batch,
        semester: parseInt(semester),
        status: 'active'
      })
      .select()
      .single()

    if (studentError) {
      console.error('Error creating student:', studentError)
      // Rollback - delete the auth user and profile
      await supabaseAdmin.auth.admin.deleteUser(result.user.id)
      await supabaseAdmin.from('profiles').delete().eq('id', result.user.id)
      return NextResponse.json({ error: 'Failed to create student record' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Student registered successfully',
      user: {
        id: result.user.id,
        email: result.user.email,
        role: 'student',
        studentId: studentId
      }
    })

  } catch (error) {
    console.error('Student registration error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Registration failed'
    
    // Handle specific Supabase errors
    if (errorMessage.includes('User already registered')) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 
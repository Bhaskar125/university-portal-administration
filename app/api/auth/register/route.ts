import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth-supabase'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password, role, phone } = body

    // Validation
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['student', 'professor', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // For students and professors, validate that they exist in the database
    if (role === 'student' || role === 'professor') {
      const { data: existingRecord, error: lookupError } = await supabaseAdmin
        .from('pre_registered_users')
        .select('email, first_name, last_name, role')
        .eq('email', email.toLowerCase())
        .eq('role', role)
        .maybeSingle()

      if (lookupError) {
        console.error(`Error looking up ${role}:`, lookupError)
        return NextResponse.json(
          { error: 'Failed to validate registration eligibility' },
          { status: 500 }
        )
      }

      if (!existingRecord) {
        return NextResponse.json(
          { error: `No ${role} record found with this email address. Please contact the administrator to be registered first.` },
          { status: 403 }
        )
      }

      // Validate that first name and last name match (case-insensitive)
      const recordFirstName = (existingRecord.first_name || '').toLowerCase().trim()
      const recordLastName = (existingRecord.last_name || '').toLowerCase().trim()
      const inputFirstName = firstName.toLowerCase().trim()
      const inputLastName = lastName.toLowerCase().trim()

      if (recordFirstName !== inputFirstName || recordLastName !== inputLastName) {
        return NextResponse.json(
          { 
            error: `Name mismatch. The first name and last name must match exactly with your ${role} record. Please contact the administrator if there's an error.`,
            details: 'Please ensure your first name and last name match exactly as registered by the administrator.'
          },
          { status: 403 }
        )
      }
    }

    // Create user with Supabase Auth
    console.log('Attempting to create user:', { email, firstName, lastName, role })
    
    const result = await authService.signUp(email, password, {
      firstName,
      lastName,
      role,
      phone
    })

    console.log('User created successfully:', result.user.id)

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.profile.role
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Registration failed'
    
    // Handle specific Supabase errors
    if (errorMessage.includes('User already registered')) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    if (errorMessage.includes('Invalid email')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 
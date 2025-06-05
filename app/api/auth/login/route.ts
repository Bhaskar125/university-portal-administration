import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth-supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Sign in user with Supabase Auth
    const result = await authService.signIn(email, password)

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.profile.role,
        firstName: result.profile.first_name,
        lastName: result.profile.last_name
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Login failed'
    
    // Handle specific Supabase errors
    if (errorMessage.includes('Invalid login credentials')) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Email verification check removed for testing
    // if (errorMessage.includes('Email not confirmed')) {
    //   return NextResponse.json(
    //     { error: 'Please verify your email address before signing in' },
    //     { status: 401 }
    //   )
    // }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 
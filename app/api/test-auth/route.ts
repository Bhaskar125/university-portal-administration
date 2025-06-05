import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    console.log('Testing auth flow for:', email)

    // Step 1: Check if pre-registration exists
    const { data: preRegUser, error: preRegError } = await supabaseAdmin
      .from('pre_registered_users')
      .select('*')
      .eq('email', email)
      .eq('role', 'student')
      .maybeSingle()

    if (preRegError) {
      console.error('Pre-registration check failed:', preRegError)
      return NextResponse.json({ 
        error: 'Pre-registration check failed', 
        details: preRegError.message 
      }, { status: 500 })
    }

    if (!preRegUser) {
      return NextResponse.json({ 
        error: 'No pre-registration found for this email',
        message: 'Make sure the student is created by admin first'
      }, { status: 404 })
    }

    // Step 2: Create a test auth user
    const testPassword = 'TestPass123!'
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: testPassword,
      email_confirm: true
    })

    if (authError) {
      console.error('Auth user creation failed:', authError)
      return NextResponse.json({ 
        error: 'Auth user creation failed', 
        details: authError.message 
      }, { status: 500 })
    }

    console.log('Auth user created:', authData.user.id)

    // Step 3: Try to create profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        first_name: preRegUser.first_name,
        last_name: preRegUser.last_name,
        phone: preRegUser.phone,
        role: 'student'
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation failed:', profileError)
      
      // Clean up auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      
      return NextResponse.json({ 
        error: 'Profile creation failed', 
        details: profileError.message,
        code: profileError.code,
        hint: profileError.hint,
        pre_registration: preRegUser,
        auth_user_id: authData.user.id
      }, { status: 500 })
    }

    // Clean up test user
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)

    return NextResponse.json({
      success: true,
      message: 'Auth flow test completed successfully',
      pre_registration: preRegUser,
      auth_user_created: authData.user.id,
      profile_created: !!profile
    })

  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 
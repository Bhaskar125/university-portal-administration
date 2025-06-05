import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { testEmail = 'test@example.com' } = await request.json()
    
    const testId = crypto.randomUUID()
    
    console.log('Testing profile creation with:', { testId, testEmail })

    // Try to create a test profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: testId,
        email: testEmail,
        first_name: 'Test',
        last_name: 'User', 
        role: 'student'
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation test failed:', profileError)
      return NextResponse.json({
        success: false,
        error: 'Profile creation failed',
        details: {
          message: profileError.message,
          code: profileError.code,
          hint: profileError.hint,
          details: profileError.details
        },
        testId,
        testEmail
      }, { status: 500 })
    }

    // Clean up test profile
    await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', testId)

    return NextResponse.json({
      success: true,
      message: 'Profile creation test successful',
      profile,
      testId
    })

  } catch (error) {
    console.error('Test profile creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 
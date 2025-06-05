import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    console.log('Confirming email for:', email)

    // Find the user
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      return NextResponse.json({ 
        error: 'Failed to list users', 
        details: listError.message 
      }, { status: 500 })
    }

    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found',
        message: 'No user found with this email address'
      }, { status: 404 })
    }

    console.log('Found user:', user.id, 'Email confirmed:', !!user.email_confirmed_at)

    // Confirm the user's email using admin API
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    )

    if (updateError) {
      console.error('Email confirmation failed:', updateError)
      return NextResponse.json({ 
        error: 'Failed to confirm email', 
        details: updateError.message 
      }, { status: 500 })
    }

    console.log('Email confirmed successfully for user:', updateData.user.id)

    return NextResponse.json({
      success: true,
      message: 'Email confirmed successfully',
      user: {
        id: updateData.user.id,
        email: updateData.user.email,
        email_confirmed_at: updateData.user.email_confirmed_at,
        was_already_confirmed: !!user.email_confirmed_at
      }
    })

  } catch (error) {
    console.error('Confirm email error:', error)
    return NextResponse.json({
      error: 'Failed to confirm email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    console.log(`🔧 Starting fix for user: ${email}`)
    const steps: string[] = []
    const fixes: string[] = []

    // 1. Get auth user
    const { data: authData } = await supabaseAdmin.auth.admin.listUsers()
    const authUser = authData?.users?.find(u => u.email === email)

    if (!authUser) {
      return NextResponse.json({ error: 'User not found in auth.users' }, { status: 404 })
    }

    steps.push(`✅ Found auth user: ${authUser.id}`)

    // 2. Get existing profile
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    // 3. Get pre-registration
    const { data: preReg } = await supabaseAdmin
      .from('pre_registered_users')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    // 4. Fix profile ID if it doesn't match auth user ID
    if (existingProfile && existingProfile.id !== authUser.id) {
      steps.push(`❌ Profile ID mismatch: ${existingProfile.id} vs ${authUser.id}`)
      
      // Delete the incorrect profile
      await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', existingProfile.id)
      
      // Create new profile with correct auth user ID
      const { error: newProfileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authUser.id, // Use auth user ID
          email: existingProfile.email,
          first_name: existingProfile.first_name,
          last_name: existingProfile.last_name,
          phone: existingProfile.phone,
          role: existingProfile.role,
          is_active: true
        })
        .select()
        .single()

      if (newProfileError) {
        steps.push(`❌ Failed to create corrected profile: ${newProfileError.message}`)
        return NextResponse.json({ 
          error: 'Failed to fix profile', 
          details: newProfileError.message,
          steps 
        }, { status: 500 })
      }

      steps.push(`✅ Created corrected profile with ID: ${authUser.id}`)
      fixes.push('Fixed profile ID to match auth user ID')
    } else if (existingProfile) {
      steps.push(`✅ Profile ID is correct: ${existingProfile.id}`)
    } else {
      // Create profile if it doesn't exist
      if (preReg) {
        const { error: newProfileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: authUser.id,
            email: preReg.email,
            first_name: preReg.first_name,
            last_name: preReg.last_name,
            phone: preReg.phone,
            role: preReg.role,
            is_active: true
          })
          .select()
          .single()

        if (newProfileError) {
          steps.push(`❌ Failed to create profile: ${newProfileError.message}`)
        } else {
          steps.push(`✅ Created missing profile with ID: ${authUser.id}`)
          fixes.push('Created missing profile')
        }
      }
    }

    // 5. Link pre-registration to auth user
    if (preReg && !preReg.auth_user_id) {
      const { error: linkError } = await supabaseAdmin
        .from('pre_registered_users')
        .update({
          auth_user_id: authUser.id,
          registered_at: new Date().toISOString()
        })
        .eq('id', preReg.id)

      if (linkError) {
        steps.push(`❌ Failed to link pre-registration: ${linkError.message}`)
      } else {
        steps.push(`✅ Linked pre-registration to auth user`)
        fixes.push('Linked pre-registration to auth user')
      }
    }

    // 6. Reset password if provided
    if (newPassword) {
      const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
        authUser.id,
        { password: newPassword }
      )

      if (passwordError) {
        steps.push(`❌ Failed to reset password: ${passwordError.message}`)
      } else {
        steps.push(`✅ Password reset successfully`)
        fixes.push('Password reset')
      }
    }

    // 7. Test login
    let loginTest = false
    if (newPassword) {
      try {
        const { error: testError } = await supabaseAdmin.auth.signInWithPassword({
          email,
          password: newPassword
        })
        
        if (!testError) {
          loginTest = true
          steps.push(`✅ Login test successful`)
          fixes.push('Login functionality verified')
        } else {
          steps.push(`❌ Login test failed: ${testError.message}`)
        }
      } catch (err) {
        steps.push(`❌ Login test error: ${err}`)
      }
    }

    return NextResponse.json({
      success: true,
      email,
      authUserId: authUser.id,
      fixes,
      steps,
      loginTestPassed: loginTest,
      recommendation: newPassword ? 
        "All fixes applied. Try logging in now." : 
        "Profile fixed. You may need to reset the password if login still fails."
    })

  } catch (error) {
    console.error('Fix user error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const debugInfo = {
      email,
      checks: {
        userExists: false,
        emailConfirmed: false,
        hasPassword: false,
        profileExists: false,
        preRegistrationExists: false,
        canLogin: false
      },
      details: {} as Record<string, unknown>,
      steps: [] as string[],
      fixes: [] as string[]
    }

    debugInfo.steps.push('🔍 Starting comprehensive login debug...')

    // Step 1: Check if user exists in auth.users
    debugInfo.steps.push('1️⃣ Checking auth.users table...')
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      debugInfo.steps.push(`❌ Error listing users: ${listError.message}`)
      return NextResponse.json(debugInfo, { status: 500 })
    }

    const authUser = users.users.find(u => u.email === email)
    
    if (!authUser) {
      debugInfo.steps.push('❌ User not found in auth.users')
      debugInfo.fixes.push('User needs to complete registration first')
      return NextResponse.json(debugInfo, { status: 404 })
    }

    debugInfo.checks.userExists = true
    debugInfo.details.authUser = {
      id: authUser.id,
      email: authUser.email,
      email_confirmed_at: authUser.email_confirmed_at,
      created_at: authUser.created_at,
      last_sign_in_at: authUser.last_sign_in_at
    }
    debugInfo.steps.push(`✅ User found: ${authUser.id}`)

    // Step 2: Check email confirmation
    debugInfo.steps.push('2️⃣ Checking email confirmation...')
    if (authUser.email_confirmed_at) {
      debugInfo.checks.emailConfirmed = true
      debugInfo.steps.push('✅ Email is confirmed')
    } else {
      debugInfo.steps.push('❌ Email not confirmed')
      debugInfo.fixes.push('Email needs to be confirmed')
      
      // Auto-fix email confirmation
      try {
        await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
          email_confirm: true
        })
        debugInfo.checks.emailConfirmed = true
        debugInfo.steps.push('✅ Email auto-confirmed')
        debugInfo.fixes.push('Email was auto-confirmed during debug')
             } catch {
         debugInfo.steps.push('❌ Failed to auto-confirm email')
       }
    }

    // Step 3: Check if user has password
    debugInfo.steps.push('3️⃣ Checking password status...')
    // We can't directly check the password, but we can try a test login
    if (password) {
      try {
        const { error: loginError } = await supabaseAdmin.auth.signInWithPassword({
          email,
          password
        })
        
        if (!loginError) {
          debugInfo.checks.canLogin = true
          debugInfo.checks.hasPassword = true
          debugInfo.steps.push('✅ Login test successful')
        } else {
          debugInfo.steps.push(`❌ Login test failed: ${loginError.message}`)
          if (loginError.message.includes('Invalid login credentials')) {
            debugInfo.fixes.push('Password appears to be incorrect or not set')
          }
        }
             } catch {
         debugInfo.steps.push('❌ Could not test login')
       }
    } else {
      debugInfo.steps.push('⚠️ No password provided for testing')
    }

    // Step 4: Check profile
    debugInfo.steps.push('4️⃣ Checking profile...')
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle()

    if (profileError) {
      debugInfo.steps.push(`❌ Profile check error: ${profileError.message}`)
    } else if (profile) {
      debugInfo.checks.profileExists = true
      debugInfo.details.profile = profile
      debugInfo.steps.push('✅ Profile found')
    } else {
      debugInfo.steps.push('❌ No profile found')
      debugInfo.fixes.push('Profile needs to be created')
    }

    // Step 5: Check pre-registration
    debugInfo.steps.push('5️⃣ Checking pre-registration...')
    const { data: preReg, error: preRegError } = await supabaseAdmin
      .from('pre_registered_users')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (preRegError) {
      debugInfo.steps.push(`❌ Pre-registration check error: ${preRegError.message}`)
    } else if (preReg) {
      debugInfo.checks.preRegistrationExists = true
      debugInfo.details.preRegistration = preReg
      debugInfo.steps.push('✅ Pre-registration found')
    } else {
      debugInfo.steps.push('❌ No pre-registration found')
    }

    // Step 6: Summary and recommendations
    debugInfo.steps.push('6️⃣ Analysis complete')
    
    if (debugInfo.checks.canLogin) {
      debugInfo.steps.push('🎉 User should be able to login now!')
    } else {
      debugInfo.steps.push('🔧 User has issues that need fixing')
      
      if (!debugInfo.checks.emailConfirmed) {
        debugInfo.fixes.push('Run: UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = \'' + email + '\';')
      }
      
      if (!debugInfo.checks.profileExists) {
        debugInfo.fixes.push('Profile needs to be created - check registration process')
      }
      
      if (!debugInfo.checks.hasPassword) {
        debugInfo.fixes.push('Password may need to be reset using Supabase Admin')
      }
    }

    return NextResponse.json(debugInfo)

  } catch (error) {
    console.error('Debug login error:', error)
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 
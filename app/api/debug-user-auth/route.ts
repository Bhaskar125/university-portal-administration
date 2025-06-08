import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const debugInfo = {
      email,
      steps: [] as string[],
      found: false,
      authUser: null as Record<string, unknown> | null,
      profile: null as Record<string, unknown> | null,
      preRegistration: null as Record<string, unknown> | null
    }

    // Step 1: Check if user exists in auth.users
    debugInfo.steps.push('Checking auth.users...')
    try {
      const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000
      })
      
      if (listError) {
        debugInfo.steps.push(`❌ Error listing users: ${listError.message}`)
      } else {
        const authUser = users.users.find(u => u.email === email)
        if (authUser) {
          debugInfo.found = true
          debugInfo.authUser = {
            id: authUser.id,
            email: authUser.email,
            email_confirmed_at: authUser.email_confirmed_at,
            confirmed_at: authUser.confirmed_at,
            created_at: authUser.created_at,
            last_sign_in_at: authUser.last_sign_in_at
          }
          debugInfo.steps.push(`✅ Auth user found: ${authUser.id}`)
          debugInfo.steps.push(`📧 Email confirmed: ${!!authUser.email_confirmed_at}`)
        } else {
          debugInfo.steps.push('❌ No auth user found')
        }
      }
         } catch (err) {
       debugInfo.steps.push(`❌ Error checking auth users: ${String(err)}`)
     }

    // Step 2: Check profile
    if (debugInfo.found && debugInfo.authUser) {
      debugInfo.steps.push('Checking profile...')
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', debugInfo.authUser.id)
        .maybeSingle()

      if (profileError) {
        debugInfo.steps.push(`❌ Profile check error: ${profileError.message}`)
      } else if (profile) {
        debugInfo.profile = profile
        debugInfo.steps.push('✅ Profile found')
      } else {
        debugInfo.steps.push('❌ No profile found')
      }
    }

    // Step 3: Check pre-registration
    debugInfo.steps.push('Checking pre-registration...')
    const { data: preReg, error: preRegError } = await supabaseAdmin
      .from('pre_registered_users')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (preRegError) {
      debugInfo.steps.push(`❌ Pre-registration check error: ${preRegError.message}`)
    } else if (preReg) {
      debugInfo.preRegistration = preReg
      debugInfo.steps.push('✅ Pre-registration found')
      debugInfo.steps.push(`🔗 Linked to auth: ${!!preReg.auth_user_id}`)
    } else {
      debugInfo.steps.push('❌ No pre-registration found')
    }

    // Step 4: Test login attempt
    if (debugInfo.found && debugInfo.authUser) {
      debugInfo.steps.push('Testing login capability...')
      try {
        // Try to verify if the user can potentially log in
        const { data: verifyData, error: verifyError } = await supabaseAdmin.auth.admin.getUserById(debugInfo.authUser.id as string)
        
        if (verifyError) {
          debugInfo.steps.push(`❌ User verification failed: ${verifyError.message}`)
        } else {
          debugInfo.steps.push('✅ User verification successful')
          
          // Check if email is confirmed
          if (!verifyData.user?.email_confirmed_at) {
            debugInfo.steps.push('⚠️ Email not confirmed - this might cause login issues')
            
            // Auto-confirm email for testing
            try {
              await supabaseAdmin.auth.admin.updateUserById(debugInfo.authUser.id as string, {
                email_confirm: true
              })
              debugInfo.steps.push('✅ Email auto-confirmed for testing')
                         } catch {
               debugInfo.steps.push('❌ Failed to auto-confirm email')
             }
          }
        }
             } catch (testError) {
         debugInfo.steps.push(`❌ Login test error: ${String(testError)}`)
       }
    }

    return NextResponse.json(debugInfo)

  } catch (error) {
    console.error('Debug user auth error:', error)
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 
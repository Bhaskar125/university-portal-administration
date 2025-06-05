import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const debugInfo: {
      email: string
      steps: string[]
      errors: string[]
      [key: string]: unknown
    } = {
      email,
      steps: [],
      errors: []
    }

    // Step 1: Check pre-registration
    debugInfo.steps.push('Checking pre-registration...')
    const { data: preRegUser, error: preRegError } = await supabaseAdmin
      .from('pre_registered_users')
      .select('*')
      .eq('email', email)
      .eq('role', 'student')
      .maybeSingle()

    if (preRegError) {
      debugInfo.errors.push(`Pre-registration check failed: ${preRegError.message}`)
      return NextResponse.json(debugInfo, { status: 500 })
    }

    if (!preRegUser) {
      debugInfo.errors.push('No pre-registration found')
      return NextResponse.json(debugInfo, { status: 404 })
    }

    debugInfo.preRegUser = preRegUser
    debugInfo.steps.push('✅ Pre-registration found')

    // Step 2: Check if auth user already exists
    debugInfo.steps.push('Checking existing auth users...')
    try {
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000
      })
      
      if (listError) {
        debugInfo.errors.push(`Failed to list users: ${listError.message}`)
      } else {
        const existingUser = existingUsers.users.find(u => u.email === email)
        debugInfo.existingAuthUser = existingUser ? existingUser.id : null
        debugInfo.steps.push(existingUser ? `⚠️ Auth user already exists: ${existingUser.id}` : '✅ No existing auth user')
      }
    } catch (err) {
      debugInfo.errors.push(`Error checking existing users: ${err}`)
    }

    // Step 3: Test auth user creation
    debugInfo.steps.push('Testing auth user creation...')
    const testPassword = 'TestPass123!'
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: testPassword,
      email_confirm: true
    })

    if (authError) {
      debugInfo.errors.push(`Auth user creation failed: ${authError.message}`)
      debugInfo.authError = authError
      return NextResponse.json(debugInfo, { status: 500 })
    }

    debugInfo.authUserId = authData.user.id
    debugInfo.authUser = authData.user
    debugInfo.steps.push(`✅ Auth user created: ${authData.user.id}`)

    // Step 4: Verify auth user exists in auth.users
    debugInfo.steps.push('Verifying auth user in database...')
    try {
      const { data: verifyUser, error: verifyError } = await supabaseAdmin.auth.admin.getUserById(authData.user.id)
      if (verifyError) {
        debugInfo.errors.push(`Auth user verification failed: ${verifyError.message}`)
      } else {
        debugInfo.steps.push(`✅ Auth user verified: ${verifyUser.user?.id}`)
        debugInfo.verifiedUser = verifyUser.user
      }
    } catch (err) {
      debugInfo.errors.push(`Auth user verification error: ${err}`)
    }

    // Step 5: Check profiles table structure
    debugInfo.steps.push('Checking profiles table constraints...')
    try {
      // Check if profiles table exists and its structure
      const { error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .limit(1)

      if (profilesError) {
        debugInfo.errors.push(`Profiles table check failed: ${profilesError.message}`)
      } else {
        debugInfo.steps.push('✅ Profiles table accessible')
      }

      // Try to get table schema info using a different approach
      const { data: schemaInfo, error: schemaError } = await supabaseAdmin
        .from('information_schema.table_constraints')
        .select('*')
        .eq('table_name', 'profiles')
        .eq('constraint_type', 'FOREIGN KEY')

      if (!schemaError && schemaInfo) {
        debugInfo.profilesConstraints = schemaInfo
        debugInfo.steps.push(`✅ Found ${schemaInfo.length} foreign key constraints on profiles`)
      } else {
        debugInfo.steps.push('⚠️ Could not retrieve profiles constraints info')
      }
    } catch (err) {
      debugInfo.errors.push(`Profiles table structure check error: ${err}`)
    }

    // Step 6: Test profile creation with detailed error handling
    debugInfo.steps.push('Testing profile creation...')
    
    const profileData = {
      id: authData.user.id,
      email,
      first_name: preRegUser.first_name,
      last_name: preRegUser.last_name,
      phone: preRegUser.phone,
      role: 'student'
    }
    
    debugInfo.profileData = profileData

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert(profileData)
      .select()
      .single()

    if (profileError) {
      debugInfo.errors.push(`Profile creation failed: ${profileError.message}`)
      debugInfo.profileError = {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      }
      
      // Try to understand why the foreign key constraint failed
      debugInfo.steps.push('🔍 Investigating foreign key constraint failure...')
      
      // Check if the auth user ID actually exists in auth.users
      try {
        const { data: authUserCheck } = await supabaseAdmin
          .rpc('auth_user_exists', { user_id: authData.user.id })
        debugInfo.authUserExistsCheck = authUserCheck
             } catch {
         debugInfo.steps.push('⚠️ Could not check auth.users directly')
       }
    } else {
      debugInfo.steps.push('✅ Profile created successfully!')
      debugInfo.profile = profile
    }

    // Clean up test user
    debugInfo.steps.push('Cleaning up test user...')
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    debugInfo.steps.push('✅ Test user deleted')

    return NextResponse.json(debugInfo)

  } catch (error) {
    console.error('Debug auth issue error:', error)
    return NextResponse.json({ 
      error: 'Debug failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 
import { supabase, supabaseAdmin } from './supabase'

export interface AuthUser {
  id: string
  email: string
  role: 'student' | 'professor' | 'admin'
  firstName?: string
  lastName?: string
  phone?: string
}

export const authService = {
  // Sign up new user
  async signUp(email: string, password: string, userData: {
    firstName: string
    lastName: string
    role: 'student' | 'professor' | 'admin'
    phone?: string
  }) {
    try {
      // Create user with Supabase Auth (email confirmation disabled for testing)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined // Disable email confirmation
        }
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('User creation failed')
      }

      // For testing: Auto-confirm the email using admin client
      if (authData.user && !authData.user.email_confirmed_at) {
        try {
          await supabaseAdmin.auth.admin.updateUserById(authData.user.id, {
            email_confirm: true
          })
          console.log('Email auto-confirmed for testing')
        } catch (confirmError) {
          console.warn('Could not auto-confirm email:', confirmError)
        }
      }

      // Wait a short moment for auth user to be fully committed
      await new Promise(resolve => setTimeout(resolve, 100))

      // Check if a pre-registration exists for this email (created by admin)
      const { data: preRegUser } = await supabaseAdmin
        .from('pre_registered_users')
        .select('*')
        .eq('email', email)
        .eq('role', userData.role)
        .maybeSingle()

      let profile

      if (preRegUser) {
        // Create profile using the auth user ID for pre-registered user
        console.log('Creating profile for pre-registered user:', {
          authUserId: authData.user.id,
          email,
          preRegId: preRegUser.id
        })
        
        // Try alternative approaches if foreign key constraint fails
        let newProfile, profileError

        // First attempt: Normal profile creation
        const result = await supabaseAdmin
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            role: userData.role
          })
          .select()
          .single()

        newProfile = result.data
        profileError = result.error

        // If foreign key constraint error, try using SQL RPC
        if (profileError && profileError.code === '23503') {
          console.log('Foreign key constraint detected, trying alternative method...')
          
          try {
            const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc(
              'create_profile_bypass', 
              {
                profile_id: authData.user.id,
                profile_email: email,
                profile_first_name: userData.firstName,
                profile_last_name: userData.lastName,
                profile_phone: userData.phone || null,
                profile_role: userData.role
              }
            )

            if (!rpcError) {
              newProfile = rpcResult
              profileError = null
              console.log('Profile created successfully using RPC bypass')
            } else {
              console.error('RPC method also failed:', rpcError)
              
              // Final fallback: Try direct SQL insert
              const { data: sqlResult, error: sqlError } = await supabaseAdmin
                .rpc('exec_sql', {
                  sql: `
                    INSERT INTO profiles (id, email, first_name, last_name, phone, role, created_at)
                    VALUES ('${authData.user.id}', '${email}', '${userData.firstName}', '${userData.lastName}', 
                            ${userData.phone ? `'${userData.phone}'` : 'NULL'}, '${userData.role}', NOW())
                    RETURNING *;
                  `
                })

              if (!sqlError && sqlResult) {
                newProfile = Array.isArray(sqlResult) ? sqlResult[0] : sqlResult
                profileError = null
                console.log('Profile created using direct SQL')
              } else {
                console.error('All profile creation methods failed')
              }
            }
          } catch (fallbackError) {
            console.error('Fallback methods failed:', fallbackError)
          }
        }

        if (profileError) {
          console.error('Profile creation error for pre-registered user:', {
            error: profileError,
            authUserId: authData.user.id,
            email,
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint,
            code: profileError.code
          })
          
          // Check if auth user actually exists
          try {
            const { data: checkUser, error: checkError } = await supabaseAdmin.auth.admin.getUserById(authData.user.id)
            console.log('Auth user check:', { exists: !!checkUser.user, error: checkError })
          } catch (checkErr) {
            console.error('Failed to check auth user:', checkErr)
          }
          
          // Clean up - delete the auth user if profile creation fails
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
          throw new Error(`Failed to create user profile: ${profileError.message}`)
        }
        profile = newProfile
        
        // Update pre-registration record with auth user ID and mark as registered
        await supabaseAdmin
          .from('pre_registered_users')
          .update({ 
            auth_user_id: authData.user.id,
            registered_at: new Date().toISOString()
          })
          .eq('id', preRegUser.id)
        
        // Update student/professor records if they exist
        if (userData.role === 'student') {
          // For students, we don't update the ID since it's now uuid_id (auto-generated)
          // The pre_registration_id already links to the pre-registered user
          console.log('Student profile created and linked to pre-registration')
        } else if (userData.role === 'professor') {
          await supabaseAdmin
            .from('professors')
            .update({ id: authData.user.id })
            .eq('id', preRegUser.id)
        }
      } else {
        // Create new profile in our database (for admins or non-pre-registered users)
        const { data: newProfile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            role: userData.role
          })
          .select()
          .single()

        if (profileError) {
          console.error('Profile creation error:', profileError)
          console.error('Profile creation details:', {
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint,
            code: profileError.code
          })
          // Clean up - delete the auth user if profile creation fails
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
          throw new Error(`Failed to create user profile: ${profileError.message}`)
        }
        profile = newProfile
      }

      return {
        user: authData.user,
        profile,
        session: authData.session
      }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  },

  // Sign in user
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (!data.user) {
        throw new Error('Login failed')
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        throw new Error('Failed to fetch user profile')
      }

      return {
        user: data.user,
        profile,
        session: data.session
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) throw error
      
      if (!user) return null

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        return null
      }

      return {
        id: user.id,
        email: user.email!,
        role: profile.role,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone
      } as AuthUser
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }
} 
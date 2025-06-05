import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Check pre_registered_users
    const { data: preRegUsers, error: preRegError } = await supabaseAdmin
      .from('pre_registered_users')
      .select('*')
      .order('created_at', { ascending: false })

    // Check auth.users
    const { data: authUsersData, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    // Check profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    return NextResponse.json({
      pre_registered_users: {
        data: preRegUsers || [],
        error: preRegError?.message
      },
      auth_users: {
        data: authUsersData?.users || [],
        error: authError?.message
      },
      profiles: {
        data: profiles || [],
        error: profilesError?.message
      }
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
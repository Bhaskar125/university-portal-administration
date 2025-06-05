import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    // Get all unconfirmed users
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()
    
    if (error) throw error

    const unconfirmedUsers = users.users.filter(user => !user.email_confirmed_at)
    
    console.log(`Found ${unconfirmedUsers.length} unconfirmed users`)

    // Confirm all unconfirmed users
    for (const user of unconfirmedUsers) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
          email_confirm: true
        })
        console.log(`Confirmed user: ${user.email}`)
      } catch (updateError) {
        console.error(`Failed to confirm ${user.email}:`, updateError)
      }
    }

    return NextResponse.json({
      message: `Successfully confirmed ${unconfirmedUsers.length} users`,
      confirmedUsers: unconfirmedUsers.map(u => u.email)
    })

  } catch (error) {
    console.error('Error confirming users:', error)
    return NextResponse.json(
      { error: 'Failed to confirm users' },
      { status: 500 }
    )
  }
} 
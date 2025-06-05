import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, role } = body

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      )
    }

    if (!['student', 'professor'].includes(role)) {
      return NextResponse.json(
        { error: 'Only students and professors need pre-registration' },
        { status: 400 }
      )
    }

    // Check in pre_registered_users table first
    const { data: existingRecord, error: lookupError } = await supabaseAdmin
      .from('pre_registered_users')
      .select('email, first_name, last_name, role')
      .eq('email', email.toLowerCase())
      .eq('role', role)
      .maybeSingle()

    if (lookupError) {
      console.error(`Error looking up ${role}:`, lookupError)
      return NextResponse.json(
        { error: 'Failed to check eligibility' },
        { status: 500 }
      )
    }

    if (!existingRecord) {
      return NextResponse.json({
        eligible: false,
        message: `No ${role} record found with this email address. Please contact the administrator to be registered first.`
      })
    }

    return NextResponse.json({
      eligible: true,
      message: `${role} record found. You can register with this email.`,
      requiredName: {
        firstName: existingRecord.first_name,
        lastName: existingRecord.last_name
      }
    })

  } catch (error) {
    console.error('Eligibility check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
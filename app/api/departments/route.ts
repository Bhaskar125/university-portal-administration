import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: departments, error } = await supabaseAdmin
      .from('departments')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching departments:', error)
      return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 })
    }

    return NextResponse.json({ departments })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
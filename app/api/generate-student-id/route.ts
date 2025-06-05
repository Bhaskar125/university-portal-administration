import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { department, batch } = await request.json()

    if (!department || !batch) {
      return NextResponse.json({ error: 'Department and batch are required' }, { status: 400 })
    }

    // Get existing student IDs for this department and batch
    const { data: existingIds } = await supabaseAdmin
      .from('students')
      .select('student_id')
      .like('student_id', `${department}${batch}%`)

    const existingIdSet = new Set(existingIds?.map(s => s.student_id) || [])

    // Generate a unique student ID
    let studentId: string
    let attempts = 0
    const maxAttempts = 100

    do {
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      studentId = `${department}${batch}${randomNum}`
      attempts++
      
      if (attempts > maxAttempts) {
        return NextResponse.json({ 
          error: 'Unable to generate unique student ID after maximum attempts' 
        }, { status: 500 })
      }
    } while (existingIdSet.has(studentId))

    return NextResponse.json({ 
      studentId,
      department,
      batch,
      attempts
    })

  } catch (error) {
    console.error('Error generating student ID:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
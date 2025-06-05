import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    // Find students with empty student_id
    const { data: emptyIdStudents, error: findError } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('student_id', '')

    if (findError) {
      return NextResponse.json({ error: 'Failed to find empty ID students' }, { status: 500 })
    }

    if (!emptyIdStudents || emptyIdStudents.length === 0) {
      return NextResponse.json({ message: 'No students with empty IDs found' })
    }

    const fixes = []

    for (const student of emptyIdStudents) {
      // Generate a new student ID based on department and batch
      const { data: dept } = await supabaseAdmin
        .from('departments')
        .select('code')
        .eq('id', student.department_id)
        .single()

      if (dept) {
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        const newStudentId = `${dept.code}${student.batch}${randomNum}`

        // Update the student record
        const { error: updateError } = await supabaseAdmin
          .from('students')
          .update({ student_id: newStudentId })
          .eq('id', student.id)

        if (updateError) {
          fixes.push({
            id: student.id,
            status: 'failed',
            error: updateError.message
          })
        } else {
          fixes.push({
            id: student.id,
            status: 'fixed',
            oldId: '',
            newId: newStudentId
          })
        }
      }
    }

    return NextResponse.json({
      message: 'Empty student IDs processing completed',
      studentsFound: emptyIdStudents.length,
      fixes
    })

  } catch (error) {
    console.error('Error fixing empty student IDs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
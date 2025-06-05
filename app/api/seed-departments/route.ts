import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    const departments = [
      { name: "Computer Science", code: "CS", description: "Department of Computer Science and Engineering" },
      { name: "Electrical Engineering", code: "EE", description: "Department of Electrical Engineering" },
      { name: "Mechanical Engineering", code: "ME", description: "Department of Mechanical Engineering" },
      { name: "Civil Engineering", code: "CE", description: "Department of Civil Engineering" },
      { name: "Mathematics", code: "MATH", description: "Department of Mathematics" },
      { name: "Physics", code: "PHY", description: "Department of Physics" },
      { name: "Chemistry", code: "CHEM", description: "Department of Chemistry" },
      { name: "Biology", code: "BIO", description: "Department of Biology" }
    ]

    // Check if departments already exist
    const { data: existingDepts } = await supabaseAdmin
      .from('departments')
      .select('code')

    const existingCodes = existingDepts?.map(d => d.code) || []
    const newDepartments = departments.filter(dept => !existingCodes.includes(dept.code))

    if (newDepartments.length === 0) {
      return NextResponse.json({ 
        message: 'All departments already exist',
        existingCount: existingCodes.length 
      })
    }

    // Insert new departments
    const { data, error } = await supabaseAdmin
      .from('departments')
      .insert(newDepartments)
      .select()

    if (error) {
      console.error('Error seeding departments:', error)
      return NextResponse.json({ error: 'Failed to seed departments' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Departments seeded successfully',
      inserted: newDepartments.length,
      existing: existingCodes.length,
      data
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
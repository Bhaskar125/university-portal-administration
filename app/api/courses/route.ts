import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select(`
        *,
        departments(name, code),
        professors(professor_id, profiles(first_name, last_name))
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching courses:', error)
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
    }

    // Format the data to match the expected structure
    const formattedCourses = courses?.map(course => ({
      id: course.course_code,
      name: course.course_name,
      description: course.description,
      department: course.departments?.name,
      departmentCode: course.departments?.code,
      instructor: course.professors?.profiles ? 
        `${course.professors.profiles.first_name} ${course.professors.profiles.last_name}`.trim() : 
        'No instructor assigned',
      credits: course.credits,
      semester: `Semester ${course.semester}`,
      capacity: course.capacity,
      professor_id: course.professor_id,
      created_at: course.created_at
    })) || []

    return NextResponse.json({ courses: formattedCourses })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      courseName,
      courseCode,
      department,
      credits,
      semester,
      description,
      professor,
      capacity
    } = body

    console.log('Creating course with data:', { courseName, courseCode, department, professor })

    // Check if course with this code already exists
    const { data: existingCourse } = await supabaseAdmin
      .from('courses')
      .select('course_code')
      .eq('course_code', courseCode)
      .single()

    if (existingCourse) {
      return NextResponse.json({ error: 'A course with this code already exists' }, { status: 400 })
    }

    // Validate that department exists
    const { data: deptData, error: deptError } = await supabaseAdmin
      .from('departments')
      .select('id, name, code')
      .eq('code', department)
      .single()

    if (deptError || !deptData) {
      console.error('Department not found:', deptError)
      return NextResponse.json({ error: `Department '${department}' not found.` }, { status: 404 })
    }

    // Validate professor if provided
    let professorId = null
    if (professor && professor !== 'none') {
      const { data: profData, error: profError } = await supabaseAdmin
        .from('professors')
        .select('id, professor_id')
        .eq('professor_id', professor)
        .single()

      if (profError || !profData) {
        console.error('Professor not found:', profError)
        return NextResponse.json({ error: `Professor '${professor}' not found.` }, { status: 404 })
      }
      professorId = profData.id
    }

    // Create course
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .insert({
        course_code: courseCode,
        course_name: courseName,
        department_id: deptData.id,
        credits: parseInt(credits),
        semester: parseInt(semester),
        description: description || null,
        professor_id: professorId,
        capacity: capacity ? parseInt(capacity) : 50
      })
      .select()
      .single()

    if (courseError) {
      console.error('Error creating course:', courseError)
      return NextResponse.json({ 
        error: 'Failed to create course. ' + (courseError.message || 'Unknown database error') 
      }, { status: 500 })
    }

    console.log('Course created successfully:', course)

    return NextResponse.json({ 
      message: 'Course created successfully',
      course: {
        id: course.id,
        courseCode: course.course_code,
        courseName: course.course_name,
        department: deptData.name,
        departmentCode: deptData.code,
        credits: course.credits,
        semester: course.semester,
        description: course.description,
        professorId: professorId,
        capacity: course.capacity,
        created_at: course.created_at
      }
    })

  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
} 
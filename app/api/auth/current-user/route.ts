import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would validate the session/token here
    // For now, we'll check if user data exists in the request headers
    
    const userEmail = request.headers.get('x-user-email')
    
    if (!userEmail) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Mock user data - in a real app, you'd fetch from database
    const mockUser = {
      id: 'current-user',
      email: userEmail,
      role: 'student', // This would come from your database
      firstName: userEmail.split('@')[0],
      lastName: 'User'
    }

    return NextResponse.json({ user: mockUser })

  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Failed to get current user' },
      { status: 500 }
    )
  }
} 
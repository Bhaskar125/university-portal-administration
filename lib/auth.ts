// Mock authentication for development
export interface User {
  id: string
  email: string
  role: 'student' | 'professor' | 'admin'
  name: string
}

// Simple in-memory "database" for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@universityportal.edu',
    role: 'admin',
    name: 'System Administrator'
  },
  {
    id: '2', 
    email: 'professor.john@universityportal.edu',
    role: 'professor',
    name: 'Dr. John Smith'
  },
  {
    id: '3',
    email: 'student.alice@universityportal.edu', 
    role: 'student',
    name: 'Alice Johnson'
  }
]

export const mockAuth = {
  // Mock login function
  async login(email: string): Promise<User | null> {
    // For development, accept any email without password validation
    const user = mockUsers.find(u => u.email === email)
    return user || null
  },

  // Mock current user (you can change this as needed)
  async getCurrentUser(): Promise<User | null> {
    // Return admin user by default for development
    return mockUsers[0]
  },

  // Mock logout
  async logout(): Promise<void> {
    console.log('Mock logout')
  }
} 
"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Mock AuthUser type for when Supabase is not configured
interface AuthUser {
  id: string
  email: string
  role: 'student' | 'professor' | 'admin'
  firstName?: string
  lastName?: string
  phone?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase not configured, using mock auth')
        setUser({
          id: 'mock-admin-id',
          email: 'admin@example.com',
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User'
        })
        return
      }

      const { authService } = await import('@/lib/auth-supabase')
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    }
  }

  useEffect(() => {
    // Get initial user
    refreshUser().finally(() => setLoading(false))

    // Only set up auth listener if Supabase is configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      import('@/lib/auth-supabase').then(({ authService }) => {
        const { data: { subscription } } = authService.onAuthStateChange((authUser) => {
          setUser(authUser)
          setLoading(false)
        })

        return () => subscription?.unsubscribe()
      }).catch(console.error)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password)
    setUser({
      id: result.user.id,
      email: result.user.email!,
      role: result.profile.role,
      firstName: result.profile.first_name,
      lastName: result.profile.last_name,
      phone: result.profile.phone
    })
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    refreshUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
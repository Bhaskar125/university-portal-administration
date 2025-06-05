"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles: ('admin' | 'professor' | 'student')[]
  redirectTo?: string
}

export function RouteGuard({ children, allowedRoles, redirectTo }: RouteGuardProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Get user data from localStorage
      const storedUser = localStorage.getItem('currentUser')
      
      if (!storedUser) {
        // No user logged in, redirect to login
        router.push('/auth/login')
        return
      }

      const user = JSON.parse(storedUser)
      setUserRole(user.role)

      // Check if user's role is allowed to access this route
      if (allowedRoles.includes(user.role)) {
        setIsAuthorized(true)
      } else {
        // User not authorized, redirect to their appropriate dashboard
        const correctDashboard = `/dashboard/${user.role}`
        
        if (redirectTo) {
          router.push(redirectTo)
        } else {
          router.push(correctDashboard)
        }
        
        setIsAuthorized(false)
      }
    } catch (error) {
      console.error('Route guard error:', error)
      // On error, redirect to login
      router.push('/auth/login')
    }
  }, [allowedRoles, redirectTo, router])

  // Show loading while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    )
  }

  // Show content only if authorized
  if (isAuthorized) {
    return <>{children}</>
  }

  // Show unauthorized message (this should rarely be seen due to redirect)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          You don&apos;t have permission to access this page as a <span className="font-medium">{userRole}</span>.
        </p>
        <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
} 
"use client"

import { Navbar } from '@/app/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Shield, Loader2 } from 'lucide-react'

export default function TestUserPage() {
  // Mock user data for demonstration
  const user = {
    id: 'mock-user',
    email: 'admin@example.com',
    role: 'admin' as const,
    firstName: 'Admin',
    lastName: 'User',
    phone: undefined as string | undefined
  }
  const loading = false

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Authentication Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Loading user data...</span>
                </div>
              ) : user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{user.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span>{user.firstName} {user.lastName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Role:</span>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>
                  
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Phone:</span>
                      <span>{user.phone}</span>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      ✅ Authentication is working! Check the navbar above to see your user information displayed.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No user authenticated</p>
                  <p className="text-sm text-gray-500">
                    Please log in to see user information in the navbar.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
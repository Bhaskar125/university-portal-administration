"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, RefreshCw, Database } from 'lucide-react'

interface SchemaStatus {
  status: string
  checks: {
    pre_registered_users: {
      exists: boolean
      error: string | null
    }
    students: {
      exists: boolean
      schema: string | null
      hasEmail: boolean
      hasUuidId: boolean
      error: string | null
    }
  }
  instructions: {
    step1: string
    step2: string
    next: string
  }
}

export default function SchemaCheckPage() {
  const [schemaStatus, setSchemaStatus] = useState<SchemaStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const checkSchema = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/check-schema')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to check schema')
      }
      
      setSchemaStatus(data)
    } catch (err) {
      console.error('Schema check error:', err)
      setError(err instanceof Error ? err.message : 'Failed to check schema')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkSchema()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="w-8 h-8 text-blue-600" />
            Database Schema Status
          </h1>
          <p className="text-gray-600 mt-2">
            Check if your database is properly set up for the university portal
          </p>
        </div>
        <Button onClick={checkSchema} disabled={isLoading} className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Checking...' : 'Check Again'}
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {schemaStatus && (
        <div className="space-y-6">
          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Setup Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pre-registration Table Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Pre-registration Table</h3>
                    <p className="text-sm text-gray-600">pre_registered_users</p>
                  </div>
                  <Badge variant={schemaStatus.checks.pre_registered_users.exists ? "default" : "destructive"}>
                    {schemaStatus.checks.pre_registered_users.exists ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-1" />
                    )}
                    {schemaStatus.checks.pre_registered_users.exists ? 'Ready' : 'Missing'}
                  </Badge>
                </div>

                {/* Students Table Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Students Table</h3>
                    <p className="text-sm text-gray-600">
                      Schema: {schemaStatus.checks.students.schema || 'unknown'}
                    </p>
                  </div>
                  <Badge variant={schemaStatus.checks.students.hasEmail ? "default" : "destructive"}>
                    {schemaStatus.checks.students.hasEmail ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-1" />
                    )}
                    {schemaStatus.checks.students.hasEmail ? 'Updated' : 'Needs Update'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-blue-700">1</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {schemaStatus.checks.pre_registered_users.exists ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium">{schemaStatus.instructions.step1}</span>
                    </div>
                    {!schemaStatus.checks.pre_registered_users.exists && (
                      <p className="text-sm text-gray-600 mt-1">
                        Run the SQL from <code>database-setup.sql</code> in your Supabase SQL Editor
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-blue-700">2</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {schemaStatus.checks.students.hasEmail ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium">{schemaStatus.instructions.step2}</span>
                    </div>
                    {!schemaStatus.checks.students.hasEmail && (
                      <p className="text-sm text-gray-600 mt-1">
                        Run the SQL from <code>fix-students-schema.sql</code> in your Supabase SQL Editor
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Next Steps</h4>
                <p className="text-green-700">{schemaStatus.instructions.next}</p>
              </div>
            </CardContent>
          </Card>

          {/* File Links */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Find these SQL files in your project root:
                </p>
                <ul className="space-y-1 text-sm">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">database-setup.sql</code> - Creates pre-registration table</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">fix-students-schema.sql</code> - Updates students table schema</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">SETUP_INSTRUCTIONS.md</code> - Detailed setup guide</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 
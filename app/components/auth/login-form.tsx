"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight, Loader2, CheckCircle, Users, GraduationCap, Shield } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ""
  })
  const [error, setError] = useState("")
  const [loggedOut, setLoggedOut] = useState(false)
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    // Check if user was redirected from logout
    const from = searchParams?.get('from')
    const registeredParam = searchParams?.get('registered')
    
    if (from === 'logout') {
      setLoggedOut(true)
      // Hide the message after 5 seconds
      setTimeout(() => setLoggedOut(false), 5000)
    }
    
    if (registeredParam === 'true') {
      setRegistered(true)
      // Hide the message after 5 seconds
      setTimeout(() => setRegistered(false), 5000)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setLoggedOut(false)
    
    // Validate role selection
    if (!formData.role) {
      setError("Please select your role to continue")
      setIsLoading(false)
      return
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Demo credentials for different roles
    const validCredentials = {
      admin: { email: "admin@test.com", password: "password", dashboard: "/dashboard" },
      professor: { email: "professor@test.com", password: "password", dashboard: "/dashboard/professor" },
      student: { email: "student@test.com", password: "password", dashboard: "/dashboard/student" }
    }
    
    const credentials = validCredentials[formData.role as keyof typeof validCredentials]
    
    if (credentials && formData.email === credentials.email && formData.password === credentials.password) {
      window.location.href = credentials.dashboard
    } else {
      const roleCredentials = Object.entries(validCredentials).find(([role]) => role === formData.role)?.[1]
      if (roleCredentials) {
        setError(`Invalid credentials. Try ${roleCredentials.email} / password`)
      } else {
        setError("Invalid email or password")
      }
    }
    
    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (loggedOut) setLoggedOut(false)
    if (registered) setRegistered(false)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />
      case 'professor': return <GraduationCap className="w-4 h-4" />
      case 'student': return <Users className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 group">
      <CardHeader className="space-y-1 text-center pb-8">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-gray-600 text-lg">
          Sign in to access your portal
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {registered && (
          <Alert className="border-emerald-200 bg-emerald-50 animate-in slide-in-from-top duration-300">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-700">
              Account created successfully! Please sign in with your credentials.
            </AlertDescription>
          </Alert>
        )}

        {loggedOut && (
          <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top duration-300">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              You have been logged out successfully. Please sign in again.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50 animate-in slide-in-from-top duration-300">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
              I am signing in as
            </Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)} required>
              <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300">
                <div className="flex items-center gap-2">
                  {formData.role && getRoleIcon(formData.role)}
                  <SelectValue placeholder="Select your role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin" className="flex items-center gap-2 p-3 cursor-pointer hover:bg-blue-50">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Administrator</div>
                      <div className="text-xs text-gray-500">Manage institution operations</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="professor" className="flex items-center gap-2 p-3 cursor-pointer hover:bg-emerald-50">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Professor</div>
                      <div className="text-xs text-gray-500">Manage courses and students</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="student" className="flex items-center gap-2 p-3 cursor-pointer hover:bg-blue-50">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Student</div>
                      <div className="text-xs text-gray-500">Access courses and grades</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200 h-5 w-5" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 group-hover:border-gray-300"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200 h-5 w-5" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 group-hover:border-gray-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-200"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:transform-none disabled:hover:scale-100 group"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Sign In</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            )}
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-12 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="h-12 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.986C24.007 5.367 18.641.001 12.017.001z"/>
            </svg>
            Microsoft
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-red-500" />
              <span><strong>Admin:</strong> admin@test.com / password</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3 h-3 text-emerald-500" />
              <span><strong>Professor:</strong> professor@test.com / password</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-blue-500" />
              <span><strong>Student:</strong> student@test.com / password</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

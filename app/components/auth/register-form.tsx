"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Building, AlertCircle, Sparkles } from "lucide-react"
import Link from "next/link"

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [eligibilityStatus, setEligibilityStatus] = useState<{
    checking: boolean
    eligible: boolean | null
    message: string
    requiredName?: { firstName: string; lastName: string }
  }>({
    checking: false,
    eligible: null,
    message: ""
  })

  const checkEligibility = async (email: string, role: string) => {
    if (!email || !role || role === 'admin') {
      setEligibilityStatus({ checking: false, eligible: null, message: "" })
      return
    }

    setEligibilityStatus({ checking: true, eligible: null, message: "" })

    try {
      const response = await fetch('/api/auth/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      })

      const data = await response.json()

      if (response.ok) {
        setEligibilityStatus({
          checking: false,
          eligible: data.eligible,
          message: data.message,
          requiredName: data.requiredName
        })
      } else {
        setEligibilityStatus({
          checking: false,
          eligible: false,
          message: data.error || 'Failed to check eligibility'
        })
      }
    } catch {
      setEligibilityStatus({
        checking: false,
        eligible: false,
        message: 'Failed to check eligibility'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const form = new FormData(e.target as HTMLFormElement)
    const firstName = form.get('firstName') as string
    const lastName = form.get('lastName') as string
    const email = form.get('email') as string
    const password = form.get('password') as string
    const confirmPassword = form.get('confirmPassword') as string
    const phone = form.get('phone') as string
    const role = selectedRole
    const department = selectedDepartment

    // Validation
    if (!firstName || !lastName || !email || !password || !role) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    // Department is required for students and professors, but not for admins
    if (role !== 'admin' && !department) {
      setError("Please select a department")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    if (!agreedToTerms) {
      setError("Please agree to the terms and conditions")
      setIsLoading(false)
      return
    }

    try {
             // Call the registration API
       const response = await fetch('/api/auth/register', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           firstName,
           lastName,
           email,
           password,
           role,
           phone,
           ...(role !== 'admin' && { department }) // Only include department for non-admin roles
         }),
       })

      const data = await response.json()

      if (!response.ok) {
        let errorMessage = data.error || 'Registration failed'
        if (data.details) {
          errorMessage += ` ${data.details}`
        }
        throw new Error(errorMessage)
      }
      
      // Redirect to login page with success message
      router.push('/auth/login?registered=true')
    } catch (err) {
      console.error('Registration error:', err)
      setError(err instanceof Error ? err.message : "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 group">
      <CardHeader className="space-y-1 text-center pb-8">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
          Create Your Account
        </CardTitle>
        <CardDescription className="text-gray-600 text-lg">
          Join the academic excellence platform
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <Alert className="border-red-200 bg-red-50 animate-in slide-in-from-top duration-300">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                <Input 
                  id="firstName" 
                  name="firstName"
                  placeholder="John" 
                  className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 hover:border-gray-300" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name
              </Label>
              <Input 
                id="lastName" 
                name="lastName"
                placeholder="Doe" 
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 hover:border-gray-300" 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="john.doe@universityportal.edu" 
                className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 hover:border-gray-300" 
                required 
                onChange={(e) => {
                  const email = e.target.value
                  if (selectedRole && email.includes('@')) {
                    checkEligibility(email, selectedRole)
                  }
                }}
              />
            </div>
            
            {/* Show eligibility status */}
            {eligibilityStatus.checking && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Checking eligibility...
              </div>
            )}
            
            {eligibilityStatus.eligible === true && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                {eligibilityStatus.message}
                {eligibilityStatus.requiredName && (
                  <div className="text-xs text-gray-600 mt-1">
                    Please use name: {eligibilityStatus.requiredName.firstName} {eligibilityStatus.requiredName.lastName}
                  </div>
                )}
              </div>
            )}
            
            {eligibilityStatus.eligible === false && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-3 h-3" />
                {eligibilityStatus.message}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number (Optional)
            </Label>
            <Input 
              id="phone" 
              name="phone"
              type="tel" 
              placeholder="+1 (555) 123-4567" 
              className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 hover:border-gray-300" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
              Your Role
            </Label>
            <Select value={selectedRole} onValueChange={(role) => {
              setSelectedRole(role)
              const emailInput = document.getElementById('email') as HTMLInputElement
              if (emailInput?.value && emailInput.value.includes('@')) {
                checkEligibility(emailInput.value, role)
              }
            }} required>
              <SelectTrigger className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 hover:border-gray-300">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="professor">Professor</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Show registration notice for students and professors */}
          {(selectedRole === 'student' || selectedRole === 'professor') && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">
                    Pre-registration Required
                  </p>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Only {selectedRole}s who have been pre-registered by an administrator can create accounts. 
                    Your first name, last name, and email address must match exactly with your {selectedRole} record.
                  </p>
                  <p className="text-xs text-amber-700 mt-2 font-medium">
                    If you haven&apos;t been registered yet, please contact your administrator.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Only show department selection for students and professors */}
          {selectedRole && selectedRole !== 'admin' && (
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                Department
              </Label>
              <div className="relative group">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200 z-10" />
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment} required>
                  <SelectTrigger className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 hover:border-gray-300">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CS">Computer Science</SelectItem>
                    <SelectItem value="EE">Electrical Engineering</SelectItem>
                    <SelectItem value="ME">Mechanical Engineering</SelectItem>
                    <SelectItem value="CE">Civil Engineering</SelectItem>
                    <SelectItem value="MATH">Mathematics</SelectItem>
                    <SelectItem value="PHY">Physics</SelectItem>
                    <SelectItem value="CHEM">Chemistry</SelectItem>
                    <SelectItem value="BIO">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Show info message for administrators */}
          {selectedRole === 'admin' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-blue-700 font-medium">
                  Administrator Access
                </p>
              </div>
                             <p className="text-xs text-blue-600 mt-1">
                 As an administrator, you&apos;ll have access to all departments and institutional features.
               </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="pl-10 pr-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 hover:border-gray-300"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-emerald-500 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pl-10 pr-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 hover:border-gray-300"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-emerald-500 transition-colors duration-200"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <Checkbox 
              id="terms" 
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              className="mt-1 border-gray-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />
            <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
              I agree to the{" "}
              <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-colors duration-200">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-colors duration-200">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-8 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-white font-medium py-3 relative overflow-hidden group"
            disabled={
              isLoading || 
              !agreedToTerms || 
              (selectedRole !== 'admin' && eligibilityStatus.eligible === false) ||
              (selectedRole !== 'admin' && eligibilityStatus.checking)
            }
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating your account...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Create Account
              </div>
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Already have an account?</span>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/auth/login" 
            className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors duration-200"
          >
            Sign in to your account
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

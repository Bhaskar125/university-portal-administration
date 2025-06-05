"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  GraduationCap,
  MapPin,
  FileText
} from "lucide-react"
import Link from "next/link"

export default function NewStudentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContact: "",
    emergencyPhone: "",
    
    // Academic Information
    studentId: "",
    department: "",
    course: "",
    batch: "",
    year: "",
    admissionDate: "",
    previousEducation: "",
    
    // Additional Information
    bloodGroup: "",
    nationality: "",
    religion: ""
  })

  const departments = [
    { name: "Computer Science", code: "CS" },
    { name: "Electrical Engineering", code: "EE" },
    { name: "Mechanical Engineering", code: "ME" },
    { name: "Civil Engineering", code: "CE" },
    { name: "Mathematics", code: "MATH" },
    { name: "Physics", code: "PHY" },
    { name: "Chemistry", code: "CHEM" },
    { name: "Biology", code: "BIO" }
  ]

  const courses = {
    CS: ["Computer Science Engineering", "Information Technology", "Software Engineering"],
    EE: ["Electrical Engineering", "Electronics Engineering", "Power Systems"],
    ME: ["Mechanical Engineering", "Manufacturing Engineering", "Automotive Engineering"],
    CE: ["Civil Engineering", "Structural Engineering", "Environmental Engineering"],
    MATH: ["Mathematics", "Applied Mathematics", "Statistics"],
    PHY: ["Physics", "Applied Physics", "Theoretical Physics"],
    CHEM: ["Chemistry", "Applied Chemistry", "Chemical Engineering"],
    BIO: ["Biology", "Biotechnology", "Biochemistry"]
  }

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"]
  const batches = ["2024", "2023", "2022", "2021"]
  const genders = ["Male", "Female", "Other"]
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (success) setSuccess(false)
    
    // Generate student ID automatically when department and batch are selected
    if (field === "department" || field === "batch") {
      if (formData.department && formData.batch && (field === "department" || field === "batch")) {
        const dept = field === "department" ? value : formData.department
        const batch = field === "batch" ? value : formData.batch
        
        // Generate unique student ID via API
        fetch('/api/generate-student-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ department: dept, batch })
        })
        .then(res => res.json())
        .then(data => {
          if (data.studentId) {
            setFormData(prev => ({ 
              ...prev, 
              [field]: value,
              studentId: data.studentId
            }))
          }
        })
        .catch(err => {
          console.error('Error generating student ID:', err)
          // Fallback to original method
          const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
          setFormData(prev => ({ 
            ...prev, 
            [field]: value,
            studentId: `${dept}${batch}${randomNum}`
          }))
        })
      }
    }
  }

  const validateForm = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender',
      'address', 'department', 'course', 'batch', 'year', 'admissionDate'
    ]
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        return `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address"
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(formData.phone.replace(/[^\d+]/g, ''))) {
      return "Please enter a valid phone number"
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }
    
    try {
      // Call the API to create student
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          semester: parseInt(formData.year.replace(/\D/g, '')) // Convert "1st Year" to 1
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}` 
          : data.error || 'Failed to create student'
        throw new Error(errorMessage)
      }
      
      console.log("Student created:", data)
      setSuccess(true)
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", gender: "",
          address: "", city: "", state: "", zipCode: "", emergencyContact: "", emergencyPhone: "",
          studentId: "", department: "", course: "", batch: "", year: "", admissionDate: "", previousEducation: "",
          bloodGroup: "", nationality: "", religion: ""
        })
        setSuccess(false)
      }, 3000)
      
    } catch (err) {
      console.error('Submission error:', err)
      setError(err instanceof Error ? err.message : "Failed to create student. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/students">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Students
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            Add New Student
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Enter student information to create a new registration.
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top duration-300">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Student created successfully! The student has been added to the system.
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </CardTitle>
            <CardDescription>Basic student details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Enter first name"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Enter last name"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="student@university.edu"
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                  Date of Birth *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                  Gender *
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bloodGroup" className="text-sm font-medium text-gray-700">
                  Blood Group
                </Label>
                <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange("bloodGroup", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                Address *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter full address"
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter city"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                  State
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Enter state"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                  ZIP Code
                </Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  placeholder="Enter ZIP code"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">
                  Emergency Contact Name
                </Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  placeholder="Emergency contact name"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone" className="text-sm font-medium text-gray-700">
                  Emergency Contact Phone
                </Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  placeholder="Emergency contact phone"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
              Academic Information
            </CardTitle>
            <CardDescription>Department, course, and academic details</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="studentId" className="text-sm font-medium text-gray-700">
                  Student ID
                </Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange("studentId", e.target.value)}
                  placeholder="Auto-generated"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50"
                  readOnly
                />
                <p className="text-xs text-gray-500">Auto-generated based on department and batch</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admissionDate" className="text-sm font-medium text-gray-700">
                  Admission Date *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="admissionDate"
                    type="date"
                    value={formData.admissionDate}
                    onChange={(e) => handleInputChange("admissionDate", e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                  Department *
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                    <SelectTrigger className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.code} value={dept.code}>
                          {dept.name} ({dept.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="course" className="text-sm font-medium text-gray-700">
                  Course *
                </Label>
                <Select 
                  value={formData.course} 
                  onValueChange={(value) => handleInputChange("course", value)}
                  disabled={!formData.department}
                >
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.department && courses[formData.department as keyof typeof courses]?.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="batch" className="text-sm font-medium text-gray-700">
                  Batch *
                </Label>
                <Select value={formData.batch} onValueChange={(value) => handleInputChange("batch", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select batch year" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch} value={batch}>
                        {batch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                  Academic Year *
                </Label>
                <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousEducation" className="text-sm font-medium text-gray-700">
                Previous Education
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                <Input
                  id="previousEducation"
                  value={formData.previousEducation}
                  onChange={(e) => handleInputChange("previousEducation", e.target.value)}
                  placeholder="Previous school/college details"
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Additional Information
            </CardTitle>
            <CardDescription>Optional details for complete profile</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nationality" className="text-sm font-medium text-gray-700">
                  Nationality
                </Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange("nationality", e.target.value)}
                  placeholder="Enter nationality"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="religion" className="text-sm font-medium text-gray-700">
                  Religion
                </Label>
                <Input
                  id="religion"
                  value={formData.religion}
                  onChange={(e) => handleInputChange("religion", e.target.value)}
                  placeholder="Enter religion (optional)"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link href="/dashboard/admin/students">
            <Button variant="outline" type="button" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </Button>
          </Link>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-w-[150px]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Student
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 
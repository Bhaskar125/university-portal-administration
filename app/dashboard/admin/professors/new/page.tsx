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
  GraduationCap,
  FileText,
  BookOpen
} from "lucide-react"
import Link from "next/link"

export default function NewProfessorPage() {
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
    
    // Professional Information
    professorId: "",
    department: "",
    specialization: "",
    qualification: "",
    experience: "",
    joinDate: "",
    previousInstitution: "",
    
    // Academic Information
    researchAreas: "",
    publications: "",
    certifications: "",
    salary: "",
    
    // Additional Information
    bloodGroup: "",
    nationality: "",
    biography: ""
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

  const specializations = {
    CS: ["Machine Learning", "Data Structures", "Database Systems", "Software Engineering", "Computer Networks", "AI/ML", "Cybersecurity"],
    EE: ["Power Systems", "Electronics", "Signal Processing", "Control Systems", "Telecommunications", "Embedded Systems"],
    ME: ["Thermodynamics", "Fluid Mechanics", "Manufacturing", "Automotive", "Robotics", "Materials Science"],
    CE: ["Structural Engineering", "Environmental Engineering", "Transportation", "Geotechnical", "Construction Management"],
    MATH: ["Pure Mathematics", "Applied Mathematics", "Statistics", "Discrete Mathematics", "Numerical Analysis"],
    PHY: ["Theoretical Physics", "Applied Physics", "Quantum Physics", "Nuclear Physics", "Astrophysics"],
    CHEM: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry", "Biochemistry"],
    BIO: ["Molecular Biology", "Genetics", "Biotechnology", "Biochemistry", "Cell Biology", "Ecology"]
  }

  const qualifications = ["Ph.D.", "M.Tech", "M.Sc", "M.E.", "MBA", "Other"]
  const genders = ["Male", "Female", "Other"]
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (success) setSuccess(false)
    
    // Generate professor ID automatically when department and year are available
    if (field === "department" || field === "joinDate") {
      if (formData.department && formData.joinDate && (field === "department" || field === "joinDate")) {
        const dept = field === "department" ? value : formData.department
        const joinYear = field === "joinDate" ? new Date(value).getFullYear() : new Date(formData.joinDate).getFullYear()
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        setFormData(prev => ({ 
          ...prev, 
          [field]: value,
          professorId: `PROF${dept}${joinYear}${randomNum}`
        }))
      }
    }
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) return "First name is required"
    if (!formData.lastName.trim()) return "Last name is required"
    if (!formData.email.trim()) return "Email is required"
    if (!formData.phone.trim()) return "Phone number is required"
    if (!formData.department) return "Department is required"
    if (!formData.specialization) return "Specialization is required"
    if (!formData.qualification) return "Qualification is required"
    if (!formData.experience) return "Experience is required"
    if (!formData.joinDate) return "Join date is required"
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address"
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) return "Please enter a valid phone number"
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      // Make API call to create professor
      const response = await fetch("/api/professors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create professor")
      }

      const result = await response.json()
      console.log("Professor created successfully:", result)
      
      setSuccess(true)
      // Reset form after success
      setTimeout(() => {
        setFormData({
          firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "",
          gender: "", address: "", city: "", state: "", zipCode: "",
          emergencyContact: "", emergencyPhone: "", professorId: "",
          department: "", specialization: "", qualification: "", experience: "",
          joinDate: "", previousInstitution: "", researchAreas: "", publications: "",
          certifications: "", salary: "", bloodGroup: "", nationality: "", biography: ""
        })
        setSuccess(false)
      }, 3000)
      
    } catch (error) {
      console.error("Error creating professor:", error)
      setError(error instanceof Error ? error.message : "Failed to create professor. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/professors">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Professors
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
            Add New Professor
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Enter professor information to create a new faculty registration.
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top duration-300">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Professor created successfully! The professor has been added to the system.
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
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Personal Information
            </CardTitle>
            <CardDescription>Basic professor details and contact information</CardDescription>
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
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
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
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
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
                    placeholder="professor@university.edu"
                    className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
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
                    className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                  Gender
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20">
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
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20">
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
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
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
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                Address
              </Label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("address", e.target.value)}
                placeholder="Enter full address"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                rows={3}
              />
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
                  placeholder="City"
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
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
                  placeholder="State"
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
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
                  placeholder="ZIP Code"
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
              Professional Information
            </CardTitle>
            <CardDescription>Department, specialization, and employment details</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="professorId" className="text-sm font-medium text-gray-700">
                  Professor ID
                </Label>
                <Input
                  id="professorId"
                  value={formData.professorId}
                  onChange={(e) => handleInputChange("professorId", e.target.value)}
                  placeholder="Auto-generated"
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gray-50"
                  readOnly
                />
                <p className="text-xs text-gray-500">Auto-generated based on department and join date</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="joinDate" className="text-sm font-medium text-gray-700">
                  Join Date *
                </Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => handleInputChange("joinDate", e.target.value)}
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                  Department *
                </Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.code} value={dept.code}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-sm font-medium text-gray-700">
                  Specialization *
                </Label>
                <Select 
                  value={formData.specialization} 
                  onValueChange={(value) => handleInputChange("specialization", value)}
                  disabled={!formData.department}
                >
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20">
                    <SelectValue placeholder={formData.department ? "Select specialization" : "Select department first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.department && specializations[formData.department as keyof typeof specializations]?.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="qualification" className="text-sm font-medium text-gray-700">
                  Highest Qualification *
                </Label>
                <Select value={formData.qualification} onValueChange={(value) => handleInputChange("qualification", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20">
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualifications.map((qual) => (
                      <SelectItem key={qual} value={qual}>
                        {qual}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                  Years of Experience *
                </Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="Years of experience"
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousInstitution" className="text-sm font-medium text-gray-700">
                Previous Institution
              </Label>
              <Input
                id="previousInstitution"
                value={formData.previousInstitution}
                onChange={(e) => handleInputChange("previousInstitution", e.target.value)}
                placeholder="Previous institution or organization"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Academic Information
            </CardTitle>
            <CardDescription>Research areas, publications, and academic achievements</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="researchAreas" className="text-sm font-medium text-gray-700">
                Research Areas
              </Label>
              <textarea
                id="researchAreas"
                value={formData.researchAreas}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("researchAreas", e.target.value)}
                placeholder="List main research areas and interests"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publications" className="text-sm font-medium text-gray-700">
                Publications
              </Label>
              <textarea
                id="publications"
                value={formData.publications}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("publications", e.target.value)}
                placeholder="List key publications, research papers, books"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications" className="text-sm font-medium text-gray-700">
                Certifications & Awards
              </Label>
              <textarea
                id="certifications"
                value={formData.certifications}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("certifications", e.target.value)}
                placeholder="List professional certifications, awards, honors"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
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
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-medium text-gray-700">
                  Annual Salary
                </Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  placeholder="Annual salary (optional)"
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="biography" className="text-sm font-medium text-gray-700">
                Biography
              </Label>
              <textarea
                id="biography"
                value={formData.biography}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("biography", e.target.value)}
                placeholder="Brief biography for public profile (optional)"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link href="/dashboard/admin/professors">
            <Button variant="outline" type="button" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </Button>
          </Link>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-w-[150px]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Professor
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 
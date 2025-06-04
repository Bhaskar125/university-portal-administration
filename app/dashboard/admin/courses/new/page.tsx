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
  BookOpen,
  Calendar,
  Building,
  GraduationCap,
  Users
} from "lucide-react"
import Link from "next/link"

export default function NewCoursePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    // Basic Information
    courseId: "",
    courseName: "",
    description: "",
    department: "",
    credits: "",
    courseType: "",
    level: "",
    
    // Academic Information
    semester: "",
    year: "",
    prerequisites: "",
    corequisites: "",
    learningOutcomes: "",
    
    // Instructor and Capacity
    instructor: "",
    assistantInstructor: "",
    maxCapacity: "",
    classroomLocation: "",
    
    // Schedule Information
    startDate: "",
    endDate: "",
    duration: "",
    schedule: "",
    examSchedule: ""
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

  const courseTypes = [
    "Core Course", "Elective", "Laboratory", "Seminar", "Project", "Internship", "Thesis"
  ]

  const levels = [
    "Undergraduate - 100 Level", "Undergraduate - 200 Level", 
    "Undergraduate - 300 Level", "Undergraduate - 400 Level",
    "Graduate - 500 Level", "Graduate - 600 Level"
  ]

  const semesters = ["Fall", "Spring", "Summer"]
  const years = ["2024", "2025", "2026"]
  const creditOptions = ["1", "2", "3", "4", "5", "6"]
  const durations = ["8 weeks", "12 weeks", "15 weeks", "16 weeks", "18 weeks"]

  const instructors = [
    "Dr. Sarah Johnson", "Prof. Michael Chen", "Dr. Emily Davis", 
    "Prof. Robert Wilson", "Dr. Lisa Anderson", "Dr. James Brown",
    "Prof. Maria Garcia", "Dr. David Kim", "Prof. Jennifer Lee"
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (success) setSuccess(false)
    
    // Generate course ID automatically when department and level are selected
    if (field === "department" || field === "level") {
      if (formData.department && formData.level && (field === "department" || field === "level")) {
        const dept = field === "department" ? value : formData.department
        const level = field === "level" ? value : formData.level
        const levelNum = level.includes("100") ? "101" : 
                        level.includes("200") ? "201" : 
                        level.includes("300") ? "301" : 
                        level.includes("400") ? "401" : 
                        level.includes("500") ? "501" : "601"
        
        setFormData(prev => ({ 
          ...prev, 
          [field]: value,
          courseId: `${dept}${levelNum}`
        }))
      }
    }
  }

  const validateForm = () => {
    const requiredFields = [
      'courseId', 'courseName', 'description', 'department', 'credits', 
      'courseType', 'level', 'semester', 'year', 'instructor', 'maxCapacity',
      'startDate', 'endDate', 'duration', 'schedule'
    ]
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        return `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`
      }
    }
    
    // Check if start date is before end date
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      return "End date must be after start date"
    }
    
    // Check capacity is a valid number
    const capacity = parseInt(formData.maxCapacity)
    if (isNaN(capacity) || capacity < 1 || capacity > 500) {
      return "Maximum capacity must be between 1 and 500"
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log("Course data:", formData)
      setSuccess(true)
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          courseId: "", courseName: "", description: "", department: "", credits: "",
          courseType: "", level: "", semester: "", year: "", prerequisites: "",
          corequisites: "", learningOutcomes: "", instructor: "", assistantInstructor: "",
          maxCapacity: "", classroomLocation: "", startDate: "", endDate: "",
          duration: "", schedule: "", examSchedule: ""
        })
        setSuccess(false)
      }, 3000)
      
    } catch {
      setError("Failed to create course. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/courses">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            Create New Course
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Set up a new course with comprehensive details and scheduling.
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top duration-300">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Course created successfully! The course has been added to the system.
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
        {/* Basic Information */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Basic Information
            </CardTitle>
            <CardDescription>Course details and classification</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="courseId" className="text-sm font-medium text-gray-700">
                  Course ID *
                </Label>
                <Input
                  id="courseId"
                  value={formData.courseId}
                  onChange={(e) => handleInputChange("courseId", e.target.value)}
                  placeholder="Auto-generated (e.g., CS101)"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
                <p className="text-xs text-gray-500">Auto-generated based on department and level</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="courseName" className="text-sm font-medium text-gray-700">
                  Course Name *
                </Label>
                <Input
                  id="courseName"
                  value={formData.courseName}
                  onChange={(e) => handleInputChange("courseName", e.target.value)}
                  placeholder="Enter course name"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Course Description *
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("description", e.target.value)}
                placeholder="Enter detailed course description"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <Label htmlFor="credits" className="text-sm font-medium text-gray-700">
                  Credits *
                </Label>
                <Select value={formData.credits} onValueChange={(value) => handleInputChange("credits", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select credits" />
                  </SelectTrigger>
                  <SelectContent>
                    {creditOptions.map((credit) => (
                      <SelectItem key={credit} value={credit}>
                        {credit} Credit{credit !== "1" ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseType" className="text-sm font-medium text-gray-700">
                  Course Type *
                </Label>
                <Select value={formData.courseType} onValueChange={(value) => handleInputChange("courseType", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level" className="text-sm font-medium text-gray-700">
                Course Level *
              </Label>
              <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
                <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <CardDescription>Prerequisites, outcomes, and academic details</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-sm font-medium text-gray-700">
                  Semester *
                </Label>
                <Select value={formData.semester} onValueChange={(value) => handleInputChange("semester", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                  Year *
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="prerequisites" className="text-sm font-medium text-gray-700">
                  Prerequisites
                </Label>
                <Input
                  id="prerequisites"
                  value={formData.prerequisites}
                  onChange={(e) => handleInputChange("prerequisites", e.target.value)}
                  placeholder="e.g., CS101, MATH101"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="corequisites" className="text-sm font-medium text-gray-700">
                  Corequisites
                </Label>
                <Input
                  id="corequisites"
                  value={formData.corequisites}
                  onChange={(e) => handleInputChange("corequisites", e.target.value)}
                  placeholder="e.g., CS101L (Lab)"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningOutcomes" className="text-sm font-medium text-gray-700">
                Learning Outcomes
              </Label>
              <Input
                id="learningOutcomes"
                value={formData.learningOutcomes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("learningOutcomes", e.target.value)}
                placeholder="Describe what students will learn and achieve"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Instructor and Capacity */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Instructor and Capacity
            </CardTitle>
            <CardDescription>Teaching staff and enrollment details</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="instructor" className="text-sm font-medium text-gray-700">
                  Primary Instructor *
                </Label>
                <Select value={formData.instructor} onValueChange={(value) => handleInputChange("instructor", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor} value={instructor}>
                        {instructor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assistantInstructor" className="text-sm font-medium text-gray-700">
                  Assistant Instructor
                </Label>
                <Select value={formData.assistantInstructor} onValueChange={(value) => handleInputChange("assistantInstructor", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select assistant (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor} value={instructor}>
                        {instructor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxCapacity" className="text-sm font-medium text-gray-700">
                  Maximum Capacity *
                </Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  value={formData.maxCapacity}
                  onChange={(e) => handleInputChange("maxCapacity", e.target.value)}
                  placeholder="Enter max students"
                  min="1"
                  max="500"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="classroomLocation" className="text-sm font-medium text-gray-700">
                  Classroom Location
                </Label>
                <Input
                  id="classroomLocation"
                  value={formData.classroomLocation}
                  onChange={(e) => handleInputChange("classroomLocation", e.target.value)}
                  placeholder="e.g., Room 101, Building A"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Information */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Schedule Information
            </CardTitle>
            <CardDescription>Course timing and schedule details</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                  Start Date *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                  End Date *
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                  Duration *
                </Label>
                <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration} value={duration}>
                        {duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="schedule" className="text-sm font-medium text-gray-700">
                  Class Schedule *
                </Label>
                <Input
                  id="schedule"
                  value={formData.schedule}
                  onChange={(e) => handleInputChange("schedule", e.target.value)}
                  placeholder="e.g., Mon, Wed, Fri 9:00-10:30 AM"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="examSchedule" className="text-sm font-medium text-gray-700">
                  Exam Schedule
                </Label>
                <Input
                  id="examSchedule"
                  value={formData.examSchedule}
                  onChange={(e) => handleInputChange("examSchedule", e.target.value)}
                  placeholder="e.g., Final: Dec 15, 2:00-5:00 PM"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link href="/dashboard/admin/courses">
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
                Create Course
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 
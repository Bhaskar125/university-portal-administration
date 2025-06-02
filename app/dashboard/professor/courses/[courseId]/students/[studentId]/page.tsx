"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line,
  Area,
  AreaChart
} from 'recharts'
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Users,
  GraduationCap,
  FileText,
  BarChart3,
  Activity,
  Star,
  CheckCircle
} from "lucide-react"

// Mock data functions
const getStudentData = (studentId: string) => {
  const students = {
    "21CS001": {
      rollNumber: "21CS001",
      registrationNumber: "REG2021001",
      name: "Sarah Johnson",
      email: "sarah.johnson@university.edu",
      phone: "+1 (555) 0123",
      address: "123 Main St, City, State 12345",
      dateOfBirth: "2002-03-15",
      bloodGroup: "O+",
      nationality: "American",
      religion: "Christian",
      category: "General",
      admissionDate: "2021-08-15",
      currentSemester: 6,
      cgpa: 8.7,
      // Parent Information
      fatherName: "Robert Johnson",
      fatherOccupation: "Software Engineer",
      fatherPhone: "+1 (555) 0124",
      motherName: "Mary Johnson",
      motherOccupation: "Teacher",
      motherPhone: "+1 (555) 0125",
      guardianName: "Robert Johnson",
      guardianRelation: "Father",
      guardianPhone: "+1 (555) 0124",
      emergencyContact: "+1 (555) 0126",
      // Course specific data
      attendancePercentage: 95.2,
      classesAttended: 20,
      totalClasses: 21,
      status: "excellent",
      currentGrade: "A+",
      courseSemester: "Fall 2024"
    },
    "21CS002": {
      rollNumber: "21CS002",
      registrationNumber: "REG2021002",
      name: "Michael Chen",
      email: "michael.chen@university.edu",
      phone: "+1 (555) 0127",
      address: "456 Oak Ave, City, State 12345",
      dateOfBirth: "2002-07-22",
      bloodGroup: "A+",
      nationality: "American",
      religion: "Buddhist",
      category: "General",
      admissionDate: "2021-08-15",
      currentSemester: 6,
      cgpa: 8.9,
      fatherName: "David Chen",
      fatherOccupation: "Doctor",
      fatherPhone: "+1 (555) 0128",
      motherName: "Lisa Chen",
      motherOccupation: "Nurse",
      motherPhone: "+1 (555) 0129",
      guardianName: "David Chen",
      guardianRelation: "Father",
      guardianPhone: "+1 (555) 0128",
      emergencyContact: "+1 (555) 0130",
      attendancePercentage: 88.1,
      classesAttended: 18,
      totalClasses: 21,
      status: "good",
      currentGrade: "A",
      courseSemester: "Fall 2024"
    }
    // Add more students as needed
  }
  return students[studentId as keyof typeof students] || students["21CS001"]
}

const getAssignmentMarks = (studentId: string) => {
  const baseMarks = [
    { assignment: "Assignment 1", maxMarks: 100, obtainedMarks: 95, submissionDate: "2024-09-15", feedback: "Excellent work" },
    { assignment: "Assignment 2", maxMarks: 100, obtainedMarks: 88, submissionDate: "2024-10-01", feedback: "Good approach" },
    { assignment: "Assignment 3", maxMarks: 100, obtainedMarks: 92, submissionDate: "2024-10-15", feedback: "Well structured" },
    { assignment: "Mid-term Exam", maxMarks: 200, obtainedMarks: 175, submissionDate: "2024-11-01", feedback: "Strong performance" },
    { assignment: "Assignment 4", maxMarks: 100, obtainedMarks: 89, submissionDate: "2024-11-15", feedback: "Creative solution" },
    { assignment: "Project Phase 1", maxMarks: 150, obtainedMarks: 140, submissionDate: "2024-12-01", feedback: "Outstanding work" },
    { assignment: "Assignment 5", maxMarks: 100, obtainedMarks: 94, submissionDate: "2024-12-15", feedback: "Comprehensive" }
  ]
  
  const variance = studentId === "21CS001" ? 1.05 : studentId === "21CS002" ? 0.95 : 1.0
  
  return baseMarks.map(mark => ({
    ...mark,
    obtainedMarks: Math.round(mark.obtainedMarks * variance),
    percentage: Math.round((mark.obtainedMarks * variance / mark.maxMarks) * 100)
  }))
}

const getCourseProgress = (studentId: string) => {
  const baseProgress = [
    { week: "Week 1", completion: 90, attendance: 100, quiz: 85, assignment: 95 },
    { week: "Week 2", completion: 88, attendance: 100, quiz: 90, assignment: 88 },
    { week: "Week 3", completion: 92, attendance: 95, quiz: 88, assignment: 92 },
    { week: "Week 4", completion: 89, attendance: 100, quiz: 92, assignment: 89 },
    { week: "Week 5", completion: 94, attendance: 90, quiz: 95, assignment: 94 },
    { week: "Week 6", completion: 91, attendance: 100, quiz: 89, assignment: 91 },
    { week: "Week 7", completion: 93, attendance: 95, quiz: 93, assignment: 93 },
    { week: "Week 8", completion: 87, attendance: 85, quiz: 87, assignment: 90 },
    { week: "Week 9", completion: 95, attendance: 100, quiz: 96, assignment: 95 },
    { week: "Week 10", completion: 92, attendance: 95, quiz: 91, assignment: 92 },
    { week: "Week 11", completion: 89, attendance: 90, quiz: 88, assignment: 89 },
    { week: "Week 12", completion: 96, attendance: 100, quiz: 97, assignment: 96 }
  ]
  
  const variance = studentId === "21CS001" ? 1.02 : studentId === "21CS002" ? 0.98 : 1.0
  
  return baseProgress.map(week => ({
    ...week,
    completion: Math.min(100, Math.round(week.completion * variance)),
    attendance: Math.min(100, Math.round(week.attendance * variance)),
    quiz: Math.min(100, Math.round(week.quiz * variance)),
    assignment: Math.min(100, Math.round(week.assignment * variance))
  }))
}

const getCourseInfo = (courseId: string) => {
  const courses = {
    "cs401": { name: "Advanced Computer Science", code: "CS401", color: "bg-blue-500" },
    "cs301": { name: "Data Structures & Algorithms", code: "CS301", color: "bg-emerald-500" },
    "cs350": { name: "Database Management", code: "CS350", color: "bg-purple-500" },
    "cs402": { name: "Software Engineering", code: "CS402", color: "bg-orange-500" }
  }
  return courses[courseId as keyof typeof courses] || courses["cs401"]
}

export default function StudentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  const studentId = params.studentId as string
  
  const student = getStudentData(studentId)
  const assignmentMarks = getAssignmentMarks(studentId)
  const courseProgress = getCourseProgress(studentId)
  const course = getCourseInfo(courseId)
  
  const overallPerformance = {
    average: Math.round(assignmentMarks.reduce((sum, mark) => sum + mark.percentage, 0) / assignmentMarks.length),
    trend: "increasing",
    rank: 3,
    totalStudents: 45
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
            className="mt-1 hover:scale-105 transition-transform duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>
          
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 ring-4 ring-white shadow-lg">
              <AvatarImage src={`/api/placeholder/64/64`} alt={student.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-xl font-bold">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-emerald-700 bg-clip-text text-transparent">
                {student.name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {student.rollNumber}
                </Badge>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  {course.code} - {course.name}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`${
                    student.status === 'excellent' ? 'bg-green-50 text-green-700 border-green-200' :
                    student.status === 'good' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    student.status === 'average' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  } capitalize`}
                >
                  {student.status} Performance
                </Badge>
              </div>
              <p className="text-gray-600 mt-2">
                Semester {student.currentSemester} • CGPA: {student.cgpa} • Current Grade: {student.currentGrade}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
          
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <Mail className="w-4 h-4" />
            Contact Student
          </Button>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{student.attendancePercentage}%</p>
                <p className="text-sm font-medium text-gray-600">Attendance</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{overallPerformance.average}%</p>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">#{overallPerformance.rank}</p>
                <p className="text-sm font-medium text-gray-600">Class Rank</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{student.cgpa}</p>
                <p className="text-sm font-medium text-gray-600">CGPA</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Information */}
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{student.email}</p>
                  <p className="text-xs text-gray-500">Email Address</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{student.phone}</p>
                  <p className="text-xs text-gray-500">Phone Number</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{student.address}</p>
                  <p className="text-xs text-gray-500">Address</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">Date of Birth</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">{student.bloodGroup}</p>
                  <p className="text-xs text-gray-500">Blood Group</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">{student.nationality}</p>
                  <p className="text-xs text-gray-500">Nationality</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <GraduationCap className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{student.registrationNumber}</p>
                  <p className="text-xs text-gray-500">Registration Number</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parent/Guardian Information */}
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              Parent/Guardian Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                <h4 className="font-semibold text-blue-900 mb-2">Father&apos;s Information</h4>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">Name:</span> {student.fatherName}</p>
                  <p className="text-sm"><span className="font-medium">Occupation:</span> {student.fatherOccupation}</p>
                  <p className="text-sm"><span className="font-medium">Phone:</span> {student.fatherPhone}</p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                <h4 className="font-semibold text-emerald-900 mb-2">Mother&apos;s Information</h4>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">Name:</span> {student.motherName}</p>
                  <p className="text-sm"><span className="font-medium">Occupation:</span> {student.motherOccupation}</p>
                  <p className="text-sm"><span className="font-medium">Phone:</span> {student.motherPhone}</p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-purple-200 bg-purple-50">
                <h4 className="font-semibold text-purple-900 mb-2">Guardian Information</h4>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">Name:</span> {student.guardianName}</p>
                  <p className="text-sm"><span className="font-medium">Relation:</span> {student.guardianRelation}</p>
                  <p className="text-sm"><span className="font-medium">Phone:</span> {student.guardianPhone}</p>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm"><span className="font-medium text-red-900">Emergency Contact:</span></p>
                <p className="text-sm text-red-700">{student.emergencyContact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Summary */}
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              Academic Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Current Course</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    {student.courseSemester}
                  </Badge>
                </div>
                <p className="text-lg font-bold text-blue-900">{course.name}</p>
                <p className="text-sm text-blue-700">Grade: {student.currentGrade}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-lg font-bold text-emerald-900">{student.currentSemester}</p>
                  <p className="text-xs text-emerald-700">Current Semester</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <p className="text-lg font-bold text-purple-900">{student.cgpa}</p>
                  <p className="text-xs text-purple-700">Overall CGPA</p>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-gray-50">
                <p className="text-sm"><span className="font-medium">Admission Date:</span></p>
                <p className="text-sm text-gray-700">{new Date(student.admissionDate).toLocaleDateString()}</p>
              </div>
              
              <div className="p-3 rounded-lg bg-gray-50">
                <p className="text-sm"><span className="font-medium">Category:</span> {student.category}</p>
                <p className="text-sm"><span className="font-medium">Religion:</span> {student.religion}</p>
              </div>
              
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">Class Attendance</span>
                  <span className="text-lg font-bold text-green-900">{student.attendancePercentage}%</span>
                </div>
                <p className="text-xs text-green-700">{student.classesAttended}/{student.totalClasses} classes attended</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Marks Bar Chart */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Assignment & Exam Performance
          </CardTitle>
          <CardDescription>
            Individual scores for all assignments and examinations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assignmentMarks} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="assignment" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-semibold text-gray-900">{label}</p>
                          <p className="text-blue-600">
                            Score: {data.obtainedMarks}/{data.maxMarks} ({data.percentage}%)
                          </p>
                          <p className="text-gray-600 text-sm">Submitted: {data.submissionDate}</p>
                          <p className="text-green-600 text-sm">Feedback: {data.feedback}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar 
                  dataKey="percentage" 
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1E40AF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-lg font-bold text-green-900">{Math.max(...assignmentMarks.map(m => m.percentage))}%</p>
              <p className="text-sm text-green-700">Highest Score</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-lg font-bold text-blue-900">{overallPerformance.average}%</p>
              <p className="text-sm text-blue-700">Average Score</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-50 border border-purple-200">
              <p className="text-lg font-bold text-purple-900">{assignmentMarks.length}</p>
              <p className="text-sm text-purple-700">Total Assessments</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Progress Line Chart */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            Course Progress Timeline
          </CardTitle>
          <CardDescription>
            Weekly progress tracking across different metrics throughout the semester
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={courseProgress} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-semibold text-gray-900 mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }} className="text-sm">
                              {entry.name}: {entry.value}%
                            </p>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="completion" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="url(#completionGradient)"
                  name="Overall Progress"
                />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stackId="2"
                  stroke="#3B82F6" 
                  fill="url(#attendanceGradient)"
                  name="Attendance"
                />
                <Line 
                  type="monotone" 
                  dataKey="quiz" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  name="Quiz Performance"
                />
                <Line 
                  type="monotone" 
                  dataKey="assignment" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  name="Assignment Scores"
                />
                <defs>
                  <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-900">Progress</span>
              </div>
              <p className="text-lg font-bold text-green-900">
                {Math.round(courseProgress.reduce((sum, week) => sum + week.completion, 0) / courseProgress.length)}%
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-900">Attendance</span>
              </div>
              <p className="text-lg font-bold text-blue-900">
                {Math.round(courseProgress.reduce((sum, week) => sum + week.attendance, 0) / courseProgress.length)}%
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-50 border border-purple-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-purple-900">Quizzes</span>
              </div>
              <p className="text-lg font-bold text-purple-900">
                {Math.round(courseProgress.reduce((sum, week) => sum + week.quiz, 0) / courseProgress.length)}%
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-900">Assignments</span>
              </div>
              <p className="text-lg font-bold text-yellow-900">
                {Math.round(courseProgress.reduce((sum, week) => sum + week.assignment, 0) / courseProgress.length)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
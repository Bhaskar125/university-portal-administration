"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Search,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  UserPlus,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Filter
} from "lucide-react"

// Mock data for the course
const getCourseData = (courseId: string) => {
  const courses = {
    "cs401": {
      id: "cs401",
      name: "Advanced Computer Science",
      code: "CS401",
      semester: "Fall 2024",
      room: "Room 101A",
      schedule: "Mon, Wed, Fri - 9:00 AM",
      description: "Advanced topics in computer science including algorithms, data structures, and system design",
      totalStudents: 45,
      averageAttendance: 87.2,
      color: "bg-blue-500"
    },
    "cs301": {
      id: "cs301",
      name: "Data Structures & Algorithms",
      code: "CS301",
      semester: "Fall 2024",
      room: "Room 205B",
      schedule: "Tue, Thu - 2:00 PM",
      description: "Comprehensive study of data structures and algorithmic problem solving",
      totalStudents: 52,
      averageAttendance: 92.1,
      color: "bg-emerald-500"
    },
    "cs350": {
      id: "cs350",
      name: "Database Management",
      code: "CS350",
      semester: "Fall 2024",
      room: "Lab 301",
      schedule: "Mon, Wed - 11:00 AM",
      description: "Database design, implementation, and management systems",
      totalStudents: 38,
      averageAttendance: 89.5,
      color: "bg-purple-500"
    },
    "cs402": {
      id: "cs402",
      name: "Software Engineering",
      code: "CS402",
      semester: "Fall 2024",
      room: "Room 150",
      schedule: "Tue, Thu - 10:00 AM",
      description: "Software development methodologies, project management, and team collaboration",
      totalStudents: 41,
      averageAttendance: 84.7,
      color: "bg-orange-500"
    }
  }
  return courses[courseId as keyof typeof courses] || courses["cs401"]
}

// Mock student data with attendance
const getStudentsData = (courseId: string) => {
  const baseStudents = [
    {
      rollNumber: "21CS001",
      registrationNumber: "REG2021001",
      name: "Sarah Johnson",
      email: "sarah.johnson@university.edu",
      phone: "+1 (555) 0123",
      address: "123 Main St, City, State",
      attendancePercentage: 95.2,
      classesAttended: 20,
      totalClasses: 21,
      lastAttendance: "2024-01-15",
      status: "excellent"
    },
    {
      rollNumber: "21CS002",
      registrationNumber: "REG2021002",
      name: "Michael Chen",
      email: "michael.chen@university.edu",
      phone: "+1 (555) 0124",
      address: "456 Oak Ave, City, State",
      attendancePercentage: 88.1,
      classesAttended: 18,
      totalClasses: 21,
      lastAttendance: "2024-01-15",
      status: "good"
    },
    {
      rollNumber: "21CS003",
      registrationNumber: "REG2021003",
      name: "Emily Davis",
      email: "emily.davis@university.edu",
      phone: "+1 (555) 0125",
      address: "789 Pine Rd, City, State",
      attendancePercentage: 76.2,
      classesAttended: 16,
      totalClasses: 21,
      lastAttendance: "2024-01-12",
      status: "average"
    },
    {
      rollNumber: "21CS004",
      registrationNumber: "REG2021004",
      name: "James Wilson",
      email: "james.wilson@university.edu",
      phone: "+1 (555) 0126",
      address: "321 Elm St, City, State",
      attendancePercentage: 92.9,
      classesAttended: 19,
      totalClasses: 21,
      lastAttendance: "2024-01-15",
      status: "excellent"
    },
    {
      rollNumber: "21CS005",
      registrationNumber: "REG2021005",
      name: "Lisa Anderson",
      email: "lisa.anderson@university.edu",
      phone: "+1 (555) 0127",
      address: "654 Birch Ln, City, State",
      attendancePercentage: 71.4,
      classesAttended: 15,
      totalClasses: 21,
      lastAttendance: "2024-01-10",
      status: "poor"
    },
    {
      rollNumber: "21CS006",
      registrationNumber: "REG2021006",
      name: "David Brown",
      email: "david.brown@university.edu",
      phone: "+1 (555) 0128",
      address: "987 Cedar Dr, City, State",
      attendancePercentage: 90.5,
      classesAttended: 19,
      totalClasses: 21,
      lastAttendance: "2024-01-15",
      status: "excellent"
    },
    {
      rollNumber: "21CS007",
      registrationNumber: "REG2021007",
      name: "Maria Garcia",
      email: "maria.garcia@university.edu",
      phone: "+1 (555) 0129",
      address: "246 Maple St, City, State",
      attendancePercentage: 83.3,
      classesAttended: 17,
      totalClasses: 21,
      lastAttendance: "2024-01-14",
      status: "good"
    },
    {
      rollNumber: "21CS008",
      registrationNumber: "REG2021008",
      name: "Robert Taylor",
      email: "robert.taylor@university.edu",
      phone: "+1 (555) 0130",
      address: "135 Walnut Ave, City, State",
      attendancePercentage: 67.0,
      classesAttended: 14,
      totalClasses: 21,
      lastAttendance: "2024-01-08",
      status: "poor"
    }
  ]

  // Generate more students to reach the course capacity
  const courseData = getCourseData(courseId)
  const additionalStudents = []
  
  for (let i = 9; i <= courseData.totalStudents; i++) {
    const rollNumber = `21CS${i.toString().padStart(3, '0')}`
    const registrationNumber = `REG2021${i.toString().padStart(3, '0')}`
    const names = [
      "Alex Thompson", "Jessica Martinez", "Kevin Lee", "Amanda White", 
      "Daniel Harris", "Rachel Clark", "Christopher Lewis", "Stephanie Walker",
      "Matthew Hall", "Nicole Young", "Andrew King", "Megan Wright",
      "Joshua Lopez", "Samantha Hill", "Brandon Scott", "Ashley Green"
    ]
    
    const attendance = Math.floor(Math.random() * 40) + 60 // 60-100%
    const classesAttended = Math.floor((attendance / 100) * 21)
    
    let status = "poor"
    if (attendance >= 90) status = "excellent"
    else if (attendance >= 80) status = "good"
    else if (attendance >= 70) status = "average"
    
    additionalStudents.push({
      rollNumber,
      registrationNumber,
      name: names[(i - 9) % names.length],
      email: `${names[(i - 9) % names.length].toLowerCase().replace(' ', '.')}@university.edu`,
      phone: `+1 (555) ${(1000 + i).toString()}`,
      address: `${100 + i} Random St, City, State`,
      attendancePercentage: attendance,
      classesAttended,
      totalClasses: 21,
      lastAttendance: `2024-01-${Math.floor(Math.random() * 15) + 1}`,
      status
    })
  }
  
  return [...baseStudents, ...additionalStudents]
}

export default function CourseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  
  const [searchQuery, setSearchQuery] = useState("")
  const [attendanceFilter, setAttendanceFilter] = useState("all")
  
  const course = getCourseData(courseId)
  const students = getStudentsData(courseId)
  
  // Filter students based on search and attendance filter
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesFilter = attendanceFilter === "all" || student.status === attendanceFilter
      
      return matchesSearch && matchesFilter
    })
  }, [students, searchQuery, attendanceFilter])
  
  const attendanceStats = useMemo(() => {
    const excellent = students.filter(s => s.status === "excellent").length
    const good = students.filter(s => s.status === "good").length
    const average = students.filter(s => s.status === "average").length
    const poor = students.filter(s => s.status === "poor").length
    
    return { excellent, good, average, poor }
  }, [students])
  
  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case "excellent": return <CheckCircle className="w-4 h-4 text-green-500" />
      case "good": return <CheckCircle className="w-4 h-4 text-blue-500" />
      case "average": return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "poor": return <XCircle className="w-4 h-4 text-red-500" />
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }
  
  const getAttendanceBadge = (status: string) => {
    const variants = {
      excellent: "bg-green-100 text-green-800 border-green-200",
      good: "bg-blue-100 text-blue-800 border-blue-200",
      average: "bg-yellow-100 text-yellow-800 border-yellow-200",
      poor: "bg-red-100 text-red-800 border-red-200"
    }
    
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
            className="mt-1 hover:scale-105 transition-transform duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-12 h-12 ${course.color} rounded-lg flex items-center justify-center shadow-lg`}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-emerald-700 bg-clip-text text-transparent">
                  {course.name}
                </h1>
                <p className="text-lg text-gray-600">
                  {course.code} • {course.semester} • {course.room}
                </p>
              </div>
            </div>
            <p className="text-gray-600 max-w-2xl">{course.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <UserPlus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{course.totalStudents}</p>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{course.averageAttendance}%</p>
                <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{attendanceStats.excellent}</p>
                <p className="text-sm font-medium text-gray-600">Excellent (90%+)</p>
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
                <p className="text-2xl font-bold text-gray-900">{attendanceStats.poor}</p>
                <p className="text-sm font-medium text-gray-600">Poor (&lt;70%)</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Overview */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Attendance Overview
              </CardTitle>
              <CardDescription>Student attendance distribution</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-2xl font-bold text-green-700">{attendanceStats.excellent}</div>
              <div className="text-sm text-green-600">Excellent (90%+)</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{attendanceStats.good}</div>
              <div className="text-sm text-blue-600">Good (80-89%)</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">{attendanceStats.average}</div>
              <div className="text-sm text-yellow-600">Average (70-79%)</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="text-2xl font-bold text-red-700">{attendanceStats.poor}</div>
              <div className="text-sm text-red-600">Poor (&lt;70%)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Student List & Attendance
              </CardTitle>
              <CardDescription>
                Showing {filteredStudents.length} of {students.length} students
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select 
                  value={attendanceFilter} 
                  onChange={(e) => setAttendanceFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-40 border border-gray-200 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="all">All Students</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Student</TableHead>
                  <TableHead className="font-semibold">Roll Number</TableHead>
                  <TableHead className="font-semibold">Registration</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Attendance</TableHead>
                  <TableHead className="font-semibold">Classes</TableHead>
                  <TableHead className="font-semibold">Last Seen</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.rollNumber} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`/api/placeholder/40/40`} alt={student.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-sm font-semibold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{student.rollNumber}</TableCell>
                    <TableCell className="font-mono text-sm">{student.registrationNumber}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Phone className="w-3 h-3" />
                          {student.phone}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          {student.address.split(',')[0]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getAttendanceIcon(student.status)}
                        <span className="font-semibold text-gray-900">
                          {student.attendancePercentage.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{student.classesAttended}</span>
                        <span className="text-gray-500">/{student.totalClasses}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(student.lastAttendance).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`capitalize ${getAttendanceBadge(student.status)}`}
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
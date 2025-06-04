"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BookOpen, 
  Search, 
  Filter,
  Download,
  Calendar,
  Clock,
  GraduationCap,
  Eye,
  Edit,
  MoreHorizontal,
  Star,
  BookPlus
} from "lucide-react"
import Link from "next/link"

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Mock course data
  const courses = [
    {
      id: "CS101",
      name: "Introduction to Computer Science",
      description: "Fundamental concepts of computer science and programming",
      department: "Computer Science",
      departmentCode: "CS",
      instructor: "Dr. Sarah Johnson",
      credits: 3,
      semester: "Fall 2024",
      duration: "15 weeks",
      enrolledStudents: 45,
      maxCapacity: 50,
      status: "Active",
      startDate: "2024-09-01",
      endDate: "2024-12-15",
      schedule: "Mon, Wed, Fri 9:00-10:30 AM",
      prerequisites: "None",
      rating: 4.5
    },
    {
      id: "CS201",
      name: "Data Structures and Algorithms",
      description: "Advanced programming concepts, data structures, and algorithm analysis",
      department: "Computer Science",
      departmentCode: "CS",
      instructor: "Prof. Michael Chen",
      credits: 4,
      semester: "Fall 2024",
      duration: "15 weeks",
      enrolledStudents: 38,
      maxCapacity: 40,
      status: "Active",
      startDate: "2024-09-01",
      endDate: "2024-12-15",
      schedule: "Tue, Thu 2:00-4:00 PM",
      prerequisites: "CS101",
      rating: 4.7
    },
    {
      id: "EE101",
      name: "Circuit Analysis",
      description: "Basic principles of electrical circuits and analysis techniques",
      department: "Electrical Engineering",
      departmentCode: "EE",
      instructor: "Dr. Emily Davis",
      credits: 3,
      semester: "Fall 2024",
      duration: "15 weeks",
      enrolledStudents: 32,
      maxCapacity: 35,
      status: "Active",
      startDate: "2024-09-01",
      endDate: "2024-12-15",
      schedule: "Mon, Wed 1:00-2:30 PM",
      prerequisites: "Physics I, Mathematics I",
      rating: 4.3
    },
    {
      id: "ME101",
      name: "Engineering Mechanics",
      description: "Fundamentals of statics and dynamics in mechanical systems",
      department: "Mechanical Engineering",
      departmentCode: "ME",
      instructor: "Prof. Robert Wilson",
      credits: 3,
      semester: "Fall 2024",
      duration: "15 weeks",
      enrolledStudents: 28,
      maxCapacity: 30,
      status: "Active",
      startDate: "2024-09-01",
      endDate: "2024-12-15",
      schedule: "Tue, Thu 10:00-11:30 AM",
      prerequisites: "Mathematics I, Physics I",
      rating: 4.2
    },
    {
      id: "MATH201",
      name: "Calculus II",
      description: "Advanced calculus including integration techniques and applications",
      department: "Mathematics",
      departmentCode: "MATH",
      instructor: "Dr. Lisa Anderson",
      credits: 4,
      semester: "Fall 2024",
      duration: "15 weeks",
      enrolledStudents: 22,
      maxCapacity: 25,
      status: "Active",
      startDate: "2024-09-01",
      endDate: "2024-12-15",
      schedule: "Mon, Wed, Fri 11:00-12:00 PM",
      prerequisites: "MATH101",
      rating: 4.6
    },
    {
      id: "CS301",
      name: "Database Systems",
      description: "Design and implementation of database management systems",
      department: "Computer Science",
      departmentCode: "CS",
      instructor: "Dr. James Brown",
      credits: 3,
      semester: "Spring 2025",
      duration: "15 weeks",
      enrolledStudents: 0,
      maxCapacity: 35,
      status: "Scheduled",
      startDate: "2025-01-15",
      endDate: "2025-05-15",
      schedule: "Mon, Wed 3:00-4:30 PM",
      prerequisites: "CS201",
      rating: 0
    }
  ]

  const departments = [
    { name: "All Departments", code: "all" },
    { name: "Computer Science", code: "CS" },
    { name: "Electrical Engineering", code: "EE" },
    { name: "Mechanical Engineering", code: "ME" },
    { name: "Mathematics", code: "MATH" }
  ]

  const semesters = [
    { name: "All Semesters", code: "all" },
    { name: "Fall 2024", code: "Fall 2024" },
    { name: "Spring 2025", code: "Spring 2025" },
    { name: "Summer 2025", code: "Summer 2025" }
  ]

  const statuses = [
    { name: "All Status", code: "all" },
    { name: "Active", code: "Active" },
    { name: "Scheduled", code: "Scheduled" },
    { name: "Completed", code: "Completed" },
    { name: "Cancelled", code: "Cancelled" }
  ]

  // Filter courses based on search and selections
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === "all" || course.departmentCode === selectedDepartment
    const matchesSemester = selectedSemester === "all" || course.semester === selectedSemester
    const matchesStatus = selectedStatus === "all" || course.status === selectedStatus
    
    return matchesSearch && matchesDepartment && matchesSemester && matchesStatus
  })

  // Group courses by department
  const coursesByDepartment = filteredCourses.reduce((acc, course) => {
    if (!acc[course.departmentCode]) {
      acc[course.departmentCode] = []
    }
    acc[course.departmentCode].push(course)
    return acc
  }, {} as Record<string, typeof courses>)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCapacityColor = (enrolled: number, max: number) => {
    const percentage = (enrolled / max) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  const formatRating = (rating: number) => {
    if (rating === 0) return 'No rating'
    return `${rating.toFixed(1)}/5.0`
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            Course Management
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage courses across all departments and semesters.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
            <Download className="w-4 h-4" />
            Export List
          </Button>
          
          <Link href="/dashboard/admin/courses/new">
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <BookPlus className="w-4 h-4" />
              Add Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
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
            
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester.code} value={semester.code}>
                    {semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.code} value={status.code}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <span>Showing {filteredCourses.length} of {courses.length} courses</span>
            {(selectedDepartment !== "all" || selectedSemester !== "all" || selectedStatus !== "all" || searchTerm) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchTerm("")
                  setSelectedDepartment("all")
                  setSelectedSemester("all")
                  setSelectedStatus("all")
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Courses List by Department */}
      {Object.keys(coursesByDepartment).length === 0 ? (
        <Card className="shadow-lg border-0">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add new courses.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(coursesByDepartment).map(([deptCode, deptCourses]) => {
            const department = departments.find(d => d.code === deptCode)
            return (
              <Card key={deptCode} className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-md">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {department?.name || deptCode}
                        </CardTitle>
                        <CardDescription>
                          {deptCourses.length} course{deptCourses.length !== 1 ? 's' : ''}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {deptCode}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {deptCourses.map((course) => (
                      <Card key={course.id} className="group hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-lg text-gray-900">{course.name}</h3>
                                <Badge variant="outline" className={`text-xs ${getStatusColor(course.status)}`}>
                                  {course.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{course.id}</p>
                              <p className="text-sm text-gray-700 mb-3 line-clamp-2">{course.description}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Link href={`/dashboard/admin/courses/${course.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-gray-600">
                                <GraduationCap className="w-4 h-4" />
                                <span>{course.instructor}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <BookOpen className="w-4 h-4" />
                                <span>{course.credits} Credits</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{course.semester}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>{course.duration}</span>
                              </div>
                            </div>

                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Schedule:</span> {course.schedule}
                            </div>

                            {course.prerequisites && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Prerequisites:</span> {course.prerequisites}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                              <div className="text-sm">
                                <span className="text-gray-600">Enrollment: </span>
                                <span className={`font-semibold ${getCapacityColor(course.enrolledStudents, course.maxCapacity)}`}>
                                  {course.enrolledStudents}/{course.maxCapacity}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-gray-600">{formatRating(course.rating)}</span>
                              </div>
                            </div>

                            <Link href={`/dashboard/admin/courses/${course.id}`}>
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
} 
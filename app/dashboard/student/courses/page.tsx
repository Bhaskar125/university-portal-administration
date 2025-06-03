"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Calendar,
  Clock,
  Users,
  Award,
  ChevronRight,
  ArrowLeft,
  Star,
  Target,
  Activity,
  BarChart3,
  FileText,
  CheckCircle
} from "lucide-react"

// Mock data for all student courses
const getStudentCourses = () => {
  return {
    currentSemester: "Fall 2024",
    totalCredits: 16,
    gpa: 3.84,
    courses: [
      {
        id: "1",
        name: "Advanced Computer Science",
        code: "CS401",
        instructor: "Prof. Smith",
        schedule: "Mon, Wed, Fri - 9:00 AM",
        room: "Room 101A",
        credits: 4,
        currentGrade: "A-",
        percentage: 87.5,
        progress: 78,
        attendance: 95.2,
        color: "bg-blue-500",
        status: "active",
        totalStudents: 45,
        classRank: 3,
        assignments: {
          total: 8,
          completed: 6,
          pending: 2
        },
        nextClass: "Mon 9:00 AM",
        description: "Advanced topics in computer science including algorithms, data structures, and system design"
      },
      {
        id: "2",
        name: "Data Structures & Algorithms",
        code: "CS301",
        instructor: "Prof. Johnson",
        schedule: "Tue, Thu - 2:00 PM",
        room: "Room 205B",
        credits: 4,
        currentGrade: "A",
        percentage: 92.1,
        progress: 85,
        attendance: 100,
        color: "bg-emerald-500",
        status: "active",
        totalStudents: 52,
        classRank: 1,
        assignments: {
          total: 7,
          completed: 5,
          pending: 2
        },
        nextClass: "Tue 2:00 PM",
        description: "Comprehensive study of data structures and algorithmic problem solving"
      },
      {
        id: "3",
        name: "Database Management",
        code: "CS350",
        instructor: "Prof. Davis",
        schedule: "Mon, Wed - 11:00 AM",
        room: "Lab 301",
        credits: 3,
        currentGrade: "B+",
        percentage: 84.2,
        progress: 92,
        attendance: 89.5,
        color: "bg-purple-500",
        status: "active",
        totalStudents: 38,
        classRank: 8,
        assignments: {
          total: 6,
          completed: 4,
          pending: 2
        },
        nextClass: "Mon 11:00 AM",
        description: "Database design, implementation, and management systems"
      },
      {
        id: "4",
        name: "Software Engineering",
        code: "CS402",
        instructor: "Prof. Wilson",
        schedule: "Tue, Thu - 10:00 AM",
        room: "Room 150",
        credits: 4,
        currentGrade: "A-",
        percentage: 89.3,
        progress: 65,
        attendance: 93.8,
        color: "bg-orange-500",
        status: "active",
        totalStudents: 41,
        classRank: 5,
        assignments: {
          total: 9,
          completed: 7,
          pending: 2
        },
        nextClass: "Thu 10:00 AM",
        description: "Software development methodologies, project management, and team collaboration"
      },
      {
        id: "5",
        name: "Computer Networks",
        code: "CS450",
        instructor: "Prof. Lee",
        schedule: "Fri - 1:00 PM",
        room: "Lab 205",
        credits: 1,
        currentGrade: "A",
        percentage: 95.0,
        progress: 90,
        attendance: 97.5,
        color: "bg-cyan-500",
        status: "active",
        totalStudents: 30,
        classRank: 2,
        assignments: {
          total: 4,
          completed: 4,
          pending: 0
        },
        nextClass: "Fri 1:00 PM",
        description: "Network protocols, architecture, and security fundamentals"
      }
    ]
  }
}

export default function StudentCoursesPage() {
  const router = useRouter()
  const coursesData = getStudentCourses()
  
  const getGradeColor = (percentage: number) => {
    if (percentage >= 95) return "text-green-600 bg-green-50 border-green-200"
    if (percentage >= 90) return "text-blue-600 bg-blue-50 border-blue-200"
    if (percentage >= 85) return "text-purple-600 bg-purple-50 border-purple-200"
    if (percentage >= 80) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const totalAssignments = coursesData.courses.reduce((sum, course) => sum + course.assignments.total, 0)
  const completedAssignments = coursesData.courses.reduce((sum, course) => sum + course.assignments.completed, 0)
  const pendingAssignments = coursesData.courses.reduce((sum, course) => sum + course.assignments.pending, 0)
  const averageAttendance = coursesData.courses.reduce((sum, course) => sum + course.attendance, 0) / coursesData.courses.length

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
            className="hover:scale-105 transition-transform duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
              My Courses
            </h1>
            <p className="text-gray-600 mt-1">{coursesData.currentSemester} • {coursesData.courses.length} enrolled courses</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {coursesData.totalCredits} Credits
          </Badge>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            GPA: {coursesData.gpa}
          </Badge>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{coursesData.courses.length}</p>
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{averageAttendance.toFixed(1)}%</p>
                <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedAssignments}/{totalAssignments}</p>
                <p className="text-sm font-medium text-gray-600">Assignments Done</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingAssignments}</p>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {coursesData.courses.map((course) => (
          <Card 
            key={course.id} 
            className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
            onClick={() => router.push(`/dashboard/student/courses/${course.id}`)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${course.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {course.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {course.code} • {course.credits} Credits
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-800">
                  <span className="text-xs font-medium">View Details</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Grade and Performance */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Current Grade</span>
                </div>
                <Badge className={`${getGradeColor(course.percentage)} border-0 font-semibold`}>
                  {course.currentGrade} ({course.percentage}%)
                </Badge>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Course Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Course Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-3 h-3" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span>{course.room}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-3 h-3" />
                    <span>Rank #{course.classRank}/{course.totalStudents}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>{course.attendance}% Attendance</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-3 h-3" />
                    <span>{course.assignments.pending} Pending</span>
                  </div>
                </div>
              </div>

              {/* Assignments Summary */}
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Assignments</span>
                  <Badge variant="outline" className="text-xs">
                    {course.assignments.completed}/{course.assignments.total}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(course.assignments.completed / course.assignments.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Next Class */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Next Class</span>
                </div>
                <span className="text-sm text-blue-600">{course.nextClass}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common course-related tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-200"
              onClick={() => router.push('/dashboard/student/assignments')}
            >
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="text-sm">View All Assignments</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 hover:bg-emerald-50 hover:border-emerald-200"
              onClick={() => router.push('/dashboard/student/grades')}
            >
              <Award className="w-6 h-6 text-emerald-600" />
              <span className="text-sm">Check Grades</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-200"
              onClick={() => router.push('/dashboard/student/materials')}
            >
              <BookOpen className="w-6 h-6 text-purple-600" />
              <span className="text-sm">Course Materials</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 hover:bg-orange-50 hover:border-orange-200"
              onClick={() => router.push('/dashboard/student/progress')}
            >
              <BarChart3 className="w-6 h-6 text-orange-600" />
              <span className="text-sm">Study Progress</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="border-0 bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-500 text-white shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-emerald-600/20"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Outstanding Academic Performance! 🎯</h3>
                <p className="text-white/90">
                  You are maintaining a {coursesData.gpa} GPA across {coursesData.courses.length} courses with {averageAttendance.toFixed(1)}% average attendance.
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
              onClick={() => router.push('/dashboard/student/progress')}
            >
              View Detailed Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
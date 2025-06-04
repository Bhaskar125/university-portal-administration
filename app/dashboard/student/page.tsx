"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Calendar,
  Clock,
  Bell,
  Plus,
  ArrowRight,
  ChevronRight,
  Award,
  Zap,
  Activity,
  CheckCircle,
  FileText,
  BarChart3,
  Target,
  BookmarkCheck
} from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  const router = useRouter()

  const stats = [
    {
      title: "Enrolled Courses",
      value: "6",
      change: "+1 new",
      trend: "up",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      title: "Current GPA",
      value: "3.8",
      change: "+0.2",
      trend: "up",
      icon: Award,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      title: "Assignments Due",
      value: "5",
      change: "2 today",
      trend: "neutral",
      icon: FileText,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    },
    {
      title: "Completion Rate",
      value: "92%",
      change: "+5%",
      trend: "up",
      icon: Target,
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50"
    }
  ]

  const enrolledCourses = [
    {
      id: 1,
      name: "Advanced Computer Science",
      code: "CS401",
      instructor: "Prof. Smith",
      schedule: "Mon, Wed, Fri - 9:00 AM",
      grade: "A-",
      progress: 78,
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Data Structures & Algorithms",
      code: "CS301",
      instructor: "Prof. Johnson",
      schedule: "Tue, Thu - 2:00 PM",
      grade: "A",
      progress: 85,
      color: "bg-emerald-500"
    },
    {
      id: 3,
      name: "Database Management",
      code: "CS350",
      instructor: "Prof. Davis",
      schedule: "Mon, Wed - 11:00 AM",
      grade: "B+",
      progress: 92,
      color: "bg-purple-500"
    },
    {
      id: 4,
      name: "Software Engineering",
      code: "CS402",
      instructor: "Prof. Wilson",
      schedule: "Tue, Thu - 10:00 AM",
      grade: "A-",
      progress: 65,
      color: "bg-orange-500"
    }
  ]

  const recentActivities = [
    {
      id: 1,
      action: "Assignment graded",
      course: "CS401 - Advanced Computer Science",
      detail: "Midterm Project - Grade: A-",
      time: "2 hours ago",
      type: "grade",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 2,
      action: "New announcement",
      course: "CS301 - Data Structures",
      detail: "Office hours changed to 3-5 PM",
      time: "1 day ago",
      type: "announcement",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 3,
      action: "Assignment submitted",
      course: "CS350 - Database Management",
      detail: "Lab 5 - SQL Queries",
      time: "2 days ago",
      type: "submission",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 4,
      action: "Quiz completed",
      course: "CS402 - Software Engineering",
      detail: "Chapter 7 Quiz - Score: 85%",
      time: "3 days ago",
      type: "quiz",
      avatar: "/api/placeholder/32/32"
    }
  ]

  const upcomingAssignments = [
    {
      id: 1,
      title: "Final Project Proposal",
      course: "CS401",
      due: "Today",
      time: "11:59 PM",
      priority: "high",
      color: "bg-red-500"
    },
    {
      id: 2,
      title: "Algorithm Analysis Report",
      course: "CS301",
      due: "Tomorrow",
      time: "11:59 PM",
      priority: "high",
      color: "bg-red-500"
    },
    {
      id: 3,
      title: "Database Design Lab",
      course: "CS350",
      due: "Dec 28",
      time: "2:00 PM",
      priority: "medium",
      color: "bg-yellow-500"
    },
    {
      id: 4,
      title: "Code Review Assignment",
      course: "CS402",
      due: "Dec 30",
      time: "11:59 PM",
      priority: "low",
      color: "bg-green-500"
    }
  ]

  const quickActions = [
    {
      title: "Submit Assignment",
      description: "Upload your coursework",
      icon: FileText,
      href: "/dashboard/student/assignments",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "View Grades",
      description: "Check your performance",
      icon: Award,
      href: "/dashboard/student/grades",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Course Materials",
      description: "Access study resources",
      icon: BookOpen,
      href: "/dashboard/student/materials",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Study Progress",
      description: "Track your learning",
      icon: BarChart3,
      href: "/dashboard/student/progress",
      color: "from-orange-500 to-orange-600"
    }
  ]

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Welcome back, Alex! Keep up the great work in your studies.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/student/notifications">
            <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
              <Bell className="w-4 h-4" />
              Notifications
              <Badge variant="secondary" className="ml-1">3</Badge>
            </Button>
          </Link>
          
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <Plus className="w-4 h-4" />
            Quick Submit
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 shadow-md overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-30`}></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-white/90 text-green-700 font-medium border-green-200">
                    {stat.change}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                </div>
                
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  <span>vs last semester</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common student tasks and tools</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 hover:bg-blue-50">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon
                  return (
                    <div
                      key={index}
                      className="group p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        router.push(action.href)
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Assignments */}
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="w-5 h-5 text-blue-500" />
              Due Soon
            </CardTitle>
            <CardDescription>Upcoming assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div 
                key={assignment.id} 
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={() => router.push(`/dashboard/student/courses/${assignment.course.toLowerCase().replace('cs', '')}`)}
              >
                <div className={`w-3 h-3 rounded-full ${assignment.color} group-hover:scale-125 transition-transform duration-200`}></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{assignment.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{assignment.due} at {assignment.time}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs bg-white border-gray-200">
                  {assignment.course}
                </Badge>
              </div>
            ))}
            
            <Button 
              variant="ghost" 
              className="w-full justify-center gap-2 mt-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              onClick={() => {
                // Navigate to the first course's assignments
                router.push(`/dashboard/student/courses/1?tab=assignments`)
              }}
            >
              View All Assignments
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* My Courses */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                My Courses
              </CardTitle>
              <CardDescription>Courses you&apos;re currently enrolled in</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 hover:bg-emerald-50">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourses.map((course) => (
              <div 
                key={course.id} 
                className="group p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => router.push(`/dashboard/student/courses/${course.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${course.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        {course.name}
                      </h3>
                      <p className="text-sm text-gray-600">{course.code}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="text-xs bg-white border-gray-200">
                      Grade: {course.grade}
                    </Badge>
                    <div className="flex items-center gap-1 text-emerald-600 group-hover:text-emerald-800">
                      <span className="text-xs font-medium">View Details</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <GraduationCap className="w-3 h-3" />
                    <span>{course.instructor}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-medium text-gray-700">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="w-5 h-5 text-purple-500" />
                Recent Activities
              </CardTitle>
              <CardDescription>Your latest academic updates</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 hover:bg-purple-50">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  {activity.type === 'grade' && <Award className="w-5 h-5 text-white" />}
                  {activity.type === 'announcement' && <Bell className="w-5 h-5 text-white" />}
                  {activity.type === 'submission' && <CheckCircle className="w-5 h-5 text-white" />}
                  {activity.type === 'quiz' && <BookmarkCheck className="w-5 h-5 text-white" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{activity.course}</p>
                  <p className="text-xs text-blue-600 truncate">{activity.detail}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{activity.time}</span>
                  </div>
                </div>
                
                <Badge variant="outline" className="text-xs capitalize bg-white border-gray-200">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Banner */}
      <Card className="border-0 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 text-white shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Excellent Progress! 🎯</h3>
                <p className="text-white/90">You&apos;re maintaining a 3.8 GPA this semester. Keep it up!</p>
              </div>
            </div>
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
              View Detailed Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
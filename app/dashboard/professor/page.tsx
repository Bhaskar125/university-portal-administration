"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BookOpen, 
  Users, 
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
  BarChart3
} from "lucide-react"

export default function ProfessorDashboard() {
  const stats = [
    {
      title: "My Courses",
      value: "8",
      change: "+2 new",
      trend: "up",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      title: "Total Students",
      value: "247",
      change: "+15",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      title: "Pending Grades",
      value: "23",
      change: "-5",
      trend: "down",
      icon: Award,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    },
    {
      title: "Avg Performance",
      value: "87.4%",
      change: "+3.2%",
      trend: "up",
      icon: TrendingUp,
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50"
    }
  ]

  const myCourses = [
    {
      id: 1,
      name: "Advanced Computer Science",
      code: "CS401",
      students: 45,
      schedule: "Mon, Wed, Fri - 9:00 AM",
      progress: 78,
      status: "active",
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Data Structures & Algorithms",
      code: "CS301",
      students: 52,
      schedule: "Tue, Thu - 2:00 PM",
      progress: 85,
      status: "active",
      color: "bg-emerald-500"
    },
    {
      id: 3,
      name: "Database Management",
      code: "CS350",
      students: 38,
      schedule: "Mon, Wed - 11:00 AM",
      progress: 92,
      status: "active",
      color: "bg-purple-500"
    },
    {
      id: 4,
      name: "Software Engineering",
      code: "CS402",
      students: 41,
      schedule: "Tue, Thu - 10:00 AM",
      progress: 65,
      status: "active",
      color: "bg-orange-500"
    }
  ]

  const recentActivities = [
    {
      id: 1,
      action: "Assignment submitted",
      course: "CS401 - Advanced Computer Science",
      student: "Sarah Johnson",
      time: "5 minutes ago",
      type: "submission",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 2,
      action: "Grade updated",
      course: "CS301 - Data Structures",
      student: "Michael Chen",
      time: "1 hour ago",
      type: "grade",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 3,
      action: "New question posted",
      course: "CS350 - Database Management",
      student: "Emily Davis",
      time: "2 hours ago",
      type: "question",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 4,
      action: "Attendance marked",
      course: "CS402 - Software Engineering",
      student: "Class Session",
      time: "3 hours ago",
      type: "attendance",
      avatar: "/api/placeholder/32/32"
    }
  ]

  const upcomingTasks = [
    {
      id: 1,
      title: "Grade Midterm Exams",
      course: "CS401",
      due: "Today",
      time: "5:00 PM",
      priority: "high",
      color: "bg-red-500"
    },
    {
      id: 2,
      title: "Prepare Lecture Materials",
      course: "CS301",
      due: "Tomorrow",
      time: "10:00 AM",
      priority: "medium",
      color: "bg-yellow-500"
    },
    {
      id: 3,
      title: "Student Office Hours",
      course: "General",
      due: "Today",
      time: "3:00 PM",
      priority: "medium",
      color: "bg-blue-500"
    }
  ]

  const quickActions = [
    {
      title: "Create Assignment",
      description: "Design new coursework",
      icon: FileText,
      href: "/assignments/new",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Grade Submissions",
      description: "Review student work",
      icon: Award,
      href: "/grading",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Take Attendance",
      description: "Mark student attendance",
      icon: CheckCircle,
      href: "/attendance",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Course Analytics",
      description: "View performance data",
      icon: BarChart3,
      href: "/analytics",
      color: "from-orange-500 to-orange-600"
    }
  ]

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-700 to-blue-700 bg-clip-text text-transparent">
            Professor Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Welcome back, Prof. Smith! Manage your courses and track student progress.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
            <Bell className="w-4 h-4" />
            Notifications
            <Badge variant="secondary" className="ml-1">5</Badge>
          </Button>
          
          <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <Plus className="w-4 h-4" />
            New Content
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
                  <CardDescription>Common professor tasks and tools</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 hover:bg-emerald-50">
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
                      className="group p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        alert(`${action.title} feature coming soon!`)
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                <div className={`w-3 h-3 rounded-full ${task.color} group-hover:scale-125 transition-transform duration-200`}></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{task.due} at {task.time}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs bg-white border-gray-200">
                  {task.course}
                </Badge>
              </div>
            ))}
            
            <Button variant="ghost" className="w-full justify-center gap-2 mt-4 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50">
              View Schedule
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
                <BookOpen className="w-5 h-5 text-blue-500" />
                My Courses
              </CardTitle>
              <CardDescription>Courses you&apos;re currently teaching</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 hover:bg-blue-50">
              Manage All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCourses.map((course) => (
              <div key={course.id} className="group p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${course.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {course.name}
                      </h3>
                      <p className="text-sm text-gray-600">{course.code}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-white border-gray-200">
                    {course.students} students
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{course.schedule}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-medium text-gray-700">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
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
              <CardDescription>Latest updates from your courses</CardDescription>
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
                <Avatar className="w-10 h-10 ring-2 ring-white shadow-md group-hover:scale-110 transition-transform duration-200">
                  <AvatarImage src={activity.avatar} alt={activity.student} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-500 text-white font-semibold">
                    {activity.student.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="text-emerald-600">{activity.student}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{activity.course}</p>
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
    </div>
  )
} 
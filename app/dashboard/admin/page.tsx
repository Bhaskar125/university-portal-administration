"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Bell,
  Plus,
  ArrowRight,
  Zap,
  Activity,
  Building,
  UserPlus,
  BookPlus,
  Settings,
  BarChart3,
  Eye,
  Cog,
  Calculator
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const overallStats = [
    {
      title: "Total Students",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      title: "Active Courses",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      title: "Departments",
      value: "12",
      change: "+2",
      trend: "up",
      icon: Building,
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50"
    },
    {
      title: "Faculty Members",
      value: "189",
      change: "+5%",
      trend: "up",
      icon: GraduationCap,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    }
  ]

  const quickActions = [
    {
      title: "Add New Student",
      description: "Register a new student",
      icon: UserPlus,
      href: "/dashboard/admin/students/new",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Create Course",
      description: "Set up a new course",
      icon: BookPlus,
      href: "/dashboard/admin/courses/new",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Manage Departments",
      description: "Configure departments",
      icon: Building,
      href: "/dashboard/admin/departments",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "System Settings",
      description: "Configure system",
      icon: Settings,
      href: "/dashboard/admin/settings",
      color: "from-orange-500 to-orange-600"
    }
  ]

  const recentActivities = [
    {
      id: 1,
      action: "New student enrolled in CS Department",
      user: "Alice Johnson",
      time: "2 minutes ago",
      type: "enrollment",
      department: "CS"
    },
    {
      id: 2,
      action: "Course CS301 created",
      user: "Dr. Sarah Johnson",
      time: "15 minutes ago",
      type: "course",
      department: "CS"
    },
    {
      id: 3,
      action: "Batch 2024-EE created",
      user: "Admin",
      time: "1 hour ago",
      type: "batch",
      department: "EE"
    },
    {
      id: 4,
      action: "Department head updated for Mathematics",
      user: "Admin",
      time: "2 hours ago",
      type: "department",
      department: "MATH"
    }
  ]

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            Administrator Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage students, courses, departments, and institutional operations.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin/notifications">
            <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
              <Bell className="w-4 h-4" />
              Notifications
              <Badge variant="secondary" className="ml-1">5</Badge>
            </Button>
          </Link>
          
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <Plus className="w-4 h-4" />
            Quick Action
          </Button>
        </div>
      </div>

      {/* Overall Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overallStats.map((stat, index) => {
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
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-white to-blue-50/30">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>Frequently used administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon
              return (
                <Link key={index} href={action.href}>
                  <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-200 hover:border-blue-300">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-md group-hover:scale-110 transition-transform duration-300 mb-3`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                        <ArrowRight className="w-4 h-4 text-gray-400 mt-2 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Department Overview */}
      <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-600" />
              Department Overview
            </CardTitle>
            <Link href="/dashboard/admin/departments">
              <Button variant="outline" size="sm" className="gap-2 hover:scale-105 transition-transform duration-200">
                <Eye className="w-4 h-4" />
                View All
              </Button>
            </Link>
          </div>
          <CardDescription>Academic departments and programs</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/admin/departments/cs" className="group">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 hover:border-blue-300 transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">CS</Badge>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">Computer Science</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">324 students</span>
                  <span className="text-gray-600">12 courses</span>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/admin/departments/ee" className="group">
              <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 hover:border-yellow-300 transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">EE</Badge>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-yellow-700 transition-colors">Electrical Engineering</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">256 students</span>
                  <span className="text-gray-600">10 courses</span>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/admin/departments/me" className="group">
              <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:border-green-300 transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 group-hover:scale-110 transition-transform duration-300">
                    <Cog className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">ME</Badge>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">Mechanical Engineering</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">289 students</span>
                  <span className="text-gray-600">11 courses</span>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/admin/departments/math" className="group">
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 hover:border-purple-300 transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 group-hover:scale-110 transition-transform duration-300">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">MATH</Badge>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">Mathematics</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">145 students</span>
                  <span className="text-gray-600">8 courses</span>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest administrative actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-600">by {activity.user}</p>
                      <Badge variant="outline" className="text-xs">{activity.department}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Key institutional performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">Student Satisfaction</p>
                  <p className="text-xs text-gray-600">Overall rating</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">4.8</p>
                  <p className="text-xs text-green-600">+0.3</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">Course Completion</p>
                  <p className="text-xs text-gray-600">Success rate</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">94.2%</p>
                  <p className="text-xs text-blue-600">+2.1%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">Faculty Rating</p>
                  <p className="text-xs text-gray-600">Average score</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">4.6</p>
                  <p className="text-xs text-purple-600">+0.2</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
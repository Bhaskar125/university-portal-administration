"use client"

import { useState, useEffect } from "react"
import { RouteGuard } from "@/app/components/auth/route-guard"
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
  BarChart3,
  Eye,
  Cog,
  Calculator,
  Database
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [facultyCount, setFacultyCount] = useState(0)
  const [studentsCount, setStudentsCount] = useState(0)

  // Fetch real-time counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch professors count
        const professorsResponse = await fetch('/api/professors')
        if (professorsResponse.ok) {
          const professorsData = await professorsResponse.json()
          setFacultyCount(professorsData.professors?.length || 0)
        }

        // Fetch students count
        const studentsResponse = await fetch('/api/students')
        if (studentsResponse.ok) {
          const studentsData = await studentsResponse.json()
          setStudentsCount(studentsData.students?.length || 0)
        }
      } catch (error) {
        console.error('Error fetching counts:', error)
      }
    }

    fetchCounts()
  }, [])

  const overallStats = [
    {
      title: "Total Students",
      value: studentsCount.toString(),
      change: studentsCount > 0 ? "Active" : "New system",
      trend: studentsCount > 0 ? "up" : "neutral",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      title: "Active Courses",
      value: "0",
      change: "Ready to add",
      trend: "neutral",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      title: "Departments",
      value: "4",
      change: "Configured",
      trend: "up",
      icon: Building,
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50"
    },
    {
      title: "Faculty Members",
      value: facultyCount.toString(),
      change: facultyCount > 0 ? "Active" : "Setup needed",
      trend: facultyCount > 0 ? "up" : "neutral",
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
      title: "Add New Professor",
      description: "Register a new professor",
      icon: GraduationCap,
      href: "/dashboard/admin/professors/new",
      color: "from-purple-500 to-purple-600"
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
      color: "from-orange-500 to-orange-600"
    }
  ]

  return (
    <RouteGuard allowedRoles={['admin']}>
      <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            Administrator Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Welcome to your new university portal. Ready to get started?
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin/notifications">
            <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
              <Bell className="w-4 h-4" />
              Notifications
              <Badge variant="secondary" className="ml-1">0</Badge>
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
                  <Badge variant="secondary" className="bg-white/90 text-gray-600 font-medium border-gray-200">
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
          <CardDescription>Get started by adding your first students and courses</CardDescription>
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
          <CardDescription>Academic departments ready for student enrollment</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/admin/students?department=cs" className="group">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 hover:border-blue-300 transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">CS</Badge>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">Computer Science</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">0 students</span>
                  <span className="text-gray-600">0 courses</span>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/admin/students?department=ee" className="group">
              <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 hover:border-yellow-300 transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">EE</Badge>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-yellow-700 transition-colors">Electrical Engineering</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">0 students</span>
                  <span className="text-gray-600">0 courses</span>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/admin/students?department=me" className="group">
              <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:border-green-300 transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 group-hover:scale-110 transition-transform duration-300">
                    <Cog className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">ME</Badge>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">Mechanical Engineering</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">0 students</span>
                  <span className="text-gray-600">0 courses</span>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/admin/students?department=math" className="group">
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 hover:border-purple-300 transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 group-hover:scale-110 transition-transform duration-300">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">MATH</Badge>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">Mathematics</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">0 students</span>
                  <span className="text-gray-600">0 courses</span>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities & Setup Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Recent Activities
            </CardTitle>
            <CardDescription>System activities will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Yet</h3>
              <p className="text-gray-500 text-sm mb-4">
                Start by adding students, courses, or faculty members to see activities here.
              </p>
              <Button asChild>
                <Link href="/dashboard/admin/students/new">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add First Student
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Setup Status */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              System Setup
            </CardTitle>
            <CardDescription>Complete these steps to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">Departments</p>
                  <p className="text-xs text-gray-600">Basic structure</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">✓</p>
                  <p className="text-xs text-green-600">Complete</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">Add Students</p>
                  <p className="text-xs text-gray-600">Start enrollment</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-xs text-blue-600">Pending</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">Create Courses</p>
                  <p className="text-xs text-gray-600">Setup curriculum</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">0</p>
                  <p className="text-xs text-orange-600">Pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Banner */}
      <Card className="border-0 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 text-white shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Welcome to Your University Portal! 🎓</h3>
                <p className="text-white/90">Your administration system is ready. Start by adding your first students and courses.</p>
              </div>
            </div>
            <Button asChild variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
              <Link href="/dashboard/admin/students/new">
                Get Started
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </RouteGuard>
  )
} 
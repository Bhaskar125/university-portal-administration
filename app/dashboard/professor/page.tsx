"use client"

import { useState, useEffect } from "react"
import { RouteGuard } from "@/app/components/auth/route-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Calendar,
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
  Database,
  BookPlus,
  UserCheck
} from "lucide-react"
import Link from "next/link"

interface Course {
  instructor: string
  [key: string]: unknown
}

export default function ProfessorDashboard() {
  const [professorsCoursesCount, setProfessorsCoursesCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch professor's courses
  useEffect(() => {
    const fetchProfessorCourses = async () => {
      try {
        // TODO: Get actual professor ID from authentication context
        // For now, using Tom Parker's professor ID as example
        const response = await fetch('/api/courses')
        if (response.ok) {
          const data = await response.json()
          // Filter courses assigned to current professor
          // This is a placeholder - in real implementation, filter by logged-in professor's ID
          const professorCourses = data.courses?.filter((course: Course) => course.instructor !== 'No instructor assigned') || []
          setProfessorsCoursesCount(professorCourses.length)
        }
      } catch (error) {
        console.error('Error fetching professor courses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfessorCourses()
  }, [])

  const stats = [
    {
      title: "My Courses",
      value: isLoading ? "..." : professorsCoursesCount.toString(),
      change: professorsCoursesCount > 0 ? "Active" : "Setup needed",
      trend: professorsCoursesCount > 0 ? "up" : "neutral",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      title: "Total Students",
      value: "0",
      change: "No enrollment",
      trend: "neutral",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      title: "Pending Grades",
      value: "0",
      change: "All clear",
      trend: "neutral",
      icon: Award,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    },
    {
      title: "Avg Performance",
      value: "N/A",
      change: "No data",
      trend: "neutral",
      icon: TrendingUp,
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50"
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
    <RouteGuard allowedRoles={['professor']}>
      <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-700 to-blue-700 bg-clip-text text-transparent">
            Professor Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Welcome, Prof. Smith! Ready to set up your first course?
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/professor/notifications">
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
            <Bell className="w-4 h-4" />
            Notifications
              <Badge variant="secondary" className="ml-1">0</Badge>
          </Button>
          </Link>
          
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
                  <Badge variant="secondary" className="bg-white/90 text-gray-600 font-medium border-gray-200">
                    {stat.change}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
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
                  <CardDescription>Professor tools (available once courses are created)</CardDescription>
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
                      className="group p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 cursor-pointer opacity-50"
                      onClick={() => {
                        alert('Create a course first to access professor tools!')
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

        {/* Setup Guide */}
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Getting Started
            </CardTitle>
            <CardDescription>Set up your teaching environment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <BookPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Yet</h3>
              <p className="text-gray-500 text-sm mb-4">
                Contact your administrator to get assigned to courses or request course creation.
              </p>
              <Button variant="outline" size="sm">
                <UserCheck className="w-4 h-4 mr-2" />
                Contact Admin
              </Button>
              </div>
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
              <CardDescription>Courses you&apos;re teaching will appear here</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 hover:bg-blue-50" disabled>
              Manage All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Courses Assigned</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven&apos;t been assigned to any courses yet. Contact your administrator to get started with teaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline">
                <UserCheck className="w-4 h-4 mr-2" />
                Contact Administrator
              </Button>
              <Button>
                <BookPlus className="w-4 h-4 mr-2" />
                Request Course
              </Button>
              </div>
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
              <CardDescription>Teaching activities will be shown here</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 hover:bg-purple-50" disabled>
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Yet</h3>
            <p className="text-gray-500 text-sm">
              Start teaching courses to see your activities here.
            </p>
                  </div>
        </CardContent>
      </Card>

      {/* Welcome Banner */}
      <Card className="border-0 bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500 text-white shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-blue-600/20"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <BookOpen className="w-8 h-8 text-white" />
                </div>
              <div>
                <h3 className="text-xl font-bold">Welcome to Teaching Portal! 📚</h3>
                <p className="text-white/90">Your professor dashboard is ready. Contact admin to get assigned to courses.</p>
              </div>
            </div>
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
              <UserCheck className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </RouteGuard>
)
} 
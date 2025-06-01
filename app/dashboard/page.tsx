"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
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
  Star,
  Activity
} from "lucide-react"

export default function DashboardPage() {
  const stats = [
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
      title: "Faculty Members",
      value: "89",
      change: "+3%",
      trend: "up",
      icon: GraduationCap,
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50"
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    }
  ]

  const recentActivities = [
    {
      id: 1,
      action: "New student enrollment",
      user: "Sarah Johnson",
      time: "2 minutes ago",
      type: "enrollment",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 2,
      action: "Course materials updated",
      user: "Dr. Michael Chen",
      time: "15 minutes ago",
      type: "update",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 3,
      action: "Grade submitted for CS101",
      user: "Prof. Emily Davis",
      time: "1 hour ago",
      type: "grade",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 4,
      action: "New announcement posted",
      user: "Admin Team",
      time: "2 hours ago",
      type: "announcement",
      avatar: "/api/placeholder/32/32"
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Faculty Meeting",
      date: "Today",
      time: "2:00 PM",
      attendees: 24,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Student Orientation",
      date: "Tomorrow",
      time: "10:00 AM",
      attendees: 156,
      color: "bg-emerald-500"
    },
    {
      id: 3,
      title: "Parent-Teacher Conference",
      date: "Dec 28",
      time: "3:00 PM",
      attendees: 89,
      color: "bg-purple-500"
    }
  ]

  const quickActions = [
    {
      title: "Add New Student",
      description: "Register a new student",
      icon: Users,
      href: "/students/new",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Create Course",
      description: "Set up a new course",
      icon: BookOpen,
      href: "/courses/new",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Schedule Event",
      description: "Plan an upcoming event",
      icon: Calendar,
      href: "/events/new",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Send Notice",
      description: "Broadcast announcement",
      icon: Bell,
      href: "/announcements/new",
      color: "from-orange-500 to-orange-600"
    }
  ]

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Welcome back! Here&apos;s what&apos;s happening at your institution today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
            <Bell className="w-4 h-4" />
            Notifications
            <Badge variant="secondary" className="ml-1">3</Badge>
          </Button>
          
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <Plus className="w-4 h-4" />
            Quick Action
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
                  <span>vs last month</span>
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
                  <CardDescription>Frequently used administrative tasks</CardDescription>
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
                        // Since these pages don't exist yet, show a notification
                        alert(`${action.title} feature coming soon!`)
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

        {/* Upcoming Events */}
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="w-5 h-5 text-blue-500" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Events scheduled for this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                <div className={`w-3 h-3 rounded-full ${event.color} group-hover:scale-125 transition-transform duration-200`}></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs bg-white border-gray-200">
                  {event.attendees}
                </Badge>
              </div>
            ))}
            
            <Button variant="ghost" className="w-full justify-center gap-2 mt-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50">
              View Calendar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="w-5 h-5 text-emerald-500" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest updates and actions across the platform</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 hover:bg-emerald-50">
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
                  <AvatarImage src={activity.avatar} alt={activity.user} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="text-blue-600">{activity.user}</span> {activity.action}
                  </p>
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

      {/* Achievement Banner */}
      <Card className="border-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-red-600/20"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Congratulations! 🎉</h3>
                <p className="text-white/90">Your institution achieved 94.2% success rate this semester!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

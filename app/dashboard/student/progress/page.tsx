"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  ArrowLeft,
  Target,
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  Activity,
  Star,
  Plus,
  Edit3,
  BarChart3,
  Brain,
  Zap,
  Trophy
} from "lucide-react"

// Mock study progress data
const getStudyProgressData = () => {
  return {
    studyStats: {
      totalStudyHours: 156,
      weeklyAverage: 12.5,
      completedGoals: 8,
      totalGoals: 12,
      streakDays: 15,
      skillPoints: 2480
    },
    weeklyStudyHours: [
      { week: "Week 1", hours: 14, target: 15 },
      { week: "Week 2", hours: 12, target: 15 },
      { week: "Week 3", hours: 16, target: 15 },
      { week: "Week 4", hours: 13, target: 15 },
      { week: "Week 5", hours: 15, target: 15 },
      { week: "Week 6", hours: 11, target: 15 },
      { week: "Week 7", hours: 18, target: 15 },
      { week: "Week 8", hours: 14, target: 15 },
      { week: "Week 9", hours: 16, target: 15 },
      { week: "Week 10", hours: 12, target: 15 },
      { week: "Week 11", hours: 15, target: 15 },
      { week: "Week 12", hours: 13, target: 15 }
    ],
    skillProgress: [
      { skill: "Problem Solving", current: 85, target: 90 },
      { skill: "Programming", current: 92, target: 95 },
      { skill: "Data Structures", current: 78, target: 85 },
      { skill: "Algorithms", current: 88, target: 90 },
      { skill: "Database Design", current: 75, target: 80 },
      { skill: "Software Engineering", current: 82, target: 85 }
    ],
    achievements: [
      {
        id: 1,
        title: "Study Streak Master",
        description: "Maintained a 15-day study streak",
        icon: "🔥",
        unlocked: true,
        date: "2024-11-20",
        points: 100
      },
      {
        id: 2,
        title: "Assignment Ace",
        description: "Completed 5 assignments with A grade",
        icon: "📝",
        unlocked: true,
        date: "2024-11-18",
        points: 150
      },
      {
        id: 3,
        title: "Knowledge Seeker",
        description: "Accessed 50+ course materials",
        icon: "📚",
        unlocked: true,
        date: "2024-11-15",
        points: 75
      },
      {
        id: 4,
        title: "Time Manager",
        description: "Completed weekly study goals for 8 weeks",
        icon: "⏰",
        unlocked: true,
        date: "2024-11-10",
        points: 120
      },
      {
        id: 5,
        title: "Perfect Attendance",
        description: "100% attendance for 4 weeks",
        icon: "✅",
        unlocked: false,
        date: null,
        points: 200
      },
      {
        id: 6,
        title: "Quiz Champion",
        description: "Score 90%+ on 10 consecutive quizzes",
        icon: "🏆",
        unlocked: false,
        date: null,
        points: 250
      }
    ],
    studyGoals: [
      {
        id: 1,
        title: "Complete Final Project",
        description: "Finish all phases of the capstone project",
        progress: 75,
        targetDate: "2024-12-15",
        status: "in-progress",
        course: "CS401"
      },
      {
        id: 2,
        title: "Master Data Structures",
        description: "Achieve 85% proficiency in data structures",
        progress: 78,
        targetDate: "2024-12-10",
        status: "in-progress",
        course: "CS301"
      },
      {
        id: 3,
        title: "Database Certification",
        description: "Complete advanced SQL certification",
        progress: 60,
        targetDate: "2024-12-20",
        status: "in-progress",
        course: "CS350"
      },
      {
        id: 4,
        title: "Weekly Study Target",
        description: "Study 15 hours every week",
        progress: 87,
        targetDate: "2024-12-31",
        status: "in-progress",
        course: "All"
      }
    ],
    dailyActivity: [
      { day: "Mon", hours: 2.5, activities: 5 },
      { day: "Tue", hours: 3.0, activities: 7 },
      { day: "Wed", hours: 1.5, activities: 3 },
      { day: "Thu", hours: 2.8, activities: 6 },
      { day: "Fri", hours: 2.2, activities: 4 },
      { day: "Sat", hours: 4.0, activities: 8 },
      { day: "Sun", hours: 3.5, activities: 6 }
    ],
    subjectDistribution: [
      { subject: "CS401", hours: 45, color: "#3B82F6" },
      { subject: "CS301", hours: 38, color: "#10B981" },
      { subject: "CS350", hours: 35, color: "#8B5CF6" },
      { subject: "CS402", hours: 38, color: "#F59E0B" }
    ]
  }
}

export default function StudyProgressPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"overview" | "goals" | "achievements" | "analytics">("overview")
  
  const progressData = getStudyProgressData()

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "text-green-600 bg-green-50"
    if (progress >= 75) return "text-blue-600 bg-blue-50"
    if (progress >= 50) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: TrendingUp },
    { id: "goals" as const, label: "Study Goals", icon: Target },
    { id: "achievements" as const, label: "Achievements", icon: Trophy },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 }
  ]

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
              Study Progress
            </h1>
            <p className="text-gray-600 mt-1">Track your learning journey and achieve your goals</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {progressData.studyStats.skillPoints} XP
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {progressData.studyStats.streakDays} Day Streak
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{progressData.studyStats.totalStudyHours}h</p>
                <p className="text-sm font-medium text-gray-600">Total Study Time</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{progressData.studyStats.weeklyAverage}h</p>
                <p className="text-sm font-medium text-gray-600">Weekly Average</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {progressData.studyStats.completedGoals}/{progressData.studyStats.totalGoals}
                </p>
                <p className="text-sm font-medium text-gray-600">Goals Completed</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{progressData.achievements.filter(a => a.unlocked).length}</p>
                <p className="text-sm font-medium text-gray-600">Achievements</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors duration-200`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Study Hours */}
          <Card className="lg:col-span-2 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Weekly Study Hours
              </CardTitle>
              <CardDescription>Your study time vs weekly targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData.weeklyStudyHours}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#3B82F6" name="Actual Hours" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="#E5E7EB" name="Target Hours" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Daily Activity */}
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                This Week Activity
              </CardTitle>
              <CardDescription>Daily study patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progressData.dailyActivity.map((day) => (
                  <div key={day.day} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{day.day}</p>
                      <p className="text-sm text-gray-600">{day.activities} activities</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">{day.hours}h</p>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(day.hours / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "goals" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Current Study Goals</h3>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Goal
              </Button>
            </div>
            
            {progressData.studyGoals.map((goal) => (
              <Card key={goal.id} className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {goal.course}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                      <span className={`${getProgressColor(goal.progress)} px-2 py-1 rounded-full font-medium`}>
                        {goal.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Goal Progress Chart */}
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Goal Completion
              </CardTitle>
              <CardDescription>Track your progress towards goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Completed", value: progressData.studyStats.completedGoals, color: "#10B981" },
                        { name: "Remaining", value: progressData.studyStats.totalGoals - progressData.studyStats.completedGoals, color: "#E5E7EB" }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#10B981" />
                      <Cell fill="#E5E7EB" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((progressData.studyStats.completedGoals / progressData.studyStats.totalGoals) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Goals Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progressData.achievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`border shadow-lg hover:shadow-xl transition-all duration-300 ${
                achievement.unlocked 
                  ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' 
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                
                {achievement.unlocked ? (
                  <div className="space-y-2">
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Unlocked
                    </Badge>
                    <p className="text-xs text-gray-500">
                      Earned on {achievement.date ? new Date(achievement.date).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-sm font-medium text-yellow-600">+{achievement.points} XP</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-gray-500 border-gray-300">
                      Locked
                    </Badge>
                    <p className="text-sm text-gray-500">Potential: +{achievement.points} XP</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skill Progress Radar */}
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Skill Development
              </CardTitle>
              <CardDescription>Your proficiency across different areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={progressData.skillProgress}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Current"
                      dataKey="current"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke="#10B981"
                      fill="transparent"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Subject Time Distribution */}
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                Study Time Distribution
              </CardTitle>
              <CardDescription>How you spend time across subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressData.subjectDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="hours"
                    >
                      {progressData.subjectDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                {progressData.subjectDistribution.map((subject, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded bg-gray-50">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: subject.color }}
                    ></div>
                    <span className="text-sm font-medium">{subject.subject}</span>
                    <span className="text-xs text-gray-500">{subject.hours}h</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Banner */}
      <Card className="border-0 bg-gradient-to-r from-purple-400 via-blue-500 to-emerald-500 text-white shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-emerald-600/20"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Great Progress! 🚀</h3>
                <p className="text-white/90">You are on track to achieve your study goals this semester!</p>
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
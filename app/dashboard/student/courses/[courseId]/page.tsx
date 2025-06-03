"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
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
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  ArrowLeft,
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Calendar,
  FileText,
  Star,
  Target,
  Activity,
  GraduationCap,
  Mail,
  Users,
  ExternalLink
} from "lucide-react"

// Mock data for student's course
const getStudentCourseData = (courseId: string) => {
  const courses = {
    "1": {
      id: "1",
      name: "Advanced Computer Science",
      code: "CS401",
      instructor: "Prof. Smith",
      schedule: "Mon, Wed, Fri - 9:00 AM",
      room: "Room 101A",
      semester: "Fall 2024",
      credits: 4,
      description: "Advanced topics in computer science including algorithms, data structures, and system design",
      color: "bg-blue-500",
      currentGrade: "A-",
      overallProgress: 78,
      attendancePercentage: 95.2,
      classesAttended: 20,
      totalClasses: 21,
      totalStudents: 45,
      classRank: 3
    },
    "2": {
      id: "2",
      name: "Data Structures & Algorithms",
      code: "CS301",
      instructor: "Prof. Johnson",
      schedule: "Tue, Thu - 2:00 PM",
      room: "Room 205B",
      semester: "Fall 2024",
      credits: 4,
      description: "Comprehensive study of data structures and algorithmic problem solving",
      color: "bg-emerald-500",
      currentGrade: "A",
      overallProgress: 85,
      attendancePercentage: 100,
      classesAttended: 21,
      totalClasses: 21,
      totalStudents: 52,
      classRank: 1
    }
  }
  return courses[courseId as keyof typeof courses] || courses["1"]
}

// Student's assignment scores
const getStudentAssignments = () => {
  const assignments = [
    { id: 1, title: "Assignment 1: Basic Algorithms", type: "assignment", maxMarks: 100, obtainedMarks: 95, dueDate: "2024-09-15", submittedDate: "2024-09-14", status: "graded", feedback: "Excellent implementation and analysis!" },
    { id: 2, title: "Quiz 1: Data Structures", type: "quiz", maxMarks: 50, obtainedMarks: 44, dueDate: "2024-09-22", submittedDate: "2024-09-22", status: "graded", feedback: "Good understanding shown" },
    { id: 3, title: "Assignment 2: Tree Algorithms", type: "assignment", maxMarks: 100, obtainedMarks: 88, dueDate: "2024-10-01", submittedDate: "2024-09-30", status: "graded", feedback: "Well structured solution" },
    { id: 4, title: "Mid-term Examination", type: "exam", maxMarks: 200, obtainedMarks: 175, dueDate: "2024-10-15", submittedDate: "2024-10-15", status: "graded", feedback: "Strong performance across all topics" },
    { id: 5, title: "Assignment 3: Graph Algorithms", type: "assignment", maxMarks: 100, obtainedMarks: 92, dueDate: "2024-11-01", submittedDate: "2024-10-31", status: "graded", feedback: "Creative approach to optimization" },
    { id: 6, title: "Quiz 2: Advanced Topics", type: "quiz", maxMarks: 50, obtainedMarks: 46, dueDate: "2024-11-10", submittedDate: "2024-11-10", status: "graded", feedback: "Excellent grasp of concepts" },
    { id: 7, title: "Final Project Phase 1", type: "project", maxMarks: 150, obtainedMarks: 140, dueDate: "2024-11-25", submittedDate: "2024-11-24", status: "graded", feedback: "Outstanding research and implementation" }
  ]
  
  return assignments.map(assignment => ({
    ...assignment,
    percentage: Math.round((assignment.obtainedMarks / assignment.maxMarks) * 100)
  }))
}

// Pending assignments
const getPendingAssignments = () => {
  return [
    { id: 8, title: "Final Project Phase 2", type: "project", maxMarks: 200, dueDate: "2024-12-15", priority: "high", description: "Complete implementation and documentation", estimatedHours: 15 },
    { id: 9, title: "Assignment 4: Machine Learning", type: "assignment", maxMarks: 100, dueDate: "2024-12-08", priority: "medium", description: "Implement basic ML algorithms", estimatedHours: 8 },
    { id: 10, title: "Quiz 3: Final Review", type: "quiz", maxMarks: 50, dueDate: "2024-12-05", priority: "low", description: "Comprehensive course review", estimatedHours: 2 }
  ]
}

// Weekly progress data
const getWeeklyProgress = () => {
  return [
    { week: "Week 1", attendance: 100, assignments: 95, quizzes: 0, overall: 97 },
    { week: "Week 2", attendance: 100, assignments: 88, quizzes: 88, overall: 92 },
    { week: "Week 3", attendance: 95, assignments: 92, quizzes: 0, overall: 94 },
    { week: "Week 4", attendance: 100, assignments: 0, quizzes: 0, overall: 100 },
    { week: "Week 5", attendance: 90, assignments: 0, quizzes: 0, overall: 90 },
    { week: "Week 6", attendance: 100, assignments: 0, quizzes: 0, overall: 100 },
    { week: "Week 7", attendance: 100, assignments: 0, quizzes: 0, overall: 100 },
    { week: "Week 8", attendance: 100, assignments: 87, quizzes: 0, overall: 94 },
    { week: "Week 9", attendance: 100, assignments: 0, quizzes: 0, overall: 100 },
    { week: "Week 10", attendance: 95, assignments: 92, quizzes: 92, overall: 93 },
    { week: "Week 11", attendance: 100, assignments: 0, quizzes: 0, overall: 100 },
    { week: "Week 12", attendance: 100, assignments: 140, quizzes: 92, overall: 96 }
  ]
}

// Grade distribution data
const getGradeDistribution = () => {
  return [
    { grade: "A+", count: 8, percentage: 18, color: "#22C55E" },
    { grade: "A", count: 12, percentage: 27, color: "#3B82F6" },
    { grade: "A-", count: 10, percentage: 22, color: "#8B5CF6" },
    { grade: "B+", count: 8, percentage: 18, color: "#F59E0B" },
    { grade: "B", count: 5, percentage: 11, color: "#EF4444" },
    { grade: "B-", count: 2, percentage: 4, color: "#6B7280" }
  ]
}

export default function StudentCourseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const courseId = params.courseId as string
  
  const [activeTab, setActiveTab] = useState("overview")
  
  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'assignments', 'progress', 'analytics'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])
  
  const course = getStudentCourseData(courseId)
  const assignments = getStudentAssignments()
  const pendingAssignments = getPendingAssignments()
  const weeklyProgress = getWeeklyProgress()
  const gradeDistribution = getGradeDistribution()
  
  const completedAssignments = assignments.filter(a => a.status === "graded")
  const averageScore = completedAssignments.length > 0 
    ? Math.round(completedAssignments.reduce((sum, a) => sum + a.percentage, 0) / completedAssignments.length)
    : 0

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "assignments", label: "Assignments", icon: FileText },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "analytics", label: "Analytics", icon: BarChart3 }
  ]

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
            className="mt-1 hover:scale-105 transition-transform duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 ${course.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-emerald-700 bg-clip-text text-transparent">
                {course.name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {course.code}
                </Badge>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  {course.credits} Credits
                </Badge>
                <Badge 
                  variant="outline" 
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  Current Grade: {course.currentGrade}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.instructor}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.schedule}
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {course.room}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
            <Mail className="w-4 h-4" />
            Contact Instructor
          </Button>
          
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <ExternalLink className="w-4 h-4" />
            Course Materials
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{course.attendancePercentage}%</p>
                <p className="text-sm font-medium text-gray-600">Attendance</p>
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
                <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">#{course.classRank}</p>
                <p className="text-sm font-medium text-gray-600">Class Rank</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingAssignments.length}</p>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
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
          {/* Course Progress */}
          <Card className="lg:col-span-2 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Weekly Progress Overview
              </CardTitle>
              <CardDescription>Your performance trends throughout the semester</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="overall" stackId="1" stroke="#3B82F6" fill="url(#overallGradient)" name="Overall Progress" />
                    <Area type="monotone" dataKey="attendance" stackId="2" stroke="#10B981" fill="url(#attendanceGradient)" name="Attendance" />
                    <defs>
                      <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Course Info & Pending Tasks */}
          <div className="space-y-6">
            {/* Course Details */}
            <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  Course Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">{course.description}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Semester:</span>
                    <span className="text-sm font-medium">{course.semester}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Credits:</span>
                    <span className="text-sm font-medium">{course.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Students:</span>
                    <span className="text-sm font-medium">{course.totalStudents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Your Rank:</span>
                    <span className="text-sm font-medium">#{course.classRank} of {course.totalStudents}</span>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-900">Progress</span>
                    <span className="text-lg font-bold text-green-900">{course.overallProgress}%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.overallProgress}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Assignments */}
            <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Pending Tasks
                </CardTitle>
                <CardDescription>Upcoming assignments and deadlines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-4 rounded-lg border-2 border-gray-100 hover:border-orange-200 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{assignment.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          assignment.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                          assignment.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-green-50 text-green-700 border-green-200'
                        }`}
                      >
                        {assignment.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{assignment.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      <span>{assignment.estimatedHours}h estimated</span>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full gap-2 hover:bg-orange-50"
                  onClick={() => setActiveTab("assignments")}
                >
                  <FileText className="w-4 h-4" />
                  View All Assignments
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assignment Scores Chart */}
          <Card className="lg:col-span-2 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Assignment Performance
              </CardTitle>
              <CardDescription>Your scores across all completed assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={completedAssignments}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="title" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-900">{data.title}</p>
                              <p className="text-blue-600">Score: {data.obtainedMarks}/{data.maxMarks} ({data.percentage}%)</p>
                              <p className="text-gray-600 text-sm">Type: {data.type}</p>
                              <p className="text-green-600 text-sm">Feedback: {data.feedback}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="percentage" fill="url(#assignmentGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="assignmentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#1E40AF" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-lg font-bold text-green-900">{Math.max(...completedAssignments.map(a => a.percentage))}%</p>
                  <p className="text-sm text-green-700">Highest Score</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-lg font-bold text-blue-900">{averageScore}%</p>
                  <p className="text-sm text-blue-700">Average Score</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <p className="text-lg font-bold text-purple-900">{completedAssignments.length}</p>
                  <p className="text-sm text-purple-700">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment List */}
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                All Assignments
              </CardTitle>
              <CardDescription>Completed and pending assignments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {/* Completed Assignments */}
              <div>
                <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Completed ({completedAssignments.length})
                </h4>
                {completedAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 rounded-lg border border-green-200 bg-green-50 mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-green-900 text-sm">{assignment.title}</h5>
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300">
                        {assignment.percentage}%
                      </Badge>
                    </div>
                    <p className="text-xs text-green-700">
                      {assignment.obtainedMarks}/{assignment.maxMarks} marks
                    </p>
                    <p className="text-xs text-green-600 mt-1">{assignment.feedback}</p>
                  </div>
                ))}
              </div>

              {/* Pending Assignments */}
              <div>
                <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending ({pendingAssignments.length})
                </h4>
                {pendingAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 rounded-lg border border-orange-200 bg-orange-50 mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-orange-900 text-sm">{assignment.title}</h5>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          assignment.priority === 'high' ? 'bg-red-100 text-red-800 border-red-300' :
                          assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                          'bg-green-100 text-green-800 border-green-300'
                        }`}
                      >
                        {assignment.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-orange-700">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">{assignment.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "progress" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Performance Line Chart */}
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" />
                Weekly Performance Trend
              </CardTitle>
              <CardDescription>Track your performance across different metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="overall" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} name="Overall" />
                    <Line type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} name="Attendance" />
                    <Line type="monotone" dataKey="assignments" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} name="Assignments" />
                    <Line type="monotone" dataKey="quizzes" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }} name="Quizzes" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Overview */}
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                Attendance Overview
              </CardTitle>
              <CardDescription>Your attendance record and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{course.attendancePercentage}%</div>
                  <p className="text-gray-600">Overall Attendance</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {course.classesAttended} out of {course.totalClasses} classes attended
                  </p>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${course.attendancePercentage}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="text-2xl font-bold text-green-700">{course.classesAttended}</div>
                    <div className="text-sm text-green-600">Present</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                    <div className="text-2xl font-bold text-red-700">{course.totalClasses - course.classesAttended}</div>
                    <div className="text-sm text-red-600">Absent</div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Attendance Goal</h4>
                  <p className="text-sm text-blue-700">
                    You need to maintain 75% attendance. You&apos;re currently at {course.attendancePercentage}% - excellent work!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Grade Distribution */}
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Class Grade Distribution
              </CardTitle>
              <CardDescription>See how your grade compares to the class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold">Grade {data.grade}</p>
                              <p className="text-sm">{data.count} students ({data.percentage}%)</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                {gradeDistribution.map((grade, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-2 p-2 rounded ${
                      grade.grade === course.currentGrade ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: grade.color }}
                    ></div>
                    <span className="text-sm font-medium">{grade.grade}</span>
                    <span className="text-xs text-gray-500">({grade.percentage}%)</span>
                    {grade.grade === course.currentGrade && (
                      <span className="text-xs text-blue-600 font-medium">You</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                Performance Summary
              </CardTitle>
              <CardDescription>Your key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="text-2xl font-bold text-purple-700">#{course.classRank}</div>
                    <div className="text-sm text-purple-600">Class Rank</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-700">{course.currentGrade}</div>
                    <div className="text-sm text-blue-600">Current Grade</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">Strengths</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Excellent attendance record ({course.attendancePercentage}%)</li>
                      <li>• Consistent assignment performance</li>
                      <li>• Strong understanding of core concepts</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-2">Areas for Improvement</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Focus on advanced topics in upcoming assignments</li>
                      <li>• Participate more in class discussions</li>
                      <li>• Review midterm exam feedback for better performance</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Recommendations</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Continue maintaining excellent attendance</li>
                      <li>• Submit assignments early when possible</li>
                      <li>• Utilize office hours for challenging topics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  ArrowLeft,
  Award,
  TrendingUp,
  BarChart3,
  BookOpen,
  Target,
  Star,
  Calendar,
  FileText
} from "lucide-react"

// Mock grades data
const getGradesData = () => {
  return {
    courses: [
      {
        id: "1",
        name: "Advanced Computer Science",
        code: "CS401",
        instructor: "Prof. Smith",
        semester: "Fall 2024",
        currentGrade: "A-",
        percentage: 87.5,
        credits: 4,
        assignments: [
          { name: "Assignment 1", type: "Assignment", maxMarks: 100, obtainedMarks: 95, percentage: 95, date: "2024-09-15", feedback: "Excellent work!" },
          { name: "Quiz 1", type: "Quiz", maxMarks: 50, obtainedMarks: 44, percentage: 88, date: "2024-09-22", feedback: "Good understanding" },
          { name: "Assignment 2", type: "Assignment", maxMarks: 100, obtainedMarks: 88, percentage: 88, date: "2024-10-01", feedback: "Well structured" },
          { name: "Midterm", type: "Exam", maxMarks: 200, obtainedMarks: 175, percentage: 87.5, date: "2024-10-15", feedback: "Strong performance" },
          { name: "Assignment 3", type: "Assignment", maxMarks: 100, obtainedMarks: 92, percentage: 92, date: "2024-11-01", feedback: "Creative approach" },
          { name: "Final Project Phase 1", type: "Project", maxMarks: 150, obtainedMarks: 140, percentage: 93.3, date: "2024-11-25", feedback: "Outstanding work" }
        ]
      },
      {
        id: "2", 
        name: "Data Structures & Algorithms",
        code: "CS301",
        instructor: "Prof. Johnson",
        semester: "Fall 2024",
        currentGrade: "A",
        percentage: 92.1,
        credits: 4,
        assignments: [
          { name: "Assignment 1", type: "Assignment", maxMarks: 100, obtainedMarks: 98, percentage: 98, date: "2024-09-10", feedback: "Perfect implementation!" },
          { name: "Quiz 1", type: "Quiz", maxMarks: 50, obtainedMarks: 46, percentage: 92, date: "2024-09-20", feedback: "Excellent understanding" },
          { name: "Assignment 2", type: "Assignment", maxMarks: 100, obtainedMarks: 94, percentage: 94, date: "2024-09-28", feedback: "Well optimized" },
          { name: "Midterm", type: "Exam", maxMarks: 200, obtainedMarks: 184, percentage: 92, date: "2024-10-12", feedback: "Excellent performance" },
          { name: "Assignment 3", type: "Assignment", maxMarks: 100, obtainedMarks: 89, percentage: 89, date: "2024-10-30", feedback: "Good analysis" }
        ]
      },
      {
        id: "3",
        name: "Database Management", 
        code: "CS350",
        instructor: "Prof. Davis",
        semester: "Fall 2024",
        currentGrade: "B+",
        percentage: 84.2,
        credits: 3,
        assignments: [
          { name: "Assignment 1", type: "Assignment", maxMarks: 100, obtainedMarks: 85, percentage: 85, date: "2024-09-12", feedback: "Good effort" },
          { name: "Quiz 1", type: "Quiz", maxMarks: 50, obtainedMarks: 42, percentage: 84, date: "2024-09-25", feedback: "Satisfactory" },
          { name: "Lab 1", type: "Lab", maxMarks: 75, obtainedMarks: 68, percentage: 90.7, date: "2024-10-05", feedback: "Well executed" },
          { name: "Midterm", type: "Exam", maxMarks: 200, obtainedMarks: 165, percentage: 82.5, date: "2024-10-18", feedback: "Needs improvement in optimization" },
          { name: "Lab 2", type: "Lab", maxMarks: 75, obtainedMarks: 62, percentage: 82.7, date: "2024-11-15", feedback: "Good implementation" }
        ]
      },
      {
        id: "4",
        name: "Software Engineering",
        code: "CS402", 
        instructor: "Prof. Wilson",
        semester: "Fall 2024",
        currentGrade: "A-",
        percentage: 89.3,
        credits: 4,
        assignments: [
          { name: "Assignment 1", type: "Assignment", maxMarks: 100, obtainedMarks: 90, percentage: 90, date: "2024-09-08", feedback: "Great methodology" },
          { name: "Quiz 1", type: "Quiz", maxMarks: 50, obtainedMarks: 45, percentage: 90, date: "2024-09-18", feedback: "Excellent concepts" },
          { name: "Project Phase 1", type: "Project", maxMarks: 150, obtainedMarks: 135, percentage: 90, date: "2024-10-10", feedback: "Well planned" },
          { name: "Midterm", type: "Exam", maxMarks: 200, obtainedMarks: 172, percentage: 86, date: "2024-10-20", feedback: "Good understanding" },
          { name: "Project Phase 2", type: "Project", maxMarks: 150, obtainedMarks: 138, percentage: 92, date: "2024-11-20", feedback: "Excellent execution" }
        ]
      }
    ],
    semesterStats: {
      totalCredits: 15,
      completedCredits: 15,
      cgpa: 3.84,
      sgpa: 3.84,
      totalAssignments: 21,
      averageScore: 89.2,
      rank: 8,
      totalStudents: 150
    },
    trendData: [
      { month: "Sep", grade: 89.5 },
      { month: "Oct", grade: 88.2 },
      { month: "Nov", grade: 89.8 },
      { month: "Dec", grade: 89.2 }
    ]
  }
}

export default function GradesPage() {
  const router = useRouter()
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [viewType, setViewType] = useState<"overview" | "detailed">("overview")
  
  const gradesData = getGradesData()
  const selectedCourseData = selectedCourse 
    ? gradesData.courses.find(c => c.id === selectedCourse)
    : null

  const gradeDistribution = [
    { grade: "A+", count: 3, color: "#22C55E" },
    { grade: "A", count: 1, color: "#3B82F6" },
    { grade: "A-", count: 2, color: "#8B5CF6" },
    { grade: "B+", count: 1, color: "#F59E0B" }
  ]

  const getGradeColor = (percentage: number) => {
    if (percentage >= 95) return "text-green-600 bg-green-50"
    if (percentage >= 90) return "text-blue-600 bg-blue-50"
    if (percentage >= 85) return "text-purple-600 bg-purple-50"
    if (percentage >= 80) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

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
              My Grades
            </h1>
            <p className="text-gray-600 mt-1">Track your academic performance across all courses</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={viewType === "overview" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("overview")}
          >
            Overview
          </Button>
          <Button
            variant={viewType === "detailed" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("detailed")}
          >
            Detailed View
          </Button>
        </div>
      </div>

      {viewType === "overview" ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{gradesData.semesterStats.cgpa}</p>
                    <p className="text-sm font-medium text-gray-600">Current CGPA</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{gradesData.semesterStats.averageScore}%</p>
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">#{gradesData.semesterStats.rank}</p>
                    <p className="text-sm font-medium text-gray-600">Class Rank</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{gradesData.semesterStats.completedCredits}</p>
                    <p className="text-sm font-medium text-gray-600">Credits Earned</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Grade Trend Chart */}
            <Card className="lg:col-span-2 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Grade Trend Analysis
                </CardTitle>
                <CardDescription>Your performance trend over the semester</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gradesData.trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[80, 95]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="grade" 
                        stroke="#3B82F6" 
                        strokeWidth={3} 
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }} 
                        name="Average Grade %" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  Grade Distribution
                </CardTitle>
                <CardDescription>Distribution of your grades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gradeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {gradeDistribution.map((grade, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded bg-gray-50">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: grade.color }}
                      ></div>
                      <span className="text-sm font-medium">{grade.grade}</span>
                      <span className="text-xs text-gray-500">({grade.count})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Grades Overview */}
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-500" />
                Course Performance Summary
              </CardTitle>
              <CardDescription>Overview of your performance in each course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gradesData.courses.map((course) => (
                  <div 
                    key={course.id} 
                    className="p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedCourse(course.id)
                      setViewType("detailed")
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.name}</h3>
                        <p className="text-sm text-gray-600">{course.code} • {course.instructor}</p>
                      </div>
                      <Badge className={`${getGradeColor(course.percentage)} border-0`}>
                        {course.currentGrade}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Overall Score</span>
                        <span className="font-medium">{course.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{course.credits} Credits</span>
                        <span>{course.assignments.length} Assessments</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Course Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gradesData.courses.map((course) => (
              <Card 
                key={course.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedCourse === course.id 
                    ? 'ring-2 ring-blue-500 border-blue-200 shadow-lg' 
                    : 'border-gray-200 hover:shadow-lg hover:border-gray-300'
                }`}
                onClick={() => setSelectedCourse(course.id)}
              >
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-sm">{course.code}</h3>
                    <p className="text-xs text-gray-600 mt-1">{course.name}</p>
                    <Badge className={`mt-2 ${getGradeColor(course.percentage)} border-0`}>
                      {course.currentGrade}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Course View */}
          {selectedCourseData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Assignment Performance Chart */}
              <Card className="lg:col-span-2 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    {selectedCourseData.name} - Performance Breakdown
                  </CardTitle>
                  <CardDescription>Individual assignment and test scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedCourseData.assignments}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
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
                                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                  <p className="font-semibold text-gray-900">{data.name}</p>
                                  <p className="text-blue-600">Score: {data.obtainedMarks}/{data.maxMarks} ({data.percentage}%)</p>
                                  <p className="text-gray-600 text-sm">Type: {data.type}</p>
                                  <p className="text-green-600 text-sm">Feedback: {data.feedback}</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar dataKey="percentage" fill="url(#gradientBar)" radius={[4, 4, 0, 0]} />
                        <defs>
                          <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#1E40AF" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Course Details and Assignment List */}
              <div className="space-y-6">
                {/* Course Info */}
                <Card className="border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-500" />
                      Course Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedCourseData.name}</h4>
                      <p className="text-sm text-gray-600">{selectedCourseData.code}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Instructor:</span>
                        <p className="text-gray-600">{selectedCourseData.instructor}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Credits:</span>
                        <p className="text-gray-600">{selectedCourseData.credits}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Current Grade:</span>
                        <p className="text-gray-600">{selectedCourseData.currentGrade}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Percentage:</span>
                        <p className="text-gray-600">{selectedCourseData.percentage}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Assignment List */}
                <Card className="border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      All Assessments
                    </CardTitle>
                    <CardDescription>Detailed breakdown of scores</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedCourseData.assignments.map((assignment, index) => (
                      <div key={index} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900 text-sm">{assignment.name}</h5>
                          <Badge className={`${getGradeColor(assignment.percentage)} border-0 text-xs`}>
                            {assignment.percentage}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{assignment.type}</span>
                          <span>{assignment.obtainedMarks}/{assignment.maxMarks}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{assignment.feedback}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(assignment.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
} 
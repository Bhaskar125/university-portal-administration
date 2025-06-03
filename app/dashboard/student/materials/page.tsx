"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Download,
  ExternalLink,
  Search,
  Calendar,
  Clock,
  Star,
  Eye,
  PlayCircle,
  Folder,
  File
} from "lucide-react"

// Mock course materials data
const getCourseMaterials = () => {
  return {
    courses: [
      {
        id: "1",
        name: "Advanced Computer Science",
        code: "CS401",
        instructor: "Prof. Smith",
        materials: [
          {
            id: 1,
            title: "Introduction to Advanced Algorithms",
            type: "lecture",
            format: "PDF",
            size: "2.5 MB",
            uploadDate: "2024-09-01",
            downloads: 45,
            description: "Overview of advanced algorithmic concepts and complexity analysis",
            url: "#",
            category: "Lectures",
            week: 1
          },
          {
            id: 2,
            title: "Data Structure Optimization Techniques",
            type: "notes",
            format: "PDF",
            size: "1.8 MB",
            uploadDate: "2024-09-08",
            downloads: 38,
            description: "Comprehensive notes on optimizing data structures for performance",
            url: "#",
            category: "Study Notes",
            week: 2
          },
          {
            id: 3,
            title: "Algorithm Implementation Demo",
            type: "video",
            format: "MP4",
            size: "125 MB",
            uploadDate: "2024-09-15",
            downloads: 52,
            description: "Live coding demonstration of sorting and searching algorithms",
            url: "#",
            category: "Videos",
            week: 3,
            duration: "45 min"
          },
          {
            id: 4,
            title: "Computer Science Handbook 2024",
            type: "textbook",
            format: "PDF",
            size: "15.2 MB",
            uploadDate: "2024-08-25",
            downloads: 67,
            description: "Complete reference textbook for advanced computer science topics",
            url: "#",
            category: "Textbooks",
            week: null
          },
          {
            id: 5,
            title: "Assignment 1 - Guidelines",
            type: "assignment",
            format: "PDF",
            size: "0.8 MB",
            uploadDate: "2024-09-10",
            downloads: 43,
            description: "Detailed guidelines and requirements for the first assignment",
            url: "#",
            category: "Assignments",
            week: 2
          }
        ]
      },
      {
        id: "2",
        name: "Data Structures & Algorithms",
        code: "CS301",
        instructor: "Prof. Johnson",
        materials: [
          {
            id: 6,
            title: "Linear Data Structures",
            type: "lecture",
            format: "PDF",
            size: "3.1 MB",
            uploadDate: "2024-09-02",
            downloads: 56,
            description: "Arrays, linked lists, stacks, and queues fundamentals",
            url: "#",
            category: "Lectures",
            week: 1
          },
          {
            id: 7,
            title: "Tree Algorithms Visualization",
            type: "video",
            format: "MP4",
            size: "89 MB",
            uploadDate: "2024-09-16",
            downloads: 41,
            description: "Interactive visualization of tree traversal algorithms",
            url: "#",
            category: "Videos",
            week: 4,
            duration: "32 min"
          },
          {
            id: 8,
            title: "Algorithm Analysis Cheat Sheet",
            type: "notes",
            format: "PDF",
            size: "1.2 MB",
            uploadDate: "2024-09-20",
            downloads: 72,
            description: "Quick reference for Big O notation and complexity analysis",
            url: "#",
            category: "Study Notes",
            week: 5
          }
        ]
      },
      {
        id: "3",
        name: "Database Management",
        code: "CS350",
        instructor: "Prof. Davis",
        materials: [
          {
            id: 9,
            title: "SQL Fundamentals",
            type: "lecture",
            format: "PDF",
            size: "2.8 MB",
            uploadDate: "2024-09-03",
            downloads: 49,
            description: "Introduction to SQL syntax and basic operations",
            url: "#",
            category: "Lectures",
            week: 1
          },
          {
            id: 10,
            title: "Database Design Workshop",
            type: "video",
            format: "MP4",
            size: "156 MB",
            uploadDate: "2024-09-17",
            downloads: 35,
            description: "Step-by-step database design methodology",
            url: "#",
            category: "Videos",
            week: 3,
            duration: "67 min"
          }
        ]
      },
      {
        id: "4",
        name: "Software Engineering",
        code: "CS402",
        instructor: "Prof. Wilson",
        materials: [
          {
            id: 11,
            title: "Software Development Life Cycle",
            type: "lecture",
            format: "PDF",
            size: "4.2 MB",
            uploadDate: "2024-09-04",
            downloads: 58,
            description: "Overview of SDLC methodologies and best practices",
            url: "#",
            category: "Lectures",
            week: 1
          },
          {
            id: 12,
            title: "Agile Development Case Study",
            type: "video",
            format: "MP4",
            size: "203 MB",
            uploadDate: "2024-09-18",
            downloads: 44,
            description: "Real-world example of agile development implementation",
            url: "#",
            category: "Videos",
            week: 4,
            duration: "85 min"
          }
        ]
      }
    ]
  }
}

export default function CourseMaterialsPage() {
  const router = useRouter()
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  
  const materialsData = getCourseMaterials()
  
  // Get all materials or filter by course
  const allMaterials = materialsData.courses.flatMap(course => 
    course.materials.map(material => ({
      ...material,
      courseName: course.name,
      courseCode: course.code,
      courseId: course.id
    }))
  )
  
  const filteredMaterials = allMaterials.filter(material => {
    const matchesCourse = selectedCourse === "all" || material.courseId === selectedCourse
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || material.type === filterType
    
    return matchesCourse && matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lecture": return <FileText className="w-4 h-4" />
      case "video": return <PlayCircle className="w-4 h-4" />
      case "notes": return <BookOpen className="w-4 h-4" />
      case "textbook": return <BookOpen className="w-4 h-4" />
      case "assignment": return <File className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lecture": return "bg-blue-50 text-blue-700 border-blue-200"
      case "video": return "bg-purple-50 text-purple-700 border-purple-200"
      case "notes": return "bg-green-50 text-green-700 border-green-200"
      case "textbook": return "bg-orange-50 text-orange-700 border-orange-200"
      case "assignment": return "bg-red-50 text-red-700 border-red-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const materialTypes = [
    { value: "all", label: "All Types" },
    { value: "lecture", label: "Lectures" },
    { value: "video", label: "Videos" },
    { value: "notes", label: "Study Notes" },
    { value: "textbook", label: "Textbooks" },
    { value: "assignment", label: "Assignments" }
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
              Course Materials
            </h1>
            <p className="text-gray-600 mt-1">Access lecture notes, videos, textbooks, and study resources</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {filteredMaterials.length} Materials
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Course Filter */}
        <div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Courses</option>
            {materialsData.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {materialTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {materialTypes.slice(1).map((type) => {
          const count = allMaterials.filter(m => m.type === type.value).length
          return (
            <Card key={type.value} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {getTypeIcon(type.value)}
                </div>
                <p className="text-lg font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-600">{type.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {material.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 mt-1">
                    {material.courseCode} • {material.courseName}
                  </CardDescription>
                </div>
                <Badge variant="outline" className={getTypeColor(material.type)}>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(material.type)}
                    <span className="text-xs capitalize">{material.type}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 line-clamp-3">{material.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(material.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>{material.downloads}</span>
                </div>
              </div>

              {material.duration && (
                <div className="flex items-center gap-1 text-xs text-purple-600">
                  <Clock className="w-3 h-3" />
                  <span>{material.duration}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <span className="font-medium">{material.format}</span> • {material.size}
                </div>
                {material.week && (
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    Week {material.week}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                  onClick={() => {
                    // Simulate download
                    alert(`Downloading ${material.title}...`)
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                
                {material.type === "video" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      alert(`Opening ${material.title} for viewing...`)
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <Card className="border border-gray-200 shadow-lg">
          <CardContent className="p-12 text-center">
            <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Materials Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== "all" || selectedCourse !== "all"
                ? "Try adjusting your search criteria to find more materials."
                : "No course materials are available at the moment."}
            </p>
            {(searchTerm || filterType !== "all" || selectedCourse !== "all") && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setFilterType("all")
                  setSelectedCourse("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recently Added */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Recently Added Materials
          </CardTitle>
          <CardDescription>Latest course materials uploaded by instructors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allMaterials
              .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
              .slice(0, 5)
              .map((material) => (
                <div key={material.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(material.type).replace('border-', 'border ')}`}>
                      {getTypeIcon(material.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{material.title}</h4>
                      <p className="text-xs text-gray-600">{material.courseCode} • {new Date(material.uploadDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Access
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
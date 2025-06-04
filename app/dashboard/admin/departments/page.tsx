"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Building, 
  Search, 
  Filter,
  Download,
  GraduationCap,
  Eye,
  Edit,
  MoreHorizontal,
  Plus,
  Mail,
  Phone
} from "lucide-react"
import Link from "next/link"

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  // Mock department data
  const departments = [
    {
      id: "cs",
      name: "Computer Science",
      code: "CS",
      type: "Engineering",
      head: "Dr. Sarah Johnson",
      headEmail: "s.johnson@university.edu",
      headPhone: "+1 (555) 123-4567",
      established: "1985",
      location: "Engineering Building A",
      totalStudents: 324,
      activeCourses: 12,
      totalBatches: 4,
      facultyCount: 18,
      avgGPA: 3.45,
      completionRate: 94.2,
      employmentRate: 96.8,
      researchProjects: 8,
      description: "Department of Computer Science offering comprehensive programs in software engineering, artificial intelligence, and data science.",
      programs: ["Computer Science Engineering", "Information Technology", "Software Engineering"],
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      id: "ee",
      name: "Electrical Engineering",
      code: "EE",
      type: "Engineering",
      head: "Prof. Michael Chen",
      headEmail: "m.chen@university.edu",
      headPhone: "+1 (555) 234-5678",
      established: "1978",
      location: "Engineering Building B",
      totalStudents: 256,
      activeCourses: 10,
      totalBatches: 3,
      facultyCount: 15,
      avgGPA: 3.38,
      completionRate: 91.5,
      employmentRate: 94.2,
      researchProjects: 6,
      description: "Department of Electrical Engineering focusing on power systems, electronics, and renewable energy technologies.",
      programs: ["Electrical Engineering", "Electronics Engineering", "Power Systems"],
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50"
    },
    {
      id: "me",
      name: "Mechanical Engineering",
      code: "ME",
      type: "Engineering",
      head: "Dr. Emily Davis",
      headEmail: "e.davis@university.edu",
      headPhone: "+1 (555) 345-6789",
      established: "1982",
      location: "Engineering Building C",
      totalStudents: 289,
      activeCourses: 11,
      totalBatches: 4,
      facultyCount: 16,
      avgGPA: 3.42,
      completionRate: 92.8,
      employmentRate: 95.5,
      researchProjects: 7,
      description: "Department of Mechanical Engineering with specializations in manufacturing, automotive, and aerospace engineering.",
      programs: ["Mechanical Engineering", "Manufacturing Engineering", "Automotive Engineering"],
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      id: "math",
      name: "Mathematics",
      code: "MATH",
      type: "Science",
      head: "Prof. Robert Wilson",
      headEmail: "r.wilson@university.edu",
      headPhone: "+1 (555) 456-7890",
      established: "1975",
      location: "Science Building A",
      totalStudents: 145,
      activeCourses: 8,
      totalBatches: 2,
      facultyCount: 12,
      avgGPA: 3.52,
      completionRate: 96.3,
      employmentRate: 92.1,
      researchProjects: 5,
      description: "Department of Mathematics offering pure and applied mathematics with strong focus on research and analytics.",
      programs: ["Mathematics", "Applied Mathematics", "Statistics"],
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50"
    },
    {
      id: "phy",
      name: "Physics",
      code: "PHY",
      type: "Science",
      head: "Dr. Lisa Anderson",
      headEmail: "l.anderson@university.edu",
      headPhone: "+1 (555) 567-8901",
      established: "1976",
      location: "Science Building B",
      totalStudents: 98,
      activeCourses: 6,
      totalBatches: 2,
      facultyCount: 10,
      avgGPA: 3.48,
      completionRate: 94.9,
      employmentRate: 89.3,
      researchProjects: 4,
      description: "Department of Physics focusing on theoretical and experimental physics with cutting-edge research facilities.",
      programs: ["Physics", "Applied Physics", "Theoretical Physics"],
      color: "from-indigo-500 to-blue-500",
      bgColor: "from-indigo-50 to-blue-50"
    },
    {
      id: "chem",
      name: "Chemistry",
      code: "CHEM",
      type: "Science",
      head: "Prof. David Kim",
      headEmail: "d.kim@university.edu",
      headPhone: "+1 (555) 678-9012",
      established: "1977",
      location: "Science Building C",
      totalStudents: 87,
      activeCourses: 5,
      totalBatches: 2,
      facultyCount: 9,
      avgGPA: 3.44,
      completionRate: 93.1,
      employmentRate: 91.4,
      researchProjects: 3,
      description: "Department of Chemistry with specializations in organic, inorganic, and physical chemistry research.",
      programs: ["Chemistry", "Applied Chemistry", "Chemical Engineering"],
      color: "from-teal-500 to-green-500",
      bgColor: "from-teal-50 to-green-50"
    }
  ]

  const departmentTypes = [
    { name: "All Types", code: "all" },
    { name: "Engineering", code: "Engineering" },
    { name: "Science", code: "Science" },
    { name: "Arts", code: "Arts" },
    { name: "Business", code: "Business" }
  ]

  // Filter departments based on search and type
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === "all" || dept.type === selectedType
    
    return matchesSearch && matchesType
  })

  const getPerformanceColor = (value: number, type: "gpa" | "rate") => {
    if (type === "gpa") {
      if (value >= 3.5) return 'text-green-600'
      if (value >= 3.0) return 'text-yellow-600'
      return 'text-red-600'
    } else {
      if (value >= 95) return 'text-green-600'
      if (value >= 90) return 'text-yellow-600'
      return 'text-red-600'
    }
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            Department Management
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage all academic departments, faculty, and programs.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <Plus className="w-4 h-4" />
            Add Department
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {departmentTypes.map((type) => (
                  <SelectItem key={type.code} value={type.code}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <span>Showing {filteredDepartments.length} of {departments.length} departments</span>
            {(selectedType !== "all" || searchTerm) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchTerm("")
                  setSelectedType("all")
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Departments Grid */}
      {filteredDepartments.length === 0 ? (
        <Card className="shadow-lg border-0">
          <CardContent className="p-12 text-center">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No departments found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add new departments.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDepartments.map((dept) => (
            <Card key={dept.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 shadow-lg overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${dept.bgColor} opacity-20`}></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${dept.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{dept.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{dept.code}</Badge>
                        <Badge variant="outline" className="text-xs">{dept.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link href={`/dashboard/admin/departments/${dept.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{dept.description}</p>

                {/* Department Head Info */}
                <div className="bg-white/60 rounded-lg p-3 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Department Head
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-gray-900">{dept.head}</p>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-3 h-3" />
                      <span>{dept.headEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-3 h-3" />
                      <span>{dept.headPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{dept.totalStudents}</p>
                    <p className="text-xs text-gray-600">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{dept.activeCourses}</p>
                    <p className="text-xs text-gray-600">Courses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{dept.facultyCount}</p>
                    <p className="text-xs text-gray-600">Faculty</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{dept.researchProjects}</p>
                    <p className="text-xs text-gray-600">Research</p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Average GPA:</span>
                    <span className={`font-semibold ${getPerformanceColor(dept.avgGPA, "gpa")}`}>
                      {dept.avgGPA.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completion Rate:</span>
                    <span className={`font-semibold ${getPerformanceColor(dept.completionRate, "rate")}`}>
                      {dept.completionRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Employment Rate:</span>
                    <span className={`font-semibold ${getPerformanceColor(dept.employmentRate, "rate")}`}>
                      {dept.employmentRate}%
                    </span>
                  </div>
                </div>

                {/* Programs */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Programs Offered:</h4>
                  <div className="flex flex-wrap gap-1">
                    {dept.programs.slice(0, 2).map((program, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {program}
                      </Badge>
                    ))}
                    {dept.programs.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{dept.programs.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <span>Est. {dept.established}</span>
                  </div>
                  <Link href={`/dashboard/admin/departments/${dept.id}`}>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 
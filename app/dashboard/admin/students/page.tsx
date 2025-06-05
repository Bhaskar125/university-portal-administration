"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  Search, 
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  GraduationCap,
  Eye,
  Edit,
  MoreHorizontal,
  UserPlus,
  Building
} from "lucide-react"
import Link from "next/link"

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedBatch, setSelectedBatch] = useState("all")

  // Attempt to fetch from API on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students')
        if (response.ok) {
          const data = await response.json()
          console.log('Fetched students from API:', data.students)
        }
      } catch {
        console.log('API not available, using mock data')
      }
    }
    fetchStudents()
  }, [])

  // Mock student data (will be replaced when API is connected)
  const students = [
    {
      id: "STU001",
      name: "Alice Johnson",
      email: "alice.johnson@university.edu",
      phone: "+1 (555) 123-4567",
      department: "Computer Science",
      departmentCode: "CS",
      course: "Computer Science Engineering",
      batch: "2024",
      year: "1st Year",
      enrollmentDate: "2024-08-15",
      status: "Active",
      gpa: 3.8,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: "STU002", 
      name: "Bob Smith",
      email: "bob.smith@university.edu",
      phone: "+1 (555) 234-5678",
      department: "Electrical Engineering",
      departmentCode: "EE",
      course: "Electrical Engineering",
      batch: "2023",
      year: "2nd Year",
      enrollmentDate: "2023-08-15",
      status: "Active",
      gpa: 3.6,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: "STU003",
      name: "Carol Davis",
      email: "carol.davis@university.edu", 
      phone: "+1 (555) 345-6789",
      department: "Mechanical Engineering",
      departmentCode: "ME",
      course: "Mechanical Engineering",
      batch: "2024",
      year: "1st Year",
      enrollmentDate: "2024-08-15",
      status: "Active",
      gpa: 3.9,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: "STU004",
      name: "David Wilson",
      email: "david.wilson@university.edu",
      phone: "+1 (555) 456-7890",
      department: "Computer Science",
      departmentCode: "CS",
      course: "Computer Science Engineering",
      batch: "2022",
      year: "3rd Year", 
      enrollmentDate: "2022-08-15",
      status: "Active",
      gpa: 3.7,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: "STU005",
      name: "Emma Brown",
      email: "emma.brown@university.edu",
      phone: "+1 (555) 567-8901",
      department: "Mathematics",
      departmentCode: "MATH",
      course: "Mathematics",
      batch: "2023",
      year: "2nd Year",
      enrollmentDate: "2023-08-15",
      status: "Active",
      gpa: 4.0,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: "STU006",
      name: "Frank Miller",
      email: "frank.miller@university.edu",
      phone: "+1 (555) 678-9012",
      department: "Electrical Engineering",
      departmentCode: "EE",
      course: "Electrical Engineering",
      batch: "2024",
      year: "1st Year",
      enrollmentDate: "2024-08-15",
      status: "Active",
      gpa: 3.5,
      avatar: "/api/placeholder/40/40"
    }
  ]

  const departments = [
    { name: "All Departments", code: "all" },
    { name: "Computer Science", code: "CS" },
    { name: "Electrical Engineering", code: "EE" },
    { name: "Mechanical Engineering", code: "ME" },
    { name: "Mathematics", code: "MATH" }
  ]

  const batches = [
    { name: "All Batches", code: "all" },
    { name: "2024", code: "2024" },
    { name: "2023", code: "2023" },
    { name: "2022", code: "2022" },
    { name: "2021", code: "2021" }
  ]

  // Filter students based on search and selections
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === "all" || student.departmentCode === selectedDepartment
    const matchesBatch = selectedBatch === "all" || student.batch === selectedBatch
    
    return matchesSearch && matchesDepartment && matchesBatch
  })

  // Group students by department for better organization
  const studentsByDepartment = filteredStudents.reduce((acc, student) => {
    if (!acc[student.departmentCode]) {
      acc[student.departmentCode] = []
    }
    acc[student.departmentCode].push(student)
    return acc
  }, {} as Record<string, typeof students>)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200'
      case 'graduated': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-green-600'
    if (gpa >= 3.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            Student Management
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            View and manage all students across departments and batches.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
            <Download className="w-4 h-4" />
            Export List
          </Button>
          
          <Link href="/dashboard/admin/students/new">
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <UserPlus className="w-4 h-4" />
              Add Student
            </Button>
          </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.code} value={dept.code}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.code} value={batch.code}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <span>Showing {filteredStudents.length} of {students.length} students</span>
            {(selectedDepartment !== "all" || selectedBatch !== "all" || searchTerm) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchTerm("")
                  setSelectedDepartment("all")
                  setSelectedBatch("all")
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Students List by Department */}
      {Object.keys(studentsByDepartment).length === 0 ? (
        <Card className="shadow-lg border-0">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add new students.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(studentsByDepartment).map(([deptCode, deptStudents]) => {
            const department = departments.find(d => d.code === deptCode)
            return (
              <Card key={deptCode} className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-md">
                        <Building className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {department?.name || deptCode}
                        </CardTitle>
                        <CardDescription>
                          {deptStudents.length} student{deptStudents.length !== 1 ? 's' : ''}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {deptCode}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {deptStudents.map((student) => (
                      <Card key={student.id} className="group hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                                <p className="text-sm text-gray-600">{student.id}</p>
                                <Badge variant="outline" className={`text-xs mt-1 ${getStatusColor(student.status)}`}>
                                  {student.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Link href={`/dashboard/admin/students/${student.id}`}>
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
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{student.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{student.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <BookOpen className="w-4 h-4" />
                              <span>{student.course}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <GraduationCap className="w-4 h-4" />
                              <span>Batch {student.batch} • {student.year}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                            <div className="text-sm">
                              <span className="text-gray-600">GPA: </span>
                              <span className={`font-semibold ${getGPAColor(student.gpa)}`}>
                                {student.gpa.toFixed(1)}
                              </span>
                            </div>
                            <Link href={`/dashboard/admin/students/${student.id}`}>
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
} 
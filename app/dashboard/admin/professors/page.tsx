"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter,
  Download,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Eye,
  Edit,
  MoreHorizontal,
  UserPlus,
  Building,
  Award,
  Clock
} from "lucide-react"
import Link from "next/link"

interface Professor {
  id: string
  name: string
  email: string
  phone: string
  departmentCode: string
  department: string
  specialization: string
  experience: number
  joinDate: string
  avatar?: string
  activeCourses: number
}

export default function ProfessorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedSpecialization, setSelectedSpecialization] = useState("all")

  // Empty professors array for real-time system state
  const professors: Professor[] = []

  const departments = [
    { name: "All Departments", code: "all" },
    { name: "Computer Science", code: "CS" },
    { name: "Electrical Engineering", code: "EE" },
    { name: "Mechanical Engineering", code: "ME" },
    { name: "Mathematics", code: "MATH" }
  ]

  const specializations = [
    { name: "All Specializations", code: "all" },
    { name: "Machine Learning", code: "ML" },
    { name: "Data Structures", code: "DS" },
    { name: "Database Systems", code: "DB" },
    { name: "Software Engineering", code: "SE" },
    { name: "Computer Networks", code: "CN" },
    { name: "Mathematics", code: "MATH" },
    { name: "Physics", code: "PHY" }
  ]

  // Filter professors based on search and selections
  const filteredProfessors = professors.filter(professor => {
    const matchesSearch = professor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professor?.id?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === "all" || professor?.departmentCode === selectedDepartment
    const matchesSpecialization = selectedSpecialization === "all" || professor?.specialization === selectedSpecialization
    
    return matchesSearch && matchesDepartment && matchesSpecialization
  })

  // Group professors by department
  const professorsByDepartment = filteredProfessors.reduce((acc, professor) => {
    const deptCode = professor.departmentCode
    if (!acc[deptCode]) {
      acc[deptCode] = []
    }
    acc[deptCode].push(professor)
    return acc
  }, {} as Record<string, Professor[]>)

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
            Professor Management
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            View and manage all professors across departments and specializations.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
            <Download className="w-4 h-4" />
            Export List
          </Button>
          
          <Link href="/dashboard/admin/professors/new">
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <UserPlus className="w-4 h-4" />
              Add Professor
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
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
            
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec.code} value={spec.code}>
                    {spec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Professors</p>
                <p className="text-3xl font-bold text-purple-700">{professors.length}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Departments</p>
                <p className="text-3xl font-bold text-blue-700">{departments.length - 1}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Active Courses</p>
                <p className="text-3xl font-bold text-green-700">0</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Avg Experience</p>
                <p className="text-3xl font-bold text-orange-700">N/A</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professors List */}
      {filteredProfessors.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(professorsByDepartment).map(([deptCode, deptProfessors]) => {
            const department = departments.find(d => d.code === deptCode)
            if (!department) return null

            return (
              <Card key={deptCode} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-purple-600" />
                        {department.name}
                      </CardTitle>
                      <CardDescription>
                        {deptProfessors.length} professor{deptProfessors.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-purple-700 bg-purple-100">
                      {deptCode}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deptProfessors.map((professor) => (
                      <Card key={professor.id} className="group hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-purple-300">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 ring-2 ring-purple-100">
                                <AvatarImage src={professor.avatar} alt={professor.name} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-semibold">
                                  {professor.name.split(' ').map((n: string) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                                  {professor.name}
                                </h3>
                                <p className="text-sm text-gray-600">{professor.id}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Link href={`/dashboard/admin/professors/${professor.id}`}>
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
                              <span>{professor.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{professor.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <BookOpen className="w-4 h-4" />
                              <span>{professor.specialization}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{professor.experience} years experience</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>Joined: {new Date(professor.joinDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                            <div className="text-sm">
                              <span className="text-gray-600">Courses: </span>
                              <span className="font-semibold text-purple-700">
                                {professor.activeCourses || 0}
                              </span>
                            </div>
                            <Link href={`/dashboard/admin/professors/${professor.id}`}>
                              <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
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
      ) : (
        <Card className="shadow-lg border-0">
          <CardContent className="p-12 text-center">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Professors Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedDepartment !== "all" || selectedSpecialization !== "all"
                ? "No professors match your current filters. Try adjusting your search criteria."
                : "You haven't added any professors yet. Get started by adding your first professor to the system."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {(searchTerm || selectedDepartment !== "all" || selectedSpecialization !== "all") && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedDepartment("all")
                    setSelectedSpecialization("all")
                  }}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Clear Filters
                </Button>
              )}
              <Link href="/dashboard/admin/professors/new">
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <UserPlus className="w-4 h-4" />
                  Add First Professor
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
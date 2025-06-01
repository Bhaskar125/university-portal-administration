"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Eye, Edit, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Student {
  id: string
  name: string
  rollNumber: string
  registrationNumber: string
  email: string
  department: string
  semester: number
  gpa: number
  status: "active" | "inactive" | "graduated"
  avatar?: string
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    rollNumber: "CS2021001",
    registrationNumber: "REG2021001",
    email: "john.doe@university.edu",
    department: "Computer Science",
    semester: 6,
    gpa: 3.8,
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    rollNumber: "CS2021002",
    registrationNumber: "REG2021002",
    email: "jane.smith@university.edu",
    department: "Computer Science",
    semester: 6,
    gpa: 3.9,
    status: "active",
  },
  {
    id: "3",
    name: "Mike Johnson",
    rollNumber: "CS2020001",
    registrationNumber: "REG2020001",
    email: "mike.johnson@university.edu",
    department: "Computer Science",
    semester: 8,
    gpa: 3.6,
    status: "graduated",
  },
]

export function StudentTable() {
  const [students] = useState<Student[]>(mockStudents)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: Student["status"]) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      graduated: "outline",
    } as const

    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return "text-green-600"
    if (gpa >= 3.0) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Students</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button>Add Student</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>GPA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{student.rollNumber}</TableCell>
                <TableCell className="font-mono">{student.registrationNumber}</TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>{student.semester}</TableCell>
                <TableCell className={getGPAColor(student.gpa)}>{student.gpa.toFixed(1)}</TableCell>
                <TableCell>{getStatusBadge(student.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowLeft,
  Building, 
  Users,
  BookOpen,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Award,
  Edit,
  Download,
  Eye
} from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DepartmentDetailPage({ params }: PageProps) {
  const { id } = await params

  // Mock department data - in a real app, this would come from an API
  const departmentData = {
    cs: {
      id: "cs",
      name: "Computer Science",
      code: "CS",
      type: "Engineering",
      head: "Dr. Sarah Johnson",
      headEmail: "s.johnson@university.edu",
      headPhone: "+1 (555) 123-4567",
      headImage: "/api/placeholder/80/80",
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
      description: "The Department of Computer Science is a leading institution in computing education and research, offering comprehensive programs in software engineering, artificial intelligence, data science, and cybersecurity. Our state-of-the-art facilities and experienced faculty provide students with the knowledge and skills needed to excel in the rapidly evolving technology industry.",
      programs: ["Computer Science Engineering", "Information Technology", "Software Engineering", "Data Science", "Cybersecurity"],
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      recentStudents: [
        { id: "STU001", name: "Alice Johnson", batch: "2024", gpa: 3.8, image: "/api/placeholder/40/40" },
        { id: "STU004", name: "David Wilson", batch: "2022", gpa: 3.7, image: "/api/placeholder/40/40" },
        { id: "STU007", name: "Michael Brown", batch: "2023", gpa: 3.9, image: "/api/placeholder/40/40" },
        { id: "STU010", name: "Emma Davis", batch: "2024", gpa: 3.6, image: "/api/placeholder/40/40" }
      ],
      recentCourses: [
        { id: "CS101", name: "Introduction to Computer Science", instructor: "Dr. Sarah Johnson", students: 45, capacity: 50 },
        { id: "CS201", name: "Data Structures and Algorithms", instructor: "Prof. Michael Chen", students: 38, capacity: 40 },
        { id: "CS301", name: "Database Systems", instructor: "Dr. James Brown", students: 32, capacity: 35 },
        { id: "CS401", name: "Machine Learning", instructor: "Dr. Lisa Wang", students: 28, capacity: 30 }
      ],
      faculty: [
        { name: "Dr. Sarah Johnson", position: "Department Head", specialization: "AI & Machine Learning", email: "s.johnson@university.edu" },
        { name: "Prof. Michael Chen", position: "Professor", specialization: "Software Engineering", email: "m.chen@university.edu" },
        { name: "Dr. James Brown", position: "Associate Professor", specialization: "Database Systems", email: "j.brown@university.edu" },
        { name: "Dr. Lisa Wang", position: "Assistant Professor", specialization: "Data Science", email: "l.wang@university.edu" }
      ]
    },
    ee: {
      id: "ee",
      name: "Electrical Engineering",
      code: "EE",
      type: "Engineering",
      head: "Prof. Michael Chen",
      headEmail: "m.chen@university.edu",
      headPhone: "+1 (555) 234-5678",
      headImage: "/api/placeholder/80/80",
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
      description: "The Department of Electrical Engineering focuses on cutting-edge research and education in power systems, electronics, telecommunications, and renewable energy technologies. Our graduates are well-prepared for careers in industry, research, and academia.",
      programs: ["Electrical Engineering", "Electronics Engineering", "Power Systems", "Telecommunications", "Renewable Energy"],
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50",
      recentStudents: [
        { id: "STU002", name: "Bob Smith", batch: "2023", gpa: 3.6, image: "/api/placeholder/40/40" },
        { id: "STU006", name: "Frank Miller", batch: "2024", gpa: 3.5, image: "/api/placeholder/40/40" }
      ],
      recentCourses: [
        { id: "EE101", name: "Circuit Analysis", instructor: "Dr. Emily Davis", students: 32, capacity: 35 },
        { id: "EE201", name: "Digital Electronics", instructor: "Prof. Robert Kim", students: 28, capacity: 30 }
      ],
      faculty: [
        { name: "Prof. Michael Chen", position: "Department Head", specialization: "Power Systems", email: "m.chen@university.edu" },
        { name: "Dr. Emily Davis", position: "Professor", specialization: "Circuit Design", email: "e.davis@university.edu" }
      ]
    },
    me: {
      id: "me",
      name: "Mechanical Engineering",
      code: "ME",
      type: "Engineering",
      head: "Dr. Emily Davis",
      headEmail: "e.davis@university.edu",
      headPhone: "+1 (555) 345-6789",
      headImage: "/api/placeholder/80/80",
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
      description: "The Department of Mechanical Engineering offers comprehensive programs in manufacturing, automotive, aerospace, and thermal systems engineering. Our research focuses on sustainable technologies and advanced manufacturing processes.",
      programs: ["Mechanical Engineering", "Manufacturing Engineering", "Automotive Engineering", "Aerospace Engineering", "Thermal Systems"],
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      recentStudents: [
        { id: "STU003", name: "Carol Davis", batch: "2024", gpa: 3.9, image: "/api/placeholder/40/40" }
      ],
      recentCourses: [
        { id: "ME101", name: "Engineering Mechanics", instructor: "Prof. Robert Wilson", students: 28, capacity: 30 }
      ],
      faculty: [
        { name: "Dr. Emily Davis", position: "Department Head", specialization: "Manufacturing", email: "e.davis@university.edu" }
      ]
    },
    math: {
      id: "math",
      name: "Mathematics",
      code: "MATH",
      type: "Science",
      head: "Prof. Robert Wilson",
      headEmail: "r.wilson@university.edu",
      headPhone: "+1 (555) 456-7890",
      headImage: "/api/placeholder/80/80",
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
      description: "The Department of Mathematics offers rigorous programs in pure and applied mathematics with a strong emphasis on research, analytics, and computational methods. Our graduates excel in academia, industry, and research institutions.",
      programs: ["Mathematics", "Applied Mathematics", "Statistics", "Computational Mathematics", "Mathematical Finance"],
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50",
      recentStudents: [
        { id: "STU005", name: "Emma Brown", batch: "2023", gpa: 4.0, image: "/api/placeholder/40/40" }
      ],
      recentCourses: [
        { id: "MATH201", name: "Calculus II", instructor: "Dr. Lisa Anderson", students: 22, capacity: 25 }
      ],
      faculty: [
        { name: "Prof. Robert Wilson", position: "Department Head", specialization: "Pure Mathematics", email: "r.wilson@university.edu" }
      ]
    }
  }

  const department = departmentData[id as keyof typeof departmentData]

  if (!department) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Department Not Found</h1>
          <p className="text-gray-600 mb-4">The requested department could not be found.</p>
          <Link href="/dashboard/admin/departments">
            <Button>Back to Departments</Button>
          </Link>
        </div>
      </div>
    )
  }

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

  const getCapacityColor = (enrolled: number, max: number) => {
    const percentage = (enrolled / max) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/departments">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Departments
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl bg-gradient-to-br ${department.color} shadow-lg`}>
              <Building className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                {department.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-sm">{department.code}</Badge>
                <Badge variant="outline" className="text-sm">{department.type}</Badge>
                <span className="text-gray-600">•</span>
                <span className="text-gray-600">Est. {department.established}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <Edit className="w-4 h-4" />
            Edit Department
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{department.totalStudents}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-3xl font-bold text-gray-900">{department.activeCourses}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Faculty Members</p>
                <p className="text-3xl font-bold text-gray-900">{department.facultyCount}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Research Projects</p>
                <p className="text-3xl font-bold text-gray-900">{department.researchProjects}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <Card className="shadow-lg border-0">
            <CardHeader className={`bg-gradient-to-r ${department.bgColor} border-b`}>
              <CardTitle className="text-xl font-bold text-gray-900">About the Department</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">{department.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{department.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Established {department.established}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Programs Offered */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Programs Offered</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {department.programs.map((program, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">{program}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Students */}
          <Card className="shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">Recent Students</CardTitle>
              <Link href={`/dashboard/admin/students?department=${department.code}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {department.recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.image} alt={student.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">Batch {student.batch}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">GPA</p>
                      <p className={`font-semibold ${getPerformanceColor(student.gpa, "gpa")}`}>
                        {student.gpa.toFixed(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Courses */}
          <Card className="shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">Active Courses</CardTitle>
              <Link href={`/dashboard/admin/courses?department=${department.code}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {department.recentCourses.map((course) => (
                  <div key={course.id} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{course.name}</h4>
                      <Badge variant="outline" className="text-xs">{course.id}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Instructor: {course.instructor}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Enrollment:</span>
                      <span className={`font-semibold ${getCapacityColor(course.students, course.capacity)}`}>
                        {course.students}/{course.capacity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Department Head */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Department Head</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <Avatar className="h-20 w-20 mx-auto mb-3">
                  <AvatarImage src={department.headImage} alt={department.head} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                    {department.head.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-gray-900">{department.head}</h3>
                <p className="text-sm text-gray-600">Department Head</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{department.headEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{department.headPhone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Average GPA</p>
                    <p className="text-xs text-gray-600">Department average</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getPerformanceColor(department.avgGPA, "gpa")}`}>
                      {department.avgGPA.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Completion Rate</p>
                    <p className="text-xs text-gray-600">Student success rate</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getPerformanceColor(department.completionRate, "rate")}`}>
                      {department.completionRate}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Employment Rate</p>
                    <p className="text-xs text-gray-600">Graduate placement</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getPerformanceColor(department.employmentRate, "rate")}`}>
                      {department.employmentRate}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Faculty Overview */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Faculty Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {department.faculty.slice(0, 3).map((faculty, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gray-50">
                    <h4 className="font-medium text-gray-900 text-sm">{faculty.name}</h4>
                    <p className="text-xs text-gray-600">{faculty.position}</p>
                    <p className="text-xs text-blue-600 mt-1">{faculty.specialization}</p>
                  </div>
                ))}
                {department.faculty.length > 3 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      View All Faculty ({department.faculty.length})
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  FileText,
  Users,
  MapPin,
  Bell,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  AlertCircle
} from "lucide-react"

interface CalendarEvent {
  id: number
  title: string
  type: string
  course: string
  date: string
  time: string
  duration: string
  location: string
  instructor: string
  color: string
  priority: string
  description?: string
}

// Mock calendar data
const getCalendarData = () => {
  const today = new Date()
  
  return {
    currentDate: today,
    events: [
      // Classes
      {
        id: 1,
        title: "Advanced Computer Science",
        type: "class",
        course: "CS401",
        date: "2024-12-02",
        time: "09:00",
        duration: "90",
        location: "Room 101A",
        instructor: "Prof. Smith",
        color: "bg-blue-500",
        priority: "medium"
      },
      {
        id: 2,
        title: "Data Structures & Algorithms",
        type: "class",
        course: "CS301",
        date: "2024-12-03",
        time: "14:00",
        duration: "90",
        location: "Room 205B",
        instructor: "Prof. Johnson",
        color: "bg-emerald-500",
        priority: "medium"
      },
      {
        id: 3,
        title: "Database Management",
        type: "class",
        course: "CS350",
        date: "2024-12-04",
        time: "11:00",
        duration: "90",
        location: "Lab 301",
        instructor: "Prof. Davis",
        color: "bg-purple-500",
        priority: "medium"
      },
      
      // Assignments Due
      {
        id: 4,
        title: "Final Project Proposal",
        type: "assignment",
        course: "CS401",
        date: "2024-12-05",
        time: "23:59",
        duration: "0",
        location: "Online Submission",
        instructor: "Prof. Smith",
        color: "bg-red-500",
        priority: "high",
        description: "Submit complete project proposal with timeline"
      },
      {
        id: 5,
        title: "Algorithm Analysis Report",
        type: "assignment",
        course: "CS301",
        date: "2024-12-06",
        time: "23:59",
        duration: "0",
        location: "Online Submission",
        instructor: "Prof. Johnson",
        color: "bg-red-500",
        priority: "high",
        description: "Analyze time complexity of sorting algorithms"
      },
      {
        id: 6,
        title: "Database Design Lab",
        type: "assignment",
        course: "CS350",
        date: "2024-12-28",
        time: "14:00",
        duration: "0",
        location: "Lab Submission",
        instructor: "Prof. Davis",
        color: "bg-orange-500",
        priority: "medium",
        description: "Complete library management system design"
      },
      
      // Exams
      {
        id: 7,
        title: "CS401 Final Exam",
        type: "exam",
        course: "CS401",
        date: "2024-12-15",
        time: "09:00",
        duration: "180",
        location: "Main Hall",
        instructor: "Prof. Smith",
        color: "bg-red-600",
        priority: "high",
        description: "Comprehensive final examination"
      },
      {
        id: 8,
        title: "CS301 Midterm Exam",
        type: "exam",
        course: "CS301",
        date: "2024-12-12",
        time: "14:00",
        duration: "120",
        location: "Room 205B",
        instructor: "Prof. Johnson",
        color: "bg-red-600",
        priority: "high",
        description: "Covers chapters 1-8"
      },
      
      // Events
      {
        id: 9,
        title: "CS Department Seminar",
        type: "event",
        course: "General",
        date: "2024-12-10",
        time: "16:00",
        duration: "120",
        location: "Auditorium",
        instructor: "Guest Speaker",
        color: "bg-indigo-500",
        priority: "low",
        description: "Industry trends in computer science"
      },
      {
        id: 10,
        title: "Student Project Showcase",
        type: "event",
        course: "General",
        date: "2024-12-20",
        time: "10:00",
        duration: "240",
        location: "Exhibition Hall",
        instructor: "All Faculty",
        color: "bg-green-500",
        priority: "medium",
        description: "Present your semester projects"
      },
      
      // Office Hours
      {
        id: 11,
        title: "Prof. Smith Office Hours",
        type: "office-hours",
        course: "CS401",
        date: "2024-12-03",
        time: "15:00",
        duration: "120",
        location: "Office 301",
        instructor: "Prof. Smith",
        color: "bg-gray-500",
        priority: "low",
        description: "Get help with assignments and projects"
      },
      {
        id: 12,
        title: "Prof. Johnson Office Hours",
        type: "office-hours",
        course: "CS301",
        date: "2024-12-04",
        time: "13:00",
        duration: "90",
        location: "Office 205",
        instructor: "Prof. Johnson",
        color: "bg-gray-500",
        priority: "low",
        description: "Algorithm and data structure help"
      }
    ]
  }
}

const Calendar = ({ events, currentDate, onDateClick }: { 
  events: CalendarEvent[], 
  currentDate: Date, 
  onDateClick: (date: Date) => void 
}) => {
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth())
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const getEventsForDate = (date: number) => {
    const targetDate = new Date(selectedYear, selectedMonth, date)
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === targetDate.toDateString()
    })
  }

  const isToday = (date: number) => {
    const targetDate = new Date(selectedYear, selectedMonth, date)
    return targetDate.toDateString() === currentDate.toDateString()
  }

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear)
  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-20"></div>)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDate(day)
    const today = isToday(day)
    
    days.push(
      <div
        key={day}
        className={`h-20 p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
          today ? 'bg-blue-50 border-blue-300' : ''
        }`}
        onClick={() => onDateClick(new Date(selectedYear, selectedMonth, day))}
      >
        <div className={`text-sm font-medium mb-1 ${today ? 'text-blue-700' : 'text-gray-900'}`}>
          {day}
        </div>
        <div className="space-y-1">
          {dayEvents.slice(0, 2).map((event, index) => (
            <div
              key={index}
              className={`text-xs px-1 py-0.5 rounded text-white truncate ${event.color}`}
              title={event.title}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
          )}
        </div>
      </div>
    )
  }

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[selectedMonth]} {selectedYear}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-sm font-medium text-gray-700 text-center bg-gray-50">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days}
      </div>
    </div>
  )
}

export default function StudentCalendarPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [filter, setFilter] = useState<string>("all")
  
  const calendarData = getCalendarData()
  
  const filteredEvents = calendarData.events.filter(event => {
    if (filter === "all") return true
    return event.type === filter
  })

  const todayEvents = calendarData.events.filter(event => {
    const eventDate = new Date(event.date)
    const today = new Date()
    return eventDate.toDateString() === today.toDateString()
  })

  const upcomingEvents = calendarData.events
    .filter(event => {
      const eventDate = new Date(event.date)
      const today = new Date()
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      return eventDate > today && eventDate <= weekFromNow
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const selectedDateEvents = selectedDate
    ? calendarData.events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate.toDateString() === selectedDate.toDateString()
      })
    : []

  const getEventIcon = (type: string) => {
    switch (type) {
      case "class": return <BookOpen className="w-4 h-4" />
      case "assignment": return <FileText className="w-4 h-4" />
      case "exam": return <AlertCircle className="w-4 h-4" />
      case "event": return <CalendarIcon className="w-4 h-4" />
      case "office-hours": return <Users className="w-4 h-4" />
      default: return <CalendarIcon className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-200 bg-red-50"
      case "medium": return "border-yellow-200 bg-yellow-50"
      case "low": return "border-green-200 bg-green-50"
      default: return "border-gray-200 bg-gray-50"
    }
  }

  const eventTypes = [
    { value: "all", label: "All Events" },
    { value: "class", label: "Classes" },
    { value: "assignment", label: "Assignments" },
    { value: "exam", label: "Exams" },
    { value: "event", label: "Events" },
    { value: "office-hours", label: "Office Hours" }
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
              Academic Calendar
            </h1>
            <p className="text-gray-600 mt-1">Manage your classes, assignments, and important events</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <Card className="border border-blue-200 shadow-lg bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Bell className="w-5 h-5" />
              Today&apos;s Schedule
            </CardTitle>
            <CardDescription className="text-blue-600">
              {`${todayEvents.length} ${todayEvents.length === 1 ? "event" : "events"} scheduled for today`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayEvents.map((event) => (
                <div 
                  key={event.id} 
                  className={`p-3 rounded-lg border ${event.color.replace('bg-', 'border-').replace('-500', '-200')} bg-white`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${event.color} text-white`}>
                        {getEventIcon(event.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.course} • {event.instructor}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${getPriorityColor(event.priority)} border-0 text-xs capitalize`}>
                      {event.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card className="border border-gray-200 shadow-lg">
            <CardContent className="p-0">
              <Calendar 
                events={filteredEvents} 
                currentDate={calendarData.currentDate}
                onDateClick={setSelectedDate}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card className="border border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-emerald-500" />
                Upcoming This Week
              </CardTitle>
              <CardDescription>Events in the next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-64 overflow-y-auto">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-start gap-2">
                      <div className={`p-1 rounded ${event.color} text-white`}>
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 text-sm">{event.title}</h5>
                        <p className="text-xs text-gray-600">{event.course}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming events this week</p>
              )}
            </CardContent>
          </Card>

          {/* Selected Date Events */}
          {selectedDate && (
            <Card className="border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-purple-500" />
                  {selectedDate.toLocaleDateString()}
                </CardTitle>
                <CardDescription>Events on selected date</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((event) => (
                    <div key={event.id} className="p-3 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-2">
                        <div className={`p-1 rounded ${event.color} text-white`}>
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 text-sm">{event.title}</h5>
                          <p className="text-xs text-gray-600">{event.course} • {event.instructor}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{event.time}</span>
                            <MapPin className="w-3 h-3 ml-2" />
                            <span>{event.location}</span>
                          </div>
                          {event.description && (
                            <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No events scheduled</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="border border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-orange-500" />
                Event Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {eventTypes.slice(1).map((type) => {
                const count = calendarData.events.filter(e => e.type === type.value).length
                return (
                  <div key={type.value} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getEventIcon(type.value)}
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
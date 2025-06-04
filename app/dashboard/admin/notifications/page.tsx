"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Bell,
  Search,
  Filter,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Download,
  RefreshCw,
  AlertCircle,
  Info,
  User,
  BookOpen,
  Calendar,
  GraduationCap,
  Archive
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  category: "enrollment" | "grade" | "course" | "system" | "assignment" | "general"
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
  actionUrl?: string
  user?: {
    name: string
    avatar?: string
  }
}

export default function AdminNotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Course Assignment",
      message: "You have been assigned to oversee the Advanced Mathematics course for the Fall 2024 semester. Please review the curriculum and instructor assignments.",
      type: "info",
      category: "course",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false,
      priority: "high",
      actionUrl: "/dashboard/admin/courses",
      user: {
        name: "Dr. Sarah Johnson",
        avatar: "/api/placeholder/32/32"
      }
    },
    {
      id: "2",
      title: "Grade Submission Deadline",
      message: "Reminder: Final grades for all Fall 2024 courses are due by Friday, December 15th at 11:59 PM.",
      type: "warning",
      category: "grade",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: "high"
    },
    {
      id: "3",
      title: "System Maintenance Scheduled",
      message: "The university portal will undergo scheduled maintenance on Sunday, December 17th from 2:00 AM to 6:00 AM. All services will be temporarily unavailable.",
      type: "warning",
      category: "system",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: "medium",
      actionUrl: "/dashboard/admin/settings"
    },
    {
      id: "4",
      title: "New Student Enrollment",
      message: "Alice Johnson has successfully enrolled in the Computer Science program. Please ensure all required courses are available.",
      type: "success",
      category: "enrollment",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: "medium",
      actionUrl: "/dashboard/admin/students",
      user: {
        name: "Alice Johnson",
        avatar: "/api/placeholder/32/32"
      }
    },
    {
      id: "5",
      title: "Course Evaluation Results",
      message: "Course evaluation results for Fall 2024 semester are now available for review. Overall satisfaction rate: 94.2%",
      type: "success",
      category: "course",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: "low"
    },
    {
      id: "6",
      title: "Faculty Meeting Reminder",
      message: "Monthly faculty meeting scheduled for tomorrow at 10:00 AM in Conference Room A. Agenda includes curriculum updates and budget review.",
      type: "info",
      category: "general",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: "medium"
    },
    {
      id: "7",
      title: "Database Backup Completed",
      message: "Weekly database backup completed successfully. All student and course data has been securely archived.",
      type: "success",
      category: "system",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: "low"
    },
    {
      id: "8",
      title: "Security Alert: Failed Login Attempts",
      message: "Multiple failed login attempts detected for admin account from IP 192.168.1.100. Please review security logs.",
      type: "error",
      category: "system",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: "high",
      actionUrl: "/dashboard/admin/settings"
    }
  ])

  const getNotificationIcon = (category: string, type: string) => {
    switch (category) {
      case "enrollment":
        return <User className="w-4 h-4" />
      case "grade":
        return <GraduationCap className="w-4 h-4" />
      case "course":
        return <BookOpen className="w-4 h-4" />
      case "assignment":
        return <Calendar className="w-4 h-4" />
      case "system":
        return type === "error" ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "error":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-blue-600 bg-blue-50 border-blue-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || notification.type === filterType
    const matchesCategory = filterCategory === "all" || notification.category === filterCategory
    const matchesRead = !showUnreadOnly || !notification.read

    return matchesSearch && matchesType && matchesCategory && matchesRead
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const selectedCount = selectedIds.length

  const handleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id))
    }
  }

  const handleSelectNotification = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    )
  }

  const handleMarkAsRead = (ids: string[]) => {
    setNotifications(prev => 
      prev.map(n => ids.includes(n.id) ? { ...n, read: true } : n)
    )
    setSelectedIds([])
  }

  const handleMarkAsUnread = (ids: string[]) => {
    setNotifications(prev => 
      prev.map(n => ids.includes(n.id) ? { ...n, read: false } : n)
    )
    setSelectedIds([])
  }

  const handleDeleteNotifications = (ids: string[]) => {
    setNotifications(prev => prev.filter(n => !ids.includes(n.id)))
    setSelectedIds([])
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage your administrative notifications and alerts.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {unreadCount} unread
            </Badge>
            <Badge variant="outline">
              {notifications.length} total
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
            <Download className="w-4 h-4" />
            Export
          </Button>
          
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform duration-200">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="enrollment">Enrollment</SelectItem>
                  <SelectItem value="grade">Grades</SelectItem>
                  <SelectItem value="course">Courses</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  checked={showUnreadOnly}
                  onCheckedChange={(checked) => setShowUnreadOnly(!!checked)}
                />
                <label className="text-sm">Show unread only</label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <Card className="shadow-lg border-0 border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {selectedCount} selected
                </Badge>
                <span className="text-sm text-gray-600">
                  {selectedCount === filteredNotifications.length ? "All notifications selected" : "Some notifications selected"}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(selectedIds)} className="gap-2">
                  <Eye className="w-4 h-4" />
                  Mark as Read
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleMarkAsUnread(selectedIds)} className="gap-2">
                  <EyeOff className="w-4 h-4" />
                  Mark as Unread
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteNotifications(selectedIds)} className="gap-2 text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {/* Select All */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox 
              checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium text-gray-700">
              Select All ({filteredNotifications.length})
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </div>
        </div>

        {/* Notification Items */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card key={notification.id} className={cn(
                "shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer",
                !notification.read && "bg-blue-50/30 border-blue-200",
                selectedIds.includes(notification.id) && "ring-2 ring-blue-500 ring-opacity-50"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox 
                      checked={selectedIds.includes(notification.id)}
                      onCheckedChange={() => handleSelectNotification(notification.id)}
                      className="mt-1"
                    />
                    
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 border",
                      getNotificationColor(notification.type)
                    )}>
                      {getNotificationIcon(notification.category, notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className={cn(
                          "font-semibold text-gray-900",
                          !notification.read && "font-bold"
                        )}>
                          {notification.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="outline" className={cn("text-xs", getPriorityColor(notification.priority))}>
                            {notification.priority}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {notification.user && (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                                <AvatarFallback className="bg-gray-200 text-xs">
                                  {notification.user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-500">{notification.user.name}</span>
                            </div>
                          )}
                          
                          <Badge variant="secondary" className="text-xs capitalize">
                            {notification.category}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleMarkAsRead([notification.id])}
                            className="text-xs"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            {notification.read ? "Mark Unread" : "Mark Read"}
                          </Button>
                          
                          {notification.actionUrl && (
                            <Button variant="outline" size="sm" className="text-xs">
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Archive className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterType !== "all" || filterCategory !== "all" || showUnreadOnly
                  ? "Try adjusting your filters or search terms."
                  : "You're all caught up! No notifications at this time."}
              </p>
              {(searchTerm || filterType !== "all" || filterCategory !== "all" || showUnreadOnly) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("")
                    setFilterType("all")
                    setFilterCategory("all")
                    setShowUnreadOnly(false)
                  }}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 
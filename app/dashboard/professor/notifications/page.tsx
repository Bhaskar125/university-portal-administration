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
  RefreshCw,
  AlertCircle,
  Info,
  User,
  BookOpen,
  GraduationCap,
  Archive,
  FileText,
  MessageSquare,
  Users,
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  category: "submission" | "grading" | "course" | "student" | "admin" | "general"
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
  actionUrl?: string
  courseCode?: string
  student?: {
    name: string
    avatar?: string
  }
}

export default function ProfessorNotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  const [notifications, setNotifications] = useState<Notification[]>([])

  const getNotificationIcon = (category: string) => {
    switch (category) {
      case "submission":
        return <FileText className="w-4 h-4" />
      case "grading":
        return <GraduationCap className="w-4 h-4" />
      case "course":
        return <BookOpen className="w-4 h-4" />
      case "student":
        return <User className="w-4 h-4" />
      case "admin":
        return <Info className="w-4 h-4" />
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
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.courseCode?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })))
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            Teaching Notifications
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Stay updated with student submissions, course activities, and administrative updates.
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
            <MessageSquare className="w-4 h-4" />
            Quick Reply
          </Button>
          
          <Button 
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="w-4 h-4" />
            Mark All Read
          </Button>
          
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <Plus className="w-4 h-4" />
            Create Notification
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Submissions</p>
                <p className="text-2xl font-bold text-blue-700">
                  {notifications.filter(n => n.category === "submission").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Course Updates</p>
                <p className="text-2xl font-bold text-green-700">
                  {notifications.filter(n => n.category === "course").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Student Issues</p>
                <p className="text-2xl font-bold text-purple-700">
                  {notifications.filter(n => n.category === "student").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Urgent Tasks</p>
                <p className="text-2xl font-bold text-orange-700">
                  {notifications.filter(n => n.priority === "high" && !n.read).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
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
                  <SelectItem value="submission">Submissions</SelectItem>
                  <SelectItem value="grading">Grading</SelectItem>
                  <SelectItem value="course">Course Updates</SelectItem>
                  <SelectItem value="student">Student Issues</SelectItem>
                  <SelectItem value="admin">Administrative</SelectItem>
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
                      {getNotificationIcon(notification.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className={cn(
                            "font-semibold text-gray-900",
                            !notification.read && "font-bold"
                          )}>
                            {notification.title}
                          </h3>
                          {notification.courseCode && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {notification.courseCode}
                            </Badge>
                          )}
                        </div>
                        
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
                          {notification.student && (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={notification.student.avatar} alt={notification.student.name} />
                                <AvatarFallback className="bg-gray-200 text-xs">
                                  {notification.student.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-500">{notification.student.name}</span>
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
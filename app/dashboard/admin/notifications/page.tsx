"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Calendar,
  GraduationCap,
  Archive,
  BellOff,
  Plus
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
  
  // Empty notifications array to show no notifications state
  const [notifications, setNotifications] = useState<Notification[]>([])

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
    const matchesReadStatus = !showUnreadOnly || !notification.read
    
    return matchesSearch && matchesType && matchesCategory && matchesReadStatus
  })

  const unreadCount = notifications.filter(n => !n.read).length

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
      prev.map(notification => 
        ids.includes(notification.id) 
          ? { ...notification, read: true }
          : notification
      )
    )
    setSelectedIds([])
  }

  const handleMarkAsUnread = (ids: string[]) => {
    setNotifications(prev => 
      prev.map(notification => 
        ids.includes(notification.id) 
          ? { ...notification, read: false }
          : notification
      )
    )
    setSelectedIds([])
  }

  const handleDeleteNotifications = (ids: string[]) => {
    setNotifications(prev => prev.filter(notification => !ids.includes(notification.id)))
    setSelectedIds([])
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })))
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Notifications</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor important system updates and alerts
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            {unreadCount} unread
          </Badge>
          <Button 
            variant="outline" 
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="gap-2"
          >
            <Check className="w-4 h-4" />
            Mark All Read
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Notification
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Total Notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Read</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Archive className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Archived</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="enrollment">Enrollment</SelectItem>
                <SelectItem value="grade">Grades</SelectItem>
                <SelectItem value="course">Courses</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="assignment">Assignments</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="unread-only"
                checked={showUnreadOnly}
                onCheckedChange={(checked) => setShowUnreadOnly(!!checked)}
              />
              <label htmlFor="unread-only" className="text-sm font-medium">
                Unread only
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications ({filteredNotifications.length})
            </CardTitle>
            
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkAsRead(selectedIds)}
                  className="gap-1"
                >
                  <Eye className="w-4 h-4" />
                  Mark Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkAsUnread(selectedIds)}
                  className="gap-1"
                >
                  <EyeOff className="w-4 h-4" />
                  Mark Unread
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteNotifications(selectedIds)}
                  className="gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <BellOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Notifications</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                You&apos;re all caught up! There are no notifications to display at the moment. 
                New system alerts and updates will appear here.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Notification
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.length > 0 && (
                <div className="flex items-center gap-3 pb-3 border-b">
                  <Checkbox
                    checked={selectedIds.length === filteredNotifications.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-gray-600">
                    {selectedIds.length > 0 
                      ? `${selectedIds.length} selected`
                      : "Select all"
                    }
                  </span>
                </div>
              )}
              
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 rounded-lg border transition-colors duration-200 hover:bg-gray-50",
                    !notification.read && "bg-blue-50/50 border-blue-200",
                    notification.read && "bg-white border-gray-200"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedIds.includes(notification.id)}
                      onCheckedChange={() => handleSelectNotification(notification.id)}
                    />
                    
                    <div className={cn(
                      "p-2 rounded-lg shrink-0",
                      getNotificationColor(notification.type)
                    )}>
                      {getNotificationIcon(notification.category, notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={cn(
                              "font-semibold",
                              !notification.read ? "text-gray-900" : "text-gray-700"
                            )}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            <Badge variant="outline">
                              {notification.category}
                            </Badge>
                            {notification.user && (
                              <span>from {notification.user.name}</span>
                            )}
                            <span>•</span>
                            <span>{formatTimeAgo(notification.timestamp)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {notification.actionUrl && (
                            <Button variant="outline" size="sm" className="gap-1">
                              <Eye className="w-3 h-3" />
                              View
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotifications([notification.id])}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
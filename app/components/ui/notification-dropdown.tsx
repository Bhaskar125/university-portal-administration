"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Bell,
  Eye,
  CheckCircle,
  AlertCircle,
  Info,
  User,
  BookOpen,
  Calendar,
  GraduationCap,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  category: "enrollment" | "grade" | "course" | "system" | "assignment" | "general"
  timestamp: string
  read: boolean
  actionUrl?: string
  user?: {
    name: string
    avatar?: string
  }
}

interface NotificationDropdownProps {
  notifications: Notification[]
  unreadCount: number
  viewAllUrl: string
  onNotificationClick?: (notification: Notification) => void
  onMarkAsRead?: (notificationId: string) => void
}

export function NotificationDropdown({ 
  notifications, 
  unreadCount, 
  viewAllUrl,
  onNotificationClick,
  onMarkAsRead 
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showNavigationHint, setShowNavigationHint] = useState(false)
  const router = useRouter()
  const clickTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleBellClick = (event: React.MouseEvent) => {
    event.preventDefault()
    
    if (clickTimeout.current) {
      // Double click detected
      clearTimeout(clickTimeout.current)
      clickTimeout.current = null
      setIsOpen(false)
      router.push(viewAllUrl)
    } else {
      // First click - wait for potential second click
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null
        // Single click - open dropdown (default behavior)
      }, 300)
    }
  }

  const handleBellMouseEnter = () => {
    setShowNavigationHint(true)
  }

  const handleBellMouseLeave = () => {
    setShowNavigationHint(false)
  }

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
        return "text-green-600 bg-green-50"
      case "warning":
        return "text-yellow-600 bg-yellow-50"
      case "error":
        return "text-red-600 bg-red-50"
      default:
        return "text-blue-600 bg-blue-50"
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

  const recentNotifications = notifications.slice(0, 5)

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-105 transition-all duration-200"
            onClick={handleBellClick}
            onMouseEnter={handleBellMouseEnter}
            onMouseLeave={handleBellMouseLeave}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-80 mt-2 p-0 max-h-96 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </p>
            </div>
            <Link href={viewAllUrl}>
              <Button variant="ghost" size="sm" className="gap-2 text-xs hover:bg-blue-50">
                <Eye className="w-3 h-3" />
                View All
              </Button>
            </Link>
          </div>

          {/* Quick Navigation Bar */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 border-b border-gray-100">
            <Link href={viewAllUrl}>
              <Button 
                variant="ghost" 
                className="w-full justify-between text-xs text-blue-700 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  Go to All Notifications
                </span>
                <span className="text-blue-500">→</span>
              </Button>
            </Link>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer",
                      !notification.read && "bg-blue-50/50"
                    )}
                    onClick={() => {
                      onNotificationClick?.(notification)
                      if (!notification.read) {
                        onMarkAsRead?.(notification.id)
                      }
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
                        getNotificationColor(notification.type)
                      )}>
                        {getNotificationIcon(notification.category, notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={cn(
                            "text-sm font-medium text-gray-900 line-clamp-1",
                            !notification.read && "font-semibold"
                          )}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        {notification.user && (
                          <div className="flex items-center gap-2 mt-2">
                            <Avatar className="w-4 h-4">
                              <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                              <AvatarFallback className="bg-gray-200 text-xs">
                                {notification.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500">{notification.user.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">All caught up!</h3>
                <p className="text-xs text-gray-500">No new notifications at this time.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {recentNotifications.length > 0 && (
            <div className="border-t border-gray-100 p-3">
              <Link href={viewAllUrl}>
                <Button 
                  variant="ghost" 
                  className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  View All Notifications
                </Button>
              </Link>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Navigation Hint Tooltip */}
      {showNavigationHint && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap">
          Double-click for all notifications
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      )}
    </div>
  )
} 
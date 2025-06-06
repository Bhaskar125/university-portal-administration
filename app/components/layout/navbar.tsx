"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationDropdown, type Notification } from "@/components/ui/notification-dropdown"
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Search,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/dashboard/student/courses", icon: BookOpen },
  { name: "Calendar", href: "/dashboard/student/calendar", icon: Calendar },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{
    id: string
    email: string
    role: 'admin' | 'professor' | 'student'
    firstName?: string
    lastName?: string
  } | null>(null)

  // Load user data from localStorage on component mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        // Fallback to mock data if no user is stored
        setUser({
          id: 'mock-user',
          email: 'admin@example.com',
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User'
        })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      // Fallback to mock data on error
      setUser({
        id: 'mock-user',
        email: 'admin@example.com',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User'
      })
    }
  }, [])

  // Empty notifications array for real-time system state
  const [notifications, setNotifications] = useState<Notification[]>([])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
  }

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const getNotificationUrl = () => {
    if (pathname.startsWith('/dashboard/admin')) {
      return '/dashboard/admin/notifications'
    } else if (pathname.startsWith('/dashboard/professor')) {
      return '/dashboard/professor/notifications'
    } else if (pathname.startsWith('/dashboard/student')) {
      return '/dashboard/student/notifications'
    }
    return '/dashboard/notifications'
  }

  const handleLogout = async () => {
    try {
      // Clear user data from localStorage
      localStorage.removeItem('currentUser')
      setUser(null)
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/')
    }
  }

  // Helper functions for user display
  const getUserDisplayName = () => {
    if (!user) return 'Guest User'
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0]
  }

  const getUserRole = () => {
    if (!user) return 'Guest'
    return user.role.charAt(0).toUpperCase() + user.role.slice(1)
  }

  const getUserInitials = () => {
    if (!user) return 'GU'
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    const emailName = user.email.split('@')[0]
    return emailName.length >= 2 ? emailName.slice(0, 2).toUpperCase() : emailName.toUpperCase()
  }

  const getAvatarFallbackColor = () => {
    if (!user) return 'from-gray-500 to-gray-600'
    switch (user.role) {
      case 'admin':
        return 'from-red-500 to-red-600'
      case 'professor':
        return 'from-blue-500 to-purple-500'
      case 'student':
        return 'from-green-500 to-blue-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduPortal
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Administration</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navigation.map((item) => {
                const IconComponent = item.icon
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <IconComponent 
                      className={cn(
                        "w-4 h-4 transition-all duration-200",
                        isActive 
                          ? "text-blue-600 scale-110" 
                          : "text-gray-400 group-hover:text-gray-600 group-hover:scale-105"
                      )} 
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search Button - Desktop */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-400 opacity-100">
                ⌘K
              </kbd>
            </Button>

            {/* Notifications */}
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              viewAllUrl={getNotificationUrl()}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={handleMarkAsRead}
            />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                >
                  <Avatar className="w-8 h-8 ring-2 ring-white shadow-md group-hover:scale-105 transition-transform duration-200">
                    <AvatarImage src="/api/placeholder/32/32" alt={getUserDisplayName()} />
                    <AvatarFallback className={`bg-gradient-to-br ${getAvatarFallbackColor()} text-white font-semibold text-sm`}>
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{getUserRole()}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 p-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                    <p className="text-xs leading-none text-gray-500">{user?.email || 'guest@example.com'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 rounded-lg">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 rounded-lg">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-red-50 text-red-600 rounded-lg"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/50 bg-white/90 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <IconComponent 
                    className={cn(
                      "w-5 h-5 transition-colors duration-200",
                      isActive ? "text-blue-600" : "text-gray-400"
                    )} 
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </Link>
              )
            })}
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl mt-2"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

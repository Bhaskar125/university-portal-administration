"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  MessageSquare,
  Settings,
  Search,
  Building,
  Award,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  userRole: "student" | "professor" | "admin"
}

export function Sidebar({ userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const getNavigationItems = () => {
    const commonItems = [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/search", icon: Search, label: "Search" },
    ]

    const roleSpecificItems = {
      student: [
        { href: "/grades", icon: Award, label: "My Grades" },
        { href: "/subjects", icon: BookOpen, label: "My Subjects" },
        { href: "/progress", icon: BarChart3, label: "Progress" },
        { href: "/comments", icon: MessageSquare, label: "Comments" },
      ],
      professor: [
        { href: "/students", icon: Users, label: "Students" },
        { href: "/subjects", icon: BookOpen, label: "Subjects" },
        { href: "/grades", icon: Award, label: "Grade Management" },
        { href: "/comments", icon: MessageSquare, label: "Comments" },
        { href: "/analytics", icon: BarChart3, label: "Analytics" },
      ],
      admin: [
        { href: "/users", icon: Users, label: "User Management" },
        { href: "/departments", icon: Building, label: "Departments" },
        { href: "/subjects", icon: BookOpen, label: "Subjects" },
        { href: "/reports", icon: FileText, label: "Reports" },
        { href: "/analytics", icon: BarChart3, label: "Analytics" },
      ],
    }

    return [...commonItems, ...roleSpecificItems[userRole]]
  }

  const navigationItems = getNavigationItems()

  return (
    <div className={cn("bg-white border-r border-gray-200 transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EduPortal</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  collapsed && "justify-center",
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Settings */}
        <div className="border-t p-4">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              collapsed && "justify-center",
            )}
          >
            <Settings className="h-5 w-5" />
            {!collapsed && <span>Settings</span>}
          </Link>
        </div>
      </div>
    </div>
  )
}

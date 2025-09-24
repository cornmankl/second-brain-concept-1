"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Menu, 
  X, 
  Home, 
  Inbox, 
  CheckSquare, 
  Lightbulb, 
  BookOpen, 
  Brain, 
  Target, 
  BarChart3,
  Search,
  Plus,
  Bell,
  User,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Filter,
  SortAsc,
  Calendar,
  Clock,
  Star,
  Zap,
  Heart,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  children: React.ReactNode
  title: string
  onBack?: () => void
  actions?: React.ReactNode
  className?: string
}

export function MobileNav({ children, title, onBack, actions, className }: MobileNavProps) {
  return (
    <div className={cn("flex flex-col h-screen bg-background", className)}>
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold truncate max-w-[200px]">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <MobileSearch />
          <MobileNotifications />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}

interface MobileBottomNavProps {
  currentView?: string
  onViewChange?: (view: string) => void
}

export function MobileBottomNav({ currentView = "dashboard", onViewChange }: MobileBottomNavProps) {
  const navItems = [
    { id: "dashboard", icon: Home, label: "Home" },
    { id: "inbox", icon: Inbox, label: "Inbox" },
    { id: "tasks", icon: CheckSquare, label: "Tasks" },
    { id: "ideas", icon: Lightbulb, label: "Ideas" },
    { id: "more", icon: Menu, label: "More" }
  ]

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange?.(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[60px]",
              currentView === item.id 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function MobileSearch() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-[60vh]">
        <SheetHeader>
          <SheetTitle>Search</SheetTitle>
          <SheetDescription>
            Search across all your data
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search notes, tasks, ideas..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-sm"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Recent Searches</h3>
            <div className="space-y-1">
              {["Zettelkasten method", "Atomic Habits", "React Native"].map((search, index) => (
                <button
                  key={index}
                  className="w-full text-left p-2 rounded-lg hover:bg-muted text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Quick Filters</h3>
            <div className="flex flex-wrap gap-2">
              {["Today", "This Week", "High Priority", "Active"].map((filter, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {filter}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MobileNotifications() {
  const [isOpen, setIsOpen] = useState(false)
  const notifications = [
    {
      id: "1",
      title: "Task Due Soon",
      message: "Complete project proposal - due in 2 hours",
      type: "warning" as const,
      time: "2 min ago"
    },
    {
      id: "2", 
      title: "Achievement Unlocked",
      message: "7-day exercise streak! Keep it up!",
      type: "success" as const,
      time: "1 hour ago"
    },
    {
      id: "3",
      title: "New Connection",
      message: "John connected with you on Knowledge Base",
      type: "info" as const,
      time: "3 hours ago"
    }
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-[70vh]">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Stay updated with your activities
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{notification.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                </div>
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1",
                  notification.type === "success" && "bg-green-500",
                  notification.type === "warning" && "bg-yellow-500",
                  notification.type === "info" && "bg-blue-500"
                )} />
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface MobileCardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
  onClick?: () => void
}

export function MobileCard({ children, title, subtitle, action, className, onClick }: MobileCardProps) {
  return (
    <div 
      className={cn(
        "bg-card border border-border rounded-lg p-4 transition-colors",
        onClick && "cursor-pointer hover:bg-muted/50",
        className
      )}
      onClick={onClick}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between mb-3">
          <div>
            {title && <h3 className="text-sm font-medium">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

interface MobileListItemProps {
  title: string
  subtitle?: string
  left?: React.ReactNode
  right?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function MobileListItem({ title, subtitle, left, right, onClick, className }: MobileListItemProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {left}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{title}</h4>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  )
}

interface MobileQuickActionsProps {
  actions: Array<{
    icon: React.ReactNode
    label: string
    onClick: () => void
    color?: string
  }>
}

export function MobileQuickActions({ actions }: MobileQuickActionsProps) {
  return (
    <div className="grid grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={cn(
            "flex flex-col items-center gap-2 p-3 rounded-lg transition-colors",
            action.color || "hover:bg-muted"
          )}
        >
          <div className={cn("p-2 rounded-lg", action.color || "bg-primary/10")}>
            {action.icon}
          </div>
          <span className="text-xs font-medium text-center">{action.label}</span>
        </button>
      ))}
    </div>
  )
}

interface MobileProgressProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  className?: string
}

export function MobileProgress({ value, max = 100, label, showValue = true, className }: MobileProgressProps) {
  const percentage = Math.round((value / max) * 100)

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{label}</span>
          {showValue && <span className="text-sm text-muted-foreground">{percentage}%</span>}
        </div>
      )}
      <Progress value={percentage} className="h-2" />
    </div>
  )
}

interface MobileStatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  onClick?: () => void
}

export function MobileStatCard({ title, value, subtitle, icon, trend, onClick }: MobileStatCardProps) {
  return (
    <MobileCard onClick={onClick} className="text-center">
      {icon && <div className="mb-2">{icon}</div>}
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
      {subtitle && (
        <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
      )}
      {trend && (
        <div className="flex items-center justify-center gap-1 mt-2">
          {trend.isPositive ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
          )}
          <span className={cn(
            "text-xs",
            trend.isPositive ? "text-green-500" : "text-red-500"
          )}>
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
        </div>
      )}
    </MobileCard>
  )
}

interface MobileSectionProps {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function MobileSection({ title, action, children, className }: MobileSectionProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

interface MobileTabsProps {
  tabs: Array<{
    id: string
    label: string
    count?: number
  }>
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function MobileTabs({ tabs, activeTab, onTabChange }: MobileTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
            activeTab === tab.id 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded-full",
              activeTab === tab.id 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

interface MobilePullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export function MobilePullToRefresh({ onRefresh, children }: MobilePullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    const scrollTop = e.currentTarget.scrollTop
    if (scrollTop === 0) {
      setStartY(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === 0) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY

    if (distance > 0 && distance < 100) {
      setPullDistance(distance)
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance > 50) {
      setIsRefreshing(true)
      await onRefresh()
    }
    setPullDistance(0)
    setStartY(0)
    setIsRefreshing(false)
  }

  return (
    <div
      className="relative overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      <div 
        className="flex items-center justify-center py-4 transition-transform"
        style={{ transform: `translateY(${Math.min(pullDistance - 50, 0)}px)` }}
      >
        {isRefreshing ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Refreshing...
          </div>
        ) : pullDistance > 50 ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="h-4 w-4 rotate-90" />
            Release to refresh
          </div>
        ) : pullDistance > 0 ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="h-4 w-4 rotate-90" />
            Pull to refresh
          </div>
        ) : null}
      </div>

      {children}
    </div>
  )
}

// Mobile-specific utilities
export const mobileUtils = {
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },

  isSmallScreen: () => {
    return window.innerWidth < 768
  },

  getViewportHeight: () => {
    return window.visualViewport?.height || window.innerHeight
  },

  preventZoom: () => {
    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    }
  },

  allowZoom: () => {
    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1.0'
    }
  },

  hideKeyboard: () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  },

  scrollToTop: (smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    })
  },

  vibrate: (pattern: number | number[] = 50) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }
}
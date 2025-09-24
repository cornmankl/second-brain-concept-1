"use client"

import { useState } from "react"
import { MobileNav, MobileSection, MobileStatCard, MobileQuickActions, MobileProgress, MobileCard, MobileListItem, MobilePullToRefresh } from "@/components/ui/mobile-optimized"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Plus, 
  Target, 
  TrendingUp, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Heart,
  BookOpen,
  Lightbulb,
  Inbox,
  CheckSquare,
  BarChart3,
  Star,
  Award,
  Users,
  Activity,
  ChevronRight,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileDashboard() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const quickActions = [
    {
      icon: <Plus className="h-5 w-5 text-white" />,
      label: "Capture",
      onClick: () => setCurrentView("inbox"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: <CheckSquare className="h-5 w-5 text-white" />,
      label: "Task",
      onClick: () => setCurrentView("tasks"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-white" />,
      label: "Idea",
      onClick: () => setCurrentView("ideas"),
      color: "bg-yellow-500 hover:bg-yellow-600"
    },
    {
      icon: <BookOpen className="h-5 w-5 text-white" />,
      label: "Learn",
      onClick: () => setCurrentView("knowledge"),
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ]

  const todayTasks = [
    { id: "1", title: "Morning workout", time: "7:00 AM", completed: true, energy: "medium" },
    { id: "2", title: "Team standup", time: "9:00 AM", completed: false, energy: "high" },
    { id: "3", title: "Review project proposal", time: "2:00 PM", completed: false, energy: "high" },
    { id: "4", title: "Call mom", time: "6:00 PM", completed: false, energy: "low" }
  ]

  const recentActivity = [
    { id: "1", type: "task", title: "Completed morning workout", time: "2 hours ago", icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
    { id: "2", type: "idea", title: "Added new app idea", time: "3 hours ago", icon: <Lightbulb className="h-4 w-4 text-yellow-500" /> },
    { id: "3", type: "goal", title: "Achieved 7-day streak", time: "5 hours ago", icon: <Award className="h-4 w-4 text-purple-500" /> }
  ]

  return (
    <MobileNav title="Second Brain" actions={<MobileUserMenu />}>
      <MobilePullToRefresh onRefresh={handleRefresh}>
        <div className="p-4 space-y-6">
          {/* Welcome Section */}
          <MobileSection title="Welcome back!">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold">Ready to build your better mind?</h2>
                  <p className="text-sm opacity-90">You have 5 items to process today</p>
                </div>
                <Brain className="h-8 w-8 opacity-80" />
              </div>
              <MobileProgress value={72} label="Daily Progress" showValue={false} />
            </div>
          </MobileSection>

          {/* Quick Stats */}
          <MobileSection title="Overview">
            <div className="grid grid-cols-2 gap-3">
              <MobileStatCard
                title="Tasks"
                value="12"
                subtitle="3 due today"
                icon={<CheckSquare className="h-6 w-6 text-blue-500" />}
                trend={{ value: 15, isPositive: true }}
              />
              <MobileStatCard
                title="Ideas"
                value="8"
                subtitle="2 growing"
                icon={<Lightbulb className="h-6 w-6 text-yellow-500" />}
                trend={{ value: 25, isPositive: true }}
              />
              <MobileStatCard
                title="Knowledge"
                value="24"
                subtitle="3 new connections"
                icon={<BookOpen className="h-6 w-6 text-purple-500" />}
              />
              <MobileStatCard
                title="Health Score"
                value="85%"
                subtitle="+5% this week"
                icon={<Heart className="h-6 w-6 text-red-500" />}
                trend={{ value: 5, isPositive: true }}
              />
            </div>
          </MobileSection>

          {/* Quick Actions */}
          <MobileSection title="Quick Actions">
            <MobileQuickActions actions={quickActions} />
          </MobileSection>

          {/* Today's Focus */}
          <MobileSection title="Today's Focus" action={<Button variant="ghost" size="sm">View All</Button>}>
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <MobileListItem
                  key={task.id}
                  title={task.title}
                  subtitle={task.time}
                  left={
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      task.completed && "bg-green-500",
                      !task.completed && task.energy === "high" && "bg-red-500",
                      !task.completed && task.energy === "medium" && "bg-yellow-500",
                      !task.completed && task.energy === "low" && "bg-blue-500"
                    )} />
                  }
                  right={
                    task.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />
                    )
                  }
                />
              ))}
            </div>
          </MobileSection>

          {/* Life Areas Progress */}
          <MobileSection title="Life Areas" action={<Button variant="ghost" size="sm">Details</Button>}>
            <div className="space-y-3">
              {[
                { name: "Health", score: 85, icon: <Heart className="h-4 w-4" />, color: "text-red-500" },
                { name: "Career", score: 72, icon: <Briefcase className="h-4 w-4" />, color: "text-blue-500" },
                { name: "Learning", score: 90, icon: <BookOpen className="h-4 w-4" />, color: "text-purple-500" },
                { name: "Relationships", score: 78, icon: <Users className="h-4 w-4" />, color: "text-pink-500" }
              ].map((area, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <area.icon className={cn("h-4 w-4", area.color)} />
                      <span className="text-sm font-medium">{area.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{area.score}%</span>
                  </div>
                  <MobileProgress value={area.score} showValue={false} />
                </div>
              ))}
            </div>
          </MobileSection>

          {/* Recent Activity */}
          <MobileSection title="Recent Activity">
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <MobileListItem
                  key={activity.id}
                  title={activity.title}
                  subtitle={activity.time}
                  left={activity.icon}
                  right={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
                />
              ))}
            </div>
          </MobileSection>

          {/* Upcoming Reviews */}
          <MobileSection title="Upcoming" action={<Button variant="ghost" size="sm">Calendar</Button>}>
            <div className="grid grid-cols-2 gap-3">
              <MobileCard className="text-center">
                <Calendar className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-lg font-bold">2</div>
                <div className="text-xs text-muted-foreground">Reviews Today</div>
              </MobileCard>
              <MobileCard className="text-center">
                <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-lg font-bold">5</div>
                <div className="text-xs text-muted-foreground">Cards Due</div>
              </MobileCard>
            </div>
          </MobileSection>

          {/* Quick Insights */}
          <MobileSection title="Insights">
            <div className="space-y-3">
              <MobileCard className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-green-800">Great Progress!</h4>
                    <p className="text-xs text-green-600 mt-1">You're 25% more productive this week</p>
                  </div>
                </div>
              </MobileCard>
              
              <MobileCard className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-800">Energy Peak</h4>
                    <p className="text-xs text-blue-600 mt-1">Your best focus time is 9-11 AM</p>
                  </div>
                </div>
              </MobileCard>
            </div>
          </MobileSection>
        </div>
      </MobilePullToRefresh>
    </MobileNav>
  )
}

function MobileUserMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        <User className="h-5 w-5" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b">
            <div className="text-sm font-medium">User Name</div>
            <div className="text-xs text-muted-foreground">user@example.com</div>
          </div>
          <div className="p-1">
            {[
              { label: "Profile", icon: <User className="h-4 w-4" /> },
              { label: "Settings", icon: <Activity className="h-4 w-4" /> },
              { label: "Help", icon: <AlertCircle className="h-4 w-4" /> }
            ].map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-2 p-2 text-left text-sm hover:bg-muted rounded-md"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Briefcase({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}
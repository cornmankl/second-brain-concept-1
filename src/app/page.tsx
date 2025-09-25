"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Inbox, 
  CheckSquare, 
  Lightbulb, 
  BookOpen, 
  Brain, 
  Target, 
  BarChart3,
  Menu,
  Search,
  Plus,
  Bell,
  User,
  Bot,
  Sparkles,
  MessageSquare,
  Globe,
  Smartphone,
  CheckCircle,
  QrCode
} from "lucide-react"
import { cn } from "@/lib/utils"
import { InboxView } from "@/components/inbox/inbox-view"
import { TasksView } from "@/components/tasks/tasks-view"
import { IdeasView } from "@/components/ideas/ideas-view"
import { KnowledgeView } from "@/components/knowledge/knowledge-view"
import { SpacedRepetitionView } from "@/components/spaced-repetition/spaced-repetition-view"
import { LifeAreasView } from "@/components/life-areas/life-areas-view"
import { AIAssistantView } from "@/components/ai-assistant/ai-assistant-view"
import { FloatingAIButton } from "@/components/ai-assistant/floating-ai-button"
import { WhatsAppStatusCard } from "@/components/whatsapp/whatsapp-status-card"
import { WhatsAppConnectButton } from "@/components/whatsapp/whatsapp-connect-button-simple"

const navigationItems = [
  {
    title: "Inbox",
    icon: Inbox,
    description: "Quick capture from anywhere",
    count: 5,
    color: "bg-blue-500"
  },
  {
    title: "Tasks & Projects",
    icon: CheckSquare,
    description: "GTD-style task management",
    count: 5,
    color: "bg-green-500"
  },
  {
    title: "Ideas Garden",
    icon: Lightbulb,
    description: "Incubate and develop ideas",
    count: 3,
    color: "bg-yellow-500"
  },
  {
    title: "Knowledge Base",
    icon: BookOpen,
    description: "Permanent learning repository",
    count: 4,
    color: "bg-purple-500"
  },
  {
    title: "Spaced Repetition",
    icon: Brain,
    description: "Retain information effectively",
    count: 4,
    color: "bg-red-500"
  },
  {
    title: "Life Areas",
    icon: Target,
    description: "Balanced growth areas",
    count: 2,
    color: "bg-indigo-500"
  },
  {
    title: "Reviews",
    icon: BarChart3,
    description: "Reflection and optimization",
    count: 3,
    color: "bg-pink-500"
  },
  {
    title: "AI Assistant",
    icon: Bot,
    description: "Intelligent knowledge companion",
    count: 0,
    color: "bg-gradient-to-r from-blue-500 to-purple-500"
  }
]

export default function Home() {
  const [activeView, setActiveView] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeView) {
      case "inbox":
        return <InboxView />
      case "tasks-projects":
        return <TasksView />
      case "ideas-garden":
        return <IdeasView />
      case "knowledge-base":
        return <KnowledgeView />
      case "spaced-repetition":
        return <SpacedRepetitionView />
      case "life-areas":
        return <LifeAreasView />
      case "reviews":
        return (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Reviews</h2>
            <p className="text-muted-foreground">Coming soon - Reflection and optimization system</p>
          </div>
        )
      case "ai-assistant":
        return <AIAssistantView />
      default:
        return (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Welcome to Your Second Brain</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A comprehensive system for capturing, organizing, and developing your knowledge, tasks, and ideas. 
                Build a better mind, one thought at a time.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inbox Items</CardTitle>
                  <Inbox className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{navigationItems[0].count}</div>
                  <p className="text-xs text-muted-foreground">
                    +0 from today
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{navigationItems[1].count}</div>
                  <p className="text-xs text-muted-foreground">
                    +0 due today
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ideas Growing</CardTitle>
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    +0 this week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cards to Review</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    +0 new today
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* System Overview */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">System Overview</TabsTrigger>
                <TabsTrigger value="whatsapp">WhatsApp Integration</TabsTrigger>
                <TabsTrigger value="recent">Recent Activity</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Status</CardTitle>
                      <CardDescription>
                        Overview of your second brain system
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {navigationItems.map((item) => (
                        <div key={item.title} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={cn("p-1 rounded", item.color)}>
                              <item.icon className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm">{item.title}</span>
                          </div>
                          <Badge variant="outline">{item.count} items</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>
                        Common tasks to get you started
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full justify-start" variant="outline" onClick={() => setActiveView("inbox")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Capture to Inbox
                      </Button>
                      <Button className="w-full justify-start" variant="outline" onClick={() => setActiveView("tasks-projects")}>
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Add New Task
                      </Button>
                      <Button className="w-full justify-start" variant="outline" onClick={() => setActiveView("ideas-garden")}>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Record New Idea
                      </Button>
                      <Button className="w-full justify-start" variant="outline" onClick={() => setActiveView("knowledge-base")}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Add Knowledge Item
                      </Button>
                      <Button className="w-full justify-start" variant="outline" onClick={() => setActiveView("spaced-repetition")}>
                        <Brain className="h-4 w-4 mr-2" />
                        Create SRS Card
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="whatsapp" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <WhatsAppStatusCard />
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Quick Setup Options
                        </CardTitle>
                        <CardDescription>
                          Choose your preferred WhatsApp integration method
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium">Tampermonkey Userscript</p>
                              <p className="text-xs text-muted-foreground">5-minute setup</p>
                            </div>
                          </div>
                          <Badge variant="outline">Easy</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-4 w-4 text-green-500" />
                            <div>
                              <p className="text-sm font-medium">whatsapp.web.js Server</p>
                              <p className="text-xs text-muted-foreground">Professional features</p>
                            </div>
                          </div>
                          <Badge variant="outline">Advanced</Badge>
                        </div>
                        
                        <div className="pt-2">
                          <WhatsAppConnectButton variant="default" className="w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          Available Commands
                        </CardTitle>
                        <CardDescription>
                          Use these commands in any WhatsApp chat
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            "@ai tolong buatkan saya daily schedule",
                            "!ai berikan saya 5 idea untuk project",
                            "/ai tips untuk belajar lebih efektif",
                            "ai: bantu saya solve masalah productivity",
                            "assistant: cara untuk improve communication skills",
                            "help: guide untuk personal development"
                          ].map((command, index) => (
                            <div key={index} className="p-2 bg-muted rounded text-xs font-mono">
                              {command}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <QrCode className="h-4 w-4" />
                          Features & Benefits
                        </CardTitle>
                        <CardDescription>
                          What you get with WhatsApp AI Assistant
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Real-time AI assistance in WhatsApp</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Support for Malay and English</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Group chat functionality</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Mobile-friendly access</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Integration with Second Brain system</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Cross-platform compatibility</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recent">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your latest actions across the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                      <p>No recent activity yet. Start by capturing your first item!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="upcoming">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming</CardTitle>
                    <CardDescription>
                      Tasks, reviews, and cards coming up
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                      <p>No upcoming items. Add some tasks or reviews to get started!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )
    }
  }

  const getPageTitle = () => {
    switch (activeView) {
      case "inbox": return "Inbox"
      case "tasks-projects": return "Tasks & Projects"
      case "ideas-garden": return "Ideas Garden"
      case "knowledge-base": return "Knowledge Base"
      case "spaced-repetition": return "Spaced Repetition"
      case "life-areas": return "Life Areas"
      case "reviews": return "Reviews"
      case "ai-assistant": return "AI Assistant"
      default: return "Dashboard"
    }
  }

  const getPageDescription = () => {
    switch (activeView) {
      case "inbox": return "Quick capture from anywhere"
      case "tasks-projects": return "GTD-style task management"
      case "ideas-garden": return "Incubate and develop ideas"
      case "knowledge-base": return "Permanent learning repository"
      case "spaced-repetition": return "Retain information effectively"
      case "life-areas": return "Balanced growth areas"
      case "reviews": return "Reflection and optimization"
      case "ai-assistant": return "Intelligent knowledge companion"
      default: return "Your complete second brain system"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center border-b px-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-lg font-semibold">Second Brain</h1>
                <p className="text-xs text-muted-foreground">Knowledge System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigationItems.map((item) => (
              <button
                key={item.title}
                onClick={() => setActiveView(item.title.toLowerCase().replace(" & ", "-").replace(" ", "-"))}
                className={cn(
                  "w-full flex items-center space-x-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  activeView === item.title.toLowerCase().replace(" & ", "-").replace(" ", "-") 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground"
                )}
              >
                <div className={cn("p-1 rounded", item.color)}>
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span>{item.title}</span>
                    {item.count > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.count}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">User</p>
                <p className="text-xs text-muted-foreground truncate">user@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Bar */}
        <header className="flex h-16 items-center border-b bg-background px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
              <p className="text-sm text-muted-foreground">{getPageDescription()}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              {activeView === "dashboard" && (
                <Button size="sm" onClick={() => setActiveView("inbox")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Capture
                </Button>
              )}
              {activeView === "tasks-projects" && (
                <Button size="sm" onClick={() => document.querySelector('button[aria-label="Add Task"]')?.click()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Floating AI Assistant Button */}
      <FloatingAIButton currentSection={activeView} />
    </div>
  )
}
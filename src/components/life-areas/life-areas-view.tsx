"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  Target, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Calendar,
  Star,
  Award,
  CheckCircle,
  Clock,
  Heart,
  Brain,
  DollarSign,
  Users,
  Briefcase,
  BookOpen,
  Activity,
  BarChart3,
  Settings,
  Trash2,
  Edit,
  Eye,
  CalendarDays,
  Target as TargetIcon,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

type LifeArea = "health" | "wealth" | "relationships" | "career" | "learning" | "spiritual" | "recreation" | "environment"
type ReviewType = "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
type GoalStatus = "active" | "completed" | "paused" | "cancelled"
type Priority = "low" | "medium" | "high" | "critical"

interface LifeAreaData {
  id: string
  name: string
  description: string
  color: string
  icon: any
  currentScore: number // 0-100
  targetScore: number // 0-100
  goals: Goal[]
  habits: Habit[]
  reviews: Review[]
  lastUpdated: Date
}

interface Goal {
  id: string
  title: string
  description: string
  status: GoalStatus
  priority: Priority
  targetDate?: Date
  progress: number // 0-100
  milestones: Milestone[]
  tags: string[]
  createdAt: Date
  completedAt?: Date
}

interface Habit {
  id: string
  name: string
  description: string
  frequency: "daily" | "weekly" | "monthly"
  targetCount: number
  currentStreak: number
  bestStreak: number
  completionRate: number // 0-100
  lastCompleted?: Date
  isActive: boolean
  createdAt: Date
}

interface Review {
  id: string
  type: ReviewType
  date: Date
  score: number // 0-100
  insights: string[]
  achievements: string[]
  challenges: string[]
  nextActions: string[]
  notes: string
}

interface Milestone {
  id: string
  title: string
  description: string
  targetDate: Date
  completed: boolean
  completedAt?: Date
}

const lifeAreasConfig: Record<LifeArea, Omit<LifeAreaData, 'id' | 'currentScore' | 'targetScore' | 'goals' | 'habits' | 'reviews' | 'lastUpdated'>> = {
  health: {
    name: "Health & Fitness",
    description: "Physical and mental wellbeing",
    color: "bg-red-500",
    icon: Heart
  },
  wealth: {
    name: "Wealth & Finance",
    description: "Financial stability and growth",
    color: "bg-green-500",
    icon: DollarSign
  },
  relationships: {
    name: "Relationships",
    description: "Personal and professional connections",
    color: "bg-pink-500",
    icon: Users
  },
  career: {
    name: "Career & Work",
    description: "Professional development and achievement",
    color: "bg-blue-500",
    icon: Briefcase
  },
  learning: {
    name: "Learning & Growth",
    description: "Knowledge acquisition and skill development",
    color: "bg-purple-500",
    icon: BookOpen
  },
  spiritual: {
    name: "Spiritual",
    description: "Inner peace and purpose",
    color: "bg-indigo-500",
    icon: Brain
  },
  recreation: {
    name: "Recreation & Fun",
    description: "Leisure, hobbies, and enjoyment",
    color: "bg-yellow-500",
    icon: Activity
  },
  environment: {
    name: "Environment",
    description: "Living space and surroundings",
    color: "bg-emerald-500",
    icon: Settings
  }
}

const mockLifeAreas: LifeAreaData[] = [
  {
    id: "1",
    name: "Health & Fitness",
    description: "Physical and mental wellbeing",
    color: "bg-red-500",
    icon: Heart,
    currentScore: 75,
    targetScore: 85,
    goals: [
      {
        id: "1",
        title: "Run a 5K",
        description: "Complete a 5K run in under 30 minutes",
        status: "active",
        priority: "high",
        targetDate: new Date("2024-06-01"),
        progress: 60,
        milestones: [
          { id: "1", title: "Run 1K without stopping", description: "First milestone", targetDate: new Date("2024-02-01"), completed: true, completedAt: new Date("2024-01-28") },
          { id: "2", title: "Run 3K", description: "Intermediate milestone", targetDate: new Date("2024-04-01"), completed: false }
        ],
        tags: ["fitness", "running", "health"],
        createdAt: new Date("2024-01-01")
      }
    ],
    habits: [
      {
        id: "1",
        name: "Morning Exercise",
        description: "30 minutes of exercise every morning",
        frequency: "daily",
        targetCount: 7,
        currentStreak: 12,
        bestStreak: 21,
        completionRate: 85,
        lastCompleted: new Date(),
        isActive: true,
        createdAt: new Date("2024-01-01")
      }
    ],
    reviews: [
      {
        id: "1",
        type: "weekly",
        date: new Date("2024-01-28"),
        score: 80,
        insights: ["Consistent exercise routine is working well", "Need to improve sleep schedule"],
        achievements: ["Ran 3K for the first time", "Maintained exercise streak for 2 weeks"],
        challenges: ["Some days felt too tired", "Weather affected outdoor activities"],
        nextActions: ["Adjust sleep schedule", "Plan indoor alternatives"],
        notes: "Overall good week with consistent progress."
      }
    ],
    lastUpdated: new Date("2024-01-28")
  },
  {
    id: "2",
    name: "Career & Work",
    description: "Professional development and achievement",
    color: "bg-blue-500",
    icon: Briefcase,
    currentScore: 65,
    targetScore: 80,
    goals: [
      {
        id: "2",
        title: "Learn React Native",
        description: "Complete React Native course and build a mobile app",
        status: "active",
        priority: "high",
        targetDate: new Date("2024-03-01"),
        progress: 40,
        milestones: [
          { id: "3", title: "Complete basics course", description: "Learn fundamentals", targetDate: new Date("2024-02-15"), completed: true, completedAt: new Date("2024-02-10") },
          { id: "4", title: "Build first app", description: "Create a simple mobile app", targetDate: new Date("2024-03-01"), completed: false }
        ],
        tags: ["learning", "development", "mobile"],
        createdAt: new Date("2024-01-15")
      }
    ],
    habits: [
      {
        id: "2",
        name: "Daily Coding",
        description: "Code for at least 1 hour every day",
        frequency: "daily",
        targetCount: 7,
        currentStreak: 8,
        bestStreak: 15,
        completionRate: 75,
        lastCompleted: new Date(),
        isActive: true,
        createdAt: new Date("2024-01-15")
      }
    ],
    reviews: [
      {
        id: "2",
        type: "weekly",
        date: new Date("2024-01-28"),
        score: 70,
        insights: ["Making good progress on React Native", "Need to dedicate more focused time"],
        achievements: ["Completed basics course", "Built first component"],
        challenges: ["Some days were too busy", "Debugging took longer than expected"],
        nextActions: ["Schedule dedicated coding time", "Start building the app"],
        notes: "Progress is steady but could be faster with better time management."
      }
    ],
    lastUpdated: new Date("2024-01-28")
  }
]

const statusConfig = {
  active: { color: "bg-blue-100 text-blue-800", label: "Active" },
  completed: { color: "bg-green-100 text-green-800", label: "Completed" },
  paused: { color: "bg-yellow-100 text-yellow-800", label: "Paused" },
  cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" }
}

const priorityConfig = {
  low: { color: "bg-gray-100 text-gray-800", label: "Low" },
  medium: { color: "bg-blue-100 text-blue-800", label: "Medium" },
  high: { color: "bg-orange-100 text-orange-800", label: "High" },
  critical: { color: "bg-red-100 text-red-800", label: "Critical" }
}

const reviewTypeConfig = {
  daily: { label: "Daily", color: "bg-blue-500" },
  weekly: { label: "Weekly", color: "bg-green-500" },
  monthly: { label: "Monthly", color: "bg-purple-500" },
  quarterly: { label: "Quarterly", color: "bg-orange-500" },
  yearly: { label: "Yearly", color: "bg-red-500" }
}

export function LifeAreasView() {
  const [lifeAreas, setLifeAreas] = useState<LifeAreaData[]>(mockLifeAreas)
  const [selectedArea, setSelectedArea] = useState<LifeAreaData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false)
  const [isAddHabitDialogOpen, setIsAddHabitDialogOpen] = useState(false)
  const [isAddReviewDialogOpen, setIsAddReviewDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const filteredAreas = lifeAreas.filter(area => {
    return area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           area.description.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getOverallScore = () => {
    if (lifeAreas.length === 0) return 0
    const totalScore = lifeAreas.reduce((sum, area) => sum + area.currentScore, 0)
    return Math.round(totalScore / lifeAreas.length)
  }

  const getActiveGoalsCount = () => {
    return lifeAreas.reduce((sum, area) => 
      sum + area.goals.filter(goal => goal.status === "active").length, 0
    )
  }

  const getActiveHabitsCount = () => {
    return lifeAreas.reduce((sum, area) => 
      sum + area.habits.filter(habit => habit.isActive).length, 0
    )
  }

  const getUpcomingReviews = () => {
    const today = new Date()
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return lifeAreas.flatMap(area => 
      area.reviews.filter(review => 
        review.date >= today && review.date <= weekFromNow
      ).map(review => ({ ...review, areaName: area.name }))
    )
  }

  const addNewGoal = (goalData: Partial<Goal>, areaId: string) => {
    const area = lifeAreas.find(a => a.id === areaId)
    if (!area) return

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: goalData.title || "",
      description: goalData.description || "",
      status: "active",
      priority: goalData.priority || "medium",
      targetDate: goalData.targetDate,
      progress: 0,
      milestones: [],
      tags: goalData.tags || [],
      createdAt: new Date()
    }

    setLifeAreas(lifeAreas.map(a => 
      a.id === areaId 
        ? { ...a, goals: [...a.goals, newGoal], lastUpdated: new Date() }
        : a
    ))
    setIsAddGoalDialogOpen(false)
  }

  const addNewHabit = (habitData: Partial<Habit>, areaId: string) => {
    const area = lifeAreas.find(a => a.id === areaId)
    if (!area) return

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitData.name || "",
      description: habitData.description || "",
      frequency: habitData.frequency || "daily",
      targetCount: habitData.targetCount || 7,
      currentStreak: 0,
      bestStreak: 0,
      completionRate: 0,
      isActive: true,
      createdAt: new Date()
    }

    setLifeAreas(lifeAreas.map(a => 
      a.id === areaId 
        ? { ...a, habits: [...a.habits, newHabit], lastUpdated: new Date() }
        : a
    ))
    setIsAddHabitDialogOpen(false)
  }

  const addNewReview = (reviewData: Partial<Review>, areaId: string) => {
    const area = lifeAreas.find(a => a.id === areaId)
    if (!area) return

    const newReview: Review = {
      id: Date.now().toString(),
      type: reviewData.type || "weekly",
      date: reviewData.date || new Date(),
      score: reviewData.score || 50,
      insights: reviewData.insights || [],
      achievements: reviewData.achievements || [],
      challenges: reviewData.challenges || [],
      nextActions: reviewData.nextActions || [],
      notes: reviewData.notes || ""
    }

    setLifeAreas(lifeAreas.map(a => 
      a.id === areaId 
        ? { 
            ...a, 
            reviews: [...a.reviews, newReview],
            currentScore: reviewData.score || a.currentScore,
            lastUpdated: new Date()
          }
        : a
    ))
    setIsAddReviewDialogOpen(false)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Life Areas</h1>
          <p className="text-muted-foreground">Balance and grow across all areas of your life</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsAddReviewDialogOpen(true)}>
            <CalendarDays className="h-4 w-4 mr-2" />
            New Review
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getOverallScore()}%</div>
            <p className="text-xs text-muted-foreground">
              Life balance
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <TargetIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getActiveGoalsCount()}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getActiveHabitsCount()}</div>
            <p className="text-xs text-muted-foreground">
              Being tracked
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Reviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUpcomingReviews().length}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Life Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(lifeAreasConfig).map(([key, config]) => {
          const area = lifeAreas.find(a => a.name === config.name)
          const currentScore = area?.currentScore || 0
          const targetScore = area?.targetScore || 80
          
          return (
            <Card 
              key={key} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                const existingArea = lifeAreas.find(a => a.name === config.name)
                if (existingArea) {
                  setSelectedArea(existingArea)
                } else {
                  // Create new area
                  const newArea: LifeAreaData = {
                    id: Date.now().toString(),
                    name: config.name,
                    description: config.description,
                    color: config.color,
                    icon: config.icon,
                    currentScore: 50,
                    targetScore: 80,
                    goals: [],
                    habits: [],
                    reviews: [],
                    lastUpdated: new Date()
                  }
                  setLifeAreas([...lifeAreas, newArea])
                  setSelectedArea(newArea)
                }
              }}
            >
              <CardHeader className="text-center">
                <div className={cn("p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center", config.color)}>
                  <config.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{config.name}</CardTitle>
                <CardDescription>{config.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{currentScore}% / {targetScore}%</span>
                  </div>
                  <div className="space-y-1">
                    <Progress value={currentScore} className="h-2" />
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-gray-400 h-1 rounded-full" 
                        style={{ width: `${targetScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="text-center">
                    <div className="font-medium">{area?.goals.length || 0}</div>
                    <div>Goals</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{area?.habits.length || 0}</div>
                    <div>Habits</div>
                  </div>
                </div>

                {/* Status */}
                {area && (
                  <Badge variant="outline" className="w-full justify-center">
                    {area.lastUpdated.toLocaleDateString()}
                  </Badge>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Area Detail Dialog */}
      {selectedArea && (
        <Dialog open={!!selectedArea} onOpenChange={() => setSelectedArea(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", selectedArea.color)}>
                  <selectedArea.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle>{selectedArea.name}</DialogTitle>
                  <DialogDescription>{selectedArea.description}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <AreaDetail 
              area={selectedArea}
              onUpdate={(updatedArea) => {
                setLifeAreas(lifeAreas.map(a => a.id === updatedArea.id ? updatedArea : a))
                setSelectedArea(updatedArea)
              }}
              onAddGoal={(goal) => addNewGoal(goal, selectedArea.id)}
              onAddHabit={(habit) => addNewHabit(habit, selectedArea.id)}
              onAddReview={(review) => addNewReview(review, selectedArea.id)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Quick Add Review Dialog */}
      <Dialog open={isAddReviewDialogOpen} onOpenChange={setIsAddReviewDialogOpen}>
        <DialogTrigger asChild>
          {/* This is handled by the button above */}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Life Review</DialogTitle>
            <DialogDescription>
              Add a quick review for any life area
            </DialogDescription>
          </DialogHeader>
          <QuickReviewForm 
            areas={lifeAreas}
            onSubmit={(review, areaId) => addNewReview(review, areaId)}
            onCancel={() => setIsAddReviewDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AreaDetail({ area, onUpdate, onAddGoal, onAddHabit, onAddReview }: {
  area: LifeAreaData,
  onUpdate: (area: LifeAreaData) => void,
  onAddGoal: (goal: Partial<Goal>) => void,
  onAddHabit: (habit: Partial<Habit>) => void,
  onAddReview: (review: Partial<Review>) => void
}) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Current Score: {area.currentScore}%
              </CardTitle>
              <CardDescription>
                Target: {area.targetScore}% • Last updated: {area.lastUpdated.toLocaleDateString()}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={area.currentScore} className="h-3" />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-400 h-2 rounded-full" 
                style={{ width: `${area.targetScore}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>Target: {area.targetScore}%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals ({area.goals.length})</TabsTrigger>
          <TabsTrigger value="habits">Habits ({area.habits.length})</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({area.reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Goals
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setActiveTab("goals")
                      onAddGoal({})
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {area.goals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{goal.title}</h4>
                        <Badge variant="outline" className={statusConfig[goal.status].color}>
                          {statusConfig[goal.status].label}
                        </Badge>
                      </div>
                      <Progress value={goal.progress} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">{goal.progress}% complete</p>
                    </div>
                  ))}
                  {area.goals.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      <p className="text-sm">No goals yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Habits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Active Habits
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setActiveTab("habits")
                      onAddHabit({})
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {area.habits.filter(h => h.isActive).slice(0, 3).map((habit) => (
                    <div key={habit.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{habit.name}</h4>
                        <Badge variant="outline">
                          {habit.currentStreak} day streak
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{habit.completionRate}% completion</span>
                        <span>•</span>
                        <span>Best: {habit.bestStreak} days</span>
                      </div>
                    </div>
                  ))}
                  {area.habits.filter(h => h.isActive).length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      <p className="text-sm">No active habits</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Reviews
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setActiveTab("reviews")
                    onAddReview({})
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Review
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {area.reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">
                        {review.type.charAt(0).toUpperCase() + review.type.slice(1)} Review
                      </h4>
                      <Badge variant="outline" className={reviewTypeConfig[review.type].color}>
                        {review.score}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {review.date.toLocaleDateString()}
                    </p>
                    {review.insights.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Key Insights:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {review.insights.slice(0, 2).map((insight, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-primary">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
                {area.reviews.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    <p className="text-sm">No reviews yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Goals</h3>
            <Button onClick={() => onAddGoal({})}>
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {area.goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
          
          {area.goals.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No goals yet. Create your first goal to get started!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="habits" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Habits</h3>
            <Button onClick={() => onAddHabit({})}>
              <Plus className="h-4 w-4 mr-2" />
              New Habit
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {area.habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
          
          {area.habits.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No habits yet. Create your first habit to build consistency!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Reviews</h3>
            <Button onClick={() => onAddReview({})}>
              <Plus className="h-4 w-4 mr-2" />
              New Review
            </Button>
          </div>
          
          <div className="space-y-4">
            {area.reviews
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
          </div>
          
          {area.reviews.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reviews yet. Start reviewing your progress regularly!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function GoalCard({ goal }: { goal: Goal }) {
  const StatusIcon = goal.status === "completed" ? CheckCircle : 
                    goal.status === "paused" ? Clock : 
                    goal.status === "cancelled" ? Eye : TargetIcon

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <StatusIcon className="h-5 w-5" />
              {goal.title}
            </CardTitle>
            <CardDescription>{goal.description}</CardDescription>
          </div>
          <Badge variant="outline" className={statusConfig[goal.status].color}>
            {statusConfig[goal.status].label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>

        {/* Priority */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={priorityConfig[goal.priority].color}>
            {priorityConfig[goal.priority].label}
          </Badge>
          {goal.targetDate && (
            <Badge variant="outline">
              Due: {goal.targetDate.toLocaleDateString()}
            </Badge>
          )}
        </div>

        {/* Tags */}
        {goal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {goal.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Milestones */}
        {goal.milestones.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Milestones</h4>
            <div className="space-y-1">
              {goal.milestones.slice(0, 2).map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-2 text-xs">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    milestone.completed ? "bg-green-500" : "bg-gray-300"
                  )} />
                  <span className={milestone.completed ? "line-through text-muted-foreground" : ""}>
                    {milestone.title}
                  </span>
                </div>
              ))}
              {goal.milestones.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{goal.milestones.length - 2} more milestones
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function HabitCard({ habit }: { habit: Habit }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {habit.name}
            </CardTitle>
            <CardDescription>{habit.description}</CardDescription>
          </div>
          <Badge variant={habit.isActive ? "default" : "secondary"}>
            {habit.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Streak */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{habit.currentStreak}</div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{habit.bestStreak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Completion Rate</span>
            <span>{habit.completionRate}%</span>
          </div>
          <Progress value={habit.completionRate} className="h-2" />
        </div>

        {/* Frequency */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{habit.frequency} • {habit.targetCount} times per period</span>
        </div>

        {/* Last Completed */}
        {habit.lastCompleted && (
          <div className="text-xs text-muted-foreground">
            Last completed: {habit.lastCompleted.toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {review.type.charAt(0).toUpperCase() + review.type.slice(1)} Review
            </CardTitle>
            <CardDescription>{review.date.toLocaleDateString()}</CardDescription>
          </div>
          <Badge variant="outline" className={reviewTypeConfig[review.type].color}>
            {review.score}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Overall Score</span>
            <span>{review.score}%</span>
          </div>
          <Progress value={review.score} className="h-2" />
        </div>

        {/* Insights */}
        {review.insights.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Key Insights</h4>
            <ul className="space-y-1">
              {review.insights.map((insight, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Achievements */}
        {review.achievements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Achievements</h4>
            <ul className="space-y-1">
              {review.achievements.map((achievement, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <Award className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Challenges */}
        {review.challenges.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Challenges</h4>
            <ul className="space-y-1">
              {review.challenges.map((challenge, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <Eye className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Actions */}
        {review.nextActions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Next Actions</h4>
            <ul className="space-y-1">
              {review.nextActions.map((action, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <TargetIcon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {review.notes && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Notes</h4>
            <p className="text-sm text-muted-foreground">{review.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function QuickReviewForm({ areas, onSubmit, onCancel }: {
  areas: LifeAreaData[],
  onSubmit: (review: Partial<Review>, areaId: string) => void,
  onCancel: () => void
}) {
  const [selectedAreaId, setSelectedAreaId] = useState(areas[0]?.id || "")
  const [reviewData, setReviewData] = useState({
    type: "weekly" as ReviewType,
    score: 50,
    insights: "",
    achievements: "",
    challenges: "",
    nextActions: "",
    notes: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...reviewData,
      date: new Date(),
      insights: reviewData.insights.split("\n").filter(Boolean),
      achievements: reviewData.achievements.split("\n").filter(Boolean),
      challenges: reviewData.challenges.split("\n").filter(Boolean),
      nextActions: reviewData.nextActions.split("\n").filter(Boolean)
    }, selectedAreaId)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="area">Life Area</Label>
        <Select value={selectedAreaId} onValueChange={setSelectedAreaId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a life area" />
          </SelectTrigger>
          <SelectContent>
            {areas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Review Type</Label>
          <Select value={reviewData.type} onValueChange={(value: ReviewType) => setReviewData({ ...reviewData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(reviewTypeConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="score">Score (0-100)</Label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              id="score"
              min="0"
              max="100"
              value={reviewData.score}
              onChange={(e) => setReviewData({ ...reviewData, score: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm font-medium w-12">{reviewData.score}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="insights">Key Insights (one per line)</Label>
          <Textarea
            id="insights"
            value={reviewData.insights}
            onChange={(e) => setReviewData({ ...reviewData, insights: e.target.value })}
            placeholder="Insight 1&#10;Insight 2&#10;Insight 3"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="achievements">Achievements (one per line)</Label>
          <Textarea
            id="achievements"
            value={reviewData.achievements}
            onChange={(e) => setReviewData({ ...reviewData, achievements: e.target.value })}
            placeholder="Achievement 1&#10;Achievement 2&#10;Achievement 3"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="challenges">Challenges (one per line)</Label>
          <Textarea
            id="challenges"
            value={reviewData.challenges}
            onChange={(e) => setReviewData({ ...reviewData, challenges: e.target.value })}
            placeholder="Challenge 1&#10;Challenge 2&#10;Challenge 3"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nextActions">Next Actions (one per line)</Label>
          <Textarea
            id="nextActions"
            value={reviewData.nextActions}
            onChange={(e) => setReviewData({ ...reviewData, nextActions: e.target.value })}
            placeholder="Action 1&#10;Action 2&#10;Action 3"
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={reviewData.notes}
          onChange={(e) => setReviewData({ ...reviewData, notes: e.target.value })}
          placeholder="Any additional notes or reflections..."
          rows={2}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Save Review
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
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
  Lightbulb, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Seedling,
  TreePine,
  Calendar,
  Star,
  Archive,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

type IdeaStatus = "seed" | "sprout" | "sapling" | "tree" | "archived"
type IdeaPriority = "low" | "medium" | "high" | "critical"
type IdeaCategory = "business" | "personal" | "creative" | "technical" | "social" | "health" | "learning"

interface Idea {
  id: string
  title: string
  description: string
  status: IdeaStatus
  priority: IdeaPriority
  category: IdeaCategory
  impact: number // 1-10
  effort: number // 1-10
  tags: string[]
  createdAt: Date
  updatedAt: Date
  estimatedValue?: string
  nextMilestone?: string
  connections?: string[]
}

const mockIdeas: Idea[] = [
  {
    id: "1",
    title: "AI-powered task management app",
    description: "An intelligent task manager that learns from user behavior and automatically prioritizes tasks based on energy levels and context.",
    status: "sprout",
    priority: "high",
    category: "technical",
    impact: 9,
    effort: 8,
    tags: ["AI", "productivity", "mobile"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    estimatedValue: "$50K - $100K",
    nextMilestone: "Create MVP prototype"
  },
  {
    id: "2",
    title: "Community garden network",
    description: "A platform connecting people with unused garden space to those who want to grow food but lack space.",
    status: "seed",
    priority: "medium",
    category: "social",
    impact: 7,
    effort: 6,
    tags: ["community", "sustainability", "food"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    estimatedValue: "Social impact",
    nextMilestone: "Research local regulations"
  },
  {
    id: "3",
    title: "Digital decluttering service",
    description: "Help people organize their digital lives - photos, documents, emails - using AI and smart categorization.",
    status: "sapling",
    priority: "medium",
    category: "business",
    impact: 6,
    effort: 5,
    tags: ["organization", "AI", "service"],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-18"),
    estimatedValue: "$20K - $40K",
    nextMilestone: "Build service framework"
  }
]

const statusConfig = {
  seed: { icon: Seedling, color: "bg-green-500", label: "Seed", description: "New idea, needs exploration" },
  sprout: { icon: TreePine, color: "bg-blue-500", label: "Sprout", description: "Developing, gathering resources" },
  sapling: { icon: TrendingUp, color: "bg-purple-500", label: "Sapling", description: "Growing, making progress" },
  tree: { icon: Star, color: "bg-yellow-500", label: "Tree", description: "Mature, ready to harvest" },
  archived: { icon: Archive, color: "bg-gray-500", label: "Archived", description: "Saved for future reference" }
}

const priorityConfig = {
  low: { color: "bg-gray-100 text-gray-800", label: "Low" },
  medium: { color: "bg-blue-100 text-blue-800", label: "Medium" },
  high: { color: "bg-orange-100 text-orange-800", label: "High" },
  critical: { color: "bg-red-100 text-red-800", label: "Critical" }
}

const categoryConfig = {
  business: { label: "Business", color: "bg-blue-500" },
  personal: { label: "Personal", color: "bg-green-500" },
  creative: { label: "Creative", color: "bg-purple-500" },
  technical: { label: "Technical", color: "bg-orange-500" },
  social: { label: "Social", color: "bg-pink-500" },
  health: { label: "Health", color: "bg-red-500" },
  learning: { label: "Learning", color: "bg-indigo-500" }
}

export function IdeasView() {
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<IdeaStatus | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<IdeaCategory | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<IdeaPriority | "all">("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "matrix">("grid")

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || idea.status === statusFilter
    const matchesCategory = categoryFilter === "all" || idea.category === categoryFilter
    const matchesPriority = priorityFilter === "all" || idea.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  const getIdeasByStatus = (status: IdeaStatus) => {
    return filteredIdeas.filter(idea => idea.status === status)
  }

  const getImpactEffortQuadrant = (impact: number, effort: number) => {
    if (impact >= 7 && effort <= 4) return "quick-wins"
    if (impact >= 7 && effort > 4) return "major-projects"
    if (impact < 7 && effort <= 4) return "fill-ins"
    return "thankless-tasks"
  }

  const getQuadrantIdeas = (quadrant: string) => {
    return filteredIdeas.filter(idea => getImpactEffortQuadrant(idea.impact, idea.effort) === quadrant)
  }

  const getStatusProgress = (status: IdeaStatus) => {
    const progress = {
      seed: 0,
      sprout: 25,
      sapling: 50,
      tree: 75,
      archived: 100
    }
    return progress[status]
  }

  const addNewIdea = (ideaData: Partial<Idea>) => {
    const newIdea: Idea = {
      id: Date.now().toString(),
      title: ideaData.title || "",
      description: ideaData.description || "",
      status: "seed",
      priority: ideaData.priority || "medium",
      category: ideaData.category || "personal",
      impact: ideaData.impact || 5,
      effort: ideaData.effort || 5,
      tags: ideaData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedValue: ideaData.estimatedValue,
      nextMilestone: ideaData.nextMilestone
    }
    setIdeas([...ideas, newIdea])
    setIsAddDialogOpen(false)
  }

  const updateIdeaStatus = (id: string, newStatus: IdeaStatus) => {
    setIdeas(ideas.map(idea => 
      idea.id === id 
        ? { ...idea, status: newStatus, updatedAt: new Date() }
        : idea
    ))
  }

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(idea => idea.id !== id))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ideas Garden</h1>
          <p className="text-muted-foreground">Incubate and develop your ideas with impact/effort analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === "matrix" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("matrix")}
          >
            Impact Matrix
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Idea
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Plant New Idea</DialogTitle>
                <DialogDescription>
                  Capture a new idea to start growing in your garden
                </DialogDescription>
              </DialogHeader>
              <AddIdeaForm onSubmit={addNewIdea} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ideas.length}</div>
            <p className="text-xs text-muted-foreground">
              +{ideas.filter(i => new Date(i.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready to Grow</CardTitle>
            <Seedling className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getIdeasByStatus("seed").length}</div>
            <p className="text-xs text-muted-foreground">
              Seeds waiting
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getIdeasByStatus("sprout").length + getIdeasByStatus("sapling").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Actively growing
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mature Ideas</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getIdeasByStatus("tree").length}</div>
            <p className="text-xs text-muted-foreground">
              Ready to harvest
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value: IdeaStatus | "all") => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={(value: IdeaCategory | "all") => setCategoryFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={(value: IdeaPriority | "all") => setPriorityFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {Object.entries(priorityConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {viewMode === "grid" ? (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All ({filteredIdeas.length})</TabsTrigger>
            <TabsTrigger value="seed">Seeds ({getIdeasByStatus("seed").length})</TabsTrigger>
            <TabsTrigger value="sprout">Sprouts ({getIdeasByStatus("sprout").length})</TabsTrigger>
            <TabsTrigger value="sapling">Saplings ({getIdeasByStatus("sapling").length})</TabsTrigger>
            <TabsTrigger value="tree">Trees ({getIdeasByStatus("tree").length})</TabsTrigger>
            <TabsTrigger value="archived">Archived ({getIdeasByStatus("archived").length})</TabsTrigger>
          </TabsList>

          {Object.keys(statusConfig).map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getIdeasByStatus(status as IdeaStatus).map((idea) => (
                  <IdeaCard 
                    key={idea.id} 
                    idea={idea} 
                    onStatusChange={updateIdeaStatus}
                    onDelete={deleteIdea}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <ImpactMatrix ideas={filteredIdeas} />
      )}
    </div>
  )
}

function IdeaCard({ idea, onStatusChange, onDelete }: { 
  idea: Idea, 
  onStatusChange: (id: string, status: IdeaStatus) => void,
  onDelete: (id: string) => void 
}) {
  const StatusIcon = statusConfig[idea.status].icon

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{idea.title}</CardTitle>
            <CardDescription className="mt-1">
              {idea.description.length > 100 
                ? `${idea.description.substring(0, 100)}...` 
                : idea.description}
            </CardDescription>
          </div>
          <div className={cn("p-2 rounded-lg", statusConfig[idea.status].color)}>
            <StatusIcon className="h-4 w-4 text-white" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Growth Progress</span>
            <span>{statusConfig[idea.status].label}</span>
          </div>
          <Progress value={getStatusProgress(idea.status)} className="h-2" />
        </div>

        {/* Impact/Effort */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Impact:</span>
            <div className="flex items-center gap-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${idea.impact * 10}%` }}
                />
              </div>
              <span className="text-xs font-medium w-8">{idea.impact}/10</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Effort:</span>
            <div className="flex items-center gap-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${idea.effort * 10}%` }}
                />
              </div>
              <span className="text-xs font-medium w-8">{idea.effort}/10</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {idea.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Metadata */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={priorityConfig[idea.priority].color}>
              {priorityConfig[idea.priority].label}
            </Badge>
            <Badge variant="outline">
              {categoryConfig[idea.category].label}
            </Badge>
          </div>
          {idea.estimatedValue && (
            <div>Estimated Value: {idea.estimatedValue}</div>
          )}
          {idea.nextMilestone && (
            <div>Next: {idea.nextMilestone}</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Select 
            value={idea.status} 
            onValueChange={(value: IdeaStatus) => onStatusChange(idea.id, value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label} - {config.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDelete(idea.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ImpactMatrix({ ideas }: { ideas: Idea[] }) {
  const quadrants = [
    { id: "quick-wins", title: "Quick Wins", description: "High Impact, Low Effort", color: "bg-green-100 border-green-300" },
    { id: "major-projects", title: "Major Projects", description: "High Impact, High Effort", color: "bg-blue-100 border-blue-300" },
    { id: "fill-ins", title: "Fill-ins", description: "Low Impact, Low Effort", color: "bg-yellow-100 border-yellow-300" },
    { id: "thankless-tasks", title: "Reconsider", description: "Low Impact, High Effort", color: "bg-red-100 border-red-300" }
  ]

  const getQuadrantIdeas = (quadrantId: string) => {
    return ideas.filter(idea => {
      if (quadrantId === "quick-wins") return idea.impact >= 7 && idea.effort <= 4
      if (quadrantId === "major-projects") return idea.impact >= 7 && idea.effort > 4
      if (quadrantId === "fill-ins") return idea.impact < 7 && idea.effort <= 4
      return idea.impact < 7 && idea.effort > 4
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Impact/Effort Matrix</h3>
        <p className="text-muted-foreground">Visualize your ideas by impact vs effort to prioritize effectively</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((quadrant) => (
          <Card key={quadrant.id} className={cn("border-2", quadrant.color)}>
            <CardHeader>
              <CardTitle className="text-lg">{quadrant.title}</CardTitle>
              <CardDescription>{quadrant.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {getQuadrantIdeas(quadrant.id).map((idea) => (
                  <div key={idea.id} className="p-3 bg-white rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{idea.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {idea.description.length > 60 
                            ? `${idea.description.substring(0, 60)}...` 
                            : idea.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            Impact: {idea.impact}/10
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Effort: {idea.effort}/10
                          </Badge>
                        </div>
                      </div>
                      <div className={cn("p-1 rounded", statusConfig[idea.status].color)}>
                        {(() => {
                          const Icon = statusConfig[idea.status].icon
                          return <Icon className="h-3 w-3 text-white" />
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
                {getQuadrantIdeas(quadrant.id).length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    <p className="text-sm">No ideas in this quadrant</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AddIdeaForm({ onSubmit }: { onSubmit: (idea: Partial<Idea>) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as IdeaPriority,
    category: "personal" as IdeaCategory,
    impact: 5,
    effort: 5,
    tags: "",
    estimatedValue: "",
    nextMilestone: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Idea Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter your idea title..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your idea in detail..."
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value: IdeaPriority) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(priorityConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value: IdeaCategory) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="impact">Impact (1-10)</Label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              id="impact"
              min="1"
              max="10"
              value={formData.impact}
              onChange={(e) => setFormData({ ...formData, impact: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm font-medium w-8">{formData.impact}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="effort">Effort (1-10)</Label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              id="effort"
              min="1"
              max="10"
              value={formData.effort}
              onChange={(e) => setFormData({ ...formData, effort: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm font-medium w-8">{formData.effort}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="tag1, tag2, tag3..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimatedValue">Estimated Value</Label>
          <Input
            id="estimatedValue"
            value={formData.estimatedValue}
            onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
            placeholder="e.g., $10K - $20K"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nextMilestone">Next Milestone</Label>
          <Input
            id="nextMilestone"
            value={formData.nextMilestone}
            onChange={(e) => setFormData({ ...formData, nextMilestone: e.target.value })}
            placeholder="Next step..."
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Plant Idea
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onSubmit({})}
        >
          Quick Add
        </Button>
      </div>
    </form>
  )
}

function getStatusProgress(status: IdeaStatus) {
  const progress = {
    seed: 0,
    sprout: 25,
    sapling: 50,
    tree: 75,
    archived: 100
  }
  return progress[status]
}
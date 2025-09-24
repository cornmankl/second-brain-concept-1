"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Clock,
  Target,
  Brain,
  Zap,
  Battery,
  Home,
  Briefcase,
  Smartphone,
  ShoppingBag,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  name: string
  status: "NOT_STARTED" | "IN_PROGRESS" | "BLOCKED" | "COMPLETE" | "CANCELLED"
  type: "TASK" | "PROJECT" | "MILESTONE"
  priority: "P1_CRITICAL" | "P2_HIGH" | "P3_MEDIUM" | "P4_LOW"
  dueDate?: Date
  energyRequired: "HIGH_FOCUS" | "MEDIUM" | "LOW"
  context: string[]
  timeEstimate?: number
  actualTime?: number
  nextAction?: string
  notes?: string
  createdAt: Date
  projectId?: string
  subtasks?: Task[]
}

const statusIcons = {
  NOT_STARTED: CheckSquare,
  IN_PROGRESS: Play,
  BLOCKED: Pause,
  COMPLETE: CheckCircle2,
  CANCELLED: Trash2
}

const statusColors = {
  NOT_STARTED: "bg-gray-500",
  IN_PROGRESS: "bg-blue-500",
  BLOCKED: "bg-red-500",
  COMPLETE: "bg-green-500",
  CANCELLED: "bg-gray-400"
}

const priorityColors = {
  P1_CRITICAL: "bg-red-500",
  P2_HIGH: "bg-orange-500",
  P3_MEDIUM: "bg-yellow-500",
  P4_LOW: "bg-green-500"
}

const priorityLabels = {
  P1_CRITICAL: "P1-Critical",
  P2_HIGH: "P2-High",
  P3_MEDIUM: "P3-Medium",
  P4_LOW: "P4-Low"
}

const energyIcons = {
  HIGH_FOCUS: Brain,
  MEDIUM: Battery,
  LOW: Zap
}

const energyColors = {
  HIGH_FOCUS: "bg-red-500",
  MEDIUM: "bg-yellow-500",
  LOW: "bg-green-500"
}

const energyLabels = {
  HIGH_FOCUS: "🧠 High Focus",
  MEDIUM: "💪 Medium",
  LOW: "🎮 Low"
}

const contextIcons = {
  "@Home": Home,
  "@Office": Briefcase,
  "@Computer": Smartphone,
  "@Phone": Smartphone,
  "@Errands": ShoppingBag
}

const mockTasks: Task[] = [
  {
    id: "1",
    name: "Complete project proposal",
    status: "IN_PROGRESS",
    type: "TASK",
    priority: "P1_CRITICAL",
    dueDate: new Date("2024-01-16"),
    energyRequired: "HIGH_FOCUS",
    context: ["@Office", "@Computer"],
    timeEstimate: 120,
    nextAction: "Write executive summary",
    notes: "Need to include budget estimates and timeline",
    createdAt: new Date("2024-01-10")
  },
  {
    id: "2",
    name: "Website Redesign Project",
    status: "IN_PROGRESS",
    type: "PROJECT",
    priority: "P2_HIGH",
    dueDate: new Date("2024-01-31"),
    energyRequired: "MEDIUM",
    context: ["@Office", "@Computer"],
    timeEstimate: 2400,
    nextAction: "Review design mockups",
    createdAt: new Date("2024-01-05"),
    subtasks: [
      {
        id: "2-1",
        name: "Create wireframes",
        status: "COMPLETE",
        type: "TASK",
        priority: "P2_HIGH",
        energyRequired: "HIGH_FOCUS",
        context: ["@Office", "@Computer"],
        timeEstimate: 480,
        actualTime: 420,
        createdAt: new Date("2024-01-06"),
        projectId: "2"
      },
      {
        id: "2-2",
        name: "Design mockups",
        status: "IN_PROGRESS",
        type: "TASK",
        priority: "P2_HIGH",
        energyRequired: "HIGH_FOCUS",
        context: ["@Office", "@Computer"],
        timeEstimate: 720,
        createdAt: new Date("2024-01-08"),
        projectId: "2"
      }
    ]
  },
  {
    id: "3",
    name: "Review quarterly reports",
    status: "NOT_STARTED",
    type: "TASK",
    priority: "P3_MEDIUM",
    dueDate: new Date("2024-01-20"),
    energyRequired: "MEDIUM",
    context: ["@Office", "@Computer"],
    timeEstimate: 90,
    nextAction: "Download reports from drive",
    createdAt: new Date("2024-01-12")
  },
  {
    id: "4",
    name: "Team meeting preparation",
    status: "BLOCKED",
    type: "TASK",
    priority: "P2_HIGH",
    dueDate: new Date("2024-01-17"),
    energyRequired: "LOW",
    context: ["@Office"],
    timeEstimate: 60,
    notes: "Waiting for agenda from manager",
    createdAt: new Date("2024-01-11")
  },
  {
    id: "5",
    name: "Grocery shopping",
    status: "NOT_STARTED",
    type: "TASK",
    priority: "P4_LOW",
    dueDate: new Date("2024-01-16"),
    energyRequired: "LOW",
    context: ["@Errands"],
    timeEstimate: 45,
    nextAction: "Create shopping list",
    createdAt: new Date("2024-01-13")
  }
]

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedEnergy, setSelectedEnergy] = useState<string>("all")
  const [selectedContext, setSelectedContext] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    name: "",
    type: "TASK" as const,
    priority: "P3_MEDIUM" as const,
    energyRequired: "MEDIUM" as const,
    context: [] as string[],
    timeEstimate: "",
    dueDate: "",
    nextAction: "",
    notes: ""
  })

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.nextAction && task.nextAction.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority
    const matchesEnergy = selectedEnergy === "all" || task.energyRequired === selectedEnergy
    const matchesContext = selectedContext === "all" || task.context.includes(selectedContext)
    
    return matchesSearch && matchesStatus && matchesPriority && matchesEnergy && matchesContext
  })

  const todaysTasks = tasks.filter(task => {
    const today = new Date()
    return task.dueDate && task.dueDate.toDateString() === today.toDateString()
  })

  const inProgressTasks = tasks.filter(task => task.status === "IN_PROGRESS")
  const quickWins = tasks.filter(task => 
    task.timeEstimate && task.timeEstimate <= 30 && task.status === "NOT_STARTED"
  )

  const projects = tasks.filter(task => task.type === "PROJECT")

  const calculateProjectProgress = (project: Task) => {
    if (!project.subtasks || project.subtasks.length === 0) return 0
    const completed = project.subtasks.filter(subtask => subtask.status === "COMPLETE").length
    return Math.round((completed / project.subtasks.length) * 100)
  }

  const handleAddTask = () => {
    if (!newTask.name.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      name: newTask.name,
      status: "NOT_STARTED",
      type: newTask.type,
      priority: newTask.priority,
      energyRequired: newTask.energyRequired,
      context: newTask.context,
      timeEstimate: newTask.timeEstimate ? parseInt(newTask.timeEstimate) : undefined,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      nextAction: newTask.nextAction || undefined,
      notes: newTask.notes || undefined,
      createdAt: new Date()
    }

    setTasks([task, ...tasks])
    setNewTask({
      name: "",
      type: "TASK",
      priority: "P3_MEDIUM",
      energyRequired: "MEDIUM",
      context: [],
      timeEstimate: "",
      dueDate: "",
      nextAction: "",
      notes: ""
    })
    setIsAddDialogOpen(false)
  }

  const handleUpdateTaskStatus = (taskId: string, status: Task["status"]) => {
    setTasks(tasks => 
      tasks.map(task => 
        task.id === taskId ? { ...task, status } : task
      )
    )
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks => tasks.filter(task => task.id !== taskId))
  }

  const getStatusIcon = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons] || CheckSquare
    return <Icon className="h-4 w-4" />
  }

  const getEnergyIcon = (energy: string) => {
    const Icon = energyIcons[energy as keyof typeof energyIcons] || Battery
    return <Icon className="h-4 w-4" />
  }

  const getContextIcon = (context: string) => {
    const Icon = contextIcons[context as keyof typeof contextIcons] || Home
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks & Projects</h1>
          <p className="text-muted-foreground">
            GTD-style task management • {inProgressTasks.length} in progress
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task or project with GTD methodology.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="text-sm font-medium">Task Name *</label>
                <Input
                  placeholder="What needs to be done?"
                  value={newTask.name}
                  onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select value={newTask.type} onValueChange={(value) => setNewTask(prev => ({ ...prev, type: value as any }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TASK">Task</SelectItem>
                      <SelectItem value="PROJECT">Project</SelectItem>
                      <SelectItem value="MILESTONE">Milestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as any }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P1_CRITICAL">P1-Critical</SelectItem>
                      <SelectItem value="P2_HIGH">P2-High</SelectItem>
                      <SelectItem value="P3_MEDIUM">P3-Medium</SelectItem>
                      <SelectItem value="P4_LOW">P4-Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Energy Required</label>
                  <Select value={newTask.energyRequired} onValueChange={(value) => setNewTask(prev => ({ ...prev, energyRequired: value as any }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIGH_FOCUS">🧠 High Focus</SelectItem>
                      <SelectItem value="MEDIUM">💪 Medium</SelectItem>
                      <SelectItem value="LOW">🎮 Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Time Estimate (min)</label>
                  <Input
                    type="number"
                    placeholder="60"
                    value={newTask.timeEstimate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, timeEstimate: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Context</label>
                  <Select onValueChange={(value) => setNewTask(prev => ({ ...prev, context: prev.context.includes(value) ? prev.context.filter(c => c !== value) : [...prev.context, value] }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select contexts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="@Home">@Home</SelectItem>
                      <SelectItem value="@Office">@Office</SelectItem>
                      <SelectItem value="@Computer">@Computer</SelectItem>
                      <SelectItem value="@Phone">@Phone</SelectItem>
                      <SelectItem value="@Errands">@Errands</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newTask.context.map(context => (
                      <Badge key={context} variant="secondary" className="text-xs">
                        {context}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Next Action</label>
                <Input
                  placeholder="What's the very next physical action?"
                  value={newTask.nextAction}
                  onChange={(e) => setNewTask(prev => ({ ...prev, nextAction: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  placeholder="Additional details..."
                  value={newTask.notes}
                  onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddTask} className="flex-1">
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{inProgressTasks.length}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{todaysTasks.length}</p>
                <p className="text-xs text-muted-foreground">Due Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{quickWins.length}</p>
                <p className="text-xs text-muted-foreground">Quick Wins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="COMPLETE">Complete</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="P1_CRITICAL">P1-Critical</SelectItem>
                  <SelectItem value="P2_HIGH">P2-High</SelectItem>
                  <SelectItem value="P3_MEDIUM">P3-Medium</SelectItem>
                  <SelectItem value="P4_LOW">P4-Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedEnergy} onValueChange={setSelectedEnergy}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Energy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Energy</SelectItem>
                  <SelectItem value="HIGH_FOCUS">🧠 High Focus</SelectItem>
                  <SelectItem value="MEDIUM">💪 Medium</SelectItem>
                  <SelectItem value="LOW">🎮 Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedContext} onValueChange={setSelectedContext}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Context" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Context</SelectItem>
                  <SelectItem value="@Home">@Home</SelectItem>
                  <SelectItem value="@Office">@Office</SelectItem>
                  <SelectItem value="@Computer">@Computer</SelectItem>
                  <SelectItem value="@Phone">@Phone</SelectItem>
                  <SelectItem value="@Errands">@Errands</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="today">Today's Focus ({todaysTasks.length})</TabsTrigger>
          <TabsTrigger value="energy">By Energy</TabsTrigger>
          <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
          <TabsTrigger value="quick-wins">Quick Wins ({quickWins.length})</TabsTrigger>
          <TabsTrigger value="all">All Tasks ({filteredTasks.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today">
          <TaskListView 
            tasks={todaysTasks} 
            onUpdateStatus={handleUpdateTaskStatus}
            onDelete={handleDeleteTask}
            getStatusIcon={getStatusIcon}
            getEnergyIcon={getEnergyIcon}
            getContextIcon={getContextIcon}
            calculateProjectProgress={calculateProjectProgress}
          />
        </TabsContent>
        
        <TabsContent value="energy">
          <div className="space-y-6">
            {Object.entries(energyLabels).map(([energyKey, energyLabel]) => {
              const energyTasks = tasks.filter(task => task.energyRequired === energyKey)
              return (
                <div key={energyKey}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    {getEnergyIcon(energyKey)}
                    {energyLabel}
                  </h3>
                  <TaskListView 
                    tasks={energyTasks} 
                    onUpdateStatus={handleUpdateTaskStatus}
                    onDelete={handleDeleteTask}
                    getStatusIcon={getStatusIcon}
                    getEnergyIcon={getEnergyIcon}
                    getContextIcon={getContextIcon}
                    calculateProjectProgress={calculateProjectProgress}
                  />
                </div>
              )
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="projects">
          <div className="space-y-4">
            {projects.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                  <p className="text-muted-foreground">
                    Create your first project to start organizing your tasks.
                  </p>
                </CardContent>
              </Card>
            ) : (
              projects.map(project => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          {project.name}
                        </CardTitle>
                        <CardDescription>
                          {project.subtasks?.length || 0} subtasks
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{priorityLabels[project.priority]}</Badge>
                        {project.dueDate && (
                          <Badge variant="secondary">
                            <Calendar className="h-3 w-3 mr-1" />
                            {project.dueDate.toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {project.subtasks && project.subtasks.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{calculateProjectProgress(project)}%</span>
                        </div>
                        <Progress value={calculateProjectProgress(project)} className="h-2" />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {project.subtasks && project.subtasks.length > 0 && (
                      <div className="space-y-2">
                        {project.subtasks.map(subtask => (
                          <TaskItem
                            key={subtask.id}
                            task={subtask}
                            onUpdateStatus={handleUpdateTaskStatus}
                            onDelete={handleDeleteTask}
                            getStatusIcon={getStatusIcon}
                            getEnergyIcon={getEnergyIcon}
                            getContextIcon={getContextIcon}
                            isSubtask={true}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="quick-wins">
          <TaskListView 
            tasks={quickWins} 
            onUpdateStatus={handleUpdateTaskStatus}
            onDelete={handleDeleteTask}
            getStatusIcon={getStatusIcon}
            getEnergyIcon={getEnergyIcon}
            getContextIcon={getContextIcon}
            calculateProjectProgress={calculateProjectProgress}
          />
        </TabsContent>
        
        <TabsContent value="all">
          <TaskListView 
            tasks={filteredTasks} 
            onUpdateStatus={handleUpdateTaskStatus}
            onDelete={handleDeleteTask}
            getStatusIcon={getStatusIcon}
            getEnergyIcon={getEnergyIcon}
            getContextIcon={getContextIcon}
            calculateProjectProgress={calculateProjectProgress}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface TaskListViewProps {
  tasks: Task[]
  onUpdateStatus: (taskId: string, status: Task["status"]) => void
  onDelete: (taskId: string) => void
  getStatusIcon: (status: string) => React.ReactNode
  getEnergyIcon: (energy: string) => React.ReactNode
  getContextIcon: (context: string) => React.ReactNode
  calculateProjectProgress: (project: Task) => number
}

function TaskListView({ tasks, onUpdateStatus, onDelete, getStatusIcon, getEnergyIcon, getContextIcon, calculateProjectProgress }: TaskListViewProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or create a new task.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          getStatusIcon={getStatusIcon}
          getEnergyIcon={getEnergyIcon}
          getContextIcon={getContextIcon}
          calculateProjectProgress={calculateProjectProgress}
        />
      ))}
    </div>
  )
}

interface TaskItemProps {
  task: Task
  onUpdateStatus: (taskId: string, status: Task["status"]) => void
  onDelete: (taskId: string) => void
  getStatusIcon: (status: string) => React.ReactNode
  getEnergyIcon: (energy: string) => React.ReactNode
  getContextIcon: (context: string) => React.ReactNode
  calculateProjectProgress: (project: Task) => number
  isSubtask?: boolean
}

function TaskItem({ task, onUpdateStatus, onDelete, getStatusIcon, getEnergyIcon, getContextIcon, calculateProjectProgress, isSubtask = false }: TaskItemProps) {
  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      task.status === "COMPLETE" && "opacity-60",
      isSubtask && "ml-4 border-l-4 border-l-primary/20"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <button
            onClick={() => onUpdateStatus(task.id, task.status === "COMPLETE" ? "NOT_STARTED" : "COMPLETE")}
            className={cn(
              "mt-1 p-1 rounded-lg flex-shrink-0",
              statusColors[task.status]
            )}
          >
            {getStatusIcon(task.status)}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-medium",
                  task.status === "COMPLETE" && "line-through"
                )}>
                  {task.name}
                </h3>
                
                {task.nextAction && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <ChevronRight className="h-3 w-3 inline mr-1" />
                    {task.nextAction}
                  </p>
                )}
                
                {task.notes && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {task.notes}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {priorityLabels[task.priority]}
                  </Badge>
                  
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    {getEnergyIcon(task.energyRequired)}
                    {energyLabels[task.energyRequired]}
                  </Badge>
                  
                  {task.context.map(context => (
                    <Badge key={context} variant="outline" className="text-xs flex items-center gap-1">
                      {getContextIcon(context)}
                      {context}
                    </Badge>
                  ))}
                  
                  {task.timeEstimate && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.timeEstimate}m
                    </Badge>
                  )}
                  
                  {task.dueDate && (
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {task.dueDate.toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
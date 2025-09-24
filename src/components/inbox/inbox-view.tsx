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
import { 
  Inbox as InboxIcon, 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  Tag,
  Calendar,
  AlertCircle,
  CheckSquare,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Link
} from "lucide-react"
import { cn } from "@/lib/utils"

interface InboxItem {
  id: string
  title: string
  type: "TASK" | "IDEA" | "NOTE" | "QUESTION" | "RESOURCE"
  priority: "URGENT" | "HIGH" | "NORMAL" | "LOW"
  processed: boolean
  quickNote?: string
  tags?: string[]
  createdAt: Date
}

const typeIcons = {
  TASK: CheckSquare,
  IDEA: Lightbulb,
  NOTE: BookOpen,
  QUESTION: HelpCircle,
  RESOURCE: Link
}

const typeColors = {
  TASK: "bg-blue-500",
  IDEA: "bg-yellow-500",
  NOTE: "bg-green-500",
  QUESTION: "bg-purple-500",
  RESOURCE: "bg-orange-500"
}

const priorityColors = {
  URGENT: "bg-red-500",
  HIGH: "bg-orange-500",
  NORMAL: "bg-blue-500",
  LOW: "bg-gray-500"
}

const priorityLabels = {
  URGENT: "🔥 Urgent",
  HIGH: "⚡ High",
  NORMAL: "🔵 Normal",
  LOW: "🟢 Low"
}

const mockInboxItems: InboxItem[] = [
  {
    id: "1",
    title: "Research productivity techniques",
    type: "TASK",
    priority: "HIGH",
    processed: false,
    quickNote: "Look into Pomodoro and time blocking methods",
    tags: ["learning", "productivity"],
    createdAt: new Date("2024-01-15T10:30:00")
  },
  {
    id: "2",
    title: "Build a habit tracking app",
    type: "IDEA",
    priority: "NORMAL",
    processed: false,
    quickNote: "Could integrate with existing second brain system",
    tags: ["project", "development"],
    createdAt: new Date("2024-01-15T09:15:00")
  },
  {
    id: "3",
    title: "Meeting notes about quarterly planning",
    type: "NOTE",
    priority: "NORMAL",
    processed: false,
    tags: ["work", "planning"],
    createdAt: new Date("2024-01-15T08:00:00")
  },
  {
    id: "4",
    title: "How to implement spaced repetition effectively?",
    type: "QUESTION",
    priority: "HIGH",
    processed: false,
    quickNote: "Need to research optimal intervals and card formats",
    tags: ["learning", "srs"],
    createdAt: new Date("2024-01-14T16:45:00")
  },
  {
    id: "5",
    title: "Article about knowledge management systems",
    type: "RESOURCE",
    priority: "LOW",
    processed: false,
    quickNote: "https://example.com/knowledge-management",
    tags: ["reading", "research"],
    createdAt: new Date("2024-01-14T14:20:00")
  }
]

export function InboxView() {
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(mockInboxItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [showProcessed, setShowProcessed] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    title: "",
    type: "NOTE" as const,
    priority: "NORMAL" as const,
    quickNote: "",
    tags: ""
  })

  const filteredItems = inboxItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.quickNote && item.quickNote.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesPriority = selectedPriority === "all" || item.priority === selectedPriority
    const matchesProcessed = showProcessed || !item.processed
    
    return matchesSearch && matchesType && matchesPriority && matchesProcessed
  })

  const unprocessedItems = inboxItems.filter(item => !item.processed)
  const todaysItems = inboxItems.filter(item => {
    const today = new Date()
    return item.createdAt.toDateString() === today.toDateString()
  })

  const handleAddItem = () => {
    if (!newItem.title.trim()) return

    const item: InboxItem = {
      id: Date.now().toString(),
      title: newItem.title,
      type: newItem.type,
      priority: newItem.priority,
      processed: false,
      quickNote: newItem.quickNote || undefined,
      tags: newItem.tags ? newItem.tags.split(",").map(tag => tag.trim()).filter(Boolean) : undefined,
      createdAt: new Date()
    }

    setInboxItems([item, ...inboxItems])
    setNewItem({
      title: "",
      type: "NOTE",
      priority: "NORMAL",
      quickNote: "",
      tags: ""
    })
    setIsAddDialogOpen(false)
  }

  const handleProcessItem = (itemId: string) => {
    setInboxItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, processed: true } : item
      )
    )
  }

  const handleDeleteItem = (itemId: string) => {
    setInboxItems(items => items.filter(item => item.id !== itemId))
  }

  const getTypeIcon = (type: string) => {
    const Icon = typeIcons[type as keyof typeof typeIcons] || InboxIcon
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground">
            Quick capture from anywhere • {unprocessedItems.length} unprocessed items
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Quick Capture
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Quick Capture</DialogTitle>
              <DialogDescription>
                Capture thoughts, tasks, ideas, or resources as they come to mind.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="What's on your mind?"
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select value={newItem.type} onValueChange={(value) => setNewItem(prev => ({ ...prev, type: value as any }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TASK">Task</SelectItem>
                      <SelectItem value="IDEA">Idea</SelectItem>
                      <SelectItem value="NOTE">Note</SelectItem>
                      <SelectItem value="QUESTION">Question</SelectItem>
                      <SelectItem value="RESOURCE">Resource</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={newItem.priority} onValueChange={(value) => setNewItem(prev => ({ ...prev, priority: value as any }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="URGENT">🔥 Urgent</SelectItem>
                      <SelectItem value="HIGH">⚡ High</SelectItem>
                      <SelectItem value="NORMAL">🔵 Normal</SelectItem>
                      <SelectItem value="LOW">🟢 Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Quick Note</label>
                <Textarea
                  placeholder="Additional details..."
                  value={newItem.quickNote}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quickNote: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  placeholder="personal, work, learning..."
                  value={newItem.tags}
                  onChange={(e) => setNewItem(prev => ({ ...prev, tags: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddItem} className="flex-1">
                  Capture
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
              <InboxIcon className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{unprocessedItems.length}</p>
                <p className="text-xs text-muted-foreground">Unprocessed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{todaysItems.length}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-2xl font-bold">
                  {inboxItems.filter(item => item.priority === "URGENT" && !item.processed).length}
                </p>
                <p className="text-xs text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">
                  {inboxItems.filter(item => item.processed).length}
                </p>
                <p className="text-xs text-muted-foreground">Processed</p>
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
                  placeholder="Search inbox items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="TASK">Tasks</SelectItem>
                  <SelectItem value="IDEA">Ideas</SelectItem>
                  <SelectItem value="NOTE">Notes</SelectItem>
                  <SelectItem value="QUESTION">Questions</SelectItem>
                  <SelectItem value="RESOURCE">Resources</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="URGENT">🔥 Urgent</SelectItem>
                  <SelectItem value="HIGH">⚡ High</SelectItem>
                  <SelectItem value="NORMAL">🔵 Normal</SelectItem>
                  <SelectItem value="LOW">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant={showProcessed ? "default" : "outline"}
                size="sm"
                onClick={() => setShowProcessed(!showProcessed)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Show Processed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Items ({filteredItems.length})</TabsTrigger>
          <TabsTrigger value="unprocessed">Unprocessed ({unprocessedItems.length})</TabsTrigger>
          <TabsTrigger value="today">Today ({todaysItems.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <InboxItemList 
            items={filteredItems} 
            onProcess={handleProcessItem}
            onDelete={handleDeleteItem}
            getTypeIcon={getTypeIcon}
          />
        </TabsContent>
        
        <TabsContent value="unprocessed">
          <InboxItemList 
            items={unprocessedItems} 
            onProcess={handleProcessItem}
            onDelete={handleDeleteItem}
            getTypeIcon={getTypeIcon}
          />
        </TabsContent>
        
        <TabsContent value="today">
          <InboxItemList 
            items={todaysItems} 
            onProcess={handleProcessItem}
            onDelete={handleDeleteItem}
            getTypeIcon={getTypeIcon}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface InboxItemListProps {
  items: InboxItem[]
  onProcess: (itemId: string) => void
  onDelete: (itemId: string) => void
  getTypeIcon: (type: string) => React.ReactNode
}

function InboxItemList({ items, onProcess, onDelete, getTypeIcon }: InboxItemListProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <InboxIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground">
            Your inbox is empty. Try adjusting your filters or capture a new item.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className={cn(
          "transition-all hover:shadow-md",
          item.processed && "opacity-60"
        )}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className={cn(
                "p-2 rounded-lg flex-shrink-0",
                typeColors[item.type]
              )}>
                {getTypeIcon(item.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-medium truncate",
                      item.processed && "line-through"
                    )}>
                      {item.title}
                    </h3>
                    
                    {item.quickNote && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {item.quickNote}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {priorityLabels[item.priority]}
                      </Badge>
                      
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                      
                      {item.tags && item.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      
                      <span className="text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {item.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!item.processed && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onProcess(item.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Process
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(item.id)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
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
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Link,
  Tag,
  Calendar,
  Star,
  Hash,
  FileText,
  Lightbulb,
  Target,
  Users,
  TrendingUp,
  ArrowRight,
  Network
} from "lucide-react"
import { cn } from "@/lib/utils"

type NoteType = "permanent" | "literature" | "fleeting" | "project"
type NoteStatus = "active" | "archived" | "draft"
type NoteCategory = "learning" | "project" | "personal" | "professional" | "creative"

interface Note {
  id: string
  title: string
  content: string
  type: NoteType
  status: NoteStatus
  category: NoteCategory
  tags: string[]
  connections: string[]
  createdAt: Date
  updatedAt: Date
  author?: string
  source?: string
  importance: number // 1-5
  linkedNotes?: string[]
}

interface Connection {
  from: string
  to: string
  type: "related" | "builds_on" | "contradicts" | "expands"
  strength: number // 1-5
}

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Zettelkasten Method",
    content: "The Zettelkasten method is a personal tool for thinking and writing. It creates a web of thought where ideas are connected and can grow organically. Key principles include atomicity, link density, and unique identifiers.",
    type: "permanent",
    status: "active",
    category: "learning",
    tags: ["knowledge-management", "productivity", "writing"],
    connections: ["2", "3"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    importance: 5,
    linkedNotes: ["How to Take Smart Notes", "Atomic Habits"]
  },
  {
    id: "2",
    title: "How to Take Smart Notes",
    content: "Based on Sönke Ahrens' book, this method emphasizes writing notes to understand and think, not just collect information. The process involves fleeting notes, literature notes, and permanent notes that form a knowledge network.",
    type: "literature",
    status: "active",
    category: "learning",
    tags: ["note-taking", "books", "methodology"],
    connections: ["1", "4"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
    importance: 4,
    source: "Book by Sönke Ahrens"
  },
  {
    id: "3",
    title: "Atomic Habits - Key Insights",
    content: "James Clear's framework for habit formation: 1) Make it obvious, 2) Make it attractive, 3) Make it easy, 4) Make it satisfying. Small changes compound over time to create remarkable results.",
    type: "permanent",
    status: "active",
    category: "personal",
    tags: ["habits", "productivity", "psychology"],
    connections: ["1"],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-12"),
    importance: 5,
    source: "Book by James Clear"
  },
  {
    id: "4",
    title: "Project: Knowledge Management System",
    content: "Building a comprehensive knowledge management system that integrates note-taking, task management, and spaced repetition. The system should support multiple input methods and provide intelligent connections between related concepts.",
    type: "project",
    status: "active",
    category: "project",
    tags: ["project", "system-design", "development"],
    connections: ["2"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-25"),
    importance: 3
  }
]

const mockConnections: Connection[] = [
  { from: "1", to: "2", type: "related", strength: 5 },
  { from: "1", to: "3", type: "expands", strength: 3 },
  { from: "2", to: "4", type: "builds_on", strength: 4 }
]

const typeConfig = {
  permanent: { icon: BookOpen, color: "bg-blue-500", label: "Permanent", description: "Core knowledge and insights" },
  literature: { icon: FileText, color: "bg-green-500", label: "Literature", description: "Notes from books and sources" },
  fleeting: { icon: Lightbulb, color: "bg-yellow-500", label: "Fleeting", description: "Quick thoughts and ideas" },
  project: { icon: Target, color: "bg-purple-500", label: "Project", description: "Project-related knowledge" }
}

const statusConfig = {
  active: { color: "bg-green-100 text-green-800", label: "Active" },
  archived: { color: "bg-gray-100 text-gray-800", label: "Archived" },
  draft: { color: "bg-yellow-100 text-yellow-800", label: "Draft" }
}

const categoryConfig = {
  learning: { label: "Learning", color: "bg-blue-500" },
  project: { label: "Project", color: "bg-purple-500" },
  personal: { label: "Personal", color: "bg-green-500" },
  professional: { label: "Professional", color: "bg-orange-500" },
  creative: { label: "Creative", color: "bg-pink-500" }
}

const connectionTypeConfig = {
  related: { label: "Related", color: "bg-blue-100 text-blue-800" },
  builds_on: { label: "Builds On", color: "bg-green-100 text-green-800" },
  contradicts: { label: "Contradicts", color: "bg-red-100 text-red-800" },
  expands: { label: "Expands", color: "bg-purple-100 text-purple-800" }
}

export function KnowledgeView() {
  const [notes, setNotes] = useState<Note[]>(mockNotes)
  const [connections, setConnections] = useState<Connection[]>(mockConnections)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<NoteType | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<NoteCategory | "all">("all")
  const [statusFilter, setStatusFilter] = useState<NoteStatus | "all">("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "network">("grid")

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = typeFilter === "all" || note.type === typeFilter
    const matchesCategory = categoryFilter === "all" || note.category === categoryFilter
    const matchesStatus = statusFilter === "all" || note.status === statusFilter

    return matchesSearch && matchesType && matchesCategory && matchesStatus
  })

  const getNotesByType = (type: NoteType) => {
    return filteredNotes.filter(note => note.type === type)
  }

  const getConnectedNotes = (noteId: string) => {
    const connectedIds = connections
      .filter(conn => conn.from === noteId || conn.to === noteId)
      .map(conn => conn.from === noteId ? conn.to : conn.from)
    
    return notes.filter(note => connectedIds.includes(note.id))
  }

  const addNewNote = (noteData: Partial<Note>) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteData.title || "",
      content: noteData.content || "",
      type: noteData.type || "permanent",
      status: "active",
      category: noteData.category || "learning",
      tags: noteData.tags || [],
      connections: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      importance: noteData.importance || 3,
      source: noteData.source,
      author: noteData.author
    }
    setNotes([...notes, newNote])
    setIsAddDialogOpen(false)
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ))
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
    setConnections(connections.filter(conn => conn.from !== id && conn.to !== id))
  }

  const createConnection = (fromId: string, toId: string, type: Connection["type"], strength: number) => {
    const newConnection: Connection = {
      from: fromId,
      to: toId,
      type,
      strength
    }
    setConnections([...connections, newConnection])
    
    // Update both notes' connection lists
    setNotes(notes.map(note => {
      if (note.id === fromId && !note.connections.includes(toId)) {
        return { ...note, connections: [...note.connections, toId] }
      }
      if (note.id === toId && !note.connections.includes(fromId)) {
        return { ...note, connections: [...note.connections, fromId] }
      }
      return note
    }))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">Permanent notes system with intelligent connections</p>
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
            variant={viewMode === "network" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("network")}
          >
            Network View
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
                <DialogDescription>
                  Add a new permanent note to your knowledge base
                </DialogDescription>
              </DialogHeader>
              <AddNoteForm onSubmit={addNewNote} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.length}</div>
            <p className="text-xs text-muted-foreground">
              +{notes.filter(n => new Date(n.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connections.length}</div>
            <p className="text-xs text-muted-foreground">
              Knowledge links
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permanent Notes</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getNotesByType("permanent").length}</div>
            <p className="text-xs text-muted-foreground">
              Core knowledge
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getNotesByType("project").length}</div>
            <p className="text-xs text-muted-foreground">
              Project knowledge
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
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={(value: NoteType | "all") => setTypeFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(typeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={(value: NoteCategory | "all") => setCategoryFilter(value)}>
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
            
            <Select value={statusFilter} onValueChange={(value: NoteStatus | "all") => setStatusFilter(value)}>
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
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {viewMode === "grid" ? (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({filteredNotes.length})</TabsTrigger>
            <TabsTrigger value="permanent">Permanent ({getNotesByType("permanent").length})</TabsTrigger>
            <TabsTrigger value="literature">Literature ({getNotesByType("literature").length})</TabsTrigger>
            <TabsTrigger value="project">Projects ({getNotesByType("project").length})</TabsTrigger>
            <TabsTrigger value="fleeting">Fleeting ({getNotesByType("fleeting").length})</TabsTrigger>
          </TabsList>

          {Object.keys(typeConfig).map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getNotesByType(type as NoteType).map((note) => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    connections={connections.filter(c => c.from === note.id || c.to === note.id)}
                    onClick={() => setSelectedNote(note)}
                    onUpdate={updateNote}
                    onDelete={deleteNote}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <NetworkView notes={filteredNotes} connections={connections} onNoteClick={setSelectedNote} />
      )}

      {/* Note Detail Dialog */}
      {selectedNote && (
        <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedNote.title}</DialogTitle>
              <DialogDescription>
                {typeConfig[selectedNote.type].label} • {categoryConfig[selectedNote.category].label}
              </DialogDescription>
            </DialogHeader>
            <NoteDetail 
              note={selectedNote} 
              connections={connections.filter(c => c.from === selectedNote.id || c.to === selectedNote.id)}
              connectedNotes={getConnectedNotes(selectedNote.id)}
              onUpdate={updateNote}
              onDelete={deleteNote}
              onCreateConnection={createConnection}
              allNotes={notes}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function NoteCard({ note, connections, onClick, onUpdate, onDelete }: { 
  note: Note, 
  connections: Connection[],
  onClick: () => void,
  onUpdate: (id: string, updates: Partial<Note>) => void,
  onDelete: (id: string) => void 
}) {
  const TypeIcon = typeConfig[note.type].icon

  return (
    <Card className="h-full cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={cn("p-1 rounded", typeConfig[note.type].color)}>
                <TypeIcon className="h-4 w-4 text-white" />
              </div>
              {note.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {note.content.length > 100 
                ? `${note.content.substring(0, 100)}...` 
                : note.content}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {note.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {note.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{note.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Connections */}
        {connections.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link className="h-3 w-3" />
            <span>{connections.length} connection{connections.length > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={statusConfig[note.status].color}>
              {statusConfig[note.status].label}
            </Badge>
            <Badge variant="outline">
              {categoryConfig[note.category].label}
            </Badge>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-3 w-3", 
                    i < note.importance ? "text-yellow-500 fill-current" : "text-gray-300"
                  )} 
                />
              ))}
            </div>
          </div>
          {note.source && (
            <div>Source: {note.source}</div>
          )}
        </div>

        {/* Date */}
        <div className="text-xs text-muted-foreground">
          Updated {new Date(note.updatedAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}

function NoteDetail({ note, connections, connectedNotes, onUpdate, onDelete, onCreateConnection, allNotes }: {
  note: Note,
  connections: Connection[],
  connectedNotes: Note[],
  onUpdate: (id: string, updates: Partial<Note>) => void,
  onDelete: (id: string) => void,
  onCreateConnection: (from: string, to: string, type: Connection["type"], strength: number) => void,
  allNotes: Note[]
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: note.title,
    content: note.content,
    tags: note.tags.join(", "),
    importance: note.importance
  })

  const handleSave = () => {
    onUpdate(note.id, {
      title: editForm.title,
      content: editForm.content,
      tags: editForm.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      importance: editForm.importance
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <Input
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="text-2xl font-bold mb-2"
            />
          ) : (
            <h2 className="text-2xl font-bold mb-2">{note.title}</h2>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className={statusConfig[note.status].color}>
              {statusConfig[note.status].label}
            </Badge>
            <Badge variant="outline">
              {categoryConfig[note.category].label}
            </Badge>
            <Badge variant="outline">
              {typeConfig[note.type].label}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
              <Button variant="outline" onClick={() => onDelete(note.id)}>Delete</Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editForm.content}
              onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              rows={8}
              placeholder="Note content..."
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div>
                <Label>Importance (1-5)</Label>
                <Select value={editForm.importance.toString()} onValueChange={(value) => setEditForm({ ...editForm, importance: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} Star{num > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{note.content}</p>
          </div>
        )}

        {/* Tags */}
        {!isEditing && note.tags.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Tags</h3>
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        {!isEditing && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Created</h4>
              <p className="text-muted-foreground">{new Date(note.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Last Updated</h4>
              <p className="text-muted-foreground">{new Date(note.updatedAt).toLocaleDateString()}</p>
            </div>
            {note.source && (
              <div>
                <h4 className="font-medium mb-1">Source</h4>
                <p className="text-muted-foreground">{note.source}</p>
              </div>
            )}
            {note.author && (
              <div>
                <h4 className="font-medium mb-1">Author</h4>
                <p className="text-muted-foreground">{note.author}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Connections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Connections</h3>
          <CreateConnectionDialog 
            currentNote={note}
            allNotes={allNotes.filter(n => n.id !== note.id)}
            onCreateConnection={onCreateConnection}
          />
        </div>
        
        {connections.length > 0 ? (
          <div className="space-y-2">
            {connections.map((connection, index) => {
              const connectedNote = connectedNotes.find(n => n.id === (connection.from === note.id ? connection.to : connection.from))
              if (!connectedNote) return null
              
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={connectionTypeConfig[connection.type].color}>
                      {connectionTypeConfig[connection.type].label}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "h-3 w-3", 
                            i < connection.strength ? "text-yellow-500 fill-current" : "text-gray-300"
                          )} 
                        />
                      ))}
                    </div>
                    <span className="font-medium">{connectedNote.title}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => {/* TODO: Remove connection */}}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            <p>No connections yet. Link this note to related knowledge.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function NetworkView({ notes, connections, onNoteClick }: {
  notes: Note[],
  connections: Connection[],
  onNoteClick: (note: Note) => void
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Knowledge Network</h3>
        <p className="text-muted-foreground">Visualize connections between your notes</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Visualization Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Network Graph</CardTitle>
            <CardDescription>
              Interactive visualization of note connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Network className="h-12 w-12 mx-auto mb-2" />
                <p>Network visualization coming soon</p>
                <p className="text-sm">Click on notes below to explore connections</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Connections</CardTitle>
            <CardDescription>
              Latest links between notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {connections.slice(0, 10).map((connection, index) => {
                const fromNote = notes.find(n => n.id === connection.from)
                const toNote = notes.find(n => n.id === connection.to)
                
                if (!fromNote || !toNote) return null
                
                return (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={connectionTypeConfig[connection.type].color}>
                        {connectionTypeConfig[connection.type].label}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "h-3 w-3", 
                              i < connection.strength ? "text-yellow-500 fill-current" : "text-gray-300"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <button 
                        className="text-sm font-medium hover:underline text-left w-full"
                        onClick={() => onNoteClick(fromNote)}
                      >
                        {fromNote.title}
                      </button>
                      <div className="flex items-center justify-center text-xs text-muted-foreground">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <button 
                        className="text-sm font-medium hover:underline text-left w-full"
                        onClick={() => onNoteClick(toNote)}
                      >
                        {toNote.title}
                      </button>
                    </div>
                  </div>
                )
              })}
              {connections.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  <p>No connections yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AddNoteForm({ onSubmit }: { onSubmit: (note: Partial<Note>) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "permanent" as NoteType,
    category: "learning" as NoteCategory,
    tags: "",
    importance: 3,
    source: "",
    author: ""
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
        <Label htmlFor="title">Note Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter note title..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Write your note content..."
          rows={6}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Note Type</Label>
          <Select value={formData.type} onValueChange={(value: NoteType) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(typeConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label} - {config.description}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value: NoteCategory) => setFormData({ ...formData, category: value })}>
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
          <Label htmlFor="importance">Importance (1-5)</Label>
          <Select value={formData.importance.toString()} onValueChange={(value) => setFormData({ ...formData, importance: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map(num => (
                <SelectItem key={num} value={num.toString()}>{num} Star{num > 1 ? 's' : ''}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="source">Source (optional)</Label>
          <Input
            id="source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="Book, article, URL..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author (optional)</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Author name..."
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Create Note
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

function CreateConnectionDialog({ currentNote, allNotes, onCreateConnection }: {
  currentNote: Note,
  allNotes: Note[],
  onCreateConnection: (from: string, to: string, type: Connection["type"], strength: number) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState("")
  const [connectionType, setConnectionType] = useState<Connection["type"]>("related")
  const [strength, setStrength] = useState(3)

  const handleCreate = () => {
    if (selectedNote) {
      onCreateConnection(currentNote.id, selectedNote, connectionType, strength)
      setIsOpen(false)
      setSelectedNote("")
      setConnectionType("related")
      setStrength(3)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Connection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Connection</DialogTitle>
          <DialogDescription>
            Link "{currentNote.title}" to another note
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Connect to</Label>
            <Select value={selectedNote} onValueChange={setSelectedNote}>
              <SelectTrigger>
                <SelectValue placeholder="Select a note to connect to" />
              </SelectTrigger>
              <SelectContent>
                {allNotes.map((note) => (
                  <SelectItem key={note.id} value={note.id}>
                    {note.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Connection Type</Label>
            <Select value={connectionType} onValueChange={(value: Connection["type"]) => setConnectionType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(connectionTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Strength (1-5)</Label>
            <Select value={strength.toString()} onValueChange={(value) => setStrength(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num} Star{num > 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreate} disabled={!selectedNote} className="flex-1">
              Create Connection
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
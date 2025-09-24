import { NextRequest, NextResponse } from "next/server"

// Mock data - in a real app, this would come from a database
let notes = [
  {
    id: "1",
    title: "Zettelkasten Method",
    content: "The Zettelkasten method is a personal tool for thinking and writing. It creates a web of thought where ideas are connected and can grow organically. Key principles include atomicity, link density, and unique identifiers.\n\nThe method emphasizes writing notes to understand and think, not just collect information. Each note should be atomic (one idea per note), linked to other relevant notes, and have a unique identifier for easy reference.\n\nBenefits include:\n- Better understanding through active processing\n- serendipitous discoveries through connections\n- A growing knowledge network that compounds over time",
    type: "permanent",
    status: "active",
    category: "learning",
    tags: ["knowledge-management", "productivity", "writing", "methodology"],
    connections: ["2", "3"],
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-20T14:45:00Z"),
    author: "Niklas Luhmann",
    source: "Personal research and practice",
    importance: 5,
    linkedNotes: ["How to Take Smart Notes", "Atomic Habits"]
  },
  {
    id: "2",
    title: "How to Take Smart Notes",
    content: "Based on Sönke Ahrens' book, this method emphasizes writing notes to understand and think, not just collect information. The process involves three types of notes:\n\n1. Fleeting notes: Quick thoughts and ideas captured anywhere\n2. Literature notes: Notes from reading and sources, in your own words\n3. Permanent notes: Core insights and understanding, linked to other notes\n\nKey principles:\n- Always write notes in your own words\n- Focus on understanding, not just collecting\n- Make connections between related ideas\n- Review and refine regularly\n\nThis approach transforms passive reading into active learning and builds a knowledge network over time.",
    type: "literature",
    status: "active",
    category: "learning",
    tags: ["note-taking", "books", "methodology", "learning"],
    connections: ["1", "4"],
    createdAt: new Date("2024-01-10T09:15:00Z"),
    updatedAt: new Date("2024-01-18T11:30:00Z"),
    author: "Sönke Ahrens",
    source: "Book: How to Take Smart Notes",
    importance: 4
  },
  {
    id: "3",
    title: "Atomic Habits - Key Insights",
    content: "James Clear's framework for habit formation consists of four laws:\n\n1. Make it Obvious\n   - Use implementation intentions\n   - Design your environment\n   - Use habit stacking\n\n2. Make it Attractive\n   - Use temptation bundling\n   - Join a culture where your desired behavior is normal\n   - Create a motivation ritual\n\n3. Make it Easy\n   - Reduce friction\n   - Prime the environment\n   - Master the decisive moment (two-minute rule)\n\n4. Make it Satisfying\n   - Use reinforcement\n   - Make it immediately satisfying\n   - Use a habit tracker\n\nSmall changes compound over time to create remarkable results. Focus on systems rather than goals.",
    type: "permanent",
    status: "active",
    category: "personal",
    tags: ["habits", "productivity", "psychology", "behavior-change"],
    connections: ["1"],
    createdAt: new Date("2024-01-05T14:20:00Z"),
    updatedAt: new Date("2024-01-12T16:45:00Z"),
    author: "James Clear",
    source: "Book: Atomic Habits",
    importance: 5
  },
  {
    id: "4",
    title: "Project: Knowledge Management System",
    content: "Building a comprehensive knowledge management system that integrates multiple components:\n\nCore Features:\n- Note-taking with multiple input methods\n- Task management with energy-based prioritization\n- Spaced repetition for learning\n- Idea incubation with impact/effort analysis\n- Life areas tracking and reviews\n\nTechnical Requirements:\n- Web-based interface with mobile support\n- Real-time synchronization\n- Offline capability\n- Search and filtering\n- Import/export functionality\n- API for integrations\n\nDesign Principles:\n- Simple and intuitive interface\n- Fast performance\n- Privacy-focused (local storage option)\n- Extensible architecture\n- Regular backups\n\nThis project combines insights from Zettelkasten, GTD, and modern productivity systems.",
    type: "project",
    status: "active",
    category: "project",
    tags: ["project", "system-design", "development", "knowledge-management"],
    connections: ["2"],
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-25T18:30:00Z"),
    importance: 3
  }
]

let connections = [
  { from: "1", to: "2", type: "related", strength: 5, createdAt: new Date("2024-01-15T10:30:00Z") },
  { from: "1", to: "3", type: "expands", strength: 3, createdAt: new Date("2024-01-16T11:00:00Z") },
  { from: "2", to: "4", type: "builds_on", strength: 4, createdAt: new Date("2024-01-18T14:00:00Z") }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const category = searchParams.get("category")
  const status = searchParams.get("status")
  const search = searchParams.get("search")
  const noteId = searchParams.get("noteId")

  let filteredNotes = [...notes]

  if (noteId) {
    // Get specific note with connections
    const note = notes.find(n => n.id === noteId)
    if (!note) {
      return NextResponse.json({
        success: false,
        error: "Note not found"
      }, { status: 404 })
    }

    const noteConnections = connections.filter(c => c.from === noteId || c.to === noteId)
    const connectedNoteIds = noteConnections.map(c => c.from === noteId ? c.to : c.from)
    const connectedNotes = notes.filter(n => connectedNoteIds.includes(n.id))

    return NextResponse.json({
      success: true,
      data: {
        note: note,
        connections: noteConnections,
        connectedNotes: connectedNotes
      }
    })
  }

  if (type && type !== "all") {
    filteredNotes = filteredNotes.filter(note => note.type === type)
  }

  if (category && category !== "all") {
    filteredNotes = filteredNotes.filter(note => note.category === category)
  }

  if (status && status !== "all") {
    filteredNotes = filteredNotes.filter(note => note.status === status)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredNotes = filteredNotes.filter(note =>
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  // Calculate statistics
  const stats = {
    total: notes.length,
    byType: {
      permanent: notes.filter(n => n.type === "permanent").length,
      literature: notes.filter(n => n.type === "literature").length,
      fleeting: notes.filter(n => n.type === "fleeting").length,
      project: notes.filter(n => n.type === "project").length
    },
    byCategory: {
      learning: notes.filter(n => n.category === "learning").length,
      project: notes.filter(n => n.category === "project").length,
      personal: notes.filter(n => n.category === "personal").length,
      professional: notes.filter(n => n.category === "professional").length,
      creative: notes.filter(n => n.category === "creative").length
    },
    connections: connections.length,
    averageImportance: (notes.reduce((sum, note) => sum + note.importance, 0) / notes.length).toFixed(1)
  }

  return NextResponse.json({
    success: true,
    data: {
      notes: filteredNotes,
      connections: connections,
      stats: stats
    },
    total: filteredNotes.length
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newNote = {
      id: Date.now().toString(),
      title: body.title,
      content: body.content || "",
      type: body.type || "permanent",
      status: "active",
      category: body.category || "learning",
      tags: body.tags || [],
      connections: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      importance: body.importance || 3,
      source: body.source,
      author: body.author
    }

    notes.push(newNote)

    return NextResponse.json({
      success: true,
      data: newNote,
      message: "Note created successfully"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to create note"
    }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const noteIndex = notes.findIndex(note => note.id === id)
    if (noteIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Note not found"
      }, { status: 404 })
    }

    const updatedNote = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date()
    }

    notes[noteIndex] = updatedNote

    return NextResponse.json({
      success: true,
      data: updatedNote,
      message: "Note updated successfully"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to update note"
    }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "ID is required"
      }, { status: 400 })
    }

    const noteIndex = notes.findIndex(note => note.id === id)
    if (noteIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Note not found"
      }, { status: 404 })
    }

    notes.splice(noteIndex, 1)
    
    // Remove connections involving this note
    connections = connections.filter(c => c.from !== id && c.to !== id)

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to delete note"
    }, { status: 400 })
  }
}

// Connection management
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === "create_connection") {
      const { from, to, type, strength } = data

      // Check if connection already exists
      const existingConnection = connections.find(c => 
        (c.from === from && c.to === to) || (c.from === to && c.to === from)
      )

      if (existingConnection) {
        return NextResponse.json({
          success: false,
          error: "Connection already exists"
        }, { status: 400 })
      }

      const newConnection = {
        from,
        to,
        type,
        strength,
        createdAt: new Date()
      }

      connections.push(newConnection)

      // Update note connections
      const fromNote = notes.find(n => n.id === from)
      const toNote = notes.find(n => n.id === to)

      if (fromNote && !fromNote.connections.includes(to)) {
        fromNote.connections.push(to)
      }
      if (toNote && !toNote.connections.includes(from)) {
        toNote.connections.push(from)
      }

      return NextResponse.json({
        success: true,
        data: newConnection,
        message: "Connection created successfully"
      })
    } else if (action === "delete_connection") {
      const { from, to } = data

      const connectionIndex = connections.findIndex(c => 
        (c.from === from && c.to === to) || (c.from === to && c.to === from)
      )

      if (connectionIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Connection not found"
        }, { status: 404 })
      }

      connections.splice(connectionIndex, 1)

      // Update note connections
      const fromNote = notes.find(n => n.id === from)
      const toNote = notes.find(n => n.id === to)

      if (fromNote) {
        fromNote.connections = fromNote.connections.filter(id => id !== to)
      }
      if (toNote) {
        toNote.connections = toNote.connections.filter(id => id !== from)
      }

      return NextResponse.json({
        success: true,
        message: "Connection deleted successfully"
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Invalid action"
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to process connection"
    }, { status: 400 })
  }
}
import { NextRequest, NextResponse } from "next/server"

// Mock data - in a real app, this would come from a database
let inboxItems = [
  {
    id: "1",
    title: "Research Zettelkasten method",
    description: "Look into the Zettelkasten note-taking system for knowledge management",
    type: "information",
    priority: "medium",
    status: "unprocessed",
    tags: ["research", "knowledge-management"],
    createdAt: new Date("2024-01-25T10:30:00Z"),
    processedAt: null,
    source: "web"
  },
  {
    id: "2", 
    title: "Buy groceries",
    description: "Milk, eggs, bread, fruits, vegetables",
    type: "task",
    priority: "high",
    status: "unprocessed",
    tags: ["shopping", "errands"],
    createdAt: new Date("2024-01-25T09:15:00Z"),
    processedAt: null,
    source: "voice"
  },
  {
    id: "3",
    title: "Schedule dentist appointment",
    description: "Call Dr. Smith's office to schedule regular checkup",
    type: "task",
    priority: "medium",
    status: "processing",
    tags: ["health", "appointment"],
    createdAt: new Date("2024-01-24T14:20:00Z"),
    processedAt: null,
    source: "manual"
  },
  {
    id: "4",
    title: "Project idea: AI task manager",
    description: "Create an AI-powered task management app that learns user patterns",
    type: "idea",
    priority: "low",
    status: "unprocessed",
    tags: ["project", "ai", "productivity"],
    createdAt: new Date("2024-01-25T08:45:00Z"),
    processedAt: null,
    source: "thought"
  },
  {
    id: "5",
    title: "Book recommendation: Atomic Habits",
    description: "Friend recommended this book for habit formation and productivity",
    type: "information",
    priority: "low",
    status: "completed",
    tags: ["reading", "recommendation", "productivity"],
    createdAt: new Date("2024-01-23T16:30:00Z"),
    processedAt: new Date("2024-01-24T10:00:00Z"),
    source: "conversation"
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const type = searchParams.get("type")
  const priority = searchParams.get("priority")
  const search = searchParams.get("search")

  let filteredItems = [...inboxItems]

  if (status && status !== "all") {
    filteredItems = filteredItems.filter(item => item.status === status)
  }

  if (type && type !== "all") {
    filteredItems = filteredItems.filter(item => item.type === type)
  }

  if (priority && priority !== "all") {
    filteredItems = filteredItems.filter(item => item.priority === priority)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredItems = filteredItems.filter(item =>
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  return NextResponse.json({
    success: true,
    data: filteredItems,
    total: filteredItems.length
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newItem = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description || "",
      type: body.type || "information",
      priority: body.priority || "medium",
      status: "unprocessed",
      tags: body.tags || [],
      createdAt: new Date(),
      processedAt: null,
      source: body.source || "manual"
    }

    inboxItems.push(newItem)

    return NextResponse.json({
      success: true,
      data: newItem,
      message: "Item added to inbox successfully"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to add item to inbox"
    }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const itemIndex = inboxItems.findIndex(item => item.id === id)
    if (itemIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Item not found"
      }, { status: 404 })
    }

    const updatedItem = {
      ...inboxItems[itemIndex],
      ...updates,
      updatedAt: new Date()
    }

    if (updates.status === "completed" && !updates.processedAt) {
      updatedItem.processedAt = new Date()
    }

    inboxItems[itemIndex] = updatedItem

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: "Item updated successfully"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to update item"
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

    const itemIndex = inboxItems.findIndex(item => item.id === id)
    if (itemIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Item not found"
      }, { status: 404 })
    }

    inboxItems.splice(itemIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Item deleted successfully"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to delete item"
    }, { status: 400 })
  }
}
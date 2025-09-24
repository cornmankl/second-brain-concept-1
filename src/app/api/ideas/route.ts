import { NextRequest, NextResponse } from "next/server"

// Mock data - in a real app, this would come from a database
let ideas = [
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
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-20T14:45:00Z"),
    estimatedValue: "$50K - $100K",
    nextMilestone: "Create MVP prototype",
    connections: []
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
    createdAt: new Date("2024-01-10T09:15:00Z"),
    updatedAt: new Date("2024-01-10T09:15:00Z"),
    estimatedValue: "Social impact",
    nextMilestone: "Research local regulations",
    connections: []
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
    createdAt: new Date("2024-01-05T14:20:00Z"),
    updatedAt: new Date("2024-01-18T11:30:00Z"),
    estimatedValue: "$20K - $40K",
    nextMilestone: "Build service framework",
    connections: []
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const category = searchParams.get("category")
  const priority = searchParams.get("priority")
  const search = searchParams.get("search")

  let filteredIdeas = [...ideas]

  if (status && status !== "all") {
    filteredIdeas = filteredIdeas.filter(idea => idea.status === status)
  }

  if (category && category !== "all") {
    filteredIdeas = filteredIdeas.filter(idea => idea.category === category)
  }

  if (priority && priority !== "all") {
    filteredIdeas = filteredIdeas.filter(idea => idea.priority === priority)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredIdeas = filteredIdeas.filter(idea =>
      idea.title.toLowerCase().includes(searchLower) ||
      idea.description.toLowerCase().includes(searchLower) ||
      idea.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  // Calculate impact/effort quadrants
  const quadrants = {
    "quick-wins": filteredIdeas.filter(idea => idea.impact >= 7 && idea.effort <= 4),
    "major-projects": filteredIdeas.filter(idea => idea.impact >= 7 && idea.effort > 4),
    "fill-ins": filteredIdeas.filter(idea => idea.impact < 7 && idea.effort <= 4),
    "thankless-tasks": filteredIdeas.filter(idea => idea.impact < 7 && idea.effort > 4)
  }

  return NextResponse.json({
    success: true,
    data: {
      ideas: filteredIdeas,
      quadrants: quadrants,
      stats: {
        total: ideas.length,
        byStatus: {
          seed: ideas.filter(i => i.status === "seed").length,
          sprout: ideas.filter(i => i.status === "sprout").length,
          sapling: ideas.filter(i => i.status === "sapling").length,
          tree: ideas.filter(i => i.status === "tree").length,
          archived: ideas.filter(i => i.status === "archived").length
        }
      }
    },
    total: filteredIdeas.length
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newIdea = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description || "",
      status: "seed",
      priority: body.priority || "medium",
      category: body.category || "personal",
      impact: body.impact || 5,
      effort: body.effort || 5,
      tags: body.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedValue: body.estimatedValue,
      nextMilestone: body.nextMilestone,
      connections: []
    }

    ideas.push(newIdea)

    return NextResponse.json({
      success: true,
      data: newIdea,
      message: "Idea created successfully"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to create idea"
    }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const ideaIndex = ideas.findIndex(idea => idea.id === id)
    if (ideaIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Idea not found"
      }, { status: 404 })
    }

    const updatedIdea = {
      ...ideas[ideaIndex],
      ...updates,
      updatedAt: new Date()
    }

    ideas[ideaIndex] = updatedIdea

    return NextResponse.json({
      success: true,
      data: updatedIdea,
      message: "Idea updated successfully"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to update idea"
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

    const ideaIndex = ideas.findIndex(idea => idea.id === id)
    if (ideaIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Idea not found"
      }, { status: 404 })
    }

    ideas.splice(ideaIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Idea deleted successfully"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to delete idea"
    }, { status: 400 })
  }
}
import { NextRequest, NextResponse } from "next/server"

// Mock data - in a real app, this would come from a database
let lifeAreas = [
  {
    id: "1",
    name: "Health & Fitness",
    description: "Physical and mental wellbeing",
    color: "bg-red-500",
    icon: "Heart",
    currentScore: 75,
    targetScore: 85,
    goals: [
      {
        id: "1",
        title: "Run a 5K",
        description: "Complete a 5K run in under 30 minutes",
        status: "active",
        priority: "high",
        targetDate: new Date("2024-06-01T00:00:00Z"),
        progress: 60,
        milestones: [
          { id: "1", title: "Run 1K without stopping", description: "First milestone", targetDate: new Date("2024-02-01T00:00:00Z"), completed: true, completedAt: new Date("2024-01-28T00:00:00Z") },
          { id: "2", title: "Run 3K", description: "Intermediate milestone", targetDate: new Date("2024-04-01T00:00:00Z"), completed: false }
        ],
        tags: ["fitness", "running", "health"],
        createdAt: new Date("2024-01-01T00:00:00Z")
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
        createdAt: new Date("2024-01-01T00:00:00Z")
      }
    ],
    reviews: [
      {
        id: "1",
        type: "weekly",
        date: new Date("2024-01-28T00:00:00Z"),
        score: 80,
        insights: ["Consistent exercise routine is working well", "Need to improve sleep schedule"],
        achievements: ["Ran 3K for the first time", "Maintained exercise streak for 2 weeks"],
        challenges: ["Some days felt too tired", "Weather affected outdoor activities"],
        nextActions: ["Adjust sleep schedule", "Plan indoor alternatives"],
        notes: "Overall good week with consistent progress."
      }
    ],
    lastUpdated: new Date("2024-01-28T00:00:00Z")
  },
  {
    id: "2",
    name: "Career & Work",
    description: "Professional development and achievement",
    color: "bg-blue-500",
    icon: "Briefcase",
    currentScore: 65,
    targetScore: 80,
    goals: [
      {
        id: "2",
        title: "Learn React Native",
        description: "Complete React Native course and build a mobile app",
        status: "active",
        priority: "high",
        targetDate: new Date("2024-03-01T00:00:00Z"),
        progress: 40,
        milestones: [
          { id: "3", title: "Complete basics course", description: "Learn fundamentals", targetDate: new Date("2024-02-15T00:00:00Z"), completed: true, completedAt: new Date("2024-02-10T00:00:00Z") },
          { id: "4", title: "Build first app", description: "Create a simple mobile app", targetDate: new Date("2024-03-01T00:00:00Z"), completed: false }
        ],
        tags: ["learning", "development", "mobile"],
        createdAt: new Date("2024-01-15T00:00:00Z")
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
        createdAt: new Date("2024-01-15T00:00:00Z")
      }
    ],
    reviews: [
      {
        id: "2",
        type: "weekly",
        date: new Date("2024-01-28T00:00:00Z"),
        score: 70,
        insights: ["Making good progress on React Native", "Need to dedicate more focused time"],
        achievements: ["Completed basics course", "Built first component"],
        challenges: ["Some days were too busy", "Debugging took longer than expected"],
        nextActions: ["Schedule dedicated coding time", "Start building the app"],
        notes: "Progress is steady but could be faster with better time management."
      }
    ],
    lastUpdated: new Date("2024-01-28T00:00:00Z")
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const areaId = searchParams.get("areaId")
  const search = searchParams.get("search")

  if (areaId) {
    // Get specific life area
    const area = lifeAreas.find(a => a.id === areaId)
    if (!area) {
      return NextResponse.json({
        success: false,
        error: "Life area not found"
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: area
    })
  }

  let filteredAreas = [...lifeAreas]

  if (search) {
    const searchLower = search.toLowerCase()
    filteredAreas = filteredAreas.filter(area =>
      area.name.toLowerCase().includes(searchLower) ||
      area.description.toLowerCase().includes(searchLower)
    )
  }

  // Calculate overall statistics
  const overallScore = lifeAreas.length > 0 
    ? Math.round(lifeAreas.reduce((sum, area) => sum + area.currentScore, 0) / lifeAreas.length)
    : 0

  const stats = {
    total: lifeAreas.length,
    overallScore: overallScore,
    totalGoals: lifeAreas.reduce((sum, area) => sum + area.goals.length, 0),
    activeGoals: lifeAreas.reduce((sum, area) => sum + area.goals.filter(g => g.status === "active").length, 0),
    totalHabits: lifeAreas.reduce((sum, area) => sum + area.habits.length, 0),
    activeHabits: lifeAreas.reduce((sum, area) => sum + area.habits.filter(h => h.isActive).length, 0),
    totalReviews: lifeAreas.reduce((sum, area) => sum + area.reviews.length, 0),
    byCategory: {
      health: lifeAreas.filter(a => a.name.includes("Health")).length,
      career: lifeAreas.filter(a => a.name.includes("Career")).length,
      learning: lifeAreas.filter(a => a.name.includes("Learning")).length,
      personal: lifeAreas.filter(a => a.name.includes("Personal")).length
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      areas: filteredAreas,
      stats: stats
    },
    total: filteredAreas.length
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === "create_area") {
      const { name, description, color, icon, targetScore } = data

      const newArea = {
        id: Date.now().toString(),
        name,
        description,
        color,
        icon,
        currentScore: 50,
        targetScore: targetScore || 80,
        goals: [],
        habits: [],
        reviews: [],
        lastUpdated: new Date()
      }

      lifeAreas.push(newArea)

      return NextResponse.json({
        success: true,
        data: newArea,
        message: "Life area created successfully"
      })
    } else if (action === "add_goal") {
      const { areaId, goalData } = data

      const areaIndex = lifeAreas.findIndex(a => a.id === areaId)
      if (areaIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Life area not found"
        }, { status: 404 })
      }

      const newGoal = {
        id: Date.now().toString(),
        title: goalData.title,
        description: goalData.description || "",
        status: "active",
        priority: goalData.priority || "medium",
        targetDate: goalData.targetDate ? new Date(goalData.targetDate) : null,
        progress: 0,
        milestones: [],
        tags: goalData.tags || [],
        createdAt: new Date()
      }

      lifeAreas[areaIndex].goals.push(newGoal)
      lifeAreas[areaIndex].lastUpdated = new Date()

      return NextResponse.json({
        success: true,
        data: newGoal,
        message: "Goal added successfully"
      })
    } else if (action === "add_habit") {
      const { areaId, habitData } = data

      const areaIndex = lifeAreas.findIndex(a => a.id === areaId)
      if (areaIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Life area not found"
        }, { status: 404 })
      }

      const newHabit = {
        id: Date.now().toString(),
        name: habitData.name,
        description: habitData.description || "",
        frequency: habitData.frequency || "daily",
        targetCount: habitData.targetCount || 7,
        currentStreak: 0,
        bestStreak: 0,
        completionRate: 0,
        isActive: true,
        createdAt: new Date()
      }

      lifeAreas[areaIndex].habits.push(newHabit)
      lifeAreas[areaIndex].lastUpdated = new Date()

      return NextResponse.json({
        success: true,
        data: newHabit,
        message: "Habit added successfully"
      })
    } else if (action === "add_review") {
      const { areaId, reviewData } = data

      const areaIndex = lifeAreas.findIndex(a => a.id === areaId)
      if (areaIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Life area not found"
        }, { status: 404 })
      }

      const newReview = {
        id: Date.now().toString(),
        type: reviewData.type || "weekly",
        date: reviewData.date ? new Date(reviewData.date) : new Date(),
        score: reviewData.score || 50,
        insights: reviewData.insights || [],
        achievements: reviewData.achievements || [],
        challenges: reviewData.challenges || [],
        nextActions: reviewData.nextActions || [],
        notes: reviewData.notes || ""
      }

      lifeAreas[areaIndex].reviews.push(newReview)
      lifeAreas[areaIndex].currentScore = reviewData.score || lifeAreas[areaIndex].currentScore
      lifeAreas[areaIndex].lastUpdated = new Date()

      return NextResponse.json({
        success: true,
        data: newReview,
        message: "Review added successfully"
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
      error: "Failed to create item"
    }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === "update_area") {
      const { areaId, updates } = data

      const areaIndex = lifeAreas.findIndex(a => a.id === areaId)
      if (areaIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Life area not found"
        }, { status: 404 })
      }

      const updatedArea = {
        ...lifeAreas[areaIndex],
        ...updates,
        lastUpdated: new Date()
      }

      lifeAreas[areaIndex] = updatedArea

      return NextResponse.json({
        success: true,
        data: updatedArea,
        message: "Life area updated successfully"
      })
    } else if (action === "update_goal") {
      const { areaId, goalId, updates } = data

      const areaIndex = lifeAreas.findIndex(a => a.id === areaId)
      if (areaIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Life area not found"
        }, { status: 404 })
      }

      const goalIndex = lifeAreas[areaIndex].goals.findIndex(g => g.id === goalId)
      if (goalIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Goal not found"
        }, { status: 404 })
      }

      const updatedGoal = {
        ...lifeAreas[areaIndex].goals[goalIndex],
        ...updates
      }

      if (updates.targetDate) {
        updatedGoal.targetDate = new Date(updates.targetDate)
      }

      if (updates.status === "completed" && !updates.completedAt) {
        updatedGoal.completedAt = new Date()
      }

      lifeAreas[areaIndex].goals[goalIndex] = updatedGoal
      lifeAreas[areaIndex].lastUpdated = new Date()

      return NextResponse.json({
        success: true,
        data: updatedGoal,
        message: "Goal updated successfully"
      })
    } else if (action === "update_habit") {
      const { areaId, habitId, updates } = data

      const areaIndex = lifeAreas.findIndex(a => a.id === areaId)
      if (areaIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Life area not found"
        }, { status: 404 })
      }

      const habitIndex = lifeAreas[areaIndex].habits.findIndex(h => h.id === habitId)
      if (habitIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Habit not found"
        }, { status: 404 })
      }

      const updatedHabit = {
        ...lifeAreas[areaIndex].habits[habitIndex],
        ...updates
      }

      lifeAreas[areaIndex].habits[habitIndex] = updatedHabit
      lifeAreas[areaIndex].lastUpdated = new Date()

      return NextResponse.json({
        success: true,
        data: updatedHabit,
        message: "Habit updated successfully"
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
      error: "Failed to update item"
    }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const areaId = searchParams.get("areaId")
    const itemId = searchParams.get("itemId")

    if (!action || !areaId) {
      return NextResponse.json({
        success: false,
        error: "Action and areaId are required"
      }, { status: 400 })
    }

    const areaIndex = lifeAreas.findIndex(a => a.id === areaId)
    if (areaIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Life area not found"
      }, { status: 404 })
    }

    if (action === "delete_area") {
      lifeAreas.splice(areaIndex, 1)

      return NextResponse.json({
        success: true,
        message: "Life area deleted successfully"
      })
    } else if (action === "delete_goal" && itemId) {
      const goalIndex = lifeAreas[areaIndex].goals.findIndex(g => g.id === itemId)
      if (goalIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Goal not found"
        }, { status: 404 })
      }

      lifeAreas[areaIndex].goals.splice(goalIndex, 1)
      lifeAreas[areaIndex].lastUpdated = new Date()

      return NextResponse.json({
        success: true,
        message: "Goal deleted successfully"
      })
    } else if (action === "delete_habit" && itemId) {
      const habitIndex = lifeAreas[areaIndex].habits.findIndex(h => h.id === itemId)
      if (habitIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Habit not found"
        }, { status: 404 })
      }

      lifeAreas[areaIndex].habits.splice(habitIndex, 1)
      lifeAreas[areaIndex].lastUpdated = new Date()

      return NextResponse.json({
        success: true,
        message: "Habit deleted successfully"
      })
    } else if (action === "delete_review" && itemId) {
      const reviewIndex = lifeAreas[areaIndex].reviews.findIndex(r => r.id === itemId)
      if (reviewIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Review not found"
        }, { status: 404 })
      }

      lifeAreas[areaIndex].reviews.splice(reviewIndex, 1)
      lifeAreas[areaIndex].lastUpdated = new Date()

      return NextResponse.json({
        success: true,
        message: "Review deleted successfully"
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Invalid action or missing itemId"
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to delete item"
    }, { status: 400 })
  }
}
import { NextRequest, NextResponse } from "next/server"

// Mock data - in a real app, this would come from a database
let tasks = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Write and submit the Q1 project proposal for the new client",
    type: "task",
    priority: "high",
    status: "active",
    energy: "high",
    context: ["@computer", "@office"],
    estimatedTime: 120,
    actualTime: 0,
    dueDate: new Date("2024-01-30T17:00:00Z"),
    project: "Client Work",
    tags: ["work", "writing", "deadline"],
    createdAt: new Date("2024-01-25T09:00:00Z"),
    completedAt: null,
    subtasks: [
      {
        id: "1-1",
        title: "Research client requirements",
        completed: true,
        completedAt: new Date("2024-01-26T14:30:00Z")
      },
      {
        id: "1-2", 
        title: "Draft proposal outline",
        completed: false
      },
      {
        id: "1-3",
        title: "Write full proposal",
        completed: false
      }
    ]
  },
  {
    id: "2",
    title: "Morning workout",
    description: "30 minutes of cardio and strength training",
    type: "habit",
    priority: "medium",
    status: "active",
    energy: "medium",
    context: ["@home", "@gym"],
    estimatedTime: 30,
    actualTime: 0,
    dueDate: new Date("2024-01-26T07:00:00Z"),
    project: "Health & Fitness",
    tags: ["health", "fitness", "routine"],
    createdAt: new Date("2024-01-01T00:00:00Z"),
    completedAt: null,
    subtasks: []
  },
  {
    id: "3",
    title: "Call mom",
    description: "Weekly check-in call with mom",
    type: "task",
    priority: "medium",
    status: "active",
    energy: "low",
    context: ["@phone", "@home"],
    estimatedTime: 30,
    actualTime: 0,
    dueDate: new Date("2024-01-27T19:00:00Z"),
    project: "Personal",
    tags: ["family", "communication"],
    createdAt: new Date("2024-01-25T11:00:00Z"),
    completedAt: null,
    subtasks: []
  },
  {
    id: "4",
    title: "Learn React Native",
    description: "Complete React Native course and build a sample app",
    type: "project",
    priority: "high",
    status: "active",
    energy: "high",
    context: ["@computer"],
    estimatedTime: 2400, // 40 hours
    actualTime: 960, // 16 hours completed
    dueDate: new Date("2024-03-01T00:00:00Z"),
    project: "Learning & Development",
    tags: ["learning", "development", "mobile"],
    createdAt: new Date("2024-01-15T00:00:00Z"),
    completedAt: null,
    subtasks: [
      {
        id: "4-1",
        title: "Complete basics course",
        completed: true,
        completedAt: new Date("2024-01-20T00:00:00Z")
      },
      {
        id: "4-2",
        title: "Build first component",
        completed: true,
        completedAt: new Date("2024-01-25T00:00:00Z")
      },
      {
        id: "4-3",
        title: "Create sample app",
        completed: false
      }
    ]
  },
  {
    id: "5",
    title: "Grocery shopping",
    description: "Buy weekly groceries",
    type: "task",
    priority: "medium",
    status: "completed",
    energy: "low",
    context: ["@errands"],
    estimatedTime: 45,
    actualTime: 52,
    dueDate: new Date("2024-01-25T16:00:00Z"),
    project: "Personal",
    tags: ["shopping", "errands"],
    createdAt: new Date("2024-01-25T10:00:00Z"),
    completedAt: new Date("2024-01-25T16:45:00Z"),
    subtasks: []
  }
]

let projects = [
  {
    id: "1",
    name: "Client Work",
    description: "Projects for external clients",
    status: "active",
    priority: "high",
    progress: 65,
    estimatedCompletion: new Date("2024-02-15T00:00:00Z"),
    tasks: tasks.filter(t => t.project === "Client Work").map(t => t.id),
    createdAt: new Date("2024-01-01T00:00:00Z")
  },
  {
    id: "2",
    name: "Health & Fitness",
    description: "Personal health and fitness goals",
    status: "active",
    priority: "medium",
    progress: 80,
    estimatedCompletion: new Date("2024-12-31T00:00:00Z"),
    tasks: tasks.filter(t => t.project === "Health & Fitness").map(t => t.id),
    createdAt: new Date("2024-01-01T00:00:00Z")
  },
  {
    id: "3",
    name: "Learning & Development",
    description: "Skill development and learning projects",
    status: "active",
    priority: "high",
    progress: 40,
    estimatedCompletion: new Date("2024-06-30T00:00:00Z"),
    tasks: tasks.filter(t => t.project === "Learning & Development").map(t => t.id),
    createdAt: new Date("2024-01-01T00:00:00Z")
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const status = searchParams.get("status")
  const energy = searchParams.get("energy")
  const context = searchParams.get("context")
  const project = searchParams.get("project")
  const search = searchParams.get("search")

  let filteredTasks = [...tasks]

  if (type && type !== "all") {
    filteredTasks = filteredTasks.filter(task => task.type === type)
  }

  if (status && status !== "all") {
    filteredTasks = filteredTasks.filter(task => task.status === status)
  }

  if (energy && energy !== "all") {
    filteredTasks = filteredTasks.filter(task => task.energy === energy)
  }

  if (context && context !== "all") {
    filteredTasks = filteredTasks.filter(task => 
      task.context.includes(context)
    )
  }

  if (project && project !== "all") {
    filteredTasks = filteredTasks.filter(task => task.project === project)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      tasks: filteredTasks,
      projects: projects
    },
    total: filteredTasks.length
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemType, ...itemData } = body

    if (itemType === "task") {
      const newTask = {
        id: Date.now().toString(),
        title: itemData.title,
        description: itemData.description || "",
        type: "task",
        priority: itemData.priority || "medium",
        status: "active",
        energy: itemData.energy || "medium",
        context: itemData.context || [],
        estimatedTime: itemData.estimatedTime || 30,
        actualTime: 0,
        dueDate: itemData.dueDate ? new Date(itemData.dueDate) : null,
        project: itemData.project || "Personal",
        tags: itemData.tags || [],
        createdAt: new Date(),
        completedAt: null,
        subtasks: []
      }

      tasks.push(newTask)

      return NextResponse.json({
        success: true,
        data: newTask,
        message: "Task created successfully"
      })
    } else if (itemType === "project") {
      const newProject = {
        id: Date.now().toString(),
        name: itemData.name,
        description: itemData.description || "",
        status: "active",
        priority: itemData.priority || "medium",
        progress: 0,
        estimatedCompletion: itemData.estimatedCompletion ? new Date(itemData.estimatedCompletion) : null,
        tasks: [],
        createdAt: new Date()
      }

      projects.push(newProject)

      return NextResponse.json({
        success: true,
        data: newProject,
        message: "Project created successfully"
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Invalid item type"
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
    const { id, itemType, ...updates } = body

    if (itemType === "task") {
      const taskIndex = tasks.findIndex(task => task.id === id)
      if (taskIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Task not found"
        }, { status: 404 })
      }

      const updatedTask = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date()
      }

      if (updates.status === "completed" && !updates.completedAt) {
        updatedTask.completedAt = new Date()
      }

      if (updates.dueDate) {
        updatedTask.dueDate = new Date(updates.dueDate)
      }

      tasks[taskIndex] = updatedTask

      // Update project progress if this task belongs to a project
      const project = projects.find(p => p.name === updatedTask.project)
      if (project) {
        const projectTasks = tasks.filter(t => t.project === project.name)
        const completedTasks = projectTasks.filter(t => t.status === "completed")
        project.progress = Math.round((completedTasks.length / projectTasks.length) * 100)
      }

      return NextResponse.json({
        success: true,
        data: updatedTask,
        message: "Task updated successfully"
      })
    } else if (itemType === "project") {
      const projectIndex = projects.findIndex(project => project.id === id)
      if (projectIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Project not found"
        }, { status: 404 })
      }

      const updatedProject = {
        ...projects[projectIndex],
        ...updates,
        updatedAt: new Date()
      }

      if (updates.estimatedCompletion) {
        updatedProject.estimatedCompletion = new Date(updates.estimatedCompletion)
      }

      projects[projectIndex] = updatedProject

      return NextResponse.json({
        success: true,
        data: updatedProject,
        message: "Project updated successfully"
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Invalid item type"
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
    const id = searchParams.get("id")
    const itemType = searchParams.get("type")

    if (!id || !itemType) {
      return NextResponse.json({
        success: false,
        error: "ID and type are required"
      }, { status: 400 })
    }

    if (itemType === "task") {
      const taskIndex = tasks.findIndex(task => task.id === id)
      if (taskIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Task not found"
        }, { status: 404 })
      }

      tasks.splice(taskIndex, 1)

      return NextResponse.json({
        success: true,
        message: "Task deleted successfully"
      })
    } else if (itemType === "project") {
      const projectIndex = projects.findIndex(project => project.id === id)
      if (projectIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Project not found"
        }, { status: 404 })
      }

      projects.splice(projectIndex, 1)

      return NextResponse.json({
        success: true,
        message: "Project deleted successfully"
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Invalid item type"
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to delete item"
    }, { status: 400 })
  }
}
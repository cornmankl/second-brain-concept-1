import { NextRequest, NextResponse } from "next/server"

// Mock data - in a real app, this would come from a database
let flashcards = [
  {
    id: "1",
    front: "What is the Zettelkasten method?",
    back: "A personal tool for thinking and writing that creates a web of thought where ideas are connected and can grow organically. Key principles include atomicity, link density, and unique identifiers.",
    type: "basic",
    status: "review",
    interval: 7,
    easeFactor: 2.5,
    reviews: 5,
    lapses: 0,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Due in 2 days
    tags: ["knowledge-management", "productivity"],
    createdAt: new Date("2024-01-01T10:30:00Z"),
    lastReviewed: new Date("2024-01-20T14:45:00Z"),
    nextReview: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    category: "Learning"
  },
  {
    id: "2",
    front: "What are the four laws of behavior change from Atomic Habits?",
    back: "1) Make it obvious, 2) Make it attractive, 3) Make it easy, 4) Make it satisfying",
    type: "basic",
    status: "learning",
    interval: 1,
    easeFactor: 2.0,
    reviews: 2,
    lapses: 1,
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Overdue
    tags: ["habits", "productivity", "psychology"],
    createdAt: new Date("2024-01-05T09:15:00Z"),
    lastReviewed: new Date("2024-01-18T11:30:00Z"),
    nextReview: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    category: "Personal Development"
  },
  {
    id: "3",
    front: "What is the {{Pomodoro Technique}}?",
    back: "A time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.",
    type: "cloze",
    status: "new",
    interval: 0,
    easeFactor: 2.5,
    reviews: 0,
    lapses: 0,
    dueDate: new Date(),
    tags: ["productivity", "time-management"],
    createdAt: new Date("2024-01-25T14:20:00Z"),
    category: "Productivity"
  },
  {
    id: "4",
    front: "Name the three types of notes in the Zettelkasten method",
    back: "1) Fleeting notes - quick thoughts and ideas, 2) Literature notes - notes from reading and sources, 3) Permanent notes - core insights and understanding",
    type: "qa",
    status: "review",
    interval: 14,
    easeFactor: 2.3,
    reviews: 8,
    lapses: 1,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Due in 5 days
    tags: ["note-taking", "knowledge-management"],
    createdAt: new Date("2023-12-15T10:30:00Z"),
    lastReviewed: new Date("2024-01-15T14:45:00Z"),
    nextReview: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    category: "Learning"
  }
]

let reviewSessions = []

// SM-2 Algorithm implementation
function calculateNewInterval(card, rating) {
  let newEaseFactor = card.easeFactor
  let newInterval = card.interval

  if (rating === "again") {
    newInterval = 1
    newEaseFactor = Math.max(1.3, card.easeFactor - 0.2)
  } else if (rating === "hard") {
    newInterval = Math.max(1, Math.floor(card.interval * 1.2))
    newEaseFactor = Math.max(1.3, card.easeFactor - 0.15)
  } else if (rating === "good") {
    newInterval = card.interval === 0 ? 1 : Math.floor(card.interval * card.easeFactor)
    newEaseFactor = card.easeFactor
  } else if (rating === "easy") {
    newInterval = Math.floor(card.interval * card.easeFactor * 1.3)
    newEaseFactor = Math.min(2.5, card.easeFactor + 0.15)
  }

  return { newInterval, newEaseFactor }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const status = searchParams.get("status")
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const dueOnly = searchParams.get("dueOnly") === "true"

  let filteredCards = [...flashcards]

  if (type && type !== "all") {
    filteredCards = filteredCards.filter(card => card.type === type)
  }

  if (status && status !== "all") {
    filteredCards = filteredCards.filter(card => card.status === status)
  }

  if (category && category !== "all") {
    filteredCards = filteredCards.filter(card => card.category === category)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredCards = filteredCards.filter(card =>
      card.front.toLowerCase().includes(searchLower) ||
      card.back.toLowerCase().includes(searchLower) ||
      card.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  if (dueOnly) {
    const now = new Date()
    filteredCards = filteredCards.filter(card => card.dueDate <= now)
  }

  // Calculate statistics
  const now = new Date()
  const dueCards = flashcards.filter(card => card.dueDate <= now)
  const dueToday = flashcards.filter(card => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return card.dueDate >= today && card.dueDate < tomorrow
  })

  const stats = {
    total: flashcards.length,
    due: dueCards.length,
    dueToday: dueToday.length,
    byStatus: {
      new: flashcards.filter(c => c.status === "new").length,
      learning: flashcards.filter(c => c.status === "learning").length,
      review: flashcards.filter(c => c.status === "review").length,
      suspended: flashcards.filter(c => c.status === "suspended").length
    },
    byType: {
      basic: flashcards.filter(c => c.type === "basic").length,
      cloze: flashcards.filter(c => c.type === "cloze").length,
      image: flashcards.filter(c => c.type === "image").length,
      qa: flashcards.filter(c => c.type === "qa").length
    },
    retentionRate: (() => {
      const totalReviews = flashcards.reduce((sum, card) => sum + card.reviews, 0)
      const totalLapses = flashcards.reduce((sum, card) => sum + card.lapses, 0)
      return totalReviews > 0 ? ((totalReviews - totalLapses) / totalReviews * 100).toFixed(1) : "0"
    })(),
    averageEaseFactor: (flashcards.reduce((sum, card) => sum + card.easeFactor, 0) / flashcards.length).toFixed(2)
  }

  return NextResponse.json({
    success: true,
    data: {
      cards: filteredCards,
      stats: stats,
      dueCards: dueCards
    },
    total: filteredCards.length
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newCard = {
      id: Date.now().toString(),
      front: body.front,
      back: body.back,
      type: body.type || "basic",
      status: "new",
      interval: 0,
      easeFactor: 2.5,
      reviews: 0,
      lapses: 0,
      dueDate: new Date(),
      tags: body.tags || [],
      createdAt: new Date(),
      category: body.category,
      notes: body.notes
    }

    flashcards.push(newCard)

    return NextResponse.json({
      success: true,
      data: newCard,
      message: "Flashcard created successfully"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to create flashcard"
    }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const cardIndex = flashcards.findIndex(card => card.id === id)
    if (cardIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Flashcard not found"
      }, { status: 404 })
    }

    const updatedCard = {
      ...flashcards[cardIndex],
      ...updates
    }

    if (updates.dueDate) {
      updatedCard.dueDate = new Date(updates.dueDate)
    }

    if (updates.lastReviewed) {
      updatedCard.lastReviewed = new Date(updates.lastReviewed)
    }

    if (updates.nextReview) {
      updatedCard.nextReview = new Date(updates.nextReview)
    }

    flashcards[cardIndex] = updatedCard

    return NextResponse.json({
      success: true,
      data: updatedCard,
      message: "Flashcard updated successfully"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to update flashcard"
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

    const cardIndex = flashcards.findIndex(card => card.id === id)
    if (cardIndex === -1) {
      return NextResponse.json({
        success: false,
        error: "Flashcard not found"
      }, { status: 404 })
    }

    flashcards.splice(cardIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Flashcard deleted successfully"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to delete flashcard"
    }, { status: 400 })
  }
}

// Review session management
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === "submit_review") {
      const { cardId, rating, responseTime } = data

      const cardIndex = flashcards.findIndex(card => card.id === cardId)
      if (cardIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Card not found"
        }, { status: 404 })
      }

      const card = flashcards[cardIndex]
      const { newInterval, newEaseFactor } = calculateNewInterval(card, rating)

      const newDueDate = new Date()
      newDueDate.setDate(newDueDate.getDate() + newInterval)

      const updatedCard = {
        ...card,
        interval: newInterval,
        easeFactor: newEaseFactor,
        reviews: card.reviews + 1,
        lapses: rating === "again" ? card.lapses + 1 : card.lapses,
        dueDate: newDueDate,
        lastReviewed: new Date(),
        nextReview: newDueDate,
        status: newInterval > 0 ? "review" : "learning"
      }

      flashcards[cardIndex] = updatedCard

      // Record review session
      const reviewSession = {
        id: Date.now().toString(),
        cardId: cardId,
        rating: rating,
        responseTime: responseTime || 0,
        reviewedAt: new Date(),
        newInterval: newInterval,
        newEaseFactor: newEaseFactor
      }

      reviewSessions.push(reviewSession)

      return NextResponse.json({
        success: true,
        data: {
          updatedCard: updatedCard,
          reviewSession: reviewSession
        },
        message: "Review submitted successfully"
      })
    } else if (action === "get_next_card") {
      const now = new Date()
      const dueCards = flashcards.filter(card => card.dueDate <= now)
      
      if (dueCards.length === 0) {
        return NextResponse.json({
          success: true,
          data: null,
          message: "No cards due for review"
        })
      }

      // Simple algorithm: pick a random due card
      const nextCard = dueCards[Math.floor(Math.random() * dueCards.length)]

      return NextResponse.json({
        success: true,
        data: nextCard,
        message: "Next card retrieved successfully"
      })
    } else if (action === "reset_card") {
      const { cardId } = data

      const cardIndex = flashcards.findIndex(card => card.id === cardId)
      if (cardIndex === -1) {
        return NextResponse.json({
          success: false,
          error: "Card not found"
        }, { status: 404 })
      }

      const resetCard = {
        ...flashcards[cardIndex],
        status: "new",
        interval: 0,
        easeFactor: 2.5,
        reviews: 0,
        lapses: 0,
        dueDate: new Date(),
        lastReviewed: null,
        nextReview: new Date()
      }

      flashcards[cardIndex] = resetCard

      return NextResponse.json({
        success: true,
        data: resetCard,
        message: "Card reset successfully"
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
      error: "Failed to process request"
    }, { status: 400 })
  }
}
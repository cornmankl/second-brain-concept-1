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
  Brain, 
  Plus, 
  Search, 
  Filter,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  RotateCcw,
  BookOpen,
  Target,
  TrendingUp,
  BarChart3,
  Timer,
  Zap,
  Award,
  Archive,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

type CardType = "basic" | "cloze" | "image" | "qa"
type CardStatus = "new" | "learning" | "review" | "suspended"
type ReviewRating = "again" | "hard" | "good" | "easy"

interface Flashcard {
  id: string
  front: string
  back: string
  type: CardType
  status: CardStatus
  interval: number // days until next review
  easeFactor: number // 1.3 - 2.5
  reviews: number
  lapses: number
  dueDate: Date
  tags: string[]
  createdAt: Date
  lastReviewed?: Date
  nextReview?: Date
  category?: string
  notes?: string
}

interface ReviewSession {
  id: string
  cardId: string
  rating: ReviewRating
  responseTime: number // seconds
  reviewedAt: Date
  newInterval: number
  newEaseFactor: number
}

const mockCards: Flashcard[] = [
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
    createdAt: new Date("2024-01-01"),
    lastReviewed: new Date("2024-01-20"),
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
    createdAt: new Date("2024-01-05"),
    lastReviewed: new Date("2024-01-18"),
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
    createdAt: new Date("2024-01-25"),
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
    createdAt: new Date("2023-12-15"),
    lastReviewed: new Date("2024-01-15"),
    nextReview: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    category: "Learning"
  }
]

const typeConfig = {
  basic: { label: "Basic", icon: BookOpen, color: "bg-blue-500" },
  cloze: { label: "Cloze", icon: Target, color: "bg-green-500" },
  image: { label: "Image", icon: Zap, color: "bg-purple-500" },
  qa: { label: "Q&A", icon: Brain, color: "bg-orange-500" }
}

const statusConfig = {
  new: { label: "New", color: "bg-gray-100 text-gray-800", icon: Plus },
  learning: { label: "Learning", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  review: { label: "Review", color: "bg-blue-100 text-blue-800", icon: RotateCcw },
  suspended: { label: "Suspended", color: "bg-gray-100 text-gray-800", icon: Archive }
}

const ratingConfig = {
  again: { label: "Again", color: "bg-red-500", icon: XCircle, description: "Complete blackout" },
  hard: { label: "Hard", color: "bg-orange-500", icon: RotateCcw, description: "Correct but difficult" },
  good: { label: "Good", color: "bg-blue-500", icon: CheckCircle, description: "Correct with some effort" },
  easy: { label: "Easy", color: "bg-green-500", icon: Zap, description: "Perfect recall" }
}

export function SpacedRepetitionView() {
  const [cards, setCards] = useState<Flashcard[]>(mockCards)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<CardType | "all">("all")
  const [statusFilter, setStatusFilter] = useState<CardStatus | "all">("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [reviewSession, setReviewSession] = useState<{
    active: boolean
    currentCard?: Flashcard
    startTime?: Date
    responseTime?: number
    showAnswer: boolean
  }>({
    active: false,
    showAnswer: false
  })

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.back.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = typeFilter === "all" || card.type === typeFilter
    const matchesStatus = statusFilter === "all" || card.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getCardsByStatus = (status: CardStatus) => {
    return filteredCards.filter(card => card.status === status)
  }

  const getDueCards = () => {
    return filteredCards.filter(card => card.dueDate <= new Date())
  }

  const getCardsDueToday = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return filteredCards.filter(card => 
      card.dueDate >= today && card.dueDate < tomorrow
    )
  }

  const startReviewSession = () => {
    const dueCards = getDueCards()
    if (dueCards.length > 0) {
      const randomCard = dueCards[Math.floor(Math.random() * dueCards.length)]
      setReviewSession({
        active: true,
        currentCard: randomCard,
        startTime: new Date(),
        showAnswer: false
      })
    }
  }

  const submitReview = (rating: ReviewRating) => {
    if (!reviewSession.currentCard || !reviewSession.startTime) return

    const responseTime = Math.floor((new Date().getTime() - reviewSession.startTime.getTime()) / 1000)
    const card = reviewSession.currentCard

    // SM-2 algorithm implementation
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

    const newDueDate = new Date()
    newDueDate.setDate(newDueDate.getDate() + newInterval)

    const updatedCard: Flashcard = {
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

    setCards(cards.map(c => c.id === card.id ? updatedCard : c))

    // Move to next card or end session
    const remainingDueCards = getDueCards().filter(c => c.id !== card.id)
    if (remainingDueCards.length > 0) {
      const nextCard = remainingDueCards[Math.floor(Math.random() * remainingDueCards.length)]
      setReviewSession({
        active: true,
        currentCard: nextCard,
        startTime: new Date(),
        showAnswer: false
      })
    } else {
      setReviewSession({ active: false, showAnswer: false })
    }
  }

  const addNewCard = (cardData: Partial<Flashcard>) => {
    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: cardData.front || "",
      back: cardData.back || "",
      type: cardData.type || "basic",
      status: "new",
      interval: 0,
      easeFactor: 2.5,
      reviews: 0,
      lapses: 0,
      dueDate: new Date(),
      tags: cardData.tags || [],
      createdAt: new Date(),
      category: cardData.category,
      notes: cardData.notes
    }
    setCards([...cards, newCard])
    setIsAddDialogOpen(false)
  }

  const deleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id))
  }

  const getRetentionRate = () => {
    const totalReviews = cards.reduce((sum, card) => sum + card.reviews, 0)
    const totalLapses = cards.reduce((sum, card) => sum + card.lapses, 0)
    return totalReviews > 0 ? ((totalReviews - totalLapses) / totalReviews * 100).toFixed(1) : "0"
  }

  const getAverageEaseFactor = () => {
    const avgEase = cards.reduce((sum, card) => sum + card.easeFactor, 0) / cards.length
    return avgEase.toFixed(2)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spaced Repetition</h1>
          <p className="text-muted-foreground">Retain information effectively with intelligent review scheduling</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={startReviewSession} disabled={getDueCards().length === 0}>
            <Brain className="h-4 w-4 mr-2" />
            Review ({getDueCards().length})
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Flashcard</DialogTitle>
                <DialogDescription>
                  Add a new card to your spaced repetition system
                </DialogDescription>
              </DialogHeader>
              <AddCardForm onSubmit={addNewCard} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cards.length}</div>
            <p className="text-xs text-muted-foreground">
              {getDueCards().length} due for review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getRetentionRate()}%</div>
            <p className="text-xs text-muted-foreground">
              Average performance
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCardsDueToday().length}</div>
            <p className="text-xs text-muted-foreground">
              Cards to review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Ease</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAverageEaseFactor()}</div>
            <p className="text-xs text-muted-foreground">
              Difficulty factor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Review Session */}
      {reviewSession.active && reviewSession.currentCard && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Review Session</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setReviewSession({ active: false, showAnswer: false })}
              >
                End Session
              </Button>
            </div>
            <CardDescription>
              {getDueCards().length} cards remaining
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewCard 
              card={reviewSession.currentCard}
              showAnswer={reviewSession.showAnswer}
              onShowAnswer={() => setReviewSession({ ...reviewSession, showAnswer: true })}
              onRate={submitReview}
            />
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={(value: CardType | "all") => setTypeFilter(value)}>
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
            
            <Select value={statusFilter} onValueChange={(value: CardStatus | "all") => setStatusFilter(value)}>
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
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({filteredCards.length})</TabsTrigger>
          <TabsTrigger value="due">Due ({getDueCards().length})</TabsTrigger>
          <TabsTrigger value="new">New ({getCardsByStatus("new").length})</TabsTrigger>
          <TabsTrigger value="learning">Learning ({getCardsByStatus("learning").length})</TabsTrigger>
          <TabsTrigger value="review">Review ({getCardsByStatus("review").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => (
              <FlashcardCard 
                key={card.id} 
                card={card} 
                onDelete={deleteCard}
                onEdit={() => {/* TODO: Implement edit */}}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="due" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getDueCards().map((card) => (
              <FlashcardCard 
                key={card.id} 
                card={card} 
                onDelete={deleteCard}
                onEdit={() => {/* TODO: Implement edit */}}
              />
            ))}
          </div>
        </TabsContent>

        {Object.keys(statusConfig).map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCardsByStatus(status as CardStatus).map((card) => (
                <FlashcardCard 
                  key={card.id} 
                  card={card} 
                  onDelete={deleteCard}
                  onEdit={() => {/* TODO: Implement edit */}}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function ReviewCard({ card, showAnswer, onShowAnswer, onRate }: {
  card: Flashcard,
  showAnswer: boolean,
  onShowAnswer: () => void,
  onRate: (rating: ReviewRating) => void
}) {
  const TypeIcon = typeConfig[card.type].icon

  return (
    <div className="space-y-6">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-lg", typeConfig[card.type].color)}>
            <TypeIcon className="h-5 w-5 text-white" />
          </div>
          <Badge variant="outline" className={statusConfig[card.status].color}>
            {statusConfig[card.status].label}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Card {card.reviews + 1}
        </div>
      </div>

      {/* Card Content */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {card.type === "cloze" ? (
                <p>{card.front.replace(/\{\{([^}]+)\}\}/g, '________')}</p>
              ) : (
                <p>{card.front}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {showAnswer && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p>{card.back}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-4">
        {!showAnswer ? (
          <Button onClick={onShowAnswer} className="w-full">
            Show Answer
          </Button>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(ratingConfig).map(([key, config]) => {
              const Icon = config.icon
              return (
                <Button
                  key={key}
                  variant="outline"
                  className={cn("flex flex-col gap-1 h-auto py-3", config.color.replace("bg-", "bg-").replace("500", "100"))}
                  onClick={() => onRate(key as ReviewRating)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{config.label}</span>
                </Button>
              )
            })}
          </div>
        )}

        {/* Card Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
          <div>
            <div className="font-medium">Interval</div>
            <div>{card.interval} day{card.interval !== 1 ? 's' : ''}</div>
          </div>
          <div>
            <div className="font-medium">Ease Factor</div>
            <div>{card.easeFactor.toFixed(2)}</div>
          </div>
          <div>
            <div className="font-medium">Reviews</div>
            <div>{card.reviews}</div>
          </div>
          <div>
            <div className="font-medium">Lapses</div>
            <div>{card.lapses}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FlashcardCard({ card, onDelete, onEdit }: {
  card: Flashcard,
  onDelete: (id: string) => void,
  onEdit: () => void
}) {
  const TypeIcon = typeConfig[card.type].icon
  const StatusIcon = statusConfig[card.status].icon

  const isDue = card.dueDate <= new Date()
  const daysUntilDue = Math.ceil((card.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={cn("p-1 rounded", typeConfig[card.type].color)}>
                <TypeIcon className="h-4 w-4 text-white" />
              </div>
              {card.front.length > 50 ? `${card.front.substring(0, 50)}...` : card.front}
            </CardTitle>
            <CardDescription className="mt-1">
              {card.type === "cloze" ? card.front.replace(/\{\{([^}]+)\}\}/g, '________') : card.front}
            </CardDescription>
          </div>
          <div className={cn("p-1 rounded", isDue ? "bg-red-100" : "bg-green-100")}>
            <StatusIcon className={cn("h-4 w-4", isDue ? "text-red-600" : "text-green-600")} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Due Status */}
        <div className="flex items-center justify-between">
          <Badge variant={isDue ? "destructive" : "secondary"}>
            {isDue ? "Due Now" : daysUntilDue === 0 ? "Due Today" : `Due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`}
          </Badge>
          <Badge variant="outline" className={statusConfig[card.status].color}>
            {statusConfig[card.status].label}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Mastery Progress</span>
            <span>{card.reviews} review{card.reviews !== 1 ? 's' : ''}</span>
          </div>
          <Progress value={Math.min(100, (card.reviews / 10) * 100)} className="h-2" />
        </div>

        {/* Tags */}
        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {card.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{card.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div className="text-center">
            <div className="font-medium">Interval</div>
            <div>{card.interval}d</div>
          </div>
          <div className="text-center">
            <div className="font-medium">Ease</div>
            <div>{card.easeFactor.toFixed(1)}</div>
          </div>
          <div className="text-center">
            <div className="font-medium">Lapses</div>
            <div>{card.lapses}</div>
          </div>
        </div>

        {/* Category */}
        {card.category && (
          <div className="text-xs text-muted-foreground">
            Category: {card.category}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDelete(card.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AddCardForm({ onSubmit }: { onSubmit: (card: Partial<Flashcard>) => void }) {
  const [formData, setFormData] = useState({
    front: "",
    back: "",
    type: "basic" as CardType,
    tags: "",
    category: "",
    notes: ""
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
        <Label htmlFor="front">Front (Question)</Label>
        <Textarea
          id="front"
          value={formData.front}
          onChange={(e) => setFormData({ ...formData, front: e.target.value })}
          placeholder="Enter the question or front of the card..."
          rows={3}
          required
        />
        <p className="text-xs text-muted-foreground">
          For cloze cards, use {{text}} to create blanks
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="back">Back (Answer)</Label>
        <Textarea
          id="back"
          value={formData.back}
          onChange={(e) => setFormData({ ...formData, back: e.target.value })}
          placeholder="Enter the answer or back of the card..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Card Type</Label>
        <Select value={formData.type} onValueChange={(value: CardType) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(typeConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="tag1, tag2, tag3..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Learning, Work..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes or context..."
          rows={2}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Create Card
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
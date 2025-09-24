"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Brain, 
  Lightbulb, 
  BookOpen, 
  Target, 
  CheckSquare,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Mic,
  MicOff,
  StopCircle,
  Minimize2,
  Maximize2,
  X,
  Plus,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'general' | 'idea-analysis' | 'knowledge-summary' | 'smart-goals' | 'flashcard' | 'task-prioritization' | 'content-recommendations' | 'habit-suggestions' | 'review-insights'
  metadata?: any
}

interface FloatingAIButtonProps {
  currentSection?: string
  contextData?: any
}

const SECTION_SPECIFIC_SUGGESTIONS = {
  inbox: [
    {
      title: "Process Inbox",
      description: "Help organize your inbox items",
      icon: Brain,
      prompt: "Help me process my inbox items. Can you suggest how to organize and prioritize them?"
    },
    {
      title: "Quick Capture",
      description: "Capture new ideas or tasks",
      icon: Plus,
      prompt: "I need to quickly capture something. Help me format it properly for my inbox."
    }
  ],
  "tasks-projects": [
    {
      title: "Prioritize Tasks",
      description: "Get help with task prioritization",
      icon: CheckSquare,
      prompt: "Can you help me prioritize my tasks? I want to focus on what's most important."
    },
    {
      title: "Break Down Project",
      description: "Decompose large projects",
      icon: Target,
      prompt: "Help me break down this large project into smaller, manageable tasks."
    }
  ],
  "ideas-garden": [
    {
      title: "Analyze Idea",
      description: "Evaluate your ideas",
      icon: Lightbulb,
      prompt: "I have an idea I'd like you to analyze. Can you help me evaluate its potential?"
    },
    {
      title: "Develop Idea",
      description: "Expand on your concepts",
      icon: Sparkles,
      prompt: "Help me develop this idea further. What are the next steps and possibilities?"
    }
  ],
  "knowledge-base": [
    {
      title: "Summarize Notes",
      description: "Synthesize your knowledge",
      icon: BookOpen,
      prompt: "Can you help me summarize and connect my knowledge notes? I want to identify key patterns."
    },
    {
      title: "Find Connections",
      description: "Link related concepts",
      icon: Brain,
      prompt: "Help me find connections between different topics in my knowledge base."
    }
  ],
  "spaced-repetition": [
    {
      title: "Create Flashcard",
      description: "Generate learning materials",
      icon: Brain,
      prompt: "Help me create an effective flashcard for this topic I'm learning."
    },
    {
      title: "Study Plan",
      description: "Optimize learning schedule",
      icon: Clock,
      prompt: "Can you help me create a study plan for my spaced repetition learning?"
    }
  ],
  "life-areas": [
    {
      title: "Set Goals",
      description: "Create SMART goals",
      icon: Target,
      prompt: "Help me create SMART goals for improving my life areas."
    },
    {
      title: "Life Balance",
      description: "Assess life balance",
      icon: Sparkles,
      prompt: "Can you help me assess my life balance and suggest improvements?"
    }
  ],
  reviews: [
    {
      title: "Review Insights",
      description: "Analyze your progress",
      icon: BarChart3,
      prompt: "Help me analyze my recent progress and provide insights for improvement."
    },
    {
      title: "Next Steps",
      description: "Plan future actions",
      icon: Target,
      prompt: "Based on my recent review, what should be my focus areas for the next period?"
    }
  ]
}

export function FloatingAIButton({ currentSection = "dashboard", contextData }: FloatingAIButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message based on current section
      const welcomeMessage = getWelcomeMessage(currentSection)
      setMessages([welcomeMessage])
    }
  }, [isOpen, currentSection])

  const getWelcomeMessage = (section: string): ChatMessage => {
    const sectionMessages = {
      inbox: {
        content: "Hello! I'm here to help you process your inbox. I can assist with organizing items, prioritizing tasks, and capturing new thoughts. What would you like to work on?",
        type: 'general'
      },
      "tasks-projects": {
        content: "Hi! I can help you manage your tasks and projects. Need help with prioritization, breaking down projects, or planning your workflow?",
        type: 'task-prioritization'
      },
      "ideas-garden": {
        content: "Welcome to your Ideas Garden! I can help you analyze, develop, and evaluate your ideas. What idea would you like to work on?",
        type: 'idea-analysis'
      },
      "knowledge-base": {
        content: "Hello! I'm here to help you with your knowledge base. I can summarize notes, find connections, and help you organize your learning. What would you like to explore?",
        type: 'knowledge-summary'
      },
      "spaced-repetition": {
        content: "Hi! I can help you create effective flashcards and optimize your learning schedule. What topic are you studying?",
        type: 'flashcard'
      },
      "life-areas": {
        content: "Welcome! I can help you set SMART goals and improve your life balance. Which life area would you like to focus on?",
        type: 'smart-goals'
      },
      reviews: {
        content: "Hello! I can help you analyze your progress and plan your next steps. What would you like to review?",
        type: 'review-insights'
      },
      default: {
        content: "Hi! I'm your AI assistant for the Second Brain system. I can help you with ideas, tasks, knowledge, goals, and more. How can I assist you today?",
        type: 'general'
      }
    }

    const message = sectionMessages[section as keyof typeof sectionMessages] || sectionMessages.default
    return {
      id: "1",
      role: 'assistant',
      content: message.content,
      timestamp: new Date(),
      type: message.type
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: content.trim(),
          context: messages.slice(-6),
          currentSection,
          contextData
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        type: data.type || 'general',
        metadata: data.metadata
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Maaf, saya menghadapi masalah untuk memproses permintaan anda. Sila cuba lagi.",
        timestamp: new Date(),
        type: 'general'
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputMessage)
    }
  }

  const handleSuggestionClick = (prompt: string) => {
    setInputMessage(prompt)
    textareaRef.current?.focus()
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getMessageIcon = (role: 'user' | 'assistant', type?: string) => {
    if (role === 'user') return <User className="h-4 w-4" />
    
    switch (type) {
      case 'idea-analysis': return <Lightbulb className="h-4 w-4" />
      case 'knowledge-summary': return <BookOpen className="h-4 w-4" />
      case 'smart-goals': return <Target className="h-4 w-4" />
      case 'flashcard': return <Brain className="h-4 w-4" />
      case 'task-prioritization': return <CheckSquare className="h-4 w-4" />
      case 'content-recommendations': return <Sparkles className="h-4 w-4" />
      case 'habit-suggestions': return <Clock className="h-4 w-4" />
      case 'review-insights': return <Brain className="h-4 w-4" />
      default: return <Bot className="h-4 w-4" />
    }
  }

  const getMessageTypeColor = (type?: string) => {
    switch (type) {
      case 'idea-analysis': return "bg-yellow-500"
      case 'knowledge-summary': return "bg-purple-500"
      case 'smart-goals': return "bg-indigo-500"
      case 'flashcard': return "bg-red-500"
      case 'task-prioritization': return "bg-green-500"
      case 'content-recommendations': return "bg-blue-500"
      case 'habit-suggestions': return "bg-pink-500"
      case 'review-insights': return "bg-orange-500"
      default: return "bg-gradient-to-r from-blue-500 to-purple-500"
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const getCurrentSectionSuggestions = () => {
    return SECTION_SPECIFIC_SUGGESTIONS[currentSection as keyof typeof SECTION_SPECIFIC_SUGGESTIONS] || []
  }

  if (!isOpen) {
    return (
      <Button
        size="lg"
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 p-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]">
      <Card className="shadow-xl border-0">
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm">AI Assistant</CardTitle>
                <CardDescription className="text-xs">
                  {currentSection === 'dashboard' ? 'Your knowledge companion' : `Helping with ${currentSection.replace('-', ' ')}`}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Chat Area */}
            <CardContent className="p-0">
              <ScrollArea className="h-64 px-4 py-2">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-2",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className={cn(
                          "p-1 rounded flex-shrink-0",
                          getMessageTypeColor(message.type)
                        )}>
                          {getMessageIcon(message.role, message.type)}
                        </div>
                      )}
                      
                      <div className={cn(
                        "max-w-[80%] rounded-lg p-2 text-sm",
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      )}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1"
                            onClick={() => handleCopyMessage(message.content)}
                          >
                            <Copy className="h-2 w-2" />
                          </Button>
                        </div>
                      </div>
                      
                      {message.role === "user" && (
                        <div className="p-1 rounded bg-primary flex-shrink-0">
                          <User className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-2 justify-start">
                      <div className="p-1 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-muted rounded-lg p-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Quick Suggestions */}
              {getCurrentSectionSuggestions().length > 0 && (
                <div className="px-4 py-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Quick suggestions:</p>
                  <div className="flex gap-1 flex-wrap">
                    {getCurrentSectionSuggestions().map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 px-2 py-0"
                        onClick={() => handleSuggestionClick(suggestion.prompt)}
                      >
                        <suggestion.icon className="h-3 w-3 mr-1" />
                        {suggestion.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t p-3">
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 resize-none text-sm"
                    rows={2}
                    disabled={isLoading}
                  />
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleRecording}
                      className={cn(
                        "h-6 w-6",
                        isRecording && "bg-red-500 text-white hover:bg-red-600"
                      )}
                    >
                      {isRecording ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                    </Button>
                    <Button
                      onClick={() => handleSendMessage(inputMessage)}
                      disabled={!inputMessage.trim() || isLoading}
                      size="icon"
                      className="h-6 w-6"
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
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
  StopCircle
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

interface AIAssistantViewProps {
  className?: string
}

const AI_ASSISTANT_SUGGESTIONS = [
  {
    title: "Analyze an Idea",
    description: "Get AI-powered analysis of your ideas",
    icon: Lightbulb,
    prompt: "I have an idea I'd like you to analyze. Can you help me evaluate its potential impact, required effort, and provide recommendations?"
  },
  {
    title: "Summarize Knowledge",
    description: "Synthesize your notes and insights",
    icon: BookOpen,
    prompt: "Can you help me summarize and connect my knowledge notes? I want to identify key patterns and insights."
  },
  {
    title: "Generate SMART Goals",
    description: "Create actionable goals for your life areas",
    icon: Target,
    prompt: "Help me create SMART goals for improving my life areas. I want specific, measurable, and achievable goals."
  },
  {
    title: "Prioritize Tasks",
    description: "Get AI assistance with task management",
    icon: CheckSquare,
    prompt: "Can you help me prioritize my tasks? I want to optimize my productivity and focus on what matters most."
  },
  {
    title: "Create Flashcards",
    description: "Generate effective learning materials",
    icon: Brain,
    prompt: "Help me create effective flashcards for spaced repetition learning. I want to retain information better."
  },
  {
    title: "Get Content Recommendations",
    description: "Discover personalized learning resources",
    icon: Sparkles,
    prompt: "Based on my interests and goals, can you recommend high-quality learning resources and content?"
  }
]

export function AIAssistantView({ className }: AIAssistantViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI assistant for the Second Brain system. I can help you with:\n\n• Analyzing and developing your ideas\n• Summarizing and connecting your knowledge\n• Creating SMART goals for your life areas\n• Prioritizing your tasks and projects\n• Generating flashcards for learning\n• Recommending personalized content\n• Suggesting new habits\n• Providing review insights\n\nHow can I assist you today?",
      timestamp: new Date(),
      type: 'general'
    }
  ])
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
          context: messages.slice(-6) // Send last 6 messages for context
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
        content: "I apologize, but I encountered an error while processing your request. Please try again later.",
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
      default: return "bg-gray-500"
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Voice recording functionality would be implemented here
  }

  return (
    <div className={cn("flex h-full", className)}>
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">AI Assistant</h2>
              <p className="text-sm text-muted-foreground">Your intelligent knowledge companion</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className={cn(
                        "p-2 rounded-lg flex-shrink-0",
                        getMessageTypeColor(message.type)
                      )}>
                        {getMessageIcon(message.role, message.type)}
                      </div>
                    )}
                    
                    <div className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopyMessage(message.content)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.type && message.type !== 'general' && (
                          <Badge variant="secondary" className="text-xs">
                            {message.type.replace('-', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {message.role === "user" && (
                      <div className="p-2 rounded-lg bg-primary flex-shrink-0">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="p-2 rounded-lg bg-gray-500 flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything about your Second Brain..."
                  className="flex-1 resize-none"
                  rows={2}
                  disabled={isLoading}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleRecording}
                    className={cn(
                      isRecording && "bg-red-500 text-white hover:bg-red-600"
                    )}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => handleSendMessage(inputMessage)}
                    disabled={!inputMessage.trim() || isLoading}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions Sidebar */}
          <div className="w-80 border-l bg-card/50 p-4 hidden lg:block">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  {AI_ASSISTANT_SUGGESTIONS.map((suggestion, index) => (
                    <Card 
                      key={index}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleSuggestionClick(suggestion.prompt)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-2">
                          <div className="p-1 rounded bg-primary/10">
                            <suggestion.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{suggestion.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {suggestion.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Capabilities</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4" />
                    <span>Idea analysis and development</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Knowledge synthesis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>SMART goal generation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckSquare className="h-4 w-4" />
                    <span>Task prioritization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Content recommendations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Habit suggestions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
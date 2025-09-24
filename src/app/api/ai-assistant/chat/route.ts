import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai/ai-service'

// Initialize AI service
const aiService = new AIService()

interface ChatRequest {
  message: string
  context?: Array<{
    role: 'user' | 'assistant'
    content: string
    type?: string
  }>
  currentSection?: string
  contextData?: any
}

interface ChatResponse {
  response: string
  type: string
  metadata?: any
}

// Function to determine the type of request based on message content
function determineRequestType(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('idea') || lowerMessage.includes('analyze') || lowerMessage.includes('evaluate')) {
    return 'idea-analysis'
  } else if (lowerMessage.includes('summarize') || lowerMessage.includes('knowledge') || lowerMessage.includes('notes') || lowerMessage.includes('synthesis')) {
    return 'knowledge-summary'
  } else if (lowerMessage.includes('goal') || lowerMessage.includes('smart') || lowerMessage.includes('objective')) {
    return 'smart-goals'
  } else if (lowerMessage.includes('flashcard') || lowerMessage.includes('learn') || lowerMessage.includes('memorize')) {
    return 'flashcard'
  } else if (lowerMessage.includes('task') || lowerMessage.includes('prioritize') || lowerMessage.includes('productivity')) {
    return 'task-prioritization'
  } else if (lowerMessage.includes('recommend') || lowerMessage.includes('content') || lowerMessage.includes('resource') || lowerMessage.includes('learning')) {
    return 'content-recommendations'
  } else if (lowerMessage.includes('habit') || lowerMessage.includes('routine') || lowerMessage.includes('behavior')) {
    return 'habit-suggestions'
  } else if (lowerMessage.includes('review') || lowerMessage.includes('insight') || lowerMessage.includes('reflection')) {
    return 'review-insights'
  }
  
  return 'general'
}

// Function to create a system prompt based on request type and current section
function createSystemPrompt(type: string, currentSection: string): string {
  const basePrompt = `You are an AI assistant for the Second Brain knowledge management system. You help users with their personal knowledge management, task organization, idea development, and personal growth. 

Current section: ${currentSection}

Your capabilities include:
- Analyzing and developing ideas
- Summarizing and synthesizing knowledge
- Creating SMART goals
- Generating flashcards for learning
- Prioritizing tasks and projects
- Recommending learning content
- Suggesting new habits
- Providing review insights

Always be helpful, practical, and provide actionable advice. Keep your responses concise but comprehensive. Use markdown formatting when appropriate. Respond in Malay or English based on user's language preference.`

  // Add section-specific context
  const sectionContext = getSectionContext(currentSection)
  
  switch (type) {
    case 'idea-analysis':
      return `${basePrompt}

${sectionContext}

For idea analysis, focus on:
- Impact assessment (1-10 scale)
- Effort estimation (1-10 scale)
- Potential risks and challenges
- Market opportunity (if applicable)
- Recommended next steps
- Innovation level

Provide structured, actionable insights.`
    
    case 'knowledge-summary':
      return `${basePrompt}

${sectionContext}

For knowledge synthesis, focus on:
- Key concepts and main ideas
- Connections and relationships between topics
- Knowledge gaps or areas for further research
- Actionable insights or applications
- Recommended organization structure

Identify patterns and provide practical applications.`
    
    case 'smart-goals':
      return `${basePrompt}

${sectionContext}

For goal setting, focus on:
- Specific, measurable, achievable, relevant, time-bound goals
- Key milestones for each goal
- Potential obstacles and mitigation strategies
- Success metrics and tracking methods
- Resource requirements
- Estimated timeline

Provide practical, actionable goals with clear milestones.`
    
    case 'flashcard':
      return `${basePrompt}

${sectionContext}

For flashcard creation, focus on:
- Clear, concise questions
- Comprehensive but focused answers
- Key terms or concepts to emphasize
- Difficulty-appropriate language
- Mnemonic devices or memory aids

Create effective learning materials that promote retention.`
    
    case 'task-prioritization':
      return `${basePrompt}

${sectionContext}

For task prioritization, focus on:
- Optimal ordering based on energy levels and context
- Time constraints and deadlines
- Priority alignment with goals
- Mental load and focus requirements
- Scheduling recommendations
- Bottleneck identification

Provide specific, actionable recommendations with clear reasoning.`
    
    case 'content-recommendations':
      return `${basePrompt}

${sectionContext}

For content recommendations, focus on:
- High-quality, relevant learning resources
- Key concepts or skills to focus on
- Learning path or sequence recommendations
- Project ideas to apply learning
- Progress tracking methods

For each recommendation, include:
- Title/name and type
- Difficulty level and time commitment
- Why it's relevant to their goals
- Where to find it`
    
    case 'habit-suggestions':
      return `${basePrompt}

${sectionContext}

For habit formation, focus on:
- Specific, actionable behaviors
- Optimal timing and frequency
- Implementation intentions and trigger designs
- Progress tracking methods
- Environmental design recommendations
- Success metrics and gradual progression

Provide evidence-based habit suggestions with practical implementation strategies.`
    
    case 'review-insights':
      return `${basePrompt}

${sectionContext}

For review insights, focus on:
- Key insights and patterns from activities
- Progress analysis and trend identification
- Strength and opportunity assessment
- Root cause analysis for challenges
- Data-driven recommendations
- Focus areas for next period

Provide balanced, constructive insights with actionable recommendations.`
    
    default:
      return `${basePrompt}

${sectionContext}`
  }
}

// Function to get section-specific context
function getSectionContext(section: string): string {
  const contexts = {
    inbox: "User is currently in the Inbox section, focusing on capturing and processing incoming items, tasks, and ideas.",
    "tasks-projects": "User is currently in the Tasks & Projects section, managing their GTD-style task system and project planning.",
    "ideas-garden": "User is currently in the Ideas Garden section, developing and incubating their ideas and innovations.",
    "knowledge-base": "User is currently in the Knowledge Base section, organizing their permanent learning repository and notes.",
    "spaced-repetition": "User is currently in the Spaced Repetition section, working on memory retention and effective learning.",
    "life-areas": "User is currently in the Life Areas section, focusing on balanced growth and personal development.",
    reviews: "User is currently in the Reviews section, reflecting on their progress and optimizing their systems.",
    "ai-assistant": "User is currently in the AI Assistant section, having a conversation with their AI companion.",
    dashboard: "User is currently on the Dashboard, getting an overview of their entire Second Brain system."
  }
  
  return contexts[section as keyof typeof contexts] || contexts.dashboard
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, context = [], currentSection = 'dashboard', contextData } = body

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Initialize AI service if not already initialized
    const initialized = await aiService.initialize()
    if (!initialized) {
      return NextResponse.json(
        { error: 'Failed to initialize AI service' },
        { status: 500 }
      )
    }

    // Determine the type of request
    const requestType = determineRequestType(message)
    
    // Create conversation history
    const conversationHistory = context.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // Create system message based on request type
    const systemMessage = {
      role: 'system' as const,
      content: createSystemPrompt(requestType, currentSection)
    }

    // Create user message
    const userMessage = {
      role: 'user' as const,
      content: message
    }

    // Prepare messages for AI service
    const aiMessages = [systemMessage, ...conversationHistory, userMessage]

    // Get AI response
    const result = await aiService.chatCompletion({
      messages: aiMessages,
      temperature: 0.7,
      maxTokens: 1500
    })

    if (!result.success) {
      console.error('AI service error:', result.error)
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: 500 }
      )
    }

    const aiResponse = result.data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.'

    const response: ChatResponse = {
      response: aiResponse,
      type: requestType,
      metadata: {
        timestamp: new Date().toISOString(),
        model: result.data.model,
        usage: result.data.usage
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
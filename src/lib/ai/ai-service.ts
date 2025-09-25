import ZAI from 'z-ai-web-dev-sdk'

interface AIServiceConfig {
  apiKey?: string
  baseUrl?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatCompletionOptions {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  model?: string
}

interface ImageGenerationOptions {
  prompt: string
  size?: '256x256' | '512x512' | '1024x1024'
  model?: string
}

interface WebSearchOptions {
  query: string
  num?: number
}

interface AIProcessingResult {
  success: boolean
  data?: any
  error?: string
  timestamp: Date
}

export class AIService {
  private zai: any
  private config: AIServiceConfig
  private isInitialized: boolean = false

  constructor(config: AIServiceConfig = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.ZAI_API_KEY,
      baseUrl: config.baseUrl || process.env.ZAI_BASE_URL,
      model: config.model || 'gpt-3.5-turbo',
      maxTokens: config.maxTokens || 1000,
      temperature: config.temperature || 0.7,
      ...config
    }
  }

  async initialize(): Promise<boolean> {
    try {
      // Try to initialize with minimal config
      this.zai = await ZAI.create({})
      this.isInitialized = true
      return true
    } catch (error) {
      console.warn('Failed to initialize AI service with ZAI:', error)
      // Set isInitialized to true to use fallback mode
      this.isInitialized = true
      return true
    }
  }

  private async ensureInitialized(): Promise<boolean> {
    if (!this.isInitialized) {
      return await this.initialize()
    }
    return true
  }

  async chatCompletion(options: ChatCompletionOptions): Promise<AIProcessingResult> {
    try {
      const initialized = await this.ensureInitialized()
      if (!initialized || !this.zai) {
        // Fallback response when AI service is not available
        console.warn('AI service not initialized, using fallback response')
        return this.getFallbackResponse(options.messages[options.messages.length - 1]?.content || '')
      }

      const completion = await this.zai.chat.completions.create({
        messages: options.messages,
        temperature: options.temperature || this.config.temperature,
        maxTokens: options.maxTokens || this.config.maxTokens,
        model: options.model || this.config.model
      })

      return {
        success: true,
        data: completion,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('Chat completion error:', error)
      // Fallback response when AI service fails
      console.warn('AI service failed, using fallback response')
      return this.getFallbackResponse(options.messages[options.messages.length - 1]?.content || '')
    }
  }

  private getFallbackResponse(userMessage: string): AIProcessingResult {
    const lowerMessage = userMessage.toLowerCase()
    let response = ''

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = "Hello! I'm your AI Assistant. I'm currently running in fallback mode, but I'm here to help you with your Second Brain system. How can I assist you today?"
    } else if (lowerMessage.includes('idea') || lowerMessage.includes('analyze')) {
      response = "I'd be happy to help you analyze your idea! However, I'm currently running in fallback mode. For a comprehensive analysis, please ensure the AI service is properly configured. In the meantime, consider: What's the potential impact of this idea? What resources would you need? What are the first steps you could take?"
    } else if (lowerMessage.includes('goal') || lowerMessage.includes('smart')) {
      response = "Great! Setting SMART goals is important for personal development. While I'm in fallback mode, remember that good goals should be Specific, Measurable, Achievable, Relevant, and Time-bound. What area of your life would you like to set goals for?"
    } else if (lowerMessage.includes('task') || lowerMessage.includes('prioritize')) {
      response = "I can help you prioritize your tasks! While I'm in fallback mode, consider these questions: What tasks have the biggest impact? What are your deadlines? What tasks align with your goals? What's your energy level like throughout the day?"
    } else if (lowerMessage.includes('learn') || lowerMessage.includes('knowledge')) {
      response = "Learning and knowledge management are key to personal growth! While I'm in fallback mode, think about: What topics interest you most? How do you learn best? What resources do you have available? How can you apply what you learn?"
    } else if (lowerMessage.includes('habit') || lowerMessage.includes('routine')) {
      response = "Building good habits is essential for personal development! While I'm in fallback mode, consider: What small change could make a big difference? When can you consistently perform this action? What triggers will remind you? How will you track your progress?"
    } else {
      response = "I'm your AI Assistant for the Second Brain system. I'm currently running in fallback mode, but I'm here to help you with:\n\n• Idea analysis and development\n• Knowledge synthesis and learning\n• SMART goal setting\n• Task prioritization and productivity\n• Learning content recommendations\n• Habit formation and personal development\n\nPlease try again later or check your AI service configuration."
    }

    return {
      success: true,
      data: {
        choices: [{
          message: {
            content: response
          }
        }],
        model: 'fallback-mode',
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      },
      timestamp: new Date()
    }
  }

  async generateImage(options: ImageGenerationOptions): Promise<AIProcessingResult> {
    try {
      const initialized = await this.ensureInitialized()
      if (!initialized) {
        return {
          success: false,
          error: 'AI service not initialized',
          timestamp: new Date()
        }
      }

      const response = await this.zai.images.generations.create({
        prompt: options.prompt,
        size: options.size || '1024x1024'
      })

      return {
        success: true,
        data: response,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('Image generation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }
  }

  async webSearch(options: WebSearchOptions): Promise<AIProcessingResult> {
    try {
      const initialized = await this.ensureInitialized()
      if (!initialized) {
        return {
          success: false,
          error: 'AI service not initialized',
          timestamp: new Date()
        }
      }

      const searchResult = await this.zai.functions.invoke("web_search", {
        query: options.query,
        num: options.num || 10
      })

      return {
        success: true,
        data: searchResult,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('Web search error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }
  }

  // Specialized AI functions for the Second Brain System

  async generateIdeaAnalysis(idea: {
    title: string
    description: string
    category: string
    currentImpact?: number
    currentEffort?: number
  }): Promise<AIProcessingResult> {
    const systemPrompt = `You are an expert idea evaluator and business analyst. Analyze the provided idea and give detailed feedback on:

1. Impact assessment (1-10 scale)
2. Effort estimation (1-10 scale) 
3. Potential risks and challenges
4. Market opportunity (if applicable)
5. Recommended next steps
6. Similar ideas or competitors
7. Innovation level

Provide your response in a structured JSON format with clear, actionable insights.`

    const userPrompt = `Please analyze this idea:

Title: ${idea.title}
Description: ${idea.description}
Category: ${idea.category}
${idea.currentImpact ? `Current Impact Rating: ${idea.currentImpact}/10` : ''}
${idea.currentEffort ? `Current Effort Rating: ${idea.currentEffort}/10` : ''}

Provide a comprehensive analysis with specific recommendations.`

    const result = await this.chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      maxTokens: 1500
    })

    if (result.success) {
      try {
        // Try to parse the response as JSON for structured data
        const content = result.data.choices[0]?.message?.content
        if (content) {
          // Clean up the response and try to parse JSON
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsedData = JSON.parse(jsonMatch[0])
            return {
              ...result,
              data: {
                ...result.data,
                parsedAnalysis: parsedData
              }
            }
          }
        }
      } catch (parseError) {
        console.warn('Failed to parse AI response as JSON:', parseError)
      }
    }

    return result
  }

  async generateKnowledgeSummary(notes: Array<{
    title: string
    content: string
    tags: string[]
  }>): Promise<AIProcessingResult> {
    const systemPrompt = `You are an expert knowledge manager and synthesizer. Your task is to analyze the provided notes and generate:

1. A comprehensive summary of key concepts
2. Connections and relationships between ideas
3. Knowledge gaps or areas for further research
4. Actionable insights or applications
5. Recommended structure for organizing this knowledge

Focus on identifying patterns, connections, and practical applications. Provide your response in a clear, structured format.`

    const notesText = notes.map((note, index) => 
      `Note ${index + 1}: ${note.title}\n${note.content}\nTags: ${note.tags.join(', ')}`
    ).join('\n\n')

    const userPrompt = `Please analyze and synthesize these notes:\n\n${notesText}`

    return await this.chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.5,
      maxTokens: 2000
    })
  }

  async generateSmartGoals(lifeArea: string, currentScore: number, targetScore: number): Promise<AIProcessingResult> {
    const systemPrompt = `You are an expert life coach and goal-setting strategist. Based on the provided life area and current/target scores, generate:

1. 3-5 specific, measurable, achievable, relevant, time-bound (SMART) goals
2. Key milestones for each goal
3. Potential obstacles and mitigation strategies
4. Success metrics and tracking methods
5. Resource requirements
6. Estimated timeline for each goal

Focus on practical, actionable goals that will help bridge the gap between current and target scores.`

    const userPrompt = `Generate SMART goals for:

Life Area: ${lifeArea}
Current Score: ${currentScore}/100
Target Score: ${targetScore}/100
Gap: ${targetScore - currentScore} points

Please provide specific, actionable goals with clear milestones.`

    return await this.chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.4,
      maxTokens: 1500
    })
  }

  async generateFlashcardContent(topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<AIProcessingResult> {
    const systemPrompt = `You are an expert educational content creator. Generate a high-quality flashcard for the given topic and difficulty level. The flashcard should include:

1. A clear, concise question on the front
2. A comprehensive but focused answer on the back
3. Key terms or concepts to emphasize
4. Difficulty-appropriate language
5. Mnemonic devices or memory aids (if applicable)

Format your response as JSON with 'front' and 'back' fields.`

    const userPrompt = `Generate a ${difficulty}-level flashcard about: ${topic}`

    const result = await this.chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      maxTokens: 800
    })

    if (result.success) {
      try {
        const content = result.data.choices[0]?.message?.content
        if (content) {
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsedData = JSON.parse(jsonMatch[0])
            return {
              ...result,
              data: {
                ...result.data,
                flashcard: parsedData
              }
            }
          }
        }
      } catch (parseError) {
        console.warn('Failed to parse flashcard JSON:', parseError)
      }
    }

    return result
  }

  async generateTaskPrioritization(tasks: Array<{
    title: string
    description: string
    priority: string
    estimatedTime: number
    energy: string
    context: string[]
  }>): Promise<AIProcessingResult> {
    const systemPrompt = `You are an expert productivity and time management specialist. Analyze the provided tasks and provide:

1. Optimal ordering/prioritization based on:
   - Energy levels required vs available
   - Context switching efficiency
   - Time constraints and deadlines
   - Priority alignment with goals
   - Mental load and focus requirements

2. Recommended scheduling approach (time blocking, energy mapping, etc.)
3. Potential bottlenecks or conflicts
4. Delegation or automation opportunities
5. Buffer time recommendations

Provide specific, actionable recommendations with clear reasoning.`

    const tasksText = tasks.map((task, index) => 
      `Task ${index + 1}: ${task.title}\nDescription: ${task.description}\nPriority: ${task.priority}\nEstimated Time: ${task.estimatedTime} minutes\nEnergy: ${task.energy}\nContext: ${task.context.join(', ')}`
    ).join('\n\n')

    const userPrompt = `Please analyze and prioritize these tasks for optimal productivity:\n\n${tasksText}`

    return await this.chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      maxTokens: 1500
    })
  }

  async generateContentRecommendations(userInterests: string[], learningGoals: string[]): Promise<AIProcessingResult> {
    const systemPrompt = `You are an expert learning curator and content strategist. Based on the user's interests and learning goals, recommend:

1. High-quality learning resources (books, courses, articles, videos)
2. Key concepts or skills to focus on
3. Learning path or sequence recommendations
4. Community or networking opportunities
5. Project ideas to apply the learning
6. Progress tracking methods

For each recommendation, include:
- Title/name
- Type (book, course, article, etc.)
- Difficulty level
- Time commitment estimate
- Why it's relevant to their goals
- Where to find it`

    const userPrompt = `Generate personalized learning recommendations for:

Interests: ${userInterests.join(', ')}
Learning Goals: ${learningGoals.join(', ')}

Please provide diverse, high-quality recommendations tailored to these interests and goals.`

    return await this.chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.4,
      maxTokens: 2000
    })
  }

  async generateHabitSuggestions(lifeArea: string, currentHabits: string[], goals: string[]): Promise<AIProcessingResult> {
    const systemPrompt = `You are an expert habit formation and behavioral design specialist. Based on the life area, current habits, and goals, suggest:

1. 3-5 new habits that would directly support the goals
2. Habit stacking opportunities (linking new habits to existing ones)
3. Implementation intentions and trigger designs
4. Progress tracking methods
5. Potential obstacles and solutions
6. Celebration and reward systems

For each habit suggestion, include:
- Clear, specific behavior definition
- Optimal timing and frequency
- Environmental design recommendations
- Success metrics
- Gradual progression approach`

    const userPrompt = `Suggest new habits for:

Life Area: ${lifeArea}
Current Habits: ${currentHabits.join(', ')}
Goals: ${goals.join(', ')}

Please provide practical, evidence-based habit suggestions that would support goal achievement.`

    return await this.chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.4,
      maxTokens: 1500
    })
  }

  async generateReviewInsights(areaData: {
    name: string
    currentScore: number
    recentActivities: string[]
    achievements: string[]
    challenges: string[]
  }): Promise<AIProcessingResult> {
    const systemPrompt = `You are an expert life coach and personal development analyst. Based on the provided area data, generate:

1. Key insights and patterns from recent activities
2. Progress analysis and trend identification
3. Strength and opportunity assessment
4. Root cause analysis for challenges
5. Data-driven recommendations for improvement
6. Celebration-worthy achievements and milestones
7. Focus areas for the next review period

Provide balanced, constructive insights with specific, actionable recommendations.`

    const userPrompt = `Generate review insights for:

Area: ${areaData.name}
Current Score: ${areaData.currentScore}/100
Recent Activities: ${areaData.recentActivities.join(', ')}
Achievements: ${areaData.achievements.join(', ')}
Challenges: ${areaData.challenges.join(', ')}

Please provide comprehensive insights and actionable recommendations.`

    return await this.chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      maxTokens: 1500
    })
  }

  async generateContentIdea(topic: string, contentType: 'article' | 'video' | 'podcast' | 'course', audience: string): Promise<AIProcessingResult> {
    const systemPrompt = `You are an expert content strategist and creator. Generate a comprehensive content idea for:

1. Content title and hook
2. Key learning objectives or takeaways
3. Outline/structure recommendations
4. Engagement strategies
5. Production requirements and resources needed
6. Distribution and promotion strategy
7. Success metrics and KPIs

Make the content specific, valuable, and tailored to the target audience.`

    const userPrompt = `Generate a ${contentType} content idea about "${topic}" for ${audience} audience.

Please provide a comprehensive, actionable content plan with specific recommendations.`

    return await this.chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.5,
      maxTokens: 1200
    })
  }
}

// Export singleton instance
export const aiService = new AIService()
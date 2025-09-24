import { AIService } from './ai-service'

// Initialize AI service
const aiService = new AIService()

export interface AIHelperContext {
  section: string
  data?: any
  userPreferences?: {
    language: 'en' | 'ms'
    expertiseLevel: 'beginner' | 'intermediate' | 'advanced'
  }
}

export class AIHelpers {
  /**
   * Get AI assistance for inbox processing
   */
  static async processInbox(items: Array<{
    title: string
    content: string
    type: 'task' | 'idea' | 'note' | 'reference'
  }>, context: AIHelperContext): Promise<string> {
    const systemPrompt = `You are an expert in GTD (Getting Things Done) methodology and inbox processing. 
Help the user process their inbox items by suggesting:
1. Which items need immediate action vs. can be deferred
2. How to categorize each item (task, project, reference, etc.)
3. Priority levels for tasks
4. Suggested next actions
5. Delegation opportunities if applicable

Respond in a clear, actionable format with specific recommendations for each item.`

    const itemsText = items.map((item, index) => 
      `Item ${index + 1}: ${item.title}\nContent: ${item.content}\nType: ${item.type}`
    ).join('\n\n')

    const userPrompt = `Please help me process these inbox items:\n\n${itemsText}`

    try {
      const result = await aiService.chatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        maxTokens: 1500
      })

      if (result.success) {
        return result.data.choices[0]?.message?.content || 'Unable to process inbox at this time.'
      }
      throw new Error(result.error || 'Failed to process inbox')
    } catch (error) {
      console.error('Inbox processing error:', error)
      return 'Maaf, saya tidak dapat memproses inbox anda sekarang. Sila cuba lagi.'
    }
  }

  /**
   * Get AI assistance for task prioritization
   */
  static async prioritizeTasks(tasks: Array<{
    title: string
    description: string
    priority: string
    estimatedTime: number
    energy: string
    context: string[]
  }>, context: AIHelperContext): Promise<string> {
    const systemPrompt = `You are an expert in productivity and task management using methodologies like GTD, Eisenhower Matrix, and energy management.
Analyze the provided tasks and provide:
1. Optimal prioritization based on urgency and importance
2. Recommended ordering considering energy levels and time constraints
3. Time blocking suggestions
4. Context switching optimization
5. Potential bottlenecks and solutions

Provide specific, actionable recommendations with clear reasoning.`

    const tasksText = tasks.map((task, index) => 
      `Task ${index + 1}: ${task.title}\nDescription: ${task.description}\nPriority: ${task.priority}\nEstimated Time: ${task.estimatedTime} minutes\nEnergy: ${task.energy}\nContext: ${task.context.join(', ')}`
    ).join('\n\n')

    const userPrompt = `Please help me prioritize these tasks for optimal productivity:\n\n${tasksText}`

    try {
      const result = await aiService.chatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4,
        maxTokens: 1200
      })

      if (result.success) {
        return result.data.choices[0]?.message?.content || 'Unable to prioritize tasks at this time.'
      }
      throw new Error(result.error || 'Failed to prioritize tasks')
    } catch (error) {
      console.error('Task prioritization error:', error)
      return 'Maaf, saya tidak mengutamakan tugas anda sekarang. Sila cuba lagi.'
    }
  }

  /**
   * Get AI assistance for idea analysis and development
   */
  static async analyzeIdea(idea: {
    title: string
    description: string
    category: string
    currentImpact?: number
    currentEffort?: number
  }, context: AIHelperContext): Promise<string> {
    const systemPrompt = `You are an expert innovation coach and business analyst. Analyze the provided idea and give detailed feedback on:
1. Impact assessment (1-10 scale) with reasoning
2. Effort estimation (1-10 scale) with breakdown
3. Potential risks and mitigation strategies
4. Market opportunity analysis (if applicable)
5. Recommended next steps and milestones
6. Innovation level assessment
7. Similar ideas or competitors to consider
8. Resource requirements

Provide structured, actionable insights with specific recommendations.`

    const userPrompt = `Please analyze this idea:\n\nTitle: ${idea.title}\nDescription: ${idea.description}\nCategory: ${idea.category}\n${idea.currentImpact ? `Current Impact Rating: ${idea.currentImpact}/10` : ''}\n${idea.currentEffort ? `Current Effort Rating: ${idea.currentEffort}/10` : ''}\n\nProvide a comprehensive analysis with specific recommendations.`

    try {
      const result = await aiService.chatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        maxTokens: 1500
      })

      if (result.success) {
        return result.data.choices[0]?.message?.content || 'Unable to analyze idea at this time.'
      }
      throw new Error(result.error || 'Failed to analyze idea')
    } catch (error) {
      console.error('Idea analysis error:', error)
      return 'Maaf, saya tidak dapat menganalisis idea anda sekarang. Sila cuba lagi.'
    }
  }

  /**
   * Get AI assistance for knowledge synthesis
   */
  static async synthesizeKnowledge(notes: Array<{
    title: string
    content: string
    tags: string[]
  }>, context: AIHelperContext): Promise<string> {
    const systemPrompt = `You are an expert knowledge manager and synthesizer. Analyze the provided notes and generate:
1. A comprehensive summary of key concepts and main ideas
2. Connections and relationships between different topics
3. Knowledge gaps or areas for further research
4. Actionable insights and practical applications
5. Recommended structure for organizing this knowledge
6. Learning paths or next steps for deeper understanding

Focus on identifying patterns, making connections, and providing practical applications. Use clear, structured formatting.`

    const notesText = notes.map((note, index) => 
      `Note ${index + 1}: ${note.title}\n${note.content}\nTags: ${note.tags.join(', ')}`
    ).join('\n\n')

    const userPrompt = `Please analyze and synthesize these knowledge notes:\n\n${notesText}`

    try {
      const result = await aiService.chatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        maxTokens: 2000
      })

      if (result.success) {
        return result.data.choices[0]?.message?.content || 'Unable to synthesize knowledge at this time.'
      }
      throw new Error(result.error || 'Failed to synthesize knowledge')
    } catch (error) {
      console.error('Knowledge synthesis error:', error)
      return 'Maaf, saya tidak dapat mensintesis pengetahuan anda sekarang. Sila cuba lagi.'
    }
  }

  /**
   * Get AI assistance for creating flashcards
   */
  static async createFlashcard(topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate', context: AIHelperContext): Promise<string> {
    const systemPrompt = `You are an expert educational content creator specializing in effective learning and memory retention. 
Create a high-quality flashcard for the given topic and difficulty level. The flashcard should include:

1. A clear, concise, and engaging question on the front
2. A comprehensive but focused answer on the back
3. Key terms or concepts to emphasize
4. Difficulty-appropriate language and examples
5. Mnemonic devices or memory aids (if applicable)
6. Connections to related concepts

Format your response as a structured flashcard with clear front/back sections. Make it effective for spaced repetition learning.`

    const userPrompt = `Create a ${difficulty}-level flashcard about: ${topic}`

    try {
      const result = await aiService.chatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        maxTokens: 800
      })

      if (result.success) {
        return result.data.choices[0]?.message?.content || 'Unable to create flashcard at this time.'
      }
      throw new Error(result.error || 'Failed to create flashcard')
    } catch (error) {
      console.error('Flashcard creation error:', error)
      return 'Maaf, saya tidak dapat membuat flashcard anda sekarang. Sila cuba lagi.'
    }
  }

  /**
   * Get AI assistance for SMART goal generation
   */
  static async generateSMARTGoals(lifeArea: string, currentScore: number, targetScore: number, context: AIHelperContext): Promise<string> {
    const systemPrompt = `You are an expert life coach and goal-setting strategist specializing in SMART methodology. 
Based on the provided life area and current/target scores, generate:

1. 3-5 specific, measurable, achievable, relevant, time-bound (SMART) goals
2. Key milestones and success metrics for each goal
3. Potential obstacles and practical mitigation strategies
4. Resource requirements and support systems needed
5. Estimated timeline and tracking methods
6. Celebration and reward suggestions

Focus on practical, actionable goals that will help bridge the gap between current and target scores. Provide realistic and motivating recommendations.`

    const userPrompt = `Generate SMART goals for:\n\nLife Area: ${lifeArea}\nCurrent Score: ${currentScore}/100\nTarget Score: ${targetScore}/100\nGap: ${targetScore - currentScore} points\n\nPlease provide specific, actionable goals with clear milestones and tracking methods.`

    try {
      const result = await aiService.chatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4,
        maxTokens: 1500
      })

      if (result.success) {
        return result.data.choices[0]?.message?.content || 'Unable to generate goals at this time.'
      }
      throw new Error(result.error || 'Failed to generate goals')
    } catch (error) {
      console.error('Goal generation error:', error)
      return 'Maaf, saya tidak dapat menjana matlamat anda sekarang. Sila cuba lagi.'
    }
  }

  /**
   * Get AI assistance for habit formation
   */
  static async suggestHabits(lifeArea: string, currentHabits: string[], goals: string[], context: AIHelperContext): Promise<string> {
    const systemPrompt = `You are an expert habit formation and behavioral design specialist. Based on the life area, current habits, and goals, suggest:

1. 3-5 new habits that would directly support the goals
2. Habit stacking opportunities (linking new habits to existing ones)
3. Implementation intentions and trigger designs
4. Progress tracking methods and success metrics
5. Environmental design recommendations
6. Potential obstacles and solutions
7. Gradual progression approach and celebration systems

For each habit suggestion, include:
- Clear, specific behavior definition
- Optimal timing and frequency
- Implementation strategies
- Success metrics and tracking methods

Provide evidence-based habit suggestions with practical implementation strategies.`

    const userPrompt = `Suggest new habits for:\n\nLife Area: ${lifeArea}\nCurrent Habits: ${currentHabits.join(', ')}\nGoals: ${goals.join(', ')}\n\nPlease provide practical, evidence-based habit suggestions that would support goal achievement.`

    try {
      const result = await aiService.chatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4,
        maxTokens: 1500
      })

      if (result.success) {
        return result.data.choices[0]?.message?.content || 'Unable to suggest habits at this time.'
      }
      throw new Error(result.error || 'Failed to suggest habits')
    } catch (error) {
      console.error('Habit suggestion error:', error)
      return 'Maaf, saya tidak dapat mencadangkan tabiat anda sekarang. Sila cuba lagi.'
    }
  }

  /**
   * Get AI assistance for review insights
   */
  static async generateReviewInsights(areaData: {
    name: string
    currentScore: number
    previousScore?: number
    recentActivities: string[]
    achievements: string[]
    challenges: string[]
  }, context: AIHelperContext): Promise<string> {
    const systemPrompt = `You are an expert life coach and personal development analyst. Based on the provided area data, generate:
1. Key insights and patterns from recent activities
2. Progress analysis and trend identification
3. Strength and opportunity assessment
4. Root cause analysis for challenges
5. Data-driven recommendations for improvement
6. Celebration-worthy achievements and milestones
7. Focus areas for the next review period

Provide balanced, constructive insights with specific, actionable recommendations. Use data to support your analysis and suggestions.`

    const userPrompt = `Generate review insights for:\n\nArea: ${areaData.name}\nCurrent Score: ${areaData.currentScore}/100\n${areaData.previousScore ? `Previous Score: ${areaData.previousScore}/100\nChange: ${areaData.currentScore - areaData.previousScore} points` : ''}\nRecent Activities: ${areaData.recentActivities.join(', ')}\nAchievements: ${areaData.achievements.join(', ')}\nChallenges: ${areaData.challenges.join(', ')}\n\nPlease provide comprehensive insights and actionable recommendations.`

    try {
      const result = await aiService.chatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        maxTokens: 1500
      })

      if (result.success) {
        return result.data.choices[0]?.message?.content || 'Unable to generate insights at this time.'
      }
      throw new Error(result.error || 'Failed to generate insights')
    } catch (error) {
      console.error('Review insights error:', error)
      return 'Maaf, saya tidak dapat menjana pandangan anda sekarang. Sila cuba lagi.'
    }
  }

  /**
   * Get AI assistance for content recommendations
   */
  static async getContentRecommendations(interests: string[], learningGoals: string[], context: AIHelperContext): Promise<string> {
    const systemPrompt = `You are an expert learning curator and content strategist. Based on the user's interests and learning goals, recommend:
1. High-quality learning resources (books, courses, articles, videos, podcasts)
2. Key concepts or skills to focus on
3. Learning path or sequence recommendations
4. Community or networking opportunities
5. Project ideas to apply the learning
6. Progress tracking methods

For each recommendation, include:
- Title/name and type (book, course, article, etc.)
- Difficulty level and time commitment estimate
- Why it's relevant to their goals
- Where to find it
- Key takeaways or benefits

Provide diverse, high-quality recommendations tailored to these interests and goals.`

    const userPrompt = `Generate personalized learning recommendations for:\n\nInterests: ${interests.join(', ')}\nLearning Goals: ${learningGoals.join(', ')}\n\nPlease provide diverse, high-quality recommendations tailored to these interests and goals.`

    try {
      const result = await aiService.chatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4,
        maxTokens: 2000
      })

      if (result.success) {
        return result.data.choices[0]?.message?.content || 'Unable to generate recommendations at this time.'
      }
      throw new Error(result.error || 'Failed to generate recommendations')
    } catch (error) {
      console.error('Content recommendations error:', error)
      return 'Maaf, saya tidak dapat menghasilkan cadangan anda sekarang. Sila cuba lagi.'
    }
  }
}
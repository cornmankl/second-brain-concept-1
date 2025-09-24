"use client"

import { useState, useCallback } from 'react'
import { aiService } from '@/lib/ai/ai-service'

interface UseAIOptions {
  autoInitialize?: boolean
}

interface AIRequestState {
  loading: boolean
  error: string | null
  data: any
  lastRequest: Date | null
}

export function useAI(options: UseAIOptions = {}) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [requestStates, setRequestStates] = useState<Record<string, AIRequestState>>({})

  const getRequestState = useCallback((requestType: string): AIRequestState => {
    return requestStates[requestType] || {
      loading: false,
      error: null,
      data: null,
      lastRequest: null
    }
  }, [requestStates])

  const setRequestState = useCallback((requestType: string, updates: Partial<AIRequestState>) => {
    setRequestStates(prev => ({
      ...prev,
      [requestType]: {
        ...getRequestState(requestType),
        ...updates,
        lastRequest: updates.lastRequest || new Date()
      }
    }))
  }, [getRequestState])

  const initialize = useCallback(async () => {
    const success = await aiService.initialize()
    setIsInitialized(success)
    return success
  }, [])

  // Initialize on mount if autoInitialize is true
  useState(() => {
    if (options.autoInitialize) {
      initialize()
    }
  })

  const generateIdeaAnalysis = useCallback(async (idea: {
    title: string
    description: string
    category: string
    currentImpact?: number
    currentEffort?: number
  }) => {
    setRequestState('ideaAnalysis', { loading: true, error: null })
    
    try {
      const result = await aiService.generateIdeaAnalysis(idea)
      
      if (result.success) {
        setRequestState('ideaAnalysis', {
          loading: false,
          error: null,
          data: result.data
        })
        return result.data
      } else {
        setRequestState('ideaAnalysis', {
          loading: false,
          error: result.error || 'Failed to analyze idea',
          data: null
        })
        throw new Error(result.error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setRequestState('ideaAnalysis', {
        loading: false,
        error: errorMessage,
        data: null
      })
      throw error
    }
  }, [setRequestState])

  const generateKnowledgeSummary = useCallback(async (notes: Array<{
    title: string
    content: string
    tags: string[]
  }>) => {
    setRequestState('knowledgeSummary', { loading: true, error: null })
    
    try {
      const result = await aiService.generateKnowledgeSummary(notes)
      
      if (result.success) {
        setRequestState('knowledgeSummary', {
          loading: false,
          error: null,
          data: result.data
        })
        return result.data
      } else {
        setRequestState('knowledgeSummary', {
          loading: false,
          error: result.error || 'Failed to generate summary',
          data: null
        })
        throw new Error(result.error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setRequestState('knowledgeSummary', {
        loading: false,
        error: errorMessage,
        data: null
      })
      throw error
    }
  }, [setRequestState])

  const generateSmartGoals = useCallback(async (lifeArea: string, currentScore: number, targetScore: number) => {
    setRequestState('smartGoals', { loading: true, error: null })
    
    try {
      const result = await aiService.generateSmartGoals(lifeArea, currentScore, targetScore)
      
      if (result.success) {
        setRequestState('smartGoals', {
          loading: false,
          error: null,
          data: result.data
        })
        return result.data
      } else {
        setRequestState('smartGoals', {
          loading: false,
          error: result.error || 'Failed to generate goals',
          data: null
        })
        throw new Error(result.error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setRequestState('smartGoals', {
        loading: false,
        error: errorMessage,
        data: null
      })
      throw error
    }
  }, [setRequestState])

  const generateFlashcardContent = useCallback(async (topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    setRequestState('flashcardContent', { loading: true, error: null })
    
    try {
      const result = await aiService.generateFlashcardContent(topic, difficulty)
      
      if (result.success) {
        setRequestState('flashcardContent', {
          loading: false,
          error: null,
          data: result.data
        })
        return result.data
      } else {
        setRequestState('flashcardContent', {
          loading: false,
          error: result.error || 'Failed to generate flashcard',
          data: null
        })
        throw new Error(result.error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setRequestState('flashcardContent', {
        loading: false,
        error: errorMessage,
        data: null
      })
      throw error
    }
  }, [setRequestState])

  const generateTaskPrioritization = useCallback(async (tasks: Array<{
    title: string
    description: string
    priority: string
    estimatedTime: number
    energy: string
    context: string[]
  }>) => {
    setRequestState('taskPrioritization', { loading: true, error: null })
    
    try {
      const result = await aiService.generateTaskPrioritization(tasks)
      
      if (result.success) {
        setRequestState('taskPrioritization', {
          loading: false,
          error: null,
          data: result.data
        })
        return result.data
      } else {
        setRequestState('taskPrioritization', {
          loading: false,
          error: result.error || 'Failed to prioritize tasks',
          data: null
        })
        throw new Error(result.error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setRequestState('taskPrioritization', {
        loading: false,
        error: errorMessage,
        data: null
      })
      throw error
    }
  }, [setRequestState])

  const generateContentRecommendations = useCallback(async (userInterests: string[], learningGoals: string[]) => {
    setRequestState('contentRecommendations', { loading: true, error: null })
    
    try {
      const result = await aiService.generateContentRecommendations(userInterests, learningGoals)
      
      if (result.success) {
        setRequestState('contentRecommendations', {
          loading: false,
          error: null,
          data: result.data
        })
        return result.data
      } else {
        setRequestState('contentRecommendations', {
          loading: false,
          error: result.error || 'Failed to generate recommendations',
          data: null
        })
        throw new Error(result.error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setRequestState('contentRecommendations', {
        loading: false,
        error: errorMessage,
        data: null
      })
      throw error
    }
  }, [setRequestState])

  const generateHabitSuggestions = useCallback(async (lifeArea: string, currentHabits: string[], goals: string[]) => {
    setRequestState('habitSuggestions', { loading: true, error: null })
    
    try {
      const result = await aiService.generateHabitSuggestions(lifeArea, currentHabits, goals)
      
      if (result.success) {
        setRequestState('habitSuggestions', {
          loading: false,
          error: null,
          data: result.data
        })
        return result.data
      } else {
        setRequestState('habitSuggestions', {
          loading: false,
          error: result.error || 'Failed to generate habit suggestions',
          data: null
        })
        throw new Error(result.error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setRequestState('habitSuggestions', {
        loading: false,
        error: errorMessage,
        data: null
      })
      throw error
    }
  }, [setRequestState])

  const generateReviewInsights = useCallback(async (areaData: {
    name: string
    currentScore: number
    recentActivities: string[]
    achievements: string[]
    challenges: string[]
  }) => {
    setRequestState('reviewInsights', { loading: true, error: null })
    
    try {
      const result = await aiService.generateReviewInsights(areaData)
      
      if (result.success) {
        setRequestState('reviewInsights', {
          loading: false,
          error: null,
          data: result.data
        })
        return result.data
      } else {
        setRequestState('reviewInsights', {
          loading: false,
          error: result.error || 'Failed to generate insights',
          data: null
        })
        throw new Error(result.error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setRequestState('reviewInsights', {
        loading: false,
        error: errorMessage,
        data: null
      })
      throw error
    }
  }, [setRequestState])

  const generateContentIdea = useCallback(async (topic: string, contentType: 'article' | 'video' | 'podcast' | 'course', audience: string) => {
    setRequestState('contentIdea', { loading: true, error: null })
    
    try {
      const result = await aiService.generateContentIdea(topic, contentType, audience)
      
      if (result.success) {
        setRequestState('contentIdea', {
          loading: false,
          error: null,
          data: result.data
        })
        return result.data
      } else {
        setRequestState('contentIdea', {
          loading: false,
          error: result.error || 'Failed to generate content idea',
          data: null
        })
        throw new Error(result.error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setRequestState('contentIdea', {
        loading: false,
        error: errorMessage,
        data: null
      })
      throw error
    }
  }, [setRequestState])

  const generateImage = useCallback(async (prompt: string, size: '256x256' | '512x512' | '1024x1024' = '1024x1024') => {
    setRequestState('imageGeneration', { loading: true, error: null })
    
    try {
      const result = await aiService.generateImage({ prompt, size })
      
      if (result.success) {
        setRequestState('imageGeneration', {
          loading: false,
          error: null,
          data: result.data
        })
        return result.data
      } else {
        setRequestState('imageGeneration', {
          loading: false,
          error: result.error || 'Failed to generate image',
          data: null
        })
        throw new Error(result.error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setRequestState('imageGeneration', {
        loading: false,
        error: errorMessage,
        data: null
      })
      throw error
    }
  }, [setRequestState])

  const performWebSearch = useCallback(async (query: string, num: number = 10) => {
    setRequestState('webSearch', { loading: true, error: null })
    
    try {
      const result = await aiService.webSearch({ query, num })
      
      if (result.success) {
        setRequestState('webSearch', {
          loading: false,
          error: null,
          data: result.data
        })
        return result.data
      } else {
        setRequestState('webSearch', {
          loading: false,
          error: result.error || 'Failed to perform web search',
          data: null
        })
        throw new Error(result.error)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setRequestState('webSearch', {
        loading: false,
        error: errorMessage,
        data: null
      })
      throw error
    }
  }, [setRequestState])

  const clearError = useCallback((requestType: string) => {
    setRequestState(requestType, { error: null })
  }, [setRequestState])

  const clearData = useCallback((requestType: string) => {
    setRequestState(requestType, { data: null })
  }, [setRequestState])

  return {
    // State
    isInitialized,
    requestStates,
    
    // Initialization
    initialize,
    
    // AI Functions
    generateIdeaAnalysis,
    generateKnowledgeSummary,
    generateSmartGoals,
    generateFlashcardContent,
    generateTaskPrioritization,
    generateContentRecommendations,
    generateHabitSuggestions,
    generateReviewInsights,
    generateContentIdea,
    generateImage,
    performWebSearch,
    
    // State getters
    getIdeaAnalysisState: () => getRequestState('ideaAnalysis'),
    getKnowledgeSummaryState: () => getRequestState('knowledgeSummary'),
    getSmartGoalsState: () => getRequestState('smartGoals'),
    getFlashcardContentState: () => getRequestState('flashcardContent'),
    getTaskPrioritizationState: () => getRequestState('taskPrioritization'),
    getContentRecommendationsState: () => getRequestState('contentRecommendations'),
    getHabitSuggestionsState: () => getRequestState('habitSuggestions'),
    getReviewInsightsState: () => getRequestState('reviewInsights'),
    getContentIdeaState: () => getRequestState('contentIdea'),
    getImageGenerationState: () => getRequestState('imageGeneration'),
    getWebSearchState: () => getRequestState('webSearch'),
    
    // Utilities
    clearError,
    clearData
  }
}

// Specialized hooks for specific AI features
export function useIdeaAnalysis() {
  const ai = useAI()
  
  const analyzeIdea = async (idea: {
    title: string
    description: string
    category: string
    currentImpact?: number
    currentEffort?: number
  }) => {
    return await ai.generateIdeaAnalysis(idea)
  }

  return {
    analyzeIdea,
    state: ai.getIdeaAnalysisState(),
    clearError: () => ai.clearError('ideaAnalysis'),
    clearData: () => ai.clearData('ideaAnalysis')
  }
}

export function useKnowledgeSummary() {
  const ai = useAI()
  
  const summarizeKnowledge = async (notes: Array<{
    title: string
    content: string
    tags: string[]
  }>) => {
    return await ai.generateKnowledgeSummary(notes)
  }

  return {
    summarizeKnowledge,
    state: ai.getKnowledgeSummaryState(),
    clearError: () => ai.clearError('knowledgeSummary'),
    clearData: () => ai.clearData('knowledgeSummary')
  }
}

export function useSmartGoals() {
  const ai = useAI()
  
  const createGoals = async (lifeArea: string, currentScore: number, targetScore: number) => {
    return await ai.generateSmartGoals(lifeArea, currentScore, targetScore)
  }

  return {
    createGoals,
    state: ai.getSmartGoalsState(),
    clearError: () => ai.clearError('smartGoals'),
    clearData: () => ai.clearData('smartGoals')
  }
}

export function useTaskPrioritization() {
  const ai = useAI()
  
  const prioritizeTasks = async (tasks: Array<{
    title: string
    description: string
    priority: string
    estimatedTime: number
    energy: string
    context: string[]
  }>) => {
    return await ai.generateTaskPrioritization(tasks)
  }

  return {
    prioritizeTasks,
    state: ai.getTaskPrioritizationState(),
    clearError: () => ai.clearError('taskPrioritization'),
    clearData: () => ai.clearData('taskPrioritization')
  }
}

export function useContentRecommendations() {
  const ai = useAI()
  
  const getRecommendations = async (userInterests: string[], learningGoals: string[]) => {
    return await ai.generateContentRecommendations(userInterests, learningGoals)
  }

  return {
    getRecommendations,
    state: ai.getContentRecommendationsState(),
    clearError: () => ai.clearError('contentRecommendations'),
    clearData: () => ai.clearData('contentRecommendations')
  }
}

export function useImageGeneration() {
  const ai = useAI()
  
  const generateImage = async (prompt: string, size: '256x256' | '512x512' | '1024x1024' = '1024x1024') => {
    return await ai.generateImage(prompt, size)
  }

  return {
    generateImage,
    state: ai.getImageGenerationState(),
    clearError: () => ai.clearError('imageGeneration'),
    clearData: () => ai.clearData('imageGeneration')
  }
}

export function useWebSearch() {
  const ai = useAI()
  
  const search = async (query: string, num: number = 10) => {
    return await ai.performWebSearch(query, num)
  }

  return {
    search,
    state: ai.getWebSearchState(),
    clearError: () => ai.clearError('webSearch'),
    clearData: () => ai.clearData('webSearch')
  }
}
"use client"

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseWebSocketOptions {
  url?: string
  autoConnect?: boolean
  reconnectAttempts?: number
  reconnectInterval?: number
  onMessage?: (message: any) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
}

interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

export interface UseWebSocketReturn {
  socket: WebSocket | null
  isConnected: boolean
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
  sendMessage: (message: any) => void
  joinRoom: (room: string) => void
  leaveRoom: (room: string) => void
  broadcastDataUpdate: (type: string, action: string, data: any) => void
  sendCollaborationEvent: (type: string, data: any) => void
  startTyping: (room: string, documentId?: string) => void
  stopTyping: (room: string, documentId?: string) => void
  sendNotification: (notification: any) => void
  updateProgress: (type: string, itemId: string, progress: number, message?: string) => void
  unlockAchievement: (achievement: any) => void
  sendMessage: (message: string, options?: { room?: string; recipientId?: string; type?: 'direct' | 'room' | 'broadcast' }) => void
  connectedUsers: any[]
  activeRooms: Record<string, number>
  lastMessage: WebSocketMessage | null
  error: Error | null
  connect: () => void
  disconnect: () => void
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    onMessage,
    onConnect,
    onDisconnect,
    onError
  } = options

  const socketRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const [connectedUsers, setConnectedUsers] = useState<any[]>([])
  const [activeRooms, setActiveRooms] = useState<Record<string, number>>({})
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectCountRef = useRef(0)

  const connect = useCallback(() => {
    try {
      setConnectionStatus('connecting')
      setError(null)

      const socket = new WebSocket(url)
      socketRef.current = socket

      socket.onopen = () => {
        setIsConnected(true)
        setConnectionStatus('connected')
        reconnectCountRef.current = 0
        onConnect?.()
        
        // Send user join event
        const userId = localStorage.getItem('userId') || `user_${Date.now()}`
        const userName = localStorage.getItem('userName') || 'Anonymous User'
        
        socket.send(JSON.stringify({
          type: 'user:join',
          data: {
            id: userId,
            name: userName,
            avatar: localStorage.getItem('userAvatar') || undefined
          }
        }))
      }

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          setLastMessage({
            type: message.type || 'unknown',
            data: message.data || message,
            timestamp: new Date().toISOString()
          })

          // Handle different message types
          switch (message.type) {
            case 'users:online':
              setConnectedUsers(message.data.users || [])
              break
            case 'room:user_joined':
            case 'room:user_left':
              // Update active rooms
              setActiveRooms(prev => ({
                ...prev,
                [message.data.room]: message.data.userCount
              }))
              break
            case 'data:updated':
              // Handle real-time data updates
              console.log('Data updated:', message.data)
              break
            case 'collaboration:event':
              // Handle collaboration events
              console.log('Collaboration event:', message.data)
              break
            case 'typing:indicator':
              // Handle typing indicators
              console.log('Typing indicator:', message.data)
              break
            case 'notification:receive':
              // Handle notifications
              console.log('Notification received:', message.data)
              break
            case 'progress:updated':
              // Handle progress updates
              console.log('Progress updated:', message.data)
              break
            case 'achievement:unlocked':
              // Handle achievements
              console.log('Achievement unlocked:', message.data)
              break
            case 'message':
              // Handle chat messages
              console.log('Message received:', message.data)
              break
            case 'connection:established':
              console.log('Connection established:', message.data)
              break
            default:
              console.log('Unknown message type:', message.type, message.data)
          }

          onMessage?.(message)
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
          setError(err as Error)
        }
      }

      socket.onclose = () => {
        setIsConnected(false)
        setConnectionStatus('disconnected')
        onDisconnect?.()

        // Attempt to reconnect if not manually disconnected
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++
          console.log(`Reconnecting... Attempt ${reconnectCountRef.current} of ${reconnectAttempts}`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }

      socket.onerror = (err) => {
        const error = new Error('WebSocket connection error')
        setError(error)
        setConnectionStatus('error')
        onError?.(error)
        console.error('WebSocket error:', err)
      }
    } catch (err) {
      const error = new Error('Failed to create WebSocket connection')
      setError(error)
      setConnectionStatus('error')
      onError?.(error)
      console.error('WebSocket connection error:', err)
    }
  }, [url, reconnectAttempts, reconnectInterval, onConnect, onDisconnect, onMessage, onError])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }
    
    setIsConnected(false)
    setConnectionStatus('disconnected')
    reconnectCountRef.current = 0
  }, [])

  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && isConnected) {
      try {
        const messageString = typeof message === 'string' ? message : JSON.stringify(message)
        socketRef.current.send(messageString)
      } catch (err) {
        console.error('Error sending WebSocket message:', err)
        setError(err as Error)
      }
    } else {
      console.warn('WebSocket not connected, cannot send message')
    }
  }, [isConnected])

  const joinRoom = useCallback((room: string) => {
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`
    sendMessage({
      type: 'room:join',
      data: { room, userId }
    })
  }, [sendMessage])

  const leaveRoom = useCallback((room: string) => {
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`
    sendMessage({
      type: 'room:leave',
      data: { room, userId }
    })
  }, [sendMessage])

  const broadcastDataUpdate = useCallback((type: string, action: string, data: any) => {
    sendMessage({
      type: 'data:update',
      data: { type, action, data }
    })
  }, [sendMessage])

  const sendCollaborationEvent = useCallback((type: string, data: any) => {
    sendMessage({
      type: 'collaboration:event',
      data: { type, data }
    })
  }, [sendMessage])

  const startTyping = useCallback((room: string, documentId?: string) => {
    sendMessage({
      type: 'typing:start',
      data: { room, documentId }
    })
  }, [sendMessage])

  const stopTyping = useCallback((room: string, documentId?: string) => {
    sendMessage({
      type: 'typing:stop',
      data: { room, documentId }
    })
  }, [sendMessage])

  const sendNotification = useCallback((notification: any) => {
    sendMessage({
      type: 'notification:send',
      data: notification
    })
  }, [sendMessage])

  const updateProgress = useCallback((type: string, itemId: string, progress: number, message?: string) => {
    sendMessage({
      type: 'progress:update',
      data: { type, itemId, progress, message }
    })
  }, [sendMessage])

  const unlockAchievement = useCallback((achievement: any) => {
    sendMessage({
      type: 'achievement:unlock',
      data: achievement
    })
  }, [sendMessage])

  const sendChatMessage = useCallback((
    text: string, 
    options: { room?: string; recipientId?: string; type?: 'direct' | 'room' | 'broadcast' } = {}
  ) => {
    sendMessage({
      type: 'message',
      data: { text, ...options }
    })
  }, [sendMessage])

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  return {
    socket: socketRef.current,
    isConnected,
    connectionStatus,
    sendMessage: sendChatMessage,
    joinRoom,
    leaveRoom,
    broadcastDataUpdate,
    sendCollaborationEvent,
    startTyping,
    stopTyping,
    sendNotification,
    updateProgress,
    unlockAchievement,
    sendMessage: sendChatMessage,
    connectedUsers,
    activeRooms,
    lastMessage,
    error,
    connect,
    disconnect
  }
}

// Specialized hooks for specific features
export function useRealTimeUpdates() {
  const { broadcastDataUpdate, ...rest } = useWebSocket()
  
  const notifyInboxUpdate = useCallback((action: 'create' | 'update' | 'delete', data: any) => {
    broadcastDataUpdate('inbox', action, data)
  }, [broadcastDataUpdate])

  const notifyTaskUpdate = useCallback((action: 'create' | 'update' | 'delete', data: any) => {
    broadcastDataUpdate('tasks', action, data)
  }, [broadcastDataUpdate])

  const notifyIdeaUpdate = useCallback((action: 'create' | 'update' | 'delete', data: any) => {
    broadcastDataUpdate('ideas', action, data)
  }, [broadcastDataUpdate])

  const notifyKnowledgeUpdate = useCallback((action: 'create' | 'update' | 'delete', data: any) => {
    broadcastDataUpdate('knowledge', action, data)
  }, [broadcastDataUpdate])

  const notifySpacedRepetitionUpdate = useCallback((action: 'create' | 'update' | 'delete', data: any) => {
    broadcastDataUpdate('spaced-repetition', action, data)
  }, [broadcastDataUpdate])

  const notifyLifeAreasUpdate = useCallback((action: 'create' | 'update' | 'delete', data: any) => {
    broadcastDataUpdate('life-areas', action, data)
  }, [broadcastDataUpdate])

  return {
    ...rest,
    notifyInboxUpdate,
    notifyTaskUpdate,
    notifyIdeaUpdate,
    notifyKnowledgeUpdate,
    notifySpacedRepetitionUpdate,
    notifyLifeAreasUpdate
  }
}

export function useCollaboration(room: string = 'default') {
  const { 
    joinRoom, 
    leaveRoom, 
    sendCollaborationEvent, 
    startTyping, 
    stopTyping,
    connectedUsers,
    isConnected,
    onMessage
  } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'collaboration:event' && message.data.room === room) {
        // Handle collaboration events for this room
        console.log('Collaboration event in room:', room, message.data)
      }
    }
  })

  useEffect(() => {
    if (isConnected) {
      joinRoom(room)
    }
    return () => {
      if (isConnected) {
        leaveRoom(room)
      }
    }
  }, [isConnected, joinRoom, leaveRoom, room])

  const sendCursorMove = useCallback((x: number, y: number) => {
    sendCollaborationEvent('cursor_move', { room, x, y })
  }, [sendCollaborationEvent, room])

  const sendSelection = useCallback((selection: any) => {
    sendCollaborationEvent('selection', { room, selection })
  }, [sendCollaborationEvent, room])

  const sendEdit = useCallback((edit: any) => {
    sendCollaborationEvent('edit', { room, edit })
  }, [sendCollaborationEvent, room])

  return {
    connectedUsers,
    isConnected,
    sendCursorMove,
    sendSelection,
    sendEdit,
    startTyping: (documentId?: string) => startTyping(room, documentId),
    stopTyping: (documentId?: string) => stopTyping(room, documentId)
  }
}

export function useNotifications() {
  const { sendNotification, onMessage, ...rest } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'notification:receive') {
        // Handle incoming notifications
        console.log('Notification received:', message.data)
      }
    }
  })

  const sendInfo = useCallback((title: string, message: string, userId?: string, roomId?: string) => {
    sendNotification({
      type: 'info',
      title,
      message,
      userId,
      roomId
    })
  }, [sendNotification])

  const sendSuccess = useCallback((title: string, message: string, userId?: string, roomId?: string) => {
    sendNotification({
      type: 'success',
      title,
      message,
      userId,
      roomId
    })
  }, [sendNotification])

  const sendWarning = useCallback((title: string, message: string, userId?: string, roomId?: string) => {
    sendNotification({
      type: 'warning',
      title,
      message,
      userId,
      roomId
    })
  }, [sendNotification])

  const sendError = useCallback((title: string, message: string, userId?: string, roomId?: string) => {
    sendNotification({
      type: 'error',
      title,
      message,
      userId,
      roomId
    })
  }, [sendNotification])

  return {
    ...rest,
    sendInfo,
    sendSuccess,
    sendWarning,
    sendError
  }
}

export function useProgressSharing() {
  const { updateProgress, onMessage, ...rest } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'progress:updated') {
        // Handle progress updates from other users
        console.log('Progress updated:', message.data)
      }
    }
  })

  const shareGoalProgress = useCallback((goalId: string, progress: number, message?: string) => {
    updateProgress('goal', goalId, progress, message)
  }, [updateProgress])

  const shareHabitProgress = useCallback((habitId: string, progress: number, message?: string) => {
    updateProgress('habit', habitId, progress, message)
  }, [updateProgress])

  const shareProjectProgress = useCallback((projectId: string, progress: number, message?: string) => {
    updateProgress('project', projectId, progress, message)
  }, [updateProgress])

  const shareLearningProgress = useCallback((learningId: string, progress: number, message?: string) => {
    updateProgress('learning', learningId, progress, message)
  }, [updateProgress])

  return {
    ...rest,
    shareGoalProgress,
    shareHabitProgress,
    shareProjectProgress,
    shareLearningProgress
  }
}

export function useAchievements() {
  const { unlockAchievement, onMessage, ...rest } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'achievement:unlocked') {
        // Handle achievement notifications
        console.log('Achievement unlocked:', message.data)
      }
    }
  })

  const unlockGoalAchievement = useCallback((title: string, description: string) => {
    unlockAchievement({
      type: 'goal',
      title,
      description,
      icon: '🎯'
    })
  }, [unlockAchievement])

  const unlockHabitAchievement = useCallback((title: string, description: string) => {
    unlockAchievement({
      type: 'habit',
      title,
      description,
      icon: '🔥'
    })
  }, [unlockAchievement])

  const unlockLearningAchievement = useCallback((title: string, description: string) => {
    unlockAchievement({
      type: 'learning',
      title,
      description,
      icon: '📚'
    })
  }, [unlockAchievement])

  const unlockMilestoneAchievement = useCallback((title: string, description: string) => {
    unlockAchievement({
      type: 'milestone',
      title,
      description,
      icon: '🏆'
    })
  }, [unlockAchievement])

  return {
    ...rest,
    unlockGoalAchievement,
    unlockHabitAchievement,
    unlockLearningAchievement,
    unlockMilestoneAchievement
  }
}
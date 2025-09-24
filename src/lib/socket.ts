import { Server } from 'socket.io';

interface User {
  id: string;
  name: string;
  avatar?: string;
  connectedAt: Date;
}

interface RealTimeUpdate {
  type: 'inbox' | 'tasks' | 'ideas' | 'knowledge' | 'spaced-repetition' | 'life-areas';
  action: 'create' | 'update' | 'delete';
  data: any;
  userId: string;
  timestamp: Date;
}

interface CollaborationEvent {
  type: 'cursor_move' | 'selection' | 'typing' | 'edit';
  userId: string;
  data: any;
  timestamp: Date;
}

const connectedUsers = new Map<string, User>();
const activeRooms = new Map<string, Set<string>>();

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle user authentication/identification
    socket.on('user:join', (userData: { id: string; name: string; avatar?: string }) => {
      const user: User = {
        id: userData.id,
        name: userData.name,
        avatar: userData.avatar,
        connectedAt: new Date()
      };
      
      connectedUsers.set(socket.id, user);
      
      // Notify all clients about user count
      io.emit('users:online', {
        count: connectedUsers.size,
        users: Array.from(connectedUsers.values())
      });
      
      // Send welcome message
      socket.emit('message', {
        text: `Welcome ${user.name}! You're now connected to the real-time system.`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle room joining for collaboration
    socket.on('room:join', (roomData: { room: string; userId: string }) => {
      const { room, userId } = roomData;
      
      socket.join(room);
      
      if (!activeRooms.has(room)) {
        activeRooms.set(room, new Set());
      }
      activeRooms.get(room)!.add(socket.id);
      
      // Notify room members
      io.to(room).emit('room:user_joined', {
        room,
        userId,
        userCount: activeRooms.get(room)!.size,
        timestamp: new Date()
      });
      
      console.log(`User ${userId} joined room ${room}`);
    });

    // Handle room leaving
    socket.on('room:leave', (roomData: { room: string; userId: string }) => {
      const { room, userId } = roomData;
      
      socket.leave(room);
      
      if (activeRooms.has(room)) {
        activeRooms.get(room)!.delete(socket.id);
        if (activeRooms.get(room)!.size === 0) {
          activeRooms.delete(room);
        }
      }
      
      // Notify room members
      io.to(room).emit('room:user_left', {
        room,
        userId,
        userCount: activeRooms.get(room)?.size || 0,
        timestamp: new Date()
      });
    });

    // Handle real-time data updates
    socket.on('data:update', (update: RealTimeUpdate) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      const enhancedUpdate: RealTimeUpdate = {
        ...update,
        userId: user.id,
        timestamp: new Date()
      };

      // Broadcast to all connected clients
      io.emit('data:updated', enhancedUpdate);
      
      // Also broadcast to specific rooms if applicable
      if (update.type === 'knowledge') {
        io.to('knowledge-collaboration').emit('data:updated', enhancedUpdate);
      }
      
      console.log(`Data update: ${update.type} - ${update.action} by ${user.name}`);
    });

    // Handle collaboration events (cursor movements, typing indicators, etc.)
    socket.on('collaboration:event', (event: CollaborationEvent) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      const enhancedEvent: CollaborationEvent = {
        ...event,
        userId: user.id,
        timestamp: new Date()
      };

      // Broadcast to room members (excluding sender)
      socket.to(event.data.room || 'default').emit('collaboration:event', {
        ...enhancedEvent,
        userName: user.name,
        userAvatar: user.avatar
      });
    });

    // Handle typing indicators
    socket.on('typing:start', (data: { room: string; documentId?: string }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      socket.to(data.room).emit('typing:indicator', {
        userId: user.id,
        userName: user.name,
        isTyping: true,
        documentId: data.documentId,
        timestamp: new Date()
      });
    });

    socket.on('typing:stop', (data: { room: string; documentId?: string }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      socket.to(data.room).emit('typing:indicator', {
        userId: user.id,
        userName: user.name,
        isTyping: false,
        documentId: data.documentId,
        timestamp: new Date()
      });
    });

    // Handle real-time notifications
    socket.on('notification:send', (notification: {
      type: 'info' | 'success' | 'warning' | 'error';
      title: string;
      message: string;
      userId?: string;
      roomId?: string;
    }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      const enhancedNotification = {
        id: Date.now().toString(),
        ...notification,
        senderId: user.id,
        senderName: user.name,
        timestamp: new Date(),
        read: false
      };

      if (notification.userId) {
        // Send to specific user
        const targetSocket = Array.from(connectedUsers.entries())
          .find(([_, u]) => u.id === notification.userId)?.[0];
        
        if (targetSocket) {
          io.to(targetSocket).emit('notification:receive', enhancedNotification);
        }
      } else if (notification.roomId) {
        // Send to room
        io.to(notification.roomId).emit('notification:receive', enhancedNotification);
      } else {
        // Broadcast to all
        io.emit('notification:receive', enhancedNotification);
      }
    });

    // Handle progress sharing
    socket.on('progress:update', (progress: {
      type: 'goal' | 'habit' | 'project' | 'learning';
      itemId: string;
      progress: number;
      message?: string;
    }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      const enhancedProgress = {
        ...progress,
        userId: user.id,
        userName: user.name,
        timestamp: new Date()
      };

      // Broadcast progress updates
      io.emit('progress:updated', enhancedProgress);
    });

    // Handle achievement sharing
    socket.on('achievement:unlock', (achievement: {
      type: string;
      title: string;
      description: string;
      icon?: string;
    }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      const enhancedAchievement = {
        ...achievement,
        userId: user.id,
        userName: user.name,
        timestamp: new Date()
      };

      // Broadcast achievement
      io.emit('achievement:unlocked', enhancedAchievement);
      
      // Send congratulations to the user
      socket.emit('message', {
        text: `🎉 Congratulations! You've unlocked: ${achievement.title}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle messages (chat functionality)
    socket.on('message', (msg: { 
      text: string; 
      room?: string; 
      recipientId?: string;
      type?: 'direct' | 'room' | 'broadcast';
    }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      const enhancedMessage = {
        id: Date.now().toString(),
        text: msg.text,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        timestamp: new Date().toISOString(),
        type: msg.type || 'broadcast'
      };

      if (msg.type === 'direct' && msg.recipientId) {
        // Direct message
        const recipientSocket = Array.from(connectedUsers.entries())
          .find(([_, u]) => u.id === msg.recipientId)?.[0];
        
        if (recipientSocket) {
          io.to(recipientSocket).emit('message', enhancedMessage);
          io.to(socket.id).emit('message:delivered', { messageId: enhancedMessage.id });
        }
      } else if (msg.type === 'room' && msg.room) {
        // Room message
        io.to(msg.room).emit('message', enhancedMessage);
      } else {
        // Broadcast message
        socket.broadcast.emit('message', enhancedMessage);
      }
    });

    // Handle ping/pong for connection health
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        console.log('Client disconnected:', socket.id, `(${user.name})`);
        
        // Remove from all rooms
        activeRooms.forEach((sockets, room) => {
          if (sockets.has(socket.id)) {
            sockets.delete(socket.id);
            io.to(room).emit('room:user_left', {
              room,
              userId: user.id,
              userCount: sockets.size,
              timestamp: new Date()
            });
          }
        });
        
        // Remove user
        connectedUsers.delete(socket.id);
        
        // Notify all clients about user count
        io.emit('users:online', {
          count: connectedUsers.size,
          users: Array.from(connectedUsers.values())
        });
      } else {
        console.log('Client disconnected:', socket.id);
      }
    });

    // Send initial connection data
    socket.emit('connection:established', {
      socketId: socket.id,
      timestamp: new Date().toISOString(),
      serverTime: new Date().toISOString(),
      features: [
        'real-time-updates',
        'collaboration',
        'typing-indicators',
        'notifications',
        'progress-sharing',
        'achievements',
        'messaging'
      ]
    });
  });
};

// Helper functions for external use
export const getConnectedUsers = () => {
  return Array.from(connectedUsers.values());
};

export const getActiveRooms = () => {
  const rooms: Record<string, number> = {};
  activeRooms.forEach((sockets, room) => {
    rooms[room] = sockets.size;
  });
  return rooms;
};

export const broadcastToRoom = (io: Server, room: string, event: string, data: any) => {
  io.to(room).emit(event, data);
};

export const sendToUser = (io: Server, userId: string, event: string, data: any) => {
  const userSocket = Array.from(connectedUsers.entries())
    .find(([_, u]) => u.id === userId)?.[0];
  
  if (userSocket) {
    io.to(userSocket).emit(event, data);
  }
};
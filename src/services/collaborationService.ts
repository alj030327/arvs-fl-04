// ============================================================================
// REAL-TIME COLLABORATION PLATFORM
// Multi-user real-time editing and collaboration for estate settlements
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lawyer' | 'case_handler' | 'client' | 'beneficiary';
  avatar?: string;
  lastSeen: Date;
  isOnline: boolean;
  cursor?: {
    x: number;
    y: number;
    fieldId?: string;
  };
  color: string; // Unique color for user identification
}

export interface CollaborationSession {
  id: string;
  caseId: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  lastActivity: Date;
  participants: CollaborationUser[];
  permissions: {
    canEdit: string[]; // User IDs who can edit
    canView: string[]; // User IDs who can view
    canComment: string[]; // User IDs who can comment
  };
  status: 'active' | 'paused' | 'completed';
}

export interface CollaborationAction {
  id: string;
  sessionId: string;
  userId: string;
  timestamp: Date;
  type: 'field_edit' | 'comment' | 'status_change' | 'document_upload' | 'approval';
  fieldId?: string;
  previousValue?: any;
  newValue?: any;
  comment?: string;
  metadata?: Record<string, any>;
}

export interface Comment {
  id: string;
  sessionId: string;
  userId: string;
  fieldId?: string;
  content: string;
  timestamp: Date;
  resolved: boolean;
  replies: Comment[];
  mentions: string[]; // User IDs mentioned in comment
}

export interface FieldLock {
  fieldId: string;
  userId: string;
  userName: string;
  timestamp: Date;
  expiresAt: Date;
}

class CollaborationService {
  private static instance: CollaborationService;
  private sessions: Map<string, CollaborationSession> = new Map();
  private fieldLocks: Map<string, FieldLock> = new Map();
  private subscribers: Map<string, Function[]> = new Map();
  private websocketConnection: WebSocket | null = null;

  public static getInstance(): CollaborationService {
    if (!CollaborationService.instance) {
      CollaborationService.instance = new CollaborationService();
    }
    return CollaborationService.instance;
  }

  constructor() {
    this.initializeWebSocketConnection();
    this.startLockCleanup();
  }

  // Session Management
  async createSession(caseId: string, title: string, description?: string): Promise<CollaborationSession> {
    const sessionId = `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const currentUser = await this.getCurrentUser();

    const session: CollaborationSession = {
      id: sessionId,
      caseId,
      title,
      description,
      createdBy: currentUser.id,
      createdAt: new Date(),
      lastActivity: new Date(),
      participants: [currentUser],
      permissions: {
        canEdit: [currentUser.id],
        canView: [currentUser.id],
        canComment: [currentUser.id]
      },
      status: 'active'
    };

    this.sessions.set(sessionId, session);
    this.broadcastToSession(sessionId, {
      type: 'session_created',
      session
    });

    return session;
  }

  async joinSession(sessionId: string): Promise<CollaborationSession | null> {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const currentUser = await this.getCurrentUser();
    
    // Check if user has permission to join
    const canJoin = session.permissions.canView.includes(currentUser.id) ||
                   session.permissions.canEdit.includes(currentUser.id) ||
                   session.permissions.canComment.includes(currentUser.id);

    if (!canJoin) {
      throw new Error('Insufficient permissions to join session');
    }

    // Add user to participants if not already there
    const existingParticipant = session.participants.find(p => p.id === currentUser.id);
    if (!existingParticipant) {
      session.participants.push({
        ...currentUser,
        isOnline: true,
        lastSeen: new Date()
      });
    } else {
      existingParticipant.isOnline = true;
      existingParticipant.lastSeen = new Date();
    }

    this.sessions.set(sessionId, session);
    this.broadcastToSession(sessionId, {
      type: 'user_joined',
      user: currentUser
    });

    return session;
  }

  async leaveSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const currentUser = await this.getCurrentUser();
    const participant = session.participants.find(p => p.id === currentUser.id);
    
    if (participant) {
      participant.isOnline = false;
      participant.lastSeen = new Date();
    }

    // Release any field locks held by this user
    this.releaseUserLocks(currentUser.id);

    this.broadcastToSession(sessionId, {
      type: 'user_left',
      userId: currentUser.id
    });
  }

  // Real-time Field Editing
  async lockField(sessionId: string, fieldId: string): Promise<boolean> {
    const existingLock = this.fieldLocks.get(fieldId);
    const currentUser = await this.getCurrentUser();

    // Check if field is already locked by another user
    if (existingLock && existingLock.userId !== currentUser.id) {
      if (existingLock.expiresAt > new Date()) {
        return false; // Field is locked by another user
      }
    }

    // Create or update lock
    const lock: FieldLock = {
      fieldId,
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 30000) // 30 seconds lock
    };

    this.fieldLocks.set(fieldId, lock);
    this.broadcastToSession(sessionId, {
      type: 'field_locked',
      lock
    });

    return true;
  }

  async unlockField(sessionId: string, fieldId: string): Promise<void> {
    const currentUser = await this.getCurrentUser();
    const lock = this.fieldLocks.get(fieldId);

    if (lock && lock.userId === currentUser.id) {
      this.fieldLocks.delete(fieldId);
      this.broadcastToSession(sessionId, {
        type: 'field_unlocked',
        fieldId
      });
    }
  }

  async updateField(sessionId: string, fieldId: string, newValue: any, previousValue?: any): Promise<void> {
    const currentUser = await this.getCurrentUser();
    const session = this.sessions.get(sessionId);

    if (!session) return;

    // Check edit permissions
    if (!session.permissions.canEdit.includes(currentUser.id)) {
      throw new Error('Insufficient permissions to edit');
    }

    // Record the action
    const action: CollaborationAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      userId: currentUser.id,
      timestamp: new Date(),
      type: 'field_edit',
      fieldId,
      previousValue,
      newValue
    };

    // Update session activity
    session.lastActivity = new Date();
    this.sessions.set(sessionId, session);

    // Broadcast field update
    this.broadcastToSession(sessionId, {
      type: 'field_updated',
      action
    });

    // Store action for audit trail
    await this.storeAction(action);
  }

  // Commenting System
  async addComment(sessionId: string, content: string, fieldId?: string, mentions: string[] = []): Promise<Comment> {
    const currentUser = await this.getCurrentUser();
    const session = this.sessions.get(sessionId);

    if (!session || !session.permissions.canComment.includes(currentUser.id)) {
      throw new Error('Insufficient permissions to comment');
    }

    const comment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      userId: currentUser.id,
      fieldId,
      content,
      timestamp: new Date(),
      resolved: false,
      replies: [],
      mentions
    };

    // Broadcast comment
    this.broadcastToSession(sessionId, {
      type: 'comment_added',
      comment
    });

    // Send notifications to mentioned users
    if (mentions.length > 0) {
      await this.sendMentionNotifications(comment, mentions);
    }

    return comment;
  }

  async resolveComment(sessionId: string, commentId: string): Promise<void> {
    const currentUser = await this.getCurrentUser();
    
    this.broadcastToSession(sessionId, {
      type: 'comment_resolved',
      commentId,
      userId: currentUser.id,
      timestamp: new Date()
    });
  }

  // User Presence and Cursors
  async updateUserCursor(sessionId: string, x: number, y: number, fieldId?: string): Promise<void> {
    const currentUser = await this.getCurrentUser();
    const session = this.sessions.get(sessionId);

    if (!session) return;

    const participant = session.participants.find(p => p.id === currentUser.id);
    if (participant) {
      participant.cursor = { x, y, fieldId };
      participant.lastSeen = new Date();
    }

    // Throttled broadcast (don't spam with cursor updates)
    this.throttledBroadcast(sessionId, {
      type: 'cursor_updated',
      userId: currentUser.id,
      cursor: { x, y, fieldId }
    }, 100); // 100ms throttle
  }

  // Permission Management
  async updatePermissions(sessionId: string, userId: string, permissions: {
    canEdit?: boolean;
    canView?: boolean;
    canComment?: boolean;
  }): Promise<void> {
    const session = this.sessions.get(sessionId);
    const currentUser = await this.getCurrentUser();

    if (!session || session.createdBy !== currentUser.id) {
      throw new Error('Only session creator can update permissions');
    }

    // Update permissions
    if (permissions.canEdit !== undefined) {
      if (permissions.canEdit) {
        if (!session.permissions.canEdit.includes(userId)) {
          session.permissions.canEdit.push(userId);
        }
      } else {
        session.permissions.canEdit = session.permissions.canEdit.filter(id => id !== userId);
      }
    }

    if (permissions.canView !== undefined) {
      if (permissions.canView) {
        if (!session.permissions.canView.includes(userId)) {
          session.permissions.canView.push(userId);
        }
      } else {
        session.permissions.canView = session.permissions.canView.filter(id => id !== userId);
      }
    }

    if (permissions.canComment !== undefined) {
      if (permissions.canComment) {
        if (!session.permissions.canComment.includes(userId)) {
          session.permissions.canComment.push(userId);
        }
      } else {
        session.permissions.canComment = session.permissions.canComment.filter(id => id !== userId);
      }
    }

    this.sessions.set(sessionId, session);
    this.broadcastToSession(sessionId, {
      type: 'permissions_updated',
      userId,
      permissions: session.permissions
    });
  }

  // WebSocket Communication
  private initializeWebSocketConnection(): void {
    // In production, establish WebSocket connection to real-time server
    console.log('Initializing collaboration WebSocket connection');
  }

  private broadcastToSession(sessionId: string, message: any): void {
    const subscribers = this.subscribers.get(sessionId) || [];
    subscribers.forEach(callback => callback(message));
  }

  private throttledBroadcast = this.throttle((sessionId: string, message: any) => {
    this.broadcastToSession(sessionId, message);
  }, 100);

  private throttle(func: Function, delay: number) {
    let timeoutId: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  // Utility Methods
  private async getCurrentUser(): Promise<CollaborationUser> {
    // In production, get from authentication context
    return {
      id: 'user_123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'lawyer',
      lastSeen: new Date(),
      isOnline: true,
      color: '#3B82F6' // Blue
    };
  }

  private releaseUserLocks(userId: string): void {
    const locksToRelease: string[] = [];
    
    this.fieldLocks.forEach((lock, fieldId) => {
      if (lock.userId === userId) {
        locksToRelease.push(fieldId);
      }
    });

    locksToRelease.forEach(fieldId => {
      this.fieldLocks.delete(fieldId);
    });
  }

  private startLockCleanup(): void {
    setInterval(() => {
      const now = new Date();
      const expiredLocks: string[] = [];

      this.fieldLocks.forEach((lock, fieldId) => {
        if (lock.expiresAt <= now) {
          expiredLocks.push(fieldId);
        }
      });

      expiredLocks.forEach(fieldId => {
        this.fieldLocks.delete(fieldId);
      });
    }, 5000); // Check every 5 seconds
  }

  private async storeAction(action: CollaborationAction): Promise<void> {
    // Store in database for audit trail
    console.log('Storing collaboration action:', action.type);
  }

  private async sendMentionNotifications(comment: Comment, mentions: string[]): Promise<void> {
    // Send notifications to mentioned users
    console.log('Sending mention notifications:', mentions);
  }

  // Subscription Management
  subscribe(sessionId: string, callback: Function): () => void {
    const subscribers = this.subscribers.get(sessionId) || [];
    subscribers.push(callback);
    this.subscribers.set(sessionId, subscribers);

    // Return unsubscribe function
    return () => {
      const currentSubscribers = this.subscribers.get(sessionId) || [];
      const filteredSubscribers = currentSubscribers.filter(sub => sub !== callback);
      this.subscribers.set(sessionId, filteredSubscribers);
    };
  }
}

// React Hook for Collaboration
export const useCollaboration = (sessionId?: string) => {
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [fieldLocks, setFieldLocks] = useState<Map<string, FieldLock>>(new Map());
  const [comments, setComments] = useState<Comment[]>([]);
  const serviceRef = useRef(CollaborationService.getInstance());

  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = serviceRef.current.subscribe(sessionId, (message: any) => {
      switch (message.type) {
        case 'session_created':
        case 'user_joined':
        case 'permissions_updated':
          setSession(message.session || session);
          break;
        case 'field_locked':
          setFieldLocks(prev => new Map(prev.set(message.lock.fieldId, message.lock)));
          break;
        case 'field_unlocked':
          setFieldLocks(prev => {
            const newMap = new Map(prev);
            newMap.delete(message.fieldId);
            return newMap;
          });
          break;
        case 'comment_added':
          setComments(prev => [...prev, message.comment]);
          break;
        case 'comment_resolved':
          setComments(prev => prev.map(comment => 
            comment.id === message.commentId 
              ? { ...comment, resolved: true }
              : comment
          ));
          break;
      }
    });

    // Join session
    serviceRef.current.joinSession(sessionId).then(sessionData => {
      setSession(sessionData);
      setIsConnected(true);
    });

    return () => {
      unsubscribe();
      if (sessionId) {
        serviceRef.current.leaveSession(sessionId);
      }
    };
  }, [sessionId]);

  return {
    session,
    isConnected,
    fieldLocks,
    comments,
    service: serviceRef.current,
    
    // Actions
    lockField: (fieldId: string) => serviceRef.current.lockField(sessionId!, fieldId),
    unlockField: (fieldId: string) => serviceRef.current.unlockField(sessionId!, fieldId),
    updateField: (fieldId: string, newValue: any, previousValue?: any) => 
      serviceRef.current.updateField(sessionId!, fieldId, newValue, previousValue),
    addComment: (content: string, fieldId?: string, mentions?: string[]) =>
      serviceRef.current.addComment(sessionId!, content, fieldId, mentions),
    updateCursor: (x: number, y: number, fieldId?: string) =>
      serviceRef.current.updateUserCursor(sessionId!, x, y, fieldId)
  };
};

export default CollaborationService.getInstance();
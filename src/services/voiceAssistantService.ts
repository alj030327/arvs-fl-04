// ============================================================================
// AI VOICE ASSISTANT INTEGRATION
// Advanced conversational AI for customer support and guidance
// ============================================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { useConversation } from '@11labs/react';

export interface VoiceAssistantConfig {
  agentId: string;
  apiKey: string;
  language: 'sv' | 'en' | 'no' | 'da';
  voiceId?: string;
  customPrompt?: string;
  enableClientTools: boolean;
}

export interface ConversationAnalytics {
  conversationId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  messageCount: number;
  userSatisfaction?: number;
  resolvedQuery: boolean;
  escalatedToHuman: boolean;
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface VoiceMetrics {
  totalConversations: number;
  averageDuration: number;
  resolutionRate: number;
  customerSatisfaction: number;
  costPerConversation: number;
  automationRate: number;
}

class VoiceAssistantService {
  private static instance: VoiceAssistantService;
  private conversations: Map<string, ConversationAnalytics> = new Map();
  private config: VoiceAssistantConfig | null = null;

  public static getInstance(): VoiceAssistantService {
    if (!VoiceAssistantService.instance) {
      VoiceAssistantService.instance = new VoiceAssistantService();
    }
    return VoiceAssistantService.instance;
  }

  // Configuration Management
  setConfiguration(config: VoiceAssistantConfig): void {
    this.config = config;
  }

  getConfiguration(): VoiceAssistantConfig | null {
    return this.config;
  }

  // Conversation Analytics
  trackConversation(conversationId: string, analytics: Partial<ConversationAnalytics>): void {
    const existing = this.conversations.get(conversationId);
    const updated: ConversationAnalytics = {
      conversationId,
      startTime: new Date(),
      messageCount: 0,
      resolvedQuery: false,
      escalatedToHuman: false,
      topics: [],
      sentiment: 'neutral',
      ...existing,
      ...analytics
    };

    this.conversations.set(conversationId, updated);
  }

  getConversationAnalytics(conversationId: string): ConversationAnalytics | undefined {
    return this.conversations.get(conversationId);
  }

  // Metrics and Reporting
  async getVoiceMetrics(timeframe: '24h' | '7d' | '30d' = '30d'): Promise<VoiceMetrics> {
    const conversations = Array.from(this.conversations.values());
    const endDate = new Date();
    const startDate = this.calculateStartDate(endDate, timeframe);

    const relevantConversations = conversations.filter(conv => 
      conv.startTime >= startDate && conv.startTime <= endDate
    );

    const totalDuration = relevantConversations.reduce((sum, conv) => sum + (conv.duration || 0), 0);
    const resolvedConversations = relevantConversations.filter(conv => conv.resolvedQuery).length;
    const satisfactionScores = relevantConversations
      .filter(conv => conv.userSatisfaction !== undefined)
      .map(conv => conv.userSatisfaction!);

    return {
      totalConversations: relevantConversations.length,
      averageDuration: relevantConversations.length > 0 ? totalDuration / relevantConversations.length : 0,
      resolutionRate: relevantConversations.length > 0 ? (resolvedConversations / relevantConversations.length) * 100 : 0,
      customerSatisfaction: satisfactionScores.length > 0 ? 
        satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length : 0,
      costPerConversation: 12.5, // SEK - estimated cost including AI processing
      automationRate: relevantConversations.length > 0 ? 
        ((relevantConversations.length - relevantConversations.filter(conv => conv.escalatedToHuman).length) / relevantConversations.length) * 100 : 0
    };
  }

  private calculateStartDate(endDate: Date, timeframe: string): Date {
    const days = {
      '24h': 1,
      '7d': 7,
      '30d': 30
    }[timeframe] || 30;

    return new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
  }

  // Cost Analysis
  async calculateROI(timeframe: '30d' | '90d' | '1y' = '30d'): Promise<{
    aiCosts: number;
    humanCostSavings: number;
    efficiencyGains: number;
    netSavings: number;
    roi: number;
  }> {
    const metrics = await this.getVoiceMetrics('30d'); // Use 30d for all calculations
    const daysInPeriod = { '30d': 30, '90d': 90, '1y': 365 }[timeframe];

    // AI operational costs
    const aiCosts = metrics.totalConversations * metrics.costPerConversation;

    // Human agent cost savings
    const averageHumanCostPerConversation = 180; // SEK for 15-min human interaction
    const humanCostSavings = metrics.totalConversations * (metrics.automationRate / 100) * averageHumanCostPerConversation;

    // Efficiency gains from 24/7 availability and instant response
    const efficiencyGains = metrics.totalConversations * 25; // SEK value of instant service

    const netSavings = humanCostSavings + efficiencyGains - aiCosts;
    const roi = aiCosts > 0 ? (netSavings / aiCosts) * 100 : 0;

    return {
      aiCosts,
      humanCostSavings,
      efficiencyGains,
      netSavings,
      roi
    };
  }
}

// React Hook for Voice Assistant Integration
export const useVoiceAssistant = (config?: Partial<VoiceAssistantConfig>) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<ConversationAnalytics | null>(null);
  const service = useRef(VoiceAssistantService.getInstance());

  // Client tools for ElevenLabs agent
  const clientTools = {
    // Transfer to human agent
    transferToHuman: (parameters: { reason: string }) => {
      console.log('Transferring to human agent:', parameters.reason);
      if (conversationId) {
        service.current.trackConversation(conversationId, {
          escalatedToHuman: true,
          topics: [...(analytics?.topics || []), 'human_transfer']
        });
      }
      return 'Transfer initiated. A human agent will join shortly.';
    },

    // Schedule callback
    scheduleCallback: (parameters: { phoneNumber: string; preferredTime: string }) => {
      console.log('Scheduling callback:', parameters);
      // Integrate with CRM system to schedule callback
      return `Callback scheduled for ${parameters.preferredTime}. We'll call ${parameters.phoneNumber}.`;
    },

    // Provide document status
    getDocumentStatus: (parameters: { caseId: string }) => {
      console.log('Checking document status for case:', parameters.caseId);
      // Mock document status - in production, integrate with case management system
      return 'Your documents have been received and are currently under review. Processing time is typically 2-3 business days.';
    },

    // Customer satisfaction survey
    recordSatisfaction: (parameters: { rating: number; feedback?: string }) => {
      console.log('Recording satisfaction:', parameters);
      if (conversationId) {
        service.current.trackConversation(conversationId, {
          userSatisfaction: parameters.rating,
          resolvedQuery: parameters.rating >= 4
        });
      }
      return 'Thank you for your feedback!';
    }
  };

  // Initialize conversation with ElevenLabs
  const conversation = useConversation({
    clientTools,
    onConnect: () => {
      console.log('Voice assistant connected');
    },
    onDisconnect: () => {
      console.log('Voice assistant disconnected');
      if (conversationId && analytics) {
        // Finalize conversation analytics
        const endTime = new Date();
        const duration = (endTime.getTime() - analytics.startTime.getTime()) / 1000; // seconds
        service.current.trackConversation(conversationId, {
          endTime,
          duration
        });
      }
    },
    onMessage: (message) => {
      console.log('Voice message:', message);
      if (conversationId) {
        const currentAnalytics = service.current.getConversationAnalytics(conversationId);
        if (currentAnalytics) {
          service.current.trackConversation(conversationId, {
            messageCount: currentAnalytics.messageCount + 1
          });
        }
      }
    },
    onError: (error) => {
      console.error('Voice assistant error:', error);
    },
    overrides: config ? {
      agent: {
        prompt: {
          prompt: config.customPrompt || getDefaultPrompt(config.language || 'sv')
        },
        firstMessage: getWelcomeMessage(config.language || 'sv'),
        language: config.language || 'sv'
      },
      tts: {
        voiceId: config.voiceId
      }
    } : undefined
  });

  // Start conversation
  const startConversation = useCallback(async () => {
    if (!config?.agentId || !config?.apiKey) {
      throw new Error('Agent ID and API key are required');
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Generate signed URL for secure connection
      const signedUrl = await generateSignedUrl(config.agentId, config.apiKey);
      
      // Start ElevenLabs conversation
      const newConversationId = await conversation.startSession({ url: signedUrl });
      setConversationId(newConversationId);

      // Initialize analytics tracking
      const initialAnalytics: ConversationAnalytics = {
        conversationId: newConversationId,
        startTime: new Date(),
        messageCount: 0,
        resolvedQuery: false,
        escalatedToHuman: false,
        topics: [],
        sentiment: 'neutral'
      };

      service.current.trackConversation(newConversationId, initialAnalytics);
      setAnalytics(initialAnalytics);

      return newConversationId;
    } catch (error) {
      console.error('Failed to start voice conversation:', error);
      throw error;
    }
  }, [config, conversation]);

  // End conversation
  const endConversation = useCallback(async () => {
    if (conversation.status === 'connected') {
      await conversation.endSession();
      setConversationId(null);
      setAnalytics(null);
    }
  }, [conversation]);

  // Configure assistant
  const configure = useCallback((newConfig: VoiceAssistantConfig) => {
    service.current.setConfiguration(newConfig);
    setIsConfigured(true);
  }, []);

  // Get metrics
  const getMetrics = useCallback(async (timeframe?: '24h' | '7d' | '30d') => {
    return await service.current.getVoiceMetrics(timeframe);
  }, []);

  return {
    // Conversation state
    status: conversation.status,
    isSpeaking: conversation.isSpeaking,
    conversationId,
    analytics,
    isConfigured,

    // Actions
    configure,
    startConversation,
    endConversation,
    setVolume: conversation.setVolume,

    // Analytics
    getMetrics,
    service: service.current
  };
};

// Helper functions
async function generateSignedUrl(agentId: string, apiKey: string): Promise<string> {
  // In production, this should be done on your backend to keep API key secure
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
    {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to generate signed URL');
  }

  const body = await response.json();
  return body.signed_url;
}

function getDefaultPrompt(language: string): string {
  const prompts = {
    sv: `Du är en expert AI-assistent för digitala arvskiften i Sverige. Din roll är att hjälpa kunder genom hela processen med professionell vägledning. 

Du kan hjälpa med:
- Förklara arvsskiftesprocessen steg för steg
- Svara på juridiska frågor om svenska arvsregler
- Assistera med dokumentinlämning och krav
- Ge statusuppdateringar om pågående ärenden
- Förklara säkerhet och GDPR-hantering

Viktiga riktlinjer:
- Använd alltid professionell men vänlig ton
- Förklara komplexa juridiska termer på ett enkelt sätt
- Om du inte är säker på något juridiskt, erbjud att koppla till en mänsklig expert
- Håll svar kortfattade men informativa
- Fråga uppföljningsfrågor för att förstå kundens specifika behov

Kom ihåg att du representerar en pålitlig finansiell tjänst som följer alla svenska regelverk.`,

    en: `You are an expert AI assistant for digital estate settlements in Sweden. Your role is to guide customers through the entire process with professional assistance.

You can help with:
- Explaining the estate settlement process step by step
- Answering legal questions about Swedish inheritance law
- Assisting with document submission and requirements
- Providing status updates on ongoing cases
- Explaining security and GDPR handling

Important guidelines:
- Always use a professional but friendly tone
- Explain complex legal terms in simple language
- If unsure about legal matters, offer to connect to a human expert
- Keep answers concise but informative
- Ask follow-up questions to understand specific customer needs

Remember you represent a trusted financial service that follows all Swedish regulations.`
  };

  return prompts[language as keyof typeof prompts] || prompts.sv;
}

function getWelcomeMessage(language: string): string {
  const messages = {
    sv: 'Hej! Jag är din AI-assistent för digitala arvskiften. Jag kan hjälpa dig med frågor om processen, dokumentation eller ge dig statusuppdateringar. Vad kan jag hjälpa dig med idag?',
    en: 'Hello! I\'m your AI assistant for digital estate settlements. I can help you with questions about the process, documentation, or provide status updates. How can I assist you today?'
  };

  return messages[language as keyof typeof messages] || messages.sv;
}

export default VoiceAssistantService.getInstance();

import type { State, Memory } from "@elizaos/core";

// Type definitions for ElizaOS compatibility
interface ElizaState {
    userId: string;
    conversationContext?: ConversationContext | null;
    userPreferences?: UserPreferences | null;
    recentQueries: string[];
    lastTokensDiscussed: Array<{symbol: string, token_id?: number}>;
    currentFocus: 'price' | 'trading' | 'analysis' | 'market' | 'sector' | null;
}

interface ElizaMemory {
    id: string;
    userId: string;
    content: {
        text: string;
        context?: ConversationContext | null;
        preferences?: UserPreferences | null;
    };
    createdAt: number;
    importance: number;
    embedding: number[];
}

/**
 * TokenMetrics Memory Manager for ElizaOS
 * Handles conversation context, user preferences, and session continuity
 */
export class TokenMetricsMemoryManager {
    private conversationHistory: Map<string, ConversationContext> = new Map();
    private userPreferences: Map<string, UserPreferences> = new Map();
    private sessionData: Map<string, SessionData> = new Map();

    /**
     * Store conversation context for continuity
     */
    storeConversationContext(userId: string, context: ConversationContext): void {
        this.conversationHistory.set(userId, {
            ...context,
            lastUpdated: Date.now()
        });
    }

    /**
     * Retrieve conversation context for a user
     */
    getConversationContext(userId: string): ConversationContext | null {
        const context = this.conversationHistory.get(userId);
        if (!context) return null;

        // Clean up old contexts (older than 24 hours)
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (Date.now() - context.lastUpdated > twentyFourHours) {
            this.conversationHistory.delete(userId);
            return null;
        }

        return context;
    }

    /**
     * Update user preferences based on interactions
     */
    updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): void {
        const existing = this.userPreferences.get(userId) || {
            favoriteTokens: [],
            preferredSectors: [],
            riskTolerance: 'medium' as const,
            analysisDepth: 'standard' as const,
            notificationPreferences: {
                priceAlerts: false,
                tradingSignals: false,
                marketUpdates: false
            },
            lastUpdated: Date.now()
        };

        this.userPreferences.set(userId, {
            ...existing,
            ...preferences,
            lastUpdated: Date.now()
        });
    }

    /**
     * Get user preferences
     */
    getUserPreferences(userId: string): UserPreferences | null {
        return this.userPreferences.get(userId) || null;
    }

    /**
     * Store session-specific data
     */
    storeSessionData(sessionId: string, data: Partial<SessionData>): void {
        const existing = this.sessionData.get(sessionId) || {
            queriesCount: 0,
            startTime: Date.now(),
            lastActivity: Date.now(),
            apiCallsCount: 0,
            errors: []
        };

        this.sessionData.set(sessionId, {
            ...existing,
            ...data,
            lastActivity: Date.now()
        });
    }

    /**
     * Get session data
     */
    getSessionData(sessionId: string): SessionData | null {
        return this.sessionData.get(sessionId) || null;
    }

    /**
     * Clean up old data to prevent memory leaks
     */
    cleanup(): void {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const oneHour = 60 * 60 * 1000;

        // Clean old conversation contexts (24 hours)
        for (const [userId, context] of this.conversationHistory.entries()) {
            if (now - context.lastUpdated > oneDay) {
                this.conversationHistory.delete(userId);
            }
        }

        // Clean old session data (1 hour)
        for (const [sessionId, session] of this.sessionData.entries()) {
            if (now - session.lastActivity > oneHour) {
                this.sessionData.delete(sessionId);
            }
        }
    }

    /**
     * Convert to ElizaOS State format
     */
    toElizaState(userId: string): ElizaState {
        const context = this.getConversationContext(userId);
        const preferences = this.getUserPreferences(userId);
        
        return {
            userId,
            conversationContext: context,
            userPreferences: preferences,
            recentQueries: context?.recentQueries || [],
            lastTokensDiscussed: context?.lastTokensDiscussed || [],
            currentFocus: context?.currentFocus || null
        };
    }

    /**
     * Create memory from ElizaOS State
     */
    createMemory(state: ElizaState): ElizaMemory {
        // Generate a proper UUID-like ID
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        const memoryId = `tm-${state.userId.substring(0, 8)}-${timestamp}-${random}`;
        
        return {
            id: memoryId,
            userId: state.userId,
            content: {
                text: state.conversationContext?.lastQuery || "",
                context: state.conversationContext,
                preferences: state.userPreferences
            },
            createdAt: timestamp,
            importance: this.calculateImportance(state),
            embedding: [] // Would be populated by ElizaOS embedding system
        };
    }

    /**
     * Calculate memory importance for ElizaOS
     */
    private calculateImportance(state: ElizaState): number {
        let importance = 0.5; // Base importance

        // Increase importance for repeated queries
        if (state.recentQueries && state.recentQueries.length > 3) {
            importance += 0.2;
        }

        // Increase importance for specific token focus
        if (state.lastTokensDiscussed && state.lastTokensDiscussed.length > 0) {
            importance += 0.1;
        }

        // Increase importance for user preferences
        if (state.userPreferences) {
            importance += 0.2;
        }

        return Math.min(importance, 1.0);
    }
}

// Type definitions
export interface ConversationContext {
    lastQuery: string;
    lastAction: string;
    lastResult: any;
    recentQueries: string[];
    lastTokensDiscussed: Array<{symbol: string, token_id?: number}>;
    currentFocus: 'price' | 'trading' | 'analysis' | 'market' | 'sector' | null;
    conversationFlow: ConversationStep[];
    lastUpdated: number;
}

export interface UserPreferences {
    favoriteTokens: Array<{symbol: string, token_id?: number}>;
    preferredSectors: string[];
    riskTolerance: 'low' | 'medium' | 'high';
    analysisDepth: 'basic' | 'standard' | 'detailed';
    notificationPreferences: {
        priceAlerts: boolean;
        tradingSignals: boolean;
        marketUpdates: boolean;
    };
    lastUpdated: number;
}

export interface SessionData {
    queriesCount: number;
    startTime: number;
    lastActivity: number;
    apiCallsCount: number;
    errors: Array<{error: string, timestamp: number}>;
}

export interface ConversationStep {
    query: string;
    action: string;
    result: any;
    timestamp: number;
    success: boolean;
}

// Singleton instance
export const memoryManager = new TokenMetricsMemoryManager();

// Cleanup interval (run every hour)
setInterval(() => {
    memoryManager.cleanup();
}, 60 * 60 * 1000); 
import { memoryManager, type ConversationContext, type UserPreferences } from './memory-manager';

/**
 * Natural Language Processor for TokenMetrics ElizaOS Integration
 * Handles conversation flow, context awareness, and intelligent response generation
 */
export class TokenMetricsNLPProcessor {
    private intentPatterns: IntentPattern[] = [
        // Price-related intents
        {
            patterns: [/price|cost|value|worth|current.*price|how much/i],
            intent: 'price',
            confidence: 0.9,
            followUpQuestions: [
                "Would you like to see price history or just current price?",
                "Are you interested in any specific timeframe?",
                "Would you like to compare with other tokens?"
            ]
        },
        
        // OHLCV Data intents - NEW
        {
            patterns: [/ohlcv|candle|candlestick|daily.*ohlcv|hourly.*ohlcv|open.*high.*low.*close|ohlc/i],
            intent: 'daily-ohlcv',
            confidence: 0.9,
            followUpQuestions: [
                "Would you like daily or hourly OHLCV data?",
                "How many data points do you need?",
                "Are you looking for a specific time period?"
            ]
        },
        
        // Hourly OHLCV specific
        {
            patterns: [/hourly.*ohlcv|hourly.*candle|hourly.*data|hour.*ohlcv/i],
            intent: 'hourly-ohlcv',
            confidence: 0.95,
            followUpQuestions: [
                "How many hours of data do you need?",
                "Are you doing technical analysis?",
                "Would you like volume data included?"
            ]
        },
        
        // Daily OHLCV specific
        {
            patterns: [/daily.*ohlcv|daily.*candle|daily.*data|day.*ohlcv/i],
            intent: 'daily-ohlcv',
            confidence: 0.95,
            followUpQuestions: [
                "How many days of data do you need?",
                "Are you analyzing trends?",
                "Would you like volume data included?"
            ]
        },
        
        // Investor Grades intents - NEW
        {
            patterns: [/investor.*grade|investment.*grade|investor.*rating|investment.*rating|grade.*investor/i],
            intent: 'investor-grades',
            confidence: 0.9,
            followUpQuestions: [
                "Are you comparing multiple tokens?",
                "Would you like to see the grading criteria?",
                "Are you building a portfolio?"
            ]
        },
        
        // AI Reports intents - NEW
        {
            patterns: [/ai.*report|ai.*analysis|artificial.*intelligence.*report|deep.*dive|comprehensive.*analysis/i],
            intent: 'ai-reports',
            confidence: 0.9,
            followUpQuestions: [
                "Are you looking for recent reports?",
                "Would you like investment recommendations?",
                "Are you doing due diligence?"
            ]
        },
        
        // Crypto Investors intents - NEW
        {
            patterns: [/crypto.*investor|cryptocurrency.*investor|institutional.*investor|whale.*investor|top.*investor/i],
            intent: 'crypto-investors',
            confidence: 0.9,
            followUpQuestions: [
                "Are you tracking institutional activity?",
                "Would you like to see investment amounts?",
                "Are you following smart money?"
            ]
        },
        
        // Resistance & Support intents - NEW
        {
            patterns: [/resistance.*support|support.*resistance|technical.*level|resistance.*level|support.*level|key.*level/i],
            intent: 'resistance-support',
            confidence: 0.9,
            followUpQuestions: [
                "Are you planning entry/exit points?",
                "Would you like historical levels?",
                "Are you doing technical analysis?"
            ]
        },
        
        // TokenMetrics AI intents - NEW
        {
            patterns: [/ask.*tokenmetrics.*ai|tokenmetrics.*ai|tmai|ai.*assistant|ask.*ai/i],
            intent: 'tmai',
            confidence: 0.95,
            followUpQuestions: [
                "What specific question do you have?",
                "Are you looking for investment advice?",
                "Would you like market predictions?"
            ]
        },
        
        // Sentiment intents - NEW
        {
            patterns: [/sentiment|market.*sentiment|feeling|mood|bullish.*bearish|market.*mood/i],
            intent: 'sentiment',
            confidence: 0.9,
            followUpQuestions: [
                "Are you tracking sentiment changes?",
                "Would you like historical sentiment?",
                "Are you timing market entries?"
            ]
        },
        
        // Scenario Analysis intents - NEW
        {
            patterns: [/scenario.*analysis|scenario|prediction|forecast|future.*price|price.*prediction/i],
            intent: 'scenario-analysis',
            confidence: 0.9,
            followUpQuestions: [
                "What timeframe are you considering?",
                "Are you planning investments?",
                "Would you like multiple scenarios?"
            ]
        },
        
        // Correlation intents - NEW
        {
            patterns: [/correlation|correlate|relationship.*between|compare.*movement|correlated/i],
            intent: 'correlation',
            confidence: 0.9,
            followUpQuestions: [
                "Which tokens would you like to compare?",
                "Are you diversifying your portfolio?",
                "Would you like historical correlation?"
            ]
        },
        
        // INDICES intents - NEW
        {
            patterns: [/\bindices\b|\bindex\b|crypto.*indices|crypto.*index|index.*funds|passive.*index|active.*index|fund.*index/i],
            intent: 'indices',
            confidence: 0.9,
            followUpQuestions: [
                "Are you looking for active or passive indices?",
                "Would you like to see performance data?",
                "Are you considering index investing?"
            ]
        },
        
        // Indices Holdings intents - NEW
        {
            patterns: [/indices.*holdings|index.*holdings|index.*composition|index.*allocations|holdings.*index|composition.*index|what.*in.*index/i],
            intent: 'indices-holdings',
            confidence: 0.95,
            followUpQuestions: [
                "Which index are you interested in?",
                "Would you like to see allocation percentages?",
                "Are you analyzing diversification?"
            ]
        },
        
        // Indices Performance intents - NEW
        {
            patterns: [/indices.*performance|index.*performance|index.*returns|index.*history|performance.*index|returns.*index|how.*index.*performing/i],
            intent: 'indices-performance',
            confidence: 0.95,
            followUpQuestions: [
                "Which index would you like to analyze?",
                "What timeframe are you interested in?",
                "Would you like to compare with other indices?"
            ]
        },
        
        // Tokens Database/List intents - NEW (FIXED: Added missing pattern)
        {
            patterns: [/tokens.*database|database.*token|tokens.*list|list.*token|available.*token|supported.*token|all.*token|token.*catalog|show.*token/i],
            intent: 'tokens-list',
            confidence: 0.9,
            followUpQuestions: [
                "Are you looking for specific tokens?",
                "Would you like to filter by market cap or category?",
                "Are you exploring new investment opportunities?"
            ]
        },
        
        // Trading signal intents
        {
            patterns: [/trading signal|buy|sell|signal|trade|should i|recommendation/i],
            intent: 'trading-signals',
            confidence: 0.85,
            followUpQuestions: [
                "Are you looking for short-term or long-term signals?",
                "What's your risk tolerance for this trade?",
                "Would you like to see the reasoning behind the signal?"
            ]
        },
        
        // Trader Grades intents - NEW (FIXED: Added missing pattern)
        {
            patterns: [/trader.*grade|grade.*trader|trading.*grade|grade.*trading|short.*term.*grade/i],
            intent: 'trader-grades',
            confidence: 0.9,
            followUpQuestions: [
                "Are you looking for specific tokens?",
                "Would you like to see grade changes over time?",
                "Are you planning short-term trades?"
            ]
        },
        
        // Market Metrics intents - NEW (FIXED: Added missing pattern)
        {
            patterns: [/market.*metric|metric.*market|market.*data|market.*analysis|volume.*data|market.*statistics/i],
            intent: 'market-metrics',
            confidence: 0.9,
            followUpQuestions: [
                "Are you looking for specific metrics?",
                "Would you like historical data?",
                "Are you analyzing market trends?"
            ]
        },
        
        // Top tokens intents - FIXED: Added specific patterns for top tokens queries
        {
            patterns: [/top.*\d+|top.*crypto|top.*token|top.*coin|market cap|biggest|largest|highest.*cap/i],
            intent: 'top-tokens',
            confidence: 0.9,
            followUpQuestions: [
                "Would you like to see additional metrics like volume or performance?",
                "Are you interested in a specific timeframe?",
                "Would you like to filter by market cap range?"
            ]
        },
        
        // Market overview intents - FIXED: Improved patterns and increased confidence
        {
            patterns: [/market.*sentiment|overall.*market|crypto.*market.*doing|market.*today|market.*overview|general.*market/i],
            intent: 'market-overview',
            confidence: 0.85,
            followUpQuestions: [
                "Are you looking at overall crypto market or specific sectors?",
                "Would you like historical context?",
                "Are you planning any portfolio adjustments?"
            ]
        },
        
        // Risk analysis intents - FIXED: Made patterns more specific to avoid conflicts
        {
            patterns: [/\brisk\b|volatility|sharpe|drawdown|dangerous|safe|stability|risky.*is|quantmetrics|quantitative.*analysis|quant.*data/i],
            intent: 'risk-analysis',
            confidence: 0.8,
            followUpQuestions: [
                "Are you evaluating this for portfolio allocation?",
                "What timeframe are you considering?",
                "Would you like to compare risk metrics with similar tokens?"
            ]
        },
        
        // Sector analysis intents - FIXED: Made patterns more specific
        {
            patterns: [/\bsector\b.*performing|defi.*sector|gaming.*sector|meme.*sector|layer.*sector|index.*performing|category.*performing/i],
            intent: 'sector-analysis',
            confidence: 0.8,
            followUpQuestions: [
                "Are you interested in performance, holdings, or recent activity?",
                "Would you like to compare different sectors?",
                "Are you considering sector rotation strategies?"
            ]
        },
        
        // General market/trend intents - Lower confidence fallback
        {
            patterns: [/market|trend|direction/i],
            intent: 'market-overview',
            confidence: 0.6,
            followUpQuestions: [
                "Are you looking at overall crypto market or specific sectors?",
                "Would you like historical context?",
                "Are you planning any portfolio adjustments?"
            ] as string[]
        }
    ];

    private tokenPatterns: TokenPattern[] = [
        { pattern: /bitcoin|btc\b/i, token: 'BTC', id: 3375, confidence: 0.95 },
        { pattern: /ethereum|eth\b/i, token: 'ETH', id: 3306, confidence: 0.95 },
        { pattern: /cardano|ada\b/i, token: 'ADA', id: 2010, confidence: 0.9 },
        { pattern: /solana|sol\b/i, token: 'SOL', id: 5426, confidence: 0.9 },
        { pattern: /polygon|matic/i, token: 'MATIC', id: 3890, confidence: 0.85 },
        { pattern: /chainlink|link/i, token: 'LINK', id: 1975, confidence: 0.85 },
        { pattern: /uniswap|uni/i, token: 'UNI', id: 7083, confidence: 0.85 },
        { pattern: /avalanche|avax/i, token: 'AVAX', id: 5805, confidence: 0.85 }
    ];

    /**
     * Process user query with full context awareness
     */
    async processQuery(
        query: string, 
        userId: string, 
        sessionId: string,
        options: ProcessingOptions = {}
    ): Promise<ProcessedQuery> {
        // Get conversation context
        const context = memoryManager.getConversationContext(userId);
        const preferences = memoryManager.getUserPreferences(userId);
        const sessionData = memoryManager.getSessionData(sessionId);

        // Analyze the query
        const analysis = this.analyzeQuery(query, context, preferences);
        
        // Generate contextual response
        const response = this.generateContextualResponse(analysis, context, preferences);
        
        // Update conversation context
        this.updateConversationContext(userId, query, analysis, response);
        
        // Update session data
        memoryManager.storeSessionData(sessionId, {
            queriesCount: (sessionData?.queriesCount || 0) + 1
        });

        return {
            originalQuery: query,
            analysis,
            response,
            suggestedActions: this.suggestFollowUpActions(analysis, context),
            conversationFlow: this.determineConversationFlow(analysis, context)
        };
    }

    /**
     * Analyze query with context awareness
     */
    private analyzeQuery(
        query: string, 
        context: ConversationContext | null, 
        preferences: UserPreferences | null
    ): QueryAnalysis {
        const queryLower = query.toLowerCase();
        
        // Intent detection
        let bestIntent: { intent: string; confidence: number; followUpQuestions: string[] } = { 
            intent: 'unknown', 
            confidence: 0, 
            followUpQuestions: [] 
        };
        for (const pattern of this.intentPatterns) {
            for (const regex of pattern.patterns) {
                if (regex.test(query)) {
                    if (pattern.confidence > bestIntent.confidence) {
                        bestIntent = {
                            intent: pattern.intent,
                            confidence: pattern.confidence,
                            followUpQuestions: pattern.followUpQuestions
                        };
                    }
                }
            }
        }

        // Token detection
        const detectedTokens: Array<{symbol: string, token_id?: number, confidence: number}> = [];
        for (const tokenPattern of this.tokenPatterns) {
            if (tokenPattern.pattern.test(query)) {
                detectedTokens.push({
                    symbol: tokenPattern.token,
                    token_id: tokenPattern.id,
                    confidence: tokenPattern.confidence
                });
            }
        }

        // Context-aware adjustments
        if (context) {
            // If user is continuing a conversation about specific tokens
            if (detectedTokens.length === 0 && context.lastTokensDiscussed.length > 0) {
                // Check for pronouns or references
                if (/\b(it|this|that|same|also)\b/i.test(query)) {
                    const inferredTokens = context.lastTokensDiscussed.map(token => ({
                        symbol: token.symbol,
                        token_id: token.token_id,
                        confidence: 0.7 // Lower confidence for inferred tokens
                    }));
                    detectedTokens.push(...inferredTokens);
                }
            }

            // Adjust intent based on conversation flow
            if (context.currentFocus && bestIntent.confidence < 0.8) {
                bestIntent.intent = context.currentFocus;
                bestIntent.confidence = 0.7;
            }
        }

        // User preference adjustments
        if (preferences) {
            // Boost confidence for favorite tokens
            detectedTokens.forEach(token => {
                if (preferences.favoriteTokens.some(fav => fav.symbol === token.symbol)) {
                    token.confidence += 0.1;
                }
            });
        }

        return {
            intent: bestIntent.intent,
            confidence: bestIntent.confidence,
            detectedTokens,
            followUpQuestions: bestIntent.followUpQuestions,
            contextualClues: this.extractContextualClues(query, context),
            sentiment: this.analyzeSentiment(query),
            urgency: this.analyzeUrgency(query),
            complexity: this.analyzeComplexity(query)
        };
    }

    /**
     * Generate contextual response based on analysis
     */
    private generateContextualResponse(
        analysis: QueryAnalysis,
        context: ConversationContext | null,
        preferences: UserPreferences | null
    ): ContextualResponse {
        const baseResponse = this.generateBaseResponse(analysis);
        
        // Add context-aware elements
        let contextualElements: string[] = [];
        
        if (context && context.conversationFlow.length > 0) {
            const lastStep = context.conversationFlow[context.conversationFlow.length - 1];
            if (lastStep.success) {
                contextualElements.push("Building on our previous analysis...");
            } else {
                contextualElements.push("Let me try a different approach this time...");
            }
        }

        if (preferences) {
            if (preferences.analysisDepth === 'detailed') {
                contextualElements.push("I'll provide a comprehensive analysis as you prefer.");
            } else if (preferences.analysisDepth === 'basic') {
                contextualElements.push("I'll keep this concise as you like.");
            }
        }

        // Generate personalized insights
        const personalizedInsights = this.generatePersonalizedInsights(analysis, preferences);
        
        return {
            primaryResponse: baseResponse,
            contextualElements,
            personalizedInsights,
            suggestedQuestions: analysis.followUpQuestions,
            tone: this.determineTone(analysis, preferences),
            confidence: analysis.confidence
        };
    }

    /**
     * Generate base response for the intent
     */
    private generateBaseResponse(analysis: QueryAnalysis): string {
        const responses = {
            'price': [
                "I'll get the current price data for you.",
                "Let me fetch the latest price information.",
                "I'll retrieve the current market data."
            ],
            'trading-signals': [
                "I'll analyze the latest AI trading signals.",
                "Let me get the current trading recommendations.",
                "I'll check the latest signal analysis."
            ],
            'risk-analysis': [
                "I'll analyze the risk metrics and volatility data.",
                "Let me get the quantitative risk assessment.",
                "I'll examine the risk profile and statistics."
            ],
            'market-overview': [
                "I'll check the current market sentiment and conditions.",
                "Let me analyze the overall market metrics.",
                "I'll get the latest market indicators."
            ],
            'sector-analysis': [
                "I'll analyze the sector performance and composition.",
                "Let me examine the sector metrics and holdings.",
                "I'll get the latest sector analysis."
            ]
        };

        const intentResponses = responses[analysis.intent as keyof typeof responses] || [
            "I'll help you with that TokenMetrics analysis."
        ];

        return intentResponses[Math.floor(Math.random() * intentResponses.length)];
    }

    /**
     * Extract contextual clues from the query
     */
    private extractContextualClues(query: string, context: ConversationContext | null): string[] {
        const clues: string[] = [];
        
        // Time references
        if (/today|now|current|latest/i.test(query)) clues.push('immediate');
        if (/yesterday|last week|past/i.test(query)) clues.push('historical');
        if (/tomorrow|next|future|will/i.test(query)) clues.push('predictive');
        
        // Comparison indicators
        if (/compare|versus|vs|better|worse/i.test(query)) clues.push('comparative');
        
        // Decision indicators
        if (/should|recommend|advice|suggest/i.test(query)) clues.push('advisory');
        
        return clues;
    }

    /**
     * Analyze sentiment of the query
     */
    private analyzeSentiment(query: string): 'positive' | 'negative' | 'neutral' {
        const positiveWords = /good|great|excellent|bullish|up|gain|profit|buy/i;
        const negativeWords = /bad|terrible|bearish|down|loss|sell|crash|dump/i;
        
        if (positiveWords.test(query)) return 'positive';
        if (negativeWords.test(query)) return 'negative';
        return 'neutral';
    }

    /**
     * Analyze urgency of the query
     */
    private analyzeUrgency(query: string): 'high' | 'medium' | 'low' {
        if (/urgent|asap|quickly|now|immediately/i.test(query)) return 'high';
        if (/soon|today|current/i.test(query)) return 'medium';
        return 'low';
    }

    /**
     * Analyze complexity of the query
     */
    private analyzeComplexity(query: string): 'simple' | 'moderate' | 'complex' {
        const words = query.split(' ').length;
        const hasMultipleTokens = (query.match(/\b[A-Z]{2,5}\b/g) || []).length > 1;
        const hasMultipleIntents = query.includes('and') || query.includes('also');
        
        if (words > 20 || hasMultipleTokens || hasMultipleIntents) return 'complex';
        if (words > 10) return 'moderate';
        return 'simple';
    }

    /**
     * Generate personalized insights based on user preferences
     */
    private generatePersonalizedInsights(
        analysis: QueryAnalysis, 
        preferences: UserPreferences | null
    ): string[] {
        const insights: string[] = [];
        
        if (!preferences) return insights;
        
        // Risk tolerance insights
        if (analysis.intent === 'trading-signals' || analysis.intent === 'risk-analysis') {
            if (preferences.riskTolerance === 'low') {
                insights.push("Given your conservative risk profile, I'll highlight stability metrics.");
            } else if (preferences.riskTolerance === 'high') {
                insights.push("I'll include high-growth opportunities that match your risk appetite.");
            }
        }
        
        // Favorite tokens insights
        if (preferences.favoriteTokens.length > 0) {
            const favoriteSymbols = preferences.favoriteTokens.map(t => t.symbol).join(', ');
            insights.push(`I notice you follow ${favoriteSymbols}. I can include comparative analysis.`);
        }
        
        return insights;
    }

    /**
     * Determine appropriate tone for response
     */
    private determineTone(analysis: QueryAnalysis, preferences: UserPreferences | null): ResponseTone {
        if (analysis.urgency === 'high') return 'urgent';
        if (analysis.sentiment === 'negative') return 'reassuring';
        if (analysis.complexity === 'complex') return 'detailed';
        if (preferences?.analysisDepth === 'basic') return 'concise';
        return 'professional';
    }

    /**
     * Update conversation context
     */
    private updateConversationContext(
        userId: string, 
        query: string, 
        analysis: QueryAnalysis, 
        response: ContextualResponse
    ): void {
        const context = memoryManager.getConversationContext(userId) || {
            lastQuery: '',
            lastAction: '',
            lastResult: null,
            recentQueries: [],
            lastTokensDiscussed: [],
            currentFocus: null,
            conversationFlow: [],
            lastUpdated: Date.now()
        };

        // Update context
        context.lastQuery = query;
        context.recentQueries = [query, ...context.recentQueries.slice(0, 4)]; // Keep last 5
        context.currentFocus = analysis.intent as any;
        
        if (analysis.detectedTokens.length > 0) {
            context.lastTokensDiscussed = analysis.detectedTokens.map(t => ({
                symbol: t.symbol,
                token_id: t.token_id
            }));
        }

        memoryManager.storeConversationContext(userId, context);
    }

    /**
     * Suggest follow-up actions
     */
    private suggestFollowUpActions(
        analysis: QueryAnalysis, 
        context: ConversationContext | null
    ): string[] {
        const suggestions: string[] = [];
        
        if (analysis.intent === 'price' && analysis.detectedTokens.length > 0) {
            suggestions.push("Would you like to see trading signals for this token?");
            suggestions.push("Should I analyze the risk metrics as well?");
        }
        
        if (analysis.intent === 'trading-signals') {
            suggestions.push("Would you like to see the risk analysis?");
            suggestions.push("Should I check the current market sentiment?");
        }
        
        return suggestions;
    }

    /**
     * Determine conversation flow
     */
    private determineConversationFlow(
        analysis: QueryAnalysis, 
        context: ConversationContext | null
    ): ConversationFlow {
        return {
            stage: context ? 'continuing' : 'initial',
            nextSuggestedActions: this.suggestFollowUpActions(analysis, context),
            canDeepDive: analysis.detectedTokens.length > 0,
            shouldSummarize: context ? context.conversationFlow.length > 3 : false
        };
    }
}

// Type definitions
interface IntentPattern {
    patterns: RegExp[];
    intent: string;
    confidence: number;
    followUpQuestions: string[];
}

interface TokenPattern {
    pattern: RegExp;
    token: string;
    id?: number;
    confidence: number;
}

interface ProcessingOptions {
    forceIntent?: string;
    includeHistory?: boolean;
    maxTokens?: number;
}

interface QueryAnalysis {
    intent: string;
    confidence: number;
    detectedTokens: Array<{symbol: string, token_id?: number, confidence: number}>;
    followUpQuestions: string[];
    contextualClues: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    urgency: 'high' | 'medium' | 'low';
    complexity: 'simple' | 'moderate' | 'complex';
}

interface ContextualResponse {
    primaryResponse: string;
    contextualElements: string[];
    personalizedInsights: string[];
    suggestedQuestions: string[];
    tone: ResponseTone;
    confidence: number;
}

interface ProcessedQuery {
    originalQuery: string;
    analysis: QueryAnalysis;
    response: ContextualResponse;
    suggestedActions: string[];
    conversationFlow: ConversationFlow;
}

interface ConversationFlow {
    stage: 'initial' | 'continuing' | 'concluding';
    nextSuggestedActions: string[];
    canDeepDive: boolean;
    shouldSummarize: boolean;
}

type ResponseTone = 'professional' | 'casual' | 'urgent' | 'reassuring' | 'detailed' | 'concise';

// Singleton instance
export const nlpProcessor = new TokenMetricsNLPProcessor(); 
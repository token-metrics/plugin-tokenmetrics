import type { Action, State } from "@elizaos/core";
import { memoryManager } from './memory-manager';
import { nlpProcessor } from './nlp-processor';
import { formatTokenMetricsNumber } from '../actions/action';
import { 
    getTokensAction,
    getTopMarketCapAction,
    getPriceAction,
    getTraderGradesAction,
    getQuantmetricsAction,
    getTradingSignalsAction,
    getMarketMetricsAction,
    getHourlyOhlcvAction,
    getDailyOhlcvAction,
    getInvestorGradesAction,
    getAiReportsAction,
    getCryptoInvestorsAction,
    getResistanceSupportAction,
    getTMAIAction,
    getSentimentAction,
    getScenarioAnalysisAction,
    getCorrelationAction,
    getIndicesAction,
    getIndicesHoldingsAction,
    getIndicesPerformanceAction
} from '../actions/index';

/**
 * Enhanced Action Handler for TokenMetrics ElizaOS Integration
 * Provides complete conversation management, memory, and intelligent routing
 */
export class EnhancedTokenMetricsHandler {
    private actions: Map<string, Action> = new Map();

    constructor() {
        // Register all existing actions
        this.registerAction(getTokensAction);
        this.registerAction(getTopMarketCapAction);
        this.registerAction(getPriceAction);
        this.registerAction(getTraderGradesAction);
        this.registerAction(getQuantmetricsAction);
        this.registerAction(getTradingSignalsAction);
        this.registerAction(getMarketMetricsAction);
        this.registerAction(getHourlyOhlcvAction);
        this.registerAction(getDailyOhlcvAction);
        this.registerAction(getInvestorGradesAction);
        this.registerAction(getAiReportsAction);
        this.registerAction(getCryptoInvestorsAction);
        this.registerAction(getResistanceSupportAction);
        this.registerAction(getTMAIAction);
        this.registerAction(getSentimentAction);
        this.registerAction(getScenarioAnalysisAction);
        this.registerAction(getCorrelationAction);
        this.registerAction(getIndicesAction);
        this.registerAction(getIndicesHoldingsAction);
        this.registerAction(getIndicesPerformanceAction);
        
        console.log(`✅ Enhanced TokenMetrics Handler initialized with ${this.actions.size} actions`);
    }

    /**
     * Register an action with the handler
     */
    private registerAction(action: Action): void {
        this.actions.set(action.name, action);
    }

    /**
     * Process a natural language query with full ElizaOS integration
     */
    async processNaturalLanguageQuery(
        query: string,
        userId: string,
        sessionId: string,
        runtime: any,
        options: ProcessingOptions = {}
    ): Promise<EnhancedResponse> {
        try {
            // Step 1: Process query with NLP
            const nlpResult = await nlpProcessor.processQuery(query, userId, sessionId, options);
            
            // Step 2: Select appropriate action based on intent
            const selectedAction = this.selectActionFromIntent(nlpResult.analysis.intent);
            
            if (!selectedAction) {
                return this.createErrorResponse(
                    `I couldn't determine how to help with: "${query}". Could you be more specific?`,
                    nlpResult
                );
            }

            // Step 3: Build action message from NLP analysis
            const actionMessage = this.buildActionMessage(nlpResult, userId);
            
            // Step 4: Validate action can run
            const canRun = await selectedAction.validate(runtime, actionMessage);
            if (!canRun) {
                return this.createErrorResponse(
                    "I'm unable to process this request right now. Please check your API configuration.",
                    nlpResult
                );
            }

            // Step 5: Execute action with enhanced error handling
            const actionResult = await this.executeActionWithRetry(
                selectedAction, 
                runtime, 
                actionMessage, 
                userId
            );

            // Step 6: Generate enhanced response
            const enhancedResponse = this.generateEnhancedResponse(
                actionResult,
                nlpResult,
                selectedAction.name
            );

            // Step 7: Update conversation context
            this.updateConversationMemory(userId, query, selectedAction.name, actionResult, true);

            return enhancedResponse;

        } catch (error) {
            console.error('Enhanced handler error:', error);
            
            // Update conversation memory with error
            this.updateConversationMemory(userId, query, 'unknown', null, false);
            
            return this.createErrorResponse(
                "I encountered an issue processing your request. Please try again or rephrase your question.",
                null,
                error as Error
            );
        }
    }

    /**
     * Select action based on NLP intent analysis
     */
    private selectActionFromIntent(intent: string): Action | null {
        const intentToActionMap: Record<string, string> = {
            // EXISTING endpoints
            'price': 'getPrice',
            'trading-signals': 'getTradingSignals',
            'risk-analysis': 'getQuantmetrics',
            'market-overview': 'getMarketMetrics',
            'market-metrics': 'getMarketMetrics',
            'top-tokens': 'getTopMarketCap',
            'trader-grades': 'getTraderGrades',
            'tokens-list': 'getTokens',
            
            // NEW endpoints - Added for complete functionality
            'hourly-ohlcv': 'getHourlyOhlcv',
            'daily-ohlcv': 'getDailyOhlcv',
            'ohlcv': 'getDailyOhlcv', // Default to daily OHLCV
            'candles': 'getDailyOhlcv', // Alternative term for OHLCV
            'investor-grades': 'getInvestorGrades',
            'investment-grades': 'getInvestorGrades',
            'ai-reports': 'getAiReports',
            'ai-analysis': 'getAiReports',
            'crypto-investors': 'getCryptoInvestors',
            'investors': 'getCryptoInvestors',
            'resistance-support': 'getResistanceSupport',
            'support-resistance': 'getResistanceSupport',
            'levels': 'getResistanceSupport',
            'tmai': 'getTMAI',
            'ai-chat': 'getTMAI',
            'ask-ai': 'getTMAI',
            'sentiment': 'getSentiment',
            'market-sentiment': 'getSentiment',
            'scenario-analysis': 'getScenarioAnalysis',
            'scenarios': 'getScenarioAnalysis',
            'predictions': 'getScenarioAnalysis',
            'correlation': 'getCorrelation',
            'correlations': 'getCorrelation',
            
            // INDICES endpoints
            'indices': 'getIndices',
            'index': 'getIndices',
            'crypto-indices': 'getIndices',
            'index-funds': 'getIndices',
            'indices-holdings': 'getIndicesHoldings',
            'index-holdings': 'getIndicesHoldings',
            'index-composition': 'getIndicesHoldings',
            'index-allocations': 'getIndicesHoldings',
            'indices-performance': 'getIndicesPerformance',
            'index-performance': 'getIndicesPerformance',
            'index-returns': 'getIndicesPerformance',
            'index-history': 'getIndicesPerformance'
        };

        const actionName = intentToActionMap[intent];
        return actionName ? this.actions.get(actionName) || null : null;
    }

    /**
     * Build action message from NLP analysis
     */
    private buildActionMessage(nlpResult: any, userId: string): any {
        const { analysis } = nlpResult;
        const preferences = memoryManager.getUserPreferences(userId);
        
        // Base message structure with proper typing
        const message = {
            content: {
                text: nlpResult.originalQuery,
                // Allow additional properties
                ...{} as Record<string, any>
            }
        };

        // Add detected tokens ONLY if they are valid and confident
        if (analysis.detectedTokens.length > 0) {
            const primaryToken = analysis.detectedTokens[0]; // Highest confidence token
            // Only add token info if confidence is high enough (>= 0.8)
            if (primaryToken.confidence >= 0.8) {
                (message.content as any).symbol = primaryToken.symbol;
                if (primaryToken.token_id) {
                    (message.content as any).token_id = primaryToken.token_id;
                }
            }
        }

        // Add intent-specific parameters
        switch (analysis.intent) {
            case 'price':
                // Price queries might want current data
                break;
                
            case 'trading-signals':
                // For general trading signals queries, don't specify a token
                // Let the API return general signals
                if (!analysis.detectedTokens.length || analysis.detectedTokens[0].confidence < 0.8) {
                    // Remove any invalid symbol that might have been extracted
                    delete (message.content as any).symbol;
                    delete (message.content as any).token_id;
                }
                
                // Add signal type preference
                if (preferences?.riskTolerance === 'low') {
                    (message.content as any).signal = 1; // Prefer bullish signals for conservative users
                }
                break;
                
            case 'risk-analysis':
                // For general risk analysis, don't specify a token
                if (!analysis.detectedTokens.length || analysis.detectedTokens[0].confidence < 0.8) {
                    delete (message.content as any).symbol;
                    delete (message.content as any).token_id;
                }
                
                // Add analysis depth based on user preference
                if (preferences?.analysisDepth === 'detailed') {
                    (message.content as any).limit = 50;
                } else {
                    (message.content as any).limit = 20;
                }
                break;
                
            case 'trader-grades':
                // For general trader grades queries, don't specify a token
                if (!analysis.detectedTokens.length || analysis.detectedTokens[0].confidence < 0.8) {
                    delete (message.content as any).symbol;
                    delete (message.content as any).token_id;
                }
                break;
                
            case 'top-tokens':
                (message.content as any).top_k = 10; // Default top 10
                break;
                
            case 'sector-analysis':
            case 'sector-performance':
            case 'sector-holdings':
            case 'sector-transactions':
                // Try to detect sector from query or use user preferences
                if (preferences?.preferredSectors && preferences.preferredSectors.length > 0) {
                    (message.content as any).indexName = preferences.preferredSectors[0];
                }
                break;
                
            // NEW intent types - Added for complete functionality
            case 'hourly-ohlcv':
            case 'daily-ohlcv':
            case 'ohlcv':
            case 'candles':
                // OHLCV data preferences
                (message.content as any).limit = 100; // More data points for charts
                break;
                
            case 'investor-grades':
            case 'investment-grades':
                // For general investor grades queries, don't specify a token
                if (!analysis.detectedTokens.length || analysis.detectedTokens[0].confidence < 0.8) {
                    delete (message.content as any).symbol;
                    delete (message.content as any).token_id;
                }
                (message.content as any).limit = 50;
                break;
                
            case 'ai-reports':
            case 'ai-analysis':
                // AI reports
                (message.content as any).limit = 20;
                break;
                
            case 'crypto-investors':
            case 'investors':
                // Crypto investors data
                (message.content as any).limit = 30;
                break;
                
            case 'resistance-support':
            case 'support-resistance':
            case 'levels':
                // Support/resistance levels
                (message.content as any).limit = 20;
                break;
                
            case 'tmai':
            case 'ai-chat':
            case 'ask-ai':
                // TokenMetrics AI - pass the query directly
                (message.content as any).query = nlpResult.originalQuery;
                break;
                
            case 'sentiment':
            case 'market-sentiment':
                // Market sentiment analysis
                (message.content as any).limit = 30;
                break;
                
            case 'scenario-analysis':
            case 'scenarios':
            case 'predictions':
                // Scenario analysis
                (message.content as any).limit = 20;
                break;
                
            case 'correlation':
            case 'correlations':
                // Correlation analysis
                (message.content as any).limit = 50;
                break;
                
            // INDICES endpoints
            case 'indices':
            case 'index':
            case 'crypto-indices':
            case 'index-funds':
                // Indices data
                (message.content as any).limit = 20;
                // Check if user specified active/passive preference
                if (nlpResult.originalQuery.toLowerCase().includes('active')) {
                    (message.content as any).indicesType = 'active';
                } else if (nlpResult.originalQuery.toLowerCase().includes('passive')) {
                    (message.content as any).indicesType = 'passive';
                }
                break;
                
            case 'indices-holdings':
            case 'index-holdings':
            case 'index-composition':
            case 'index-allocations':
                // Indices holdings - requires index ID
                // Try to extract index ID from query or use default
                const indexIdMatch = nlpResult.originalQuery.match(/index\s+(\d+)|id\s*:?\s*(\d+)/i);
                if (indexIdMatch) {
                    (message.content as any).id = parseInt(indexIdMatch[1] || indexIdMatch[2]);
                } else {
                    // Default to index 1 if no ID specified
                    (message.content as any).id = 1;
                }
                break;
                
            case 'indices-performance':
            case 'index-performance':
            case 'index-returns':
            case 'index-history':
                // Indices performance - requires index ID
                const perfIndexIdMatch = nlpResult.originalQuery.match(/index\s+(\d+)|id\s*:?\s*(\d+)/i);
                if (perfIndexIdMatch) {
                    (message.content as any).id = parseInt(perfIndexIdMatch[1] || perfIndexIdMatch[2]);
                } else {
                    // Default to index 1 if no ID specified
                    (message.content as any).id = 1;
                }
                (message.content as any).limit = 30;
                break;
        }

        // Add pagination defaults
        (message.content as any).page = 1;
        (message.content as any).limit = (message.content as any).limit || 20;

        return message;
    }

    /**
     * Execute action with retry logic and enhanced error handling
     */
    private async executeActionWithRetry(
        action: Action,
        runtime: any,
        message: any,
        userId: string,
        maxRetries: number = 2
    ): Promise<any> {
        let lastError: Error | null = null;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await action.handler(runtime, message, undefined);
                
                // Track successful API call
                memoryManager.storeSessionData(userId, {
                    apiCallsCount: 1 // This would be incremented
                });
                
                return result;
                
            } catch (error) {
                lastError = error as Error;
                console.warn(`❌ Action ${action.name} failed on attempt ${attempt}:`, error);
                
                // Track error
                memoryManager.storeSessionData(userId, {
                    errors: [{ error: lastError.message, timestamp: Date.now() }]
                });
                
                // Don't retry on validation errors
                if (lastError.message.includes('validation') || lastError.message.includes('API key')) {
                    break;
                }
                
                // Wait before retry (exponential backoff)
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }
        }
        
        throw lastError || new Error(`Action ${action.name} failed after ${maxRetries} attempts`);
    }

    /**
     * Generate enhanced response with conversation context
     */
    private generateEnhancedResponse(
        actionResult: any,
        nlpResult: any,
        actionName: string
    ): EnhancedResponse {
        const { response: nlpResponse, analysis } = nlpResult;
        
        // Create base response
        const enhancedResponse: EnhancedResponse = {
            success: true,
            data: actionResult,
            naturalLanguageResponse: this.formatNaturalLanguageResponse(
                actionResult,
                nlpResponse,
                actionName
            ),
            conversationContext: {
                intent: analysis.intent,
                confidence: analysis.confidence,
                detectedTokens: analysis.detectedTokens,
                suggestedFollowUps: nlpResult.suggestedActions
            },
            metadata: {
                actionExecuted: actionName,
                processingTime: Date.now(),
                dataSource: 'TokenMetrics API',
                analysisDepth: this.determineAnalysisDepth(actionResult)
            }
        };

        return enhancedResponse;
    }

    /**
     * Format natural language response
     */
    private formatNaturalLanguageResponse(
        actionResult: any,
        nlpResponse: any,
        actionName: string
    ): string {
        let response = nlpResponse.primaryResponse;
        
        // Add data summary based on action type
        if (actionResult.success) {
            const dataSummary = this.generateDataSummary(actionResult, actionName);
            if (dataSummary) {
                response += '\n\n' + dataSummary;
            }
        }
        
        // Add suggested questions
        if (nlpResponse.suggestedQuestions.length > 0) {
            response += '\n\n❓ You might also want to ask: ' + 
                       nlpResponse.suggestedQuestions.slice(0, 2).join(' or ');
        }
        
        return response;
    }

    /**
     * Generate data summary for natural language response
     */
    private generateDataSummary(actionResult: any, actionName: string): string {
        if (!actionResult.success) return '';
        
        switch (actionName) {
            case 'getPrice':
                if (actionResult.price_data?.length > 0) {
                    const token = actionResult.price_data[0];
                    let summary = `💰 **Price Analysis**\n\n`;
                    if (token.CURRENT_PRICE) {
                        summary += `**${token.TOKEN_NAME || token.TOKEN_SYMBOL}**: $${token.CURRENT_PRICE.toLocaleString()}\n`;
                    } else if (token.PRICE) {
                        summary += `**${token.TOKEN_NAME || token.TOKEN_SYMBOL}**: $${token.PRICE.toLocaleString()}\n`;
                    }
                    if (token.MARKET_CAP) {
                        summary += `📊 Market Cap: $${(token.MARKET_CAP / 1e9).toFixed(2)}B\n`;
                    }
                    if (token.VOLUME_24H) {
                        summary += `📈 24h Volume: $${(token.VOLUME_24H / 1e6).toFixed(2)}M\n`;
                    }
                    return summary;
                } else if (actionResult.data?.length > 0) {
                    const token = actionResult.data[0];
                    let summary = `💰 **Price Analysis**\n\n`;
                    if (token.CURRENT_PRICE) {
                        summary += `**${token.TOKEN_NAME || token.TOKEN_SYMBOL}**: $${token.CURRENT_PRICE.toLocaleString()}\n`;
                    }
                    return summary;
                }
                break;
                
            case 'getTopMarketCap':
            case 'GET_TOP_MARKET_CAP_TOKENMETRICS':
                // Check if the action already provided a formatted text response
                if (actionResult.text) {
                    return actionResult.text;
                }
                
                // Fallback formatting if no text response
                const topTokens = actionResult.top_tokens || actionResult.data || [];
                if (topTokens.length > 0) {
                    let summary = `🏆 **Top Market Cap Cryptocurrencies**\n\n`;
                    
                    topTokens.slice(0, 10).forEach((token: any, index: number) => {
                        const rank = index + 1;
                        const name = token.TOKEN_NAME || token.NAME || 'Unknown';
                        const symbol = token.TOKEN_SYMBOL || token.SYMBOL || 'N/A';
                        
                        summary += `**${rank}.** ${name} (${symbol})\n`;
                        
                        if (token.EXCHANGE_LIST && token.EXCHANGE_LIST.length > 0) {
                            summary += `   📊 Available on ${token.EXCHANGE_LIST.length} exchanges\n`;
                        }
                        summary += '\n';
                    });
                    
                    return summary;
                }
                return "No top market cap data available.";
                
            case 'getTradingSignals':
                const signalsData = actionResult.trading_signals || actionResult.data || [];
                if (signalsData.length > 0) {
                    let summary = `🎯 **Trading Signals Analysis**\n\n`;
                    
                    const signalsToShow = signalsData.slice(0, 5);
                    signalsToShow.forEach((signal: any, index: number) => {
                        const tokenName = signal.TOKEN_NAME || signal.TOKEN_SYMBOL || 'Unknown';
                        const signalValue = signal.TRADING_SIGNAL || signal.SIGNAL || 0;
                        const signalType = signalValue > 0 ? '🟢 BUY' : signalValue < 0 ? '🔴 SELL' : '🟡 HOLD';
                        const grade = signal.TM_TRADER_GRADE || 'N/A';
                        const returns = signal.TRADING_SIGNALS_RETURNS || signal.RETURNS || 0;
                        
                        summary += `**${index + 1}.** ${tokenName}: ${signalType}\n`;
                        summary += `   📊 Signal Strength: ${signalValue}\n`;
                        if (grade !== 'N/A') summary += `   🎖️ Grade: ${grade}/100\n`;
                        if (returns !== 0) summary += `   💹 Expected Returns: ${returns > 0 ? '+' : ''}${returns.toFixed(2)}%\n`;
                        summary += '\n';
                    });
                    
                    const bullish = signalsData.filter((s: any) => (s.TRADING_SIGNAL || s.SIGNAL || 0) > 0).length;
                    const bearish = signalsData.filter((s: any) => (s.TRADING_SIGNAL || s.SIGNAL || 0) < 0).length;
                    const neutral = signalsData.filter((s: any) => (s.TRADING_SIGNAL || s.SIGNAL || 0) === 0).length;
                    
                    summary += `📈 **Market Sentiment**: ${bullish} bullish • ${bearish} bearish • ${neutral} neutral`;
                    
                    return summary;
                } else {
                    return `🎯 **Trading Signals**: No signals available for the specified criteria.`;
                }

            case 'GET_TRADING_SIGNALS_TOKENMETRICS':
                if (actionResult.text) {
                    return actionResult.text;
                }
                
                if (actionResult.trading_signals?.length > 0) {
                    const signals = actionResult.trading_signals;
                    let summary = `📊 **Trading Signals Analysis**\n\n`;
                    
                    signals.slice(0, 5).forEach((signal: any) => {
                        const token = signal.TOKEN_NAME || signal.TOKEN_SYMBOL || 'Unknown';
                        const action = signal.ACTION || signal.SIGNAL || 'Hold';
                        const confidence = signal.CONFIDENCE || signal.SCORE || 'N/A';
                        
                        summary += `**${token}**: ${action} (Confidence: ${confidence})\n`;
                        if (signal.REASON) {
                            summary += `   💡 ${signal.REASON}\n`;
                        }
                        summary += '\n';
                    });
                    
                    return summary;
                }
                return "No trading signals data available.";
                
            case 'getMarketMetrics':
                const marketData = actionResult.market_metrics || actionResult.data || [];
                if (marketData.length > 0) {
                    const metric = marketData[0];
                    let summary = `📊 **Market Overview**\n\n`;
                    
                    if (metric.TOTAL_CRYPTO_MCAP) {
                        const mcapInTrillions = (metric.TOTAL_CRYPTO_MCAP / 1e12).toFixed(2);
                        summary += `💰 **Total Market Cap**: $${mcapInTrillions}T\n`;
                    }
                    if (metric.TM_GRADE_PERC_HIGH_COINS) {
                        summary += `📈 **High-Grade Coins**: ${metric.TM_GRADE_PERC_HIGH_COINS.toFixed(1)}%\n`;
                    }
                    if (metric.TM_GRADE_SIGNAL !== undefined) {
                        const signalText = metric.TM_GRADE_SIGNAL > 0 ? '🟢 BULLISH' : 
                                         metric.TM_GRADE_SIGNAL < 0 ? '🔴 BEARISH' : '🟡 NEUTRAL';
                        summary += `🎯 **Market Signal**: ${signalText} (${metric.TM_GRADE_SIGNAL})\n`;
                    }
                    if (metric.BITCOIN_DOMINANCE) {
                        summary += `₿ **Bitcoin Dominance**: ${metric.BITCOIN_DOMINANCE.toFixed(1)}%\n`;
                    }
                    if (metric.TOTAL_VOLUME_24H) {
                        const volumeInBillions = (metric.TOTAL_VOLUME_24H / 1e9).toFixed(2);
                        summary += `📊 **24h Volume**: $${volumeInBillions}B\n`;
                    }
                    
                    return summary;
                } else {
                    return `📊 **Market Overview**: Market data retrieved successfully.`;
                }
                
            case 'GET_MARKET_METRICS_TOKENMETRICS':
                // Check if the action already provided a formatted text response
                if (actionResult.text) {
                    return actionResult.text;
                }
                
                // Fallback formatting if no text response
                const marketMetricsData = actionResult.market_metrics || actionResult.data || [];
                if (marketMetricsData.length > 0) {
                    const metric = marketMetricsData[0];
                    let summary = `📊 **Market Metrics Analysis**\n\n`;
                    
                    if (metric.TOTAL_CRYPTO_MCAP) {
                        const mcapInTrillions = (metric.TOTAL_CRYPTO_MCAP / 1e12).toFixed(2);
                        summary += `💰 **Total Market Cap**: $${mcapInTrillions}T\n`;
                    }
                    if (metric.TM_GRADE_PERC_HIGH_COINS) {
                        summary += `📈 **High-Grade Coins**: ${metric.TM_GRADE_PERC_HIGH_COINS.toFixed(1)}%\n`;
                    }
                    if (metric.TM_GRADE_SIGNAL !== undefined) {
                        const signalText = metric.TM_GRADE_SIGNAL > 0 ? '🟢 BULLISH' : 
                                         metric.TM_GRADE_SIGNAL < 0 ? '🔴 BEARISH' : '🟡 NEUTRAL';
                        summary += `🎯 **Market Signal**: ${signalText} (${metric.TM_GRADE_SIGNAL})\n`;
                    }
                    if (metric.BITCOIN_DOMINANCE) {
                        summary += `₿ **Bitcoin Dominance**: ${metric.BITCOIN_DOMINANCE.toFixed(1)}%\n`;
                    }
                    if (metric.TOTAL_VOLUME_24H) {
                        const volumeInBillions = (metric.TOTAL_VOLUME_24H / 1e9).toFixed(2);
                        summary += `📊 **24h Volume**: $${volumeInBillions}B\n`;
                    }
                    
                    return summary;
                }
                return "No market metrics data available.";
                
            case 'getQuantmetrics':
                const quantData = actionResult.quantmetrics || actionResult.data || [];
                if (quantData.length > 0) {
                    const risk = quantData[0];
                    let summary = `⚡ **Risk Analysis**\n\n`;
                    
                    if (risk.TOKEN_NAME || risk.TOKEN_SYMBOL) {
                        summary += `🪙 **Token**: ${risk.TOKEN_NAME || risk.TOKEN_SYMBOL}\n\n`;
                    }
                    if (risk.VOLATILITY !== undefined) {
                        summary += `📊 **Volatility**: ${risk.VOLATILITY.toFixed(2)}%\n`;
                    }
                    if (risk.SHARPE !== undefined) {
                        summary += `📈 **Sharpe Ratio**: ${risk.SHARPE.toFixed(3)}\n`;
                    }
                    if (risk.MAX_DRAWDOWN !== undefined) {
                        summary += `📉 **Max Drawdown**: ${risk.MAX_DRAWDOWN.toFixed(2)}%\n`;
                    }
                    if (risk.CAGR !== undefined) {
                        summary += `💹 **CAGR**: ${risk.CAGR.toFixed(2)}%\n`;
                    }
                    if (risk.ALL_TIME_RETURN !== undefined) {
                        summary += `🚀 **All-Time Return**: ${risk.ALL_TIME_RETURN.toFixed(2)}%\n`;
                    }
                    
                    if (actionResult.analysis?.summary) {
                        summary += `\n🧠 **Analysis**: ${actionResult.analysis.summary}`;
                    }
                    
                    return summary;
                } else {
                    return `⚡ **Risk Analysis**: Risk analysis data retrieved successfully.`;
                }
                
            case 'GET_QUANTMETRICS_TOKENMETRICS':
                // Check if there's already a formatted text response
                if (actionResult.text && typeof actionResult.text === 'string') {
                    return actionResult.text;
                }
                
                // Fallback formatting if no text response
                const quantMetricsData = actionResult.quantmetrics || actionResult.data || [];
                if (quantMetricsData.length > 0) {
                    const risk = quantMetricsData[0];
                    let summary = `⚡ **Quantitative Metrics Analysis**\n\n`;
                    
                    if (risk.TOKEN_NAME || risk.TOKEN_SYMBOL) {
                        summary += `🪙 **Token**: ${risk.TOKEN_NAME || risk.TOKEN_SYMBOL}\n\n`;
                    }
                    if (risk.VOLATILITY !== undefined) {
                        summary += `📊 **Volatility**: ${risk.VOLATILITY.toFixed(2)}%\n`;
                    }
                    if (risk.SHARPE !== undefined) {
                        summary += `📈 **Sharpe Ratio**: ${risk.SHARPE.toFixed(3)}\n`;
                    }
                    if (risk.MAX_DRAWDOWN !== undefined) {
                        summary += `📉 **Max Drawdown**: ${risk.MAX_DRAWDOWN.toFixed(2)}%\n`;
                    }
                    if (risk.CAGR !== undefined) {
                        summary += `💹 **CAGR**: ${risk.CAGR.toFixed(2)}%\n`;
                    }
                    if (risk.ALL_TIME_RETURN !== undefined) {
                        summary += `🚀 **All-Time Return**: ${risk.ALL_TIME_RETURN.toFixed(2)}%\n`;
                    }
                    
                    if (actionResult.analysis?.summary) {
                        summary += `\n🧠 **Analysis**: ${actionResult.analysis.summary}`;
                    }
                    
                    return summary;
                } else {
                    return `⚡ **Quantitative Metrics**: Analysis completed successfully.`;
                }
                
            case 'getTraderGrades':
                const gradesData = actionResult.trader_grades || actionResult.data || [];
                if (gradesData.length > 0) {
                    let summary = `🎖️ **Trader Grades Analysis**\n\n`;
                    
                    const gradesToShow = gradesData.slice(0, 5);
                    gradesToShow.forEach((grade: any, index: number) => {
                        const tokenName = grade.TOKEN_NAME || grade.TOKEN_SYMBOL || 'Unknown';
                        const traderGrade = grade.TM_TRADER_GRADE || grade.TRADER_GRADE || 'N/A';
                        const price = grade.CURRENT_PRICE || grade.PRICE || 0;
                        const change = grade.PRICE_CHANGE_24H || grade.CHANGE_24H || 0;
                        
                        summary += `**${index + 1}.** ${tokenName}\n`;
                        summary += `   🎖️ Grade: ${traderGrade}/100\n`;
                        if (price > 0) summary += `   💰 Price: $${price.toLocaleString()}\n`;
                        if (change !== 0) {
                            const changeIcon = change > 0 ? '📈' : '📉';
                            summary += `   ${changeIcon} 24h Change: ${change > 0 ? '+' : ''}${change.toFixed(2)}%\n`;
                        }
                        summary += '\n';
                    });
                    
                    return summary;
                }
                break;
                
            case 'getTokens':
                const tokensData = actionResult.tokens || actionResult.data || [];
                if (tokensData.length > 0) {
                    let summary = `🪙 **Available Tokens** (showing first 10)\n\n`;
                    
                    const tokensToShow = tokensData.slice(0, 10);
                    tokensToShow.forEach((token: any, index: number) => {
                        const name = token.TOKEN_NAME || token.NAME || 'Unknown';
                        const symbol = token.TOKEN_SYMBOL || token.SYMBOL || 'N/A';
                        const id = token.TOKEN_ID || token.ID || 'N/A';
                        
                        summary += `**${index + 1}.** ${name} (${symbol})\n`;
                        if (id !== 'N/A') summary += `   🆔 ID: ${id}\n`;
                        summary += '\n';
                    });
                    
                    summary += `📊 **Total Available**: ${tokensData.length} tokens`;
                    
                    return summary;
                }
                break;
                
            case 'getHourlyOhlcv':
            case 'getDailyOhlcv':
                const ohlcvData = actionResult.ohlcv_data || actionResult.data || [];
                if (ohlcvData.length > 0) {
                    const latest = ohlcvData[0];
                    let summary = `📊 **OHLCV Data** (${ohlcvData.length} data points)\n\n`;
                    
                    if (latest.TOKEN_NAME || latest.TOKEN_SYMBOL) {
                        summary += `🪙 **Token**: ${latest.TOKEN_NAME || latest.TOKEN_SYMBOL}\n\n`;
                    }
                    if (latest.OPEN && latest.HIGH && latest.LOW && latest.CLOSE) {
                        summary += `📈 **Latest Candle**:\n`;
                        summary += `   Open: $${latest.OPEN.toLocaleString()}\n`;
                        summary += `   High: $${latest.HIGH.toLocaleString()}\n`;
                        summary += `   Low: $${latest.LOW.toLocaleString()}\n`;
                        summary += `   Close: $${latest.CLOSE.toLocaleString()}\n`;
                    }
                    if (latest.VOLUME) {
                        summary += `📊 **Volume**: ${latest.VOLUME.toLocaleString()}\n`;
                    }
                    if (latest.DATETIME || latest.DATE) {
                        summary += `📅 **Date**: ${latest.DATETIME || latest.DATE}\n`;
                    }
                    
                    return summary;
                }
                break;
                
            case 'getInvestorGrades':
                const investorData = actionResult.investor_grades || actionResult.data || [];
                if (investorData.length > 0) {
                    let summary = `🏦 **Investor Grades Analysis**\n\n`;
                    
                    const gradesToShow = investorData.slice(0, 5);
                    gradesToShow.forEach((grade: any, index: number) => {
                        const tokenName = grade.TOKEN_NAME || grade.TOKEN_SYMBOL || 'Unknown';
                        const investorGrade = grade.TM_INVESTOR_GRADE || grade.INVESTOR_GRADE || 'N/A';
                        const recommendation = grade.RECOMMENDATION || '';
                        
                        summary += `**${index + 1}.** ${tokenName}\n`;
                        summary += `   🏦 Investor Grade: ${investorGrade}/100\n`;
                        if (recommendation) summary += `   💡 Recommendation: ${recommendation}\n`;
                        summary += '\n';
                    });
                    
                    return summary;
                }
                break;
                
            case 'getAiReports':
                const reportsData = actionResult.ai_reports || actionResult.data || [];
                if (reportsData.length > 0) {
                    const report = reportsData[0];
                    let summary = `🤖 **AI Analysis Report**\n\n`;
                    
                    if (report.TOKEN_NAME || report.TOKEN_SYMBOL) {
                        summary += `🪙 **Token**: ${report.TOKEN_NAME || report.TOKEN_SYMBOL}\n\n`;
                    }
                    if (report.INVESTMENT_ANALYSIS) {
                        const preview = report.INVESTMENT_ANALYSIS.substring(0, 200) + '...';
                        summary += `🧠 **Analysis Preview**: "${preview}"\n\n`;
                    }
                    if (report.RECOMMENDATION) {
                        summary += `🎯 **Recommendation**: ${report.RECOMMENDATION}\n`;
                    }
                    if (report.CONFIDENCE_SCORE) {
                        summary += `📊 **Confidence**: ${report.CONFIDENCE_SCORE}/100\n`;
                    }
                    
                    summary += `\n📋 **Total Reports**: ${reportsData.length}`;
                    
                    return summary;
                }
                break;
                
            case 'getCryptoInvestors':
                const investorsData = actionResult.crypto_investors || actionResult.data || [];
                if (investorsData.length > 0) {
                    let summary = `🏦 **Crypto Investors Data**\n\n`;
                    
                    const investorsToShow = investorsData.slice(0, 5);
                    investorsToShow.forEach((investor: any, index: number) => {
                        const name = investor.INVESTOR_NAME || investor.NAME || 'Unknown';
                        const type = investor.INVESTOR_TYPE || investor.TYPE || 'N/A';
                        const aum = investor.AUM || investor.ASSETS_UNDER_MANAGEMENT || 0;
                        
                        summary += `**${index + 1}.** ${name}`;
                        if (type !== 'N/A') summary += ` (${type})`;
                        summary += '\n';
                        if (aum > 0) summary += `   💰 AUM: $${(aum / 1e9).toFixed(2)}B\n`;
                        summary += '\n';
                    });
                    
                    summary += `📊 **Total Investors**: ${investorsData.length}`;
                    
                    return summary;
                }
                break;
                
            case 'getResistanceSupport':
                const levelsData = actionResult.resistance_support_levels || actionResult.data || [];
                if (levelsData.length > 0) {
                    const levels = levelsData[0];
                    let summary = `📊 **Support & Resistance Analysis**\n\n`;
                    
                    if (levels.TOKEN_NAME || levels.TOKEN_SYMBOL) {
                        summary += `🪙 **Token**: ${levels.TOKEN_NAME || levels.TOKEN_SYMBOL}\n\n`;
                    }
                    
                    // Process historical levels data
                    if (levels.HISTORICAL_RESISTANCE_SUPPORT_LEVELS && Array.isArray(levels.HISTORICAL_RESISTANCE_SUPPORT_LEVELS)) {
                        const historicalLevels = levels.HISTORICAL_RESISTANCE_SUPPORT_LEVELS;
                        
                        // Sort levels by price to identify key support and resistance
                        const sortedLevels = historicalLevels
                            .map((level: any) => ({
                                price: level.level || level.LEVEL || 0,
                                date: level.date || level.DATE || 'Unknown'
                            }))
                            .filter((level: any) => level.price > 0)
                            .sort((a: any, b: any) => b.price - a.price);
                        
                        if (sortedLevels.length > 0) {
                            // Show top resistance levels (highest prices)
                            const resistanceLevels = sortedLevels.slice(0, 5);
                            summary += `📈 **Key Resistance Levels**:\n`;
                            resistanceLevels.forEach((level: any, idx: number) => {
                                summary += `   ${idx + 1}. $${level.price.toLocaleString()} (${level.date})\n`;
                            });
                            
                            // Show support levels (lower prices)
                            const supportLevels = sortedLevels.slice(-5).reverse();
                            summary += `\n📉 **Key Support Levels**:\n`;
                            supportLevels.forEach((level: any, idx: number) => {
                                summary += `   ${idx + 1}. $${level.price.toLocaleString()} (${level.date})\n`;
                            });
                            
                            summary += `\n📊 **Total Historical Levels**: ${historicalLevels.length}`;
                        }
                    }
                    
                    // Add analysis summary if available
                    if (actionResult.analysis?.summary) {
                        summary += `\n\n🧠 **Analysis**: ${actionResult.analysis.summary}`;
                    }
                    
                    return summary;
                }
                break;
                
            case 'getTMAI':
                if (actionResult.ai_response?.response) {
                    let summary = `🤖 **TokenMetrics AI Response**\n\n`;
                    summary += `${actionResult.ai_response.response}`;
                    return summary;
                } else if (actionResult.response) {
                    let summary = `🤖 **TokenMetrics AI Response**\n\n`;
                    summary += `${actionResult.response}`;
                    return summary;
                }
                break;
                
            case 'getSentiment':
                const sentimentData = actionResult.sentiment_data || actionResult.data || [];
                if (sentimentData.length > 0) {
                    let summary = `😊 **Market Sentiment Analysis**\n\n`;
                    
                    const sentimentToShow = sentimentData.slice(0, 5);
                    sentimentToShow.forEach((sentiment: any, index: number) => {
                        const grade = sentiment.MARKET_SENTIMENT_GRADE || sentiment.SENTIMENT_GRADE || 'N/A';
                        const date = sentiment.DATETIME || sentiment.DATE || 'N/A';
                        const description = sentiment.SENTIMENT_DESCRIPTION || '';
                        
                        const sentimentIcon = grade >= 70 ? '😊' : grade >= 40 ? '😐' : '😟';
                        
                        summary += `**${index + 1}.** ${sentimentIcon} **Sentiment Grade**: ${grade}/100\n`;
                        if (date !== 'N/A') summary += `   📅 Date: ${date}\n`;
                        if (description) summary += `   📝 ${description}\n`;
                        summary += '\n';
                    });
                    
                    return summary;
                }
                break;
                
            case 'getScenarioAnalysis':
                const scenarioData = actionResult.scenario_data || actionResult.data || [];
                if (scenarioData.length > 0) {
                    let summary = `🔮 **Scenario Analysis Results**\n\n`;
                    
                    const scenariosToShow = scenarioData.slice(0, 3);
                    scenariosToShow.forEach((scenario: any, index: number) => {
                        const tokenName = scenario.TOKEN_NAME || scenario.TOKEN_SYMBOL || 'Unknown Token';
                        const currentPrice = scenario.SCENARIO_PREDICTION?.current_price || 0;
                        const predictedDate = scenario.SCENARIO_PREDICTION?.predicted_date || scenario.DATE || 'N/A';
                        
                        summary += `**${index + 1}.** **${tokenName}** Scenario Analysis\n`;
                        summary += `   📅 Prediction Date: ${predictedDate}\n`;
                        
                        if (currentPrice > 0) {
                            summary += `   💰 Current Price: $${currentPrice.toExponential(3)}\n`;
                        }
                        
                        // Extract scenario predictions if available
                        if (scenario.SCENARIO_PREDICTION?.scenario_prediction && Array.isArray(scenario.SCENARIO_PREDICTION.scenario_prediction)) {
                            const predictions = scenario.SCENARIO_PREDICTION.scenario_prediction[0]; // First scenario
                            if (predictions) {
                                summary += `   📊 **Price Scenarios**:\n`;
                                if (predictions.predicted_price_bear) {
                                    summary += `     🐻 Bear Case: $${predictions.predicted_price_bear.toExponential(3)}\n`;
                                }
                                if (predictions.predicted_price_base) {
                                    summary += `     📈 Base Case: $${predictions.predicted_price_base.toExponential(3)}\n`;
                                }
                                if (predictions.predicted_price_moon) {
                                    summary += `     🚀 Bull Case: $${predictions.predicted_price_moon.toExponential(3)}\n`;
                                }
                                
                                summary += `   💹 **ROI Scenarios**:\n`;
                                if (predictions.predicted_roi_bear !== undefined) {
                                    const bearROI = (predictions.predicted_roi_bear * 100).toFixed(1);
                                    summary += `     🐻 Bear ROI: ${bearROI}%\n`;
                                }
                                if (predictions.predicted_roi_base !== undefined) {
                                    const baseROI = (predictions.predicted_roi_base * 100).toFixed(1);
                                    summary += `     📈 Base ROI: ${baseROI}%\n`;
                                }
                                if (predictions.predicted_roi_moon !== undefined) {
                                    const moonROI = (predictions.predicted_roi_moon * 100).toFixed(1);
                                    summary += `     🚀 Bull ROI: ${moonROI}%\n`;
                                }
                            }
                        }
                        summary += '\n';
                    });
                    
                    return summary;
                }
                break;
                
            case 'getCorrelation':
                const correlationData = actionResult.correlation_data || actionResult.data || [];
                if (correlationData.length > 0) {
                    let summary = `🔗 **Correlation Analysis**\n\n`;
                    
                    const correlationsToShow = correlationData.slice(0, 8);
                    correlationsToShow.forEach((corr: any, index: number) => {
                        // Handle different correlation data structures
                        if (corr.TOP_CORRELATION && Array.isArray(corr.TOP_CORRELATION)) {
                            const tokenName = corr.TOKEN_NAME || corr.TOKEN_SYMBOL || 'Unknown Token';
                            summary += `**${tokenName}** correlations:\n`;
                            
                            const topCorrelations = corr.TOP_CORRELATION.slice(0, 5);
                            topCorrelations.forEach((correlation: any, idx: number) => {
                                const token = correlation.token || 'Unknown';
                                const coefficient = correlation.correlation || 0;
                                const strength = Math.abs(coefficient) > 0.7 ? 'Strong' : 
                                               Math.abs(coefficient) > 0.3 ? 'Moderate' : 'Weak';
                                const icon = coefficient > 0.5 ? '🟢' : coefficient < -0.5 ? '🔴' : '🟡';
                                
                                summary += `   ${idx + 1}. ${icon} ${token}: ${coefficient.toFixed(3)} (${strength})\n`;
                            });
                            summary += '\n';
                        } else {
                            // Handle simple correlation pairs
                            const token1 = corr.TOKEN_1 || corr.SYMBOL_1 || 'Token A';
                            const token2 = corr.TOKEN_2 || corr.SYMBOL_2 || 'Token B';
                            const coefficient = corr.CORRELATION_COEFFICIENT || corr.CORRELATION || 0;
                            const strength = Math.abs(coefficient) > 0.7 ? 'Strong' : 
                                           Math.abs(coefficient) > 0.3 ? 'Moderate' : 'Weak';
                            const icon = coefficient > 0.5 ? '🟢' : coefficient < -0.5 ? '🔴' : '🟡';
                            
                            summary += `**${index + 1}.** ${icon} ${token1} ↔ ${token2}\n`;
                            summary += `   📊 Correlation: ${coefficient.toFixed(3)} (${strength})\n\n`;
                        }
                    });
                    
                    // Add analysis summary if available
                    if (actionResult.analysis?.summary) {
                        summary += `🧠 **Analysis**: ${actionResult.analysis.summary}`;
                    }
                    
                    return summary;
                }
                break;
                
            case 'getIndices':
                const indicesData = actionResult.indices_data || actionResult.data || [];
                if (indicesData.length > 0) {
                    let summary = `📈 **Crypto Indices Overview**\n\n`;
                    
                    const indicesToShow = indicesData.slice(0, 8);
                    indicesToShow.forEach((index: any, idx: number) => {
                        const name = index.NAME || index.INDEX_NAME || `Index ${index.ID || idx + 1}`;
                        const ticker = index.TICKER || index.SYMBOL || '';
                        const price = index.PRICE || index.CURRENT_PRICE || 0;
                        const coins = index.COINS || index.HOLDINGS_COUNT || index.TOKENS_COUNT || 0;
                        const change24h = index['24H'] || index.CHANGE_24H || 0;
                        const change7d = index['7D'] || index.CHANGE_7D || 0;
                        const change1m = index['1M'] || index.CHANGE_1M || 0;
                        const marketCap = index.MARKET_CAP || 0;
                        const grade = index.INDEX_GRADE || index.GRADE || 0;
                        const allTime = index.ALL_TIME || index.ALL_TIME_HIGH || 0;
                        
                        summary += `**${idx + 1}.** ${name}`;
                        if (ticker) summary += ` (${ticker})`;
                        summary += '\n';
                        
                        if (price > 0) summary += `   💰 Current Price: $${price.toFixed(4)}\n`;
                        if (coins > 0) summary += `   🪙 Holdings: ${coins} tokens\n`;
                        if (grade > 0) summary += `   🎖️ Index Grade: ${grade.toFixed(1)}/100\n`;
                        
                        // Performance metrics
                        if (change24h !== 0) {
                            const icon24h = change24h > 0 ? '📈' : '📉';
                            summary += `   ${icon24h} 24h: ${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}%\n`;
                        }
                        if (change7d !== 0) {
                            const icon7d = change7d > 0 ? '📈' : '📉';
                            summary += `   ${icon7d} 7d: ${change7d > 0 ? '+' : ''}${change7d.toFixed(2)}%\n`;
                        }
                        if (change1m !== 0) {
                            const icon1m = change1m > 0 ? '📈' : '📉';
                            summary += `   ${icon1m} 1m: ${change1m > 0 ? '+' : ''}${change1m.toFixed(2)}%\n`;
                        }
                        
                        if (marketCap > 0) {
                            const mcapFormatted = marketCap > 1e9 ? `$${(marketCap / 1e9).toFixed(2)}B` : 
                                               marketCap > 1e6 ? `$${(marketCap / 1e6).toFixed(2)}M` : 
                                               `$${marketCap.toLocaleString()}`;
                            summary += `   📊 Market Cap: ${mcapFormatted}\n`;
                        }
                        
                        if (allTime > 0) {
                            summary += `   🚀 All-Time High: ${allTime.toFixed(2)}\n`;
                        }
                        
                        summary += '\n';
                    });
                    
                    summary += `📊 **Total Indices Available**: ${indicesData.length}`;
                    
                    return summary;
                }
                break;
                
            case 'getIndicesHoldings':
                const holdingsData = actionResult.indices_holdings || actionResult.holdings_data || actionResult.data || [];
                if (holdingsData.length > 0) {
                    let summary = `🏦 **Index Holdings Composition**\n\n`;
                    
                    const holdingsToShow = holdingsData.slice(0, 10);
                    holdingsToShow.forEach((holding: any, idx: number) => {
                        const tokenName = holding.TOKEN_NAME || holding.NAME || holding.SYMBOL || 'Unknown';
                        const symbol = holding.TOKEN_SYMBOL || holding.SYMBOL || '';
                        const weight = holding.WEIGHT || holding.ALLOCATION || holding.PERCENTAGE || 0;
                        const price = holding.CURRENT_PRICE || holding.PRICE || 0;
                        const marketCap = holding.MARKET_CAP || 0;
                        
                        summary += `**${idx + 1}.** ${tokenName}`;
                        if (symbol && symbol !== tokenName) summary += ` (${symbol})`;
                        summary += '\n';
                        
                        if (weight > 0) summary += `   📊 Weight: ${weight.toFixed(2)}%\n`;
                        if (price > 0) summary += `   💰 Price: $${price.toLocaleString()}\n`;
                        if (marketCap > 0) summary += `   📈 Market Cap: $${(marketCap / 1e9).toFixed(2)}B\n`;
                        summary += '\n';
                    });
                    
                    summary += `🏦 **Total Holdings**: ${holdingsData.length} tokens`;
                    
                    return summary;
                }
                break;
                
            case 'getIndicesPerformance':
                const performanceData = actionResult.indices_performance || actionResult.performance_data || actionResult.data || [];
                if (performanceData.length > 0 && actionResult.analysis) {
                    const analysis = actionResult.analysis;
                    const metrics = analysis.performance_metrics || {};
                    const timeframe = analysis.time_period || {};
                    
                    let summary = `📊 **Index Performance Analysis**\n\n`;
                    
                    if (metrics.total_return !== undefined) {
                        const returnIcon = metrics.total_return > 0 ? '📈' : '📉';
                        summary += `${returnIcon} **Total Return**: ${metrics.total_return > 0 ? '+' : ''}${metrics.total_return.toFixed(2)}%\n`;
                    }
                    if (metrics.avg_daily_return !== undefined) {
                        summary += `📅 **Avg Daily Return**: ${metrics.avg_daily_return > 0 ? '+' : ''}${metrics.avg_daily_return.toFixed(3)}%\n`;
                    }
                    if (metrics.avg_volatility !== undefined) {
                        summary += `⚡ **Volatility**: ${metrics.avg_volatility.toFixed(2)}%\n`;
                    }
                    if (metrics.win_rate !== undefined) {
                        summary += `🎯 **Win Rate**: ${metrics.win_rate.toFixed(1)}%\n`;
                    }
                    if (metrics.best_day !== undefined && metrics.worst_day !== undefined) {
                        summary += `🏆 **Best Day**: +${metrics.best_day.toFixed(2)}%\n`;
                        summary += `📉 **Worst Day**: ${metrics.worst_day.toFixed(2)}%\n`;
                    }
                    
                    if (timeframe.start_date && timeframe.end_date) {
                        const startDate = new Date(timeframe.start_date).toLocaleDateString();
                        const endDate = new Date(timeframe.end_date).toLocaleDateString();
                        summary += `\n📅 **Analysis Period**: ${startDate} to ${endDate}`;
                    }
                    if (timeframe.data_points) {
                        summary += ` (${timeframe.data_points} data points)`;
                    }
                    
                    if (performanceData.length > 0) {
                        const latest = performanceData[performanceData.length - 1];
                        if (latest.INDEX_CUMULATIVE_ROI !== undefined) {
                            summary += `\n💹 **Latest Index Value**: ${latest.INDEX_CUMULATIVE_ROI.toFixed(4)}`;
                        }
                    }
                    
                    return summary;
                }
                break;
        }
        
        // Fallback for any action with data
        if (actionResult.data && Array.isArray(actionResult.data)) {
            return `✅ Retrieved ${actionResult.data.length} data points successfully.`;
        } else if (actionResult.data) {
            return `✅ Data retrieved successfully.`;
        }
        
        return `✅ Operation completed successfully.`;
    }

    /**
     * Update conversation memory
     */
    private updateConversationMemory(
        userId: string,
        query: string,
        actionName: string,
        result: any,
        success: boolean
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

        // Add to conversation flow
        context.conversationFlow.push({
            query,
            action: actionName,
            result,
            timestamp: Date.now(),
            success
        });

        // Keep only last 10 conversation steps
        if (context.conversationFlow.length > 10) {
            context.conversationFlow = context.conversationFlow.slice(-10);
        }

        context.lastAction = actionName;
        context.lastResult = result;

        memoryManager.storeConversationContext(userId, context);
    }

    /**
     * Create error response
     */
    private createErrorResponse(
        message: string,
        nlpResult: any = null,
        error: Error | null = null
    ): EnhancedResponse {
        return {
            success: false,
            error: {
                message,
                details: error?.message || 'Unknown error',
                suggestions: [
                    "Try rephrasing your question",
                    "Check if you specified a valid token symbol",
                    "Ensure your API key is properly configured"
                ]
            },
            naturalLanguageResponse: message,
            conversationContext: nlpResult ? {
                intent: nlpResult.analysis?.intent || 'unknown',
                confidence: nlpResult.analysis?.confidence || 0,
                detectedTokens: nlpResult.analysis?.detectedTokens || [],
                suggestedFollowUps: []
            } : null,
            metadata: {
                actionExecuted: 'error',
                processingTime: Date.now(),
                dataSource: 'TokenMetrics Plugin',
                analysisDepth: 'error'
            }
        };
    }

    /**
     * Determine analysis depth from result
     */
    private determineAnalysisDepth(result: any): string {
        if (!result.success) return 'none';
        
        const dataKeys = Object.keys(result).length;
        if (dataKeys > 5) return 'comprehensive';
        if (dataKeys > 3) return 'detailed';
        return 'basic';
    }

    /**
     * Get conversation summary for a user
     */
    getConversationSummary(userId: string): ConversationSummary {
        const context = memoryManager.getConversationContext(userId);
        const preferences = memoryManager.getUserPreferences(userId);
        
        if (!context) {
            return {
                hasHistory: false,
                totalQueries: 0,
                recentFocus: null,
                suggestions: ["Ask me about cryptocurrency prices, trading signals, or market analysis!"]
            };
        }

        return {
            hasHistory: true,
            totalQueries: context.conversationFlow.length,
            recentFocus: context.currentFocus,
            lastTokensDiscussed: context.lastTokensDiscussed,
            suggestions: this.generateContextualSuggestions(context, preferences)
        };
    }

    /**
     * Generate contextual suggestions based on conversation history
     */
    private generateContextualSuggestions(
        context: any,
        preferences: any
    ): string[] {
        const suggestions: string[] = [];
        
        if (context.lastTokensDiscussed.length > 0) {
            const tokens = context.lastTokensDiscussed.map((t: any) => t.symbol).join(', ');
            suggestions.push(`Get trading signals for ${tokens}`);
            suggestions.push(`Analyze risk metrics for ${tokens}`);
        }
        
        if (context.currentFocus === 'price') {
            suggestions.push("Check market sentiment");
            suggestions.push("Get trading recommendations");
        }
        
        if (preferences?.preferredSectors.length > 0) {
            suggestions.push(`Analyze ${preferences.preferredSectors[0]} sector performance`);
        }
        
        suggestions.push("What's the overall market sentiment?");
        suggestions.push("Show me top performing tokens");
        
        return suggestions.slice(0, 4); // Return max 4 suggestions
    }
}

// Type definitions
interface ProcessingOptions {
    forceIntent?: string;
    includeHistory?: boolean;
    maxTokens?: number;
}

interface EnhancedResponse {
    success: boolean;
    data?: any;
    error?: {
        message: string;
        details: string;
        suggestions: string[];
    };
    naturalLanguageResponse: string;
    conversationContext: {
        intent: string;
        confidence: number;
        detectedTokens: Array<{symbol: string, token_id?: number}>;
        suggestedFollowUps: string[];
    } | null;
    metadata: {
        actionExecuted: string;
        processingTime: number;
        dataSource: string;
        analysisDepth: string;
    };
}

interface ConversationSummary {
    hasHistory: boolean;
    totalQueries: number;
    recentFocus: string | null;
    lastTokensDiscussed?: Array<{symbol: string, token_id?: number}>;
    suggestions: string[];
}

// Singleton instance
export const enhancedHandler = new EnhancedTokenMetricsHandler(); 
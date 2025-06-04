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
    getSectorIndicesHoldingsAction,
    getIndexPerformanceAction,
    getSectorIndexTransactionAction,
    getHourlyOhlcvAction,
    getDailyOhlcvAction,
    getInvestorGradesAction,
    getAiReportsAction,
    getCryptoInvestorsAction,
    getResistanceSupportAction,
    getTMAIAction,
    getSentimentAction,
    getScenarioAnalysisAction,
    getCorrelationAction
} from '../actions';

/**
 * Enhanced Action Handler for TokenMetrics ElizaOS Integration
 * Provides complete conversation management, memory, and intelligent routing
 */
export class EnhancedTokenMetricsHandler {
    private actions: Map<string, Action> = new Map();

    constructor() {
        // Register all available actions
        this.registerAction(getTokensAction);
        this.registerAction(getTopMarketCapAction);
        this.registerAction(getPriceAction);
        this.registerAction(getTraderGradesAction);
        this.registerAction(getQuantmetricsAction);
        this.registerAction(getTradingSignalsAction);
        this.registerAction(getMarketMetricsAction);
        this.registerAction(getSectorIndicesHoldingsAction);
        this.registerAction(getIndexPerformanceAction);
        this.registerAction(getSectorIndexTransactionAction);
        
        // Register NEW actions for complete functionality
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
            'sector-analysis': 'getSectorIndicesHoldings',
            'sector-performance': 'getIndexPerformance',
            'sector-holdings': 'getSectorIndicesHoldings',
            'sector-transactions': 'getSectorIndexTransaction',
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
            'correlations': 'getCorrelation'
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
                console.log(`🎯 Executing ${action.name} (attempt ${attempt}/${maxRetries})`);
                
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
        
        // Add contextual elements
        if (nlpResponse.contextualElements.length > 0) {
            response += ' ' + nlpResponse.contextualElements.join(' ');
        }
        
        // Add data summary based on action type
        if (actionResult.success) {
            response += this.generateDataSummary(actionResult, actionName);
        }
        
        // Add personalized insights
        if (nlpResponse.personalizedInsights.length > 0) {
            response += '\n\n💡 ' + nlpResponse.personalizedInsights.join(' ');
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
        
        // Debug: Log the actual response structure
        console.log(`🔍 Debug - ${actionName} response structure:`, JSON.stringify(actionResult, null, 2));
        
        switch (actionName) {
            case 'getPrice':
                if (actionResult.price_data?.length > 0) {
                    const token = actionResult.price_data[0];
                    let summary = ` Current price data:`;
                    if (token.CURRENT_PRICE) {
                        summary += ` ${token.TOKEN_NAME || token.TOKEN_SYMBOL}: $${token.CURRENT_PRICE.toLocaleString()}`;
                    } else if (token.PRICE) {
                        summary += ` ${token.TOKEN_NAME || token.TOKEN_SYMBOL}: $${token.PRICE.toLocaleString()}`;
                    }
                    if (token.MARKET_CAP) {
                        summary += `, Market Cap: $${(token.MARKET_CAP / 1e9).toFixed(2)}B`;
                    }
                    if (token.VOLUME_24H) {
                        summary += `, 24h Volume: $${(token.VOLUME_24H / 1e6).toFixed(2)}M`;
                    }
                    return summary;
                } else if (actionResult.data?.length > 0) {
                    const token = actionResult.data[0];
                    let summary = ` Current price data:`;
                    if (token.CURRENT_PRICE) {
                        summary += ` ${token.TOKEN_NAME || token.TOKEN_SYMBOL}: $${token.CURRENT_PRICE.toLocaleString()}`;
                    }
                    return summary;
                }
                break;
                
            case 'getTopMarketCap':
                if (actionResult.top_tokens?.length > 0) {
                    let summary = ` Here are the top ${actionResult.top_tokens.length} cryptocurrencies by market cap ranking:\n\n`;
                    
                    // Display top 10 tokens with their details
                    const tokensToShow = actionResult.top_tokens.slice(0, 10);
                    tokensToShow.forEach((token: any, index: number) => {
                        const rank = index + 1;
                        const name = token.TOKEN_NAME || token.NAME || 'Unknown';
                        const symbol = token.TOKEN_SYMBOL || token.SYMBOL || 'N/A';
                        const tokenId = token.TOKEN_ID || 'N/A';
                        
                        summary += `${rank}. ${name} (${symbol})`;
                        if (tokenId !== 'N/A') summary += ` - ID: ${tokenId}`;
                        summary += '\n';
                        
                        // Show exchange count if available
                        if (token.EXCHANGE_LIST && token.EXCHANGE_LIST.length > 0) {
                            summary += `   Available on ${token.EXCHANGE_LIST.length} exchanges\n`;
                        }
                        
                        // Show categories if available
                        if (token.CATEGORY_LIST && token.CATEGORY_LIST.length > 0) {
                            const categoryNames = token.CATEGORY_LIST.slice(0, 2).map((cat: any) => {
                                if (typeof cat === 'object' && cat.category_name) {
                                    return cat.category_name;
                                } else if (typeof cat === 'object' && cat.CATEGORY_NAME) {
                                    return cat.CATEGORY_NAME;
                                } else if (typeof cat === 'string') {
                                    return cat;
                                } else {
                                    return 'Unknown Category';
                                }
                            });
                            summary += `   Categories: ${categoryNames.join(', ')}${token.CATEGORY_LIST.length > 2 ? '...' : ''}\n`;
                        }
                        
                        summary += '\n';
                    });
                    
                    return summary;
                }
                break;
                
            case 'getTradingSignals':
                const signalsData = actionResult.trading_signals || actionResult.data || [];
                if (signalsData.length > 0) {
                    let summary = ` Trading Signals Analysis:\n\n`;
                    
                    // Show first 5 signals with details
                    const signalsToShow = signalsData.slice(0, 5);
                    signalsToShow.forEach((signal: any, index: number) => {
                        const tokenName = signal.TOKEN_NAME || signal.TOKEN_SYMBOL || 'Unknown';
                        const signalValue = signal.TRADING_SIGNAL || signal.SIGNAL || 0;
                        const signalType = signalValue > 0 ? 'BUY' : signalValue < 0 ? 'SELL' : 'HOLD';
                        const grade = signal.TM_TRADER_GRADE || 'N/A';
                        const returns = signal.TRADING_SIGNALS_RETURNS || signal.RETURNS || 0;
                        
                        summary += `${index + 1}. ${tokenName}: ${signalType} (Signal: ${signalValue})`;
                        if (grade !== 'N/A') summary += `, Grade: ${grade}`;
                        if (returns !== 0) summary += `, Expected Returns: ${returns.toFixed(2)}%`;
                        summary += '\n';
                    });
                    
                    // Summary statistics
                    const bullish = signalsData.filter((s: any) => (s.TRADING_SIGNAL || s.SIGNAL || 0) > 0).length;
                    const bearish = signalsData.filter((s: any) => (s.TRADING_SIGNAL || s.SIGNAL || 0) < 0).length;
                    const neutral = signalsData.filter((s: any) => (s.TRADING_SIGNAL || s.SIGNAL || 0) === 0).length;
                    
                    summary += `\n📊 Summary: ${bullish} bullish, ${bearish} bearish, ${neutral} neutral signals`;
                    
                    return summary;
                } else {
                    return ` No trading signals available for the specified criteria.`;
                }
                
            case 'getMarketMetrics':
                const marketData = actionResult.market_metrics || actionResult.data || [];
                if (marketData.length > 0) {
                    const metric = marketData[0];
                    let summary = ` Market Overview:\n\n`;
                    
                    // Add specific market insights using correct field names
                    if (metric.TOTAL_CRYPTO_MCAP) {
                        const mcapInTrillions = (metric.TOTAL_CRYPTO_MCAP / 1e12).toFixed(2);
                        summary += `💰 Total Crypto Market Cap: $${mcapInTrillions}T\n`;
                    }
                    if (metric.TM_GRADE_PERC_HIGH_COINS) {
                        summary += `📈 High-Grade Coins: ${metric.TM_GRADE_PERC_HIGH_COINS.toFixed(1)}%\n`;
                    }
                    if (metric.TM_GRADE_SIGNAL !== undefined) {
                        const signalText = metric.TM_GRADE_SIGNAL > 0 ? 'BULLISH' : 
                                         metric.TM_GRADE_SIGNAL < 0 ? 'BEARISH' : 'NEUTRAL';
                        summary += `🎯 Market Signal: ${signalText} (${metric.TM_GRADE_SIGNAL})\n`;
                    }
                    if (metric.BITCOIN_DOMINANCE) {
                        summary += `₿ Bitcoin Dominance: ${metric.BITCOIN_DOMINANCE.toFixed(1)}%\n`;
                    }
                    if (metric.TOTAL_VOLUME_24H) {
                        const volumeInBillions = (metric.TOTAL_VOLUME_24H / 1e9).toFixed(2);
                        summary += `📊 24h Volume: $${volumeInBillions}B\n`;
                    }
                    
                    return summary;
                } else {
                    return ` Market data retrieved successfully.`;
                }
                
            case 'getQuantmetrics':
                const quantData = actionResult.quantmetrics || actionResult.data || [];
                if (quantData.length > 0) {
                    const risk = quantData[0];
                    let summary = ` Risk Analysis Results:\n\n`;
                    
                    if (risk.TOKEN_NAME || risk.TOKEN_SYMBOL) {
                        summary += `🪙 Token: ${risk.TOKEN_NAME || risk.TOKEN_SYMBOL}\n`;
                    }
                    if (risk.VOLATILITY !== undefined) {
                        summary += `📊 Volatility: ${risk.VOLATILITY.toFixed(2)}%\n`;
                    }
                    if (risk.SHARPE !== undefined) {
                        summary += `📈 Sharpe Ratio: ${risk.SHARPE.toFixed(3)}\n`;
                    }
                    if (risk.MAX_DRAWDOWN !== undefined) {
                        summary += `📉 Max Drawdown: ${risk.MAX_DRAWDOWN.toFixed(2)}%\n`;
                    }
                    if (risk.CAGR !== undefined) {
                        summary += `💹 CAGR: ${risk.CAGR.toFixed(2)}%\n`;
                    }
                    if (risk.ALL_TIME_RETURN !== undefined) {
                        summary += `🚀 All-Time Return: ${risk.ALL_TIME_RETURN.toFixed(2)}%\n`;
                    }
                    
                    // Add analysis summary if available
                    if (actionResult.analysis?.summary) {
                        summary += `\n🧠 Analysis: ${actionResult.analysis.summary}`;
                    }
                    
                    return summary;
                } else {
                    return ` Risk analysis data retrieved successfully.`;
                }
                
            case 'getTraderGrades':
                const gradesData = actionResult.trader_grades || actionResult.data || [];
                if (gradesData.length > 0) {
                    let summary = ` Trader Grades Analysis:\n\n`;
                    
                    // Show first 5 grades with details
                    const gradesToShow = gradesData.slice(0, 5);
                    gradesToShow.forEach((grade: any, index: number) => {
                        const tokenName = grade.TOKEN_NAME || grade.TOKEN_SYMBOL || 'Unknown';
                        const traderGrade = grade.TM_TRADER_GRADE || grade.TRADER_GRADE || 'N/A';
                        const price = grade.CURRENT_PRICE || grade.PRICE || 0;
                        const change = grade.PRICE_CHANGE_24H || grade.CHANGE_24H || 0;
                        
                        summary += `${index + 1}. ${tokenName}: Grade ${traderGrade}/100`;
                        if (price > 0) summary += `, Price: $${price.toLocaleString()}`;
                        if (change !== 0) summary += `, 24h: ${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
                        summary += '\n';
                    });
                    
                    return summary;
                }
                break;
                
            case 'getTokens':
                const tokensData = actionResult.tokens || actionResult.data || [];
                if (tokensData.length > 0) {
                    let summary = ` Available Tokens (showing first 10):\n\n`;
                    
                    const tokensToShow = tokensData.slice(0, 10);
                    tokensToShow.forEach((token: any, index: number) => {
                        const name = token.TOKEN_NAME || token.NAME || 'Unknown';
                        const symbol = token.TOKEN_SYMBOL || token.SYMBOL || 'N/A';
                        const id = token.TOKEN_ID || token.ID || 'N/A';
                        
                        summary += `${index + 1}. ${name} (${symbol})`;
                        if (id !== 'N/A') summary += ` - ID: ${id}`;
                        summary += '\n';
                    });
                    
                    summary += `\n📊 Total: ${tokensData.length} tokens available`;
                    
                    return summary;
                }
                break;
                
            // NEW action types - Added for complete functionality
            case 'getHourlyOhlcv':
            case 'getDailyOhlcv':
                const ohlcvData = actionResult.ohlcv_data || actionResult.data || [];
                if (ohlcvData.length > 0) {
                    const latest = ohlcvData[0];
                    let summary = ` OHLCV Data (${ohlcvData.length} data points):\n\n`;
                    
                    if (latest.TOKEN_NAME || latest.TOKEN_SYMBOL) {
                        summary += `🪙 Token: ${latest.TOKEN_NAME || latest.TOKEN_SYMBOL}\n`;
                    }
                    if (latest.OPEN && latest.HIGH && latest.LOW && latest.CLOSE) {
                        summary += `📊 Latest Candle:\n`;
                        summary += `   Open: $${latest.OPEN.toLocaleString()}\n`;
                        summary += `   High: $${latest.HIGH.toLocaleString()}\n`;
                        summary += `   Low: $${latest.LOW.toLocaleString()}\n`;
                        summary += `   Close: $${latest.CLOSE.toLocaleString()}\n`;
                    }
                    if (latest.VOLUME) {
                        summary += `📈 Volume: ${latest.VOLUME.toLocaleString()}\n`;
                    }
                    if (latest.DATETIME || latest.DATE) {
                        summary += `📅 Date: ${latest.DATETIME || latest.DATE}\n`;
                    }
                    
                    return summary;
                }
                break;
                
            case 'getInvestorGrades':
                const investorGradesData = actionResult.investor_grades || actionResult.data || [];
                if (investorGradesData.length > 0) {
                    let summary = ` Investor Grades Analysis:\n\n`;
                    
                    const gradesToShow = investorGradesData.slice(0, 5);
                    gradesToShow.forEach((grade: any, index: number) => {
                        const tokenName = grade.TOKEN_NAME || grade.TOKEN_SYMBOL || 'Unknown';
                        const investorGrade = grade.TM_INVESTOR_GRADE || grade.INVESTOR_GRADE || 'N/A';
                        const recommendation = grade.RECOMMENDATION || 'N/A';
                        
                        summary += `${index + 1}. ${tokenName}: ${investorGrade}/100`;
                        if (recommendation !== 'N/A') summary += ` (${recommendation})`;
                        summary += '\n';
                    });
                    
                    return summary;
                }
                break;
                
            case 'getAiReports':
                const reportsData = actionResult.ai_reports || actionResult.data || [];
                if (reportsData.length > 0) {
                    const report = reportsData[0];
                    let summary = ` AI Reports Analysis:\n\n`;
                    
                    if (report.TOKEN_NAME || report.TOKEN_SYMBOL) {
                        summary += `🪙 Token: ${report.TOKEN_NAME || report.TOKEN_SYMBOL}\n`;
                    }
                    if (report.INVESTMENT_ANALYSIS) {
                        const preview = report.INVESTMENT_ANALYSIS.substring(0, 200) + '...';
                        summary += `🧠 Analysis Preview: "${preview}"\n`;
                    }
                    if (report.RECOMMENDATION) {
                        summary += `🎯 Recommendation: ${report.RECOMMENDATION}\n`;
                    }
                    if (report.CONFIDENCE_SCORE) {
                        summary += `📊 Confidence: ${report.CONFIDENCE_SCORE}/100\n`;
                    }
                    
                    summary += `\n📋 Total Reports: ${reportsData.length}`;
                    
                    return summary;
                }
                break;
                
            case 'getCryptoInvestors':
                const investorsData = actionResult.crypto_investors || actionResult.data || [];
                if (investorsData.length > 0) {
                    let summary = ` Crypto Investors Data:\n\n`;
                    
                    const investorsToShow = investorsData.slice(0, 5);
                    investorsToShow.forEach((investor: any, index: number) => {
                        const name = investor.INVESTOR_NAME || investor.NAME || 'Unknown';
                        const type = investor.INVESTOR_TYPE || investor.TYPE || 'N/A';
                        const aum = investor.AUM || investor.ASSETS_UNDER_MANAGEMENT || 0;
                        
                        summary += `${index + 1}. ${name}`;
                        if (type !== 'N/A') summary += ` (${type})`;
                        if (aum > 0) summary += `, AUM: $${(aum / 1e9).toFixed(2)}B`;
                        summary += '\n';
                    });
                    
                    summary += `\n📊 Total Investors: ${investorsData.length}`;
                    
                    return summary;
                }
                break;
                
            case 'getResistanceSupport':
                const levelsData = actionResult.resistance_support || actionResult.data || [];
                if (levelsData.length > 0) {
                    const levels = levelsData[0];
                    let summary = ` Support & Resistance Analysis:\n\n`;
                    
                    if (levels.TOKEN_NAME || levels.TOKEN_SYMBOL) {
                        summary += `🪙 Token: ${levels.TOKEN_NAME || levels.TOKEN_SYMBOL}\n`;
                    }
                    if (levels.SUPPORT_LEVELS && Array.isArray(levels.SUPPORT_LEVELS)) {
                        summary += `📉 Support Levels: ${levels.SUPPORT_LEVELS.slice(0, 3).map((l: number) => `$${l.toLocaleString()}`).join(', ')}\n`;
                    }
                    if (levels.RESISTANCE_LEVELS && Array.isArray(levels.RESISTANCE_LEVELS)) {
                        summary += `📈 Resistance Levels: ${levels.RESISTANCE_LEVELS.slice(0, 3).map((l: number) => `$${l.toLocaleString()}`).join(', ')}\n`;
                    }
                    if (levels.CURRENT_PRICE) {
                        summary += `💰 Current Price: $${levels.CURRENT_PRICE.toLocaleString()}\n`;
                    }
                    
                    return summary;
                }
                break;
                
            case 'getTMAI':
                if (actionResult.ai_response?.response) {
                    let summary = ` TokenMetrics AI Response:\n\n`;
                    summary += `🤖 ${actionResult.ai_response.response}`;
                    return summary;
                } else if (actionResult.response) {
                    let summary = ` TokenMetrics AI Response:\n\n`;
                    summary += `🤖 ${actionResult.response}`;
                    return summary;
                }
                break;
                
            case 'getSentiment':
                const sentimentData = actionResult.sentiment_data || actionResult.data || [];
                if (sentimentData.length > 0) {
                    let summary = ` Market Sentiment Analysis:\n\n`;
                    
                    const sentimentToShow = sentimentData.slice(0, 5);
                    sentimentToShow.forEach((sentiment: any, index: number) => {
                        const grade = sentiment.MARKET_SENTIMENT_GRADE || sentiment.SENTIMENT_GRADE || 'N/A';
                        const date = sentiment.DATETIME || sentiment.DATE || 'N/A';
                        const description = sentiment.SENTIMENT_DESCRIPTION || '';
                        
                        summary += `${index + 1}. Sentiment Grade: ${grade}/100`;
                        if (date !== 'N/A') summary += ` (${date})`;
                        if (description) summary += ` - ${description}`;
                        summary += '\n';
                    });
                    
                    return summary;
                }
                break;
                
            case 'getScenarioAnalysis':
                const scenarioData = actionResult.scenario_data || actionResult.data || [];
                if (scenarioData.length > 0) {
                    let summary = ` Scenario Analysis Results:\n\n`;
                    
                    const scenariosToShow = scenarioData.slice(0, 3);
                    scenariosToShow.forEach((scenario: any, index: number) => {
                        const prediction = scenario.SCENARIO_PREDICTION || scenario.PREDICTION || '';
                        const probability = scenario.PROBABILITY || scenario.CONFIDENCE || 0;
                        const timeframe = scenario.TIMEFRAME || 'N/A';
                        
                        summary += `${index + 1}. Scenario (${timeframe}): ${prediction.substring(0, 100)}...`;
                        if (probability > 0) summary += ` (${probability}% probability)`;
                        summary += '\n\n';
                    });
                    
                    return summary;
                }
                break;
                
            case 'getCorrelation':
                const correlationData = actionResult.correlation_data || actionResult.data || [];
                if (correlationData.length > 0) {
                    let summary = ` Correlation Analysis:\n\n`;
                    
                    const correlationsToShow = correlationData.slice(0, 5);
                    correlationsToShow.forEach((corr: any, index: number) => {
                        const token1 = corr.TOKEN_1 || corr.SYMBOL_1 || 'Token A';
                        const token2 = corr.TOKEN_2 || corr.SYMBOL_2 || 'Token B';
                        const coefficient = corr.CORRELATION_COEFFICIENT || corr.CORRELATION || 0;
                        const strength = Math.abs(coefficient) > 0.7 ? 'Strong' : 
                                       Math.abs(coefficient) > 0.3 ? 'Moderate' : 'Weak';
                        
                        summary += `${index + 1}. ${token1} vs ${token2}: ${coefficient.toFixed(3)} (${strength})\n`;
                    });
                    
                    return summary;
                }
                break;
        }
        
        // Fallback for any action with data
        if (actionResult.data && Array.isArray(actionResult.data)) {
            return ` Retrieved ${actionResult.data.length} data points successfully.`;
        } else if (actionResult.data) {
            return ` Data retrieved successfully.`;
        }
        
        return ' ✅ Operation completed successfully.';
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
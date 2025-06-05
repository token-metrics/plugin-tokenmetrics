import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    extractTokenIdentifier,
    formatTokenMetricsNumber,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { TradingSignalsResponse, TradingSignalsRequest } from "../types";

/**
 * CORRECTED Trading Signals Action - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/trading-signals
 * 
 * This action provides AI-generated trading signals for cryptocurrency positions.
 * According to the API docs, it uses specific signal values: 1 (bullish), -1 (bearish), 0 (no signal)
 * and supports extensive filtering capabilities including marketcap, volume, fdv thresholds.
 */
export const getTradingSignalsAction: Action = {
    name: "getTradingSignals",
    description: "Get AI-generated trading signals for long and short positions from TokenMetrics with entry points and risk management levels",
    similes: [
        "get trading signals",
        "get AI signals",
        "check buy sell signals",
        "get trading recommendations",
        "AI trading signals",
        "long short signals",
        "get entry exit points"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Extract token identifiers
            const tokenIdentifier = extractTokenIdentifier(messageContent);
            
            // FIXED: Use only one token identifier to avoid conflicts
            // Prefer SYMBOL over token_id for trading signals endpoint (more reliable)
            let finalTokenId: number | undefined;
            let finalSymbol: string | undefined;
            
            if (tokenIdentifier.symbol) {
                finalSymbol = tokenIdentifier.symbol;
                // Don't include token_id when we have symbol to avoid conflicts
            } else if (tokenIdentifier.token_id) {
                finalTokenId = tokenIdentifier.token_id;
            } else if (typeof messageContent.symbol === 'string') {
                finalSymbol = messageContent.symbol.toUpperCase();
            } else if (typeof messageContent.token_id === 'number') {
                finalTokenId = messageContent.token_id;
            } else {
                // Default to Bitcoin symbol for market overview queries
                finalSymbol = "BTC";
            }
            
            // CORRECTED: Signal filtering - API uses specific numeric values
            // 1 = bullish/long signal, -1 = bearish/short signal, 0 = no signal
            const signal = typeof messageContent.signal === 'number' ? messageContent.signal :
                           typeof messageContent.signal_type === 'string' ? 
                           (messageContent.signal_type.toLowerCase() === 'long' ? 1 :
                            messageContent.signal_type.toLowerCase() === 'short' ? -1 : undefined) : undefined;
            
            // CORRECTED: Use startDate/endDate as shown in actual API docs  
            const startDate = typeof messageContent.startDate === 'string' ? messageContent.startDate : 
                              typeof messageContent.start_date === 'string' ? messageContent.start_date : undefined;
            const endDate = typeof messageContent.endDate === 'string' ? messageContent.endDate :
                            typeof messageContent.end_date === 'string' ? messageContent.end_date : undefined;
            
            // Extensive filtering options from API docs
            const category = typeof messageContent.category === 'string' ? messageContent.category : undefined;
            const exchange = typeof messageContent.exchange === 'string' ? messageContent.exchange : undefined;
            const marketcap = typeof messageContent.marketcap === 'number' ? messageContent.marketcap : undefined;
            const volume = typeof messageContent.volume === 'number' ? messageContent.volume : undefined;
            const fdv = typeof messageContent.fdv === 'number' ? messageContent.fdv : undefined;
            
            // CORRECTED: Use page instead of offset for pagination
            const limit = typeof messageContent.limit === 'number' ? messageContent.limit : 50;
            const page = typeof messageContent.page === 'number' ? messageContent.page : 1;
            
            // CORRECTED: Build parameters based on actual API documentation
            const requestParams: TradingSignalsRequest = {
                // Token identification - use only one to avoid conflicts
                token_id: finalTokenId,
                symbol: finalSymbol,
                
                // CORRECTED: Signal filtering - API uses specific numeric values
                // 1 = bullish/long signal, -1 = bearish/short signal, 0 = no signal
                signal: signal,
                
                // CORRECTED: Use startDate/endDate as shown in actual API docs  
                startDate: startDate,
                endDate: endDate,
                
                // Extensive filtering options from API docs
                category: category,
                exchange: exchange,
                marketcap: marketcap,
                volume: volume,
                fdv: fdv,
                
                // CORRECTED: Use page instead of offset for pagination
                limit: limit,
                page: page
            };
            
            // Validate parameters according to actual API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Trading signals request params:", JSON.stringify(apiParams, null, 2));
            
            // Make API call with corrected authentication (x-api-key header)
            const response = await callTokenMetricsApi<TradingSignalsResponse>(
                TOKENMETRICS_ENDPOINTS.tradingSignals,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<TradingSignalsResponse>(response, "getTradingSignals");
            const tradingSignals = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the trading signals
            const signalsAnalysis = analyzeTradingSignals(tradingSignals);
            
            return {
                success: true,
                message: `Successfully retrieved ${tradingSignals.length} trading signals from TokenMetrics AI`,
                trading_signals: tradingSignals,
                analysis: signalsAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.tradingSignals,
                    requested_token: finalSymbol || finalTokenId,
                    signal_filter: requestParams.signal,
                    date_range: {
                        start: requestParams.startDate,
                        end: requestParams.endDate
                    },
                    filters_applied: {
                        category: requestParams.category,
                        exchange: requestParams.exchange,
                        min_marketcap: requestParams.marketcap,
                        min_volume: requestParams.volume,
                        min_fdv: requestParams.fdv
                    },
                    pagination: {
                        page: requestParams.page,
                        limit: requestParams.limit
                    },
                    data_points: tradingSignals.length,
                    api_version: "v2",
                    data_source: "TokenMetrics AI Signals"
                },
                signals_explanation: {
                    signal_values: {
                        "1": "Bullish/Long signal - AI recommends buying or holding position",
                        "-1": "Bearish/Short signal - AI recommends short position or selling",
                        "0": "No signal - AI sees neutral conditions"
                    },
                    usage_guidelines: [
                        "Focus on signals with higher confidence when available",
                        "Consider market conditions and broader trends",
                        "Use proper position sizing based on signal strength",
                        "Monitor for signal updates as market conditions change"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getTradingSignalsAction:", error);
            
            // Provide more specific error information
            let errorMessage = "Failed to retrieve trading signals from TokenMetrics API";
            let troubleshootingInfo = {};
            
            if (error instanceof Error) {
                if (error.message.includes("404")) {
                    errorMessage = "Trading signals endpoint not found - this may indicate an API version issue";
                    troubleshootingInfo = {
                        endpoint_issue: "The /v2/trading-signals endpoint returned 404",
                        possible_causes: [
                            "API endpoint URL may have changed",
                            "Your API subscription may not include trading signals",
                            "Token parameters may be invalid"
                        ],
                        suggested_solutions: [
                            "Verify your TokenMetrics subscription includes trading signals",
                            "Check if the token_id or symbol exists in TokenMetrics database",
                            "Try with a major token like BTC (token_id: 3375) or ETH (symbol: ETH)"
                        ]
                    };
                } else if (error.message.includes("Data not found")) {
                    errorMessage = "No trading signals found for the specified token";
                    troubleshootingInfo = {
                        data_issue: "TokenMetrics API returned 'Data not found'",
                        possible_causes: [
                            "Token may not have active trading signals",
                            "Token_id and symbol parameters may be mismatched",
                            "Token may not be supported for trading signals"
                        ],
                        suggested_solutions: [
                            "Try with a different token that has active signals",
                            "Use either token_id OR symbol, not both",
                            "Check TokenMetrics platform for available tokens"
                        ]
                    };
                }
            }
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: errorMessage,
                troubleshooting: troubleshootingInfo
            };
        }
    },
    
    validate: async (runtime, _message) => {
        const apiKey = runtime.getSetting("TOKENMETRICS_API_KEY");
        if (!apiKey) {
            console.warn("TokenMetrics API key not found. Please set TOKENMETRICS_API_KEY environment variable.");
            return false;
        }
        return true;
    },
    
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get me AI trading signals for Bitcoin",
                    symbol: "BTC"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve the latest AI-generated trading signals for Bitcoin from TokenMetrics.",
                    action: "GET_TRADING_SIGNALS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me bullish signals for DeFi tokens",
                    category: "defi",
                    signal: 1
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the bullish trading signals for DeFi tokens from TokenMetrics AI.",
                    action: "GET_TRADING_SIGNALS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get trading signals for tokens with market cap over $1B",
                    marketcap: 1000000000
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll fetch trading signals for large-cap cryptocurrencies.",
                    action: "GET_TRADING_SIGNALS"
                }
            }
        ]
    ],
};

/**
 * Comprehensive analysis function for trading signals from TokenMetrics.
 * This function processes the real API response data and provides actionable trading insights.
 * We focus on the signal distribution, quality assessment, and identifying the best opportunities.
 */
function analyzeTradingSignals(signalsData: any[]): any {
    if (!signalsData || signalsData.length === 0) {
        return {
            summary: "No trading signals available for analysis",
            active_opportunities: 0,
            signal_quality: "Unknown",
            recommendations: []
        };
    }
    
    // Analyze signal distribution and market sentiment
    const signalDistribution = analyzeSignalDistribution(signalsData);
    
    // Identify the best trading opportunities
    const opportunityAnalysis = identifyBestOpportunities(signalsData);
    
    // Assess overall signal quality and reliability
    const qualityAssessment = assessSignalQuality(signalsData);
    
    // Generate actionable insights
    const actionableInsights = generateSignalInsights(signalsData, signalDistribution, opportunityAnalysis);
    
    return {
        summary: `TokenMetrics AI analysis shows ${signalsData.length} signals with ${signalDistribution.market_bias} market sentiment`,
        signal_distribution: signalDistribution,
        opportunity_analysis: opportunityAnalysis,
        quality_assessment: qualityAssessment,
        actionable_insights: actionableInsights,
        trading_recommendations: generateTradingRecommendations(signalDistribution, opportunityAnalysis, qualityAssessment),
        risk_considerations: identifyRiskFactors(signalsData),
        data_quality: {
            source: "TokenMetrics AI Engine",
            total_signals: signalsData.length,
            signal_types: getAvailableSignalTypes(signalsData),
            reliability: "High - AI-powered analysis"
        }
    };
}

/**
 * This function analyzes how the AI signals are distributed across bullish, bearish, and neutral positions.
 * Understanding signal distribution helps us gauge overall market sentiment from TokenMetrics' perspective.
 */
function analyzeSignalDistribution(signalsData: any[]): any {
    // Count different signal types (1 = bullish, -1 = bearish, 0 = neutral)
    const bullishSignals = signalsData.filter(s => s.SIGNAL === 1).length;
    const bearishSignals = signalsData.filter(s => s.SIGNAL === -1).length;
    const neutralSignals = signalsData.filter(s => s.SIGNAL === 0).length;
    const totalSignals = signalsData.length;
    
    // Calculate percentages for better understanding
    const bullishPercentage = (bullishSignals / totalSignals) * 100;
    const bearishPercentage = (bearishSignals / totalSignals) * 100;
    const neutralPercentage = (neutralSignals / totalSignals) * 100;
    
    // Determine overall market bias based on signal distribution
    let marketBias;
    if (bullishPercentage > 60) marketBias = "Strongly Bullish";
    else if (bullishPercentage > 45) marketBias = "Bullish";
    else if (bullishPercentage > 35) marketBias = "Neutral";
    else if (bullishPercentage > 20) marketBias = "Bearish"; 
    else marketBias = "Strongly Bearish";
    
    return {
        bullish_signals: bullishSignals,
        bearish_signals: bearishSignals,
        neutral_signals: neutralSignals,
        bullish_percentage: bullishPercentage.toFixed(1),
        bearish_percentage: bearishPercentage.toFixed(1),
        neutral_percentage: neutralPercentage.toFixed(1),
        market_bias: marketBias,
        sentiment_strength: Math.abs(bullishPercentage - bearishPercentage) > 30 ? "Strong" : "Moderate"
    };
}

/**
 * This function identifies the most promising trading opportunities from the signals.
 * We focus on signals that have additional supporting data like entry prices or confidence scores.
 */
function identifyBestOpportunities(signalsData: any[]): any {
    // Filter for actionable signals (non-neutral with some supporting data)
    const actionableSignals = signalsData.filter(s => 
        s.SIGNAL !== 0 && // Not neutral
        (s.ENTRY_PRICE || s.TARGET_PRICE || s.AI_CONFIDENCE) // Has some actionable data
    );
    
    // Sort by various quality indicators
    const sortedSignals = actionableSignals.sort((a, b) => {
        // Prioritize signals with more complete data
        const aScore = (a.AI_CONFIDENCE || 50) + (a.ENTRY_PRICE ? 10 : 0) + (a.TARGET_PRICE ? 10 : 0);
        const bScore = (b.AI_CONFIDENCE || 50) + (b.ENTRY_PRICE ? 10 : 0) + (b.TARGET_PRICE ? 10 : 0);
        return bScore - aScore;
    });
    
    // Take top opportunities
    const topOpportunities = sortedSignals.slice(0, 5).map(signal => ({
        token: `${signal.NAME || 'Unknown'} (${signal.SYMBOL || 'N/A'})`,
        signal_type: signal.SIGNAL === 1 ? "BULLISH" : "BEARISH",
        entry_price: signal.ENTRY_PRICE ? formatTokenMetricsNumber(signal.ENTRY_PRICE, 'currency') : 'N/A',
        target_price: signal.TARGET_PRICE ? formatTokenMetricsNumber(signal.TARGET_PRICE, 'currency') : 'N/A',
        ai_confidence: signal.AI_CONFIDENCE ? `${signal.AI_CONFIDENCE}%` : 'N/A',
        potential_return: calculatePotentialReturn(signal),
        market_cap: signal.MARKET_CAP ? formatTokenMetricsNumber(signal.MARKET_CAP, 'currency') : 'N/A'
    }));
    
    return {
        total_opportunities: actionableSignals.length,
        top_opportunities: topOpportunities,
        opportunity_quality: actionableSignals.length >= 5 ? "Abundant" : 
                           actionableSignals.length >= 2 ? "Moderate" : "Limited"
    };
}

/**
 * This function assesses the overall quality and reliability of the signals.
 * We look at factors like data completeness, signal freshness, and consistency.
 */
function assessSignalQuality(signalsData: any[]): any {
    // Count signals with complete data
    const signalsWithPrices = signalsData.filter(s => s.ENTRY_PRICE && s.TARGET_PRICE).length;
    const signalsWithConfidence = signalsData.filter(s => s.AI_CONFIDENCE).length;
    const signalsWithDates = signalsData.filter(s => s.DATE).length;
    
    // Calculate completeness percentage
    const completenessScore = ((signalsWithPrices + signalsWithConfidence + signalsWithDates) / (signalsData.length * 3)) * 100;
    
    // Assess signal freshness (if date information is available)
    let freshnessAssessment = "Unknown";
    if (signalsWithDates > 0) {
        const recentSignals = signalsData.filter(s => {
            if (!s.DATE) return false;
            const signalDate = new Date(s.DATE);
            const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
            return signalDate > threeDaysAgo;
        }).length;
        
        const freshnessPercentage = (recentSignals / signalsWithDates) * 100;
        if (freshnessPercentage > 70) freshnessAssessment = "Fresh";
        else if (freshnessPercentage > 40) freshnessAssessment = "Moderate";
        else freshnessAssessment = "Stale";
    }
    
    // Overall quality rating
    let qualityRating;
    if (completenessScore > 80 && freshnessAssessment === "Fresh") qualityRating = "Excellent";
    else if (completenessScore > 60) qualityRating = "Good";
    else if (completenessScore > 40) qualityRating = "Fair";
    else qualityRating = "Poor";
    
    return {
        quality_rating: qualityRating,
        completeness_score: completenessScore.toFixed(1),
        data_availability: {
            with_entry_prices: `${signalsWithPrices} signals`,
            with_confidence: `${signalsWithConfidence} signals`,
            with_dates: `${signalsWithDates} signals`
        },
        freshness_assessment: freshnessAssessment
    };
}

/**
 * This function generates actionable insights based on the signal analysis.
 * These insights help traders understand what the signals mean for their strategy.
 */
function generateSignalInsights(signalsData: any[], distribution: any, opportunities: any): string[] {
    const insights = [];
    
    // Market sentiment insights based on signal distribution
    if (distribution.market_bias === "Strongly Bullish") {
        insights.push("TokenMetrics AI shows strong bullish sentiment across analyzed tokens - favorable conditions for long positions");
    } else if (distribution.market_bias === "Strongly Bearish") {
        insights.push("TokenMetrics AI indicates strong bearish sentiment - consider defensive positioning or short opportunities");
    } else if (distribution.market_bias === "Neutral") {
        insights.push("Mixed signals from TokenMetrics AI suggest selective approach - focus on highest conviction opportunities");
    }
    
    // Opportunity-based insights
    if (opportunities.opportunity_quality === "Abundant") {
        insights.push(`${opportunities.total_opportunities} actionable trading opportunities identified - good market for active trading`);
    } else if (opportunities.opportunity_quality === "Limited") {
        insights.push("Limited trading opportunities available - patience and selectivity recommended");
    }
    
    // Signal quality insights
    const bullishCount = signalsData.filter(s => s.SIGNAL === 1).length;
    const bearishCount = signalsData.filter(s => s.SIGNAL === -1).length;
    
    if (bullishCount > bearishCount * 2) {
        insights.push("Overwhelming bullish bias suggests considering increased crypto exposure");
    } else if (bearishCount > bullishCount * 2) {
        insights.push("Strong bearish bias indicates potential market correction ahead");
    }
    
    return insights;
}

/**
 * This function generates specific trading recommendations based on the signal analysis.
 * These recommendations are designed to be actionable for different trading strategies.
 */
function generateTradingRecommendations(distribution: any, opportunities: any, quality: any): string[] {
    const recommendations = [];
    
    // Based on signal quality
    if (quality.quality_rating === "Excellent" || quality.quality_rating === "Good") {
        recommendations.push("High signal quality supports active trading with appropriate position sizing");
    } else {
        recommendations.push("Moderate signal quality suggests conservative approach and additional due diligence");
    }
    
    // Based on market bias
    const bullishPercentage = parseFloat(distribution.bullish_percentage);
    if (bullishPercentage > 60) {
        recommendations.push("Strong bullish signals favor long-biased strategies and crypto accumulation");
        recommendations.push("Consider dollar-cost averaging into quality positions during any dips");
    } else if (bullishPercentage < 30) {
        recommendations.push("Bearish signals suggest defensive positioning and profit-taking on existing positions");
        recommendations.push("Consider hedging strategies or increasing cash allocation");
    }
    
    // Based on opportunities
    if (opportunities.opportunity_quality === "Abundant") {
        recommendations.push("Multiple opportunities allow for diversified approach across different tokens");
    } else {
        recommendations.push("Limited opportunities require high selectivity - focus only on highest conviction signals");
    }
    
    // General recommendations
    recommendations.push("Always use appropriate position sizing based on signal strength and market conditions");
    recommendations.push("Monitor signals regularly for updates as TokenMetrics AI adapts to changing conditions");
    recommendations.push("Combine signals with fundamental analysis and market context for best results");
    
    return recommendations;
}

/**
 * This function identifies potential risk factors in the current signal environment.
 * Understanding these risks helps traders make more informed decisions.
 */
function identifyRiskFactors(signalsData: any[]): string[] {
    const risks = [];
    
    // Check for signal concentration in specific categories or exchanges
    const categories = new Set(signalsData.map(s => s.CATEGORY).filter(c => c));
    const exchanges = new Set(signalsData.map(s => s.EXCHANGE).filter(e => e));
    
    if (categories.size < 3) {
        risks.push("Signals concentrated in limited categories - diversification across sectors recommended");
    }
    
    if (exchanges.size < 3) {
        risks.push("Signals concentrated on few exchanges - consider liquidity and counterparty risks");
    }
    
    // Check for missing risk management data
    const signalsWithoutPrices = signalsData.filter(s => !s.ENTRY_PRICE || !s.TARGET_PRICE).length;
    if (signalsWithoutPrices > signalsData.length * 0.5) {
        risks.push("Many signals lack price targets - manual risk management and position sizing required");
    }
    
    // General market risks
    risks.push("Cryptocurrency markets remain highly volatile - use appropriate position sizing");
    risks.push("External factors (regulation, macro events) can override technical signals");
    risks.push("AI signals are probabilities, not guarantees - maintain proper risk management");
    
    return risks;
}

// Utility functions for signal analysis

function calculatePotentialReturn(signal: any): string {
    if (!signal.ENTRY_PRICE || !signal.TARGET_PRICE) return 'N/A';
    
    let returnPercentage;
    if (signal.SIGNAL === 1) { // Bullish signal
        returnPercentage = ((signal.TARGET_PRICE - signal.ENTRY_PRICE) / signal.ENTRY_PRICE) * 100;
    } else { // Bearish signal  
        returnPercentage = ((signal.ENTRY_PRICE - signal.TARGET_PRICE) / signal.ENTRY_PRICE) * 100;
    }
    
    return `${returnPercentage.toFixed(1)}%`;
}

function getAvailableSignalTypes(signalsData: any[]): string[] {
    const types = new Set<string>();
    signalsData.forEach(signal => {
        if (signal.SIGNAL === 1) types.add('BULLISH');
        else if (signal.SIGNAL === -1) types.add('BEARISH'); 
        else if (signal.SIGNAL === 0) types.add('NEUTRAL');
    });
    return Array.from(types);
}
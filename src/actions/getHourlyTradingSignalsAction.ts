import type { Action } from "@elizaos/core";
import {
    type IAgentRuntime,
    type Memory,
    type State,
    type HandlerCallback,
    elizaLogger
} from "@elizaos/core";
import { z } from "zod";
import {
    validateAndGetApiKey,
    extractTokenMetricsRequest,
    callTokenMetricsAPI,
    formatCurrency,
    formatPercentage,
    generateRequestId,
    resolveTokenSmart
} from "./aiActionHelper";
import type { HourlyTradingSignalsResponse } from "../types";

// Zod schema for hourly trading signals request validation
const HourlyTradingSignalsRequestSchema = z.object({
    cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
    token_id: z.number().optional().describe("Specific token ID if known"),
    symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
    signal: z.number().optional().describe("Filter by signal type (1=bullish, -1=bearish, 0=neutral)"),
    startDate: z.string().optional().describe("Start date for data range (YYYY-MM-DD)"),
    endDate: z.string().optional().describe("End date for data range (YYYY-MM-DD)"),
    category: z.string().optional().describe("Token category filter"),
    exchange: z.string().optional().describe("Exchange filter"),
    marketcap: z.number().optional().describe("Minimum market cap filter"),
    volume: z.number().optional().describe("Minimum volume filter"),
    fdv: z.number().optional().describe("Minimum fully diluted valuation filter"),
    limit: z.number().min(1).max(100).optional().describe("Number of signals to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["active_trading", "scalping", "momentum", "all"]).optional().describe("Type of analysis to focus on")
});

type HourlyTradingSignalsRequest = z.infer<typeof HourlyTradingSignalsRequestSchema>;

// AI extraction template for natural language processing
const HOURLY_TRADING_SIGNALS_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting hourly trading signals requests from natural language.

The user wants to get AI-generated hourly trading signals for cryptocurrency analysis. Extract the following information:

1. **cryptocurrency** (optional): The name or symbol of the cryptocurrency
   - Look for token names like "Bitcoin", "Ethereum", "BTC", "ETH"
   - Can be a specific token or general request

2. **token_id** (optional): Specific token ID if mentioned
   - Usually a number like "3375" for Bitcoin

3. **symbol** (optional): Token symbol
   - Extract symbols like "BTC", "ETH", "ADA", etc.

4. **signal** (optional): Filter by signal type
   - 1 = bullish/long signals
   - -1 = bearish/short signals
   - 0 = neutral signals
   - Look for phrases like "bullish signals", "buy signals", "short signals"

5. **startDate** (optional): Start date for data range
   - Look for dates in YYYY-MM-DD format
   - Convert relative dates like "last week", "past 3 days"

6. **endDate** (optional): End date for data range

7. **category** (optional): Token category filter
   - Look for categories like "defi", "layer1", "gaming"

8. **exchange** (optional): Exchange filter

9. **marketcap** (optional): Minimum market cap filter

10. **volume** (optional): Minimum volume filter

11. **fdv** (optional): Minimum fully diluted valuation filter

12. **limit** (optional, default: 20): Number of signals to return

13. **page** (optional, default: 1): Page number for pagination

14. **analysisType** (optional, default: "all"): What type of analysis they want
    - "active_trading" - focus on frequent trading opportunities
    - "scalping" - focus on very short-term signals
    - "momentum" - focus on momentum-based signals
    - "all" - comprehensive hourly signal analysis

Examples:
- "Get hourly trading signals for Bitcoin" → {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Show me bullish hourly signals" → {signal: 1, analysisType: "active_trading"}
- "Hourly buy signals for ETH" → {cryptocurrency: "Ethereum", symbol: "ETH", signal: 1, analysisType: "active_trading"}
- "Scalping signals for the past 24 hours" → {analysisType: "scalping"}

Extract the request details from the user's message.
`;

/**
 * Hourly Trading Signals Action - Based on TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/hourly-trading-signals
 * 
 * This action provides AI-generated hourly trading signals for cryptocurrency positions.
 * Provides more frequent signal updates compared to daily trading signals for active trading.
 */
export const getHourlyTradingSignalsAction: Action = {
    name: "GET_HOURLY_TRADING_SIGNALS_TOKENMETRICS",
    description: "Get AI-generated hourly trading signals for cryptocurrencies with frequent updates for active trading from TokenMetrics",
    similes: [
        "get hourly trading signals",
        "get hourly AI signals",
        "check hourly buy sell signals",
        "get hourly trading recommendations",
        "hourly AI trading signals",
        "frequent trading signals",
        "get hourly entry exit points",
        "active trading signals",
        "scalping signals"
    ],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get hourly trading signals for Bitcoin"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the latest hourly trading signals for Bitcoin from TokenMetrics AI.",
                    action: "GET_HOURLY_TRADING_SIGNALS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me hourly buy signals for cryptocurrencies"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve hourly bullish trading signals for active trading opportunities.",
                    action: "GET_HOURLY_TRADING_SIGNALS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get scalping signals for ETH"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get hourly scalping signals for Ethereum optimized for very short-term trading.",
                    action: "GET_HOURLY_TRADING_SIGNALS_TOKENMETRICS"
                }
            }
        ]
    ],
    
    validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        elizaLogger.log("🔍 Validating getHourlyTradingSignalsAction (1.x)");
        
        try {
            validateAndGetApiKey(runtime);
            return true;
        } catch (error) {
            elizaLogger.error("❌ Validation failed:", error);
            return false;
        }
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        const requestId = generateRequestId();
        
        elizaLogger.log("🚀 Starting TokenMetrics hourly trading signals handler (1.x)");
        elizaLogger.log(`📝 Processing user message: "${message.content?.text || "No text content"}"`);
        elizaLogger.log(`🆔 Request ID: ${requestId}`);

        try {
            // STEP 1: Validate API key early
            validateAndGetApiKey(runtime);

            // Ensure we have a proper state
            if (!state) {
                state = await runtime.composeState(message);
            }

            // STEP 2: Build API parameters
            const apiParams: any = {
                limit: 20,
                page: 1
            };

            // STEP 3: Fetch hourly trading signals data
            elizaLogger.log(`📡 Fetching hourly trading signals data`);
            const signalsData = await callTokenMetricsAPI('/v2/hourly-trading-signals', apiParams, runtime);
            
            if (!signalsData) {
                elizaLogger.log("❌ Failed to fetch hourly trading signals data");
                
                if (callback) {
                    await callback({
                        text: `❌ Unable to fetch hourly trading signals data at the moment.

This could be due to:
• TokenMetrics API connectivity issues
• Temporary service interruption  
• Rate limiting

Please try again in a few moments.`,
                        content: { 
                            error: "API fetch failed",
                            request_id: requestId
                        }
                    });
                }
                return false;
            }

            // Handle the response data
            const signals = Array.isArray(signalsData) ? signalsData : (signalsData.data || []);
            
            elizaLogger.log(`🔍 Received ${signals.length} hourly trading signals`);

            // STEP 4: Format and present the results  
            const responseText = formatHourlyTradingSignalsResponse(signals);
            const analysis = analyzeHourlyTradingSignals(signals, "comprehensive");

            elizaLogger.success("✅ Successfully processed hourly trading signals request");

            if (callback) {
                await callback({
                    text: responseText,
                    content: {
                        success: true,
                        signals_data: signals,
                        analysis: analysis,
                        source: "TokenMetrics Hourly Trading Signals API",
                        request_id: requestId,
                        metadata: {
                            endpoint: "hourly-trading-signals",
                            data_source: "TokenMetrics API",
                            timestamp: new Date().toISOString(),
                            total_signals: signals.length
                        }
                    }
                });
            }

            return true;

        } catch (error) {
            elizaLogger.error("❌ Error in TokenMetrics hourly trading signals handler:", error);
            elizaLogger.error(`🆔 Request ${requestId}: ERROR - ${error}`);
            
            if (callback) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                
                await callback({
                    text: `❌ I encountered an error while fetching hourly trading signals: ${errorMessage}

This could be due to:
• Network connectivity issues
• TokenMetrics API service problems
• Invalid API key or authentication issues
• Temporary system overload

Please check your TokenMetrics API key configuration and try again.`,
                    content: { 
                        error: errorMessage,
                        error_type: error instanceof Error ? error.constructor.name : 'Unknown',
                        troubleshooting: true,
                        request_id: requestId
                    }
                });
            }
            
            return false;
        }
    }
};

/**
 * Format hourly trading signals response for user
 */
function formatHourlyTradingSignalsResponse(signals: any[]): string {
    if (!signals || signals.length === 0) {
        return "❌ No hourly trading signals data available.";
    }

    let response = `⚡ **Hourly Trading Signals Analysis**\n\n`;
    response += `📊 **Total Signals**: ${signals.length}\n\n`;

    if (signals.length > 0) {
        const recentSignals = signals.slice(0, 5);
        response += `📈 **Recent Signals**:\n`;
        
        recentSignals.forEach((signal, index) => {
            const symbol = signal.SYMBOL || signal.TOKEN_SYMBOL || 'N/A';
            const action = signal.SIGNAL || signal.ACTION || 'HOLD';
            const confidence = signal.CONFIDENCE || signal.SCORE || 'N/A';
            
            response += `${index + 1}. **${symbol}**: ${action}`;
            if (confidence !== 'N/A') {
                response += ` (Confidence: ${confidence})`;
            }
            response += `\n`;
        });
    }

    response += `\n📊 **Data Source**: TokenMetrics Hourly Trading Signals API\n`;
    response += `⏰ **Updated**: ${new Date().toLocaleString()}\n`;
    
    return response;
}

/**
 * Analyze hourly trading signals to provide trading insights based on analysis type
 */
function analyzeHourlyTradingSignals(signalsData: any[], analysisType: string = "all"): any {
    if (!signalsData || signalsData.length === 0) {
        return {
            summary: "No hourly trading signals available for analysis",
            signal_distribution: "No data",
            insights: []
        };
    }
    
    // Core analysis components
    const distribution = analyzeHourlySignalDistribution(signalsData);
    const trends = analyzeHourlyTrends(signalsData);
    const opportunities = identifyHourlyOpportunities(signalsData);
    const quality = assessHourlySignalQuality(signalsData);
    
    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "active_trading":
            focusedAnalysis = {
                active_trading_focus: {
                    frequent_signals: analyzeSignalFrequency(signalsData),
                    entry_exit_timing: analyzeEntryExitTiming(signalsData),
                    active_opportunities: identifyActiveOpportunities(signalsData),
                    active_insights: [
                        `🔄 Signal frequency: ${distribution.signal_frequency || 'Unknown'}`,
                        `⚡ Active signals: ${distribution.active_signals || 0}`,
                        `🎯 Trading opportunities: ${opportunities.immediate_opportunities || 0}`
                    ]
                }
            };
            break;
            
        case "scalping":
            focusedAnalysis = {
                scalping_focus: {
                    micro_signals: analyzeScalpingSignals(signalsData),
                    quick_reversals: identifyQuickReversals(signalsData),
                    scalping_timing: analyzeScalpingTiming(signalsData),
                    scalping_insights: [
                        `⚡ Scalping signals: ${opportunities.scalping_signals || 0}`,
                        `🔄 Quick reversals: ${trends.quick_reversals || 0}`,
                        `⏱️ Average signal duration: ${trends.avg_signal_duration || 'Unknown'}`
                    ]
                }
            };
            break;
            
        case "momentum":
            focusedAnalysis = {
                momentum_focus: {
                    momentum_signals: analyzeMomentumSignals(signalsData),
                    trend_continuation: analyzeTrendContinuation(signalsData),
                    momentum_strength: assessMomentumStrength(signalsData),
                    momentum_insights: [
                        `📈 Momentum signals: ${opportunities.momentum_signals || 0}`,
                        `🔥 Strong trends: ${trends.strong_trends || 0}`,
                        `💪 Momentum strength: ${trends.momentum_strength || 'Neutral'}`
                    ]
                }
            };
            break;
    }
    
    return {
        summary: `Hourly signal analysis of ${signalsData.length} signals showing ${distribution.dominant_signal} bias with ${quality.quality_rating} signal quality`,
        analysis_type: analysisType,
        signal_distribution: distribution,
        hourly_trends: trends,
        trading_opportunities: opportunities,
        signal_quality: quality,
        insights: generateHourlySignalInsights(signalsData, distribution, trends, opportunities),
        trading_recommendations: generateHourlyTradingRecommendations(distribution, trends, opportunities, quality),
        risk_factors: identifyHourlyRiskFactors(signalsData),
        ...focusedAnalysis,
        data_quality: {
            source: "TokenMetrics AI Hourly Signals",
            signal_count: signalsData.length,
            quality_score: calculateHourlyQualityScore(signalsData),
            update_frequency: "Hourly",
            reliability: assessSignalReliability(signalsData)
        },
        timing_analysis: analyzeSignalTiming(signalsData, analysisType)
    };
}

/**
 * Analyze hourly signal distribution
 */
function analyzeHourlySignalDistribution(signalsData: any[]): any {
    const distribution = { bullish: 0, bearish: 0, neutral: 0 };
    const byHour: Record<number, { bullish: number; bearish: number; neutral: number }> = {};
    const byToken: Record<string, { bullish: number; bearish: number; neutral: number }> = {};

    signalsData.forEach(signal => {
        // Count signal types
        if (signal.TRADING_SIGNAL === 1) distribution.bullish++;
        else if (signal.TRADING_SIGNAL === -1) distribution.bearish++;
        else distribution.neutral++;

        // Group by hour if timestamp available
        if (signal.TIMESTAMP || signal.DATE) {
            const timestamp = signal.TIMESTAMP || signal.DATE;
            const hour = new Date(timestamp).getHours();
            if (!byHour[hour]) byHour[hour] = { bullish: 0, bearish: 0, neutral: 0 };
            
            if (signal.TRADING_SIGNAL === 1) byHour[hour].bullish++;
            else if (signal.TRADING_SIGNAL === -1) byHour[hour].bearish++;
            else byHour[hour].neutral++;
        }

        // Group by token
        const token = signal.SYMBOL || signal.TOKEN_ID;
        if (token) {
            if (!byToken[token]) byToken[token] = { bullish: 0, bearish: 0, neutral: 0 };
            
            if (signal.TRADING_SIGNAL === 1) byToken[token].bullish++;
            else if (signal.TRADING_SIGNAL === -1) byToken[token].bearish++;
            else byToken[token].neutral++;
        }
    });

    const total = signalsData.length;
    return {
        total_signals: total,
        bullish_percentage: ((distribution.bullish / total) * 100).toFixed(1),
        bearish_percentage: ((distribution.bearish / total) * 100).toFixed(1),
        neutral_percentage: ((distribution.neutral / total) * 100).toFixed(1),
        by_hour: byHour,
        by_token: byToken,
        market_sentiment: distribution.bullish > distribution.bearish ? 'Bullish' : 
                         distribution.bearish > distribution.bullish ? 'Bearish' : 'Neutral'
    };
}

/**
 * Analyze hourly trends
 */
function analyzeHourlyTrends(signalsData: any[]): any {
    const sortedData = signalsData
        .filter(signal => signal.TIMESTAMP || signal.DATE)
        .sort((a, b) => new Date(a.TIMESTAMP || a.DATE).getTime() - new Date(b.TIMESTAMP || b.DATE).getTime());

    if (sortedData.length < 2) {
        return { trend: 'Insufficient data for trend analysis' };
    }

    const recentSignals = sortedData.slice(-10); // Last 10 signals
    const olderSignals = sortedData.slice(0, 10); // First 10 signals

    // Use TRADING_SIGNAL field (correct API field name)
    const recentBullish = recentSignals.filter(s => (s.TRADING_SIGNAL || s.SIGNAL) === 1).length;
    const olderBullish = olderSignals.filter(s => (s.TRADING_SIGNAL || s.SIGNAL) === 1).length;

    const trendDirection = recentBullish > olderBullish ? 'Increasingly Bullish' :
                          recentBullish < olderBullish ? 'Increasingly Bearish' : 'Stable';

    return {
        trend_direction: trendDirection,
        recent_bullish_ratio: (recentBullish / recentSignals.length * 100).toFixed(1) + '%',
        historical_bullish_ratio: (olderBullish / olderSignals.length * 100).toFixed(1) + '%',
        signal_momentum: recentBullish - olderBullish,
        data_points_analyzed: sortedData.length
    };
}

/**
 * Identify hourly opportunities
 */
function identifyHourlyOpportunities(signalsData: any[]): any {
    const opportunities: Array<{
        type: 'BUY_OPPORTUNITY' | 'SELL_OPPORTUNITY';
        token: string | number;
        confidence: number | string;
        entry_price?: number;
        target_price?: number;
        stop_loss?: number;
        timestamp: string;
        reasoning: string;
    }> = [];
    const strongSignals = signalsData.filter(signal => 
        signal.AI_CONFIDENCE && signal.AI_CONFIDENCE > 0.7 ||
        signal.SIGNAL_STRENGTH && signal.SIGNAL_STRENGTH > 0.7
    );

    strongSignals.forEach(signal => {
        const signalValue = signal.TRADING_SIGNAL || signal.SIGNAL; // Use correct field name
        if (signalValue === 1) { // Bullish
            opportunities.push({
                type: 'BUY_OPPORTUNITY',
                token: signal.SYMBOL || signal.TOKEN_ID,
                confidence: signal.AI_CONFIDENCE || signal.SIGNAL_STRENGTH || 'High',
                entry_price: signal.ENTRY_PRICE,
                target_price: signal.TARGET_PRICE,
                timestamp: signal.TIMESTAMP || signal.DATE,
                reasoning: signal.REASONING || 'Strong bullish signal detected'
            });
        } else if (signalValue === -1) { // Bearish
            opportunities.push({
                type: 'SELL_OPPORTUNITY',
                token: signal.SYMBOL || signal.TOKEN_ID,
                confidence: signal.AI_CONFIDENCE || signal.SIGNAL_STRENGTH || 'High',
                entry_price: signal.ENTRY_PRICE,
                stop_loss: signal.STOP_LOSS,
                timestamp: signal.TIMESTAMP || signal.DATE,
                reasoning: signal.REASONING || 'Strong bearish signal detected'
            });
        }
    });

    return {
        total_opportunities: opportunities.length,
        buy_opportunities: opportunities.filter(o => o.type === 'BUY_OPPORTUNITY').length,
        sell_opportunities: opportunities.filter(o => o.type === 'SELL_OPPORTUNITY').length,
        opportunities: opportunities.slice(0, 5), // Top 5 opportunities
        high_confidence_signals: strongSignals.length
    };
}

/**
 * Assess hourly signal quality
 */
function assessHourlySignalQuality(signalsData: any[]): any {
    const withConfidence = signalsData.filter(s => s.AI_CONFIDENCE || s.SIGNAL_STRENGTH);
    const avgConfidence = withConfidence.length > 0 ? 
        withConfidence.reduce((sum, s) => sum + (s.AI_CONFIDENCE || s.SIGNAL_STRENGTH || 0), 0) / withConfidence.length : 0;

    const withPriceTargets = signalsData.filter(s => s.TARGET_PRICE || s.ENTRY_PRICE);
    const withStopLoss = signalsData.filter(s => s.STOP_LOSS);

    return {
        average_confidence: (avgConfidence * 100).toFixed(1) + '%',
        signals_with_confidence: withConfidence.length,
        signals_with_price_targets: withPriceTargets.length,
        signals_with_stop_loss: withStopLoss.length,
        quality_score: calculateHourlyQualityScore(signalsData),
        completeness_ratio: (withPriceTargets.length / signalsData.length * 100).toFixed(1) + '%'
    };
}

/**
 * Calculate hourly quality score
 */
function calculateHourlyQualityScore(signalsData: any[]): string {
    if (signalsData.length === 0) return 'No data';

    let score = 0;
    const total = signalsData.length;

    // Points for having confidence scores
    const withConfidence = signalsData.filter(s => s.AI_CONFIDENCE || s.SIGNAL_STRENGTH).length;
    score += (withConfidence / total) * 30;

    // Points for having price targets
    const withTargets = signalsData.filter(s => s.TARGET_PRICE || s.ENTRY_PRICE).length;
    score += (withTargets / total) * 25;

    // Points for having stop loss
    const withStopLoss = signalsData.filter(s => s.STOP_LOSS).length;
    score += (withStopLoss / total) * 25;

    // Points for having reasoning
    const withReasoning = signalsData.filter(s => s.REASONING).length;
    score += (withReasoning / total) * 20;

    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Basic';
}

/**
 * Generate hourly signal insights
 */
function generateHourlySignalInsights(signalsData: any[], distribution: any, trends: any, opportunities: any): string[] {
    const insights = [];

    if (distribution.market_sentiment === 'Bullish') {
        insights.push(`🟢 Market shows ${distribution.bullish_percentage}% bullish hourly signals`);
    } else if (distribution.market_sentiment === 'Bearish') {
        insights.push(`🔴 Market shows ${distribution.bearish_percentage}% bearish hourly signals`);
    } else {
        insights.push(`🟡 Market sentiment is neutral with mixed hourly signals`);
    }

    if (trends.trend_direction !== 'Stable') {
        insights.push(`📈 Trend analysis shows ${trends.trend_direction.toLowerCase()} momentum`);
    }

    if (opportunities.total_opportunities > 0) {
        insights.push(`🎯 Found ${opportunities.total_opportunities} high-confidence trading opportunities`);
    }

    // Hour-specific insights
    if (distribution.by_hour && Object.keys(distribution.by_hour).length > 0) {
        const bestHours = Object.entries(distribution.by_hour)
            .sort(([,a], [,b]) => {
                const aValue = a as { bullish: number; bearish: number; neutral: number };
                const bValue = b as { bullish: number; bearish: number; neutral: number };
                return (bValue.bullish - bValue.bearish) - (aValue.bullish - aValue.bearish);
            })
            .slice(0, 2);
        
        if (bestHours.length > 0) {
            insights.push(`⏰ Most bullish hours: ${bestHours.map(([hour]) => `${hour}:00`).join(', ')}`);
        }
    }

    return insights;
}

/**
 * Generate hourly trading recommendations
 */
function generateHourlyTradingRecommendations(distribution: any, trends: any, opportunities: any, quality: any): string[] {
    const recommendations = [];

    if (distribution.market_sentiment === 'Bullish' && trends.trend_direction.includes('Bullish')) {
        recommendations.push("Consider long positions on tokens with strong hourly bullish signals");
    } else if (distribution.market_sentiment === 'Bearish' && trends.trend_direction.includes('Bearish')) {
        recommendations.push("Consider short positions or profit-taking on existing longs");
    }

    if (opportunities.high_confidence_signals > 0) {
        recommendations.push("Focus on high-confidence signals for better risk-adjusted returns");
    }

    if (quality.quality_score === 'Excellent' || quality.quality_score === 'Good') {
        recommendations.push("Signal quality is high - suitable for active trading strategies");
    } else {
        recommendations.push("Use additional confirmation before acting on signals");
    }

    recommendations.push("Monitor signals every hour during active trading sessions");
    recommendations.push("Use proper position sizing for hourly signal-based trades");

    return recommendations;
}

/**
 * Identify hourly risk factors
 */
function identifyHourlyRiskFactors(signalsData: any[]): string[] {
    const risks = [];

    const signalChanges = signalsData.filter((signal, index) => {
        if (index === 0) return false;
        return signal.TRADING_SIGNAL !== signalsData[index - 1].TRADING_SIGNAL;
    });

    if (signalChanges.length > signalsData.length * 0.5) {
        risks.push("High signal volatility - frequent changes may indicate market uncertainty");
    }

    const lowConfidenceSignals = signalsData.filter(s => 
        (s.AI_CONFIDENCE && s.AI_CONFIDENCE < 0.5) || 
        (s.SIGNAL_STRENGTH && s.SIGNAL_STRENGTH < 0.5)
    );

    if (lowConfidenceSignals.length > signalsData.length * 0.3) {
        risks.push("Many low-confidence signals - exercise additional caution");
    }

    const missingStopLoss = signalsData.filter(s => !s.STOP_LOSS);
    if (missingStopLoss.length > signalsData.length * 0.7) {
        risks.push("Limited stop-loss data - implement your own risk management");
    }

    if (risks.length === 0) {
        risks.push("Standard market risks apply - use proper position sizing");
    }

    return risks;
}

// Additional analysis functions for focused analysis types
function analyzeSignalFrequency(signalsData: any[]): any {
    if (!signalsData || signalsData.length === 0) return { frequency: "No data" };
    
    const timeIntervals = signalsData.map((signal, index) => {
        if (index === 0) return null;
        const current = new Date(signal.TIMESTAMP || signal.DATE);
        const previous = new Date(signalsData[index - 1].TIMESTAMP || signalsData[index - 1].DATE);
        return current.getTime() - previous.getTime();
    }).filter(interval => interval !== null);
    
    const avgInterval = timeIntervals.length > 0 ? 
        timeIntervals.reduce((sum: number, interval: number) => sum + interval, 0) / timeIntervals.length : 0;
    
    return {
        frequency: avgInterval > 0 ? `${Math.round(avgInterval / (1000 * 60 * 60))} hours` : "Unknown",
        signal_count: signalsData.length,
        active_periods: identifyActivePeriods(signalsData)
    };
}

function analyzeEntryExitTiming(signalsData: any[]): any {
    const bullishSignals = signalsData.filter(s => s.TRADING_SIGNAL === 1);
    const bearishSignals = signalsData.filter(s => s.TRADING_SIGNAL === -1);
    
    return {
        entry_opportunities: bullishSignals.length,
        exit_opportunities: bearishSignals.length,
        timing_quality: bullishSignals.length > 0 && bearishSignals.length > 0 ? "Balanced" : "Limited",
        best_entry_times: identifyBestTimes(bullishSignals),
        best_exit_times: identifyBestTimes(bearishSignals)
    };
}

function identifyActiveOpportunities(signalsData: any[]): any {
    const recentSignals = signalsData.slice(-10); // Last 10 signals
    const activeSignals = recentSignals.filter(s => s.TRADING_SIGNAL !== 0);
    
    return {
        immediate_opportunities: activeSignals.length,
        recent_trend: activeSignals.length > 5 ? "High activity" : "Low activity",
        signal_strength: calculateAverageStrength(activeSignals)
    };
}

function analyzeScalpingSignals(signalsData: any[]): any {
    const quickSignals = signalsData.filter(s => s.TRADING_SIGNAL !== 0);
    const reversals = identifySignalReversals(signalsData);
    
    return {
        scalping_signals: quickSignals.length,
        reversal_count: reversals.length,
        scalping_quality: reversals.length > 3 ? "Good" : "Limited"
    };
}

function identifyQuickReversals(signalsData: any[]): number {
    let reversals = 0;
    for (let i = 1; i < signalsData.length; i++) {
        const current = signalsData[i].TRADING_SIGNAL;
        const previous = signalsData[i - 1].TRADING_SIGNAL;
        if (current !== 0 && previous !== 0 && current !== previous) {
            reversals++;
        }
    }
    return reversals;
}

function analyzeScalpingTiming(signalsData: any[]): any {
    const signalDurations = calculateSignalDurations(signalsData);
    const avgDuration = signalDurations.length > 0 ? 
        signalDurations.reduce((sum, dur) => sum + dur, 0) / signalDurations.length : 0;
    
    return {
        avg_signal_duration: avgDuration > 0 ? `${Math.round(avgDuration)} hours` : "Unknown",
        short_signals: signalDurations.filter(d => d < 4).length,
        scalping_suitability: avgDuration < 6 ? "High" : "Medium"
    };
}

function analyzeMomentumSignals(signalsData: any[]): any {
    const consecutiveSignals = findConsecutiveSignals(signalsData);
    const strongMomentum = consecutiveSignals.filter(seq => seq.length >= 3);
    
    return {
        momentum_sequences: strongMomentum.length,
        longest_sequence: Math.max(...consecutiveSignals.map(seq => seq.length), 0),
        momentum_quality: strongMomentum.length > 2 ? "Strong" : "Weak"
    };
}

function analyzeTrendContinuation(signalsData: any[]): any {
    const trends = identifyTrends(signalsData);
    const continuations = trends.filter(trend => trend.length >= 4);
    
    return {
        trend_continuations: continuations.length,
        avg_trend_length: trends.length > 0 ? 
            trends.reduce((sum, trend) => sum + trend.length, 0) / trends.length : 0,
        continuation_strength: continuations.length > 1 ? "Strong" : "Weak"
    };
}

function assessMomentumStrength(signalsData: any[]): string {
    const recentSignals = signalsData.slice(-5);
    const strongSignals = recentSignals.filter(s => Math.abs(s.TRADING_SIGNAL) === 1);
    
    if (strongSignals.length >= 4) return "Very Strong";
    if (strongSignals.length >= 3) return "Strong";
    if (strongSignals.length >= 2) return "Moderate";
    return "Weak";
}

function assessSignalReliability(signalsData: any[]): string {
    if (!signalsData || signalsData.length === 0) return "No data";
    
    const signalChanges = countSignalChanges(signalsData);
    const consistency = 1 - (signalChanges / signalsData.length);
    
    if (consistency > 0.8) return "High";
    if (consistency > 0.6) return "Medium";
    return "Low";
}

function analyzeSignalTiming(signalsData: any[], analysisType: string): any {
    const hourlyDistribution = analyzeHourlyDistribution(signalsData);
    const peakHours = identifyPeakSignalHours(signalsData);
    
    return {
        peak_signal_hours: peakHours,
        hourly_distribution: hourlyDistribution,
        timing_recommendation: generateTimingRecommendation(peakHours, analysisType),
        best_trading_windows: identifyBestTradingWindows(signalsData)
    };
}

// Helper functions
function identifyActivePeriods(signalsData: any[]): string[] {
    // Simplified implementation
    return signalsData.length > 10 ? ["Active throughout period"] : ["Limited activity"];
}

function identifyBestTimes(signals: any[]): string[] {
    if (signals.length === 0) return ["No data"];
    return ["Market hours", "High volume periods"];
}

function calculateAverageStrength(signals: any[]): string {
    const avgSignal = signals.reduce((sum, s) => sum + Math.abs(s.TRADING_SIGNAL || 0), 0) / signals.length;
    return avgSignal > 0.7 ? "Strong" : "Moderate";
}

function identifySignalReversals(signalsData: any[]): any[] {
    const reversals = [];
    for (let i = 1; i < signalsData.length; i++) {
        const current = signalsData[i].TRADING_SIGNAL;
        const previous = signalsData[i - 1].TRADING_SIGNAL;
        if (current !== 0 && previous !== 0 && current !== previous) {
            reversals.push({ index: i, from: previous, to: current });
        }
    }
    return reversals;
}

function calculateSignalDurations(signalsData: any[]): number[] {
    // Simplified implementation - returns array of durations in hours
    return signalsData.map(() => Math.random() * 12 + 1); // Placeholder
}

function findConsecutiveSignals(signalsData: any[]): any[][] {
    const sequences = [];
    let currentSequence = [];
    let lastSignal = null;
    
    for (const signal of signalsData) {
        if (signal.TRADING_SIGNAL === lastSignal && signal.TRADING_SIGNAL !== 0) {
            currentSequence.push(signal);
        } else {
            if (currentSequence.length > 1) {
                sequences.push([...currentSequence]);
            }
            currentSequence = [signal];
        }
        lastSignal = signal.TRADING_SIGNAL;
    }
    
    if (currentSequence.length > 1) {
        sequences.push(currentSequence);
    }
    
    return sequences;
}

function identifyTrends(signalsData: any[]): any[][] {
    // Simplified trend identification
    return findConsecutiveSignals(signalsData);
}

function countSignalChanges(signalsData: any[]): number {
    let changes = 0;
    for (let i = 1; i < signalsData.length; i++) {
        if (signalsData[i].TRADING_SIGNAL !== signalsData[i - 1].TRADING_SIGNAL) {
            changes++;
        }
    }
    return changes;
}

function analyzeHourlyDistribution(signalsData: any[]): any {
    const hourCounts: Record<number, number> = {};
    
    signalsData.forEach(signal => {
        const date = new Date(signal.TIMESTAMP || signal.DATE);
        const hour = date.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    return hourCounts;
}

function identifyPeakSignalHours(signalsData: any[]): number[] {
    const distribution = analyzeHourlyDistribution(signalsData);
    const sortedHours = Object.entries(distribution)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([hour]) => parseInt(hour));
    
    return sortedHours;
}

function generateTimingRecommendation(peakHours: number[], analysisType: string): string {
    if (peakHours.length === 0) return "Monitor throughout trading hours";
    
    const hoursStr = peakHours.join(", ");
    switch (analysisType) {
        case "scalping":
            return `Focus on hours ${hoursStr} for highest signal frequency`;
        case "active_trading":
            return `Peak activity during hours ${hoursStr} - ideal for active trading`;
        case "momentum":
            return `Momentum signals strongest during hours ${hoursStr}`;
        default:
            return `Most signals occur during hours ${hoursStr}`;
    }
}

function identifyBestTradingWindows(signalsData: any[]): string[] {
    const peakHours = identifyPeakSignalHours(signalsData);
    return peakHours.length > 0 ? 
        [`${peakHours[0]}:00-${peakHours[0] + 2}:00`, "High volume periods"] : 
        ["Standard trading hours"];
} 
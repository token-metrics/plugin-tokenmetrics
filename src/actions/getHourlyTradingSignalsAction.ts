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
import type { HourlyTradingSignalsResponse, HourlyTradingSignalsRequest } from "../types";

/**
 * Hourly Trading Signals Action - Based on TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/hourly-trading-signals
 * 
 * This action provides AI-generated hourly trading signals for cryptocurrency positions.
 * Provides more frequent signal updates compared to daily trading signals for active trading.
 */
export const getHourlyTradingSignalsAction: Action = {
    name: "getHourlyTradingSignals",
    description: "Get AI-generated hourly trading signals for cryptocurrencies with frequent updates for active trading",
    similes: [
        "get hourly trading signals",
        "get hourly AI signals",
        "check hourly buy sell signals",
        "get hourly trading recommendations",
        "hourly AI trading signals",
        "frequent trading signals",
        "get hourly entry exit points",
        "active trading signals"
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
                user: "{{agent}}",
                content: {
                    text: "I'll get the latest hourly trading signals for Bitcoin from TokenMetrics AI.",
                    action: "GET_HOURLY_TRADING_SIGNALS"
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
                user: "{{agent}}",
                content: {
                    text: "I'll retrieve hourly bullish trading signals for active trading opportunities.",
                    action: "GET_HOURLY_TRADING_SIGNALS"
                }
            }
        ]
    ],
    validate: async (_runtime, _message) => {
        return true;
    },
    
    async handler(_runtime, message, _state) {
        // Extract and validate parameters
        const content = message.content as any;
        let { 
            token_id, 
            symbol, 
            signal, 
            startDate, 
            endDate, 
            category, 
            exchange, 
            marketcap, 
            volume, 
            fdv, 
            limit = 20, 
            page = 1 
        } = content;

        // For hourly trading signals, token_id is REQUIRED by the API
        // If only symbol is provided, we need to convert it to token_id
        let finalTokenId: number | undefined = typeof token_id === 'number' ? token_id : undefined;
        let finalSymbol: string | undefined = typeof symbol === 'string' ? symbol : undefined;

        if (!finalTokenId && finalSymbol) {
            // Map common symbols to their token_ids for hourly trading signals
            const symbolToTokenId: Record<string, number> = {
                'BTC': 3375,
                'ETH': 1027,
                'SOL': 5426,
                'ADA': 2010,
                'DOT': 6636,
                'MATIC': 3890,
                'AVAX': 5805,
                'LINK': 1975,
                'UNI': 7083,
                'ATOM': 3794
            };
            
            const upperSymbol = finalSymbol.toUpperCase();
            if (symbolToTokenId[upperSymbol]) {
                finalTokenId = symbolToTokenId[upperSymbol];
                console.log(`Converted symbol ${upperSymbol} to token_id ${finalTokenId} for hourly trading signals`);
            } else {
                throw new Error(`Hourly trading signals require token_id. Please provide token_id directly or use a supported symbol (BTC, ETH, SOL, ADA, DOT, MATIC, AVAX, LINK, UNI, ATOM)`);
            }
        }

        if (!finalTokenId) {
            throw new Error("Hourly trading signals endpoint requires token_id parameter. Please provide either token_id or a supported symbol (BTC, ETH, SOL, etc.)");
        }

        try {
            // Build request parameters - token_id is REQUIRED for hourly trading signals
            const requestParams: HourlyTradingSignalsRequest = {
                token_id: finalTokenId,  // Required parameter
                symbol: finalSymbol,     // Optional, for reference
                signal: typeof signal === 'number' ? signal : undefined,
                startDate: typeof startDate === 'string' ? startDate : undefined,
                endDate: typeof endDate === 'string' ? endDate : undefined,
                category: typeof category === 'string' ? category : undefined,
                exchange: typeof exchange === 'string' ? exchange : undefined,
                marketcap: typeof marketcap === 'number' ? marketcap : undefined,
                volume: typeof volume === 'number' ? volume : undefined,
                fdv: typeof fdv === 'number' ? fdv : undefined,
                
                // Pagination
                limit: typeof limit === 'number' ? limit : 20,
                page: typeof page === 'number' ? page : 1
            };
            
            // Validate parameters according to API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Hourly trading signals request params:", JSON.stringify(apiParams, null, 2));
            
            // Make API call
            const response = await callTokenMetricsApi<HourlyTradingSignalsResponse>(
                TOKENMETRICS_ENDPOINTS.hourlyTradingSignals,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<HourlyTradingSignalsResponse>(response, "getHourlyTradingSignals");
            const hourlySignals = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the hourly trading signals
            const signalsAnalysis = analyzeHourlyTradingSignals(hourlySignals);
            
            return {
                success: true,
                message: `Successfully retrieved ${hourlySignals.length} hourly trading signals from TokenMetrics AI`,
                hourly_trading_signals: hourlySignals,
                analysis: signalsAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.hourlyTradingSignals,
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
                    data_points: hourlySignals.length,
                    api_version: "v2",
                    data_source: "TokenMetrics AI Hourly Signals",
                    update_frequency: "Hourly"
                },
                signals_explanation: {
                    signal_values: {
                        "1": "Bullish/Long signal - AI recommends buying or holding position",
                        "-1": "Bearish/Short signal - AI recommends short position or selling",
                        "0": "No signal - AI sees neutral conditions"
                    },
                    field_name: "TRADING_SIGNAL",
                    hourly_advantages: [
                        "More frequent signal updates for active trading",
                        "Better timing for short-term positions",
                        "Captures intraday market movements",
                        "Ideal for scalping and day trading strategies"
                    ],
                    usage_guidelines: [
                        "Monitor signals throughout the trading day",
                        "Use for short-term position adjustments",
                        "Combine with daily signals for confirmation",
                        "Consider market volatility and volume"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getHourlyTradingSignalsAction:", error);
            
            // Provide specific error information
            let errorMessage = "Failed to retrieve hourly trading signals from TokenMetrics API";
            let troubleshootingInfo = {};
            
            if (error instanceof Error) {
                if (error.message.includes("404")) {
                    errorMessage = "Hourly trading signals endpoint not found - this may indicate an API version issue";
                    troubleshootingInfo = {
                        endpoint_issue: "The /v2/hourly-trading-signals endpoint returned 404",
                        possible_causes: [
                            "API endpoint URL may have changed",
                            "Your API subscription may not include hourly trading signals",
                            "Token parameters may be invalid"
                        ],
                        suggested_solutions: [
                            "Verify your TokenMetrics subscription includes hourly signals",
                            "Check if the token_id or symbol exists in TokenMetrics database",
                            "Try with a major token like BTC (token_id: 3375) or ETH (symbol: ETH)"
                        ]
                    };
                } else if (error.message.includes("Data not found")) {
                    errorMessage = "No hourly trading signals found for the specified token";
                    troubleshootingInfo = {
                        data_issue: "No hourly signals available",
                        possible_reasons: [
                            "Token may not have hourly signal coverage",
                            "Date range may be outside available data",
                            "Signal filters may be too restrictive"
                        ],
                        suggestions: [
                            "Try a broader date range",
                            "Remove signal type filters",
                            "Check with popular tokens like BTC or ETH"
                        ]
                    };
                } else if (error.message.includes("401") || error.message.includes("403")) {
                    errorMessage = "Authentication failed for TokenMetrics API";
                    troubleshootingInfo = {
                        auth_issue: "API key authentication failed",
                        solutions: [
                            "Verify TOKENMETRICS_API_KEY environment variable is set",
                            "Check if your API key has access to hourly trading signals",
                            "Ensure your subscription is active"
                        ]
                    };
                }
            }
            
            return {
                success: false,
                error: errorMessage,
                troubleshooting: troubleshootingInfo,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.hourlyTradingSignals,
                    attempted_params: {
                        token: finalSymbol || finalTokenId,
                        signal_filter: signal
                    }
                }
            };
        }
    }
};

/**
 * Analyze hourly trading signals data
 */
function analyzeHourlyTradingSignals(signalsData: any[]): any {
    if (!Array.isArray(signalsData) || signalsData.length === 0) {
        return {
            summary: "No hourly trading signals data available for analysis",
            signal_distribution: {},
            hourly_trends: {},
            recommendations: []
        };
    }

    const distribution = analyzeHourlySignalDistribution(signalsData);
    const trends = analyzeHourlyTrends(signalsData);
    const opportunities = identifyHourlyOpportunities(signalsData);
    const quality = assessHourlySignalQuality(signalsData);

    return {
        summary: `Analyzed ${signalsData.length} hourly trading signals`,
        signal_distribution: distribution,
        hourly_trends: trends,
        best_opportunities: opportunities,
        signal_quality: quality,
        insights: generateHourlySignalInsights(signalsData, distribution, trends, opportunities),
        recommendations: generateHourlyTradingRecommendations(distribution, trends, opportunities, quality),
        risk_factors: identifyHourlyRiskFactors(signalsData),
        active_trading_tips: [
            "Monitor signals every hour during active trading sessions",
            "Use stop-losses for all positions based on hourly signals",
            "Consider market volatility when acting on hourly signals",
            "Combine with volume analysis for better timing"
        ]
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
import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    formatTokenMetricsNumber,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { MarketMetricsResponse, MarketMetricsRequest } from "../types";

/**
 * Action to get market metrics from TokenMetrics.
 * This action provides comprehensive market analytics including the crucial
 * bullish/bearish market indicator that helps assess overall crypto market sentiment.
 * 
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/market-metrics
 * 
 * The market metrics include:
 * - LAST_TM_GRADE_SIGNAL: TokenMetrics' bullish/bearish market indicator
 * - TOTAL_CRYPTO_MCAP: Total cryptocurrency market capitalization
 * - Market sentiment analysis and directional signals
 * - Historical market analytics for trend analysis
 * 
 * This indicator provides insight into the full crypto market and helps traders
 * understand current market conditions and make informed decisions about
 * overall portfolio allocation and market timing.
 */
export const getMarketMetricsAction: Action = {
    name: "getMarketMetrics",
    description: "Get TokenMetrics market analytics including bullish/bearish market indicator and total crypto market cap insights",
    similes: [
        "get market metrics",
        "check market sentiment",
        "get market analytics",
        "bullish bearish indicator",
        "get market direction",
        "crypto market analysis",
        "market sentiment analysis",
        "overall market trends"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            // Extract parameters from the message content
            const messageContent = message.content as any;
            
            // Build request parameters for the real TokenMetrics market-metrics endpoint
            const requestParams: MarketMetricsRequest = {
                // Date range parameters for historical market analysis
                start_date: typeof messageContent.start_date === 'string' ? messageContent.start_date : undefined,
                end_date: typeof messageContent.end_date === 'string' ? messageContent.end_date : undefined,
                
                // Pagination for large datasets
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : undefined,
            };
            
            // Validate all parameters according to TokenMetrics API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters for the API request
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Fetching market metrics from TokenMetrics v2/market-metrics endpoint");
            
            // Make the API call to the real TokenMetrics market-metrics endpoint
            const response = await callTokenMetricsApi<MarketMetricsResponse>(
                TOKENMETRICS_ENDPOINTS.marketMetrics,
                apiParams,
                "GET"
            );
            
            // Format the response data for consistent structure
            const formattedData = formatTokenMetricsResponse<MarketMetricsResponse>(response, "getMarketMetrics");
            
            // Process the real API response structure
            const marketMetrics = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the market metrics to provide strategic insights
            const marketAnalysis = analyzeMarketMetrics(marketMetrics);
            
            // Return comprehensive market analysis with actionable insights
            return {
                success: true,
                message: `Successfully retrieved market metrics for ${marketMetrics.length} time periods`,
                market_metrics: marketMetrics,
                analysis: marketAnalysis,
                // Include current market status for immediate decision-making
                current_market_status: getCurrentMarketStatus(marketMetrics),
                // Include metadata about the request
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.marketMetrics,
                    date_range: {
                        start: requestParams.start_date,
                        end: requestParams.end_date
                    },
                    data_points: marketMetrics.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                // Provide educational context about TokenMetrics market indicators
                indicator_explanation: {
                    LAST_TM_GRADE_SIGNAL: {
                        description: "TokenMetrics' proprietary market sentiment indicator",
                        values: {
                            "positive": "Bullish market conditions - favorable for increased crypto exposure",
                            "negative": "Bearish market conditions - consider defensive positioning",
                            "neutral": "Mixed market signals - maintain current allocation"
                        }
                    },
                    TOTAL_CRYPTO_MCAP: "Total market capitalization of the entire cryptocurrency market",
                    usage_guidelines: [
                        "Use as a macro filter for individual token decisions",
                        "Consider position sizing based on market signal strength",
                        "Combine with individual token analysis for optimal results",
                        "Monitor signal changes for timing major portfolio adjustments"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getMarketMetricsAction:", error);
            
            // Return detailed error information with troubleshooting guidance
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred while fetching market metrics",
                message: "Failed to retrieve market metrics from TokenMetrics API",
                // Include helpful troubleshooting steps for the real endpoint
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/market-metrics is accessible",
                    parameter_validation: [
                        "Check that date ranges are in YYYY-MM-DD format",
                        "Ensure your API key has access to market metrics endpoint",
                        "Verify your subscription includes market analytics access"
                    ],
                    common_solutions: [
                        "Try requesting current data without date filters",
                        "Check if your subscription includes market metrics access",
                        "Verify TokenMetrics API service status",
                        "Ensure you're not exceeding rate limits"
                    ]
                }
            };
        }
    },
    
    /**
     * Validate that the runtime environment supports market metrics access.
     * Market metrics may require specific subscription levels.
     */
    validate: async (runtime, _message) => {
        const apiKey = runtime.getSetting("TOKENMETRICS_API_KEY");
        if (!apiKey) {
            console.warn("TokenMetrics API key not found. Please set TOKENMETRICS_API_KEY environment variable.");
            return false;
        }
        return true;
    },
    
    /**
     * Examples showing different ways to use the market metrics endpoint.
     * These examples reflect real TokenMetrics API usage patterns.
     */
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What's the current crypto market sentiment?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll check the current TokenMetrics market metrics to assess overall cryptocurrency market sentiment.",
                    action: "GET_MARKET_METRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me market analytics for the past 30 days",
                    start_date: "2024-12-01",
                    end_date: "2024-12-31"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve TokenMetrics market analytics for December 2024 to analyze recent trends.",
                    action: "GET_MARKET_METRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Is the crypto market bullish or bearish right now?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the latest TokenMetrics market indicator to determine current market direction.",
                    action: "GET_MARKET_METRICS"
                }
            }
        ]
    ],
};

/**
 * Comprehensive analysis function for market metrics from TokenMetrics.
 * This function processes real API response data and transforms it into actionable
 * strategic insights for portfolio management and market timing decisions.
 * 
 * @param marketData - Array of market metrics data from TokenMetrics API
 * @returns Strategic analysis with market sentiment insights and recommendations
 */
function analyzeMarketMetrics(marketData: any[]): any {
    if (!marketData || marketData.length === 0) {
        return {
            summary: "No market metrics data available for analysis",
            current_sentiment: "Unknown",
            trend_analysis: "Insufficient data",
            strategic_implications: []
        };
    }
    
    // Sort data by date to ensure chronological analysis
    const sortedData = marketData.sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
    
    // Get current and recent metrics for trend analysis
    const currentMetrics = sortedData[sortedData.length - 1];
    const recentMetrics = sortedData.slice(-10); // Last 10 data points for trend analysis
    
    // Analyze signal distribution and market trends
    const signalAnalysis = analyzeSignalDistribution(sortedData);
    const trendAnalysis = analyzeTrendPatterns(recentMetrics);
    const marketCapAnalysis = analyzeMarketCapTrends(sortedData);
    
    // Generate strategic insights based on TokenMetrics analysis
    const strategicImplications = generateStrategicImplications(currentMetrics, trendAnalysis, signalAnalysis);
    
    // Assess market strength and confidence levels
    const marketStrength = assessMarketStrength(signalAnalysis, marketCapAnalysis);
    
    return {
        summary: `TokenMetrics market analysis shows ${getCurrentSentimentDescription(currentMetrics.LAST_TM_GRADE_SIGNAL)} sentiment with ${trendAnalysis.trend_direction} trend`,
        
        current_sentiment: {
            signal: currentMetrics.LAST_TM_GRADE_SIGNAL,
            description: getCurrentSentimentDescription(currentMetrics.LAST_TM_GRADE_SIGNAL),
            date: currentMetrics.DATE,
            total_market_cap: formatTokenMetricsNumber(currentMetrics.TOTAL_CRYPTO_MCAP, 'currency'),
            confidence_level: marketStrength.confidence
        },
        
        trend_analysis: {
            direction: trendAnalysis.trend_direction,
            consistency: trendAnalysis.consistency,
            recent_changes: trendAnalysis.recent_changes,
            volatility: trendAnalysis.volatility
        },
        
        signal_distribution: {
            bullish_periods: signalAnalysis.bullish_count,
            bearish_periods: signalAnalysis.bearish_count,
            neutral_periods: signalAnalysis.neutral_count,
            bullish_percentage: signalAnalysis.bullish_percentage,
            signal_stability: signalAnalysis.stability_score
        },
        
        market_cap_trends: marketCapAnalysis,
        
        strategic_implications: strategicImplications,
        
        market_strength_assessment: marketStrength,
        
        // Provide actionable recommendations based on current conditions
        recommendations: generateMarketRecommendations(currentMetrics, trendAnalysis, marketStrength),
        
        // Include risk considerations
        risk_factors: identifyRiskFactors(trendAnalysis, signalAnalysis),
        
        data_quality: {
            source: "TokenMetrics Official API",
            data_points: sortedData.length,
            date_range: {
                start: sortedData[0]?.DATE,
                end: sortedData[sortedData.length - 1]?.DATE
            },
            reliability: "High - TokenMetrics proprietary analysis"
        }
    };
}

// Helper functions for market metrics analysis

function getCurrentSentimentDescription(signal: number): string {
    if (signal > 0) return "Bullish";
    if (signal < 0) return "Bearish"; 
    return "Neutral";
}

function getCurrentMarketStatus(data: any[]): any {
    if (!data || data.length === 0) {
        return { status: "Unknown", reason: "No data available" };
    }
    
    const latestData = data[data.length - 1];
    const signal = latestData.LAST_TM_GRADE_SIGNAL;
    
    let recommendation;
    if (signal > 0) {
        recommendation = "Consider increasing crypto allocation - favorable market conditions";
    } else if (signal < 0) {
        recommendation = "Consider defensive positioning - unfavorable market conditions";
    } else {
        recommendation = "Maintain current allocation - mixed market signals";
    }
    
    return {
        signal: signal,
        description: getCurrentSentimentDescription(signal),
        market_cap: formatTokenMetricsNumber(latestData.TOTAL_CRYPTO_MCAP, 'currency'),
        date: latestData.DATE,
        recommendation: recommendation
    };
}

function analyzeSignalDistribution(data: any[]): any {
    const bullishCount = data.filter(d => d.LAST_TM_GRADE_SIGNAL > 0).length;
    const bearishCount = data.filter(d => d.LAST_TM_GRADE_SIGNAL < 0).length;
    const neutralCount = data.filter(d => d.LAST_TM_GRADE_SIGNAL === 0).length;
    const totalCount = data.length;
    
    const bullishPercentage = (bullishCount / totalCount) * 100;
    
    // Calculate signal stability (fewer changes = more stable)
    let signalChanges = 0;
    for (let i = 1; i < data.length; i++) {
        if (data[i].LAST_TM_GRADE_SIGNAL !== data[i-1].LAST_TM_GRADE_SIGNAL) {
            signalChanges++;
        }
    }
    const stabilityScore = Math.max(0, 100 - (signalChanges / totalCount * 100));
    
    return {
        bullish_count: bullishCount,
        bearish_count: bearishCount,
        neutral_count: neutralCount,
        bullish_percentage: bullishPercentage.toFixed(1),
        stability_score: stabilityScore.toFixed(1),
        signal_changes: signalChanges
    };
}

function analyzeTrendPatterns(recentData: any[]): any {
    if (recentData.length < 3) {
        return {
            trend_direction: "Insufficient data",
            consistency: 0,
            recent_changes: 0,
            volatility: "Unknown"
        };
    }
    
    const signals = recentData.map(d => d.LAST_TM_GRADE_SIGNAL);
    
    // Count recent signal changes
    let recentChanges = 0;
    for (let i = 1; i < signals.length; i++) {
        if (signals[i] !== signals[i-1]) {
            recentChanges++;
        }
    }
    
    // Determine trend direction
    const recentBullish = signals.filter(s => s > 0).length;
    const recentBearish = signals.filter(s => s < 0).length;
    
    let trendDirection;
    if (recentBullish > recentBearish * 1.5) {
        trendDirection = "Predominantly Bullish";
    } else if (recentBearish > recentBullish * 1.5) {
        trendDirection = "Predominantly Bearish";
    } else {
        trendDirection = "Mixed/Neutral";
    }
    
    // Calculate consistency
    const consistency = ((signals.length - recentChanges) / signals.length) * 100;
    
    // Assess volatility
    const volatility = recentChanges >= signals.length * 0.4 ? "High" : 
                     recentChanges >= signals.length * 0.2 ? "Moderate" : "Low";
    
    return {
        trend_direction: trendDirection,
        consistency: consistency.toFixed(1),
        recent_changes: recentChanges,
        volatility: volatility
    };
}

function analyzeMarketCapTrends(data: any[]): any {
    if (data.length < 2) return { trend: "Insufficient data", change: 0 };
    
    const sortedData = data.sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
    const startCap = sortedData[0].TOTAL_CRYPTO_MCAP;
    const endCap = sortedData[sortedData.length - 1].TOTAL_CRYPTO_MCAP;
    
    const change = ((endCap - startCap) / startCap) * 100;
    
    let trend;
    if (change > 10) trend = "Strong Growth";
    else if (change > 2) trend = "Moderate Growth";
    else if (change > -2) trend = "Stable";
    else if (change > -10) trend = "Moderate Decline";
    else trend = "Strong Decline";
    
    return {
        trend: trend,
        change_percentage: change.toFixed(2),
        start_market_cap: formatTokenMetricsNumber(startCap, 'currency'),
        end_market_cap: formatTokenMetricsNumber(endCap, 'currency')
    };
}

function generateStrategicImplications(currentMetrics: any, trendAnalysis: any, signalAnalysis: any): string[] {
    const implications = [];
    
    // Current signal implications
    if (currentMetrics.LAST_TM_GRADE_SIGNAL > 0) {
        implications.push("TokenMetrics bullish signal suggests favorable conditions for crypto investments");
        implications.push("Consider gradually increasing portfolio allocation to cryptocurrencies");
    } else if (currentMetrics.LAST_TM_GRADE_SIGNAL < 0) {
        implications.push("TokenMetrics bearish signal indicates potential market headwinds");
        implications.push("Consider reducing risk exposure or taking profits on existing positions");
    }
    
    // Trend consistency implications
    if (parseFloat(trendAnalysis.consistency) > 80) {
        implications.push("High trend consistency suggests reliable signal direction from TokenMetrics");
    } else if (parseFloat(trendAnalysis.consistency) < 50) {
        implications.push("Low trend consistency indicates uncertain market conditions");
        implications.push("Consider waiting for clearer TokenMetrics signals before major position changes");
    }
    
    // Market volatility implications
    if (trendAnalysis.volatility === "High") {
        implications.push("High signal volatility suggests rapidly changing market conditions");
        implications.push("Use smaller position sizes and maintain flexibility in strategy");
    }
    
    return implications;
}

function assessMarketStrength(signalAnalysis: any, marketCapAnalysis: any): any {
    let strengthScore = 50; // Base score
    
    // Adjust based on signal distribution
    const bullishPercentage = parseFloat(signalAnalysis.bullish_percentage);
    if (bullishPercentage > 70) strengthScore += 20;
    else if (bullishPercentage < 30) strengthScore -= 20;
    
    // Adjust based on stability
    const stability = parseFloat(signalAnalysis.stability_score);
    strengthScore += (stability - 50) * 0.3;
    
    // Adjust based on market cap trend
    const capChange = parseFloat(marketCapAnalysis.change_percentage || "0");
    if (capChange > 10) strengthScore += 15;
    else if (capChange < -10) strengthScore -= 15;
    
    strengthScore = Math.max(0, Math.min(100, strengthScore));
    
    let confidence;
    if (strengthScore > 75) confidence = "High";
    else if (strengthScore > 50) confidence = "Moderate";
    else if (strengthScore > 25) confidence = "Low";
    else confidence = "Very Low";
    
    return {
        score: strengthScore.toFixed(1),
        confidence: confidence,
        factors: {
            signal_distribution: bullishPercentage > 60 ? "Positive" : bullishPercentage < 40 ? "Negative" : "Neutral",
            trend_stability: stability > 70 ? "Stable" : "Unstable",
            market_cap_trend: capChange > 5 ? "Positive" : capChange < -5 ? "Negative" : "Stable"
        }
    };
}

function generateMarketRecommendations(currentMetrics: any, trendAnalysis: any, marketStrength: any): string[] {
    const recommendations = [];
    const signal = currentMetrics.LAST_TM_GRADE_SIGNAL;
    const confidence = marketStrength.confidence;
    
    // Primary signal-based recommendations
    if (signal > 0 && confidence !== "Very Low") {
        recommendations.push("TokenMetrics bullish signal suggests considering increased crypto allocation");
        recommendations.push("Focus on established cryptocurrencies with strong fundamentals");
    } else if (signal < 0 && confidence !== "Very Low") {
        recommendations.push("TokenMetrics bearish signal suggests reducing position sizes or taking profits");
        recommendations.push("Maintain cash reserves for potential buying opportunities");
    }
    
    // Confidence-based recommendations
    if (confidence === "Low" || confidence === "Very Low") {
        recommendations.push("Exercise caution due to low TokenMetrics signal confidence");
        recommendations.push("Wait for stronger, more consistent signals before major portfolio moves");
    }
    
    // Volatility-based recommendations
    if (trendAnalysis.volatility === "High") {
        recommendations.push("High market volatility - use dollar-cost averaging to reduce timing risk");
        recommendations.push("Consider tighter risk management due to increased market uncertainty");
    }
    
    // Universal recommendations
    recommendations.push("Always maintain proper diversification across asset classes");
    recommendations.push("Monitor TokenMetrics market indicators regularly for signal changes");
    
    return recommendations;
}

function identifyRiskFactors(trendAnalysis: any, signalAnalysis: any): string[] {
    const risks = [];
    
    if (trendAnalysis.volatility === "High") {
        risks.push("High TokenMetrics signal volatility indicates unstable market conditions");
    }
    
    if (parseFloat(trendAnalysis.consistency) < 60) {
        risks.push("Low trend consistency suggests unpredictable market behavior");
    }
    
    if (trendAnalysis.recent_changes >= 3) {
        risks.push("Frequent recent signal changes indicate high market uncertainty");
    }
    
    if (parseFloat(signalAnalysis.stability_score) < 50) {
        risks.push("Low overall signal stability suggests choppy market conditions");
    }
    
    // Add general market risks
    risks.push("Cryptocurrency markets remain highly volatile and speculative");
    risks.push("External factors (regulation, macro events) can override technical signals");
    
    return risks;
}
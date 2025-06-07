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
 * CORRECTED Market Metrics Action - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/market-metrics
 * 
 * This action provides comprehensive market analytics including the crucial bullish/bearish 
 * market indicator that helps assess overall crypto market sentiment.
 * According to the API docs, it provides insight into the full crypto market including 
 * the Bullish/Bearish Market indicator, which is TokenMetrics' proprietary market assessment.
 */
export const getMarketMetricsAction: Action = {
    name: "getMarketMetrics",
    description: "Get TokenMetrics market analytics including bullish/bearish market indicator and total crypto market insights",
    similes: [
        "get market metrics",
        "check market sentiment",
        "get market analytics",
        "bullish bearish indicator",
        "get market direction",
        "crypto market analysis",
        "market sentiment analysis"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // CORRECTED: Build parameters based on actual API documentation
            const requestParams: MarketMetricsRequest = {
                // CORRECTED: Use startDate/endDate as shown in actual API docs (not start_date/end_date)
                startDate: typeof messageContent.startDate === 'string' ? messageContent.startDate : 
                          typeof messageContent.start_date === 'string' ? messageContent.start_date : undefined,
                endDate: typeof messageContent.endDate === 'string' ? messageContent.endDate :
                        typeof messageContent.end_date === 'string' ? messageContent.end_date : undefined,
                
                // CORRECTED: Use page instead of offset for pagination
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : 50,
                page: typeof messageContent.page === 'number' ? messageContent.page : 1
            };
            
            // Validate parameters according to actual API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            
            // Make API call with corrected authentication (x-api-key header)
            const response = await callTokenMetricsApi<MarketMetricsResponse>(
                TOKENMETRICS_ENDPOINTS.marketMetrics,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<MarketMetricsResponse>(response, "getMarketMetrics");
            const marketMetrics = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the market metrics to provide strategic insights
            const marketAnalysis = analyzeMarketMetrics(marketMetrics);
            
            return {
                success: true,
                message: `Successfully retrieved market metrics for ${marketMetrics.length} time periods`,
                market_metrics: marketMetrics,
                analysis: marketAnalysis,
                // Include current market status for immediate decision-making
                current_market_status: getCurrentMarketStatus(marketMetrics),
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.marketMetrics,
                    date_range: {
                        start: requestParams.startDate,
                        end: requestParams.endDate
                    },
                    pagination: {
                        page: requestParams.page,
                        limit: requestParams.limit
                    },
                    data_points: marketMetrics.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                // Provide educational context about TokenMetrics market indicators
                market_indicators_explanation: {
                    bullish_bearish_indicator: {
                        description: "TokenMetrics' proprietary market sentiment indicator providing insight into overall crypto market direction",
                        interpretation: {
                            "positive_values": "Bullish market conditions - favorable for increased crypto exposure",
                            "negative_values": "Bearish market conditions - consider defensive positioning",
                            "near_zero": "Neutral market signals - maintain current allocation"
                        }
                    },
                    total_crypto_market_cap: "Comprehensive measure of the entire cryptocurrency market valuation",
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
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve market metrics from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/market-metrics is accessible",
                    parameter_validation: [
                        "Check that date parameters use startDate/endDate format (YYYY-MM-DD)",
                        "Ensure page and limit parameters are positive integers",
                        "Verify your API key has access to market metrics endpoint"
                    ],
                    common_solutions: [
                        "Try requesting current data without date filters",
                        "Check if your subscription includes market analytics access", 
                        "Verify TokenMetrics API service status",
                        "Ensure you're not exceeding rate limits"
                    ]
                }
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
                    startDate: "2024-12-01",
                    endDate: "2024-12-31"
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
 * The analysis focuses on understanding market sentiment trends, signal strength,
 * and providing actionable recommendations for different market conditions.
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
    
    // Sort data chronologically to ensure proper trend analysis
    const sortedData = marketData.sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
    
    // Get current and recent metrics for trend analysis
    const currentMetrics = sortedData[sortedData.length - 1];
    const recentMetrics = sortedData.slice(-10); // Last 10 data points for trend analysis
    
    // Analyze signal distribution and market trends
    const signalAnalysis = analyzeSignalDistribution(sortedData);
    const trendAnalysis = analyzeTrendPatterns(recentMetrics);
    const strengthAssessment = assessMarketStrength(signalAnalysis, trendAnalysis);
    
    // Generate strategic insights based on TokenMetrics analysis
    const strategicImplications = generateStrategicImplications(currentMetrics, trendAnalysis, signalAnalysis);
    
    return {
        summary: `TokenMetrics market analysis shows ${getCurrentSentimentDescription(currentMetrics)} sentiment with ${trendAnalysis.trend_direction} trend over recent periods`,
        
        current_sentiment: {
            indicator_value: currentMetrics.LAST_TM_GRADE_SIGNAL || 'N/A',
            description: getCurrentSentimentDescription(currentMetrics),
            date: currentMetrics.DATE,
            total_market_cap: currentMetrics.TOTAL_CRYPTO_MCAP ? 
                formatTokenMetricsNumber(currentMetrics.TOTAL_CRYPTO_MCAP, 'currency') : 'N/A',
            confidence_level: strengthAssessment.confidence
        },
        
        trend_analysis: {
            direction: trendAnalysis.trend_direction,
            consistency: trendAnalysis.consistency,
            recent_changes: trendAnalysis.recent_changes,
            strength: trendAnalysis.strength
        },
        
        signal_distribution: {
            bullish_periods: signalAnalysis.bullish_count,
            bearish_periods: signalAnalysis.bearish_count,
            neutral_periods: signalAnalysis.neutral_count,
            bullish_percentage: signalAnalysis.bullish_percentage,
            signal_stability: signalAnalysis.stability_score
        },
        
        market_strength_assessment: strengthAssessment,
        
        strategic_implications: strategicImplications,
        
        // Provide actionable recommendations based on current conditions
        recommendations: generateMarketRecommendations(currentMetrics, trendAnalysis, strengthAssessment),
        
        // Include risk considerations for portfolio management
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

/**
 * This function determines the current market sentiment based on TokenMetrics' indicator.
 * The sentiment description helps translate numerical values into actionable insights.
 */
function getCurrentSentimentDescription(metrics: any): string {
    if (!metrics || metrics.LAST_TM_GRADE_SIGNAL === undefined || metrics.LAST_TM_GRADE_SIGNAL === null) {
        return "Neutral/Unknown";
    }
    
    const signal = metrics.LAST_TM_GRADE_SIGNAL;
    
    // Interpret the signal value - this may need adjustment based on actual API response format
    if (signal > 0.5) return "Bullish";
    if (signal < -0.5) return "Bearish";
    return "Neutral";
}

/**
 * This function provides immediate market status for quick decision making.
 * It focuses on the most recent data point and provides clear actionable guidance.
 */
function getCurrentMarketStatus(data: any[]): any {
    if (!data || data.length === 0) {
        return { 
            status: "Unknown", 
            reason: "No data available",
            recommendation: "Cannot provide guidance without market data"
        };
    }
    
    // Get the most recent data point
    const latestData = data[data.length - 1];
    const signal = latestData.LAST_TM_GRADE_SIGNAL;
    
    let recommendation;
    let status = getCurrentSentimentDescription(latestData);
    
    if (status === "Bullish") {
        recommendation = "Consider increasing crypto allocation - TokenMetrics indicates favorable market conditions";
    } else if (status === "Bearish") {
        recommendation = "Consider defensive positioning - TokenMetrics indicates unfavorable market conditions";
    } else {
        recommendation = "Maintain current allocation - TokenMetrics shows mixed market signals";
    }
    
    return {
        status: status,
        signal_value: signal,
        market_cap: latestData.TOTAL_CRYPTO_MCAP ? 
            formatTokenMetricsNumber(latestData.TOTAL_CRYPTO_MCAP, 'currency') : 'N/A',
        date: latestData.DATE,
        recommendation: recommendation,
        confidence: signal !== undefined && signal !== null ? "Available" : "Limited"
    };
}

/**
 * This function analyzes how bullish/bearish signals are distributed over time.
 * Understanding signal distribution helps assess the reliability and consistency of market direction.
 */
function analyzeSignalDistribution(data: any[]): any {
    // Count different signal types based on TokenMetrics indicator values
    const signals = data.map(d => d.LAST_TM_GRADE_SIGNAL).filter(s => s !== null && s !== undefined);
    
    if (signals.length === 0) {
        return {
            bullish_count: 0,
            bearish_count: 0,
            neutral_count: 0,
            bullish_percentage: "0",
            stability_score: "0"
        };
    }
    
    const bullishCount = signals.filter(s => s > 0).length;
    const bearishCount = signals.filter(s => s < 0).length;
    const neutralCount = signals.filter(s => s === 0).length;
    const totalCount = signals.length;
    
    const bullishPercentage = (bullishCount / totalCount) * 100;
    
    // Calculate signal stability (fewer changes = more stable)
    let signalChanges = 0;
    for (let i = 1; i < data.length; i++) {
        const current = getCurrentSentimentDescription(data[i]);
        const previous = getCurrentSentimentDescription(data[i-1]);
        if (current !== previous) {
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

/**
 * This function analyzes recent trend patterns to understand market momentum.
 * Trend analysis helps identify whether conditions are improving or deteriorating.
 */
function analyzeTrendPatterns(recentData: any[]): any {
    if (recentData.length < 3) {
        return {
            trend_direction: "Insufficient data",
            consistency: 0,
            recent_changes: 0,
            strength: "Unknown"
        };
    }
    
    const signals = recentData.map(d => d.LAST_TM_GRADE_SIGNAL).filter(s => s !== null && s !== undefined);
    
    if (signals.length < 3) {
        return {
            trend_direction: "Insufficient signal data",
            consistency: 0,
            recent_changes: 0,
            strength: "Unknown"
        };
    }
    
    // Calculate trend direction based on signal progression
    const firstHalf = signals.slice(0, Math.floor(signals.length / 2));
    const secondHalf = signals.slice(Math.floor(signals.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, s) => sum + s, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, s) => sum + s, 0) / secondHalf.length;
    
    const trendChange = secondHalfAvg - firstHalfAvg;
    
    let trendDirection;
    if (trendChange > 0.1) trendDirection = "Improving";
    else if (trendChange < -0.1) trendDirection = "Declining";
    else trendDirection = "Stable";
    
    // Count recent directional changes
    let recentChanges = 0;
    const sentiments = recentData.map(d => getCurrentSentimentDescription(d));
    for (let i = 1; i < sentiments.length; i++) {
        if (sentiments[i] !== sentiments[i-1]) {
            recentChanges++;
        }
    }
    
    // Calculate consistency
    const consistency = ((sentiments.length - recentChanges) / sentiments.length) * 100;
    
    // Assess trend strength
    const strength = Math.abs(trendChange) > 0.2 ? "Strong" : 
                    Math.abs(trendChange) > 0.1 ? "Moderate" : "Weak";
    
    return {
        trend_direction: trendDirection,
        consistency: consistency.toFixed(1),
        recent_changes: recentChanges,
        strength: strength,
        trend_value: trendChange.toFixed(3)
    };
}

/**
 * This function assesses overall market strength based on signal analysis and trends.
 * Market strength assessment helps determine confidence levels for investment decisions.
 */
function assessMarketStrength(signalAnalysis: any, trendAnalysis: any): any {
    let strengthScore = 50; // Base score
    
    // Adjust based on signal distribution
    const bullishPercentage = parseFloat(signalAnalysis.bullish_percentage);
    if (bullishPercentage > 70) strengthScore += 20;
    else if (bullishPercentage < 30) strengthScore -= 20;
    
    // Adjust based on signal stability
    const stability = parseFloat(signalAnalysis.stability_score);
    strengthScore += (stability - 50) * 0.3;
    
    // Adjust based on trend consistency
    const consistency = parseFloat(trendAnalysis.consistency);
    strengthScore += (consistency - 50) * 0.2;
    
    // Adjust based on trend direction
    if (trendAnalysis.trend_direction === "Improving") strengthScore += 10;
    else if (trendAnalysis.trend_direction === "Declining") strengthScore -= 10;
    
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
            trend_direction: trendAnalysis.trend_direction
        }
    };
}

/**
 * This function generates strategic implications based on market analysis.
 * Strategic implications help translate market signals into portfolio decisions.
 */
function generateStrategicImplications(currentMetrics: any, trendAnalysis: any, signalAnalysis: any): string[] {
    const implications = [];
    
    // Current signal implications
    const currentSentiment = getCurrentSentimentDescription(currentMetrics);
    if (currentSentiment === "Bullish") {
        implications.push("TokenMetrics bullish signal suggests favorable conditions for crypto investments");
        implications.push("Consider gradually increasing portfolio allocation to cryptocurrencies");
    } else if (currentSentiment === "Bearish") {
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
    
    // Trend direction implications
    if (trendAnalysis.trend_direction === "Improving") {
        implications.push("Improving trend suggests market conditions are becoming more favorable");
    } else if (trendAnalysis.trend_direction === "Declining") {
        implications.push("Declining trend indicates deteriorating market conditions");
    }
    
    return implications;
}

/**
 * This function generates specific market recommendations based on the analysis.
 * Recommendations are designed to be actionable for different investment strategies.
 */
function generateMarketRecommendations(currentMetrics: any, trendAnalysis: any, strengthAssessment: any): string[] {
    const recommendations = [];
    const currentSentiment = getCurrentSentimentDescription(currentMetrics);
    const confidence = strengthAssessment.confidence;
    
    // Primary signal-based recommendations
    if (currentSentiment === "Bullish" && confidence !== "Very Low") {
        recommendations.push("TokenMetrics bullish signal supports considering increased crypto allocation");
        recommendations.push("Focus on established cryptocurrencies with strong fundamentals");
    } else if (currentSentiment === "Bearish" && confidence !== "Very Low") {
        recommendations.push("TokenMetrics bearish signal suggests reducing position sizes or taking profits");
        recommendations.push("Maintain cash reserves for potential buying opportunities");
    }
    
    // Confidence-based recommendations
    if (confidence === "Low" || confidence === "Very Low") {
        recommendations.push("Exercise caution due to low TokenMetrics signal confidence");
        recommendations.push("Wait for stronger, more consistent signals before major portfolio moves");
    }
    
    // Trend-based recommendations
    if (trendAnalysis.trend_direction === "Improving") {
        recommendations.push("Improving trend supports gradual position building strategies");
    } else if (trendAnalysis.trend_direction === "Declining") {
        recommendations.push("Declining trend suggests defensive positioning and profit-taking");
    }
    
    // Universal recommendations
    recommendations.push("Always maintain proper diversification across asset classes");
    recommendations.push("Monitor TokenMetrics market indicators regularly for signal changes");
    recommendations.push("Combine market metrics with individual token analysis for optimal results");
    
    return recommendations;
}

/**
 * This function identifies potential risk factors in the current market environment.
 * Understanding risks helps inform position sizing and risk management decisions.
 */
function identifyRiskFactors(trendAnalysis: any, signalAnalysis: any): string[] {
    const risks = [];
    
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
    risks.push("Market indicators are analytical tools, not guarantees of future performance");
    
    return risks;
}
import type { Action, ActionExample, ActionResult, HandlerCallback, IAgentRuntime, Memory, State } from "@elizaos/core";
import { elizaLogger, composePromptFromState, parseKeyValueXml, ModelType, createActionResult } from "@elizaos/core";
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

/**
 * TokenMetrics Market Metrics Action - Migrated to ElizaOS 1.x
 */

// Template for extracting market metrics information (Updated to XML format)
const marketMetricsTemplate = `Extract market metrics request information from the message.

Market metrics provide comprehensive market analysis including:
- Overall market trends and sentiment
- Market capitalization data
- Volume analysis and liquidity metrics
- Price movement patterns
- Market dominance statistics
- Fear & Greed index
- Market volatility measurements

Instructions:
Look for MARKET METRICS requests, such as:
- General market analysis ("What's the market doing?", "How's the crypto market?")
- Market cap queries ("Total crypto market cap", "Market capitalization analysis")
- Volume analysis ("Market volume trends", "Trading volume analysis")
- Market sentiment ("Market sentiment today", "Fear and greed index")
- Market trends ("Market trend analysis", "Overall market performance")
- Date range requests ("Market metrics from 2025-03-02 to 2025-06-02", "Show market data between March and June")

EXAMPLES:
- "How's the crypto market performing today?" → analysis_type: "general"
- "What's the total market cap?" → metrics_requested: "cap"
- "Show me market volume trends" → analysis_type: "volume"
- "Get market sentiment analysis" → analysis_type: "sentiment"
- "Market metrics overview" → analysis_type: "general"
- "Current market trends" → analysis_type: "trends"
- "Show market metrics from 2025-03-02 to 2025-06-02" → start_date: "2025-03-02", end_date: "2025-06-02"
- "Market data between March 1 and June 30, 2025" → start_date: "2025-03-01", end_date: "2025-06-30"

IMPORTANT: Extract date ranges if mentioned in formats like:
- "from YYYY-MM-DD to YYYY-MM-DD"
- "between DATE and DATE" 
- "from March to June" (convert to YYYY-MM-DD format)

Respond with an XML block containing only the extracted values:

<response>
<analysis_type>general or sentiment or volume or trends or dominance</analysis_type>
<timeframe>hourly or daily or weekly or monthly</timeframe>
<market_focus>total or defi or layer1 or altcoins or all</market_focus>
<metrics_requested>cap, volume, sentiment, trends, volatility, or all</metrics_requested>
<comparison_period>24h or 7d or 30d or 1y or none</comparison_period>
<start_date>YYYY-MM-DD format if date range mentioned</start_date>
<end_date>YYYY-MM-DD format if date range mentioned</end_date>
</response>`;

// Zod schema for market metrics requests  
const MarketMetricsRequestSchema = z.object({
    analysis_type: z.string().optional().describe("Type of analysis requested"),
    timeframe: z.string().optional().describe("Time frame for analysis"),
    market_focus: z.string().optional().describe("Market focus area"),
    metrics_requested: z.string().optional().describe("Specific metrics requested"),
    comparison_period: z.string().optional().describe("Comparison period"),
    start_date: z.string().optional().describe("Start date in YYYY-MM-DD format"),
    end_date: z.string().optional().describe("End date in YYYY-MM-DD format"),
    limit: z.number().min(1).max(100).optional().describe("Number of data points to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysis_focus: z.array(z.enum([
        "market_sentiment", 
        "trend_analysis", 
        "strategic_insights", 
        "current_status"
    ])).optional().describe("Types of analysis to focus on")
});

type MarketMetricsRequest = z.infer<typeof MarketMetricsRequestSchema>;

// Handler function
const handler = async (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
    _options?: any,
    callback?: HandlerCallback
): Promise<ActionResult> => {
    elizaLogger.info("🏢 Starting TokenMetrics Market Metrics Action");
    
    try {
        // Extract request using AI with user message injection
        const userMessage = message.content?.text || "";
        const enhancedTemplate = marketMetricsTemplate + `

USER MESSAGE: "${userMessage}"
Please analyze the CURRENT user message above and extract the relevant information.`;
        
        const extractedRequest = await extractTokenMetricsRequest<MarketMetricsRequest>(
            runtime,
            message,
            state || await runtime.composeState(message),
            enhancedTemplate,
            MarketMetricsRequestSchema,
            generateRequestId()
        );
        
        elizaLogger.info("📊 Extracted market metrics request:", extractedRequest);
        
        // Apply defaults for optional fields
        const processedRequest = {
            start_date: extractedRequest.start_date,
            end_date: extractedRequest.end_date,
            limit: extractedRequest.limit || 50,
            page: extractedRequest.page || 1,
            analysis_focus: extractedRequest.analysis_focus || ["current_status"]
        };
        
        // Build API parameters
        const apiParams: Record<string, any> = {
            limit: processedRequest.limit,
            page: processedRequest.page
        };
        
        // Add date parameters if provided
        if (processedRequest.start_date) {
            apiParams.startDate = processedRequest.start_date;
        }
        if (processedRequest.end_date) {
            apiParams.endDate = processedRequest.end_date;
        }
        
        // Call TokenMetrics API
        const response = await callTokenMetricsAPI(
            "/v2/market-metrics",
            apiParams,
            runtime
        );
        
        if (!response || (response.error && !response.data)) {
            throw new Error(response?.error || "Failed to fetch market metrics data");
        }
        
        const marketMetrics = Array.isArray(response) ? response : response.data || [];
        
        // Analyze the market metrics
        const marketAnalysis = analyzeMarketMetrics(marketMetrics);
        const currentStatus = getCurrentMarketStatus(marketMetrics);
        
        // Format response based on analysis focus
        let responseText = "📊 **TokenMetrics Market Analytics**\n\n";
        
        if (processedRequest.analysis_focus.includes("current_status")) {
            responseText += `🎯 **Current Market Status**: ${currentStatus.sentiment_description}\n`;
            responseText += `📈 **Market Direction**: ${currentStatus.direction}\n`;
            responseText += `💪 **Signal Strength**: ${currentStatus.strength}/10\n\n`;
        }
        
        if (processedRequest.analysis_focus.includes("market_sentiment")) {
            responseText += `🔍 **Market Sentiment Analysis**:\n`;
            responseText += `• Bullish/Bearish Indicator: ${marketAnalysis.overall_sentiment}\n`;
            responseText += `• Confidence Level: ${marketAnalysis.confidence_level}%\n`;
            responseText += `• Market Phase: ${marketAnalysis.market_phase}\n\n`;
        }
        
        if (processedRequest.analysis_focus.includes("trend_analysis")) {
            responseText += `📈 **Trend Analysis**:\n`;
            responseText += `• Primary Trend: ${marketAnalysis.trend_direction}\n`;
            responseText += `• Trend Strength: ${marketAnalysis.trend_strength}\n`;
            responseText += `• Momentum: ${marketAnalysis.momentum}\n\n`;
        }
        
        if (processedRequest.analysis_focus.includes("strategic_insights")) {
            responseText += `💡 **Strategic Insights**:\n`;
            if (marketAnalysis.strategic_implications) {
                marketAnalysis.strategic_implications.forEach((insight: string, index: number) => {
                    responseText += `${index + 1}. ${insight}\n`;
                });
            }
            responseText += "\n";
        }
        
        // Add key metrics summary
        responseText += `📋 **Key Metrics Summary**:\n`;
        responseText += `• Data Points Analyzed: ${marketMetrics.length}\n`;
        responseText += `• Total Crypto Market Cap: ${formatCurrency(marketMetrics[0]?.TOTAL_CRYPTO_MCAP || 0)}\n`;
        responseText += `• High-Grade Coins: ${formatPercentage(marketMetrics[0]?.TM_GRADE_PERC_HIGH_COINS || 0)}%\n`;
        responseText += `• Current Signal: ${getSignalDescription(marketMetrics[0]?.TM_GRADE_SIGNAL || 0)}\n`;
        responseText += `• Previous Signal: ${getSignalDescription(marketMetrics[0]?.LAST_TM_GRADE_SIGNAL || 0)}\n`;
        
        // Add recommendations
        if (marketAnalysis.recommendations && marketAnalysis.recommendations.length > 0) {
            responseText += `\n🎯 **Recommendations**:\n`;
            marketAnalysis.recommendations.forEach((rec: string, index: number) => {
                responseText += `${index + 1}. ${rec}\n`;
            });
        }
        
        // Use callback pattern
        if (callback) {
            callback({
                text: responseText,
                content: {
                    success: true,
                    data: {
                        market_metrics: marketMetrics,
                        analysis: marketAnalysis,
                        current_status: currentStatus,
                        metadata: {
                            endpoint: "/v2/market-metrics",
                            data_points: marketMetrics.length,
                            analysis_focus: processedRequest.analysis_focus,
                            date_range: {
                                start: processedRequest.start_date,
                                end: processedRequest.end_date
                            }
                        }
                    }
                }
            });
        }
        
        return createActionResult({
            success: true,
            text: responseText,
            data: {
                market_metrics: marketMetrics,
                analysis: marketAnalysis,
                source: "TokenMetrics Market Analytics"
            }
        });
        
    } catch (error) {
        elizaLogger.error("❌ Error in market metrics handler:", error);
        
        const errorText = `❌ Unable to fetch market metrics: ${error instanceof Error ? error.message : 'Unknown error'}`;
        
        if (callback) {
            await callback({
                text: errorText,
                content: { error: "Market metrics fetch failed" }
            });
        }
        
        return createActionResult({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Helper function to describe signals
function getSignalDescription(signal: number): string {
    switch (signal) {
        case 1: return "🟢 Bullish";
        case -1: return "🔴 Bearish";
        case 0: return "🟡 Neutral";
        default: return "❓ Unknown";
    }
}

// Validation function
const validate = async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    elizaLogger.log("🔍 Validating getMarketMetricsAction (1.x)");
    
    try {
        validateAndGetApiKey(runtime);
        return true;
    } catch (error) {
        elizaLogger.error("❌ Validation failed:", error);
        return false;
    }
};

// Action examples for training
const examples: ActionExample[][] = [
    [
        {
            name: "{{user1}}",
            content: {
                text: "What's the current crypto market sentiment?"
            }
        },
        {
            name: "{{agent}}",
            content: {
                text: "I'll analyze the current crypto market sentiment using TokenMetrics market metrics.",
                action: "GET_MARKET_METRICS_TOKENMETRICS"
            }
        }
    ],
    [
        {
            name: "{{user1}}",
            content: {
                text: "Show me market trends analysis"
            }
        },
        {
            name: "{{agent}}",
            content: {
                text: "Let me fetch comprehensive market trends analysis from TokenMetrics.",
                action: "GET_MARKET_METRICS_TOKENMETRICS"
            }
        }
    ],
    [
        {
            name: "{{user1}}",
            content: {
                text: "Is the market bullish or bearish right now?"
            }
        },
        {
            name: "{{agent}}",
            content: {
                text: "I'll check the current bullish/bearish market indicators for you.",
                action: "GET_MARKET_METRICS_TOKENMETRICS"
            }
        }
    ]
];

// Export the action
export const getMarketMetricsAction: Action = {
    name: "GET_MARKET_METRICS_TOKENMETRICS",
    description: "Get TokenMetrics market analytics including bullish/bearish market indicator and comprehensive market insights",
    similes: [
        "get market metrics",
        "check market sentiment", 
        "get market analytics",
        "bullish bearish indicator",
        "get market direction",
        "crypto market analysis",
        "market sentiment analysis"
    ],
    handler,
    validate,
    examples
};

/**
 * Comprehensive analysis function for market metrics from TokenMetrics.
 * This function processes real API response data and transforms it into actionable
 * insights for crypto market assessment.
 */
function analyzeMarketMetrics(marketData: any[]): any {
    if (!marketData || marketData.length === 0) {
        return {
            overall_sentiment: "Neutral",
            confidence_level: 0,
            market_phase: "Unknown",
            trend_direction: "Sideways",
            trend_strength: "Weak",
            momentum: "Neutral",
            strategic_implications: ["Insufficient data for analysis"],
            recommendations: ["Wait for more market data"]
        };
    }
    
    // Get the most recent data point
    const latestData = marketData[0] || {};
    const recentData = marketData.slice(0, Math.min(7, marketData.length));
    
    // Analyze signal distribution
    const signalAnalysis = analyzeSignalDistribution(marketData);
    
    // Analyze trend patterns
    const trendAnalysis = analyzeTrendPatterns(recentData);
    
    // Assess market strength
    const strengthAssessment = assessMarketStrength(signalAnalysis, trendAnalysis);
    
    // Generate strategic implications
    const strategicImplications = generateStrategicImplications(latestData, trendAnalysis, signalAnalysis);
    
    // Generate recommendations
    const recommendations = generateMarketRecommendations(latestData, trendAnalysis, strengthAssessment);
    
    return {
        overall_sentiment: getCurrentSentimentDescription(latestData),
        confidence_level: Math.round(strengthAssessment.confidence * 100),
        market_phase: strengthAssessment.phase,
        trend_direction: trendAnalysis.primary_direction,
        trend_strength: trendAnalysis.strength,
        momentum: trendAnalysis.momentum,
        market_cap_trend: trendAnalysis.market_cap_trend,
        volatility_level: strengthAssessment.volatility,
        strategic_implications: strategicImplications,
        recommendations: recommendations,
        signal_distribution: signalAnalysis,
        trend_analysis: trendAnalysis,
        strength_assessment: strengthAssessment
    };
}

/**
 * Determines current sentiment description based on market metrics
 */
function getCurrentSentimentDescription(metrics: any): string {
    if (!metrics) return "Neutral";
    
    // Check for bullish/bearish indicators in the data
    const bullishIndicators = metrics.bullish_score || metrics.bullish_indicator || 0;
    const bearishIndicators = metrics.bearish_score || metrics.bearish_indicator || 0;
    
    if (bullishIndicators > bearishIndicators * 1.2) return "Bullish";
    if (bearishIndicators > bullishIndicators * 1.2) return "Bearish";
    return "Neutral";
}

/**
 * Gets current market status with detailed breakdown
 */
function getCurrentMarketStatus(data: any[]): any {
    if (!data || data.length === 0) {
        return {
            sentiment_description: "Unknown",
            direction: "Sideways",
            strength: 5,
            confidence: 0
        };
    }
    
    const latest = data[0];
    const sentiment = getCurrentSentimentDescription(latest);
    
    // Calculate strength based on available metrics
    let strength = 5; // Default neutral
    if (latest.market_strength) {
        strength = Math.round(latest.market_strength * 10);
    } else if (latest.bullish_score && latest.bearish_score) {
        const diff = Math.abs(latest.bullish_score - latest.bearish_score);
        strength = Math.min(10, Math.max(1, Math.round(5 + diff * 5)));
    }
    
    return {
        sentiment_description: sentiment,
        direction: sentiment === "Neutral" ? "Sideways" : sentiment,
        strength: Math.min(10, Math.max(1, strength)),
        confidence: data.length >= 7 ? 0.8 : 0.5,
        last_updated: latest.date || latest.timestamp || new Date().toISOString()
    };
}

/**
 * Analyzes signal distribution across the dataset
 */
function analyzeSignalDistribution(data: any[]): any {
    if (!data || data.length === 0) {
        return {
            bullish_percentage: 50,
            bearish_percentage: 50,
            neutral_percentage: 0,
            signal_consistency: 0,
            dominant_signal: "Neutral"
        };
    }
    
    let bullishCount = 0;
    let bearishCount = 0;
    let neutralCount = 0;
    
    data.forEach(item => {
        const sentiment = getCurrentSentimentDescription(item);
        if (sentiment === "Bullish") bullishCount++;
        else if (sentiment === "Bearish") bearishCount++;
        else neutralCount++;
    });
    
    const total = data.length;
    const bullishPct = Math.round((bullishCount / total) * 100);
    const bearishPct = Math.round((bearishCount / total) * 100);
    const neutralPct = Math.round((neutralCount / total) * 100);
    
    // Determine dominant signal
    let dominantSignal = "Neutral";
    if (bullishPct > bearishPct && bullishPct > neutralPct) dominantSignal = "Bullish";
    else if (bearishPct > bullishPct && bearishPct > neutralPct) dominantSignal = "Bearish";
    
    // Calculate consistency (how often the dominant signal appears)
    const consistency = Math.max(bullishPct, bearishPct, neutralPct) / 100;
    
    return {
        bullish_percentage: bullishPct,
        bearish_percentage: bearishPct,
        neutral_percentage: neutralPct,
        signal_consistency: Math.round(consistency * 100),
        dominant_signal: dominantSignal
    };
}

/**
 * Analyzes trend patterns in recent data
 */
function analyzeTrendPatterns(recentData: any[]): any {
    if (!recentData || recentData.length < 2) {
        return {
            primary_direction: "Sideways",
            strength: "Weak",
            momentum: "Neutral",
            market_cap_trend: "Stable"
        };
    }
    
    // Analyze price/market cap trends if available
    const values = recentData.map(item => 
        item.total_market_cap || item.market_cap || item.price || 0
    ).filter(val => val > 0);
    
    if (values.length < 2) {
        return {
            primary_direction: "Sideways",
            strength: "Weak", 
            momentum: "Neutral",
            market_cap_trend: "Stable"
        };
    }
    
    // Calculate trend direction
    const first = values[values.length - 1]; // Oldest
    const last = values[0]; // Most recent
    const change = ((last - first) / first) * 100;
    
    let direction = "Sideways";
    let strength = "Weak";
    let momentum = "Neutral";
    
    if (Math.abs(change) > 5) {
        direction = change > 0 ? "Upward" : "Downward";
        strength = Math.abs(change) > 15 ? "Strong" : "Moderate";
    }
    
    // Analyze momentum (recent vs earlier changes)
    if (values.length >= 4) {
        const recentChange = ((values[0] - values[1]) / values[1]) * 100;
        const earlierChange = ((values[2] - values[3]) / values[3]) * 100;
        
        if (Math.abs(recentChange) > Math.abs(earlierChange) * 1.2) {
            momentum = "Accelerating";
        } else if (Math.abs(recentChange) < Math.abs(earlierChange) * 0.8) {
            momentum = "Decelerating";
        }
    }
    
    return {
        primary_direction: direction,
        strength: strength,
        momentum: momentum,
        market_cap_trend: direction === "Sideways" ? "Stable" : direction,
        change_percentage: Math.round(change * 100) / 100
    };
}

/**
 * Assesses overall market strength
 */
function assessMarketStrength(signalAnalysis: any, trendAnalysis: any): any {
    const signalStrength = signalAnalysis.signal_consistency / 100;
    const trendStrength = trendAnalysis.strength === "Strong" ? 0.8 : 
                         trendAnalysis.strength === "Moderate" ? 0.6 : 0.4;
    
    const overallStrength = (signalStrength + trendStrength) / 2;
    
    let phase = "Consolidation";
    if (overallStrength > 0.7) phase = "Trending";
    else if (overallStrength < 0.4) phase = "Uncertain";
    
    let volatility = "Medium";
    if (trendAnalysis.change_percentage && Math.abs(trendAnalysis.change_percentage) > 10) {
        volatility = "High";
    } else if (trendAnalysis.change_percentage && Math.abs(trendAnalysis.change_percentage) < 3) {
        volatility = "Low";
    }
    
    return {
        confidence: overallStrength,
        phase: phase,
        volatility: volatility,
        overall_score: Math.round(overallStrength * 10)
    };
}

/**
 * Generates strategic implications based on analysis
 */
function generateStrategicImplications(currentMetrics: any, trendAnalysis: any, signalAnalysis: any): string[] {
    const implications: string[] = [];
    
    // Market direction implications
    if (signalAnalysis.dominant_signal === "Bullish" && signalAnalysis.signal_consistency > 60) {
        implications.push("Strong bullish sentiment suggests favorable conditions for crypto exposure");
    } else if (signalAnalysis.dominant_signal === "Bearish" && signalAnalysis.signal_consistency > 60) {
        implications.push("Bearish sentiment indicates defensive positioning may be prudent");
    } else {
        implications.push("Mixed signals suggest maintaining balanced portfolio allocation");
    }
    
    // Trend implications
    if (trendAnalysis.primary_direction === "Upward" && trendAnalysis.strength === "Strong") {
        implications.push("Strong upward trend supports momentum-based strategies");
    } else if (trendAnalysis.primary_direction === "Downward" && trendAnalysis.strength === "Strong") {
        implications.push("Strong downward trend suggests waiting for reversal signals");
    }
    
    // Momentum implications
    if (trendAnalysis.momentum === "Accelerating") {
        implications.push("Accelerating momentum may indicate trend continuation");
    } else if (trendAnalysis.momentum === "Decelerating") {
        implications.push("Decelerating momentum suggests potential trend reversal");
    }
    
    return implications.length > 0 ? implications : ["Market conditions require careful monitoring"];
}

/**
 * Generates market recommendations
 */
function generateMarketRecommendations(currentMetrics: any, trendAnalysis: any, strengthAssessment: any): string[] {
    const recommendations: string[] = [];
    
    // Based on market phase
    if (strengthAssessment.phase === "Trending") {
        recommendations.push("Consider trend-following strategies with appropriate risk management");
    } else if (strengthAssessment.phase === "Consolidation") {
        recommendations.push("Range-bound strategies may be more effective in current conditions");
    } else {
        recommendations.push("Exercise caution and wait for clearer market signals");
    }
    
    // Based on volatility
    if (strengthAssessment.volatility === "High") {
        recommendations.push("High volatility requires smaller position sizes and tighter stops");
    } else if (strengthAssessment.volatility === "Low") {
        recommendations.push("Low volatility environment may favor larger position sizes");
    }
    
    // Based on confidence
    if (strengthAssessment.confidence > 0.7) {
        recommendations.push("High confidence signals support more aggressive positioning");
    } else if (strengthAssessment.confidence < 0.4) {
        recommendations.push("Low confidence suggests conservative approach until clarity improves");
    }
    
    return recommendations.length > 0 ? recommendations : ["Monitor market conditions closely before making major decisions"];
}

/**
 * Identifies potential risk factors
 */
function identifyRiskFactors(trendAnalysis: any, signalAnalysis: any): string[] {
    const risks: string[] = [];
    
    if (signalAnalysis.signal_consistency < 50) {
        risks.push("Low signal consistency increases uncertainty");
    }
    
    if (trendAnalysis.momentum === "Decelerating") {
        risks.push("Decelerating momentum may signal trend exhaustion");
    }
    
    if (signalAnalysis.neutral_percentage > 40) {
        risks.push("High neutral signals indicate market indecision");
    }
    
    return risks.length > 0 ? risks : ["No significant risk factors identified"];
}
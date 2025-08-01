import type { Action, ActionResult } from "@elizaos/core";
import {
    type IAgentRuntime,
    type Memory,
    type State,
    type HandlerCallback,
    elizaLogger,
    createActionResult
} from "@elizaos/core";
import { z } from "zod";
import {
    validateAndGetApiKey,
    extractTokenMetricsRequest,
    callTokenMetricsAPI,
    formatCurrency,
    formatPercentage,
    generateRequestId
} from "./aiActionHelper";

// Zod schema for moonshot tokens request validation
const MoonshotTokensRequestSchema = z.object({
    limit: z.number().min(1).max(100).optional().describe("Number of moonshot tokens to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    type: z.enum(["active", "past", "all"]).optional().describe("Type of moonshot tokens to fetch"),
    analysisType: z.enum(["market_trends", "breakout_potential", "ai_picks", "all"]).optional().describe("Type of analysis to focus on")
});

type MoonshotTokensRequest = z.infer<typeof MoonshotTokensRequestSchema>;

// AI extraction template for natural language processing
const MOONSHOT_TOKENS_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting moonshot tokens and market trend requests from natural language.

IMPORTANT: This API provides AI-curated token picks with high breakout potential, market trends, and sentiment-like insights.
When users ask for "market sentiment" or "trending tokens", they get moonshot tokens with breakout potential analysis.

The user wants to get AI-curated token picks and market trend insights. Extract the following information:

1. **limit** (optional, default: 50): Number of moonshot tokens to return
   - Look for phrases like "top 10", "show me 20", "get 50 tokens"
   - 50 = default, 100 = maximum

2. **page** (optional, default: 1): Page number for pagination

3. **type** (optional, default: "active"): What type of moonshot tokens they want
   - "active" - currently active moonshot picks
   - "past" - historical moonshot picks
   - "all" - all moonshot picks

4. **analysisType** (optional, default: "all"): What type of analysis they want
   - "market_trends" - focus on overall market trends and momentum
   - "breakout_potential" - focus on tokens with high breakout potential
   - "ai_picks" - focus on AI-curated recommendations
   - "all" - comprehensive analysis across all factors

Examples:
- "Get market sentiment" → {analysisType: "market_trends"}
- "Show me trending tokens" → {analysisType: "market_trends"}
- "What tokens have breakout potential?" → {analysisType: "breakout_potential"}
- "Get AI token recommendations" → {analysisType: "ai_picks"}
- "Show me moonshot tokens" → {analysisType: "all"}
- "Market trends for the past week" → {type: "all", analysisType: "market_trends"}

Extract the request details from the user's message and respond in XML format:

<response>
<limit>number of tokens to return</limit>
<page>page number for pagination</page>
<type>active|past|all</type>
<analysisType>market_trends|breakout_potential|ai_picks|all</analysisType>
</response>
`;

/**
 * MOONSHOT TOKENS ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/moonshot-tokens
 * 
 * This action gets AI-curated token picks with high breakout potential, providing market trends
 * and sentiment-like insights. Replaces the non-existent sentiment endpoint.
 */
export const getMoonshotTokensAction: Action = {
    name: "GET_MOONSHOT_TOKENS_TOKENMETRICS",
    description: "Get AI-curated moonshot tokens with high breakout potential and market trend insights from TokenMetrics (includes sentiment-like analysis)",
    similes: [
        "get sentiment",
        "market sentiment", 
        "sentiment analysis",
        "market trends",
        "trending tokens",
        "moonshot tokens",
        "breakout potential",
        "ai recommendations",
        "market momentum",
        "hot tokens",
        "rising tokens",
        "market picks",
        "get moonshot tokens",
        "show moonshot picks"
    ],
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Get market sentiment"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll analyze market trends and show you AI-curated tokens with high breakout potential.",
                    action: "GET_MOONSHOT_TOKENS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Show me trending tokens"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll get the trending moonshot tokens with high market momentum.",
                    action: "GET_MOONSHOT_TOKENS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "What tokens have breakout potential?"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll find AI-curated tokens with the highest breakout potential.",
                    action: "GET_MOONSHOT_TOKENS_TOKENMETRICS"
                }
            }
        ]
    ],
    
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<ActionResult> => {
        try {
            const requestId = generateRequestId();
            console.log(`[${requestId}] Processing moonshot tokens request...`);
            
            // Ensure we have a proper state
            if (!state) {
                state = await runtime.composeState(message);
            }
            
            // Extract structured request using AI with user message injection
            const userMessage = message.content?.text || "";
            
            // Inject user message directly into template
            const enhancedTemplate = MOONSHOT_TOKENS_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;

            const moonshotRequest = await extractTokenMetricsRequest<MoonshotTokensRequest>(
                runtime,
                message,
                state,
                enhancedTemplate,
                MoonshotTokensRequestSchema,
                requestId
            );
            
            console.log(`[${requestId}] Extracted request:`, moonshotRequest);
            
            // Apply defaults for optional fields
            const processedRequest = {
                limit: moonshotRequest?.limit || 50,
                page: moonshotRequest?.page || 1,
                type: moonshotRequest?.type || "active",
                analysisType: moonshotRequest?.analysisType || "all"
            };
            
            // Build API parameters
            const apiParams: Record<string, any> = {
                limit: processedRequest.limit,
                page: processedRequest.page
            };
            
            // Add type filter if specified
            if (processedRequest.type !== "all") {
                apiParams.type = processedRequest.type;
            }
            
            // Make API call
            const response = await callTokenMetricsAPI(
                "/v2/moonshot-tokens",
                apiParams,
                runtime
            );
            
            console.log(`[${requestId}] API response received, processing data...`);
            
            // Process response data
            const moonshotData = Array.isArray(response) ? response : response.data || [];
            
            // Analyze the moonshot data based on requested analysis type
            const moonshotAnalysis = analyzeMoonshotData(moonshotData, processedRequest.analysisType);
            
            const result = {
                success: true,
                message: `Successfully retrieved ${moonshotData.length} moonshot tokens from TokenMetrics`,
                request_id: requestId,
                moonshot_data: moonshotData,
                analysis: moonshotAnalysis,
                metadata: {
                    endpoint: "moonshot-tokens",
                    analysis_focus: processedRequest.analysisType,
                    type_filter: processedRequest.type,
                    pagination: {
                        page: processedRequest.page,
                        limit: processedRequest.limit
                    },
                    data_points: moonshotData.length,
                    api_version: "v2",
                    data_source: "TokenMetrics AI Curation Engine"
                }
            };
            
            // Create formatted response text for user
            let responseText = `🚀 **AI-Curated Moonshot Tokens & Market Trends**\n\n`;
            responseText += `ℹ️ *These are AI-selected tokens with high breakout potential based on grades, sentiment, volume, and on-chain data.*\n\n`;
            
            if (moonshotData.length === 0) {
                responseText += `❌ No moonshot tokens available at the moment.\n\n`;
            } else {
                // Show top moonshot tokens
                responseText += `🎯 **Top ${Math.min(moonshotData.length, 10)} Moonshot Tokens**:\n\n`;
                
                const topTokens = moonshotData.slice(0, 10);
                topTokens.forEach((token: any, index: number) => {
                    const name = token.TOKEN_NAME || "Unknown";
                    const symbol = token.TOKEN_SYMBOL || "N/A";
                    const grade = token.TM_TRADER_GRADE || 0;
                    const priceChange = token.PRICE_CHANGE_PERCENTAGE_7D_IN_CURRENCY || 0;
                    const gradeIcon = grade >= 80 ? "🔥" : grade >= 60 ? "💪" : "📊";
                    const changeIcon = priceChange > 0 ? "📈" : priceChange < 0 ? "📉" : "➡️";
                    
                    responseText += `${index + 1}. ${gradeIcon} **${name}** (${symbol})\n`;
                    responseText += `   • Grade: ${Math.round(grade)}/100\n`;
                    responseText += `   • 7D Change: ${changeIcon} ${formatPercentage(priceChange)}\n`;
                    if (token.MARKET_CAP) {
                        responseText += `   • Market Cap: ${formatCurrency(token.MARKET_CAP)}\n`;
                    }
                    responseText += `\n`;
                });
                
                // Analysis insights
                if (moonshotAnalysis.insights && moonshotAnalysis.insights.length > 0) {
                    responseText += `💡 **Market Insights**:\n`;
                    moonshotAnalysis.insights.slice(0, 3).forEach((insight: string, index: number) => {
                        responseText += `${index + 1}. ${insight}\n`;
                    });
                    responseText += `\n`;
                }
                
                // Trading implications
                if (moonshotAnalysis.trading_implications) {
                    responseText += `📈 **Trading Outlook**: ${moonshotAnalysis.trading_implications.market_bias}\n`;
                    responseText += `🎯 **Opportunity Level**: ${moonshotAnalysis.trading_implications.opportunity_level}\n\n`;
                }
                
                // Risk warning
                responseText += `⚠️ **Risk Warning**: Moonshot tokens are high-risk, high-reward investments. Always do your own research and never invest more than you can afford to lose.\n\n`;
            }
            
            responseText += `📊 Retrieved ${moonshotData.length} AI-curated tokens\n`;
            responseText += `🎯 Analysis focus: ${processedRequest.analysisType}\n`;
            responseText += `📄 Page ${processedRequest.page} (limit: ${processedRequest.limit})`;
            
            console.log(`[${requestId}] Moonshot tokens analysis completed successfully`);
            
            // Use callback to send response to user
            if (callback) {
                await callback({
                    text: responseText,
                    content: {
                        success: true,
                        request_id: requestId,
                        data: result,
                        metadata: {
                            endpoint: "moonshot-tokens",
                            data_source: "TokenMetrics Official API",
                            api_version: "v2"
                        }
                    }
                });
            }
            
            return createActionResult({
                success: true,
                text: responseText,
                data: {
                    moonshot_data: moonshotData,
                    analysis: moonshotAnalysis,
                    source: "TokenMetrics Moonshot API",
                    request_id: requestId
                }
            });
        } catch (error) {
            console.error("Error in getMoonshotTokensAction:", error);
            
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            
            if (callback) {
                await callback({
                    text: `❌ Error fetching moonshot tokens: ${errorMessage}`,
                    content: { 
                        error: errorMessage,
                        error_type: error instanceof Error ? error.constructor.name : 'Unknown',
                        troubleshooting: true
                    }
                });
            }
            
            return createActionResult({
                success: false,
                error: errorMessage
            });
        }
    },
    
    validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        elizaLogger.log("🔍 Validating getMoonshotTokensAction (1.x)");
        
        try {
            validateAndGetApiKey(runtime);
            return true;
        } catch (error) {
            elizaLogger.error("❌ Validation failed:", error);
            return false;
        }
    }
};

/**
 * Analyze moonshot tokens data for market trends and insights
 */
function analyzeMoonshotData(moonshotData: any[], analysisType: string = "all"): any {
    if (!moonshotData || moonshotData.length === 0) {
        return {
            summary: "No moonshot tokens data available for analysis",
            market_sentiment: "Unknown",
            insights: []
        };
    }
    
    // Core analysis
    const gradeAnalysis = analyzeGrades(moonshotData);
    const performanceAnalysis = analyzePerformance(moonshotData);
    const marketAnalysis = analyzeMarketTrends(moonshotData);
    
    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "market_trends":
            focusedAnalysis = {
                market_trends_focus: {
                    trending_direction: marketAnalysis.overall_trend,
                    momentum_level: marketAnalysis.momentum_level,
                    trend_insights: [
                        `📈 Market momentum: ${marketAnalysis.momentum_level}`,
                        `🎯 Trending direction: ${marketAnalysis.overall_trend}`,
                        `💪 Strong performers: ${gradeAnalysis.high_grade_count}`
                    ]
                }
            };
            break;
            
        case "breakout_potential":
            focusedAnalysis = {
                breakout_focus: {
                    high_potential_tokens: identifyBreakoutCandidates(moonshotData),
                    breakout_signals: assessBreakoutSignals(moonshotData),
                    breakout_insights: [
                        `🚀 High-potential tokens: ${identifyBreakoutCandidates(moonshotData).length}`,
                        `📊 Average grade: ${gradeAnalysis.average_grade}`,
                        `💎 Top performers: ${gradeAnalysis.top_performers}`
                    ]
                }
            };
            break;
            
        case "ai_picks":
            focusedAnalysis = {
                ai_picks_focus: {
                    ai_confidence: gradeAnalysis.grade_distribution,
                    recommendation_strength: assessRecommendationStrength(gradeAnalysis),
                    ai_insights: [
                        `🤖 AI confidence level: ${assessRecommendationStrength(gradeAnalysis)}`,
                        `📊 Quality distribution: ${gradeAnalysis.grade_quality}`,
                        `🎯 Success probability: ${calculateSuccessProbability(gradeAnalysis)}`
                    ]
                }
            };
            break;
    }
    
    return {
        summary: `Analysis of ${moonshotData.length} AI-curated moonshot tokens showing ${marketAnalysis.overall_trend} market trend`,
        analysis_type: analysisType,
        market_sentiment: deriveSentimentFromData(gradeAnalysis, performanceAnalysis),
        grade_analysis: gradeAnalysis,
        performance_analysis: performanceAnalysis,
        market_analysis: marketAnalysis,
        insights: generateInsights(gradeAnalysis, performanceAnalysis, marketAnalysis),
        trading_implications: generateTradingImplications(gradeAnalysis, performanceAnalysis, marketAnalysis),
        ...focusedAnalysis,
        data_quality: {
            source: "TokenMetrics AI Curation Engine",
            token_count: moonshotData.length,
            analysis_depth: "Comprehensive with AI scoring",
            reliability: "High - AI-curated selections"
        }
    };
}

// Helper analysis functions
function analyzeGrades(data: any[]): any {
    const grades = data.map(token => token.TM_TRADER_GRADE || 0).filter(g => g > 0);
    const avgGrade = grades.length > 0 ? grades.reduce((sum, g) => sum + g, 0) / grades.length : 0;
    const highGradeCount = grades.filter(g => g >= 80).length;
    const topPerformers = grades.filter(g => g >= 90).length;
    
    return {
        average_grade: Math.round(avgGrade),
        high_grade_count: highGradeCount,
        top_performers: topPerformers,
        grade_quality: avgGrade >= 70 ? "High" : avgGrade >= 50 ? "Medium" : "Low",
        grade_distribution: `${topPerformers} excellent, ${highGradeCount} strong, ${grades.length - highGradeCount} moderate`
    };
}

function analyzePerformance(data: any[]): any {
    const changes = data.map(token => token.PRICE_CHANGE_PERCENTAGE_7D_IN_CURRENCY || 0);
    const positiveChanges = changes.filter(c => c > 0).length;
    const avgChange = changes.length > 0 ? changes.reduce((sum, c) => sum + c, 0) / changes.length : 0;
    
    return {
        average_performance: avgChange,
        positive_performers: positiveChanges,
        performance_ratio: Math.round((positiveChanges / changes.length) * 100),
        performance_trend: avgChange > 5 ? "Strong Positive" : avgChange > 0 ? "Positive" : avgChange > -5 ? "Neutral" : "Negative"
    };
}

function analyzeMarketTrends(data: any[]): any {
    const grades = data.map(token => token.TM_TRADER_GRADE || 0);
    const avgGrade = grades.reduce((sum, g) => sum + g, 0) / grades.length;
    const changes = data.map(token => token.PRICE_CHANGE_PERCENTAGE_7D_IN_CURRENCY || 0);
    const avgChange = changes.reduce((sum, c) => sum + c, 0) / changes.length;
    
    let overallTrend = "Neutral";
    if (avgGrade > 70 && avgChange > 5) overallTrend = "Strongly Bullish";
    else if (avgGrade > 60 && avgChange > 0) overallTrend = "Bullish";
    else if (avgGrade < 40 && avgChange < -5) overallTrend = "Bearish";
    else if (avgChange > 0) overallTrend = "Cautiously Optimistic";
    
    return {
        overall_trend: overallTrend,
        momentum_level: avgChange > 10 ? "High" : avgChange > 0 ? "Moderate" : "Low",
        market_strength: avgGrade > 70 ? "Strong" : avgGrade > 50 ? "Moderate" : "Weak"
    };
}

function identifyBreakoutCandidates(data: any[]): any[] {
    return data.filter(token => 
        (token.TM_TRADER_GRADE || 0) >= 70 && 
        (token.PRICE_CHANGE_PERCENTAGE_7D_IN_CURRENCY || 0) > 0
    ).slice(0, 5);
}

function assessBreakoutSignals(data: any[]): string {
    const strongCandidates = identifyBreakoutCandidates(data);
    return strongCandidates.length > 5 ? "Strong" : strongCandidates.length > 2 ? "Moderate" : "Weak";
}

function assessRecommendationStrength(gradeAnalysis: any): string {
    if (gradeAnalysis.average_grade > 75) return "Very High";
    if (gradeAnalysis.average_grade > 60) return "High";
    if (gradeAnalysis.average_grade > 45) return "Moderate";
    return "Low";
}

function calculateSuccessProbability(gradeAnalysis: any): string {
    const avgGrade = gradeAnalysis.average_grade;
    if (avgGrade > 80) return "High (70-85%)";
    if (avgGrade > 65) return "Good (55-70%)";
    if (avgGrade > 50) return "Moderate (40-55%)";
    return "Low (25-40%)";
}

function deriveSentimentFromData(gradeAnalysis: any, performanceAnalysis: any): string {
    const avgGrade = gradeAnalysis.average_grade;
    const avgPerformance = performanceAnalysis.average_performance;
    
    if (avgGrade > 70 && avgPerformance > 5) return "Very Bullish";
    if (avgGrade > 60 && avgPerformance > 0) return "Bullish";
    if (avgGrade > 50) return "Cautiously Optimistic";
    if (avgGrade > 40) return "Neutral";
    return "Bearish";
}

function generateInsights(gradeAnalysis: any, performanceAnalysis: any, marketAnalysis: any): string[] {
    const insights = [];
    
    if (gradeAnalysis.average_grade > 70) {
        insights.push(`Strong AI confidence with ${gradeAnalysis.average_grade}/100 average grade suggests quality opportunities`);
    }
    
    if (performanceAnalysis.positive_performers > performanceAnalysis.performance_ratio * 0.6) {
        insights.push(`${performanceAnalysis.positive_performers} tokens showing positive momentum indicates healthy market interest`);
    }
    
    if (marketAnalysis.overall_trend.includes("Bullish")) {
        insights.push(`${marketAnalysis.overall_trend} trend supported by ${marketAnalysis.momentum_level.toLowerCase()} momentum levels`);
    }
    
    if (gradeAnalysis.top_performers > 0) {
        insights.push(`${gradeAnalysis.top_performers} tokens with 90+ grades represent premium AI picks with highest conviction`);
    }
    
    return insights;
}

function generateTradingImplications(gradeAnalysis: any, performanceAnalysis: any, marketAnalysis: any): any {
    let marketBias = "Neutral";
    let opportunityLevel = "Moderate";
    
    if (gradeAnalysis.average_grade > 70 && performanceAnalysis.average_performance > 0) {
        marketBias = "Bullish";
        opportunityLevel = "High";
    } else if (gradeAnalysis.average_grade > 60) {
        marketBias = "Cautiously Optimistic";
        opportunityLevel = "Good";
    } else if (gradeAnalysis.average_grade < 40) {
        marketBias = "Defensive";
        opportunityLevel = "Low";
    }
    
    return {
        market_bias: marketBias,
        opportunity_level: opportunityLevel,
        recommended_approach: generateRecommendedApproach(marketBias, opportunityLevel),
        risk_assessment: assessRiskLevel(gradeAnalysis, performanceAnalysis)
    };
}

function generateRecommendedApproach(bias: string, opportunity: string): string {
    if (bias === "Bullish" && opportunity === "High") {
        return "Active position taking with disciplined risk management";
    } else if (bias === "Cautiously Optimistic") {
        return "Selective positioning in highest-grade tokens";
    } else if (bias === "Defensive") {
        return "Wait for better opportunities or focus on top-tier picks only";
    }
    return "Balanced approach with careful token selection";
}

function assessRiskLevel(gradeAnalysis: any, performanceAnalysis: any): string {
    if (gradeAnalysis.average_grade > 75 && performanceAnalysis.performance_ratio > 60) {
        return "Moderate - Strong AI backing reduces risk";
    } else if (gradeAnalysis.average_grade > 60) {
        return "Medium-High - Standard moonshot risk with AI guidance";
    }
    return "High - Higher risk due to lower AI confidence";
}
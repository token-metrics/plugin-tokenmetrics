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
    generateRequestId
} from "./aiActionHelper";
import type { IndicesResponse } from "../types";

// Zod schema for indices request validation
const IndicesRequestSchema = z.object({
    indicesType: z.string().nullable().optional().describe("Type of indices to filter (active, passive, etc.)"),
    limit: z.number().min(1).max(100).optional().describe("Number of indices to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["performance", "risk", "diversification", "all"]).optional().describe("Type of analysis to focus on")
});

type IndicesRequest = z.infer<typeof IndicesRequestSchema>;

// AI extraction template for natural language processing
const INDICES_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting crypto indices analysis requests from natural language.

The user wants to get information about crypto indices. Extract the following information:

1. **indicesType** (optional): Type of indices they're interested in
   - "active" for actively managed indices
   - "passive" for passive/index tracking
   - Leave null for all types

2. **limit** (default: 50): How many indices to return (1-100)

3. **page** (default: 1): Which page of results (for pagination)

4. **analysisType** (default: "all"): What type of analysis they want
   - "performance" - focus on returns and performance metrics
   - "risk" - focus on volatility and risk metrics  
   - "diversification" - focus on portfolio diversification
   - "all" - comprehensive analysis

Examples:
- "Show me crypto indices" → {indicesType: null, limit: 50, page: 1, analysisType: "all"}
- "Get active crypto index funds" → {indicesType: "active", limit: 50, page: 1, analysisType: "all"}
- "What are the best performing passive indices?" → {indicesType: "passive", limit: 50, page: 1, analysisType: "performance"}
- "Show me 20 indices focused on risk analysis" → {indicesType: null, limit: 20, page: 1, analysisType: "risk"}

Extract the request details from the user's message.
`;

/**
 * INDICES ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/indices
 * 
 * This action gets active and passive crypto indices with performance and market data.
 * Essential for understanding index-based investment opportunities and market trends.
 */
export const getIndicesAction: Action = {
    name: "GET_INDICES_TOKENMETRICS",
    description: "Get active and passive crypto indices with performance and market data from TokenMetrics for index-based investment analysis",
    similes: [
        "get indices",
        "crypto indices", 
        "index funds",
        "passive indices",
        "active indices",
        "index performance",
        "crypto index analysis",
        "index investment opportunities"
    ],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me available crypto indices"
                }
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll get the available crypto indices for you, including both active and passive investment options.",
                    action: "GET_INDICES_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What are the best performing crypto index funds?"
                }
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Let me analyze the crypto indices performance data to show you the top performers.",
                    action: "GET_INDICES_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get me active crypto indices with risk analysis"
                }
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll retrieve active crypto indices and provide detailed risk analysis for your investment decisions.",
                    action: "GET_INDICES_TOKENMETRICS"
                }
            }
        ]
    ],
    
    async handler(
        runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> {
        try {
            const requestId = generateRequestId();
            console.log(`[${requestId}] Processing indices request...`);
            
            // Extract structured request using AI
            const indicesRequest = await extractTokenMetricsRequest<IndicesRequest>(
                runtime,
                message,
                state || await runtime.composeState(message),
                INDICES_EXTRACTION_TEMPLATE,
                IndicesRequestSchema,
                requestId
            );
            
            console.log(`[${requestId}] Extracted request:`, indicesRequest);
            
            // Apply defaults for optional fields
            const processedRequest = {
                indicesType: indicesRequest.indicesType,
                limit: indicesRequest.limit || 50,
                page: indicesRequest.page || 1,
                analysisType: indicesRequest.analysisType || "all"
            };
            
            // Build API parameters
            const apiParams: Record<string, any> = {
                limit: processedRequest.limit,
                page: processedRequest.page
            };
            
            // Only add indicesType if it's not null/undefined
            if (processedRequest.indicesType && processedRequest.indicesType !== null) {
                apiParams.indicesType = processedRequest.indicesType;
            }
            
            // Make API call
            const response = await callTokenMetricsAPI(
                "/v2/indices",
                apiParams,
                runtime
            );
            
            console.log(`[${requestId}] API response received, processing data...`);
            
            // Process response data
            const indices = Array.isArray(response) ? response : response.data || [];
            
            // DEBUG: Log the actual API response structure
            console.log(`[${requestId}] Raw API response:`, JSON.stringify(response, null, 2));
            console.log(`[${requestId}] Processed indices array:`, JSON.stringify(indices.slice(0, 2), null, 2));
            
            // Analyze the indices data based on requested analysis type
            const indicesAnalysis = analyzeIndicesData(indices, processedRequest.analysisType);
            
            const result = {
                success: true,
                message: `Successfully retrieved ${indices.length} crypto indices`,
                request_id: requestId,
                indices_data: indices,
                analysis: indicesAnalysis,
                metadata: {
                    endpoint: "indices",
                    filters_applied: {
                        indices_type: processedRequest.indicesType,
                        analysis_focus: processedRequest.analysisType
                    },
                    pagination: {
                        page: processedRequest.page,
                        limit: processedRequest.limit
                    },
                    data_points: indices.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Indices Engine"
                },
                indices_explanation: {
                    purpose: "Crypto indices provide diversified exposure to cryptocurrency markets through professionally managed baskets",
                    index_types: [
                        "Active Indices - Professionally managed with dynamic allocation strategies",
                        "Passive Indices - Market-cap weighted or rule-based allocation strategies", 
                        "Sector Indices - Focused on specific crypto sectors (DeFi, Layer 1, etc.)",
                        "Thematic Indices - Based on investment themes and market trends"
                    ],
                    key_metrics: [
                        "Total Return - Overall performance since inception",
                        "Annual Return - Annualized performance metrics",
                        "Volatility - Risk measurement for the index",
                        "Sharpe Ratio - Risk-adjusted return measurement",
                        "Max Drawdown - Worst-case scenario loss measurement",
                        "Assets Count - Number of tokens in the index"
                    ],
                    usage_guidelines: [
                        "Use for diversified crypto exposure without picking individual tokens",
                        "Compare active vs passive strategies for your investment goals",
                        "Consider volatility and Sharpe ratio for risk assessment",
                        "Review assets count for diversification level",
                        "Monitor total return and max drawdown for performance evaluation"
                    ]
                }
            };
            
            console.log(`[${requestId}] Indices analysis completed successfully`);
            
            // Format response text for user
            const responseText = formatIndicesResponse(result, processedRequest.limit);
            
            console.log(`[${requestId}] Analysis completed successfully`);
            
            // Use callback to send response to user (like working actions)
            if (callback) {
                callback({
                    text: responseText,
                    content: {
                        success: true,
                        request_id: requestId,
                        data: result,
                        metadata: {
                            endpoint: "indices",
                            data_source: "TokenMetrics Official API",
                            api_version: "v2"
                        }
                    }
                });
            }
            
            return true;
        } catch (error) {
            console.error("Error in getIndices action:", error);
            
            if (callback) {
                callback({
                    text: `❌ Failed to retrieve indices data: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    content: {
                        success: false,
                        error: error instanceof Error ? error.message : "Unknown error occurred"
                    }
                });
            }
            
            return false;
        }
    },

    async validate(runtime, _message) {
        return validateAndGetApiKey(runtime) !== null;
    }
};

/**
 * Analyze indices data to provide strategic insights based on analysis type
 */
function analyzeIndicesData(indices: any[], analysisType: string = "all"): any {
    if (!indices || indices.length === 0) {
        return {
            summary: "No indices data available for analysis",
            insights: [],
            recommendations: []
        };
    }

    // Note: API doesn't provide INDEX_TYPE, so we can't filter by active/passive
    const activeIndices: any[] = []; // Not available in API response
    const passiveIndices: any[] = []; // Not available in API response
    
    // Calculate performance metrics using actual API field names
    const validAllTimeReturns = indices.filter(index => index.ALL_TIME !== undefined && index.ALL_TIME !== null);
    const avgAllTimeReturn = validAllTimeReturns.length > 0 
        ? validAllTimeReturns.reduce((sum, index) => sum + index.ALL_TIME, 0) / validAllTimeReturns.length 
        : 0;
    
    const valid1MReturns = indices.filter(index => index["1M"] !== undefined && index["1M"] !== null);
    const avg1MReturn = valid1MReturns.length > 0 
        ? valid1MReturns.reduce((sum, index) => sum + index["1M"], 0) / valid1MReturns.length 
        : 0;
    
    const validGrades = indices.filter(index => index.INDEX_GRADE !== undefined && index.INDEX_GRADE !== null);
    const avgIndexGrade = validGrades.length > 0 
        ? validGrades.reduce((sum, index) => sum + index.INDEX_GRADE, 0) / validGrades.length 
        : 0;

    // Find top performers based on ALL_TIME returns
    const topPerformers = indices
        .filter(index => index.ALL_TIME !== undefined && index.ALL_TIME !== null)
        .sort((a, b) => b.ALL_TIME - a.ALL_TIME)
        .slice(0, 3);

    // Find best recent performers based on 1M returns
    const bestRecentPerformers = indices
        .filter(index => index["1M"] !== undefined && index["1M"] !== null)
        .sort((a, b) => b["1M"] - a["1M"])
        .slice(0, 3);

    // Base insights using actual data
    const insights = [
        `📊 Total Indices Available: ${indices.length}`,
        `📈 Average All-Time Return: ${formatPercentage(avgAllTimeReturn)}`,
        `📅 Average 1-Month Return: ${formatPercentage(avg1MReturn)}`,
        `🎯 Average Index Grade: ${avgIndexGrade.toFixed(1)}/100`,
        `🏆 Top All-Time Performer: ${topPerformers[0]?.NAME} (${formatPercentage(topPerformers[0]?.ALL_TIME)})`
    ];

    // Base recommendations
    const recommendations = [
        indices.length > 10 ? 
            `🎯 Good Selection: ${indices.length} indices available for diversified crypto exposure` :
            `⚠️ Limited Selection: Only ${indices.length} indices currently available`,
        avgIndexGrade > 50 ? 
            `✅ Strong Quality: Average index grade of ${avgIndexGrade.toFixed(1)}/100 indicates good quality indices` :
            `⚠️ Consider Quality: Lower average grade suggests careful selection needed`,
        avg1MReturn > 0 ? 
            `📈 Positive Momentum: Average 1-month return of ${formatPercentage(avg1MReturn)} shows recent strength` :
            `📉 Recent Weakness: Negative 1-month returns suggest market challenges`,
        topPerformers.length > 0 ? 
            `🚀 Strong Leaders: Top performer ${topPerformers[0]?.NAME} shows ${formatPercentage(topPerformers[0]?.ALL_TIME)} all-time returns` :
            `⚠️ No clear leaders identified`
    ];

    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "performance":
            focusedAnalysis = {
                performance_focus: {
                    top_all_time_performers: topPerformers.slice(0, 5),
                    recent_performers: bestRecentPerformers.slice(0, 5),
                    performance_distribution: {
                        positive_all_time: indices.filter(i => (i.ALL_TIME || 0) > 0).length,
                        negative_all_time: indices.filter(i => (i.ALL_TIME || 0) < 0).length,
                        positive_1m: indices.filter(i => (i["1M"] || 0) > 0).length,
                        negative_1m: indices.filter(i => (i["1M"] || 0) < 0).length
                    },
                    performance_insights: [
                        `🚀 ${indices.filter(i => (i.ALL_TIME || 0) > 100).length} indices with >100% all-time returns`,
                        `📈 ${indices.filter(i => (i["1M"] || 0) > 0).length}/${indices.length} indices showing positive 1-month returns`,
                        `⭐ Best all-time: ${topPerformers[0]?.NAME} at ${formatPercentage(topPerformers[0]?.ALL_TIME)}`
                    ]
                }
            };
            break;
            
        case "risk":
            // Since volatility data isn't available, use grade and recent performance as risk proxies
            const lowRiskIndices = indices.filter(i => (i.INDEX_GRADE || 0) > 70).slice(0, 5);
            const highRiskIndices = indices.filter(i => (i.INDEX_GRADE || 0) < 30).slice(0, 5);
            
            focusedAnalysis = {
                risk_focus: {
                    high_grade_indices: lowRiskIndices,
                    low_grade_indices: highRiskIndices,
                    risk_distribution: {
                        high_grade: indices.filter(i => (i.INDEX_GRADE || 0) > 70).length,
                        medium_grade: indices.filter(i => (i.INDEX_GRADE || 0) >= 30 && (i.INDEX_GRADE || 0) <= 70).length,
                        low_grade: indices.filter(i => (i.INDEX_GRADE || 0) < 30).length
                    },
                    risk_insights: [
                        `🛡️ ${indices.filter(i => (i.INDEX_GRADE || 0) > 70).length} high-grade indices (grade >70)`,
                        `⚖️ ${indices.filter(i => (i.INDEX_GRADE || 0) >= 30 && (i.INDEX_GRADE || 0) <= 70).length} medium-grade indices`,
                        `⚠️ ${indices.filter(i => (i.INDEX_GRADE || 0) < 30).length} low-grade indices (grade <30)`
                    ]
                }
            };
            break;
            
        case "diversification":
            focusedAnalysis = {
                diversification_focus: {
                    by_coin_count: indices.sort((a, b) => (b.COINS || 0) - (a.COINS || 0)).slice(0, 5),
                    diversification_levels: {
                        highly_diversified: indices.filter(i => (i.COINS || 0) > 20).length,
                        moderately_diversified: indices.filter(i => (i.COINS || 0) >= 10 && (i.COINS || 0) <= 20).length,
                        focused: indices.filter(i => (i.COINS || 0) < 10).length
                    },
                    diversification_insights: [
                        `🌐 ${indices.filter(i => (i.COINS || 0) > 20).length} highly diversified indices (>20 coins)`,
                        `📊 ${indices.filter(i => (i.COINS || 0) >= 10 && (i.COINS || 0) <= 20).length} moderately diversified indices`,
                        `🎯 ${indices.filter(i => (i.COINS || 0) < 10).length} focused indices (<10 coins)`
                    ]
                }
            };
            break;
    }

    return {
        summary: `Analysis of ${indices.length} crypto indices showing ${formatPercentage(avgAllTimeReturn)} average all-time return with ${avgIndexGrade.toFixed(1)}/100 average grade`,
        analysis_type: analysisType,
        performance_metrics: {
            total_indices: indices.length,
            active_indices: 0, // Not available in API
            passive_indices: 0, // Not available in API
            avg_all_time_return: avgAllTimeReturn,
            avg_1m_return: avg1MReturn,
            avg_index_grade: avgIndexGrade,
            avg_sharpe_ratio: 0 // Not available in API
        },
        top_performers: topPerformers.map(index => ({
            name: index.NAME,
            ticker: index.TICKER,
            all_time_return: index.ALL_TIME,
            one_month_return: index["1M"],
            index_grade: index.INDEX_GRADE,
            coins: index.COINS
        })),
        best_recent_performers: bestRecentPerformers.map(index => ({
            name: index.NAME,
            ticker: index.TICKER,
            one_month_return: index["1M"],
            all_time_return: index.ALL_TIME,
            index_grade: index.INDEX_GRADE
        })),
        insights,
        recommendations,
        ...focusedAnalysis,
        investment_considerations: [
            "📈 Compare all-time returns vs recent performance trends",
            "🎯 Consider index grade as quality indicator (higher is better)",
            "🔄 Review coin count for diversification level",
            "💰 Factor in 24H volume for liquidity assessment",
            "📊 Analyze market cap for index size and stability",
            "⚖️ Balance between focused and diversified strategies"
        ]
    };
}

/**
 * Format indices response for user display
 */
function formatIndicesResponse(result: any, requestedLimit?: number): string {
    const { indices_data, analysis } = result;
    
    let response = `📊 **Crypto Indices Analysis**\n\n`;
    
    if (indices_data && indices_data.length > 0) {
        response += `🎯 **Found ${indices_data.length} Indices**\n\n`;
        
        // Show indices based on requested limit or all available
        const displayLimit = requestedLimit || indices_data.length;
        const topIndices = indices_data
            .filter((index: any) => index.ALL_TIME !== undefined)
            .sort((a: any, b: any) => (b.ALL_TIME || 0) - (a.ALL_TIME || 0))
            .slice(0, Math.min(displayLimit, indices_data.length));
            
        if (topIndices.length > 0) {
            response += `🏆 **Top Performing Indices:**\n`;
            topIndices.forEach((index: any, i: number) => {
                const name = index.NAME || `Index ${i + 1}`;
                const ticker = index.TICKER || '';
                const allTimeReturn = index.ALL_TIME ? formatPercentage(index.ALL_TIME) : 'N/A';
                const oneMonthReturn = index["1M"] ? formatPercentage(index["1M"]) : 'N/A';
                const indexGrade = index.INDEX_GRADE ? formatPercentage(index.INDEX_GRADE) : 'N/A';
                
                response += `${i + 1}. **${name}** ${ticker ? `(${ticker})` : ''}\n`;
                response += `   • All-Time Return: ${allTimeReturn}\n`;
                response += `   • 1-Month Return: ${oneMonthReturn}\n`;
                response += `   • Index Grade: ${indexGrade}\n`;
                response += `\n`;
            });
        }
        
        // Add analysis insights
        if (analysis && analysis.insights) {
            response += `💡 **Key Insights:**\n`;
            analysis.insights.slice(0, 5).forEach((insight: string) => {
                response += `• ${insight}\n`;
            });
            response += `\n`;
        }
        
        // Add performance metrics
        if (analysis && analysis.performance_metrics) {
            const metrics = analysis.performance_metrics;
            response += `📈 **Market Overview:**\n`;
            response += `• Total Indices: ${metrics.total_indices || 0}\n`;
            response += `• Active Indices: ${metrics.active_indices || 0}\n`;
            response += `• Passive Indices: ${metrics.passive_indices || 0}\n`;
            if (metrics.avg_all_time_return !== undefined) {
                response += `• Average All-Time Return: ${formatPercentage(metrics.avg_all_time_return)}\n`;
            }
            if (metrics.avg_1m_return !== undefined) {
                response += `• Average 1-Month Return: ${formatPercentage(metrics.avg_1m_return)}\n`;
            }
            response += `\n`;
        }
        
        // Add recommendations
        if (analysis && analysis.recommendations) {
            response += `🎯 **Recommendations:**\n`;
            analysis.recommendations.slice(0, 3).forEach((rec: string) => {
                response += `• ${rec}\n`;
            });
        }
    } else {
        response += `❌ No indices data found.\n\n`;
        response += `This could be due to:\n`;
        response += `• API connectivity issues\n`;
        response += `• Invalid filter parameters\n`;
        response += `• Temporary service unavailability\n`;
    }
    
    response += `\n📊 **Data Source**: TokenMetrics Indices Engine\n`;
    response += `⏰ **Updated**: ${new Date().toLocaleString()}\n`;
    
    return response;
} 
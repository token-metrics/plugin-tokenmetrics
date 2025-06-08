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
    indicesType: z.string().optional().describe("Type of indices to filter (active, passive, etc.)"),
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
   - Leave undefined for all types

2. **limit** (default: 50): How many indices to return (1-100)

3. **page** (default: 1): Which page of results (for pagination)

4. **analysisType** (default: "all"): What type of analysis they want
   - "performance" - focus on returns and performance metrics
   - "risk" - focus on volatility and risk metrics  
   - "diversification" - focus on portfolio diversification
   - "all" - comprehensive analysis

Examples:
- "Show me crypto indices" → {indicesType: undefined, limit: 50, page: 1, analysisType: "all"}
- "Get active crypto index funds" → {indicesType: "active", limit: 50, page: 1, analysisType: "all"}
- "What are the best performing passive indices?" → {indicesType: "passive", limit: 50, page: 1, analysisType: "performance"}
- "Show me 20 indices focused on risk analysis" → {indicesType: undefined, limit: 20, page: 1, analysisType: "risk"}

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
    
    async handler(runtime, message, _state) {
        try {
            const requestId = generateRequestId();
            console.log(`[${requestId}] Processing indices request...`);
            
            // Extract structured request using AI
            const indicesRequest = await extractTokenMetricsRequest<IndicesRequest>(
                runtime,
                message,
                _state || await runtime.composeState(message),
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
            
            if (processedRequest.indicesType) {
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
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve indices data from TokenMetrics"
            };
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

    const activeIndices = indices.filter(index => index.INDEX_TYPE === 'active');
    const passiveIndices = indices.filter(index => index.INDEX_TYPE === 'passive');
    
    // Calculate performance metrics
    const avgTotalReturn = indices
        .filter(index => index.TOTAL_RETURN !== undefined)
        .reduce((sum, index) => sum + index.TOTAL_RETURN, 0) / indices.length;
    
    const avgAnnualReturn = indices
        .filter(index => index.ANNUAL_RETURN !== undefined)
        .reduce((sum, index) => sum + index.ANNUAL_RETURN, 0) / indices.length;
    
    const avgVolatility = indices
        .filter(index => index.VOLATILITY !== undefined)
        .reduce((sum, index) => sum + index.VOLATILITY, 0) / indices.length;
    
    const avgSharpeRatio = indices
        .filter(index => index.SHARPE_RATIO !== undefined)
        .reduce((sum, index) => sum + index.SHARPE_RATIO, 0) / indices.length;

    // Find top performers
    const topPerformers = indices
        .filter(index => index.TOTAL_RETURN !== undefined)
        .sort((a, b) => b.TOTAL_RETURN - a.TOTAL_RETURN)
        .slice(0, 3);

    // Find best risk-adjusted returns
    const bestRiskAdjusted = indices
        .filter(index => index.SHARPE_RATIO !== undefined)
        .sort((a, b) => b.SHARPE_RATIO - a.SHARPE_RATIO)
        .slice(0, 3);

    // Base insights
    const insights = [
        `📊 Total Indices Available: ${indices.length} (${activeIndices.length} active, ${passiveIndices.length} passive)`,
        `📈 Average Total Return: ${formatPercentage(avgTotalReturn)}`,
        `📅 Average Annual Return: ${formatPercentage(avgAnnualReturn)}`,
        `⚡ Average Volatility: ${formatPercentage(avgVolatility)}`,
        `🎯 Average Sharpe Ratio: ${avgSharpeRatio.toFixed(3)}`,
        `🏆 Top Performer: ${topPerformers[0]?.INDEX_NAME} (${formatPercentage(topPerformers[0]?.TOTAL_RETURN)})`
    ];

    // Base recommendations
    const recommendations = [
        activeIndices.length > 0 ? 
            `🎯 Active Management: ${activeIndices.length} actively managed indices available for dynamic allocation strategies` :
            "⚠️ No active indices currently available",
        passiveIndices.length > 0 ? 
            `📊 Passive Investment: ${passiveIndices.length} passive indices available for low-cost market exposure` :
            "⚠️ No passive indices currently available",
        avgSharpeRatio > 1 ? 
            "✅ Strong Risk-Adjusted Returns: Average Sharpe ratio indicates good risk-adjusted performance" :
            "⚠️ Consider Risk: Lower Sharpe ratios suggest higher risk relative to returns",
        avgVolatility > 50 ? 
            "⚠️ High Volatility: Indices show significant price swings - consider position sizing" :
            "✅ Moderate Volatility: Reasonable risk levels for crypto investments"
    ];

    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "performance":
            focusedAnalysis = {
                performance_focus: {
                    top_performers: topPerformers.slice(0, 5),
                    performance_distribution: {
                        positive_returns: indices.filter(i => i.TOTAL_RETURN > 0).length,
                        negative_returns: indices.filter(i => i.TOTAL_RETURN < 0).length,
                        neutral_returns: indices.filter(i => i.TOTAL_RETURN === 0).length
                    },
                    performance_insights: [
                        `🚀 ${indices.filter(i => i.TOTAL_RETURN > 100).length} indices with >100% returns`,
                        `📈 ${indices.filter(i => i.TOTAL_RETURN > 0).length}/${indices.length} indices showing positive returns`,
                        `⭐ Best performer: ${topPerformers[0]?.INDEX_NAME} at ${formatPercentage(topPerformers[0]?.TOTAL_RETURN)}`
                    ]
                }
            };
            break;
            
        case "risk":
            focusedAnalysis = {
                risk_focus: {
                    low_risk_indices: indices.filter(i => i.VOLATILITY < 30).slice(0, 5),
                    high_risk_indices: indices.filter(i => i.VOLATILITY > 70).slice(0, 5),
                    risk_distribution: {
                        low_risk: indices.filter(i => i.VOLATILITY < 30).length,
                        medium_risk: indices.filter(i => i.VOLATILITY >= 30 && i.VOLATILITY <= 70).length,
                        high_risk: indices.filter(i => i.VOLATILITY > 70).length
                    },
                    risk_insights: [
                        `🛡️ ${indices.filter(i => i.VOLATILITY < 30).length} low-risk indices (volatility <30%)`,
                        `⚖️ ${indices.filter(i => i.VOLATILITY >= 30 && i.VOLATILITY <= 70).length} medium-risk indices`,
                        `⚠️ ${indices.filter(i => i.VOLATILITY > 70).length} high-risk indices (volatility >70%)`
                    ]
                }
            };
            break;
            
        case "diversification":
            focusedAnalysis = {
                diversification_focus: {
                    by_asset_count: indices.sort((a, b) => (b.ASSETS_COUNT || 0) - (a.ASSETS_COUNT || 0)).slice(0, 5),
                    diversification_levels: {
                        highly_diversified: indices.filter(i => (i.ASSETS_COUNT || 0) > 20).length,
                        moderately_diversified: indices.filter(i => (i.ASSETS_COUNT || 0) >= 10 && (i.ASSETS_COUNT || 0) <= 20).length,
                        focused: indices.filter(i => (i.ASSETS_COUNT || 0) < 10).length
                    },
                    diversification_insights: [
                        `🌐 ${indices.filter(i => (i.ASSETS_COUNT || 0) > 20).length} highly diversified indices (>20 assets)`,
                        `📊 ${indices.filter(i => (i.ASSETS_COUNT || 0) >= 10 && (i.ASSETS_COUNT || 0) <= 20).length} moderately diversified indices`,
                        `🎯 ${indices.filter(i => (i.ASSETS_COUNT || 0) < 10).length} focused indices (<10 assets)`
                    ]
                }
            };
            break;
    }

    return {
        summary: `Analysis of ${indices.length} crypto indices showing ${formatPercentage(avgTotalReturn)} average total return with ${formatPercentage(avgVolatility)} volatility`,
        analysis_type: analysisType,
        performance_metrics: {
            total_indices: indices.length,
            active_indices: activeIndices.length,
            passive_indices: passiveIndices.length,
            avg_total_return: avgTotalReturn,
            avg_annual_return: avgAnnualReturn,
            avg_volatility: avgVolatility,
            avg_sharpe_ratio: avgSharpeRatio
        },
        top_performers: topPerformers.map(index => ({
            name: index.INDEX_NAME,
            symbol: index.INDEX_SYMBOL,
            total_return: index.TOTAL_RETURN,
            annual_return: index.ANNUAL_RETURN,
            type: index.INDEX_TYPE
        })),
        best_risk_adjusted: bestRiskAdjusted.map(index => ({
            name: index.INDEX_NAME,
            symbol: index.INDEX_SYMBOL,
            sharpe_ratio: index.SHARPE_RATIO,
            total_return: index.TOTAL_RETURN,
            volatility: index.VOLATILITY
        })),
        insights,
        recommendations,
        ...focusedAnalysis,
        investment_considerations: [
            "📈 Compare total returns vs benchmark (Bitcoin/Ethereum)",
            "⚖️ Evaluate risk tolerance using volatility and max drawdown",
            "🎯 Consider Sharpe ratio for risk-adjusted performance",
            "🔄 Review rebalancing frequency for active indices",
            "💰 Factor in management fees and expense ratios",
            "📊 Analyze correlation with existing portfolio holdings"
        ]
    };
} 
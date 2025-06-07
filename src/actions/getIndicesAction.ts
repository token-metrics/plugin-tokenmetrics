import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    formatTokenMetricsNumber,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { IndicesResponse, IndicesRequest } from "../types";

/**
 * INDICES ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/indices
 * 
 * This action gets active and passive crypto indices with performance and market data.
 * Essential for understanding index-based investment opportunities and market trends.
 */
export const getIndicesAction: Action = {
    name: "getIndices",
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
                    action: "GET_INDICES"
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
                    action: "GET_INDICES"
                }
            }
        ]
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Build parameters based on actual API documentation
            const requestParams: IndicesRequest = {
                indicesType: typeof messageContent.indicesType === 'string' ? messageContent.indicesType : undefined,
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : 50,
                page: typeof messageContent.page === 'number' ? messageContent.page : 1
            };
            
            // Validate parameters according to actual API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            
            // Make API call with corrected authentication
            const response = await callTokenMetricsApi<IndicesResponse>(
                TOKENMETRICS_ENDPOINTS.indices,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<IndicesResponse>(response, "getIndices");
            const indices = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the indices data
            const indicesAnalysis = analyzeIndicesData(indices);
            
            return {
                success: true,
                message: `Successfully retrieved ${indices.length} crypto indices`,
                indices_data: indices,
                analysis: indicesAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.indices,
                    filters_applied: {
                        indices_type: requestParams.indicesType
                    },
                    pagination: {
                        page: requestParams.page,
                        limit: requestParams.limit
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
            
        } catch (error) {
            console.error("Error in getIndices action:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve indices data from TokenMetrics"
            };
        }
    },

    async validate(_runtime, _message) {
        try {
            const apiKey = process.env.TOKENMETRICS_API_KEY;
            return !!apiKey;
        } catch {
            return false;
        }
    }
};

/**
 * Analyze indices data to provide strategic insights
 */
function analyzeIndicesData(indices: any[]): any {
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

    const insights = [
        `📊 Total Indices Available: ${indices.length} (${activeIndices.length} active, ${passiveIndices.length} passive)`,
        `📈 Average Total Return: ${formatTokenMetricsNumber(avgTotalReturn, 'percentage')}`,
        `📅 Average Annual Return: ${formatTokenMetricsNumber(avgAnnualReturn, 'percentage')}`,
        `⚡ Average Volatility: ${formatTokenMetricsNumber(avgVolatility, 'percentage')}`,
        `🎯 Average Sharpe Ratio: ${avgSharpeRatio.toFixed(3)}`,
        `🏆 Top Performer: ${topPerformers[0]?.INDEX_NAME} (${formatTokenMetricsNumber(topPerformers[0]?.TOTAL_RETURN, 'percentage')})`
    ];

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

    return {
        summary: `Analysis of ${indices.length} crypto indices showing ${formatTokenMetricsNumber(avgTotalReturn, 'percentage')} average total return with ${formatTokenMetricsNumber(avgVolatility, 'percentage')} volatility`,
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
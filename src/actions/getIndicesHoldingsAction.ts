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
import type { IndicesHoldingsResponse } from "../types";

// Zod schema for indices holdings request validation
const IndicesHoldingsRequestSchema = z.object({
    indexId: z.number().min(1).describe("The ID of the index to get holdings for"),
    analysisType: z.enum(["composition", "risk", "performance", "all"]).optional().describe("Type of analysis to focus on")
});

type IndicesHoldingsRequest = z.infer<typeof IndicesHoldingsRequestSchema>;

// AI extraction template for natural language processing
const INDICES_HOLDINGS_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting crypto index holdings requests from natural language.

The user wants to get information about the holdings/composition of a specific crypto index. Extract the following information:

1. **indexId** (required): The ID number of the index they want holdings for
   - Look for phrases like "index 1", "index ID 5", "index number 3"
   - Extract the numeric ID from the request
   - This is required - if no ID is found, ask for clarification

2. **analysisType** (optional, default: "all"): What type of analysis they want
   - "composition" - focus on token allocation and weights
   - "risk" - focus on concentration and risk metrics
   - "performance" - focus on price changes and performance
   - "all" - comprehensive analysis

Examples:
- "Show me holdings of index 1" → {indexId: 1, analysisType: "all"}
- "What tokens are in crypto index 5?" → {indexId: 5, analysisType: "composition"}
- "Get risk analysis for index 3 holdings" → {indexId: 3, analysisType: "risk"}
- "Index 2 composition and performance" → {indexId: 2, analysisType: "performance"}

Extract the request details from the user's message.
`;

/**
 * INDICES HOLDINGS ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/indices-holdings
 * 
 * This action returns the current holdings of a given index, along with their respective weight in %.
 * Essential for understanding index composition and allocation strategies.
 */
export const getIndicesHoldingsAction: Action = {
    name: "GET_INDICES_HOLDINGS_TOKENMETRICS",
    description: "Get the current holdings of a crypto index with weight percentages and allocation details from TokenMetrics",
    similes: [
        "get index holdings",
        "index composition",
        "index allocations", 
        "index weights",
        "index portfolio",
        "index assets",
        "index breakdown",
        "index constituents"
    ],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me the holdings of crypto index 1"
                }
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll get the current holdings and allocation weights for that crypto index.",
                    action: "GET_INDICES_HOLDINGS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What tokens are in the DeFi index and their weights?"
                }
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Let me show you the token composition and weight allocation for the DeFi index.",
                    action: "GET_INDICES_HOLDINGS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get risk analysis for index 3 holdings"
                }
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll analyze the holdings composition and risk metrics for index 3.",
                    action: "GET_INDICES_HOLDINGS_TOKENMETRICS"
                }
            }
        ]
    ],
    
    async handler(runtime, message, _state) {
        try {
            const requestId = generateRequestId();
            console.log(`[${requestId}] Processing indices holdings request...`);
            
            // Extract structured request using AI
            const holdingsRequest = await extractTokenMetricsRequest<IndicesHoldingsRequest>(
                runtime,
                message,
                _state || await runtime.composeState(message),
                INDICES_HOLDINGS_EXTRACTION_TEMPLATE,
                IndicesHoldingsRequestSchema,
                requestId
            );
            
            console.log(`[${requestId}] Extracted request:`, holdingsRequest);
            
            // Apply defaults for optional fields
            const processedRequest = {
                indexId: holdingsRequest.indexId,
                analysisType: holdingsRequest.analysisType || "all"
            };
            
            // Build API parameters
            const apiParams: Record<string, any> = {
                id: processedRequest.indexId
            };
            
            // Make API call
            const response = await callTokenMetricsAPI(
                "/v2/indices-holdings",
                apiParams,
                runtime
            );
            
            console.log(`[${requestId}] API response received, processing data...`);
            
            // Process response data
            const holdings = Array.isArray(response) ? response : response.data || [];
            
            // Analyze the holdings data based on requested analysis type
            const holdingsAnalysis = analyzeHoldingsData(holdings, processedRequest.analysisType);
            
            const result = {
                success: true,
                message: `Successfully retrieved holdings for index ${processedRequest.indexId} with ${holdings.length} assets`,
                request_id: requestId,
                indices_holdings: holdings,
                analysis: holdingsAnalysis,
                metadata: {
                    endpoint: "indices-holdings",
                    index_id: processedRequest.indexId,
                    analysis_focus: processedRequest.analysisType,
                    total_holdings: holdings.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Indices Engine"
                },
                holdings_explanation: {
                    purpose: "Index holdings show the exact composition and allocation strategy of crypto indices",
                    key_metrics: [
                        "Weight Percentage - Allocation percentage of each token in the index",
                        "Allocation Value - Dollar value allocated to each token",
                        "Price - Current market price of each holding",
                        "Market Cap - Market capitalization of each token",
                        "24h Change - Recent price performance of holdings"
                    ],
                    allocation_insights: [
                        "Higher weight percentages indicate core positions in the index strategy",
                        "Diversification can be measured by the distribution of weights",
                        "Recent price changes affect the current allocation balance",
                        "Market cap correlation shows if the index follows market-cap weighting"
                    ],
                    usage_guidelines: [
                        "Review weight distribution for diversification assessment",
                        "Monitor large allocations for concentration risk",
                        "Compare holdings to your existing portfolio for overlap analysis",
                        "Track price changes to understand index performance drivers",
                        "Use allocation values to understand absolute exposure levels"
                    ]
                }
            };
            
            console.log(`[${requestId}] Holdings analysis completed successfully`);
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
                            endpoint: "indicesholdings",
                            data_source: "TokenMetrics Official API",
                            api_version: "v2"
                        }
                    }
                });
            }
            
            return true;
        } catch (error) {
            console.error("Error in getIndicesHoldings action:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve indices holdings data from TokenMetrics"
            };
        }
    },

    async validate(runtime, _message) {
        return validateAndGetApiKey(runtime) !== null;
    }
};

/**
 * Analyze holdings data to provide strategic insights based on analysis type
 */
function analyzeHoldingsData(holdings: any[], analysisType: string = "all"): any {
    if (!holdings || holdings.length === 0) {
        return {
            summary: "No holdings data available for this index",
            insights: [],
            recommendations: []
        };
    }

    // Calculate portfolio metrics
    const totalWeight = holdings.reduce((sum, holding) => sum + (holding.WEIGHT_PERCENTAGE || 0), 0);
    const totalValue = holdings.reduce((sum, holding) => sum + (holding.ALLOCATION_VALUE || 0), 0);
    
    // Find largest holdings
    const topHoldings = holdings
        .filter(holding => holding.WEIGHT_PERCENTAGE !== undefined)
        .sort((a, b) => b.WEIGHT_PERCENTAGE - a.WEIGHT_PERCENTAGE)
        .slice(0, 5);

    // Calculate concentration metrics
    const top3Weight = topHoldings.slice(0, 3).reduce((sum, holding) => sum + holding.WEIGHT_PERCENTAGE, 0);
    const top5Weight = topHoldings.reduce((sum, holding) => sum + holding.WEIGHT_PERCENTAGE, 0);
    
    // Analyze price performance
    const holdingsWithPriceChange = holdings.filter(holding => holding.PRICE_CHANGE_PERCENTAGE_24H !== undefined);
    const avgPriceChange = holdingsWithPriceChange.length > 0 
        ? holdingsWithPriceChange.reduce((sum, holding) => sum + holding.PRICE_CHANGE_PERCENTAGE_24H, 0) / holdingsWithPriceChange.length
        : 0;

    // Categorize holdings by market cap
    const largeCapHoldings = holdings.filter(holding => (holding.MARKET_CAP || 0) > 10e9); // >$10B
    const midCapHoldings = holdings.filter(holding => (holding.MARKET_CAP || 0) > 1e9 && (holding.MARKET_CAP || 0) <= 10e9); // $1B-$10B
    const smallCapHoldings = holdings.filter(holding => (holding.MARKET_CAP || 0) <= 1e9); // <$1B

    // Base insights
    const insights = [
        `📊 Total Holdings: ${holdings.length} tokens`,
        `⚖️ Total Weight: ${formatPercentage(totalWeight)}`,
        `💰 Total Allocation Value: ${formatCurrency(totalValue)}`,
        `🏆 Largest Holding: ${topHoldings[0]?.TOKEN_NAME} (${formatPercentage(topHoldings[0]?.WEIGHT_PERCENTAGE)})`,
        `📈 Top 3 Concentration: ${formatPercentage(top3Weight)}`,
        `📊 Top 5 Concentration: ${formatPercentage(top5Weight)}`,
        `📉 Average 24h Change: ${formatPercentage(avgPriceChange)}`
    ];

    // Base recommendations
    const recommendations = [
        top3Weight > 60 ? 
            "⚠️ High Concentration: Top 3 holdings represent significant portion - consider concentration risk" :
            "✅ Balanced Allocation: Good diversification across top holdings",
        holdings.length > 20 ? 
            "✅ Well Diversified: Large number of holdings provides good diversification" :
            holdings.length < 10 ? 
                "⚠️ Limited Diversification: Consider if concentration aligns with your risk tolerance" :
                "📊 Moderate Diversification: Reasonable number of holdings for focused strategy",
        largeCapHoldings.length > holdings.length * 0.7 ? 
            "🏛️ Large Cap Focus: Index heavily weighted toward established cryptocurrencies" :
            smallCapHoldings.length > holdings.length * 0.5 ? 
                "🚀 Small Cap Exposure: Higher risk/reward profile with smaller market cap tokens" :
                "⚖️ Balanced Market Cap: Mix of large and smaller market cap exposures",
        Math.abs(avgPriceChange) > 10 ? 
            "⚡ High Volatility: Recent price movements show significant volatility in holdings" :
            "📊 Stable Performance: Holdings showing moderate price movements"
    ];

    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "composition":
            focusedAnalysis = {
                composition_focus: {
                    weight_distribution: {
                        top_10_percent: holdings.filter(h => h.WEIGHT_PERCENTAGE > 10).length,
                        mid_range: holdings.filter(h => h.WEIGHT_PERCENTAGE >= 1 && h.WEIGHT_PERCENTAGE <= 10).length,
                        small_positions: holdings.filter(h => h.WEIGHT_PERCENTAGE < 1).length
                    },
                    sector_analysis: analyzeSectorDistribution(holdings),
                    composition_insights: [
                        `🎯 ${holdings.filter(h => h.WEIGHT_PERCENTAGE > 10).length} major positions (>10% weight)`,
                        `📊 ${holdings.filter(h => h.WEIGHT_PERCENTAGE >= 1 && h.WEIGHT_PERCENTAGE <= 10).length} medium positions (1-10% weight)`,
                        `🔍 ${holdings.filter(h => h.WEIGHT_PERCENTAGE < 1).length} small positions (<1% weight)`
                    ]
                }
            };
            break;
            
        case "risk":
            focusedAnalysis = {
                risk_focus: {
                    concentration_risk: {
                        herfindahl_index: calculateHerfindahlIndex(holdings),
                        concentration_level: top3Weight > 60 ? "High" : top3Weight > 40 ? "Medium" : "Low"
                    },
                    volatility_analysis: {
                        high_volatility_holdings: holdings.filter(h => Math.abs(h.PRICE_CHANGE_PERCENTAGE_24H || 0) > 15).length,
                        stable_holdings: holdings.filter(h => Math.abs(h.PRICE_CHANGE_PERCENTAGE_24H || 0) < 5).length
                    },
                    risk_insights: [
                        `⚠️ Concentration Risk: ${top3Weight > 60 ? "High" : top3Weight > 40 ? "Medium" : "Low"} (top 3: ${formatPercentage(top3Weight)})`,
                        `📊 Volatility Risk: ${holdings.filter(h => Math.abs(h.PRICE_CHANGE_PERCENTAGE_24H || 0) > 15).length} high-volatility holdings`,
                        `🛡️ Stability: ${holdings.filter(h => Math.abs(h.PRICE_CHANGE_PERCENTAGE_24H || 0) < 5).length} stable holdings`
                    ]
                }
            };
            break;
            
        case "performance":
            focusedAnalysis = {
                performance_focus: {
                    top_performers: holdings
                        .filter(h => h.PRICE_CHANGE_PERCENTAGE_24H !== undefined)
                        .sort((a, b) => b.PRICE_CHANGE_PERCENTAGE_24H - a.PRICE_CHANGE_PERCENTAGE_24H)
                        .slice(0, 5),
                    worst_performers: holdings
                        .filter(h => h.PRICE_CHANGE_PERCENTAGE_24H !== undefined)
                        .sort((a, b) => a.PRICE_CHANGE_PERCENTAGE_24H - b.PRICE_CHANGE_PERCENTAGE_24H)
                        .slice(0, 5),
                    performance_insights: [
                        `🚀 Best performer: ${holdings.sort((a, b) => (b.PRICE_CHANGE_PERCENTAGE_24H || 0) - (a.PRICE_CHANGE_PERCENTAGE_24H || 0))[0]?.TOKEN_NAME} (${formatPercentage(holdings.sort((a, b) => (b.PRICE_CHANGE_PERCENTAGE_24H || 0) - (a.PRICE_CHANGE_PERCENTAGE_24H || 0))[0]?.PRICE_CHANGE_PERCENTAGE_24H || 0)})`,
                        `📉 Worst performer: ${holdings.sort((a, b) => (a.PRICE_CHANGE_PERCENTAGE_24H || 0) - (b.PRICE_CHANGE_PERCENTAGE_24H || 0))[0]?.TOKEN_NAME} (${formatPercentage(holdings.sort((a, b) => (a.PRICE_CHANGE_PERCENTAGE_24H || 0) - (b.PRICE_CHANGE_PERCENTAGE_24H || 0))[0]?.PRICE_CHANGE_PERCENTAGE_24H || 0)})`,
                        `📊 ${holdings.filter(h => (h.PRICE_CHANGE_PERCENTAGE_24H || 0) > 0).length}/${holdings.length} holdings showing positive performance`
                    ]
                }
            };
            break;
    }

    return {
        summary: `Index contains ${holdings.length} holdings with ${formatPercentage(top3Weight)} concentration in top 3 positions`,
        analysis_type: analysisType,
        portfolio_metrics: {
            total_holdings: holdings.length,
            total_weight: totalWeight,
            total_value: totalValue,
            top_3_concentration: top3Weight,
            top_5_concentration: top5Weight,
            avg_24h_change: avgPriceChange
        },
        market_cap_distribution: {
            large_cap: largeCapHoldings.length,
            mid_cap: midCapHoldings.length,
            small_cap: smallCapHoldings.length
        },
        top_holdings: topHoldings.map(holding => ({
            token_name: holding.TOKEN_NAME,
            symbol: holding.TOKEN_SYMBOL,
            weight_percentage: holding.WEIGHT_PERCENTAGE,
            allocation_value: holding.ALLOCATION_VALUE,
            price: holding.PRICE,
            price_change_24h: holding.PRICE_CHANGE_PERCENTAGE_24H
        })),
        insights,
        recommendations,
        ...focusedAnalysis,
        risk_considerations: [
            "📊 Monitor concentration risk in top holdings",
            "🔄 Track rebalancing frequency and methodology",
            "💰 Consider correlation with your existing portfolio",
            "📈 Evaluate performance attribution by holding",
            "⚠️ Assess liquidity risk in smaller holdings",
            "🎯 Review alignment with investment objectives"
        ]
    };
}

/**
 * Analyze sector distribution of holdings
 */
function analyzeSectorDistribution(holdings: any[]): any {
    // This would ideally use sector data from the API
    // For now, we'll provide a basic analysis structure
    return {
        sectors_identified: "Analysis requires sector classification data",
        diversification_score: holdings.length > 15 ? "High" : holdings.length > 8 ? "Medium" : "Low"
    };
}

/**
 * Calculate Herfindahl Index for concentration measurement
 */
function calculateHerfindahlIndex(holdings: any[]): number {
    const totalWeight = holdings.reduce((sum, holding) => sum + (holding.WEIGHT_PERCENTAGE || 0), 0);
    
    if (totalWeight === 0) return 0;
    
    const herfindahl = holdings.reduce((sum, holding) => {
        const normalizedWeight = (holding.WEIGHT_PERCENTAGE || 0) / totalWeight;
        return sum + (normalizedWeight * normalizedWeight);
    }, 0);
    
    return Math.round(herfindahl * 10000); // Scale to 0-10000 range
} 
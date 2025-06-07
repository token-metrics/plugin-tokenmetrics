import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    formatTokenMetricsNumber,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { IndicesHoldingsResponse, IndicesHoldingsRequest } from "../types";

/**
 * INDICES HOLDINGS ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/indices-holdings
 * 
 * This action returns the current holdings of a given index, along with their respective weight in %.
 * Essential for understanding index composition and allocation strategies.
 */
export const getIndicesHoldingsAction: Action = {
    name: "getIndicesHoldings",
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
                    action: "GET_INDICES_HOLDINGS"
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
                    action: "GET_INDICES_HOLDINGS"
                }
            }
        ]
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Extract index ID from message content
            const indexId = messageContent.id || messageContent.index_id || messageContent.indexId;
            
            if (!indexId) {
                throw new Error("Index ID is required. Please specify which index holdings you want to view (e.g., id: 1)");
            }
            
            // Build parameters based on actual API documentation
            const requestParams: IndicesHoldingsRequest = {
                id: Number(indexId)
            };
            
            // Validate parameters according to actual API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            
            // Make API call with corrected authentication
            const response = await callTokenMetricsApi<IndicesHoldingsResponse>(
                TOKENMETRICS_ENDPOINTS.indicesHoldings,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<IndicesHoldingsResponse>(response, "getIndicesHoldings");
            const holdings = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the holdings data
            const holdingsAnalysis = analyzeHoldingsData(holdings);
            
            return {
                success: true,
                message: `Successfully retrieved holdings for index ${indexId} with ${holdings.length} assets`,
                indices_holdings: holdings,
                analysis: holdingsAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.indicesHoldings,
                    index_id: indexId,
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
            
        } catch (error) {
            console.error("Error in getIndicesHoldings action:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve indices holdings data from TokenMetrics"
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
 * Analyze holdings data to provide strategic insights
 */
function analyzeHoldingsData(holdings: any[]): any {
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

    const insights = [
        `📊 Total Holdings: ${holdings.length} tokens`,
        `⚖️ Total Weight: ${formatTokenMetricsNumber(totalWeight, 'percentage')}`,
        `💰 Total Allocation Value: ${formatTokenMetricsNumber(totalValue, 'currency')}`,
        `🏆 Largest Holding: ${topHoldings[0]?.TOKEN_NAME} (${formatTokenMetricsNumber(topHoldings[0]?.WEIGHT_PERCENTAGE, 'percentage')})`,
        `📈 Top 3 Concentration: ${formatTokenMetricsNumber(top3Weight, 'percentage')}`,
        `📊 Top 5 Concentration: ${formatTokenMetricsNumber(top5Weight, 'percentage')}`,
        `📉 Average 24h Change: ${formatTokenMetricsNumber(avgPriceChange, 'percentage')}`
    ];

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

    return {
        summary: `Index contains ${holdings.length} holdings with ${formatTokenMetricsNumber(top3Weight, 'percentage')} concentration in top 3 positions`,
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
import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    formatTokenMetricsNumber,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { TopMarketCapResponse, TopMarketCapRequest } from "../types";

/**
 * CORRECTED Top Market Cap Action - Based on actual TokenMetrics API documentation  
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/top-market-cap-tokens
 * 
 * This action gets the list of top cryptocurrency tokens by market capitalization.
 * According to the API docs, it uses 'top_k' parameter (not 'limit') and 'page' for pagination.
 */
export const getTopMarketCapAction: Action = {
    name: "getTopMarketCap",
    description: "Get the list of top cryptocurrency tokens by market capitalization from TokenMetrics",
    similes: [
        "get top market cap tokens",
        "top crypto by market cap",
        "largest cryptocurrencies", 
        "biggest crypto tokens",
        "market cap leaders",
        "top tokens by size"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // CORRECTED: Use 'top_k' parameter as shown in actual API docs, not 'limit'
            const requestParams: TopMarketCapRequest = {
                top_k: typeof messageContent.top_k === 'number' ? messageContent.top_k :
                       typeof messageContent.limit === 'number' ? messageContent.limit : 10,
                page: typeof messageContent.page === 'number' ? messageContent.page : 1
            };
            
            // Validate parameters according to actual API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Fetching top market cap tokens from TokenMetrics v2/top-market-cap-tokens endpoint");
            
            // Make API call with corrected authentication
            const response = await callTokenMetricsApi<TopMarketCapResponse>(
                TOKENMETRICS_ENDPOINTS.topMarketCap,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<TopMarketCapResponse>(response, "getTopMarketCap");
            const topTokens = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze market concentration
            const marketAnalysis = analyzeTopMarketCapData(topTokens);
            
            return {
                success: true,
                message: `Successfully retrieved top ${topTokens.length} tokens by market capitalization`,
                top_tokens: topTokens,
                analysis: marketAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.topMarketCap,
                    tokens_returned: topTokens.length,
                    top_k: requestParams.top_k,
                    page: requestParams.page,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                market_cap_education: {
                    what_is_market_cap: "Market Cap = Current Price × Circulating Supply",
                    why_it_matters: "Indicates the total value and relative size of each cryptocurrency",
                    risk_implications: {
                        large_cap: "Generally more stable, lower volatility, higher liquidity",
                        mid_cap: "Balanced risk-reward, moderate volatility", 
                        small_cap: "Higher risk, higher potential returns, more volatile"
                    }
                }
            };
            
        } catch (error) {
            console.error("Error in getTopMarketCapAction:", error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve top market cap tokens from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/top-market-cap-tokens is accessible",
                    parameter_validation: [
                        "Check that top_k parameter is a positive integer (1-1000)",
                        "Verify page parameter is a positive integer if provided",
                        "Ensure your API key has access to top market cap endpoint"
                    ],
                    common_solutions: [
                        "Try the request with default parameters first (top_k=10)",
                        "Check if your subscription includes market cap data",
                        "Verify TokenMetrics API service status"
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
                    text: "Show me the top 10 cryptocurrencies by market cap"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the top 10 cryptocurrencies by market capitalization from TokenMetrics.",
                    action: "GET_TOP_MARKET_CAP"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What are the largest crypto assets right now?",
                    top_k: 20
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve the top 20 largest cryptocurrency assets by market cap.",
                    action: "GET_TOP_MARKET_CAP"
                }
            }
        ]
    ],
};

/**
 * Analyze top market cap data for concentration and insights
 */
function analyzeTopMarketCapData(topTokensData: any[]): any {
    if (!topTokensData || topTokensData.length === 0) {
        return {
            summary: "No top market cap data available for analysis",
            market_concentration: "Cannot assess",
            insights: []
        };
    }
    
    // Calculate market concentration
    const totalMarketCap = topTokensData.reduce((sum, token) => sum + (token.MARKET_CAP || 0), 0);
    
    // Calculate dominance ratios
    const top1Dominance = topTokensData.length > 0 ? (topTokensData[0].MARKET_CAP / totalMarketCap) * 100 : 0;
    const top3Dominance = topTokensData.length >= 3 ? 
        (topTokensData.slice(0, 3).reduce((sum, token) => sum + token.MARKET_CAP, 0) / totalMarketCap) * 100 : top1Dominance;
    
    // Assess concentration level
    let dominanceLevel;
    if (top1Dominance > 50) dominanceLevel = "Extremely High";
    else if (top1Dominance > 40) dominanceLevel = "Very High"; 
    else if (top1Dominance > 30) dominanceLevel = "High";
    else if (top1Dominance > 20) dominanceLevel = "Moderate";
    else dominanceLevel = "Low";
    
    // Generate insights
    const insights = [];
    if (top1Dominance > 40) {
        insights.push(`High concentration: Top token holds ${top1Dominance.toFixed(1)}% of analyzed market cap`);
    }
    if (topTokensData.length > 0) {
        insights.push(`Market leader: ${topTokensData[0].NAME} (${topTokensData[0].SYMBOL}) with ${formatTokenMetricsNumber(topTokensData[0].MARKET_CAP, 'currency')}`);
    }
    
    // Format top tokens for display
    const formattedTokens = topTokensData.slice(0, 5).map((token, index) => ({
        rank: index + 1,
        name: `${token.NAME} (${token.SYMBOL})`,
        market_cap: formatTokenMetricsNumber(token.MARKET_CAP, 'currency'),
        price: formatTokenMetricsNumber(token.PRICE, 'currency'),
        dominance: `${((token.MARKET_CAP / totalMarketCap) * 100).toFixed(2)}%`
    }));
    
    return {
        summary: `Analysis of top ${topTokensData.length} tokens shows ${dominanceLevel.toLowerCase()} market concentration`,
        market_concentration: {
            dominance_level: dominanceLevel,
            top_1_dominance: `${top1Dominance.toFixed(1)}%`,
            top_3_dominance: `${top3Dominance.toFixed(1)}%`,
            total_analyzed_market_cap: formatTokenMetricsNumber(totalMarketCap, 'currency')
        },
        top_5_breakdown: formattedTokens,
        insights: insights,
        portfolio_implications: generatePortfolioImplications(dominanceLevel, top1Dominance)
    };
}

function generatePortfolioImplications(dominanceLevel: string, top1Dominance: number): string[] {
    const implications = [];
    
    if (top1Dominance > 40) {
        implications.push("High concentration suggests the top token is critical for crypto portfolio performance");
        implications.push("Consider the market leader as a core holding given its dominance");
    }
    
    if (dominanceLevel === "High" || dominanceLevel === "Very High") {
        implications.push("Clear market tiers support a tiered allocation strategy matching market cap rankings");
    } else {
        implications.push("More distributed market allows for more equal weighting among top tokens");
    }
    
    implications.push("Top market cap tokens provide the most liquid and established crypto exposure");
    implications.push("Market concentration levels suggest appropriate diversification needs");
    
    return implications;
}
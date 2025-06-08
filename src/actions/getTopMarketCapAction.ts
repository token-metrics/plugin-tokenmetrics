import type { Action } from "@elizaos/core";
import { z } from "zod";
import {
    validateAndGetApiKey,
    extractTokenMetricsRequest,
    callTokenMetricsAPI,
    formatCurrency,
    formatPercentage,
    generateRequestId
} from "./aiActionHelper";
import type { TopMarketCapResponse } from "../types";
import { 
    elizaLogger, 
    type HandlerCallback,
    type IAgentRuntime, 
    type Memory, 
    type State 
} from "@elizaos/core";

// Zod schema for top market cap request validation
const TopMarketCapRequestSchema = z.object({
    top_k: z.number().min(1).max(1000).optional().describe("Number of top tokens to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["ranking", "concentration", "performance", "all"]).optional().describe("Type of analysis to focus on")
});

type TopMarketCapRequest = z.infer<typeof TopMarketCapRequestSchema>;

// AI extraction template for natural language processing
const TOP_MARKET_CAP_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting top market cap cryptocurrency requests from natural language.

The user wants to get information about the top cryptocurrencies by market capitalization. Extract the following information:

1. **top_k** (optional, default: 10): How many top tokens they want
   - Look for numbers like "top 10", "top 20", "first 50"
   - Common requests: "top 10" → 10, "top 20" → 20, "biggest 50" → 50
   - Maximum is 1000

2. **page** (optional, default: 1): Which page of results (for pagination)
   - Usually not mentioned unless they want specific pages

3. **analysisType** (optional, default: "all"): What type of analysis they want
   - "ranking" - focus on token rankings and positions
   - "concentration" - focus on market dominance and concentration
   - "performance" - focus on price performance and changes
   - "all" - comprehensive analysis

Examples:
- "Show me top 10 crypto by market cap" → {top_k: 10, page: 1, analysisType: "all"}
- "What are the biggest 20 cryptocurrencies?" → {top_k: 20, page: 1, analysisType: "ranking"}
- "Get top 50 tokens with concentration analysis" → {top_k: 50, page: 1, analysisType: "concentration"}
- "Top crypto market cap leaders" → {top_k: 10, page: 1, analysisType: "all"}

Extract the request details from the user's message.
`;

/**
 * CORRECTED Top Market Cap Action - Based on actual TokenMetrics API documentation  
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/top-market-cap-tokens
 * 
 * This action gets the list of top cryptocurrency tokens by market capitalization.
 * According to the API docs, it uses 'top_k' parameter (not 'limit') and 'page' for pagination.
 */
export const getTopMarketCapAction: Action = {
    name: "GET_TOP_MARKET_CAP_TOKENMETRICS",
    description: "Get the list of top cryptocurrency tokens by market capitalization from TokenMetrics",
    similes: [
        "get top market cap tokens",
        "top crypto by market cap",
        "largest cryptocurrencies", 
        "biggest crypto tokens",
        "market cap leaders",
        "top tokens by size"
    ],
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
                    action: "GET_TOP_MARKET_CAP_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What are the largest crypto assets right now?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve the largest cryptocurrency assets by market cap.",
                    action: "GET_TOP_MARKET_CAP_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get top 20 tokens with concentration analysis"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the top 20 tokens by market cap and analyze market concentration.",
                    action: "GET_TOP_MARKET_CAP_TOKENMETRICS"
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
            console.log(`[${requestId}] Processing top market cap request...`);
            
            // Extract structured request using AI
            const marketCapRequest = await extractTokenMetricsRequest<TopMarketCapRequest>(
                runtime,
                message,
                state || await runtime.composeState(message),
                TOP_MARKET_CAP_EXTRACTION_TEMPLATE,
                TopMarketCapRequestSchema,
                requestId
            );
            
            console.log(`[${requestId}] Extracted request:`, marketCapRequest);
            
            // Apply defaults for optional fields
            const processedRequest = {
                top_k: marketCapRequest.top_k || 10,
                page: marketCapRequest.page || 1,
                analysisType: marketCapRequest.analysisType || "all"
            };
            
            // Build API parameters
            const apiParams: Record<string, any> = {
                top_k: processedRequest.top_k,
                page: processedRequest.page
            };
            
            // Make API call
            const response = await callTokenMetricsAPI(
                "/v2/top-market-cap-tokens",
                apiParams,
                runtime
            );
            
            console.log(`[${requestId}] API response received, processing data...`);
            
            // Process response data
            const topTokens = Array.isArray(response) ? response : response.data || [];
            
            // Analyze the top tokens data based on requested analysis type
            const marketAnalysis = analyzeTopTokensRanking(topTokens, processedRequest.top_k, processedRequest.analysisType);
            
            // Format response text for user
            const responseText = formatTopMarketCapResponse(topTokens, marketAnalysis, processedRequest);
            
            const result = {
                success: true,
                message: `Successfully retrieved top ${topTokens.length} tokens by market capitalization ranking`,
                request_id: requestId,
                top_tokens: topTokens,
                analysis: marketAnalysis,
                metadata: {
                    endpoint: "top-market-cap-tokens",
                    tokens_returned: topTokens.length,
                    top_k: processedRequest.top_k,
                    page: processedRequest.page,
                    analysis_focus: processedRequest.analysisType,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API",
                    note: "This endpoint returns tokens ordered by market cap ranking, not market cap values"
                },
                market_cap_education: {
                    what_is_market_cap: "Market Cap = Current Price × Circulating Supply",
                    why_it_matters: "Indicates the total value and relative size of each cryptocurrency",
                    ranking_explanation: "Tokens are returned in descending order by market capitalization",
                    risk_implications: {
                        large_cap: "Generally more stable, lower volatility, higher liquidity (top 10)",
                        mid_cap: "Balanced risk-reward, moderate volatility (top 11-100)", 
                        small_cap: "Higher risk, higher potential returns, more volatile (beyond top 100)"
                    }
                }
            };
            
            console.log(`[${requestId}] Top market cap analysis completed successfully`);
            
            // Use callback to send response to user
            if (callback) {
                callback({
                    text: responseText,
                    content: result
                });
            }
            return true;
            
        } catch (error) {
            console.error("Error in getTopMarketCapAction:", error);
            
            const errorResult = {
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
                    ],
                    api_note: "This endpoint returns token rankings by market cap, not actual market cap values"
                }
            };
            
            // Use callback for error response too
            if (callback) {
                callback({
                    text: "❌ Failed to retrieve top market cap data. Please try again later.",
                    content: errorResult
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
 * Analyze top tokens ranking data based on analysis type
 */
function analyzeTopTokensRanking(topTokens: any[], top_k: number, analysisType: string = "all"): any {
    if (!topTokens || topTokens.length === 0) {
        return {
            summary: "No top market cap tokens data available for analysis",
            insights: [],
            recommendations: []
        };
    }

    // Basic metrics
    const tokensReturned = topTokens.length;
    const requestedTokens = top_k;
    
    // Analyze token distribution
    const tokenAnalysis = analyzeTokenDistribution(topTokens);
    
    // Base insights
    const insights = [
        `📊 Retrieved ${tokensReturned} of ${requestedTokens} requested top tokens`,
        `🏆 Market Leader: ${topTokens[0]?.NAME || topTokens[0]?.TOKEN_NAME} (${topTokens[0]?.SYMBOL || topTokens[0]?.TOKEN_SYMBOL})`,
        `📈 Token Coverage: ${tokenAnalysis.coverage_level}`,
        `🔄 Exchange Coverage: ${tokenAnalysis.exchange_coverage}`
    ];

    // Base recommendations
    const recommendations = [
        tokensReturned >= requestedTokens ? 
            "✅ Complete Data: Full dataset retrieved for comprehensive analysis" :
            "⚠️ Partial Data: Consider checking API limits or subscription tier",
        topTokens.length >= 10 ? 
            "📊 Good Sample Size: Sufficient data for market analysis" :
            "📈 Limited Sample: Consider requesting more tokens for better insights",
        "🎯 Use for portfolio allocation and market trend analysis",
        "📊 Compare with historical rankings to identify trends"
    ];

    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "ranking":
            focusedAnalysis = {
                ranking_focus: {
                    top_5_tokens: topTokens.slice(0, 5).map((token, index) => ({
                        rank: index + 1,
                        name: token.NAME || token.TOKEN_NAME,
                        symbol: token.SYMBOL || token.TOKEN_SYMBOL
                    })),
                    ranking_insights: [
                        `🥇 #1 Position: ${topTokens[0]?.NAME || topTokens[0]?.TOKEN_NAME}`,
                        `🥈 #2 Position: ${topTokens[1]?.NAME || topTokens[1]?.TOKEN_NAME}`,
                        `🥉 #3 Position: ${topTokens[2]?.NAME || topTokens[2]?.TOKEN_NAME}`,
                        `📊 Top 5 represent the most established cryptocurrencies`
                    ]
                }
            };
            break;
            
        case "concentration":
            focusedAnalysis = {
                concentration_focus: {
                    market_structure: analyzeMarketStructure(topTokens),
                    concentration_insights: [
                        `🎯 Market concentration analysis based on ${tokensReturned} top tokens`,
                        `📊 Established leaders vs emerging tokens distribution`,
                        `⚖️ Market structure indicates ${tokensReturned < 20 ? "high" : "moderate"} concentration focus`
                    ]
                }
            };
            break;
            
        case "performance":
            focusedAnalysis = {
                performance_focus: {
                    performance_metrics: analyzePerformanceMetrics(topTokens),
                    performance_insights: [
                        `📈 Performance analysis of top ${tokensReturned} market cap tokens`,
                        `🎯 Focus on established tokens with proven market presence`,
                        `📊 Large cap tokens typically show lower volatility`
                    ]
                }
            };
            break;
    }

    return {
        summary: `Analysis of top ${tokensReturned} tokens by market cap showing ${tokenAnalysis.coverage_level} market coverage`,
        analysis_type: analysisType,
        token_metrics: {
            tokens_returned: tokensReturned,
            tokens_requested: requestedTokens,
            coverage_percentage: Math.round((tokensReturned / requestedTokens) * 100),
            data_completeness: tokensReturned >= requestedTokens ? "Complete" : "Partial"
        },
        market_structure: tokenAnalysis,
        insights,
        recommendations,
        ...focusedAnalysis,
        portfolio_implications: generateRankingPortfolioImplications(tokensReturned, requestedTokens),
        investment_considerations: [
            "📈 Top market cap tokens offer stability and liquidity",
            "⚖️ Consider allocation based on market cap weighting",
            "🔄 Monitor ranking changes for market trend insights",
            "💰 Large cap tokens suitable for core portfolio positions",
            "📊 Use rankings for diversification and risk management",
            "🎯 Track new entrants to top rankings for growth opportunities"
        ]
    };
}

/**
 * Analyze token distribution and coverage
 */
function analyzeTokenDistribution(topTokens: any[]): any {
    const tokenCount = topTokens.length;
    
    let coverageLevel = "Limited";
    if (tokenCount >= 50) coverageLevel = "Comprehensive";
    else if (tokenCount >= 20) coverageLevel = "Good";
    else if (tokenCount >= 10) coverageLevel = "Moderate";
    
    // Analyze exchange coverage if data available
    const exchangeCoverage = analyzeExchangeCoverage(topTokens);
    
    return {
        coverage_level: coverageLevel,
        token_count: tokenCount,
        exchange_coverage: exchangeCoverage,
        market_representation: tokenCount >= 20 ? "Broad" : "Focused"
    };
}

/**
 * Analyze market structure based on top tokens
 */
function analyzeMarketStructure(topTokens: any[]): any {
    return {
        structure_type: topTokens.length >= 50 ? "Diversified" : "Concentrated",
        leadership_stability: "High (established tokens)",
        market_maturity: "Mature market with established leaders"
    };
}

/**
 * Analyze performance metrics if available
 */
function analyzePerformanceMetrics(topTokens: any[]): any {
    return {
        stability_level: "High (large cap tokens)",
        volatility_expectation: "Lower than small cap tokens",
        liquidity_level: "High (top market cap tokens)"
    };
}

/**
 * Analyze exchange coverage
 */
function analyzeExchangeCoverage(topTokens: any[]): string {
    // This would ideally analyze exchange data if available in the response
    return topTokens.length >= 20 ? "Broad exchange coverage expected" : "Major exchange coverage";
}

/**
 * Generate portfolio implications based on ranking data
 */
function generateRankingPortfolioImplications(tokensReturned: number, requested: number): string[] {
    const implications = [];
    
    if (tokensReturned >= requested) {
        implications.push("✅ Complete dataset enables comprehensive portfolio allocation decisions");
    } else {
        implications.push("⚠️ Partial dataset - consider requesting more tokens for complete analysis");
    }
    
    if (tokensReturned >= 20) {
        implications.push("📊 Sufficient diversity for well-balanced large-cap portfolio allocation");
    } else if (tokensReturned >= 10) {
        implications.push("🎯 Good foundation for core large-cap positions");
    } else {
        implications.push("📈 Limited to top-tier positions - consider expanding for diversification");
    }
    
    implications.push("💰 Top market cap tokens suitable for 60-80% of crypto portfolio allocation");
    implications.push("⚖️ Use market cap weighting for passive investment strategies");
    
    return implications;
}

/**
 * Format top market cap response for user display
 */
function formatTopMarketCapResponse(topTokens: any[], analysis: any, request: any): string {
    if (!topTokens || topTokens.length === 0) {
        return "❌ No top market cap data available at the moment.";
    }

    const { top_k, analysisType } = request;
    
    let response = `🏆 **Top ${topTokens.length} Cryptocurrencies by Market Cap**\n\n`;
    
    // Show top tokens
    const displayCount = Math.min(topTokens.length, 10);
    for (let i = 0; i < displayCount; i++) {
        const token = topTokens[i];
        const rank = i + 1;
        const name = token.NAME || token.TOKEN_NAME || 'Unknown';
        const symbol = token.SYMBOL || token.TOKEN_SYMBOL || 'N/A';
        
        response += `${rank}. **${name}** (${symbol})\n`;
    }
    
    if (topTokens.length > displayCount) {
        response += `\n... and ${topTokens.length - displayCount} more tokens\n`;
    }
    
    // Add analysis insights
    if (analysis?.insights && analysis.insights.length > 0) {
        response += `\n📊 **Key Insights:**\n`;
        analysis.insights.slice(0, 4).forEach((insight: string) => {
            response += `• ${insight}\n`;
        });
    }
    
    // Add recommendations
    if (analysis?.recommendations && analysis.recommendations.length > 0) {
        response += `\n💡 **Recommendations:**\n`;
        analysis.recommendations.slice(0, 3).forEach((rec: string) => {
            response += `• ${rec}\n`;
        });
    }
    
    // Add market cap education note
    response += `\n📚 **Note:** Market cap = Current Price × Circulating Supply. These rankings show the relative size and stability of cryptocurrencies.`;
    
    return response;
}
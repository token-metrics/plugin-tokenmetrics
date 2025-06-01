import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    extractTokenIdentifier,
    formatTokenMetricsNumber,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { PriceResponse, PriceRequest } from "../types";

/**
 * CORRECTED Price Action - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/price
 * 
 * This action provides real-time price information for cryptocurrencies.
 * According to the API docs, it accepts token_id parameter for specific tokens.
 */
export const getPriceAction: Action = {
    name: "getPrice",
    description: "Get current token prices and market data including 24h changes, market cap, and volume from TokenMetrics",
    similes: [
        "get token price",
        "check current price",
        "get price data",
        "current market price",
        "token price info",
        "get market data",
        "check token value"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Extract token identifiers from the user's request
            const tokenIdentifier = extractTokenIdentifier(messageContent);
            
            // CORRECTED: Build parameters based on actual API documentation
            const requestParams: PriceRequest = {
                // According to API docs, this endpoint accepts token_id parameter
                token_id: tokenIdentifier.token_id || 
                         (typeof messageContent.token_id === 'number' ? messageContent.token_id : undefined)
            };
            
            // If no specific token requested, we can call without parameters to get multiple tokens
            if (!requestParams.token_id) {
                // Remove undefined token_id to get general price data
                delete requestParams.token_id;
            }
            
            // Validate parameters according to actual API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Fetching price data from TokenMetrics v2/price endpoint");
            
            // Make API call with corrected authentication
            const response = await callTokenMetricsApi<PriceResponse>(
                TOKENMETRICS_ENDPOINTS.price,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<PriceResponse>(response, "getPrice");
            const priceData = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the price data
            const priceAnalysis = analyzePriceData(priceData);
            
            return {
                success: true,
                message: `Successfully retrieved price data for ${priceData.length} tokens`,
                price_data: priceData,
                analysis: priceAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.price,
                    requested_token_id: requestParams.token_id,
                    data_points: priceData.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                price_data_explanation: {
                    PRICE: "Current market price of the token",
                    PRICE_24H_CHANGE: "Absolute price change in the last 24 hours",
                    PRICE_24H_CHANGE_PERCENT: "Percentage price change in the last 24 hours",
                    MARKET_CAP: "Total market value (price × circulating supply)",
                    VOLUME_24H: "Total trading volume in the last 24 hours",
                    usage_tips: [
                        "24h change indicates short-term momentum",
                        "High volume usually confirms price movements",
                        "Market cap shows relative size and stability"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getPriceAction:", error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve price data from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/price is accessible",
                    parameter_validation: [
                        "Verify token_id is a valid number if provided",
                        "Ensure your API key has access to price endpoint",
                        "Check that the token is actively traded and supported"
                    ],
                    common_solutions: [
                        "Try calling without token_id to get general price data",
                        "Use the tokens endpoint first to verify correct TOKEN_ID",
                        "Check if your subscription includes price data access"
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
                    text: "What's the current price of Bitcoin?",
                    token_id: 3375
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the current Bitcoin price and market data from TokenMetrics.",
                    action: "GET_PRICE"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get current market prices"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve current market prices and data from TokenMetrics.",
                    action: "GET_PRICE"
                }
            }
        ]
    ],
};

/**
 * Analyze price data to provide market insights
 */
function analyzePriceData(priceData: any[]): any {
    if (!priceData || priceData.length === 0) {
        return {
            summary: "No price data available for analysis",
            market_overview: "Cannot assess market conditions",
            insights: []
        };
    }
    
    // Analyze overall market performance if multiple tokens
    const marketOverview = analyzeMarketOverview(priceData);
    
    // Identify top performers and underperformers
    const performanceAnalysis = analyzePerformance(priceData);
    
    // Generate insights
    const insights = generatePriceInsights(priceData, marketOverview, performanceAnalysis);
    
    return {
        summary: `Price analysis of ${priceData.length} tokens shows ${marketOverview.trend} market conditions`,
        market_overview: marketOverview,
        performance_analysis: performanceAnalysis,
        insights: insights,
        volume_analysis: analyzeVolumePatterns(priceData),
        data_quality: {
            source: "TokenMetrics Official API",
            tokens_analyzed: priceData.length,
            data_freshness: "Real-time price data"
        }
    };
}

function analyzeMarketOverview(priceData: any[]): any {
    const validPriceChanges = priceData
        .map(token => token.PRICE_24H_CHANGE_PERCENT)
        .filter(change => change !== null && change !== undefined && !isNaN(change));
    
    if (validPriceChanges.length === 0) {
        return { average_change: 0, trend: "Unknown" };
    }
    
    const averageChange = validPriceChanges.reduce((sum, change) => sum + change, 0) / validPriceChanges.length;
    const positiveCount = validPriceChanges.filter(change => change > 0).length;
    const negativeCount = validPriceChanges.filter(change => change < 0).length;
    
    let trend;
    if (positiveCount > negativeCount * 1.5) trend = "Bullish";
    else if (negativeCount > positiveCount * 1.5) trend = "Bearish";
    else trend = "Mixed";
    
    return {
        average_24h_change: formatTokenMetricsNumber(averageChange, 'percentage'),
        tokens_positive: positiveCount,
        tokens_negative: negativeCount,
        market_trend: trend,
        positive_percentage: ((positiveCount / validPriceChanges.length) * 100).toFixed(1)
    };
}

function analyzePerformance(priceData: any[]): any {
    // Sort by 24h change percentage
    const sortedByChange = priceData
        .filter(token => token.PRICE_24H_CHANGE_PERCENT !== null && token.PRICE_24H_CHANGE_PERCENT !== undefined)
        .sort((a, b) => b.PRICE_24H_CHANGE_PERCENT - a.PRICE_24H_CHANGE_PERCENT);
    
    const topPerformers = sortedByChange.slice(0, 3).map(token => ({
        name: `${token.NAME} (${token.SYMBOL})`,
        price: formatTokenMetricsNumber(token.PRICE, 'currency'),
        change_24h: formatTokenMetricsNumber(token.PRICE_24H_CHANGE_PERCENT, 'percentage'),
        volume: formatTokenMetricsNumber(token.VOLUME_24H, 'currency')
    }));
    
    const underperformers = sortedByChange.slice(-3).reverse().map(token => ({
        name: `${token.NAME} (${token.SYMBOL})`,
        price: formatTokenMetricsNumber(token.PRICE, 'currency'),
        change_24h: formatTokenMetricsNumber(token.PRICE_24H_CHANGE_PERCENT, 'percentage'),
        volume: formatTokenMetricsNumber(token.VOLUME_24H, 'currency')
    }));
    
    return {
        top_performers: topPerformers,
        underperformers: underperformers,
        performance_spread: sortedByChange.length > 0 ? 
            (sortedByChange[0].PRICE_24H_CHANGE_PERCENT - sortedByChange[sortedByChange.length - 1].PRICE_24H_CHANGE_PERCENT).toFixed(2) : '0'
    };
}

function generatePriceInsights(priceData: any[], marketOverview: any, performanceAnalysis: any): string[] {
    const insights = [];
    
    // Market trend insights
    if (marketOverview.market_trend === "Bullish") {
        insights.push(`Strong bullish sentiment with ${marketOverview.positive_percentage}% of tokens showing gains.`);
    } else if (marketOverview.market_trend === "Bearish") {
        insights.push("Bearish market conditions with majority of tokens declining.");
    } else {
        insights.push("Mixed market signals with roughly equal numbers of gainers and losers.");
    }
    
    // Performance insights
    if (performanceAnalysis.top_performers.length > 0) {
        const topGainer = performanceAnalysis.top_performers[0];
        insights.push(`${topGainer.name} leads gains with ${topGainer.change_24h} 24h change.`);
    }
    
    // Volume insights
    const highVolumeTokens = priceData.filter(token => {
        if (!token.VOLUME_24H || !token.MARKET_CAP) return false;
        const volumeToMcap = token.VOLUME_24H / token.MARKET_CAP;
        return volumeToMcap > 0.1; // Volume > 10% of market cap
    });
    
    if (highVolumeTokens.length > 0) {
        insights.push(`${highVolumeTokens.length} tokens showing high trading activity relative to market cap.`);
    }
    
    return insights;
}

function analyzeVolumePatterns(priceData: any[]): any {
    const volumeData = priceData
        .filter(token => token.VOLUME_24H && token.MARKET_CAP)
        .map(token => ({
            symbol: token.SYMBOL,
            volume: token.VOLUME_24H,
            market_cap: token.MARKET_CAP,
            volume_ratio: token.VOLUME_24H / token.MARKET_CAP
        }))
        .sort((a, b) => b.volume_ratio - a.volume_ratio);
    
    const averageVolumeRatio = volumeData.length > 0 ?
        volumeData.reduce((sum, token) => sum + token.volume_ratio, 0) / volumeData.length : 0;
    
    return {
        total_volume: formatTokenMetricsNumber(
            priceData.reduce((sum, token) => sum + (token.VOLUME_24H || 0), 0), 
            'currency'
        ),
        average_volume_ratio: (averageVolumeRatio * 100).toFixed(2) + '%',
        highest_activity: volumeData.slice(0, 3).map(token => ({
            symbol: token.symbol,
            volume_ratio: (token.volume_ratio * 100).toFixed(2) + '%'
        })),
        liquidity_assessment: averageVolumeRatio > 0.05 ? "Good" : "Moderate"
    };
}
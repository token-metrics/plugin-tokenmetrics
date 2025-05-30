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
 * Action to get token price data from TokenMetrics.
 * This action provides real-time and comprehensive price information
 * for cryptocurrencies based on the provided token IDs or symbols.
 * 
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/price
 * 
 * The price data includes:
 * - PRICE: Current token price
 * - PRICE_24H_CHANGE: Absolute 24-hour price change
 * - PRICE_24H_CHANGE_PERCENT: Percentage 24-hour price change
 * - MARKET_CAP: Current market capitalization
 * - VOLUME_24H: 24-hour trading volume
 * - TIMESTAMP: Last updated timestamp
 * 
 * This endpoint accepts comma-separated lists of token IDs or symbols,
 * making it efficient for getting price data for multiple tokens in a single request.
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
        "check token value",
        "price and volume data"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            // Extract parameters from the message content
            const messageContent = message.content as any;
            
            // Extract token identifiers from the user's request
            const tokenIdentifier = extractTokenIdentifier(messageContent);
            
            // Build request parameters for the real TokenMetrics price endpoint
            const requestParams: PriceRequest = {
                // Token identification - can use comma-separated lists
                token_ids: undefined,
                symbols: undefined
            };
            
            // Handle single token requests
            if (tokenIdentifier.token_id) {
                requestParams.token_ids = String(tokenIdentifier.token_id);
            } else if (tokenIdentifier.symbol) {
                requestParams.symbols = tokenIdentifier.symbol;
            }
            
            // Handle multiple token requests from message content
            if (typeof messageContent.token_ids === 'string') {
                requestParams.token_ids = messageContent.token_ids;
            } else if (Array.isArray(messageContent.token_ids)) {
                requestParams.token_ids = messageContent.token_ids.join(',');
            }
            
            if (typeof messageContent.symbols === 'string') {
                requestParams.symbols = messageContent.symbols;
            } else if (Array.isArray(messageContent.symbols)) {
                requestParams.symbols = messageContent.symbols.join(',');
            }
            
            // Validate that we have at least one token identifier
            if (!requestParams.token_ids && !requestParams.symbols) {
                throw new Error("At least one token identifier required. Provide token_ids or symbols parameter.");
            }
            
            // Validate all parameters according to TokenMetrics API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters for the API request
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Fetching price data from TokenMetrics v2/price endpoint");
            
            // Make the API call to the real TokenMetrics price endpoint
            const response = await callTokenMetricsApi<PriceResponse>(
                TOKENMETRICS_ENDPOINTS.price,
                apiParams,
                "GET"
            );
            
            // Format the response data for consistent structure
            const formattedData = formatTokenMetricsResponse<PriceResponse>(response, "getPrice");
            
            // Process the real API response structure
            const priceData = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the price data to provide market insights
            const priceAnalysis = analyzePriceData(priceData);
            
            // Return comprehensive price analysis with market insights
            return {
                success: true,
                message: `Successfully retrieved price data for ${priceData.length} tokens`,
                price_data: priceData,
                analysis: priceAnalysis,
                // Include metadata about the request
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.price,
                    requested_tokens: requestParams.symbols || requestParams.token_ids,
                    data_points: priceData.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                // Provide educational context about TokenMetrics price data
                price_data_explanation: {
                    PRICE: "Current market price of the token",
                    PRICE_24H_CHANGE: "Absolute price change in the last 24 hours",
                    PRICE_24H_CHANGE_PERCENT: "Percentage price change in the last 24 hours",
                    MARKET_CAP: "Total market value (price × circulating supply)",
                    VOLUME_24H: "Total trading volume in the last 24 hours",
                    TIMESTAMP: "Last updated time for the price data",
                    usage_tips: [
                        "24h change indicates short-term momentum",
                        "High volume usually confirms price movements",
                        "Market cap shows relative size and stability",
                        "Compare volume to market cap for liquidity assessment"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getPriceAction:", error);
            
            // Return detailed error information with troubleshooting guidance
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred while fetching price data",
                message: "Failed to retrieve price data from TokenMetrics API",
                // Include helpful troubleshooting steps for the real endpoint
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/price is accessible",
                    parameter_validation: [
                        "Verify token symbols are correct (e.g., BTC, ETH, ADA)",
                        "Check token IDs are valid numbers (e.g., 3375 for BTC)",
                        "Ensure comma-separated format for multiple tokens",
                        "Confirm your API key has access to price endpoint"
                    ],
                    common_solutions: [
                        "Try using a single major token (BTC or ETH) to test",
                        "Use the tokens endpoint first to verify correct identifiers",
                        "Check if the tokens are actively traded and supported",
                        "Verify your subscription includes price data access"
                    ],
                    example_requests: [
                        "Single token by symbol: symbols=BTC",
                        "Multiple tokens by symbol: symbols=BTC,ETH,ADA",
                        "Single token by ID: token_ids=3375",
                        "Multiple tokens by ID: token_ids=3375,1027,825"
                    ]
                }
            };
        }
    },
    
    /**
     * Validate that the runtime environment supports price data access.
     * Price data is usually available to all TokenMetrics API subscribers.
     */
    validate: async (runtime, _message) => {
        const apiKey = runtime.getSetting("TOKENMETRICS_API_KEY");
        if (!apiKey) {
            console.warn("TokenMetrics API key not found. Please set TOKENMETRICS_API_KEY environment variable.");
            return false;
        }
        return true;
    },
    
    /**
     * Examples showing different ways to use the price endpoint.
     * These examples reflect real TokenMetrics API usage patterns.
     */
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What's the current price of Bitcoin?",
                    symbol: "BTC"
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
                    text: "Get prices for Bitcoin, Ethereum, and Cardano",
                    symbols: "BTC,ETH,ADA"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve current prices and market data for Bitcoin, Ethereum, and Cardano.",
                    action: "GET_PRICE"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Check price and volume for token ID 3375"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the price and trading volume data for that token.",
                    action: "GET_PRICE"
                }
            }
        ]
    ],
};

/**
 * Comprehensive analysis function for price data from TokenMetrics.
 * This function processes real API response data and provides market insights.
 * 
 * @param priceData - Array of price data from TokenMetrics API
 * @returns Analysis with market insights and performance assessment
 */
function analyzePriceData(priceData: any[]): any {
    if (!priceData || priceData.length === 0) {
        return {
            summary: "No price data available for analysis",
            market_overview: "Cannot assess market conditions",
            insights: [],
            performance_summary: "Insufficient data"
        };
    }
    
    // Analyze overall market performance
    const marketOverview = analyzeMarketOverview(priceData);
    
    // Identify top performers and underperformers
    const performanceAnalysis = analyzePerformance(priceData);
    
    // Assess market conditions based on price movements
    const marketConditions = assessMarketConditions(priceData);
    
    // Generate insights based on the price data
    const insights = generatePriceInsights(priceData, marketOverview, performanceAnalysis);
    
    return {
        summary: `Price analysis of ${priceData.length} tokens shows ${marketConditions.overall_sentiment} market conditions`,
        
        market_overview: marketOverview,
        
        performance_analysis: performanceAnalysis,
        
        market_conditions: marketConditions,
        
        insights: insights,
        
        volume_analysis: analyzeVolumePatterns(priceData),
        
        market_cap_analysis: analyzeMarketCapDistribution(priceData),
        
        data_quality: {
            source: "TokenMetrics Official API",
            tokens_analyzed: priceData.length,
            latest_update: getMostRecentTimestamp(priceData),
            data_freshness: "Real-time price data"
        }
    };
}

// Helper functions for price data analysis

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
        tokens_neutral: validPriceChanges.length - positiveCount - negativeCount,
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

function assessMarketConditions(priceData: any[]): any {
    const changes = priceData
        .map(token => token.PRICE_24H_CHANGE_PERCENT)
        .filter(change => change !== null && change !== undefined);
    
    if (changes.length === 0) {
        return { overall_sentiment: "Unknown", volatility: "Unknown", momentum: "Unknown" };
    }
    
    const averageChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const volatility = calculateVolatility(changes);
    
    let sentiment;
    if (averageChange > 2) sentiment = "Bullish";
    else if (averageChange > 0.5) sentiment = "Mildly Bullish";
    else if (averageChange > -0.5) sentiment = "Neutral";
    else if (averageChange > -2) sentiment = "Mildly Bearish";
    else sentiment = "Bearish";
    
    let volatilityLevel;
    if (volatility > 8) volatilityLevel = "Very High";
    else if (volatility > 5) volatilityLevel = "High";
    else if (volatility > 3) volatilityLevel = "Moderate";
    else volatilityLevel = "Low";
    
    let momentum;
    const strongMoves = changes.filter(change => Math.abs(change) > 5).length;
    const momentumPercentage = (strongMoves / changes.length) * 100;
    
    if (momentumPercentage > 30) momentum = "Strong";
    else if (momentumPercentage > 15) momentum = "Moderate";
    else momentum = "Weak";
    
    return {
        overall_sentiment: sentiment,
        average_change: formatTokenMetricsNumber(averageChange, 'percentage'),
        volatility: volatilityLevel,
        volatility_score: volatility.toFixed(2),
        momentum: momentum,
        strong_movers: strongMoves
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

function analyzeMarketCapDistribution(priceData: any[]): any {
    const marketCaps = priceData
        .filter(token => token.MARKET_CAP)
        .map(token => token.MARKET_CAP)
        .sort((a, b) => b - a);
    
    if (marketCaps.length === 0) {
        return { distribution: "No market cap data available" };
    }
    
    const totalMarketCap = marketCaps.reduce((sum, cap) => sum + cap, 0);
    const largeCapCount = marketCaps.filter(cap => cap > 10e9).length;
    const midCapCount = marketCaps.filter(cap => cap > 1e9 && cap <= 10e9).length;
    const smallCapCount = marketCaps.filter(cap => cap <= 1e9).length;
    
    return {
        total_market_cap: formatTokenMetricsNumber(totalMarketCap, 'currency'),
        large_cap_tokens: largeCapCount,
        mid_cap_tokens: midCapCount,
        small_cap_tokens: smallCapCount,
        largest_token_cap: formatTokenMetricsNumber(marketCaps[0], 'currency'),
        market_concentration: ((marketCaps[0] / totalMarketCap) * 100).toFixed(1) + '%'
    };
}

// Utility functions

function calculateVolatility(changes: number[]): number {
    if (changes.length < 2) return 0;
    
    const mean = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const squaredDiffs = changes.map(change => Math.pow(change - mean, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / changes.length;
    
    return Math.sqrt(variance);
}

function getMostRecentTimestamp(priceData: any[]): string {
    const timestamps = priceData
        .map(token => token.TIMESTAMP)
        .filter(timestamp => timestamp)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    return timestamps.length > 0 ? timestamps[0] : 'N/A';
}
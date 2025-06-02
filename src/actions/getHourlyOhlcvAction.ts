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
import type { HourlyOhlcvResponse, HourlyOhlcvRequest } from "../types";

/**
 * HOURLY OHLCV ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/hourly-ohlcv
 * 
 * This action provides hourly OHLCV (Open, High, Low, Close, Volume) data for tokens.
 * Essential for technical analysis, chart generation, and intraday trading strategies.
 */
export const getHourlyOhlcvAction: Action = {
    name: "getHourlyOhlcv",
    description: "Get hourly OHLCV (Open, High, Low, Close, Volume) data for cryptocurrency tokens from TokenMetrics",
    similes: [
        "get hourly ohlcv",
        "hourly price data",
        "hourly candles",
        "intraday price data",
        "hourly chart data",
        "technical analysis data",
        "hourly trading data"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Extract token identifiers
            const tokenIdentifier = extractTokenIdentifier(messageContent);
            
            // Build parameters based on actual API documentation
            const requestParams: HourlyOhlcvRequest = {
                // Token identification
                token_id: tokenIdentifier.token_id || 
                         (typeof messageContent.token_id === 'number' ? messageContent.token_id : undefined),
                symbol: tokenIdentifier.symbol || 
                       (typeof messageContent.symbol === 'string' ? messageContent.symbol : undefined),
                token_name: typeof messageContent.token_name === 'string' ? messageContent.token_name : undefined,
                
                // Date range parameters
                startDate: typeof messageContent.startDate === 'string' ? messageContent.startDate : 
                          typeof messageContent.start_date === 'string' ? messageContent.start_date : undefined,
                endDate: typeof messageContent.endDate === 'string' ? messageContent.endDate :
                        typeof messageContent.end_date === 'string' ? messageContent.end_date : undefined,
                
                // Pagination
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : 50,
                page: typeof messageContent.page === 'number' ? messageContent.page : 1
            };
            
            // Validate parameters
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Fetching hourly OHLCV data from TokenMetrics v2/hourly-ohlcv endpoint");
            
            // Make API call
            const response = await callTokenMetricsApi<HourlyOhlcvResponse>(
                TOKENMETRICS_ENDPOINTS.hourlyOhlcv,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<HourlyOhlcvResponse>(response, "getHourlyOhlcv");
            const ohlcvData = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the OHLCV data
            const ohlcvAnalysis = analyzeHourlyOhlcvData(ohlcvData);
            
            return {
                success: true,
                message: `Successfully retrieved ${ohlcvData.length} hourly OHLCV data points`,
                ohlcv_data: ohlcvData,
                analysis: ohlcvAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.hourlyOhlcv,
                    requested_token: tokenIdentifier.symbol || tokenIdentifier.token_id,
                    date_range: {
                        start: requestParams.startDate,
                        end: requestParams.endDate
                    },
                    pagination: {
                        page: requestParams.page,
                        limit: requestParams.limit
                    },
                    data_points: ohlcvData.length,
                    timeframe: "1 hour",
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                ohlcv_explanation: {
                    OPEN: "Opening price at the start of the hour",
                    HIGH: "Highest price during the hour",
                    LOW: "Lowest price during the hour", 
                    CLOSE: "Closing price at the end of the hour",
                    VOLUME: "Total trading volume during the hour",
                    usage_tips: [
                        "Use for intraday technical analysis and pattern recognition",
                        "Higher volume confirms price movements",
                        "Compare hourly ranges to identify volatility patterns"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getHourlyOhlcvAction:", error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve hourly OHLCV data from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/hourly-ohlcv is accessible",
                    parameter_validation: [
                        "Verify token_id is a valid number or symbol is a valid string",
                        "Check that date parameters use startDate/endDate format (YYYY-MM-DD)",
                        "Ensure your API key has access to OHLCV data",
                        "Confirm the token has sufficient trading history"
                    ],
                    common_solutions: [
                        "Try using a major token (BTC=3375, ETH=1027) to test functionality",
                        "Remove date filters to get recent data",
                        "Check if your subscription includes OHLCV data access"
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
                    text: "Get hourly OHLCV data for Bitcoin",
                    symbol: "BTC"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve hourly OHLCV data for Bitcoin from TokenMetrics.",
                    action: "GET_HOURLY_OHLCV"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me hourly candle data for ETH for the past week",
                    symbol: "ETH",
                    startDate: "2024-12-01",
                    endDate: "2024-12-08"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get hourly OHLCV data for Ethereum for the specified date range.",
                    action: "GET_HOURLY_OHLCV"
                }
            }
        ]
    ],
};

/**
 * Analyze hourly OHLCV data for trading insights
 */
function analyzeHourlyOhlcvData(ohlcvData: any[]): any {
    if (!ohlcvData || ohlcvData.length === 0) {
        return {
            summary: "No hourly OHLCV data available for analysis",
            price_action: "Cannot assess",
            insights: []
        };
    }
    
    // Sort data chronologically
    const sortedData = ohlcvData.sort((a, b) => new Date(a.TIMESTAMP).getTime() - new Date(b.TIMESTAMP).getTime());
    
    // Calculate price movement analysis
    const priceAnalysis = analyzePriceMovement(sortedData);
    const volumeAnalysis = analyzeVolumePatterns(sortedData);
    const volatilityAnalysis = analyzeVolatility(sortedData);
    const trendAnalysis = analyzeTrend(sortedData);
    
    // Generate insights
    const insights = generateOhlcvInsights(priceAnalysis, volumeAnalysis, volatilityAnalysis, trendAnalysis);
    
    return {
        summary: `Hourly analysis of ${sortedData.length} data points shows ${trendAnalysis.direction} trend with ${volatilityAnalysis.level} volatility`,
        price_analysis: priceAnalysis,
        volume_analysis: volumeAnalysis,
        volatility_analysis: volatilityAnalysis,
        trend_analysis: trendAnalysis,
        insights: insights,
        trading_signals: generateTradingSignals(priceAnalysis, volumeAnalysis, trendAnalysis),
        data_quality: {
            source: "TokenMetrics Official API",
            timeframe: "1 hour",
            data_points: sortedData.length,
            completeness: calculateDataCompleteness(sortedData)
        }
    };
}

function analyzePriceMovement(data: any[]): any {
    if (data.length < 2) return { change: 0, change_percent: 0 };
    
    const firstPrice = data[0].OPEN;
    const lastPrice = data[data.length - 1].CLOSE;
    const highestPrice = Math.max(...data.map(d => d.HIGH));
    const lowestPrice = Math.min(...data.map(d => d.LOW));
    
    const priceChange = lastPrice - firstPrice;
    const changePercent = ((priceChange / firstPrice) * 100);
    const priceRange = highestPrice - lowestPrice;
    const rangePercent = ((priceRange / firstPrice) * 100);
    
    return {
        start_price: formatTokenMetricsNumber(firstPrice, 'currency'),
        end_price: formatTokenMetricsNumber(lastPrice, 'currency'),
        price_change: formatTokenMetricsNumber(priceChange, 'currency'),
        change_percent: formatTokenMetricsNumber(changePercent, 'percentage'),
        highest_price: formatTokenMetricsNumber(highestPrice, 'currency'),
        lowest_price: formatTokenMetricsNumber(lowestPrice, 'currency'),
        price_range: formatTokenMetricsNumber(priceRange, 'currency'),
        range_percent: formatTokenMetricsNumber(rangePercent, 'percentage'),
        direction: priceChange > 0 ? "Bullish" : priceChange < 0 ? "Bearish" : "Sideways"
    };
}

function analyzeVolumePatterns(data: any[]): any {
    const volumes = data.map(d => d.VOLUME).filter(v => v > 0);
    if (volumes.length === 0) return { average_volume: 0, pattern: "No data" };
    
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    const maxVolume = Math.max(...volumes);
    const minVolume = Math.min(...volumes);
    
    // Calculate volume trend
    const firstHalf = volumes.slice(0, Math.floor(volumes.length / 2));
    const secondHalf = volumes.slice(Math.floor(volumes.length / 2));
    const firstHalfAvg = firstHalf.reduce((sum, vol) => sum + vol, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, vol) => sum + vol, 0) / secondHalf.length;
    
    const volumeTrend = secondHalfAvg > firstHalfAvg * 1.1 ? "Increasing" : 
                       secondHalfAvg < firstHalfAvg * 0.9 ? "Decreasing" : "Stable";
    
    return {
        average_volume: formatTokenMetricsNumber(avgVolume, 'currency'),
        max_volume: formatTokenMetricsNumber(maxVolume, 'currency'),
        min_volume: formatTokenMetricsNumber(minVolume, 'currency'),
        volume_trend: volumeTrend,
        volume_consistency: calculateVolumeConsistency(volumes)
    };
}

function analyzeVolatility(data: any[]): any {
    if (data.length < 2) return { level: "Unknown" };
    
    // Calculate hourly volatility using high-low ranges
    const hourlyRanges = data.map(d => (d.HIGH - d.LOW) / d.OPEN * 100);
    const avgRange = hourlyRanges.reduce((sum, range) => sum + range, 0) / hourlyRanges.length;
    
    let volatilityLevel;
    if (avgRange > 5) volatilityLevel = "Very High";
    else if (avgRange > 3) volatilityLevel = "High";
    else if (avgRange > 2) volatilityLevel = "Moderate";
    else if (avgRange > 1) volatilityLevel = "Low";
    else volatilityLevel = "Very Low";
    
    return {
        level: volatilityLevel,
        average_hourly_range: formatTokenMetricsNumber(avgRange, 'percentage'),
        max_hourly_range: formatTokenMetricsNumber(Math.max(...hourlyRanges), 'percentage'),
        volatility_trend: calculateVolatilityTrend(hourlyRanges)
    };
}

function analyzeTrend(data: any[]): any {
    if (data.length < 3) return { direction: "Unknown" };
    
    const closes = data.map(d => d.CLOSE);
    const periods = [5, 10, 20]; // Moving averages
    const trends = [];
    
    for (const period of periods) {
        if (closes.length >= period) {
            const recentMA = closes.slice(-period).reduce((sum, price) => sum + price, 0) / period;
            const earlierMA = closes.slice(-period * 2, -period).reduce((sum, price) => sum + price, 0) / period;
            trends.push(recentMA > earlierMA ? 1 : -1);
        }
    }
    
    const overallTrend = trends.reduce((sum, trend) => sum + trend, 0);
    let direction;
    if (overallTrend > 0) direction = "Uptrend";
    else if (overallTrend < 0) direction = "Downtrend";
    else direction = "Sideways";
    
    return {
        direction: direction,
        strength: Math.abs(overallTrend) > 2 ? "Strong" : "Weak",
        short_term_bias: closes[closes.length - 1] > closes[closes.length - 6] ? "Bullish" : "Bearish"
    };
}

function generateOhlcvInsights(priceAnalysis: any, volumeAnalysis: any, volatilityAnalysis: any, trendAnalysis: any): string[] {
    const insights = [];
    
    // Price movement insights
    if (parseFloat(priceAnalysis.change_percent) > 5) {
        insights.push(`Strong hourly movement of ${priceAnalysis.change_percent} indicates significant market activity`);
    }
    
    // Volume insights
    if (volumeAnalysis.volume_trend === "Increasing") {
        insights.push("Increasing volume confirms the price movement and suggests continuation");
    } else if (volumeAnalysis.volume_trend === "Decreasing") {
        insights.push("Decreasing volume suggests weakening momentum");
    }
    
    // Volatility insights
    if (volatilityAnalysis.level === "Very High") {
        insights.push("Very high volatility creates both opportunities and risks for intraday trading");
    } else if (volatilityAnalysis.level === "Very Low") {
        insights.push("Low volatility suggests consolidation phase or limited trading interest");
    }
    
    // Trend insights
    if (trendAnalysis.direction === "Uptrend" && trendAnalysis.strength === "Strong") {
        insights.push("Strong uptrend supported by multiple timeframes favors long positions");
    } else if (trendAnalysis.direction === "Downtrend" && trendAnalysis.strength === "Strong") {
        insights.push("Strong downtrend suggests continued selling pressure");
    }
    
    return insights;
}

function generateTradingSignals(priceAnalysis: any, volumeAnalysis: any, trendAnalysis: any): any {
    const signals = [];
    
    // Trend-based signals
    if (trendAnalysis.direction === "Uptrend" && volumeAnalysis.volume_trend === "Increasing") {
        signals.push({
            type: "BULLISH",
            signal: "Uptrend with increasing volume suggests buying opportunity",
            confidence: "High"
        });
    }
    
    if (trendAnalysis.direction === "Downtrend" && volumeAnalysis.volume_trend === "Increasing") {
        signals.push({
            type: "BEARISH", 
            signal: "Downtrend with increasing volume suggests selling pressure",
            confidence: "High"
        });
    }
    
    // Consolidation signals
    if (trendAnalysis.direction === "Sideways") {
        signals.push({
            type: "NEUTRAL",
            signal: "Sideways trend suggests range-bound trading opportunities",
            confidence: "Moderate"
        });
    }
    
    return {
        signals: signals,
        recommendation: signals.length > 0 ? signals[0].type : "HOLD",
        risk_level: determineRiskLevel(priceAnalysis, volumeAnalysis)
    };
}

function calculateDataCompleteness(data: any[]): string {
    const requiredFields = ['OPEN', 'HIGH', 'LOW', 'CLOSE', 'VOLUME'];
    let completeness = 0;
    
    data.forEach(item => {
        const presentFields = requiredFields.filter(field => item[field] !== null && item[field] !== undefined);
        completeness += presentFields.length / requiredFields.length;
    });
    
    const completenessPercent = (completeness / data.length) * 100;
    return `${completenessPercent.toFixed(1)}%`;
}

function calculateVolumeConsistency(volumes: number[]): string {
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    const variance = volumes.reduce((sum, vol) => sum + Math.pow(vol - avgVolume, 2), 0) / volumes.length;
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = standardDeviation / avgVolume;
    
    if (coefficientOfVariation < 0.5) return "Consistent";
    if (coefficientOfVariation < 1.0) return "Moderate";
    return "Highly Variable";
}

function calculateVolatilityTrend(ranges: number[]): string {
    if (ranges.length < 6) return "Unknown";
    
    const firstHalf = ranges.slice(0, Math.floor(ranges.length / 2));
    const secondHalf = ranges.slice(Math.floor(ranges.length / 2));
    const firstHalfAvg = firstHalf.reduce((sum, range) => sum + range, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, range) => sum + range, 0) / secondHalf.length;
    
    if (secondHalfAvg > firstHalfAvg * 1.2) return "Increasing";
    if (secondHalfAvg < firstHalfAvg * 0.8) return "Decreasing";
    return "Stable";
}

function determineRiskLevel(priceAnalysis: any, volumeAnalysis: any): string {
    const changePercent = Math.abs(parseFloat(priceAnalysis.change_percent));
    const volumeTrend = volumeAnalysis.volume_trend;
    
    if (changePercent > 10 || volumeTrend === "Highly Variable") return "High";
    if (changePercent > 5 || volumeTrend === "Moderate") return "Moderate";
    return "Low";
}
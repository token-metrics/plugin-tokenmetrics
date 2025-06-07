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
import type { DailyOhlcvResponse, DailyOhlcvRequest } from "../types";

/**
 * DAILY OHLCV ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/daily-ohlcv
 * 
 * This action provides daily OHLCV (Open, High, Low, Close, Volume) data for tokens.
 * Essential for swing trading, technical analysis, and medium-term investment strategies.
 */
export const getDailyOhlcvAction: Action = {
    name: "getDailyOhlcv",
    description: "Get daily OHLCV (Open, High, Low, Close, Volume) data for cryptocurrency tokens from TokenMetrics",
    similes: [
        "get daily ohlcv",
        "daily price data",
        "daily candles",
        "daily chart data",
        "swing trading data",
        "daily technical analysis",
        "daily market data"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Extract token identifiers
            const tokenIdentifier = extractTokenIdentifier(messageContent);
            
            // Build parameters based on actual API documentation
            const requestParams: DailyOhlcvRequest = {
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
            
            
            // Make API call
            const response = await callTokenMetricsApi<DailyOhlcvResponse>(
                TOKENMETRICS_ENDPOINTS.dailyOhlcv,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<DailyOhlcvResponse>(response, "getDailyOhlcv");
            const ohlcvData = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the daily OHLCV data
            const ohlcvAnalysis = analyzeDailyOhlcvData(ohlcvData);
            
            return {
                success: true,
                message: `Successfully retrieved ${ohlcvData.length} daily OHLCV data points`,
                ohlcv_data: ohlcvData,
                analysis: ohlcvAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.dailyOhlcv,
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
                    timeframe: "1 day",
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                ohlcv_explanation: {
                    OPEN: "Opening price at the start of the day",
                    HIGH: "Highest price during the day",
                    LOW: "Lowest price during the day", 
                    CLOSE: "Closing price at the end of the day",
                    VOLUME: "Total trading volume during the day",
                    usage_tips: [
                        "Use for swing trading and medium-term technical analysis",
                        "Daily data is ideal for trend identification and support/resistance levels",
                        "Volume analysis helps confirm breakouts and reversals"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getDailyOhlcvAction:", error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve daily OHLCV data from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/daily-ohlcv is accessible",
                    parameter_validation: [
                        "Verify token_id is a valid number or symbol is a valid string",
                        "Check that date parameters use startDate/endDate format (YYYY-MM-DD)",
                        "Ensure your API key has access to OHLCV data",
                        "Confirm the token has sufficient trading history"
                    ],
                    common_solutions: [
                        "Try using a major token (BTC=3375, ETH=1027) to test functionality",
                        "Remove date filters to get recent data",
                        "Check if your subscription includes daily OHLCV data access"
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
                    text: "Get daily OHLCV data for Bitcoin",
                    symbol: "BTC"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve daily OHLCV data for Bitcoin from TokenMetrics.",
                    action: "GET_DAILY_OHLCV"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me daily candle data for ETH for the past month",
                    symbol: "ETH",
                    startDate: "2024-11-01",
                    endDate: "2024-12-01"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get daily OHLCV data for Ethereum for the specified month.",
                    action: "GET_DAILY_OHLCV"
                }
            }
        ]
    ],
};

/**
 * Analyze daily OHLCV data for swing trading and investment insights
 */
function analyzeDailyOhlcvData(ohlcvData: any[]): any {
    if (!ohlcvData || ohlcvData.length === 0) {
        return {
            summary: "No daily OHLCV data available for analysis",
            trend_analysis: "Cannot assess",
            insights: []
        };
    }
    
    // Sort data chronologically
    const sortedData = ohlcvData.sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
    
    // Comprehensive daily analysis
    const priceAnalysis = analyzeDailyPriceMovement(sortedData);
    const volumeAnalysis = analyzeDailyVolumePatterns(sortedData);
    const technicalAnalysis = analyzeTechnicalIndicators(sortedData);
    const trendAnalysis = analyzeDailyTrend(sortedData);
    const supportResistanceAnalysis = analyzeSupportResistance(sortedData);
    
    // Generate comprehensive insights
    const insights = generateDailyInsights(priceAnalysis, volumeAnalysis, technicalAnalysis, trendAnalysis);
    
    return {
        summary: `Daily analysis of ${sortedData.length} days shows ${trendAnalysis.primary_trend} trend with ${priceAnalysis.volatility_level} volatility`,
        price_analysis: priceAnalysis,
        volume_analysis: volumeAnalysis,
        technical_analysis: technicalAnalysis,
        trend_analysis: trendAnalysis,
        support_resistance: supportResistanceAnalysis,
        insights: insights,
        trading_recommendations: generateDailyTradingRecommendations(trendAnalysis, technicalAnalysis, volumeAnalysis),
        investment_signals: generateInvestmentSignals(priceAnalysis, trendAnalysis, technicalAnalysis),
        data_quality: {
            source: "TokenMetrics Official API",
            timeframe: "1 day",
            data_points: sortedData.length,
            date_range: `${sortedData[0]?.DATE || 'Unknown'} to ${sortedData[sortedData.length - 1]?.DATE || 'Unknown'}`,
            completeness: calculateDailyDataCompleteness(sortedData)
        }
    };
}

function analyzeDailyPriceMovement(data: any[]): any {
    if (data.length < 2) return { change: 0, change_percent: 0 };
    
    const firstPrice = data[0].OPEN;
    const lastPrice = data[data.length - 1].CLOSE;
    const highestPrice = Math.max(...data.map(d => d.HIGH));
    const lowestPrice = Math.min(...data.map(d => d.LOW));
    
    const priceChange = lastPrice - firstPrice;
    const changePercent = ((priceChange / firstPrice) * 100);
    const priceRange = highestPrice - lowestPrice;
    const rangePercent = ((priceRange / firstPrice) * 100);
    
    // Calculate daily volatility
    const dailyReturns = data.slice(1).map((day, i) => 
        ((day.CLOSE - data[i].CLOSE) / data[i].CLOSE) * 100
    );
    const avgDailyReturn = dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length;
    const volatility = Math.sqrt(dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - avgDailyReturn, 2), 0) / (dailyReturns.length - 1));
    
    let volatilityLevel;
    if (volatility > 8) volatilityLevel = "Very High";
    else if (volatility > 5) volatilityLevel = "High";
    else if (volatility > 3) volatilityLevel = "Moderate";
    else if (volatility > 1.5) volatilityLevel = "Low";
    else volatilityLevel = "Very Low";
    
    return {
        start_price: formatTokenMetricsNumber(firstPrice, 'currency'),
        end_price: formatTokenMetricsNumber(lastPrice, 'currency'),
        price_change: formatTokenMetricsNumber(priceChange, 'currency'),
        change_percent: formatTokenMetricsNumber(changePercent, 'percentage'),
        highest_price: formatTokenMetricsNumber(highestPrice, 'currency'),
        lowest_price: formatTokenMetricsNumber(lowestPrice, 'currency'),
        price_range: formatTokenMetricsNumber(priceRange, 'currency'),
        range_percent: formatTokenMetricsNumber(rangePercent, 'percentage'),
        daily_volatility: formatTokenMetricsNumber(volatility, 'percentage'),
        volatility_level: volatilityLevel,
        direction: priceChange > 0 ? "Bullish" : priceChange < 0 ? "Bearish" : "Sideways",
        momentum: calculateMomentum(data)
    };
}

function analyzeDailyVolumePatterns(data: any[]): any {
    const volumes = data.map(d => d.VOLUME).filter(v => v > 0);
    if (volumes.length === 0) return { average_volume: 0, pattern: "No data" };
    
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    const maxVolume = Math.max(...volumes);
    const minVolume = Math.min(...volumes);
    
    // Analyze volume-price correlation
    const priceChanges = data.slice(1).map((day, i) => day.CLOSE - data[i].CLOSE);
    const volumePriceCorrelation = calculateCorrelation(volumes.slice(1), priceChanges);
    
    // Volume trend analysis
    const recentVolume = volumes.slice(-7).reduce((sum, vol) => sum + vol, 0) / 7; // Last 7 days
    const earlierVolume = volumes.slice(-14, -7).reduce((sum, vol) => sum + vol, 0) / 7; // Previous 7 days
    const volumeTrend = recentVolume > earlierVolume * 1.1 ? "Increasing" : 
                       recentVolume < earlierVolume * 0.9 ? "Decreasing" : "Stable";
    
    return {
        average_volume: formatTokenMetricsNumber(avgVolume, 'currency'),
        max_volume: formatTokenMetricsNumber(maxVolume, 'currency'),
        min_volume: formatTokenMetricsNumber(minVolume, 'currency'),
        volume_trend: volumeTrend,
        volume_price_correlation: volumePriceCorrelation.toFixed(3),
        volume_pattern: classifyVolumePattern(volumes),
        volume_confirmation: analyzeVolumeConfirmation(data)
    };
}

function analyzeTechnicalIndicators(data: any[]): any {
    if (data.length < 20) return { status: "Insufficient data for technical analysis" };
    
    const closes = data.map(d => d.CLOSE);
    
    // Moving averages
    const sma20 = calculateSMA(closes, 20);
    const sma50 = calculateSMA(closes, 50);
    const currentPrice = closes[closes.length - 1];
    
    // RSI calculation
    const rsi = calculateRSI(closes, 14);
    
    // MACD calculation (simplified)
    const ema12 = calculateEMA(closes, 12);
    const ema26 = calculateEMA(closes, 26);
    const macd = ema12[ema12.length - 1] - ema26[ema26.length - 1];
    
    return {
        moving_averages: {
            sma_20: formatTokenMetricsNumber(sma20, 'currency'),
            sma_50: formatTokenMetricsNumber(sma50, 'currency'),
            price_vs_sma20: currentPrice > sma20 ? "Above" : "Below",
            price_vs_sma50: currentPrice > sma50 ? "Above" : "Below",
            ma_alignment: sma20 > sma50 ? "Bullish" : "Bearish"
        },
        momentum_indicators: {
            rsi: rsi.toFixed(2),
            rsi_signal: interpretRSI(rsi),
            macd: macd.toFixed(4),
            macd_signal: macd > 0 ? "Bullish" : "Bearish"
        },
        technical_bias: determineTechnicalBias(currentPrice, sma20, sma50, rsi)
    };
}

function analyzeDailyTrend(data: any[]): any {
    if (data.length < 5) return { primary_trend: "Unknown" };
    
    const closes = data.map(d => d.CLOSE);
    const highs = data.map(d => d.HIGH);
    const lows = data.map(d => d.LOW);
    
    // Trend identification using multiple timeframes
    const shortTrend = identifyTrend(closes.slice(-5));  // Last 5 days
    const mediumTrend = identifyTrend(closes.slice(-15)); // Last 15 days
    const longTrend = identifyTrend(closes); // Full period
    
    // Higher highs and higher lows analysis
    const higherHighs = countHigherHighs(highs.slice(-10));
    const higherLows = countHigherLows(lows.slice(-10));
    
    // Primary trend determination
    let primaryTrend;
    if (shortTrend === "Up" && mediumTrend === "Up") primaryTrend = "Strong Uptrend";
    else if (shortTrend === "Down" && mediumTrend === "Down") primaryTrend = "Strong Downtrend";
    else if (shortTrend === "Up") primaryTrend = "Uptrend";
    else if (shortTrend === "Down") primaryTrend = "Downtrend";
    else primaryTrend = "Sideways";
    
    return {
        primary_trend: primaryTrend,
        short_term_trend: shortTrend,
        medium_term_trend: mediumTrend,
        long_term_trend: longTrend,
        trend_strength: calculateTrendStrength(closes),
        higher_highs: higherHighs,
        higher_lows: higherLows,
        trend_consistency: analyzeTrendConsistency(closes)
    };
}

function analyzeSupportResistance(data: any[]): any {
    if (data.length < 10) return { levels: "Insufficient data" };
    
    const highs = data.map(d => d.HIGH);
    const lows = data.map(d => d.LOW);
    const closes = data.map(d => d.CLOSE);
    
    // Find potential support and resistance levels
    const resistanceLevels = findResistanceLevels(highs);
    const supportLevels = findSupportLevels(lows);
    const currentPrice = closes[closes.length - 1];
    
    return {
        nearest_resistance: findNearestLevel(currentPrice, resistanceLevels, "resistance"),
        nearest_support: findNearestLevel(currentPrice, supportLevels, "support"),
        key_levels: {
            major_resistance: formatTokenMetricsNumber(Math.max(...resistanceLevels), 'currency'),
            major_support: formatTokenMetricsNumber(Math.min(...supportLevels), 'currency')
        },
        level_strength: "Based on price action and volume confirmation"
    };
}

function generateDailyInsights(priceAnalysis: any, volumeAnalysis: any, technicalAnalysis: any, trendAnalysis: any): string[] {
    const insights = [];
    
    // Price movement insights
    const changePercent = parseFloat(priceAnalysis.change_percent);
    if (Math.abs(changePercent) > 20) {
        insights.push(`Significant price movement of ${priceAnalysis.change_percent} over the analyzed period indicates strong market sentiment`);
    }
    
    // Trend insights
    if (trendAnalysis.primary_trend === "Strong Uptrend") {
        insights.push("Strong uptrend with multiple timeframe confirmation suggests continued bullish momentum");
    } else if (trendAnalysis.primary_trend === "Strong Downtrend") {
        insights.push("Strong downtrend across timeframes indicates sustained selling pressure");
    }
    
    // Volume insights
    if (volumeAnalysis.volume_trend === "Increasing" && trendAnalysis.primary_trend.includes("Uptrend")) {
        insights.push("Increasing volume during uptrend confirms buyer interest and trend sustainability");
    } else if (volumeAnalysis.volume_trend === "Decreasing" && trendAnalysis.primary_trend.includes("Uptrend")) {
        insights.push("Decreasing volume during uptrend suggests potential weakening momentum");
    }
    
    // Technical insights
    if (technicalAnalysis.technical_bias === "Strongly Bullish") {
        insights.push("Technical indicators align bullishly - price above key moving averages with positive momentum");
    } else if (technicalAnalysis.technical_bias === "Strongly Bearish") {
        insights.push("Technical indicators show bearish alignment suggesting continued downside pressure");
    }
    
    return insights;
}

function generateDailyTradingRecommendations(trendAnalysis: any, technicalAnalysis: any, volumeAnalysis: any): any {
    const recommendations = [];
    let overallBias = "NEUTRAL";
    
    // Trend-based recommendations
    if (trendAnalysis.primary_trend === "Strong Uptrend") {
        recommendations.push("Consider long positions on pullbacks to support levels");
        overallBias = "BULLISH";
    } else if (trendAnalysis.primary_trend === "Strong Downtrend") {
        recommendations.push("Consider short positions or avoid longs until trend reversal");
        overallBias = "BEARISH";
    }
    
    // Technical recommendations
    if (technicalAnalysis.momentum_indicators?.rsi_signal === "Oversold") {
        recommendations.push("RSI oversold condition may present buying opportunity");
    } else if (technicalAnalysis.momentum_indicators?.rsi_signal === "Overbought") {
        recommendations.push("RSI overbought condition suggests caution for new long positions");
    }
    
    // Volume-based recommendations
    if (volumeAnalysis.volume_trend === "Increasing") {
        recommendations.push("Increasing volume supports current trend continuation");
    }
    
    return {
        overall_bias: overallBias,
        recommendations: recommendations,
        risk_management: [
            "Use appropriate position sizing based on volatility",
            "Set stop losses at key support/resistance levels",
            "Monitor volume for trend confirmation"
        ]
    };
}

function generateInvestmentSignals(priceAnalysis: any, trendAnalysis: any, technicalAnalysis: any): any {
    let investmentSignal = "HOLD";
    const signals = [];
    
    // Long-term investment signals
    if (trendAnalysis.long_term_trend === "Up" && technicalAnalysis.technical_bias === "Bullish") {
        investmentSignal = "BUY";
        signals.push("Long-term uptrend with positive technical indicators supports accumulation");
    } else if (trendAnalysis.long_term_trend === "Down" && technicalAnalysis.technical_bias === "Bearish") {
        investmentSignal = "SELL";
        signals.push("Long-term downtrend with negative technicals suggests distribution");
    }
    
    // Volatility considerations
    if (priceAnalysis.volatility_level === "Very High") {
        signals.push("High volatility suggests using dollar-cost averaging for entries");
    }
    
    return {
        signal: investmentSignal,
        confidence: determineSignalConfidence(trendAnalysis, technicalAnalysis),
        rationale: signals,
        time_horizon: "Medium to long-term (weeks to months)"
    };
}

// Helper functions for calculations

function calculateMomentum(data: any[]): string {
    if (data.length < 5) return "Unknown";
    
    const recentClose = data[data.length - 1].CLOSE;
    const pastClose = data[data.length - 5].CLOSE;
    const momentum = ((recentClose - pastClose) / pastClose) * 100;
    
    if (momentum > 5) return "Strong Positive";
    if (momentum > 2) return "Positive";
    if (momentum > -2) return "Neutral";
    if (momentum > -5) return "Negative";
    return "Strong Negative";
}

function calculateCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n < 2) return 0;
    
    const xMean = x.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
    const yMean = y.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let xSumSquares = 0;
    let ySumSquares = 0;
    
    for (let i = 0; i < n; i++) {
        const xDiff = x[i] - xMean;
        const yDiff = y[i] - yMean;
        numerator += xDiff * yDiff;
        xSumSquares += xDiff * xDiff;
        ySumSquares += yDiff * yDiff;
    }
    
    const denominator = Math.sqrt(xSumSquares * ySumSquares);
    return denominator === 0 ? 0 : numerator / denominator;
}

function calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1];
    return prices.slice(-period).reduce((sum, price) => sum + price, 0) / period;
}

function calculateEMA(prices: number[], period: number): number[] {
    const ema = [];
    const multiplier = 2 / (period + 1);
    
    ema[0] = prices[0];
    for (let i = 1; i < prices.length; i++) {
        ema[i] = (prices[i] * multiplier) + (ema[i - 1] * (1 - multiplier));
    }
    
    return ema;
}

function calculateRSI(prices: number[], period: number): number {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) gains += change;
        else losses -= change;
    }
    
    let avgGain = gains / period;
    let avgLoss = losses / period;
    
    for (let i = period + 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? -change : 0;
        
        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;
    }
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

function interpretRSI(rsi: number): string {
    if (rsi > 70) return "Overbought";
    if (rsi < 30) return "Oversold";
    return "Neutral";
}

function identifyTrend(prices: number[]): string {
    if (prices.length < 3) return "Unknown";
    
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const change = (lastPrice - firstPrice) / firstPrice;
    
    if (change > 0.02) return "Up";
    if (change < -0.02) return "Down";
    return "Sideways";
}

function countHigherHighs(highs: number[]): number {
    let count = 0;
    for (let i = 1; i < highs.length; i++) {
        if (highs[i] > highs[i - 1]) count++;
    }
    return count;
}

function countHigherLows(lows: number[]): number {
    let count = 0;
    for (let i = 1; i < lows.length; i++) {
        if (lows[i] > lows[i - 1]) count++;
    }
    return count;
}

function calculateTrendStrength(closes: number[]): string {
    if (closes.length < 10) return "Unknown";
    
    const firstPrice = closes[0];
    const lastPrice = closes[closes.length - 1];
    const change = Math.abs((lastPrice - firstPrice) / firstPrice);
    
    if (change > 0.5) return "Very Strong";
    if (change > 0.3) return "Strong";
    if (change > 0.1) return "Moderate";
    return "Weak";
}

function analyzeTrendConsistency(closes: number[]): string {
    if (closes.length < 5) return "Unknown";
    
    let directionalChanges = 0;
    let previousDirection = null;
    
    for (let i = 1; i < closes.length; i++) {
        const currentDirection = closes[i] > closes[i - 1] ? "up" : "down";
        if (previousDirection && currentDirection !== previousDirection) {
            directionalChanges++;
        }
        previousDirection = currentDirection;
    }
    
    const consistency = 1 - (directionalChanges / (closes.length - 1));
    
    if (consistency > 0.8) return "Very Consistent";
    if (consistency > 0.6) return "Consistent";
    if (consistency > 0.4) return "Moderate";
    return "Inconsistent";
}

function findResistanceLevels(highs: number[]): number[] {
    // Simplified resistance level detection
    const levels = [];
    for (let i = 1; i < highs.length - 1; i++) {
        if (highs[i] > highs[i - 1] && highs[i] > highs[i + 1]) {
            levels.push(highs[i]);
        }
    }
    return levels.sort((a, b) => b - a).slice(0, 3); // Top 3 resistance levels
}

function findSupportLevels(lows: number[]): number[] {
    // Simplified support level detection
    const levels = [];
    for (let i = 1; i < lows.length - 1; i++) {
        if (lows[i] < lows[i - 1] && lows[i] < lows[i + 1]) {
            levels.push(lows[i]);
        }
    }
    return levels.sort((a, b) => a - b).slice(0, 3); // Bottom 3 support levels
}

function findNearestLevel(currentPrice: number, levels: number[], type: string): string {
    if (levels.length === 0) return "None identified";
    
    const nearestLevel = levels.reduce((nearest, level) => {
        return Math.abs(level - currentPrice) < Math.abs(nearest - currentPrice) ? level : nearest;
    });
    
    const distance = ((nearestLevel - currentPrice) / currentPrice) * 100;
    return `${formatTokenMetricsNumber(nearestLevel, 'currency')} (${distance.toFixed(2)}% ${distance > 0 ? 'above' : 'below'})`;
}

function determineTechnicalBias(price: number, sma20: number, sma50: number, rsi: number): string {
    let score = 0;
    
    if (price > sma20) score += 1;
    if (price > sma50) score += 1;
    if (sma20 > sma50) score += 1;
    if (rsi > 50) score += 1;
    
    if (score >= 3) return "Bullish";
    if (score <= 1) return "Bearish";
    return "Neutral";
}

function classifyVolumePattern(volumes: number[]): string {
    const recentAvg = volumes.slice(-5).reduce((sum, vol) => sum + vol, 0) / 5;
    const overallAvg = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    
    if (recentAvg > overallAvg * 1.5) return "High Volume Spike";
    if (recentAvg > overallAvg * 1.2) return "Above Average";
    if (recentAvg < overallAvg * 0.8) return "Below Average";
    return "Normal";
}

function analyzeVolumeConfirmation(data: any[]): string {
    if (data.length < 5) return "Insufficient data";
    
    const recentDays = data.slice(-5);
    let confirmedMoves = 0;
    
    for (let i = 1; i < recentDays.length; i++) {
        const priceChange = recentDays[i].CLOSE - recentDays[i - 1].CLOSE;
        const volumeIncrease = recentDays[i].VOLUME > recentDays[i - 1].VOLUME;
        
        if (Math.abs(priceChange) > 0 && volumeIncrease) {
            confirmedMoves++;
        }
    }
    
    const confirmationRate = confirmedMoves / (recentDays.length - 1);
    
    if (confirmationRate > 0.6) return "Strong Confirmation";
    if (confirmationRate > 0.4) return "Moderate Confirmation";
    return "Weak Confirmation";
}

function calculateDailyDataCompleteness(data: any[]): string {
    const requiredFields = ['OPEN', 'HIGH', 'LOW', 'CLOSE', 'VOLUME'];
    let completeness = 0;
    
    data.forEach(item => {
        const presentFields = requiredFields.filter(field => item[field] !== null && item[field] !== undefined);
        completeness += presentFields.length / requiredFields.length;
    });
    
    const completenessPercent = (completeness / data.length) * 100;
    return `${completenessPercent.toFixed(1)}%`;
}

function determineSignalConfidence(trendAnalysis: any, technicalAnalysis: any): string {
    let confidence = 0;
    
    if (trendAnalysis.trend_consistency === "Very Consistent") confidence += 2;
    else if (trendAnalysis.trend_consistency === "Consistent") confidence += 1;
    
    if (technicalAnalysis.technical_bias === "Bullish" || technicalAnalysis.technical_bias === "Bearish") {
        confidence += 1;
    }
    
    if (trendAnalysis.trend_strength === "Strong" || trendAnalysis.trend_strength === "Very Strong") {
        confidence += 1;
    }
    
    if (confidence >= 3) return "High";
    if (confidence >= 2) return "Moderate";
    return "Low";
}
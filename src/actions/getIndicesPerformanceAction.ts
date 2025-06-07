import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    formatTokenMetricsNumber,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { IndicesPerformanceResponse, IndicesPerformanceRequest } from "../types";

/**
 * INDICES PERFORMANCE ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/indices-performance
 * 
 * This action returns the historical performance data of a given index over time.
 * Essential for analyzing index performance trends and making investment decisions.
 */
export const getIndicesPerformanceAction: Action = {
    name: "getIndicesPerformance",
    description: "Get historical performance data of a crypto index including returns, volatility, and benchmark comparisons from TokenMetrics",
    similes: [
        "get index performance",
        "index returns",
        "index history",
        "index performance data",
        "index analytics",
        "index tracking",
        "index performance analysis",
        "index time series"
    ],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me the performance of crypto index 1"
                }
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll get the historical performance data for that crypto index including returns and volatility metrics.",
                    action: "GET_INDICES_PERFORMANCE"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "How has the DeFi index performed over the last 3 months?"
                }
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Let me analyze the DeFi index performance data over the specified time period.",
                    action: "GET_INDICES_PERFORMANCE"
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
                throw new Error("Index ID is required. Please specify which index performance you want to view (e.g., id: 1)");
            }
            
            // Build parameters based on actual API documentation
            const requestParams: IndicesPerformanceRequest = {
                id: Number(indexId),
                startDate: typeof messageContent.startDate === 'string' ? messageContent.startDate : undefined,
                endDate: typeof messageContent.endDate === 'string' ? messageContent.endDate : undefined,
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : 50,
                page: typeof messageContent.page === 'number' ? messageContent.page : 1
            };
            
            // Validate parameters according to actual API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            
            // Make API call with corrected authentication
            const response = await callTokenMetricsApi<IndicesPerformanceResponse>(
                TOKENMETRICS_ENDPOINTS.indicesPerformance,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<IndicesPerformanceResponse>(response, "getIndicesPerformance");
            const performance = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the performance data
            const performanceAnalysis = analyzePerformanceData(performance);
            
            return {
                success: true,
                message: `Successfully retrieved performance data for index ${indexId} with ${performance.length} data points`,
                indices_performance: performance,
                analysis: performanceAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.indicesPerformance,
                    index_id: indexId,
                    date_range: {
                        start_date: requestParams.startDate,
                        end_date: requestParams.endDate
                    },
                    pagination: {
                        page: requestParams.page,
                        limit: requestParams.limit
                    },
                    data_points: performance.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Indices Engine"
                },
                performance_explanation: {
                    purpose: "Index performance data tracks historical returns and risk metrics over time",
                    key_metrics: [
                        "Index Value - The calculated value of the index at each point in time",
                        "Daily Return - Day-over-day return in absolute and percentage terms",
                        "Cumulative Return - Total return from inception or start date",
                        "Volatility - Risk measurement showing price variability",
                        "Benchmark Comparison - Performance relative to market benchmarks"
                    ],
                    performance_insights: [
                        "Consistent positive returns indicate strong index strategy",
                        "Lower volatility suggests more stable investment experience",
                        "Cumulative returns show long-term wealth creation potential",
                        "Benchmark outperformance demonstrates active management value"
                    ],
                    usage_guidelines: [
                        "Compare cumulative returns across different time periods",
                        "Evaluate volatility for risk assessment and position sizing",
                        "Monitor daily returns for recent performance trends",
                        "Use benchmark comparison to assess relative performance",
                        "Consider drawdown periods for worst-case scenario planning"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getIndicesPerformance action:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve indices performance data from TokenMetrics"
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
 * Analyze performance data to provide strategic insights
 */
function analyzePerformanceData(performance: any[]): any {
    if (!performance || performance.length === 0) {
        return {
            summary: "No performance data available for this index",
            insights: [],
            recommendations: []
        };
    }

    // Sort by date to ensure chronological order
    const sortedPerformance = performance.sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
    
    // Calculate performance metrics from INDEX_CUMULATIVE_ROI
    const latestData = sortedPerformance[sortedPerformance.length - 1];
    const earliestData = sortedPerformance[0];
    
    // Calculate total return from cumulative ROI values
    const latestROI = latestData.INDEX_CUMULATIVE_ROI || 0;
    const earliestROI = earliestData.INDEX_CUMULATIVE_ROI || 0;
    const totalReturn = latestROI - earliestROI;
    
    // Calculate daily returns from consecutive ROI values
    const dailyReturns: number[] = [];
    for (let i = 1; i < sortedPerformance.length; i++) {
        const currentROI = sortedPerformance[i].INDEX_CUMULATIVE_ROI || 0;
        const previousROI = sortedPerformance[i - 1].INDEX_CUMULATIVE_ROI || 0;
        const dailyReturn = currentROI - previousROI;
        dailyReturns.push(dailyReturn);
    }
    
    const avgDailyReturn = dailyReturns.length > 0 
        ? dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length
        : 0;
    
    // Calculate volatility from daily returns
    const avgReturn = avgDailyReturn;
    const variance = dailyReturns.length > 0 
        ? dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / dailyReturns.length
        : 0;
    const volatility = Math.sqrt(variance);
    
    // Find best and worst performing days
    const bestDay = dailyReturns.length > 0 ? Math.max(...dailyReturns) : 0;
    const worstDay = dailyReturns.length > 0 ? Math.min(...dailyReturns) : 0;
    
    // Calculate win rate (percentage of positive days)
    const positiveDays = dailyReturns.filter(ret => ret > 0).length;
    const winRate = dailyReturns.length > 0 ? (positiveDays / dailyReturns.length) * 100 : 0;
    
    // Analyze recent performance (last 7 days if available)
    const recentData = sortedPerformance.slice(-7);
    const recentReturn = recentData.length > 1 
        ? (recentData[recentData.length - 1].INDEX_CUMULATIVE_ROI - recentData[0].INDEX_CUMULATIVE_ROI)
        : 0;

    const insights = [
        `📊 Performance Period: ${new Date(earliestData.DATE).toLocaleDateString()} to ${new Date(latestData.DATE).toLocaleDateString()}`,
        `📈 Total Return: ${formatTokenMetricsNumber(totalReturn, 'percentage')}`,
        `📅 Average Daily Return: ${formatTokenMetricsNumber(avgDailyReturn, 'percentage')}`,
        `⚡ Volatility: ${formatTokenMetricsNumber(volatility, 'percentage')}`,
        `🏆 Best Day: ${formatTokenMetricsNumber(bestDay, 'percentage')}`,
        `📉 Worst Day: ${formatTokenMetricsNumber(worstDay, 'percentage')}`,
        `🎯 Win Rate: ${formatTokenMetricsNumber(winRate, 'percentage')} of days positive`
    ];

    const recommendations = [
        totalReturn > 0 ? 
            "✅ Positive Performance: Index has generated positive returns over the period" :
            "⚠️ Negative Performance: Index has declined - review strategy and market conditions",
        winRate > 55 ? 
            "✅ Strong Consistency: High percentage of positive days indicates consistent performance" :
            "⚠️ Inconsistent Performance: Lower win rate suggests higher volatility in daily returns",
        volatility > 0.3 ? 
            "⚠️ High Volatility: Significant price swings - consider position sizing and risk management" :
            "✅ Moderate Volatility: Reasonable risk levels for crypto investments",
        Math.abs(recentReturn) > 0.1 ? 
            "⚡ Recent Volatility: Significant recent price movements - monitor closely" :
            "📊 Stable Recent Performance: Index showing stable recent performance"
    ];

    // Calculate Sharpe-like ratio (return/volatility)
    const riskAdjustedReturn = volatility > 0 ? (avgDailyReturn * Math.sqrt(365)) / volatility : 0;

    return {
        summary: `Index performance over ${performance.length} data points showing ${formatTokenMetricsNumber(totalReturn, 'percentage')} total return with ${formatTokenMetricsNumber(volatility, 'percentage')} volatility`,
        performance_metrics: {
            total_return: totalReturn,
            avg_daily_return: avgDailyReturn,
            avg_volatility: volatility,
            best_day: bestDay,
            worst_day: worstDay,
            win_rate: winRate,
            recent_7day_return: recentReturn,
            risk_adjusted_return: riskAdjustedReturn
        },
        time_period: {
            start_date: earliestData.DATE,
            end_date: latestData.DATE,
            data_points: performance.length,
            trading_days: dailyReturns.length
        },
        latest_values: {
            index_cumulative_roi: latestData.INDEX_CUMULATIVE_ROI,
            market_cap: latestData.MARKET_CAP,
            volume: latestData.VOLUME,
            fdv: latestData.FDV
        },
        insights,
        recommendations,
        investment_considerations: [
            "📈 Evaluate total return vs investment timeline",
            "⚖️ Consider volatility relative to risk tolerance",
            "🎯 Compare performance to relevant benchmarks",
            "📊 Analyze consistency through win rate metrics",
            "🔄 Review drawdown periods for risk assessment",
            "💰 Factor in fees and expenses for net returns",
            "📅 Consider market cycle timing for context"
        ]
    };
} 
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
import type { IndicesPerformanceResponse } from "../types";

// Zod schema for indices performance request validation
const IndicesPerformanceRequestSchema = z.object({
    indexId: z.number().min(1).describe("The ID of the index to get performance data for"),
    startDate: z.string().optional().describe("Start date for performance data (YYYY-MM-DD format)"),
    endDate: z.string().optional().describe("End date for performance data (YYYY-MM-DD format)"),
    limit: z.number().min(1).max(1000).optional().describe("Number of data points to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["returns", "risk", "comparison", "all"]).optional().describe("Type of analysis to focus on")
});

type IndicesPerformanceRequest = z.infer<typeof IndicesPerformanceRequestSchema>;

// AI extraction template for natural language processing
const INDICES_PERFORMANCE_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting crypto index performance requests from natural language.

The user wants to get historical performance data for a specific crypto index. Extract the following information:

1. **indexId** (required): The ID number of the index they want performance data for
   - Look for phrases like "index 1", "index ID 5", "index number 3"
   - Extract the numeric ID from the request
   - This is required - if no ID is found, ask for clarification

2. **startDate** (optional): Start date for the performance period
   - Look for phrases like "since January 2024", "from 2024-01-01", "last 3 months"
   - Convert relative dates to YYYY-MM-DD format if possible
   - If not specified, will use default range

3. **endDate** (optional): End date for the performance period
   - Look for phrases like "until today", "to 2024-12-31", "through December"
   - Convert to YYYY-MM-DD format if possible
   - If not specified, will use current date

4. **limit** (optional, default: 50): Number of data points to return
   - Look for phrases like "50 data points", "100 records", "daily data"

5. **page** (optional, default: 1): Page number for pagination

6. **analysisType** (optional, default: "all"): What type of analysis they want
   - "returns" - focus on return metrics and performance
   - "risk" - focus on volatility and risk metrics
   - "comparison" - focus on benchmark comparisons
   - "all" - comprehensive analysis

Examples:
- "Show me performance of index 1" → {indexId: 1, analysisType: "all"}
- "Get index 3 returns since January 2024" → {indexId: 3, startDate: "2024-01-01", analysisType: "returns"}
- "Risk analysis for index 2 last 6 months" → {indexId: 2, analysisType: "risk"}
- "Compare index 1 performance to benchmarks" → {indexId: 1, analysisType: "comparison"}

Extract the request details from the user's message.
`;

/**
 * INDICES PERFORMANCE ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/indices-performance
 * 
 * This action returns the historical performance data of a given index over time.
 * Essential for analyzing index performance trends and making investment decisions.
 */
export const getIndicesPerformanceAction: Action = {
    name: "GET_INDICES_PERFORMANCE_TOKENMETRICS",
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
                    action: "GET_INDICES_PERFORMANCE_TOKENMETRICS"
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
                    action: "GET_INDICES_PERFORMANCE_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get risk analysis for index 2 performance"
                }
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll analyze the risk metrics and volatility for index 2's historical performance.",
                    action: "GET_INDICES_PERFORMANCE_TOKENMETRICS"
                }
            }
        ]
    ],
    
    async handler(runtime, message, _state) {
        try {
            const requestId = generateRequestId();
            console.log(`[${requestId}] Processing indices performance request...`);
            
            // Extract structured request using AI
            const performanceRequest = await extractTokenMetricsRequest<IndicesPerformanceRequest>(
                runtime,
                message,
                _state || await runtime.composeState(message),
                INDICES_PERFORMANCE_EXTRACTION_TEMPLATE,
                IndicesPerformanceRequestSchema,
                requestId
            );
            
            console.log(`[${requestId}] Extracted request:`, performanceRequest);
            
            // Apply defaults for optional fields
            const processedRequest = {
                indexId: performanceRequest.indexId,
                startDate: performanceRequest.startDate,
                endDate: performanceRequest.endDate,
                limit: performanceRequest.limit || 50,
                page: performanceRequest.page || 1,
                analysisType: performanceRequest.analysisType || "all"
            };
            
            // Build API parameters
            const apiParams: Record<string, any> = {
                id: processedRequest.indexId,
                limit: processedRequest.limit,
                page: processedRequest.page
            };
            
            // Add optional date parameters if provided
            if (processedRequest.startDate) {
                apiParams.startDate = processedRequest.startDate;
            }
            if (processedRequest.endDate) {
                apiParams.endDate = processedRequest.endDate;
            }
            
            // Make API call
            const response = await callTokenMetricsAPI(
                "/v2/indices-performance",
                apiParams,
                runtime
            );
            
            console.log(`[${requestId}] API response received, processing data...`);
            
            // Process response data
            const performance = Array.isArray(response) ? response : response.data || [];
            
            // Analyze the performance data based on requested analysis type
            const performanceAnalysis = analyzePerformanceData(performance, processedRequest.analysisType);
            
            const result = {
                success: true,
                message: `Successfully retrieved performance data for index ${processedRequest.indexId} with ${performance.length} data points`,
                request_id: requestId,
                indices_performance: performance,
                analysis: performanceAnalysis,
                metadata: {
                    endpoint: "indices-performance",
                    index_id: processedRequest.indexId,
                    date_range: {
                        start_date: processedRequest.startDate,
                        end_date: processedRequest.endDate
                    },
                    pagination: {
                        page: processedRequest.page,
                        limit: processedRequest.limit
                    },
                    analysis_focus: processedRequest.analysisType,
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
            
            console.log(`[${requestId}] Indices performance analysis completed successfully`);
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
                            endpoint: "indicesperformance",
                            data_source: "TokenMetrics Official API",
                            api_version: "v2"
                        }
                    }
                });
            }
            
            return true;
        } catch (error) {
            console.error("Error in getIndicesPerformance action:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve indices performance data from TokenMetrics"
            };
        }
    },

    async validate(runtime, _message) {
        return validateAndGetApiKey(runtime) !== null;
    }
};

/**
 * Analyze performance data to provide strategic insights based on analysis type
 */
function analyzePerformanceData(performance: any[], analysisType: string = "all"): any {
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

    // Base insights
    const insights = [
        `📊 Performance Period: ${new Date(earliestData.DATE).toLocaleDateString()} to ${new Date(latestData.DATE).toLocaleDateString()}`,
        `📈 Total Return: ${formatPercentage(totalReturn)}`,
        `📅 Average Daily Return: ${formatPercentage(avgDailyReturn)}`,
        `⚡ Volatility: ${formatPercentage(volatility)}`,
        `🏆 Best Day: ${formatPercentage(bestDay)}`,
        `📉 Worst Day: ${formatPercentage(worstDay)}`,
        `🎯 Win Rate: ${formatPercentage(winRate)} of days positive`
    ];

    // Base recommendations
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

    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "returns":
            focusedAnalysis = {
                returns_focus: {
                    return_metrics: {
                        total_return: totalReturn,
                        annualized_return: avgDailyReturn * 365,
                        best_period: bestDay,
                        worst_period: worstDay
                    },
                    returns_insights: [
                        `📈 Annualized return: ${formatPercentage(avgDailyReturn * 365)}`,
                        `🎯 Return consistency: ${formatPercentage(winRate)} win rate`,
                        `📊 Return range: ${formatPercentage(worstDay)} to ${formatPercentage(bestDay)}`
                    ]
                }
            };
            break;
            
        case "risk":
            focusedAnalysis = {
                risk_focus: {
                    risk_metrics: {
                        volatility: volatility,
                        risk_adjusted_return: riskAdjustedReturn,
                        max_drawdown: worstDay,
                        value_at_risk: calculateVaR(dailyReturns)
                    },
                    risk_insights: [
                        `⚡ Daily volatility: ${formatPercentage(volatility)}`,
                        `📊 Risk-adjusted return: ${riskAdjustedReturn.toFixed(2)}`,
                        `📉 Maximum single-day loss: ${formatPercentage(worstDay)}`
                    ]
                }
            };
            break;
            
        case "comparison":
            focusedAnalysis = {
                comparison_focus: {
                    benchmark_analysis: {
                        relative_performance: "Benchmark comparison requires additional data",
                        market_correlation: "Correlation analysis requires market data"
                    },
                    comparison_insights: [
                        `📊 Performance vs market: Requires benchmark data for comparison`,
                        `🎯 Relative strength: ${totalReturn > 0 ? "Positive absolute returns" : "Negative absolute returns"}`,
                        `📈 Risk profile: ${volatility > 0.2 ? "Higher risk" : "Moderate risk"} compared to traditional assets`
                    ]
                }
            };
            break;
    }

    return {
        summary: `Index performance over ${performance.length} data points showing ${formatPercentage(totalReturn)} total return with ${formatPercentage(volatility)} volatility`,
        analysis_type: analysisType,
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
        ...focusedAnalysis,
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

/**
 * Calculate Value at Risk (VaR) at 95% confidence level
 */
function calculateVaR(returns: number[], confidence: number = 0.05): number {
    if (returns.length === 0) return 0;
    
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const index = Math.floor(returns.length * confidence);
    return sortedReturns[index] || 0;
} 
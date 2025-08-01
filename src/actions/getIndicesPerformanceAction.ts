import type { Action, ActionResult } from "@elizaos/core";
import {
    type IAgentRuntime,
    type Memory,
    type State,
    type HandlerCallback,
    elizaLogger,
    createActionResult
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

// Template for extracting indices performance information (Updated to XML format)
const indicesPerformanceTemplate = `Extract indices performance request information from the message.

IMPORTANT: Extract the EXACT index number mentioned by the user in their message.

Index performance provides:
- Historical returns and performance metrics
- Risk-adjusted performance analysis
- Benchmark comparisons
- Volatility and drawdown metrics
- Sharpe and Sortino ratios
- Performance attribution

Instructions:
Look for INDEX PERFORMANCE requests, such as:
- Performance analysis ("Performance of index [NUMBER]", "Index returns")
- Risk metrics ("Risk analysis", "Volatility metrics")
- Benchmark comparison ("Index vs market", "Performance comparison")
- Historical analysis ("Historical performance", "Long-term returns")

EXAMPLES (extract the actual index number from user's message):
- "Show me performance of index [X]" → extract X as indexId
- "Get performance metrics for crypto index [Y]" → extract Y as indexId
- "Index [Z] risk and return analysis" → extract Z as indexId
- "Compare index performance to market" → no specific index mentioned

Respond with an XML block containing only the extracted values:

<response>
<indexId>numeric ID of the index</indexId>
<analysisType>returns|risk|comparison|all</analysisType>
<timeframe>short_term|medium_term|long_term|all</timeframe>
<focusArea>performance|volatility|risk_adjusted|general</focusArea>
</response>`;

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
                name: "{{user1}}",
                content: {
                    text: "Show me performance of index 1"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll get the performance metrics for index 1.",
                    action: "GET_INDICES_PERFORMANCE_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Get performance metrics for crypto index 5"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll retrieve comprehensive performance analysis for index 5.",
                    action: "GET_INDICES_PERFORMANCE_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Index 3 risk and return analysis"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll analyze both risk and return metrics for index 3.",
                    action: "GET_INDICES_PERFORMANCE_TOKENMETRICS"
                }
            }
        ]
    ],
    
    async handler(
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<ActionResult> {
        try {
            const requestId = generateRequestId();
            console.log(`[${requestId}] Processing indices performance request...`);
            
            // Get user message for injection
            const userMessage = message.content?.text || "";
            const enhancedTemplate = indicesPerformanceTemplate + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
            
            // Extract structured request using AI
            const performanceRequest = await extractTokenMetricsRequest<IndicesPerformanceRequest>(
                runtime,
                message,
                state || await runtime.composeState(message),
                enhancedTemplate,
                IndicesPerformanceRequestSchema,
                requestId
            );
            
            console.log(`[${requestId}] Extracted request:`, performanceRequest);
            
            // Apply defaults for optional fields
            const processedRequest = {
                indexId: performanceRequest?.indexId,
                startDate: performanceRequest?.startDate,
                endDate: performanceRequest?.endDate,
                limit: performanceRequest?.limit || 50,
                page: performanceRequest?.page || 1,
                analysisType: performanceRequest?.analysisType || "all"
            };
            
            // Validate that index ID is provided (required by API)
            if (!processedRequest.indexId) {
                const errorMessage = "⚠️ **Index ID Required**\n\n" +
                    "The indices performance endpoint requires a specific index ID. Please specify which index you want to analyze.\n\n" +
                    "**Examples:**\n" +
                    "• \"Show me performance of index 1\"\n" +
                    "• \"Get performance for index 3\"\n" +
                    "• \"Index 5 performance metrics\"\n\n" +
                    "**Common Index IDs:**\n" +
                    "• Index 1: Often the main crypto index\n" +
                    "• Index 3: May be DeFi-focused index\n" +
                    "• Index 5: Could be large-cap index\n\n" +
                    "Please try again with a specific index number.";
                
                console.log(`[${requestId}] ❌ No index ID provided in request`);
                
                if (callback) {
                    await callback({
                        text: errorMessage,
                        content: {
                            success: false,
                            error: "Missing required index ID",
                            request_id: requestId,
                            help: "Specify an index ID (e.g., 'performance of index 1')"
                        }
                    });
                }
                
                return createActionResult({
                    success: false,
                    error: "Index ID is required for performance lookup"
                });
            }
            
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
            
            // Debug: Check what index ID the API actually returned
            if (performance.length > 0) {
                const firstDataPoint = performance[0];
                const returnedIndexId = firstDataPoint?.ID || firstDataPoint?.INDEX_ID;
                console.log(`[${requestId}] 🔍 Requested Index: ${processedRequest.indexId}, API Returned Index: ${returnedIndexId}`);
                
                if (returnedIndexId && returnedIndexId !== processedRequest.indexId) {
                    console.log(`[${requestId}] ⚠️ INDEX MISMATCH: Requested ${processedRequest.indexId} but got ${returnedIndexId}`);
                }
            }
            
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
            
            // Format response text for user
            const responseText = formatIndicesPerformanceResponse(result);
            
            console.log(`[${requestId}] Analysis completed successfully`);
            
            // Use callback to send response to user (like working actions)
            if (callback) {
                await callback({
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
            
            return createActionResult({
                success: true,
                text: responseText,
                data: {
                    performance_data: performance,
                    analysis: performanceAnalysis,
                    source: "TokenMetrics Indices Performance API",
                    request_id: requestId
                }
            });
        } catch (error) {
            console.error("Error in getIndicesPerformance action:", error);
            
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            const reqId = generateRequestId();
            
            if (callback) {
                await callback({
                    text: `❌ Error fetching indices performance: ${errorMessage}`,
                    content: {
                        error: errorMessage,
                        error_type: error instanceof Error ? error.constructor.name : 'Unknown',
                        troubleshooting: true,
                        request_id: reqId
                    }
                });
            }
            
            return createActionResult({
                success: false,
                error: errorMessage
            });
        }
    },

    validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        elizaLogger.log("🔍 Validating getIndicesPerformanceAction (1.x)");
        
        try {
            validateAndGetApiKey(runtime);
            return true;
        } catch (error) {
            elizaLogger.error("❌ Validation failed:", error);
            return false;
        }
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
 * Calculate Value at Risk (VaR) for performance data
 */
function calculateVaR(returns: number[], confidence: number = 0.05): number {
    if (returns.length === 0) return 0;
    
    const sortedReturns = returns.sort((a, b) => a - b);
    const index = Math.floor(confidence * sortedReturns.length);
    
    return sortedReturns[index] || 0;
}

/**
 * Format indices performance response for user display
 */
function formatIndicesPerformanceResponse(result: any): string {
    const { indices_performance, analysis, metadata } = result;
    
    let response = `📊 **Index Performance Analysis**\n\n`;
    
    if (indices_performance && indices_performance.length > 0) {
        // Check if the API returned data for the correct index
        const firstDataPoint = indices_performance[0];
        const returnedIndexId = firstDataPoint?.ID || firstDataPoint?.INDEX_ID;
        const requestedIndexId = metadata.index_id;
        
        // Show requested vs returned index info
        response += `🎯 **Requested Index:** ${requestedIndexId}\n`;
        if (returnedIndexId && returnedIndexId !== requestedIndexId) {
            response += `⚠️ **API Returned Index:** ${returnedIndexId} (Mismatch detected!)\n`;
        } else if (returnedIndexId) {
            response += `✅ **Confirmed Index:** ${returnedIndexId}\n`;
        }
        response += `📊 **Data Points:** ${indices_performance.length}\n\n`;
        
        // Add performance metrics
        if (analysis && analysis.performance_metrics) {
            const metrics = analysis.performance_metrics;
            response += `📈 **Performance Summary:**\n`;
            if (metrics.total_return !== undefined) {
                response += `• Total Return: ${formatPercentage(metrics.total_return)}\n`;
            }
            if (metrics.avg_daily_return !== undefined) {
                response += `• Average Daily Return: ${formatPercentage(metrics.avg_daily_return)}\n`;
            }
            if (metrics.avg_volatility !== undefined) {
                response += `• Volatility: ${formatPercentage(metrics.avg_volatility)}\n`;
            }
            if (metrics.win_rate !== undefined) {
                response += `• Win Rate: ${formatPercentage(metrics.win_rate)}\n`;
            }
            if (metrics.best_day !== undefined) {
                response += `• Best Day: ${formatPercentage(metrics.best_day)}\n`;
            }
            if (metrics.worst_day !== undefined) {
                response += `• Worst Day: ${formatPercentage(metrics.worst_day)}\n`;
            }
            response += `\n`;
        }
        
        // Add time period info
        if (analysis && analysis.time_period) {
            const period = analysis.time_period;
            response += `📅 **Time Period:**\n`;
            response += `• Start Date: ${period.start_date || 'N/A'}\n`;
            response += `• End Date: ${period.end_date || 'N/A'}\n`;
            response += `• Data Points: ${period.data_points || 0}\n`;
            response += `• Trading Days: ${period.trading_days || 0}\n`;
            response += `\n`;
        }
        
        // Add latest values
        if (analysis && analysis.latest_values) {
            const latest = analysis.latest_values;
            response += `📊 **Latest Values:**\n`;
            if (latest.index_cumulative_roi !== undefined) {
                response += `• Cumulative ROI: ${formatPercentage(latest.index_cumulative_roi)}\n`;
            }
            if (latest.market_cap) {
                response += `• Market Cap: ${formatCurrency(latest.market_cap)}\n`;
            }
            if (latest.volume) {
                response += `• Volume: ${formatCurrency(latest.volume)}\n`;
            }
            response += `\n`;
        }
        
        // Add analysis insights
        if (analysis && analysis.insights) {
            response += `💡 **Key Insights:**\n`;
            analysis.insights.slice(0, 5).forEach((insight: string) => {
                response += `• ${insight}\n`;
            });
            response += `\n`;
        }
        
        // Add recommendations
        if (analysis && analysis.recommendations) {
            response += `🎯 **Recommendations:**\n`;
            analysis.recommendations.slice(0, 3).forEach((rec: string) => {
                response += `• ${rec}\n`;
            });
        }
    } else {
        response += `❌ No performance data found for index ${metadata.index_id}.

This could be due to:
• Invalid index ID
• No performance history available
• Date range outside available data
• API connectivity issues
`;
    }
    
    response += `\n📊 **Data Source**: TokenMetrics Indices Engine\n`;
    response += `⏰ **Updated**: ${new Date().toLocaleString()}\n`;
    
    return response;
} 
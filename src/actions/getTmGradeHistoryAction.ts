import type { Action, ActionExample, ActionResult, HandlerCallback, IAgentRuntime, Memory, State } from "@elizaos/core";
import { elizaLogger, composePromptFromState, parseKeyValueXml, ModelType, createActionResult } from "@elizaos/core";
import { z } from "zod";
import {
    validateAndGetApiKey,
    extractTokenMetricsRequest,
    callTokenMetricsAPI,
    formatCurrency,
    formatPercentage,
    generateRequestId,
    resolveTokenSmart
} from "./aiActionHelper";

/**
 * TokenMetrics TM Grade History Action - ElizaOS 1.x
 * Gets historical TM Grade data for tokens with date ranges and trend analysis
 */

// Zod schema for TM grade history request validation
const TmGradeHistoryRequestSchema = z.object({
    cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
    token_id: z.number().optional().describe("Specific token ID if known"),
    symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
    token_name: z.string().optional().describe("Full name of the token"),
    startDate: z.string().optional().describe("Start date in YYYY-MM-DD format"),
    endDate: z.string().optional().describe("End date in YYYY-MM-DD format"),
    limit: z.number().min(1).max(100).optional().describe("Number of data points to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["trend", "performance", "signals", "history", "all"]).optional().describe("Type of historical analysis")
});

type TmGradeHistoryRequest = z.infer<typeof TmGradeHistoryRequestSchema>;

// AI extraction template for TM grade history requests
const TM_GRADE_HISTORY_EXTRACTION_TEMPLATE = `Extract TM Grade history request information from the user's message.

TM Grade History provides historical grading analysis including:
- Historical TM Grade scores and changes over time
- Fundamental grade trends
- Trading signal history (Buy/Sell/Hold/Neutral)
- Momentum changes over time
- Performance tracking across date ranges

Instructions:
Look for TM GRADE HISTORY requests, such as:
- Historical analysis ("Bitcoin TM grade history", "ETH grade trends over time")
- Date range queries ("TM grades from January to March", "Grade history last 30 days")
- Trend analysis ("Grade performance trends", "Historical grade changes")
- Signal tracking ("TM grade signal history", "Past trading grades")

EXAMPLES:
- "Bitcoin TM grade history" → cryptocurrency: "Bitcoin", analysisType: "history"
- "ETH grade trends over time" → cryptocurrency: "ETH", analysisType: "trend"
- "TM grades from 2025-01-01 to 2025-03-01" → startDate: "2025-01-01", endDate: "2025-03-01"
- "BONK grade performance last month" → cryptocurrency: "BONK", analysisType: "performance"
- "Historical grade signals for Solana" → cryptocurrency: "Solana", analysisType: "signals"

IMPORTANT: Extract date ranges if mentioned in formats like:
- "from YYYY-MM-DD to YYYY-MM-DD"
- "between DATE and DATE"
- "last 30 days", "past month", etc.

CRITICAL: Extract the EXACT cryptocurrency mentioned by the user, including lesser-known tokens.

Respond with an XML block containing only the extracted values:

<response>
<cryptocurrency>exact cryptocurrency name or symbol from user's message</cryptocurrency>
<symbol>token symbol if mentioned</symbol>
<token_id>specific token ID if mentioned</token_id>
<token_name>full name of the token</token_name>
<startDate>start date in YYYY-MM-DD format if mentioned</startDate>
<endDate>end date in YYYY-MM-DD format if mentioned</endDate>
<limit>number of data points to return</limit>
<page>page number for pagination</page>
<analysisType>trend|performance|signals|history|all</analysisType>
</response>`;

// Handler function
const handler = async (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
    _options?: any,
    callback?: HandlerCallback
): Promise<ActionResult> => {
    elizaLogger.info("📈 Starting TokenMetrics TM Grade History Action");
    
    try {
        const requestId = generateRequestId();
        
        // Extract request using AI with user message injection
        const userMessage = message.content?.text || "";
        const enhancedTemplate = TM_GRADE_HISTORY_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"
Please analyze the CURRENT user message above and extract the relevant information.`;
        
        const historyRequest = await extractTokenMetricsRequest<TmGradeHistoryRequest>(
            runtime,
            message,
            state || await runtime.composeState(message),
            enhancedTemplate,
            TmGradeHistoryRequestSchema,
            requestId
        );
        
        elizaLogger.info("📈 Extracted TM grade history request:", historyRequest);
        
        // Apply defaults
        const processedRequest = {
            cryptocurrency: historyRequest?.cryptocurrency,
            token_id: historyRequest?.token_id,
            symbol: historyRequest?.symbol,
            token_name: historyRequest?.token_name,
            startDate: historyRequest?.startDate,
            endDate: historyRequest?.endDate,
            limit: historyRequest?.limit || 50,
            page: historyRequest?.page || 1,
            analysisType: historyRequest?.analysisType || "all"
        };
        
        // Resolve token if needed
        let resolvedToken = null;
        if (processedRequest.cryptocurrency && !processedRequest.token_id) {
            try {
                resolvedToken = await resolveTokenSmart(processedRequest.cryptocurrency, runtime);
                if (resolvedToken) {
                    processedRequest.token_id = resolvedToken.TOKEN_ID;
                    processedRequest.symbol = resolvedToken.TOKEN_SYMBOL;
                    processedRequest.token_name = resolvedToken.TOKEN_NAME;
                    elizaLogger.log(`✅ Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.TOKEN_NAME} (${resolvedToken.TOKEN_SYMBOL})`);
                }
            } catch (error) {
                elizaLogger.log(`⚠️ Token resolution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        
        if (!processedRequest.token_id) {
            return createActionResult({
                text: `❌ Unable to resolve cryptocurrency: ${processedRequest.cryptocurrency}. Please provide a valid token name or symbol.`,
                data: {
                    success: false,
                    error: "Token resolution failed",
                    request: processedRequest
                }
            });
        }
        
        // Build API parameters
        const apiParams: any = {
            token_id: processedRequest.token_id,
            limit: processedRequest.limit,
            page: processedRequest.page
        };
        
        // Add date parameters if provided
        if (processedRequest.startDate) {
            apiParams.startDate = processedRequest.startDate;
        }
        if (processedRequest.endDate) {
            apiParams.endDate = processedRequest.endDate;
        }
        
        // Call TokenMetrics API
        const response = await callTokenMetricsAPI("/v2/tm-grade-history", apiParams, runtime);
        
        if (!response?.data || response.data.length === 0) {
            return createActionResult({
                text: `❌ No TM Grade history data found for ${processedRequest.token_name || processedRequest.cryptocurrency}`,
                data: {
                    success: false,
                    message: "No historical grade data available",
                    token_info: processedRequest
                }
            });
        }
        
        const historyData = response.data;
        elizaLogger.log("📊 TM Grade History API response data:", JSON.stringify(historyData.slice(0, 2), null, 2));
        
        const analysis = analyzeTmGradeHistory(historyData, processedRequest.analysisType);
        elizaLogger.log("📊 TM Grade History analysis completed:", JSON.stringify(analysis, null, 2));
        
        let responseText;
        try {
            responseText = formatTmGradeHistoryResponse(historyData, analysis, processedRequest);
            elizaLogger.log("📊 TM Grade History response formatted successfully, length:", responseText.length);
            elizaLogger.log("📊 TM Grade History response text preview:", responseText.substring(0, 200) + "...");
        } catch (formatError) {
            elizaLogger.error("❌ Error formatting TM Grade History response:", formatError);
            responseText = `📈 **TM Grade History: ${historyData[0]?.TOKEN_NAME} (${historyData[0]?.TOKEN_SYMBOL})**\n\n📊 **Data Overview**:\n• Data Points: ${historyData.length}\n• Latest TM Grade: ${historyData[0]?.TM_GRADE}\n• Latest Signal: ${historyData[0]?.TM_GRADE_SIGNAL}`;
        }
        
        elizaLogger.log("📊 About to return TM Grade History result with text length:", responseText.length);
        
        // Use callback pattern to send formatted response (matching working actions)
        if (callback) {
            await callback({
                text: responseText,
                content: {
                    success: true,
                    message: `TM Grade history analysis for ${historyData[0]?.TOKEN_NAME}`,
                    token_info: {
                        name: historyData[0]?.TOKEN_NAME,
                        symbol: historyData[0]?.TOKEN_SYMBOL,
                        token_id: historyData[0]?.TOKEN_ID
                    },
                    history_data: historyData,
                    analysis: analysis,
                    endpoint: "tm-grade-history",
                    request_type: processedRequest.analysisType,
                    data_points: historyData.length
                }
            });
        }

        return createActionResult({
            success: true,
            text: responseText
        });
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        elizaLogger.error("Error in getTmGradeHistoryAction:", error);
        
        return createActionResult({
            text: `❌ Error fetching TM Grade history: ${errorMessage}`,
            data: {
                success: false,
                error: errorMessage,
                endpoint: "tm-grade-history"
            }
        });
    }
};

/**
 * Analyze TM Grade history data
 */
function analyzeTmGradeHistory(historyData: any[], analysisType: string = "all"): any {
    if (!historyData || historyData.length === 0) {
        return { error: "No data to analyze" };
    }
    
    const latest = historyData[0];
    const oldest = historyData[historyData.length - 1];
    
    // Calculate trends
    const tmGradeTrend = calculateTrend(historyData, 'TM_GRADE');
    const fundamentalTrend = calculateTrend(historyData, 'FUNDAMENTAL_GRADE');
    
    // Analyze signals
    const signalAnalysis = analyzeSignalHistory(historyData);
    
    // Performance metrics
    const performance = calculatePerformanceMetrics(historyData);
    
    return {
        data_points: historyData.length,
        date_range: {
            from: oldest?.DATE,
            to: latest?.DATE
        },
        trend_analysis: {
            tm_grade: tmGradeTrend,
            fundamental_grade: fundamentalTrend
        },
        signal_analysis: signalAnalysis,
        performance_metrics: performance,
        latest_snapshot: {
            tm_grade: latest?.TM_GRADE,
            fundamental_grade: latest?.FUNDAMENTAL_GRADE,
            signal: latest?.TM_GRADE_SIGNAL,
            momentum: latest?.MOMENTUM
        }
    };
}

function calculateTrend(data: any[], field: string): any {
    const values = data.map(item => parseFloat(item[field] || 0)).filter(v => !isNaN(v));
    
    if (values.length < 2) {
        return { trend: "insufficient_data", change: 0 };
    }
    
    const latest = values[0];
    const oldest = values[values.length - 1];
    const change = latest - oldest;
    const changePercent = oldest !== 0 ? (change / oldest) * 100 : 0;
    
    let trend = "stable";
    if (changePercent > 5) trend = "improving";
    else if (changePercent < -5) trend = "declining";
    
    return {
        trend,
        change: change.toFixed(2),
        change_percent: changePercent.toFixed(2),
        latest_value: latest,
        oldest_value: oldest,
        volatility: calculateVolatility(values)
    };
}

function calculateVolatility(values: number[]): string {
    if (values.length < 2) return "unknown";
    
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2)) / values.length;
    const stdDev = Math.sqrt(variance);
    const volatility = (stdDev / mean) * 100;
    
    if (volatility > 20) return "high";
    if (volatility > 10) return "medium";
    return "low";
}

function analyzeSignalHistory(data: any[]): any {
    const signals = data.map(item => item.TM_GRADE_SIGNAL).filter(s => s);
    const signalCounts = signals.reduce((acc: any, signal) => {
        acc[signal] = (acc[signal] || 0) + 1;
        return acc;
    }, {});
    
    const totalSignals = signals.length;
    const signalDistribution = Object.entries(signalCounts).map(([signal, count]) => ({
        signal,
        count,
        percentage: totalSignals > 0 ? ((count as number) / totalSignals * 100).toFixed(1) : 0
    }));
    
    return {
        total_signals: totalSignals,
        distribution: signalDistribution,
        latest_signal: data[0]?.TM_GRADE_SIGNAL,
        dominant_signal: Object.keys(signalCounts).reduce((a, b) => signalCounts[a] > signalCounts[b] ? a : b, "unknown")
    };
}

function calculatePerformanceMetrics(data: any[]): any {
    const tmGrades = data.map(item => parseFloat(item.TM_GRADE || 0)).filter(v => !isNaN(v));
    const fundamentalGrades = data.map(item => parseFloat(item.FUNDAMENTAL_GRADE || 0)).filter(v => !isNaN(v));
    
    return {
        tm_grade_stats: calculateStats(tmGrades),
        fundamental_grade_stats: calculateStats(fundamentalGrades),
        consistency: calculateConsistency(tmGrades)
    };
}

function calculateStats(values: number[]): any {
    if (values.length === 0) return { error: "no_data" };
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b) / values.length;
    
    return {
        min: min.toFixed(2),
        max: max.toFixed(2),
        average: avg.toFixed(2),
        range: (max - min).toFixed(2)
    };
}

function calculateConsistency(values: number[]): string {
    if (values.length < 3) return "insufficient_data";
    
    const variance = calculateVolatility(values);
    if (variance === "low") return "highly_consistent";
    if (variance === "medium") return "moderately_consistent";
    return "inconsistent";
}

/**
 * Format TM Grade history response
 */
function formatTmGradeHistoryResponse(historyData: any[], analysis: any, request: any): string {
    const tokenName = historyData[0]?.TOKEN_NAME || "Unknown Token";
    const symbol = historyData[0]?.TOKEN_SYMBOL || "";
    
    let response = `📈 **TM Grade History: ${tokenName} (${symbol})**\n\n`;
    
    response += `📊 **Data Overview**:\n`;
    response += `• Data Points: ${analysis.data_points}\n`;
    response += `• Date Range: ${analysis.date_range.from} to ${analysis.date_range.to}\n\n`;
    
    if (request.analysisType === "trend" || request.analysisType === "all") {
        response += `📈 **Trend Analysis**:\n`;
        response += `• TM Grade Trend: ${analysis.trend_analysis.tm_grade.trend} (${analysis.trend_analysis.tm_grade.change_percent}%)\n`;
        response += `• Fundamental Trend: ${analysis.trend_analysis.fundamental_grade.trend} (${analysis.trend_analysis.fundamental_grade.change_percent}%)\n`;
        response += `• Volatility: ${analysis.trend_analysis.tm_grade.volatility}\n\n`;
    }
    
    if (request.analysisType === "signals" || request.analysisType === "all") {
        response += `📡 **Signal History**:\n`;
        response += `• Latest Signal: ${analysis.signal_analysis.latest_signal}\n`;
        response += `• Dominant Signal: ${analysis.signal_analysis.dominant_signal}\n`;
        response += `• Total Signals: ${analysis.signal_analysis.total_signals}\n\n`;
        
        if (analysis.signal_analysis.distribution.length > 0) {
            response += `📊 **Signal Distribution**:\n`;
            analysis.signal_analysis.distribution.forEach((item: any) => {
                response += `• ${item.signal}: ${item.percentage}%\n`;
            });
            response += '\n';
        }
    }
    
    if (request.analysisType === "performance" || request.analysisType === "all") {
        response += `📊 **Performance Metrics**:\n`;
        if (analysis.performance_metrics.tm_grade_stats.average) {
            response += `• TM Grade Average: ${analysis.performance_metrics.tm_grade_stats.average}\n`;
            response += `• TM Grade Range: ${analysis.performance_metrics.tm_grade_stats.min} - ${analysis.performance_metrics.tm_grade_stats.max}\n`;
        }
        if (analysis.performance_metrics.fundamental_grade_stats.average) {
            response += `• Fundamental Average: ${analysis.performance_metrics.fundamental_grade_stats.average}\n`;
        }
        response += `• Consistency: ${analysis.performance_metrics.consistency}\n\n`;
    }
    
    response += `🎯 **Latest Snapshot**:\n`;
    response += `• TM Grade: ${analysis.latest_snapshot.tm_grade}\n`;
    response += `• Fundamental Grade: ${analysis.latest_snapshot.fundamental_grade}\n`;
    response += `• Signal: ${analysis.latest_snapshot.signal}\n`;
    response += `• Momentum: ${analysis.latest_snapshot.momentum}\n`;
    
    return response.trim();
}

// Validation function
const validate = async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
    elizaLogger.log("🔍 Validating getTmGradeHistoryAction (1.x)");
    
    try {
        const apiKey = await validateAndGetApiKey(runtime);
        return !!apiKey;
    } catch (error) {
        elizaLogger.error("❌ Validation failed:", error);
        return false;
    }
};

// Export the action
export const getTmGradeHistoryAction: Action = {
    name: "GET_TM_GRADE_HISTORY_TOKENMETRICS",
    description: "Get historical TM Grade data and trend analysis from TokenMetrics",
    
    similes: [
        "tm grade history",
        "grade history",
        "historical grades",
        "tm grade trends",
        "grade performance",
        "grade over time",
        "historical tm analysis"
    ],
    
    validate,
    handler,
    
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Bitcoin TM grade history"
                }
            },
            {
                name: "{{agent}}", 
                content: {
                    text: "I'll get the historical TM Grade data for Bitcoin.",
                    action: "GET_TM_GRADE_HISTORY_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "ETH grade trends over time"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll analyze the TM Grade trends for Ethereum over time.",
                    action: "GET_TM_GRADE_HISTORY_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Show me BONK grade performance last month"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll fetch the TM Grade performance history for BONK.",
                    action: "GET_TM_GRADE_HISTORY_TOKENMETRICS"
                }
            }
        ]
    ]
};

export default getTmGradeHistoryAction;
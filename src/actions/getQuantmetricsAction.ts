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
    generateRequestId,
    resolveTokenSmart
} from "./aiActionHelper";
import type { QuantmetricsResponse } from "../types";

// Zod schema for quantmetrics request validation
const QuantmetricsRequestSchema = z.object({
    cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
    token_id: z.number().optional().describe("Specific token ID if known"),
    symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
    category: z.string().optional().describe("Token category filter (e.g., defi, layer1)"),
    exchange: z.string().optional().describe("Exchange filter"),
    marketcap: z.number().optional().describe("Minimum market cap filter"),
    volume: z.number().optional().describe("Minimum volume filter"),
    fdv: z.number().optional().describe("Minimum fully diluted valuation filter"),
    limit: z.number().min(1).max(1000).optional().describe("Number of results to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["risk", "returns", "performance", "all"]).optional().describe("Type of analysis to focus on")
});

type QuantmetricsRequest = z.infer<typeof QuantmetricsRequestSchema>;

// Template for extracting quantmetrics information (Updated to XML format)
const quantmetricsTemplate = `Extract quantmetrics request information from the message.

IMPORTANT: Extract the EXACT cryptocurrency mentioned by the user in their message, not from the examples below.

Quantmetrics provide:
- Quantitative analysis and metrics
- Mathematical models and scoring
- Statistical performance indicators
- Risk-adjusted return metrics
- Portfolio optimization data
- Algorithmic trading insights

Instructions:
Look for QUANTMETRICS requests, such as:
- Quantitative analysis ("Quantmetrics for [TOKEN]", "Get quant analysis")
- Statistical metrics ("Statistical analysis", "Quant scoring")
- Risk metrics ("Risk-adjusted returns", "Quantitative risk")
- Performance metrics ("Quant performance", "Mathematical analysis")

EXTRACTION RULE: Find the cryptocurrency name/symbol that the user specifically mentioned in their message.

Examples of request patterns (but extract the actual token from user's message):
- "Get quantmetrics for [TOKEN]" → extract [TOKEN]
- "Show me quantitative analysis for [TOKEN]" → extract [TOKEN]
- "Quantitative metrics for [TOKEN]" → extract [TOKEN]
- "Risk-adjusted analysis for [TOKEN]" → extract [TOKEN]

Respond with an XML block containing only the extracted values:

<response>
<cryptocurrency>EXACT token name or symbol from user's message</cryptocurrency>
<analysis_type>risk, performance, statistical, or general</analysis_type>
<metric_focus>returns, volatility, sharpe, sortino, or all</metric_focus>
<timeframe>daily, weekly, monthly, or general</timeframe>
<limit>number of results requested (default 20)</limit>
</response>`;

/**
 * CORRECTED Quantmetrics Action - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/quantmetrics
 * 
 * This action provides comprehensive quantitative metrics for cryptocurrency analysis.
 * According to the API docs, it supports extensive filtering and uses page-based pagination.
 */
export const getQuantmetricsAction: Action = {
    name: "GET_QUANTMETRICS_TOKENMETRICS",
    description: "Get comprehensive quantitative metrics including volatility, Sharpe ratio, CAGR, and risk measurements from TokenMetrics",
    similes: [
        "get quantitative metrics",
        "analyze token statistics",
        "get risk metrics",
        "calculate sharpe ratio",
        "get volatility data",
        "analyze returns",
        "portfolio risk analysis"
    ],
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Get quantmetrics for Bitcoin"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll fetch comprehensive quantitative metrics for Bitcoin from TokenMetrics.",
                    action: "GET_QUANTMETRICS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Show me risk metrics for DeFi tokens with market cap over $500M"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll analyze quantitative risk metrics for large-cap DeFi tokens.",
                    action: "GET_QUANTMETRICS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Analyze Sharpe ratio and returns for Ethereum"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll get the quantitative return metrics and Sharpe ratio analysis for Ethereum.",
                    action: "GET_QUANTMETRICS_TOKENMETRICS"
                }
            }
        ]
    ],
    
    validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        elizaLogger.log("🔍 Validating getQuantmetricsAction (1.x)");
        
        try {
            validateAndGetApiKey(runtime);
            return true;
        } catch (error) {
            elizaLogger.error("❌ Validation failed:", error);
            return false;
        }
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<ActionResult> => {
            const requestId = generateRequestId();
        
        elizaLogger.log("🚀 Starting TokenMetrics quantmetrics handler (1.x)");
        elizaLogger.log(`📝 Processing user message: "${message.content?.text || "No text content"}"`);
        elizaLogger.log(`🆔 Request ID: ${requestId}`);

        try {
            // STEP 1: Validate API key early
            validateAndGetApiKey(runtime);

            // Ensure we have a proper state
            if (!state) {
                state = await runtime.composeState(message);
            }
            
            // STEP 2: Extract quantmetrics request using AI with user message injection
            const userMessage = message.content?.text || "";
            
            // Inject user message directly into template (like other working actions)
            const enhancedTemplate = quantmetricsTemplate + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;

            const quantRequest = await extractTokenMetricsRequest(
                runtime,
                message,
                state,
                enhancedTemplate,
                QuantmetricsRequestSchema,
                requestId
            );

            elizaLogger.log("🎯 AI Extracted quantmetrics request:", quantRequest);
            elizaLogger.log(`🔍 DEBUG: AI extracted cryptocurrency: "${quantRequest?.cryptocurrency}"`);
            console.log(`[${requestId}] Extracted request:`, quantRequest);
            
            // STEP 3: Build API parameters with token-specific filtering
            const apiParams: any = {
                limit: quantRequest?.limit || 20,
                page: 1
            };

            // Handle token-specific requests
            let tokenInfo = null;
            if (quantRequest?.cryptocurrency) {
                elizaLogger.log(`🔍 Resolving token for: "${quantRequest.cryptocurrency}"`);
                try {
                    tokenInfo = await resolveTokenSmart(quantRequest.cryptocurrency, runtime);
                    
                    if (tokenInfo) {
                        apiParams.token_id = tokenInfo.TOKEN_ID;
                        elizaLogger.log(`✅ Resolved to token ID: ${tokenInfo.TOKEN_ID}`);
                    } else {
                        apiParams.symbol = quantRequest.cryptocurrency.toUpperCase();
                        elizaLogger.log(`🔍 Using symbol: ${quantRequest.cryptocurrency}`);
                    }
                } catch (error) {
                    elizaLogger.log(`⚠️ Token resolution failed, using symbol fallback: ${error}`);
                    apiParams.symbol = quantRequest.cryptocurrency.toUpperCase();
                    elizaLogger.log(`🔍 Fallback to symbol parameter: ${quantRequest.cryptocurrency.toUpperCase()}`);
                }
            }

            elizaLogger.log(`📡 API parameters:`, apiParams);
            
            // STEP 4: Fetch quantmetrics data
            elizaLogger.log(`📡 Fetching quantmetrics data`);
            const quantData = await callTokenMetricsAPI('/v2/quantmetrics', apiParams, runtime);
            
            if (!quantData) {
                elizaLogger.log("❌ Failed to fetch quantmetrics data");
                
                if (callback) {
                    await callback({
                        text: `❌ Unable to fetch quantitative metrics data at the moment.

This could be due to:
• TokenMetrics API connectivity issues
• Temporary service interruption  
• Rate limiting

Please try again in a few moments.`,
                        content: { 
                            error: "API fetch failed",
                            request_id: requestId
                        }
                    });
                }
                return createActionResult({
                    success: false,
                    text: "❌ Unable to fetch quantitative metrics data at the moment.",
                    data: { 
                        error: "API fetch failed",
                        request_id: requestId
                    }
                });
            }

            // Handle the response data
            const metrics = Array.isArray(quantData) ? quantData : (quantData.data || []);
            
            elizaLogger.log(`🔍 Received ${metrics.length} quantmetrics`);

            // STEP 5: Format and present the results
            const responseText = formatQuantmetricsResponse(metrics, tokenInfo);
            const analysis = analyzeQuantitativeMetrics(metrics, "comprehensive");

            elizaLogger.success("✅ Successfully processed quantmetrics request");

            if (callback) {
                await callback({
                    text: responseText,
                    content: {
                        success: true,
                        quantmetrics_data: metrics,
                        analysis: analysis,
                        source: "TokenMetrics Quantmetrics API",
                        request_id: requestId,
                        metadata: {
                            endpoint: "quantmetrics",
                            data_source: "TokenMetrics API",
                            timestamp: new Date().toISOString(),
                            total_metrics: metrics.length
                        }
                    }
                });
            }
            
            return createActionResult({
                success: true,
                text: responseText,
                data: {
                    success: true,
                    quantmetrics_data: metrics,
                    analysis: analysis,
                    source: "TokenMetrics Quantmetrics API",
                    request_id: requestId,
                    metadata: {
                        endpoint: "quantmetrics",
                        data_source: "TokenMetrics API",
                        timestamp: new Date().toISOString(),
                        total_metrics: metrics.length
                    }
                }
            });
            
        } catch (error) {
            elizaLogger.error("❌ Error in quantmetrics handler:", error);
            elizaLogger.error(`🆔 Request ${requestId}: ERROR - ${error}`);
            
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            
            if (callback) {
                await callback({
                    text: `❌ I encountered an error while fetching quantitative metrics: ${errorMessage}`,
                    content: { 
                        error: errorMessage,
                        error_type: error instanceof Error ? error.constructor.name : 'Unknown',
                        troubleshooting: true,
                        request_id: requestId
                    }
                });
            }
            
            return createActionResult({
                success: false,
                error: errorMessage
            });
        }
    }
};

/**
 * Format quantmetrics response for user
 */
function formatQuantmetricsResponse(metrics: any[], tokenInfo?: any): string {
    if (!metrics || metrics.length === 0) {
        return "❌ No quantitative metrics data available.";
    }

    let response = `⚡ **Quantitative Metrics Analysis**\n\n`;
    
    if (tokenInfo) {
        response += `🎯 **Token**: ${tokenInfo.TOKEN_NAME || tokenInfo.NAME} (${tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL})\n`;
    }
    
    response += `📊 **Data Points**: ${metrics.length} metrics analyzed\n\n`;

    if (metrics.length > 0) {
        const firstMetric = metrics[0];
        
        response += `📈 **Key Metrics**:\n`;
        if (firstMetric.VOLATILITY !== undefined) {
            response += `• **Volatility**: ${firstMetric.VOLATILITY.toFixed(2)}%\n`;
        }
        if (firstMetric.SHARPE !== undefined) {
            response += `• **Sharpe Ratio**: ${firstMetric.SHARPE.toFixed(3)}\n`;
        }
        if (firstMetric.MAX_DRAWDOWN !== undefined) {
            response += `• **Max Drawdown**: ${firstMetric.MAX_DRAWDOWN.toFixed(2)}%\n`;
        }
        if (firstMetric.CAGR !== undefined) {
            response += `• **CAGR**: ${firstMetric.CAGR.toFixed(2)}%\n`;
        }
        if (firstMetric.ALL_TIME_RETURN !== undefined) {
            response += `• **All-Time Return**: ${firstMetric.ALL_TIME_RETURN.toFixed(2)}%\n`;
    }
    }

    response += `\n📊 **Data Source**: TokenMetrics Quantmetrics API\n`;
    response += `⏰ **Updated**: ${new Date().toLocaleString()}\n`;
    
    return response;
}

/**
 * Analyze quantitative metrics to provide investment insights
 */
function analyzeQuantitativeMetrics(quantData: any[], analysisType: string): any {
    if (!quantData || quantData.length === 0) {
        return {
            summary: "No quantitative data available for analysis",
            risk_assessment: "Cannot assess risk without data",
            insights: []
        };
    }
    
    // Calculate aggregate statistics
    const riskAnalysis = analyzeRiskMetrics(quantData);
    const returnAnalysis = analyzeReturnMetrics(quantData);
    const portfolioImplications = generatePortfolioImplications(riskAnalysis, returnAnalysis);
    const insights = generateQuantitativeInsights(quantData, riskAnalysis, returnAnalysis);
    
    return {
        summary: `Quantitative analysis of ${quantData.length} data points shows ${riskAnalysis.overall_risk_level} risk with ${returnAnalysis.return_quality} returns`,
        risk_analysis: riskAnalysis,
        return_analysis: returnAnalysis,
        portfolio_implications: portfolioImplications,
        insights: insights,
        comparative_analysis: generateComparativeAnalysis(quantData),
        data_quality: {
            source: "TokenMetrics Official API",
            data_points: quantData.length,
            reliability: "High - TokenMetrics verified data"
        }
    };
}

function analyzeRiskMetrics(quantData: any[]): any {
    const volatilities = quantData.map(d => d.VOLATILITY).filter(v => v !== null && v !== undefined);
    const maxDrawdowns = quantData.map(d => d.MAX_DRAWDOWN).filter(d => d !== null && d !== undefined);
    
    if (volatilities.length === 0) {
        return { overall_risk_level: "Unknown", risk_assessment: "Insufficient data" };
    }
    
    const avgVolatility = volatilities.reduce((sum, v) => sum + v, 0) / volatilities.length;
    const avgMaxDrawdown = maxDrawdowns.length > 0 ? 
        maxDrawdowns.reduce((sum, d) => sum + Math.abs(d), 0) / maxDrawdowns.length : 0;
    
    // Assess overall risk level
    let riskLevel;
    if (avgVolatility > 80) riskLevel = "Very High";
    else if (avgVolatility > 60) riskLevel = "High";
    else if (avgVolatility > 40) riskLevel = "Moderate";
    else if (avgVolatility > 20) riskLevel = "Low-Moderate";
    else riskLevel = "Low";
    
    // Risk distribution
    const highRisk = volatilities.filter(v => v > 60).length;
    const moderateRisk = volatilities.filter(v => v > 30 && v <= 60).length;
    const lowRisk = volatilities.filter(v => v <= 30).length;
    
    return {
        overall_risk_level: riskLevel,
        average_volatility: avgVolatility.toFixed(2),
        average_max_drawdown: avgMaxDrawdown.toFixed(2) + '%',
        risk_distribution: {
            high_risk: `${highRisk} tokens (${((highRisk / volatilities.length) * 100).toFixed(1)}%)`,
            moderate_risk: `${moderateRisk} tokens (${((moderateRisk / volatilities.length) * 100).toFixed(1)}%)`,
            low_risk: `${lowRisk} tokens (${((lowRisk / volatilities.length) * 100).toFixed(1)}%)`
        },
        risk_assessment: generateRiskAssessment(avgVolatility, avgMaxDrawdown)
    };
}

function analyzeReturnMetrics(quantData: any[]): any {
    const sharpeRatios = quantData.map(d => d.SHARPE || 0).filter(s => !isNaN(s));
    const cagrValues = quantData.map(d => d.CAGR || 0).filter(c => !isNaN(c));
    const sortinoRatios = quantData.map(d => d.SORTINO || 0).filter(s => !isNaN(s));
    
    const avgSharpe = sharpeRatios.length > 0 ? sharpeRatios.reduce((sum, s) => sum + s, 0) / sharpeRatios.length : 0;
    const avgCAGR = cagrValues.length > 0 ? cagrValues.reduce((sum, c) => sum + c, 0) / cagrValues.length : 0;
    const avgSortino = sortinoRatios.length > 0 ? sortinoRatios.reduce((sum, s) => sum + s, 0) / sortinoRatios.length : 0;
    
    const insights = [];
    if (sharpeRatios.length > 0) {
        insights.push(`🏆 Average Sharpe Ratio: ${avgSharpe.toFixed(2)}`);
        insights.push(`📈 Average CAGR: ${formatPercentage(avgCAGR)}`);
    }
    
    return {
        avg_sharpe: avgSharpe,
        avg_cagr: avgCAGR,
        avg_sortino: avgSortino,
        sharpe_distribution: analyzeDistribution(sharpeRatios),
        cagr_distribution: analyzeDistribution(cagrValues),
        insights: insights
    };
}

function generatePortfolioImplications(riskAnalysis: any, returnAnalysis: any): string[] {
    const implications = [];
    
    // Risk-based implications
    if (riskAnalysis.overall_risk_level === "Very High" || riskAnalysis.overall_risk_level === "High") {
        implications.push("High volatility levels suggest smaller position sizes and active risk management required");
        implications.push("Consider these tokens as satellite holdings rather than core positions");
    } else if (riskAnalysis.overall_risk_level === "Low-Moderate" || riskAnalysis.overall_risk_level === "Low") {
        implications.push("Lower volatility suggests these tokens could serve as core portfolio holdings");
    }
    
    // Return-based implications
    if (returnAnalysis.return_quality === "Excellent" || returnAnalysis.return_quality === "Good") {
        implications.push("Strong risk-adjusted returns support higher allocation consideration");
        implications.push("Good Sharpe ratios indicate efficient risk-return profiles");
    } else if (returnAnalysis.return_quality === "Poor" || returnAnalysis.return_quality === "Very Poor") {
        implications.push("Weak risk-adjusted returns suggest these assets may not adequately compensate for risk");
    }
    
    // General portfolio implications
    implications.push("Diversification across different risk profiles recommended");
    implications.push("Monitor quantitative metrics regularly for changing risk characteristics");
    
    return implications;
}

function generateQuantitativeInsights(quantData: any[], riskAnalysis: any, returnAnalysis: any): string[] {
    const insights = [];
    
    // Risk insights
    const avgVol = parseFloat(riskAnalysis.average_volatility);
    if (avgVol > 70) {
        insights.push("High volatility levels indicate significant price movements and require careful position sizing");
    } else if (avgVol < 30) {
        insights.push("Relatively low volatility for crypto markets suggests more stable price behavior");
    }
    
    // Return insights
    const avgSharpe = parseFloat(returnAnalysis.avg_sharpe);
    if (avgSharpe > 1.0) {
        insights.push("Positive Sharpe ratios indicate these assets have historically provided good risk-adjusted returns");
    } else if (avgSharpe < 0) {
        insights.push("Negative Sharpe ratios suggest poor risk-adjusted performance historically");
    }
    
    // Comparative insights
    if (quantData.length > 1) {
        const topPerformer = quantData.reduce((best, current) => 
            (current.SHARPE || 0) > (best.SHARPE || 0) ? current : best);
        insights.push(`${topPerformer.NAME} (${topPerformer.SYMBOL}) shows the best risk-adjusted performance in this analysis`);
    }
    
    return insights;
}

function generateComparativeAnalysis(quantData: any[]): any {
    if (quantData.length < 2) {
        return { comparison: "Insufficient data for comparative analysis" };
    }
    
    // Sort by Sharpe ratio for performance ranking
    const sortedBySharpe = quantData
        .filter(d => d.SHARPE !== null && d.SHARPE !== undefined)
        .sort((a, b) => b.SHARPE - a.SHARPE);
    
    // Sort by volatility for risk ranking
    const sortedByVolatility = quantData
        .filter(d => d.VOLATILITY !== null && d.VOLATILITY !== undefined)
        .sort((a, b) => a.VOLATILITY - b.VOLATILITY);
    
    return {
        performance_ranking: sortedBySharpe.slice(0, 3).map((token, index) => ({
            rank: index + 1,
            name: `${token.NAME} (${token.SYMBOL})`,
            sharpe_ratio: token.SHARPE.toFixed(3),
            cagr: token.CAGR ? formatPercentage(token.CAGR) : 'N/A'
        })),
        risk_ranking: sortedByVolatility.slice(0, 3).map((token, index) => ({
            rank: index + 1,
            name: `${token.NAME} (${token.SYMBOL})`,
            volatility: token.VOLATILITY.toFixed(2),
            max_drawdown: token.MAX_DRAWDOWN ? formatPercentage(token.MAX_DRAWDOWN) : 'N/A'
        })),
        analysis_scope: `${quantData.length} tokens analyzed`
    };
}

function generateRiskAssessment(avgVolatility: number, avgMaxDrawdown: number): string {
    if (avgVolatility > 80 && avgMaxDrawdown > 50) {
        return "Extremely high risk - significant volatility and drawdown potential";
    } else if (avgVolatility > 60) {
        return "High risk - substantial price movements expected";
    } else if (avgVolatility > 40) {
        return "Moderate risk - typical for established cryptocurrencies";
    } else {
        return "Lower risk - relatively stable for crypto markets";
    }
}

function generatePerformanceAssessment(avgSharpe: number, avgCAGR: number): string {
    if (avgSharpe > 1.5 && avgCAGR > 20) {
        return "Excellent performance - strong returns with good risk management";
    } else if (avgSharpe > 1.0) {
        return "Good performance - positive risk-adjusted returns";
    } else if (avgSharpe > 0.5) {
        return "Fair performance - modest risk-adjusted returns";
    } else if (avgSharpe > 0) {
        return "Weak performance - minimal risk compensation";
    } else {
        return "Poor performance - negative risk-adjusted returns";
    }
}

/**
 * Analyze distribution of values into categories
 */
function analyzeDistribution(values: number[]): any {
    if (values.length === 0) {
        return { high: 0, medium: 0, low: 0 };
    }
    
    // Define thresholds based on typical ranges for financial metrics
    const high = values.filter(v => v > 1).length;
    const medium = values.filter(v => v > 0 && v <= 1).length;
    const low = values.filter(v => v <= 0).length;
    
    return {
        high: `${high} (${((high / values.length) * 100).toFixed(1)}%)`,
        medium: `${medium} (${((medium / values.length) * 100).toFixed(1)}%)`,
        low: `${low} (${((low / values.length) * 100).toFixed(1)}%)`
    };
}
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

// AI extraction template for natural language processing
const QUANTMETRICS_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting quantitative metrics requests from natural language.

The user wants to get comprehensive quantitative metrics for cryptocurrency analysis. Extract the following information:

1. **cryptocurrency** (optional): The name or symbol of the cryptocurrency
   - Look for token names like "Bitcoin", "Ethereum", "BTC", "ETH"
   - Can be a specific token or general request

2. **token_id** (optional): Specific token ID if mentioned
   - Usually a number like "3375" for Bitcoin

3. **symbol** (optional): Token symbol
   - Extract symbols like "BTC", "ETH", "ADA", etc.

4. **category** (optional): Token category filter
   - Look for categories like "defi", "layer1", "gaming", "nft"

5. **exchange** (optional): Exchange filter
   - Exchange names like "binance", "coinbase", "uniswap"

6. **marketcap** (optional): Minimum market cap filter
   - Look for phrases like "market cap over $500M", "large cap tokens"
   - Convert to numbers (e.g., "$500M" → 500000000)

7. **volume** (optional): Minimum volume filter
   - Look for volume requirements

8. **fdv** (optional): Minimum fully diluted valuation filter

9. **limit** (optional, default: 50): Number of results to return

10. **page** (optional, default: 1): Page number for pagination

11. **analysisType** (optional, default: "all"): What type of analysis they want
    - "risk" - focus on risk metrics (volatility, drawdown, VaR)
    - "returns" - focus on return metrics (CAGR, Sharpe, Sortino)
    - "performance" - focus on performance analysis
    - "all" - comprehensive analysis

Examples:
- "Get quantitative metrics for Bitcoin" → {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Risk metrics for DeFi tokens with market cap over $500M" → {category: "defi", marketcap: 500000000, analysisType: "risk"}
- "Show me Sharpe ratio and returns for ETH" → {cryptocurrency: "Ethereum", symbol: "ETH", analysisType: "returns"}
- "Quantitative analysis for large cap tokens" → {marketcap: 1000000000, analysisType: "all"}

Extract the request details from the user's message.
`;

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
                user: "{{user1}}",
                content: {
                    text: "Get quantitative metrics for Bitcoin"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve comprehensive quantitative metrics for Bitcoin including volatility, Sharpe ratio, and risk measurements.",
                    action: "GET_QUANTMETRICS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me risk metrics for DeFi tokens with market cap over $500M"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll analyze quantitative risk metrics for large-cap DeFi tokens.",
                    action: "GET_QUANTMETRICS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Analyze Sharpe ratio and returns for Ethereum"
                }
            },
            {
                user: "{{user2}}",
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
    ): Promise<boolean> => {
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

            // STEP 2: Build API parameters
            const apiParams: any = {
                limit: 20,
                page: 1
            };

            // STEP 3: Fetch quantmetrics data
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
                return false;
            }

            // Handle the response data
            const metrics = Array.isArray(quantData) ? quantData : (quantData.data || []);
            
            elizaLogger.log(`🔍 Received ${metrics.length} quantmetrics`);

            // STEP 4: Format and present the results
            const responseText = formatQuantmetricsResponse(metrics);
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

            return true;

        } catch (error) {
            elizaLogger.error("❌ Error in TokenMetrics quantmetrics handler:", error);
            elizaLogger.error(`🆔 Request ${requestId}: ERROR - ${error}`);
            
            if (callback) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                
                await callback({
                    text: `❌ I encountered an error while fetching quantitative metrics: ${errorMessage}

This could be due to:
• Network connectivity issues
• TokenMetrics API service problems
• Invalid API key or authentication issues
• Temporary system overload

Please check your TokenMetrics API key configuration and try again.`,
                    content: { 
                        error: errorMessage,
                        error_type: error instanceof Error ? error.constructor.name : 'Unknown',
                        troubleshooting: true,
                        request_id: requestId
                    }
                });
            }
            
            return false;
        }
    }
};

/**
 * Format quantmetrics response for user
 */
function formatQuantmetricsResponse(metrics: any[]): string {
    if (!metrics || metrics.length === 0) {
        return "❌ No quantitative metrics data available.";
    }

    let response = `⚡ **Quantitative Metrics Analysis**\n\n`;
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
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
import type { QuantmetricsResponse, QuantmetricsRequest } from "../types";

/**
 * CORRECTED Quantmetrics Action - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/quantmetrics
 * 
 * This action provides comprehensive quantitative metrics for cryptocurrency analysis.
 * According to the API docs, it supports extensive filtering and uses page-based pagination.
 */
export const getQuantmetricsAction: Action = {
    name: "getQuantmetrics",
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
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Extract token identifiers
            const tokenIdentifier = extractTokenIdentifier(messageContent);
            
            // CORRECTED: Build parameters based on actual API documentation
            const requestParams: QuantmetricsRequest = {
                // Token identification
                token_id: tokenIdentifier.token_id || 
                         (typeof messageContent.token_id === 'number' ? messageContent.token_id : undefined),
                symbol: tokenIdentifier.symbol || 
                       (typeof messageContent.symbol === 'string' ? messageContent.symbol : undefined),
                
                // Extensive filtering options from API docs
                category: typeof messageContent.category === 'string' ? messageContent.category : undefined,
                exchange: typeof messageContent.exchange === 'string' ? messageContent.exchange : undefined,
                marketcap: typeof messageContent.marketcap === 'number' ? messageContent.marketcap : undefined,
                volume: typeof messageContent.volume === 'number' ? messageContent.volume : undefined,
                fdv: typeof messageContent.fdv === 'number' ? messageContent.fdv : undefined,
                
                // CORRECTED: Use page instead of offset for pagination
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : 50,
                page: typeof messageContent.page === 'number' ? messageContent.page : 1
            };
            
            // Validate parameters according to actual API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Fetching quantitative metrics from TokenMetrics v2/quantmetrics endpoint");
            
            // Make API call with corrected authentication
            const response = await callTokenMetricsApi<QuantmetricsResponse>(
                TOKENMETRICS_ENDPOINTS.quantmetrics,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<QuantmetricsResponse>(response, "getQuantmetrics");
            const quantmetrics = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the quantitative data
            const quantAnalysis = analyzeQuantitativeMetrics(quantmetrics);
            
            return {
                success: true,
                message: `Successfully retrieved quantitative metrics for ${quantmetrics.length} data points`,
                quantmetrics: quantmetrics,
                analysis: quantAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.quantmetrics,
                    requested_token: tokenIdentifier.symbol || tokenIdentifier.token_id,
                    filters_applied: {
                        category: requestParams.category,
                        exchange: requestParams.exchange,
                        min_marketcap: requestParams.marketcap,
                        min_volume: requestParams.volume,
                        min_fdv: requestParams.fdv
                    },
                    pagination: {
                        page: requestParams.page,
                        limit: requestParams.limit
                    },
                    data_points: quantmetrics.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                metrics_explanation: {
                    VOLATILITY: "Price volatility measurement - higher values indicate more volatile assets",
                    SHARPE: "Risk-adjusted return metric - higher values indicate better risk-adjusted performance",
                    SORTINO: "Downside risk-adjusted return - focuses only on negative volatility",
                    MAX_DRAWDOWN: "Largest peak-to-trough decline - indicates worst-case scenario losses",
                    CAGR: "Compound Annual Growth Rate - annualized return over the investment period",
                    ALL_TIME_RETURN: "Cumulative return since the token's inception"
                }
            };
            
        } catch (error) {
            console.error("Error in getQuantmetricsAction:", error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve quantitative metrics from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/quantmetrics is accessible",
                    parameter_validation: [
                        "Verify the token symbol or ID is correct and supported by TokenMetrics",
                        "Check that numeric filters (marketcap, volume, fdv) are positive numbers",
                        "Ensure your API key has access to quantmetrics endpoint",
                        "Verify the token has sufficient historical data for analysis"
                    ],
                    common_solutions: [
                        "Try using a major token (BTC=3375, ETH=1027) to test functionality",
                        "Use the tokens endpoint first to verify correct TOKEN_ID",
                        "Check if your subscription includes quantitative metrics access",
                        "Remove filters to get broader results"
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
                    text: "Get quantitative metrics for Bitcoin",
                    symbol: "BTC"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve comprehensive quantitative metrics for Bitcoin including volatility, Sharpe ratio, and risk measurements.",
                    action: "GET_QUANTMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me risk metrics for DeFi tokens with market cap over $500M",
                    category: "defi",
                    marketcap: 500000000
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll analyze quantitative risk metrics for large-cap DeFi tokens.",
                    action: "GET_QUANTMETRICS"
                }
            }
        ]
    ],
};

/**
 * Analyze quantitative metrics to provide investment insights
 */
function analyzeQuantitativeMetrics(quantData: any[]): any {
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
    const sharpeRatios = quantData.map(d => d.SHARPE).filter(s => s !== null && s !== undefined);
    const cagrs = quantData.map(d => d.CAGR).filter(c => c !== null && c !== undefined);
    const allTimeReturns = quantData.map(d => d.ALL_TIME_RETURN).filter(r => r !== null && r !== undefined);
    
    if (sharpeRatios.length === 0 && cagrs.length === 0) {
        return { return_quality: "Unknown", performance_assessment: "Insufficient data" };
    }
    
    const avgSharpe = sharpeRatios.length > 0 ? sharpeRatios.reduce((sum, s) => sum + s, 0) / sharpeRatios.length : 0;
    const avgCAGR = cagrs.length > 0 ? cagrs.reduce((sum, c) => sum + c, 0) / cagrs.length : 0;
    const avgAllTimeReturn = allTimeReturns.length > 0 ? 
        allTimeReturns.reduce((sum, r) => sum + r, 0) / allTimeReturns.length : 0;
    
    // Assess return quality
    let returnQuality;
    if (avgSharpe > 1.5) returnQuality = "Excellent";
    else if (avgSharpe > 1.0) returnQuality = "Good";
    else if (avgSharpe > 0.5) returnQuality = "Fair";
    else if (avgSharpe > 0) returnQuality = "Poor";
    else returnQuality = "Very Poor";
    
    return {
        return_quality: returnQuality,
        average_sharpe_ratio: avgSharpe.toFixed(3),
        average_cagr: formatTokenMetricsNumber(avgCAGR, 'percentage'),
        average_all_time_return: formatTokenMetricsNumber(avgAllTimeReturn, 'percentage'),
        performance_assessment: generatePerformanceAssessment(avgSharpe, avgCAGR)
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
    const avgSharpe = parseFloat(returnAnalysis.average_sharpe_ratio);
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
            cagr: token.CAGR ? formatTokenMetricsNumber(token.CAGR, 'percentage') : 'N/A'
        })),
        risk_ranking: sortedByVolatility.slice(0, 3).map((token, index) => ({
            rank: index + 1,
            name: `${token.NAME} (${token.SYMBOL})`,
            volatility: token.VOLATILITY.toFixed(2),
            max_drawdown: token.MAX_DRAWDOWN ? formatTokenMetricsNumber(token.MAX_DRAWDOWN, 'percentage') : 'N/A'
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
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
 * Action to get quantitative metrics for cryptocurrency tokens from TokenMetrics.
 * This action provides comprehensive statistical and financial metrics essential
 * for quantitative analysis, risk assessment, and investment decision-making.
 * 
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/quantmetrics
 * 
 * The quantitative metrics include:
 * - VOLATILITY: Price volatility measurements for risk assessment
 * - ALL_TIME_RETURN: Cumulative return calculations since inception
 * - CAGR: Compound Annual Growth Rate for annualized returns
 * - SHARPE: Sharpe ratio for risk-adjusted returns analysis
 * - SORTINO: Sortino ratio for downside-adjusted returns
 * - MAX_DRAWDOWN: Maximum peak-to-trough decline analysis
 * - MARKET_CAP: Current market capitalization
 * - VOLUME: Trading volume data
 * - FDV: Fully Diluted Valuation for complete market assessment
 * 
 * Note: TokenMetrics pricing data starts on 2019-01-01 for most tokens.
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
        "get financial metrics",
        "risk assessment data",
        "get quantmetrics",
        "portfolio risk analysis"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            // Extract parameters from the message content
            const messageContent = message.content as any;
            
            // Extract token identifiers from the user's request
            const tokenIdentifier = extractTokenIdentifier(messageContent);
            
            // Build request parameters for the real TokenMetrics quantmetrics endpoint
            const requestParams: QuantmetricsRequest = {
                // Token identification - use either token_id or symbol
                token_id: tokenIdentifier.token_id,
                symbol: tokenIdentifier.symbol,
                
                // Date range parameters for historical analysis
                start_date: typeof messageContent.start_date === 'string' ? messageContent.start_date : undefined,
                end_date: typeof messageContent.end_date === 'string' ? messageContent.end_date : undefined,
                
                // Pagination for large datasets
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : undefined,
            };
            
            // Validate all parameters according to TokenMetrics API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters for the API request
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Fetching quantitative metrics from TokenMetrics v2/quantmetrics endpoint");
            
            // Make the API call to the real TokenMetrics quantmetrics endpoint
            const response = await callTokenMetricsApi<QuantmetricsResponse>(
                TOKENMETRICS_ENDPOINTS.quantmetrics,
                apiParams,
                "GET"
            );
            
            // Format the response data for consistent structure
            const formattedData = formatTokenMetricsResponse<QuantmetricsResponse>(response, "getQuantmetrics");
            
            // Process the real API response structure
            const quantmetrics = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the quantitative data to provide investment insights
            const quantAnalysis = analyzeQuantitativeMetrics(quantmetrics);
            
            // Return comprehensive quantitative analysis with interpretations
            return {
                success: true,
                message: `Successfully retrieved quantitative metrics for ${quantmetrics.length} data points`,
                quantmetrics: quantmetrics,
                analysis: quantAnalysis,
                // Include metadata about the request
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.quantmetrics,
                    requested_token: tokenIdentifier.symbol || tokenIdentifier.token_id,
                    date_range: {
                        start: requestParams.start_date,
                        end: requestParams.end_date
                    },
                    data_points: quantmetrics.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                // Provide educational context about the metrics from TokenMetrics
                metrics_explanation: {
                    VOLATILITY: "Price volatility measurement - higher values indicate more volatile assets",
                    SHARPE: "Risk-adjusted return metric - higher values indicate better risk-adjusted performance",
                    SORTINO: "Downside risk-adjusted return - focuses only on negative volatility",
                    MAX_DRAWDOWN: "Largest peak-to-trough decline - indicates worst-case scenario losses",
                    CAGR: "Compound Annual Growth Rate - annualized return over the investment period",
                    ALL_TIME_RETURN: "Cumulative return since the token's inception",
                    data_period: "TokenMetrics pricing data starts on 2019-01-01 for most tokens"
                }
            };
            
        } catch (error) {
            console.error("Error in getQuantmetricsAction:", error);
            
            // Return detailed error information with troubleshooting guidance
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred while fetching quantitative metrics",
                message: "Failed to retrieve quantitative metrics from TokenMetrics API",
                // Include helpful troubleshooting steps for the real endpoint
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/quantmetrics is accessible",
                    parameter_validation: [
                        "Verify the token symbol or ID is correct and supported by TokenMetrics",
                        "Check that date ranges are in YYYY-MM-DD format",
                        "Ensure dates are not before 2019-01-01 (TokenMetrics data start date)",
                        "Confirm your API key has access to quantmetrics endpoint"
                    ],
                    common_solutions: [
                        "Try using a major token (BTC=3375, ETH=1027) to test functionality",
                        "Use the tokens endpoint first to verify correct TOKEN_ID",
                        "Check if your subscription includes quantitative metrics access",
                        "Verify the token has sufficient historical data for analysis"
                    ]
                }
            };
        }
    },
    
    /**
     * Validate that the runtime environment supports quantmetrics access.
     * Quantmetrics may require specific subscription levels.
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
     * Examples showing different ways to use the quantmetrics endpoint.
     * These examples reflect real TokenMetrics API usage patterns.
     */
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
                    text: "Show me risk metrics for Ethereum over the past year",
                    symbol: "ETH",
                    start_date: "2024-01-01",
                    end_date: "2024-12-31"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll analyze Ethereum's risk metrics for 2024, including volatility and drawdown analysis.",
                    action: "GET_QUANTMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What's the Sharpe ratio and volatility for token ID 3375?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the risk-adjusted return metrics and volatility measurements for that token.",
                    action: "GET_QUANTMETRICS"
                }
            }
        ]
    ],
};

/**
 * Advanced analysis function for quantitative metrics from TokenMetrics.
 * This function interprets the real API response data and provides meaningful insights.
 * 
 * @param quantData - Array of quantitative metric data from TokenMetrics API
 * @returns Comprehensive analysis with risk assessment and performance insights
 */
function analyzeQuantitativeMetrics(quantData: any[]): any {
    if (!quantData || quantData.length === 0) {
        return {
            summary: "No quantitative data available for analysis",
            risk_assessment: "Cannot assess risk without data",
            performance_insights: [],
            recommendations: []
        };
    }
    
    // Get the most recent data point for current analysis
    const latestData = quantData[quantData.length - 1];
    
    // Calculate aggregate statistics if multiple data points
    const metrics = {
        current_volatility: latestData.VOLATILITY,
        current_sharpe: latestData.SHARPE,
        current_sortino: latestData.SORTINO,
        current_cagr: latestData.CAGR,
        max_drawdown: latestData.MAX_DRAWDOWN,
        all_time_return: latestData.ALL_TIME_RETURN,
        current_market_cap: latestData.MARKET_CAP,
        current_volume: latestData.VOLUME,
        total_data_points: quantData.length
    };
    
    // Assess risk level based on TokenMetrics metrics
    const riskLevel = assessRiskLevel(metrics.current_volatility, metrics.max_drawdown);
    
    // Evaluate performance quality based on risk-adjusted returns
    const performanceQuality = evaluatePerformance(metrics.current_sharpe, metrics.current_sortino, metrics.current_cagr);
    
    // Generate actionable insights based on TokenMetrics analysis
    const insights = generateQuantitativeInsights(metrics, riskLevel, performanceQuality);
    
    // Provide comparative context using TokenMetrics data
    const benchmarkComparison = compareToBenchmarks(metrics);
    
    return {
        summary: `TokenMetrics analysis of ${latestData.NAME} (${latestData.SYMBOL}) shows ${riskLevel.level} risk with ${performanceQuality.quality} performance`,
        
        current_metrics: {
            volatility: formatTokenMetricsNumber(metrics.current_volatility, 'percentage'),
            sharpe_ratio: metrics.current_sharpe?.toFixed(2) || 'N/A',
            sortino_ratio: metrics.current_sortino?.toFixed(2) || 'N/A',
            cagr: formatTokenMetricsNumber(metrics.current_cagr, 'percentage'),
            max_drawdown: formatTokenMetricsNumber(metrics.max_drawdown, 'percentage'),
            all_time_return: formatTokenMetricsNumber(metrics.all_time_return, 'percentage'),
            market_cap: formatTokenMetricsNumber(metrics.current_market_cap, 'currency'),
            volume: formatTokenMetricsNumber(metrics.current_volume, 'currency')
        },
        
        risk_assessment: {
            level: riskLevel.level,
            score: riskLevel.score,
            explanation: riskLevel.explanation,
            volatility_interpretation: interpretVolatility(metrics.current_volatility)
        },
        
        performance_evaluation: {
            quality: performanceQuality.quality,
            risk_adjusted_rating: performanceQuality.rating,
            explanation: performanceQuality.explanation
        },
        
        insights: insights,
        
        benchmark_comparison: benchmarkComparison,
        
        recommendations: generateRecommendations(riskLevel, performanceQuality, metrics),
        
        data_quality: {
            source: "TokenMetrics Official API",
            data_points: quantData.length,
            latest_date: latestData.DATE,
            reliability: "High - TokenMetrics verified data"
        }
    };
}

// Helper functions for analyzing TokenMetrics quantitative data

function assessRiskLevel(volatility: number | null, maxDrawdown: number | null): any {
    if (volatility === null) {
        return { level: "Unknown", score: 0, explanation: "Insufficient volatility data for risk assessment" };
    }
    
    let level, score, explanation;
    
    if (volatility > 80) {
        level = "Very High";
        score = 5;
        explanation = "Extremely volatile asset with significant price swings - suitable only for high-risk tolerance investors";
    } else if (volatility > 60) {
        level = "High";
        score = 4;
        explanation = "High volatility indicates substantial price movements - requires careful risk management";
    } else if (volatility > 40) {
        level = "Moderate";
        score = 3;
        explanation = "Moderate volatility typical of established cryptocurrencies - manageable risk for experienced investors";
    } else if (volatility > 20) {
        level = "Low-Moderate";
        score = 2;
        explanation = "Relatively stable for crypto markets - appropriate for moderate risk tolerance";
    } else {
        level = "Low";
        score = 1;
        explanation = "Low volatility suggests price stability - rare in cryptocurrency markets";
    }
    
    return { level, score, explanation };
}

function evaluatePerformance(sharpe: number | null, sortino: number | null, cagr: number | null): any {
    if (sharpe === null && sortino === null) {
        return { 
            quality: "Unknown", 
            rating: 0, 
            explanation: "Insufficient data for performance evaluation" 
        };
    }
    
    const primaryMetric = sharpe || sortino || 0;
    let quality, rating, explanation;
    
    if (primaryMetric > 2.0) {
        quality = "Excellent";
        rating = 5;
        explanation = "Outstanding risk-adjusted returns - significantly outperforming risk-free alternatives";
    } else if (primaryMetric > 1.0) {
        quality = "Good";
        rating = 4;
        explanation = "Solid risk-adjusted performance - generating positive returns relative to risk taken";
    } else if (primaryMetric > 0.5) {
        quality = "Fair";
        rating = 3;
        explanation = "Modest risk-adjusted returns - some compensation for risk but room for improvement";
    } else if (primaryMetric > 0) {
        quality = "Poor";
        rating = 2;
        explanation = "Weak risk-adjusted performance - minimal compensation for risk undertaken";
    } else {
        quality = "Very Poor";
        rating = 1;
        explanation = "Negative risk-adjusted returns - losing money relative to risk-free alternatives";
    }
    
    return { quality, rating, explanation };
}

function generateQuantitativeInsights(metrics: any, riskLevel: any, performanceQuality: any): string[] {
    const insights = [];
    
    // Risk-based insights from TokenMetrics data
    if (riskLevel.score >= 4) {
        insights.push("TokenMetrics data shows high volatility - consider smaller position sizes and active risk management.");
    }
    
    // Performance-based insights
    if (performanceQuality.rating >= 4 && riskLevel.score <= 3) {
        insights.push("Strong risk-adjusted returns with manageable volatility create an attractive risk-reward profile.");
    } else if (performanceQuality.rating <= 2) {
        insights.push("TokenMetrics analysis suggests poor risk-adjusted performance - asset may not adequately compensate for risk.");
    }
    
    // Sharpe ratio specific insights
    if (metrics.current_sharpe !== null) {
        if (metrics.current_sharpe > 1.0) {
            insights.push(`Strong Sharpe ratio (${metrics.current_sharpe.toFixed(2)}) indicates good risk-adjusted returns according to TokenMetrics.`);
        } else if (metrics.current_sharpe < 0) {
            insights.push("Negative Sharpe ratio suggests the asset is underperforming risk-free investments.");
        }
    }
    
    // Drawdown insights
    if (metrics.max_drawdown < -50) {
        insights.push("Significant maximum drawdown indicates potential for substantial losses during market stress periods.");
    }
    
    return insights;
}

function compareToBenchmarks(metrics: any): any {
    // Cryptocurrency market benchmarks (these are general industry standards)
    const cryptoBenchmarks = {
        avg_volatility: 65,
        avg_sharpe: 0.8,
        avg_cagr: 15
    };
    
    const comparison: { [key: string]: string } = {};
    
    if (metrics.current_volatility !== null) {
        comparison.volatility_vs_market = metrics.current_volatility > cryptoBenchmarks.avg_volatility ? "Above Average" : "Below Average";
    }
    
    if (metrics.current_sharpe !== null) {
        comparison.sharpe_vs_market = metrics.current_sharpe > cryptoBenchmarks.avg_sharpe ? "Above Average" : "Below Average";
    }
    
    if (metrics.current_cagr !== null) {
        comparison.return_vs_market = metrics.current_cagr > cryptoBenchmarks.avg_cagr ? "Above Average" : "Below Average";
    }
    
    return comparison;
}

function generateRecommendations(riskLevel: any, performanceQuality: any, metrics: any): string[] {
    const recommendations = [];
    
    // Risk management recommendations based on TokenMetrics data
    if (riskLevel.score >= 4) {
        recommendations.push("High volatility detected - implement smaller position sizes and stop-loss strategies.");
        recommendations.push("Monitor TokenMetrics updates closely for risk level changes.");
    }
    
    // Performance-based recommendations
    if (performanceQuality.rating >= 4) {
        recommendations.push("Strong TokenMetrics performance metrics suggest potential for core portfolio allocation.");
    } else if (performanceQuality.rating <= 2) {
        recommendations.push("Weak performance metrics suggest reconsidering investment or waiting for improved TokenMetrics scores.");
    }
    
    // Market cap based recommendations
    if (metrics.current_market_cap < 100e6) {
        recommendations.push("Small market cap indicates higher risk - suitable only for speculative allocation.");
    }
    
    // General recommendations
    recommendations.push("Continue monitoring TokenMetrics quantitative updates for changing risk profiles.");
    recommendations.push("Always maintain portfolio diversification regardless of individual asset performance.");
    
    return recommendations;
}

function interpretVolatility(volatility: number | null): string {
    if (volatility === null) return "Unable to assess volatility";
    
    if (volatility > 100) return "Extremely high volatility - expect dramatic price movements";
    if (volatility > 80) return "Very high volatility - significant daily price changes likely";
    if (volatility > 60) return "High volatility - substantial price movements expected";
    if (volatility > 40) return "Moderate volatility - typical for established cryptocurrencies";
    if (volatility > 20) return "Low-moderate volatility - relatively stable for crypto";
    return "Low volatility - unusually stable for cryptocurrency markets";
}
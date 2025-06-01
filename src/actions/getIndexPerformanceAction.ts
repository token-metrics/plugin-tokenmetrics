/**
 * INDEX PERFORMANCE ACTION
 * 
 * This file handles the index performance endpoint, which provides historical performance
 * data for TokenMetrics sector indices. Think of this as getting the performance chart
 * for a sector ETF - it shows you how the sector has performed over time.
 * 
 * Real API Endpoint: GET https://api.tokenmetrics.com/v2/indices-index-specific-performance
 * 
 * Educational Context: Performance analysis is fundamental to investment decision-making.
 * Just like you'd look at a mutual fund's historical returns before investing, this
 * endpoint helps you understand how different cryptocurrency sectors have performed.
 * 
 * Key Correction: The original implementation used the wrong URL path. The correct
 * endpoint includes "indices-" at the beginning, which was missing in the original code.
 */

import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    formatTokenMetricsNumber,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { IndexPerformanceResponse, IndexPerformanceRequest } from "../types";

/**
 * This action retrieves historical performance data for a specific sector index.
 * Understanding sector performance helps investors make informed allocation decisions
 * and time their entries and exits more effectively.
 * 
 * Investment Context: This is similar to analyzing the performance of sector ETFs
 * in traditional markets. You want to see trends, volatility, and risk-adjusted
 * returns before deciding whether to invest in a particular sector.
 */
export const getIndexPerformanceAction: Action = {
    name: "getIndexPerformance",
    description: "Get historical performance data for a specific sector index including ROI trends, volatility analysis, and investment insights",
    similes: [
        "get index performance",
        "sector index returns",
        "index ROI data",
        "sector performance history",
        "index trend analysis",
        "sector investment returns",
        "performance tracking",
        "historical sector data"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Extract parameters for the performance analysis request
            // The indexName is absolutely required - you can't get performance data without specifying which index
            const requestParams: IndexPerformanceRequest = {
                // Required parameter: which sector index to analyze
                indexName: typeof messageContent.indexName === 'string' ? messageContent.indexName :
                          typeof messageContent.index_name === 'string' ? messageContent.index_name :
                          typeof messageContent.sector === 'string' ? messageContent.sector : undefined,
                
                // Optional date range parameters for historical analysis
                // Using camelCase format as required by the actual TokenMetrics API
                startDate: typeof messageContent.startDate === 'string' ? messageContent.startDate : 
                          typeof messageContent.start_date === 'string' ? messageContent.start_date : undefined,
                endDate: typeof messageContent.endDate === 'string' ? messageContent.endDate :
                        typeof messageContent.end_date === 'string' ? messageContent.end_date : undefined
            };
            
            // Validate that the required indexName parameter is provided
            // This prevents API calls that will definitely fail due to missing required parameters
            if (!requestParams.indexName) {
                throw new Error("indexName is required for index performance analysis. Example values: 'meme', 'defi', 'gaming', 'layer1', 'layer2', etc.");
            }
            
            // Validate parameters according to TokenMetrics API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters object for the API call
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log(`Fetching performance data for ${requestParams.indexName} index from TokenMetrics API`);
            
            // Make the API call using the corrected endpoint URL
            // This was previously incorrectly mapped to /v2/index-specific-performance
            const response = await callTokenMetricsApi<IndexPerformanceResponse>(
                TOKENMETRICS_ENDPOINTS.indexPerformance, // Maps to /v2/indices-index-specific-performance
                apiParams,
                "GET"
            );
            
            // Format the response data according to TokenMetrics API structure
            const formattedData = formatTokenMetricsResponse<IndexPerformanceResponse>(response, "getIndexPerformance");
            const performanceData = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the performance data to provide comprehensive investment insights
            // This transforms raw numbers into actionable investment intelligence
            const performanceAnalysis = analyzePerformanceData(performanceData, requestParams.indexName);
            
            // Return comprehensive results with analysis and metadata
            return {
                success: true,
                message: `Successfully retrieved performance data for ${requestParams.indexName} index over ${performanceData.length} periods`,
                performance_data: performanceData,
                analysis: performanceAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.indexPerformance,
                    index_name: requestParams.indexName,
                    date_range: {
                        start: requestParams.startDate,
                        end: requestParams.endDate
                    },
                    data_points: performanceData.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                performance_explanation: {
                    purpose: "Shows historical returns and risk metrics for the sector index",
                    metrics_included: [
                        "Total returns over the analyzed period",
                        "Volatility measurements and risk assessment",
                        "Risk-adjusted performance analysis",
                        "Comparative performance insights",
                        "Investment suitability recommendations"
                    ],
                    usage_context: "Use this data to evaluate sector timing, risk assessment, and portfolio allocation decisions"
                }
            };
            
        } catch (error) {
            console.error("Error in getIndexPerformanceAction:", error);
            
            // Provide detailed error information with troubleshooting guidance
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve index performance from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/indices-index-specific-performance is accessible",
                    parameter_validation: [
                        "indexName is REQUIRED for performance data - try 'meme', 'defi', 'gaming', etc.",
                        "Use startDate/endDate in YYYY-MM-DD format if filtering by date range",
                        "Verify the index name exists in TokenMetrics system",
                        "Check that your API key has access to performance endpoints"
                    ],
                    common_solutions: [
                        "Try with a well-known index like 'defi' or 'meme' first",
                        "Remove date filters to get full historical data",
                        "Verify your TokenMetrics subscription includes performance access",
                        "Check index name spelling (usually lowercase, no spaces)"
                    ],
                    data_availability: "Performance data availability varies by index - newer indices may have limited history"
                }
            };
        }
    },
    
    // Validate that the runtime environment has proper configuration
    validate: async (runtime, _message) => {
        const apiKey = runtime.getSetting("TOKENMETRICS_API_KEY");
        if (!apiKey) {
            console.warn("TokenMetrics API key not found. Please set TOKENMETRICS_API_KEY environment variable.");
            return false;
        }
        return true;
    },
    
    // Examples showing different ways users might interact with this action
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me the performance of the DeFi index",
                    indexName: "defi"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the historical performance and ROI data for the DeFi sector index from TokenMetrics.",
                    action: "GET_INDEX_PERFORMANCE"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "How has the gaming sector performed over the past 6 months?",
                    indexName: "gaming",
                    startDate: "2024-06-01",
                    endDate: "2024-12-01"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll analyze the gaming sector's 6-month performance including returns, volatility, and risk metrics.",
                    action: "GET_INDEX_PERFORMANCE"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Compare the Layer 1 sector performance and tell me if it's a good investment",
                    sector: "layer1"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the Layer 1 performance data and provide investment analysis with risk assessment.",
                    action: "GET_INDEX_PERFORMANCE"
                }
            }
        ]
    ],
};

/**
 * PERFORMANCE DATA ANALYSIS FUNCTION
 * 
 * This is the heart of the performance analysis - it takes raw performance numbers
 * and transforms them into actionable investment insights. Think of this as your
 * personal investment analyst who not only shows you the numbers but explains
 * what they mean for your investment decisions.
 * 
 * Key Analysis Areas:
 * 1. Total Returns - How much money you would have made/lost
 * 2. Volatility - How bumpy the ride was (risk assessment)
 * 3. Risk-Adjusted Returns - Returns relative to risk taken
 * 4. Investment Suitability - Who should consider this investment
 */
function analyzePerformanceData(performanceData: any[], indexName: string): any {
    // Handle empty or insufficient data gracefully
    if (!performanceData || performanceData.length === 0) {
        return {
            summary: `No performance data available for ${indexName} index`,
            returns: "Unknown - insufficient data",
            insights: ["Performance data not available - the index may be new or data collection may be in progress"],
            recommendation: "Check back later when more performance history is available"
        };
    }
    
    // Ensure data is sorted chronologically for proper time series analysis
    // This is crucial because performance calculations depend on the correct sequence
    const sortedData = performanceData.sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
    
    // Calculate fundamental performance metrics
    // These are the same calculations used in traditional finance for mutual funds and ETFs
    const startValue = sortedData[0].INDEX_VALUE || sortedData[0].CUMULATIVE_RETURN || 100;
    const endValue = sortedData[sortedData.length - 1].INDEX_VALUE || sortedData[sortedData.length - 1].CUMULATIVE_RETURN || 100;
    const totalReturn = startValue !== 0 ? ((endValue - startValue) / startValue) * 100 : 0;
    
    // Analyze daily returns for volatility and risk assessment
    const dailyReturns = sortedData
        .map(d => d.DAILY_RETURN)
        .filter(r => r !== null && r !== undefined && !isNaN(r));
    
    const avgDailyReturn = dailyReturns.length > 0 ? 
        dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length : 0;
    
    // Calculate volatility using standard financial formulas
    const volatility = calculateVolatility(dailyReturns);
    
    // Calculate additional risk metrics
    const maxDrawdown = calculateMaxDrawdown(sortedData);
    const sharpeRatio = calculateSharpeRatio(avgDailyReturn, volatility);
    
    // Determine performance rating using standard investment benchmarks
    let performanceRating: string;
    let riskRating: string;
    
    if (totalReturn > 50) performanceRating = "Excellent";
    else if (totalReturn > 20) performanceRating = "Good";
    else if (totalReturn > 0) performanceRating = "Fair";
    else if (totalReturn > -20) performanceRating = "Poor";
    else performanceRating = "Very Poor";
    
    if (volatility > 80) riskRating = "Very High Risk";
    else if (volatility > 60) riskRating = "High Risk";
    else if (volatility > 40) riskRating = "Moderate Risk";
    else if (volatility > 25) riskRating = "Low-Moderate Risk";
    else riskRating = "Low Risk";
    
    // Calculate time-based metrics for additional context
    const analysisTimeframe = calculateTimeframe(sortedData[0].DATE, sortedData[sortedData.length - 1].DATE);
    const annualizedReturn = calculateAnnualizedReturn(totalReturn, analysisTimeframe.days);
    
    // Generate comprehensive insights based on the analysis
    const insights: string[] = [];
    
    // Performance insights
    if (performanceRating === "Excellent") {
        insights.push(`Outstanding performance with ${totalReturn.toFixed(1)}% returns - significantly outperforming most crypto investments`);
    } else if (performanceRating === "Good") {
        insights.push(`Strong performance with ${totalReturn.toFixed(1)}% returns - above average for crypto sector investments`);
    } else if (performanceRating === "Fair") {
        insights.push(`Modest positive returns of ${totalReturn.toFixed(1)}% - performing adequately but not exceptionally`);
    } else if (performanceRating === "Poor") {
        insights.push(`Negative returns of ${totalReturn.toFixed(1)}% - underperforming in the current market environment`);
    } else {
        insights.push(`Significant losses of ${totalReturn.toFixed(1)}% - this sector has faced major challenges`);
    }
    
    // Risk insights
    if (riskRating === "Very High Risk") {
        insights.push(`Extremely high volatility (${volatility.toFixed(1)}%) indicates severe price swings - only for very risk-tolerant investors`);
    } else if (riskRating === "High Risk") {
        insights.push(`High volatility (${volatility.toFixed(1)}%) shows significant price movements - requires careful risk management`);
    } else if (riskRating === "Moderate Risk") {
        insights.push(`Moderate volatility (${volatility.toFixed(1)}%) typical for crypto sectors - manageable for experienced investors`);
    } else {
        insights.push(`Relatively low volatility (${volatility.toFixed(1)}%) for crypto markets - more stable than most crypto investments`);
    }
    
    // Risk-adjusted performance insights
    if (sharpeRatio > 1.5) {
        insights.push(`Excellent risk-adjusted returns (Sharpe: ${sharpeRatio.toFixed(2)}) - strong compensation for risk taken`);
    } else if (sharpeRatio > 1.0) {
        insights.push(`Good risk-adjusted returns (Sharpe: ${sharpeRatio.toFixed(2)}) - adequate compensation for risk`);
    } else if (sharpeRatio > 0.5) {
        insights.push(`Fair risk-adjusted returns (Sharpe: ${sharpeRatio.toFixed(2)}) - modest compensation for risk`);
    } else if (sharpeRatio > 0) {
        insights.push(`Poor risk-adjusted returns (Sharpe: ${sharpeRatio.toFixed(2)}) - insufficient compensation for risk`);
    } else {
        insights.push(`Negative risk-adjusted returns (Sharpe: ${sharpeRatio.toFixed(2)}) - losses exceeded risk-free alternatives`);
    }
    
    // Drawdown insights
    if (maxDrawdown < -30) {
        insights.push(`Significant maximum drawdown of ${maxDrawdown.toFixed(1)}% indicates potential for substantial temporary losses`);
    } else if (maxDrawdown < -15) {
        insights.push(`Moderate maximum drawdown of ${maxDrawdown.toFixed(1)}% shows manageable worst-case scenarios`);
    } else {
        insights.push(`Limited maximum drawdown of ${maxDrawdown.toFixed(1)}% suggests relatively stable performance`);
    }
    
    // Generate investment recommendations based on comprehensive analysis
    const recommendations: string[] = [];
    
    // Suitability recommendations
    if (riskRating === "Very High Risk") {
        recommendations.push("Suitable only for high-risk tolerance investors with strong conviction in the sector");
        recommendations.push("Use very small position sizes (1-3% of total portfolio)");
        recommendations.push("Consider dollar-cost averaging to reduce timing risk");
    } else if (riskRating === "High Risk") {
        recommendations.push("Appropriate for moderate to high risk tolerance investors");
        recommendations.push("Consider 3-7% portfolio allocation depending on conviction level");
        recommendations.push("Monitor sector trends closely for exit signals");
    } else if (riskRating === "Moderate Risk") {
        recommendations.push("Suitable for most experienced crypto investors");
        recommendations.push("Can consider 5-12% allocation within crypto portfolio");
        recommendations.push("Good candidate for core sector allocation");
    } else {
        recommendations.push("Suitable for conservative crypto investors seeking sector exposure");
        recommendations.push("Can consider larger allocations (10-20% of crypto portfolio)");
        recommendations.push("Excellent for risk-averse investors entering crypto markets");
    }
    
    // Performance-based recommendations
    if (totalReturn > 0 && sharpeRatio > 1.0) {
        recommendations.push("Strong risk-adjusted performance supports continued or increased allocation");
    } else if (totalReturn < -10) {
        recommendations.push("Recent poor performance suggests waiting for better entry points or avoiding this sector");
    }
    
    // General recommendations
    recommendations.push(`Monitor ${indexName} sector developments and rebalancing activity for optimal timing`);
    recommendations.push("Combine with other sector indices for broader crypto diversification");
    recommendations.push("Set clear profit-taking and stop-loss levels based on risk tolerance");
    
    return {
        summary: `${indexName} index shows ${performanceRating.toLowerCase()} performance (${totalReturn.toFixed(1)}% return) with ${riskRating.toLowerCase()} over ${analysisTimeframe.description}`,
        
        returns: {
            total_return: `${totalReturn.toFixed(2)}%`,
            annualized_return: annualizedReturn ? `${annualizedReturn.toFixed(2)}%` : 'Insufficient data',
            average_daily_return: `${avgDailyReturn.toFixed(4)}%`,
            start_value: startValue.toFixed(2),
            end_value: endValue.toFixed(2),
            periods_analyzed: sortedData.length,
            timeframe: analysisTimeframe.description
        },
        
        risk_metrics: {
            volatility: `${volatility.toFixed(2)}%`,
            volatility_assessment: riskRating,
            max_drawdown: `${maxDrawdown.toFixed(2)}%`,
            sharpe_ratio: sharpeRatio.toFixed(3),
            risk_adjusted_assessment: getRiskAdjustedAssessment(sharpeRatio)
        },
        
        performance_rating: {
            overall_rating: performanceRating,
            risk_rating: riskRating,
            investment_grade: getInvestmentGrade(performanceRating, riskRating),
            sector_comparison: generateSectorComparison(totalReturn, volatility)
        },
        
        insights: insights,
        recommendations: recommendations,
        
        investment_suitability: {
            conservative_investors: riskRating.includes("Low") ? "Suitable" : "Not Recommended",
            moderate_investors: riskRating.includes("Moderate") || riskRating.includes("Low") ? "Suitable" : "Use Caution",
            aggressive_investors: "Suitable with proper position sizing",
            institutional_investors: sharpeRatio > 1.0 && maxDrawdown > -25 ? "Consider" : "Requires Further Analysis"
        },
        
        timing_analysis: {
            entry_recommendation: generateEntryRecommendation(totalReturn, volatility, maxDrawdown),
            market_cycle_position: assessMarketCyclePosition(sortedData),
            momentum_indicator: calculateMomentumIndicator(dailyReturns)
        }
    };
}

/**
 * UTILITY FUNCTIONS FOR PERFORMANCE ANALYSIS
 * These functions implement standard financial calculations used in investment analysis
 */

/**
 * Calculate volatility using standard financial methodology
 * This measures how much the investment's returns fluctuate over time
 */
function calculateVolatility(returns: number[]): number {
    if (returns.length < 2) return 0;
    
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / (returns.length - 1);
    
    // Return annualized volatility (standard deviation * sqrt(365) for daily data)
    return Math.sqrt(variance) * Math.sqrt(365);
}

/**
 * Calculate maximum drawdown - the largest peak-to-trough decline
 * This shows the worst-case loss an investor would have experienced
 */
function calculateMaxDrawdown(data: any[]): number {
    if (data.length < 2) return 0;
    
    let maxDrawdown = 0;
    let peak = data[0].INDEX_VALUE || data[0].CUMULATIVE_RETURN || 100;
    
    for (const point of data) {
        const value = point.INDEX_VALUE || point.CUMULATIVE_RETURN || 100;
        if (value > peak) {
            peak = value;
        } else {
            const drawdown = ((value - peak) / peak) * 100;
            if (drawdown < maxDrawdown) {
                maxDrawdown = drawdown;
            }
        }
    }
    
    return maxDrawdown;
}

/**
 * Calculate Sharpe ratio - risk-adjusted return measure
 * This shows how much return you get per unit of risk taken
 */
function calculateSharpeRatio(avgReturn: number, volatility: number): number {
    if (volatility === 0) return 0;
    
    // Assuming risk-free rate of 2% annually (0.0055% daily)
    const riskFreeRate = 0.000055;
    const excessReturn = avgReturn - riskFreeRate;
    const dailyVolatility = volatility / Math.sqrt(365);
    
    return excessReturn / dailyVolatility;
}

/**
 * Calculate timeframe information for the analysis period
 */
function calculateTimeframe(startDate: string, endDate: string): { days: number; description: string } {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    let description: string;
    if (days < 30) description = `${days} days`;
    else if (days < 365) description = `${Math.round(days / 30)} months`;
    else description = `${(days / 365).toFixed(1)} years`;
    
    return { days, description };
}

/**
 * Calculate annualized return for comparison purposes
 */
function calculateAnnualizedReturn(totalReturn: number, days: number): number | null {
    if (days < 30) return null; // Need at least 30 days for meaningful annualization
    
    const years = days / 365;
    return Math.pow(1 + totalReturn / 100, 1 / years) * 100 - 100;
}

/**
 * Generate risk-adjusted assessment description
 */
function getRiskAdjustedAssessment(sharpeRatio: number): string {
    if (sharpeRatio > 2.0) return "Exceptional risk-adjusted performance";
    if (sharpeRatio > 1.5) return "Excellent risk-adjusted performance";
    if (sharpeRatio > 1.0) return "Good risk-adjusted performance";
    if (sharpeRatio > 0.5) return "Fair risk-adjusted performance";
    if (sharpeRatio > 0) return "Poor risk-adjusted performance";
    return "Negative risk-adjusted performance";
}

/**
 * Generate overall investment grade
 */
function getInvestmentGrade(performanceRating: string, riskRating: string): string {
    if (performanceRating === "Excellent" && !riskRating.includes("Very High")) return "A";
    if (performanceRating === "Good" && riskRating.includes("Low")) return "A-";
    if (performanceRating === "Good" && riskRating.includes("Moderate")) return "B+";
    if (performanceRating === "Fair" && !riskRating.includes("Very High")) return "B";
    if (performanceRating === "Poor") return "C";
    return "D";
}

/**
 * Generate sector comparison context
 */
function generateSectorComparison(totalReturn: number, volatility: number): string {
    // These are rough benchmarks for crypto sector comparison
    if (totalReturn > 30 && volatility < 60) return "Outperforming most crypto sectors with manageable risk";
    if (totalReturn > 15) return "Above average performance for crypto sectors";
    if (totalReturn > 0) return "Modest performance relative to crypto market";
    if (totalReturn > -20) return "Underperforming but within normal crypto volatility range";
    return "Significantly underperforming crypto market";
}

/**
 * Generate entry recommendation based on current conditions
 */
function generateEntryRecommendation(totalReturn: number, volatility: number, maxDrawdown: number): string {
    if (totalReturn < -15 && maxDrawdown < -20) return "Potential value opportunity - consider gradual entry";
    if (totalReturn > 30 && volatility > 70) return "Proceed with caution - high returns may not be sustainable";
    if (totalReturn > 0 && volatility < 50) return "Favorable risk-reward profile for entry";
    return "Monitor for better entry conditions";
}

/**
 * Assess market cycle position
 */
function assessMarketCyclePosition(data: any[]): string {
    if (data.length < 10) return "Insufficient data for cycle analysis";
    
    const recentData = data.slice(-10);
    const earlierData = data.slice(-20, -10);
    
    const recentAvg = recentData.reduce((sum, d) => sum + (d.INDEX_VALUE || d.CUMULATIVE_RETURN || 100), 0) / recentData.length;
    const earlierAvg = earlierData.reduce((sum, d) => sum + (d.INDEX_VALUE || d.CUMULATIVE_RETURN || 100), 0) / earlierData.length;
    
    if (recentAvg > earlierAvg * 1.1) return "Uptrend - potentially late cycle";
    if (recentAvg < earlierAvg * 0.9) return "Downtrend - potentially early cycle";
    return "Sideways trend - mid-cycle consolidation";
}

/**
 * Calculate momentum indicator from recent returns
 */
function calculateMomentumIndicator(returns: number[]): string {
    if (returns.length < 5) return "Insufficient data";
    
    const recentReturns = returns.slice(-5);
    const avgRecentReturn = recentReturns.reduce((sum, r) => sum + r, 0) / recentReturns.length;
    
    if (avgRecentReturn > 0.5) return "Strong Positive Momentum";
    if (avgRecentReturn > 0.1) return "Moderate Positive Momentum";
    if (avgRecentReturn > -0.1) return "Neutral Momentum";
    if (avgRecentReturn > -0.5) return "Moderate Negative Momentum";
    return "Strong Negative Momentum";
}
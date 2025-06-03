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
import type { TraderGradesResponse, TraderGradesRequest } from "../types";

/**
 * CORRECTED Trader Grades Action - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/trader-grades
 * 
 * This action provides AI-powered short-term trading grades.
 * According to the API docs, it uses parameters like startDate/endDate (not start_date/end_date),
 * and supports filtering by various criteria including marketcap, volume, etc.
 */
export const getTraderGradesAction: Action = {
    name: "getTraderGrades",
    description: "Get AI-powered trader grades for short-term trading decisions from TokenMetrics",
    similes: [
        "get trader grades",
        "get trading grades", 
        "check trader score",
        "get short term grades",
        "analyze trading potential",
        "get AI trading grades"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Extract token identifiers
            const tokenIdentifier = extractTokenIdentifier(messageContent);
            
            // CORRECTED: Build parameters based on actual API documentation
            const requestParams: TraderGradesRequest = {
                // Token identification
                token_id: tokenIdentifier.token_id || 
                         (typeof messageContent.token_id === 'number' ? messageContent.token_id : undefined),
                symbol: tokenIdentifier.symbol || 
                       (typeof messageContent.symbol === 'string' ? messageContent.symbol : undefined),
                
                // CORRECTED: Use startDate/endDate as shown in actual API docs
                startDate: typeof messageContent.startDate === 'string' ? messageContent.startDate : 
                          typeof messageContent.start_date === 'string' ? messageContent.start_date : undefined,
                endDate: typeof messageContent.endDate === 'string' ? messageContent.endDate :
                        typeof messageContent.end_date === 'string' ? messageContent.end_date : undefined,
                
                // Additional filtering parameters from API docs
                category: typeof messageContent.category === 'string' ? messageContent.category : undefined,
                exchange: typeof messageContent.exchange === 'string' ? messageContent.exchange : undefined,
                marketcap: typeof messageContent.marketcap === 'number' ? messageContent.marketcap : undefined,
                fdv: typeof messageContent.fdv === 'number' ? messageContent.fdv : undefined,
                volume: typeof messageContent.volume === 'number' ? messageContent.volume : undefined,
                traderGrade: typeof messageContent.traderGrade === 'number' ? messageContent.traderGrade : undefined,
                traderGradePercentChange: typeof messageContent.traderGradePercentChange === 'number' ? 
                    messageContent.traderGradePercentChange : undefined,
                
                // CORRECTED: Use page instead of offset for pagination
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : 50,
                page: typeof messageContent.page === 'number' ? messageContent.page : 1
            };
            
            // Validate parameters according to actual API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Fetching trader grades from TokenMetrics v2/trader-grades endpoint");
            
            // Make API call with corrected authentication
            const response = await callTokenMetricsApi<TraderGradesResponse>(
                TOKENMETRICS_ENDPOINTS.traderGrades,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<TraderGradesResponse>(response, "getTraderGrades");
            const traderGrades = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the trader grades
            const gradesAnalysis = analyzeTraderGrades(traderGrades);
            
            return {
                success: true,
                message: `Successfully retrieved trader grades for ${traderGrades.length} data points`,
                trader_grades: traderGrades,
                analysis: gradesAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.traderGrades,
                    requested_token: tokenIdentifier.symbol || tokenIdentifier.token_id,
                    date_range: {
                        start: requestParams.startDate,
                        end: requestParams.endDate
                    },
                    filters_applied: {
                        category: requestParams.category,
                        exchange: requestParams.exchange,
                        min_marketcap: requestParams.marketcap,
                        min_volume: requestParams.volume
                    },
                    pagination: {
                        page: requestParams.page,
                        limit: requestParams.limit
                    },
                    data_points: traderGrades.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                grades_explanation: {
                    TM_TRADER_GRADE: "Overall short-term trading attractiveness (0-100) - TokenMetrics' primary trading signal",
                    TRADER_GRADE_24H_PERCENT_CHANGE: "24-hour percentage change in the trader grade",
                    grade_interpretation: {
                        "80-100": "Excellent - Strong short-term trading opportunity",
                        "60-79": "Good - Positive short-term outlook",
                        "40-59": "Fair - Neutral trading signals",
                        "20-39": "Poor - Caution advised for short-term trading",
                        "0-19": "Very Poor - Avoid short-term trading"
                    }
                }
            };
            
        } catch (error) {
            console.error("Error in getTraderGradesAction:", error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve trader grades from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/trader-grades is accessible",
                    parameter_validation: [
                        "Verify that date parameters use startDate/endDate format (YYYY-MM-DD)",
                        "Check that token_id or symbol is correct and supported",
                        "Ensure numeric filters (marketcap, volume) are positive numbers",
                        "Confirm your API key has access to trader grades endpoint"
                    ],
                    common_solutions: [
                        "Try using a major token (BTC, ETH) to test functionality",
                        "Use the tokens endpoint first to verify correct TOKEN_ID",
                        "Check if your subscription includes trader grades access",
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
                    text: "What's Bitcoin's trader grade?",
                    symbol: "BTC"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get Bitcoin's current TokenMetrics trader grade for short-term trading analysis.",
                    action: "GET_TRADER_GRADES"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me trading grades for DeFi tokens",
                    category: "defi",
                    limit: 20
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll analyze DeFi token trader grades from TokenMetrics.",
                    action: "GET_TRADER_GRADES"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get trader grades for tokens with market cap over $1B",
                    marketcap: 1000000000
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get trader grades for large-cap cryptocurrencies.",
                    action: "GET_TRADER_GRADES"
                }
            }
        ]
    ],
};

/**
 * Analyze trader grades data to provide trading insights
 */
function analyzeTraderGrades(gradesData: any[]): any {
    if (!gradesData || gradesData.length === 0) {
        return {
            summary: "No trader grades data available for analysis",
            trading_recommendation: "Cannot assess",
            insights: []
        };
    }
    
    // Calculate grade distribution
    const gradeDistribution = analyzeGradeDistribution(gradesData);
    
    // Identify top trading opportunities
    const topOpportunities = identifyTopOpportunities(gradesData);
    
    // Analyze grade trends if multiple data points
    const trendAnalysis = analyzeGradeTrends(gradesData);
    
    // Generate insights
    const insights = generateGradeInsights(gradesData, gradeDistribution, topOpportunities);
    
    return {
        summary: `TokenMetrics trader grade analysis shows ${gradeDistribution.average_grade.toFixed(1)} average grade across ${gradesData.length} tokens`,
        grade_distribution: gradeDistribution,
        top_opportunities: topOpportunities,
        trend_analysis: trendAnalysis,
        insights: insights,
        trading_recommendations: generateTradingRecommendations(gradeDistribution, topOpportunities),
        data_quality: {
            source: "TokenMetrics Official API",
            data_points: gradesData.length,
            reliability: "High - AI-powered analysis"
        }
    };
}

function analyzeGradeDistribution(gradesData: any[]): any {
    const grades = gradesData.map(d => d.TM_TRADER_GRADE).filter(g => g !== null && g !== undefined);
    
    if (grades.length === 0) {
        return { average_grade: 0, distribution: "No data" };
    }
    
    const averageGrade = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    
    // Categorize grades
    const excellent = grades.filter(g => g >= 80).length;
    const good = grades.filter(g => g >= 60 && g < 80).length;
    const fair = grades.filter(g => g >= 40 && g < 60).length;
    const poor = grades.filter(g => g < 40).length;
    
    return {
        average_grade: averageGrade,
        total_tokens: grades.length,
        distribution: {
            excellent: `${excellent} tokens (${((excellent / grades.length) * 100).toFixed(1)}%)`,
            good: `${good} tokens (${((good / grades.length) * 100).toFixed(1)}%)`,
            fair: `${fair} tokens (${((fair / grades.length) * 100).toFixed(1)}%)`,
            poor: `${poor} tokens (${((poor / grades.length) * 100).toFixed(1)}%)`
        },
        market_sentiment: averageGrade >= 60 ? "Positive" : averageGrade >= 40 ? "Neutral" : "Negative"
    };
}

function identifyTopOpportunities(gradesData: any[]): any {
    // Sort by trader grade and get top opportunities
    const topGrades = gradesData
        .filter(d => d.TM_TRADER_GRADE >= 60) // Only good grades
        .sort((a, b) => b.TM_TRADER_GRADE - a.TM_TRADER_GRADE)
        .slice(0, 5);
    
    const opportunities = topGrades.map(token => ({
        name: `${token.NAME} (${token.SYMBOL})`,
        trader_grade: `${token.TM_TRADER_GRADE}/100`,
        grade_change_24h: token.TRADER_GRADE_24H_PERCENT_CHANGE ? 
            formatTokenMetricsNumber(token.TRADER_GRADE_24H_PERCENT_CHANGE, 'percentage') : 'N/A',
        interpretation: interpretGrade(token.TM_TRADER_GRADE),
        market_cap: token.MARKET_CAP ? formatTokenMetricsNumber(token.MARKET_CAP, 'currency') : 'N/A'
    }));
    
    return {
        count: opportunities.length,
        opportunities: opportunities,
        quality_assessment: opportunities.length >= 3 ? "Good" : opportunities.length >= 1 ? "Limited" : "Poor"
    };
}

function analyzeGradeTrends(gradesData: any[]): any {
    // Analyze 24h changes if available
    const changes = gradesData
        .map(d => d.TRADER_GRADE_24H_PERCENT_CHANGE)
        .filter(c => c !== null && c !== undefined);
    
    if (changes.length === 0) {
        return { trend: "No trend data available" };
    }
    
    const averageChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const improving = changes.filter(c => c > 0).length;
    const declining = changes.filter(c => c < 0).length;
    
    let trendDirection;
    if (improving > declining * 1.5) trendDirection = "Improving";
    else if (declining > improving * 1.5) trendDirection = "Declining";
    else trendDirection = "Mixed";
    
    return {
        trend_direction: trendDirection,
        average_24h_change: formatTokenMetricsNumber(averageChange, 'percentage'),
        tokens_improving: improving,
        tokens_declining: declining,
        trend_strength: Math.abs(averageChange) > 2 ? "Strong" : Math.abs(averageChange) > 0.5 ? "Moderate" : "Weak"
    };
}

function generateGradeInsights(gradesData: any[], gradeDistribution: any, topOpportunities: any): string[] {
    const insights = [];
    
    // Distribution insights
    if (gradeDistribution.market_sentiment === "Positive") {
        insights.push("Strong overall trader grade sentiment suggests favorable short-term trading conditions.");
    } else if (gradeDistribution.market_sentiment === "Negative") {
        insights.push("Low trader grades suggest caution in short-term trading strategies.");
    }
    
    // Opportunity insights
    if (topOpportunities.count >= 3) {
        insights.push(`${topOpportunities.count} high-quality trading opportunities identified with grades above 60.`);
    } else if (topOpportunities.count === 0) {
        insights.push("No high-grade trading opportunities currently available - consider waiting for better conditions.");
    }
    
    // Quality insights
    const excellentCount = gradesData.filter(d => d.TM_TRADER_GRADE >= 80).length;
    if (excellentCount > 0) {
        insights.push(`${excellentCount} tokens showing excellent trader grades (80+) indicating strong trading potential.`);
    }
    
    return insights;
}

function generateTradingRecommendations(gradeDistribution: any, topOpportunities: any): string[] {
    const recommendations = [];
    
    // Based on overall distribution
    if (gradeDistribution.market_sentiment === "Positive") {
        recommendations.push("Favorable conditions for active short-term trading strategies");
    } else if (gradeDistribution.market_sentiment === "Negative") {
        recommendations.push("Conservative approach recommended - focus on defensive positioning");
    }
    
    // Based on opportunities
    if (topOpportunities.count >= 3) {
        recommendations.push("Multiple trading opportunities available - consider diversified approach");
        recommendations.push("Focus on tokens with trader grades above 70 for better success probability");
    } else {
        recommendations.push("Limited opportunities - be highly selective with trading decisions");
    }
    
    // General recommendations
    recommendations.push("Monitor trader grade changes daily for evolving opportunities");
    recommendations.push("Always use proper risk management regardless of grade levels");
    
    return recommendations;
}

function interpretGrade(grade: number): string {
    if (grade >= 80) return "Excellent";
    if (grade >= 60) return "Good";
    if (grade >= 40) return "Fair";
    if (grade >= 20) return "Poor";
    return "Very Poor";
}
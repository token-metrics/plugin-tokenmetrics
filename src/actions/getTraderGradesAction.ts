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
 * Action to get trader grades from TokenMetrics.
 * This action provides AI-powered short-term trading grades that help traders
 * make informed buy and sell decisions using TokenMetrics' proprietary algorithms.
 * 
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/trader-grades
 * 
 * The trader grades include:
 * - TM_TRADER_GRADE: Overall short-term trading attractiveness (0-100)
 * - TRADER_GRADE_24H_PERCENT_CHANGE: 24-hour change in the trader grade
 * - TA_GRADE: Technical Analysis grade based on price movements and indicators
 * - QUANTITATIVE_GRADE: Grade based on quantitative-driven performance metrics
 * - ONCHAIN_GRADE: Grade based on on-chain metrics and blockchain data
 * 
 * These grades combine Technical Analysis, Quantitative Performance Metrics,
 * and On-chain Analysis to provide comprehensive short-term trading insights.
 */
export const getTraderGradesAction: Action = {
    name: "getTraderGrades",
    description: "Get AI-powered trader grades for short-term trading decisions, including technical analysis and on-chain metrics from TokenMetrics",
    similes: [
        "get trader grades",
        "get trading grades", 
        "check trader score",
        "get short term grades",
        "analyze trading potential",
        "get AI trading grades",
        "check TM trader grade",
        "get technical analysis grades"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            // Extract parameters from the message content
            const messageContent = message.content as any;
            
            // Extract token identifiers from the user's request
            const tokenIdentifier = extractTokenIdentifier(messageContent);
            
            // Build request parameters for the real TokenMetrics trader-grades endpoint
            const requestParams: TraderGradesRequest = {
                // Token identification - use either token_id or symbol
                token_id: tokenIdentifier.token_id,
                symbol: tokenIdentifier.symbol,
                
                // Date range parameters for historical grade analysis
                start_date: typeof messageContent.start_date === 'string' ? messageContent.start_date : undefined,
                end_date: typeof messageContent.end_date === 'string' ? messageContent.end_date : undefined,
                
                // Pagination for large datasets
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : undefined,
            };
            
            // Validate all parameters according to TokenMetrics API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters for the API request
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Fetching trader grades from TokenMetrics v2/trader-grades endpoint");
            
            // Make the API call to the real TokenMetrics trader-grades endpoint
            const response = await callTokenMetricsApi<TraderGradesResponse>(
                TOKENMETRICS_ENDPOINTS.traderGrades,
                apiParams,
                "GET"
            );
            
            // Format the response data for consistent structure
            const formattedData = formatTokenMetricsResponse<TraderGradesResponse>(response, "getTraderGrades");
            
            // Process the real API response structure
            const traderGrades = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the trader grades to provide trading insights
            const gradesAnalysis = analyzeTraderGrades(traderGrades);
            
            // Return comprehensive trader grades analysis with actionable insights
            return {
                success: true,
                message: `Successfully retrieved trader grades for ${traderGrades.length} data points`,
                trader_grades: traderGrades,
                analysis: gradesAnalysis,
                // Include metadata about the request
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.traderGrades,
                    requested_token: tokenIdentifier.symbol || tokenIdentifier.token_id,
                    date_range: {
                        start: requestParams.start_date,
                        end: requestParams.end_date
                    },
                    data_points: traderGrades.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                // Provide educational context about TokenMetrics grades
                grades_explanation: {
                    TM_TRADER_GRADE: "Overall short-term trading attractiveness (0-100) - TokenMetrics' primary trading signal",
                    TA_GRADE: "Technical Analysis grade focusing on price movements and trading indicators",
                    QUANTITATIVE_GRADE: "Quantitative-driven performance metrics grade",
                    ONCHAIN_GRADE: "On-chain metrics analysis grade based on blockchain data",
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
            
            // Return detailed error information with troubleshooting guidance
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred while fetching trader grades",
                message: "Failed to retrieve trader grades from TokenMetrics API",
                // Include helpful troubleshooting steps for the real endpoint
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/trader-grades is accessible",
                    parameter_validation: [
                        "Verify the token symbol or ID is correct and supported by TokenMetrics",
                        "Check that date ranges are in YYYY-MM-DD format",
                        "Ensure your API key has access to trader grades endpoint",
                        "Confirm the token has recent grade calculations available"
                    ],
                    common_solutions: [
                        "Try using a major token (BTC, ETH) to test trader grades functionality",
                        "Use the tokens endpoint first to verify correct TOKEN_ID",
                        "Check if your subscription includes trader grades access",
                        "Verify the token is actively tracked by TokenMetrics"
                    ]
                }
            };
        }
    },
    
    /**
     * Validate that the runtime environment supports trader grades access.
     * Trader grades may require specific subscription levels.
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
     * Examples showing different ways to use the trader grades endpoint.
     * These examples reflect real TokenMetrics API usage patterns.
     */
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
                    text: "Show me Ethereum's trading grades over the past month",
                    symbol: "ETH",
                    start_date: "2024-12-01",
                    end_date: "2024-12-31"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll analyze Ethereum's trader grade history for December 2024.",
                    action: "GET_TRADER_GRADES"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Is this a good time to trade Solana based on AI grades?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll check Solana's current TokenMetrics trader grades to assess short-term trading potential.",
                    action: "GET_TRADER_GRADES"
                }
            }
        ]
    ],
};

/**
 * Advanced analysis function for trader grades from TokenMetrics.
 * This function interprets the real API response data and provides trading insights.
 * 
 * @param gradesData - Array of trader grades data from TokenMetrics API
 * @returns Comprehensive analysis with trading recommendations and insights
 */
function analyzeTraderGrades(gradesData: any[]): any {
    if (!gradesData || gradesData.length === 0) {
        return {
            summary: "No trader grades data available for analysis",
            trading_recommendation: "Cannot assess",
            grade_trend: "Unknown",
            insights: []
        };
    }
    
    // Get the most recent grades for current analysis
    const latestGrades = gradesData[gradesData.length - 1];
    
    // Analyze grade trends if we have multiple data points
    const trendAnalysis = gradesData.length > 1 ? analyzeTrendDirection(gradesData) : null;
    
    // Assess current trading potential
    const tradingAssessment = assessTradingPotential(latestGrades);
    
    // Generate grade-specific insights
    const gradeInsights = generateGradeInsights(latestGrades, trendAnalysis);
    
    // Determine overall trading recommendation
    const tradingRecommendation = generateTradingRecommendation(latestGrades, trendAnalysis);
    
    return {
        summary: `TokenMetrics trader grade analysis for ${latestGrades.NAME} (${latestGrades.SYMBOL}) shows ${tradingAssessment.overall_rating} short-term trading potential`,
        
        current_grades: {
            tm_trader_grade: `${latestGrades.TM_TRADER_GRADE}/100 - ${interpretGrade(latestGrades.TM_TRADER_GRADE)}`,
            grade_24h_change: formatTokenMetricsNumber(latestGrades.TRADER_GRADE_24H_PERCENT_CHANGE, 'percentage'),
            ta_grade: `${latestGrades.TA_GRADE || 'N/A'}/100`,
            quantitative_grade: `${latestGrades.QUANTITATIVE_GRADE || 'N/A'}/100`,
            onchain_grade: `${latestGrades.ONCHAIN_GRADE || 'N/A'}/100`,
            date: latestGrades.DATE
        },
        
        trading_assessment: tradingAssessment,
        
        trend_analysis: trendAnalysis,
        
        grade_breakdown: {
            strongest_component: identifyStrongestComponent(latestGrades),
            weakest_component: identifyWeakestComponent(latestGrades),
            grade_consistency: assessGradeConsistency(latestGrades)
        },
        
        insights: gradeInsights,
        
        trading_recommendation: tradingRecommendation,
        
        data_quality: {
            source: "TokenMetrics Official API",
            data_points: gradesData.length,
            latest_date: latestGrades.DATE,
            reliability: "High - TokenMetrics AI-powered analysis"
        }
    };
}

// Helper functions for analyzing TokenMetrics trader grades

function interpretGrade(grade: number): string {
    if (grade >= 80) return "Excellent";
    if (grade >= 60) return "Good";
    if (grade >= 40) return "Fair";
    if (grade >= 20) return "Poor";
    return "Very Poor";
}

function assessTradingPotential(grades: any): any {
    const traderGrade = grades.TM_TRADER_GRADE;
    const gradeChange = grades.TRADER_GRADE_24H_PERCENT_CHANGE;
    
    let overall_rating, confidence, momentum;
    
    // Assess overall rating based on trader grade
    if (traderGrade >= 80) {
        overall_rating = "Excellent";
        confidence = "High";
    } else if (traderGrade >= 60) {
        overall_rating = "Good";
        confidence = "Moderate";
    } else if (traderGrade >= 40) {
        overall_rating = "Fair";
        confidence = "Low";
    } else {
        overall_rating = "Poor";
        confidence = "Very Low";
    }
    
    // Assess momentum based on 24h change
    if (gradeChange > 5) {
        momentum = "Strongly Positive";
    } else if (gradeChange > 1) {
        momentum = "Positive";
    } else if (gradeChange > -1) {
        momentum = "Neutral";
    } else if (gradeChange > -5) {
        momentum = "Negative";
    } else {
        momentum = "Strongly Negative";
    }
    
    return {
        overall_rating,
        confidence,
        momentum,
        grade_strength: traderGrade,
        recent_change: gradeChange
    };
}

function analyzeTrendDirection(gradesData: any[]): any {
    if (gradesData.length < 2) return null;
    
    const recentGrades = gradesData.slice(-5); // Last 5 data points
    const grades = recentGrades.map(d => d.TM_TRADER_GRADE);
    
    // Calculate trend direction
    const firstGrade = grades[0];
    const lastGrade = grades[grades.length - 1];
    const trendChange = ((lastGrade - firstGrade) / firstGrade) * 100;
    
    let direction;
    if (trendChange > 10) direction = "Strong Upward";
    else if (trendChange > 2) direction = "Upward";
    else if (trendChange > -2) direction = "Sideways";
    else if (trendChange > -10) direction = "Downward";
    else direction = "Strong Downward";
    
    // Calculate consistency
    let improvements = 0;
    for (let i = 1; i < grades.length; i++) {
        if (grades[i] > grades[i-1]) improvements++;
    }
    const consistency = (improvements / (grades.length - 1)) * 100;
    
    return {
        direction,
        change_percent: trendChange.toFixed(2),
        consistency: `${consistency.toFixed(1)}%`,
        data_points: grades.length,
        time_period: `${recentGrades[0].DATE} to ${recentGrades[recentGrades.length - 1].DATE}`
    };
}

function generateGradeInsights(grades: any, trendAnalysis: any): string[] {
    const insights = [];
    
    // Main trader grade insights
    if (grades.TM_TRADER_GRADE >= 80) {
        insights.push("Excellent trader grade suggests strong short-term trading opportunity according to TokenMetrics AI.");
    } else if (grades.TM_TRADER_GRADE >= 60) {
        insights.push("Good trader grade indicates positive short-term trading potential.");
    } else if (grades.TM_TRADER_GRADE < 40) {
        insights.push("Low trader grade suggests avoiding short-term trading until conditions improve.");
    }
    
    // 24h change insights
    if (Math.abs(grades.TRADER_GRADE_24H_PERCENT_CHANGE) > 5) {
        insights.push(`Significant 24h grade change (${grades.TRADER_GRADE_24H_PERCENT_CHANGE.toFixed(1)}%) indicates rapidly evolving trading conditions.`);
    }
    
    // Component grade insights
    if (grades.TA_GRADE > grades.TM_TRADER_GRADE + 10) {
        insights.push("Technical analysis shows stronger signals than overall grade - good for technical traders.");
    }
    
    if (grades.ONCHAIN_GRADE > grades.TM_TRADER_GRADE + 10) {
        insights.push("On-chain metrics are particularly strong - fundamental demand may be building.");
    }
    
    // Trend insights
    if (trendAnalysis && trendAnalysis.direction.includes("Upward")) {
        insights.push("Grade trend is improving - trading conditions are becoming more favorable.");
    } else if (trendAnalysis && trendAnalysis.direction.includes("Downward")) {
        insights.push("Grade trend is declining - exercise caution with new positions.");
    }
    
    return insights;
}

function generateTradingRecommendation(grades: any, trendAnalysis: any): any {
    const traderGrade = grades.TM_TRADER_GRADE;
    const gradeChange = grades.TRADER_GRADE_24H_PERCENT_CHANGE;
    const isImproving = trendAnalysis && trendAnalysis.direction.includes("Upward");
    
    let action, confidence, reasoning;
    
    if (traderGrade >= 70 && gradeChange >= 0) {
        action = "Consider Long Position";
        confidence = "High";
        reasoning = "High trader grade with positive or stable recent change";
    } else if (traderGrade >= 60 && isImproving) {
        action = "Cautious Long Position";
        confidence = "Moderate";
        reasoning = "Good grade with improving trend";
    } else if (traderGrade >= 40 && gradeChange > 2) {
        action = "Monitor for Entry";
        confidence = "Low";
        reasoning = "Fair grade but showing improvement";
    } else if (traderGrade < 40 || gradeChange < -5) {
        action = "Avoid or Exit";
        confidence = "High";
        reasoning = "Low grade or declining rapidly";
    } else {
        action = "Hold/Monitor";
        confidence = "Medium";
        reasoning = "Mixed signals require careful monitoring";
    }
    
    return {
        action,
        confidence,
        reasoning,
        risk_level: traderGrade < 50 ? "High" : traderGrade < 70 ? "Medium" : "Low",
        time_horizon: "Short-term (days to weeks)",
        next_review: "Monitor daily for grade changes"
    };
}

function identifyStrongestComponent(grades: any): string {
    const components = {
        "Technical Analysis": grades.TA_GRADE,
        "Quantitative": grades.QUANTITATIVE_GRADE,
        "On-chain": grades.ONCHAIN_GRADE
    };
    
    let strongest = "Unknown";
    let highestScore = -1;
    
    Object.entries(components).forEach(([name, score]) => {
        if (score && score > highestScore) {
            highestScore = score;
            strongest = name;
        }
    });
    
    return `${strongest} (${highestScore}/100)`;
}

function identifyWeakestComponent(grades: any): string {
    const components = {
        "Technical Analysis": grades.TA_GRADE,
        "Quantitative": grades.QUANTITATIVE_GRADE,
        "On-chain": grades.ONCHAIN_GRADE
    };
    
    let weakest = "Unknown";
    let lowestScore = 101;
    
    Object.entries(components).forEach(([name, score]) => {
        if (score && score < lowestScore) {
            lowestScore = score;
            weakest = name;
        }
    });
    
    return `${weakest} (${lowestScore}/100)`;
}

function assessGradeConsistency(grades: any): string {
    const components = [grades.TA_GRADE, grades.QUANTITATIVE_GRADE, grades.ONCHAIN_GRADE].filter(g => g !== null && g !== undefined);
    
    if (components.length < 2) return "Insufficient data";
    
    const max = Math.max(...components);
    const min = Math.min(...components);
    const range = max - min;
    
    if (range <= 15) return "Highly Consistent";
    else if (range <= 30) return "Moderately Consistent";
    else return "Inconsistent";
}
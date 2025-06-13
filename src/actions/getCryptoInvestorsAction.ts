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
import type { CryptoInvestorsResponse } from "../types";

// Zod schema for crypto investors request validation
const CryptoInvestorsRequestSchema = z.object({
    limit: z.number().min(1).max(1000).optional().describe("Number of investors to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["performance", "influence", "sentiment", "all"]).optional().describe("Type of analysis to focus on")
});

type CryptoInvestorsRequest = z.infer<typeof CryptoInvestorsRequestSchema>;

// AI extraction template for natural language processing
const CRYPTO_INVESTORS_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting crypto investors data requests from natural language.

The user wants to get information about crypto investors and their market activity. Extract the following information:

1. **limit** (optional, default: 50): How many investors they want to see
   - Look for numbers like "top 20 investors", "50 investors", "first 100"
   - Common requests: "top 20" → 20, "50 investors" → 50, "all investors" → 100
   - Maximum is 1000

2. **page** (optional, default: 1): Which page of results (for pagination)
   - Usually not mentioned unless they want specific pages

3. **analysisType** (optional, default: "all"): What type of analysis they want
   - "performance" - focus on investor performance and returns
   - "influence" - focus on market influence and following
   - "sentiment" - focus on market sentiment and activity
   - "all" - comprehensive analysis

Examples:
- "Show me crypto investors" → {limit: 50, page: 1, analysisType: "all"}
- "Get top 20 crypto investors by performance" → {limit: 20, page: 1, analysisType: "performance"}
- "List influential crypto investors" → {limit: 50, page: 1, analysisType: "influence"}
- "Crypto investor sentiment analysis" → {limit: 50, page: 1, analysisType: "sentiment"}

Extract the request details from the user's message.
`;

/**
 * CRYPTO INVESTORS ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/crypto-investors
 * 
 * This action gets the latest list of crypto investors and their scores.
 * Essential for understanding investor sentiment and tracking influential market participants.
 */
export const getCryptoInvestorsAction: Action = {
    name: "GET_CRYPTO_INVESTORS_TOKENMETRICS",
    description: "Get the latest list of crypto investors and their scores from TokenMetrics for market sentiment analysis",
    similes: [
        "get crypto investors",
        "investor list",
        "investor scores",
        "market participants",
        "investor sentiment",
        "influential investors",
        "crypto investor analysis"
    ],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me the latest crypto investors data"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve the latest crypto investors list and their scores from TokenMetrics.",
                    action: "GET_CRYPTO_INVESTORS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get top 20 crypto investors by performance"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the top 20 crypto investors ranked by their performance scores.",
                    action: "GET_CRYPTO_INVESTORS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Analyze influential crypto investors"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll analyze the most influential crypto investors and their market impact.",
                    action: "GET_CRYPTO_INVESTORS_TOKENMETRICS"
                }
            }
        ]
    ],
    
    async handler(
        runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> {
        try {
            const requestId = generateRequestId();
            console.log(`[${requestId}] Processing crypto investors request...`);
            
            // Extract structured request using AI
            const investorsRequest = await extractTokenMetricsRequest<CryptoInvestorsRequest>(
                runtime,
                message,
                state || await runtime.composeState(message),
                CRYPTO_INVESTORS_EXTRACTION_TEMPLATE,
                CryptoInvestorsRequestSchema,
                requestId
            );
            
            console.log(`[${requestId}] Extracted request:`, investorsRequest);
            
            // Apply defaults for optional fields
            const processedRequest = {
                limit: investorsRequest.limit || 50,
                page: investorsRequest.page || 1,
                analysisType: investorsRequest.analysisType || "all"
            };
            
            // Build API parameters
            const apiParams: Record<string, any> = {
                limit: processedRequest.limit,
                page: processedRequest.page
            };
            
            // Make API call
            const response = await callTokenMetricsAPI(
                "/v2/crypto-investors",
                apiParams,
                runtime
            );
            
            console.log(`[${requestId}] API response received, processing data...`);
            
            // Process response data
            const investorsData = Array.isArray(response) ? response : response.data || [];
            
            // Analyze the investors data based on requested analysis type
            const investorsAnalysis = analyzeCryptoInvestors(investorsData, processedRequest.analysisType);
            
            // Format response text for user
            const responseText = formatCryptoInvestorsResponse(investorsData, investorsAnalysis, processedRequest);
            
            const result = {
                success: true,
                message: `Successfully retrieved ${investorsData.length} crypto investors data`,
                request_id: requestId,
                crypto_investors: investorsData,
                analysis: investorsAnalysis,
                metadata: {
                    endpoint: "crypto-investors",
                    pagination: {
                        page: processedRequest.page,
                        limit: processedRequest.limit
                    },
                    analysis_focus: processedRequest.analysisType,
                    data_points: investorsData.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                investors_explanation: {
                    purpose: "Track influential crypto investors and their market participation",
                    investor_scores: "Proprietary scoring system based on portfolio performance, influence, and market activity",
                    data_includes: [
                        "Investor names and identification",
                        "Performance scores and rankings",
                        "Investment activity and portfolio insights",
                        "Market influence and sentiment indicators"
                    ],
                    usage_guidelines: [
                        "Use for understanding market sentiment and investor behavior",
                        "Track influential investors for market timing insights",
                        "Analyze investor concentration and market participation",
                        "Combine with other metrics for comprehensive market analysis"
                    ]
                }
            };
            
            console.log(`[${requestId}] Crypto investors analysis completed successfully`);
            console.log(`[${requestId}] Analysis completed successfully`);
            
            // Use callback to send response to user
            if (callback) {
                callback({
                    text: responseText,
                    content: result
                });
            }
            
            return true;
        } catch (error) {
            console.error("Error in getCryptoInvestorsAction:", error);
            
            const errorResult = {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve crypto investors from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/crypto-investors is accessible",
                    parameter_validation: [
                        "Check that pagination parameters (page, limit) are positive integers",
                        "Ensure your API key has access to crypto investors endpoint"
                    ],
                    common_solutions: [
                        "Try with default parameters (no filters)",
                        "Check if your subscription includes crypto investors data access",
                        "Verify TokenMetrics API service status"
                    ]
                }
            };
            
            // Use callback for error response too
            if (callback) {
                callback({
                    text: "❌ Failed to retrieve crypto investors data. Please try again later.",
                    content: errorResult
                });
            }
            return false;
        }
    },
    
    async validate(runtime, _message) {
        return validateAndGetApiKey(runtime) !== null;
    }
};

/**
 * Comprehensive analysis of crypto investors data based on analysis type
 */
function analyzeCryptoInvestors(investorsData: any[], analysisType: string = "all"): any {
    if (!investorsData || investorsData.length === 0) {
        return {
            summary: "No crypto investors data available for analysis",
            market_participation: "Cannot assess",
            insights: []
        };
    }
    
    // Base analysis
    const performanceAnalysis = analyzeInvestorPerformance(investorsData);
    const marketParticipation = analyzeMarketParticipation(investorsData);
    const influenceAnalysis = analyzeInvestorInfluence(investorsData);
    const sentimentAnalysis = analyzeInvestorSentiment(investorsData);
    
    // Generate base insights
    const insights = generateInvestorInsights(performanceAnalysis, marketParticipation, influenceAnalysis);
    
    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "performance":
            focusedAnalysis = {
                performance_focus: {
                    top_performers: identifyTopPerformers(investorsData),
                    performance_distribution: performanceAnalysis,
                    performance_insights: [
                        `📈 Average performance score: ${performanceAnalysis.average_score}`,
                        `🏆 High performers: ${performanceAnalysis.high_performers} investors`,
                        `📊 Performance quality: ${performanceAnalysis.overall_performance}`
                    ]
                }
            };
            break;
            
        case "influence":
            focusedAnalysis = {
                influence_focus: {
                    market_leaders: identifyMarketLeaders(influenceAnalysis.top_influencers || []),
                    influence_distribution: influenceAnalysis,
                    influence_insights: [
                        `🌟 Top influencers identified: ${influenceAnalysis.top_influencers?.length || 0}`,
                        `📊 Influence distribution: ${influenceAnalysis.influence_distribution?.level || "Moderate"}`,
                        `🎯 Market leadership: ${influenceAnalysis.market_leadership || "Distributed"}`
                    ]
                }
            };
            break;
            
        case "sentiment":
            focusedAnalysis = {
                sentiment_focus: {
                    market_mood: determinMarketMood(sentimentAnalysis.sentiment, sentimentAnalysis.activity_rate),
                    sentiment_indicators: sentimentAnalysis,
                    sentiment_insights: [
                        `😊 Market sentiment: ${sentimentAnalysis.sentiment}`,
                        `📊 Activity rate: ${formatPercentage(sentimentAnalysis.activity_rate)}`,
                        `🎯 Market outlook: ${determineMarketOutlook(performanceAnalysis, sentimentAnalysis)}`
                    ]
                }
            };
            break;
    }
    
    return {
        summary: `Analysis of ${investorsData.length} crypto investors shows ${performanceAnalysis.overall_performance} performance with ${marketParticipation.participation_level} market participation`,
        analysis_type: analysisType,
        performance_analysis: performanceAnalysis,
        market_participation: marketParticipation,
        influence_analysis: influenceAnalysis,
        sentiment_analysis: sentimentAnalysis,
        insights: insights,
        ...focusedAnalysis,
        market_implications: generateMarketImplications(performanceAnalysis, sentimentAnalysis),
        top_performers: identifyTopPerformers(investorsData),
        data_quality: {
            source: "TokenMetrics Official API",
            investor_count: investorsData.length,
            data_completeness: assessDataCompleteness(investorsData),
            coverage_scope: assessCoverageScope(investorsData)
        },
        investment_strategy: suggestInvestmentStrategy(performanceAnalysis, sentimentAnalysis),
        risk_considerations: identifyRiskConsiderations(performanceAnalysis, sentimentAnalysis),
        opportunities: identifyOpportunities(performanceAnalysis, sentimentAnalysis)
    };
}

function analyzeInvestorPerformance(investorsData: any[]): any {
    const scores = investorsData
        .map(investor => investor.ROI_AVERAGE)
        .filter(score => score !== null && score !== undefined);
    
    if (scores.length === 0) {
        return { overall_performance: "Unknown", average_score: 0 };
    }
    
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    
    // Performance distribution (ROI-based)
    const highPerformers = scores.filter(s => s >= 0.5).length; // 50%+ ROI
    const goodPerformers = scores.filter(s => s >= 0.2 && s < 0.5).length; // 20-50% ROI
    const averagePerformers = scores.filter(s => s >= 0 && s < 0.2).length; // 0-20% ROI
    const poorPerformers = scores.filter(s => s < 0).length; // Negative ROI
    
    let overallPerformance;
    if (averageScore >= 0.5) overallPerformance = "Excellent";
    else if (averageScore >= 0.2) overallPerformance = "Good";
    else if (averageScore >= 0) overallPerformance = "Average";
    else overallPerformance = "Below Average";
    
    return {
        overall_performance: overallPerformance,
        average_score: `${(averageScore * 100).toFixed(1)}%`,
        max_score: `${(maxScore * 100).toFixed(1)}%`,
        min_score: `${(minScore * 100).toFixed(1)}%`,
        score_range: `${((maxScore - minScore) * 100).toFixed(1)}%`,
        performance_distribution: {
            high_performers: `${highPerformers} (${((highPerformers / scores.length) * 100).toFixed(1)}%)`,
            good_performers: `${goodPerformers} (${((goodPerformers / scores.length) * 100).toFixed(1)}%)`,
            average_performers: `${averagePerformers} (${((averagePerformers / scores.length) * 100).toFixed(1)}%)`,
            poor_performers: `${poorPerformers} (${((poorPerformers / scores.length) * 100).toFixed(1)}%)`
        },
        performance_quality: assessPerformanceQuality(averageScore, highPerformers, scores.length)
    };
}

function analyzeMarketParticipation(investorsData: any[]): any {
    const totalInvestors = investorsData.length;
    const activeInvestors = investorsData.filter(investor => 
        investor.ROUND_COUNT && parseInt(investor.ROUND_COUNT) > 0
    ).length;
    
    const participationRate = totalInvestors > 0 ? (activeInvestors / totalInvestors) * 100 : 0;
    
    let participationLevel;
    if (participationRate >= 80) participationLevel = "Very High";
    else if (participationRate >= 60) participationLevel = "High";
    else if (participationRate >= 40) participationLevel = "Moderate";
    else participationLevel = "Low";
    
    // Analyze investment rounds
    const roundCounts = investorsData
        .map(investor => parseInt(investor.ROUND_COUNT) || 0)
        .filter(count => count > 0);
    
    let roundAnalysis = {};
    if (roundCounts.length > 0) {
        const totalRounds = roundCounts.reduce((sum, count) => sum + count, 0);
        const averageRounds = totalRounds / roundCounts.length;
        const maxRounds = Math.max(...roundCounts);
        
        roundAnalysis = {
            total_investment_rounds: totalRounds,
            average_rounds_per_investor: averageRounds.toFixed(1),
            most_active_investor_rounds: maxRounds,
            investment_activity: analyzeInvestmentActivity(roundCounts)
        };
    }
    
    return {
        participation_level: participationLevel,
        participation_rate: `${participationRate.toFixed(1)}%`,
        total_investors: totalInvestors,
        active_investors: activeInvestors,
        round_analysis: roundAnalysis,
        market_coverage: assessMarketCoverage(investorsData)
    };
}

function analyzeInvestorInfluence(investorsData: any[]): any {
    // Analyze influence based on available metrics
    const influenceMetrics = investorsData.map(investor => ({
        name: investor.INVESTOR_NAME || 'Unknown',
        roi_average: investor.ROI_AVERAGE || 0,
        roi_median: investor.ROI_MEDIAN || 0,
        round_count: parseInt(investor.ROUND_COUNT) || 0,
        has_website: !!investor.INVESTOR_WEBSITE,
        has_twitter: !!investor.INVESTOR_TWITTER,
        influence_score: calculateInfluenceScore(investor)
    })).sort((a, b) => b.influence_score - a.influence_score);
    
    const topInfluencers = influenceMetrics.slice(0, 10);
    const averageInfluence = influenceMetrics.reduce((sum, inv) => sum + inv.influence_score, 0) / influenceMetrics.length;
    
    return {
        top_influencers: topInfluencers.slice(0, 5).map(inv => ({
            name: inv.name,
            influence_score: inv.influence_score.toFixed(1),
            roi_average: `${(inv.roi_average * 100).toFixed(1)}%`,
            investment_rounds: inv.round_count,
            online_presence: (inv.has_website ? "Website " : "") + (inv.has_twitter ? "Twitter" : "")
        })),
        average_influence: averageInfluence.toFixed(1),
        influence_distribution: analyzeInfluenceDistribution(influenceMetrics),
        market_leaders: identifyMarketLeaders(topInfluencers)
    };
}

function analyzeInvestorSentiment(investorsData: any[]): any {
    // Analyze sentiment based on investor activity and performance trends
    const recentActivity = investorsData.filter(investor => 
        investor.LAST_ACTIVITY && isRecentActivity(investor.LAST_ACTIVITY)
    ).length;
    
    const positivePerformers = investorsData.filter(investor => 
        investor.PERFORMANCE_CHANGE && investor.PERFORMANCE_CHANGE > 0
    ).length;
    
    const negativePerformers = investorsData.filter(investor => 
        investor.PERFORMANCE_CHANGE && investor.PERFORMANCE_CHANGE < 0
    ).length;
    
    const totalWithPerformanceData = positivePerformers + negativePerformers;
    
    let overallSentiment;
    if (totalWithPerformanceData > 0) {
        const positiveRatio = positivePerformers / totalWithPerformanceData;
        if (positiveRatio > 0.6) overallSentiment = "Bullish";
        else if (positiveRatio < 0.4) overallSentiment = "Bearish";
        else overallSentiment = "Neutral";
    } else {
        overallSentiment = "Unknown";
    }
    
    const activityRate = (recentActivity / investorsData.length) * 100;
    
    return {
        overall_sentiment: overallSentiment,
        positive_performers: positivePerformers,
        negative_performers: negativePerformers,
        sentiment_ratio: totalWithPerformanceData > 0 ? 
            `${((positivePerformers / totalWithPerformanceData) * 100).toFixed(1)}% positive` : 'Unknown',
        recent_activity_rate: `${activityRate.toFixed(1)}%`,
        market_mood: determinMarketMood(overallSentiment, activityRate)
    };
}

function generateInvestorInsights(performanceAnalysis: any, marketParticipation: any, influenceAnalysis: any): string[] {
    const insights = [];
    
    // Performance insights
    if (performanceAnalysis.overall_performance === "Excellent") {
        insights.push("Strong investor performance across the board indicates healthy market conditions and skilled participants");
    } else if (performanceAnalysis.overall_performance === "Below Average") {
        insights.push("Below-average investor performance suggests challenging market conditions or need for better strategies");
    }
    
    // Participation insights
    if (marketParticipation.participation_level === "Very High") {
        insights.push("Very high market participation indicates strong investor engagement and market liquidity");
    } else if (marketParticipation.participation_level === "Low") {
        insights.push("Low market participation may indicate investor caution or market uncertainty");
    }
    
    // Influence insights
    const topInfluencerScore = parseFloat(influenceAnalysis.top_influencers[0]?.influence_score || '0');
    if (topInfluencerScore > 80) {
        insights.push("High-influence investors present in the market can significantly impact price movements and sentiment");
    }
    
    // Distribution insights
    const highPerformerPercent = parseFloat(performanceAnalysis.performance_distribution?.high_performers?.match(/\d+\.\d+/)?.[0] || '0');
    if (highPerformerPercent > 30) {
        insights.push(`${highPerformerPercent}% of investors showing excellent performance indicates strong market opportunities`);
    } else if (highPerformerPercent < 10) {
        insights.push("Limited high-performing investors suggests selective opportunities or challenging conditions");
    }
    
    return insights;
}

function generateMarketImplications(performanceAnalysis: any, sentimentAnalysis: any): any {
    const implications = [];
    
    // Performance implications
    if (performanceAnalysis.overall_performance === "Excellent") {
        implications.push("Strong investor performance supports positive market outlook");
        implications.push("High-quality investor base indicates market maturity and sophistication");
    } else if (performanceAnalysis.overall_performance === "Below Average") {
        implications.push("Weak investor performance may signal market headwinds or overvaluation");
        implications.push("Consider defensive positioning until investor performance improves");
    }
    
    // Sentiment implications
    if (sentimentAnalysis.overall_sentiment === "Bullish") {
        implications.push("Bullish investor sentiment supports risk-on positioning and growth strategies");
    } else if (sentimentAnalysis.overall_sentiment === "Bearish") {
        implications.push("Bearish sentiment suggests caution and potential for market correction");
    }
    
    return {
        market_outlook: determineMarketOutlook(performanceAnalysis, sentimentAnalysis),
        investment_strategy: suggestInvestmentStrategy(performanceAnalysis, sentimentAnalysis),
        risk_considerations: identifyRiskConsiderations(performanceAnalysis, sentimentAnalysis),
        opportunities: identifyOpportunities(performanceAnalysis, sentimentAnalysis)
    };
}

function identifyTopPerformers(investorsData: any[]): any {
    const performers = investorsData
        .filter(investor => investor.ROI_AVERAGE !== null && investor.ROI_AVERAGE !== undefined)
        .sort((a, b) => b.ROI_AVERAGE - a.ROI_AVERAGE)
        .slice(0, 10);
    
    return {
        top_10_performers: performers.map((investor, index) => ({
            rank: index + 1,
            name: investor.INVESTOR_NAME || `Investor ${index + 1}`,
            roi_average: `${(investor.ROI_AVERAGE * 100).toFixed(1)}%`,
            roi_median: investor.ROI_MEDIAN ? `${(investor.ROI_MEDIAN * 100).toFixed(1)}%` : 'N/A',
            round_count: investor.ROUND_COUNT || 'N/A',
            performance_category: categorizePerformance(investor.ROI_AVERAGE)
        })),
        performance_gap: performers.length > 1 ? 
            `${((performers[0].ROI_AVERAGE - performers[performers.length - 1].ROI_AVERAGE) * 100).toFixed(1)}%` : '0%',
        elite_threshold: performers.length > 0 ? `${(performers[0].ROI_AVERAGE * 100).toFixed(1)}%` : '0%'
    };
}

// Helper functions

function calculateInfluenceScore(investor: any): number {
    let score = 0;
    
    // Base score from ROI performance
    if (investor.ROI_AVERAGE) {
        // Convert ROI to positive influence score (higher ROI = higher influence)
        const roiScore = Math.max(0, investor.ROI_AVERAGE * 100); // Convert to percentage
        score += Math.min(roiScore, 50) * 0.4; // Cap at 50 points
    }
    
    // Investment activity influence
    if (investor.ROUND_COUNT) {
        const roundScore = Math.min(parseInt(investor.ROUND_COUNT), 20); // Cap at 20
        score += roundScore * 0.3;
    }
    
    // Online presence influence
    if (investor.INVESTOR_WEBSITE) score += 10 * 0.15;
    if (investor.INVESTOR_TWITTER) score += 10 * 0.15;
    
    return Math.min(score, 100); // Cap at 100
}

function isRecentActivity(lastActivity: string): boolean {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return new Date(lastActivity) > thirtyDaysAgo;
}

function analyzeInvestmentActivity(roundCounts: number[]): string {
    const averageRounds = roundCounts.reduce((sum, count) => sum + count, 0) / roundCounts.length;
    
    if (averageRounds > 10) return "Very Active";
    if (averageRounds > 5) return "Active";
    if (averageRounds > 2) return "Moderate";
    return "Limited";
}

function assessPerformanceQuality(averageScore: number, highPerformers: number, totalInvestors: number): string {
    const highPerformerRatio = highPerformers / totalInvestors;
    
    if (averageScore > 0.3 && highPerformerRatio > 0.3) return "Exceptional";
    if (averageScore > 0.1 && highPerformerRatio > 0.2) return "High Quality";
    if (averageScore > 0 && highPerformerRatio > 0.1) return "Good Quality";
    if (averageScore > -0.2) return "Average Quality";
    return "Below Average Quality";
}

function categorizePerformance(score: number): string {
    if (score >= 2.0) return "Elite";
    if (score >= 1.0) return "Excellent";
    if (score >= 0.5) return "Good";
    if (score >= 0.2) return "Average";
    if (score >= 0) return "Below Average";
    return "Poor";
}

function assessDataCompleteness(investorsData: any[]): string {
    const requiredFields = ['INVESTOR_NAME', 'ROI_AVERAGE', 'ROUND_COUNT'];
    let completeness = 0;
    
    investorsData.forEach(investor => {
        const presentFields = requiredFields.filter(field => 
            investor[field] !== null && investor[field] !== undefined
        );
        completeness += presentFields.length / requiredFields.length;
    });
    
    const avgCompleteness = (completeness / investorsData.length) * 100;
    
    if (avgCompleteness > 80) return "Very Complete";
    if (avgCompleteness > 60) return "Complete";
    if (avgCompleteness > 40) return "Moderate";
    return "Limited";
}

function assessCoverageScope(investorsData: any[]): string {
    const investorCount = investorsData.length;
    
    if (investorCount > 100) return "Comprehensive";
    if (investorCount > 50) return "Broad";
    if (investorCount > 25) return "Moderate";
    return "Limited";
}

function identifyMarketLeaders(topInfluencers: any[]): string[] {
    return topInfluencers.slice(0, 3).map(influencer => 
        `${influencer.name} (Influence: ${influencer.influence_score})`
    );
}

function determinMarketMood(sentiment: string, activityRate: number): string {
    if (sentiment === "Bullish" && activityRate > 60) return "Optimistic and Active";
    if (sentiment === "Bullish" && activityRate < 40) return "Cautiously Optimistic";
    if (sentiment === "Bearish" && activityRate > 60) return "Actively Concerned";
    if (sentiment === "Bearish" && activityRate < 40) return "Disengaged and Pessimistic";
    if (activityRate > 60) return "Highly Active";
    return "Wait and See";
}

function determineMarketOutlook(performanceAnalysis: any, sentimentAnalysis: any): string {
    const performance = performanceAnalysis.overall_performance;
    const sentiment = sentimentAnalysis.overall_sentiment;
    
    if (performance === "Excellent" && sentiment === "Bullish") return "Very Positive";
    if (performance === "Good" && sentiment === "Bullish") return "Positive";
    if (performance === "Below Average" && sentiment === "Bearish") return "Negative";
    if (performance === "Average" || sentiment === "Neutral") return "Neutral";
    return "Mixed Signals";
}

function suggestInvestmentStrategy(performanceAnalysis: any, sentimentAnalysis: any): string[] {
    const strategies = [];
    
    if (performanceAnalysis.overall_performance === "Excellent") {
        strategies.push("Follow successful investor strategies and allocations");
        strategies.push("Consider increasing exposure to top-performing investor favorites");
    }
    
    if (sentimentAnalysis.overall_sentiment === "Bullish") {
        strategies.push("Take advantage of positive sentiment for growth positions");
    } else if (sentimentAnalysis.overall_sentiment === "Bearish") {
        strategies.push("Focus on defensive positioning and risk management");
    }
    
    strategies.push("Monitor top investor movements for early trend identification");
    
    return strategies;
}

function identifyRiskConsiderations(performanceAnalysis: any, sentimentAnalysis: any): string[] {
    const risks = [];
    
    if (performanceAnalysis.overall_performance === "Below Average") {
        risks.push("Weak investor performance indicates challenging market conditions");
    }
    
    if (sentimentAnalysis.overall_sentiment === "Bearish") {
        risks.push("Negative sentiment may lead to increased volatility and selling pressure");
    }
    
    risks.push("Investor behavior can change rapidly based on market events");
    risks.push("High-influence investors can disproportionately impact market movements");
    
    return risks;
}

function identifyOpportunities(performanceAnalysis: any, sentimentAnalysis: any): string[] {
    const opportunities = [];
    
    if (performanceAnalysis.overall_performance === "Excellent") {
        opportunities.push("Learn from and potentially follow high-performing investor strategies");
    }
    
    if (sentimentAnalysis.overall_sentiment === "Bullish") {
        opportunities.push("Leverage positive sentiment for portfolio growth");
    }
    
    opportunities.push("Identify emerging trends by monitoring investor allocation changes");
    opportunities.push("Use investor influence data for better market timing");
    
    return opportunities;
}

function analyzeInfluenceDistribution(influenceMetrics: any[]): any {
    const highInfluence = influenceMetrics.filter(inv => inv.influence_score >= 80).length;
    const moderateInfluence = influenceMetrics.filter(inv => inv.influence_score >= 60 && inv.influence_score < 80).length;
    const lowInfluence = influenceMetrics.filter(inv => inv.influence_score < 60).length;
    
    return {
        high_influence: `${highInfluence} (${((highInfluence / influenceMetrics.length) * 100).toFixed(1)}%)`,
        moderate_influence: `${moderateInfluence} (${((moderateInfluence / influenceMetrics.length) * 100).toFixed(1)}%)`,
        low_influence: `${lowInfluence} (${((lowInfluence / influenceMetrics.length) * 100).toFixed(1)}%)`,
        influence_concentration: highInfluence > influenceMetrics.length * 0.2 ? "Concentrated" : "Distributed"
    };
}

function assessMarketCoverage(investorsData: any[]): string {
    const websiteCount = investorsData.filter(inv => inv.INVESTOR_WEBSITE).length;
    const twitterCount = investorsData.filter(inv => inv.INVESTOR_TWITTER).length;
    
    const onlinePresence = (websiteCount + twitterCount) / (investorsData.length * 2) * 100;
    
    if (onlinePresence > 70) return "High Online Presence";
    if (onlinePresence > 50) return "Moderate Online Presence";
    if (onlinePresence > 30) return "Limited Online Presence";
    return "Minimal Online Presence";
}

/**
 * Format crypto investors response for user display
 */
function formatCryptoInvestorsResponse(investorsData: any[], analysis: any, request: any): string {
    if (!investorsData || investorsData.length === 0) {
        return "❌ No crypto investors data available at the moment.";
    }

    const { limit, analysisType } = request;
    
    let response = `👥 **Crypto Investors Analysis** (${investorsData.length} investors)\n\n`;
    
    // Show top investors
    const displayCount = Math.min(investorsData.length, 10);
    response += `🏆 **Top ${displayCount} Investors by ROI:**\n`;
    
    // Sort by ROI_AVERAGE for display
    const sortedInvestors = [...investorsData].sort((a, b) => (b.ROI_AVERAGE || 0) - (a.ROI_AVERAGE || 0));
    
    for (let i = 0; i < displayCount; i++) {
        const investor = sortedInvestors[i];
        const rank = i + 1;
        const name = investor.INVESTOR_NAME || `Investor ${rank}`;
        const roi = investor.ROI_AVERAGE !== null ? `${(investor.ROI_AVERAGE * 100).toFixed(1)}%` : 'N/A';
        const rounds = investor.ROUND_COUNT || 'N/A';
        
        response += `${rank}. **${name}** - ROI: ${roi} (${rounds} rounds)\n`;
    }
    
    if (investorsData.length > displayCount) {
        response += `\n... and ${investorsData.length - displayCount} more investors\n`;
    }
    
    // Add analysis insights
    if (analysis?.insights && analysis.insights.length > 0) {
        response += `\n📊 **Key Insights:**\n`;
        analysis.insights.slice(0, 4).forEach((insight: string) => {
            response += `• ${insight}\n`;
        });
    }
    
    // Add performance analysis
    if (analysis?.performance_analysis) {
        const perf = analysis.performance_analysis;
        response += `\n📈 **Performance Overview:**\n`;
        response += `• Average ROI: ${perf.average_score}\n`;
        response += `• Overall Performance: ${perf.overall_performance}\n`;
        if (perf.performance_distribution) {
            response += `• High Performers (50%+ ROI): ${perf.performance_distribution.high_performers}\n`;
            response += `• Poor Performers (Negative ROI): ${perf.performance_distribution.poor_performers}\n`;
        }
    }
    
    // Add market participation
    if (analysis?.market_participation) {
        const market = analysis.market_participation;
        response += `\n🎯 **Market Participation:**\n`;
        response += `• Participation Level: ${market.participation_level}\n`;
        if (market.participation_rate) {
            response += `• Active Rate: ${market.participation_rate}\n`;
        }
        if (market.round_analysis?.total_investment_rounds) {
            response += `• Total Investment Rounds: ${market.round_analysis.total_investment_rounds}\n`;
        }
    }
    
    // Add analysis type specific insights
    if (analysisType === "performance" && analysis?.performance_focus) {
        response += `\n🏆 **Performance Focus:**\n`;
        analysis.performance_focus.performance_insights?.slice(0, 3).forEach((insight: string) => {
            response += `• ${insight}\n`;
        });
    } else if (analysisType === "influence" && analysis?.influence_focus) {
        response += `\n🌟 **Influence Focus:**\n`;
        analysis.influence_focus.influence_insights?.slice(0, 3).forEach((insight: string) => {
            response += `• ${insight}\n`;
        });
    } else if (analysisType === "sentiment" && analysis?.sentiment_focus) {
        response += `\n😊 **Sentiment Focus:**\n`;
        analysis.sentiment_focus.sentiment_insights?.slice(0, 3).forEach((insight: string) => {
            response += `• ${insight}\n`;
        });
    }
    
    // Add investment strategy if available
    if (analysis?.investment_strategy && analysis.investment_strategy.length > 0) {
        response += `\n💡 **Investment Strategy:**\n`;
        analysis.investment_strategy.slice(0, 3).forEach((strategy: string) => {
            response += `• ${strategy}\n`;
        });
    }
    
    response += `\n📚 **Note:** ROI scores are based on average returns from investment rounds. Negative values indicate losses.`;
    
    return response;
}
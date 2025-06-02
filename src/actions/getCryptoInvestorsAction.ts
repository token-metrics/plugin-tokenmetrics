import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    formatTokenMetricsNumber,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { CryptoInvestorsResponse, CryptoInvestorsRequest } from "../types";

/**
 * CRYPTO INVESTORS ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/crypto-investors
 * 
 * This action gets the latest list of crypto investors and their scores.
 * Essential for understanding investor sentiment and tracking influential market participants.
 */
export const getCryptoInvestorsAction: Action = {
    name: "getCryptoInvestors",
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
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Build parameters based on actual API documentation
            const requestParams: CryptoInvestorsRequest = {
                // Pagination parameters
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : 50,
                page: typeof messageContent.page === 'number' ? messageContent.page : 1
            };
            
            // Validate parameters
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Fetching crypto investors from TokenMetrics v2/crypto-investors endpoint");
            
            // Make API call
            const response = await callTokenMetricsApi<CryptoInvestorsResponse>(
                TOKENMETRICS_ENDPOINTS.cryptoInvestors,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<CryptoInvestorsResponse>(response, "getCryptoInvestors");
            const investorsData = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the investors data
            const investorsAnalysis = analyzeCryptoInvestors(investorsData);
            
            return {
                success: true,
                message: `Successfully retrieved ${investorsData.length} crypto investors data`,
                crypto_investors: investorsData,
                analysis: investorsAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.cryptoInvestors,
                    pagination: {
                        page: requestParams.page,
                        limit: requestParams.limit
                    },
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
            
        } catch (error) {
            console.error("Error in getCryptoInvestorsAction:", error);
            
            return {
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
                    text: "Show me the latest crypto investors data"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve the latest crypto investors list and their scores from TokenMetrics.",
                    action: "GET_CRYPTO_INVESTORS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get top 20 crypto investors by score",
                    limit: 20
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the top 20 crypto investors ranked by their TokenMetrics scores.",
                    action: "GET_CRYPTO_INVESTORS"
                }
            }
        ]
    ],
};

/**
 * Comprehensive analysis of crypto investors data
 */
function analyzeCryptoInvestors(investorsData: any[]): any {
    if (!investorsData || investorsData.length === 0) {
        return {
            summary: "No crypto investors data available for analysis",
            market_participation: "Cannot assess",
            insights: []
        };
    }
    
    // Analyze investor performance and distribution
    const performanceAnalysis = analyzeInvestorPerformance(investorsData);
    const marketParticipation = analyzeMarketParticipation(investorsData);
    const influenceAnalysis = analyzeInvestorInfluence(investorsData);
    const sentimentAnalysis = analyzeInvestorSentiment(investorsData);
    
    // Generate insights
    const insights = generateInvestorInsights(performanceAnalysis, marketParticipation, influenceAnalysis);
    
    return {
        summary: `Analysis of ${investorsData.length} crypto investors shows ${performanceAnalysis.overall_performance} performance with ${marketParticipation.participation_level} market participation`,
        performance_analysis: performanceAnalysis,
        market_participation: marketParticipation,
        influence_analysis: influenceAnalysis,
        sentiment_analysis: sentimentAnalysis,
        insights: insights,
        market_implications: generateMarketImplications(performanceAnalysis, sentimentAnalysis),
        top_performers: identifyTopPerformers(investorsData),
        data_quality: {
            source: "TokenMetrics Official API",
            investor_count: investorsData.length,
            data_completeness: assessDataCompleteness(investorsData),
            coverage_scope: assessCoverageScope(investorsData)
        }
    };
}

function analyzeInvestorPerformance(investorsData: any[]): any {
    const scores = investorsData
        .map(investor => investor.INVESTOR_SCORE)
        .filter(score => score !== null && score !== undefined);
    
    if (scores.length === 0) {
        return { overall_performance: "Unknown", average_score: 0 };
    }
    
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    
    // Performance distribution
    const highPerformers = scores.filter(s => s >= 80).length;
    const goodPerformers = scores.filter(s => s >= 60 && s < 80).length;
    const averagePerformers = scores.filter(s => s >= 40 && s < 60).length;
    const poorPerformers = scores.filter(s => s < 40).length;
    
    let overallPerformance;
    if (averageScore >= 70) overallPerformance = "Excellent";
    else if (averageScore >= 60) overallPerformance = "Good";
    else if (averageScore >= 50) overallPerformance = "Average";
    else overallPerformance = "Below Average";
    
    return {
        overall_performance: overallPerformance,
        average_score: averageScore.toFixed(1),
        max_score: maxScore,
        min_score: minScore,
        score_range: maxScore - minScore,
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
        investor.PORTFOLIO_VALUE && investor.PORTFOLIO_VALUE > 0
    ).length;
    
    const participationRate = totalInvestors > 0 ? (activeInvestors / totalInvestors) * 100 : 0;
    
    let participationLevel;
    if (participationRate >= 80) participationLevel = "Very High";
    else if (participationRate >= 60) participationLevel = "High";
    else if (participationRate >= 40) participationLevel = "Moderate";
    else participationLevel = "Low";
    
    // Analyze portfolio sizes if available
    const portfolioValues = investorsData
        .map(investor => investor.PORTFOLIO_VALUE)
        .filter(value => value && value > 0);
    
    let portfolioAnalysis = {};
    if (portfolioValues.length > 0) {
        const totalValue = portfolioValues.reduce((sum, value) => sum + value, 0);
        const averageValue = totalValue / portfolioValues.length;
        const maxValue = Math.max(...portfolioValues);
        
        portfolioAnalysis = {
            total_portfolio_value: formatTokenMetricsNumber(totalValue, 'currency'),
            average_portfolio_value: formatTokenMetricsNumber(averageValue, 'currency'),
            largest_portfolio: formatTokenMetricsNumber(maxValue, 'currency'),
            portfolio_concentration: analyzePortfolioConcentration(portfolioValues)
        };
    }
    
    return {
        participation_level: participationLevel,
        participation_rate: `${participationRate.toFixed(1)}%`,
        total_investors: totalInvestors,
        active_investors: activeInvestors,
        portfolio_analysis: portfolioAnalysis,
        market_coverage: assessMarketCoverage(investorsData)
    };
}

function analyzeInvestorInfluence(investorsData: any[]): any {
    // Analyze influence based on available metrics
    const influenceMetrics = investorsData.map(investor => ({
        name: investor.INVESTOR_NAME || investor.NAME || 'Unknown',
        score: investor.INVESTOR_SCORE || 0,
        portfolio_value: investor.PORTFOLIO_VALUE || 0,
        follower_count: investor.FOLLOWER_COUNT || 0,
        influence_score: calculateInfluenceScore(investor)
    })).sort((a, b) => b.influence_score - a.influence_score);
    
    const topInfluencers = influenceMetrics.slice(0, 10);
    const averageInfluence = influenceMetrics.reduce((sum, inv) => sum + inv.influence_score, 0) / influenceMetrics.length;
    
    return {
        top_influencers: topInfluencers.slice(0, 5).map(inv => ({
            name: inv.name,
            influence_score: inv.influence_score.toFixed(1),
            investor_score: inv.score,
            portfolio_value: formatTokenMetricsNumber(inv.portfolio_value, 'currency')
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
        .filter(investor => investor.INVESTOR_SCORE)
        .sort((a, b) => b.INVESTOR_SCORE - a.INVESTOR_SCORE)
        .slice(0, 10);
    
    return {
        top_10_performers: performers.map((investor, index) => ({
            rank: index + 1,
            name: investor.INVESTOR_NAME || investor.NAME || `Investor ${index + 1}`,
            score: investor.INVESTOR_SCORE,
            portfolio_value: investor.PORTFOLIO_VALUE ? 
                formatTokenMetricsNumber(investor.PORTFOLIO_VALUE, 'currency') : 'N/A',
            performance_category: categorizePerformance(investor.INVESTOR_SCORE)
        })),
        performance_gap: performers.length > 1 ? 
            (performers[0].INVESTOR_SCORE - performers[performers.length - 1].INVESTOR_SCORE) : 0,
        elite_threshold: performers.length > 0 ? performers[0].INVESTOR_SCORE : 0
    };
}

// Helper functions

function calculateInfluenceScore(investor: any): number {
    let score = 0;
    
    // Base score from investor score
    if (investor.INVESTOR_SCORE) score += investor.INVESTOR_SCORE * 0.4;
    
    // Portfolio value influence (normalized)
    if (investor.PORTFOLIO_VALUE) {
        const portfolioScore = Math.min(investor.PORTFOLIO_VALUE / 10000000, 50); // Cap at 50
        score += portfolioScore * 0.3;
    }
    
    // Follower count influence
    if (investor.FOLLOWER_COUNT) {
        const followerScore = Math.min(investor.FOLLOWER_COUNT / 10000, 30); // Cap at 30
        score += followerScore * 0.2;
    }
    
    // Activity influence
    if (investor.LAST_ACTIVITY && isRecentActivity(investor.LAST_ACTIVITY)) {
        score += 10 * 0.1;
    }
    
    return Math.min(score, 100); // Cap at 100
}

function isRecentActivity(lastActivity: string): boolean {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return new Date(lastActivity) > thirtyDaysAgo;
}

function assessPerformanceQuality(averageScore: number, highPerformers: number, totalInvestors: number): string {
    const highPerformerRatio = highPerformers / totalInvestors;
    
    if (averageScore > 70 && highPerformerRatio > 0.3) return "Exceptional";
    if (averageScore > 60 && highPerformerRatio > 0.2) return "High Quality";
    if (averageScore > 50 && highPerformerRatio > 0.1) return "Good Quality";
    if (averageScore > 40) return "Average Quality";
    return "Below Average Quality";
}

function analyzePortfolioConcentration(portfolioValues: number[]): string {
    const sortedValues = portfolioValues.sort((a, b) => b - a);
    const totalValue = sortedValues.reduce((sum, value) => sum + value, 0);
    const top10Percent = Math.ceil(sortedValues.length * 0.1);
    const top10Value = sortedValues.slice(0, top10Percent).reduce((sum, value) => sum + value, 0);
    
    const concentrationRatio = (top10Value / totalValue) * 100;
    
    if (concentrationRatio > 80) return "Highly Concentrated";
    if (concentrationRatio > 60) return "Concentrated";
    if (concentrationRatio > 40) return "Moderately Concentrated";
    return "Distributed";
}

function assessMarketCoverage(investorsData: any[]): string {
    const categories = new Set(investorsData.map(inv => inv.CATEGORY).filter(c => c));
    const regions = new Set(investorsData.map(inv => inv.REGION).filter(r => r));
    
    if (categories.size > 5 && regions.size > 8) return "Global and Diverse";
    if (categories.size > 3 && regions.size > 5) return "Broad Coverage";
    if (categories.size > 2 && regions.size > 3) return "Moderate Coverage";
    return "Limited Coverage";
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

function identifyMarketLeaders(topInfluencers: any[]): string[] {
    return topInfluencers.slice(0, 3).map(influencer => 
        `${influencer.name} (Score: ${influencer.influence_score})`
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

function assessDataCompleteness(investorsData: any[]): string {
    const requiredFields = ['INVESTOR_NAME', 'INVESTOR_SCORE', 'PORTFOLIO_VALUE'];
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

function categorizePerformance(score: number): string {
    if (score >= 90) return "Elite";
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    if (score >= 50) return "Below Average";
    return "Poor";
}
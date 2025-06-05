import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { SentimentResponse, SentimentRequest } from "../types";

/**
 * SENTIMENT ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/sentiments
 * 
 * This action gets the hourly sentiment score for Twitter, Reddit, and all the News,
 * including quick summary of what happened. Essential for understanding market mood and social sentiment.
 */
export const getSentimentAction: Action = {
    name: "getSentiment",
    description: "Get hourly sentiment scores from Twitter, Reddit, and news sources with market mood analysis from TokenMetrics",
    similes: [
        "get sentiment",
        "market sentiment",
        "sentiment analysis",
        "social sentiment",
        "market mood",
        "news sentiment",
        "twitter sentiment",
        "reddit sentiment"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Build parameters based on actual API documentation
            const requestParams: SentimentRequest = {
                // Pagination parameters
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : 50,
                page: typeof messageContent.page === 'number' ? messageContent.page : 1
            };
            
            // Validate parameters
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            
            // Make API call
            const response = await callTokenMetricsApi<SentimentResponse>(
                TOKENMETRICS_ENDPOINTS.sentiment,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<SentimentResponse>(response, "getSentiment");
            const sentimentData = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the sentiment data
            const sentimentAnalysis = analyzeSentimentData(sentimentData);
            
            return {
                success: true,
                message: `Successfully retrieved ${sentimentData.length} sentiment data points`,
                sentiment_data: sentimentData,
                analysis: sentimentAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.sentiment,
                    pagination: {
                        page: requestParams.page,
                        limit: requestParams.limit
                    },
                    data_points: sentimentData.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Sentiment Engine"
                },
                sentiment_explanation: {
                    SENTIMENT_SCORE: "Overall sentiment score aggregating all sources (-100 to +100)",
                    TWITTER_SENTIMENT: "Sentiment derived from Twitter/X cryptocurrency discussions",
                    REDDIT_SENTIMENT: "Sentiment from Reddit cryptocurrency communities",
                    NEWS_SENTIMENT: "Sentiment from cryptocurrency news articles and media",
                    OVERALL_SENTIMENT: "Qualitative assessment (Bullish/Bearish/Neutral)",
                    interpretation: {
                        "80 to 100": "Extremely Bullish - Very positive market sentiment",
                        "60 to 79": "Bullish - Positive sentiment with optimism",
                        "40 to 59": "Moderately Bullish - Slight positive bias",
                        "20 to 39": "Neutral to Positive - Balanced with slight optimism",
                        "-20 to 19": "Neutral - Balanced sentiment",
                        "-40 to -21": "Moderately Bearish - Slight negative bias",
                        "-60 to -41": "Bearish - Negative sentiment with pessimism",
                        "-100 to -61": "Extremely Bearish - Very negative market sentiment"
                    },
                    usage_guidelines: [
                        "Use as contrarian indicator - extreme sentiment often signals reversals",
                        "Combine with technical analysis for timing market entries/exits",
                        "Monitor sentiment changes for early trend identification",
                        "Consider sentiment divergences with price action"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getSentimentAction:", error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve sentiment data from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/sentiments is accessible",
                    parameter_validation: [
                        "Check that pagination parameters (page, limit) are positive integers",
                        "Ensure your API key has access to sentiment analysis endpoints"
                    ],
                    common_solutions: [
                        "Try with default parameters (no filters)",
                        "Check if your subscription includes sentiment analysis access",
                        "Verify TokenMetrics sentiment service status"
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
                    text: "What's the current market sentiment?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll check the latest cryptocurrency market sentiment from TokenMetrics social and news analysis.",
                    action: "GET_SENTIMENT"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me sentiment data for the past week",
                    limit: 168  // 24 hours * 7 days for hourly data
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve the past week's hourly sentiment data from TokenMetrics.",
                    action: "GET_SENTIMENT"
                }
            }
        ]
    ],
};

/**
 * Comprehensive analysis of sentiment data for market mood assessment
 */
function analyzeSentimentData(sentimentData: any[]): any {
    if (!sentimentData || sentimentData.length === 0) {
        return {
            summary: "No sentiment data available for analysis",
            current_mood: "Unknown",
            insights: []
        };
    }
    
    // Sort data chronologically for trend analysis
    const sortedData = sentimentData.sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
    
    // Analyze current and recent sentiment
    const currentSentiment = getCurrentSentimentAnalysis(sortedData);
    const trendAnalysis = analyzeSentimentTrends(sortedData);
    const sourceAnalysis = analyzeSentimentSources(sortedData);
    const extremesAnalysis = analyzeExtremes(sortedData);
    const contrarian = generateContrarianAnalysis(currentSentiment, trendAnalysis);
    
    // Generate insights
    const insights = generateSentimentInsights(currentSentiment, trendAnalysis, sourceAnalysis, extremesAnalysis);
    
    return {
        summary: `Market sentiment shows ${currentSentiment.overall_mood} mood with ${trendAnalysis.trend_direction} trend over recent periods`,
        current_sentiment: currentSentiment,
        trend_analysis: trendAnalysis,
        source_analysis: sourceAnalysis,
        extremes_analysis: extremesAnalysis,
        contrarian_analysis: contrarian,
        insights: insights,
        trading_implications: generateTradingImplications(currentSentiment, trendAnalysis, contrarian),
        data_quality: {
            source: "TokenMetrics Sentiment Engine",
            data_points: sentimentData.length,
            sources_covered: ["Twitter/X", "Reddit", "News Media"],
            time_coverage: calculateTimeCoverage(sortedData),
            reliability: "High - Multi-source social and news sentiment"
        }
    };
}

function getCurrentSentimentAnalysis(sortedData: any[]): any {
    const latest = sortedData[sortedData.length - 1];
    
    if (!latest) {
        return { overall_mood: "Unknown", score: 0 };
    }
    
    const overallScore = latest.SENTIMENT_SCORE || 0;
    const twitterScore = latest.TWITTER_SENTIMENT || 0;
    const redditScore = latest.REDDIT_SENTIMENT || 0;
    const newsScore = latest.NEWS_SENTIMENT || 0;
    
    // Determine overall mood
    let overallMood;
    if (overallScore >= 60) overallMood = "Very Bullish";
    else if (overallScore >= 40) overallMood = "Bullish";
    else if (overallScore >= 20) overallMood = "Moderately Bullish";
    else if (overallScore >= -20) overallMood = "Neutral";
    else if (overallScore >= -40) overallMood = "Moderately Bearish";
    else if (overallScore >= -60) overallMood = "Bearish";
    else overallMood = "Very Bearish";
    
    // Analyze source agreement
    const sourceScores = [twitterScore, redditScore, newsScore].filter(score => score !== 0);
    const sourceAgreement = calculateSourceAgreement(sourceScores);
    
    return {
        overall_mood: overallMood,
        overall_score: overallScore,
        twitter_sentiment: twitterScore,
        reddit_sentiment: redditScore,
        news_sentiment: newsScore,
        date: latest.DATE,
        source_agreement: sourceAgreement,
        sentiment_strength: Math.abs(overallScore),
        confidence_level: assessConfidenceLevel(sourceAgreement, sourceScores.length)
    };
}

function analyzeSentimentTrends(sortedData: any[]): any {
    if (sortedData.length < 10) {
        return { trend_direction: "Insufficient data" };
    }
    
    // Analyze recent trend (last 24 hours if hourly data)
    const recentData = sortedData.slice(-24);
    const earlierData = sortedData.slice(-48, -24);
    
    const recentAvg = calculateAverageSentiment(recentData);
    const earlierAvg = calculateAverageSentiment(earlierData);
    
    const trendChange = recentAvg - earlierAvg;
    
    let trendDirection;
    if (trendChange > 10) trendDirection = "Strongly Improving";
    else if (trendChange > 5) trendDirection = "Improving";
    else if (trendChange > -5) trendDirection = "Stable";
    else if (trendChange > -10) trendDirection = "Declining";
    else trendDirection = "Strongly Declining";
    
    // Calculate trend consistency
    const trendConsistency = calculateTrendConsistency(recentData);
    
    // Identify sentiment cycles
    const volatility = calculateSentimentVolatility(recentData);
    
    return {
        trend_direction: trendDirection,
        trend_change: trendChange.toFixed(1),
        trend_consistency: trendConsistency,
        sentiment_volatility: volatility,
        recent_average: recentAvg.toFixed(1),
        earlier_average: earlierAvg.toFixed(1),
        momentum: assessMomentum(recentData)
    };
}

function analyzeSentimentSources(sortedData: any[]): any {
    const latest = sortedData[sortedData.length - 1];
    
    if (!latest) {
        return { source_breakdown: "No data available" };
    }
    
    const twitterScore = latest.TWITTER_SENTIMENT || 0;
    const redditScore = latest.REDDIT_SENTIMENT || 0;
    const newsScore = latest.NEWS_SENTIMENT || 0;
    
    // Find leading and lagging sources
    const sourceRankings = [
        { source: "Twitter/X", score: twitterScore },
        { source: "Reddit", score: redditScore },
        { source: "News", score: newsScore }
    ].sort((a, b) => b.score - a.score);
    
    // Analyze source divergence
    const sourceDivergence = calculateSourceDivergence([twitterScore, redditScore, newsScore]);
    
    return {
        most_bullish_source: sourceRankings[0].source,
        most_bearish_source: sourceRankings[2].source,
        source_rankings: sourceRankings,
        source_divergence: sourceDivergence,
        consensus_level: sourceDivergence < 20 ? "High" : sourceDivergence < 40 ? "Medium" : "Low",
        source_analysis: {
            twitter_sentiment: `${twitterScore} - ${interpretSentimentScore(twitterScore)}`,
            reddit_sentiment: `${redditScore} - ${interpretSentimentScore(redditScore)}`,
            news_sentiment: `${newsScore} - ${interpretSentimentScore(newsScore)}`
        }
    };
}

function analyzeExtremes(sortedData: any[]): any {
    const sentimentScores = sortedData.map(item => item.SENTIMENT_SCORE).filter(score => score !== null && score !== undefined);
    
    if (sentimentScores.length === 0) {
        return { status: "No sentiment scores available" };
    }
    
    const maxSentiment = Math.max(...sentimentScores);
    const minSentiment = Math.min(...sentimentScores);
    const currentSentiment = sentimentScores[sentimentScores.length - 1];
    
    // Find extreme periods
    const veryBullishPeriods = sentimentScores.filter(score => score > 70).length;
    const veryBearishPeriods = sentimentScores.filter(score => score < -70).length;
    
    // Calculate position relative to range
    const sentimentRange = maxSentiment - minSentiment;
    const relativePosition = sentimentRange > 0 ? ((currentSentiment - minSentiment) / sentimentRange) * 100 : 50;
    
    return {
        max_sentiment: maxSentiment,
        min_sentiment: minSentiment,
        current_sentiment: currentSentiment,
        sentiment_range: sentimentRange,
        relative_position: `${relativePosition.toFixed(1)}%`,
        extreme_periods: {
            very_bullish_periods: veryBullishPeriods,
            very_bearish_periods: veryBearishPeriods,
            total_periods: sentimentScores.length
        },
        extremes_assessment: assessExtremesSignificance(veryBullishPeriods, veryBearishPeriods, sentimentScores.length),
        contrarian_signal: generateContrarianSignal(currentSentiment, maxSentiment, minSentiment)
    };
}

function generateContrarianAnalysis(currentSentiment: any, trendAnalysis: any): any {
    const score = currentSentiment.overall_score;
    const strength = currentSentiment.sentiment_strength;
    
    let contrarianSignal = "Neutral";
    let reasoning = [];
    
    // Extreme sentiment levels often signal reversals
    if (score > 70) {
        contrarianSignal = "Bearish";
        reasoning.push("Extremely bullish sentiment may indicate market top");
        reasoning.push("High optimism levels historically precede corrections");
    } else if (score < -70) {
        contrarianSignal = "Bullish";
        reasoning.push("Extremely bearish sentiment may indicate market bottom");
        reasoning.push("High pessimism levels often precede recoveries");
    } else if (score > 50 && trendAnalysis.trend_direction === "Strongly Improving") {
        contrarianSignal = "Caution";
        reasoning.push("Rapidly improving sentiment approaching extreme levels");
    } else if (score < -50 && trendAnalysis.trend_direction === "Strongly Declining") {
        contrarianSignal = "Opportunity";
        reasoning.push("Rapidly declining sentiment approaching extreme levels");
    }
    
    return {
        contrarian_signal: contrarianSignal,
        reasoning: reasoning,
        sentiment_extreme_level: strength > 60 ? "High" : strength > 40 ? "Medium" : "Low",
        reversal_probability: calculateReversalProbability(score, strength, trendAnalysis),
        recommended_action: generateContrarianAction(contrarianSignal, strength)
    };
}

function generateSentimentInsights(currentSentiment: any, trendAnalysis: any, sourceAnalysis: any, extremesAnalysis: any): string[] {
    const insights = [];
    
    // Current sentiment insights
    if (currentSentiment.overall_mood.includes("Very")) {
        insights.push(`${currentSentiment.overall_mood} sentiment at ${currentSentiment.overall_score} suggests extreme market emotions`);
    }
    
    // Trend insights
    if (trendAnalysis.trend_direction === "Strongly Improving" || trendAnalysis.trend_direction === "Strongly Declining") {
        insights.push(`Sentiment is ${trendAnalysis.trend_direction.toLowerCase()} with ${Math.abs(parseFloat(trendAnalysis.trend_change))} point change`);
    }
    
    // Source consensus insights
    if (sourceAnalysis.consensus_level === "Low") {
        insights.push("Low consensus between Twitter, Reddit, and news sources indicates mixed market signals");
    } else if (sourceAnalysis.consensus_level === "High") {
        insights.push("High consensus across all sentiment sources strengthens signal reliability");
    }
    
    // Extremes insights
    if (extremesAnalysis.relative_position) {
        const position = parseFloat(extremesAnalysis.relative_position);
        if (position > 90) {
            insights.push("Sentiment near historical highs - potential for mean reversion");
        } else if (position < 10) {
            insights.push("Sentiment near historical lows - potential for bounce");
        }
    }
    
    // Contrarian insights
    if (currentSentiment.sentiment_strength > 60) {
        insights.push("High sentiment strength suggests market may be reaching emotional extreme");
    }
    
    return insights;
}

function generateTradingImplications(currentSentiment: any, trendAnalysis: any, contrarian: any): any {
    const implications = [];
    let overallBias = "Neutral";
    
    // Sentiment-based implications
    if (currentSentiment.overall_mood === "Very Bullish") {
        implications.push("Extreme bullish sentiment - consider profit-taking or defensive positioning");
        overallBias = "Cautious";
    } else if (currentSentiment.overall_mood === "Very Bearish") {
        implications.push("Extreme bearish sentiment - potential buying opportunity for contrarians");
        overallBias = "Opportunistic";
    } else if (currentSentiment.overall_mood === "Bullish") {
        implications.push("Bullish sentiment supports risk-on positioning");
        overallBias = "Bullish";
    } else if (currentSentiment.overall_mood === "Bearish") {
        implications.push("Bearish sentiment suggests defensive positioning");
        overallBias = "Bearish";
    }
    
    // Trend-based implications
    if (trendAnalysis.trend_direction === "Strongly Improving") {
        implications.push("Rapidly improving sentiment may create momentum for continued upside");
    } else if (trendAnalysis.trend_direction === "Strongly Declining") {
        implications.push("Rapidly declining sentiment may signal further downside pressure");
    }
    
    // Contrarian implications
    if (contrarian.contrarian_signal !== "Neutral") {
        implications.push(`Contrarian analysis suggests ${contrarian.contrarian_signal.toLowerCase()} positioning`);
    }
    
    return {
        overall_bias: overallBias,
        key_implications: implications,
        sentiment_timing: assessTimingSignals(currentSentiment, trendAnalysis),
        risk_considerations: [
            "Sentiment can change rapidly with market events",
            "Extreme sentiment levels are often temporary",
            "Combine sentiment with technical and fundamental analysis"
        ]
    };
}

// Helper functions

function calculateSourceAgreement(sourceScores: number[]): string {
    if (sourceScores.length < 2) return "Insufficient data";
    
    const maxDifference = Math.max(...sourceScores) - Math.min(...sourceScores);
    
    if (maxDifference < 20) return "High Agreement";
    if (maxDifference < 40) return "Moderate Agreement";
    return "Low Agreement";
}

function assessConfidenceLevel(agreement: string, sourceCount: number): string {
    if (agreement === "High Agreement" && sourceCount >= 3) return "High";
    if (agreement === "Moderate Agreement" && sourceCount >= 2) return "Medium";
    return "Low";
}

function calculateAverageSentiment(data: any[]): number {
    const scores = data.map(item => item.SENTIMENT_SCORE).filter(score => score !== null && score !== undefined);
    return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
}

function calculateTrendConsistency(data: any[]): string {
    if (data.length < 5) return "Insufficient data";
    
    let consistentDirection = 0;
    for (let i = 1; i < data.length; i++) {
        const currentScore = data[i].SENTIMENT_SCORE || 0;
        const previousScore = data[i-1].SENTIMENT_SCORE || 0;
        const direction = currentScore > previousScore ? 1 : currentScore < previousScore ? -1 : 0;
        
        if (i > 1) {
            const prevDirection = data[i-1].SENTIMENT_SCORE > data[i-2].SENTIMENT_SCORE ? 1 : 
                                 data[i-1].SENTIMENT_SCORE < data[i-2].SENTIMENT_SCORE ? -1 : 0;
            if (direction === prevDirection && direction !== 0) {
                consistentDirection++;
            }
        }
    }
    
    const consistency = (consistentDirection / (data.length - 2)) * 100;
    
    if (consistency > 70) return "High";
    if (consistency > 40) return "Medium";
    return "Low";
}

function calculateSentimentVolatility(data: any[]): string {
    const scores = data.map(item => item.SENTIMENT_SCORE).filter(score => score !== null && score !== undefined);
    
    if (scores.length < 2) return "Unknown";
    
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const volatility = Math.sqrt(variance);
    
    if (volatility > 30) return "Very High";
    if (volatility > 20) return "High";
    if (volatility > 10) return "Medium";
    return "Low";
}

function assessMomentum(data: any[]): string {
    if (data.length < 3) return "Unknown";
    
    const recent = data.slice(-3);
    const scores = recent.map(item => item.SENTIMENT_SCORE);
    
    const momentum = scores[2] - scores[0];
    
    if (momentum > 10) return "Strong Positive";
    if (momentum > 5) return "Positive";
    if (momentum > -5) return "Neutral";
    if (momentum > -10) return "Negative";
    return "Strong Negative";
}

function calculateSourceDivergence(sourceScores: number[]): number {
    const validScores = sourceScores.filter(score => score !== 0);
    if (validScores.length < 2) return 0;
    
    const max = Math.max(...validScores);
    const min = Math.min(...validScores);
    return max - min;
}

function interpretSentimentScore(score: number): string {
    if (score >= 60) return "Very Bullish";
    if (score >= 40) return "Bullish";
    if (score >= 20) return "Moderately Bullish";
    if (score >= -20) return "Neutral";
    if (score >= -40) return "Moderately Bearish";
    if (score >= -60) return "Bearish";
    return "Very Bearish";
}

function assessExtremesSignificance(bullishPeriods: number, bearishPeriods: number, totalPeriods: number): string {
    const extremeRatio = (bullishPeriods + bearishPeriods) / totalPeriods;
    
    if (extremeRatio > 0.3) return "High - Frequent extreme sentiment periods";
    if (extremeRatio > 0.15) return "Medium - Occasional extreme sentiment";
    return "Low - Rare extreme sentiment periods";
}

function generateContrarianSignal(current: number, max: number, min: number): string {
    const range = max - min;
    const position = (current - min) / range;
    
    if (position > 0.9) return "Strong Sell Signal";
    if (position > 0.8) return "Sell Signal";
    if (position < 0.1) return "Strong Buy Signal";
    if (position < 0.2) return "Buy Signal";
    return "No Clear Signal";
}

function calculateReversalProbability(score: number, strength: number, trendAnalysis: any): string {
    let probability = 0;
    
    // Extreme levels increase reversal probability
    if (Math.abs(score) > 70) probability += 40;
    else if (Math.abs(score) > 50) probability += 20;
    
    // High strength increases probability
    if (strength > 60) probability += 20;
    else if (strength > 40) probability += 10;
    
    // Trend momentum affects probability
    if (trendAnalysis.trend_direction.includes("Strongly")) probability += 15;
    
    if (probability > 60) return "High";
    if (probability > 40) return "Medium";
    if (probability > 20) return "Low";
    return "Very Low";
}

function generateContrarianAction(signal: string, strength: number): string {
    if (signal === "Bearish" && strength > 60) return "Consider taking profits or reducing positions";
    if (signal === "Bullish" && strength > 60) return "Consider accumulating or increasing positions";
    if (signal === "Caution") return "Monitor closely for signs of sentiment peak";
    if (signal === "Opportunity") return "Prepare for potential buying opportunity";
    return "Maintain current positioning";
}

function calculateTimeCoverage(sortedData: any[]): string {
    if (sortedData.length === 0) return "No data";
    
    const firstDate = new Date(sortedData[0].DATE);
    const lastDate = new Date(sortedData[sortedData.length - 1].DATE);
    const diffHours = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) return `${Math.round(diffHours)} hours`;
    if (diffHours < 168) return `${Math.round(diffHours / 24)} days`;
    return `${Math.round(diffHours / 168)} weeks`;
}

function assessTimingSignals(currentSentiment: any, trendAnalysis: any): string {
    const score = currentSentiment.overall_score;
    const trend = trendAnalysis.trend_direction;
    
    if (score > 60 && trend === "Strongly Improving") return "Near-term top possible";
    if (score < -60 && trend === "Strongly Declining") return "Near-term bottom possible";
    if (score > 40 && trend === "Improving") return "Uptrend continuation likely";
    if (score < -40 && trend === "Declining") return "Downtrend continuation likely";
    return "No clear timing signal";
}
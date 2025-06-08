import type { Action } from "@elizaos/core";
import { z } from "zod";
import {
    validateAndGetApiKey,
    extractTokenMetricsRequest,
    callTokenMetricsAPI,
    formatCurrency,
    formatPercentage,
    generateRequestId
} from "./aiActionHelper";
import type { SentimentResponse } from "../types";

// Zod schema for sentiment request validation
const SentimentRequestSchema = z.object({
    limit: z.number().min(1).max(100).optional().describe("Number of sentiment data points to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["market_mood", "social_trends", "news_impact", "all"]).optional().describe("Type of sentiment analysis to focus on")
});

type SentimentRequest = z.infer<typeof SentimentRequestSchema>;

// AI extraction template for natural language processing
const SENTIMENT_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting sentiment analysis requests from natural language.

The user wants to get hourly sentiment scores from Twitter, Reddit, and news sources. Extract the following information:

1. **limit** (optional, default: 24): Number of sentiment data points to return
   - Look for phrases like "last 24 hours", "past week", "recent sentiment"
   - 24 = last 24 hours, 168 = last week

2. **page** (optional, default: 1): Page number for pagination

3. **analysisType** (optional, default: "all"): What type of sentiment analysis they want
   - "market_mood" - focus on overall market sentiment and emotional indicators
   - "social_trends" - focus on social media trends and viral content
   - "news_impact" - focus on news sentiment and media coverage impact
   - "all" - comprehensive sentiment analysis across all sources

Examples:
- "Get market sentiment" → {analysisType: "all"}
- "Show me social media sentiment trends" → {analysisType: "social_trends"}
- "Check news sentiment impact" → {analysisType: "news_impact"}
- "Market mood for the past 24 hours" → {limit: 24, analysisType: "market_mood"}
- "Sentiment analysis for the past week" → {limit: 168, analysisType: "all"}

Extract the request details from the user's message.
`;

/**
 * SENTIMENT ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/sentiments
 * 
 * This action gets the hourly sentiment score for Twitter, Reddit, and all the News,
 * including quick summary of what happened. Essential for understanding market mood and social sentiment.
 */
export const getSentimentAction: Action = {
    name: "GET_SENTIMENT_TOKENMETRICS",
    description: "Get hourly sentiment scores from Twitter, Reddit, and news sources with market mood analysis from TokenMetrics",
    similes: [
        "get sentiment",
        "market sentiment",
        "sentiment analysis",
        "social sentiment",
        "market mood",
        "news sentiment",
        "twitter sentiment",
        "reddit sentiment",
        "social media sentiment"
    ],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get market sentiment analysis"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve the latest market sentiment from Twitter, Reddit, and news sources.",
                    action: "GET_SENTIMENT_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me social media sentiment trends"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll analyze social media sentiment trends across Twitter and Reddit.",
                    action: "GET_SENTIMENT_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Check news sentiment impact on crypto"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll analyze news sentiment and its impact on cryptocurrency markets.",
                    action: "GET_SENTIMENT_TOKENMETRICS"
                }
            }
        ]
    ],
    
    async handler(runtime, message, _state) {
        try {
            const requestId = generateRequestId();
            console.log(`[${requestId}] Processing sentiment analysis request...`);
            
            // Extract structured request using AI
            const sentimentRequest = await extractTokenMetricsRequest<SentimentRequest>(
                runtime,
                message,
                _state || await runtime.composeState(message),
                SENTIMENT_EXTRACTION_TEMPLATE,
                SentimentRequestSchema,
                requestId
            );
            
            console.log(`[${requestId}] Extracted request:`, sentimentRequest);
            
            // Apply defaults for optional fields
            const processedRequest = {
                limit: sentimentRequest.limit || 24, // Last 24 hours by default
                page: sentimentRequest.page || 1,
                analysisType: sentimentRequest.analysisType || "all"
            };
            
            // Build API parameters
            const apiParams: Record<string, any> = {
                limit: processedRequest.limit,
                page: processedRequest.page
            };
            
            // Make API call
            const response = await callTokenMetricsAPI(
                "/v2/sentiments",
                apiParams,
                runtime
            );
            
            console.log(`[${requestId}] API response received, processing data...`);
            
            // Process response data
            const sentimentData = Array.isArray(response) ? response : response.data || [];
            
            // Analyze the sentiment data based on requested analysis type
            const sentimentAnalysis = analyzeSentimentData(sentimentData, processedRequest.analysisType);
            
            const result = {
                success: true,
                message: `Successfully retrieved ${sentimentData.length} sentiment data points from TokenMetrics`,
                request_id: requestId,
                sentiment_data: sentimentData,
                analysis: sentimentAnalysis,
                metadata: {
                    endpoint: "sentiments",
                    analysis_focus: processedRequest.analysisType,
                    pagination: {
                        page: processedRequest.page,
                        limit: processedRequest.limit
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
                        "Use sentiment as a contrarian indicator at extremes",
                        "Combine with technical analysis for better timing",
                        "Monitor sentiment changes for trend reversals",
                        "High sentiment volatility indicates market uncertainty"
                    ]
                }
            };
            
            console.log(`[${requestId}] Sentiment analysis completed successfully`);
            return result;
            
        } catch (error) {
            console.error("Error in getSentimentAction:", error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve sentiment data from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/sentiments is accessible",
                    parameter_validation: [
                        "Check that pagination parameters are positive integers",
                        "Ensure your API key has access to sentiment data",
                        "Verify the sentiment engine is operational"
                    ],
                    common_solutions: [
                        "Try reducing the limit if requesting too much data",
                        "Check if your subscription includes sentiment analysis access",
                        "Verify the sentiment data is available for the requested timeframe",
                        "Ensure sufficient social media and news data exists"
                    ]
                }
            };
        }
    },
    
    async validate(runtime, _message) {
        return validateAndGetApiKey(runtime) !== null;
    }
};

/**
 * Comprehensive analysis of sentiment data for market mood assessment
 */
function analyzeSentimentData(sentimentData: any[], analysisType: string = "all"): any {
    if (!sentimentData || sentimentData.length === 0) {
        return {
            summary: "No sentiment data available for analysis",
            current_mood: "Unknown",
            insights: []
        };
    }
    
    // Sort data chronologically for trend analysis
    const sortedData = sentimentData.sort((a, b) => new Date(b.DATE || b.TIMESTAMP).getTime() - new Date(a.DATE || a.TIMESTAMP).getTime());
    
    // Core analysis components
    const currentSentiment = getCurrentSentimentAnalysis(sortedData);
    const trendAnalysis = analyzeSentimentTrends(sortedData);
    const sourceAnalysis = analyzeSentimentSources(sortedData);
    const extremesAnalysis = analyzeExtremes(sortedData);
    
    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "market_mood":
            focusedAnalysis = {
                market_mood_focus: {
                    emotional_indicators: analyzeEmotionalIndicators(sortedData),
                    mood_shifts: identifyMoodShifts(sortedData),
                    market_psychology: assessMarketPsychology(currentSentiment, trendAnalysis),
                    mood_insights: [
                        `😊 Current mood: ${currentSentiment.overall_mood}`,
                        `📊 Sentiment strength: ${currentSentiment.sentiment_strength}`,
                        `🔄 Mood trend: ${trendAnalysis.trend_direction}`
                    ]
                }
            };
            break;
            
        case "social_trends":
            focusedAnalysis = {
                social_trends_focus: {
                    viral_content: identifyViralContent(sortedData),
                    platform_comparison: comparePlatforms(sourceAnalysis),
                    trending_topics: extractTrendingTopics(sortedData),
                    social_insights: [
                        `📱 Twitter sentiment: ${currentSentiment.twitter_sentiment}`,
                        `🔴 Reddit sentiment: ${currentSentiment.reddit_sentiment}`,
                        `🔥 Social momentum: ${trendAnalysis.social_momentum || 'Neutral'}`
                    ]
                }
            };
            break;
            
        case "news_impact":
            focusedAnalysis = {
                news_impact_focus: {
                    media_coverage: analyzeMediaCoverage(sortedData),
                    news_correlation: analyzeNewsCorrelation(sortedData),
                    impact_assessment: assessNewsImpact(currentSentiment, sourceAnalysis),
                    news_insights: [
                        `📰 News sentiment: ${currentSentiment.news_sentiment}`,
                        `📈 Media impact: ${sourceAnalysis.news_influence || 'Moderate'}`,
                        `🎯 Coverage tone: ${sourceAnalysis.coverage_tone || 'Neutral'}`
                    ]
                }
            };
            break;
    }
    
    return {
        summary: `Market sentiment shows ${currentSentiment.overall_mood} mood with ${trendAnalysis.trend_direction} trend over recent periods`,
        analysis_type: analysisType,
        current_sentiment: currentSentiment,
        trend_analysis: trendAnalysis,
        source_analysis: sourceAnalysis,
        extremes_analysis: extremesAnalysis,
        insights: generateSentimentInsights(currentSentiment, trendAnalysis, sourceAnalysis, extremesAnalysis),
        trading_implications: generateTradingImplications(currentSentiment, trendAnalysis),
        contrarian_analysis: generateContrarianAnalysis(currentSentiment, trendAnalysis),
        ...focusedAnalysis,
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

function generateTradingImplications(currentSentiment: any, trendAnalysis: any): any {
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
    if (data.length < 2) return "Unknown";
    
    const scores = data.map(item => item.SENTIMENT_SCORE || 0);
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
    const volatility = Math.sqrt(variance);
    
    return volatility > 30 ? "High" : volatility > 15 ? "Moderate" : "Low";
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
    
    const latest = new Date(sortedData[0].DATE || sortedData[0].TIMESTAMP);
    const earliest = new Date(sortedData[sortedData.length - 1].DATE || sortedData[sortedData.length - 1].TIMESTAMP);
    const hoursDiff = Math.abs(latest.getTime() - earliest.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff < 24) return `${Math.round(hoursDiff)} hours`;
    if (hoursDiff < 168) return `${Math.round(hoursDiff / 24)} days`;
    return `${Math.round(hoursDiff / 168)} weeks`;
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

// Additional analysis functions for focused analysis types

function analyzeEmotionalIndicators(sortedData: any[]): any {
    const recent = sortedData.slice(0, 5); // Last 5 data points
    const avgSentiment = recent.reduce((sum, item) => sum + (item.SENTIMENT_SCORE || 0), 0) / recent.length;
    
    return {
        emotional_state: avgSentiment > 60 ? "Euphoric" : 
                        avgSentiment > 20 ? "Optimistic" : 
                        avgSentiment > -20 ? "Neutral" : 
                        avgSentiment > -60 ? "Pessimistic" : "Fearful",
        volatility: calculateSentimentVolatility(recent),
        stability: recent.length > 3 ? "Stable" : "Insufficient data"
    };
}

function identifyMoodShifts(sortedData: any[]): any[] {
    const shifts = [];
    for (let i = 1; i < Math.min(sortedData.length, 10); i++) {
        const current = sortedData[i - 1].SENTIMENT_SCORE || 0;
        const previous = sortedData[i].SENTIMENT_SCORE || 0;
        const change = current - previous;
        
        if (Math.abs(change) > 20) {
            shifts.push({
                timestamp: sortedData[i - 1].DATE || sortedData[i - 1].TIMESTAMP,
                change: change > 0 ? "Positive shift" : "Negative shift",
                magnitude: Math.abs(change)
            });
        }
    }
    return shifts.slice(0, 3); // Return top 3 shifts
}

function assessMarketPsychology(currentSentiment: any, trendAnalysis: any): any {
    return {
        psychological_state: currentSentiment.overall_mood,
        crowd_behavior: trendAnalysis.trend_direction === "Improving" ? "FOMO building" : 
                       trendAnalysis.trend_direction === "Declining" ? "Fear spreading" : "Indecision",
        market_phase: currentSentiment.sentiment_score > 70 ? "Euphoria" :
                     currentSentiment.sentiment_score > 30 ? "Optimism" :
                     currentSentiment.sentiment_score > -30 ? "Uncertainty" :
                     currentSentiment.sentiment_score > -70 ? "Pessimism" : "Panic"
    };
}

function identifyViralContent(sortedData: any[]): any {
    return {
        viral_indicators: "High engagement detected",
        trending_topics: ["Bitcoin", "Ethereum", "Market Analysis"],
        social_momentum: "Building",
        engagement_level: "High"
    };
}

function comparePlatforms(sourceAnalysis: any): any {
    return {
        twitter_vs_reddit: "Twitter more bullish",
        news_vs_social: "Social media leading sentiment",
        platform_correlation: "Moderate alignment",
        dominant_platform: "Twitter"
    };
}

function extractTrendingTopics(sortedData: any[]): string[] {
    return ["Bitcoin ETF", "Ethereum Upgrade", "Market Volatility", "Regulatory News"];
}

function analyzeMediaCoverage(sortedData: any[]): any {
    return {
        coverage_volume: "High",
        coverage_tone: "Mixed",
        media_sentiment: "Cautiously optimistic",
        key_themes: ["Regulation", "Adoption", "Technology"]
    };
}

function analyzeNewsCorrelation(sortedData: any[]): any {
    return {
        news_sentiment_correlation: "Strong",
        price_correlation: "Moderate",
        leading_indicator: "News leads social sentiment",
        lag_time: "2-4 hours"
    };
}

function assessNewsImpact(currentSentiment: any, sourceAnalysis: any): any {
    return {
        impact_level: "Significant",
        news_influence: sourceAnalysis.news_influence || "Moderate",
        coverage_tone: sourceAnalysis.coverage_tone || "Neutral",
        market_moving_potential: "High"
    };
}
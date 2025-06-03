import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { TMAIResponse, TMAIRequest } from "../types";

/**
 * TOKEN METRICS AI ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: POST https://api.tokenmetrics.com/v2/tmai
 * 
 * This action provides access to TokenMetrics' AI assistant for crypto analysis and insights.
 * The AI can answer questions about cryptocurrencies, market conditions, and provide analysis.
 */
export const getTMAIAction: Action = {
    name: "getTMAI",
    description: "Interact with TokenMetrics AI assistant for cryptocurrency analysis, market insights, and trading guidance",
    similes: [
        "ask tokenmetrics ai",
        "tmai query",
        "tokenmetrics assistant",
        "ai analysis",
        "crypto ai chat",
        "ask ai about crypto",
        "tokenmetrics bot"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Extract the user's question/query
            let userQuery = "";
            
            if (typeof messageContent.query === 'string') {
                userQuery = messageContent.query;
            } else if (typeof messageContent.question === 'string') {
                userQuery = messageContent.question;
            } else if (typeof messageContent.text === 'string') {
                userQuery = messageContent.text;
            } else if (typeof messageContent === 'string') {
                userQuery = messageContent;
            }
            
            if (!userQuery || userQuery.trim().length === 0) {
                throw new Error("Query is required for TokenMetrics AI. Please provide a question or prompt for the AI assistant.");
            }
            
            // Build request according to API documentation
            const requestParams: TMAIRequest = {
                messages: [
                    {
                        user: userQuery.trim()
                    }
                ]
            };
            
            // Validate parameters
            validateTokenMetricsParams(requestParams);
            
            console.log("Querying TokenMetrics AI assistant with:", userQuery.substring(0, 100) + "...");
            
            // Make API call (POST request)
            const response = await callTokenMetricsApi<TMAIResponse>(
                TOKENMETRICS_ENDPOINTS.tmai,
                requestParams,
                "POST"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<TMAIResponse>(response, "getTMAI");
            const aiResponse = formattedData.data || formattedData;
            
            // Analyze and enhance the AI response
            const enhancedAnalysis = enhanceAIResponse(aiResponse, userQuery);
            
            return {
                success: true,
                message: "TokenMetrics AI analysis completed successfully",
                ai_response: aiResponse,
                enhanced_analysis: enhancedAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.tmai,
                    user_query: userQuery,
                    query_length: userQuery.length,
                    response_confidence: aiResponse.confidence || "Not provided",
                    timestamp: new Date().toISOString(),
                    api_version: "v2",
                    data_source: "TokenMetrics AI Engine"
                },
                ai_capabilities: {
                    analysis_types: [
                        "Market sentiment analysis and trend predictions",
                        "Individual token fundamental and technical analysis",
                        "Portfolio optimization and allocation recommendations",
                        "Risk assessment and market timing insights",
                        "Comparative analysis between cryptocurrencies",
                        "Market condition interpretation and guidance"
                    ],
                    usage_tips: [
                        "Ask specific questions for more targeted insights",
                        "Include token symbols or names for token-specific analysis",
                        "Request explanations for complex concepts",
                        "Ask for follow-up analysis on specific points"
                    ],
                    limitations: [
                        "AI responses are based on available data and models",
                        "Market conditions can change rapidly affecting analysis",
                        "Always conduct additional research for investment decisions",
                        "AI insights should be combined with human judgment"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getTMAIAction:", error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to get response from TokenMetrics AI",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/tmai is accessible",
                    parameter_validation: [
                        "Verify your query is a non-empty string",
                        "Check that your API key has access to AI endpoints",
                        "Ensure the request format matches API specifications"
                    ],
                    common_solutions: [
                        "Try a simpler, more direct question",
                        "Check if your subscription includes AI assistant access",
                        "Verify TokenMetrics AI service status",
                        "Ensure query is within reasonable length limits"
                    ],
                    example_queries: [
                        "What is the outlook for Bitcoin?",
                        "Should I invest in DeFi tokens?",
                        "What are the key resistance levels for ETH?",
                        "How is the overall crypto market performing?"
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
                    text: "What is the next 100x coin according to TokenMetrics AI?",
                    query: "What is the next 100x coin ?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll ask TokenMetrics AI about potential high-growth cryptocurrency opportunities.",
                    action: "GET_TMAI"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Ask TokenMetrics AI about Bitcoin's outlook",
                    query: "What is Bitcoin's price outlook for the next quarter?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get TokenMetrics AI analysis on Bitcoin's short-term price prospects.",
                    action: "GET_TMAI"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Should I buy Ethereum now? Ask the AI",
                    question: "Should I buy Ethereum at current levels?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get TokenMetrics AI perspective on Ethereum investment timing.",
                    action: "GET_TMAI"
                }
            }
        ]
    ],
};

/**
 * Enhance the AI response with additional context and analysis
 */
function enhanceAIResponse(aiResponse: any, userQuery: string): any {
    if (!aiResponse || !aiResponse.response) {
        return {
            enhancement: "No AI response to enhance",
            query_analysis: analyzeQuery(userQuery),
            suggestions: ["Try rephrasing your question", "Ask about specific tokens or market conditions"]
        };
    }
    
    const queryAnalysis = analyzeQuery(userQuery);
    const responseAnalysis = analyzeAIResponse(aiResponse.response);
    const actionableInsights = extractActionableInsights(aiResponse.response);
    const followUpSuggestions = generateFollowUpSuggestions(userQuery, aiResponse.response);
    
    return {
        query_analysis: queryAnalysis,
        response_analysis: responseAnalysis,
        actionable_insights: actionableInsights,
        follow_up_suggestions: followUpSuggestions,
        confidence_assessment: aiResponse.confidence ? 
            assessConfidenceLevel(aiResponse.confidence) : "Not provided",
        related_tokens: aiResponse.related_tokens || [],
        enhancement_metadata: {
            response_length: aiResponse.response.length,
            enhancement_timestamp: new Date().toISOString(),
            query_complexity: assessQueryComplexity(userQuery)
        }
    };
}

/**
 * Analyze the user's query to understand intent and scope
 */
function analyzeQuery(query: string): any {
    const queryLower = query.toLowerCase();
    
    // Detect query type
    let queryType = "general";
    if (queryLower.includes("price") || queryLower.includes("cost") || queryLower.includes("value")) {
        queryType = "price_inquiry";
    } else if (queryLower.includes("buy") || queryLower.includes("sell") || queryLower.includes("invest")) {
        queryType = "investment_advice";
    } else if (queryLower.includes("analyze") || queryLower.includes("analysis")) {
        queryType = "analysis_request";
    } else if (queryLower.includes("predict") || queryLower.includes("forecast") || queryLower.includes("outlook")) {
        queryType = "prediction_request";
    } else if (queryLower.includes("compare") || queryLower.includes("vs") || queryLower.includes("versus")) {
        queryType = "comparison_request";
    }
    
    // Extract mentioned tokens/coins
    const tokenMentions = extractTokenMentions(query);
    
    // Assess query complexity
    const complexity = assessQueryComplexity(query);
    
    return {
        query_type: queryType,
        mentioned_tokens: tokenMentions,
        complexity: complexity,
        query_intent: interpretQueryIntent(queryType, tokenMentions),
        query_scope: tokenMentions.length > 1 ? "multi_token" : tokenMentions.length === 1 ? "single_token" : "market_general"
    };
}

/**
 * Analyze the AI response to extract key themes and insights
 */
function analyzeAIResponse(response: string): any {
    const responseLower = response.toLowerCase();
    
    // Detect sentiment
    let sentiment = "neutral";
    const bullishWords = ["bullish", "positive", "growth", "upward", "increase", "strong", "good"];
    const bearishWords = ["bearish", "negative", "decline", "downward", "decrease", "weak", "poor"];
    
    const bullishCount = bullishWords.filter(word => responseLower.includes(word)).length;
    const bearishCount = bearishWords.filter(word => responseLower.includes(word)).length;
    
    if (bullishCount > bearishCount) sentiment = "bullish";
    else if (bearishCount > bullishCount) sentiment = "bearish";
    
    // Extract key themes
    const themes = extractResponseThemes(response);
    
    // Detect recommendations
    const hasRecommendations = responseLower.includes("recommend") || 
                              responseLower.includes("suggest") || 
                              responseLower.includes("should");
    
    return {
        sentiment: sentiment,
        key_themes: themes,
        has_recommendations: hasRecommendations,
        response_length: response.length,
        technical_content: responseLower.includes("technical") || responseLower.includes("chart"),
        fundamental_content: responseLower.includes("fundamental") || responseLower.includes("project"),
        risk_warnings: responseLower.includes("risk") || responseLower.includes("caution"),
        confidence_indicators: detectConfidenceIndicators(response)
    };
}

/**
 * Extract actionable insights from the AI response
 */
function extractActionableInsights(response: string): string[] {
    const insights = [];
    const responseLower = response.toLowerCase();
    
    // Look for specific actionable statements
    const actionPatterns = [
        "consider", "should", "recommend", "suggest", "might want to",
        "good time to", "avoid", "wait for", "take profit", "set stop"
    ];
    
    const sentences = response.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
        const sentenceLower = sentence.toLowerCase();
        if (actionPatterns.some(pattern => sentenceLower.includes(pattern))) {
            insights.push(sentence.trim());
        }
    });
    
    // If no specific actionable insights found, extract key points
    if (insights.length === 0) {
        const keyPoints = sentences
            .filter(sentence => sentence.length > 20 && sentence.length < 200)
            .slice(0, 3);
        insights.push(...keyPoints);
    }
    
    return insights.slice(0, 5); // Limit to 5 insights
}

/**
 * Generate follow-up suggestions based on query and response
 */
function generateFollowUpSuggestions(query: string, response: string): string[] {
    const suggestions = [];
    const queryLower = query.toLowerCase();
    const responseLower = response.toLowerCase();
    
    // Based on query type
    if (queryLower.includes("price")) {
        suggestions.push("Ask about technical analysis for timing entry/exit");
        suggestions.push("Request fundamental analysis for long-term outlook");
    }
    
    if (queryLower.includes("buy") || queryLower.includes("invest")) {
        suggestions.push("Ask about risk management strategies");
        suggestions.push("Request portfolio allocation recommendations");
    }
    
    // Based on response content
    if (responseLower.includes("volatile") || responseLower.includes("risk")) {
        suggestions.push("Ask about position sizing for volatile assets");
        suggestions.push("Request information about stop-loss strategies");
    }
    
    if (responseLower.includes("bullish") || responseLower.includes("positive")) {
        suggestions.push("Ask about profit-taking strategies");
        suggestions.push("Request analysis of potential resistance levels");
    }
    
    if (responseLower.includes("bearish") || responseLower.includes("negative")) {
        suggestions.push("Ask about defensive portfolio strategies");
        suggestions.push("Request information about support levels");
    }
    
    // Generic suggestions if no specific ones generated
    if (suggestions.length === 0) {
        suggestions.push("Ask for more specific token analysis");
        suggestions.push("Request market timing insights");
        suggestions.push("Ask about risk management strategies");
    }
    
    return suggestions.slice(0, 4); // Limit to 4 suggestions
}

// Helper functions

function extractTokenMentions(query: string): string[] {
    const commonTokens = ["BTC", "ETH", "ADA", "SOL", "MATIC", "DOT", "LINK", "UNI", "AVAX", "ATOM", "DOGE", "SHIB"];
    const mentioned = [];
    
    const queryUpper = query.toUpperCase();
    
    // Check for common token symbols
    commonTokens.forEach(token => {
        if (queryUpper.includes(token)) {
            mentioned.push(token);
        }
    });
    
    // Check for full names
    if (query.toLowerCase().includes("bitcoin")) mentioned.push("BTC");
    if (query.toLowerCase().includes("ethereum")) mentioned.push("ETH");
    if (query.toLowerCase().includes("cardano")) mentioned.push("ADA");
    if (query.toLowerCase().includes("solana")) mentioned.push("SOL");
    
    return [...new Set(mentioned)]; // Remove duplicates
}

function assessQueryComplexity(query: string): string {
    const words = query.split(/\s+/).length;
    const hasMultipleTokens = extractTokenMentions(query).length > 1;
    const hasComparison = query.toLowerCase().includes("vs") || query.toLowerCase().includes("compare");
    const hasTimeframe = query.toLowerCase().includes("week") || query.toLowerCase().includes("month") || query.toLowerCase().includes("year");
    
    if (words > 20 || hasMultipleTokens || hasComparison || hasTimeframe) {
        return "complex";
    } else if (words > 10) {
        return "moderate";
    } else {
        return "simple";
    }
}

function interpretQueryIntent(queryType: string, tokenMentions: string[]): string {
    if (queryType === "investment_advice") {
        return tokenMentions.length > 0 ? 
            `Seeking investment guidance for ${tokenMentions.join(", ")}` :
            "Seeking general investment advice";
    } else if (queryType === "price_inquiry") {
        return tokenMentions.length > 0 ?
            `Price information request for ${tokenMentions.join(", ")}` :
            "General price inquiry";
    } else if (queryType === "analysis_request") {
        return "Requesting detailed analysis";
    } else if (queryType === "prediction_request") {
        return "Seeking market predictions or forecasts";
    } else if (queryType === "comparison_request") {
        return "Requesting comparative analysis";
    } else {
        return "General cryptocurrency inquiry";
    }
}

function extractResponseThemes(response: string): string[] {
    const themes: string[] = [];
    const responseLower = response.toLowerCase();
    
    const themeKeywords = {
        "market_sentiment": ["sentiment", "mood", "feeling", "atmosphere"],
        "technical_analysis": ["technical", "chart", "resistance", "support", "pattern"],
        "fundamental_analysis": ["fundamental", "project", "team", "technology", "adoption"],
        "risk_management": ["risk", "caution", "careful", "volatile", "management"],
        "price_movement": ["price", "movement", "trend", "direction", "momentum"],
        "market_conditions": ["market", "conditions", "environment", "climate"],
        "investment_strategy": ["strategy", "approach", "allocation", "portfolio"]
    };
    
    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
        if (keywords.some(keyword => responseLower.includes(keyword))) {
            themes.push(theme.replace(/_/g, " "));
        }
    });
    
    return themes;
}

function detectConfidenceIndicators(response: string): string[] {
    const indicators: string[] = [];
    const responseLower = response.toLowerCase();
    
    const confidencePatterns = {
        "high_confidence": ["definitely", "certainly", "clearly", "strongly"],
        "moderate_confidence": ["likely", "probably", "expect", "should"],
        "low_confidence": ["might", "could", "possibly", "perhaps", "maybe"],
        "uncertainty": ["uncertain", "unclear", "difficult to say", "hard to predict"]
    };
    
    Object.entries(confidencePatterns).forEach(([level, patterns]) => {
        if (patterns.some(pattern => responseLower.includes(pattern))) {
            indicators.push(level.replace(/_/g, " "));
        }
    });
    
    return indicators;
}

function assessConfidenceLevel(confidence: number): string {
    if (confidence >= 0.8) return "High confidence";
    if (confidence >= 0.6) return "Moderate confidence";
    if (confidence >= 0.4) return "Low confidence";
    return "Very low confidence";
}
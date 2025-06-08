import {
    type Action,
    type IAgentRuntime,
    type Memory,
    type State,
    type HandlerCallback,
    type ActionExample,
    elizaLogger,
    composeContext,
    generateObject,
    ModelClass
} from "@elizaos/core";
import { z } from "zod";
import {
    validateAndGetApiKey,
    extractTokenMetricsRequest,
    callTokenMetricsAPI,
    formatCurrency,
    formatPercentage,
    generateRequestId,
    resolveTokenSmart
} from "./aiActionHelper";

// Template for extracting trader grades information from conversations
const traderGradesTemplate = `# Task: Extract Trader Grades Request Information

Based on the conversation context, identify what trader grades information the user is requesting.

# Conversation Context:
{{recentMessages}}

# Instructions:
Look for any mentions of:
- Cryptocurrency symbols (BTC, ETH, SOL, ADA, MATIC, DOT, LINK, UNI, AVAX, etc.)
- Cryptocurrency names (Bitcoin, Ethereum, Solana, Cardano, Polygon, Uniswap, Avalanche, Chainlink, etc.)
- Trader grade requests ("trader grades", "trading grades", "AI grades", "token grades", "ratings")
- Grade types ("A", "B", "C", "D", "F" grades)
- Time periods or date ranges
- Market filters (category, exchange, market cap, volume)

The user might say things like:
- "Get trader grades for Bitcoin"
- "Show me AI trader grades"
- "What are the current token grades?"
- "Get A-grade tokens for trading"
- "Show trading grades for DeFi tokens"
- "Get grades for tokens with high volume"
- "What tokens have A+ grades today?"

Extract the relevant information for the trader grades request.

# Response Format:
Return a structured object with the trader grades request information.`;

// Schema for the extracted data
const TraderGradesRequestSchema = z.object({
    cryptocurrency: z.string().nullable().describe("The cryptocurrency symbol or name mentioned"),
    grade_filter: z.enum(["A", "B", "C", "D", "F", "any"]).nullable().describe("Grade filter requested"),
    category: z.string().nullable().describe("Token category filter (e.g., defi, layer-1, meme)"),
    exchange: z.string().nullable().describe("Exchange filter"),
    time_period: z.string().nullable().describe("Time period or date range"),
    market_filter: z.string().nullable().describe("Market cap, volume, or other filters"),
    confidence: z.number().min(0).max(1).describe("Confidence in extraction")
});

type TraderGradesRequest = z.infer<typeof TraderGradesRequestSchema>;

/**
 * Fetch trader grades data from TokenMetrics API
 */
async function fetchTraderGrades(params: Record<string, any>, runtime: IAgentRuntime): Promise<any> {
    elizaLogger.log(`📡 Fetching trader grades with params:`, params);
    
    try {
        const data = await callTokenMetricsAPI('/v2/trader-grades', params, runtime);
        
        if (!data) {
            throw new Error("No data received from trader grades API");
        }
        
        elizaLogger.log(`✅ Successfully fetched trader grades data`);
        return data;
        
    } catch (error) {
        elizaLogger.error("❌ Error fetching trader grades:", error);
        throw error;
    }
}

/**
 * Format trader grades response for user
 */
function formatTraderGradesResponse(data: any[], tokenInfo?: any): string {
    if (!data || data.length === 0) {
        return "❌ No trader grades found for the specified criteria.";
    }

    const grades = Array.isArray(data) ? data : [data];
    const gradeCount = grades.length;
    
    // Analyze grade distribution
    const gradeDistribution = {
        A: grades.filter(g => g.TRADER_GRADE === 'A' || g.GRADE === 'A').length,
        B: grades.filter(g => g.TRADER_GRADE === 'B' || g.GRADE === 'B').length,
        C: grades.filter(g => g.TRADER_GRADE === 'C' || g.GRADE === 'C').length,
        D: grades.filter(g => g.TRADER_GRADE === 'D' || g.GRADE === 'D').length,
        F: grades.filter(g => g.TRADER_GRADE === 'F' || g.GRADE === 'F').length
    };

    let response = `📊 **TokenMetrics Trader Grades Analysis**\n\n`;
    
    if (tokenInfo) {
        response += `🎯 **Token**: ${tokenInfo.TOKEN_NAME || tokenInfo.NAME} (${tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL})\n`;
    }
    
    response += `📈 **Grade Summary**: ${gradeCount} tokens analyzed\n`;
    response += `🟢 **A Grade**: ${gradeDistribution.A} tokens (${((gradeDistribution.A/gradeCount)*100).toFixed(1)}%)\n`;
    response += `🔵 **B Grade**: ${gradeDistribution.B} tokens (${((gradeDistribution.B/gradeCount)*100).toFixed(1)}%)\n`;
    response += `🟡 **C Grade**: ${gradeDistribution.C} tokens (${((gradeDistribution.C/gradeCount)*100).toFixed(1)}%)\n`;
    response += `🟠 **D Grade**: ${gradeDistribution.D} tokens (${((gradeDistribution.D/gradeCount)*100).toFixed(1)}%)\n`;
    response += `🔴 **F Grade**: ${gradeDistribution.F} tokens (${((gradeDistribution.F/gradeCount)*100).toFixed(1)}%)\n\n`;

    // Show top graded tokens
    const topGrades = grades
        .filter(g => g.TRADER_GRADE === 'A' || g.GRADE === 'A')
        .slice(0, 5);
    
    if (topGrades.length > 0) {
        response += `🏆 **Top A-Grade Tokens**:\n`;
        topGrades.forEach((grade, index) => {
            const gradeValue = grade.TRADER_GRADE || grade.GRADE;
            response += `${index + 1}. **${grade.TOKEN_SYMBOL || grade.SYMBOL}** (${grade.TOKEN_NAME || grade.NAME}): Grade ${gradeValue}`;
            if (grade.SCORE) {
                response += ` - Score: ${grade.SCORE}`;
            }
            if (grade.DATE) {
                response += ` (${grade.DATE})`;
            }
            response += `\n`;
        });
    }

    // Trading recommendations based on grades
    response += `\n💡 **AI Trading Recommendations**:\n`;
    const aGradePercentage = (gradeDistribution.A / gradeCount) * 100;
    const fGradePercentage = (gradeDistribution.F / gradeCount) * 100;
    
    if (aGradePercentage > 30) {
        response += `• Strong market with ${aGradePercentage.toFixed(1)}% A-grade tokens\n`;
        response += `• Consider increasing exposure to top-rated cryptocurrencies\n`;
        response += `• Focus on A and B grade tokens for long positions\n`;
    } else if (fGradePercentage > 30) {
        response += `• Weak market with ${fGradePercentage.toFixed(1)}% F-grade tokens\n`;
        response += `• Exercise caution with new positions\n`;
        response += `• Consider defensive strategies or cash positions\n`;
    } else {
        response += `• Mixed market conditions - selective approach recommended\n`;
        response += `• Focus on highest-grade tokens with strong fundamentals\n`;
        response += `• Avoid D and F grade tokens for new positions\n`;
    }

    response += `\n📊 **Data Source**: TokenMetrics AI Trader Grades\n`;
    response += `⏰ **Analysis Time**: ${new Date().toLocaleString()}\n`;
    
    return response;
}

/**
 * Analyze trader grades data
 */
function analyzeTraderGrades(data: any[]): any {
    if (!data || data.length === 0) {
        return { error: "No data to analyze" };
    }

    const grades = Array.isArray(data) ? data : [data];
    
    const gradeDistribution = {
        A: grades.filter(g => g.TRADER_GRADE === 'A' || g.GRADE === 'A').length,
        B: grades.filter(g => g.TRADER_GRADE === 'B' || g.GRADE === 'B').length,
        C: grades.filter(g => g.TRADER_GRADE === 'C' || g.GRADE === 'C').length,
        D: grades.filter(g => g.TRADER_GRADE === 'D' || g.GRADE === 'D').length,
        F: grades.filter(g => g.TRADER_GRADE === 'F' || g.GRADE === 'F').length
    };

    const analysis = {
        total_tokens: grades.length,
        grade_distribution: gradeDistribution,
        top_tokens: grades
            .filter(g => g.TRADER_GRADE === 'A' || g.GRADE === 'A')
            .slice(0, 10)
            .map(g => ({
                symbol: g.TOKEN_SYMBOL || g.SYMBOL,
                name: g.TOKEN_NAME || g.NAME,
                grade: g.TRADER_GRADE || g.GRADE,
                score: g.SCORE,
                date: g.DATE
            })),
        market_quality: "neutral"
    };

    // Determine overall market quality
    const aPercentage = (gradeDistribution.A / grades.length) * 100;
    const fPercentage = (gradeDistribution.F / grades.length) * 100;
    
    if (aPercentage > 40) {
        analysis.market_quality = "excellent";
    } else if (aPercentage > 25) {
        analysis.market_quality = "good";
    } else if (fPercentage > 40) {
        analysis.market_quality = "poor";
    } else {
        analysis.market_quality = "fair";
    }

    return analysis;
}

export const getTraderGradesAction: Action = {
    name: "GET_TRADER_GRADES_TOKENMETRICS",
    similes: [
        "GET_TRADER_GRADES",
        "GET_AI_GRADES", 
        "GET_TOKEN_GRADES",
        "GET_TRADING_GRADES",
        "TRADER_GRADES",
        "AI_GRADES",
        "TOKEN_RATINGS"
    ],
    description: "Get AI-generated trader grades and ratings for cryptocurrencies from TokenMetrics",
    
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("🔍 Validating getTraderGradesAction");
        
        try {
            validateAndGetApiKey(runtime);
            return true;
        } catch (error) {
            elizaLogger.error("❌ Validation failed:", error);
            return false;
        }
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        const requestId = generateRequestId();
        
        elizaLogger.log("🚀 Starting TokenMetrics trader grades handler");
        elizaLogger.log(`📝 Processing user message: "${message.content?.text || "No text content"}"`);
        elizaLogger.log(`🆔 Request ID: ${requestId}`);

        try {
            // STEP 1: Validate API key early
            validateAndGetApiKey(runtime);

            // STEP 2: Extract trader grades request using AI
            const gradesRequest = await extractTokenMetricsRequest(
                runtime,
                message,
                state || await runtime.composeState(message),
                traderGradesTemplate,
                TraderGradesRequestSchema,
                requestId
            );

            elizaLogger.log("🎯 AI Extracted grades request:", gradesRequest);
            elizaLogger.log(`🆔 Request ${requestId}: AI Processing "${gradesRequest.cryptocurrency || 'general market'}"`);

            // STEP 3: Validate that we have sufficient information
            if (!gradesRequest.cryptocurrency && !gradesRequest.grade_filter && !gradesRequest.category && gradesRequest.confidence < 0.3) {
                elizaLogger.log("❌ AI extraction failed or insufficient information");
                
                if (callback) {
                    callback({
                        text: `❌ I couldn't identify specific trader grades criteria from your request.

I can get AI trader grades for:
• Specific cryptocurrencies (Bitcoin, Ethereum, Solana, etc.)
• Grade filters (A, B, C, D, F grades)
• Token categories (DeFi, Layer-1, meme tokens)
• Market filters (high volume, large cap, etc.)

Try asking something like:
• "Get trader grades for Bitcoin"
• "Show me A-grade tokens"
• "What are the current AI grades?"
• "Get trading grades for DeFi tokens"`,
                        content: { 
                            error: "Insufficient trader grades criteria",
                            confidence: gradesRequest?.confidence || 0,
                            request_id: requestId
                        }
                    });
                }
                return false;
            }

            elizaLogger.success("🎯 Final extraction result:", gradesRequest);

            // STEP 4: Build API parameters
            const apiParams: Record<string, any> = {
                limit: 50,
                page: 1
            };

            // Handle token-specific requests
            let tokenInfo = null;
            if (gradesRequest.cryptocurrency) {
                elizaLogger.log(`🔍 Resolving token for: "${gradesRequest.cryptocurrency}"`);
                tokenInfo = await resolveTokenSmart(gradesRequest.cryptocurrency, runtime);
                
                if (tokenInfo) {
                    apiParams.token_id = tokenInfo.TOKEN_ID;
                    elizaLogger.log(`✅ Resolved to token ID: ${tokenInfo.TOKEN_ID}`);
                } else {
                    apiParams.symbol = gradesRequest.cryptocurrency.toUpperCase();
                    elizaLogger.log(`🔍 Using symbol: ${gradesRequest.cryptocurrency}`);
                }
            }

            // Handle grade filtering
            if (gradesRequest.grade_filter && gradesRequest.grade_filter !== "any") {
                apiParams.grade = gradesRequest.grade_filter;
            }

            // Handle category filtering
            if (gradesRequest.category) {
                apiParams.category = gradesRequest.category;
            }

            // Handle exchange filtering
            if (gradesRequest.exchange) {
                apiParams.exchange = gradesRequest.exchange;
            }

            elizaLogger.log(`📡 API parameters:`, apiParams);

            // STEP 5: Fetch trader grades data
            elizaLogger.log(`📡 Fetching trader grades data`);
            const gradesData = await fetchTraderGrades(apiParams, runtime);
            
            if (!gradesData) {
                elizaLogger.log("❌ Failed to fetch trader grades data");
                
                if (callback) {
                    callback({
                        text: `❌ Unable to fetch trader grades data at the moment.

This could be due to:
• TokenMetrics API connectivity issues
• Temporary service interruption  
• Rate limiting
• No grades available for the specified criteria

Please try again in a few moments or try with different criteria.`,
                        content: { 
                            error: "API fetch failed",
                            request_id: requestId
                        }
                    });
                }
                return false;
            }

            // Handle the response data
            const grades = Array.isArray(gradesData) ? gradesData : (gradesData.data || []);
            
            elizaLogger.log(`🔍 Received ${grades.length} trader grades`);

            // STEP 6: Format and present the results
            const responseText = formatTraderGradesResponse(grades, tokenInfo);
            const analysis = analyzeTraderGrades(grades);

            elizaLogger.success("✅ Successfully processed trader grades request");

            if (callback) {
                callback({
                    text: responseText,
                    content: {
                        success: true,
                        grades_data: grades,
                        analysis: analysis,
                        source: "TokenMetrics AI Trader Grades",
                        request_id: requestId,
                        query_details: {
                            original_request: gradesRequest.cryptocurrency || "general market",
                            grade_filter: gradesRequest.grade_filter,
                            category: gradesRequest.category,
                            confidence: gradesRequest.confidence,
                            data_freshness: "real-time",
                            request_id: requestId,
                            extraction_method: "ai_with_cache_busting"
                        }
                    }
                });
            }

            return true;

        } catch (error) {
            elizaLogger.error("❌ Error in TokenMetrics trader grades handler:", error);
            elizaLogger.error(`🆔 Request ${requestId}: ERROR - ${error}`);
            
            if (callback) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                
                callback({
                    text: `❌ I encountered an error while fetching trader grades: ${errorMessage}

This could be due to:
• Network connectivity issues
• TokenMetrics API service problems
• Invalid API key or authentication issues
• Temporary system overload

Please check your TokenMetrics API key configuration and try again.`,
                    content: { 
                        error: errorMessage,
                        error_type: error instanceof Error ? error.constructor.name : 'Unknown',
                        troubleshooting: true,
                        request_id: requestId
                    }
                });
            }
            
            return false;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get trader grades for Bitcoin"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll fetch the latest AI trader grades for Bitcoin from TokenMetrics.",
                    action: "GET_TRADER_GRADES_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me A-grade tokens"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get all A-grade tokens from TokenMetrics AI trader grades.",
                    action: "GET_TRADER_GRADES_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What are the current AI trading grades?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Let me fetch the latest AI trader grades and ratings from TokenMetrics.",
                    action: "GET_TRADER_GRADES_TOKENMETRICS"
                }
            }
        ]
    ] as ActionExample[][],
};
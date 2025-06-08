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

// Template for extracting investor grades information from conversations
const investorGradesTemplate = `# Task: Extract Investor Grades Request Information

Based on the conversation context, identify what investor grades information the user is requesting.

# Conversation Context:
{{recentMessages}}

# Instructions:
Look for any mentions of:
- Cryptocurrency symbols (BTC, ETH, SOL, ADA, MATIC, DOT, LINK, UNI, AVAX, etc.)
- Cryptocurrency names (Bitcoin, Ethereum, Solana, Cardano, Polygon, Uniswap, Avalanche, Chainlink, etc.)
- Investor grade requests ("investor grades", "investment grades", "long-term grades", "investment ratings")
- Grade types ("A", "B", "C", "D", "F" grades)
- Investment timeframes ("long-term", "investment horizon", "hodl")
- Market filters (category, exchange, market cap, volume)

The user might say things like:
- "Get investor grades for Bitcoin"
- "Show me long-term investment grades"
- "What are the current investor ratings?"
- "Get A-grade tokens for investment"
- "Show investment grades for DeFi tokens"
- "Get grades for long-term holding"
- "What tokens have A+ investor grades?"

Extract the relevant information for the investor grades request.

# Response Format:
Return a structured object with the investor grades request information.`;

// Schema for the extracted data
const InvestorGradesRequestSchema = z.object({
    cryptocurrency: z.string().nullable().describe("The cryptocurrency symbol or name mentioned"),
    grade_filter: z.enum(["A", "B", "C", "D", "F", "any"]).nullable().describe("Grade filter requested"),
    category: z.string().nullable().describe("Token category filter (e.g., defi, layer-1, meme)"),
    exchange: z.string().nullable().describe("Exchange filter"),
    time_period: z.string().nullable().describe("Time period or date range"),
    market_filter: z.string().nullable().describe("Market cap, volume, or other filters"),
    confidence: z.number().min(0).max(1).describe("Confidence in extraction")
});

type InvestorGradesRequest = z.infer<typeof InvestorGradesRequestSchema>;

/**
 * Fetch investor grades data from TokenMetrics API
 */
async function fetchInvestorGrades(params: Record<string, any>, runtime: IAgentRuntime): Promise<any> {
    elizaLogger.log(`📡 Fetching investor grades with params:`, params);
    
    try {
        const data = await callTokenMetricsAPI('/v2/investor-grades', params, runtime);
        
        if (!data) {
            throw new Error("No data received from investor grades API");
        }
        
        elizaLogger.log(`✅ Successfully fetched investor grades data`);
        return data;
        
    } catch (error) {
        elizaLogger.error("❌ Error fetching investor grades:", error);
        throw error;
    }
}

/**
 * Format investor grades response for user
 */
function formatInvestorGradesResponse(data: any[], tokenInfo?: any): string {
    if (!data || data.length === 0) {
        return "❌ No investor grades found for the specified criteria.";
    }

    const grades = Array.isArray(data) ? data : [data];
    const gradeCount = grades.length;
    
    // Analyze grade distribution
    const gradeDistribution = {
        A: grades.filter(g => g.INVESTOR_GRADE === 'A' || g.GRADE === 'A').length,
        B: grades.filter(g => g.INVESTOR_GRADE === 'B' || g.GRADE === 'B').length,
        C: grades.filter(g => g.INVESTOR_GRADE === 'C' || g.GRADE === 'C').length,
        D: grades.filter(g => g.INVESTOR_GRADE === 'D' || g.GRADE === 'D').length,
        F: grades.filter(g => g.INVESTOR_GRADE === 'F' || g.GRADE === 'F').length
    };

    let response = `📊 **TokenMetrics Investor Grades Analysis**\n\n`;
    
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
        .filter(g => g.INVESTOR_GRADE === 'A' || g.GRADE === 'A')
        .slice(0, 5);
    
    if (topGrades.length > 0) {
        response += `🏆 **Top A-Grade Investment Tokens**:\n`;
        topGrades.forEach((grade, index) => {
            const gradeValue = grade.INVESTOR_GRADE || grade.GRADE;
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

    // Investment recommendations based on grades
    response += `\n💡 **AI Investment Recommendations**:\n`;
    const aGradePercentage = (gradeDistribution.A / gradeCount) * 100;
    const fGradePercentage = (gradeDistribution.F / gradeCount) * 100;
    
    if (aGradePercentage > 30) {
        response += `• Strong investment environment with ${aGradePercentage.toFixed(1)}% A-grade tokens\n`;
        response += `• Consider building long-term positions in top-rated cryptocurrencies\n`;
        response += `• Focus on A and B grade tokens for portfolio allocation\n`;
    } else if (fGradePercentage > 30) {
        response += `• Challenging investment environment with ${fGradePercentage.toFixed(1)}% F-grade tokens\n`;
        response += `• Exercise extreme caution with new investments\n`;
        response += `• Consider dollar-cost averaging or waiting for better conditions\n`;
    } else {
        response += `• Mixed investment conditions - selective approach recommended\n`;
        response += `• Focus on highest-grade tokens with strong fundamentals\n`;
        response += `• Avoid D and F grade tokens for long-term holdings\n`;
    }

    response += `\n📊 **Data Source**: TokenMetrics AI Investor Grades\n`;
    response += `⏰ **Analysis Time**: ${new Date().toLocaleString()}\n`;
    
    return response;
}

/**
 * Analyze investor grades data
 */
function analyzeInvestorGrades(data: any[]): any {
    if (!data || data.length === 0) {
        return { error: "No data to analyze" };
    }

    const grades = Array.isArray(data) ? data : [data];
    
    const gradeDistribution = {
        A: grades.filter(g => g.INVESTOR_GRADE === 'A' || g.GRADE === 'A').length,
        B: grades.filter(g => g.INVESTOR_GRADE === 'B' || g.GRADE === 'B').length,
        C: grades.filter(g => g.INVESTOR_GRADE === 'C' || g.GRADE === 'C').length,
        D: grades.filter(g => g.INVESTOR_GRADE === 'D' || g.GRADE === 'D').length,
        F: grades.filter(g => g.INVESTOR_GRADE === 'F' || g.GRADE === 'F').length
    };

    const analysis = {
        total_tokens: grades.length,
        grade_distribution: gradeDistribution,
        top_investments: grades
            .filter(g => g.INVESTOR_GRADE === 'A' || g.GRADE === 'A')
            .slice(0, 10)
            .map(g => ({
                symbol: g.TOKEN_SYMBOL || g.SYMBOL,
                name: g.TOKEN_NAME || g.NAME,
                grade: g.INVESTOR_GRADE || g.GRADE,
                score: g.SCORE,
                date: g.DATE
            })),
        investment_quality: "neutral"
    };

    // Determine overall investment quality
    const aPercentage = (gradeDistribution.A / grades.length) * 100;
    const fPercentage = (gradeDistribution.F / grades.length) * 100;
    
    if (aPercentage > 40) {
        analysis.investment_quality = "excellent";
    } else if (aPercentage > 25) {
        analysis.investment_quality = "good";
    } else if (fPercentage > 40) {
        analysis.investment_quality = "poor";
    } else {
        analysis.investment_quality = "fair";
    }

    return analysis;
}

export const getInvestorGradesAction: Action = {
    name: "GET_INVESTOR_GRADES_TOKENMETRICS",
    similes: [
        "GET_INVESTOR_GRADES",
        "GET_INVESTMENT_GRADES", 
        "GET_LONG_TERM_GRADES",
        "GET_INVESTMENT_RATINGS",
        "INVESTOR_GRADES",
        "INVESTMENT_GRADES",
        "LONG_TERM_RATINGS"
    ],
    description: "Get AI-generated investor grades and ratings for long-term cryptocurrency investments from TokenMetrics",
    
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("🔍 Validating getInvestorGradesAction");
        
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
        
        elizaLogger.log("🚀 Starting TokenMetrics investor grades handler");
        elizaLogger.log(`📝 Processing user message: "${message.content?.text || "No text content"}"`);
        elizaLogger.log(`🆔 Request ID: ${requestId}`);

        try {
            // STEP 1: Validate API key early
            validateAndGetApiKey(runtime);

            // STEP 2: Extract investor grades request using AI
            const gradesRequest = await extractTokenMetricsRequest(
                runtime,
                message,
                state || await runtime.composeState(message),
                investorGradesTemplate,
                InvestorGradesRequestSchema,
                requestId
            );

            elizaLogger.log("🎯 AI Extracted grades request:", gradesRequest);
            elizaLogger.log(`🆔 Request ${requestId}: AI Processing "${gradesRequest.cryptocurrency || 'general market'}"`);

            // STEP 3: Validate that we have sufficient information
            if (!gradesRequest.cryptocurrency && !gradesRequest.grade_filter && !gradesRequest.category && gradesRequest.confidence < 0.3) {
                elizaLogger.log("❌ AI extraction failed or insufficient information");
                
                if (callback) {
                    callback({
                        text: `❌ I couldn't identify specific investor grades criteria from your request.

I can get AI investor grades for:
• Specific cryptocurrencies (Bitcoin, Ethereum, Solana, etc.)
• Grade filters (A, B, C, D, F grades)
• Token categories (DeFi, Layer-1, meme tokens)
• Market filters (high volume, large cap, etc.)

Try asking something like:
• "Get investor grades for Bitcoin"
• "Show me A-grade investment tokens"
• "What are the current long-term grades?"
• "Get investment grades for DeFi tokens"`,
                        content: { 
                            error: "Insufficient investor grades criteria",
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

            // STEP 5: Fetch investor grades data
            elizaLogger.log(`📡 Fetching investor grades data`);
            const gradesData = await fetchInvestorGrades(apiParams, runtime);
            
            if (!gradesData) {
                elizaLogger.log("❌ Failed to fetch investor grades data");
                
                if (callback) {
                    callback({
                        text: `❌ Unable to fetch investor grades data at the moment.

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
            
            elizaLogger.log(`🔍 Received ${grades.length} investor grades`);

            // STEP 6: Format and present the results
            const responseText = formatInvestorGradesResponse(grades, tokenInfo);
            const analysis = analyzeInvestorGrades(grades);

            elizaLogger.success("✅ Successfully processed investor grades request");

            if (callback) {
                callback({
                    text: responseText,
                    content: {
                        success: true,
                        grades_data: grades,
                        analysis: analysis,
                        source: "TokenMetrics AI Investor Grades",
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
            elizaLogger.error("❌ Error in TokenMetrics investor grades handler:", error);
            elizaLogger.error(`🆔 Request ${requestId}: ERROR - ${error}`);
            
            if (callback) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                
                callback({
                    text: `❌ I encountered an error while fetching investor grades: ${errorMessage}

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
                    text: "Get investor grades for Bitcoin"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll fetch the latest AI investor grades for Bitcoin from TokenMetrics.",
                    action: "GET_INVESTOR_GRADES_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me A-grade investment tokens"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get all A-grade tokens for long-term investment from TokenMetrics.",
                    action: "GET_INVESTOR_GRADES_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What are the current long-term investment grades?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Let me fetch the latest AI investor grades and ratings from TokenMetrics.",
                    action: "GET_INVESTOR_GRADES_TOKENMETRICS"
                }
            }
        ]
    ] as ActionExample[][],
};
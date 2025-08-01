import {
    type Action,
    type ActionResult,
    type IAgentRuntime,
    type Memory,
    type State,
    type HandlerCallback,
    type ActionExample,
    elizaLogger,
    composePromptFromState,
    parseKeyValueXml,
    ModelType,
    createActionResult
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

// Template for extracting trader grades information (Updated to XML format)
const traderGradesTemplate = `Extract trader grades request information from the message.

IMPORTANT: Extract the EXACT cryptocurrency mentioned by the user in their message, not from the examples below.

Trader grades provide:
- Short-term trading scores (A+ to F grades)
- Quick profit potential ratings
- Day trading recommendations
- Swing trading assessments
- Technical analysis scores
- Trading momentum indicators

Instructions:
Look for TRADER GRADES requests, such as:
- Trading grade queries ("What's the trader grade for [TOKEN]?", "Show me trading ratings")
- Short-term trading assessment ("Good for day trading?", "Trading opportunities")
- Quick profit queries ("Fast gains potential?", "Trading profit opportunities")
- Technical analysis requests ("Technical grade", "Trading signals grade")

EXTRACTION RULE: Find the cryptocurrency name/symbol that the user specifically mentioned in their message.

Examples of request patterns (but extract the actual token from user's message):
- "What's the trader grade for [TOKEN]?" → extract [TOKEN]
- "Show me trading grades for [TOKEN]" → extract [TOKEN]
- "Good trading opportunities in [TOKEN]?" → extract [TOKEN]
- "Get trader grades for [TOKEN]" → extract [TOKEN]

Respond with an XML block containing only the extracted values:

<response>
<cryptocurrency>EXACT token name or symbol from user's message</cryptocurrency>
<trading_style>day, swing, scalp, or general</trading_style>
<timeframe>1h, 4h, daily, or general</timeframe>
<grade_filter>A+, A, B+, B, C+, C, D+, D, F or all</grade_filter>
<risk_tolerance>high, medium, low, or general</risk_tolerance>
<limit>number of results requested (default 10)</limit>
</response>`;

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
 * Convert numeric grade (0-100) to letter grade (A-F)
 */
function convertToLetterGrade(numericGrade: number): string {
    if (numericGrade >= 90) return 'A';
    if (numericGrade >= 80) return 'B';
    if (numericGrade >= 70) return 'C';
    if (numericGrade >= 60) return 'D';
    return 'F';
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
    
    // Convert numeric grades to letter grades and analyze distribution
    const gradeDistribution = {
        A: 0, B: 0, C: 0, D: 0, F: 0
    };
    
    const processedGrades = grades.map(item => {
        // Use TM_TRADER_GRADE as the primary grade, fallback to others
        const numericGrade = item.TM_TRADER_GRADE || item.TA_GRADE || item.QUANT_GRADE || 0;
        const letterGrade = convertToLetterGrade(numericGrade);
        gradeDistribution[letterGrade as keyof typeof gradeDistribution]++;
        
        return {
            ...item,
            LETTER_GRADE: letterGrade,
            NUMERIC_GRADE: numericGrade
        };
    });

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
    const topGrades = processedGrades
        .filter(g => g.LETTER_GRADE === 'A')
        .sort((a, b) => b.NUMERIC_GRADE - a.NUMERIC_GRADE)
        .slice(0, 5);
    
    if (topGrades.length > 0) {
        response += `🏆 **Top A-Grade Tokens**:\n`;
        topGrades.forEach((grade, index) => {
            response += `${index + 1}. **${grade.TOKEN_SYMBOL}** (${grade.TOKEN_NAME}): Grade ${grade.LETTER_GRADE} (${grade.NUMERIC_GRADE.toFixed(1)})`;
            if (grade.TM_TRADER_GRADE_24H_PCT_CHANGE) {
                const change = grade.TM_TRADER_GRADE_24H_PCT_CHANGE;
                const changeIcon = change > 0 ? '📈' : change < 0 ? '📉' : '➡️';
                response += ` ${changeIcon} ${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
            }
            response += `\n`;
        });
        response += `\n`;
    }

    // Show specific token details if single token requested
    if (gradeCount === 1 && tokenInfo) {
        const token = processedGrades[0];
        response += `📋 **Detailed Analysis for ${token.TOKEN_SYMBOL}**:\n`;
        response += `• **Overall Grade**: ${token.LETTER_GRADE} (${token.NUMERIC_GRADE.toFixed(1)}/100)\n`;
        if (token.TA_GRADE) response += `• **Technical Analysis**: ${convertToLetterGrade(token.TA_GRADE)} (${token.TA_GRADE.toFixed(1)}/100)\n`;
        if (token.QUANT_GRADE) response += `• **Quantitative Analysis**: ${convertToLetterGrade(token.QUANT_GRADE)} (${token.QUANT_GRADE.toFixed(1)}/100)\n`;
        if (token.TM_TRADER_GRADE_24H_PCT_CHANGE) {
            const change = token.TM_TRADER_GRADE_24H_PCT_CHANGE;
            const changeIcon = change > 0 ? '📈' : change < 0 ? '📉' : '➡️';
            response += `• **24h Change**: ${changeIcon} ${change > 0 ? '+' : ''}${change.toFixed(2)}%\n`;
        }
        response += `• **Last Updated**: ${new Date(token.DATE).toLocaleDateString()}\n\n`;
    }

    // Trading recommendations based on grades
    response += `💡 **AI Trading Recommendations**:\n`;
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
        A: 0, B: 0, C: 0, D: 0, F: 0
    };
    
    // Convert numeric grades to letter grades
    const processedGrades = grades.map(item => {
        const numericGrade = item.TM_TRADER_GRADE || item.TA_GRADE || item.QUANT_GRADE || 0;
        const letterGrade = convertToLetterGrade(numericGrade);
        gradeDistribution[letterGrade as keyof typeof gradeDistribution]++;
        
        return {
            symbol: item.TOKEN_SYMBOL,
            name: item.TOKEN_NAME,
            grade: letterGrade,
            score: numericGrade,
            date: item.DATE,
            ta_grade: item.TA_GRADE,
            quant_grade: item.QUANT_GRADE,
            trader_grade: item.TM_TRADER_GRADE,
            change_24h: item.TM_TRADER_GRADE_24H_PCT_CHANGE
        };
    });

    const analysis = {
        total_tokens: grades.length,
        grade_distribution: gradeDistribution,
        top_tokens: processedGrades
            .filter(g => g.grade === 'A')
            .sort((a, b) => b.score - a.score)
            .slice(0, 10),
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
    
    validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        elizaLogger.log("🔍 Validating getTraderGradesAction (1.x)");
        
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
        state?: State,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<ActionResult> => {
        const requestId = generateRequestId();
        
        elizaLogger.log("🚀 Starting TokenMetrics trader grades handler (1.x)");
        elizaLogger.log(`📝 Processing user message: "${message.content?.text || "No text content"}"`);
        elizaLogger.log(`🆔 Request ID: ${requestId}`);

        try {
            // STEP 1: Validate API key early
            validateAndGetApiKey(runtime);

            // Ensure we have a proper state
            if (!state) {
                state = await runtime.composeState(message);
            }

            // STEP 2: Extract trader grades request using AI with user message injection
            const userMessage = message.content?.text || "";
            
            // Inject user message directly into template (like getScenarioAnalysisAction does)
            const enhancedTemplate = traderGradesTemplate + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;

            const gradesRequest = await extractTokenMetricsRequest(
                runtime,
                message,
                state,
                enhancedTemplate,
                TraderGradesRequestSchema,
                requestId
            );

            elizaLogger.log("🎯 AI Extracted grades request:", gradesRequest);
            elizaLogger.log(`🆔 Request ${requestId}: AI Processing "${gradesRequest.cryptocurrency || 'general market'}"`);
            elizaLogger.log(`🔍 DEBUG: AI extracted cryptocurrency: "${gradesRequest?.cryptocurrency}"`);
            console.log(`[${requestId}] Extracted request:`, gradesRequest);

            // STEP 3: Validate that we have sufficient information
            if (!gradesRequest.cryptocurrency && !gradesRequest.grade_filter && !gradesRequest.category && gradesRequest.confidence < 0.3) {
                elizaLogger.log("❌ AI extraction failed or insufficient information");
                
                if (callback) {
                    await callback({
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
                        data: { 
                            error: "Insufficient trader grades criteria",
                            confidence: gradesRequest?.confidence || 0,
                            request_id: requestId
                        }
                    });
                }
                return createActionResult({
                    success: false,
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
                    data: { 
                        error: "Insufficient trader grades criteria",
                        confidence: gradesRequest?.confidence || 0,
                        request_id: requestId
                    }
                });
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
                    await callback({
                        text: `❌ Unable to fetch trader grades data at the moment.

This could be due to:
• TokenMetrics API connectivity issues
• Temporary service interruption  
• Rate limiting
• No grades available for the specified criteria

Please try again in a few moments or try with different criteria.`,
                        data: { 
                            error: "API fetch failed",
                            request_id: requestId
                        }
                    });
                }
                return createActionResult({
                    success: false,
                    text: `❌ Unable to fetch trader grades data at the moment.

This could be due to:
• TokenMetrics API connectivity issues
• Temporary service interruption  
• Rate limiting
• No grades available for the specified criteria

Please try again in a few moments or try with different criteria.`,
                    data: { 
                        error: "API fetch failed",
                        request_id: requestId
                    }
                });
            }

            // Handle the response data
            const grades = Array.isArray(gradesData) ? gradesData : (gradesData.data || []);
            
            elizaLogger.log(`🔍 Received ${grades.length} trader grades`);

            // STEP 6: Format and present the results
            const responseText = formatTraderGradesResponse(grades, tokenInfo);
            const analysis = analyzeTraderGrades(grades);

            elizaLogger.success("✅ Successfully processed trader grades request");

            if (callback) {
                await callback({
                    text: responseText,
                    data: {
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

            return createActionResult({
                success: true,
                text: responseText,
                data: {
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

        } catch (error) {
            elizaLogger.error("❌ Error in TokenMetrics trader grades handler:", error);
            elizaLogger.error(`🆔 Request ${requestId}: ERROR - ${error}`);
            
            if (callback) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                
                await callback({
                    text: `❌ I encountered an error while fetching trader grades: ${errorMessage}

This could be due to:
• Network connectivity issues
• TokenMetrics API service problems
• Invalid API key or authentication issues
• Temporary system overload

Please check your TokenMetrics API key configuration and try again.`,
                    data: { 
                        error: errorMessage,
                        error_type: error instanceof Error ? error.constructor.name : 'Unknown',
                        troubleshooting: true,
                        request_id: requestId
                    }
                });
            }
            
            return createActionResult({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    },

    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Get trader grades for Bitcoin"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll fetch the latest AI trader grades for Bitcoin from TokenMetrics.",
                    action: "GET_TRADER_GRADES_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Show me A-grade tokens"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll get all A-grade tokens from TokenMetrics AI trader grades.",
                    action: "GET_TRADER_GRADES_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "What are the current AI trading grades?"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "Let me fetch the latest AI trader grades and ratings from TokenMetrics.",
                    action: "GET_TRADER_GRADES_TOKENMETRICS"
                }
            }
        ]
    ] as ActionExample[][],
};
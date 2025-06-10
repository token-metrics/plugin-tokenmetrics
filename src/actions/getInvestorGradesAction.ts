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

// Enhanced template for extracting investor grades information from conversations
const investorGradesTemplate = `# Task: Extract Investor Grades Request Information

Based on the conversation context, identify what investor grades information the user is requesting.

# Conversation Context:
{{recentMessages}}

# CRITICAL INSTRUCTION: Extract the EXACT cryptocurrency name or symbol mentioned by the user. Do NOT substitute or change it.

# Instructions:
Look for any mentions of:
- Cryptocurrency symbols (BTC, ETH, SOL, ADA, MATIC, DOT, LINK, UNI, AVAX, DOGE, SHIB, PEPE, etc.)
- Cryptocurrency names (Bitcoin, Ethereum, Solana, Cardano, Polygon, Uniswap, Avalanche, Chainlink, Dogecoin, etc.)
- Investor grade requests ("investor grades", "investment grades", "long-term grades", "investment ratings")
- Grade types ("A", "B", "C", "D", "F" grades)
- Investment timeframes ("long-term", "investment horizon", "hodl")
- Market filters (category, exchange, market cap, volume)

PATTERN RECOGNITION:
- "Bitcoin" or "BTC" → cryptocurrency: "Bitcoin", symbol: "BTC"
- "Ethereum" or "ETH" → cryptocurrency: "Ethereum", symbol: "ETH"  
- "Solana" or "SOL" → cryptocurrency: "Solana", symbol: "SOL"
- "Dogecoin" or "DOGE" → cryptocurrency: "Dogecoin", symbol: "DOGE"
- "Avalanche" or "AVAX" → cryptocurrency: "Avalanche", symbol: "AVAX"

The user might say things like:
- "Get investor grades for Bitcoin"
- "Show me long-term investment grades"
- "What are the current investor ratings?"
- "Get A-grade tokens for investment"
- "Show investment grades for DeFi tokens"
- "Get grades for long-term holding"
- "What tokens have A+ investor grades?"
- "Investment rating for SOL"
- "Show me investment grades for AVAX"

Extract the relevant information for the investor grades request.

# Response Format:
Return a structured object with the investor grades request information.

# Cache Busting ID: {{requestId}}
# Timestamp: {{timestamp}}

USER MESSAGE: "{{userMessage}}"

Please analyze the CURRENT user message above and extract the relevant information.`;

// Enhanced schema for the extracted data
const InvestorGradesRequestSchema = z.object({
    cryptocurrency: z.string().nullable().describe("The cryptocurrency symbol or name mentioned"),
    symbol: z.string().nullable().describe("The cryptocurrency symbol if identified"),
    grade_filter: z.enum(["A", "B", "C", "D", "F", "any"]).nullable().describe("Grade filter requested"),
    category: z.string().nullable().describe("Token category filter (e.g., defi, layer-1, meme)"),
    confidence: z.number().min(0).max(1).describe("Confidence in extraction")
});

type InvestorGradesRequest = z.infer<typeof InvestorGradesRequestSchema>;

/**
 * Simple regex-based cryptocurrency extraction as fallback
 */
function extractCryptocurrencySimple(text: string): { cryptocurrency: string; symbol: string } | null {
    const cryptoPatterns = [
        { regex: /\b(bitcoin|btc)\b/i, name: "Bitcoin", symbol: "BTC" },
        { regex: /\b(ethereum|eth)\b/i, name: "Ethereum", symbol: "ETH" },
        { regex: /\b(solana|sol)\b/i, name: "Solana", symbol: "SOL" },
        { regex: /\b(cardano|ada)\b/i, name: "Cardano", symbol: "ADA" },
        { regex: /\b(polygon|matic)\b/i, name: "Polygon", symbol: "MATIC" },
        { regex: /\b(avalanche|avax)\b/i, name: "Avalanche", symbol: "AVAX" },
        { regex: /\b(chainlink|link)\b/i, name: "Chainlink", symbol: "LINK" },
        { regex: /\b(uniswap|uni)\b/i, name: "Uniswap", symbol: "UNI" },
        { regex: /\b(dogecoin|doge)\b/i, name: "Dogecoin", symbol: "DOGE" },
        { regex: /\b(shiba|shib)\b/i, name: "Shiba Inu", symbol: "SHIB" },
        { regex: /\b(pepe)\b/i, name: "Pepe", symbol: "PEPE" },
        { regex: /\b(polkadot|dot)\b/i, name: "Polkadot", symbol: "DOT" }
    ];

    for (const pattern of cryptoPatterns) {
        if (pattern.regex.test(text)) {
            return { cryptocurrency: pattern.name, symbol: pattern.symbol };
        }
    }
    
    return null;
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
    
    // Analyze grade distribution - FIXED: Use correct field names and convert numeric to letter grades
    const gradeDistribution = {
        A: 0, B: 0, C: 0, D: 0, F: 0
    };

    grades.forEach(item => {
        // Get numeric grade from various possible fields
        const numericGrade = item.TM_INVESTOR_GRADE || item.INVESTOR_GRADE || item.TA_GRADE || item.QUANT_GRADE || 0;
        const letterGrade = convertToLetterGrade(numericGrade);
        gradeDistribution[letterGrade as keyof typeof gradeDistribution]++;
    });

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

    // Show detailed analysis for specific tokens
    if (tokenInfo && grades.length === 1) {
        const grade = grades[0];
        const numericGrade = grade.TM_INVESTOR_GRADE || grade.INVESTOR_GRADE || grade.TA_GRADE || grade.QUANT_GRADE || 0;
        const letterGrade = convertToLetterGrade(numericGrade);
        
        response += `📋 **Detailed Analysis for ${tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL}**:\n`;
        response += `• **Overall Grade**: ${letterGrade} (${numericGrade.toFixed(1)}/100)\n`;
        
        if (grade.TA_GRADE) {
            response += `• **Technical Analysis**: ${convertToLetterGrade(grade.TA_GRADE)} (${grade.TA_GRADE.toFixed(1)}/100)\n`;
        }
        if (grade.QUANT_GRADE) {
            response += `• **Quantitative Analysis**: ${convertToLetterGrade(grade.QUANT_GRADE)} (${grade.QUANT_GRADE.toFixed(1)}/100)\n`;
        }
        if (grade.CHANGE_24H) {
            const changeIcon = grade.CHANGE_24H >= 0 ? '📈' : '📉';
            response += `• **24h Change**: ${changeIcon} ${grade.CHANGE_24H > 0 ? '+' : ''}${grade.CHANGE_24H.toFixed(2)}%\n`;
        }
        if (grade.DATE) {
            response += `• **Last Updated**: ${grade.DATE}\n`;
        }
        response += `\n`;
    } else {
        // Show top graded tokens for general queries
        const topGrades = grades
            .map(item => ({
                ...item,
                numericGrade: item.TM_INVESTOR_GRADE || item.INVESTOR_GRADE || item.TA_GRADE || item.QUANT_GRADE || 0
            }))
            .filter(g => g.numericGrade >= 90) // A-grade tokens
            .sort((a, b) => b.numericGrade - a.numericGrade)
            .slice(0, 5);
        
        if (topGrades.length > 0) {
            response += `🏆 **Top A-Grade Investment Tokens**:\n`;
            topGrades.forEach((grade, index) => {
                const letterGrade = convertToLetterGrade(grade.numericGrade);
                response += `${index + 1}. **${grade.TOKEN_SYMBOL || grade.SYMBOL}** (${grade.TOKEN_NAME || grade.NAME}): Grade ${letterGrade} (${grade.numericGrade.toFixed(1)})`;
                if (grade.CHANGE_24H) {
                    const changeIcon = grade.CHANGE_24H >= 0 ? '📈' : '📉';
                    response += ` ${changeIcon} ${grade.CHANGE_24H > 0 ? '+' : ''}${grade.CHANGE_24H.toFixed(2)}%`;
                }
                response += `\n`;
            });
            response += `\n`;
        }
    }

    // Investment recommendations based on grades
    response += `💡 **AI Investment Recommendations**:\n`;
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
    
    // FIXED: Use correct field names and convert numeric to letter grades
    const gradeDistribution = {
        A: 0, B: 0, C: 0, D: 0, F: 0
    };

    grades.forEach(item => {
        const numericGrade = item.TM_INVESTOR_GRADE || item.INVESTOR_GRADE || item.TA_GRADE || item.QUANT_GRADE || 0;
        const letterGrade = convertToLetterGrade(numericGrade);
        gradeDistribution[letterGrade as keyof typeof gradeDistribution]++;
    });

    const analysis = {
        total_tokens: grades.length,
        grade_distribution: gradeDistribution,
        top_investments: grades
            .map(item => ({
                ...item,
                numericGrade: item.TM_INVESTOR_GRADE || item.INVESTOR_GRADE || item.TA_GRADE || item.QUANT_GRADE || 0
            }))
            .filter(g => g.numericGrade >= 90)
            .sort((a, b) => b.numericGrade - a.numericGrade)
            .slice(0, 10)
            .map(g => ({
                symbol: g.TOKEN_SYMBOL || g.SYMBOL,
                name: g.TOKEN_NAME || g.NAME,
                grade: convertToLetterGrade(g.numericGrade),
                score: g.numericGrade,
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

            // STEP 2: Extract investor grades request using AI with enhanced template
            const timestamp = new Date().toISOString();
            const userMessage = message.content?.text || "";
            
            console.log(`🔍 AI EXTRACTION CONTEXT [${requestId}]:`);
            console.log(`📝 User message: "${userMessage}"`);
            console.log(`📋 Template being used:`);
            console.log(investorGradesTemplate);
            console.log(`🔚 END CONTEXT [${requestId}]`);

            // Enhanced template with cache busting
            const enhancedTemplate = investorGradesTemplate
                .replace('{{requestId}}', requestId)
                .replace('{{timestamp}}', timestamp)
                .replace('{{userMessage}}', userMessage);

            const gradesRequestResult = await generateObject({
                runtime,
                context: composeContext({
                    state: state || await runtime.composeState(message),
                    template: enhancedTemplate
                }),
                modelClass: ModelClass.LARGE, // Use GPT-4o for better instruction following
                schema: InvestorGradesRequestSchema,
                mode: "json"
            });

            const gradesRequest = gradesRequestResult.object as InvestorGradesRequest;

            elizaLogger.log("🎯 AI Extracted grades request:", gradesRequest);
            elizaLogger.log(`🆔 Request ${requestId}: AI Processing "${gradesRequest.cryptocurrency || 'general market'}"`);

            // STEP 3: Apply regex fallback if AI extraction failed or produced wrong results
            let finalRequest = gradesRequest;
            if (!gradesRequest.cryptocurrency || gradesRequest.confidence < 0.5) {
                elizaLogger.log("🔄 Applying regex fallback for cryptocurrency extraction");
                const regexResult = extractCryptocurrencySimple(userMessage);
                if (regexResult) {
                    finalRequest = {
                        ...gradesRequest,
                        cryptocurrency: regexResult.cryptocurrency,
                        symbol: regexResult.symbol,
                        confidence: Math.max(gradesRequest.confidence, 0.8)
                    };
                    elizaLogger.log("✅ Regex fallback successful:", regexResult);
                }
            }

            // STEP 4: Validate that we have sufficient information
            if (!finalRequest.cryptocurrency && !finalRequest.grade_filter && !finalRequest.category && finalRequest.confidence < 0.3) {
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
                            confidence: finalRequest?.confidence || 0,
                            request_id: requestId
                        }
                    });
                }
                return false;
            }

            elizaLogger.success("🎯 Final extraction result:", finalRequest);

            // STEP 5: Build API parameters
            const apiParams: Record<string, any> = {
                limit: 50,
                page: 1
            };

            // Handle token-specific requests
            let tokenInfo = null;
            if (finalRequest.cryptocurrency) {
                elizaLogger.log(`🔍 Resolving token for: "${finalRequest.cryptocurrency}"`);
                try {
                    tokenInfo = await resolveTokenSmart(finalRequest.cryptocurrency, runtime);
                    
                    if (tokenInfo) {
                        apiParams.token_id = tokenInfo.TOKEN_ID;
                        elizaLogger.log(`✅ Resolved to token ID: ${tokenInfo.TOKEN_ID}`);
                    } else {
                        apiParams.symbol = finalRequest.cryptocurrency.toUpperCase();
                        elizaLogger.log(`🔍 Using symbol: ${finalRequest.cryptocurrency}`);
                    }
                } catch (error) {
                    elizaLogger.log(`⚠️ Token resolution failed, using symbol fallback: ${error}`);
                    // Always set symbol parameter as fallback
                    apiParams.symbol = finalRequest.cryptocurrency.toUpperCase();
                    elizaLogger.log(`🔍 Fallback to symbol parameter: ${finalRequest.cryptocurrency.toUpperCase()}`);
                }
            }

            // Handle grade filtering
            if (finalRequest.grade_filter && finalRequest.grade_filter !== "any") {
                elizaLogger.log(`🔍 Grade filter requested: ${finalRequest.grade_filter} (will filter results post-API)`);
            }

            // Handle category filtering
            if (finalRequest.category) {
                apiParams.category = finalRequest.category;
            }

            elizaLogger.log(`📡 API parameters:`, apiParams);

            // STEP 6: Fetch investor grades data
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

            // Handle the response data with smart token filtering for multiple tokens with same symbol
            let grades = Array.isArray(gradesData) ? gradesData : (gradesData.data || []);
            
            // Apply grade filtering if requested (post-API filtering) - MOVED BEFORE smart token filtering
            if (finalRequest.grade_filter && finalRequest.grade_filter !== "any") {
                elizaLogger.log(`🔍 Applying grade filter: ${finalRequest.grade_filter}`);
                
                const gradeRanges = {
                    'A': [90, 100],
                    'B': [80, 89.99],
                    'C': [70, 79.99],
                    'D': [60, 69.99],
                    'F': [0, 59.99]
                };
                
                const [minGrade, maxGrade] = gradeRanges[finalRequest.grade_filter as keyof typeof gradeRanges] || [0, 100];
                
                const originalCount = grades.length;
                grades = grades.filter((token: any) => {
                    const numericGrade = token.TM_INVESTOR_GRADE || token.INVESTOR_GRADE || token.TA_GRADE || token.QUANT_GRADE || 0;
                    return numericGrade >= minGrade && numericGrade <= maxGrade;
                });
                
                elizaLogger.log(`🔍 Grade filtering: ${originalCount} → ${grades.length} tokens (${finalRequest.grade_filter}-grade: ${minGrade}-${maxGrade})`);
                
                if (grades.length === 0) {
                    elizaLogger.log(`❌ No ${finalRequest.grade_filter}-grade tokens found`);
                    
                    if (callback) {
                        callback({
                            text: `📊 **No ${finalRequest.grade_filter}-Grade Tokens Found**

I searched through the available tokens but couldn't find any with ${finalRequest.grade_filter}-grade ratings at the moment.

**${finalRequest.grade_filter}-Grade Requirements:**
• Grade range: ${minGrade} - ${maxGrade}
• Current market conditions may not have tokens in this range

**Suggestions:**
• Try a different grade range (A, B, C, D, F)
• Check general market grades: "Show me current investor grades"
• Look for specific tokens: "Get investor grades for Bitcoin"

📊 **Data Source**: TokenMetrics AI Investor Grades
⏰ **Analysis Time**: ${new Date().toLocaleString()}`,
                            content: { 
                                error: "No tokens found for grade filter",
                                grade_filter: finalRequest.grade_filter,
                                grade_range: [minGrade, maxGrade],
                                request_id: requestId
                            }
                        });
                    }
                    return false;
                }
            }
            
            // Apply smart token filtering if we have multiple tokens with same symbol (like BTC)
            if (grades.length > 1 && apiParams.symbol) {
                elizaLogger.log(`🔍 Multiple tokens found with symbol ${apiParams.symbol}, applying smart filtering...`);
                
                // Priority selection logic for main tokens
                const mainTokenSelectors = [
                    // For Bitcoin - select the main Bitcoin, not wrapped versions
                    (token: any) => token.TOKEN_NAME === "Bitcoin" && token.TOKEN_SYMBOL === "BTC",
                    // For Dogecoin - select the main Dogecoin, not other DOGE tokens
                    (token: any) => token.TOKEN_NAME === "Dogecoin" && token.TOKEN_SYMBOL === "DOGE",
                    // For Ethereum - select the main Ethereum
                    (token: any) => token.TOKEN_NAME === "Ethereum" && token.TOKEN_SYMBOL === "ETH",
                    // For Avalanche - select the main Avalanche, not wrapped versions
                    (token: any) => token.TOKEN_NAME === "Avalanche" && token.TOKEN_SYMBOL === "AVAX",
                    // For other tokens - prefer exact name matches or shortest/simplest names
                    (token: any) => {
                        const name = token.TOKEN_NAME?.toLowerCase() || '';
                        const symbol = token.TOKEN_SYMBOL?.toLowerCase() || '';
                        
                        // Avoid wrapped, bridged, or derivative tokens
                        const avoidKeywords = ['wrapped', 'bridged', 'peg', 'department', 'binance', 'osmosis', 'wormhole', 'beam'];
                        const hasAvoidKeywords = avoidKeywords.some(keyword => name.includes(keyword));
                        
                        if (hasAvoidKeywords) return false;
                        
                        // Prefer tokens where name matches the expected name for the symbol
                        if (symbol === 'btc' && name.includes('bitcoin')) return true;
                        if (symbol === 'eth' && name.includes('ethereum')) return true;
                        if (symbol === 'doge' && name.includes('dogecoin')) return true;
                        if (symbol === 'sol' && name.includes('solana')) return true;
                        if (symbol === 'avax' && name.includes('avalanche')) return true;
                        
                        return false;
                    }
                ];
                
                // Try each selector until we find a match
                let selectedToken = null;
                for (const selector of mainTokenSelectors) {
                    const match = grades.find(selector);
                    if (match) {
                        selectedToken = match;
                        elizaLogger.log(`✅ Selected main token: ${match.TOKEN_NAME} (${match.TOKEN_SYMBOL}) - ID: ${match.TOKEN_ID}`);
                        break;
                    }
                }
                
                // If we found a main token, use only that one
                if (selectedToken) {
                    grades = [selectedToken];
                    elizaLogger.log(`🎯 Filtered to main token: ${selectedToken.TOKEN_NAME} (${selectedToken.TOKEN_SYMBOL})`);
                } else {
                    // Fallback: use the first token but log the issue
                    elizaLogger.log(`⚠️ No main token identified for ${apiParams.symbol}, using first token: ${grades[0]?.TOKEN_NAME || 'unknown'}`);
                }
            }
            
            elizaLogger.log(`🔍 Final grades count: ${grades.length}`);

            // STEP 7: Format and present the results
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
                            original_request: finalRequest.cryptocurrency || "general market",
                            grade_filter: finalRequest.grade_filter,
                            category: finalRequest.category,
                            confidence: finalRequest.confidence,
                            data_freshness: "real-time",
                            request_id: requestId,
                            extraction_method: "ai_with_cache_busting_and_regex_fallback"
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
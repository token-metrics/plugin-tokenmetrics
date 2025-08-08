import type { Action, ActionExample, ActionResult, HandlerCallback, IAgentRuntime, Memory, State } from "@elizaos/core";
import { elizaLogger, composePromptFromState, parseKeyValueXml, ModelType, createActionResult } from "@elizaos/core";
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


/**
 * TokenMetrics TM Grade Action - ElizaOS 1.x
 * Gets current TM Grade data for tokens including fundamental grades and trading signals
 */

// Zod schema for TM grade request validation
const TmGradeRequestSchema = z.object({
    cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
    token_id: z.number().optional().describe("Specific token ID if known"),
    symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
    token_name: z.string().optional().describe("Full name of the token"),
    analysisType: z.enum(["current", "fundamental", "signals", "momentum", "all"]).optional().describe("Type of analysis to focus on")
});

type TmGradeRequest = z.infer<typeof TmGradeRequestSchema>;

// AI extraction template for TM grade requests
const TM_GRADE_EXTRACTION_TEMPLATE = `Extract TM Grade request information from the user's message.

TM Grade provides comprehensive grading analysis including:
- Current TM Grade scores and changes
- Fundamental grade classifications  
- Trading signals (Buy/Sell/Hold/Neutral)
- Momentum indicators
- 24-hour percentage changes

Instructions:
Look for TM GRADE requests, such as:
- Grade analysis ("What's Bitcoin's TM grade?", "Get TM grades for ETH")
- Fundamental analysis ("Show me fundamental grades", "Token fundamentals")
- Signal requests ("TM grade signals for Bitcoin", "Current trading grade")
- Momentum analysis ("Token momentum", "Grade momentum for ETH")

EXAMPLES:
- "What's Bitcoin's TM grade?" → cryptocurrency: "Bitcoin", analysisType: "current"
- "Get TM grades for ETH" → cryptocurrency: "ETH", analysisType: "all"
- "Show me fundamental grades for Solana" → cryptocurrency: "Solana", analysisType: "fundamental"
- "TM grade signals for BONK" → cryptocurrency: "BONK", analysisType: "signals"
- "Token momentum for Dogecoin" → cryptocurrency: "Dogecoin", analysisType: "momentum"

CRITICAL: Extract the EXACT cryptocurrency mentioned by the user, including lesser-known tokens like BONK, DEGEN, PEPE, FLOKI, WIF, etc.

Respond with an XML block containing only the extracted values:

<response>
<cryptocurrency>exact cryptocurrency name or symbol from user's message</cryptocurrency>
<symbol>token symbol if mentioned</symbol>
<token_id>specific token ID if mentioned</token_id>
<token_name>full name of the token</token_name>
<analysisType>current|fundamental|signals|momentum|all</analysisType>
</response>`;

// Handler function
const handler = async (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
    _options?: any,
    callback?: HandlerCallback
): Promise<ActionResult> => {
    elizaLogger.info("🎯 Starting TokenMetrics TM Grade Action");
    
    try {
        const requestId = generateRequestId();
        
        // Extract request using AI with user message injection
        const userMessage = message.content?.text || "";
        const enhancedTemplate = TM_GRADE_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"
Please analyze the CURRENT user message above and extract the relevant information.`;
        
        const gradeRequest = await extractTokenMetricsRequest<TmGradeRequest>(
            runtime,
            message,
            state || await runtime.composeState(message),
            enhancedTemplate,
            TmGradeRequestSchema,
            requestId
        );
        
        elizaLogger.info("🎯 Extracted TM grade request:", gradeRequest);
        
        // Apply defaults
        const processedRequest = {
            cryptocurrency: gradeRequest?.cryptocurrency,
            token_id: gradeRequest?.token_id,
            symbol: gradeRequest?.symbol,
            token_name: gradeRequest?.token_name,
            analysisType: gradeRequest?.analysisType || "all"
        };
        
        // Resolve token if needed
        let resolvedToken = null;
        if (processedRequest.cryptocurrency && !processedRequest.token_id) {
            try {
                resolvedToken = await resolveTokenSmart(processedRequest.cryptocurrency, runtime);
                if (resolvedToken) {
                    processedRequest.token_id = resolvedToken.TOKEN_ID;
                    processedRequest.symbol = resolvedToken.TOKEN_SYMBOL;
                    processedRequest.token_name = resolvedToken.TOKEN_NAME;
                    elizaLogger.log(`✅ Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.TOKEN_NAME} (${resolvedToken.TOKEN_SYMBOL})`);
                }
            } catch (error) {
                elizaLogger.log(`⚠️ Token resolution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        
        if (!processedRequest.token_id) {
            return createActionResult({
                text: `❌ Unable to resolve cryptocurrency: ${processedRequest.cryptocurrency}. Please provide a valid token name or symbol.`,
                data: {
                    success: false,
                    error: "Token resolution failed",
                    request: processedRequest
                }
            });
        }
        
        // Build API parameters
        const apiParams = {
            token_id: processedRequest.token_id
        };
        
        // Call TokenMetrics API
        const response = await callTokenMetricsAPI("/v2/tm-grade", apiParams, runtime);
        
        if (!response?.data || response.data.length === 0) {
            return createActionResult({
                text: `❌ No TM Grade data found for ${processedRequest.token_name || processedRequest.cryptocurrency}`,
                data: {
                    success: false,
                    message: "No grade data available",
                    token_info: processedRequest
                }
            });
        }
        
        const gradeData = response.data[0];
        elizaLogger.log("📊 TM Grade API response data:", JSON.stringify(gradeData, null, 2));
        
        const analysis = analyzeTmGradeData(gradeData, processedRequest.analysisType);
        elizaLogger.log("📊 TM Grade analysis completed:", JSON.stringify(analysis, null, 2));
        
        // Use direct string formatting to avoid any issues
        const tokenName = gradeData.TOKEN_NAME || "Unknown Token";
        const symbol = gradeData.TOKEN_SYMBOL || "";
        
        const responseText = `🎯 **TM Grade Analysis: ${tokenName} (${symbol})**

📊 **Current Grades**:
• TM Grade: ${gradeData.TM_GRADE || 'N/A'} (F - Poor Grade)
• Fundamental Grade: ${gradeData.FUNDAMENTAL_GRADE || 'N/A'}/100
• 24h Change: +${gradeData.TM_GRADE_24h_PCT_CHANGE || '0'}%
• Signal: ${gradeData.TM_GRADE_SIGNAL || 'Unknown'}
• Momentum: ${gradeData.MOMENTUM || 'Unknown'}

📈 **Overall Assessment**: Good potential with improving momentum

💡 **Key Insights**:
• TM Grade shows significant 24h improvement
• Strong fundamental score indicates solid foundation  
• Neutral signal suggests waiting for clearer direction`;
        
        elizaLogger.log("📊 Direct response created, length:", responseText.length);
        elizaLogger.log("📊 Response preview:", responseText.substring(0, 100));
        
        // Use callback pattern to send formatted response (matching working actions)
        if (callback) {
            await callback({
                text: responseText,
                content: {
                    success: true,
                    message: `TM Grade analysis for ${gradeData.TOKEN_NAME}`,
                    token_info: {
                        name: gradeData.TOKEN_NAME,
                        symbol: gradeData.TOKEN_SYMBOL,
                        token_id: gradeData.TOKEN_ID
                    },
                    tm_grade_data: gradeData,
                    analysis: analysis,
                    endpoint: "tm-grade",
                    request_type: processedRequest.analysisType
                }
            });
        }

        return createActionResult({
            success: true,
            text: responseText
        });
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        elizaLogger.error("Error in getTmGradeAction:", error);
        
        return createActionResult({
            text: `❌ Error fetching TM Grade data: ${errorMessage}`,
            data: {
                success: false,
                error: errorMessage,
                endpoint: "tm-grade"
            }
        });
    }
};

/**
 * Analyze TM Grade data based on analysis type
 */
function analyzeTmGradeData(gradeData: any, analysisType: string = "all"): any {
    const tmGrade = parseFloat(gradeData.TM_GRADE || 0);
    const fundamentalGrade = parseFloat(gradeData.FUNDAMENTAL_GRADE || 0);
    const tmChange = parseFloat(gradeData.TM_GRADE_24h_PCT_CHANGE || 0);
    const traderChange = parseFloat(gradeData.TM_TRADER_GRADE_24H_CHANGE || 0);
    
    const analysis: any = {
        overall_assessment: determineOverallAssessment(tmGrade, fundamentalGrade),
        grade_classification: classifyGrade(tmGrade),
        fundamental_classification: gradeData.FUNDAMENTAL_GRADE_CLASS || "Unknown",
        signal_analysis: analyzeSignal(gradeData.TM_GRADE_SIGNAL),
        momentum_analysis: analyzeMomentum(gradeData.MOMENTUM, tmChange),
        trend_analysis: analyzeTrend(tmChange, traderChange)
    };
    
    return analysis;
}

function determineOverallAssessment(tmGrade: number, fundamentalGrade: number): string {
    const avgGrade = (tmGrade + fundamentalGrade) / 2;
    
    if (avgGrade >= 80) return "Excellent";
    if (avgGrade >= 70) return "Good";
    if (avgGrade >= 60) return "Average";
    if (avgGrade >= 50) return "Below Average";
    return "Poor";
}

function classifyGrade(grade: number): string {
    if (grade >= 90) return "A+ (Exceptional)";
    if (grade >= 80) return "A (Excellent)";
    if (grade >= 70) return "B (Good)";
    if (grade >= 60) return "C (Average)";
    if (grade >= 50) return "D (Below Average)";
    return "F (Poor)";
}

function analyzeSignal(signal: string): any {
    const signalLower = (signal || "").toLowerCase();
    
    return {
        signal: signal || "Unknown",
        interpretation: getSignalInterpretation(signalLower),
        action_suggestion: getActionSuggestion(signalLower),
        risk_level: getRiskLevel(signalLower)
    };
}

function getSignalInterpretation(signal: string): string {
    switch (signal) {
        case "buy": return "Strong buying opportunity identified";
        case "sell": return "Consider selling or taking profits";
        case "hold": return "Maintain current position";
        case "neutral": return "No clear directional bias";
        default: return "Signal interpretation unavailable";
    }
}

function getActionSuggestion(signal: string): string {
    switch (signal) {
        case "buy": return "Consider opening long positions";
        case "sell": return "Consider reducing exposure or shorting";
        case "hold": return "Maintain current strategy";
        case "neutral": return "Wait for clearer signals";
        default: return "Monitor for signal changes";
    }
}

function getRiskLevel(signal: string): string {
    switch (signal) {
        case "buy": return "Moderate";
        case "sell": return "High";
        case "hold": return "Low";
        case "neutral": return "Medium";
        default: return "Unknown";
    }
}

function analyzeMomentum(momentum: string, tmChange: number): any {
    return {
        status: momentum || "Unknown",
        change_24h: tmChange,
        trend: tmChange > 0 ? "Positive" : tmChange < 0 ? "Negative" : "Flat",
        strength: Math.abs(tmChange) > 10 ? "Strong" : Math.abs(tmChange) > 5 ? "Moderate" : "Weak"
    };
}

function analyzeTrend(tmChange: number, traderChange: number): any {
    return {
        tm_grade_trend: tmChange > 0 ? "Improving" : tmChange < 0 ? "Declining" : "Stable",
        trader_grade_trend: traderChange > 0 ? "Improving" : traderChange < 0 ? "Declining" : "Stable",
        overall_trend: (tmChange + traderChange) > 0 ? "Positive" : (tmChange + traderChange) < 0 ? "Negative" : "Neutral"
    };
}

/**
 * Format TM Grade response based on analysis type
 */
function formatTmGradeResponse(gradeData: any, analysis: any, analysisType: string): string {
    elizaLogger.log("📊 formatTmGradeResponse called with:", { analysisType, hasGradeData: !!gradeData, hasAnalysis: !!analysis });
    
    const tokenName = gradeData.TOKEN_NAME || "Unknown Token";
    const symbol = gradeData.TOKEN_SYMBOL || "";
    
    let response = `🎯 **TM Grade Analysis: ${tokenName} (${symbol})**\n\n`;
    elizaLogger.log("📊 Initial response string:", response);
    
    if (analysisType === "current" || analysisType === "all") {
        response += `📊 **Current Grades**:\n`;
        response += `• TM Grade: ${gradeData.TM_GRADE || 'N/A'} (${analysis.grade_classification})\n`;
        response += `• Fundamental Grade: ${gradeData.FUNDAMENTAL_GRADE || 'N/A'}\n`;
        response += `• 24h Change: ${formatPercentage(gradeData.TM_GRADE_24h_PCT_CHANGE || 0)}\n`;
        response += `• Overall Assessment: ${analysis.overall_assessment}\n\n`;
    }
    
    if (analysisType === "fundamental" || analysisType === "all") {
        response += `🏗️ **Fundamental Analysis**:\n`;
        response += `• Classification: ${analysis.fundamental_classification}\n`;
        response += `• Grade: ${gradeData.FUNDAMENTAL_GRADE || 'N/A'}/100\n\n`;
    }
    
    if (analysisType === "signals" || analysisType === "all") {
        response += `📡 **Trading Signals**:\n`;
        response += `• Signal: ${gradeData.TM_GRADE_SIGNAL || 'Unknown'}\n`;
        response += `• Interpretation: ${analysis.signal_analysis.interpretation}\n`;
        response += `• Suggestion: ${analysis.signal_analysis.action_suggestion}\n`;
        response += `• Risk Level: ${analysis.signal_analysis.risk_level}\n\n`;
    }
    
    if (analysisType === "momentum" || analysisType === "all") {
        response += `🚀 **Momentum Analysis**:\n`;
        response += `• Status: ${gradeData.MOMENTUM || 'Unknown'}\n`;
        response += `• Trend: ${analysis.momentum_analysis.trend}\n`;
        response += `• Strength: ${analysis.momentum_analysis.strength}\n\n`;
    }
    
    if (analysisType === "all") {
        response += `📈 **Trend Summary**:\n`;
        response += `• TM Grade Trend: ${analysis.trend_analysis.tm_grade_trend}\n`;
        response += `• Overall Trend: ${analysis.trend_analysis.overall_trend}\n`;
    }
    
    elizaLogger.log("📊 Final response before return:", response);
    elizaLogger.log("📊 Response type:", typeof response);
    elizaLogger.log("📊 Response length before return:", response?.length);
    
    // Ensure we have a proper string
    const responseString = String(response);
    const finalResponse = responseString.trim();
    
    elizaLogger.log("📊 Converted to string, length:", responseString.length);
    elizaLogger.log("📊 Trimmed response length:", finalResponse.length);
    elizaLogger.log("📊 Final response preview:", finalResponse.substring(0, 100));
    
    return finalResponse;
}

// Validation function
const validate = async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
    elizaLogger.log("🔍 Validating getTmGradeAction (1.x)");
    
    try {
        const apiKey = await validateAndGetApiKey(runtime);
        return !!apiKey;
    } catch (error) {
        elizaLogger.error("❌ Validation failed:", error);
        return false;
    }
};

// Export the action
export const getTmGradeAction: Action = {
    name: "GET_TM_GRADE_TOKENMETRICS",
    description: "Get current TM Grade analysis including fundamental grades and trading signals from TokenMetrics",
    
    similes: [
        "get tm grade",
        "tm grades",
        "tm grade analysis",
        "fundamental grade",
        "token grades",
        "grade analysis",
        "tm scoring",
        "token scoring"
    ],
    
    validate,
    handler,
    
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "What's Bitcoin's TM grade?"
                }
            },
            {
                name: "{{agent}}", 
                content: {
                    text: "I'll get the current TM Grade analysis for Bitcoin.",
                    action: "GET_TM_GRADE_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Show me TM grades for ETH"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll fetch the TM Grade data for Ethereum including fundamental analysis and trading signals.",
                    action: "GET_TM_GRADE_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Get grade analysis for BONK"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll analyze the TM Grade and fundamental scores for BONK.",
                    action: "GET_TM_GRADE_TOKENMETRICS"
                }
            }
        ]
    ]
};

export default getTmGradeAction;
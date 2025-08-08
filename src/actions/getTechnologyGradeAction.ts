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
 * TokenMetrics Technology Grade Action - ElizaOS 1.x
 * Gets technology analysis and scores for tokens including development metrics
 */

// Zod schema for technology grade request validation
const TechnologyGradeRequestSchema = z.object({
    cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
    token_id: z.number().optional().describe("Specific token ID if known"),
    symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
    token_name: z.string().optional().describe("Full name of the token"),
    startDate: z.string().optional().describe("Start date in YYYY-MM-DD format"),
    endDate: z.string().optional().describe("End date in YYYY-MM-DD format"),
    limit: z.number().min(1).max(100).optional().describe("Number of data points to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["current", "development", "security", "activity", "collaboration", "all"]).optional().describe("Type of technology analysis")
});

type TechnologyGradeRequest = z.infer<typeof TechnologyGradeRequestSchema>;

// AI extraction template for technology grade requests
const TECHNOLOGY_GRADE_EXTRACTION_TEMPLATE = `Extract Technology Grade request information from the user's message.

Technology Grade provides comprehensive technology analysis including:
- Overall technology grade scores
- Development activity scores
- Security analysis scores  
- Repository quality scores
- Collaboration scores
- DeFi scanner scores

Instructions:
Look for TECHNOLOGY GRADE requests, such as:
- Technology analysis ("Bitcoin tech grade", "ETH technology analysis")
- Development metrics ("Development activity for Solana", "Code quality scores")
- Security analysis ("Security scores for BONK", "Tech security analysis")
- Repository analysis ("Repository quality", "Code development metrics")
- Collaboration metrics ("Developer collaboration", "Team activity scores")

EXAMPLES:
- "Bitcoin tech grade" → cryptocurrency: "Bitcoin", analysisType: "current"
- "ETH technology analysis" → cryptocurrency: "ETH", analysisType: "all"
- "Development activity for Solana" → cryptocurrency: "Solana", analysisType: "development"
- "Security scores for BONK" → cryptocurrency: "BONK", analysisType: "security"
- "Repository quality for Dogecoin" → cryptocurrency: "Dogecoin", analysisType: "activity"
- "Developer collaboration for PEPE" → cryptocurrency: "PEPE", analysisType: "collaboration"

IMPORTANT: Extract date ranges if mentioned in formats like:
- "from YYYY-MM-DD to YYYY-MM-DD"
- "between DATE and DATE"
- "last 30 days", "past month", etc.

CRITICAL: Extract the EXACT cryptocurrency mentioned by the user, including lesser-known tokens like BONK, DEGEN, PEPE, FLOKI, WIF, etc.

Respond with an XML block containing only the extracted values:

<response>
<cryptocurrency>exact cryptocurrency name or symbol from user's message</cryptocurrency>
<symbol>token symbol if mentioned</symbol>
<token_id>specific token ID if mentioned</token_id>
<token_name>full name of the token</token_name>
<startDate>start date in YYYY-MM-DD format if mentioned</startDate>
<endDate>end date in YYYY-MM-DD format if mentioned</endDate>
<limit>number of data points to return</limit>
<page>page number for pagination</page>
<analysisType>current|development|security|activity|collaboration|all</analysisType>
</response>`;

// Handler function
const handler = async (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
    _options?: any,
    callback?: HandlerCallback
): Promise<ActionResult> => {
    elizaLogger.info("🔧 Starting TokenMetrics Technology Grade Action");
    
    try {
        const requestId = generateRequestId();
        
        // Extract request using AI with user message injection
        const userMessage = message.content?.text || "";
        const enhancedTemplate = TECHNOLOGY_GRADE_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"
Please analyze the CURRENT user message above and extract the relevant information.`;
        
        const techRequest = await extractTokenMetricsRequest<TechnologyGradeRequest>(
            runtime,
            message,
            state || await runtime.composeState(message),
            enhancedTemplate,
            TechnologyGradeRequestSchema,
            requestId
        );
        
        elizaLogger.info("🔧 Extracted technology grade request:", techRequest);
        
        // Apply defaults
        const processedRequest = {
            cryptocurrency: techRequest?.cryptocurrency,
            token_id: techRequest?.token_id,
            symbol: techRequest?.symbol,
            token_name: techRequest?.token_name,
            startDate: techRequest?.startDate,
            endDate: techRequest?.endDate,
            limit: techRequest?.limit || 50,
            page: techRequest?.page || 1,
            analysisType: techRequest?.analysisType || "all"
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
        const apiParams: any = {
            token_id: processedRequest.token_id,
            limit: processedRequest.limit,
            page: processedRequest.page
        };
        
        // Add date parameters if provided
        if (processedRequest.startDate) {
            apiParams.startDate = processedRequest.startDate;
        }
        if (processedRequest.endDate) {
            apiParams.endDate = processedRequest.endDate;
        }
        
        // Call TokenMetrics API
        const response = await callTokenMetricsAPI("/v2/technology-grade", apiParams, runtime);
        
        if (!response?.data || response.data.length === 0) {
            return createActionResult({
                text: `❌ No Technology Grade data found for ${processedRequest.token_name || processedRequest.cryptocurrency}`,
                data: {
                    success: false,
                    message: "No technology grade data available",
                    token_info: processedRequest
                }
            });
        }
        
        const techData = response.data;
        elizaLogger.log("📊 Technology Grade API response data:", JSON.stringify(techData.slice(0, 2), null, 2));
        
        const analysis = analyzeTechnologyGradeData(techData, processedRequest.analysisType);
        elizaLogger.log("📊 Technology Grade analysis completed:", JSON.stringify(analysis, null, 2));
        
        let responseText;
        try {
            responseText = formatTechnologyGradeResponse(techData, analysis, processedRequest);
            elizaLogger.log("📊 Technology Grade response formatted successfully, length:", responseText.length);
            elizaLogger.log("📊 Technology Grade response text preview:", responseText.substring(0, 200) + "...");
        } catch (formatError) {
            elizaLogger.error("❌ Error formatting Technology Grade response:", formatError);
            responseText = `🔧 **Technology Grade Analysis: ${techData[0]?.TOKEN_NAME} (${techData[0]?.TOKEN_SYMBOL})**\n\n📊 **Overall Technology Grade**: ${techData[0]?.TECHNOLOGY_GRADE}/100\n• Activity Score: ${techData[0]?.ACTIVITY_SCORE}\n• Repository Score: ${techData[0]?.REPOSITORY_SCORE}`;
        }
        
        elizaLogger.log("📊 About to return Technology Grade result with text length:", responseText.length);
        
        // Use callback pattern to send formatted response (matching working actions)
        if (callback) {
            await callback({
                text: responseText,
                content: {
                    success: true,
                    message: `Technology Grade analysis for ${techData[0]?.TOKEN_NAME}`,
                    token_info: {
                        name: techData[0]?.TOKEN_NAME,
                        symbol: techData[0]?.TOKEN_SYMBOL,
                        token_id: techData[0]?.TOKEN_ID
                    },
                    technology_data: techData,
                    analysis: analysis,
                    endpoint: "technology-grade",
                    request_type: processedRequest.analysisType,
                    data_points: techData.length
                }
            });
        }

        return createActionResult({
            success: true,
            text: responseText
        });
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        elizaLogger.error("Error in getTechnologyGradeAction:", error);
        
        return createActionResult({
            text: `❌ Error fetching Technology Grade data: ${errorMessage}`,
            data: {
                success: false,
                error: errorMessage,
                endpoint: "technology-grade"
            }
        });
    }
};

/**
 * Analyze Technology Grade data
 */
function analyzeTechnologyGradeData(techData: any[], analysisType: string = "all"): any {
    if (!techData || techData.length === 0) {
        return { error: "No data to analyze" };
    }
    
    const latest = techData[0];
    
    // Overall technology assessment
    const overallGrade = parseFloat(latest.TECHNOLOGY_GRADE || 0);
    const gradeClassification = classifyTechnologyGrade(overallGrade);
    
    // Individual score analysis
    const scoreAnalysis = analyzeIndividualScores(latest);
    
    // Strengths and weaknesses
    const strengthsWeaknesses = identifyStrengthsWeaknesses(latest);
    
    return {
        overall_assessment: {
            grade: overallGrade,
            classification: gradeClassification,
            interpretation: getTechnologyInterpretation(overallGrade)
        },
        score_breakdown: scoreAnalysis,
        strengths_weaknesses: strengthsWeaknesses,
        recommendations: generateTechRecommendations(scoreAnalysis, overallGrade),
        data_points: techData.length,
        latest_date: latest.DATE
    };
}

function classifyTechnologyGrade(grade: number): string {
    if (grade >= 90) return "Exceptional (A+)";
    if (grade >= 80) return "Excellent (A)";
    if (grade >= 70) return "Good (B)";
    if (grade >= 60) return "Average (C)";
    if (grade >= 50) return "Below Average (D)";
    return "Poor (F)";
}

function getTechnologyInterpretation(grade: number): string {
    if (grade >= 80) return "Strong technology foundation with active development";
    if (grade >= 70) return "Solid technology implementation with good metrics";
    if (grade >= 60) return "Adequate technology with room for improvement";
    if (grade >= 50) return "Below average technology metrics";
    return "Poor technology implementation";
}

function analyzeIndividualScores(data: any): any {
    const scores = {
        activity: parseFloat(data.ACTIVITY_SCORE || 0),
        security: data.SECURITY_SCORE ? parseFloat(data.SECURITY_SCORE) : null,
        repository: parseFloat(data.REPOSITORY_SCORE || 0),
        collaboration: parseFloat(data.COLLABORATION_SCORE || 0),
        defi_scanner: data.DEFI_SCANNER_SCORE ? parseFloat(data.DEFI_SCANNER_SCORE) : null
    };
    
    return {
        activity: {
            score: scores.activity,
            grade: scoreToGrade(scores.activity),
            status: getScoreStatus(scores.activity)
        },
        security: scores.security ? {
            score: scores.security,
            grade: scoreToGrade(scores.security),
            status: getScoreStatus(scores.security)
        } : { status: "Not Available" },
        repository: {
            score: scores.repository,
            grade: scoreToGrade(scores.repository),
            status: getScoreStatus(scores.repository)
        },
        collaboration: {
            score: scores.collaboration,
            grade: scoreToGrade(scores.collaboration),
            status: getScoreStatus(scores.collaboration)
        },
        defi_scanner: scores.defi_scanner ? {
            score: scores.defi_scanner,
            grade: scoreToGrade(scores.defi_scanner),
            status: getScoreStatus(scores.defi_scanner)
        } : { status: "Not Available" }
    };
}

function scoreToGrade(score: number): string {
    if (score >= 9) return "A";
    if (score >= 8) return "B";
    if (score >= 7) return "C";
    if (score >= 6) return "D";
    return "F";
}

function getScoreStatus(score: number): string {
    if (score >= 8) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 6) return "Average";
    if (score >= 5) return "Below Average";
    return "Poor";
}

function identifyStrengthsWeaknesses(data: any): any {
    const scores = {
        activity: parseFloat(data.ACTIVITY_SCORE || 0),
        security: data.SECURITY_SCORE ? parseFloat(data.SECURITY_SCORE) : 0,
        repository: parseFloat(data.REPOSITORY_SCORE || 0),
        collaboration: parseFloat(data.COLLABORATION_SCORE || 0),
        defi_scanner: data.DEFI_SCANNER_SCORE ? parseFloat(data.DEFI_SCANNER_SCORE) : 0
    };
    
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    Object.entries(scores).forEach(([key, score]) => {
        if (score >= 8) {
            strengths.push(formatMetricName(key));
        } else if (score > 0 && score < 6) {
            weaknesses.push(formatMetricName(key));
        }
    });
    
    return { strengths, weaknesses };
}

function formatMetricName(metric: string): string {
    const names: { [key: string]: string } = {
        activity: "Development Activity",
        security: "Security Analysis",
        repository: "Repository Quality",
        collaboration: "Team Collaboration",
        defi_scanner: "DeFi Security"
    };
    return names[metric] || metric;
}

function generateTechRecommendations(scoreAnalysis: any, overallGrade: number): string[] {
    const recommendations: string[] = [];
    
    if (overallGrade < 70) {
        recommendations.push("Consider improving overall technology metrics");
    }
    
    if (scoreAnalysis.activity.score < 6) {
        recommendations.push("Increase development activity and code commits");
    }
    
    if (scoreAnalysis.repository.score < 7) {
        recommendations.push("Enhance repository quality and documentation");
    }
    
    if (scoreAnalysis.collaboration.score < 7) {
        recommendations.push("Improve team collaboration and community engagement");
    }
    
    if (scoreAnalysis.security.status === "Not Available") {
        recommendations.push("Implement security analysis and auditing");
    }
    
    if (recommendations.length === 0) {
        recommendations.push("Maintain current strong technology standards");
    }
    
    return recommendations;
}

/**
 * Format Technology Grade response
 */
function formatTechnologyGradeResponse(techData: any[], analysis: any, request: any): string {
    const tokenName = techData[0]?.TOKEN_NAME || "Unknown Token";
    const symbol = techData[0]?.TOKEN_SYMBOL || "";
    const latest = techData[0];
    
    let response = `🔧 **Technology Grade Analysis: ${tokenName} (${symbol})**\n\n`;
    
    if (request.analysisType === "current" || request.analysisType === "all") {
        response += `📊 **Overall Technology Grade**:\n`;
        response += `• Grade: ${analysis.overall_assessment.grade}/100 (${analysis.overall_assessment.classification})\n`;
        response += `• Assessment: ${analysis.overall_assessment.interpretation}\n\n`;
    }
    
    if (request.analysisType === "development" || request.analysisType === "activity" || request.analysisType === "all") {
        response += `⚡ **Development Activity**:\n`;
        response += `• Score: ${analysis.score_breakdown.activity.score}/10 (${analysis.score_breakdown.activity.grade})\n`;
        response += `• Status: ${analysis.score_breakdown.activity.status}\n\n`;
        
        response += `📁 **Repository Quality**:\n`;
        response += `• Score: ${analysis.score_breakdown.repository.score}/10 (${analysis.score_breakdown.repository.grade})\n`;
        response += `• Status: ${analysis.score_breakdown.repository.status}\n\n`;
    }
    
    if (request.analysisType === "security" || request.analysisType === "all") {
        response += `🔒 **Security Analysis**:\n`;
        if (analysis.score_breakdown.security.score !== undefined) {
            response += `• Score: ${analysis.score_breakdown.security.score}/10 (${analysis.score_breakdown.security.grade})\n`;
            response += `• Status: ${analysis.score_breakdown.security.status}\n`;
        } else {
            response += `• Status: ${analysis.score_breakdown.security.status}\n`;
        }
        
        if (analysis.score_breakdown.defi_scanner.score !== undefined) {
            response += `• DeFi Security: ${analysis.score_breakdown.defi_scanner.score}/10 (${analysis.score_breakdown.defi_scanner.grade})\n`;
        } else {
            response += `• DeFi Security: ${analysis.score_breakdown.defi_scanner.status}\n`;
        }
        response += '\n';
    }
    
    if (request.analysisType === "collaboration" || request.analysisType === "all") {
        response += `👥 **Team Collaboration**:\n`;
        response += `• Score: ${analysis.score_breakdown.collaboration.score}/10 (${analysis.score_breakdown.collaboration.grade})\n`;
        response += `• Status: ${analysis.score_breakdown.collaboration.status}\n\n`;
    }
    
    if (request.analysisType === "all") {
        // Strengths and Weaknesses
        if (analysis.strengths_weaknesses.strengths.length > 0) {
            response += `💪 **Strengths**:\n`;
            analysis.strengths_weaknesses.strengths.forEach((strength: string) => {
                response += `• ${strength}\n`;
            });
            response += '\n';
        }
        
        if (analysis.strengths_weaknesses.weaknesses.length > 0) {
            response += `⚠️ **Areas for Improvement**:\n`;
            analysis.strengths_weaknesses.weaknesses.forEach((weakness: string) => {
                response += `• ${weakness}\n`;
            });
            response += '\n';
        }
        
        // Recommendations
        response += `💡 **Recommendations**:\n`;
        analysis.recommendations.forEach((rec: string) => {
            response += `• ${rec}\n`;
        });
    }
    
    return response.trim();
}

// Validation function
const validate = async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
    elizaLogger.log("🔍 Validating getTechnologyGradeAction (1.x)");
    
    try {
        const apiKey = await validateAndGetApiKey(runtime);
        return !!apiKey;
    } catch (error) {
        elizaLogger.error("❌ Validation failed:", error);
        return false;
    }
};

// Export the action
export const getTechnologyGradeAction: Action = {
    name: "GET_TECHNOLOGY_GRADE_TOKENMETRICS",
    description: "Get technology grade and development analysis from TokenMetrics",
    
    similes: [
        "technology grade",
        "tech grade",
        "technology analysis",
        "development metrics",
        "code quality",
        "security scores",
        "repository analysis",
        "tech assessment"
    ],
    
    validate,
    handler,
    
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Bitcoin tech grade"
                }
            },
            {
                name: "{{agent}}", 
                content: {
                    text: "I'll get the technology grade analysis for Bitcoin.",
                    action: "GET_TECHNOLOGY_GRADE_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "ETH technology analysis"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll analyze the technology metrics for Ethereum including development activity and security scores.",
                    action: "GET_TECHNOLOGY_GRADE_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Development activity for Solana"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll fetch the development and technology metrics for Solana.",
                    action: "GET_TECHNOLOGY_GRADE_TOKENMETRICS"
                }
            }
        ]
    ]
};

export default getTechnologyGradeAction;
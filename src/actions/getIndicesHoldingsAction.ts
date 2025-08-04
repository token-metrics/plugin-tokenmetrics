import type { Action, ActionResult } from "@elizaos/core";
import {
    type IAgentRuntime,
    type Memory,
    type State,
    type HandlerCallback,
    elizaLogger,
    createActionResult
} from "@elizaos/core";
import { z } from "zod";
import {
    validateAndGetApiKey,
    extractTokenMetricsRequest,
    callTokenMetricsAPI,
    formatCurrency,
    formatPercentage,
    generateRequestId
} from "./aiActionHelper";
import type { IndicesHoldingsResponse } from "../types";

// Zod schema for indices holdings request validation
const IndicesHoldingsRequestSchema = z.object({
    indexId: z.number().min(1).describe("The ID of the index to get holdings for"),
    analysisType: z.enum(["composition", "risk", "performance", "all"]).optional().describe("Type of analysis to focus on")
});

type IndicesHoldingsRequest = z.infer<typeof IndicesHoldingsRequestSchema>;

// Template for extracting indices holdings information (Updated to XML format)
const indicesHoldingsTemplate = `Extract indices holdings request information from the message.

IMPORTANT: The user MUST specify an index ID number. Look for phrases like:
- "index 1", "index ID 1", "crypto index 3"  
- "holdings of index 5", "index number 2"
- "DeFi index" (may refer to a specific numbered index)

Index holdings provide:
- Portfolio composition and token allocation
- Weight percentages and allocation values
- Risk concentration analysis
- Performance attribution
- Diversification insights
- Rebalancing information

Instructions:
Look for INDEX HOLDINGS requests, such as:
- Holdings composition ("Holdings of index 1", "Index composition")
- Portfolio allocation ("Token allocation", "Index weights")
- Risk analysis ("Holdings risk", "Concentration analysis")
- Performance attribution ("Holdings performance", "Asset contribution")

EXAMPLES (extract the exact index number):
- "Show me holdings of index 1" → indexId: 1
- "What tokens are in crypto index 5?" → indexId: 5
- "Get risk analysis for index 3 holdings" → indexId: 3
- "Index 2 composition and performance" → indexId: 2
- "DeFi index holdings" → indexId: (look for any number mentioned, or leave empty if no specific number)

CRITICAL: If no specific index number is mentioned, leave indexId empty so we can prompt the user to specify one.

Respond with an XML block containing only the extracted values:

<response>
<indexId>numeric ID of the index</indexId>
<analysisType>composition|risk|performance|all</analysisType>
</response>`;

/**
 * INDICES HOLDINGS ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/indices-holdings
 * 
 * This action returns the current holdings of a given index, along with their respective weight in %.
 * Essential for understanding index composition and allocation strategies.
 */
export const getIndicesHoldingsAction: Action = {
    name: "GET_INDICES_HOLDINGS_TOKENMETRICS",
    description: "Get the current holdings of a crypto index with weight percentages and allocation details from TokenMetrics",
    similes: [
        "get index holdings",
        "index composition",
        "index allocations", 
        "index weights",
        "index portfolio",
        "index assets",
        "index breakdown",
        "index constituents"
    ],
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Show me holdings of index 1"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll get the holdings composition for index 1.",
                    action: "GET_INDICES_HOLDINGS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "What tokens are in the DeFi index and their weights?"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "Let me show you the token composition and weight allocation for the DeFi index.",
                    action: "GET_INDICES_HOLDINGS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Get risk analysis for index 3 holdings"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll analyze the holdings composition and risk metrics for index 3.",
                    action: "GET_INDICES_HOLDINGS_TOKENMETRICS"
                }
            }
        ]
    ],
    
    async handler(
        runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<ActionResult> {
        try {
            const requestId = generateRequestId();
            console.log(`[${requestId}] Processing indices holdings request...`);
            
            // Extract structured request using AI
            const userMessage = message.content?.text || "";
            const enhancedTemplate = indicesHoldingsTemplate + `
            
USER MESSAGE: "${userMessage}"
Please analyze the CURRENT user message above and extract the relevant information.`;
            
            const holdingsRequest = await extractTokenMetricsRequest<IndicesHoldingsRequest>(
                runtime,
                message,
                state || await runtime.composeState(message),
                enhancedTemplate,
                IndicesHoldingsRequestSchema,
                requestId
            );
            
            console.log(`[${requestId}] Extracted request:`, holdingsRequest);
            
            // Apply defaults for optional fields
            const processedRequest = {
                indexId: holdingsRequest?.indexId,
                analysisType: holdingsRequest?.analysisType || "all"
            };
            
            // Validate that index ID is provided (required by API)
            if (!processedRequest.indexId) {
                const errorMessage = "⚠️ **Index ID Required**\n\n" +
                    "The indices holdings endpoint requires a specific index ID. Please specify which index you want to analyze.\n\n" +
                    "**Examples:**\n" +
                    "• \"Show me holdings of index 1\"\n" +
                    "• \"Get holdings for index 5\"\n" +
                    "• \"What tokens are in crypto index 3?\"\n\n" +
                    "**Common Index IDs:**\n" +
                    "• Index 1: Often the main crypto index\n" +
                    "• Index 3: May be DeFi-focused index\n" +
                    "• Index 5: Could be large-cap index\n\n" +
                    "Please try again with a specific index number.";
                
                console.log(`[${requestId}] ❌ No index ID provided in request`);
                
                if (callback) {
                    await callback({
                        text: errorMessage,
                        content: {
                            success: false,
                            error: "Missing required index ID",
                            request_id: requestId,
                            help: "Specify an index ID (e.g., 'holdings of index 1')"
                        }
                    });
                }
                
                return createActionResult({
                    success: false,
                    error: "Index ID is required for holdings lookup"
                });
            }
            
            // Build API parameters
            const apiParams: Record<string, any> = {
                id: processedRequest.indexId
            };
            
            // Make API call
            const response = await callTokenMetricsAPI(
                "/v2/indices-holdings",
                apiParams,
                runtime
            );
            
            console.log(`[${requestId}] API response received, processing data...`);
            
            // Process response data
            const holdings = Array.isArray(response) ? response : response.data || [];
            
            // Analyze the holdings data based on requested analysis type
            const holdingsAnalysis = analyzeHoldingsData(holdings, processedRequest.analysisType);
            
            const result = {
                success: true,
                message: `Successfully retrieved holdings for index ${processedRequest.indexId} with ${holdings.length} assets`,
                request_id: requestId,
                indices_holdings: holdings,
                analysis: holdingsAnalysis,
                metadata: {
                    endpoint: "indices-holdings",
                    index_id: processedRequest.indexId,
                    analysis_focus: processedRequest.analysisType,
                    total_holdings: holdings.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Indices Engine"
                },
                holdings_explanation: {
                    purpose: "Index holdings show the exact composition and allocation strategy of crypto indices",
                    key_metrics: [
                        "Weight Percentage - Allocation percentage of each token in the index",
                        "Allocation Value - Dollar value allocated to each token",
                        "Price - Current market price of each holding",
                        "Market Cap - Market capitalization of each token",
                        "24h Change - Recent price performance of holdings"
                    ],
                    allocation_insights: [
                        "Higher weight percentages indicate core positions in the index strategy",
                        "Diversification can be measured by the distribution of weights",
                        "Recent price changes affect the current allocation balance",
                        "Market cap correlation shows if the index follows market-cap weighting"
                    ],
                    usage_guidelines: [
                        "Review weight distribution for diversification assessment",
                        "Monitor large allocations for concentration risk",
                        "Compare holdings to your existing portfolio for overlap analysis",
                        "Track price changes to understand index performance drivers",
                        "Use allocation values to understand absolute exposure levels"
                    ]
                }
            };
            
            console.log(`[${requestId}] Holdings analysis completed successfully`);
            
            // Format response text for user
            const responseText = formatIndicesHoldingsResponse(result);
            
            console.log(`[${requestId}] Analysis completed successfully`);
            
            elizaLogger.success("✅ Successfully processed indices holdings request");

            if (callback) {
                await callback({
                    text: responseText,
                    content: {
                        success: true,
                        holdings_data: holdings,
                        analysis: holdingsAnalysis,
                        source: "TokenMetrics Indices Holdings API",
                        request_id: requestId,
                        metadata: {
                            endpoint: "indices-holdings",
                            data_source: "TokenMetrics API",
                            timestamp: new Date().toISOString(),
                            total_holdings: holdings.length
                        }
                    }
                });
            }
            
            return createActionResult({
                success: true,
                text: responseText,
                data: {
                    holdings_data: holdings,
                    analysis: holdingsAnalysis,
                    source: "TokenMetrics Indices Holdings API",
                    request_id: requestId
                }
            });
        } catch (error) {
            console.error("Error in getIndicesHoldings action:", error);
            
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            const reqId = generateRequestId(); // Generate new ID for error case
            
            if (callback) {
                await callback({
                    text: `❌ Error fetching indices holdings: ${errorMessage}`,
                    content: {
                        error: errorMessage,
                        error_type: error instanceof Error ? error.constructor.name : 'Unknown',
                        troubleshooting: true,
                        request_id: reqId
                    }
                });
            }
            
            return createActionResult({
                success: false,
                error: errorMessage
            });
        }
    },

    validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        elizaLogger.log("🔍 Validating getIndicesHoldingsAction (1.x)");
        
        try {
            validateAndGetApiKey(runtime);
            return true;
        } catch (error) {
            elizaLogger.error("❌ Validation failed:", error);
            return false;
        }
    }
};

/**
 * Analyze holdings data to provide strategic insights based on analysis type
 */
function analyzeHoldingsData(holdings: any[], analysisType: string = "all"): any {
    if (!holdings || holdings.length === 0) {
        return {
            summary: "No holdings data available for analysis",
            insights: [],
            recommendations: []
        };
    }

    // Calculate total weight and value using actual API field names
    const totalWeight = holdings.reduce((sum, holding) => sum + (holding.WEIGHT || 0), 0);
    const totalValue = holdings.reduce((sum, holding) => {
        const weight = holding.WEIGHT || 0;
        const price = holding.PRICE || 0;
        const marketCap = holding.MARKET_CAP || 0;
        // Estimate allocation value based on weight and market cap
        return sum + (weight * marketCap);
    }, 0);

    // Sort holdings by weight for analysis
    const topHoldings = holdings
        .filter(holding => holding.WEIGHT !== undefined)
        .sort((a, b) => (b.WEIGHT || 0) - (a.WEIGHT || 0))
        .map(holding => ({
            ...holding,
            WEIGHT_PERCENTAGE: (holding.WEIGHT || 0) * 100, // Convert to percentage for display
            ALLOCATION_VALUE: (holding.WEIGHT || 0) * (holding.MARKET_CAP || 0)
        }));

    // Calculate concentration metrics
    const top3Weight = topHoldings.slice(0, 3).reduce((sum, holding) => sum + (holding.WEIGHT || 0), 0) * 100;
    const top5Weight = topHoldings.slice(0, 5).reduce((sum, holding) => sum + (holding.WEIGHT || 0), 0) * 100;
    
    // Analyze ROI performance (using CURRENT_ROI field)
    const holdingsWithROI = holdings.filter(holding => holding.CURRENT_ROI !== undefined);
    const avgROI = holdingsWithROI.length > 0 
        ? holdingsWithROI.reduce((sum, holding) => sum + (holding.CURRENT_ROI || 0), 0) / holdingsWithROI.length
        : 0;

    // Categorize holdings by market cap
    const largeCapHoldings = holdings.filter(holding => (holding.MARKET_CAP || 0) > 10e9); // >$10B
    const midCapHoldings = holdings.filter(holding => (holding.MARKET_CAP || 0) > 1e9 && (holding.MARKET_CAP || 0) <= 10e9); // $1B-$10B
    const smallCapHoldings = holdings.filter(holding => (holding.MARKET_CAP || 0) <= 1e9); // <$1B

    // Base insights
    const insights = [
        `📊 Total Holdings: ${holdings.length} tokens`,
        `⚖️ Total Weight: ${formatPercentage(totalWeight)}`,
        `💰 Total Allocation Value: ${formatCurrency(totalValue)}`,
        `🏆 Largest Holding: ${topHoldings[0]?.TOKEN_NAME} (${formatPercentage((topHoldings[0]?.WEIGHT || 0) * 100)})`,
        `📈 Top 3 Concentration: ${formatPercentage(top3Weight)}`,
        `📊 Top 5 Concentration: ${formatPercentage(top5Weight)}`,
        `📈 Average ROI: ${formatPercentage(avgROI * 100)}`
    ];

    // Base recommendations
    const recommendations = [
        top3Weight > 60 ? 
            "⚠️ High Concentration: Top 3 holdings represent significant portion - consider concentration risk" :
            "✅ Balanced Allocation: Good diversification across top holdings",
        holdings.length > 20 ? 
            "✅ Well Diversified: Large number of holdings provides good diversification" :
            holdings.length < 10 ? 
                "⚠️ Limited Diversification: Consider if concentration aligns with your risk tolerance" :
                "📊 Moderate Diversification: Reasonable number of holdings for focused strategy",
        largeCapHoldings.length > holdings.length * 0.7 ? 
            "🏛️ Large Cap Focus: Index heavily weighted toward established cryptocurrencies" :
            smallCapHoldings.length > holdings.length * 0.5 ? 
                "🚀 Small Cap Exposure: Higher risk/reward profile with smaller market cap tokens" :
                "⚖️ Balanced Market Cap: Mix of large and smaller market cap exposures"
    ];

    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "composition":
            focusedAnalysis = {
                composition_focus: {
                    weight_distribution: {
                        top_10_percent: holdings.filter(h => (h.WEIGHT || 0) * 100 > 10).length,
                        mid_range: holdings.filter(h => (h.WEIGHT || 0) * 100 >= 1 && (h.WEIGHT || 0) * 100 <= 10).length,
                        small_positions: holdings.filter(h => (h.WEIGHT || 0) * 100 < 1).length
                    },
                    sector_analysis: analyzeSectorDistribution(holdings),
                    composition_insights: [
                        `🎯 ${holdings.filter(h => (h.WEIGHT || 0) * 100 > 10).length} major positions (>10% weight)`,
                        `📊 ${holdings.filter(h => (h.WEIGHT || 0) * 100 >= 1 && (h.WEIGHT || 0) * 100 <= 10).length} medium positions (1-10% weight)`,
                        `🔍 ${holdings.filter(h => (h.WEIGHT || 0) * 100 < 1).length} small positions (<1% weight)`
                    ]
                }
            };
            break;
            
        case "risk":
            focusedAnalysis = {
                risk_focus: {
                    concentration_risk: {
                        herfindahl_index: calculateHerfindahlIndex(holdings),
                        concentration_level: top3Weight > 60 ? "High" : top3Weight > 40 ? "Medium" : "Low"
                    },
                    volatility_analysis: {
                        high_roi_holdings: holdings.filter(h => Math.abs(h.CURRENT_ROI || 0) > 0.5).length,
                        stable_holdings: holdings.filter(h => Math.abs(h.CURRENT_ROI || 0) < 0.1).length
                    },
                    risk_insights: [
                        `⚠️ Concentration Risk: ${top3Weight > 60 ? "High" : top3Weight > 40 ? "Medium" : "Low"} (top 3: ${formatPercentage(top3Weight)})`,
                        `📊 High ROI Holdings: ${holdings.filter(h => Math.abs(h.CURRENT_ROI || 0) > 0.5).length} holdings with significant ROI`,
                        `🛡️ Stable Holdings: ${holdings.filter(h => Math.abs(h.CURRENT_ROI || 0) < 0.1).length} holdings with stable performance`
                    ]
                }
            };
            break;
            
        case "performance":
            const topPerformers = holdings
                .filter(h => h.CURRENT_ROI !== undefined)
                .sort((a, b) => (b.CURRENT_ROI || 0) - (a.CURRENT_ROI || 0))
                .slice(0, 5);
            const worstPerformers = holdings
                .filter(h => h.CURRENT_ROI !== undefined)
                .sort((a, b) => (a.CURRENT_ROI || 0) - (b.CURRENT_ROI || 0))
                .slice(0, 5);
                
            focusedAnalysis = {
                performance_focus: {
                    top_performers: topPerformers,
                    worst_performers: worstPerformers,
                    performance_insights: [
                        `🚀 Best performer: ${topPerformers[0]?.TOKEN_NAME} (${formatPercentage((topPerformers[0]?.CURRENT_ROI || 0) * 100)})`,
                        `📉 Worst performer: ${worstPerformers[0]?.TOKEN_NAME} (${formatPercentage((worstPerformers[0]?.CURRENT_ROI || 0) * 100)})`,
                        `📊 ${holdings.filter(h => (h.CURRENT_ROI || 0) > 0).length}/${holdings.length} holdings showing positive ROI`
                    ]
                }
            };
            break;
    }

    return {
        summary: `Index contains ${holdings.length} holdings with ${formatPercentage(top3Weight)} concentration in top 3 positions`,
        analysis_type: analysisType,
        portfolio_metrics: {
            total_holdings: holdings.length,
            total_weight: totalWeight,
            total_value: totalValue,
            top_3_concentration: top3Weight,
            top_5_concentration: top5Weight,
            avg_roi: avgROI
        },
        market_cap_distribution: {
            large_cap: largeCapHoldings.length,
            mid_cap: midCapHoldings.length,
            small_cap: smallCapHoldings.length
        },
        top_holdings: topHoldings.map(holding => ({
            token_name: holding.TOKEN_NAME,
            symbol: holding.TOKEN_SYMBOL,
            weight_percentage: (holding.WEIGHT || 0) * 100,
            allocation_value: (holding.WEIGHT || 0) * (holding.MARKET_CAP || 0),
            price: holding.PRICE,
            current_roi: holding.CURRENT_ROI
        })),
        insights,
        recommendations,
        ...focusedAnalysis,
        risk_considerations: [
            "📊 Monitor concentration risk in top holdings",
            "🔄 Track rebalancing frequency and methodology",
            "💰 Consider correlation with your existing portfolio",
            "📈 Evaluate performance attribution by holding",
            "⚠️ Assess liquidity risk in smaller holdings",
            "🎯 Review alignment with investment objectives"
        ]
    };
}

/**
 * Analyze sector distribution of holdings
 */
function analyzeSectorDistribution(holdings: any[]): any {
    // This would ideally use sector data from the API
    // For now, we'll provide a basic analysis structure
    return {
        sectors_identified: "Analysis requires sector classification data",
        diversification_score: holdings.length > 15 ? "High" : holdings.length > 8 ? "Medium" : "Low"
    };
}

/**
 * Calculate Herfindahl Index for concentration measurement
 */
function calculateHerfindahlIndex(holdings: any[]): number {
    const totalWeight = holdings.reduce((sum, holding) => sum + (holding.WEIGHT || 0), 0);
    
    if (totalWeight === 0) return 0;
    
    const herfindahl = holdings.reduce((sum, holding) => {
        const normalizedWeight = (holding.WEIGHT || 0) / totalWeight;
        return sum + (normalizedWeight * normalizedWeight);
    }, 0);
    
    return Math.round(herfindahl * 10000); // Scale to 0-10000 range
}

/**
 * Format indices holdings response for user display
 */
function formatIndicesHoldingsResponse(result: any): string {
    const { indices_holdings, analysis, metadata } = result;
    
    let response = `📊 **Index Holdings Analysis**\n\n`;
    
    if (indices_holdings && indices_holdings.length > 0) {
        response += `🎯 **Index ${metadata.index_id} Holdings (${indices_holdings.length} assets)**\n\n`;
        
        // Show top holdings using actual API field names
        const topHoldings = indices_holdings
            .filter((holding: any) => holding.WEIGHT !== undefined)
            .sort((a: any, b: any) => (b.WEIGHT || 0) - (a.WEIGHT || 0))
            .slice(0, 10);
            
        if (topHoldings.length > 0) {
            response += `🏆 **Top Holdings:**\n`;
            topHoldings.forEach((holding: any, i: number) => {
                const name = holding.TOKEN_NAME || holding.TOKEN_SYMBOL || `Token ${i + 1}`;
                const symbol = holding.TOKEN_SYMBOL || '';
                const weight = holding.WEIGHT ? formatPercentage(holding.WEIGHT * 100) : 'N/A';
                const price = holding.PRICE ? formatCurrency(holding.PRICE) : 'N/A';
                const currentROI = holding.CURRENT_ROI ? formatPercentage(holding.CURRENT_ROI * 100) : 'N/A';
                
                response += `${i + 1}. **${name}** ${symbol ? `(${symbol})` : ''}\n`;
                response += `   • Weight: ${weight}\n`;
                response += `   • Price: ${price}\n`;
                response += `   • Current ROI: ${currentROI}\n`;
                response += `\n`;
            });
        }
        
        // Add analysis insights
        if (analysis && analysis.insights) {
            response += `💡 **Key Insights:**\n`;
            analysis.insights.slice(0, 5).forEach((insight: string) => {
                response += `• ${insight}\n`;
            });
            response += `\n`;
        }
        
        // Add portfolio metrics
        if (analysis && analysis.portfolio_metrics) {
            const metrics = analysis.portfolio_metrics;
            response += `📈 **Portfolio Metrics:**\n`;
            response += `• Total Holdings: ${metrics.total_holdings || 0}\n`;
            if (metrics.top_3_concentration !== undefined) {
                response += `• Top 3 Concentration: ${formatPercentage(metrics.top_3_concentration)}\n`;
            }
            if (metrics.top_5_concentration !== undefined) {
                response += `• Top 5 Concentration: ${formatPercentage(metrics.top_5_concentration)}\n`;
            }
            if (metrics.avg_roi !== undefined) {
                response += `• Average ROI: ${formatPercentage(metrics.avg_roi * 100)}\n`;
            }
            response += `\n`;
        }
        
        // Add recommendations
        if (analysis && analysis.recommendations) {
            response += `🎯 **Recommendations:**\n`;
            analysis.recommendations.slice(0, 3).forEach((rec: string) => {
                response += `• ${rec}\n`;
            });
        }
    } else {
        response += `❌ No holdings data found for index ${metadata.index_id}.\n\n`;
        response += `This could be due to:\n`;
        response += `• Invalid index ID\n`;
        response += `• Index has no current holdings\n`;
        response += `• API connectivity issues\n`;
    }
    
    response += `\n📊 **Data Source**: TokenMetrics Indices Engine\n`;
    response += `⏰ **Updated**: ${new Date().toLocaleString()}\n`;
    
    return response;
} 
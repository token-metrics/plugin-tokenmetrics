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
import type { CorrelationResponse } from "../types";

// Zod schema for correlation request validation
const CorrelationRequestSchema = z.object({
    token_id: z.number().min(1).optional().describe("The ID of the token to analyze correlation for"),
    symbol: z.string().optional().describe("The symbol of the token to analyze correlation for"),
    category: z.string().optional().describe("Filter by token category (e.g., defi, layer1, gaming)"),
    exchange: z.string().optional().describe("Filter by exchange"),
    limit: z.number().min(1).max(100).optional().describe("Number of correlation results to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["diversification", "hedging", "risk_management", "all"]).optional().describe("Type of correlation analysis to focus on")
});

type CorrelationRequest = z.infer<typeof CorrelationRequestSchema>;

// Template for extracting correlation information (Updated to XML format)
const correlationTemplate = `Extract correlation analysis request information from the message.

Correlation analysis provides:
- Asset correlation coefficients
- Portfolio diversification insights
- Risk relationship analysis
- Market movement correlations
- Cross-asset dependency analysis
- Portfolio optimization data

Instructions:
Look for CORRELATION requests, such as:
- Correlation analysis ("Correlation between Bitcoin and Ethereum", "Asset correlations")
- Diversification queries ("How correlated are these tokens?", "Portfolio diversification")
- Risk relationship ("Market correlation analysis", "Cross-asset relationships")
- Portfolio optimization ("Correlation for portfolio", "Diversification analysis")

EXAMPLES:
- "Show correlation between Bitcoin and Ethereum"
- "Get correlation analysis for DeFi tokens"
- "Portfolio correlation analysis"
- "How correlated is SOL with the market?"
- "Diversification analysis for my portfolio"

Respond with an XML block containing only the extracted values:

<response>
<primary_asset>main token for correlation analysis</primary_asset>
<comparison_assets>comma-separated list of tokens to compare</comparison_assets>
<analysis_type>pairwise, portfolio, market, or general</analysis_type>
<timeframe>daily, weekly, monthly, or general</timeframe>
<correlation_period>30d, 90d, 1y, or default</correlation_period>
<focus_area>diversification, risk, optimization, or general</focus_area>
</response>`;

/**
 * CORRELATION ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/correlation
 * 
 * This action gets the Top 10 and Bottom 10 correlation of tokens with the top 100 market cap tokens.
 * Essential for portfolio diversification, risk management, and understanding market relationships.
 */
export const getCorrelationAction: Action = {
    name: "GET_CORRELATION_TOKENMETRICS",
    description: "Get Top 10 and Bottom 10 correlation of tokens with the top 100 market cap tokens from TokenMetrics for diversification and risk analysis",
    similes: [
        "get correlation",
        "token correlation",
        "correlation analysis", 
        "market correlation",
        "diversification analysis",
        "correlation matrix",
        "relationship analysis"
    ],
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Get correlation analysis for Bitcoin"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll analyze price correlations for Bitcoin with other cryptocurrencies.",
                    action: "GET_CORRELATION_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Show me DeFi tokens for portfolio diversification"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll find DeFi tokens with low correlations for portfolio diversification.",
                    action: "GET_CORRELATION_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Find hedging opportunities for my Ethereum position"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll analyze correlations to find assets that could hedge your Ethereum exposure.",
                    action: "GET_CORRELATION_TOKENMETRICS"
                }
            }
        ]
    ],
    
    validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        elizaLogger.log("🔍 Validating getCorrelationAction (1.x)");
        
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
        
        elizaLogger.log("🚀 Starting TokenMetrics correlation handler (1.x)");
        elizaLogger.log(`📝 Processing user message: "${message.content?.text || "No text content"}"`);
        elizaLogger.log(`🆔 Request ID: ${requestId}`);

        try {
            // STEP 1: Validate API key early
            validateAndGetApiKey(runtime);

            // Ensure we have a proper state
            if (!state) {
                state = await runtime.composeState(message);
            }

            // STEP 2: Build API parameters
            const apiParams: any = {
                limit: 20,
                page: 1
            };
            
            // STEP 3: Fetch correlation data
            elizaLogger.log(`📡 Fetching correlation data`);
            const correlationData = await callTokenMetricsAPI('/v2/correlation', apiParams, runtime);
            
            if (!correlationData) {
                elizaLogger.log("❌ Failed to fetch correlation data");
                
                if (callback) {
                    await callback({
                        text: `❌ Unable to fetch correlation data at the moment.

This could be due to:
• TokenMetrics API connectivity issues
• Temporary service interruption  
• Rate limiting

Please try again in a few moments.`,
                        content: { 
                            error: "API fetch failed",
                            request_id: requestId
                        }
                    });
            }
                return createActionResult({
                    success: false,
                    text: "❌ Unable to fetch correlation data at the moment.",
                    data: {
                        error: "API fetch failed",
                        request_id: requestId
                    }
                });
            }

            // Handle the response data
            const correlations = Array.isArray(correlationData) ? correlationData : (correlationData.data || []);
            
            elizaLogger.log(`🔍 Received ${correlations.length} correlation data points`);

            // STEP 4: Format and present the results
            const responseText = formatCorrelationResponse(correlations);
            const analysis = analyzeCorrelationData(correlations, "comprehensive");

            elizaLogger.success("✅ Successfully processed correlation request");

            if (callback) {
                await callback({
                    text: responseText,
                    content: {
                success: true,
                        correlation_data: correlations,
                        analysis: analysis,
                        source: "TokenMetrics Correlation API",
                request_id: requestId,
                metadata: {
                    endpoint: "correlation",
                            data_source: "TokenMetrics API",
                            timestamp: new Date().toISOString(),
                            total_correlations: correlations.length
                        }
                    }
                });
            }

            return createActionResult({
                    success: true,
                text: responseText,
                data: {
                    success: true,
                    correlation_data: correlations,
                    analysis: analysis,
                    source: "TokenMetrics Correlation API",
                    request_id: requestId,
                    metadata: {
                        endpoint: "correlation",
                        data_source: "TokenMetrics API",
                        timestamp: new Date().toISOString(),
                        total_correlations: correlations.length
                    }
                }
            });

        } catch (error) {
            elizaLogger.error("❌ Error in correlation handler:", error);
            elizaLogger.error(`🆔 Request ${requestId}: ERROR - ${error}`);
            
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            
            if (callback) {
                await callback({
                    text: `❌ I encountered an error while fetching correlation data: ${errorMessage}`,
                    content: { 
                        error: errorMessage,
                        error_type: error instanceof Error ? error.constructor.name : 'Unknown',
                        troubleshooting: true,
                        request_id: requestId
                    }
                });
            }
            
            return createActionResult({
                success: false,
                error: errorMessage
            });
        }
    }
};

/**
 * Format correlation response for user
 */
function formatCorrelationResponse(correlations: any[]): string {
    if (!correlations || correlations.length === 0) {
        return "❌ No correlation data available.";
    }

    let response = `📊 **Token Correlation Analysis**\n\n`;
    response += `🔗 **Total Correlations**: ${correlations.length}\n\n`;

    if (correlations.length > 0) {
        const topCorrelations = correlations.slice(0, 10);
        response += `📈 **Top Correlations**:\n`;
        
        topCorrelations.forEach((corr, index) => {
            const token1 = corr.TOKEN1_SYMBOL || corr.SYMBOL1 || 'TOKEN1';
            const token2 = corr.TOKEN2_SYMBOL || corr.SYMBOL2 || 'TOKEN2';
            const correlation = corr.CORRELATION || corr.CORR_VALUE || 0;
            
            response += `${index + 1}. **${token1}** ↔ **${token2}**: ${correlation.toFixed(3)}\n`;
        });
    }

    response += `\n📊 **Data Source**: TokenMetrics Correlation API\n`;
    response += `⏰ **Updated**: ${new Date().toLocaleString()}\n`;
    
    return response;
    }

/**
 * Comprehensive analysis of correlation data for portfolio optimization and risk management
 */
function analyzeCorrelationData(correlationData: any[], analysisType: string = "all"): any {
    if (!correlationData || correlationData.length === 0) {
        return {
            summary: "No correlation data available for analysis",
            diversification_opportunities: "Cannot assess",
            insights: []
        };
    }
    
    // Analyze correlation patterns and relationships
    const correlationDistribution = analyzeCorrelationDistribution(correlationData);
    const diversificationAnalysis = analyzeDiversificationOpportunities(correlationData);
    const riskAnalysis = analyzeCorrelationRisks(correlationData);
    const portfolioOptimization = generatePortfolioOptimization(correlationData);
    const marketRegimeAnalysis = analyzeMarketRegimes(correlationData);
    
    // Generate strategic insights
    const insights = generateCorrelationInsights(correlationDistribution, diversificationAnalysis, riskAnalysis);
    
    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "diversification":
            focusedAnalysis = {
                diversification_focus: {
                    best_diversifiers: diversificationAnalysis.best_diversifiers.slice(0, 5),
                    diversification_score: diversificationAnalysis.diversification_ratio,
                    portfolio_recommendations: generateDiversificationRecommendations(correlationData),
                    diversification_insights: [
                        `🎯 ${diversificationAnalysis.low_correlation_assets} assets with low correlation found`,
                        `📊 Diversification quality: ${diversificationAnalysis.diversification_quality}`,
                        `⚖️ Portfolio balance: ${diversificationAnalysis.diversification_ratio} of assets suitable for diversification`,
                        `🔄 Rebalancing frequency: ${getDiversificationRebalancingFrequency(correlationDistribution.average_correlation)}`
                    ]
                }
            };
            break;
            
        case "hedging":
            focusedAnalysis = {
                hedging_focus: {
                    hedging_opportunities: identifyHedgingOpportunities(correlationData),
                    negative_correlations: correlationData.filter(item => (item.CORRELATION || item.CORRELATION_VALUE) < -0.3),
                    hedging_strategies: generateHedgingStrategies(correlationData),
                    hedging_insights: [
                        `🛡️ ${correlationData.filter(item => (item.CORRELATION || item.CORRELATION_VALUE) < -0.3).length} potential hedging assets identified`,
                        `📉 Strongest hedge: ${getStrongestHedge(correlationData)}`,
                        `⚖️ Hedge effectiveness: ${assessOverallHedgingEffectiveness(correlationData)}`,
                        `🔄 Dynamic hedging recommended: ${shouldUseDynamicHedging(correlationDistribution.average_correlation)}`
                    ]
                }
            };
            break;
            
        case "risk_management":
            focusedAnalysis = {
                risk_management_focus: {
                    concentration_risks: riskAnalysis,
                    risk_factors: identifyCorrelationRiskFactors(
                        correlationData.filter(item => (item.CORRELATION || item.CORRELATION_VALUE) > 0.7),
                        correlationData.filter(item => (item.CORRELATION || item.CORRELATION_VALUE) > 0.9)
                    ),
                    stress_test_implications: generateStressTestImplications(
                        parseFloat(correlationDistribution.average_correlation),
                        correlationData.filter(item => (item.CORRELATION || item.CORRELATION_VALUE) > 0.7).length / correlationData.length
                    ),
                    risk_insights: [
                        `⚠️ Concentration risk level: ${riskAnalysis.concentration_risk}`,
                        `📊 High correlation assets: ${correlationData.filter(item => (item.CORRELATION || item.CORRELATION_VALUE) > 0.7).length}`,
                        `🎯 Portfolio efficiency score: ${calculatePortfolioEfficiencyScore(correlationData)}`,
                        `📈 Volatility multiplier: ${calculateVolatilityMultiplier(parseFloat(correlationDistribution.average_correlation))}`
                    ]
                }
            };
            break;
    }
    
    return {
        summary: `Correlation analysis of ${correlationData.length} relationships shows ${diversificationAnalysis.diversification_quality} diversification opportunities with ${riskAnalysis.concentration_risk} concentration risk`,
        analysis_type: analysisType,
        correlation_distribution: correlationDistribution,
        diversification_analysis: diversificationAnalysis,
        risk_analysis: riskAnalysis,
        portfolio_optimization: portfolioOptimization,
        market_regime_analysis: marketRegimeAnalysis,
        insights: insights,
        strategic_recommendations: generateStrategicRecommendations(diversificationAnalysis, riskAnalysis, portfolioOptimization),
        hedging_opportunities: identifyHedgingOpportunities(correlationData),
        ...focusedAnalysis,
        data_quality: {
            source: "TokenMetrics Correlation Engine",
            relationship_count: correlationData.length,
            coverage_scope: assessCoverageScope(correlationData),
            data_reliability: assessDataReliability(correlationData)
        },
        portfolio_construction_guidelines: [
            "🎯 Target correlation below 0.3 for effective diversification",
            "⚖️ Balance high-return assets with low-correlation alternatives",
            "🔄 Rebalance when correlations shift significantly",
            "📊 Monitor correlation changes during market stress",
            "🛡️ Use negative correlations for hedging strategies",
            "📈 Consider correlation stability over time periods"
        ]
    };
}

function analyzeCorrelationDistribution(correlationData: any[]): any {
    const correlations = correlationData.map(item => item.CORRELATION || item.CORRELATION_VALUE).filter(corr => corr !== null && corr !== undefined);
    
    if (correlations.length === 0) {
        return { distribution: "No correlation values available" };
    }
    
    // Categorize correlations
    const veryHighPositive = correlations.filter(c => c >= 0.8).length;
    const highPositive = correlations.filter(c => c >= 0.5 && c < 0.8).length;
    const moderatePositive = correlations.filter(c => c >= 0.2 && c < 0.5).length;
    const weak = correlations.filter(c => c >= -0.2 && c < 0.2).length;
    const moderateNegative = correlations.filter(c => c >= -0.5 && c < -0.2).length;
    const highNegative = correlations.filter(c => c >= -0.8 && c < -0.5).length;
    const veryHighNegative = correlations.filter(c => c < -0.8).length;
    
    // Calculate statistics
    const avgCorrelation = correlations.reduce((sum, corr) => sum + corr, 0) / correlations.length;
    const maxCorrelation = Math.max(...correlations);
    const minCorrelation = Math.min(...correlations);
    
    return {
        total_relationships: correlations.length,
        average_correlation: avgCorrelation.toFixed(3),
        max_correlation: maxCorrelation.toFixed(3),
        min_correlation: minCorrelation.toFixed(3),
        correlation_range: (maxCorrelation - minCorrelation).toFixed(3),
        distribution: {
            very_high_positive: `${veryHighPositive} (${((veryHighPositive / correlations.length) * 100).toFixed(1)}%)`,
            high_positive: `${highPositive} (${((highPositive / correlations.length) * 100).toFixed(1)}%)`,
            moderate_positive: `${moderatePositive} (${((moderatePositive / correlations.length) * 100).toFixed(1)}%)`,
            weak: `${weak} (${((weak / correlations.length) * 100).toFixed(1)}%)`,
            moderate_negative: `${moderateNegative} (${((moderateNegative / correlations.length) * 100).toFixed(1)}%)`,
            high_negative: `${highNegative} (${((highNegative / correlations.length) * 100).toFixed(1)}%)`,
            very_high_negative: `${veryHighNegative} (${((veryHighNegative / correlations.length) * 100).toFixed(1)}%)`
        },
        market_structure: interpretMarketStructure(avgCorrelation, veryHighPositive, correlations.length)
    };
}

function analyzeDiversificationOpportunities(correlationData: any[]): any {
    // Identify best diversification candidates (low/negative correlations)
    const diversificationCandidates = correlationData
        .filter(item => (item.CORRELATION || item.CORRELATION_VALUE) < 0.3)
        .sort((a, b) => (a.CORRELATION || a.CORRELATION_VALUE) - (b.CORRELATION || b.CORRELATION_VALUE))
        .slice(0, 10);
    
    // Identify poor diversification options (high correlations)
    const highCorrelationAssets = correlationData
        .filter(item => (item.CORRELATION || item.CORRELATION_VALUE) > 0.7)
        .sort((a, b) => (b.CORRELATION || b.CORRELATION_VALUE) - (a.CORRELATION || a.CORRELATION_VALUE))
        .slice(0, 10);
    
    // Assess overall diversification quality
    const lowCorrelationCount = correlationData.filter(item => Math.abs(item.CORRELATION || item.CORRELATION_VALUE || 0) < 0.3).length;
    const totalCount = correlationData.length;
    const diversificationRatio = totalCount > 0 ? (lowCorrelationCount / totalCount) : 0;
    
    let diversificationQuality;
    if (diversificationRatio > 0.6) diversificationQuality = "Excellent";
    else if (diversificationRatio > 0.4) diversificationQuality = "Good";
    else if (diversificationRatio > 0.25) diversificationQuality = "Moderate";
    else diversificationQuality = "Limited";
    
    return {
        diversification_quality: diversificationQuality,
        diversification_ratio: `${(diversificationRatio * 100).toFixed(1)}%`,
        low_correlation_assets: lowCorrelationCount,
        best_diversifiers: diversificationCandidates.map(item => ({
            token: `${item.TOKEN_NAME || item.NAME || 'Unknown'} (${item.SYMBOL || 'N/A'})`,
            correlation: (item.CORRELATION || item.CORRELATION_VALUE || 0).toFixed(3),
            diversification_benefit: interpretDiversificationBenefit(item.CORRELATION || item.CORRELATION_VALUE || 0)
        })),
        avoid_for_diversification: highCorrelationAssets.map(item => ({
            token: `${item.TOKEN_NAME || item.NAME || 'Unknown'} (${item.SYMBOL || 'N/A'})`,
            correlation: (item.CORRELATION || item.CORRELATION_VALUE || 0).toFixed(3),
            risk_level: interpretRiskLevel(item.CORRELATION || item.CORRELATION_VALUE || 0)
        })),
        portfolio_construction_guidance: generatePortfolioConstructionGuidance(diversificationRatio, diversificationCandidates.length)
    };
}

function analyzeCorrelationRisks(correlationData: any[]): any {
    const highCorrelations = correlationData.filter(item => (item.CORRELATION || item.CORRELATION_VALUE) > 0.7);
    const veryHighCorrelations = correlationData.filter(item => (item.CORRELATION || item.CORRELATION_VALUE) > 0.9);
    
    // Assess concentration risk
    const highCorrelationRatio = correlationData.length > 0 ? (highCorrelations.length / correlationData.length) : 0;
    
    let concentrationRisk;
    if (highCorrelationRatio > 0.5) concentrationRisk = "Very High";
    else if (highCorrelationRatio > 0.3) concentrationRisk = "High";
    else if (highCorrelationRatio > 0.15) concentrationRisk = "Moderate";
    else concentrationRisk = "Low";
    
    // Identify sector concentration
    const sectorConcentration = analyzeSectorConcentration(correlationData);
    
    // Calculate portfolio risk metrics
    const avgCorrelation = correlationData.reduce((sum, item) => sum + (item.CORRELATION || item.CORRELATION_VALUE || 0), 0) / correlationData.length;
    const portfolioVolatilityMultiplier = calculateVolatilityMultiplier(avgCorrelation);
    
    return {
        concentration_risk: concentrationRisk,
        high_correlation_ratio: `${(highCorrelationRatio * 100).toFixed(1)}%`,
        very_high_correlations: veryHighCorrelations.length,
        sector_concentration: sectorConcentration,
        average_correlation: avgCorrelation.toFixed(3),
        portfolio_volatility_impact: portfolioVolatilityMultiplier,
        risk_factors: identifyCorrelationRiskFactors(highCorrelations, veryHighCorrelations),
        stress_test_implications: generateStressTestImplications(avgCorrelation, highCorrelationRatio)
    };
}

function generatePortfolioOptimization(correlationData: any[]): any {
    // Identify optimal portfolio combinations
    const lowCorrelationPairs = correlationData
        .filter(item => Math.abs(item.CORRELATION || item.CORRELATION_VALUE || 0) < 0.2)
        .sort((a, b) => Math.abs(a.CORRELATION || a.CORRELATION_VALUE || 0) - Math.abs(b.CORRELATION || b.CORRELATION_VALUE || 0));
    
    const negativeCorrelationAssets = correlationData
        .filter(item => (item.CORRELATION || item.CORRELATION_VALUE || 0) < -0.1)
        .sort((a, b) => (a.CORRELATION || a.CORRELATION_VALUE || 0) - (b.CORRELATION || b.CORRELATION_VALUE || 0));
    
    // Generate optimization recommendations
    const optimizationStrategies = [];
    
    if (lowCorrelationPairs.length > 5) {
        optimizationStrategies.push("Equal-weight diversification strategy suitable due to multiple low-correlation options");
    }
    
    if (negativeCorrelationAssets.length > 2) {
        optimizationStrategies.push("Natural hedging opportunities available with negatively correlated assets");
    }
    
    if (optimizationStrategies.length === 0) {
        optimizationStrategies.push("Limited diversification options - consider looking beyond current asset universe");
    }
    
    return {
        optimization_opportunities: lowCorrelationPairs.length,
        natural_hedges: negativeCorrelationAssets.length,
        recommended_strategies: optimizationStrategies,
        core_diversifiers: lowCorrelationPairs.slice(0, 5).map(item => ({
            asset: `${item.TOKEN_NAME || item.NAME || 'Unknown'} (${item.SYMBOL || 'N/A'})`,
            correlation: (item.CORRELATION || item.CORRELATION_VALUE || 0).toFixed(3),
            allocation_suggestion: suggestAllocation(item.CORRELATION || item.CORRELATION_VALUE || 0)
        })),
        hedging_assets: negativeCorrelationAssets.slice(0, 3).map(item => ({
            asset: `${item.TOKEN_NAME || item.NAME || 'Unknown'} (${item.SYMBOL || 'N/A'})`,
            correlation: (item.CORRELATION || item.CORRELATION_VALUE || 0).toFixed(3),
            hedging_effectiveness: assessHedgingEffectiveness(item.CORRELATION || item.CORRELATION_VALUE || 0)
        })),
        portfolio_efficiency_score: calculatePortfolioEfficiencyScore(correlationData)
    };
}

function analyzeMarketRegimes(correlationData: any[]): any {
    // Analyze correlation patterns to understand market regimes
    const avgCorrelation = correlationData.reduce((sum, item) => sum + Math.abs(item.CORRELATION || item.CORRELATION_VALUE || 0), 0) / correlationData.length;
    const highCorrelationCount = correlationData.filter(item => Math.abs(item.CORRELATION || item.CORRELATION_VALUE || 0) > 0.7).length;
    const lowCorrelationCount = correlationData.filter(item => Math.abs(item.CORRELATION || item.CORRELATION_VALUE || 0) < 0.3).length;
    
    // Determine market regime
    let marketRegime;
    let regimeCharacteristics = [];
    
    if (avgCorrelation > 0.6 && highCorrelationCount > correlationData.length * 0.5) {
        marketRegime = "High Correlation Regime";
        regimeCharacteristics = [
            "Assets move together during market stress",
            "Diversification benefits reduced",
            "Risk-off sentiment dominates",
            "Systematic risk elevated"
        ];
    } else if (avgCorrelation < 0.3 && lowCorrelationCount > correlationData.length * 0.6) {
        marketRegime = "Low Correlation Regime";
        regimeCharacteristics = [
            "Assets behave independently",
            "Strong diversification benefits",
            "Idiosyncratic factors dominate", 
            "Stock-picking environment"
        ];
    } else {
        marketRegime = "Mixed Correlation Regime";
        regimeCharacteristics = [
            "Moderate correlation levels",
            "Balanced systematic and idiosyncratic risk",
            "Normal market conditions",
            "Standard diversification benefits"
        ];
    }
    
    return {
        current_regime: marketRegime,
        regime_characteristics: regimeCharacteristics,
        average_correlation: avgCorrelation.toFixed(3),
        regime_stability: assessRegimeStability(correlationData),
        implications_for_strategy: generateRegimeImplications(marketRegime),
        monitoring_indicators: [
            "Track correlation changes during market stress",
            "Monitor dispersion of asset returns",
            "Watch for correlation breakdowns",
            "Assess sector rotation patterns"
        ]
    };
}

function generateCorrelationInsights(distribution: any, diversification: any, risks: any): string[] {
    const insights = [];
    
    // Distribution insights
    const avgCorr = parseFloat(distribution.average_correlation);
    if (avgCorr > 0.5) {
        insights.push("High average correlation suggests limited diversification benefits and elevated systematic risk");
    } else if (avgCorr < 0.2) {
        insights.push("Low average correlation provides excellent diversification opportunities for risk reduction");
    } else {
        insights.push("Moderate correlation levels offer balanced diversification benefits with manageable systematic risk");
    }
    
    // Diversification insights
    if (diversification.diversification_quality === "Excellent") {
        insights.push(`${diversification.diversification_ratio} of assets provide good diversification - strong portfolio construction potential`);
    } else if (diversification.diversification_quality === "Limited") {
        insights.push("Limited diversification options require looking beyond current asset universe or using alternative strategies");
    }
    
    // Risk insights
    if (risks.concentration_risk === "Very High" || risks.concentration_risk === "High") {
        insights.push("High concentration risk from correlated assets requires careful position sizing and risk management");
    }
    
    // Specific opportunities
    if (diversification.best_diversifiers.length > 5) {
        insights.push(`${diversification.best_diversifiers.length} low-correlation assets identified for portfolio diversification`);
    }
    
    // Market structure insights
    if (distribution.market_structure?.includes("Crisis")) {
        insights.push("Crisis-like correlation structure suggests heightened systematic risk and reduced diversification benefits");
    } else if (distribution.market_structure?.includes("Normal")) {
        insights.push("Normal market correlation structure supports standard portfolio construction approaches");
    }
    
    return insights;
}

function generateStrategicRecommendations(diversification: any, risks: any, optimization: any): any {
    const recommendations = [];
    let primaryStrategy = "Balanced Diversification";
    
    // Based on diversification quality
    if (diversification.diversification_quality === "Excellent") {
        recommendations.push("Implement equal-weight diversification strategy across low-correlation assets");
        recommendations.push("Take advantage of abundant diversification opportunities");
        primaryStrategy = "Aggressive Diversification";
    } else if (diversification.diversification_quality === "Limited") {
        recommendations.push("Seek alternative asset classes or strategies for diversification");
        recommendations.push("Consider factor-based diversification if asset diversification is limited");
        primaryStrategy = "Alternative Diversification";
    }
    
    // Based on risk levels
    if (risks.concentration_risk === "Very High") {
        recommendations.push("Reduce position sizes in highly correlated assets");
        recommendations.push("Implement strict correlation monitoring and limits");
        primaryStrategy = "Risk Reduction Focus";
    }
    
    // Based on optimization opportunities
    if (optimization.natural_hedges > 2) {
        recommendations.push("Utilize natural hedging relationships for portfolio protection");
        recommendations.push("Consider pairs trading strategies with negatively correlated assets");
    }
    
    // General recommendations
    recommendations.push("Regular correlation monitoring for changing market conditions");
    recommendations.push("Stress test portfolio under high correlation scenarios");
    recommendations.push("Consider dynamic allocation based on correlation regime changes");
    
    return {
        primary_strategy: primaryStrategy,
        strategic_recommendations: recommendations,
        implementation_priorities: generateImplementationPriorities(diversification, risks),
        risk_management_protocols: generateRiskManagementProtocols(risks),
        monitoring_framework: generateMonitoringFramework(diversification, risks)
    };
}

function identifyHedgingOpportunities(correlationData: any[]): any {
    const hedgingAssets = correlationData
        .filter(item => (item.CORRELATION || item.CORRELATION_VALUE || 0) < -0.2)
        .sort((a, b) => (a.CORRELATION || a.CORRELATION_VALUE || 0) - (b.CORRELATION || b.CORRELATION_VALUE || 0));
    
    const opportunities = hedgingAssets.map(asset => ({
        asset_name: `${asset.TOKEN_NAME || asset.NAME || 'Unknown'} (${asset.SYMBOL || 'N/A'})`,
        correlation: (asset.CORRELATION || asset.CORRELATION_VALUE || 0).toFixed(3),
        hedging_effectiveness: assessHedgingEffectiveness(asset.CORRELATION || asset.CORRELATION_VALUE || 0),
        recommended_hedge_ratio: calculateHedgeRatio(asset.CORRELATION || asset.CORRELATION_VALUE || 0),
        strategy_type: determineHedgingStrategy(asset.CORRELATION || asset.CORRELATION_VALUE || 0)
    }));
    
    return {
        available_hedges: opportunities.length,
        hedging_opportunities: opportunities.slice(0, 5),
        hedging_strategies: [
            "Direct hedging with negatively correlated assets",
            "Portfolio insurance using inverse relationships",
            "Pairs trading for market-neutral strategies",
            "Dynamic hedging based on correlation changes"
        ],
        hedging_effectiveness_assessment: opportunities.length > 0 ? "Good hedging options available" : "Limited hedging opportunities",
        implementation_guidance: [
            "Start with small hedge ratios and adjust based on performance",
            "Monitor correlation stability for hedge effectiveness",
            "Consider transaction costs in hedging decisions",
            "Regular rebalancing of hedge positions"
        ]
    };
}

// Helper functions

function interpretMarketStructure(avgCorrelation: number, veryHighPositiveCount: number, totalCount: number): string {
    const extremeCorrelationRatio = veryHighPositiveCount / totalCount;
    
    if (avgCorrelation > 0.7 && extremeCorrelationRatio > 0.3) {
        return "Crisis-like structure with high systematic risk";
    } else if (avgCorrelation > 0.5) {
        return "Elevated correlation suggesting increased systematic risk";
    } else if (avgCorrelation < 0.2) {
        return "Low correlation structure ideal for diversification";
    } else {
        return "Normal market correlation structure";
    }
}

function interpretDiversificationBenefit(correlation: number): string {
    if (correlation < -0.5) return "Excellent diversification and hedging potential";
    if (correlation < -0.2) return "Good diversification with hedging benefits";
    if (correlation < 0.2) return "Good diversification potential";
    if (correlation < 0.5) return "Moderate diversification benefits";
    return "Limited diversification value";
}

function interpretRiskLevel(correlation: number): string {
    if (correlation > 0.9) return "Very High Risk - moves almost identically";
    if (correlation > 0.8) return "High Risk - strong similar movements";
    if (correlation > 0.6) return "Moderate Risk - noticeable similar patterns";
    return "Low Risk - minimal movement similarity";
}

function generatePortfolioConstructionGuidance(diversificationRatio: number, diversifierCount: number): string[] {
    const guidance = [];
    
    if (diversificationRatio > 0.6) {
        guidance.push("Equal-weight approach viable due to good diversification options");
        guidance.push("Can use higher number of positions without concentration risk");
    } else if (diversificationRatio > 0.3) {
        guidance.push("Selective diversification focusing on best low-correlation assets");
        guidance.push("Balance between diversification and position concentration");
    } else {
        guidance.push("Limited diversification requires concentrated high-conviction approach");
        guidance.push("Consider factor-based or alternative diversification methods");
    }
    
    if (diversifierCount > 10) {
        guidance.push("Abundant diversification options allow for sophisticated portfolio construction");
    } else if (diversifierCount < 5) {
        guidance.push("Limited diversifiers require careful selection and sizing");
    }
    
    return guidance;
}

function analyzeSectorConcentration(correlationData: any[]): any {
    const sectorCounts = new Map();
    
    correlationData.forEach(item => {
        const sector = item.CATEGORY || item.SECTOR || 'Unknown';
        sectorCounts.set(sector, (sectorCounts.get(sector) || 0) + 1);
    });
    
    const sectors = Array.from(sectorCounts.entries()).sort((a, b) => b[1] - a[1]);
    const totalAssets = correlationData.length;
    const topSectorRatio = sectors.length > 0 ? sectors[0][1] / totalAssets : 0;
    
    let concentrationLevel;
    if (topSectorRatio > 0.6) concentrationLevel = "Very High";
    else if (topSectorRatio > 0.4) concentrationLevel = "High";
    else if (topSectorRatio > 0.25) concentrationLevel = "Moderate";
    else concentrationLevel = "Low";
    
    return {
        concentration_level: concentrationLevel,
        top_sector: sectors[0]?.[0] || 'Unknown',
        top_sector_percentage: `${(topSectorRatio * 100).toFixed(1)}%`,
        sector_distribution: sectors.slice(0, 5).map(([sector, count]) => ({
            sector: sector,
            count: count,
            percentage: `${((count / totalAssets) * 100).toFixed(1)}%`
        }))
    };
}

function calculateVolatilityMultiplier(avgCorrelation: number): string {
    // Simplified portfolio volatility impact calculation
    const multiplier = Math.sqrt(avgCorrelation);
    
    if (multiplier > 0.9) return "Very High Impact - portfolio volatility barely reduced";
    if (multiplier > 0.7) return "High Impact - limited volatility reduction";
    if (multiplier > 0.5) return "Moderate Impact - reasonable volatility reduction";
    if (multiplier > 0.3) return "Low Impact - good volatility reduction";
    return "Very Low Impact - excellent volatility reduction";
}

function identifyCorrelationRiskFactors(highCorrelations: any[], veryHighCorrelations: any[]): string[] {
    const factors = [];
    
    if (veryHighCorrelations.length > 0) {
        factors.push("Extremely high correlations eliminate diversification benefits");
    }
    
    if (highCorrelations.length > 5) {
        factors.push("Multiple high-correlation relationships increase systematic risk");
    }
    
    // Analyze sector concentration in high correlations
    const sectorCounts = new Map();
    highCorrelations.forEach(item => {
        const sector = item.CATEGORY || item.SECTOR || 'Unknown';
        sectorCounts.set(sector, (sectorCounts.get(sector) || 0) + 1);
    });
    
    if (sectorCounts.size < 3) {
        factors.push("High correlations concentrated in few sectors increases sector risk");
    }
    
    factors.push("Correlation can increase during market stress periods");
    
    return factors;
}

function generateStressTestImplications(avgCorrelation: number, highCorrelationRatio: number): string[] {
    const implications = [];
    
    if (avgCorrelation > 0.6) {
        implications.push("High correlation suggests portfolio will move as one unit during stress");
        implications.push("Expect minimal protection from diversification during market downturns");
    }
    
    if (highCorrelationRatio > 0.4) {
        implications.push("Significant portion of portfolio exhibits high correlation - stress test with 80%+ correlation");
    }
    
    implications.push("Monitor correlation increases during market volatility");
    implications.push("Prepare for correlation convergence during crisis periods");
    
    return implications;
}

function suggestAllocation(correlation: number): string {
    if (correlation < -0.3) return "10-20% - Strong diversifier";
    if (correlation < 0.1) return "15-25% - Good diversifier";
    if (correlation < 0.3) return "10-15% - Moderate diversifier";
    if (correlation < 0.5) return "5-10% - Limited diversification";
    return "3-5% - Minimal allocation due to high correlation";
}

function assessHedgingEffectiveness(correlation: number): string {
    if (correlation < -0.8) return "Excellent hedge - very strong inverse relationship";
    if (correlation < -0.5) return "Good hedge - strong inverse relationship";
    if (correlation < -0.2) return "Moderate hedge - some inverse relationship";
    return "Limited hedging effectiveness";
}

function calculateHedgeRatio(correlation: number): string {
    const ratio = Math.abs(correlation);
    
    if (ratio > 0.8) return "0.8-1.0 - High hedge ratio suitable";
    if (ratio > 0.5) return "0.5-0.7 - Moderate hedge ratio";
    if (ratio > 0.3) return "0.3-0.5 - Conservative hedge ratio";
    return "0.1-0.3 - Small hedge ratio";
}

function determineHedgingStrategy(correlation: number): string {
    if (correlation < -0.7) return "Direct hedge - strong inverse relationship";
    if (correlation < -0.4) return "Portfolio insurance - moderate inverse relationship";
    if (correlation < -0.2) return "Diversification hedge - mild inverse relationship";
    return "Pairs trading - exploits correlation patterns";
}

function calculatePortfolioEfficiencyScore(correlationData: any[]): string {
    const lowCorrelationCount = correlationData.filter(item => Math.abs(item.CORRELATION || item.CORRELATION_VALUE || 0) < 0.3).length;
    const totalCount = correlationData.length;
    const negativeCorrelationCount = correlationData.filter(item => (item.CORRELATION || item.CORRELATION_VALUE || 0) < -0.1).length;
    
    let score = 0;
    score += (lowCorrelationCount / totalCount) * 60; // 60 points for diversification
    score += (negativeCorrelationCount / totalCount) * 40; // 40 points for hedging
    
    if (score > 80) return "Excellent - Strong diversification and hedging opportunities";
    if (score > 60) return "Good - Solid diversification with some hedging";
    if (score > 40) return "Moderate - Limited but usable diversification";
    return "Poor - Minimal diversification opportunities";
}

function assessRegimeStability(correlationData: any[]): string {
    // This would require time series data in real implementation
    // For now, assess based on correlation distribution
    const correlationRange = Math.max(...correlationData.map(item => item.CORRELATION || item.CORRELATION_VALUE || 0)) - 
                             Math.min(...correlationData.map(item => item.CORRELATION || item.CORRELATION_VALUE || 0));
    
    if (correlationRange > 1.5) return "Unstable - Wide correlation range suggests regime changes";
    if (correlationRange > 1.0) return "Moderate - Some correlation variation observed";
    return "Stable - Consistent correlation patterns";
}

function generateRegimeImplications(marketRegime: string): string[] {
    const implications = [];
    
    if (marketRegime === "High Correlation Regime") {
        implications.push("Reduce reliance on diversification for risk management");
        implications.push("Focus on absolute return strategies and hedging");
        implications.push("Consider alternative assets outside correlated universe");
    } else if (marketRegime === "Low Correlation Regime") {
        implications.push("Maximize diversification benefits with equal-weight strategies");
        implications.push("Focus on stock selection and fundamental analysis");
        implications.push("Reduce hedging as natural diversification provides protection");
    } else {
        implications.push("Balance diversification and hedging strategies");
        implications.push("Monitor for regime changes that could affect strategy");
        implications.push("Maintain flexible approach to adapt to regime shifts");
    }
    
    return implications;
}

function generateImplementationPriorities(diversification: any, risks: any): string[] {
    const priorities = [];
    
    if (risks.concentration_risk === "Very High") {
        priorities.push("1. Immediate risk reduction through position sizing limits");
        priorities.push("2. Implement correlation monitoring systems");
    } else {
        priorities.push("1. Optimize portfolio using identified diversifiers");
    }
    
    if (diversification.diversification_quality === "Excellent") {
        priorities.push("2. Build diversified core portfolio with low-correlation assets");
        priorities.push("3. Implement systematic rebalancing");
    } else {
        priorities.push("2. Seek additional diversification sources outside current universe");
    }
    
    priorities.push("3. Establish correlation monitoring and alerting systems");
    
    return priorities;
}

function generateRiskManagementProtocols(risks: any): string[] {
    const protocols = [];
    
    if (risks.concentration_risk === "Very High" || risks.concentration_risk === "High") {
        protocols.push("Maximum 5% allocation to any single highly correlated asset");
        protocols.push("Combined limit of 25% to assets with correlation >0.7");
    }
    
    protocols.push("Monthly correlation review and portfolio adjustment");
    protocols.push("Stress test portfolio assuming 80%+ correlation during crisis");
    protocols.push("Alert system for correlation changes >0.2 from baseline");
    
    return protocols;
}

function generateMonitoringFramework(diversification: any, risks: any): any {
    return {
        monitoring_frequency: "Weekly correlation updates with monthly deep analysis",
        key_metrics: [
            "Average portfolio correlation",
            "Number of high correlation relationships (>0.7)",
            "Diversification ratio (assets with correlation <0.3)",
            "Maximum pairwise correlation in portfolio"
        ],
        alert_triggers: [
            "Average correlation increases by >0.15",
            "Number of high correlations doubles",
            "Diversification ratio drops below 30%",
            "Any correlation exceeds 0.95"
        ],
        reporting_requirements: [
            "Monthly correlation heatmap",
            "Quarterly portfolio efficiency assessment",
            "Semi-annual stress test results",
            "Annual correlation regime analysis"
        ]
    };
}

function assessCoverageScope(correlationData: any[]): string {
    const tokenCount = correlationData.length;
    const uniqueSymbols = new Set(correlationData.map(item => item.SYMBOL).filter(s => s)).size;
    
    if (tokenCount > 50 && uniqueSymbols > 40) return "Comprehensive";
    if (tokenCount > 25 && uniqueSymbols > 20) return "Good";
    if (tokenCount > 10 && uniqueSymbols > 8) return "Moderate";
    return "Limited";
}

function assessDataReliability(correlationData: any[]): string {
    const validCorrelations = correlationData.filter(item => 
        (item.CORRELATION !== null && item.CORRELATION !== undefined) || 
        (item.CORRELATION_VALUE !== null && item.CORRELATION_VALUE !== undefined)
    ).length;
    
    const reliabilityRatio = correlationData.length > 0 ? (validCorrelations / correlationData.length) : 0;
    
    if (reliabilityRatio > 0.95) return "Excellent - comprehensive correlation data";
    if (reliabilityRatio > 0.85) return "Good - most relationships have valid correlation data";
    if (reliabilityRatio > 0.7) return "Fair - some missing correlation values";
    return "Limited - significant gaps in correlation data";
}

// Helper functions for focused analysis

function generateDiversificationRecommendations(correlationData: any[]): any[] {
    const lowCorrelationAssets = correlationData
        .filter(item => Math.abs(item.CORRELATION || item.CORRELATION_VALUE || 0) < 0.3)
        .sort((a, b) => Math.abs(a.CORRELATION || a.CORRELATION_VALUE || 0) - Math.abs(b.CORRELATION || b.CORRELATION_VALUE || 0))
        .slice(0, 5);
    
    return lowCorrelationAssets.map(asset => ({
        token: `${asset.TOKEN_NAME || asset.NAME || 'Unknown'} (${asset.SYMBOL || 'N/A'})`,
        correlation: (asset.CORRELATION || asset.CORRELATION_VALUE || 0).toFixed(3),
        allocation_suggestion: suggestAllocation(asset.CORRELATION || asset.CORRELATION_VALUE || 0),
        diversification_benefit: interpretDiversificationBenefit(asset.CORRELATION || asset.CORRELATION_VALUE || 0)
    }));
}

function getDiversificationRebalancingFrequency(avgCorrelation: string): string {
    const correlation = parseFloat(avgCorrelation);
    if (correlation > 0.6) return "Monthly - high correlation requires frequent rebalancing";
    if (correlation > 0.4) return "Quarterly - moderate correlation needs regular monitoring";
    if (correlation > 0.2) return "Semi-annually - low correlation allows longer periods";
    return "Annually - very low correlation provides stable diversification";
}

function generateHedgingStrategies(correlationData: any[]): any[] {
    const hedgingAssets = correlationData
        .filter(item => (item.CORRELATION || item.CORRELATION_VALUE) < -0.2)
        .sort((a, b) => (a.CORRELATION || a.CORRELATION_VALUE) - (b.CORRELATION || b.CORRELATION_VALUE))
        .slice(0, 5);
    
    return hedgingAssets.map(asset => ({
        token: `${asset.TOKEN_NAME || asset.NAME || 'Unknown'} (${asset.SYMBOL || 'N/A'})`,
        correlation: (asset.CORRELATION || asset.CORRELATION_VALUE || 0).toFixed(3),
        hedge_ratio: calculateHedgeRatio(asset.CORRELATION || asset.CORRELATION_VALUE || 0),
        hedging_strategy: determineHedgingStrategy(asset.CORRELATION || asset.CORRELATION_VALUE || 0),
        effectiveness: assessHedgingEffectiveness(asset.CORRELATION || asset.CORRELATION_VALUE || 0)
    }));
}

function getStrongestHedge(correlationData: any[]): string {
    const negativeCorrelations = correlationData.filter(item => (item.CORRELATION || item.CORRELATION_VALUE) < 0);
    if (negativeCorrelations.length === 0) return "No negative correlations found";
    
    const strongest = negativeCorrelations.reduce((min, current) => 
        (current.CORRELATION || current.CORRELATION_VALUE) < (min.CORRELATION || min.CORRELATION_VALUE) ? current : min
    );
    
    return `${strongest.TOKEN_NAME || strongest.NAME || 'Unknown'} (${strongest.SYMBOL || 'N/A'}) with ${(strongest.CORRELATION || strongest.CORRELATION_VALUE || 0).toFixed(3)} correlation`;
}

function assessOverallHedgingEffectiveness(correlationData: any[]): string {
    const negativeCorrelations = correlationData.filter(item => (item.CORRELATION || item.CORRELATION_VALUE) < 0);
    const strongNegativeCorrelations = correlationData.filter(item => (item.CORRELATION || item.CORRELATION_VALUE) < -0.5);
    
    if (strongNegativeCorrelations.length > 3) return "Excellent - multiple strong hedging options available";
    if (negativeCorrelations.length > 5) return "Good - several hedging opportunities identified";
    if (negativeCorrelations.length > 2) return "Moderate - limited hedging options available";
    return "Poor - few or no effective hedging opportunities";
}

function shouldUseDynamicHedging(avgCorrelation: string): string {
    const correlation = parseFloat(avgCorrelation);
    if (correlation > 0.7) return "Yes - high correlations require dynamic hedging strategies";
    if (correlation > 0.4) return "Consider - moderate correlations may benefit from dynamic approaches";
    return "No - low correlations allow for static hedging strategies";
}
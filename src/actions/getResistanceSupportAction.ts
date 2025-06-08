import type { Action } from "@elizaos/core";
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
import type { ResistanceSupportResponse } from "../types";

// Zod schema for resistance support request validation
const ResistanceSupportRequestSchema = z.object({
    cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
    token_id: z.number().optional().describe("Specific token ID if known"),
    symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
    limit: z.number().min(1).max(100).optional().describe("Number of levels to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["trading_levels", "breakout_analysis", "risk_management", "all"]).optional().describe("Type of analysis to focus on")
});

type ResistanceSupportRequest = z.infer<typeof ResistanceSupportRequestSchema>;

// AI extraction template for natural language processing
const RESISTANCE_SUPPORT_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting resistance and support level requests from natural language.

The user wants to get historical levels of resistance and support for cryptocurrency technical analysis. Extract the following information:

1. **cryptocurrency** (optional): The name or symbol of the cryptocurrency
   - Look for token names like "Bitcoin", "Ethereum", "BTC", "ETH"
   - Can be a specific token or general request

2. **token_id** (optional): Specific token ID if mentioned
   - Usually a number like "3375" for Bitcoin

3. **symbol** (optional): Token symbol
   - Extract symbols like "BTC", "ETH", "ADA", etc.

4. **limit** (optional, default: 50): Number of levels to return

5. **page** (optional, default: 1): Page number for pagination

6. **analysisType** (optional, default: "all"): What type of analysis they want
   - "trading_levels" - focus on key trading levels and entry/exit points
   - "breakout_analysis" - focus on potential breakout/breakdown scenarios
   - "risk_management" - focus on stop-loss and risk management levels
   - "all" - comprehensive resistance and support analysis

Examples:
- "Get resistance and support levels for Bitcoin" → {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Show me key trading levels for ETH" → {cryptocurrency: "Ethereum", symbol: "ETH", analysisType: "trading_levels"}
- "Support and resistance for breakout analysis" → {analysisType: "breakout_analysis"}
- "Risk management levels for Solana" → {cryptocurrency: "Solana", symbol: "SOL", analysisType: "risk_management"}

Extract the request details from the user's message.
`;

/**
 * RESISTANCE & SUPPORT ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/resistance-support
 * 
 * This action gets the historical levels of resistance and support for each token.
 * Essential for technical analysis, entry/exit planning, and risk management strategies.
 */
export const getResistanceSupportAction: Action = {
    name: "GET_RESISTANCE_SUPPORT_TOKENMETRICS",
    description: "Get historical levels of resistance and support for cryptocurrency tokens from TokenMetrics for technical analysis and trading strategies",
    similes: [
        "get resistance support",
        "support resistance levels",
        "technical levels",
        "price levels",
        "key levels",
        "support resistance analysis",
        "technical analysis levels",
        "trading levels",
        "breakout levels"
    ],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get resistance and support levels for Bitcoin"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve the key resistance and support levels for Bitcoin from TokenMetrics technical analysis.",
                    action: "GET_RESISTANCE_SUPPORT_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me support and resistance levels for Ethereum"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the technical support and resistance levels for Ethereum to help with trading decisions.",
                    action: "GET_RESISTANCE_SUPPORT_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Risk management levels for Solana"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get resistance and support levels for Solana focused on risk management and stop-loss placement.",
                    action: "GET_RESISTANCE_SUPPORT_TOKENMETRICS"
                }
            }
        ]
    ],
    
    async handler(runtime, message, _state) {
        try {
            const requestId = generateRequestId();
            console.log(`[${requestId}] Processing resistance and support levels request...`);
            
            // Extract structured request using AI
            const levelsRequest = await extractTokenMetricsRequest<ResistanceSupportRequest>(
                runtime,
                message,
                _state || await runtime.composeState(message),
                RESISTANCE_SUPPORT_EXTRACTION_TEMPLATE,
                ResistanceSupportRequestSchema,
                requestId
            );
            
            console.log(`[${requestId}] Extracted request:`, levelsRequest);
            
            // Apply defaults for optional fields
            const processedRequest = {
                cryptocurrency: levelsRequest.cryptocurrency,
                token_id: levelsRequest.token_id,
                symbol: levelsRequest.symbol,
                limit: levelsRequest.limit || 50,
                page: levelsRequest.page || 1,
                analysisType: levelsRequest.analysisType || "all"
            };
            
            // Resolve token if cryptocurrency name is provided
            let resolvedToken = null;
            if (processedRequest.cryptocurrency && !processedRequest.token_id && !processedRequest.symbol) {
                try {
                    resolvedToken = await resolveTokenSmart(processedRequest.cryptocurrency, runtime);
                    if (resolvedToken) {
                        processedRequest.token_id = resolvedToken.token_id;
                        processedRequest.symbol = resolvedToken.symbol;
                        console.log(`[${requestId}] Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.symbol} (ID: ${resolvedToken.token_id})`);
                    }
                } catch (error) {
                    console.log(`[${requestId}] Token resolution failed, proceeding with original request`);
                }
            }
            
            // Build API parameters
            const apiParams: Record<string, any> = {
                limit: processedRequest.limit,
                page: processedRequest.page
            };
            
            // Add token identification parameters
            if (processedRequest.token_id) apiParams.token_id = processedRequest.token_id;
            if (processedRequest.symbol) apiParams.symbol = processedRequest.symbol;
            
            // Make API call
            const response = await callTokenMetricsAPI(
                "/v2/resistance-support",
                apiParams,
                runtime
            );
            
            console.log(`[${requestId}] API response received, processing data...`);
            
            // Process response data
            const levelsData = Array.isArray(response) ? response : response.data || [];
            
            // Analyze the resistance and support levels based on requested analysis type
            const levelsAnalysis = analyzeResistanceSupportLevels(levelsData, processedRequest.analysisType);
            
            const result = {
                success: true,
                message: `Successfully retrieved ${levelsData.length} resistance and support levels from TokenMetrics`,
                request_id: requestId,
                resistance_support_levels: levelsData,
                analysis: levelsAnalysis,
                metadata: {
                    endpoint: "resistance-support",
                    requested_token: processedRequest.cryptocurrency || processedRequest.symbol || processedRequest.token_id,
                    resolved_token: resolvedToken,
                    analysis_focus: processedRequest.analysisType,
                    pagination: {
                        page: processedRequest.page,
                        limit: processedRequest.limit
                    },
                    data_points: levelsData.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Technical Analysis Engine"
                },
                levels_explanation: {
                    purpose: "Identify key price levels where buying or selling pressure typically emerges",
                    resistance_levels: "Price levels where selling pressure historically increases, limiting upward movement",
                    support_levels: "Price levels where buying pressure historically increases, limiting downward movement",
                    usage_guidelines: [
                        "Use support levels as potential entry points for long positions",
                        "Use resistance levels as potential exit points or profit-taking levels", 
                        "Monitor level breaks for trend continuation or reversal signals",
                        "Combine with volume analysis for confirmation of level significance"
                    ],
                    trading_applications: [
                        "Set stop-loss orders below support levels",
                        "Set take-profit orders near resistance levels",
                        "Plan position sizes based on distance to key levels",
                        "Identify potential breakout or breakdown scenarios"
                    ]
                }
            };
            
            console.log(`[${requestId}] Resistance and support analysis completed successfully`);
            return result;
            
        } catch (error) {
            console.error("Error in getResistanceSupportAction:", error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve resistance and support levels from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/resistance-support is accessible",
                    parameter_validation: [
                        "Verify token_id is a valid number or symbol is a valid string",
                        "Check that pagination parameters are positive integers",
                        "Ensure your API key has access to resistance-support endpoint",
                        "Confirm the token has sufficient price history for level analysis"
                    ],
                    common_solutions: [
                        "Try using a major token (BTC, ETH) to test functionality",
                        "Check if your subscription includes technical analysis data",
                        "Verify the token has been actively traded with sufficient volume",
                        "Ensure TokenMetrics has performed technical analysis on the requested token"
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
 * Comprehensive analysis of resistance and support levels for trading strategies based on analysis type
 */
function analyzeResistanceSupportLevels(levelsData: any[], analysisType: string = "all"): any {
    if (!levelsData || levelsData.length === 0) {
        return {
            summary: "No resistance and support levels data available for analysis",
            key_levels: "Cannot identify",
            insights: []
        };
    }
    
    // Separate resistance and support levels
    const resistanceLevels = levelsData.filter(level => 
        level.LEVEL_TYPE === 'RESISTANCE' || level.TYPE === 'RESISTANCE'
    );
    const supportLevels = levelsData.filter(level => 
        level.LEVEL_TYPE === 'SUPPORT' || level.TYPE === 'SUPPORT'
    );
    
    // Core analysis components
    const levelStrength = analyzeLevelStrength(levelsData);
    const levelProximity = analyzeLevelProximity(levelsData);
    const tradingOpportunities = identifyTradingOpportunities(resistanceLevels, supportLevels);
    const riskManagement = generateRiskManagementGuidance(resistanceLevels, supportLevels);
    
    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "trading_levels":
            focusedAnalysis = {
                trading_focus: {
                    key_entry_levels: identifyKeyEntryLevels(supportLevels),
                    key_exit_levels: identifyKeyExitLevels(resistanceLevels),
                    optimal_trading_zones: identifyOptimalTradingZones(resistanceLevels, supportLevels),
                    trading_insights: [
                        `🎯 Key support levels: ${supportLevels.length}`,
                        `🚧 Key resistance levels: ${resistanceLevels.length}`,
                        `📊 Trading opportunities: ${tradingOpportunities.immediate_setups || 0}`
                    ]
                }
            };
            break;
            
        case "breakout_analysis":
            focusedAnalysis = {
                breakout_focus: {
                    breakout_candidates: identifyBreakoutCandidates(resistanceLevels, supportLevels),
                    breakdown_risks: identifyBreakdownRisks(supportLevels),
                    momentum_levels: identifyMomentumLevels(levelsData),
                    breakout_insights: [
                        `🚀 Breakout candidates: ${resistanceLevels.filter(r => r.STRENGTH > 0.7).length}`,
                        `⚠️ Breakdown risks: ${supportLevels.filter(s => s.STRENGTH < 0.5).length}`,
                        `💪 Strong levels: ${levelStrength.strong_levels || 0}`
                    ]
                }
            };
            break;
            
        case "risk_management":
            focusedAnalysis = {
                risk_management_focus: {
                    stop_loss_levels: identifyStopLossLevels(supportLevels),
                    take_profit_levels: identifyTakeProfitLevels(resistanceLevels),
                    risk_reward_ratios: calculateRiskRewardRatios(resistanceLevels, supportLevels),
                    risk_insights: [
                        `🛡️ Stop-loss levels: ${supportLevels.length}`,
                        `🎯 Take-profit levels: ${resistanceLevels.length}`,
                        `⚖️ Risk/reward quality: ${riskManagement.overall_assessment || 'Unknown'}`
                    ]
                }
            };
            break;
    }
    
    return {
        summary: `Analysis of ${levelsData.length} levels (${resistanceLevels.length} resistance, ${supportLevels.length} support) with ${levelStrength.strong_levels} strong levels identified`,
        analysis_type: analysisType,
        level_breakdown: {
            resistance_levels: resistanceLevels.length,
            support_levels: supportLevels.length,
            total_levels: levelsData.length
        },
        level_strength: levelStrength,
        level_proximity: levelProximity,
        trading_opportunities: tradingOpportunities,
        risk_management: riskManagement,
        insights: generateTechnicalInsights(resistanceLevels, supportLevels, levelStrength),
        technical_outlook: generateTechnicalOutlook(resistanceLevels, supportLevels, levelStrength),
        ...focusedAnalysis,
        data_quality: {
            source: "TokenMetrics Technical Analysis Engine",
            level_count: levelsData.length,
            coverage: assessCoverageTimeframe(levelsData),
            analysis_depth: assessAnalysisDepth(levelsData),
            reliability: assessReliability(levelStrength.average_strength || 0, levelStrength.strong_levels || 0, levelsData.length)
        },
        level_classification: classifyLevels(resistanceLevels, supportLevels, analysisType)
    };
}

function analyzeLevelStrength(levelsData: any[]): any {
    const strengthScores = levelsData
        .map(level => level.STRENGTH || level.LEVEL_STRENGTH)
        .filter(strength => strength !== null && strength !== undefined);
    
    if (strengthScores.length === 0) {
        return { strong_levels: 0, average_strength: 0 };
    }
    
    const averageStrength = strengthScores.reduce((sum, strength) => sum + strength, 0) / strengthScores.length;
    
    // Categorize levels by strength
    const strongLevels = strengthScores.filter(s => s >= 80).length;
    const moderateLevels = strengthScores.filter(s => s >= 60 && s < 80).length;
    const weakLevels = strengthScores.filter(s => s < 60).length;
    
    return {
        average_strength: averageStrength.toFixed(1),
        strong_levels: strongLevels,
        moderate_levels: moderateLevels,
        weak_levels: weakLevels,
        strength_distribution: {
            strong: `${strongLevels} (${((strongLevels / strengthScores.length) * 100).toFixed(1)}%)`,
            moderate: `${moderateLevels} (${((moderateLevels / strengthScores.length) * 100).toFixed(1)}%)`,
            weak: `${weakLevels} (${((weakLevels / strengthScores.length) * 100).toFixed(1)}%)`
        },
        reliability_assessment: assessReliability(averageStrength, strongLevels, strengthScores.length)
    };
}

function analyzeLevelProximity(levelsData: any[]): any {
    // This would typically require current price data to calculate proximity
    // For now, we'll analyze the relative spacing of levels
    const priceLevels = levelsData
        .map(level => level.PRICE_LEVEL || level.LEVEL_PRICE)
        .filter(price => price && price > 0)
        .sort((a, b) => a - b);
    
    if (priceLevels.length < 2) {
        return { level_spacing: "Insufficient data" };
    }
    
    // Calculate spacing between consecutive levels
    const spacings = [];
    for (let i = 1; i < priceLevels.length; i++) {
        const spacing = ((priceLevels[i] - priceLevels[i-1]) / priceLevels[i-1]) * 100;
        spacings.push(spacing);
    }
    
    const averageSpacing = spacings.reduce((sum, spacing) => sum + spacing, 0) / spacings.length;
    const minSpacing = Math.min(...spacings);
    const maxSpacing = Math.max(...spacings);
    
    return {
        average_level_spacing: `${averageSpacing.toFixed(2)}%`,
        min_spacing: `${minSpacing.toFixed(2)}%`,
        max_spacing: `${maxSpacing.toFixed(2)}%`,
        price_range: {
            lowest_level: formatCurrency(priceLevels[0]),
            highest_level: formatCurrency(priceLevels[priceLevels.length - 1]),
            total_range: formatCurrency(priceLevels[priceLevels.length - 1] - priceLevels[0])
        },
        level_clustering: assessLevelClustering(spacings)
    };
}

function identifyTradingOpportunities(resistanceLevels: any[], supportLevels: any[]): any {
    const opportunities = [];
    
    // Identify strongest levels for trading setups
    const strongResistance = resistanceLevels
        .filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70)
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 3);
    
    const strongSupport = supportLevels
        .filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70)
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 3);
    
    // Generate trading opportunities
    strongSupport.forEach(level => {
        opportunities.push({
            type: "Long Entry Opportunity",
            description: `Strong support at ${formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE)}`,
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            strategy: "Consider long positions on bounces from this level",
            risk_management: "Set stop-loss below support level"
        });
    });
    
    strongResistance.forEach(level => {
        opportunities.push({
            type: "Short Entry Opportunity",
            description: `Strong resistance at ${formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE)}`,
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            strategy: "Consider short positions on rejections from this level",
            risk_management: "Set stop-loss above resistance level"
        });
    });
    
    // Breakout opportunities
    if (strongResistance.length > 0) {
        opportunities.push({
            type: "Breakout Opportunity",
            description: "Monitor for resistance level breaks for upside momentum",
            strategy: "Enter long positions on confirmed breaks above resistance",
            confirmation_needed: "Volume increase and sustained price action above level"
        });
    }
    
    if (strongSupport.length > 0) {
        opportunities.push({
            type: "Breakdown Opportunity", 
            description: "Monitor for support level breaks for downside momentum",
            strategy: "Enter short positions on confirmed breaks below support",
            confirmation_needed: "Volume increase and sustained price action below level"
        });
    }
    
    return {
        total_opportunities: opportunities.length,
        opportunities: opportunities,
        priority_levels: identifyPriorityLevels(strongResistance, strongSupport),
        setup_quality: assessSetupQuality(opportunities)
    };
}

function generateRiskManagementGuidance(resistanceLevels: any[], supportLevels: any[]): any {
    const guidance = [];
    
    // Stop-loss guidance
    if (supportLevels.length > 0) {
        const nearestSupport = supportLevels
            .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))[0];
        
        guidance.push({
            type: "Stop-Loss Placement",
            recommendation: `Place stop-losses below ${formatCurrency(nearestSupport.PRICE_LEVEL || nearestSupport.LEVEL_PRICE)} support level`,
            rationale: "Support break indicates trend reversal or acceleration"
        });
    }
    
    // Take-profit guidance
    if (resistanceLevels.length > 0) {
        const nearestResistance = resistanceLevels
            .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))[0];
        
        guidance.push({
            type: "Take-Profit Placement",
            recommendation: `Consider taking profits near ${formatCurrency(nearestResistance.PRICE_LEVEL || nearestResistance.LEVEL_PRICE)} resistance level`,
            rationale: "Resistance often causes price rejections and profit-taking"
        });
    }
    
    // Position sizing guidance
    guidance.push({
        type: "Position Sizing",
        recommendation: "Size positions based on distance to nearest support/resistance",
        calculation: "Risk 1-2% of portfolio per trade based on stop-loss distance"
    });
    
    // Risk monitoring
    guidance.push({
        type: "Risk Monitoring",
        recommendation: "Monitor for level breaks that invalidate trading thesis",
        action: "Exit or adjust positions when key levels are broken with volume"
    });
    
    return {
        guidance_points: guidance,
        key_principles: [
            "Always define risk before entering trades",
            "Use level strength to determine position confidence",
            "Monitor volume for level break confirmations",
            "Adjust position sizes based on level proximity"
        ],
        risk_factors: [
            "False breakouts can trigger stop-losses prematurely",
            "Market conditions can override technical levels",
            "High volatility can cause whipsaws around levels"
        ]
    };
}

function generateTechnicalInsights(resistanceLevels: any[], supportLevels: any[], levelAnalysis: any): string[] {
    const insights = [];
    
    // Level strength insights
    if (levelAnalysis.strong_levels > 0) {
        insights.push(`${levelAnalysis.strong_levels} high-strength levels identified provide reliable reference points for trading decisions`);
    } else {
        insights.push("Limited high-strength levels suggest less reliable technical guidance - use additional analysis");
    }
    
    // Level distribution insights
    if (resistanceLevels.length > supportLevels.length * 1.5) {
        insights.push("Heavy resistance overhead suggests potential selling pressure and upside challenges");
    } else if (supportLevels.length > resistanceLevels.length * 1.5) {
        insights.push("Strong support structure below current levels suggests downside protection");
    } else {
        insights.push("Balanced resistance and support structure indicates range-bound trading environment");
    }
    
    // Reliability insights
    if (levelAnalysis.reliability_assessment === "High") {
        insights.push("High reliability of technical levels supports confident position sizing and risk management");
    } else if (levelAnalysis.reliability_assessment === "Low") {
        insights.push("Low level reliability suggests using conservative position sizes and tight risk controls");
    }
    
    // Trading environment insights
    const totalLevels = resistanceLevels.length + supportLevels.length;
    if (totalLevels > 10) {
        insights.push("Dense level structure creates multiple trading opportunities but requires careful level selection");
    } else if (totalLevels < 5) {
        insights.push("Sparse level structure suggests fewer clear technical reference points");
    }
    
    return insights;
}

function generateTechnicalOutlook(resistanceLevels: any[], supportLevels: any[], levelAnalysis: any): any {
    let bias = "Neutral";
    let outlook = "Range-bound";
    
    // Determine bias based on level distribution and strength
    const strongResistance = resistanceLevels.filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70).length;
    const strongSupport = supportLevels.filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70).length;
    
    if (strongSupport > strongResistance) {
        bias = "Bullish";
        outlook = "Upside potential with strong support structure";
    } else if (strongResistance > strongSupport) {
        bias = "Bearish";
        outlook = "Downside risk with heavy resistance overhead";
    }
    
    const reliability = levelAnalysis.reliability_assessment;
    const confidence = reliability === "High" ? "High" : reliability === "Medium" ? "Moderate" : "Low";
    
    return {
        technical_bias: bias,
        outlook: outlook,
        confidence_level: confidence,
        key_factors: [
            `${strongResistance} strong resistance levels`,
            `${strongSupport} strong support levels`,
            `${levelAnalysis.average_strength} average level strength`
        ],
        trading_environment: classifyTradingEnvironment(resistanceLevels, supportLevels),
        next_key_events: identifyKeyEvents(resistanceLevels, supportLevels)
    };
}

// Helper functions

function identifyKeyLevels(levels: any[], type: string): any[] {
    return levels
        .filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 60)
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 5)
        .map(level => ({
            price_level: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            type: type,
            timeframe: level.TIMEFRAME || 'Unknown',
            significance: categorizeLevelSignificance(level.STRENGTH || level.LEVEL_STRENGTH || 0)
        }));
}

function calculateLevelDensity(levelsData: any[]): string {
    const priceRange = calculatePriceRange(levelsData);
    const levelCount = levelsData.length;
    
    if (priceRange === 0) return "Unknown";
    
    const density = levelCount / priceRange;
    
    if (density > 0.1) return "Very Dense";
    if (density > 0.05) return "Dense";
    if (density > 0.02) return "Moderate";
    return "Sparse";
}

function calculatePriceRange(levelsData: any[]): number {
    const prices = levelsData
        .map(level => level.PRICE_LEVEL || level.LEVEL_PRICE)
        .filter(price => price && price > 0);
    
    if (prices.length < 2) return 0;
    
    return Math.max(...prices) - Math.min(...prices);
}

function assessReliability(averageStrength: number, strongLevels: number, totalLevels: number): string {
    const strongRatio = strongLevels / totalLevels;
    
    if (averageStrength > 75 && strongRatio > 0.4) return "High";
    if (averageStrength > 60 && strongRatio > 0.25) return "Medium";
    if (averageStrength > 45) return "Low";
    return "Very Low";
}

function assessLevelClustering(spacings: number[]): string {
    const smallSpacings = spacings.filter(s => s < 2).length;
    const clusteringRatio = smallSpacings / spacings.length;
    
    if (clusteringRatio > 0.6) return "Highly Clustered";
    if (clusteringRatio > 0.4) return "Moderately Clustered";
    if (clusteringRatio > 0.2) return "Some Clustering";
    return "Well Distributed";
}

function identifyPriorityLevels(strongResistance: any[], strongSupport: any[]): any[] {
    const allLevels = [
        ...strongResistance.map(level => ({ ...level, type: 'resistance' })),
        ...strongSupport.map(level => ({ ...level, type: 'support' }))
    ];
    
    return allLevels
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 3)
        .map(level => ({
            price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            type: level.type,
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            priority: "High"
        }));
}

function assessSetupQuality(opportunities: any[]): string {
    if (opportunities.length === 0) return "No Setups";
    
    const highStrengthOpportunities = opportunities.filter(opp => 
        opp.strength && opp.strength >= 80
    ).length;
    
    if (highStrengthOpportunities > 2) return "Excellent";
    if (highStrengthOpportunities > 0) return "Good";
    if (opportunities.length > 3) return "Moderate";
    return "Limited";
}

function assessCoverageTimeframe(levelsData: any[]): string {
    const timeframes = new Set(levelsData.map(level => level.TIMEFRAME).filter(tf => tf));
    
    if (timeframes.has('daily') && timeframes.has('weekly')) return "Multi-timeframe";
    if (timeframes.has('daily')) return "Daily";
    if (timeframes.has('weekly')) return "Weekly";
    return "Unknown";
}

function assessAnalysisDepth(levelsData: any[]): string {
    const withStrength = levelsData.filter(level => level.STRENGTH || level.LEVEL_STRENGTH).length;
    const withTimeframe = levelsData.filter(level => level.TIMEFRAME).length;
    
    const depthScore = (withStrength + withTimeframe) / (levelsData.length * 2);
    
    if (depthScore > 0.8) return "Comprehensive";
    if (depthScore > 0.6) return "Detailed";
    if (depthScore > 0.4) return "Moderate";
    return "Basic";
}

function categorizeLevelSignificance(strength: number): string {
    if (strength >= 90) return "Critical";
    if (strength >= 80) return "Major";
    if (strength >= 70) return "Important";
    if (strength >= 60) return "Moderate";
    return "Minor";
}

function classifyTradingEnvironment(resistanceLevels: any[], supportLevels: any[]): string {
    const totalLevels = resistanceLevels.length + supportLevels.length;
    const strongLevels = [...resistanceLevels, ...supportLevels]
        .filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70).length;
    
    if (totalLevels > 10 && strongLevels > 5) return "Complex - Many strong levels";
    if (totalLevels > 6 && strongLevels > 2) return "Active - Good level structure";
    if (totalLevels > 3) return "Moderate - Some technical guidance";
    return "Simple - Limited level structure";
}

function identifyKeyEvents(resistanceLevels: any[], supportLevels: any[]): string[] {
    const events = [];
    
    const strongestResistance = resistanceLevels
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))[0];
    
    const strongestSupport = supportLevels
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))[0];
    
    if (strongestResistance) {
        events.push(`Break above ${formatCurrency(strongestResistance.PRICE_LEVEL || strongestResistance.LEVEL_PRICE)} resistance could trigger upside breakout`);
    }
    
    if (strongestSupport) {
        events.push(`Break below ${formatCurrency(strongestSupport.PRICE_LEVEL || strongestSupport.LEVEL_PRICE)} support could trigger downside breakdown`);
    }
    
    if (events.length === 0) {
        events.push("Monitor for clear level breaks to identify directional moves");
    }
    
    return events;
}

// Additional analysis functions for focused analysis types
function identifyKeyEntryLevels(supportLevels: any[]): any[] {
    return supportLevels
        .filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) > 0.6)
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 3)
        .map(level => ({
            price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            recommendation: "Strong support level for long entries"
        }));
}

function identifyKeyExitLevels(resistanceLevels: any[]): any[] {
    return resistanceLevels
        .filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) > 0.6)
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 3)
        .map(level => ({
            price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            recommendation: "Strong resistance level for profit taking"
        }));
}

function identifyOptimalTradingZones(resistanceLevels: any[], supportLevels: any[]): any[] {
    const zones = [];
    
    // Find zones between strong support and resistance levels
    for (const support of supportLevels.slice(0, 3)) {
        for (const resistance of resistanceLevels.slice(0, 3)) {
            const supportPrice = support.PRICE_LEVEL || support.LEVEL_PRICE;
            const resistancePrice = resistance.PRICE_LEVEL || resistance.LEVEL_PRICE;
            
            if (resistancePrice > supportPrice) {
                const range = ((resistancePrice - supportPrice) / supportPrice) * 100;
                if (range > 2 && range < 20) { // 2-20% range is optimal for trading
                    zones.push({
                        support_level: formatCurrency(supportPrice),
                        resistance_level: formatCurrency(resistancePrice),
                        range_percentage: `${range.toFixed(2)}%`,
                        quality: range > 5 ? "High" : "Medium"
                    });
                }
            }
        }
    }
    
    return zones.slice(0, 3);
}

function identifyBreakoutCandidates(resistanceLevels: any[], supportLevels: any[]): any[] {
    const candidates: any[] = [];
    
    // Strong resistance levels that could break
    const strongResistance = resistanceLevels.filter(level => 
        (level.STRENGTH || level.LEVEL_STRENGTH || 0) > 0.7
    );
    
    strongResistance.forEach(level => {
        candidates.push({
            type: "Upside Breakout",
            level: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            probability: level.STRENGTH > 0.8 ? "High" : "Medium"
        });
    });
    
    return candidates.slice(0, 3);
}

function identifyBreakdownRisks(supportLevels: any[]): any[] {
    const risks: any[] = [];
    
    // Weak support levels that could break
    const weakSupport = supportLevels.filter(level => 
        (level.STRENGTH || level.LEVEL_STRENGTH || 0) < 0.5
    );
    
    weakSupport.forEach(level => {
        risks.push({
            type: "Downside Breakdown",
            level: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            risk_level: level.STRENGTH < 0.3 ? "High" : "Medium"
        });
    });
    
    return risks.slice(0, 3);
}

function identifyMomentumLevels(levelsData: any[]): any[] {
    // Levels that could generate momentum on break
    return levelsData
        .filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) > 0.75)
        .map(level => ({
            price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            type: level.LEVEL_TYPE || level.TYPE || "Unknown",
            momentum_potential: "High",
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0
        }))
        .slice(0, 3);
}

function identifyStopLossLevels(supportLevels: any[]): any[] {
    return supportLevels
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 3)
        .map(level => ({
            price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            recommendation: "Place stop-loss below this level",
            risk_level: level.STRENGTH > 0.7 ? "Low" : "Medium"
        }));
}

function identifyTakeProfitLevels(resistanceLevels: any[]): any[] {
    return resistanceLevels
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 3)
        .map(level => ({
            price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            recommendation: "Consider taking profits at this level",
            probability: level.STRENGTH > 0.7 ? "High" : "Medium"
        }));
}

function calculateRiskRewardRatios(resistanceLevels: any[], supportLevels: any[]): any[] {
    const ratios = [];
    
    if (supportLevels.length > 0 && resistanceLevels.length > 0) {
        const strongestSupport = supportLevels.reduce((prev, current) => 
            (prev.STRENGTH || prev.LEVEL_STRENGTH || 0) > (current.STRENGTH || current.LEVEL_STRENGTH || 0) ? prev : current
        );
        
        const strongestResistance = resistanceLevels.reduce((prev, current) => 
            (prev.STRENGTH || prev.LEVEL_STRENGTH || 0) > (current.STRENGTH || current.LEVEL_STRENGTH || 0) ? prev : current
        );
        
        const supportPrice = strongestSupport.PRICE_LEVEL || strongestSupport.LEVEL_PRICE;
        const resistancePrice = strongestResistance.PRICE_LEVEL || strongestResistance.LEVEL_PRICE;
        
        if (resistancePrice > supportPrice) {
            const reward = resistancePrice - supportPrice;
            const risk = supportPrice * 0.02; // Assume 2% stop loss
            const ratio = reward / risk;
            
            ratios.push({
                entry_level: formatCurrency(supportPrice),
                target_level: formatCurrency(resistancePrice),
                risk_reward_ratio: `1:${ratio.toFixed(2)}`,
                quality: ratio > 3 ? "Excellent" : ratio > 2 ? "Good" : "Fair"
            });
        }
    }
    
    return ratios;
}

function classifyLevels(resistanceLevels: any[], supportLevels: any[], analysisType: string): any {
    const classification = {
        by_strength: {
            strong_resistance: resistanceLevels.filter(r => (r.STRENGTH || r.LEVEL_STRENGTH || 0) > 0.7).length,
            medium_resistance: resistanceLevels.filter(r => {
                const strength = r.STRENGTH || r.LEVEL_STRENGTH || 0;
                return strength >= 0.4 && strength <= 0.7;
            }).length,
            weak_resistance: resistanceLevels.filter(r => (r.STRENGTH || r.LEVEL_STRENGTH || 0) < 0.4).length,
            strong_support: supportLevels.filter(s => (s.STRENGTH || s.LEVEL_STRENGTH || 0) > 0.7).length,
            medium_support: supportLevels.filter(s => {
                const strength = s.STRENGTH || s.LEVEL_STRENGTH || 0;
                return strength >= 0.4 && strength <= 0.7;
            }).length,
            weak_support: supportLevels.filter(s => (s.STRENGTH || s.LEVEL_STRENGTH || 0) < 0.4).length
        },
        by_analysis_type: {
            focus: analysisType,
            primary_levels: analysisType === "trading_levels" ? "Entry/Exit points" :
                           analysisType === "breakout_analysis" ? "Breakout candidates" :
                           analysisType === "risk_management" ? "Stop-loss/Take-profit" : "All levels",
            level_priority: determineLevelPriority(resistanceLevels, supportLevels, analysisType)
        },
        overall_assessment: {
            total_levels: resistanceLevels.length + supportLevels.length,
            balance: Math.abs(resistanceLevels.length - supportLevels.length) < 3 ? "Balanced" : "Imbalanced",
            market_structure: classifyMarketStructure(resistanceLevels, supportLevels)
        }
    };
    
    return classification;
}

function determineLevelPriority(resistanceLevels: any[], supportLevels: any[], analysisType: string): string {
    const avgResistanceStrength = resistanceLevels.length > 0 ? 
        resistanceLevels.reduce((sum, r) => sum + (r.STRENGTH || r.LEVEL_STRENGTH || 0), 0) / resistanceLevels.length : 0;
    const avgSupportStrength = supportLevels.length > 0 ? 
        supportLevels.reduce((sum, s) => sum + (s.STRENGTH || s.LEVEL_STRENGTH || 0), 0) / supportLevels.length : 0;
    
    switch (analysisType) {
        case "trading_levels":
            return avgSupportStrength > avgResistanceStrength ? "Support-focused" : "Resistance-focused";
        case "breakout_analysis":
            return "Resistance-focused";
        case "risk_management":
            return "Support-focused";
        default:
            return "Balanced";
    }
}

function classifyMarketStructure(resistanceLevels: any[], supportLevels: any[]): string {
    const strongResistance = resistanceLevels.filter(r => (r.STRENGTH || r.LEVEL_STRENGTH || 0) > 0.7).length;
    const strongSupport = supportLevels.filter(s => (s.STRENGTH || s.LEVEL_STRENGTH || 0) > 0.7).length;
    
    if (strongResistance > strongSupport + 2) return "Resistance-heavy";
    if (strongSupport > strongResistance + 2) return "Support-heavy";
    if (strongResistance > 2 && strongSupport > 2) return "Well-defined range";
    return "Developing structure";
}
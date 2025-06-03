import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    extractTokenIdentifier,
    formatTokenMetricsNumber,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { ResistanceSupportResponse, ResistanceSupportRequest } from "../types";

/**
 * RESISTANCE & SUPPORT ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/resistance-support
 * 
 * This action gets the historical levels of resistance and support for each token.
 * Essential for technical analysis, entry/exit planning, and risk management strategies.
 */
export const getResistanceSupportAction: Action = {
    name: "getResistanceSupport",
    description: "Get historical levels of resistance and support for cryptocurrency tokens from TokenMetrics for technical analysis and trading strategies",
    similes: [
        "get resistance support",
        "support resistance levels",
        "technical levels",
        "price levels",
        "key levels",
        "support resistance analysis",
        "technical analysis levels"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Extract token identifiers
            const tokenIdentifier = extractTokenIdentifier(messageContent);
            
            // Build parameters based on actual API documentation
            const requestParams: ResistanceSupportRequest = {
                // Token identification
                token_id: tokenIdentifier.token_id || 
                         (typeof messageContent.token_id === 'number' ? messageContent.token_id : undefined),
                symbol: tokenIdentifier.symbol || 
                       (typeof messageContent.symbol === 'string' ? messageContent.symbol : undefined),
                
                // Pagination
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : 50,
                page: typeof messageContent.page === 'number' ? messageContent.page : 1
            };
            
            // Validate parameters
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Fetching resistance and support levels from TokenMetrics v2/resistance-support endpoint");
            
            // Make API call
            const response = await callTokenMetricsApi<ResistanceSupportResponse>(
                TOKENMETRICS_ENDPOINTS.resistanceSupport,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<ResistanceSupportResponse>(response, "getResistanceSupport");
            const levelsData = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the resistance and support data
            const levelsAnalysis = analyzeResistanceSupportLevels(levelsData);
            
            return {
                success: true,
                message: `Successfully retrieved ${levelsData.length} resistance and support levels`,
                resistance_support_levels: levelsData,
                analysis: levelsAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.resistanceSupport,
                    requested_token: tokenIdentifier.symbol || tokenIdentifier.token_id,
                    pagination: {
                        page: requestParams.page,
                        limit: requestParams.limit
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
                    text: "Get resistance and support levels for Bitcoin",
                    symbol: "BTC"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve the key resistance and support levels for Bitcoin from TokenMetrics technical analysis.",
                    action: "GET_RESISTANCE_SUPPORT"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me support and resistance levels for Ethereum",
                    symbol: "ETH"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the technical support and resistance levels for Ethereum to help with trading decisions.",
                    action: "GET_RESISTANCE_SUPPORT"
                }
            }
        ]
    ],
};

/**
 * Comprehensive analysis of resistance and support levels for trading strategies
 */
function analyzeResistanceSupportLevels(levelsData: any[]): any {
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
    
    // Analyze level strength and significance
    const levelAnalysis = analyzeLevelStrength(levelsData);
    const proximityAnalysis = analyzeLevelProximity(levelsData);
    const tradingOpportunities = identifyTradingOpportunities(resistanceLevels, supportLevels);
    const riskManagement = generateRiskManagementGuidance(resistanceLevels, supportLevels);
    
    // Generate comprehensive insights
    const insights = generateTechnicalInsights(resistanceLevels, supportLevels, levelAnalysis);
    
    return {
        summary: `Technical analysis reveals ${resistanceLevels.length} resistance levels and ${supportLevels.length} support levels with ${levelAnalysis.strong_levels} high-strength levels identified`,
        level_distribution: {
            total_levels: levelsData.length,
            resistance_levels: resistanceLevels.length,
            support_levels: supportLevels.length,
            level_density: calculateLevelDensity(levelsData)
        },
        key_resistance_levels: identifyKeyLevels(resistanceLevels, 'resistance'),
        key_support_levels: identifyKeyLevels(supportLevels, 'support'),
        level_analysis: levelAnalysis,
        proximity_analysis: proximityAnalysis,
        trading_opportunities: tradingOpportunities,
        risk_management: riskManagement,
        insights: insights,
        technical_outlook: generateTechnicalOutlook(resistanceLevels, supportLevels, levelAnalysis),
        data_quality: {
            source: "TokenMetrics Technical Analysis Engine",
            total_levels: levelsData.length,
            coverage_timeframe: assessCoverageTimeframe(levelsData),
            analysis_depth: assessAnalysisDepth(levelsData)
        }
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
            lowest_level: formatTokenMetricsNumber(priceLevels[0], 'currency'),
            highest_level: formatTokenMetricsNumber(priceLevels[priceLevels.length - 1], 'currency'),
            total_range: formatTokenMetricsNumber(priceLevels[priceLevels.length - 1] - priceLevels[0], 'currency')
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
            description: `Strong support at ${formatTokenMetricsNumber(level.PRICE_LEVEL || level.LEVEL_PRICE, 'currency')}`,
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            strategy: "Consider long positions on bounces from this level",
            risk_management: "Set stop-loss below support level"
        });
    });
    
    strongResistance.forEach(level => {
        opportunities.push({
            type: "Short Entry Opportunity",
            description: `Strong resistance at ${formatTokenMetricsNumber(level.PRICE_LEVEL || level.LEVEL_PRICE, 'currency')}`,
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
            recommendation: `Place stop-losses below ${formatTokenMetricsNumber(nearestSupport.PRICE_LEVEL || nearestSupport.LEVEL_PRICE, 'currency')} support level`,
            rationale: "Support break indicates trend reversal or acceleration"
        });
    }
    
    // Take-profit guidance
    if (resistanceLevels.length > 0) {
        const nearestResistance = resistanceLevels
            .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))[0];
        
        guidance.push({
            type: "Take-Profit Placement",
            recommendation: `Consider taking profits near ${formatTokenMetricsNumber(nearestResistance.PRICE_LEVEL || nearestResistance.LEVEL_PRICE, 'currency')} resistance level`,
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
            price_level: formatTokenMetricsNumber(level.PRICE_LEVEL || level.LEVEL_PRICE, 'currency'),
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
            price: formatTokenMetricsNumber(level.PRICE_LEVEL || level.LEVEL_PRICE, 'currency'),
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
        events.push(`Break above ${formatTokenMetricsNumber(strongestResistance.PRICE_LEVEL || strongestResistance.LEVEL_PRICE, 'currency')} resistance could trigger upside breakout`);
    }
    
    if (strongestSupport) {
        events.push(`Break below ${formatTokenMetricsNumber(strongestSupport.PRICE_LEVEL || strongestSupport.LEVEL_PRICE, 'currency')} support could trigger downside breakdown`);
    }
    
    if (events.length === 0) {
        events.push("Monitor for clear level breaks to identify directional moves");
    }
    
    return events;
}
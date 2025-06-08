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
import type { ScenarioAnalysisResponse } from "../types";

// Zod schema for scenario analysis request validation
const ScenarioAnalysisRequestSchema = z.object({
    cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
    token_id: z.number().optional().describe("Specific token ID if known"),
    symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
    limit: z.number().min(1).max(100).optional().describe("Number of scenarios to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["risk_assessment", "portfolio_planning", "stress_testing", "all"]).optional().describe("Type of analysis to focus on")
});

type ScenarioAnalysisRequest = z.infer<typeof ScenarioAnalysisRequestSchema>;

// AI extraction template for natural language processing
const SCENARIO_ANALYSIS_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting scenario analysis requests from natural language.

The user wants to get price predictions based on different cryptocurrency market scenarios. Extract the following information:

1. **cryptocurrency** (optional): The name or symbol of the cryptocurrency
   - Look for token names like "Bitcoin", "Ethereum", "BTC", "ETH"
   - Can be a specific token or general request

2. **token_id** (optional): Specific token ID if mentioned
   - Usually a number like "3375" for Bitcoin

3. **symbol** (optional): Token symbol
   - Extract symbols like "BTC", "ETH", "ADA", etc.

4. **limit** (optional, default: 20): Number of scenarios to return

5. **page** (optional, default: 1): Page number for pagination

6. **analysisType** (optional, default: "all"): What type of analysis they want
   - "risk_assessment" - focus on downside risks and worst-case scenarios
   - "portfolio_planning" - focus on scenarios for portfolio allocation
   - "stress_testing" - focus on extreme market conditions
   - "all" - comprehensive scenario analysis

Examples:
- "Get scenario analysis for Bitcoin" → {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Show me risk scenarios for ETH" → {cryptocurrency: "Ethereum", symbol: "ETH", analysisType: "risk_assessment"}
- "Portfolio planning scenarios for crypto" → {analysisType: "portfolio_planning"}
- "Stress test scenarios for market crash" → {analysisType: "stress_testing"}

Extract the request details from the user's message.
`;

/**
 * SCENARIO ANALYSIS ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/scenario-analysis
 * 
 * This action gets the price prediction based on different Crypto Market scenarios.
 * Essential for risk assessment, portfolio planning, and strategic decision making.
 */
export const getScenarioAnalysisAction: Action = {
    name: "GET_SCENARIO_ANALYSIS_TOKENMETRICS",
    description: "Get price predictions based on different cryptocurrency market scenarios from TokenMetrics for risk assessment and strategic planning",
    similes: [
        "get scenario analysis",
        "scenario predictions",
        "market scenarios",
        "price scenarios",
        "scenario modeling",
        "what if analysis",
        "market scenario planning",
        "stress testing",
        "risk scenarios"
    ],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get scenario analysis for Bitcoin"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve price scenario analysis for Bitcoin under different market conditions.",
                    action: "GET_SCENARIO_ANALYSIS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me risk scenarios for portfolio planning"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get comprehensive scenario analysis for portfolio risk assessment and planning.",
                    action: "GET_SCENARIO_ANALYSIS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Stress test scenarios for market crash"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve stress testing scenarios for extreme market conditions.",
                    action: "GET_SCENARIO_ANALYSIS_TOKENMETRICS"
                }
            }
        ]
    ],
    
    async handler(runtime, message, _state) {
        try {
            const requestId = generateRequestId();
            console.log(`[${requestId}] Processing scenario analysis request...`);
            
            // Extract structured request using AI
            const scenarioRequest = await extractTokenMetricsRequest<ScenarioAnalysisRequest>(
                runtime,
                message,
                _state || await runtime.composeState(message),
                SCENARIO_ANALYSIS_EXTRACTION_TEMPLATE,
                ScenarioAnalysisRequestSchema,
                requestId
            );
            
            console.log(`[${requestId}] Extracted request:`, scenarioRequest);
            
            // Apply defaults for optional fields
            const processedRequest = {
                cryptocurrency: scenarioRequest.cryptocurrency,
                token_id: scenarioRequest.token_id,
                symbol: scenarioRequest.symbol,
                limit: scenarioRequest.limit || 20,
                page: scenarioRequest.page || 1,
                analysisType: scenarioRequest.analysisType || "all"
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
                "/v2/scenario-analysis",
                apiParams,
                runtime
            );
            
            console.log(`[${requestId}] API response received, processing data...`);
            
            // Process response data
            const scenarioData = Array.isArray(response) ? response : response.data || [];
            
            // Analyze the scenario data based on requested analysis type
            const scenarioAnalysis = analyzeScenarioData(scenarioData, processedRequest.analysisType);
            
            const result = {
                success: true,
                message: `Successfully retrieved ${scenarioData.length} scenario analysis data points from TokenMetrics`,
                request_id: requestId,
                scenario_data: scenarioData,
                analysis: scenarioAnalysis,
                metadata: {
                    endpoint: "scenario-analysis",
                    requested_token: processedRequest.cryptocurrency || processedRequest.symbol || processedRequest.token_id,
                    resolved_token: resolvedToken,
                    analysis_focus: processedRequest.analysisType,
                    pagination: {
                        page: processedRequest.page,
                        limit: processedRequest.limit
                    },
                    data_points: scenarioData.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Scenario Modeling Engine"
                },
                scenario_explanation: {
                    purpose: "Evaluate potential price outcomes under different market conditions for informed decision making",
                    scenario_types: [
                        "Bull Market - Optimistic market conditions with strong growth",
                        "Bear Market - Pessimistic conditions with significant declines",
                        "Base Case - Most likely scenario based on current trends",
                        "Extreme Scenarios - Low probability but high impact events"
                    ],
                    usage_guidelines: [
                        "Use for risk assessment and portfolio stress testing",
                        "Plan position sizing based on downside scenarios",
                        "Set profit targets based on upside scenarios",
                        "Develop contingency plans for extreme scenarios"
                    ],
                    interpretation: [
                        "Higher probability scenarios should drive primary strategy",
                        "Low probability scenarios help with risk management",
                        "Price ranges provide better insight than point estimates",
                        "Scenario analysis is probabilistic, not predictive"
                    ]
                }
            };
            
            console.log(`[${requestId}] Scenario analysis completed successfully`);
            return result;
            
        } catch (error) {
            console.error("Error in getScenarioAnalysisAction:", error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve scenario analysis from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/scenario-analysis is accessible",
                    parameter_validation: [
                        "Verify token_id is a valid number or symbol is a valid string",
                        "Check that pagination parameters are positive integers",
                        "Ensure your API key has access to scenario analysis endpoint",
                        "Confirm the token has sufficient data for scenario modeling"
                    ],
                    common_solutions: [
                        "Try using a major token (BTC, ETH) to test functionality",
                        "Check if your subscription includes scenario analysis access",
                        "Verify the token has been analyzed by TokenMetrics modeling engine",
                        "Ensure sufficient market data exists for scenario generation"
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
 * Comprehensive analysis of scenario data for risk assessment and strategic planning
 */
function analyzeScenarioData(scenarioData: any[], analysisType: string = "all"): any {
    if (!scenarioData || scenarioData.length === 0) {
        return {
            summary: "No scenario analysis data available",
            risk_assessment: "Cannot assess",
            insights: []
        };
    }
    
    // Core analysis components
    const scenarioBreakdown = analyzeScenarioBreakdown(scenarioData);
    const riskAssessment = assessScenarioRisks(scenarioData);
    const opportunityAnalysis = analyzeScenarioOpportunities(scenarioData);
    const probabilityAnalysis = analyzeProbabilityDistribution(scenarioData);
    
    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "risk_assessment":
            focusedAnalysis = {
                risk_focus: {
                    downside_scenarios: identifyDownsideScenarios(scenarioData),
                    worst_case_analysis: analyzeWorstCaseScenarios(scenarioData),
                    risk_mitigation: generateRiskMitigationStrategies(riskAssessment.max_drawdown || 0, riskAssessment.downside_scenarios || 0),
                    risk_insights: [
                        `⚠️ Downside scenarios: ${riskAssessment.downside_scenarios || 0}`,
                        `📉 Maximum potential loss: ${riskAssessment.max_loss || 'Unknown'}`,
                        `🛡️ Risk level: ${riskAssessment.overall_risk_level || 'Unknown'}`
                    ]
                }
            };
            break;
            
        case "portfolio_planning":
            focusedAnalysis = {
                portfolio_focus: {
                    allocation_scenarios: generateAllocationScenarios(scenarioData),
                    diversification_impact: analyzeDiversificationImpact(scenarioData),
                    rebalancing_triggers: identifyRebalancingTriggers(scenarioData),
                    portfolio_insights: [
                        `📊 Allocation scenarios: ${scenarioBreakdown.scenario_types || 0}`,
                        `🎯 Optimal allocation: ${opportunityAnalysis.optimal_allocation || 'Balanced'}`,
                        `⚖️ Risk-return profile: ${riskAssessment.risk_return_profile || 'Moderate'}`
                    ]
                }
            };
            break;
            
        case "stress_testing":
            focusedAnalysis = {
                stress_focus: {
                    extreme_scenarios: identifyExtremeScenarios(scenarioData),
                    stress_test_results: performStressTests(scenarioData),
                    survival_analysis: analyzeSurvivalProbability(scenarioData),
                    stress_insights: [
                        `🔥 Extreme scenarios: ${riskAssessment.extreme_scenarios || 0}`,
                        `💪 Stress test score: ${riskAssessment.stress_score || 'Unknown'}`,
                        `🎯 Survival probability: ${riskAssessment.survival_probability || 'Unknown'}`
                    ]
                }
            };
            break;
    }
    
    return {
        summary: `Scenario analysis across ${scenarioData.length} scenarios shows ${riskAssessment.overall_risk_level} risk with ${opportunityAnalysis.upside_potential} upside potential`,
        analysis_type: analysisType,
        scenario_breakdown: scenarioBreakdown,
        risk_assessment: riskAssessment,
        opportunity_analysis: opportunityAnalysis,
        probability_analysis: probabilityAnalysis,
        insights: generateScenarioInsights(scenarioBreakdown, riskAssessment, opportunityAnalysis),
        strategic_recommendations: generateStrategicRecommendations(riskAssessment, opportunityAnalysis, probabilityAnalysis),
        ...focusedAnalysis,
        data_quality: {
            source: "TokenMetrics Scenario Modeling Engine",
            scenarios_analyzed: scenarioData.length,
            coverage_completeness: assessScenarioCoverage(scenarioData),
            model_sophistication: assessModelSophistication(scenarioData)
        },
        portfolio_implications: generatePortfolioImplications(scenarioData, analysisType)
    };
}

function analyzeScenarioBreakdown(scenarioData: any[]): any {
    const scenarios = new Map();
    
    // Group scenarios by type
    scenarioData.forEach(scenario => {
        const type = scenario.SCENARIO_TYPE || scenario.TYPE || categorizeScenario(scenario);
        if (!scenarios.has(type)) {
            scenarios.set(type, []);
        }
        scenarios.get(type).push(scenario);
    });
    
    // Analyze each scenario type
    const scenarioAnalysis = Array.from(scenarios.entries()).map(([type, scenarios]) => {
        const prices = scenarios.map((s: any) => s.PREDICTED_PRICE || s.PRICE_TARGET).filter((p: any) => p && p > 0);
        const probabilities = scenarios.map((s: any) => s.PROBABILITY || s.LIKELIHOOD).filter((p: any) => p !== null && p !== undefined);
        
        const avgPrice = prices.length > 0 ? prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const avgProbability = probabilities.length > 0 ? probabilities.reduce((sum: number, prob: number) => sum + prob, 0) / probabilities.length : 0;
        
        return {
            scenario_type: type,
            scenario_count: scenarios.length,
            average_price: formatCurrency(avgPrice),
            price_range: {
                min: formatCurrency(minPrice),
                max: formatCurrency(maxPrice),
                spread: formatCurrency(maxPrice - minPrice)
            },
            average_probability: `${avgProbability.toFixed(1)}%`,
            scenarios_detail: scenarios.slice(0, 3).map((s: any) => ({
                description: s.SCENARIO_DESCRIPTION || s.DESCRIPTION || `${type} scenario`,
                price_target: formatCurrency(s.PREDICTED_PRICE || s.PRICE_TARGET),
                probability: s.PROBABILITY ? `${s.PROBABILITY}%` : 'N/A',
                timeframe: s.TIMEFRAME || s.TIME_HORIZON || 'Unknown'
            }))
        };
    }).sort((a, b) => parseFloat(b.average_probability) - parseFloat(a.average_probability));
    
    return {
        total_scenarios: scenarioData.length,
        scenario_types: scenarios.size,
        scenario_breakdown: scenarioAnalysis,
        most_likely_scenario: scenarioAnalysis[0]?.scenario_type || 'Unknown',
        scenario_diversity: assessScenarioDiversity(scenarioAnalysis)
    };
}

function assessScenarioRisks(scenarioData: any[]): any {
    const currentPrice = getCurrentPriceEstimate(scenarioData);
    const downSideScenarios = scenarioData.filter(s => 
        (s.PREDICTED_PRICE || s.PRICE_TARGET) < currentPrice * 0.9
    );
    
    const extremeDownside = scenarioData.filter(s => 
        (s.PREDICTED_PRICE || s.PRICE_TARGET) < currentPrice * 0.7
    );
    
    // Calculate risk metrics
    const maxDrawdown = scenarioData.reduce((maxDD, scenario) => {
        const price = scenario.PREDICTED_PRICE || scenario.PRICE_TARGET || currentPrice;
        const drawdown = (currentPrice - price) / currentPrice;
        return Math.max(maxDD, drawdown);
    }, 0);
    
    const averageDownside = downSideScenarios.length > 0 ?
        downSideScenarios.reduce((sum, s) => {
            const price = s.PREDICTED_PRICE || s.PRICE_TARGET;
            return sum + ((currentPrice - price) / currentPrice);
        }, 0) / downSideScenarios.length : 0;
    
    // Risk categorization
    let riskLevel;
    if (maxDrawdown > 0.6) riskLevel = "Very High";
    else if (maxDrawdown > 0.4) riskLevel = "High";
    else if (maxDrawdown > 0.25) riskLevel = "Moderate";
    else if (maxDrawdown > 0.15) riskLevel = "Low";
    else riskLevel = "Very Low";
    
    return {
        overall_risk_level: riskLevel,
        max_potential_drawdown: formatPercentage(maxDrawdown * 100),
        downside_scenarios: downSideScenarios.length,
        extreme_downside_scenarios: extremeDownside.length,
        average_downside: formatPercentage(averageDownside * 100),
        risk_factors: identifyRiskFactors(downSideScenarios),
        worst_case_scenario: identifyWorstCaseScenario(scenarioData),
        risk_mitigation: generateRiskMitigationStrategies(maxDrawdown, downSideScenarios.length)
    };
}

function analyzeScenarioOpportunities(scenarioData: any[]): any {
    const currentPrice = getCurrentPriceEstimate(scenarioData);
    const upsideScenarios = scenarioData.filter(s => 
        (s.PREDICTED_PRICE || s.PRICE_TARGET) > currentPrice * 1.1
    );
    
    const extremeUpside = scenarioData.filter(s => 
        (s.PREDICTED_PRICE || s.PRICE_TARGET) > currentPrice * 1.5
    );
    
    // Calculate opportunity metrics
    const maxUpside = scenarioData.reduce((maxUp, scenario) => {
        const price = scenario.PREDICTED_PRICE || scenario.PRICE_TARGET || currentPrice;
        const upside = (price - currentPrice) / currentPrice;
        return Math.max(maxUp, upside);
    }, 0);
    
    const averageUpside = upsideScenarios.length > 0 ?
        upsideScenarios.reduce((sum, s) => {
            const price = s.PREDICTED_PRICE || s.PRICE_TARGET;
            return sum + ((price - currentPrice) / currentPrice);
        }, 0) / upsideScenarios.length : 0;
    
    // Opportunity categorization
    let upsidePotential;
    if (maxUpside > 3) upsidePotential = "Exceptional";
    else if (maxUpside > 2) upsidePotential = "Very High";
    else if (maxUpside > 1) upsidePotential = "High";
    else if (maxUpside > 0.5) upsidePotential = "Moderate";
    else upsidePotential = "Limited";
    
    return {
        upside_potential: upsidePotential,
        max_potential_upside: formatPercentage(maxUpside * 100),
        upside_scenarios: upsideScenarios.length,
        extreme_upside_scenarios: extremeUpside.length,
        average_upside: formatPercentage(averageUpside * 100),
        opportunity_drivers: identifyOpportunityDrivers(upsideScenarios),
        best_case_scenario: identifyBestCaseScenario(scenarioData),
        opportunity_capture: generateOpportunityCaptureStrategies(maxUpside, upsideScenarios.length)
    };
}

function analyzeProbabilityDistribution(scenarioData: any[]): any {
    const probabilityData = scenarioData
        .filter(s => s.PROBABILITY !== null && s.PROBABILITY !== undefined)
        .map(s => ({
            probability: s.PROBABILITY,
            price: s.PREDICTED_PRICE || s.PRICE_TARGET,
            type: s.SCENARIO_TYPE || s.TYPE
        }));
    
    if (probabilityData.length === 0) {
        return { distribution: "No probability data available" };
    }
    
    // Calculate weighted average price
    const totalProbability = probabilityData.reduce((sum, item) => sum + item.probability, 0);
    const weightedAveragePrice = probabilityData.reduce((sum, item) => {
        return sum + (item.price * item.probability / totalProbability);
    }, 0);
    
    // Analyze probability buckets
    const highProbability = probabilityData.filter(item => item.probability > 30);
    const mediumProbability = probabilityData.filter(item => item.probability > 15 && item.probability <= 30);
    const lowProbability = probabilityData.filter(item => item.probability <= 15);
    
    return {
        total_scenarios_with_probability: probabilityData.length,
        weighted_average_price: formatCurrency(weightedAveragePrice),
        probability_distribution: {
            high_probability: `${highProbability.length} scenarios (>30% probability)`,
            medium_probability: `${mediumProbability.length} scenarios (15-30% probability)`,
            low_probability: `${lowProbability.length} scenarios (<15% probability)`
        },
        most_probable_scenarios: highProbability.slice(0, 3).map(item => ({
            scenario_type: item.type,
            probability: `${item.probability}%`,
            price_target: formatCurrency(item.price)
        })),
        confidence_level: assessConfidenceLevel(probabilityData)
    };
}

function generatePortfolioImplications(scenarioData: any[], analysisType: string): any {
    const implications = [];
    const recommendations = [];
    
    // Risk-based implications
    const riskMetrics = assessScenarioRisks(scenarioData);
    if (riskMetrics.overall_risk_level === "Very High" || riskMetrics.overall_risk_level === "High") {
        implications.push("High downside risk suggests conservative position sizing");
        recommendations.push("Limit exposure to 2-5% of total portfolio");
        recommendations.push("Use tight stop-losses or options for downside protection");
    } else if (riskMetrics.overall_risk_level === "Low" || riskMetrics.overall_risk_level === "Very Low") {
        implications.push("Low downside risk supports larger position sizes");
        recommendations.push("Can consider 5-15% portfolio allocation");
    }
    
    // Opportunity-based implications
    const opportunityMetrics = analyzeScenarioOpportunities(scenarioData);
    if (opportunityMetrics.upside_potential === "Exceptional" || opportunityMetrics.upside_potential === "Very High") {
        implications.push("Exceptional upside potential justifies higher allocation consideration");
        recommendations.push("Consider using options strategies to amplify upside exposure");
    }
    
    // Scenario diversity implications
    const scenarioBreakdown = analyzeScenarioBreakdown(scenarioData);
    if (scenarioBreakdown.scenario_diversity === "High") {
        implications.push("High scenario diversity requires flexible strategy adaptation");
        recommendations.push("Prepare multiple exit strategies for different scenarios");
    }
    
    return {
        key_implications: implications,
        allocation_recommendations: recommendations,
        position_sizing_guidance: generatePositionSizingGuidance(riskMetrics, opportunityMetrics),
        hedging_strategies: generateHedgingStrategies(riskMetrics),
        monitoring_requirements: generateMonitoringRequirements(scenarioData),
        analysis_type: analysisType
    };
}

function generateScenarioInsights(scenarioBreakdown: any, riskAssessment: any, opportunityAnalysis: any): string[] {
    const insights = [];
    
    // Scenario coverage insights
    if (scenarioBreakdown.scenario_types >= 4) {
        insights.push(`Comprehensive scenario coverage with ${scenarioBreakdown.scenario_types} different scenario types provides robust analysis foundation`);
    } else if (scenarioBreakdown.scenario_types < 3) {
        insights.push("Limited scenario diversity may not capture full range of potential outcomes");
    }
    
    // Risk-reward insights
    const maxDrawdown = parseFloat(riskAssessment.max_potential_drawdown);
    const maxUpside = parseFloat(opportunityAnalysis.max_potential_upside);
    
    if (maxUpside > maxDrawdown * 2) {
        insights.push("Favorable risk-reward profile with upside potential significantly exceeding downside risk");
    } else if (maxDrawdown > maxUpside * 1.5) {
        insights.push("Unfavorable risk-reward profile with downside risk exceeding upside potential");
    } else {
        insights.push("Balanced risk-reward profile requires careful position sizing and risk management");
    }
    
    // Probability insights
    if (scenarioBreakdown.most_likely_scenario) {
        insights.push(`${scenarioBreakdown.most_likely_scenario} scenario has highest probability - plan primary strategy around this outcome`);
    }
    
    // Extreme scenario insights
    if (riskAssessment.extreme_downside_scenarios > 0) {
        insights.push(`${riskAssessment.extreme_downside_scenarios} extreme downside scenarios require robust risk management protocols`);
    }
    
    if (opportunityAnalysis.extreme_upside_scenarios > 0) {
        insights.push(`${opportunityAnalysis.extreme_upside_scenarios} extreme upside scenarios suggest potential for significant outperformance`);
    }
    
    return insights;
}

function generateStrategicRecommendations(riskAssessment: any, opportunityAnalysis: any, probabilityAnalysis: any): any {
    const recommendations = [];
    let primaryStrategy = "Balanced";
    
    // Risk-based recommendations
    if (riskAssessment.overall_risk_level === "Very High") {
        recommendations.push("Implement strict risk controls and defensive positioning");
        primaryStrategy = "Defensive";
    } else if (riskAssessment.overall_risk_level === "Low") {
        recommendations.push("Low risk environment supports more aggressive positioning");
    }
    
    // Opportunity-based recommendations
    if (opportunityAnalysis.upside_potential === "Exceptional") {
        recommendations.push("Exceptional upside potential justifies concentrated allocation");
        if (primaryStrategy !== "Defensive") primaryStrategy = "Aggressive Growth";
    } else if (opportunityAnalysis.upside_potential === "Limited") {
        recommendations.push("Limited upside suggests exploring alternative opportunities");
    }
    
    // Probability-based recommendations
    if (probabilityAnalysis.confidence_level === "High") {
        recommendations.push("High confidence in scenarios supports conviction-based positioning");
    } else if (probabilityAnalysis.confidence_level === "Low") {
        recommendations.push("Low scenario confidence requires hedged approach and flexibility");
    }
    
    // Scenario-specific recommendations
    recommendations.push("Develop specific action plans for top 3 most probable scenarios");
    recommendations.push("Set clear triggers for strategy adjustment as scenarios unfold");
    recommendations.push("Regular scenario review and model updates as new data emerges");
    
    return {
        primary_strategy: primaryStrategy,
        strategic_recommendations: recommendations,
        implementation_priorities: generateImplementationPriorities(riskAssessment, opportunityAnalysis),
        contingency_planning: generateContingencyPlanning(riskAssessment, opportunityAnalysis)
    };
}

function generateStressTestingGuidance(scenarioData: any[]): any {
    const stressTests = [];
    
    // Identify stress scenarios
    const currentPrice = getCurrentPriceEstimate(scenarioData);
    const stressScenarios = scenarioData.filter(s => {
        const price = s.PREDICTED_PRICE || s.PRICE_TARGET;
        return price < currentPrice * 0.8 || price > currentPrice * 1.5;
    });
    
    stressTests.push({
        test_name: "Maximum Drawdown Test",
        description: "Portfolio impact under worst-case scenario",
        guidance: "Calculate portfolio loss if maximum drawdown scenario occurs"
    });
    
    stressTests.push({
        test_name: "Probability-Weighted Test",
        description: "Expected portfolio performance across all scenarios",
        guidance: "Weight each scenario by probability for expected outcome calculation"
    });
    
    stressTests.push({
        test_name: "Extreme Event Test",
        description: "Portfolio survival under extreme scenarios",
        guidance: "Ensure portfolio can survive even low-probability extreme events"
    });
    
    return {
        stress_scenarios_identified: stressScenarios.length,
        recommended_stress_tests: stressTests,
        testing_frequency: "Monthly review of scenario assumptions and quarterly stress testing",
        key_metrics_to_monitor: [
            "Maximum portfolio drawdown under worst case",
            "Probability-weighted expected return",
            "Time to recovery from maximum drawdown",
            "Liquidity requirements under stress"
        ]
    };
}

// Helper functions

function categorizeScenario(scenario: any): string {
    const price = scenario.PREDICTED_PRICE || scenario.PRICE_TARGET;
    const description = (scenario.SCENARIO_DESCRIPTION || scenario.DESCRIPTION || '').toLowerCase();
    
    if (description.includes('bull') || description.includes('optimistic')) return 'Bull Market';
    if (description.includes('bear') || description.includes('pessimistic')) return 'Bear Market';
    if (description.includes('base') || description.includes('likely')) return 'Base Case';
    if (description.includes('extreme') || description.includes('crash')) return 'Extreme Event';
    
    // Fallback categorization based on price
    const currentPrice = 50000; // This would need to be dynamic in real implementation
    if (price > currentPrice * 1.3) return 'Bullish Scenario';
    if (price < currentPrice * 0.7) return 'Bearish Scenario';
    return 'Neutral Scenario';
}

function getCurrentPriceEstimate(scenarioData: any[]): number {
    // In real implementation, this would get current market price
    // For now, use base case scenario or average
    const baseCases = scenarioData.filter(s => 
        (s.SCENARIO_TYPE || s.TYPE || '').toLowerCase().includes('base')
    );
    
    if (baseCases.length > 0) {
        return baseCases[0].PREDICTED_PRICE || baseCases[0].PRICE_TARGET || 50000;
    }
    
    const allPrices = scenarioData.map(s => s.PREDICTED_PRICE || s.PRICE_TARGET).filter(p => p > 0);
    return allPrices.length > 0 ? allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length : 50000;
}

function identifyRiskFactors(downSideScenarios: any[]): string[] {
    const factors = new Set<string>();
    
    downSideScenarios.forEach(scenario => {
        const description = scenario.SCENARIO_DESCRIPTION || scenario.DESCRIPTION || '';
        const type = scenario.SCENARIO_TYPE || scenario.TYPE || '';
        
        if (description.toLowerCase().includes('regulation')) factors.add('Regulatory risks');
        if (description.toLowerCase().includes('crash') || description.toLowerCase().includes('bubble')) factors.add('Market bubble burst');
        if (description.toLowerCase().includes('macro') || description.toLowerCase().includes('recession')) factors.add('Macroeconomic downturn');
        if (description.toLowerCase().includes('technical') || description.toLowerCase().includes('hack')) factors.add('Technical vulnerabilities');
        if (description.toLowerCase().includes('adoption') || description.toLowerCase().includes('demand')) factors.add('Adoption challenges');
    });
    
    if (factors.size === 0) {
        factors.add('General market volatility');
        factors.add('Liquidity constraints');
    }
    
    return Array.from(factors);
}

function identifyOpportunityDrivers(upsideScenarios: any[]): string[] {
    const drivers = new Set<string>();
    
    upsideScenarios.forEach(scenario => {
        const description = scenario.SCENARIO_DESCRIPTION || scenario.DESCRIPTION || '';
        
        if (description.toLowerCase().includes('adoption')) drivers.add('Mass adoption');
        if (description.toLowerCase().includes('institutional')) drivers.add('Institutional investment');
        if (description.toLowerCase().includes('breakthrough') || description.toLowerCase().includes('innovation')) drivers.add('Technology breakthrough');
        if (description.toLowerCase().includes('etf') || description.toLowerCase().includes('approval')) drivers.add('Regulatory approval');
        if (description.toLowerCase().includes('bull') || description.toLowerCase().includes('rally')) drivers.add('Market momentum');
    });
    
    if (drivers.size === 0) {
        drivers.add('Market growth');
        drivers.add('Increased demand');
    }
    
    return Array.from(drivers);
}

function identifyWorstCaseScenario(scenarioData: any[]): any {
    const currentPrice = getCurrentPriceEstimate(scenarioData);
    const worstCase = scenarioData.reduce((worst, scenario) => {
        const price = scenario.PREDICTED_PRICE || scenario.PRICE_TARGET;
        const worstPrice = worst.PREDICTED_PRICE || worst.PRICE_TARGET || currentPrice;
        return price < worstPrice ? scenario : worst;
    }, scenarioData[0] || {});
    
    const worstPrice = worstCase.PREDICTED_PRICE || worstCase.PRICE_TARGET || currentPrice;
    const drawdown = ((currentPrice - worstPrice) / currentPrice) * 100;
    
    return {
        scenario_description: worstCase.SCENARIO_DESCRIPTION || worstCase.DESCRIPTION || 'Extreme downside scenario',
        price_target: formatCurrency(worstPrice),
        potential_loss: formatPercentage(drawdown),
        probability: worstCase.PROBABILITY ? `${worstCase.PROBABILITY}%` : 'Unknown'
    };
}

function identifyBestCaseScenario(scenarioData: any[]): any {
    const currentPrice = getCurrentPriceEstimate(scenarioData);
    const bestCase = scenarioData.reduce((best, scenario) => {
        const price = scenario.PREDICTED_PRICE || scenario.PRICE_TARGET;
        const bestPrice = best.PREDICTED_PRICE || best.PRICE_TARGET || currentPrice;
        return price > bestPrice ? scenario : best;
    }, scenarioData[0] || {});
    
    const bestPrice = bestCase.PREDICTED_PRICE || bestCase.PRICE_TARGET || currentPrice;
    const upside = ((bestPrice - currentPrice) / currentPrice) * 100;
    
    return {
        scenario_description: bestCase.SCENARIO_DESCRIPTION || bestCase.DESCRIPTION || 'Extreme upside scenario',
        price_target: formatCurrency(bestPrice),
        potential_gain: formatPercentage(upside),
        probability: bestCase.PROBABILITY ? `${bestCase.PROBABILITY}%` : 'Unknown'
    };
}

function assessScenarioDiversity(scenarioAnalysis: any[]): string {
    const typeCount = scenarioAnalysis.length;
    const priceSpread = scenarioAnalysis.reduce((maxSpread, scenario) => {
        const spread = parseFloat(scenario.price_range.spread.replace(/[$,]/g, ''));
        return Math.max(maxSpread, spread);
    }, 0);
    
    if (typeCount >= 5 && priceSpread > 10000) return "Very High";
    if (typeCount >= 4 && priceSpread > 5000) return "High";
    if (typeCount >= 3) return "Moderate";
    return "Low";
}

function generateRiskMitigationStrategies(maxDrawdown: number, downsideCount: number): string[] {
    const strategies = [];
    
    if (maxDrawdown > 0.5) {
        strategies.push("Use position sizing limits (max 3-5% of portfolio)");
        strategies.push("Implement stop-loss orders at key technical levels");
        strategies.push("Consider protective put options for downside protection");
    } else if (maxDrawdown > 0.3) {
        strategies.push("Moderate position sizing (5-10% of portfolio)");
        strategies.push("Use trailing stops to protect profits");
    }
    
    if (downsideCount > 3) {
        strategies.push("Diversify across multiple assets to reduce concentration risk");
        strategies.push("Maintain higher cash allocation for opportunistic buying");
    }
    
    strategies.push("Regular portfolio rebalancing based on scenario updates");
    
    return strategies;
}

function generateOpportunityCaptureStrategies(maxUpside: number, upsideCount: number): string[] {
    const strategies = [];
    
    if (maxUpside > 2) {
        strategies.push("Consider using call options to amplify upside exposure");
        strategies.push("Scale into positions on weakness to maximize upside capture");
    } else if (maxUpside > 1) {
        strategies.push("Standard position sizing with upside profit targets");
    }
    
    if (upsideCount > 3) {
        strategies.push("Multiple profit-taking levels based on different upside scenarios");
        strategies.push("Partial position scaling to capture various upside targets");
    }
    
    strategies.push("Monitor scenario probability changes for tactical adjustments");
    
    return strategies;
}

function assessConfidenceLevel(probabilityData: any[]): string {
    const totalProbability = probabilityData.reduce((sum, item) => sum + item.probability, 0);
    const highProbabilityScenarios = probabilityData.filter(item => item.probability > 25).length;
    
    if (totalProbability > 90 && highProbabilityScenarios > 0) return "High";
    if (totalProbability > 70) return "Moderate";
    if (totalProbability > 50) return "Low";
    return "Very Low";
}

function generatePositionSizingGuidance(riskMetrics: any, opportunityMetrics: any): string {
    const risk = riskMetrics.overall_risk_level;
    const opportunity = opportunityMetrics.upside_potential;
    
    if (risk === "Very High") return "Conservative sizing: 1-3% of portfolio maximum";
    if (risk === "High" && opportunity === "Exceptional") return "Moderate sizing: 3-7% with tight risk controls";
    if (risk === "Moderate" && opportunity === "High") return "Standard sizing: 5-12% with normal risk management";
    if (risk === "Low" && opportunity === "Very High") return "Aggressive sizing: 10-20% with profit protection";
    
    return "Balanced sizing: 5-10% with standard risk management";
}

function generateHedgingStrategies(riskMetrics: any): string[] {
    const strategies = [];
    
    if (riskMetrics.overall_risk_level === "Very High" || riskMetrics.overall_risk_level === "High") {
        strategies.push("Consider protective puts for downside protection");
        strategies.push("Use correlation analysis for portfolio hedging");
        strategies.push("Implement collar strategies (protective put + covered call)");
    }
    
    strategies.push("Monitor VIX and implied volatility for hedging timing");
    strategies.push("Consider inverse ETFs for portfolio protection");
    
    return strategies;
}

function generateMonitoringRequirements(scenarioData: any[]): string[] {
    const requirements = [];
    
    requirements.push("Weekly review of scenario probability changes");
    requirements.push("Monitor key assumption variables that drive scenarios");
    requirements.push("Track early warning indicators for scenario shifts");
    requirements.push("Quarterly full scenario model validation and updates");
    
    if (scenarioData.some(s => s.SCENARIO_TYPE?.includes('regulation'))) {
        requirements.push("Daily monitoring of regulatory developments");
    }
    
    if (scenarioData.some(s => s.SCENARIO_TYPE?.includes('technical'))) {
        requirements.push("Technical indicator monitoring for trend changes");
    }
    
    return requirements;
}

function generateImplementationPriorities(riskAssessment: any, opportunityAnalysis: any): string[] {
    const priorities = [];
    
    if (riskAssessment.overall_risk_level === "Very High") {
        priorities.push("1. Implement comprehensive risk management framework");
        priorities.push("2. Establish position sizing limits and stop-loss protocols");
        priorities.push("3. Set up hedging mechanisms");
    } else {
        priorities.push("1. Establish position sizing based on scenario probabilities");
        priorities.push("2. Set profit targets based on upside scenarios");
    }
    
    priorities.push("3. Create scenario monitoring dashboard");
    priorities.push("4. Develop contingency plans for extreme scenarios");
    
    return priorities;
}

function generateContingencyPlanning(riskAssessment: any, opportunityAnalysis: any): any {
    const plans = [];
    
    if (riskAssessment.extreme_downside_scenarios > 0) {
        plans.push({
            trigger: "Extreme downside scenario begins to unfold",
            actions: ["Reduce position size immediately", "Activate hedging strategies", "Preserve capital for recovery"]
        });
    }
    
    if (opportunityAnalysis.extreme_upside_scenarios > 0) {
        plans.push({
            trigger: "Extreme upside scenario develops",
            actions: ["Scale into position gradually", "Set trailing stops", "Prepare profit-taking strategy"]
        });
    }
    
    plans.push({
        trigger: "Base case scenario deviates significantly",
        actions: ["Reassess scenario probabilities", "Adjust position sizing", "Update risk parameters"]
    });
    
    return {
        contingency_plans: plans,
        review_frequency: "Monthly scenario review with quarterly deep analysis",
        escalation_procedures: "Immediate review if any scenario probability changes by >20%"
    };
}

function assessScenarioCoverage(scenarioData: any[]): string {
    const scenarioTypes = new Set(scenarioData.map(s => s.SCENARIO_TYPE || s.TYPE || 'Unknown'));
    const priceRanges = scenarioData.map(s => s.PREDICTED_PRICE || s.PRICE_TARGET).filter(p => p > 0);
    
    const coverage = scenarioTypes.size;
    const priceSpread = priceRanges.length > 0 ? (Math.max(...priceRanges) - Math.min(...priceRanges)) / Math.min(...priceRanges) : 0;
    
    if (coverage >= 5 && priceSpread > 1) return "Comprehensive";
    if (coverage >= 4 && priceSpread > 0.5) return "Good";
    if (coverage >= 3) return "Adequate";
    return "Limited";
}

function assessModelSophistication(scenarioData: any[]): string {
    const withProbabilities = scenarioData.filter(s => s.PROBABILITY !== null && s.PROBABILITY !== undefined).length;
    const withTimeframes = scenarioData.filter(s => s.TIMEFRAME || s.TIME_HORIZON).length;
    const withDescriptions = scenarioData.filter(s => s.SCENARIO_DESCRIPTION || s.DESCRIPTION).length;
    
    const sophisticationScore = (withProbabilities + withTimeframes + withDescriptions) / (scenarioData.length * 3);
    
    if (sophisticationScore > 0.8) return "Advanced";
    if (sophisticationScore > 0.6) return "Intermediate";
    if (sophisticationScore > 0.4) return "Basic";
    return "Simple";
}

// Additional analysis functions for focused analysis types

function identifyDownsideScenarios(scenarioData: any[]): any[] {
    const currentPrice = getCurrentPriceEstimate(scenarioData);
    return scenarioData.filter(scenario => {
        const price = scenario.PREDICTED_PRICE || scenario.PRICE_TARGET;
        return price && price < currentPrice * 0.9; // 10% or more decline
    });
}

function analyzeWorstCaseScenarios(scenarioData: any[]): any {
    const downside = identifyDownsideScenarios(scenarioData);
    const worstCase = identifyWorstCaseScenario(scenarioData);
    
    return {
        worst_case_scenario: worstCase,
        severe_scenarios: downside.filter(s => {
            const price = s.PREDICTED_PRICE || s.PRICE_TARGET;
            const currentPrice = getCurrentPriceEstimate(scenarioData);
            return price < currentPrice * 0.5; // 50% or more decline
        }).length,
        total_downside_scenarios: downside.length
    };
}

function generateAllocationScenarios(scenarioData: any[]): any[] {
    const scenarios = ["Conservative", "Moderate", "Aggressive"];
    return scenarios.map(type => ({
        allocation_type: type,
        recommended_exposure: type === "Conservative" ? "10-20%" : 
                             type === "Moderate" ? "20-40%" : "40-60%",
        risk_tolerance: type.toLowerCase(),
        scenario_count: Math.floor(scenarioData.length / 3)
    }));
}

function analyzeDiversificationImpact(scenarioData: any[]): any {
    return {
        correlation_impact: "Moderate",
        diversification_benefit: "Significant during market stress",
        recommended_allocation: "5-15% of portfolio",
        rebalancing_frequency: "Quarterly"
    };
}

function identifyRebalancingTriggers(scenarioData: any[]): string[] {
    return [
        "Price deviation >25% from target allocation",
        "Significant change in scenario probabilities",
        "New extreme scenarios identified",
        "Quarterly review regardless of performance"
    ];
}

function identifyExtremeScenarios(scenarioData: any[]): any[] {
    const currentPrice = getCurrentPriceEstimate(scenarioData);
    return scenarioData.filter(scenario => {
        const price = scenario.PREDICTED_PRICE || scenario.PRICE_TARGET;
        const probability = scenario.PROBABILITY || 0;
        return price && (
            price < currentPrice * 0.3 || // 70% decline
            price > currentPrice * 3 ||   // 200% gain
            probability < 5               // Very low probability
        );
    });
}

function performStressTests(scenarioData: any[]): any {
    const extremeScenarios = identifyExtremeScenarios(scenarioData);
    const worstCase = identifyWorstCaseScenario(scenarioData);
    
    return {
        stress_test_score: extremeScenarios.length > 3 ? "High Risk" : 
                          extremeScenarios.length > 1 ? "Moderate Risk" : "Low Risk",
        extreme_scenario_count: extremeScenarios.length,
        worst_case_impact: worstCase.potential_loss || "Unknown",
        stress_resistance: extremeScenarios.length < 2 ? "Strong" : "Weak"
    };
}

function analyzeSurvivalProbability(scenarioData: any[]): any {
    const totalScenarios = scenarioData.length;
    const severeDownside = scenarioData.filter(s => {
        const price = s.PREDICTED_PRICE || s.PRICE_TARGET;
        const currentPrice = getCurrentPriceEstimate(scenarioData);
        return price && price < currentPrice * 0.2; // 80% decline
    }).length;
    
    const survivalRate = ((totalScenarios - severeDownside) / totalScenarios) * 100;
    
    return {
        survival_probability: `${survivalRate.toFixed(1)}%`,
        severe_scenarios: severeDownside,
        survival_rating: survivalRate > 90 ? "Excellent" : 
                        survivalRate > 75 ? "Good" : 
                        survivalRate > 50 ? "Fair" : "Poor"
    };
}
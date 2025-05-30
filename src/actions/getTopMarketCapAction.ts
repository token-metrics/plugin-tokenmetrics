import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    formatTokenMetricsNumber,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { TopMarketCapResponse, TopMarketCapRequest } from "../types";

/**
 * Action to get top market cap tokens from TokenMetrics.
 * This action provides the list of cryptocurrencies with the highest market capitalizations,
 * which represents the most established and liquid tokens in the crypto market.
 * 
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/top-market-cap-tokens
 * 
 * This endpoint is particularly valuable for:
 * - Portfolio construction starting with established tokens
 * - Market overview and concentration analysis  
 * - Identifying market leaders and their performance
 * - Risk management through large-cap focused strategies
 * - Understanding market dynamics and sector representation
 * - Benchmarking individual token performance against market leaders
 * 
 * The top market cap tokens typically include Bitcoin, Ethereum, and other
 * major cryptocurrencies that dominate the total crypto market capitalization.
 */
export const getTopMarketCapAction: Action = {
    name: "getTopMarketCap",
    description: "Get the list of top cryptocurrency tokens by market capitalization from TokenMetrics for market analysis and portfolio construction",
    similes: [
        "get top market cap tokens",
        "top crypto by market cap",
        "largest cryptocurrencies",
        "biggest crypto tokens",
        "market cap leaders",
        "top tokens by size",
        "crypto market leaders",
        "largest crypto assets"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            // Extract parameters from the message content
            const messageContent = message.content as any;
            
            // Build request parameters for the real TokenMetrics top-market-cap-tokens endpoint
            const requestParams: TopMarketCapRequest = {
                // Optional limit parameter to control how many top tokens to return
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : undefined,
                
                // Optional category filter if user wants specific sectors
                category: typeof messageContent.category === 'string' ? messageContent.category : undefined,
            };
            
            // Validate all parameters according to TokenMetrics API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters for the API request
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Fetching top market cap tokens from TokenMetrics v2/top-market-cap-tokens endpoint");
            
            // Make the API call to the real TokenMetrics top-market-cap-tokens endpoint
            const response = await callTokenMetricsApi<TopMarketCapResponse>(
                TOKENMETRICS_ENDPOINTS.topMarketCap,
                apiParams,
                "GET"
            );
            
            // Format the response data for consistent structure
            const formattedData = formatTokenMetricsResponse<TopMarketCapResponse>(response, "getTopMarketCap");
            
            // Process the real API response structure
            const topTokens = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the top market cap data to provide strategic insights
            const marketAnalysis = analyzeTopMarketCapData(topTokens);
            
            // Return comprehensive analysis with market insights
            return {
                success: true,
                message: `Successfully retrieved top ${topTokens.length} tokens by market capitalization`,
                top_tokens: topTokens,
                analysis: marketAnalysis,
                // Include metadata about the request
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.topMarketCap,
                    tokens_returned: topTokens.length,
                    category_filter: requestParams.category,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                // Provide educational context about market cap analysis
                market_cap_education: {
                    what_is_market_cap: "Market Cap = Current Price × Circulating Supply",
                    why_it_matters: "Indicates the total value and relative size of each cryptocurrency",
                    risk_implications: {
                        large_cap: "Generally more stable, lower volatility, higher liquidity",
                        mid_cap: "Balanced risk-reward, moderate volatility",
                        small_cap: "Higher risk, higher potential returns, more volatile"
                    },
                    investment_strategy: [
                        "Large-cap tokens often form the foundation of crypto portfolios",
                        "Market cap leaders usually have better institutional adoption",
                        "Top tokens typically drive overall market sentiment",
                        "Concentration analysis helps understand market dynamics"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getTopMarketCapAction:", error);
            
            // Return detailed error information with troubleshooting guidance
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred while fetching top market cap tokens",
                message: "Failed to retrieve top market cap tokens from TokenMetrics API",
                // Include helpful troubleshooting steps for the real endpoint
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/top-market-cap-tokens is accessible",
                    parameter_validation: [
                        "Check that limit parameter is a positive integer if provided",
                        "Verify category parameter is a valid string if provided",
                        "Ensure your API key has access to top market cap endpoint"
                    ],
                    common_solutions: [
                        "Try the request without any parameters first",
                        "Check if your subscription includes market cap data",
                        "Verify TokenMetrics API service status",
                        "Test with a small limit parameter (e.g., limit=10)"
                    ]
                }
            };
        }
    },
    
    /**
     * Validate that the runtime environment supports top market cap data access.
     * This endpoint is usually available to most TokenMetrics API subscribers.
     */
    validate: async (runtime, _message) => {
        const apiKey = runtime.getSetting("TOKENMETRICS_API_KEY");
        if (!apiKey) {
            console.warn("TokenMetrics API key not found. Please set TOKENMETRICS_API_KEY environment variable.");
            return false;
        }
        return true;
    },
    
    /**
     * Examples showing different ways to use the top market cap endpoint.
     * These examples reflect real TokenMetrics API usage patterns for market analysis.
     */
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me the top 10 cryptocurrencies by market cap"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the top 10 cryptocurrencies by market capitalization from TokenMetrics.",
                    action: "GET_TOP_MARKET_CAP"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What are the largest crypto assets right now?",
                    limit: 20
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve the top 20 largest cryptocurrency assets by market cap.",
                    action: "GET_TOP_MARKET_CAP"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I want to analyze market concentration in crypto"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the top market cap tokens to analyze crypto market concentration and dominance patterns.",
                    action: "GET_TOP_MARKET_CAP"
                }
            }
        ]
    ],
};

/**
 * Comprehensive analysis function for top market cap data from TokenMetrics.
 * This function processes the market cap rankings and provides strategic insights
 * about market structure, concentration, and investment implications.
 * 
 * @param topTokensData - Array of top market cap tokens from TokenMetrics API
 * @returns Analysis with market structure insights and concentration metrics
 */
function analyzeTopMarketCapData(topTokensData: any[]): any {
    if (!topTokensData || topTokensData.length === 0) {
        return {
            summary: "No top market cap data available for analysis",
            market_concentration: "Cannot assess",
            insights: [],
            recommendations: []
        };
    }
    
    // Calculate market concentration and dominance
    const concentrationAnalysis = analyzeMarketConcentration(topTokensData);
    
    // Analyze sector distribution among top tokens
    const sectorAnalysis = analyzeSectorDistribution(topTokensData);
    
    // Assess market structure and stability indicators
    const marketStructure = assessMarketStructure(topTokensData);
    
    // Generate strategic insights for portfolio construction
    const strategicInsights = generateMarketCapInsights(topTokensData, concentrationAnalysis, marketStructure);
    
    return {
        summary: `Analysis of top ${topTokensData.length} tokens shows ${concentrationAnalysis.dominance_level} market concentration with ${marketStructure.stability_assessment} structure`,
        
        market_concentration: concentrationAnalysis,
        
        sector_distribution: sectorAnalysis,
        
        market_structure: marketStructure,
        
        token_rankings: formatTokenRankings(topTokensData.slice(0, 10)), // Top 10 for display
        
        insights: strategicInsights,
        
        portfolio_implications: generatePortfolioImplications(concentrationAnalysis, marketStructure),
        
        risk_assessment: assessTopTokensRisk(topTokensData, concentrationAnalysis),
        
        data_quality: {
            source: "TokenMetrics Official API",
            tokens_analyzed: topTokensData.length,
            market_coverage: "Top tokens by market capitalization",
            analysis_scope: "Market structure and concentration analysis"
        }
    };
}

// Helper functions for top market cap analysis

function analyzeMarketConcentration(tokensData: any[]): any {
    if (tokensData.length === 0) return { dominance_level: "Unknown" };
    
    // Calculate total market cap of analyzed tokens
    const totalMarketCap = tokensData.reduce((sum, token) => sum + (token.MARKET_CAP || 0), 0);
    
    // Calculate concentration ratios (similar to traditional finance)
    const top1Dominance = tokensData.length > 0 ? (tokensData[0].MARKET_CAP / totalMarketCap) * 100 : 0;
    const top3Dominance = tokensData.length >= 3 ? 
        (tokensData.slice(0, 3).reduce((sum, token) => sum + token.MARKET_CAP, 0) / totalMarketCap) * 100 : top1Dominance;
    const top10Dominance = tokensData.length >= 10 ?
        (tokensData.slice(0, 10).reduce((sum, token) => sum + token.MARKET_CAP, 0) / totalMarketCap) * 100 : top3Dominance;
    
    // Assess concentration level
    let dominanceLevel;
    if (top1Dominance > 50) dominanceLevel = "Extremely High";
    else if (top1Dominance > 40) dominanceLevel = "Very High";
    else if (top1Dominance > 30) dominanceLevel = "High";
    else if (top1Dominance > 20) dominanceLevel = "Moderate";
    else dominanceLevel = "Low";
    
    return {
        dominance_level: dominanceLevel,
        top_1_dominance: `${top1Dominance.toFixed(1)}%`,
        top_3_dominance: `${top3Dominance.toFixed(1)}%`,
        top_10_dominance: `${top10Dominance.toFixed(1)}%`,
        total_market_cap: formatTokenMetricsNumber(totalMarketCap, 'currency'),
        concentration_interpretation: interpretConcentration(top1Dominance, top10Dominance)
    };
}

function analyzeSectorDistribution(tokensData: any[]): any {
    // Group tokens by category if available
    const sectorCounts: { [key: string]: number } = {};
    const sectorMarketCaps: { [key: string]: number } = {};
    
    tokensData.forEach(token => {
        const sector = token.CATEGORY || "Unknown";
        sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
        sectorMarketCaps[sector] = (sectorMarketCaps[sector] || 0) + (token.MARKET_CAP || 0);
    });
    
    // Sort sectors by market cap
    const sortedSectors = Object.entries(sectorMarketCaps)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5) // Top 5 sectors
        .map(([sector, marketCap]) => ({
            sector,
            token_count: sectorCounts[sector],
            total_market_cap: formatTokenMetricsNumber(marketCap as number, 'currency'),
            percentage: (((marketCap as number) / tokensData.reduce((sum, t) => sum + (t.MARKET_CAP || 0), 0)) * 100).toFixed(1)
        }));
    
    return {
        top_sectors: sortedSectors,
        sector_diversity: Object.keys(sectorCounts).length,
        diversification_score: calculateDiversificationScore(sectorMarketCaps)
    };
}

function assessMarketStructure(tokensData: any[]): any {
    if (tokensData.length < 5) {
        return { stability_assessment: "Insufficient data" };
    }
    
    // Analyze market cap gaps between tokens
    const marketCapGaps = [];
    for (let i = 1; i < Math.min(tokensData.length, 10); i++) {
        const gap = ((tokensData[i-1].MARKET_CAP - tokensData[i].MARKET_CAP) / tokensData[i].MARKET_CAP) * 100;
        marketCapGaps.push(gap);
    }
    
    const avgGap = marketCapGaps.reduce((sum, gap) => sum + gap, 0) / marketCapGaps.length;
    
    // Assess structure stability
    let stabilityAssessment;
    if (avgGap > 100) stabilityAssessment = "Highly Tiered";
    else if (avgGap > 50) stabilityAssessment = "Well Stratified";
    else if (avgGap > 25) stabilityAssessment = "Moderately Stratified";
    else stabilityAssessment = "Closely Competitive";
    
    return {
        stability_assessment: stabilityAssessment,
        average_market_cap_gap: `${avgGap.toFixed(1)}%`,
        structure_interpretation: interpretMarketStructure(stabilityAssessment),
        top_token_advantage: marketCapGaps.length > 0 ? `${marketCapGaps[0].toFixed(1)}%` : "N/A"
    };
}

function generateMarketCapInsights(tokensData: any[], concentrationAnalysis: any, marketStructure: any): string[] {
    const insights = [];
    
    // Concentration insights
    if (concentrationAnalysis.dominance_level === "Very High" || concentrationAnalysis.dominance_level === "Extremely High") {
        insights.push("High market concentration suggests Bitcoin and Ethereum dominance continues to shape overall crypto market direction.");
    } else if (concentrationAnalysis.dominance_level === "Low") {
        insights.push("Lower market concentration indicates a more distributed crypto ecosystem with multiple significant players.");
    }
    
    // Structure insights
    if (marketStructure.stability_assessment === "Highly Tiered") {
        insights.push("Clear market tiers suggest established hierarchies with significant gaps between major players.");
    } else if (marketStructure.stability_assessment === "Closely Competitive") {
        insights.push("Competitive market structure with smaller gaps between tokens indicates active rivalry for market position.");
    }
    
    // Token-specific insights
    if (tokensData.length > 0) {
        const topToken = tokensData[0];
        insights.push(`${topToken.NAME} (${topToken.SYMBOL}) leads the market with ${formatTokenMetricsNumber(topToken.MARKET_CAP, 'currency')} market cap.`);
    }
    
    return insights;
}

function generatePortfolioImplications(concentrationAnalysis: any, marketStructure: any): string[] {
    const implications = [];
    
    // Based on concentration level
    const top1Dominance = parseFloat(concentrationAnalysis.top_1_dominance);
    
    if (top1Dominance > 40) {
        implications.push("High concentration suggests Bitcoin allocation is critical for crypto portfolio performance.");
        implications.push("Consider Bitcoin as a core holding given its market dominance.");
    }
    
    // Based on market structure
    if (marketStructure.stability_assessment === "Well Stratified") {
        implications.push("Clear market tiers support a tiered allocation strategy matching market cap rankings.");
    } else if (marketStructure.stability_assessment === "Closely Competitive") {
        implications.push("Competitive structure allows for more equal weighting among top tokens.");
    }
    
    // General implications
    implications.push("Top market cap tokens provide the most liquid and established crypto exposure.");
    implications.push("Market concentration levels suggest appropriate diversification needs.");
    
    return implications;
}

function assessTopTokensRisk(tokensData: any[], concentrationAnalysis: any): any {
    const risks = [];
    const opportunities = [];
    
    // Concentration risks
    const top1Dominance = parseFloat(concentrationAnalysis.top_1_dominance);
    if (top1Dominance > 50) {
        risks.push("Extreme concentration risk - single token dominates market direction");
    } else if (top1Dominance > 30) {
        risks.push("High concentration risk - few tokens drive majority of market movement");
    }
    
    // Opportunities
    if (tokensData.length >= 10) {
        opportunities.push("Sufficient top tokens available for diversified large-cap crypto strategy");
    }
    
    opportunities.push("Top market cap tokens typically offer best liquidity for large transactions");
    
    return {
        risk_factors: risks.length > 0 ? risks : ["Concentration risk is manageable with current market structure"],
        opportunities: opportunities,
        overall_risk_level: top1Dominance > 40 ? "High Concentration" : "Moderate",
        mitigation_strategies: [
            "Diversify across multiple top tokens rather than concentrating in one",
            "Monitor concentration changes over time",
            "Consider mid-cap tokens for additional diversification",
            "Maintain awareness of regulatory risks for dominant tokens"
        ]
    };
}

// Utility functions for market cap analysis

function formatTokenRankings(topTokens: any[]): any[] {
    return topTokens.map((token, index) => ({
        rank: index + 1,
        name: `${token.NAME} (${token.SYMBOL})`,
        market_cap: formatTokenMetricsNumber(token.MARKET_CAP, 'currency'),
        price: formatTokenMetricsNumber(token.PRICE, 'currency'),
        volume_24h: formatTokenMetricsNumber(token.VOLUME_24H, 'currency'),
        market_cap_rank: token.MARKET_CAP_RANK || index + 1
    }));
}

function interpretConcentration(top1: number, top10: number): string {
    if (top1 > 50) return "Extremely concentrated market - single token dominance";
    if (top1 > 40) return "Highly concentrated - limited number of major players";
    if (top10 > 80) return "Moderately concentrated - top tokens control majority";
    return "Relatively distributed market structure";
}

function interpretMarketStructure(assessment: string): string {
    switch (assessment) {
        case "Highly Tiered": return "Clear market leaders with substantial advantages";
        case "Well Stratified": return "Organized hierarchy with defined market positions";
        case "Moderately Stratified": return "Some clear leaders but competitive middle tier";
        case "Closely Competitive": return "Tight competition among top tokens";
        default: return "Market structure analysis unavailable";
    }
}

function calculateDiversificationScore(sectorMarketCaps: Record<string, number>): number {
    const totalMarketCap = Object.values(sectorMarketCaps).reduce((sum, cap) => sum + cap, 0);
    const sectorWeights = Object.values(sectorMarketCaps).map(cap => cap / totalMarketCap);
    
    // Calculate Herfindahl-Hirschman Index (lower = more diversified)
    const hhi = sectorWeights.reduce((sum, weight) => sum + weight * weight, 0);
    
    // Convert to 0-100 scale (higher = more diversified)
    return Math.round((1 - hhi) * 100);
}
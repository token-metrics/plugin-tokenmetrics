/**
 * SECTOR INDICES HOLDINGS ACTION
 * 
 * This file handles the sector indices holdings endpoint, which shows you the current
 * composition of any TokenMetrics sector index. Think of this like looking inside
 * a mutual fund to see what stocks it holds and how much of each.
 * 
 * Real API Endpoint: GET https://api.tokenmetrics.com/v2/indices-index-specific-tree-map
 * 
 * Key Learning Point: This endpoint was one of the most incorrectly implemented
 * in the original code. The URL was completely wrong, and the required indexName
 * parameter was missing. This is a perfect example of why reading API documentation
 * carefully is crucial for successful integration.
 */

import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    formatTokenMetricsNumber,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { SectorIndicesHoldingsResponse, SectorIndicesHoldingsRequest } from "../types";

/**
 * This action retrieves the current holdings and weights for a specific sector index.
 * Understanding sector composition is essential for portfolio construction and risk management.
 * 
 * Why This Matters: Just like analyzing a mutual fund's holdings helps you understand
 * what you're investing in, this endpoint reveals exactly which cryptocurrencies
 * make up each sector and how heavily weighted they are.
 */
export const getSectorIndicesHoldingsAction: Action = {
    name: "getSectorIndicesHoldings",
    description: "Get the current holdings of a specific sector index from TokenMetrics with allocation weights",
    similes: [
        "get sector holdings",
        "sector index composition", 
        "index holdings breakdown",
        "sector allocation weights",
        "get index components",
        "show sector diversification",
        "sector portfolio breakdown"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Extract the indexName parameter - this is absolutely required for this endpoint
            // The TokenMetrics API won't work without specifying which sector index you want
            const requestParams: SectorIndicesHoldingsRequest = {
                // Critical parameter: indexName is required (e.g., 'meme', 'defi', 'gaming')
                // We check multiple possible field names to be flexible with user input
                indexName: typeof messageContent.indexName === 'string' ? messageContent.indexName :
                          typeof messageContent.index_name === 'string' ? messageContent.index_name :
                          typeof messageContent.sector === 'string' ? messageContent.sector : undefined,
                
                // Pagination parameters for large datasets
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : 50,
                page: typeof messageContent.page === 'number' ? messageContent.page : 1
            };
            
            // Validate that the required indexName parameter is provided
            // This validation prevents API calls that will definitely fail
            if (!requestParams.indexName) {
                throw new Error("indexName is required for sector indices holdings. Example values: 'meme', 'defi', 'gaming', 'layer1', 'layer2', etc.");
            }
            
            // Validate all parameters against TokenMetrics API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters object, removing any undefined values
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log(`Fetching sector indices holdings for ${requestParams.indexName} from TokenMetrics API`);
            
            // Make the API call using the corrected endpoint URL
            // This endpoint was previously incorrectly mapped to /v2/sector-indices-holdings
            const response = await callTokenMetricsApi<SectorIndicesHoldingsResponse>(
                TOKENMETRICS_ENDPOINTS.sectorIndicesHoldings, // Maps to /v2/indices-index-specific-tree-map
                apiParams,
                "GET"
            );
            
            // Format the response data according to TokenMetrics API structure
            const formattedData = formatTokenMetricsResponse<SectorIndicesHoldingsResponse>(response, "getSectorIndicesHoldings");
            const holdings = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the holdings data to provide actionable insights
            // This is where we transform raw data into investment intelligence
            const holdingsAnalysis = analyzeHoldingsData(holdings, requestParams.indexName);
            
            // Return comprehensive results with analysis and metadata
            return {
                success: true,
                message: `Successfully retrieved ${holdings.length} holdings for ${requestParams.indexName} sector index`,
                holdings: holdings,
                analysis: holdingsAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.sectorIndicesHoldings,
                    index_name: requestParams.indexName,
                    total_holdings: holdings.length,
                    pagination: {
                        page: requestParams.page,
                        limit: requestParams.limit
                    },
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                holdings_explanation: {
                    purpose: "Shows current composition and weights of the sector index",
                    weight_interpretation: "Higher weights indicate larger allocation within the index",
                    usage: "Use for understanding sector exposure and diversification within each index",
                    investment_context: "Similar to analyzing mutual fund holdings to understand portfolio composition"
                }
            };
            
        } catch (error) {
            console.error("Error in getSectorIndicesHoldingsAction:", error);
            
            // Provide detailed error information with troubleshooting guidance
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve sector indices holdings from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/indices-index-specific-tree-map is accessible",
                    parameter_validation: [
                        "indexName is REQUIRED - try values like 'meme', 'defi', 'gaming', 'layer1', 'layer2'",
                        "Check that indexName corresponds to an existing TokenMetrics sector index",
                        "Verify your API key has access to sector indices endpoints",
                        "Ensure pagination parameters (page, limit) are positive integers"
                    ],
                    common_solutions: [
                        "Try with a well-known index name like 'meme' or 'defi' first",
                        "Check if your TokenMetrics subscription includes sector indices access",
                        "Verify the index name spelling and formatting (usually lowercase)",
                        "Contact TokenMetrics support to confirm available sector index names"
                    ],
                    api_documentation: "Refer to https://developers.tokenmetrics.com for complete parameter specifications"
                }
            };
        }
    },
    
    // Validate that the runtime environment has the necessary configuration
    validate: async (runtime, _message) => {
        const apiKey = runtime.getSetting("TOKENMETRICS_API_KEY");
        if (!apiKey) {
            console.warn("TokenMetrics API key not found. Please set TOKENMETRICS_API_KEY environment variable.");
            return false;
        }
        return true;
    },
    
    // Examples showing different ways users might interact with this action
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me the holdings of the meme sector index",
                    indexName: "meme"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the current holdings and weights for the meme sector index from TokenMetrics.",
                    action: "GET_SECTOR_INDICES_HOLDINGS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What tokens are in the DeFi index and how are they weighted?",
                    indexName: "defi"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll analyze the DeFi sector index composition and provide insights on token allocation and diversification.",
                    action: "GET_SECTOR_INDICES_HOLDINGS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Analyze the gaming sector portfolio breakdown",
                    sector: "gaming"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the gaming sector holdings and analyze the portfolio composition and concentration risk.",
                    action: "GET_SECTOR_INDICES_HOLDINGS"
                }
            }
        ]
    ],
};

/**
 * HOLDINGS DATA ANALYSIS FUNCTION
 * 
 * This function transforms raw holdings data into actionable investment insights.
 * Think of this as your personal portfolio analyst who looks at the numbers
 * and tells you what they actually mean for your investment decisions.
 * 
 * Key Concepts We Analyze:
 * 1. Concentration Risk - How much is invested in the top holdings
 * 2. Diversification - How spread out the investments are
 * 3. Sector Focus - Whether the index is focused or broad-based
 */
function analyzeHoldingsData(holdings: any[], indexName: string): any {
    // Handle empty data gracefully
    if (!holdings || holdings.length === 0) {
        return {
            summary: `No holdings data available for ${indexName} sector index`,
            diversification: "Unknown - no data to analyze",
            insights: ["No holdings data available - the sector index may be new or temporarily unavailable"],
            recommendation: "Check back later or try a different sector index"
        };
    }
    
    // Calculate total weights to validate data integrity
    // In a properly constructed index, weights should sum to approximately 100%
    const totalWeight = holdings.reduce((sum, holding) => {
        return sum + (holding.WEIGHT || holding.ALLOCATION_PERCENT || 0);
    }, 0);
    
    // Sort holdings by weight to identify the most important positions
    // This is like ranking the ingredients in a recipe by how much of each you use
    const sortedHoldings = holdings
        .filter(h => h.WEIGHT || h.ALLOCATION_PERCENT) // Only include holdings with weight data
        .sort((a, b) => (b.WEIGHT || b.ALLOCATION_PERCENT) - (a.WEIGHT || a.ALLOCATION_PERCENT))
        .slice(0, 10); // Top 10 holdings for comprehensive analysis
    
    // Analyze concentration risk using standard portfolio management principles
    const topHoldingWeight = sortedHoldings.length > 0 ? (sortedHoldings[0].WEIGHT || sortedHoldings[0].ALLOCATION_PERCENT) : 0;
    const top3Weight = sortedHoldings.slice(0, 3).reduce((sum, h) => sum + (h.WEIGHT || h.ALLOCATION_PERCENT || 0), 0);
    const top5Weight = sortedHoldings.slice(0, 5).reduce((sum, h) => sum + (h.WEIGHT || h.ALLOCATION_PERCENT || 0), 0);
    
    // Classify concentration level using established portfolio analysis standards
    let concentrationLevel: string;
    let riskLevel: string;
    
    if (topHoldingWeight > 40) {
        concentrationLevel = "Extremely High";
        riskLevel = "Very High Risk";
    } else if (topHoldingWeight > 30) {
        concentrationLevel = "Very High"; 
        riskLevel = "High Risk";
    } else if (topHoldingWeight > 20) {
        concentrationLevel = "High";
        riskLevel = "Moderate-High Risk";
    } else if (topHoldingWeight > 15) {
        concentrationLevel = "Moderate";
        riskLevel = "Moderate Risk";
    } else {
        concentrationLevel = "Low";
        riskLevel = "Lower Risk";
    }
    
    // Generate actionable insights based on the analysis
    const insights: string[] = [];
    
    // Concentration insights
    if (concentrationLevel === "Extremely High" || concentrationLevel === "Very High") {
        insights.push(`Warning: ${topHoldingWeight.toFixed(1)}% concentration in top holding creates significant single-token risk`);
        insights.push("Consider this sector only as a small portion of your overall crypto allocation");
    } else if (concentrationLevel === "High") {
        insights.push(`Moderate concentration risk with ${topHoldingWeight.toFixed(1)}% in top holding`);
        insights.push("Suitable for moderate risk tolerance with proper position sizing");
    } else {
        insights.push(`Good diversification with ${topHoldingWeight.toFixed(1)}% maximum single-token exposure`);
        insights.push("Lower concentration risk makes this suitable for larger allocations");
    }
    
    // Diversification insights
    if (top3Weight > 60) {
        insights.push("Top 3 holdings dominate the index - limited diversification within sector");
    } else if (top5Weight < 50) {
        insights.push("Well-diversified across multiple tokens within the sector");
    }
    
    // Data quality insights
    if (totalWeight < 90 || totalWeight > 110) {
        insights.push(`Total allocation is ${totalWeight.toFixed(1)}% - may indicate rebalancing in progress or data quality issues`);
    }
    
    // Generate investment recommendations based on analysis
    const recommendations: string[] = [];
    
    if (riskLevel === "Very High Risk") {
        recommendations.push("Suitable only for high-risk tolerance investors");
        recommendations.push("Use very small position sizes (1-2% of portfolio)");
        recommendations.push("Monitor top holding closely for concentration changes");
    } else if (riskLevel === "High Risk") {
        recommendations.push("Appropriate for moderate to high risk tolerance");
        recommendations.push("Consider 3-5% portfolio allocation maximum");
    } else {
        recommendations.push("Suitable for most risk tolerance levels");
        recommendations.push("Can consider larger allocations (5-10% of crypto portfolio)");
    }
    
    recommendations.push(`Monitor ${indexName} sector rebalancing for optimal entry points`);
    recommendations.push("Combine with other sector indices for broader crypto exposure");
    
    return {
        summary: `${indexName} sector index contains ${holdings.length} holdings with ${concentrationLevel.toLowerCase()} concentration and ${riskLevel.toLowerCase()}`,
        
        diversification: {
            total_holdings: holdings.length,
            concentration_level: concentrationLevel,
            risk_level: riskLevel,
            top_holding_weight: `${topHoldingWeight.toFixed(1)}%`,
            top_3_weight: `${top3Weight.toFixed(1)}%`,
            top_5_weight: `${top5Weight.toFixed(1)}%`,
            total_allocated: `${totalWeight.toFixed(1)}%`,
            diversification_score: calculateDiversificationScore(holdings)
        },
        
        top_holdings: sortedHoldings.map((holding, index) => ({
            rank: index + 1,
            symbol: holding.SYMBOL,
            name: holding.TOKEN_NAME || holding.NAME || 'Unknown',
            weight: `${(holding.WEIGHT || holding.ALLOCATION_PERCENT).toFixed(2)}%`,
            market_cap: holding.MARKET_CAP ? formatTokenMetricsNumber(holding.MARKET_CAP, 'currency') : 'N/A'
        })),
        
        insights: insights,
        recommendations: recommendations,
        
        investment_suitability: {
            conservative_investors: riskLevel === "Lower Risk" ? "Suitable" : "Not Recommended",
            moderate_investors: riskLevel.includes("Moderate") ? "Suitable" : riskLevel === "Lower Risk" ? "Suitable" : "Use Caution",
            aggressive_investors: "Suitable with appropriate position sizing",
            suggested_allocation: getSuggestedAllocation(riskLevel)
        },
        
        risk_factors: [
            `Concentration risk: ${concentrationLevel.toLowerCase()} due to ${topHoldingWeight.toFixed(1)}% top holding`,
            "Sector-specific risk: performance tied to specific cryptocurrency sector trends",
            "Crypto market risk: all holdings subject to cryptocurrency market volatility",
            "Rebalancing risk: holdings and weights may change during index rebalancing"
        ]
    };
}

/**
 * Calculate a diversification score from 0-100 where higher is more diversified
 * This uses the Herfindahl-Hirschman Index (HHI) concept from economics
 */
function calculateDiversificationScore(holdings: any[]): number {
    if (holdings.length === 0) return 0;
    
    const weights = holdings.map(h => (h.WEIGHT || h.ALLOCATION_PERCENT || 0) / 100);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    if (totalWeight === 0) return 0;
    
    // Normalize weights to sum to 1
    const normalizedWeights = weights.map(w => w / totalWeight);
    
    // Calculate HHI (sum of squared weights)
    const hhi = normalizedWeights.reduce((sum, w) => sum + w * w, 0);
    
    // Convert to 0-100 scale where 100 is perfectly diversified
    return Math.round((1 - hhi) * 100);
}

/**
 * Suggest appropriate portfolio allocation based on risk level
 */
function getSuggestedAllocation(riskLevel: string): string {
    switch (riskLevel) {
        case "Very High Risk":
            return "1-2% of total portfolio";
        case "High Risk":
            return "2-3% of total portfolio";
        case "Moderate-High Risk":
            return "3-5% of total portfolio";
        case "Moderate Risk":
            return "5-8% of total portfolio";
        case "Lower Risk":
            return "8-12% of total portfolio";
        default:
            return "3-5% of total portfolio";
    }
}
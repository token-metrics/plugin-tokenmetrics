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
import type { InvestorGradesResponse, InvestorGradesRequest } from "../types";

/**
 * INVESTOR GRADES ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/investor-grades
 * 
 * This action provides long-term investment grades including Technology and Fundamental metrics.
 * Essential for long-term investment decisions and portfolio allocation strategies.
 */
export const getInvestorGradesAction: Action = {
    name: "getInvestorGrades",
    description: "Get long-term investment grades including Technology and Fundamental metrics from TokenMetrics for portfolio allocation decisions",
    similes: [
        "get investor grades",
        "long term grades",
        "investment grades",
        "fundamental analysis",
        "technology assessment",
        "portfolio grades",
        "investment quality"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Extract token identifiers
            const tokenIdentifier = extractTokenIdentifier(messageContent);
            
            // Build parameters based on actual API documentation
            const requestParams: InvestorGradesRequest = {
                // Token identification
                token_id: tokenIdentifier.token_id || 
                         (typeof messageContent.token_id === 'number' ? messageContent.token_id : undefined),
                symbol: tokenIdentifier.symbol || 
                       (typeof messageContent.symbol === 'string' ? messageContent.symbol : undefined),
                
                // Date range parameters
                startDate: typeof messageContent.startDate === 'string' ? messageContent.startDate : 
                          typeof messageContent.start_date === 'string' ? messageContent.start_date : undefined,
                endDate: typeof messageContent.endDate === 'string' ? messageContent.endDate :
                        typeof messageContent.end_date === 'string' ? messageContent.end_date : undefined,
                
                // Filtering parameters from API docs
                category: typeof messageContent.category === 'string' ? messageContent.category : undefined,
                exchange: typeof messageContent.exchange === 'string' ? messageContent.exchange : undefined,
                marketcap: typeof messageContent.marketcap === 'number' ? messageContent.marketcap : undefined,
                fdv: typeof messageContent.fdv === 'number' ? messageContent.fdv : undefined,
                volume: typeof messageContent.volume === 'number' ? messageContent.volume : undefined,
                investorGrade: typeof messageContent.investorGrade === 'number' ? messageContent.investorGrade : undefined,
                
                // Pagination
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : 50,
                page: typeof messageContent.page === 'number' ? messageContent.page : 1
            };
            
            // Validate parameters
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Fetching investor grades from TokenMetrics v2/investor-grades endpoint");
            
            // Make API call
            const response = await callTokenMetricsApi<InvestorGradesResponse>(
                TOKENMETRICS_ENDPOINTS.investorGrades,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<InvestorGradesResponse>(response, "getInvestorGrades");
            const investorGrades = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the investor grades
            const gradesAnalysis = analyzeInvestorGrades(investorGrades);
            
            return {
                success: true,
                message: `Successfully retrieved investor grades for ${investorGrades.length} data points`,
                investor_grades: investorGrades,
                analysis: gradesAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.investorGrades,
                    requested_token: tokenIdentifier.symbol || tokenIdentifier.token_id,
                    date_range: {
                        start: requestParams.startDate,
                        end: requestParams.endDate
                    },
                    filters_applied: {
                        category: requestParams.category,
                        exchange: requestParams.exchange,
                        min_marketcap: requestParams.marketcap,
                        min_volume: requestParams.volume,
                        min_fdv: requestParams.fdv
                    },
                    pagination: {
                        page: requestParams.page,
                        limit: requestParams.limit
                    },
                    data_points: investorGrades.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                grades_explanation: {
                    INVESTOR_GRADE: "Overall long-term investment attractiveness (0-100)",
                    FUNDAMENTAL_GRADE: "Assessment of project fundamentals, team, and business model",
                    TECHNOLOGY_GRADE: "Evaluation of technical innovation and blockchain technology",
                    grade_interpretation: {
                        "90-100": "Exceptional - Top-tier investment opportunity",
                        "80-89": "Excellent - Strong long-term investment potential",
                        "70-79": "Good - Solid investment with manageable risks",
                        "60-69": "Fair - Moderate investment potential with some concerns",
                        "50-59": "Weak - Limited investment appeal",
                        "0-49": "Poor - High risk, avoid for conservative portfolios"
                    },
                    usage_guidelines: [
                        "Use for long-term portfolio allocation decisions",
                        "Higher grades indicate better risk-adjusted return potential",
                        "Consider grade trends over time for entry/exit timing",
                        "Combine with market conditions for optimal positioning"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getInvestorGradesAction:", error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve investor grades from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/investor-grades is accessible",
                    parameter_validation: [
                        "Verify token_id or symbol is correct and supported",
                        "Check that date parameters use startDate/endDate format (YYYY-MM-DD)",
                        "Ensure numeric filters (marketcap, volume, fdv) are positive numbers",
                        "Confirm your API key has access to investor grades endpoint"
                    ],
                    common_solutions: [
                        "Try using a major token (BTC, ETH) to test functionality",
                        "Remove filters to get broader results",
                        "Check if your subscription includes investor grades access",
                        "Verify the token has been analyzed by TokenMetrics"
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
                    text: "What's Bitcoin's investor grade?",
                    symbol: "BTC"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get Bitcoin's current TokenMetrics investor grade for long-term investment analysis.",
                    action: "GET_INVESTOR_GRADES"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me investment grades for DeFi tokens with high market cap",
                    category: "defi",
                    marketcap: 1000000000,
                    limit: 20
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll analyze investor grades for large-cap DeFi tokens from TokenMetrics.",
                    action: "GET_INVESTOR_GRADES"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get investor grades for tokens with high technology scores",
                    investorGrade: 80
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll find tokens with high investor grades indicating strong long-term potential.",
                    action: "GET_INVESTOR_GRADES"
                }
            }
        ]
    ],
};

/**
 * Comprehensive analysis of investor grades for long-term investment decisions
 */
function analyzeInvestorGrades(gradesData: any[]): any {
    if (!gradesData || gradesData.length === 0) {
        return {
            summary: "No investor grades data available for analysis",
            investment_outlook: "Cannot assess",
            insights: []
        };
    }
    
    // Analyze grade distribution and quality
    const gradeDistribution = analyzeGradeDistribution(gradesData);
    const qualityAssessment = assessInvestmentQuality(gradesData);
    const sectorAnalysis = analyzeSectorDistribution(gradesData);
    const fundamentalAnalysis = analyzeFundamentalGrades(gradesData);
    const technologyAnalysis = analyzeTechnologyGrades(gradesData);
    
    // Generate investment insights
    const insights = generateInvestmentInsights(gradeDistribution, qualityAssessment, sectorAnalysis);
    
    return {
        summary: `Investment analysis of ${gradesData.length} tokens shows ${qualityAssessment.overall_quality} quality with ${gradeDistribution.average_grade.toFixed(1)} average investor grade`,
        grade_distribution: gradeDistribution,
        quality_assessment: qualityAssessment,
        sector_analysis: sectorAnalysis,
        fundamental_analysis: fundamentalAnalysis,
        technology_analysis: technologyAnalysis,
        insights: insights,
        investment_recommendations: generateInvestmentRecommendations(qualityAssessment, gradeDistribution, sectorAnalysis),
        portfolio_implications: generatePortfolioImplications(gradeDistribution, qualityAssessment),
        data_quality: {
            source: "TokenMetrics Official API",
            data_points: gradesData.length,
            reliability: "High - Comprehensive fundamental and technical analysis",
            coverage: analyzeCoverage(gradesData)
        }
    };
}

function analyzeGradeDistribution(gradesData: any[]): any {
    const investorGrades = gradesData.map(d => d.INVESTOR_GRADE).filter(g => g !== null && g !== undefined);
    
    if (investorGrades.length === 0) {
        return { average_grade: 0, distribution: "No data" };
    }
    
    const averageGrade = investorGrades.reduce((sum, grade) => sum + grade, 0) / investorGrades.length;
    
    // Categorize grades into investment tiers
    const exceptional = investorGrades.filter(g => g >= 90).length;
    const excellent = investorGrades.filter(g => g >= 80 && g < 90).length;
    const good = investorGrades.filter(g => g >= 70 && g < 80).length;
    const fair = investorGrades.filter(g => g >= 60 && g < 70).length;
    const weak = investorGrades.filter(g => g >= 50 && g < 60).length;
    const poor = investorGrades.filter(g => g < 50).length;
    
    return {
        average_grade: averageGrade,
        median_grade: calculateMedian(investorGrades),
        total_tokens: investorGrades.length,
        distribution: {
            exceptional: `${exceptional} tokens (${((exceptional / investorGrades.length) * 100).toFixed(1)}%)`,
            excellent: `${excellent} tokens (${((excellent / investorGrades.length) * 100).toFixed(1)}%)`,
            good: `${good} tokens (${((good / investorGrades.length) * 100).toFixed(1)}%)`,
            fair: `${fair} tokens (${((fair / investorGrades.length) * 100).toFixed(1)}%)`,
            weak: `${weak} tokens (${((weak / investorGrades.length) * 100).toFixed(1)}%)`,
            poor: `${poor} tokens (${((poor / investorGrades.length) * 100).toFixed(1)}%)`
        },
        investment_universe_quality: averageGrade >= 75 ? "High Quality" : 
                                   averageGrade >= 65 ? "Good Quality" : 
                                   averageGrade >= 55 ? "Mixed Quality" : "Low Quality"
    };
}

function assessInvestmentQuality(gradesData: any[]): any {
    const highQualityTokens = gradesData.filter(d => d.INVESTOR_GRADE >= 80);
    const investmentGradeTokens = gradesData.filter(d => d.INVESTOR_GRADE >= 70);
    const speculativeTokens = gradesData.filter(d => d.INVESTOR_GRADE < 60);
    
    // Assess overall market quality
    const highQualityPercent = (highQualityTokens.length / gradesData.length) * 100;
    let overallQuality;
    
    if (highQualityPercent > 40) overallQuality = "Excellent";
    else if (highQualityPercent > 25) overallQuality = "Good";
    else if (highQualityPercent > 15) overallQuality = "Fair";
    else overallQuality = "Poor";
    
    // Find top investment opportunities
    const topOpportunities = gradesData
        .filter(d => d.INVESTOR_GRADE >= 80)
        .sort((a, b) => b.INVESTOR_GRADE - a.INVESTOR_GRADE)
        .slice(0, 5)
        .map(token => ({
            name: `${token.NAME} (${token.SYMBOL})`,
            investor_grade: `${token.INVESTOR_GRADE}/100`,
            fundamental_grade: token.FUNDAMENTAL_GRADE ? `${token.FUNDAMENTAL_GRADE}/100` : 'N/A',
            technology_grade: token.TECHNOLOGY_GRADE ? `${token.TECHNOLOGY_GRADE}/100` : 'N/A',
            market_cap: token.MARKET_CAP ? formatTokenMetricsNumber(token.MARKET_CAP, 'currency') : 'N/A',
            category: token.CATEGORY || 'Unknown'
        }));
    
    return {
        overall_quality: overallQuality,
        high_quality_tokens: highQualityTokens.length,
        investment_grade_tokens: investmentGradeTokens.length,
        speculative_tokens: speculativeTokens.length,
        top_opportunities: topOpportunities,
        quality_metrics: {
            high_quality_percentage: highQualityPercent.toFixed(1),
            investment_grade_percentage: ((investmentGradeTokens.length / gradesData.length) * 100).toFixed(1),
            speculative_percentage: ((speculativeTokens.length / gradesData.length) * 100).toFixed(1)
        }
    };
}

function analyzeSectorDistribution(gradesData: any[]): any {
    const sectorGrades = new Map();
    
    gradesData.forEach(token => {
        const sector = token.CATEGORY || 'Unknown';
        if (!sectorGrades.has(sector)) {
            sectorGrades.set(sector, []);
        }
        sectorGrades.get(sector).push(token.INVESTOR_GRADE);
    });
    
    // Calculate sector averages and rankings
    const sectorAnalysis = Array.from(sectorGrades.entries()).map(([sector, grades]) => {
        const validGrades = grades.filter((g: any) => g !== null && g !== undefined);
        const averageGrade = validGrades.length > 0 ? 
            validGrades.reduce((sum: number, grade: number) => sum + grade, 0) / validGrades.length : 0;
        
        return {
            sector: sector,
            average_grade: averageGrade,
            token_count: validGrades.length,
            quality_assessment: averageGrade >= 75 ? "High Quality" : 
                              averageGrade >= 65 ? "Good Quality" : 
                              averageGrade >= 55 ? "Mixed Quality" : "Low Quality"
        };
    }).sort((a, b) => b.average_grade - a.average_grade);
    
    return {
        total_sectors: sectorAnalysis.length,
        sector_rankings: sectorAnalysis,
        best_sector: sectorAnalysis[0]?.sector || 'Unknown',
        best_sector_grade: sectorAnalysis[0]?.average_grade.toFixed(1) || '0',
        diversification_available: sectorAnalysis.length >= 5 ? "Good" : "Limited"
    };
}

function analyzeFundamentalGrades(gradesData: any[]): any {
    const fundamentalGrades = gradesData
        .map(d => d.FUNDAMENTAL_GRADE)
        .filter(g => g !== null && g !== undefined);
    
    if (fundamentalGrades.length === 0) {
        return { status: "No fundamental grade data available" };
    }
    
    const averageFundamental = fundamentalGrades.reduce((sum, grade) => sum + grade, 0) / fundamentalGrades.length;
    const strongFundamentals = fundamentalGrades.filter(g => g >= 80).length;
    const weakFundamentals = fundamentalGrades.filter(g => g < 60).length;
    
    // Find tokens with strongest fundamentals
    const topFundamentals = gradesData
        .filter(d => d.FUNDAMENTAL_GRADE >= 80)
        .sort((a, b) => b.FUNDAMENTAL_GRADE - a.FUNDAMENTAL_GRADE)
        .slice(0, 3)
        .map(token => ({
            name: `${token.NAME} (${token.SYMBOL})`,
            fundamental_grade: `${token.FUNDAMENTAL_GRADE}/100`,
            category: token.CATEGORY || 'Unknown'
        }));
    
    return {
        average_fundamental_grade: averageFundamental.toFixed(1),
        strong_fundamentals: strongFundamentals,
        weak_fundamentals: weakFundamentals,
        fundamental_quality: averageFundamental >= 75 ? "Strong" : 
                           averageFundamental >= 65 ? "Good" : 
                           averageFundamental >= 55 ? "Mixed" : "Weak",
        top_fundamental_tokens: topFundamentals,
        fundamental_distribution: analyzeFundamentalDistribution(fundamentalGrades)
    };
}

function analyzeTechnologyGrades(gradesData: any[]): any {
    const technologyGrades = gradesData
        .map(d => d.TECHNOLOGY_GRADE)
        .filter(g => g !== null && g !== undefined);
    
    if (technologyGrades.length === 0) {
        return { status: "No technology grade data available" };
    }
    
    const averageTechnology = technologyGrades.reduce((sum, grade) => sum + grade, 0) / technologyGrades.length;
    const innovativeTech = technologyGrades.filter(g => g >= 80).length;
    const outdatedTech = technologyGrades.filter(g => g < 60).length;
    
    // Find most innovative technology tokens
    const topTechnology = gradesData
        .filter(d => d.TECHNOLOGY_GRADE >= 80)
        .sort((a, b) => b.TECHNOLOGY_GRADE - a.TECHNOLOGY_GRADE)
        .slice(0, 3)
        .map(token => ({
            name: `${token.NAME} (${token.SYMBOL})`,
            technology_grade: `${token.TECHNOLOGY_GRADE}/100`,
            category: token.CATEGORY || 'Unknown'
        }));
    
    return {
        average_technology_grade: averageTechnology.toFixed(1),
        innovative_technology: innovativeTech,
        outdated_technology: outdatedTech,
        technology_quality: averageTechnology >= 75 ? "Cutting-edge" : 
                          averageTechnology >= 65 ? "Advanced" : 
                          averageTechnology >= 55 ? "Standard" : "Lagging",
        top_technology_tokens: topTechnology,
        innovation_assessment: assessInnovationLevel(technologyGrades)
    };
}

function generateInvestmentInsights(gradeDistribution: any, qualityAssessment: any, sectorAnalysis: any): string[] {
    const insights = [];
    
    // Quality insights
    if (qualityAssessment.overall_quality === "Excellent") {
        insights.push("Exceptional investment universe with high concentration of quality tokens - favorable for portfolio construction");
    } else if (qualityAssessment.overall_quality === "Poor") {
        insights.push("Limited high-quality investment options - requires very selective approach and thorough due diligence");
    }
    
    // Grade distribution insights
    const highQualityPercent = parseFloat(qualityAssessment.quality_metrics.high_quality_percentage);
    if (highQualityPercent > 30) {
        insights.push(`${highQualityPercent}% of tokens show excellent grades - good opportunity for diversified high-quality portfolio`);
    } else if (highQualityPercent < 10) {
        insights.push("Very few tokens meet high-quality standards - consider focused allocation to top-tier assets only");
    }
    
    // Sector insights
    if (sectorAnalysis.diversification_available === "Good") {
        insights.push(`${sectorAnalysis.total_sectors} sectors analyzed - good diversification opportunities across different blockchain verticals`);
        insights.push(`${sectorAnalysis.best_sector} sector leads with ${sectorAnalysis.best_sector_grade} average grade - consider overweighting this sector`);
    } else {
        insights.push("Limited sector diversification available - concentrated allocation may be necessary");
    }
    
    // Investment opportunity insights
    if (qualityAssessment.top_opportunities.length >= 3) {
        insights.push(`${qualityAssessment.top_opportunities.length} top-tier investment opportunities identified with grades above 80`);
    } else if (qualityAssessment.top_opportunities.length === 0) {
        insights.push("No exceptional investment opportunities currently available - consider waiting for better market conditions");
    }
    
    return insights;
}

function generateInvestmentRecommendations(qualityAssessment: any, gradeDistribution: any, sectorAnalysis: any): any {
    const recommendations = [];
    let portfolioStrategy = "Conservative";
    
    // Based on overall quality
    if (qualityAssessment.overall_quality === "Excellent") {
        recommendations.push("High-quality investment environment supports aggressive allocation to crypto assets");
        recommendations.push("Consider building core positions in top-rated tokens");
        portfolioStrategy = "Aggressive Growth";
    } else if (qualityAssessment.overall_quality === "Good") {
        recommendations.push("Moderate quality environment supports balanced crypto allocation");
        portfolioStrategy = "Balanced Growth";
    } else {
        recommendations.push("Low quality environment suggests defensive positioning and selective exposure");
        portfolioStrategy = "Defensive";
    }
    
    // Sector recommendations
    if (sectorAnalysis.best_sector && sectorAnalysis.best_sector !== 'Unknown') {
        recommendations.push(`Consider overweighting ${sectorAnalysis.best_sector} sector given its superior grade average`);
    }
    
    // Quality-based recommendations
    const highQualityPercent = parseFloat(qualityAssessment.quality_metrics.high_quality_percentage);
    if (highQualityPercent > 25) {
        recommendations.push("Sufficient high-quality options allow for diversified approach within crypto allocation");
    } else {
        recommendations.push("Limited quality options suggest concentrated approach focusing on highest-rated assets");
    }
    
    // Risk management recommendations
    recommendations.push("Use investor grades as primary filter for initial token screening");
    recommendations.push("Combine investor grades with market timing for optimal entry points");
    recommendations.push("Regularly review grade changes to identify emerging opportunities or deteriorating assets");
    
    return {
        portfolio_strategy: portfolioStrategy,
        primary_recommendations: recommendations.slice(0, 3),
        secondary_recommendations: recommendations.slice(3),
        allocation_guidance: generateAllocationGuidance(qualityAssessment, gradeDistribution)
    };
}

function generatePortfolioImplications(gradeDistribution: any, qualityAssessment: any): any {
    const implications = [];
    
    // Portfolio construction implications
    if (gradeDistribution.investment_universe_quality === "High Quality") {
        implications.push("High-quality universe supports larger crypto allocation within total portfolio");
        implications.push("Can implement equal-weight or market-cap weighted approach given quality distribution");
    } else if (gradeDistribution.investment_universe_quality === "Low Quality") {
        implications.push("Low-quality universe requires minimal crypto allocation and maximum selectivity");
        implications.push("Focus on 1-3 highest grade tokens only to minimize risk");
    }
    
    // Risk implications
    const speculativePercent = parseFloat(qualityAssessment.quality_metrics.speculative_percentage);
    if (speculativePercent > 60) {
        implications.push("High speculative content requires enhanced risk management and position sizing discipline");
    }
    
    // Diversification implications
    if (qualityAssessment.investment_grade_tokens >= 10) {
        implications.push("Sufficient investment-grade options allow for proper diversification within crypto allocation");
    } else {
        implications.push("Limited investment-grade options may require broader asset class diversification");
    }
    
    return {
        portfolio_construction: implications,
        risk_considerations: [
            "Investor grades reflect long-term potential but don't account for short-term volatility",
            "Grade changes over time can indicate shifting fundamentals requiring portfolio rebalancing",
            "High grades don't eliminate correlation risk during market-wide downturns"
        ],
        rebalancing_triggers: [
            "Significant grade changes (>10 points) warrant position review",
            "New high-grade opportunities may justify reallocation from lower-grade positions",
            "Sector grade leadership changes suggest sector rotation opportunities"
        ]
    };
}

function generateAllocationGuidance(qualityAssessment: any, gradeDistribution: any): any {
    const highQualityPercent = parseFloat(qualityAssessment.quality_metrics.high_quality_percentage);
    
    let suggestedAllocation;
    if (highQualityPercent > 30 && gradeDistribution.average_grade > 75) {
        suggestedAllocation = "15-25% of total portfolio";
    } else if (highQualityPercent > 20 && gradeDistribution.average_grade > 70) {
        suggestedAllocation = "10-20% of total portfolio";
    } else if (highQualityPercent > 10 && gradeDistribution.average_grade > 65) {
        suggestedAllocation = "5-15% of total portfolio";
    } else {
        suggestedAllocation = "3-8% of total portfolio";
    }
    
    return {
        crypto_allocation_range: suggestedAllocation,
        allocation_rationale: generateAllocationRationale(qualityAssessment, gradeDistribution),
        position_sizing: "Weight positions by investor grade with higher grades receiving larger allocations",
        rebalancing_frequency: "Quarterly review with semi-annual rebalancing"
    };
}

// Helper functions

function calculateMedian(numbers: number[]): number {
    const sorted = numbers.sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
        return sorted[middle];
    }
}

function analyzeFundamentalDistribution(grades: number[]): string {
    const strong = grades.filter(g => g >= 80).length;
    const good = grades.filter(g => g >= 70 && g < 80).length;
    const weak = grades.filter(g => g < 60).length;
    
    const strongPercent = (strong / grades.length) * 100;
    const weakPercent = (weak / grades.length) * 100;
    
    if (strongPercent > 40) return "Fundamentally Strong Market";
    if (weakPercent > 50) return "Weak Fundamentals Prevalent";
    return "Mixed Fundamental Quality";
}

function assessInnovationLevel(technologyGrades: number[]): string {
    const innovative = technologyGrades.filter(g => g >= 80).length;
    const innovativePercent = (innovative / technologyGrades.length) * 100;
    
    if (innovativePercent > 30) return "High Innovation Environment";
    if (innovativePercent > 15) return "Moderate Innovation";
    return "Limited Innovation";
}

function analyzeCoverage(gradesData: any[]): string {
    const withFundamental = gradesData.filter(d => d.FUNDAMENTAL_GRADE).length;
    const withTechnology = gradesData.filter(d => d.TECHNOLOGY_GRADE).length;
    const withInvestor = gradesData.filter(d => d.INVESTOR_GRADE).length;
    
    const avgCoverage = ((withFundamental + withTechnology + withInvestor) / (gradesData.length * 3)) * 100;
    
    if (avgCoverage > 90) return "Comprehensive";
    if (avgCoverage > 75) return "Good";
    if (avgCoverage > 60) return "Moderate";
    return "Limited";
}

function generateAllocationRationale(qualityAssessment: any, gradeDistribution: any): string {
    const quality = qualityAssessment.overall_quality;
    const avgGrade = gradeDistribution.average_grade;
    
    if (quality === "Excellent" && avgGrade > 75) {
        return "High-quality investment universe with strong average grades supports higher allocation";
    } else if (quality === "Good" && avgGrade > 70) {
        return "Good quality with solid grades supports moderate allocation with selectivity";
    } else if (quality === "Fair") {
        return "Mixed quality environment requires conservative allocation focused on highest grades";
    } else {
        return "Poor quality environment suggests minimal allocation to only exceptional opportunities";
    }
}
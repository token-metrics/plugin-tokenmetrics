import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    extractTokenIdentifier,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { AiReportsResponse, AiReportsRequest } from "../types";

/**
 * AI REPORTS ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/ai-reports
 * 
 * This action retrieves AI-generated reports providing comprehensive analyses of cryptocurrency 
 * tokens, including deep dives, investment analyses, and code reviews.
 */
export const getAiReportsAction: Action = {
    name: "getAiReports",
    description: "Retrieve AI-generated reports providing comprehensive analyses of cryptocurrency tokens, including deep dives, investment analyses, and code reviews",
    similes: [
        "get ai reports",
        "ai analysis reports",
        "deep dive analysis",
        "investment analysis",
        "code reviews",
        "comprehensive token analysis",
        "ai generated insights"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Extract token identifiers
            const tokenIdentifier = extractTokenIdentifier(messageContent);
            
            // Build parameters based on actual API documentation
            const requestParams: AiReportsRequest = {
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
            
            console.log("Fetching AI reports from TokenMetrics v2/ai-reports endpoint");
            
            // Make API call
            const response = await callTokenMetricsApi<AiReportsResponse>(
                TOKENMETRICS_ENDPOINTS.aiReports,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<AiReportsResponse>(response, "getAiReports");
            const aiReports = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the AI reports
            const reportsAnalysis = analyzeAiReports(aiReports);
            
            return {
                success: true,
                message: `Successfully retrieved ${aiReports.length} AI-generated reports`,
                ai_reports: aiReports,
                analysis: reportsAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.aiReports,
                    requested_token: tokenIdentifier.symbol || tokenIdentifier.token_id,
                    pagination: {
                        page: requestParams.page,
                        limit: requestParams.limit
                    },
                    data_points: aiReports.length,
                    api_version: "v2",
                    data_source: "TokenMetrics AI Engine"
                },
                reports_explanation: {
                    purpose: "AI-generated comprehensive analyses providing deep insights into cryptocurrency projects",
                    report_types: [
                        "Deep dive analyses - Comprehensive project evaluation",
                        "Investment analyses - Risk/reward assessment and recommendations", 
                        "Code reviews - Technical evaluation of smart contracts and protocols",
                        "Market analysis - Competitive positioning and market dynamics"
                    ],
                    usage_guidelines: [
                        "Use for due diligence and investment research",
                        "Combine with quantitative metrics for complete picture",
                        "Review report generation date for relevance",
                        "Consider reports as one input in investment decision process"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getAiReportsAction:", error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve AI reports from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/ai-reports is accessible",
                    parameter_validation: [
                        "Verify token_id is a valid number or symbol is a valid string",
                        "Ensure your API key has access to AI reports endpoint",
                        "Check that the token has been analyzed by TokenMetrics AI"
                    ],
                    common_solutions: [
                        "Try using a major token (BTC, ETH) to test functionality",
                        "Check if your subscription includes AI reports access",
                        "Verify TokenMetrics has generated reports for the requested token"
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
                    text: "Get AI analysis reports for Bitcoin",
                    symbol: "BTC"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve comprehensive AI-generated analysis reports for Bitcoin from TokenMetrics.",
                    action: "GET_AI_REPORTS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me the latest AI reports available"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the latest AI-generated reports from TokenMetrics covering various cryptocurrency projects.",
                    action: "GET_AI_REPORTS"
                }
            }
        ]
    ],
};

/**
 * Analyze AI reports to extract key insights and themes
 */
function analyzeAiReports(reportsData: any[]): any {
    if (!reportsData || reportsData.length === 0) {
        return {
            summary: "No AI reports available for analysis",
            report_coverage: "No data",
            insights: []
        };
    }
    
    // Analyze report coverage and types
    const reportCoverage = analyzeReportCoverage(reportsData);
    const contentAnalysis = analyzeReportContent(reportsData);
    const qualityAssessment = assessReportQuality(reportsData);
    const topInsights = extractTopInsights(reportsData);
    
    return {
        summary: `AI analysis covering ${reportsData.length} reports with ${reportCoverage.unique_tokens} unique tokens analyzed`,
        report_coverage: reportCoverage,
        content_analysis: contentAnalysis,
        quality_assessment: qualityAssessment,
        top_insights: topInsights,
        research_themes: identifyResearchThemes(reportsData),
        actionable_intelligence: generateActionableIntelligence(reportsData),
        data_quality: {
            source: "TokenMetrics AI Engine",
            total_reports: reportsData.length,
            coverage_breadth: assessCoverageBreadth(reportsData),
            freshness: assessReportFreshness(reportsData)
        }
    };
}

function analyzeReportCoverage(reportsData: any[]): any {
    const uniqueTokens = new Set(reportsData.map(r => r.SYMBOL).filter(s => s)).size;
    const tokenCoverage = new Map();
    
    // Analyze coverage by token
    reportsData.forEach(report => {
        const symbol = report.SYMBOL || 'Unknown';
        if (!tokenCoverage.has(symbol)) {
            tokenCoverage.set(symbol, []);
        }
        tokenCoverage.get(symbol).push(report);
    });
    
    // Find most analyzed tokens
    const mostAnalyzed = Array.from(tokenCoverage.entries())
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 5)
        .map(([symbol, reports]) => ({
            symbol: symbol,
            report_count: reports.length,
            latest_report: reports[reports.length - 1]?.DATE || 'Unknown'
        }));
    
    // Analyze report types/categories
    const reportTypes = new Map();
    reportsData.forEach(report => {
        const type = report.REPORT_TYPE || 'General Analysis';
        reportTypes.set(type, (reportTypes.get(type) || 0) + 1);
    });
    
    return {
        unique_tokens: uniqueTokens,
        total_reports: reportsData.length,
        most_analyzed_tokens: mostAnalyzed,
        report_types: Array.from(reportTypes.entries()).map(([type, count]) => ({
            type: type,
            count: count,
            percentage: ((count / reportsData.length) * 100).toFixed(1)
        })),
        coverage_depth: uniqueTokens > 0 ? (reportsData.length / uniqueTokens).toFixed(1) : '0'
    };
}

function analyzeReportContent(reportsData: any[]): any {
    // Analyze sentiment and themes in report content
    const sentimentAnalysis = analyzeSentiment(reportsData);
    const commonThemes = extractCommonThemes(reportsData);
    const keywordFrequency = analyzeKeywords(reportsData);
    
    return {
        sentiment_distribution: sentimentAnalysis,
        common_themes: commonThemes,
        trending_keywords: keywordFrequency.slice(0, 10),
        content_depth: assessContentDepth(reportsData),
        analysis_focus: identifyAnalysisFocus(reportsData)
    };
}

function assessReportQuality(reportsData: any[]): any {
    let qualityScore = 0;
    let detailedReports = 0;
    let recentReports = 0;
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    reportsData.forEach(report => {
        // Check for content quality indicators
        if (report.REPORT_CONTENT && report.REPORT_CONTENT.length > 500) {
            detailedReports++;
            qualityScore += 2;
        }
        
        if (report.KEY_INSIGHTS && Array.isArray(report.KEY_INSIGHTS) && report.KEY_INSIGHTS.length > 0) {
            qualityScore += 1;
        }
        
        if (report.RECOMMENDATIONS && Array.isArray(report.RECOMMENDATIONS) && report.RECOMMENDATIONS.length > 0) {
            qualityScore += 1;
        }
        
        // Check freshness
        if (report.GENERATED_DATE && new Date(report.GENERATED_DATE) > thirtyDaysAgo) {
            recentReports++;
            qualityScore += 1;
        }
    });
    
    const avgQualityScore = reportsData.length > 0 ? qualityScore / reportsData.length : 0;
    
    let qualityRating;
    if (avgQualityScore > 4) qualityRating = "Excellent";
    else if (avgQualityScore > 3) qualityRating = "Good";
    else if (avgQualityScore > 2) qualityRating = "Fair";
    else qualityRating = "Basic";
    
    return {
        quality_rating: qualityRating,
        average_quality_score: avgQualityScore.toFixed(1),
        detailed_reports: detailedReports,
        detailed_percentage: ((detailedReports / reportsData.length) * 100).toFixed(1),
        recent_reports: recentReports,
        freshness_percentage: ((recentReports / reportsData.length) * 100).toFixed(1),
        completeness: assessReportCompleteness(reportsData)
    };
}

function extractTopInsights(reportsData: any[]): any {
    const allInsights: any[] = [];
    const allRecommendations: any[] = [];
    
    reportsData.forEach(report => {
        if (report.KEY_INSIGHTS && Array.isArray(report.KEY_INSIGHTS)) {
            allInsights.push(...report.KEY_INSIGHTS.map((insight: any) => ({
                insight: insight,
                token: report.SYMBOL || 'Unknown',
                report_date: report.GENERATED_DATE || 'Unknown'
            })));
        }
        
        if (report.RECOMMENDATIONS && Array.isArray(report.RECOMMENDATIONS)) {
            allRecommendations.push(...report.RECOMMENDATIONS.map((rec: any) => ({
                recommendation: rec,
                token: report.SYMBOL || 'Unknown',
                report_date: report.GENERATED_DATE || 'Unknown'
            })));
        }
    });
    
    return {
        total_insights: allInsights.length,
        total_recommendations: allRecommendations.length,
        recent_insights: allInsights.slice(-5), // Last 5 insights
        key_recommendations: allRecommendations.slice(-5), // Last 5 recommendations
        insight_themes: categorizeInsights(allInsights),
        recommendation_types: categorizeRecommendations(allRecommendations)
    };
}

function identifyResearchThemes(reportsData: any[]): string[] {
    const themes = new Map();
    
    reportsData.forEach(report => {
        // Extract themes from report content and insights
        if (report.REPORT_CONTENT) {
            const content = report.REPORT_CONTENT.toLowerCase();
            
            // Common cryptocurrency research themes
            const themeKeywords = [
                'defi', 'nft', 'layer 2', 'scaling', 'interoperability', 'staking',
                'governance', 'yield farming', 'liquidity', 'smart contracts',
                'consensus', 'privacy', 'institutional adoption', 'regulation',
                'market making', 'derivatives', 'lending', 'synthetic assets'
            ];
            
            themeKeywords.forEach(keyword => {
                if (content.includes(keyword)) {
                    themes.set(keyword, (themes.get(keyword) || 0) + 1);
                }
            });
        }
    });
    
    return Array.from(themes.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([theme, count]) => `${theme} (${count} reports)`);
}

function generateActionableIntelligence(reportsData: any[]): any {
    const intelligence = {
        investment_signals: [] as any[],
        risk_alerts: [] as any[],
        opportunity_highlights: [] as any[],
        market_insights: [] as any[]
    };
    
    reportsData.forEach(report => {
        // Extract actionable intelligence from reports
        if (report.RECOMMENDATIONS) {
            report.RECOMMENDATIONS.forEach((rec: string) => {
                const recLower = rec.toLowerCase();
                
                if (recLower.includes('buy') || recLower.includes('accumulate')) {
                    intelligence.investment_signals.push({
                        type: 'Bullish',
                        signal: rec,
                        token: report.SYMBOL
                    });
                } else if (recLower.includes('sell') || recLower.includes('avoid')) {
                    intelligence.investment_signals.push({
                        type: 'Bearish',
                        signal: rec,
                        token: report.SYMBOL
                    });
                }
                
                if (recLower.includes('risk') || recLower.includes('caution')) {
                    intelligence.risk_alerts.push({
                        alert: rec,
                        token: report.SYMBOL
                    });
                }
                
                if (recLower.includes('opportunity') || recLower.includes('potential')) {
                    intelligence.opportunity_highlights.push({
                        opportunity: rec,
                        token: report.SYMBOL
                    });
                }
            });
        }
        
        if (report.KEY_INSIGHTS) {
            report.KEY_INSIGHTS.forEach((insight: string) => {
                const insightLower = insight.toLowerCase();
                
                if (insightLower.includes('market') || insightLower.includes('trend')) {
                    intelligence.market_insights.push({
                        insight: insight,
                        token: report.SYMBOL
                    });
                }
            });
        }
    });
    
    return {
        investment_signals: intelligence.investment_signals.slice(0, 10),
        risk_alerts: intelligence.risk_alerts.slice(0, 5),
        opportunity_highlights: intelligence.opportunity_highlights.slice(0, 5),
        market_insights: intelligence.market_insights.slice(0, 8),
        summary: generateIntelligenceSummary(intelligence)
    };
}

// Helper functions

function analyzeSentiment(reportsData: any[]): any {
    let bullish = 0;
    let bearish = 0;
    let neutral = 0;
    
    reportsData.forEach(report => {
        if (report.REPORT_CONTENT || report.KEY_INSIGHTS || report.RECOMMENDATIONS) {
            const content = [
                report.REPORT_CONTENT || '',
                ...(report.KEY_INSIGHTS || []),
                ...(report.RECOMMENDATIONS || [])
            ].join(' ').toLowerCase();
            
            const positiveWords = ['bullish', 'positive', 'growth', 'opportunity', 'strong', 'buy', 'accumulate'];
            const negativeWords = ['bearish', 'negative', 'decline', 'risk', 'weak', 'sell', 'avoid'];
            
            const positiveScore = positiveWords.reduce((score, word) => {
                return score + (content.split(word).length - 1);
            }, 0);
            
            const negativeScore = negativeWords.reduce((score, word) => {
                return score + (content.split(word).length - 1);
            }, 0);
            
            if (positiveScore > negativeScore) bullish++;
            else if (negativeScore > positiveScore) bearish++;
            else neutral++;
        }
    });
    
    const total = bullish + bearish + neutral;
    
    return {
        bullish: bullish,
        bearish: bearish,
        neutral: neutral,
        bullish_percentage: total > 0 ? ((bullish / total) * 100).toFixed(1) : '0',
        bearish_percentage: total > 0 ? ((bearish / total) * 100).toFixed(1) : '0',
        overall_sentiment: bullish > bearish ? "Bullish" : bearish > bullish ? "Bearish" : "Neutral"
    };
}

function extractCommonThemes(reportsData: any[]): string[] {
    const themeCount = new Map();
    
    const commonThemes = [
        'scalability', 'adoption', 'partnerships', 'technology', 'team',
        'roadmap', 'competition', 'valuation', 'use case', 'governance',
        'tokenomics', 'ecosystem', 'development', 'community', 'security'
    ];
    
    reportsData.forEach(report => {
        const content = [
            report.REPORT_CONTENT || '',
            ...(report.KEY_INSIGHTS || []),
            ...(report.RECOMMENDATIONS || [])
        ].join(' ').toLowerCase();
        
        commonThemes.forEach(theme => {
            if (content.includes(theme)) {
                themeCount.set(theme, (themeCount.get(theme) || 0) + 1);
            }
        });
    });
    
    return Array.from(themeCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([theme, count]) => `${theme} (${count})`);
}

function analyzeKeywords(reportsData: any[]): any[] {
    const keywordCount = new Map();
    
    reportsData.forEach(report => {
        const content = [
            report.REPORT_CONTENT || '',
            ...(report.KEY_INSIGHTS || []),
            ...(report.RECOMMENDATIONS || [])
        ].join(' ').toLowerCase();
        
        // Extract meaningful keywords (excluding common words)
        const words = content.match(/\b[a-z]{4,}\b/g) || [];
        const excludeWords = ['that', 'this', 'with', 'from', 'they', 'have', 'will', 'been', 'were', 'would', 'could', 'should'];
        
        words.forEach(word => {
            if (!excludeWords.includes(word)) {
                keywordCount.set(word, (keywordCount.get(word) || 0) + 1);
            }
        });
    });
    
    return Array.from(keywordCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([keyword, count]) => ({ keyword, frequency: count }));
}

function assessContentDepth(reportsData: any[]): string {
    const avgContentLength = reportsData.reduce((sum, report) => {
        return sum + (report.REPORT_CONTENT ? report.REPORT_CONTENT.length : 0);
    }, 0) / reportsData.length;
    
    if (avgContentLength > 2000) return "Comprehensive";
    if (avgContentLength > 1000) return "Detailed";
    if (avgContentLength > 500) return "Moderate";
    return "Brief";
}

function identifyAnalysisFocus(reportsData: any[]): string[] {
    const focusAreas = new Map();
    
    const analysisTypes = [
        'fundamental analysis', 'technical analysis', 'on-chain analysis',
        'competitive analysis', 'market analysis', 'risk analysis',
        'valuation analysis', 'team analysis', 'technology review'
    ];
    
    reportsData.forEach(report => {
        const content = [
            report.REPORT_CONTENT || '',
            report.REPORT_TYPE || ''
        ].join(' ').toLowerCase();
        
        analysisTypes.forEach(type => {
            if (content.includes(type.split(' ')[0])) {
                focusAreas.set(type, (focusAreas.get(type) || 0) + 1);
            }
        });
    });
    
    return Array.from(focusAreas.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([focus, count]) => `${focus} (${count})`);
}

function assessCoverageBreadth(reportsData: any[]): string {
    const categories = new Set(reportsData.map(r => r.CATEGORY).filter(c => c));
    const symbols = new Set(reportsData.map(r => r.SYMBOL).filter(s => s));
    
    if (categories.size > 8 && symbols.size > 20) return "Very Broad";
    if (categories.size > 5 && symbols.size > 15) return "Broad";
    if (categories.size > 3 && symbols.size > 10) return "Moderate";
    return "Narrow";
}

function assessReportFreshness(reportsData: any[]): string {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentReports = reportsData.filter(r => 
        r.GENERATED_DATE && new Date(r.GENERATED_DATE) > thirtyDaysAgo
    ).length;
    
    const freshnessPercent = (recentReports / reportsData.length) * 100;
    
    if (freshnessPercent > 60) return "Very Fresh";
    if (freshnessPercent > 40) return "Fresh";
    if (freshnessPercent > 20) return "Moderate";
    return "Dated";
}

function assessReportCompleteness(reportsData: any[]): string {
    const requiredFields = ['REPORT_CONTENT', 'KEY_INSIGHTS', 'RECOMMENDATIONS'];
    let completeness = 0;
    
    reportsData.forEach(report => {
        const presentFields = requiredFields.filter(field => 
            report[field] && (Array.isArray(report[field]) ? report[field].length > 0 : report[field].length > 0)
        );
        completeness += presentFields.length / requiredFields.length;
    });
    
    const avgCompleteness = (completeness / reportsData.length) * 100;
    
    if (avgCompleteness > 80) return "Very Complete";
    if (avgCompleteness > 60) return "Complete";
    if (avgCompleteness > 40) return "Moderate";
    return "Limited";
}

function categorizeInsights(insights: any[]): any[] {
    const categories = new Map();
    
    insights.forEach(({ insight }) => {
        const insightLower = insight.toLowerCase();
        
        if (insightLower.includes('technical') || insightLower.includes('technology')) {
            categories.set('Technical', (categories.get('Technical') || 0) + 1);
        } else if (insightLower.includes('market') || insightLower.includes('price')) {
            categories.set('Market', (categories.get('Market') || 0) + 1);
        } else if (insightLower.includes('fundamental') || insightLower.includes('business')) {
            categories.set('Fundamental', (categories.get('Fundamental') || 0) + 1);
        } else if (insightLower.includes('risk') || insightLower.includes('concern')) {
            categories.set('Risk', (categories.get('Risk') || 0) + 1);
        } else {
            categories.set('General', (categories.get('General') || 0) + 1);
        }
    });
    
    return Array.from(categories.entries()).map(([category, count]) => ({
        category,
        count,
        percentage: ((count / insights.length) * 100).toFixed(1)
    }));
}

function categorizeRecommendations(recommendations: any[]): any[] {
    const categories = new Map();
    
    recommendations.forEach(({ recommendation }) => {
        const recLower = recommendation.toLowerCase();
        
        if (recLower.includes('buy') || recLower.includes('accumulate')) {
            categories.set('Buy/Accumulate', (categories.get('Buy/Accumulate') || 0) + 1);
        } else if (recLower.includes('sell') || recLower.includes('reduce')) {
            categories.set('Sell/Reduce', (categories.get('Sell/Reduce') || 0) + 1);
        } else if (recLower.includes('hold') || recLower.includes('maintain')) {
            categories.set('Hold/Maintain', (categories.get('Hold/Maintain') || 0) + 1);
        } else if (recLower.includes('watch') || recLower.includes('monitor')) {
            categories.set('Watch/Monitor', (categories.get('Watch/Monitor') || 0) + 1);
        } else {
            categories.set('General Advice', (categories.get('General Advice') || 0) + 1);
        }
    });
    
    return Array.from(categories.entries()).map(([category, count]) => ({
        category,
        count,
        percentage: ((count / recommendations.length) * 100).toFixed(1)
    }));
}

function generateIntelligenceSummary(intelligence: any): string {
    const signalCount = intelligence.investment_signals.length;
    const riskCount = intelligence.risk_alerts.length;
    const opportunityCount = intelligence.opportunity_highlights.length;
    
    if (signalCount === 0 && riskCount === 0 && opportunityCount === 0) {
        return "Limited actionable intelligence extracted from current reports";
    }
    
    let summary = `${signalCount} investment signals`;
    if (riskCount > 0) summary += `, ${riskCount} risk alerts`;
    if (opportunityCount > 0) summary += `, ${opportunityCount} opportunities identified`;
    
    return summary + " across analyzed reports";
}
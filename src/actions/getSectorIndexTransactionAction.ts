/**
 * SECTOR INDEX TRANSACTION ACTION
 * 
 * This file handles the sector index transaction endpoint, which provides detailed
 * information about buy/sell transactions within TokenMetrics sector indices.
 * Think of this as looking at the trading activity of a hedge fund - you can see
 * what the fund managers are buying, selling, and why they're making these decisions.
 * 
 * Real API Endpoint: GET https://api.tokenmetrics.com/v2/indices-index-specific-index-transaction
 * 
 * Investment Context: Transaction analysis is crucial for understanding market timing
 * and management strategy. Just like following the trades of successful investors
 * can provide insights, analyzing sector index rebalancing helps you understand
 * when to enter or exit positions and which tokens are gaining or losing favor.
 * 
 * Critical Correction: The original implementation used a completely wrong URL path.
 * The correct endpoint is much longer and more specific than originally implemented.
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
import type { SectorIndexTransactionResponse, SectorIndexTransactionRequest } from "../types";

/**
 * This action retrieves detailed transaction data for a specific sector index.
 * Understanding transaction patterns helps investors identify trends, timing
 * opportunities, and the overall management strategy of the sector index.
 * 
 * Why This Matters: Transaction data reveals the "smart money" movements within
 * each sector. When TokenMetrics algorithms are buying or selling specific tokens,
 * it often signals important changes in sector dynamics or token fundamentals.
 */
export const getSectorIndexTransactionAction: Action = {
    name: "getSectorIndexTransaction",
    description: "Get detailed transaction data for sector index rebalancing including buy/sell actions, reasoning, and trading insights",
    similes: [
        "get index transactions",
        "sector rebalancing data",
        "index trading activity",
        "sector buy sell actions",
        "index transaction history",
        "rebalancing analysis",
        "sector trading patterns",
        "index management decisions"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // Extract parameters for the transaction analysis request
            // The indexName is absolutely required - you can't get transaction data without specifying which index
            const requestParams: SectorIndexTransactionRequest = {
                // Required parameter: which sector index to analyze
                indexName: typeof messageContent.indexName === 'string' ? messageContent.indexName :
                          typeof messageContent.index_name === 'string' ? messageContent.index_name :
                          typeof messageContent.sector === 'string' ? messageContent.sector : undefined,
                
                // Pagination parameters for managing large transaction datasets
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : 50,
                page: typeof messageContent.page === 'number' ? messageContent.page : 1
            };
            
            // Validate that the required indexName parameter is provided
            // Transaction data is meaningless without knowing which index we're analyzing
            if (!requestParams.indexName) {
                throw new Error("indexName is required for sector index transactions. Example values: 'meme', 'defi', 'gaming', 'layer1', 'layer2', etc.");
            }
            
            // Validate parameters according to TokenMetrics API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters object for the API call
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log(`Fetching transaction data for ${requestParams.indexName} sector index from TokenMetrics API`);
            
            // Make the API call using the corrected endpoint URL
            // This was previously incorrectly mapped to /v2/sector-index-transaction
            const response = await callTokenMetricsApi<SectorIndexTransactionResponse>(
                TOKENMETRICS_ENDPOINTS.sectorIndexTransaction, // Maps to /v2/indices-index-specific-index-transaction
                apiParams,
                "GET"
            );
            
            // Format the response data according to TokenMetrics API structure
            const formattedData = formatTokenMetricsResponse<SectorIndexTransactionResponse>(response, "getSectorIndexTransaction");
            const transactions = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Analyze the transaction data to provide actionable trading insights
            // This transforms raw transaction records into investment intelligence
            const transactionAnalysis = analyzeTransactionData(transactions, requestParams.indexName);
            
            // Return comprehensive results with analysis and metadata
            return {
                success: true,
                message: `Successfully retrieved ${transactions.length} transactions for ${requestParams.indexName} sector index`,
                transactions: transactions,
                analysis: transactionAnalysis,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.sectorIndexTransaction,
                    index_name: requestParams.indexName,
                    total_transactions: transactions.length,
                    pagination: {
                        page: requestParams.page,
                        limit: requestParams.limit
                    },
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                transaction_explanation: {
                    purpose: "Shows active management decisions and rebalancing activity within the sector index",
                    transaction_types: {
                        BUY: "Index is adding or increasing allocation to a token",
                        SELL: "Index is reducing or removing allocation to a token"
                    },
                    usage_context: "Use this data to understand sector trends, timing opportunities, and management strategy",
                    investment_implications: "Transaction patterns often signal important changes in sector dynamics"
                }
            };
            
        } catch (error) {
            console.error("Error in getSectorIndexTransactionAction:", error);
            
            // Provide detailed error information with troubleshooting guidance
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve sector index transactions from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/indices-index-specific-index-transaction is accessible",
                    parameter_validation: [
                        "indexName is REQUIRED for transaction data - try 'meme', 'defi', 'gaming', etc.",
                        "Verify the index name corresponds to an existing sector index",
                        "Check pagination parameters (page, limit) are positive integers",
                        "Ensure your API key has access to transaction endpoints"
                    ],
                    common_solutions: [
                        "Try with a well-known and active index like 'defi' or 'meme'",
                        "Check if your TokenMetrics subscription includes transaction data access",
                        "Verify index name spelling (usually lowercase, no spaces)",
                        "Some newer indices may have limited transaction history"
                    ],
                    data_availability: "Transaction data varies by index activity - more active indices have more transaction records"
                }
            };
        }
    },
    
    // Validate that the runtime environment has proper configuration
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
                    text: "Show me recent transactions for the gaming sector index",
                    indexName: "gaming"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the recent transaction and rebalancing data for the gaming sector index.",
                    action: "GET_SECTOR_INDEX_TRANSACTION"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What tokens are being bought and sold in the DeFi index lately?",
                    indexName: "defi",
                    limit: 20
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll analyze the recent DeFi sector trading activity and identify which tokens are being accumulated or distributed.",
                    action: "GET_SECTOR_INDEX_TRANSACTION"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Analyze the meme coin sector management decisions",
                    sector: "meme"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll examine the meme sector transaction patterns to understand current management strategy and token selection.",
                    action: "GET_SECTOR_INDEX_TRANSACTION"
                }
            }
        ]
    ],
};

/**
 * TRANSACTION DATA ANALYSIS FUNCTION
 * 
 * This is the core intelligence engine that transforms raw transaction records
 * into actionable investment insights. Think of this as your personal trading
 * analyst who not only shows you what trades happened, but explains what they
 * mean for market trends and investment opportunities.
 * 
 * Key Analysis Areas:
 * 1. Transaction Flow - Are managers net buying or selling?
 * 2. Token Preferences - Which tokens are favored/disfavored?
 * 3. Market Timing - When are major moves happening?
 * 4. Management Strategy - What's the overall investment approach?
 */
function analyzeTransactionData(transactions: any[], indexName: string): any {
    // Handle empty data gracefully
    if (!transactions || transactions.length === 0) {
        return {
            summary: `No transaction data available for ${indexName} index`,
            activity: "Unknown - no transaction records found",
            insights: [
                "No transaction data available - the index may be new, inactive, or data collection may be in progress",
                "Some indices have infrequent rebalancing, so limited transaction history is normal"
            ],
            recommendation: "Check back later or try a more actively managed sector index"
        };
    }
    
    // Analyze transaction patterns by type (BUY vs SELL)
    const buyTransactions = transactions.filter(t => t.TRANSACTION_TYPE === 'BUY');
    const sellTransactions = transactions.filter(t => t.TRANSACTION_TYPE === 'SELL');
    
    // Calculate transaction volumes and values
    const totalBuyVolume = buyTransactions.reduce((sum, t) => sum + ((t.QUANTITY || 0) * (t.PRICE || 0)), 0);
    const totalSellVolume = sellTransactions.reduce((sum, t) => sum + ((t.QUANTITY || 0) * (t.PRICE || 0)), 0);
    const netVolume = totalBuyVolume - totalSellVolume;
    
    // Analyze transaction frequency and timing
    const transactionDates = transactions
        .map(t => t.TRANSACTION_DATE || t.DATE)
        .filter(date => date)
        .sort();
    
    const dateRange = transactionDates.length > 0 ? {
        earliest: transactionDates[0],
        latest: transactionDates[transactionDates.length - 1],
        span_days: calculateDaysBetween(transactionDates[0], transactionDates[transactionDates.length - 1])
    } : null;
    
    // Analyze which tokens are being actively managed
    const tokenActivity = analyzeTokenActivity(transactions);
    const mostActiveTokens = tokenActivity.slice(0, 5); // Top 5 most traded tokens
    
    // Determine overall management strategy and market sentiment
    const managementStrategy = determineManagementStrategy(buyTransactions.length, sellTransactions.length, netVolume);
    const activityLevel = classifyActivityLevel(transactions.length, dateRange?.span_days || 1);
    
    // Generate comprehensive insights based on transaction analysis
    const insights: string[] = [];
    
    // Volume and direction insights
    if (netVolume > 0) {
        insights.push(`Net buying activity of ${formatTokenMetricsNumber(netVolume, 'currency')} suggests sector expansion or bullish positioning`);
    } else if (netVolume < 0) {
        insights.push(`Net selling activity of ${formatTokenMetricsNumber(Math.abs(netVolume), 'currency')} indicates sector contraction or profit-taking`);
    } else {
        insights.push("Balanced buy/sell activity suggests routine rebalancing and maintenance operations");
    }
    
    // Activity level insights
    if (activityLevel === "High") {
        insights.push("High transaction frequency indicates active management and responsive rebalancing strategy");
    } else if (activityLevel === "Low") {
        insights.push("Low transaction frequency suggests passive management approach or stable sector conditions");
    }
    
    // Token-specific insights
    if (mostActiveTokens.length > 0) {
        const topToken = mostActiveTokens[0];
        if (topToken.net_activity === "Net Buying") {
            insights.push(`${topToken.symbol} shows strongest accumulation with ${topToken.total_transactions} transactions - potential sector leader`);
        } else if (topToken.net_activity === "Net Selling") {
            insights.push(`${topToken.symbol} shows distribution pattern with ${topToken.total_transactions} transactions - may be losing favor`);
        }
    }
    
    // Market timing insights
    if (dateRange && dateRange.span_days < 30 && transactions.length > 10) {
        insights.push("High recent activity suggests significant sector developments or market opportunities");
    }
    
    // Generate actionable recommendations based on transaction analysis
    const recommendations: string[] = [];
    
    // Direction-based recommendations
    if (managementStrategy.direction === "Bullish") {
        recommendations.push("Net buying activity suggests favorable sector outlook - consider increasing allocation");
        recommendations.push("Follow the tokens being accumulated for potential individual investment opportunities");
    } else if (managementStrategy.direction === "Bearish") {
        recommendations.push("Net selling activity suggests caution - consider reducing exposure or waiting for better entry");
        recommendations.push("Monitor for completion of distribution before considering re-entry");
    } else {
        recommendations.push("Balanced activity suggests stable conditions - maintain current allocation strategy");
    }
    
    // Activity-based recommendations
    if (activityLevel === "High") {
        recommendations.push("High activity periods often present better entry/exit opportunities");
        recommendations.push("Monitor transaction patterns closely during active rebalancing periods");
    }
    
    // Token-specific recommendations
    if (mostActiveTokens.length > 0) {
        const buyTargets = mostActiveTokens.filter(t => t.net_activity === "Net Buying").slice(0, 2);
        const sellTargets = mostActiveTokens.filter(t => t.net_activity === "Net Selling").slice(0, 2);
        
        if (buyTargets.length > 0) {
            recommendations.push(`Consider ${buyTargets.map(t => t.symbol).join(", ")} - showing accumulation patterns`);
        }
        
        if (sellTargets.length > 0) {
            recommendations.push(`Exercise caution with ${sellTargets.map(t => t.symbol).join(", ")} - showing distribution patterns`);
        }
    }
    
    // General recommendations
    recommendations.push(`Monitor ${indexName} sector transaction patterns for optimal entry and exit timing`);
    recommendations.push("Use transaction data to validate or challenge existing sector allocation decisions");
    
    return {
        summary: `${indexName} index shows ${managementStrategy.description} with ${transactions.length} total transactions over ${dateRange?.span_days || 0} days`,
        
        activity_overview: {
            total_transactions: transactions.length,
            buy_transactions: buyTransactions.length,
            sell_transactions: sellTransactions.length,
            activity_level: activityLevel,
            buy_sell_ratio: sellTransactions.length > 0 ? (buyTransactions.length / sellTransactions.length).toFixed(2) : "Infinite (only buys)",
            net_direction: managementStrategy.direction,
            strategy_assessment: managementStrategy.assessment
        },
        
        volume_analysis: {
            total_buy_volume: formatTokenMetricsNumber(totalBuyVolume, 'currency'),
            total_sell_volume: formatTokenMetricsNumber(totalSellVolume, 'currency'),
            net_volume: formatTokenMetricsNumber(netVolume, 'currency'),
            net_flow_direction: netVolume > 0 ? "Inflow (Net Buying)" : netVolume < 0 ? "Outflow (Net Selling)" : "Balanced",
            volume_significance: classifyVolumeSignificance(Math.abs(netVolume))
        },
        
        timing_analysis: dateRange ? {
            transaction_period: `${dateRange.earliest} to ${dateRange.latest}`,
            time_span: `${dateRange.span_days} days`,
            transaction_frequency: `${(transactions.length / Math.max(dateRange.span_days, 1)).toFixed(2)} transactions/day`,
            recent_activity: analyzeRecentActivity(transactions),
            seasonal_patterns: identifySeasonalPatterns(transactions)
        } : {
            transaction_period: "Unknown",
            note: "Insufficient date information for timing analysis"
        },
        
        token_activity_breakdown: {
            most_active_tokens: mostActiveTokens,
            total_unique_tokens: tokenActivity.length,
            accumulation_targets: mostActiveTokens.filter(t => t.net_activity === "Net Buying").length,
            distribution_targets: mostActiveTokens.filter(t => t.net_activity === "Net Selling").length,
            balanced_tokens: mostActiveTokens.filter(t => t.net_activity === "Balanced").length
        },
        
        management_insights: {
            strategy_type: managementStrategy.strategy_type,
            management_style: managementStrategy.management_style,
            rebalancing_frequency: determineRebalancingFrequency(transactions.length, dateRange?.span_days || 1),
            decision_drivers: identifyDecisionDrivers(transactions)
        },
        
        insights: insights,
        recommendations: recommendations,
        
        market_implications: {
            sector_outlook: generateSectorOutlook(managementStrategy.direction, activityLevel),
            timing_opportunities: generateTimingOpportunities(transactions, mostActiveTokens),
            risk_considerations: generateRiskConsiderations(managementStrategy, activityLevel)
        }
    };
}

/**
 * UTILITY FUNCTIONS FOR TRANSACTION ANALYSIS
 * These functions provide specialized analysis capabilities for transaction data
 */

/**
 * Analyze token-specific activity patterns
 * This reveals which tokens are being favored or disfavored by the index
 */
function analyzeTokenActivity(transactions: any[]): any[] {
    const tokenMap = new Map();
    
    // Aggregate transaction data by token
    transactions.forEach(transaction => {
        const symbol = transaction.SYMBOL;
        if (!symbol) return;
        
        if (!tokenMap.has(symbol)) {
            tokenMap.set(symbol, {
                symbol: symbol,
                name: transaction.TOKEN_NAME || transaction.NAME || 'Unknown',
                buys: 0,
                sells: 0,
                buy_volume: 0,
                sell_volume: 0,
                total_transactions: 0,
                latest_transaction: transaction.TRANSACTION_DATE || transaction.DATE,
                reasoning: []
            });
        }
        
        const tokenData = tokenMap.get(symbol);
        tokenData.total_transactions++;
        
        if (transaction.TRANSACTION_TYPE === 'BUY') {
            tokenData.buys++;
            tokenData.buy_volume += (transaction.QUANTITY || 0) * (transaction.PRICE || 0);
        } else if (transaction.TRANSACTION_TYPE === 'SELL') {
            tokenData.sells++;
            tokenData.sell_volume += (transaction.QUANTITY || 0) * (transaction.PRICE || 0);
        }
        
        // Collect reasoning if available
        if (transaction.REASONING && !tokenData.reasoning.includes(transaction.REASONING)) {
            tokenData.reasoning.push(transaction.REASONING);
        }
    });
    
    // Convert to array and add calculated fields
    return Array.from(tokenMap.values())
        .map(token => {
            const net_volume = token.buy_volume - token.sell_volume;
            let net_activity: string;
            
            if (token.buys > token.sells * 1.5) net_activity = "Net Buying";
            else if (token.sells > token.buys * 1.5) net_activity = "Net Selling";
            else net_activity = "Balanced";
            
            return {
                ...token,
                net_volume: formatTokenMetricsNumber(net_volume, 'currency'),
                net_activity: net_activity,
                buy_sell_ratio: token.sells > 0 ? (token.buys / token.sells).toFixed(2) : "Infinite",
                activity_score: token.total_transactions * (Math.abs(net_volume) / 1000000) // Weight by volume and frequency
            };
        })
        .sort((a, b) => b.activity_score - a.activity_score);
}

/**
 * Determine overall management strategy from transaction patterns
 */
function determineManagementStrategy(buyCount: number, sellCount: number, netVolume: number): any {
    let direction: string;
    let description: string;
    let strategy_type: string;
    let management_style: string;
    let assessment: string;
    
    const buyRatio = buyCount / (buyCount + sellCount);
    
    if (buyRatio > 0.7) {
        direction = "Bullish";
        description = "aggressive accumulation strategy";
        strategy_type = "Growth-Oriented";
        assessment = "Highly optimistic sector outlook";
    } else if (buyRatio > 0.6) {
        direction = "Moderately Bullish";
        description = "selective accumulation strategy";
        strategy_type = "Opportunistic Growth";
        assessment = "Cautiously optimistic sector outlook";
    } else if (buyRatio > 0.4) {
        direction = "Neutral";
        description = "balanced rebalancing strategy";
        strategy_type = "Maintenance-Focused";
        assessment = "Stable sector management";
    } else if (buyRatio > 0.3) {
        direction = "Moderately Bearish";
        description = "selective distribution strategy";
        strategy_type = "Risk Management";
        assessment = "Cautious sector positioning";
    } else {
        direction = "Bearish";
        description = "active distribution strategy";
        strategy_type = "Defensive";
        assessment = "Pessimistic sector outlook";
    }
    
    // Determine management style based on activity patterns
    const totalTransactions = buyCount + sellCount;
    if (totalTransactions > 50) {
        management_style = "Highly Active";
    } else if (totalTransactions > 20) {
        management_style = "Moderately Active";
    } else if (totalTransactions > 5) {
        management_style = "Conservative";
    } else {
        management_style = "Passive";
    }
    
    return {
        direction,
        description,
        strategy_type,
        management_style,
        assessment,
        confidence: buyRatio > 0.7 || buyRatio < 0.3 ? "High" : "Moderate"
    };
}

/**
 * Classify activity level based on transaction frequency
 */
function classifyActivityLevel(transactionCount: number, timeSpanDays: number): string {
    const transactionsPerDay = transactionCount / Math.max(timeSpanDays, 1);
    
    if (transactionsPerDay > 2) return "Very High";
    if (transactionsPerDay > 1) return "High";
    if (transactionsPerDay > 0.5) return "Moderate";
    if (transactionsPerDay > 0.1) return "Low";
    return "Very Low";
}

/**
 * Calculate days between two dates
 */
function calculateDaysBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Classify volume significance
 */
function classifyVolumeSignificance(volume: number): string {
    if (volume > 10000000) return "Very High Significance"; // $10M+
    if (volume > 1000000) return "High Significance";       // $1M+
    if (volume > 100000) return "Moderate Significance";    // $100K+
    if (volume > 10000) return "Low Significance";          // $10K+
    return "Minimal Significance";
}

/**
 * Analyze recent activity patterns
 */
function analyzeRecentActivity(transactions: any[]): string {
    const sortedTransactions = transactions
        .filter(t => t.TRANSACTION_DATE || t.DATE)
        .sort((a, b) => new Date(b.TRANSACTION_DATE || b.DATE).getTime() - new Date(a.TRANSACTION_DATE || a.DATE).getTime());
    
    if (sortedTransactions.length === 0) return "No dated transactions available";
    
    const recentTransactions = sortedTransactions.slice(0, 10); // Last 10 transactions
    const recentBuys = recentTransactions.filter(t => t.TRANSACTION_TYPE === 'BUY').length;
    const recentSells = recentTransactions.filter(t => t.TRANSACTION_TYPE === 'SELL').length;
    
    if (recentBuys > recentSells * 2) return "Recent Buying Surge";
    if (recentSells > recentBuys * 2) return "Recent Selling Pressure";
    return "Recent Balanced Activity";
}

/**
 * Identify seasonal or time-based patterns
 */
function identifySeasonalPatterns(transactions: any[]): string {
    // This is a simplified analysis - in a full implementation, you might do more sophisticated time series analysis
    const datedTransactions = transactions.filter(t => t.TRANSACTION_DATE || t.DATE);
    
    if (datedTransactions.length < 10) return "Insufficient data for pattern analysis";
    
    // Group by month to identify patterns
    const monthlyActivity = new Map();
    datedTransactions.forEach(t => {
        const date = new Date(t.TRANSACTION_DATE || t.DATE);
        const month = date.getMonth();
        monthlyActivity.set(month, (monthlyActivity.get(month) || 0) + 1);
    });
    
    const months = Array.from(monthlyActivity.entries()).sort((a, b) => b[1] - a[1]);
    
    if (months.length > 0) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `Most active in ${monthNames[months[0][0]]} (${months[0][1]} transactions)`;
    }
    
    return "No clear seasonal patterns identified";
}

/**
 * Determine rebalancing frequency classification
 */
function determineRebalancingFrequency(transactionCount: number, timeSpanDays: number): string {
    const avgDaysBetweenTransactions = timeSpanDays / Math.max(transactionCount, 1);
    
    if (avgDaysBetweenTransactions < 1) return "Daily Rebalancing";
    if (avgDaysBetweenTransactions < 7) return "Weekly Rebalancing";
    if (avgDaysBetweenTransactions < 30) return "Monthly Rebalancing";
    if (avgDaysBetweenTransactions < 90) return "Quarterly Rebalancing";
    return "Infrequent Rebalancing";
}

/**
 * Identify decision drivers from transaction reasoning
 */
function identifyDecisionDrivers(transactions: any[]): string[] {
    const reasoningSet = new Set<string>();
    
    transactions.forEach(t => {
        if (t.REASONING && typeof t.REASONING === 'string') {
            reasoningSet.add(t.REASONING);
        }
    });
    
    const drivers = Array.from(reasoningSet);
    
    if (drivers.length === 0) {
        return ["Decision reasoning not available in transaction data"];
    }
    
    return drivers.slice(0, 5); // Top 5 most common reasons
}

/**
 * Generate sector outlook based on transaction analysis
 */
function generateSectorOutlook(direction: string, activityLevel: string): string {
    if (direction === "Bullish" && activityLevel === "High") {
        return "Very Positive - Strong accumulation with high activity suggests significant growth expectations";
    }
    if (direction === "Bullish") {
        return "Positive - Net accumulation indicates optimistic sector outlook";
    }
    if (direction === "Bearish" && activityLevel === "High") {
        return "Concerning - Active distribution suggests deteriorating sector fundamentals";
    }
    if (direction === "Bearish") {
        return "Negative - Net distribution indicates pessimistic sector outlook";
    }
    return "Neutral - Balanced activity suggests stable but unremarkable sector conditions";
}

/**
 * Generate timing opportunities based on transaction patterns
 */
function generateTimingOpportunities(transactions: any[], mostActiveTokens: any[]): string[] {
    const opportunities = [];
    
    // Recent activity opportunities
    const recentTransactions = transactions.slice(-10);
    const recentBuyTargets = new Set(
        recentTransactions
            .filter(t => t.TRANSACTION_TYPE === 'BUY')
            .map(t => t.SYMBOL)
    );
    
    if (recentBuyTargets.size > 0) {
        opportunities.push(`Recent buying activity in ${Array.from(recentBuyTargets).slice(0, 3).join(", ")} suggests near-term opportunities`);
    }
    
    // High activity tokens
    const highActivityTokens = mostActiveTokens.filter(t => t.total_transactions > 5);
    if (highActivityTokens.length > 0) {
        opportunities.push(`High transaction volume in ${highActivityTokens[0].symbol} indicates significant position changes - monitor for completion`);
    }
    
    // Pattern-based opportunities
    const buyingTokens = mostActiveTokens.filter(t => t.net_activity === "Net Buying");
    if (buyingTokens.length > 2) {
        opportunities.push("Multiple tokens showing accumulation patterns suggest broad sector optimism");
    }
    
    if (opportunities.length === 0) {
        opportunities.push("Monitor for changes in transaction patterns to identify emerging opportunities");
    }
    
    return opportunities;
}

/**
 * Generate risk considerations based on transaction analysis
 */
function generateRiskConsiderations(managementStrategy: any, activityLevel: string): string[] {
    const risks = [];
    
    if (managementStrategy.direction === "Bearish") {
        risks.push("Net selling activity suggests sector headwinds - exercise caution with new positions");
    }
    
    if (activityLevel === "Very High") {
        risks.push("Extremely high transaction activity may indicate volatile sector conditions");
    }
    
    if (managementStrategy.management_style === "Highly Active") {
        risks.push("Active management style increases tracking error and transaction costs");
    }
    
    if (managementStrategy.confidence === "Moderate") {
        risks.push("Mixed signals suggest uncertain sector outlook - maintain flexibility");
    }
    
    // General risks
    risks.push("Transaction patterns are historical - future rebalancing may differ significantly");
    risks.push("Sector index changes can impact individual token weightings and performance");
    
    return risks;
}
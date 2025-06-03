// tests/manual/02-endpoint-testing.js

/**
 * COMPREHENSIVE ENDPOINT TESTING
 * 
 * This test systematically verifies ALL 20 TokenMetrics endpoints:
 * 
 * EXISTING ENDPOINTS (10):
 * - Tokens, Price, Top Market Cap, Trader Grades, Quantmetrics
 * - Trading Signals, Market Metrics, Sector Holdings, Index Performance, Sector Transactions
 * 
 * NEW ENDPOINTS (10):
 * - Hourly OHLCV, Daily OHLCV, Investor Grades, AI Reports, Crypto Investors
 * - Resistance & Support, Token Metrics AI, Sentiment, Scenario Analysis, Correlation
 */

import { 
    // EXISTING ENDPOINTS
    getTokensAction,
    getPriceAction,
    getTopMarketCapAction,
    getTraderGradesAction,
    getQuantmetricsAction,
    getTradingSignalsAction,
    getMarketMetricsAction,
    getSectorIndicesHoldingsAction,
    getIndexPerformanceAction,
    getSectorIndexTransactionAction,
    
    // NEW ENDPOINTS
    getHourlyOhlcvAction,
    getDailyOhlcvAction,
    getInvestorGradesAction,
    getAiReportsAction,
    getCryptoInvestorsAction,
    getResistanceSupportAction,
    getTMAIAction,
    getSentimentAction,
    getScenarioAnalysisAction,
    getCorrelationAction
} from '../../actions/index.ts';

// Mock runtime for testing (simulates ElizaOS environment)
const mockRuntime = {
    getSetting: (key) => {
        if (key === "TOKENMETRICS_API_KEY") {
            return process.env.TOKENMETRICS_API_KEY;
        }
        return null;
    }
};

/**
 * Test configurations for ALL endpoints (existing + new)
 */
const endpointTests = [
    // ===== EXISTING ENDPOINTS =====
    {
        name: "Tokens List",
        description: "Get list of supported cryptocurrencies",
        action: getTokensAction,
        category: "EXISTING",
        testMessage: {
            content: { 
                limit: 5,
                category: "defi" // Filter to DeFi tokens for focused testing
            }
        },
        expectedKeys: ['success', 'tokens', 'metadata'],
        successCriteria: (result) => {
            return result.success && 
                   Array.isArray(result.tokens) && 
                   result.tokens.length > 0 &&
                   result.tokens[0].TOKEN_ID &&
                   result.tokens[0].SYMBOL;
        }
    },
    
    {
        name: "Bitcoin Price",
        description: "Get current Bitcoin price data",
        action: getPriceAction,
        category: "EXISTING",
        testMessage: {
            content: { 
                symbol: "BTC" 
            }
        },
        expectedKeys: ['success', 'price_data', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.price_data && 
                   result.price_data.length > 0 &&
                   result.price_data[0].PRICE > 0;
        }
    },
    
    {
        name: "Top Market Cap",
        description: "Get top cryptocurrencies by market capitalization",
        action: getTopMarketCapAction,
        category: "EXISTING",
        testMessage: {
            content: { 
                top_k: 5 // Get top 5 tokens
            }
        },
        expectedKeys: ['success', 'top_tokens', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.top_tokens && 
                   result.top_tokens.length > 0 &&
                   result.top_tokens[0].TOKEN_ID &&
                   result.top_tokens[0].TOKEN_NAME &&
                   result.top_tokens[0].TOKEN_SYMBOL;
        }
    },
    
    {
        name: "Bitcoin Trader Grades",
        description: "Get AI-powered trading grades for Bitcoin",
        action: getTraderGradesAction,
        category: "EXISTING",
        testMessage: {
            content: { 
                symbol: "BTC",
                limit: 3
            }
        },
        expectedKeys: ['success', 'trader_grades', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.trader_grades && 
                   result.trader_grades.length > 0;
        }
    },
    
    {
        name: "Bitcoin Quantmetrics",
        description: "Get quantitative risk metrics for Bitcoin",
        action: getQuantmetricsAction,
        category: "EXISTING",
        testMessage: {
            content: { 
                symbol: "BTC",
                limit: 3
            }
        },
        expectedKeys: ['success', 'quantmetrics', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.quantmetrics && 
                   result.quantmetrics.length > 0;
        }
    },
    
    {
        name: "Trading Signals",
        description: "Get AI trading signals",
        action: getTradingSignalsAction,
        category: "EXISTING",
        testMessage: {
            content: { 
                symbol: "BTC",
                limit: 3
            }
        },
        expectedKeys: ['success', 'trading_signals', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.trading_signals;
        }
    },
    
    {
        name: "Market Metrics",
        description: "Get overall crypto market analytics",
        action: getMarketMetricsAction,
        category: "EXISTING",
        testMessage: {
            content: { 
                limit: 5
            }
        },
        expectedKeys: ['success', 'market_metrics', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.market_metrics;
        }
    },
    
    {
        name: "DeFi Sector Holdings",
        description: "Get DeFi sector index composition",
        action: getSectorIndicesHoldingsAction,
        category: "EXISTING",
        testMessage: {
            content: { 
                indexName: "defi",
                limit: 5
            }
        },
        expectedKeys: ['success', 'holdings', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.holdings;
        }
    },
    
    {
        name: "DeFi Index Performance",
        description: "Get DeFi sector performance metrics",
        action: getIndexPerformanceAction,
        category: "EXISTING",
        testMessage: {
            content: { 
                indexName: "defi",
                startDate: "2024-01-01",
                endDate: "2024-12-31"
            }
        },
        expectedKeys: ['success', 'performance_data', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.performance_data;
        }
    },
    
    {
        name: "DeFi Sector Transactions",
        description: "Get DeFi sector rebalancing transactions",
        action: getSectorIndexTransactionAction,
        category: "EXISTING",
        testMessage: {
            content: { 
                indexName: "defi",
                limit: 5
            }
        },
        expectedKeys: ['success', 'transactions', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.transactions;
        }
    },

    // ===== NEW ENDPOINTS =====
    {
        name: "Hourly OHLCV Data",
        description: "Get hourly price/volume data for technical analysis",
        action: getHourlyOhlcvAction,
        category: "NEW",
        testMessage: {
            content: { 
                symbol: "BTC",
                limit: 24 // Last 24 hours
            }
        },
        expectedKeys: ['success', 'ohlcv_data', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.ohlcv_data && 
                   Array.isArray(result.ohlcv_data) &&
                   result.ohlcv_data.length > 0 &&
                   result.ohlcv_data[0].OPEN !== undefined &&
                   result.ohlcv_data[0].HIGH !== undefined &&
                   result.ohlcv_data[0].LOW !== undefined &&
                   result.ohlcv_data[0].CLOSE !== undefined &&
                   result.ohlcv_data[0].VOLUME !== undefined;
        }
    },
    
    {
        name: "Daily OHLCV Data",
        description: "Get daily price/volume data for swing trading",
        action: getDailyOhlcvAction,
        category: "NEW",
        testMessage: {
            content: { 
                symbol: "ETH",
                limit: 30 // Last 30 days
            }
        },
        expectedKeys: ['success', 'ohlcv_data', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.ohlcv_data && 
                   Array.isArray(result.ohlcv_data) &&
                   result.ohlcv_data.length > 0 &&
                   result.ohlcv_data[0].OPEN !== undefined &&
                   result.ohlcv_data[0].HIGH !== undefined &&
                   result.ohlcv_data[0].LOW !== undefined &&
                   result.ohlcv_data[0].CLOSE !== undefined &&
                   result.ohlcv_data[0].VOLUME !== undefined;
        }
    },
    
    {
        name: "Investor Grades",
        description: "Get long-term investment grades and analysis",
        action: getInvestorGradesAction,
        category: "NEW",
        testMessage: {
            content: { 
                symbol: "BTC",
                limit: 5
            }
        },
        expectedKeys: ['success', 'investor_grades', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.investor_grades && 
                   Array.isArray(result.investor_grades) &&
                   result.investor_grades.length >= 0;
        }
    },
    
    {
        name: "AI Reports",
        description: "Get AI-generated comprehensive analysis reports",
        action: getAiReportsAction,
        category: "NEW",
        testMessage: {
            content: { 
                symbol: "BTC",
                limit: 3
            }
        },
        expectedKeys: ['success', 'ai_reports', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.ai_reports && 
                   Array.isArray(result.ai_reports) &&
                   result.ai_reports.length >= 0;
        }
    },
    
    {
        name: "Crypto Investors",
        description: "Get influential crypto investors and their performance",
        action: getCryptoInvestorsAction,
        category: "NEW",
        testMessage: {
            content: { 
                limit: 10
            }
        },
        expectedKeys: ['success', 'crypto_investors', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.crypto_investors && 
                   Array.isArray(result.crypto_investors) &&
                   result.crypto_investors.length > 0 &&
                   result.crypto_investors[0].INVESTOR_NAME !== undefined;
        }
    },
    
    {
        name: "Resistance & Support",
        description: "Get key technical levels for trading decisions",
        action: getResistanceSupportAction,
        category: "NEW",
        testMessage: {
            content: { 
                symbol: "BTC",
                limit: 5
            }
        },
        expectedKeys: ['success', 'resistance_support_levels', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.resistance_support_levels && 
                   Array.isArray(result.resistance_support_levels) &&
                   result.resistance_support_levels.length > 0;
        }
    },
    
    {
        name: "TokenMetrics AI (TMAI)",
        description: "Test AI assistant for crypto analysis",
        action: getTMAIAction,
        category: "NEW",
        testMessage: {
            content: { 
                query: "What is the current outlook for Bitcoin?"
            }
        },
        expectedKeys: ['success', 'ai_response', 'enhanced_analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.ai_response && 
                   (result.ai_response.response !== undefined || 
                    result.ai_response.answer !== undefined ||
                    result.ai_response.content !== undefined ||
                    typeof result.ai_response === 'string');
        }
    },
    
    {
        name: "Sentiment Analysis",
        description: "Get social sentiment from Twitter, Reddit, and news",
        action: getSentimentAction,
        category: "NEW",
        testMessage: {
            content: { 
                limit: 7 // Last 7 days
            }
        },
        expectedKeys: ['success', 'sentiment_data', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.sentiment_data && 
                   Array.isArray(result.sentiment_data) &&
                   result.sentiment_data.length >= 0;
        }
    },
    
    {
        name: "Scenario Analysis",
        description: "Get price predictions under different market scenarios",
        action: getScenarioAnalysisAction,
        category: "NEW",
        testMessage: {
            content: { 
                symbol: "BTC",
                limit: 5
            }
        },
        expectedKeys: ['success', 'scenario_data', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.scenario_data && 
                   Array.isArray(result.scenario_data) &&
                   result.scenario_data.length >= 0;
        }
    },
    
    {
        name: "Correlation Analysis",
        description: "Get token correlation data for portfolio diversification",
        action: getCorrelationAction,
        category: "NEW",
        testMessage: {
            content: { 
                symbol: "BTC",
                limit: 10
            }
        },
        expectedKeys: ['success', 'correlation_data', 'analysis'],
        successCriteria: (result) => {
            return result.success && 
                   result.correlation_data && 
                   Array.isArray(result.correlation_data) &&
                   result.correlation_data.length >= 0;
        }
    }
];

async function runEndpointTests() {
    console.log("🧪 COMPREHENSIVE ENDPOINT TESTING - ALL 20 ENDPOINTS");
    console.log("=" * 70);
    
    const existingEndpoints = endpointTests.filter(test => test.category === "EXISTING");
    const newEndpoints = endpointTests.filter(test => test.category === "NEW");
    
    console.log(`📊 Testing ${endpointTests.length} total endpoints:`);
    console.log(`   • ${existingEndpoints.length} EXISTING endpoints`);
    console.log(`   • ${newEndpoints.length} NEW endpoints`);
    console.log("");
    
    const results = {
        passed: 0,
        failed: 0,
        existingPassed: 0,
        existingFailed: 0,
        newPassed: 0,
        newFailed: 0,
        details: []
    };
    
    for (let i = 0; i < endpointTests.length; i++) {
        const test = endpointTests[i];
        const isNew = test.category === "NEW";
        
        console.log(`📋 Test ${i + 1}/${endpointTests.length}: ${test.name} ${isNew ? '🆕' : '📈'}`);
        console.log(`   Category: ${test.category}`);
        console.log(`   Description: ${test.description}`);
        console.log(`   Testing with:`, JSON.stringify(test.testMessage.content));
        
        try {
            // Validate the action can run
            const canRun = await test.action.validate(mockRuntime, test.testMessage);
            if (!canRun) {
                throw new Error("Action validation failed - check API key");
            }
            
            console.log("   🔄 Making API request...");
            
            // Execute the action
            const result = await test.action.handler(mockRuntime, test.testMessage, null);
            
            // Check if result has expected structure
            const hasExpectedKeys = test.expectedKeys.every(key => 
                result.hasOwnProperty(key)
            );
            
            if (!hasExpectedKeys) {
                throw new Error(`Missing expected keys. Got: ${Object.keys(result)}`);
            }
            
            // Run success criteria check
            const meetsSuccessCriteria = test.successCriteria(result);
            
            if (meetsSuccessCriteria) {
                console.log("   ✅ PASSED - Response structure and data look correct");
                
                // Show some sample data for verification
                if (result.success) {
                    console.log("   📊 Sample response data:");
                    
                    // Handle all different response types
                    if (result.tokens && result.tokens.length > 0) {
                        const token = result.tokens[0];
                        console.log(`      First token: ${token.SYMBOL || token.TOKEN_SYMBOL} (${token.NAME || token.TOKEN_NAME})`);
                        if (token.TOKEN_ID) console.log(`      Token ID: ${token.TOKEN_ID}`);
                    }
                    else if (result.price_data && result.price_data.length > 0) {
                        const price = result.price_data[0];
                        console.log(`      Price: $${price.PRICE?.toLocaleString()}`);
                        if (price.TOKEN_NAME) console.log(`      Token: ${price.TOKEN_NAME} (${price.TOKEN_SYMBOL})`);
                    }
                    else if (result.top_tokens && result.top_tokens.length > 0) {
                        const topToken = result.top_tokens[0];
                        console.log(`      #1 Token: ${topToken.TOKEN_NAME} (${topToken.TOKEN_SYMBOL})`);
                        console.log(`      Total tokens returned: ${result.top_tokens.length}`);
                    }
                    else if (result.ohlcv_data && result.ohlcv_data.length > 0) {
                        const ohlcv = result.ohlcv_data[0];
                        console.log(`      Latest OHLCV: O:$${ohlcv.OPEN} H:$${ohlcv.HIGH} L:$${ohlcv.LOW} C:$${ohlcv.CLOSE}`);
                        console.log(`      Volume: ${ohlcv.VOLUME?.toLocaleString()}`);
                        console.log(`      Total records: ${result.ohlcv_data.length}`);
                    }
                    else if (result.investor_grades && result.investor_grades.length > 0) {
                        const grade = result.investor_grades[0];
                        console.log(`      Token: ${grade.TOKEN_NAME} (${grade.TOKEN_SYMBOL})`);
                        console.log(`      Investor Grade: ${grade.TM_INVESTOR_GRADE}/100`);
                        console.log(`      Total grades: ${result.investor_grades.length}`);
                    }
                    else if (result.ai_reports && result.ai_reports.length > 0) {
                        const report = result.ai_reports[0];
                        console.log(`      Report Type: AI Analysis`);
                        console.log(`      Token: ${report.TOKEN_NAME} (${report.TOKEN_SYMBOL})`);
                        console.log(`      Content Preview: ${report.INVESTMENT_ANALYSIS?.substring(0, 100)}...`);
                        console.log(`      Total reports: ${result.ai_reports.length}`);
                    }
                    else if (result.crypto_investors && result.crypto_investors.length > 0) {
                        const investor = result.crypto_investors[0];
                        console.log(`      Top Investor: ${investor.INVESTOR_NAME || investor.NAME}`);
                        if (investor.INVESTOR_SCORE) console.log(`      Score: ${investor.INVESTOR_SCORE}`);
                        console.log(`      Total investors: ${result.crypto_investors.length}`);
                    }
                    else if (result.resistance_support_levels && result.resistance_support_levels.length > 0) {
                        const level = result.resistance_support_levels[0];
                        console.log(`      Token: ${level.TOKEN_NAME} (${level.TOKEN_SYMBOL})`);
                        console.log(`      Level Type: Technical Levels`);
                        const levels = level.HISTORICAL_RESISTANCE_SUPPORT_LEVELS;
                        if (levels && typeof levels === 'object') {
                            console.log(`      Levels Available: ${Object.keys(levels).length} historical levels`);
                        }
                        console.log(`      Total levels: ${result.resistance_support_levels.length}`);
                    }
                    else if (result.ai_response) {
                        const responseText = result.ai_response.response || result.ai_response.answer || result.ai_response.content || JSON.stringify(result.ai_response);
                        console.log(`      AI Response: ${responseText.substring(0, 150)}...`);
                        if (result.ai_response.confidence) console.log(`      Confidence: ${result.ai_response.confidence}`);
                    }
                    else if (result.sentiment_data && result.sentiment_data.length > 0) {
                        const sentiment = result.sentiment_data[0];
                        console.log(`      Date: ${sentiment.DATETIME}`);
                        console.log(`      Sentiment Score: ${sentiment.MARKET_SENTIMENT_GRADE}/100 (${sentiment.MARKET_SENTIMENT_LABEL})`);
                        if (sentiment.TWITTER_SENTIMENT_LABEL) console.log(`      Twitter: ${sentiment.TWITTER_SENTIMENT_LABEL}`);
                        console.log(`      Total records: ${result.sentiment_data.length}`);
                    }
                    else if (result.scenario_data && result.scenario_data.length > 0) {
                        const scenario = result.scenario_data[0];
                        console.log(`      Token: ${scenario.TOKEN_NAME} (${scenario.TOKEN_SYMBOL})`);
                        console.log(`      Scenario: Price Prediction Analysis`);
                        if (scenario.SCENARIO_PREDICTION && scenario.SCENARIO_PREDICTION.current_price) {
                            console.log(`      Current Price: $${scenario.SCENARIO_PREDICTION.current_price}`);
                        }
                        console.log(`      Total scenarios: ${result.scenario_data.length}`);
                    }
                    else if (result.correlation_data && result.correlation_data.length > 0) {
                        const correlation = result.correlation_data[0];
                        console.log(`      Token: ${correlation.SYMBOL || correlation.TOKEN_NAME || correlation.NAME}`);
                        const corrValue = correlation.CORRELATION || correlation.CORRELATION_VALUE;
                        if (corrValue !== undefined) console.log(`      Correlation: ${corrValue}`);
                        console.log(`      Total correlations: ${result.correlation_data.length}`);
                    }
                    else if (result.trader_grades && result.trader_grades.length > 0) {
                        const grade = result.trader_grades[0];
                        console.log(`      Token: ${grade.TOKEN_NAME || grade.SYMBOL} - Grade: ${grade.GRADE}`);
                        console.log(`      Total grades: ${result.trader_grades.length}`);
                    }
                    else if (result.quantmetrics && result.quantmetrics.length > 0) {
                        const quant = result.quantmetrics[0];
                        console.log(`      Token: ${quant.TOKEN_NAME || quant.SYMBOL}`);
                        if (quant.RISK_SCORE) console.log(`      Risk Score: ${quant.RISK_SCORE}`);
                        console.log(`      Total metrics: ${result.quantmetrics.length}`);
                    }
                    else if (result.trading_signals) {
                        if (Array.isArray(result.trading_signals) && result.trading_signals.length > 0) {
                            const signal = result.trading_signals[0];
                            console.log(`      Signal: ${signal.SIGNAL || signal.signal_type}`);
                            console.log(`      Total signals: ${result.trading_signals.length}`);
                        }
                    }
                    else if (result.market_metrics) {
                        console.log(`      Market metrics available: ${typeof result.market_metrics}`);
                    }
                    else if (result.holdings) {
                        if (Array.isArray(result.holdings) && result.holdings.length > 0) {
                            console.log(`      Holdings count: ${result.holdings.length}`);
                        }
                    }
                    else if (result.performance_data) {
                        if (Array.isArray(result.performance_data) && result.performance_data.length > 0) {
                            console.log(`      Performance records: ${result.performance_data.length}`);
                        }
                    }
                    else if (result.transactions) {
                        if (Array.isArray(result.transactions) && result.transactions.length > 0) {
                            console.log(`      Transaction count: ${result.transactions.length}`);
                        }
                    }
                    
                    // Analysis summary (common to most endpoints)
                    if (result.analysis && result.analysis.summary) {
                        console.log(`      Analysis: ${result.analysis.summary}`);
                    }
                }
                
                results.passed++;
                if (isNew) {
                    results.newPassed++;
                } else {
                    results.existingPassed++;
                }
                results.details.push({ test: test.name, status: 'PASSED', category: test.category, error: null });
            } else {
                throw new Error("Response data does not meet success criteria");
            }
            
        } catch (error) {
            console.log("   ❌ FAILED");
            console.log("   🔍 Error:", error.message);
            
            // Provide specific guidance based on error type
            if (error.message.includes('API key')) {
                console.log("   💡 Check your TOKENMETRICS_API_KEY environment variable");
            } else if (error.message.includes('messages')) {
                console.log("   💡 TMAI endpoint requires a messages array with user queries");
            } else if (error.message.includes('indexName')) {
                console.log("   💡 This endpoint requires a valid sector index name");
            } else if (error.message.includes('401')) {
                console.log("   💡 Authentication failed - verify your API key is valid");
            } else if (error.message.includes('404')) {
                console.log("   💡 Endpoint not found - API structure may have changed");
            } else if (error.message.includes('422')) {
                console.log("   💡 Invalid parameters - check the request format");
            } else if (error.message.includes('429')) {
                console.log("   💡 Rate limit exceeded - wait before retrying");
            }
            
            results.failed++;
            if (isNew) {
                results.newFailed++;
            } else {
                results.existingFailed++;
            }
            results.details.push({ test: test.name, status: 'FAILED', category: test.category, error: error.message });
        }
        
        console.log(""); // Empty line for readability
        
        // Add a small delay between tests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Final comprehensive summary
    console.log("🏁 COMPREHENSIVE TESTING SUMMARY - ALL 20 ENDPOINTS");
    console.log("=" * 60);
    console.log(`📊 OVERALL RESULTS:`);
    console.log(`   ✅ Total Passed: ${results.passed}/${endpointTests.length}`);
    console.log(`   ❌ Total Failed: ${results.failed}/${endpointTests.length}`);
    console.log(`   📈 Success Rate: ${((results.passed / endpointTests.length) * 100).toFixed(1)}%`);
    console.log("");
    console.log(`📈 EXISTING ENDPOINTS (${existingEndpoints.length}):`);
    console.log(`   ✅ Passed: ${results.existingPassed}/${existingEndpoints.length}`);
    console.log(`   ❌ Failed: ${results.existingFailed}/${existingEndpoints.length}`);
    console.log(`   📊 Success Rate: ${((results.existingPassed / existingEndpoints.length) * 100).toFixed(1)}%`);
    console.log("");
    console.log(`🆕 NEW ENDPOINTS (${newEndpoints.length}):`);
    console.log(`   ✅ Passed: ${results.newPassed}/${newEndpoints.length}`);
    console.log(`   ❌ Failed: ${results.newFailed}/${newEndpoints.length}`);
    console.log(`   📊 Success Rate: ${((results.newPassed / newEndpoints.length) * 100).toFixed(1)}%`);
    
    if (results.failed > 0) {
        console.log("\n🔍 Failed Tests Details:");
        results.details
            .filter(detail => detail.status === 'FAILED')
            .forEach(detail => {
                console.log(`   • ${detail.test} (${detail.category}): ${detail.error}`);
            });
    }
    
    if (results.passed === endpointTests.length) {
        console.log("\n🎉 ALL 20 ENDPOINTS PASSED!");
        console.log("   🚀 Your complete TokenMetrics integration is working perfectly.");
        console.log("   ✨ Ready for production use with full analysis capabilities.");
        console.log("   📈 Both existing and new endpoints are fully functional.");
    } else if (results.passed > endpointTests.length * 0.8) {
        console.log("\n⚠️  MOSTLY WORKING");
        console.log("   📊 Most endpoints are functional. Fix the failing ones before production.");
        console.log(`   🎯 ${results.existingPassed}/${existingEndpoints.length} existing endpoints working`);
        console.log(`   🆕 ${results.newPassed}/${newEndpoints.length} new endpoints working`);
    } else {
        console.log("\n💥 MAJOR ISSUES");
        console.log("   🔧 Multiple endpoints are failing. Check your API access and configuration.");
        console.log("   📋 Review the error details above for specific guidance.");
    }
    
    // Provide comprehensive recommendations
    console.log("\n📋 ENDPOINT USAGE RECOMMENDATIONS:");
    console.log("   📈 EXISTING ENDPOINTS - Core market data and analysis");
    console.log("   🆕 NEW ENDPOINTS - Advanced analysis and AI insights:");
    console.log("      • OHLCV Data: Perfect for technical analysis and charting");
    console.log("      • Investor Grades: Use for long-term investment decisions");
    console.log("      • AI Reports: Comprehensive analysis for research");
    console.log("      • Crypto Investors: Follow influential market participants");
    console.log("      • Resistance/Support: Key levels for trading strategies");
    console.log("      • TMAI: Interactive AI assistant for market insights");
    console.log("      • Sentiment: Social sentiment for market timing");
    console.log("      • Scenario Analysis: Risk assessment and price predictions");
    console.log("      • Correlation: Portfolio diversification insights");
    
    return results;
}

// Run the comprehensive test for ALL endpoints
console.log("Starting comprehensive testing of ALL 20 TokenMetrics endpoints...");
runEndpointTests().catch(error => {
    console.log("💥 Comprehensive test runner failed:", error.message);
});
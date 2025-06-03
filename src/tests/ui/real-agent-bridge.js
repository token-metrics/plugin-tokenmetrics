// tests/ui/real-agent-bridge.js - REAL API integration, no dummy data

import * as dotenv from 'dotenv';
dotenv.config();

import { tokenmetricsPlugin } from '../../index.js';

/**
 * REAL TokenMetrics Agent Bridge
 * 
 * This class connects your test UI directly to your real TokenMetrics actions.
 * Every response comes from the actual TokenMetrics API - no simulated data anywhere.
 * 
 * Think of this as the direct neural pathway between your user interface
 * and the TokenMetrics intelligence system.
 */
class RealTokenMetricsAgentBridge {
    constructor() {
        this.runtime = this.createProductionRuntime();
        this.plugin = tokenmetricsPlugin;
        this.connectionVerified = false;
        
        // Initialize without blocking - verify connection in background
        this.initializeRealConnection();
    }
    
    /**
     * Create a production-ready runtime that matches ElizaOS environment
     * This handles all the real configuration and API connections
     */
    createProductionRuntime() {
        return {
            getSetting: (key) => {
                // Map environment variables directly from .env file
                const envMap = {
                    "TOKENMETRICS_API_KEY": process.env.TOKENMETRICS_API_KEY,
                    "TOKENMETRICS_BASE_URL": process.env.TOKENMETRICS_BASE_URL,
                    "TOKENMETRICS_API_VERSION": process.env.TOKENMETRICS_API_VERSION
                };
                
                return envMap[key] || process.env[key] || null;
            },
            
            log: (message) => {
                const timestamp = new Date().toISOString();
                console.log(`[${timestamp}] [Runtime] ${message}`);
            },
            
            error: (message) => {
                const timestamp = new Date().toISOString();
                console.error(`[${timestamp}] [Runtime ERROR] ${message}`);
            },
            
            // Add metrics tracking for real usage
            trackMetric: (metricName, value) => {
                console.log(`[Metric] ${metricName}: ${value}`);
            }
        };
    }
    
    /**
     * Initialize real connection and verify everything works
     */
    async initializeRealConnection() {
        console.log("🔗 Initializing REAL TokenMetrics Agent Bridge");
        console.log("📋 Environment Configuration:");
        console.log(`   API Base URL: ${process.env.TOKENMETRICS_BASE_URL}`);
        console.log(`   API Version: ${process.env.TOKENMETRICS_API_VERSION}`);
        console.log(`   API Key Set: ${process.env.TOKENMETRICS_API_KEY ? 'Yes' : 'No'}`);
        
        // Log available actions immediately
        console.log(`📋 Loaded ${this.plugin.actions.length} real actions:`);
        this.plugin.actions.forEach(action => {
            console.log(`   • ${action.name}: ${action.description}`);
        });
        
        // Verify API connection in background (non-blocking)
        this.verifyRealApiConnection().catch(error => {
            console.warn("⚠️ Background API verification failed:", error.message);
            console.log("💡 You can still test the interface - verification will happen on first query");
        });
    }
    
    /**
     * Verify that we can actually connect to TokenMetrics API
     * This makes a real API call to ensure everything is working
     */
    async verifyRealApiConnection() {
        console.log("🌐 Testing real TokenMetrics API connection...");
        
        try {
            // Use your actual getTokensAction to test the connection
            const tokensAction = this.plugin.actions.find(a => a.name === 'getTokens');
            if (!tokensAction) {
                throw new Error("Could not find getTokens action");
            }
            
            // Make a real API call with minimal parameters
            const testMessage = { content: { limit: 1 } };
            const canRun = await tokensAction.validate(this.runtime, testMessage);
            
            if (!canRun) {
                throw new Error("Token action validation failed - check API key");
            }
            
            // Execute real API call
            const result = await tokensAction.handler(this.runtime, testMessage, null);
            
            if (result.success && result.tokens && result.tokens.length > 0) {
                console.log("✅ Real API connection verified!");
                console.log(`📊 Test response: Found token ${result.tokens[0].SYMBOL} (${result.tokens[0].NAME})`);
                this.connectionVerified = true;
                return true;
            } else {
                throw new Error("API call succeeded but returned unexpected data structure");
            }
            
        } catch (error) {
            console.error("❌ Real API connection failed:", error.message);
            console.error("💡 Please check:");
            console.error("   1. Your .env file has the correct TOKENMETRICS_API_KEY");
            console.error("   2. Your API key is valid and active");
            console.error("   3. You have internet access to api.tokenmetrics.com");
            throw error;
        }
    }
    
    /**
     * Quick connection status check
     */
    getConnectionStatus() {
        return {
            initialized: true,
            verified: this.connectionVerified,
            apiKeySet: !!process.env.TOKENMETRICS_API_KEY,
            baseUrl: process.env.TOKENMETRICS_BASE_URL,
            actionsLoaded: this.plugin.actions.length
        };
    }
    
    /**
     * Process real user queries with actual TokenMetrics intelligence
     * Every response comes from real API calls - no simulation anywhere
     */
    async processRealQuery(userQuery, options = {}) {
        const startTime = Date.now();
        console.log(`🧠 Processing REAL query: "${userQuery}"`);
        
        // Lazy verification - verify connection on first query if not already done
        if (!this.connectionVerified) {
            console.log("🔍 Verifying API connection on first query...");
            try {
                await this.verifyRealApiConnection();
            } catch (error) {
                console.warn("⚠️ API verification failed, but continuing with query:", error.message);
                // Continue anyway - the specific action might still work
            }
        }
        
        try {
            // Analyze the query to understand user intent
            const queryAnalysis = this.analyzeQueryIntent(userQuery, options);
            console.log(`🔍 Query analysis:`, queryAnalysis);
            
            // Select the appropriate real action
            const selectedAction = this.selectRealAction(queryAnalysis);
            if (!selectedAction) {
                throw new Error(`Could not determine appropriate action for query: "${userQuery}"`);
            }
            
            console.log(`🎯 Selected real action: ${selectedAction.name}`);
            
            // Build the message for the real action
            const actionMessage = this.buildRealActionMessage(queryAnalysis, options);
            
            // Validate the real action can run
            const canRun = await selectedAction.validate(this.runtime, actionMessage);
            if (!canRun) {
                throw new Error(`Real action validation failed for ${selectedAction.name}`);
            }
            
            // Execute the REAL action with REAL API calls
            console.log(`⚡ Executing REAL action: ${selectedAction.name}`);
            const realResult = await selectedAction.handler(this.runtime, actionMessage, null);
            
            const endTime = Date.now();
            const processingTime = endTime - startTime;
            
            console.log(`✅ Real action completed in ${processingTime}ms`);
            
            // Track real usage metrics
            this.runtime.trackMetric('query_processed', 1);
            this.runtime.trackMetric('processing_time_ms', processingTime);
            this.runtime.trackMetric('action_used', selectedAction.name);
            
            // Add metadata about the real response
            return {
                ...realResult,
                _metadata: {
                    query: userQuery,
                    action_used: selectedAction.name,
                    processing_time_ms: processingTime,
                    real_api_call: true,
                    simulation: false,
                    timestamp: new Date().toISOString()
                }
            };
            
        } catch (error) {
            const endTime = Date.now();
            const processingTime = endTime - startTime;
            
            console.error(`❌ Real query processing failed after ${processingTime}ms:`, error.message);
            
            // Track error metrics
            this.runtime.trackMetric('query_failed', 1);
            this.runtime.trackMetric('error_type', error.constructor.name);
            
            // Return a proper error response (not simulated)
            return {
                success: false,
                error: error.message,
                message: "Real TokenMetrics API query failed",
                _metadata: {
                    query: userQuery,
                    processing_time_ms: processingTime,
                    real_api_call: true,
                    simulation: false,
                    error: true,
                    timestamp: new Date().toISOString()
                }
            };
        }
    }
    
    /**
     * Analyze user query intent (same logic as before, but cleaner)
     * This determines what the user actually wants from TokenMetrics
     */
    analyzeQueryIntent(query, options) {
        const queryLower = query.toLowerCase();
        const analysis = {
            originalQuery: query,
            intent: 'unknown',
            tokens: [],
            sectors: [],
            parameters: {},
            confidence: 0
        };
        
        // Token pattern matching (expanded list)
        const tokenPatterns = [
            { pattern: /bitcoin|btc\b/i, token: 'BTC', id: 3375 },
            { pattern: /ethereum|eth\b/i, token: 'ETH', id: 1027 },
            { pattern: /cardano|ada\b/i, token: 'ADA', id: 2010 },
            { pattern: /solana|sol\b/i, token: 'SOL', id: 5426 },
            { pattern: /polygon|matic/i, token: 'MATIC', id: 3890 },
            { pattern: /chainlink|link/i, token: 'LINK', id: 1975 },
            { pattern: /uniswap|uni/i, token: 'UNI', id: 7083 },
            { pattern: /avalanche|avax/i, token: 'AVAX', id: 5805 }
        ];
        
        tokenPatterns.forEach(({ pattern, token, id }) => {
            if (pattern.test(query)) {
                analysis.tokens.push({ symbol: token, token_id: id });
            }
        });
        
        // Sector pattern matching
        const sectorPatterns = [
            { pattern: /defi|decentralized finance|decentralized/i, sector: 'defi' },
            { pattern: /gaming|play to earn|p2e|game/i, sector: 'gaming' },
            { pattern: /meme|meme coin|memecoins/i, sector: 'meme' },
            { pattern: /layer 1|l1|layer1/i, sector: 'layer1' },
            { pattern: /layer 2|l2|layer2/i, sector: 'layer2' },
            { pattern: /nft|non-fungible/i, sector: 'nft' },
            { pattern: /metaverse|virtual world/i, sector: 'metaverse' }
        ];
        
        sectorPatterns.forEach(({ pattern, sector }) => {
            if (pattern.test(query)) {
                analysis.sectors.push(sector);
            }
        });
        
        // Intent classification based on user language patterns
        const intentPatterns = [
            // EXISTING ENDPOINT PATTERNS
            { pattern: /price|cost|value|worth|current.*price/i, intent: 'price', confidence: 0.9 },
            { pattern: /trading signal|buy|sell|signal|trade/i, intent: 'trading-signals', confidence: 0.85 },
            { pattern: /risk|volatility|sharpe|drawdown|dangerous/i, intent: 'risk-analysis', confidence: 0.8 },
            { pattern: /performance|return|roi|gain|profit|loss/i, intent: 'sector-performance', confidence: 0.8 },
            { pattern: /holding|composition|contains|made up of/i, intent: 'sector-holdings', confidence: 0.8 },
            { pattern: /transaction|rebalancing|buying|selling|activity/i, intent: 'sector-transactions', confidence: 0.8 },
            { pattern: /market|overview|sentiment|condition/i, intent: 'market-overview', confidence: 0.75 },
            { pattern: /top|largest|biggest|best|leading/i, intent: 'top-tokens', confidence: 0.8 },
            { pattern: /grade|score|rating|rank/i, intent: 'trader-grades', confidence: 0.7 },
            
            // NEW ENDPOINT PATTERNS - ADDED FOR COMPLETE UI INTEGRATION
            { pattern: /hourly.*ohlcv|hourly.*candle|hourly.*data|hour.*ohlcv/i, intent: 'hourly-ohlcv', confidence: 0.95 },
            { pattern: /daily.*ohlcv|daily.*candle|daily.*data|day.*ohlcv|ohlcv/i, intent: 'daily-ohlcv', confidence: 0.9 },
            { pattern: /investor.*grade|investment.*grade|investor.*rating/i, intent: 'investor-grades', confidence: 0.9 },
            { pattern: /ai.*report|ai.*analysis|artificial.*intelligence.*report|deep.*dive/i, intent: 'ai-reports', confidence: 0.9 },
            { pattern: /crypto.*investor|cryptocurrency.*investor|institutional.*investor|whale/i, intent: 'crypto-investors', confidence: 0.9 },
            { pattern: /resistance.*support|support.*resistance|technical.*level|key.*level/i, intent: 'resistance-support', confidence: 0.9 },
            { pattern: /ask.*tokenmetrics.*ai|tokenmetrics.*ai|tmai|ai.*assistant/i, intent: 'tmai', confidence: 0.95 },
            { pattern: /sentiment|market.*sentiment|feeling|mood|bullish.*bearish/i, intent: 'sentiment', confidence: 0.9 },
            { pattern: /scenario.*analysis|scenario|prediction|forecast|future.*price/i, intent: 'scenario-analysis', confidence: 0.9 },
            { pattern: /correlation|correlate|relationship.*between|compare.*movement/i, intent: 'correlation', confidence: 0.9 }
        ];
        
        // Find the best matching intent
        let bestMatch = { intent: 'unknown', confidence: 0 };
        intentPatterns.forEach(({ pattern, intent, confidence }) => {
            if (pattern.test(query) && confidence > bestMatch.confidence) {
                bestMatch = { intent, confidence };
            }
        });
        
        analysis.intent = bestMatch.intent;
        analysis.confidence = bestMatch.confidence;
        
        // Apply forced options from UI
        if (options.forcedEndpoint) {
            analysis.intent = options.forcedEndpoint;
            analysis.confidence = 1.0;
        }
        
        // Add any explicitly provided parameters
        if (options.symbol) analysis.tokens.push({ symbol: options.symbol.toUpperCase() });
        if (options.sector) analysis.sectors.push(options.sector.toLowerCase());
        if (options.limit) analysis.parameters.limit = options.limit;
        
        return analysis;
    }
    
    /**
     * Select the real action based on intent analysis
     * Maps user intent to actual TokenMetrics actions
     */
    selectRealAction(analysis) {
        const actionMapping = {
            // EXISTING ENDPOINTS (10)
            'price': 'getPrice',
            'trading-signals': 'getTradingSignals', 
            'risk-analysis': 'getQuantmetrics',
            'sector-performance': 'getIndexPerformance',
            'sector-holdings': 'getSectorIndicesHoldings',
            'sector-transactions': 'getSectorIndexTransaction',
            'market-overview': 'getMarketMetrics',
            'top-tokens': 'getTopMarketCap',
            'trader-grades': 'getTraderGrades',
            'tokens': 'getTokens',
            
            // NEW ENDPOINTS (10) - ADDED FOR COMPLETE UI INTEGRATION
            'hourly-ohlcv': 'getHourlyOhlcv',
            'daily-ohlcv': 'getDailyOhlcv',
            'investor-grades': 'getInvestorGrades',
            'ai-reports': 'getAiReports',
            'crypto-investors': 'getCryptoInvestors',
            'resistance-support': 'getResistanceSupport',
            'tmai': 'getTMAI',
            'sentiment': 'getSentiment',
            'scenario-analysis': 'getScenarioAnalysis',
            'correlation': 'getCorrelation'
        };
        
        const actionName = actionMapping[analysis.intent];
        if (!actionName) {
            // Enhanced fallback logic for new endpoints
            if (analysis.tokens.length > 0) {
                // For token-specific queries, try price first, then OHLCV
                return this.plugin.actions.find(action => action.name === 'getPrice') ||
                       this.plugin.actions.find(action => action.name === 'getDailyOhlcv');
            } else if (analysis.sectors.length > 0) {
                return this.plugin.actions.find(action => action.name === 'getSectorIndicesHoldings');
            }
            // Default to market overview for general queries
            return this.plugin.actions.find(action => action.name === 'getMarketMetrics');
        }
        
        return this.plugin.actions.find(action => action.name === actionName);
    }
    
    /**
     * Build real action message with proper parameters
     * Creates the exact message structure your actions expect
     */
    buildRealActionMessage(analysis, options) {
        const content = {
            text: analysis.originalQuery,
            ...analysis.parameters
        };
        
        // Add token information for token-specific queries
        if (analysis.tokens.length > 0) {
            const primaryToken = analysis.tokens[0];
            content.symbol = primaryToken.symbol;
            if (primaryToken.token_id) {
                content.token_id = primaryToken.token_id;
            }
        }
        
        // Add sector information for sector-specific queries
        if (analysis.sectors.length > 0) {
            content.indexName = analysis.sectors[0];
        }
        
        // Set appropriate limits based on action type
        if (analysis.intent === 'top-tokens') {
            content.top_k = options.limit || 10;
        } else {
            content.limit = options.limit || 10;
        }
        
        // Add date range if specified
        if (options.startDate) content.startDate = options.startDate;
        if (options.endDate) content.endDate = options.endDate;
        
        return { content };
    }
    
    /**
     * Test a specific real endpoint with actual API calls
     */
    async testRealEndpoint(actionName, parameters = {}) {
        console.log(`🧪 Testing REAL endpoint: ${actionName}`);
        
        const action = this.plugin.actions.find(a => a.name === actionName);
        if (!action) {
            throw new Error(`Real action ${actionName} not found`);
        }
        
        const message = { content: parameters };
        
        // Validate with real runtime
        const canRun = await action.validate(this.runtime, message);
        if (!canRun) {
            throw new Error(`Real validation failed for ${actionName}`);
        }
        
        // Execute real action
        const startTime = Date.now();
        const result = await action.handler(this.runtime, message, null);
        const endTime = Date.now();
        
        console.log(`✅ Real endpoint ${actionName} completed in ${endTime - startTime}ms`);
        
        return {
            ...result,
            _test_metadata: {
                action_tested: actionName,
                parameters_used: parameters,
                processing_time_ms: endTime - startTime,
                real_api_call: true,
                timestamp: new Date().toISOString()
            }
        };
    }
    
    /**
     * Run comprehensive real system diagnostics
     * Tests all endpoints with actual API calls
     */
    async runRealDiagnostics() {
        console.log("🔧 Running REAL system diagnostics...");
        
        const diagnostics = {
            timestamp: new Date().toISOString(),
            environment: {
                api_key_configured: !!process.env.TOKENMETRICS_API_KEY,
                base_url: process.env.TOKENMETRICS_BASE_URL,
                api_version: process.env.TOKENMETRICS_API_VERSION
            },
            actions: {
                total: this.plugin.actions.length,
                working: 0,
                failed: 0,
                details: []
            }
        };
        
        // Test each action with real API calls
        for (const action of this.plugin.actions) {
            try {
                console.log(`🧪 Testing real action: ${action.name}`);
                
                // Prepare realistic test parameters for each action
                let testParams = { limit: 1 };
                
                if (action.name.includes('Sector') || action.name.includes('Index')) {
                    testParams.indexName = 'defi'; // Use a known sector
                }
                if (action.name === 'getTopMarketCap') {
                    testParams = { top_k: 1 };
                }
                if (action.name === 'getPrice' || action.name === 'getTraderGrades' || action.name === 'getQuantmetrics') {
                    testParams.symbol = 'BTC'; // Use Bitcoin for token-specific tests
                }
                
                const result = await this.testRealEndpoint(action.name, testParams);
                
                diagnostics.actions.working++;
                diagnostics.actions.details.push({
                    action: action.name,
                    status: 'working',
                    response_time: result._test_metadata.processing_time_ms + 'ms',
                    data_received: result.success,
                    endpoint_used: result.metadata?.endpoint || 'unknown'
                });
                
            } catch (error) {
                diagnostics.actions.failed++;
                diagnostics.actions.details.push({
                    action: action.name,
                    status: 'failed',
                    error: error.message,
                    endpoint_used: 'failed_before_call'
                });
                
                console.log(`❌ Real action ${action.name} failed: ${error.message}`);
            }
        }
        
        diagnostics.actions.success_rate = (diagnostics.actions.working / diagnostics.actions.total) * 100;
        
        console.log(`🏁 Real diagnostics completed: ${diagnostics.actions.working}/${diagnostics.actions.total} working`);
        
        return diagnostics;
    }
}

// Export the real bridge for use in your testing interface
export default RealTokenMetricsAgentBridge;

// Make it available globally for browser use
if (typeof window !== 'undefined') {
    window.RealTokenMetricsAgentBridge = RealTokenMetricsAgentBridge;
}
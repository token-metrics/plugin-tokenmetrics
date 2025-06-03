// tests/ui/agent-bridge.js

/**
 * AGENT BRIDGE SCRIPT
 * 
 * This script connects your test UI to your actual TokenMetrics agent.
 * Think of this as the translator between your user interface and your agent's brain.
 * 
 * Replace the simulated functions in the HTML with calls to these real functions.
 */

import { tokenmetricsPlugin } from '../../src/index.js';

class TokenMetricsAgentBridge {
    constructor() {
        this.runtime = this.createMockRuntime();
        this.plugin = tokenmetricsPlugin;
        this.initialize();
    }
    
    /**
     * Create a mock runtime that simulates ElizaOS environment
     * In production, this would be the actual ElizaOS runtime
     */
    createMockRuntime() {
        return {
            getSetting: (key) => {
                // Map environment variables to runtime settings
                if (key === "TOKENMETRICS_API_KEY") {
                    return process.env.TOKENMETRICS_API_KEY;
                }
                return null;
            },
            
            // Add other runtime methods as needed
            log: (message) => console.log(`[Runtime] ${message}`),
            error: (message) => console.error(`[Runtime] ${message}`)
        };
    }
    
    /**
     * Initialize the agent bridge
     */
    async initialize() {
        console.log("🔗 Initializing TokenMetrics Agent Bridge");
        
        // Verify all actions are available
        console.log(`📋 Loaded ${this.plugin.actions.length} actions:`);
        this.plugin.actions.forEach(action => {
            console.log(`   • ${action.name}: ${action.description}`);
        });
    }
    
    /**
     * Process a natural language query and route it to the appropriate action
     * This is the main intelligence function that determines what the user wants
     */
    async processQuery(userQuery, options = {}) {
        console.log(`🧠 Processing query: "${userQuery}"`);
        
        // Analyze the query to determine intent and extract parameters
        const queryAnalysis = this.analyzeQuery(userQuery, options);
        console.log(`🔍 Query analysis:`, queryAnalysis);
        
        // Find the appropriate action based on the analysis
        const selectedAction = this.selectAction(queryAnalysis);
        if (!selectedAction) {
            throw new Error("Could not determine appropriate action for query");
        }
        
        console.log(`🎯 Selected action: ${selectedAction.name}`);
        
        // Build the message object for the action
        const message = this.buildActionMessage(queryAnalysis, options);
        
        // Validate the action can run
        const canRun = await selectedAction.validate(this.runtime, message);
        if (!canRun) {
            throw new Error(`Action validation failed for ${selectedAction.name}`);
        }
        
        // Execute the action
        console.log(`⚡ Executing action: ${selectedAction.name}`);
        const result = await selectedAction.handler(this.runtime, message, null);
        
        console.log(`✅ Action completed successfully`);
        return result;
    }
    
    /**
     * Analyze user query to extract intent and parameters
     * This is like teaching the agent to understand human language
     */
    analyzeQuery(query, options) {
        const queryLower = query.toLowerCase();
        const analysis = {
            intent: 'unknown',
            tokens: [],
            sectors: [],
            parameters: {},
            confidence: 0
        };
        
        // Token identification
        const tokenPatterns = [
            { pattern: /bitcoin|btc/i, token: 'BTC', id: 3375 },
            { pattern: /ethereum|eth/i, token: 'ETH', id: 1027 },
            { pattern: /cardano|ada/i, token: 'ADA', id: 2010 },
            { pattern: /solana|sol/i, token: 'SOL', id: 5426 },
            { pattern: /polygon|matic/i, token: 'MATIC', id: 3890 }
        ];
        
        tokenPatterns.forEach(({ pattern, token, id }) => {
            if (pattern.test(query)) {
                analysis.tokens.push({ symbol: token, token_id: id });
            }
        });
        
        // Sector identification
        const sectorPatterns = [
            { pattern: /defi|decentralized finance/i, sector: 'defi' },
            { pattern: /gaming|play to earn|p2e/i, sector: 'gaming' },
            { pattern: /meme|meme coin/i, sector: 'meme' },
            { pattern: /layer 1|l1/i, sector: 'layer1' },
            { pattern: /layer 2|l2/i, sector: 'layer2' }
        ];
        
        sectorPatterns.forEach(({ pattern, sector }) => {
            if (pattern.test(query)) {
                analysis.sectors.push(sector);
            }
        });
        
        // Intent identification based on keywords and patterns
        if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('value')) {
            analysis.intent = 'price';
            analysis.confidence = 0.9;
        } else if (queryLower.includes('trading signal') || queryLower.includes('buy') || queryLower.includes('sell')) {
            analysis.intent = 'trading-signals';
            analysis.confidence = 0.85;
        } else if (queryLower.includes('risk') || queryLower.includes('volatility') || queryLower.includes('sharpe')) {
            analysis.intent = 'risk-analysis';
            analysis.confidence = 0.8;
        } else if (queryLower.includes('sector') || queryLower.includes('index') || analysis.sectors.length > 0) {
            if (queryLower.includes('performance') || queryLower.includes('return')) {
                analysis.intent = 'sector-performance';
            } else if (queryLower.includes('holding') || queryLower.includes('composition')) {
                analysis.intent = 'sector-holdings';
            } else if (queryLower.includes('transaction') || queryLower.includes('rebalancing')) {
                analysis.intent = 'sector-transactions';
            } else {
                analysis.intent = 'sector-analysis';
            }
            analysis.confidence = 0.8;
        } else if (queryLower.includes('market') || queryLower.includes('overview')) {
            analysis.intent = 'market-overview';
            analysis.confidence = 0.75;
        } else if (queryLower.includes('top') || queryLower.includes('largest') || queryLower.includes('biggest')) {
            analysis.intent = 'top-tokens';
            analysis.confidence = 0.8;
        } else if (queryLower.includes('grade') || queryLower.includes('score')) {
            analysis.intent = 'trader-grades';
            analysis.confidence = 0.7;
        }
        
        // Apply any forced options
        if (options.forcedEndpoint) {
            analysis.intent = options.forcedEndpoint;
            analysis.confidence = 1.0;
        }
        
        // Extract additional parameters
        if (options.symbol) {
            analysis.tokens.push({ symbol: options.symbol.toUpperCase() });
        }
        if (options.sector) {
            analysis.sectors.push(options.sector.toLowerCase());
        }
        if (options.limit) {
            analysis.parameters.limit = options.limit;
        }
        
        return analysis;
    }
    
    /**
     * Select the appropriate action based on query analysis
     */
    selectAction(analysis) {
        const actionMap = {
            'price': 'getPrice',
            'trading-signals': 'getTradingSignals',
            'risk-analysis': 'getQuantmetrics',
            'sector-performance': 'getIndexPerformance',
            'sector-holdings': 'getSectorIndicesHoldings',
            'sector-transactions': 'getSectorIndexTransaction',
            'market-overview': 'getMarketMetrics',
            'top-tokens': 'getTopMarketCap',
            'trader-grades': 'getTraderGrades',
            'sector-analysis': 'getSectorIndicesHoldings' // Default sector action
        };
        
        const actionName = actionMap[analysis.intent];
        if (!actionName) {
            return null;
        }
        
        return this.plugin.actions.find(action => action.name === actionName);
    }
    
    /**
     * Build the message object that actions expect
     */
    buildActionMessage(analysis, options) {
        const content = {
            text: analysis.originalQuery,
            ...analysis.parameters
        };
        
        // Add token information
        if (analysis.tokens.length > 0) {
            const primaryToken = analysis.tokens[0];
            content.symbol = primaryToken.symbol;
            if (primaryToken.token_id) {
                content.token_id = primaryToken.token_id;
            }
        }
        
        // Add sector information
        if (analysis.sectors.length > 0) {
            content.indexName = analysis.sectors[0];
        }
        
        // Add default parameters for specific actions
        if (analysis.intent === 'top-tokens') {
            content.top_k = options.limit || 10;
        } else {
            content.limit = options.limit || 10;
        }
        
        return { content };
    }
    
    /**
     * Test individual endpoints
     */
    async testEndpoint(endpointName, parameters = {}) {
        const action = this.plugin.actions.find(a => a.name === endpointName);
        if (!action) {
            throw new Error(`Action ${endpointName} not found`);
        }
        
        const message = { content: parameters };
        
        const canRun = await action.validate(this.runtime, message);
        if (!canRun) {
            throw new Error(`Validation failed for ${endpointName}`);
        }
        
        return await action.handler(this.runtime, message, null);
    }
    
    /**
     * Run comprehensive system diagnostics
     */
    async runDiagnostics() {
        const results = {
            timestamp: new Date().toISOString(),
            total_actions: this.plugin.actions.length,
            working_actions: 0,
            failed_actions: 0,
            action_results: []
        };
        
        // Test each action with minimal parameters
        for (const action of this.plugin.actions) {
            try {
                console.log(`🧪 Testing action: ${action.name}`);
                
                const canRun = await action.validate(this.runtime, { content: {} });
                if (canRun) {
                    // Try a minimal test based on action type
                    let testParams = { limit: 1 };
                    
                    if (action.name.includes('Sector') || action.name.includes('Index')) {
                        testParams.indexName = 'defi';
                    }
                    if (action.name === 'getTopMarketCap') {
                        testParams = { top_k: 1 };
                    }
                    
                    const startTime = Date.now();
                    await action.handler(this.runtime, { content: testParams }, null);
                    const endTime = Date.now();
                    
                    results.working_actions++;
                    results.action_results.push({
                        action: action.name,
                        status: 'working',
                        response_time: `${endTime - startTime}ms`
                    });
                    
                    console.log(`✅ ${action.name}: Working`);
                } else {
                    throw new Error('Validation failed');
                }
                
            } catch (error) {
                results.failed_actions++;
                results.action_results.push({
                    action: action.name,
                    status: 'failed',
                    error: error.message
                });
                
                console.log(`❌ ${action.name}: Failed - ${error.message}`);
            }
        }
        
        results.success_rate = (results.working_actions / results.total_actions) * 100;
        
        return results;
    }
}

// Export for use in your testing interface
window.TokenMetricsAgentBridge = TokenMetricsAgentBridge;

// If running in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TokenMetricsAgentBridge;
}
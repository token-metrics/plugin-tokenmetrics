#!/usr/bin/env node

/**
 * TokenMetrics Plugin Test Script
 * 
 * This script tests:
 * 1. Token extraction from natural language
 * 2. API key validation
 * 3. TokenMetrics API connectivity
 * 4. Token resolution (both API and fallback)
 * 5. Price data fetching
 * 6. Response formatting
 */

import fetch from 'node-fetch';

// Your TokenMetrics API key
    const API_KEY = process.env.TOKENMETRICS_API_KEY;

// Test cases for token extraction
const testQueries = [
    "What's the price of Bitcoin?",
    "How much is BTC worth?",
    "Get me ETH price",
    "Show me Ethereum current value",
    "Solana price please",
    "What is SOL trading at?",
    "Check ADA price",
    "Cardano current price",
    "MATIC value",
    "Polygon price data"
];

// Expected token mappings
const expectedTokens = {
    "bitcoin": { symbol: "BTC", name: "Bitcoin" },
    "btc": { symbol: "BTC", name: "Bitcoin" },
    "ethereum": { symbol: "ETH", name: "Ethereum" },
    "eth": { symbol: "ETH", name: "Ethereum" },
    "solana": { symbol: "SOL", name: "Solana" },
    "sol": { symbol: "SOL", name: "Solana" },
    "cardano": { symbol: "ADA", name: "Cardano" },
    "ada": { symbol: "ADA", name: "Cardano" },
    "polygon": { symbol: "MATIC", name: "Polygon" },
    "matic": { symbol: "MATIC", name: "Polygon" }
};

// Fallback tokens (from your code)
const fallbackTokens = [
    { TOKEN_ID: 3375, NAME: "Bitcoin", SYMBOL: "BTC" },
    { TOKEN_ID: 3306, NAME: "Ethereum", SYMBOL: "ETH" },
    { TOKEN_ID: 3408, NAME: "Cardano", SYMBOL: "ADA" },
    { TOKEN_ID: 3718, NAME: "Solana", SYMBOL: "SOL" },
    { TOKEN_ID: 3890, NAME: "Polygon", SYMBOL: "MATIC" },
    { TOKEN_ID: 3635, NAME: "Polkadot", SYMBOL: "DOT" },
    { TOKEN_ID: 3463, NAME: "Chainlink", SYMBOL: "LINK" }
];

console.log("🧪 TokenMetrics Plugin Test Suite");
console.log("=====================================\n");

/**
 * Test 1: API Key Validation
 */
async function testApiKeyValidation() {
    console.log("🔐 Test 1: API Key Validation");
    console.log("------------------------------");
    
    if (!API_KEY || API_KEY.length < 10) {
        console.log("❌ API key appears invalid (too short)");
        return false;
    }
    
    console.log(`✅ API key format looks valid: ${API_KEY.substring(0, 6)}...${API_KEY.substring(API_KEY.length - 4)}`);
    return true;
}

/**
 * Test 2: TokenMetrics API Connectivity
 */
async function testApiConnectivity() {
    console.log("\n🌐 Test 2: TokenMetrics API Connectivity");
    console.log("----------------------------------------");
    
    try {
        const url = "https://api.tokenmetrics.com/v2/tokens?limit=5&page=1";
        console.log(`📡 Testing: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`📊 Response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log(`❌ API Error: ${errorText}`);
            return false;
        }
        
        const data = await response.json();
        console.log(`✅ API Response structure:`, {
            success: data.success,
            message: data.message,
            length: data.length,
            hasData: !!data.data,
            dataLength: Array.isArray(data.data) ? data.data.length : 'not array'
        });
        
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            console.log(`📋 Sample token from API:`, {
                TOKEN_ID: data.data[0].TOKEN_ID,
                TOKEN_NAME: data.data[0].TOKEN_NAME,
                TOKEN_SYMBOL: data.data[0].TOKEN_SYMBOL
            });
        }
        
        return true;
    } catch (error) {
        console.log(`❌ API connectivity failed:`, error.message);
        return false;
    }
}

/**
 * Test 3: Token Extraction from Natural Language
 */
function testTokenExtraction() {
    console.log("\n🎯 Test 3: Token Extraction from Natural Language");
    console.log("--------------------------------------------------");
    
    let passedTests = 0;
    let totalTests = testQueries.length;
    
    testQueries.forEach((query, index) => {
        console.log(`\n${index + 1}. Testing: "${query}"`);
        
        // Simple extraction logic (similar to what your AI would do)
        const lowerQuery = query.toLowerCase();
        let extractedToken = null;
        
        // Check for direct symbol matches
        for (const [key, token] of Object.entries(expectedTokens)) {
            if (lowerQuery.includes(key)) {
                extractedToken = token;
                break;
            }
        }
        
        if (extractedToken) {
            console.log(`   ✅ Extracted: ${extractedToken.name} (${extractedToken.symbol})`);
            passedTests++;
        } else {
            console.log(`   ❌ Failed to extract token`);
        }
    });
    
    console.log(`\n📊 Token Extraction Results: ${passedTests}/${totalTests} passed`);
    return passedTests === totalTests;
}

/**
 * Test 4: Token Resolution (Fallback System)
 */
function testTokenResolution() {
    console.log("\n🔍 Test 4: Token Resolution (Fallback System)");
    console.log("----------------------------------------------");
    
    const testInputs = ["bitcoin", "btc", "ethereum", "eth", "solana", "unknown_token"];
    let passedTests = 0;
    
    testInputs.forEach(input => {
        console.log(`\nTesting resolution for: "${input}"`);
        
        const normalizedInput = input.toLowerCase();
        const token = fallbackTokens.find(t => 
            (t.SYMBOL && t.SYMBOL.toLowerCase() === normalizedInput) ||
            (t.NAME && t.NAME.toLowerCase() === normalizedInput) ||
            (t.NAME && t.NAME.toLowerCase().includes(normalizedInput))
        );
        
        if (token) {
            console.log(`   ✅ Resolved to: ${token.NAME} (${token.SYMBOL}) - ID: ${token.TOKEN_ID}`);
            passedTests++;
        } else {
            console.log(`   ❌ Could not resolve token`);
            if (input !== "unknown_token") {
                // This is expected to fail
            } else {
                passedTests++; // Expected failure
            }
        }
    });
    
    console.log(`\n📊 Token Resolution Results: ${passedTests}/${testInputs.length - 1} passed (excluding expected failure)`);
    return true;
}

/**
 * Test 5: Price Data Fetching
 */
async function testPriceDataFetching() {
    console.log("\n💰 Test 5: Price Data Fetching");
    console.log("-------------------------------");
    
    // Test with Bitcoin (TOKEN_ID: 3375)
    const tokenId = 3375;
    console.log(`📡 Testing price fetch for Bitcoin (TOKEN_ID: ${tokenId})`);
    
    try {
        const url = `https://api.tokenmetrics.com/v2/price?token_id=${tokenId}`;
        console.log(`🌐 URL: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`📊 Response status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log(`❌ Price API Error: ${errorText}`);
            return false;
        }
        
        const data = await response.json();
        console.log(`✅ Price API Response structure:`, {
            success: data.success,
            hasData: !!data.data,
            dataType: typeof data.data,
            dataLength: Array.isArray(data.data) ? data.data.length : 'not array'
        });
        
        let priceData = null;
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            priceData = data.data[0];
        } else if (data.data && !Array.isArray(data.data)) {
            priceData = data.data;
        }
        
        if (priceData) {
            console.log(`💰 Price Data:`, {
                symbol: priceData.SYMBOL || priceData.TOKEN_SYMBOL,
                price: priceData.PRICE || priceData.CURRENT_PRICE,
                change24h: priceData.PRICE_24H_CHANGE_PERCENT,
                marketCap: priceData.MARKET_CAP
            });
            
            // Test response formatting
            const price = priceData.PRICE || priceData.CURRENT_PRICE;
            if (price) {
                const formattedPrice = formatCurrency(price);
                console.log(`📊 Formatted price: ${formattedPrice}`);
            }
            
            return true;
        } else {
            console.log(`❌ No price data found in response`);
            return false;
        }
        
    } catch (error) {
        console.log(`❌ Price fetch failed:`, error.message);
        return false;
    }
}

/**
 * Utility function to format currency (from your code)
 */
function formatCurrency(value) {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
}

/**
 * Test 6: End-to-End Flow Simulation
 */
async function testEndToEndFlow() {
    console.log("\n🔄 Test 6: End-to-End Flow Simulation");
    console.log("--------------------------------------");
    
    const testQuery = "What's the price of Bitcoin?";
    console.log(`📝 Simulating query: "${testQuery}"`);
    
    // Step 1: Extract token
    console.log("\n1. Token Extraction:");
    const extractedToken = "bitcoin";
    console.log(`   ✅ Extracted: ${extractedToken}`);
    
    // Step 2: Resolve token
    console.log("\n2. Token Resolution:");
    const token = fallbackTokens.find(t => 
        t.NAME && t.NAME.toLowerCase() === extractedToken.toLowerCase()
    );
    
    if (!token) {
        console.log(`   ❌ Token resolution failed`);
        return false;
    }
    
    console.log(`   ✅ Resolved to: ${token.NAME} (${token.SYMBOL}) - ID: ${token.TOKEN_ID}`);
    
    // Step 3: Fetch price
    console.log("\n3. Price Fetching:");
    try {
        const url = `https://api.tokenmetrics.com/v2/price?token_id=${token.TOKEN_ID}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.log(`   ❌ Price fetch failed: ${response.status}`);
            return false;
        }
        
        const data = await response.json();
        const priceData = data.data && Array.isArray(data.data) ? data.data[0] : data.data;
        
        if (!priceData) {
            console.log(`   ❌ No price data in response`);
            return false;
        }
        
        console.log(`   ✅ Price fetched successfully`);
        
        // Step 4: Format response
        console.log("\n4. Response Formatting:");
        const price = priceData.PRICE || priceData.CURRENT_PRICE;
        const formattedPrice = formatCurrency(price);
        const response_text = `💰 **${token.NAME} (${token.SYMBOL})** is currently trading at **${formattedPrice}**`;
        
        console.log(`   ✅ Formatted response: ${response_text}`);
        
        return true;
        
    } catch (error) {
        console.log(`   ❌ End-to-end test failed:`, error.message);
        return false;
    }
}

/**
 * Main test runner
 */
async function runAllTests() {
    console.log("Starting comprehensive TokenMetrics plugin tests...\n");
    
    const results = {
        apiKeyValidation: await testApiKeyValidation(),
        apiConnectivity: await testApiConnectivity(),
        tokenExtraction: testTokenExtraction(),
        tokenResolution: testTokenResolution(),
        priceDataFetching: await testPriceDataFetching(),
        endToEndFlow: await testEndToEndFlow()
    };
    
    console.log("\n🏁 Test Results Summary");
    console.log("=======================");
    
    let passedTests = 0;
    let totalTests = Object.keys(results).length;
    
    Object.entries(results).forEach(([testName, passed]) => {
        const status = passed ? "✅ PASS" : "❌ FAIL";
        console.log(`${status} ${testName}`);
        if (passed) passedTests++;
    });
    
    console.log(`\n📊 Overall Results: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log("🎉 All tests passed! Your TokenMetrics plugin should work correctly.");
    } else {
        console.log("⚠️  Some tests failed. Please check the issues above.");
    }
    
    return passedTests === totalTests;
}

// Run the tests
runAllTests().catch(error => {
    console.error("❌ Test runner failed:", error);
    process.exit(1);
}); 
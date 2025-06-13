#!/usr/bin/env node

/**
 * Debug AI Extraction for Dogecoin
 * This script simulates what the AI extraction should return for Dogecoin queries
 */

// Test cases that should work
const testCases = [
    "What's the price of Dogecoin?",
    "What's the price of Bitcoin?", 
    "What's the price of Ethereum?",
    "How much is DOGE worth?",
    "Get me Dogecoin price"
];

console.log("🧪 Testing AI Extraction Patterns\n");

testCases.forEach((query, index) => {
    console.log(`${index + 1}. Query: "${query}"`);
    
    // Simulate what the AI should extract
    let expectedExtraction = {};
    
    if (query.toLowerCase().includes('dogecoin') || query.toLowerCase().includes('doge')) {
        expectedExtraction = {
            cryptocurrency: "Dogecoin",
            symbol: query.toLowerCase().includes('doge') ? "DOGE" : undefined,
            analysisType: "current"
        };
    } else if (query.toLowerCase().includes('bitcoin') || query.toLowerCase().includes('btc')) {
        expectedExtraction = {
            cryptocurrency: "Bitcoin", 
            symbol: query.toLowerCase().includes('btc') ? "BTC" : undefined,
            analysisType: "current"
        };
    } else if (query.toLowerCase().includes('ethereum') || query.toLowerCase().includes('eth')) {
        expectedExtraction = {
            cryptocurrency: "Ethereum",
            symbol: query.toLowerCase().includes('eth') ? "ETH" : undefined, 
            analysisType: "current"
        };
    }
    
    console.log(`   Expected: ${JSON.stringify(expectedExtraction)}`);
    console.log(`   Token to resolve: "${expectedExtraction.cryptocurrency || expectedExtraction.symbol}"`);
    console.log("");
});

console.log("💡 Key Insights:");
console.log("• AI should extract 'Dogecoin' from 'What's the price of Dogecoin?'");
console.log("• resolveTokenSmart('Dogecoin') should return token ID 3393");
console.log("• API call should be /v2/price?token_id=3393");
console.log("• But agent is returning Bitcoin/Ethereum prices instead");
console.log("");
console.log("🔍 Possible Issues:");
console.log("1. AI extraction not working correctly");
console.log("2. Token resolution falling back to default");
console.log("3. Caching issues in AI responses");
console.log("4. Template not specific enough for Dogecoin"); 
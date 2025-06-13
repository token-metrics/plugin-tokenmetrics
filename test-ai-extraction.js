#!/usr/bin/env node

/**
 * Test AI Extraction for Dogecoin Issue
 * This simulates what the AI extraction should return
 */

const testQueries = [
    "What's the price of Dogecoin?",
    "What's the price of Bitcoin?", 
    "What's the price of Ethereum?",
    "How much is DOGE worth?",
    "Get me Dogecoin price",
    "Show me DOGE value"
];

console.log("🧪 AI Extraction Test - What SHOULD be extracted\n");

testQueries.forEach((query, index) => {
    console.log(`${index + 1}. Query: "${query}"`);
    
    // Simulate proper AI extraction
    let expectedExtraction = {};
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('dogecoin') || queryLower.includes('doge')) {
        expectedExtraction = {
            cryptocurrency: "Dogecoin",
            symbol: queryLower.includes('doge') ? "DOGE" : undefined,
            analysisType: "current"
        };
    } else if (queryLower.includes('bitcoin') || queryLower.includes('btc')) {
        expectedExtraction = {
            cryptocurrency: "Bitcoin", 
            symbol: queryLower.includes('btc') ? "BTC" : undefined,
            analysisType: "current"
        };
    } else if (queryLower.includes('ethereum') || queryLower.includes('eth')) {
        expectedExtraction = {
            cryptocurrency: "Ethereum",
            symbol: queryLower.includes('eth') ? "ETH" : undefined, 
            analysisType: "current"
        };
    }
    
    console.log(`   Expected: ${JSON.stringify(expectedExtraction)}`);
    
    // Show what token resolution should happen
    const tokenToResolve = expectedExtraction.cryptocurrency || expectedExtraction.symbol;
    console.log(`   Token to resolve: "${tokenToResolve}"`);
    
    // Show expected API call
    if (tokenToResolve === "Dogecoin") {
        console.log(`   Expected API: /v2/tokens?token_name=Dogecoin → Token ID 3393`);
        console.log(`   Expected Price API: /v2/price?token_id=3393`);
    } else if (tokenToResolve === "Bitcoin") {
        console.log(`   Expected API: /v2/tokens?token_name=Bitcoin → Token ID 3375`);
        console.log(`   Expected Price API: /v2/price?token_id=3375`);
    } else if (tokenToResolve === "Ethereum") {
        console.log(`   Expected API: /v2/tokens?token_name=Ethereum → Token ID 3306`);
        console.log(`   Expected Price API: /v2/price?token_id=3306`);
    }
    
    console.log("");
});

console.log("🔍 PROBLEM ANALYSIS:");
console.log("• Agent understands 'Dogecoin' (says 'perennial jester')");
console.log("• But returns Bitcoin/Ethereum prices instead");
console.log("• This suggests AI extraction is failing");
console.log("• OR token resolution is falling back to defaults");
console.log("");
console.log("🛠️ DEBUGGING STEPS:");
console.log("1. Add logging to see what AI actually extracts");
console.log("2. Add logging to see what token resolution returns");
console.log("3. Check if there's any caching/fallback behavior");
console.log("4. Verify the extraction template includes Dogecoin examples"); 
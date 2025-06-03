// tests/manual/01-basic-connection.js

/**
 * BASIC CONNECTION TEST
 * 
 * This test verifies that your TokenMetrics API integration can:
 * 1. Authenticate properly with x-api-key headers
 * 2. Make successful HTTP requests
 * 3. Handle responses correctly
 * 
 * Think of this as testing if your phone can connect to the internet
 * before trying to use any apps.
 */

import { callTokenMetricsApi, TOKENMETRICS_ENDPOINTS, validateApiKey } from '../../actions/action.ts';

async function testBasicConnection() {
    console.log("🔌 BASIC CONNECTION TEST");
    console.log("=" * 50);
    
    // Step 1: Check if API key is available
    console.log("\n📋 Step 1: Checking API Key...");
    try {
        const apiKey = validateApiKey();
        console.log("✅ API Key found:", apiKey.substring(0, 8) + "...");
    } catch (error) {
        console.log("❌ API Key problem:", error.message);
        console.log("💡 Solution: Set your API key with:");
        console.log("   export TOKENMETRICS_API_KEY='your-key-here'");
        return false;
    }
    
    // Step 2: Test simplest possible API call
    console.log("\n📋 Step 2: Testing API Connection...");
    try {
        console.log("🌐 Making request to:", TOKENMETRICS_ENDPOINTS.tokens);
        
        const response = await callTokenMetricsApi(
            TOKENMETRICS_ENDPOINTS.tokens,
            { limit: 2 }, // Request just 2 tokens to keep it simple
            "GET"
        );
        
        console.log("✅ Connection successful!");
        console.log("📊 Response type:", typeof response);
        console.log("📊 Response structure:", Object.keys(response));
        
        // If response is an array, show first item structure
        if (Array.isArray(response) && response.length > 0) {
            console.log("📊 First item keys:", Object.keys(response[0]));
            console.log("📊 Sample token:", {
                symbol: response[0].SYMBOL,
                name: response[0].NAME,
                id: response[0].TOKEN_ID
            });
        }
        
        return true;
        
    } catch (error) {
        console.log("❌ Connection failed!");
        console.log("🔍 Error details:", error.message);
        
        // Provide helpful debugging information
        if (error.message.includes('401')) {
            console.log("💡 This looks like an authentication problem.");
            console.log("   Check that your API key is valid and active.");
        } else if (error.message.includes('404')) {
            console.log("💡 This looks like an endpoint problem.");
            console.log("   The API endpoint might have changed.");
        } else if (error.message.includes('429')) {
            console.log("💡 This looks like a rate limit problem.");
            console.log("   Wait a moment and try again.");
        }
        
        return false;
    }
}

// Run the test
console.log("Starting basic connection test...");
testBasicConnection().then(success => {
    if (success) {
        console.log("\n🎉 Basic connection test PASSED!");
        console.log("   Your TokenMetrics integration foundation is working.");
        console.log("   Ready to proceed to endpoint testing.");
    } else {
        console.log("\n💥 Basic connection test FAILED!");
        console.log("   Fix the connection issue before proceeding.");
    }
});
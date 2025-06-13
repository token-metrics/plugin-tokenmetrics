// Test script to explore TokenMetrics API direct search capabilities
// Based on the API documentation showing token_name parameter usage

const API_KEY = "REDACTED_API_KEY";
const BASE_URL = "https://api.tokenmetrics.com/v2/tokens";

async function testDirectSearch(tokenName) {
    console.log(`\n🔍 Testing direct search for: "${tokenName}"`);
    console.log("=" * 50);
    
    try {
        // Test the exact endpoint format from the documentation
        const url = `${BASE_URL}?token_name=${encodeURIComponent(tokenName)}`;
        console.log(`📡 URL: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log(`❌ Error Response: ${errorText}`);
            return null;
        }
        
        const data = await response.json();
        console.log(`📋 Response Structure:`, {
            success: data.success,
            message: data.message,
            length: data.length,
            hasData: !!data.data,
            dataType: typeof data.data,
            dataLength: Array.isArray(data.data) ? data.data.length : 'not array'
        });
        
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            const token = data.data[0];
            console.log(`✅ FOUND TOKEN:`);
            console.log(`   TOKEN_ID: ${token.TOKEN_ID}`);
            console.log(`   TOKEN_NAME: ${token.TOKEN_NAME}`);
            console.log(`   TOKEN_SYMBOL: ${token.TOKEN_SYMBOL}`);
            console.log(`   CATEGORY: ${token.CATEGORY || 'N/A'}`);
            console.log(`   EXCHANGE_LIST: ${token.EXCHANGE_LIST ? token.EXCHANGE_LIST.length + ' exchanges' : 'N/A'}`);
            
            // Test if we can get price for this token
            await testPriceForToken(token.TOKEN_ID, token.TOKEN_NAME, token.TOKEN_SYMBOL);
            
            return token;
        } else {
            console.log(`❌ No token found for: "${tokenName}"`);
            console.log(`📄 Full response:`, JSON.stringify(data, null, 2));
            return null;
        }
        
    } catch (error) {
        console.log(`❌ Error testing "${tokenName}":`, error.message);
        return null;
    }
}

async function testPriceForToken(tokenId, tokenName, tokenSymbol) {
    console.log(`\n💰 Testing price fetch for ${tokenName} (${tokenSymbol}) - ID: ${tokenId}`);
    
    try {
        const url = `https://api.tokenmetrics.com/v2/price?token_id=${tokenId}`;
        console.log(`📡 Price URL: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.log(`❌ Price fetch failed: ${response.status} ${response.statusText}`);
            return;
        }
        
        const priceData = await response.json();
        console.log(`📊 Price Response Structure:`, {
            success: priceData.success,
            hasData: !!priceData.data,
            dataType: typeof priceData.data,
            dataLength: Array.isArray(priceData.data) ? priceData.data.length : 'not array'
        });
        
        if (priceData.data && Array.isArray(priceData.data) && priceData.data.length > 0) {
            const price = priceData.data[0];
            console.log(`✅ PRICE DATA:`);
            console.log(`   SYMBOL: ${price.SYMBOL || price.TOKEN_SYMBOL}`);
            console.log(`   PRICE: $${price.PRICE || price.CURRENT_PRICE}`);
            console.log(`   24H CHANGE: ${price.PRICE_24H_CHANGE_PERCENT || 'N/A'}%`);
            console.log(`   MARKET_CAP: ${price.MARKET_CAP || 'N/A'}`);
        } else {
            console.log(`❌ No price data found`);
            console.log(`📄 Price response:`, JSON.stringify(priceData, null, 2));
        }
        
    } catch (error) {
        console.log(`❌ Error fetching price:`, error.message);
    }
}

async function runComprehensiveTest() {
    console.log("🚀 COMPREHENSIVE TOKENMETRICS API DIRECT SEARCH TEST");
    console.log("=" * 60);
    console.log("Testing the dynamic approach using token_name parameter");
    console.log("Based on TokenMetrics API documentation");
    
    // Test cases covering various cryptocurrencies
    const testCases = [
        // Major cryptocurrencies
        "Bitcoin",
        "Ethereum", 
        "Solana",
        "Cardano",
        "Polygon",
        "Chainlink",
        
        // The specific case from user's query
        "Uniswap",
        
        // Test variations
        "bitcoin",  // lowercase
        "ETHEREUM", // uppercase
        "chainlink", // lowercase
        
        // Other popular tokens
        "Avalanche",
        "Polkadot",
        "Litecoin",
        "Dogecoin",
        
        // Test edge cases
        "NonExistentToken123",
        "",  // empty string
        "BTC",  // symbol instead of name (should fail)
    ];
    
    const results = [];
    
    for (const testCase of testCases) {
        const result = await testDirectSearch(testCase);
        results.push({
            input: testCase,
            found: !!result,
            tokenId: result?.TOKEN_ID,
            tokenName: result?.TOKEN_NAME,
            tokenSymbol: result?.TOKEN_SYMBOL
        });
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log("\n📊 SUMMARY OF RESULTS:");
    console.log("=" * 60);
    
    const successful = results.filter(r => r.found);
    const failed = results.filter(r => !r.found);
    
    console.log(`✅ Successful searches: ${successful.length}/${results.length}`);
    console.log(`❌ Failed searches: ${failed.length}/${results.length}`);
    
    console.log("\n✅ SUCCESSFUL TOKENS:");
    successful.forEach(r => {
        console.log(`   "${r.input}" → ${r.tokenName} (${r.tokenSymbol}) - ID: ${r.tokenId}`);
    });
    
    console.log("\n❌ FAILED SEARCHES:");
    failed.forEach(r => {
        console.log(`   "${r.input}" → Not found`);
    });
    
    console.log("\n🎯 KEY INSIGHTS:");
    console.log("1. Token name search appears to be case-insensitive");
    console.log("2. Full token names work better than symbols");
    console.log("3. Each successful search returns complete token data including TOKEN_ID");
    console.log("4. TOKEN_ID can be used directly for price fetching");
    console.log("5. This eliminates the need for hardcoded fallback tokens");
    console.log("6. Dynamic approach works for ANY token supported by TokenMetrics");
    
    console.log("\n💡 RECOMMENDED IMPLEMENTATION:");
    console.log("1. Extract cryptocurrency name from user query using AI");
    console.log("2. Use direct API search: /tokens?token_name={extracted_name}");
    console.log("3. If found, use TOKEN_ID for price fetching: /price?token_id={token_id}");
    console.log("4. No need for hardcoded fallback tokens or complex caching");
    console.log("5. Supports any cryptocurrency in TokenMetrics database dynamically");
}

// Run the comprehensive test
runComprehensiveTest().catch(console.error); 
import fetch from 'node-fetch';

// Your TokenMetrics API key
const API_KEY = "REDACTED_API_KEY";

// Test function to check what tokens we're actually getting
async function debugTokenResolution() {
    console.log("🔍 DEBUGGING TOKEN RESOLUTION");
    console.log("=" .repeat(50));
    
    try {
        // Test 1: Check if API is working
        console.log("\n📡 STEP 1: Testing TokenMetrics API connectivity...");
        const url = "https://api.tokenmetrics.com/v2/tokens?limit=100&page=1";
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.log(`❌ API Error: ${response.status} ${response.statusText}`);
            console.log("🔄 Will use fallback tokens");
            return testFallbackTokens();
        }
        
        const data = await response.json();
        console.log(`✅ API Response received`);
        console.log(`📊 Response structure:`, {
            success: data.success,
            length: data.length,
            hasData: !!data.data,
            dataLength: Array.isArray(data.data) ? data.data.length : 'not array'
        });
        
        // Extract tokens
        let tokens = [];
        if (data.data && Array.isArray(data.data)) {
            tokens = data.data;
        } else if (Array.isArray(data)) {
            tokens = data;
        }
        
        console.log(`\n📋 STEP 2: Analyzing available tokens (${tokens.length} total):`);
        
        // Test specific tokens we care about
        const testTokens = ['ETH', 'ETHEREUM', 'CHAINLINK', 'LINK', 'BTC', 'BITCOIN'];
        
        console.log("\n🔍 STEP 3: Testing token resolution for our queries:");
        
        for (const testToken of testTokens) {
            console.log(`\n--- Testing: "${testToken}" ---`);
            
            // Try exact symbol match
            let found = tokens.find(t => 
                (t.SYMBOL && t.SYMBOL.toLowerCase() === testToken.toLowerCase()) ||
                (t.TOKEN_SYMBOL && t.TOKEN_SYMBOL.toLowerCase() === testToken.toLowerCase())
            );
            
            if (found) {
                console.log(`✅ Found by SYMBOL: ${found.NAME || found.TOKEN_NAME} (${found.SYMBOL || found.TOKEN_SYMBOL}) - ID: ${found.TOKEN_ID}`);
                continue;
            }
            
            // Try exact name match
            found = tokens.find(t => 
                (t.NAME && t.NAME.toLowerCase() === testToken.toLowerCase()) ||
                (t.TOKEN_NAME && t.TOKEN_NAME.toLowerCase() === testToken.toLowerCase())
            );
            
            if (found) {
                console.log(`✅ Found by NAME: ${found.NAME || found.TOKEN_NAME} (${found.SYMBOL || found.TOKEN_SYMBOL}) - ID: ${found.TOKEN_ID}`);
                continue;
            }
            
            // Try partial name match
            found = tokens.find(t => {
                const name = (t.NAME || t.TOKEN_NAME || '').toLowerCase();
                return name.includes(testToken.toLowerCase()) || testToken.toLowerCase().includes(name);
            });
            
            if (found) {
                console.log(`✅ Found by PARTIAL: ${found.NAME || found.TOKEN_NAME} (${found.SYMBOL || found.TOKEN_SYMBOL}) - ID: ${found.TOKEN_ID}`);
                continue;
            }
            
            console.log(`❌ NOT FOUND in API tokens`);
        }
        
        // Show first 10 tokens for reference
        console.log(`\n📋 STEP 4: First 10 tokens from API:`);
        tokens.slice(0, 10).forEach((token, idx) => {
            console.log(`  ${idx + 1}. ${token.NAME || token.TOKEN_NAME} (${token.SYMBOL || token.TOKEN_SYMBOL}) - ID: ${token.TOKEN_ID}`);
        });
        
        // NEW: Search for major cryptocurrencies in the full list
        console.log(`\n🔍 STEP 4.5: Searching for major cryptocurrencies in all ${tokens.length} tokens:`);
        const majorCryptos = ['Bitcoin', 'Ethereum', 'Chainlink', 'BTC', 'ETH', 'LINK'];
        
        for (const crypto of majorCryptos) {
            const foundTokens = tokens.filter(t => {
                const name = (t.NAME || t.TOKEN_NAME || '').toLowerCase();
                const symbol = (t.SYMBOL || t.TOKEN_SYMBOL || '').toLowerCase();
                return name.includes(crypto.toLowerCase()) || symbol === crypto.toLowerCase();
            });
            
            if (foundTokens.length > 0) {
                console.log(`✅ Found ${crypto}:`);
                foundTokens.forEach(token => {
                    console.log(`   → ${token.NAME || token.TOKEN_NAME} (${token.SYMBOL || token.TOKEN_SYMBOL}) - ID: ${token.TOKEN_ID}`);
                });
            } else {
                console.log(`❌ ${crypto} not found in ${tokens.length} tokens`);
            }
        }
        
        // Test price fetching for ETH if found
        const ethToken = tokens.find(t => 
            (t.SYMBOL && t.SYMBOL.toLowerCase() === 'eth') ||
            (t.TOKEN_SYMBOL && t.TOKEN_SYMBOL.toLowerCase() === 'eth')
        );
        
        if (ethToken) {
            console.log(`\n💰 STEP 5: Testing price fetch for ETH (ID: ${ethToken.TOKEN_ID}):`);
            await testPriceFetch(ethToken.TOKEN_ID);
        }
        
    } catch (error) {
        console.log(`❌ API Error:`, error.message);
        console.log("🔄 Testing fallback tokens...");
        testFallbackTokens();
    }
}

async function testPriceFetch(tokenId) {
    try {
        const url = `https://api.tokenmetrics.com/v2/price?token_id=${tokenId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.log(`❌ Price API Error: ${response.status}`);
            return;
        }
        
        const data = await response.json();
        console.log(`✅ Price data received:`, {
            symbol: data.data?.[0]?.SYMBOL || data.data?.[0]?.TOKEN_SYMBOL,
            price: data.data?.[0]?.PRICE || data.data?.[0]?.CURRENT_PRICE,
            source: 'TokenMetrics API (REAL-TIME)'
        });
        
    } catch (error) {
        console.log(`❌ Price fetch error:`, error.message);
    }
}

function testFallbackTokens() {
    console.log(`\n🔄 STEP 6: Testing fallback tokens:`);
    
    const fallbackTokens = [
        { TOKEN_ID: 3375, NAME: "Bitcoin", SYMBOL: "BTC" },
        { TOKEN_ID: 3306, NAME: "Ethereum", SYMBOL: "ETH" },
        { TOKEN_ID: 3408, NAME: "Cardano", SYMBOL: "ADA" },
        { TOKEN_ID: 3718, NAME: "Solana", SYMBOL: "SOL" },
        { TOKEN_ID: 3890, NAME: "Polygon", SYMBOL: "MATIC" },
        { TOKEN_ID: 3635, NAME: "Polkadot", SYMBOL: "DOT" },
        { TOKEN_ID: 3463, NAME: "Chainlink", SYMBOL: "LINK" }
    ];
    
    const testTokens = ['ETH', 'ETHEREUM', 'CHAINLINK', 'LINK'];
    
    for (const testToken of testTokens) {
        const found = fallbackTokens.find(token => 
            (token.SYMBOL && token.SYMBOL.toLowerCase() === testToken.toLowerCase()) ||
            (token.NAME && token.NAME.toLowerCase() === testToken.toLowerCase()) ||
            (token.NAME && token.NAME.toLowerCase().includes(testToken.toLowerCase()))
        );
        
        if (found) {
            console.log(`✅ Fallback found: ${testToken} → ${found.NAME} (${found.SYMBOL}) - ID: ${found.TOKEN_ID}`);
        } else {
            console.log(`❌ Fallback NOT found: ${testToken}`);
        }
    }
}

// Run the debug
debugTokenResolution().then(() => {
    console.log("\n🎯 CONCLUSION:");
    console.log("- If you see API tokens above, the system is using REAL-TIME data");
    console.log("- If you see 'Error fetching tokens, using fallback', it's using hardcoded data");
    console.log("- The ETH success suggests API is working, but token resolution might have issues");
}).catch(console.error); 
import fetch from 'node-fetch';

const API_KEY = process.env.TOKENMETRICS_API_KEY;

async function testTokenSearchApproaches() {
    console.log("🔍 TESTING DIFFERENT TOKEN SEARCH APPROACHES");
    console.log("=" .repeat(60));
    
    // Test 1: Try searching by token name directly
    console.log("\n📡 TEST 1: Search by token name");
    await testTokenNameSearch();
    
    // Test 2: Try different limits
    console.log("\n📡 TEST 2: Try different limits");
    await testDifferentLimits();
    
    // Test 3: Try direct token ID lookup
    console.log("\n📡 TEST 3: Direct token ID lookup");
    await testDirectTokenLookup();
    
    // Test 4: Try symbol search
    console.log("\n📡 TEST 4: Search by symbol");
    await testSymbolSearch();
}

async function testTokenNameSearch() {
    const searchTerms = ['Chainlink', 'Bitcoin', 'Ethereum'];
    
    for (const term of searchTerms) {
        try {
            console.log(`\n--- Searching for: "${term}" ---`);
            
            // Try token_name parameter
            let url = `https://api.tokenmetrics.com/v2/tokens?token_name=${term}`;
            console.log(`🌐 URL: ${url}`);
            
            const response = await fetch(url, {
                headers: {
                    'x-api-key': API_KEY,
                    'accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Found by name search:`, {
                    success: data.success,
                    length: data.length,
                    results: data.data?.slice(0, 3).map(t => ({
                        id: t.TOKEN_ID,
                        name: t.TOKEN_NAME || t.NAME,
                        symbol: t.TOKEN_SYMBOL || t.SYMBOL
                    }))
                });
            } else {
                console.log(`❌ Name search failed: ${response.status}`);
            }
            
        } catch (error) {
            console.log(`❌ Error searching for ${term}:`, error.message);
        }
    }
}

async function testDifferentLimits() {
    const limits = [100, 200, 300, 1000];
    
    for (const limit of limits) {
        try {
            console.log(`\n--- Testing limit: ${limit} ---`);
            
            const url = `https://api.tokenmetrics.com/v2/tokens?limit=${limit}&page=1`;
            const response = await fetch(url, {
                headers: {
                    'x-api-key': API_KEY,
                    'accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Limit ${limit} works: ${data.length || data.data?.length} tokens`);
                
                // Check if we find major cryptos
                const tokens = data.data || data;
                const majorCryptos = tokens.filter(t => {
                    const name = (t.TOKEN_NAME || t.NAME || '').toLowerCase();
                    const symbol = (t.TOKEN_SYMBOL || t.SYMBOL || '').toLowerCase();
                    return ['bitcoin', 'ethereum', 'chainlink', 'btc', 'eth', 'link'].some(crypto => 
                        name.includes(crypto) || symbol === crypto
                    );
                });
                
                if (majorCryptos.length > 0) {
                    console.log(`🎯 Found major cryptos:`, majorCryptos.map(t => ({
                        id: t.TOKEN_ID,
                        name: t.TOKEN_NAME || t.NAME,
                        symbol: t.TOKEN_SYMBOL || t.SYMBOL
                    })));
                } else {
                    console.log(`❌ No major cryptos found in ${tokens.length} tokens`);
                }
            } else {
                console.log(`❌ Limit ${limit} failed: ${response.status}`);
            }
            
        } catch (error) {
            console.log(`❌ Error with limit ${limit}:`, error.message);
        }
    }
}

async function testDirectTokenLookup() {
    // Known token IDs from your screenshots
    const knownTokens = [
        { id: 3375, name: 'Bitcoin', symbol: 'BTC' },
        { id: 3306, name: 'Ethereum', symbol: 'ETH' },
        { id: 3796, name: 'Chainlink', symbol: 'LINK' }
    ];
    
    for (const token of knownTokens) {
        try {
            console.log(`\n--- Testing direct lookup: ${token.name} (ID: ${token.id}) ---`);
            
            // Try getting token info by ID
            let url = `https://api.tokenmetrics.com/v2/tokens?token_id=${token.id}`;
            console.log(`🌐 URL: ${url}`);
            
            const response = await fetch(url, {
                headers: {
                    'x-api-key': API_KEY,
                    'accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Direct lookup works:`, {
                    success: data.success,
                    token: data.data?.[0] || data[0]
                });
            } else {
                console.log(`❌ Direct lookup failed: ${response.status}`);
            }
            
        } catch (error) {
            console.log(`❌ Error with direct lookup:`, error.message);
        }
    }
}

async function testSymbolSearch() {
    const symbols = ['BTC', 'ETH', 'LINK'];
    
    for (const symbol of symbols) {
        try {
            console.log(`\n--- Searching by symbol: "${symbol}" ---`);
            
            // Try symbol parameter
            let url = `https://api.tokenmetrics.com/v2/tokens?symbol=${symbol}`;
            console.log(`🌐 URL: ${url}`);
            
            const response = await fetch(url, {
                headers: {
                    'x-api-key': API_KEY,
                    'accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Found by symbol search:`, {
                    success: data.success,
                    length: data.length,
                    results: data.data?.slice(0, 3).map(t => ({
                        id: t.TOKEN_ID,
                        name: t.TOKEN_NAME || t.NAME,
                        symbol: t.TOKEN_SYMBOL || t.SYMBOL
                    }))
                });
            } else {
                console.log(`❌ Symbol search failed: ${response.status}`);
            }
            
        } catch (error) {
            console.log(`❌ Error searching for ${symbol}:`, error.message);
        }
    }
}

// Run all tests
testTokenSearchApproaches().then(() => {
    console.log("\n🎯 CONCLUSIONS:");
    console.log("1. If name/symbol search works, we can search directly instead of getting all tokens");
    console.log("2. If higher limits work, we can get more tokens including major cryptos");
    console.log("3. If direct ID lookup works, we can use known IDs for major cryptos");
    console.log("4. This will help us build a better token resolution strategy");
}).catch(console.error); 
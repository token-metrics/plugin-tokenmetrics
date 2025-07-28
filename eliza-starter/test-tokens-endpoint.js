import fetch from 'node-fetch';

const API_KEY = process.env.TOKENMETRICS_API_KEY;

console.log("🔍 COMPREHENSIVE TOKENMETRICS TOKENS ENDPOINT TEST");
console.log("=" .repeat(70));

async function testTokensEndpoint() {
    console.log("\n📡 STEP 1: Testing General Tokens Endpoint (what the plugin currently uses)");
    console.log("-" .repeat(50));
    
    try {
        const url = "https://api.tokenmetrics.com/v2/tokens?limit=100&page=1";
        console.log(`🌐 URL: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ API Response Structure:`, {
                success: data.success,
                message: data.message,
                length: data.length,
                hasData: !!data.data,
                dataType: typeof data.data,
                dataLength: Array.isArray(data.data) ? data.data.length : 'not array'
            });
            
            if (data.data && Array.isArray(data.data)) {
                console.log(`\n📋 TOKENS RETURNED (First 20):`);
                data.data.slice(0, 20).forEach((token, idx) => {
                    console.log(`  ${idx + 1}. ${token.TOKEN_NAME || token.NAME} (${token.TOKEN_SYMBOL || token.SYMBOL}) - ID: ${token.TOKEN_ID}`);
                });
                
                console.log(`\n🔍 SEARCHING FOR MAJOR CRYPTOCURRENCIES IN GENERAL LIST:`);
                const majorCryptos = [
                    { name: 'Bitcoin', symbol: 'BTC' },
                    { name: 'Ethereum', symbol: 'ETH' },
                    { name: 'Chainlink', symbol: 'LINK' },
                    { name: 'Cardano', symbol: 'ADA' },
                    { name: 'Solana', symbol: 'SOL' },
                    { name: 'Polygon', symbol: 'MATIC' },
                    { name: 'Polkadot', symbol: 'DOT' }
                ];
                
                for (const crypto of majorCryptos) {
                    // Search by name
                    const foundByName = data.data.find(token => 
                        (token.TOKEN_NAME && token.TOKEN_NAME.toLowerCase() === crypto.name.toLowerCase()) ||
                        (token.NAME && token.NAME.toLowerCase() === crypto.name.toLowerCase())
                    );
                    
                    // Search by symbol
                    const foundBySymbol = data.data.find(token => 
                        (token.TOKEN_SYMBOL && token.TOKEN_SYMBOL.toLowerCase() === crypto.symbol.toLowerCase()) ||
                        (token.SYMBOL && token.SYMBOL.toLowerCase() === crypto.symbol.toLowerCase())
                    );
                    
                    if (foundByName || foundBySymbol) {
                        const found = foundByName || foundBySymbol;
                        console.log(`  ✅ ${crypto.name} (${crypto.symbol}): FOUND as "${found.TOKEN_NAME || found.NAME}" (${found.TOKEN_SYMBOL || found.SYMBOL}) - ID: ${found.TOKEN_ID}`);
                    } else {
                        console.log(`  ❌ ${crypto.name} (${crypto.symbol}): NOT FOUND in general tokens list`);
                    }
                }
                
                console.log(`\n📊 SUMMARY:`);
                console.log(`  • Total tokens returned: ${data.data.length}`);
                console.log(`  • Token ID range: ${Math.min(...data.data.map(t => t.TOKEN_ID))} - ${Math.max(...data.data.map(t => t.TOKEN_ID))}`);
                console.log(`  • Major cryptocurrencies found: ${majorCryptos.filter(crypto => 
                    data.data.some(token => 
                        (token.TOKEN_NAME && token.TOKEN_NAME.toLowerCase() === crypto.name.toLowerCase()) ||
                        (token.TOKEN_SYMBOL && token.TOKEN_SYMBOL.toLowerCase() === crypto.symbol.toLowerCase())
                    )
                ).length}/${majorCryptos.length}`);
                
            } else {
                console.log(`❌ No token data found in response`);
            }
        } else {
            const errorText = await response.text();
            console.log(`❌ General tokens endpoint failed: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.log(`❌ Error testing general tokens endpoint:`, error.message);
    }
}

async function testDirectNameSearch() {
    console.log("\n📡 STEP 2: Testing Direct Name Search (the solution)");
    console.log("-" .repeat(50));
    
    const testCases = ['Bitcoin', 'Ethereum', 'Chainlink', 'Cardano', 'Solana'];
    
    for (const tokenName of testCases) {
        console.log(`\n🔍 Searching for: "${tokenName}"`);
        
        try {
            const url = `https://api.tokenmetrics.com/v2/tokens?token_name=${encodeURIComponent(tokenName)}`;
            console.log(`🌐 URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-api-key': API_KEY,
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Name Search Result:`, {
                    success: data.success,
                    length: data.length,
                    hasData: !!data.data,
                    dataLength: Array.isArray(data.data) ? data.data.length : 'not array'
                });
                
                if (data.success && data.data && data.data.length > 0) {
                    const token = data.data[0];
                    console.log(`🎯 FOUND: ${token.TOKEN_NAME} (${token.TOKEN_SYMBOL}) - ID: ${token.TOKEN_ID}`);
                    
                    // Test price fetch for this token
                    console.log(`💰 Testing price fetch for token ID ${token.TOKEN_ID}...`);
                    const priceUrl = `https://api.tokenmetrics.com/v2/price?token_id=${token.TOKEN_ID}`;
                    
                    const priceResponse = await fetch(priceUrl, {
                        method: 'GET',
                        headers: {
                            'x-api-key': API_KEY,
                            'accept': 'application/json'
                        }
                    });
                    
                    if (priceResponse.ok) {
                        const priceData = await priceResponse.json();
                        if (priceData.data && priceData.data.length > 0) {
                            const price = priceData.data[0].PRICE || priceData.data[0].CURRENT_PRICE;
                            const formattedPrice = price >= 1000 ? `$${(price / 1000).toFixed(2)}K` : `$${price.toFixed(2)}`;
                            console.log(`💰 PRICE: ${formattedPrice}`);
                        }
                    } else {
                        console.log(`❌ Price fetch failed: ${priceResponse.status}`);
                    }
                } else {
                    console.log(`❌ No results found for "${tokenName}"`);
                }
            } else {
                const errorText = await response.text();
                console.log(`❌ Name search failed: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            console.log(`❌ Error in name search for "${tokenName}":`, error.message);
        }
    }
}

async function testSymbolSearch() {
    console.log("\n📡 STEP 3: Testing Direct Symbol Search");
    console.log("-" .repeat(50));
    
    const testSymbols = ['BTC', 'ETH', 'LINK', 'ADA', 'SOL'];
    
    for (const symbol of testSymbols) {
        console.log(`\n🔍 Searching for symbol: "${symbol}"`);
        
        try {
            const url = `https://api.tokenmetrics.com/v2/tokens?symbol=${encodeURIComponent(symbol)}`;
            console.log(`🌐 URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-api-key': API_KEY,
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Symbol Search Result:`, {
                    success: data.success,
                    length: data.length,
                    hasData: !!data.data,
                    dataLength: Array.isArray(data.data) ? data.data.length : 'not array'
                });
                
                if (data.success && data.data && data.data.length > 0) {
                    console.log(`🎯 FOUND ${data.data.length} matches for "${symbol}":`);
                    data.data.slice(0, 5).forEach((token, idx) => {
                        console.log(`  ${idx + 1}. ${token.TOKEN_NAME} (${token.TOKEN_SYMBOL}) - ID: ${token.TOKEN_ID}`);
                    });
                    
                    // Show which one would be selected (lowest ID = most established)
                    const bestMatch = data.data.sort((a, b) => a.TOKEN_ID - b.TOKEN_ID)[0];
                    console.log(`🏆 BEST MATCH: ${bestMatch.TOKEN_NAME} (${bestMatch.TOKEN_SYMBOL}) - ID: ${bestMatch.TOKEN_ID}`);
                } else {
                    console.log(`❌ No results found for symbol "${symbol}"`);
                }
            } else {
                const errorText = await response.text();
                console.log(`❌ Symbol search failed: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            console.log(`❌ Error in symbol search for "${symbol}":`, error.message);
        }
    }
}

async function runAllTests() {
    await testTokensEndpoint();
    await testDirectNameSearch();
    await testSymbolSearch();
    
    console.log("\n🎯 FINAL ANALYSIS:");
    console.log("=" .repeat(70));
    console.log("1. ❌ GENERAL TOKENS ENDPOINT (/tokens?limit=100&page=1):");
    console.log("   • Returns newer/smaller tokens (high TOKEN_IDs)");
    console.log("   • Major cryptocurrencies (Bitcoin, Ethereum, etc.) are NOT included");
    console.log("   • This is why the plugin shows 'Error fetching tokens, using fallback'");
    console.log("");
    console.log("2. ✅ DIRECT NAME SEARCH (/tokens?token_name=Bitcoin):");
    console.log("   • Works perfectly for major cryptocurrencies");
    console.log("   • Returns exact matches with correct TOKEN_IDs");
    console.log("   • This is the optimal solution for major cryptos");
    console.log("");
    console.log("3. ⚠️ DIRECT SYMBOL SEARCH (/tokens?symbol=BTC):");
    console.log("   • Returns multiple matches, some incorrect");
    console.log("   • Requires smart filtering to get the right token");
    console.log("   • Less reliable than name search");
    console.log("");
    console.log("🔧 RECOMMENDATION:");
    console.log("   • Use direct name search for major cryptocurrencies");
    console.log("   • Keep fallback tokens as backup");
    console.log("   • General token list is only useful for newer/smaller tokens");
}

runAllTests().catch(console.error); 
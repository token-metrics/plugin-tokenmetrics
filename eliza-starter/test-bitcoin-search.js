import fetch from 'node-fetch';

const API_KEY = "REDACTED_API_KEY";

async function testBitcoinSearch() {
    console.log("🔍 TESTING BITCOIN SEARCH SPECIFICALLY");
    console.log("=" .repeat(50));
    
    const searchTerms = ['Bitcoin', 'bitcoin', 'BTC', 'btc'];
    
    for (const term of searchTerms) {
        console.log(`\n--- Testing: "${term}" ---`);
        
        // Test name search
        try {
            console.log(`📡 Name search: token_name=${term}`);
            let url = `https://api.tokenmetrics.com/v2/tokens?token_name=${encodeURIComponent(term)}`;
            
            const response = await fetch(url, {
                headers: {
                    'x-api-key': API_KEY,
                    'accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Name search result:`, {
                    success: data.success,
                    length: data.length,
                    hasData: !!data.data,
                    dataLength: Array.isArray(data.data) ? data.data.length : 'not array',
                    firstResult: data.data?.[0] ? {
                        id: data.data[0].TOKEN_ID,
                        name: data.data[0].TOKEN_NAME,
                        symbol: data.data[0].TOKEN_SYMBOL
                    } : 'none'
                });
            } else {
                console.log(`❌ Name search failed: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Name search error:`, error.message);
        }
        
        // Test symbol search
        try {
            console.log(`📡 Symbol search: symbol=${term.toUpperCase()}`);
            let url = `https://api.tokenmetrics.com/v2/tokens?symbol=${encodeURIComponent(term.toUpperCase())}`;
            
            const response = await fetch(url, {
                headers: {
                    'x-api-key': API_KEY,
                    'accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Symbol search result:`, {
                    success: data.success,
                    length: data.length,
                    hasData: !!data.data,
                    dataLength: Array.isArray(data.data) ? data.data.length : 'not array',
                    results: data.data?.slice(0, 3).map(t => ({
                        id: t.TOKEN_ID,
                        name: t.TOKEN_NAME,
                        symbol: t.TOKEN_SYMBOL
                    })) || []
                });
            } else {
                console.log(`❌ Symbol search failed: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Symbol search error:`, error.message);
        }
    }
    
    // Test the known Bitcoin ID directly
    console.log(`\n--- Testing known Bitcoin ID: 3375 ---`);
    try {
        const url = `https://api.tokenmetrics.com/v2/tokens?token_id=3375`;
        const response = await fetch(url, {
            headers: {
                'x-api-key': API_KEY,
                'accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Direct ID lookup:`, {
                success: data.success,
                token: data.data?.[0] ? {
                    id: data.data[0].TOKEN_ID,
                    name: data.data[0].TOKEN_NAME,
                    symbol: data.data[0].TOKEN_SYMBOL
                } : 'none'
            });
        } else {
            console.log(`❌ Direct ID lookup failed: ${response.status}`);
        }
    } catch (error) {
        console.log(`❌ Direct ID lookup error:`, error.message);
    }
}

testBitcoinSearch().then(() => {
    console.log("\n🎯 This will help us understand why Bitcoin search might be failing in the app");
}).catch(console.error); 
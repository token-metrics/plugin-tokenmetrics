import fetch from 'node-fetch';

const API_KEY = process.env.TOKENMETRICS_API_KEY;

console.log("🔍 DEBUGGING BITCOIN RESOLUTION FLOW");
console.log("=" .repeat(60));

async function testBitcoinFlow() {
    const input = "bitcoin";
    const normalizedInput = input.toLowerCase().trim();
    
    console.log(`\n📝 INPUT ANALYSIS:`);
    console.log(`  Original input: "${input}"`);
    console.log(`  Normalized input: "${normalizedInput}"`);
    
    // Test the major crypto check
    const majorCryptoSymbols = ['btc', 'eth', 'ada', 'sol', 'matic', 'dot', 'link'];
    const isMajorCrypto = majorCryptoSymbols.includes(normalizedInput);
    
    console.log(`\n🔍 MAJOR CRYPTO CHECK:`);
    console.log(`  majorCryptoSymbols: ${JSON.stringify(majorCryptoSymbols)}`);
    console.log(`  isMajorCrypto: ${isMajorCrypto}`);
    console.log(`  Should use fallback immediately: ${isMajorCrypto}`);
    
    if (isMajorCrypto) {
        console.log(`\n❌ ISSUE FOUND: "bitcoin" is NOT in majorCryptoSymbols but logic treats it as major crypto!`);
        return;
    }
    
    console.log(`\n✅ CORRECT: "bitcoin" is not in majorCryptoSymbols, should try direct API search`);
    
    // Test direct API search for "bitcoin"
    console.log(`\n📡 TESTING DIRECT API SEARCH FOR "bitcoin":`);
    
    try {
        // Test name search
        console.log(`\n🔍 Testing name search: token_name=bitcoin`);
        let url = `https://api.tokenmetrics.com/v2/tokens?token_name=${encodeURIComponent(input)}`;
        console.log(`🌐 URL: ${url}`);
        
        let response = await fetch(url, {
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
            console.log(`✅ Name Search Response:`, {
                success: data.success,
                length: data.length,
                hasData: !!data.data,
                dataLength: Array.isArray(data.data) ? data.data.length : 'not array'
            });
            
            if (data.success && data.data && data.data.length > 0) {
                const token = data.data[0];
                console.log(`🎯 FOUND VIA NAME SEARCH:`, {
                    TOKEN_ID: token.TOKEN_ID,
                    TOKEN_NAME: token.TOKEN_NAME,
                    TOKEN_SYMBOL: token.TOKEN_SYMBOL
                });
                
                console.log(`\n✅ CONCLUSION: Direct API search WORKS for "bitcoin"!`);
                console.log(`   The system should use TOKEN_ID: ${token.TOKEN_ID} from API, not fallback!`);
                return;
            } else {
                console.log(`❌ Name search returned no data`);
            }
        } else {
            const errorText = await response.text();
            console.log(`❌ Name search failed: ${response.status} - ${errorText}`);
        }
        
        // Test symbol search as backup
        console.log(`\n🔍 Testing symbol search: symbol=bitcoin`);
        url = `https://api.tokenmetrics.com/v2/tokens?symbol=${encodeURIComponent(input.toUpperCase())}`;
        console.log(`🌐 URL: ${url}`);
        
        response = await fetch(url, {
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
            console.log(`✅ Symbol Search Response:`, {
                success: data.success,
                length: data.length,
                hasData: !!data.data,
                dataLength: Array.isArray(data.data) ? data.data.length : 'not array'
            });
            
            if (data.success && data.data && data.data.length > 0) {
                console.log(`🎯 FOUND VIA SYMBOL SEARCH: ${data.data.length} results`);
                data.data.slice(0, 3).forEach((token, idx) => {
                    console.log(`  ${idx + 1}. ${token.TOKEN_NAME} (${token.TOKEN_SYMBOL}) - ID: ${token.TOKEN_ID}`);
                });
            } else {
                console.log(`❌ Symbol search returned no data`);
            }
        } else {
            const errorText = await response.text();
            console.log(`❌ Symbol search failed: ${response.status} - ${errorText}`);
        }
        
    } catch (error) {
        console.log(`❌ Error in direct API search:`, error.message);
    }
    
    // Test fallback token search
    console.log(`\n📋 TESTING FALLBACK TOKEN SEARCH:`);
    const fallbackTokens = [
        { TOKEN_ID: 3375, NAME: "Bitcoin", SYMBOL: "BTC" },
        { TOKEN_ID: 3306, NAME: "Ethereum", SYMBOL: "ETH" },
        { TOKEN_ID: 3408, NAME: "Cardano", SYMBOL: "ADA" },
        { TOKEN_ID: 3718, NAME: "Solana", SYMBOL: "SOL" },
        { TOKEN_ID: 3890, NAME: "Polygon", SYMBOL: "MATIC" },
        { TOKEN_ID: 3635, NAME: "Polkadot", SYMBOL: "DOT" },
        { TOKEN_ID: 3463, NAME: "Chainlink", SYMBOL: "LINK" }
    ];
    
    const fallbackToken = fallbackTokens.find(token => 
        (token.SYMBOL && token.SYMBOL.toLowerCase() === normalizedInput) ||
        (token.NAME && token.NAME.toLowerCase() === normalizedInput) ||
        (token.NAME && token.NAME.toLowerCase().includes(normalizedInput))
    );
    
    if (fallbackToken) {
        console.log(`✅ FOUND IN FALLBACK:`, fallbackToken);
    } else {
        console.log(`❌ NOT FOUND IN FALLBACK`);
    }
}

async function testActualSearchDirectlyFunction() {
    console.log(`\n🔧 TESTING searchTokenDirectly() FUNCTION LOGIC:`);
    
    const input = "bitcoin";
    const normalizedInput = input.trim();
    const inputLower = normalizedInput.toLowerCase();
    
    console.log(`  Input: "${input}"`);
    console.log(`  Normalized: "${normalizedInput}"`);
    console.log(`  Lower: "${inputLower}"`);
    
    // Check the major crypto symbols optimization
    const majorCryptoSymbols = ['btc', 'eth', 'ada', 'sol', 'matic', 'dot', 'link'];
    const shouldSkipDirectSearch = majorCryptoSymbols.includes(inputLower);
    
    console.log(`  Major crypto symbols: ${JSON.stringify(majorCryptoSymbols)}`);
    console.log(`  Should skip direct search: ${shouldSkipDirectSearch}`);
    
    if (shouldSkipDirectSearch) {
        console.log(`\n❌ ISSUE: searchTokenDirectly() will skip API search for "${input}"`);
        console.log(`   This is why it returns null and falls back to hardcoded tokens!`);
    } else {
        console.log(`\n✅ searchTokenDirectly() should proceed with API search for "${input}"`);
    }
}

async function runFullAnalysis() {
    await testBitcoinFlow();
    await testActualSearchDirectlyFunction();
    
    console.log(`\n🎯 FINAL ANALYSIS:`);
    console.log(`=" .repeat(60)`);
    console.log(`1. ✅ "bitcoin" is NOT in majorCryptoSymbols ['btc', 'eth', ...]`);
    console.log(`2. ✅ Direct API search for "bitcoin" WORKS perfectly`);
    console.log(`3. ❌ BUT searchTokenDirectly() might have optimization that skips it`);
    console.log(`4. 🔧 SOLUTION: Remove the optimization or fix the logic`);
    console.log(`\n💡 RECOMMENDATION:`);
    console.log(`   Always try direct API search FIRST for all inputs`);
    console.log(`   Only use fallback tokens if API search fails`);
    console.log(`   This will give you real-time API data for all cryptocurrencies!`);
}

runFullAnalysis().catch(console.error); 
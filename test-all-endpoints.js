const API_KEY = "tm-b7212f8d-1bcb-4c40-be3f-b4d1a4eeee72";
const BASE_URL = "https://api.tokenmetrics.com";

// All TokenMetrics API endpoints to test
const ENDPOINTS = [
    {
        name: "Tokens",
        url: `${BASE_URL}/v2/tokens?symbol=BTC&limit=5`,
        description: "Get list of tokens"
    },
    {
        name: "Price",
        url: `${BASE_URL}/v2/price?token_id=3375`,
        description: "Get Bitcoin price"
    },
    {
        name: "Trader Grades",
        url: `${BASE_URL}/v2/trader-grades?limit=5`,
        description: "Get trader grades"
    },
    {
        name: "Hourly OHLCV",
        url: `${BASE_URL}/v2/hourly-ohlcv?limit=5`,
        description: "Get hourly OHLCV data"
    },
    {
        name: "Daily OHLCV",
        url: `${BASE_URL}/v2/daily-ohlcv?limit=5`,
        description: "Get daily OHLCV data"
    },
    {
        name: "Investor Grades",
        url: `${BASE_URL}/v2/investor-grades?limit=5`,
        description: "Get investor grades"
    },
    {
        name: "Market Metrics",
        url: `${BASE_URL}/v2/market-metrics?limit=5`,
        description: "Get market metrics"
    },
    {
        name: "Trading Signals",
        url: `${BASE_URL}/v2/trading-signals?limit=5`,
        description: "Get trading signals"
    },
    {
        name: "AI Reports",
        url: `${BASE_URL}/v2/ai-reports?limit=5`,
        description: "Get AI reports"
    },
    {
        name: "Crypto Investors",
        url: `${BASE_URL}/v2/crypto-investors?limit=5`,
        description: "Get crypto investors"
    },
    {
        name: "Top Market Cap",
        url: `${BASE_URL}/v2/top-market-cap-tokens?top_k=5`,
        description: "Get top market cap tokens"
    },
    {
        name: "Resistance & Support",
        url: `${BASE_URL}/v2/resistance-support?limit=5`,
        description: "Get resistance and support levels"
    },
    {
        name: "Hourly Trading Signals",
        url: `${BASE_URL}/v2/hourly-trading-signals?limit=5`,
        description: "Get hourly trading signals"
    },
    {
        name: "Sentiment",
        url: `${BASE_URL}/v2/sentiments?limit=5`,
        description: "Get sentiment data"
    },
    {
        name: "Quantmetrics",
        url: `${BASE_URL}/v2/quantmetrics?limit=5`,
        description: "Get quantitative metrics"
    },
    {
        name: "Scenario Analysis",
        url: `${BASE_URL}/v2/scenario-analysis?limit=5`,
        description: "Get scenario analysis"
    },
    {
        name: "Correlation",
        url: `${BASE_URL}/v2/correlation?limit=5`,
        description: "Get correlation data"
    },
    {
        name: "Indices",
        url: `${BASE_URL}/v2/indices?limit=5`,
        description: "Get indices data"
    },
    {
        name: "Indices Holdings",
        url: `${BASE_URL}/v2/indices-holdings?id=1`,
        description: "Get indices holdings"
    },
    {
        name: "Indices Performance",
        url: `${BASE_URL}/v2/indices-performance?limit=5`,
        description: "Get indices performance"
    }
];

async function testEndpoint(endpoint) {
    try {
        console.log(`\n🧪 Testing ${endpoint.name}...`);
        console.log(`📡 URL: ${endpoint.url}`);
        
        const response = await fetch(endpoint.url, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        console.log(`📊 Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ ${endpoint.name} - SUCCESS`);
            console.log(`📈 Data length: ${Array.isArray(data) ? data.length : (data.data ? data.data.length : 'N/A')}`);
            
            // Show sample data structure
            if (Array.isArray(data) && data.length > 0) {
                console.log(`🔍 Sample keys: ${Object.keys(data[0]).slice(0, 5).join(', ')}`);
            } else if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                console.log(`🔍 Sample keys: ${Object.keys(data.data[0]).slice(0, 5).join(', ')}`);
            } else if (typeof data === 'object') {
                console.log(`🔍 Response keys: ${Object.keys(data).slice(0, 5).join(', ')}`);
            }
            
            return { success: true, endpoint: endpoint.name, data };
        } else {
            const errorText = await response.text();
            console.log(`❌ ${endpoint.name} - FAILED`);
            console.log(`💥 Error: ${errorText}`);
            return { success: false, endpoint: endpoint.name, error: errorText };
        }
    } catch (error) {
        console.log(`❌ ${endpoint.name} - ERROR`);
        console.log(`💥 Exception: ${error.message}`);
        return { success: false, endpoint: endpoint.name, error: error.message };
    }
}

async function testAllEndpoints() {
    console.log("🚀 Starting TokenMetrics API Endpoint Tests");
    console.log(`🔑 Using API Key: ${API_KEY.substring(0, 6)}...${API_KEY.substring(API_KEY.length - 4)}`);
    console.log(`🌐 Base URL: ${BASE_URL}`);
    console.log(`📊 Testing ${ENDPOINTS.length} endpoints...\n`);

    const results = [];
    
    for (const endpoint of ENDPOINTS) {
        const result = await testEndpoint(endpoint);
        results.push(result);
        
        // Small delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📋 TEST SUMMARY");
    console.log("=".repeat(60));
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successful.length}/${results.length}`);
    console.log(`❌ Failed: ${failed.length}/${results.length}`);
    
    if (successful.length > 0) {
        console.log("\n✅ Working Endpoints:");
        successful.forEach(r => console.log(`   • ${r.endpoint}`));
    }
    
    if (failed.length > 0) {
        console.log("\n❌ Failed Endpoints:");
        failed.forEach(r => console.log(`   • ${r.endpoint}: ${r.error}`));
    }
    
    console.log("\n🎯 Overall Success Rate:", `${Math.round((successful.length / results.length) * 100)}%`);
    
    return results;
}

// Run the tests
testAllEndpoints().catch(console.error); 
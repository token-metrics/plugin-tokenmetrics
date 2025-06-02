// Debug script to see actual API response structure
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.TOKENMETRICS_API_KEY;
const BASE_URL = 'https://api.tokenmetrics.com';

async function testApiResponses() {
    console.log('🔍 DEBUGGING API RESPONSES\n');
    
    const headers = {
        'x-api-key': API_KEY,
        'accept': 'application/json',
        'Content-Type': 'application/json'
    };
    
    // Test 1: Tokens endpoint
    try {
        console.log('1. Testing /v2/tokens endpoint...');
        const tokensResponse = await axios.get(`${BASE_URL}/v2/tokens?limit=2&category=defi`, { headers });
        console.log('Tokens Response Structure:', Object.keys(tokensResponse.data));
        if (tokensResponse.data.data && tokensResponse.data.data.length > 0) {
            console.log('First Token Fields:', Object.keys(tokensResponse.data.data[0]));
        }
        console.log('\n');
    } catch (error) {
        console.error('Tokens endpoint error:', error.response?.data || error.message);
    }
    
    // Test 2: Price endpoint with token_id
    try {
        console.log('2. Testing /v2/price endpoint with token_id=3375 (Bitcoin)...');
        const priceResponse = await axios.get(`${BASE_URL}/v2/price?token_id=3375`, { headers });
        console.log('Price Response Structure:', Object.keys(priceResponse.data));
        if (priceResponse.data.data && priceResponse.data.data.length > 0) {
            console.log('First Price Data Fields:', Object.keys(priceResponse.data.data[0]));
        }
        console.log('\n');
    } catch (error) {
        console.error('Price endpoint error:', error.response?.data || error.message);
    }
    
    // Test 3: Top Market Cap endpoint - detailed check
    try {
        console.log('3. Testing /v2/top-market-cap-tokens endpoint (detailed)...');
        const topMarketCapResponse = await axios.get(`${BASE_URL}/v2/top-market-cap-tokens?top_k=1&page=1`, { headers });
        console.log('Top Market Cap Response Structure:', Object.keys(topMarketCapResponse.data));
        if (topMarketCapResponse.data.data && topMarketCapResponse.data.data.length > 0) {
            console.log('First Top Token Fields:', Object.keys(topMarketCapResponse.data.data[0]));
            console.log('First Top Token Sample:', JSON.stringify(topMarketCapResponse.data.data[0], null, 2));
        }
        console.log('\n');
    } catch (error) {
        console.error('Top Market Cap endpoint error:', error.response?.data || error.message);
    }
}

testApiResponses().catch(console.error); 
// Debug script specifically for top market cap endpoint
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.TOKENMETRICS_API_KEY;
const BASE_URL = 'https://api.tokenmetrics.com';

async function debugTopMarketCap() {
    console.log('🔍 DEBUGGING TOP MARKET CAP ENDPOINT\n');
    
    const headers = {
        'x-api-key': API_KEY,
        'accept': 'application/json',
        'Content-Type': 'application/json'
    };
    
    // Test 1: With both top_k and page parameters (as expected by the action)
    try {
        console.log('1. Testing with top_k=5 and page=1...');
        const response1 = await axios.get(`${BASE_URL}/v2/top-market-cap-tokens?top_k=5&page=1`, { headers });
        console.log('Response Status:', response1.status);
        console.log('Response Structure:', Object.keys(response1.data));
        console.log('Full Response:', JSON.stringify(response1.data, null, 2));
        console.log('\n');
    } catch (error) {
        console.error('Test 1 Error:', error.response?.data || error.message);
        console.log('\n');
    }
    
    // Test 2: With only page parameter (as in your curl)
    try {
        console.log('2. Testing with only page=1...');
        const response2 = await axios.get(`${BASE_URL}/v2/top-market-cap-tokens?page=1`, { headers });
        console.log('Response Status:', response2.status);
        console.log('Response Structure:', Object.keys(response2.data));
        console.log('Full Response:', JSON.stringify(response2.data, null, 2));
        console.log('\n');
    } catch (error) {
        console.error('Test 2 Error:', error.response?.data || error.message);
        console.log('\n');
    }
    
    // Test 3: With default parameters (no params)
    try {
        console.log('3. Testing with no parameters...');
        const response3 = await axios.get(`${BASE_URL}/v2/top-market-cap-tokens`, { headers });
        console.log('Response Status:', response3.status);
        console.log('Response Structure:', Object.keys(response3.data));
        console.log('Full Response:', JSON.stringify(response3.data, null, 2));
        console.log('\n');
    } catch (error) {
        console.error('Test 3 Error:', error.response?.data || error.message);
        console.log('\n');
    }
    
    // Test 4: Test with text/plain accept header (as in your curl)
    try {
        console.log('4. Testing with text/plain accept header...');
        const headersTextPlain = {
            'x-api-key': API_KEY,
            'accept': 'text/plain'
        };
        const response4 = await axios.get(`${BASE_URL}/v2/top-market-cap-tokens?page=1`, { headers: headersTextPlain });
        console.log('Response Status:', response4.status);
        console.log('Response Type:', typeof response4.data);
        console.log('Response Data:', response4.data);
        console.log('\n');
    } catch (error) {
        console.error('Test 4 Error:', error.response?.data || error.message);
        console.log('\n');
    }
}

debugTopMarketCap().catch(console.error); 
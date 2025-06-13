#!/usr/bin/env node

/**
 * Debug script to test TokenMetrics Trader Grades API directly
 * This will help us understand the actual response format and fix the parsing issues
 */

const https = require('https');

// Hardcoded API key for testing phase
const API_KEY = 'tm-b7212f8d-1bcb-4c40-be3f-b4d1a4eeee72';
const BASE_URL = 'api.tokenmetrics.com';

if (!API_KEY) {
    console.error('❌ API key not available');
    process.exit(1);
}

/**
 * Make API call to TokenMetrics
 */
function callAPI(endpoint, params = {}) {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const path = queryString ? `${endpoint}?${queryString}` : endpoint;
        
        console.log(`🔍 Testing: https://${BASE_URL}${path}`);
        
        const options = {
            hostname: BASE_URL,
            path: path,
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
                'User-Agent': 'ElizaOS-TokenMetrics-Plugin/1.0'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        data: jsonData
                    });
                } catch (error) {
                    reject(new Error(`Failed to parse JSON: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

/**
 * Test different trader grades API calls
 */
async function testTraderGradesAPI() {
    console.log('🚀 Testing TokenMetrics Trader Grades API...\n');
    
    const tests = [
        {
            name: 'General Trader Grades (no filters)',
            endpoint: '/v2/trader-grades',
            params: { limit: 5 }
        },
        {
            name: 'Bitcoin by Symbol',
            endpoint: '/v2/trader-grades',
            params: { symbol: 'BTC', limit: 5 }
        },
        {
            name: 'Ethereum by Symbol',
            endpoint: '/v2/trader-grades',
            params: { symbol: 'ETH', limit: 5 }
        },
        {
            name: 'Bitcoin by Token ID (3375)',
            endpoint: '/v2/trader-grades',
            params: { token_id: 3375, limit: 5 }
        },
        {
            name: 'A-Grade Tokens Only',
            endpoint: '/v2/trader-grades',
            params: { grade: 'A', limit: 5 }
        },
        {
            name: 'DeFi Category',
            endpoint: '/v2/trader-grades',
            params: { category: 'defi', limit: 5 }
        }
    ];
    
    for (const test of tests) {
        console.log(`\n📋 Test: ${test.name}`);
        console.log(`🔗 Endpoint: ${test.endpoint}`);
        console.log(`📊 Params:`, test.params);
        
        try {
            const result = await callAPI(test.endpoint, test.params);
            
            console.log(`✅ Status: ${result.statusCode}`);
            
            if (result.statusCode === 200) {
                const data = result.data;
                console.log(`📦 Response structure:`, {
                    success: data.success,
                    message: data.message,
                    length: data.length,
                    dataType: Array.isArray(data.data) ? 'array' : typeof data.data,
                    dataLength: Array.isArray(data.data) ? data.data.length : 'N/A'
                });
                
                if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                    console.log(`🔍 First item structure:`, Object.keys(data.data[0]));
                    console.log(`📄 First item sample:`, data.data[0]);
                    
                    // Check for grade fields
                    const firstItem = data.data[0];
                    const gradeFields = Object.keys(firstItem).filter(key => 
                        key.toLowerCase().includes('grade') || 
                        key.toLowerCase().includes('score') ||
                        key.toLowerCase().includes('rating')
                    );
                    console.log(`🎯 Grade-related fields:`, gradeFields);
                } else {
                    console.log(`⚠️  No data items returned`);
                }
            } else {
                console.log(`❌ Error response:`, result.data);
            }
            
        } catch (error) {
            console.log(`❌ Request failed:`, error.message);
        }
        
        console.log('─'.repeat(80));
    }
}

// Run the tests
testTraderGradesAPI().catch(console.error); 
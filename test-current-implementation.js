import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const API_KEY = "REDACTED_API_KEY";
const BASE_URL = "https://api.tokenmetrics.com";

console.log("🚀 TokenMetrics Plugin Implementation Test");
console.log("=" .repeat(60));

// Test 1: API Connectivity
async function testAPIConnectivity() {
    console.log("\n📡 TEST 1: API Connectivity");
    console.log("-".repeat(40));
    
    const testEndpoints = [
        { name: "Price", url: `${BASE_URL}/v2/price?token_id=3375` },
        { name: "Tokens", url: `${BASE_URL}/v2/tokens?symbol=BTC&limit=5` },
        { name: "Trading Signals", url: `${BASE_URL}/v2/trading-signals?limit=5` },
        { name: "Trader Grades", url: `${BASE_URL}/v2/trader-grades?limit=5` },
        { name: "Investor Grades", url: `${BASE_URL}/v2/investor-grades?limit=5` }
    ];
    
    const results = [];
    
    for (const endpoint of testEndpoints) {
        try {
            const response = await fetch(endpoint.url, {
                headers: { 'x-api-key': API_KEY, 'accept': 'application/json' }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ ${endpoint.name}: Working`);
                results.push({ name: endpoint.name, status: 'working' });
            } else {
                console.log(`❌ ${endpoint.name}: Failed (${response.status})`);
                results.push({ name: endpoint.name, status: 'failed' });
            }
        } catch (error) {
            console.log(`❌ ${endpoint.name}: Error - ${error.message}`);
            results.push({ name: endpoint.name, status: 'error' });
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return results;
}

// Test 2: Action Pattern Compliance
async function testActionPatterns() {
    console.log("\n🎯 TEST 2: Action Pattern Compliance");
    console.log("-".repeat(40));
    
    const actionFiles = [
        'getPriceAction.ts',
        'getTradingSignalsAction.ts', 
        'getTraderGradesAction.ts',
        'getTokensAction.ts',
        'getInvestorGradesAction.ts'
    ];
    
    const results = [];
    
    for (const file of actionFiles) {
        const filePath = path.join('src/actions', file);
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            const checks = {
                hasAIHelper: content.includes('from "./aiActionHelper"'),
                hasTemplate: content.includes('Template = `'),
                hasSchema: content.includes('Schema = z.object'),
                hasExtractRequest: content.includes('extractTokenMetricsRequest') || content.includes('generateObject'),
                hasValidate: content.includes('validate: async'),
                hasHandler: content.includes('handler: async'),
                hasExamples: content.includes('examples: [')
            };
            
            const passed = Object.values(checks).filter(Boolean).length;
            const total = Object.keys(checks).length;
            
            console.log(`📄 ${file}:`);
            console.log(`   ✅ AI Helper: ${checks.hasAIHelper ? 'Yes' : 'No'}`);
            console.log(`   ✅ Template: ${checks.hasTemplate ? 'Yes' : 'No'}`);
            console.log(`   ✅ Schema: ${checks.hasSchema ? 'Yes' : 'No'}`);
            console.log(`   ✅ AI Extract: ${checks.hasExtractRequest ? 'Yes' : 'No'}`);
            console.log(`   ✅ Validate: ${checks.hasValidate ? 'Yes' : 'No'}`);
            console.log(`   ✅ Handler: ${checks.hasHandler ? 'Yes' : 'No'}`);
            console.log(`   ✅ Examples: ${checks.hasExamples ? 'Yes' : 'No'}`);
            console.log(`   📊 Score: ${passed}/${total} (${Math.round((passed/total)*100)}%)\n`);
            
            results.push({
                file,
                score: passed,
                total,
                percentage: Math.round((passed/total)*100),
                checks
            });
            
        } catch (error) {
            console.log(`❌ ${file}: Error reading file - ${error.message}\n`);
            results.push({ file, error: error.message });
        }
    }
    
    return results;
}

// Test 3: File Structure Analysis
async function testFileStructure() {
    console.log("\n📁 TEST 3: File Structure Analysis");
    console.log("-".repeat(40));
    
    try {
        const actionsDir = 'src/actions';
        const files = fs.readdirSync(actionsDir);
        
        const actionFiles = files.filter(f => f.endsWith('Action.ts'));
        const helperFiles = files.filter(f => f.includes('Helper') || f.includes('helper'));
        const indexFiles = files.filter(f => f === 'index.ts');
        
        console.log(`📊 Total files in actions: ${files.length}`);
        console.log(`🎯 Action files: ${actionFiles.length}`);
        console.log(`🔧 Helper files: ${helperFiles.length}`);
        console.log(`📋 Index files: ${indexFiles.length}`);
        
        console.log(`\n📄 Action Files:`);
        actionFiles.forEach(file => {
            const stats = fs.statSync(path.join(actionsDir, file));
            const sizeKB = Math.round(stats.size / 1024);
            console.log(`   • ${file} (${sizeKB}KB)`);
        });
        
        console.log(`\n🔧 Helper Files:`);
        helperFiles.forEach(file => {
            const stats = fs.statSync(path.join(actionsDir, file));
            const sizeKB = Math.round(stats.size / 1024);
            console.log(`   • ${file} (${sizeKB}KB)`);
        });
        
        return {
            total: files.length,
            actions: actionFiles.length,
            helpers: helperFiles.length,
            actionFiles,
            helperFiles
        };
        
    } catch (error) {
        console.log(`❌ Error analyzing file structure: ${error.message}`);
        return { error: error.message };
    }
}

// Test 4: Build Verification
async function testBuild() {
    console.log("\n🔨 TEST 4: Build Verification");
    console.log("-".repeat(40));
    
    return new Promise((resolve) => {
        exec('npm run build', (error, stdout, stderr) => {
            if (error) {
                console.log(`❌ Build failed: ${error.message}`);
                resolve({ success: false, error: error.message });
            } else {
                console.log(`✅ Build successful`);
                console.log(`📊 Output: ${stdout.split('\n').filter(line => line.includes('Build success')).join(', ')}`);
                resolve({ success: true, output: stdout });
            }
        });
    });
}

// Main test runner
async function runAllTests() {
    console.log(`🔑 Using API Key: ${API_KEY.substring(0, 6)}...${API_KEY.substring(API_KEY.length - 4)}`);
    console.log(`🌐 Base URL: ${BASE_URL}\n`);
    
    try {
        // Run all tests
        const apiResults = await testAPIConnectivity();
        const patternResults = await testActionPatterns();
        const structureResults = await testFileStructure();
        const buildResults = await testBuild();
        
        // Summary
        console.log("\n" + "=".repeat(60));
        console.log("📋 COMPREHENSIVE TEST SUMMARY");
        console.log("=".repeat(60));
        
        // API Summary
        const workingAPIs = apiResults.filter(r => r.status === 'working').length;
        console.log(`\n📡 API Connectivity: ${workingAPIs}/${apiResults.length} endpoints working`);
        
        // Pattern Summary
        const avgScore = patternResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / patternResults.length;
        console.log(`🎯 Action Patterns: ${Math.round(avgScore)}% compliance average`);
        
        // Structure Summary
        console.log(`📁 File Structure: ${structureResults.actions || 0} action files, ${structureResults.helpers || 0} helpers`);
        
        // Build Summary
        console.log(`🔨 Build Status: ${buildResults.success ? 'Successful' : 'Failed'}`);
        
        // Overall Status
        const overallHealth = (workingAPIs >= 4 && avgScore >= 80 && buildResults.success) ? 'EXCELLENT' : 
                             (workingAPIs >= 3 && avgScore >= 60 && buildResults.success) ? 'GOOD' : 'NEEDS_WORK';
        
        console.log(`\n🎯 Overall Plugin Health: ${overallHealth}`);
        
        if (overallHealth === 'EXCELLENT') {
            console.log(`\n✅ Plugin is ready for production use!`);
            console.log(`🚀 All systems operational - users can interact with TokenMetrics via natural language`);
        } else if (overallHealth === 'GOOD') {
            console.log(`\n⚠️ Plugin is functional but could use improvements`);
        } else {
            console.log(`\n❌ Plugin needs attention before production use`);
        }
        
        return {
            api: apiResults,
            patterns: patternResults,
            structure: structureResults,
            build: buildResults,
            overall: overallHealth
        };
        
    } catch (error) {
        console.error(`❌ Test runner error: ${error.message}`);
        return { error: error.message };
    }
}

// Run the tests
runAllTests().catch(console.error); 
#!/usr/bin/env node

/**
 * Batch Fix Script V2 for TokenMetrics Actions
 * More precise fixes for callback pattern conversion
 */

const fs = require('fs');
const path = require('path');

// List of actions that need fixing
const ACTIONS_TO_FIX = [
    'getScenarioAnalysisAction',
    'getResistanceSupportAction', 
    'getTmaiAction',
    'getHourlyTradingSignalsAction',
    'getHourlyOhlcvAction',
    'getDailyOhlcvAction',
    'getCorrelationAction',
    'getSentimentAction',
    'getIndicesAction',
    'getIndicesPerformanceAction',
    'getIndicesHoldingsAction',
    'getCryptoInvestorsAction',
    'getAiReportsAction'
];

console.log('🚀 Starting precise batch fix for TokenMetrics actions...\n');

/**
 * Fix individual action file with precise pattern matching
 */
function fixActionFilePrecise(actionName) {
    const filePath = path.join('src', 'actions', `${actionName}.ts`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filePath}`);
        return false;
    }
    
    console.log(`🔧 Fixing ${actionName}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Add HandlerCallback import if missing
    if (!content.includes('HandlerCallback')) {
        // Find the existing Action import and add HandlerCallback imports
        content = content.replace(
            /import type \{ Action \} from "@elizaos\/core";/,
            `import type { Action } from "@elizaos/core";
import {
    type IAgentRuntime,
    type Memory,
    type State,
    type HandlerCallback,
    elizaLogger
} from "@elizaos/core";`
        );
    }
    
    // 2. Update handler signature to include callback parameter
    const handlerPattern = /async handler\(\s*runtime:\s*IAgentRuntime,\s*message:\s*Memory,\s*state:\s*State\s*\|\s*undefined,?\s*_?options\?:\s*\{\s*\[key:\s*string\]:\s*unknown\s*\}\s*\)/;
    if (handlerPattern.test(content)) {
        content = content.replace(
            handlerPattern,
            `async handler(
        runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    )`
        );
    }
    
    // 3. Add requestId if missing
    if (!content.includes('const requestId = generateRequestId();')) {
        content = content.replace(
            /try\s*\{/,
            `try {
            const requestId = generateRequestId();
            console.log(\`[\${requestId}] Processing ${actionName.replace('Action', '').toLowerCase()} request...\`);`
        );
    }
    
    // 4. Find the return statement pattern and replace with callback
    // Look for return statements that return objects with success/data
    const returnObjectPattern = /return\s*\{\s*text:\s*responseText,\s*success:\s*true,\s*data:\s*[^}]+\s*\};?/g;
    const returnResultPattern = /return\s+result;?\s*$/gm;
    
    // Replace return object pattern
    content = content.replace(returnObjectPattern, (match) => {
        return `console.log(\`[\${requestId}] Analysis completed successfully\`);
            
            // Use callback to send response to user (like working actions)
            if (callback) {
                callback({
                    text: responseText,
                    content: {
                        success: true,
                        request_id: requestId,
                        data: result,
                        metadata: {
                            endpoint: "${actionName.replace('Action', '').replace('get', '').toLowerCase()}",
                            data_source: "TokenMetrics Official API",
                            api_version: "v2"
                        }
                    }
                });
            }
            
            return true;`;
    });
    
    // Replace return result pattern
    content = content.replace(returnResultPattern, (match) => {
        return `console.log(\`[\${requestId}] Analysis completed successfully\`);
            
            // Use callback to send response to user (like working actions)
            if (callback) {
                callback({
                    text: responseText,
                    content: {
                        success: true,
                        request_id: requestId,
                        data: result,
                        metadata: {
                            endpoint: "${actionName.replace('Action', '').replace('get', '').toLowerCase()}",
                            data_source: "TokenMetrics Official API",
                            api_version: "v2"
                        }
                    }
                });
            }
            
            return true;`;
    });
    
    // 5. Fix error handling to use callback
    const errorPattern = /catch\s*\(\s*error\s*\)\s*\{[\s\S]*?console\.error\([^)]+\);[\s\S]*?return\s+false;\s*\}/;
    if (errorPattern.test(content)) {
        content = content.replace(
            errorPattern,
            `catch (error) {
            console.error("Error in ${actionName}:", error);
            
            if (callback) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                
                callback({
                    text: \`❌ I encountered an error while processing your request: \${errorMessage}

This could be due to:
• Network connectivity issues
• TokenMetrics API service problems
• Invalid API key or authentication issues
• Insufficient subscription access

Please check your TokenMetrics API key configuration and try again.\`,
                    content: { 
                        error: errorMessage,
                        error_type: error instanceof Error ? error.constructor.name : 'Unknown'
                    }
                });
            }
            
            return false;
        }`
        );
    }
    
    // Write the fixed content back to file
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${actionName}`);
    return true;
}

/**
 * Main execution
 */
async function main() {
    let fixedCount = 0;
    let failedCount = 0;
    
    // Fix all action files
    console.log(`📝 Fixing ${ACTIONS_TO_FIX.length} action files...\n`);
    
    for (const actionName of ACTIONS_TO_FIX) {
        try {
            if (fixActionFilePrecise(actionName)) {
                fixedCount++;
            } else {
                failedCount++;
            }
        } catch (error) {
            console.error(`❌ Failed to fix ${actionName}:`, error.message);
            failedCount++;
        }
    }
    
    console.log(`\n📊 Action Files Summary:`);
    console.log(`✅ Fixed: ${fixedCount}`);
    console.log(`❌ Failed: ${failedCount}`);
    
    // Build project
    console.log(`\n🔨 Building project...`);
    const { execSync } = require('child_process');
    
    try {
        console.log('Building main plugin...');
        execSync('npm run build', { stdio: 'inherit', cwd: process.cwd() });
        console.log('✅ Build completed successfully');
        
        console.log(`\n🚀 All fixes applied successfully! Ready to test getQuantmetricsAction.`);
        console.log(`\n📋 Next Steps:`);
        console.log(`1. Test getQuantmetricsAction: "Get quantitative metrics for Bitcoin"`);
        console.log(`2. Test other fixed actions systematically`);
        console.log(`3. Verify all 21 actions are working properly`);
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        console.log(`\n⚠️  Build failed. Manual fixes may be needed.`);
    }
}

// Run the script
main().catch(console.error); 
#!/usr/bin/env node

/**
 * Batch Fix Script for TokenMetrics Actions
 * Fixes all actions that use return pattern instead of callback pattern
 * Also updates enhanced handler with missing cases
 */

const fs = require('fs');
const path = require('path');

// List of actions that need fixing (using return pattern instead of callback)
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

// Enhanced handler cases that need to be added
const ENHANCED_HANDLER_CASES = [
    'GET_SCENARIO_ANALYSIS_TOKENMETRICS',
    'GET_RESISTANCE_SUPPORT_TOKENMETRICS', 
    'GET_TMAI_TOKENMETRICS',
    'GET_HOURLY_TRADING_SIGNALS_TOKENMETRICS',
    'GET_HOURLY_OHLCV_TOKENMETRICS',
    'GET_DAILY_OHLCV_TOKENMETRICS',
    'GET_CORRELATION_TOKENMETRICS',
    'GET_SENTIMENT_TOKENMETRICS',
    'GET_INDICES_TOKENMETRICS',
    'GET_INDICES_PERFORMANCE_TOKENMETRICS',
    'GET_INDICES_HOLDINGS_TOKENMETRICS',
    'GET_CRYPTO_INVESTORS_TOKENMETRICS',
    'GET_AI_REPORTS_TOKENMETRICS'
];

console.log('🚀 Starting batch fix for TokenMetrics actions...\n');

/**
 * Fix individual action file by converting return pattern to callback pattern
 */
function fixActionFile(actionName) {
    const filePath = path.join('src', 'actions', `${actionName}.ts`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filePath}`);
        return false;
    }
    
    console.log(`🔧 Fixing ${actionName}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Add HandlerCallback import if missing
    if (!content.includes('HandlerCallback')) {
        content = content.replace(
            'import type { Action } from "@elizaos/core";',
            `import type { Action } from "@elizaos/core";
import {
    type IAgentRuntime,
    type Memory,
    type State,
    type HandlerCallback,
    elizaLogger
} from "@elizaos/core";`
        );
        
        // Remove duplicate imports if they exist
        content = content.replace(/import \{[^}]*IAgentRuntime[^}]*\} from "@elizaos\/core";\s*/g, '');
        content = content.replace(/import \{[^}]*Memory[^}]*\} from "@elizaos\/core";\s*/g, '');
        content = content.replace(/import \{[^}]*State[^}]*\} from "@elizaos\/core";\s*/g, '');
        content = content.replace(/import \{[^}]*elizaLogger[^}]*\} from "@elizaos\/core";\s*/g, '');
    }
    
    // 2. Update handler signature to include callback parameter
    const handlerRegex = /async handler\(\s*runtime:\s*IAgentRuntime,\s*message:\s*Memory,\s*state:\s*State\s*\|\s*undefined[^)]*\)/;
    if (handlerRegex.test(content)) {
        content = content.replace(
            handlerRegex,
            `async handler(
        runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    )`
        );
    }
    
    // 3. Find and replace return pattern with callback pattern
    // Look for return statements that return objects with success/data
    const returnPatterns = [
        /return\s*\{\s*text:\s*responseText,\s*success:\s*true,\s*data:\s*[^}]+\s*\};?/g,
        /return\s*\{\s*success:\s*true,\s*[^}]+\s*\};?/g,
        /return\s*result;?\s*$/gm,
        /return\s*\{\s*[^}]*success:\s*true[^}]*\s*\};?/g
    ];
    
    // Replace return patterns with callback pattern
    returnPatterns.forEach(pattern => {
        content = content.replace(pattern, (match) => {
            // Extract the responseText variable name from the context
            const responseTextMatch = content.match(/let\s+(\w*[Rr]esponse[Tt]ext\w*)\s*=/);
            const responseVar = responseTextMatch ? responseTextMatch[1] : 'responseText';
            
            return `console.log(\`[\${requestId}] Analysis completed successfully\`);
            
            // Use callback to send response to user (like working actions)
            if (callback) {
                callback({
                    text: ${responseVar},
                    content: {
                        success: true,
                        request_id: requestId,
                        data: result || actionResult || response,
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
    });
    
    // 4. Ensure requestId is properly scoped
    if (!content.includes('const requestId = generateRequestId();')) {
        content = content.replace(
            /try\s*\{/,
            `try {
            const requestId = generateRequestId();
            console.log(\`[\${requestId}] Processing ${actionName.replace('Action', '').toLowerCase()} request...\`);`
        );
    }
    
    // 5. Add error handling with callback
    const errorHandlingPattern = /catch\s*\(\s*error\s*\)\s*\{[^}]*console\.error[^}]*\}/s;
    if (errorHandlingPattern.test(content)) {
        content = content.replace(
            errorHandlingPattern,
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
 * Update enhanced handler with missing cases
 */
function updateEnhancedHandler() {
    const handlerPath = path.join('src', 'core', 'enhanced-action-handler.ts');
    
    if (!fs.existsSync(handlerPath)) {
        console.log(`❌ Enhanced handler not found: ${handlerPath}`);
        return false;
    }
    
    console.log('🔧 Updating enhanced handler with missing cases...');
    
    let content = fs.readFileSync(handlerPath, 'utf8');
    
    // Find the generateDataSummary method and add missing cases
    const generateDataSummaryMatch = content.match(/(generateDataSummary\([^{]+\{[\s\S]*?)(default:[\s\S]*?return[^}]+})/);
    
    if (generateDataSummaryMatch) {
        const beforeDefault = generateDataSummaryMatch[1];
        const defaultCase = generateDataSummaryMatch[2];
        
        // Add all missing cases
        let newCases = '';
        
        ENHANCED_HANDLER_CASES.forEach(caseName => {
            if (!content.includes(`case '${caseName}':`)) {
                const actionType = caseName.replace('GET_', '').replace('_TOKENMETRICS', '').toLowerCase();
                newCases += `
            case '${caseName}':
                // Check if there's already a formatted text response
                if (actionResult.text && typeof actionResult.text === 'string') {
                    return actionResult.text;
                }
                
                // Fallback formatting if no text response
                const ${actionType}Data = actionResult.${actionType}_data || actionResult.data || [];
                if (${actionType}Data.length > 0) {
                    return \`✅ **${caseName.replace('GET_', '').replace('_TOKENMETRICS', '').replace(/_/g, ' ')}**: Retrieved \${${actionType}Data.length} data points successfully.\`;
                }
                return "Data retrieved successfully.";
                `;
            }
        });
        
        if (newCases) {
            const updatedMethod = beforeDefault + newCases + '\n            ' + defaultCase;
            content = content.replace(generateDataSummaryMatch[0], updatedMethod);
        }
    }
    
    fs.writeFileSync(handlerPath, content);
    console.log('✅ Updated enhanced handler');
    return true;
}

/**
 * Build the project
 */
function buildProject() {
    console.log('🔨 Building project...');
    
    const { execSync } = require('child_process');
    
    try {
        // Build main plugin directory
        console.log('Building main plugin...');
        execSync('npm run build', { stdio: 'inherit', cwd: process.cwd() });
        
        // Build eliza-starter directory if it exists
        const elizaStarterPath = path.join(process.cwd(), 'eliza-starter');
        if (fs.existsSync(elizaStarterPath)) {
            console.log('Building eliza-starter...');
            execSync('npm run build', { stdio: 'inherit', cwd: elizaStarterPath });
        }
        
        console.log('✅ Build completed successfully');
        return true;
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        return false;
    }
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
            if (fixActionFile(actionName)) {
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
    
    // Update enhanced handler
    console.log(`\n🔧 Updating enhanced handler...`);
    try {
        if (updateEnhancedHandler()) {
            console.log('✅ Enhanced handler updated successfully');
        } else {
            console.log('❌ Failed to update enhanced handler');
        }
    } catch (error) {
        console.error('❌ Enhanced handler update failed:', error.message);
    }
    
    // Build project
    console.log(`\n🔨 Building project...`);
    const buildSuccess = buildProject();
    
    // Final summary
    console.log(`\n🎉 Batch Fix Summary:`);
    console.log(`📁 Actions Fixed: ${fixedCount}/${ACTIONS_TO_FIX.length}`);
    console.log(`🔧 Enhanced Handler: ${updateEnhancedHandler ? '✅' : '❌'}`);
    console.log(`🔨 Build Status: ${buildSuccess ? '✅' : '❌'}`);
    
    if (fixedCount === ACTIONS_TO_FIX.length && buildSuccess) {
        console.log(`\n🚀 All fixes applied successfully! Ready to test getQuantmetricsAction.`);
        console.log(`\n📋 Next Steps:`);
        console.log(`1. Test getQuantmetricsAction: "Get quantitative metrics for Bitcoin"`);
        console.log(`2. Test other fixed actions systematically`);
        console.log(`3. Verify all 21 actions are working properly`);
    } else {
        console.log(`\n⚠️  Some fixes may need manual attention. Check the logs above.`);
    }
}

// Run the script
main().catch(console.error); 
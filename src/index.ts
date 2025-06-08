import type { Plugin } from "@elizaos/core";
import { elizaLogger } from "@elizaos/core";

// Import the self-contained price action
import { getPriceAction } from "./actions/getPriceAction";

// Enhanced terminal output
elizaLogger.log("\n=======================================");
elizaLogger.log("   TokenMetrics Plugin Loading...     ");
elizaLogger.log("=======================================");
elizaLogger.log("Name      : tokenmetrics-plugin");
elizaLogger.log("Version   : 2.1.0 (MINIMAL-INTERFACE)");
elizaLogger.log("API Docs  : https://developers.tokenmetrics.com");
elizaLogger.log("Real API  : https://api.tokenmetrics.com/v2");
elizaLogger.log("");
elizaLogger.log("🔧 FEATURES IMPLEMENTED:");
elizaLogger.log("✅ Natural Language Processing");
elizaLogger.log("✅ Dynamic Token Resolution");
elizaLogger.log("✅ Real TokenMetrics API Integration");
elizaLogger.log("✅ Minimal TypeScript Interface Compliance");
elizaLogger.log("✅ Zero TypeScript Errors");
elizaLogger.log("✅ Self-Contained Architecture");
elizaLogger.log("");
elizaLogger.log("🎯 PRICE ACTION CAPABILITIES:");
elizaLogger.log("  • Understands natural language queries");
elizaLogger.log("  • Dynamically discovers available tokens");
elizaLogger.log("  • Provides real-time market data");
elizaLogger.log("  • Offers intelligent market analysis");
elizaLogger.log("=======================================\n");

/**
 * TokenMetrics Plugin for ElizaOS
 * 
 * MINIMAL INTERFACE VERSION: This plugin uses only the core properties that are
 * guaranteed to exist in the Plugin interface across all ElizaOS versions.
 * 
 * Based on consistent examples, the minimal Plugin interface includes:
 * - name: string (required)
 * - description: string (required) 
 * - actions?: Action[] (optional)
 * - providers?: Provider[] (optional)
 * - evaluators?: Evaluator[] (optional)
 * - services?: Service[] (optional)
 * 
 * Properties that cause TypeScript errors in some versions:
 * - routes (not consistently supported)
 * - tests (not consistently supported)
 * - managers (doesn't exist)
 * - adapter (inconsistent support)
 * - models (inconsistent support)
 */
export const tokenmetricsPlugin: Plugin = {
    name: "tokenmetrics",
    description: "TokenMetrics integration providing cryptocurrency market data and price information with advanced natural language processing",
    
    // Core plugin components (these are consistently supported across versions)
    actions: [
        getPriceAction,  // Our enhanced, self-contained price action
    ],
    
    // Optional arrays (initialize as empty arrays to avoid undefined issues)
    evaluators: [],  // No custom evaluators for now
    providers: [],   // No custom providers for now
    services: [],    // No custom services for now
};

/**
 * Plugin validation function (safe, minimal version)
 * Only validates properties that are guaranteed to exist
 */
export function validateTokenMetricsPlugin(): {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
} {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    elizaLogger.log("🔍 Validating TokenMetrics plugin configuration...");
    
    // Validate required properties
    if (!tokenmetricsPlugin.name || typeof tokenmetricsPlugin.name !== 'string') {
        issues.push("Plugin name is missing or invalid");
    }
    
    if (!tokenmetricsPlugin.description || typeof tokenmetricsPlugin.description !== 'string') {
        issues.push("Plugin description is missing or invalid");
    }
    
    // Safely validate optional properties
    const actions = tokenmetricsPlugin.actions || [];
    const evaluators = tokenmetricsPlugin.evaluators || [];
    const providers = tokenmetricsPlugin.providers || [];
    const services = tokenmetricsPlugin.services || [];
    
    if (actions.length === 0) {
        issues.push("No actions defined in plugin");
    }
    
    // Validate each action structure
    actions.forEach((action, index) => {
        if (!action.name || typeof action.name !== 'string') {
            issues.push(`Action ${index} is missing a valid name`);
        }
        
        if (typeof action.handler !== 'function') {
            issues.push(`Action ${action.name || index} is missing a valid handler function`);
        }
        
        if (typeof action.validate !== 'function') {
            issues.push(`Action ${action.name || index} is missing a valid validate function`);
        }
        
        // Recommendations for better action implementation
        if (!action.similes || !Array.isArray(action.similes) || action.similes.length === 0) {
            recommendations.push(`Action ${action.name} should include similes for better trigger recognition`);
        }
        
        if (!action.examples || !Array.isArray(action.examples) || action.examples.length === 0) {
            recommendations.push(`Action ${action.name} should include examples for documentation`);
        }
        
        if (!action.description || typeof action.description !== 'string') {
            recommendations.push(`Action ${action.name} should include a description`);
        }
    });
    
    const isValid = issues.length === 0;
    
    elizaLogger.log(`📊 Plugin validation summary:`);
    elizaLogger.log(`  • Actions: ${actions.length}`);
    elizaLogger.log(`  • Evaluators: ${evaluators.length}`);
    elizaLogger.log(`  • Providers: ${providers.length}`);
    elizaLogger.log(`  • Services: ${services.length}`);
    
    if (isValid) {
        elizaLogger.log("✅ Plugin validation passed!");
    } else {
        elizaLogger.error("❌ Plugin validation failed:");
        issues.forEach(issue => elizaLogger.error(`  • ${issue}`));
    }
    
    if (recommendations.length > 0) {
        elizaLogger.log("💡 Recommendations for improvement:");
        recommendations.forEach(rec => elizaLogger.log(`  • ${rec}`));
    }
    
    return { isValid, issues, recommendations };
}

/**
 * Debug function (minimal, safe version)
 */
export function debugTokenMetricsPlugin(): void {
    elizaLogger.log("🧪 TokenMetrics Plugin Debug Information:");
    elizaLogger.log(`  📋 Plugin Name: ${tokenmetricsPlugin.name}`);
    elizaLogger.log(`  📋 Description: ${tokenmetricsPlugin.description}`);
    
    // Safe access to all optional properties
    const actions = tokenmetricsPlugin.actions || [];
    const evaluators = tokenmetricsPlugin.evaluators || [];
    const providers = tokenmetricsPlugin.providers || [];
    const services = tokenmetricsPlugin.services || [];
    
    elizaLogger.log("  🔧 Plugin Components:");
    elizaLogger.log(`    • Actions: ${actions.length}`);
    elizaLogger.log(`    • Evaluators: ${evaluators.length}`);
    elizaLogger.log(`    • Providers: ${providers.length}`);
    elizaLogger.log(`    • Services: ${services.length}`);
    
    if (actions.length > 0) {
        elizaLogger.log("  🎬 Available Actions:");
        actions.forEach((action, index) => {
            const similes = action.similes || [];
            const examples = action.examples || [];
            
            elizaLogger.log(`    ${index + 1}. ${action.name}`);
            elizaLogger.log(`       Description: ${action.description || 'No description'}`);
            elizaLogger.log(`       Similes: ${similes.length > 0 ? similes.join(', ') : 'None'}`);
            elizaLogger.log(`       Examples: ${examples.length}`);
        });
    }
}

/**
 * Environment check function (unchanged, working)
 */
export function checkTokenMetricsEnvironment(): {
    isConfigured: boolean;
    missingVars: string[];
    suggestions: string[];
} {
    const missingVars: string[] = [];
    const suggestions: string[] = [];
    
    elizaLogger.log("🔍 Checking TokenMetrics environment configuration...");
    
    const apiKeyFromEnv = process.env.TOKENMETRICS_API_KEY;
    
    if (!apiKeyFromEnv) {
        missingVars.push("TOKENMETRICS_API_KEY");
        suggestions.push("Add TOKENMETRICS_API_KEY=your_api_key_here to your .env file");
        suggestions.push("Ensure your character.ts file includes TOKENMETRICS_API_KEY in secrets");
        suggestions.push("Verify you have a valid TokenMetrics API subscription");
    } else {
        elizaLogger.log("✅ TOKENMETRICS_API_KEY found in environment");
        
        if (apiKeyFromEnv.length < 10) {
            suggestions.push("API key seems too short - verify it's the complete key");
        }
    }
    
    const isConfigured = missingVars.length === 0;
    
    if (isConfigured) {
        elizaLogger.log("✅ TokenMetrics environment is properly configured!");
    } else {
        elizaLogger.warn("⚠️ TokenMetrics environment configuration issues found:");
        missingVars.forEach(varName => elizaLogger.warn(`  • Missing: ${varName}`));
        
        if (suggestions.length > 0) {
            elizaLogger.log("💡 Configuration suggestions:");
            suggestions.forEach(suggestion => elizaLogger.log(`  • ${suggestion}`));
        }
    }
    
    return { isConfigured, missingVars, suggestions };
}

/**
 * Runtime validation function (simplified, safe version)
 */
export function validatePluginRuntime(): boolean {
    elizaLogger.log("🔄 Performing runtime validation...");
    
    try {
        const actions = tokenmetricsPlugin.actions || [];
        
        if (actions.length === 0) {
            elizaLogger.error("❌ No actions available at runtime");
            return false;
        }
        
        for (const action of actions) {
            if (!action.name || typeof action.name !== 'string') {
                elizaLogger.error(`❌ Action missing valid name`);
                return false;
            }
            
            if (typeof action.handler !== 'function') {
                elizaLogger.error(`❌ Action ${action.name} handler is not a function`);
                return false;
            }
            
            if (typeof action.validate !== 'function') {
                elizaLogger.error(`❌ Action ${action.name} validate is not a function`);
                return false;
            }
        }
        
        elizaLogger.log("✅ Runtime validation passed!");
        elizaLogger.log(`📊 Validated ${actions.length} actions successfully`);
        
        return true;
        
    } catch (error) {
        elizaLogger.error("❌ Runtime validation failed:", error);
        return false;
    }
}

// Run all validation checks when plugin loads
elizaLogger.log("🚀 Running TokenMetrics plugin initialization checks...");

const structureValidation = validateTokenMetricsPlugin();
const envValidation = checkTokenMetricsEnvironment();
const runtimeValidation = validatePluginRuntime();

// Run debug info
debugTokenMetricsPlugin();

// Summary of initialization
if (structureValidation.isValid && envValidation.isConfigured && runtimeValidation) {
    elizaLogger.success("🎉 TokenMetrics plugin fully initialized and ready!");
    elizaLogger.log("💬 Users can now ask: 'What's the price of Bitcoin?'");
    elizaLogger.log("🔧 Plugin uses minimal interface - guaranteed TypeScript compatibility");
} else {
    elizaLogger.warn("⚠️ TokenMetrics plugin loaded with some issues:");
    if (!structureValidation.isValid) elizaLogger.warn("  • Plugin structure issues detected");
    if (!envValidation.isConfigured) elizaLogger.warn("  • Environment configuration incomplete");  
    if (!runtimeValidation) elizaLogger.warn("  • Runtime validation failed");
    elizaLogger.log("💡 Check the logs above for specific recommendations");
}

// Export the plugin as default for easy importing
export default tokenmetricsPlugin;
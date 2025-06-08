import { Plugin } from '@elizaos/core';

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
declare const tokenmetricsPlugin: Plugin;
/**
 * Plugin validation function (safe, minimal version)
 * Only validates properties that are guaranteed to exist
 */
declare function validateTokenMetricsPlugin(): {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
};
/**
 * Debug function (minimal, safe version)
 */
declare function debugTokenMetricsPlugin(): void;
/**
 * Environment check function (unchanged, working)
 */
declare function checkTokenMetricsEnvironment(): {
    isConfigured: boolean;
    missingVars: string[];
    suggestions: string[];
};
/**
 * Runtime validation function (simplified, safe version)
 */
declare function validatePluginRuntime(): boolean;

export { checkTokenMetricsEnvironment, debugTokenMetricsPlugin, tokenmetricsPlugin as default, tokenmetricsPlugin, validatePluginRuntime, validateTokenMetricsPlugin };

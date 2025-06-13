import { IAgentRuntime, Memory, State, Plugin } from '@elizaos/core';
import { z } from 'zod';

/**
 * Enhanced API key validation with better error reporting
 */
declare function validateAndGetApiKey(runtime: IAgentRuntime): string;
/**
 * Generic AI extraction function for TokenMetrics actions
 */
declare function extractTokenMetricsRequest<T>(runtime: IAgentRuntime, message: Memory, state: State, template: string, schema: z.ZodSchema<T>, requestId: string): Promise<T>;
/**
 * Generic TokenMetrics API call function
 */
declare function callTokenMetricsAPI(endpoint: string, params: Record<string, any>, runtime: IAgentRuntime): Promise<any>;
/**
 * Format currency values
 */
declare function formatCurrency(value: number | undefined | null): string;
/**
 * Format percentage values
 */
declare function formatPercentage(value: number | undefined | null): string;
/**
 * Generate unique request ID for cache busting
 */
declare function generateRequestId(): string;
/**
 * Common token symbol mapping
 */
declare function mapSymbolToName(input: string): string;
/**
 * Common token ID mapping for major cryptocurrencies
 * @deprecated This function uses hardcoded token IDs which may become outdated.
 * Use resolveTokenSmart() instead for dynamic API-based token resolution.
 */
declare function getWellKnownTokenId(input: string): number | null;
/**
 * Smart token resolution using TokenMetrics API (Pure API-based approach with search parameters)
 */
declare function resolveTokenSmart(input: string, runtime: IAgentRuntime): Promise<any | null>;

/**
 * TokenMetrics Plugin for ElizaOS
 *
 * COMPLETE AI INTEGRATION VERSION: This plugin includes all 22 TokenMetrics
 * actions updated with the shared AI helper pattern for natural language
 * processing and dynamic API interaction.
 *
 * All actions support:
 * - Natural language request processing
 * - Smart token resolution by name
 * - Analysis type-specific insights
 * - Real-time API data fetching
 * - Comprehensive error handling
 * - Request ID tracking for debugging
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

export { callTokenMetricsAPI, checkTokenMetricsEnvironment, debugTokenMetricsPlugin, tokenmetricsPlugin as default, extractTokenMetricsRequest, formatCurrency, formatPercentage, generateRequestId, getWellKnownTokenId, mapSymbolToName, resolveTokenSmart, tokenmetricsPlugin, validateAndGetApiKey, validatePluginRuntime, validateTokenMetricsPlugin };

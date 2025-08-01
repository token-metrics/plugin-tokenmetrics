import {
    type IAgentRuntime,
    type Memory,
    type State,
    elizaLogger,
    composePromptFromState,
    ModelType,
    parseKeyValueXml
} from "@elizaos/core";
import { z } from "zod";

// Common constants
const API_TIMEOUT = 10000; // 10 seconds timeout
const MAX_RETRIES = 3;

/**
 * Enhanced API key validation with better error reporting
 */
export function validateAndGetApiKey(runtime: IAgentRuntime): string {
    elizaLogger.log("🔐 Validating TokenMetrics API key...");
    
    // First try to get from runtime settings (environment variable)
    let apiKey = runtime.getSetting("TOKENMETRICS_API_KEY");
    
    elizaLogger.log(`🔍 Runtime getSetting result:`, {
        value: apiKey,
        type: typeof apiKey,
        length: apiKey ? apiKey.length : 'N/A',
        isEmpty: apiKey === '',
        isNull: apiKey === null,
        isUndefined: apiKey === undefined
    });
    
    // If not found in runtime settings, use hardcoded fallback for testing
    if (!apiKey || apiKey === '' || apiKey === 'undefined') {
        elizaLogger.warn("❌ TOKENMETRICS_API_KEY not found or empty in runtime settings");
        elizaLogger.log("💡 Falling back to hardcoded API key for testing...");
        
        const HARDCODED_API_KEY = "process.env.TOKENMETRICS_API_KEY";
        apiKey = HARDCODED_API_KEY;
        elizaLogger.log("✅ Using hardcoded API key for testing");
    } else {
        elizaLogger.log("✅ Using API key from runtime settings");
    }
    
    if (typeof apiKey !== 'string' || apiKey.length < 10) {
        elizaLogger.error("❌ TOKENMETRICS_API_KEY appears to be invalid (too short or wrong type)");
        throw new Error("TokenMetrics API key appears to be invalid");
    }
    
    elizaLogger.log(`✅ Final API key: ${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`);
    return apiKey;
}

/**
 * Enhanced fetch with retry logic and better error handling
 */
export async function fetchWithRetry(url: string, options: RequestInit, maxRetries: number = MAX_RETRIES): Promise<Response> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            elizaLogger.log(`📡 API Request attempt ${attempt}/${maxRetries}: ${url}`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
            
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            elizaLogger.log(`📊 API Response: ${response.status} ${response.statusText}`);
            
            if (response.ok) {
                return response;
            }
            
            // Log response details for debugging
            const responseText = await response.text();
            elizaLogger.error(`❌ API Error ${response.status}: ${responseText}`);
            
            if (response.status === 401) {
                throw new Error("Invalid API key - check your TOKENMETRICS_API_KEY");
            } else if (response.status === 429) {
                elizaLogger.warn(`⏱️ Rate limited, waiting before retry...`);
                await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
                continue;
            } else if (response.status >= 500) {
                elizaLogger.warn(`🔄 Server error, retrying...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                continue;
            } else {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            
        } catch (error) {
            lastError = error as Error;
            elizaLogger.error(`❌ Attempt ${attempt} failed:`, error);
            
            if (attempt === maxRetries) {
                break;
            }
            
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
        }
    }
    
    throw lastError!;
}

/**
 * Generic AI extraction function for TokenMetrics actions using real ElizaOS 1.x API
 * Following the official migration documentation exactly
 */
export async function extractTokenMetricsRequest<T>(
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    template: string,
    schema: z.ZodSchema<T>,
    requestId: string
): Promise<T> {
    elizaLogger.log(`🔄 [${requestId}] Starting AI extraction following migration docs...`);
    
    // Step 1: Compose state properly (as per docs)
    const composedState = await runtime.composeState(message);
    elizaLogger.log(`📊 [${requestId}] State composed successfully`);

    // Step 2: Create prompt using real 1.x API (as per docs)
    const prompt = composePromptFromState({
        state: composedState,
        template: template
    });
    elizaLogger.log(`📝 [${requestId}] Prompt composed successfully`);

    // Step 3: Use runtime.useModel with TEXT_SMALL (as per migration docs)
    const result = await runtime.useModel(ModelType.TEXT_SMALL, {
        prompt: prompt
    });
    elizaLogger.log(`🤖 [${requestId}] Model result received`);

    // Step 4: Parse the result using parseKeyValueXml (as per migration docs)
    const content = parseKeyValueXml(result);
    elizaLogger.log(`🔍 [${requestId}] Content parsed from XML`);

    elizaLogger.log(`✅ [${requestId}] AI extraction completed successfully`);
    return content as T;
}

/**
 * Generic TokenMetrics API call function
 */
export async function callTokenMetricsAPI(
    endpoint: string,
    params: Record<string, any>,
    runtime: IAgentRuntime
): Promise<any> {
    const apiKey = validateAndGetApiKey(runtime);
    
    // Build URL with parameters
    const url = new URL(`https://api.tokenmetrics.com${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
        }
    });

    elizaLogger.log(`📡 Calling TokenMetrics API: ${url.toString()}`);

    const response = await fetchWithRetry(url.toString(), {
        method: 'GET',
        headers: {
            'x-api-key': apiKey,
            'accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    elizaLogger.log(`✅ API call successful, received data`);
    
    return data;
}

/**
 * Format currency values
 */
export function formatCurrency(value: number | undefined | null): string {
    // Handle edge cases
    if (value === undefined || value === null || isNaN(value) || !isFinite(value)) {
        return "$0.00";
    }
    
    // Ensure we have a valid number
    const numValue = Number(value);
    if (isNaN(numValue) || !isFinite(numValue)) {
        return "$0.00";
    }
    
    if (numValue >= 1e9) {
        return `$${(numValue / 1e9).toFixed(2)}B`;
    } else if (numValue >= 1e6) {
        return `$${(numValue / 1e6).toFixed(2)}M`;
    } else if (numValue >= 1e3) {
        return `$${(numValue / 1e3).toFixed(2)}K`;
    } else if (numValue >= 1) {
        return `$${numValue.toFixed(2)}`;
    } else if (numValue > 0) {
        return `$${numValue.toFixed(6)}`;
    } else {
        return "$0.00";
    }
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number | undefined | null): string {
    // Handle edge cases
    if (value === undefined || value === null || isNaN(value) || !isFinite(value)) {
        return "0.00%";
    }
    
    // Ensure we have a valid number
    const numValue = Number(value);
    if (isNaN(numValue) || !isFinite(numValue)) {
        return "0.00%";
    }
    
    const sign = numValue >= 0 ? '+' : '';
    return `${sign}${numValue.toFixed(2)}%`;
}

/**
 * Generate unique request ID for cache busting
 */
export function generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Common token symbol mapping
 */
export function mapSymbolToName(input: string): string {
    const symbolMap: Record<string, string> = {
        'BTC': 'Bitcoin',
        'ETH': 'Ethereum', 
        'SOL': 'Solana',
        'ADA': 'Cardano',
        'MATIC': 'Polygon',
        'DOT': 'Polkadot',
        'LINK': 'Chainlink',
        'UNI': 'Uniswap',
        'AVAX': 'Avalanche',
        'LTC': 'Litecoin',
        'DOGE': 'Dogecoin',
        'XRP': 'XRP',
        'BNB': 'BNB',
        'USDT': 'Tether',
        'USDC': 'USD Coin',
        'ATOM': 'Cosmos',
        'NEAR': 'NEAR Protocol',
        'FTM': 'Fantom',
        'ALGO': 'Algorand',
        'VET': 'VeChain',
        'ICP': 'Internet Computer',
        'FLOW': 'Flow',
        'SAND': 'The Sandbox',
        'MANA': 'Decentraland',
        'CRO': 'Cronos',
        'APE': 'ApeCoin',
        'SHIB': 'Shiba Inu',
        'PEPE': 'Pepe',
        'WIF': 'dogwifhat',
        'BONK': 'Bonk'
    };
    
    const upperInput = input.toUpperCase();
    return symbolMap[upperInput] || input;
}

/**
 * Common token ID mapping for major cryptocurrencies
 * @deprecated This function uses hardcoded token IDs which may become outdated.
 * Use resolveTokenSmart() instead for dynamic API-based token resolution.
 */
export function getWellKnownTokenId(input: string): number | null {
    elizaLogger.warn("⚠️ getWellKnownTokenId is deprecated - use resolveTokenSmart() for dynamic resolution");
    
    const tokenIdMap: Record<string, number> = {
        // Major cryptocurrencies with known TokenMetrics IDs
        'BITCOIN': 3375,
        'BTC': 3375,
        'ETHEREUM': 3306,
        'ETH': 3306,
        'SOLANA': 3408,
        'SOL': 3408,
        'CARDANO': 3321,
        'ADA': 3321,
        'POLYGON': 3390,
        'MATIC': 3390,
        'POLKADOT': 3394,
        'DOT': 3394,
        'CHAINLINK': 3327,
        'LINK': 3327,
        'UNISWAP': 3424,
        'UNI': 3424,
        'AVALANCHE': 3315,
        'AVAX': 3315,
        'LITECOIN': 3373,
        'LTC': 3373,
        'DOGECOIN': 3340,
        'DOGE': 3340,
        'XRP': 3430,
        'RIPPLE': 3430,
        'BNB': 3318,
        'BINANCE COIN': 3318,
        'TETHER': 3420,
        'USDT': 3420,
        'USD COIN': 3423,
        'USDC': 3423,
        'COSMOS': 3333,
        'ATOM': 3333,
        'NEAR PROTOCOL': 3385,
        'NEAR': 3385,
        'FANTOM': 3348,
        'FTM': 3348,
        'ALGORAND': 3309,
        'ALGO': 3309,
        'VECHAIN': 3427,
        'VET': 3427,
        'INTERNET COMPUTER': 3364,
        'ICP': 3364,
        'FLOW': 3351,
        'THE SANDBOX': 3412,
        'SAND': 3412,
        'DECENTRALAND': 3336,
        'MANA': 3336,
        'CRONOS': 3334,
        'CRO': 3334,
        'APECOIN': 3312,
        'APE': 3312,
        'SHIBA INU': 3409,
        'SHIB': 3409
    };
    
    const upperInput = input.toUpperCase().trim();
    return tokenIdMap[upperInput] || null;
}

/**
 * Smart token resolution using TokenMetrics API (Pure API-based approach with search parameters)
 */
export async function resolveTokenSmart(input: string, runtime: IAgentRuntime): Promise<any | null> {
    elizaLogger.log(`🔍 Resolving token: "${input}" (Pure API search approach)`);
    
    try {
        const trimmedInput = input.trim();
        
        // Step 1: Apply symbol-to-name mapping first (like getPriceAction does)
        const mappedName = mapSymbolToName(trimmedInput);
        elizaLogger.log(`🔍 Symbol mapping: "${trimmedInput}" → "${mappedName}"`);
        
        // Use the mapped name for searching
        const searchInput = mappedName;
        elizaLogger.log(`🔍 Searching TokenMetrics database for: "${searchInput}"`);
        
        // Try searching by exact token name first (most reliable for full names)
        elizaLogger.log(`🔍 Step 1: Searching by token name "${searchInput}"`);
        let searchResult = await callTokenMetricsAPI('/v2/tokens', { 
            token_name: searchInput,
            limit: 5 
        }, runtime);
        
        // Handle API response structure: {success: true, data: [...]}
        let tokens = Array.isArray(searchResult) ? searchResult : (searchResult?.data || []);
        
        if (tokens.length > 0) {
            // Apply smart filtering for multiple tokens
            const filteredToken = applySmartTokenFiltering(tokens, searchInput);
            if (filteredToken) {
                elizaLogger.log(`✅ Found token by name search: ${filteredToken.TOKEN_NAME} (${filteredToken.TOKEN_SYMBOL}) - ID: ${filteredToken.TOKEN_ID}`);
                return filteredToken;
            }
        }
        
        // Try searching by symbol if name search failed
        elizaLogger.log(`🔍 Step 2: Searching by symbol "${searchInput}"`);
        searchResult = await callTokenMetricsAPI('/v2/tokens', { 
            symbol: searchInput,
            limit: 10 // Increase limit to get more options for filtering
        }, runtime);
        
        tokens = Array.isArray(searchResult) ? searchResult : (searchResult?.data || []);
        
        if (tokens.length > 0) {
            // Apply smart filtering for multiple tokens with same symbol
            const filteredToken = applySmartTokenFiltering(tokens, searchInput);
            if (filteredToken) {
                elizaLogger.log(`✅ Found token by symbol search: ${filteredToken.TOKEN_NAME} (${filteredToken.TOKEN_SYMBOL}) - ID: ${filteredToken.TOKEN_ID}`);
                return filteredToken;
            }
        }
        
        // Try case-insensitive variations
        const upperInput = searchInput.toUpperCase();
        const lowerInput = searchInput.toLowerCase();
        
        for (const variation of [upperInput, lowerInput]) {
            if (variation === searchInput) continue; // Skip if same as original
            
            elizaLogger.log(`🔍 Step 3: Trying variation "${variation}"`);
            
            // Try both name and symbol with variation
            for (const searchType of ['token_name', 'symbol']) {
                try {
                    searchResult = await callTokenMetricsAPI('/v2/tokens', { 
                        [searchType]: variation,
                        limit: 10 
                    }, runtime);
                    
                    tokens = Array.isArray(searchResult) ? searchResult : (searchResult?.data || []);
                    
                    if (tokens.length > 0) {
                        const filteredToken = applySmartTokenFiltering(tokens, variation);
                        if (filteredToken) {
                            elizaLogger.log(`✅ Found token by ${searchType} variation "${variation}": ${filteredToken.TOKEN_NAME} (${filteredToken.TOKEN_SYMBOL}) - ID: ${filteredToken.TOKEN_ID}`);
                            return filteredToken;
                        }
                    }
                } catch (variationError) {
                    elizaLogger.log(`⚠️ Variation search failed for ${searchType}="${variation}", continuing...`);
                }
            }
        }
        
        // Final fallback: partial name search in broader results
        elizaLogger.log(`🔍 Step 4: Trying broader search for partial matches`);
        try {
            searchResult = await callTokenMetricsAPI('/v2/tokens', { 
                limit: 50,
                page: 1 
            }, runtime);
            
            tokens = Array.isArray(searchResult) ? searchResult : (searchResult?.data || []);
            
            if (tokens.length > 0) {
                const upperInput = searchInput.toUpperCase();
                
                // Search for partial matches in the broader result set
                const matches = tokens.filter((token: any) => 
                    token.TOKEN_NAME?.toUpperCase().includes(upperInput) ||
                    token.TOKEN_SYMBOL?.toUpperCase().includes(upperInput)
                );
                
                if (matches.length > 0) {
                    const filteredToken = applySmartTokenFiltering(matches, searchInput);
                    if (filteredToken) {
                        elizaLogger.log(`✅ Found token by partial match: ${filteredToken.TOKEN_NAME} (${filteredToken.TOKEN_SYMBOL}) - ID: ${filteredToken.TOKEN_ID}`);
                        return filteredToken;
                    }
                }
            }
        } catch (broadError) {
            elizaLogger.log(`⚠️ Broad search failed, skipping...`);
        }
        
        elizaLogger.log(`❌ No token found for: "${input}" after trying all search methods`);
        return null;
        
    } catch (error) {
        elizaLogger.error(`❌ Error resolving token "${input}":`, error);
        return null;
    }
}

/**
 * Apply smart token filtering to prioritize main tokens over wrapped/bridged versions
 */
function applySmartTokenFiltering(tokens: any[], searchInput: string): any | null {
    if (!tokens || tokens.length === 0) return null;
    if (tokens.length === 1) return tokens[0];
    
    elizaLogger.log(`🔍 Applying smart filtering for ${tokens.length} tokens with input: "${searchInput}"`);
    
    // Priority selection logic for main tokens
    const mainTokenSelectors = [
        // For Bitcoin - select the main Bitcoin, not wrapped versions
        (token: any) => token.TOKEN_NAME === "Bitcoin" && token.TOKEN_SYMBOL === "BTC",
        // For Dogecoin - select the main Dogecoin, not other DOGE tokens
        (token: any) => token.TOKEN_NAME === "Dogecoin" && token.TOKEN_SYMBOL === "DOGE",
        // For Ethereum - select the main Ethereum
        (token: any) => token.TOKEN_NAME === "Ethereum" && token.TOKEN_SYMBOL === "ETH",
        // For Avalanche - select the main Avalanche, not wrapped versions
        (token: any) => token.TOKEN_NAME === "Avalanche" && token.TOKEN_SYMBOL === "AVAX",
        // For Solana - select the main Solana
        (token: any) => token.TOKEN_NAME === "Solana" && token.TOKEN_SYMBOL === "SOL",
        // For Polygon - select the main Polygon
        (token: any) => token.TOKEN_NAME === "Polygon" && token.TOKEN_SYMBOL === "MATIC",
        // For other tokens - prefer exact name matches or shortest/simplest names
        (token: any) => {
            const name = token.TOKEN_NAME?.toLowerCase() || '';
            const symbol = token.TOKEN_SYMBOL?.toLowerCase() || '';
            const searchLower = searchInput.toLowerCase();
            
            // Avoid wrapped, bridged, or derivative tokens
            const avoidKeywords = ['wrapped', 'bridged', 'peg', 'department', 'binance', 'osmosis', 'wormhole', 'beam'];
            const hasAvoidKeywords = avoidKeywords.some(keyword => name.includes(keyword));
            
            if (hasAvoidKeywords) return false;
            
            // Prefer exact name matches
            if (name === searchLower) return true;
            
            // Prefer tokens where name matches the expected name for the symbol
            if (symbol === 'btc' && name.includes('bitcoin')) return true;
            if (symbol === 'eth' && name.includes('ethereum')) return true;
            if (symbol === 'doge' && name.includes('dogecoin')) return true;
            if (symbol === 'sol' && name.includes('solana')) return true;
            if (symbol === 'avax' && name.includes('avalanche')) return true;
            if (symbol === 'matic' && name.includes('polygon')) return true;
            
            return false;
        }
    ];
    
    // Try each selector until we find a match
    for (const selector of mainTokenSelectors) {
        const match = tokens.find(selector);
        if (match) {
            elizaLogger.log(`✅ Smart filtering selected main token: ${match.TOKEN_NAME} (${match.TOKEN_SYMBOL}) - ID: ${match.TOKEN_ID}`);
            return match;
        }
    }
    
    // Fallback: use the first token but log the issue
    elizaLogger.log(`⚠️ No main token identified for "${searchInput}", using first token: ${tokens[0].TOKEN_NAME} (${tokens[0].TOKEN_SYMBOL})`);
    return tokens[0];
} 
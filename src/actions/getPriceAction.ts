import type { Action, ActionExample, HandlerCallback, IAgentRuntime, Memory, State } from "@elizaos/core";
import { elizaLogger, composeContext, generateObject, ModelClass } from "@elizaos/core";
import { z } from "zod";

/**
 * FIXED TokenMetrics Price Action
 * 
 * This version includes comprehensive error handling, proper API response parsing,
 * and enhanced debugging capabilities to resolve token fetching issues.
 */

// Template for extracting token information from conversations
const priceTemplate = `# Task: Extract Cryptocurrency Information

Based on the conversation context, identify what cryptocurrency the user is asking about.

# Conversation Context:
{{recentMessages}}

# Instructions:
Look for any mentions of:
- Cryptocurrency symbols (BTC, ETH, SOL, ADA, MATIC, DOT, LINK, UNI, AVAX, etc.)
- Cryptocurrency names (Bitcoin, Ethereum, Solana, Cardano, Polygon, Uniswap, Avalanche, Chainlink, etc.)  
- Price-related queries ("price of", "how much is", "value of")

The user might say things like:
- "What's the price of Bitcoin?"
- "How much is BTC worth?"
- "Get me ETH price"
- "Solana current value"
- "What is the price of Uniswap?"
- "How much is UNI?"
- "Avalanche price"

Extract the cryptocurrency they're asking about.

# Response Format:
Return a structured object with the cryptocurrency information.`;

// Schema for the extracted data
const TokenRequestSchema = z.object({
  cryptocurrency: z.string().nullable().describe("The cryptocurrency symbol or name mentioned"),
  query_type: z.enum(["price", "value", "cost", "worth"]).describe("Type of query"),
  confidence: z.number().min(0).max(1).describe("Confidence in extraction")
});

type TokenRequest = z.infer<typeof TokenRequestSchema>;

// Enhanced interface for token information with proper typing
interface TokenInfo {
    TOKEN_ID: number;
    TOKEN_NAME?: string;  // API sometimes uses TOKEN_NAME instead of NAME
    NAME?: string;
    TOKEN_SYMBOL?: string;  // API sometimes uses TOKEN_SYMBOL instead of SYMBOL
    SYMBOL?: string;
    CATEGORY?: string;
    EXCHANGE_LIST?: any[];  // Based on API docs
    MARKET_CAP?: number;
    PRICE?: number;
}

// Enhanced API response interface based on actual TokenMetrics API documentation
interface TokenMetricsApiResponse {
    success?: boolean;
    message?: string;
    length?: number;
    data?: TokenInfo[];
    error?: string;
}

// REMOVED: No longer needed with direct API search approach
// let tokenCache: { ... } | null = null;

// REMOVED: Cache duration no longer needed
// const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const API_TIMEOUT = 10000; // 10 seconds timeout
const MAX_RETRIES = 3;

/**
 * Enhanced API key validation with better error reporting
 */
function validateAndGetApiKey(runtime: IAgentRuntime): string {
    console.log("🚨 VALIDATEANDGETAPIKEY FUNCTION CALLED - OUR CODE IS RUNNING!");
    
    // First try to get from runtime settings (environment variable)
    let apiKey = runtime.getSetting("TOKENMETRICS_API_KEY");
    
    elizaLogger.log(`🔐 Checking API key availability...`);
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
        
        // TODO: Replace with your actual TokenMetrics API key
        const HARDCODED_API_KEY = "tm-b7212f8d-1bcb-4c40-be3f-b4d1a4eeee72";
        
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
async function fetchWithRetry(url: string, options: RequestInit, maxRetries: number = MAX_RETRIES): Promise<Response> {
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
 * SIMPLIFIED: Direct token search using TokenMetrics API
 * Based on comprehensive testing showing excellent success rate with token_name parameter
 */
async function searchTokenByName(tokenName: string, runtime: IAgentRuntime): Promise<TokenInfo | null> {
    const apiKey = validateAndGetApiKey(runtime);
    const trimmedName = tokenName.trim();
    
    if (!trimmedName) {
        elizaLogger.log("❌ Empty token name provided");
        return null;
    }
    
    elizaLogger.log(`🔍 DEBUGGING: searchTokenByName called with: "${trimmedName}"`);
    
    try {
        // Use the direct API search that works perfectly for token names
        const url = `https://api.tokenmetrics.com/v2/tokens?token_name=${encodeURIComponent(trimmedName)}`;
        elizaLogger.log(`📡 DEBUGGING: API URL: ${url}`);
        
        const response = await fetchWithRetry(url, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            elizaLogger.log(`❌ API returned ${response.status}: ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        elizaLogger.log(`📊 DEBUGGING: searchTokenByName API Response:`, {
            success: data.success,
            message: data.message,
            length: data.length,
            hasData: !!data.data,
            dataLength: Array.isArray(data.data) ? data.data.length : 'not array'
        });
        
        if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
            const token = data.data[0];
            elizaLogger.success(`✅ DEBUGGING: searchTokenByName found: ${token.TOKEN_NAME} (${token.TOKEN_SYMBOL}) - ID: ${token.TOKEN_ID}`);
            
            return {
                TOKEN_ID: token.TOKEN_ID,
                NAME: token.TOKEN_NAME,
                SYMBOL: token.TOKEN_SYMBOL,
                CATEGORY: token.CATEGORY,
                EXCHANGE_LIST: token.EXCHANGE_LIST
            };
        } else {
            elizaLogger.log(`❌ DEBUGGING: searchTokenByName - No token found for: "${trimmedName}"`);
            return null;
        }
        
    } catch (error) {
        elizaLogger.error(`❌ DEBUGGING: searchTokenByName error for "${trimmedName}":`, error);
        return null;
    }
}

/**
 * NEW: Symbol-to-name mapping for common cryptocurrencies
 * This handles cases where users use symbols like BTC, ETH instead of full names
 */
function mapSymbolToName(input: string): string {
    const symbolMap: { [key: string]: string } = {
        // Major cryptocurrencies
        'BTC': 'Bitcoin',
        'ETH': 'Ethereum',
        'SOL': 'Solana',
        'ADA': 'Cardano',
        'MATIC': 'Polygon',
        'DOT': 'Polkadot',
        'LINK': 'Chainlink',
        'AVAX': 'Avalanche',
        'ATOM': 'Cosmos',
        'NEAR': 'Near',
        'FTM': 'Fantom',
        'ALGO': 'Algorand',
        'XTZ': 'Tezos',
        'EGLD': 'MultiversX',
        'ICP': 'Internet Computer',
        'VET': 'VeChain',
        'HBAR': 'Hedera',
        'FIL': 'Filecoin',
        'SAND': 'The Sandbox',
        'MANA': 'Decentraland',
        'CRV': 'Curve',
        'COMP': 'Compound',
        'MKR': 'Maker',
        'SNX': 'Synthetix',
        'SUSHI': 'SushiSwap',
        'YFI': 'yearn.finance',
        'BAL': 'Balancer',
        'REN': 'Ren',
        'KNC': 'Kyber Network',
        'ZRX': '0x',
        'BAT': 'Basic Attention Token',
        'ENJ': 'Enjin',
        'STORJ': 'Storj',
        'GRT': 'The Graph',
        'BAND': 'Band Protocol',
        'OMG': 'OMG Network',
        'LRC': 'Loopring',
        'REP': 'Augur',
        'ZEC': 'Zcash',
        'DASH': 'Dash',
        'XMR': 'Monero',
        'LTC': 'Litecoin',
        'BCH': 'Bitcoin Cash',
        'ETC': 'Ethereum Classic',
        'XLM': 'Stellar',
        'XRP': 'XRP',
        'DOGE': 'Dogecoin',
        'SHIB': 'Shiba Inu',
        
        // DeFi tokens that might work with symbols
        'UNI': 'Uniswap',  // This one works as symbol too
        'AAVE': 'Aave',
        '1INCH': '1inch',
        
        // Layer 2 and scaling
        'ARB': 'Arbitrum',
        'OP': 'Optimism',
        
        // Other popular tokens
        'APE': 'ApeCoin',
        'GALA': 'Gala',
        'CHZ': 'Chiliz',
        'THETA': 'Theta',
        'FLOW': 'Flow',
        'MIOTA': 'IOTA',
        'EOS': 'EOS',
        'TRX': 'TRON',
        'NEO': 'Neo',
        'QTUM': 'Qtum',
        'ZIL': 'Zilliqa',
        'ONT': 'Ontology',
        'ICX': 'ICON',
        'WAVES': 'Waves',
        'LSK': 'Lisk',
        'NANO': 'Nano',
        'SC': 'Siacoin',
        'DGB': 'DigiByte',
        'RVN': 'Ravencoin',
        'BTG': 'Bitcoin Gold',
        'ZEN': 'Horizen'
    };
    
    const upperInput = input.toUpperCase();
    const mappedName = symbolMap[upperInput];
    
    if (mappedName) {
        elizaLogger.log(`🔄 Mapped symbol "${input}" → "${mappedName}"`);
        return mappedName;
    }
    
    // Return original input if no mapping found
    return input;
}

/**
 * ENHANCED: Smart token resolution with symbol mapping + direct API search
 * Now handles both symbols (BTC, ETH) and full names (Bitcoin, Ethereum)
 */
async function resolveTokenSmart(input: string, runtime: IAgentRuntime): Promise<TokenInfo | null> {
    elizaLogger.log(`🔍 DEBUGGING: resolveTokenSmart called with input: "${input}"`);
    
    // Step 1: Try direct API search with original input
    elizaLogger.log(`🔍 DEBUGGING: Step 1 - Trying direct search for: "${input}"`);
    let result = await searchTokenByName(input, runtime);
    
    if (result) {
        elizaLogger.success(`✅ DEBUGGING: Direct search successful: ${result.NAME} (${result.SYMBOL}) - ID: ${result.TOKEN_ID}`);
        return result;
    }
    
    // Step 2: If direct search failed, try mapping symbol to name
    const mappedName = mapSymbolToName(input);
    elizaLogger.log(`🔍 DEBUGGING: Step 2 - Symbol mapping: "${input}" → "${mappedName}"`);
    
    if (mappedName !== input) {
        elizaLogger.log(`🔄 DEBUGGING: Trying mapped name: "${mappedName}"`);
        result = await searchTokenByName(mappedName, runtime);
        
        if (result) {
            elizaLogger.success(`✅ DEBUGGING: Symbol mapping successful: ${input} → ${result.NAME} (${result.SYMBOL}) - ID: ${result.TOKEN_ID}`);
            return result;
        }
    }
    
    elizaLogger.log(`❌ DEBUGGING: resolveTokenSmart failed for: "${input}"`);
    return null;
}

/**
 * Enhanced price data fetching with better error handling
 */
async function fetchTokenMetricsPrice(tokenId: number, runtime: IAgentRuntime): Promise<any | null> {
    try {
        const apiKey = validateAndGetApiKey(runtime);
        
        elizaLogger.log(`📡 DEBUGGING: fetchTokenMetricsPrice called for token_id: ${tokenId}`);
        const url = `https://api.tokenmetrics.com/v2/price?token_id=${tokenId}`;
        elizaLogger.log(`🌐 DEBUGGING: Price API URL: ${url}`);
        
        const response = await fetchWithRetry(url, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'ElizaOS-TokenMetrics-Plugin/1.0'
            }
        });

        const rawData = await response.text();
        elizaLogger.log(`📄 DEBUGGING: Price API Response length: ${rawData.length} characters`);
        
        let data: any;
        try {
            data = JSON.parse(rawData);
        } catch (parseError) {
            elizaLogger.error("❌ Failed to parse price JSON response:", parseError);
            throw new Error("Invalid JSON response from TokenMetrics price API");
        }
        
        elizaLogger.log("📊 DEBUGGING: Price API Response structure:", {
            success: data.success,
            message: data.message,
            hasData: !!data.data,
            dataType: typeof data.data,
            dataLength: Array.isArray(data.data) ? data.data.length : 'not array'
        });
        
        // Handle different response structures for price endpoint
        let priceData = null;
        
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            priceData = data.data[0];
        } else if (data.success && data.data && !Array.isArray(data.data)) {
            priceData = data.data;
        } else if (Array.isArray(data) && data.length > 0) {
            priceData = data[0];
        } else if (data.success === false) {
            throw new Error(`TokenMetrics price API error: ${data.message || data.error || 'Unknown error'}`);
        } else {
            elizaLogger.error("❌ Unexpected price response structure:", data);
            throw new Error("Unexpected response format from TokenMetrics price API");
        }
        
        if (!priceData) {
            throw new Error("No price data found in response");
        }
        
        elizaLogger.success("✅ DEBUGGING: fetchTokenMetricsPrice retrieved price data:", {
            requestedTokenId: tokenId,
            symbol: priceData.SYMBOL || priceData.TOKEN_SYMBOL,
            name: priceData.NAME || priceData.TOKEN_NAME,
            price: priceData.PRICE || priceData.CURRENT_PRICE,
            change: priceData.PRICE_24H_CHANGE_PERCENT
        });
        
        return priceData;

    } catch (error) {
        elizaLogger.error(`❌ DEBUGGING: fetchTokenMetricsPrice error for token_id ${tokenId}:`, error);
        return null;
    }
}

/**
 * Enhanced response formatting (unchanged but with better error handling)
 */
function formatPriceResponse(priceData: any, tokenInfo: any): string {
    const name = priceData.NAME || priceData.TOKEN_NAME || tokenInfo.NAME;
    const symbol = priceData.SYMBOL || priceData.TOKEN_SYMBOL || tokenInfo.SYMBOL;
    const price = priceData.PRICE || priceData.CURRENT_PRICE;
    
    let response = `💰 **${name} (${symbol})** is currently trading at **${formatCurrency(price)}**\n\n`;
    
    // Add 24-hour change if available
    if (priceData.PRICE_24H_CHANGE_PERCENT !== undefined && priceData.PRICE_24H_CHANGE_PERCENT !== null) {
        const change = parseFloat(priceData.PRICE_24H_CHANGE_PERCENT);
        const changeText = formatPercentage(Math.abs(change));
        const emoji = change >= 0 ? '📈' : '📉';
        const direction = change >= 0 ? 'up' : 'down';
        
        response += `${emoji} **24h Change:** ${direction} ${changeText}\n`;
    }
    
    // Add market cap if available
    if (priceData.MARKET_CAP) {
        response += `🏛️ **Market Cap:** ${formatCurrency(priceData.MARKET_CAP)}\n`;
    }
    
    // Add volume if available
    if (priceData.VOLUME_24H) {
        response += `📊 **24h Volume:** ${formatCurrency(priceData.VOLUME_24H)}\n`;
    }
    
    response += `\n🔗 *Real-time data from TokenMetrics API*`;
    return response;
}

/**
 * Analyze price data for insights (unchanged)
 */
function analyzePriceData(priceData: any): any {
    const insights = [];
    const symbol = priceData.SYMBOL || priceData.TOKEN_SYMBOL || 'this token';
    
    if (priceData.PRICE_24H_CHANGE_PERCENT !== undefined) {
        const change = Math.abs(parseFloat(priceData.PRICE_24H_CHANGE_PERCENT));
        
        if (change > 15) {
            insights.push(`${symbol} is experiencing very high volatility`);
        } else if (change > 10) {
            insights.push(`${symbol} showing high volatility`);
        } else if (change < 2) {
            insights.push(`${symbol} showing stable price action`);
        }
    }
    
    return {
        summary: `Market analysis for ${symbol}`,
        insights: insights,
        data_source: "TokenMetrics API"
    };
}

/**
 * Utility functions (unchanged)
 */
function formatCurrency(value: number): string {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
}

function formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
}

/**
 * MAIN ACTION: Enhanced TokenMetrics Price Action with comprehensive error handling
 */
export const getPriceAction: Action = {
    name: "GET_PRICE_TOKENMETRICS",
    similes: [
        "get token price",
        "check current price", 
        "get price data",
        "current market price",
        "token price info",
        "get market data",
        "check token value",
        "price of",
        "how much is",
        "current price",
        "market price",
        "what's the price",
        "show me price",
        "token value",
        "crypto price",
        "check value"
    ],
    description: "Get current cryptocurrency prices and market data from TokenMetrics API with enhanced error handling and real-time data fetching",
    
    validate: async (runtime: IAgentRuntime, message: Memory): Promise<boolean> => {
        elizaLogger.log("🔍 Validating TokenMetrics price action");
        
        // Check if we have the required API key
        try {
            validateAndGetApiKey(runtime);
        } catch (error) {
            elizaLogger.warn("❌ TokenMetrics API key validation failed:", error);
            return false;
        }
        
        // Check if the message contains price-related content
        const text = message.content?.text?.toLowerCase() || "";
        const priceKeywords = [
            "price", "cost", "worth", "value", "trading", "market",
            "how much", "current", "latest", "get", "check", "show"
        ];
        
        const cryptoKeywords = [
            "btc", "bitcoin", "eth", "ethereum", "sol", "solana",
            "ada", "cardano", "crypto", "cryptocurrency", "token", "coin",
            "matic", "polygon", "dot", "polkadot", "link", "chainlink"
        ];
        
        // Must have both price-related and crypto-related terms
        const hasPriceKeyword = priceKeywords.some(keyword => text.includes(keyword));
        const hasCryptoKeyword = cryptoKeywords.some(keyword => text.includes(keyword));
        
        const isValid = hasPriceKeyword && hasCryptoKeyword;
        elizaLogger.log(`✅ Validation result: ${isValid} (price: ${hasPriceKeyword}, crypto: ${hasCryptoKeyword})`);
        
        return isValid;
    },
    
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        options?: any,
        callback?: HandlerCallback
    ): Promise<boolean> => {
        // Generate unique request ID to prevent caching
        const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        elizaLogger.log("🚀 Starting TokenMetrics price handler");
        elizaLogger.log(`📝 Processing user message: "${message.content?.text || "No text content"}"`);
        elizaLogger.log(`🆔 Request ID: ${requestId}`);

        try {
            // STEP 1: Validate API key early
            validateAndGetApiKey(runtime);

            // STEP 2: Force completely fresh state composition with cache busting
            elizaLogger.log("🔄 Forcing fresh state composition with cache busting...");
            
            // Force fresh state composition without modifying message structure
            state = await runtime.composeState(message);
            elizaLogger.log("📊 Composed fresh state with cache busting");

            // STEP 3: Create context with cache-busting template
            const uniqueTemplate = `${priceTemplate}

# Cache Busting ID: ${requestId}
# Timestamp: ${new Date().toISOString()}

Please analyze the CURRENT user message and extract the cryptocurrency information.`;

            const context = composeContext({
                state,
                template: uniqueTemplate,
            });

            elizaLogger.log("🎯 Context created with cache busting, extracting token information...");

            // STEP 4: Use ElizaOS generateObject with cache busting
            const response = await generateObject({
                runtime,
                context,
                modelClass: ModelClass.SMALL,
                schema: TokenRequestSchema
            });

            const tokenRequest = response.object as TokenRequest;
            elizaLogger.log("🎯 AI Extracted token request:", tokenRequest);
            elizaLogger.log("🔍 DEBUGGING: AI understood user asked for:", tokenRequest.cryptocurrency);
            elizaLogger.log(`🆔 Request ${requestId}: AI Processing "${tokenRequest.cryptocurrency || 'null'}"`);

            // STEP 5: Validate that we found cryptocurrency information
            if (!tokenRequest.cryptocurrency || tokenRequest.confidence < 0.5) {
                elizaLogger.log("❌ AI extraction failed or low confidence");
                
                if (callback) {
                    callback({
                        text: `❌ I couldn't identify which cryptocurrency you're asking about.

I can get price data for any cryptocurrency supported by TokenMetrics including:
• Bitcoin, Ethereum, Solana, Cardano, Polygon, Chainlink
• Uniswap, Avalanche, Polkadot, Litecoin, Dogecoin
• And many more!

Try asking something like:
• "What's the price of Bitcoin?"
• "How much is Uniswap worth?"
• "Get me Solana price data"
• "Show me Chainlink current value"`,
                        content: { 
                            error: "No cryptocurrency identified",
                            confidence: tokenRequest?.confidence || 0,
                            request_id: requestId
                        }
                    });
                }
                return false;
            }

            elizaLogger.success("🎯 Final extraction result:", tokenRequest);
            elizaLogger.log(`🆔 Request ${requestId}: Final processing "${tokenRequest.cryptocurrency}"`);

            // STEP 6: Resolve the cryptocurrency using direct API search
            elizaLogger.log(`🔍 DEBUGGING: Resolving token for input: "${tokenRequest.cryptocurrency}"`);
            elizaLogger.log(`🆔 Request ${requestId}: Resolving "${tokenRequest.cryptocurrency}"`);
            const tokenInfo = await resolveTokenSmart(tokenRequest.cryptocurrency, runtime);
            
            if (!tokenInfo) {
                elizaLogger.log(`❌ Could not resolve token: ${tokenRequest.cryptocurrency}`);
                
                if (callback) {
                    callback({
                        text: `❌ I couldn't find information for "${tokenRequest.cryptocurrency}".

This might be:
• A very new token not yet in TokenMetrics database
• An alternative name or symbol I don't recognize
• A spelling variation

Try using the official name, such as:
• Bitcoin, Ethereum, Solana, Cardano
• Uniswap, Chainlink, Polygon, Avalanche
• Or check the exact spelling on CoinMarketCap`,
                        content: { 
                            error: "Token not found",
                            requested_token: tokenRequest.cryptocurrency,
                            request_id: requestId
                        }
                    });
                }
                return false;
            }

            elizaLogger.success(`✅ DEBUGGING: Successfully resolved token: ${tokenInfo.NAME} (${tokenInfo.SYMBOL}) - ID: ${tokenInfo.TOKEN_ID}`);
            elizaLogger.log(`🔍 DEBUGGING: About to fetch price for TOKEN_ID: ${tokenInfo.TOKEN_ID}`);
            elizaLogger.log(`🆔 Request ${requestId}: Resolved to ${tokenInfo.NAME} (${tokenInfo.SYMBOL}) - ID: ${tokenInfo.TOKEN_ID}`);

            // STEP 7: Fetch price data from TokenMetrics API
            elizaLogger.log(`📡 Fetching price data for ${tokenInfo.SYMBOL}`);
            elizaLogger.log(`🆔 Request ${requestId}: Fetching price for ${tokenInfo.SYMBOL}`);
            const priceData = await fetchTokenMetricsPrice(tokenInfo.TOKEN_ID, runtime);
            
            if (!priceData) {
                elizaLogger.log("❌ Failed to fetch price data from API");
                
                if (callback) {
                    callback({
                        text: `❌ Unable to fetch price data for ${tokenInfo.NAME} (${tokenInfo.SYMBOL}) at the moment.

This could be due to:
• TokenMetrics API connectivity issues
• Temporary service interruption  
• Rate limiting
• Token data temporarily unavailable

Please try again in a few moments.`,
                        content: { 
                            error: "API fetch failed",
                            token: tokenInfo,
                            request_id: requestId
                        }
                    });
                }
                return false;
            }

            elizaLogger.log(`🔍 DEBUGGING: Received price data for:`, {
                requestedToken: tokenRequest.cryptocurrency,
                resolvedToken: `${tokenInfo.NAME} (${tokenInfo.SYMBOL})`,
                priceDataSymbol: priceData.SYMBOL || priceData.TOKEN_SYMBOL,
                priceDataName: priceData.NAME || priceData.TOKEN_NAME,
                price: priceData.PRICE || priceData.CURRENT_PRICE
            });
            elizaLogger.log(`🆔 Request ${requestId}: Price data - ${priceData.SYMBOL || priceData.TOKEN_SYMBOL} at ${formatCurrency(priceData.PRICE || priceData.CURRENT_PRICE)}`);

            // STEP 8: Format and present the results
            const responseText = formatPriceResponse(priceData, tokenInfo);
            const analysis = analyzePriceData(priceData);

            elizaLogger.success("✅ Successfully processed price request with AI + real-time data");
            elizaLogger.log(`🔍 DEBUGGING: Final response will show: ${priceData.SYMBOL || priceData.TOKEN_SYMBOL} at ${formatCurrency(priceData.PRICE || priceData.CURRENT_PRICE)}`);
            elizaLogger.log(`🆔 Request ${requestId}: FINAL RESULT - ${priceData.SYMBOL || priceData.TOKEN_SYMBOL} at ${formatCurrency(priceData.PRICE || priceData.CURRENT_PRICE)}`);

            if (callback) {
                callback({
                    text: responseText,
                    content: {
                        success: true,
                        token_info: tokenInfo,
                        price_data: priceData,
                        analysis: analysis,
                        source: "TokenMetrics API (Real-time)",
                        request_id: requestId,
                        query_details: {
                            original_request: tokenRequest.cryptocurrency,
                            resolved_to: `${tokenInfo.NAME} (${tokenInfo.SYMBOL})`,
                            confidence: tokenRequest.confidence,
                            data_freshness: "real-time",
                            request_id: requestId,
                            extraction_method: "ai_with_cache_busting"
                        }
                    }
                });
            }

            return true;

        } catch (error) {
            elizaLogger.error("❌ Error in TokenMetrics price handler:", error);
            elizaLogger.error(`🆔 Request ${requestId}: ERROR - ${error}`);
            
            if (callback) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                
                callback({
                    text: `❌ I encountered an error while fetching price data: ${errorMessage}

This could be due to:
• Network connectivity issues
• TokenMetrics API service problems
• Invalid API key or authentication issues
• Temporary system overload

Please check your TokenMetrics API key configuration and try again.`,
                    content: { 
                        error: errorMessage,
                        error_type: error instanceof Error ? error.constructor.name : 'Unknown',
                        troubleshooting: true,
                        request_id: requestId
                    }
                });
            }
            
            return false;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What's the current price of Bitcoin?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the current Bitcoin price and market data for you from TokenMetrics.",
                    action: "GET_PRICE_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "How much is ETH worth today?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Let me fetch the latest Ethereum price data from TokenMetrics.",
                    action: "GET_PRICE_TOKENMETRICS"
                }
            }
        ]
    ] as ActionExample[][],
};
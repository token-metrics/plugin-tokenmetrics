import type { Action, ActionExample, ActionResult, HandlerCallback, IAgentRuntime, Memory, State } from "@elizaos/core";
import { elizaLogger, createActionResult } from "@elizaos/core";
import { z } from "zod";
import {
    validateAndGetApiKey,
    extractTokenMetricsRequest,
    callTokenMetricsAPI,
    formatCurrency,
    formatPercentage,
    generateRequestId,
    resolveTokenSmart
} from "./aiActionHelper";

/**
 * TokenMetrics Price Action - Updated for 1.x with new callback pattern
 */

/**
 * Dynamic token extraction using pure pattern matching - no hardcoding
 */
function extractCryptocurrencySimple(text: string): string | null {
    // Look for potential cryptocurrency symbols (3-10 characters, mostly uppercase)
    const symbolPattern = /\b([A-Z]{3,10})\b/g;
    const symbolMatches = text.match(symbolPattern);
    
    if (symbolMatches && symbolMatches.length > 0) {
        // Filter out common English words that aren't crypto symbols
        const filteredSymbols = symbolMatches.filter(symbol => 
            !['THE', 'AND', 'FOR', 'WITH', 'GET', 'SET', 'API', 'KEY', 'USD', 'EUR', 'GBP', 'JPY'].includes(symbol)
        );
        
        if (filteredSymbols.length > 0) {
            return filteredSymbols[0];
        }
    }
    
    // Look for potential cryptocurrency names (any capitalized word or pattern that might be a crypto)
    const potentialCryptoPattern = /\b([A-Z][a-z]{3,})\b/g;
    const nameMatches = text.match(potentialCryptoPattern);
    
    if (nameMatches && nameMatches.length > 0) {
        // Filter out common English words that aren't cryptos
        const filteredNames = nameMatches.filter(word => 
            !['The', 'What', 'How', 'Get', 'Show', 'Check', 'Price', 'Token', 'Coin', 'Much', 'Worth', 'From', 'Please', 'Hold', 'Moment', 'Today', 'This', 'That', 'Here', 'There', 'When', 'Where', 'With', 'Your'].includes(word)
        );
        
        if (filteredNames.length > 0) {
            return filteredNames[0];
        }
    }
    
    return null;
}

/**
 * Search for token using the /tokens endpoint dynamically
 */
async function searchTokenDynamically(query: string, runtime: IAgentRuntime): Promise<any | null> {
    try {
        elizaLogger.log(`🔍 Searching for token: "${query}" using /tokens endpoint`);
        
        // Try searching by symbol first - get multiple results for better selection
        let searchParams = {
            symbol: query.toUpperCase(),
            limit: 5  // Get multiple results to find the most popular one
        };
        
        let tokenData = await callTokenMetricsAPI('/v2/tokens', searchParams, runtime);
        
        // DEBUG: Log the actual API response structure
        elizaLogger.log(`🔬 API Response for symbol search:`, JSON.stringify(tokenData, null, 2));
        
        if (tokenData?.data && tokenData.data.length > 0) {
            // For major cryptocurrencies, check if we have the real token among results
            const majorCryptoMapping: Record<string, string> = {
                'BTC': 'Bitcoin',
                'ETH': 'Ethereum',
                'DOGE': 'Dogecoin',
                'ADA': 'Cardano',
                'SOL': 'Solana',
                'AVAX': 'Avalanche',
                'MATIC': 'Polygon',
                'DOT': 'Polkadot',
                'LINK': 'Chainlink',
                'UNI': 'Uniswap'
            };
            
            const expectedName = majorCryptoMapping[query.toUpperCase()];
            
            // If this is a major crypto, look for the exact match first
            if (expectedName) {
                const exactMatch = tokenData.data.find((token: any) => 
                    token.TOKEN_NAME?.toLowerCase() === expectedName.toLowerCase()
                );
                if (exactMatch) {
                    elizaLogger.log(`🎯 Found exact major crypto match: ${exactMatch.TOKEN_NAME} (${exactMatch.TOKEN_SYMBOL}) - ID: ${exactMatch.TOKEN_ID}`);
                    return exactMatch;
                }
            }
            
            // If multiple results, prioritize based on criteria:
            // 1. Exact symbol match
            // 2. More exchanges (higher liquidity)
            // 3. More categories (more established)
            let bestToken = tokenData.data[0];
            
            if (tokenData.data.length > 1) {
                elizaLogger.log(`🔍 Multiple tokens found, selecting best match...`);
                
                // Sort by priority: exact symbol match, exchange count, category count
                const sortedTokens = tokenData.data.sort((a: any, b: any) => {
                    // Priority 1: Exact symbol match
                    const aExactMatch = a.TOKEN_SYMBOL?.toUpperCase() === query.toUpperCase() ? 1 : 0;
                    const bExactMatch = b.TOKEN_SYMBOL?.toUpperCase() === query.toUpperCase() ? 1 : 0;
                    if (aExactMatch !== bExactMatch) return bExactMatch - aExactMatch;
                    
                    // Priority 2: More exchanges (higher liquidity)
                    const aExchanges = a.EXCHANGE_LIST?.length || 0;
                    const bExchanges = b.EXCHANGE_LIST?.length || 0;
                    if (aExchanges !== bExchanges) return bExchanges - aExchanges;
                    
                    // Priority 3: More categories (more established)
                    const aCategories = a.CATEGORY_LIST?.length || 0;
                    const bCategories = b.CATEGORY_LIST?.length || 0;
                    return bCategories - aCategories;
                });
                
                bestToken = sortedTokens[0];
                elizaLogger.log(`🎯 Selected best token: ${bestToken.TOKEN_NAME} (${bestToken.TOKEN_SYMBOL}) - ${bestToken.EXCHANGE_LIST?.length || 0} exchanges`);
            }
            
            elizaLogger.log(`✅ Found token by symbol: ${bestToken.TOKEN_NAME} (${bestToken.TOKEN_SYMBOL}) - ID: ${bestToken.TOKEN_ID}`);
            return bestToken;
        }
        
        // If not found by symbol, try searching by name
        // For major cryptocurrencies, also try the full name
        const majorCryptoNames: Record<string, string> = {
            'BTC': 'Bitcoin',
            'ETH': 'Ethereum', 
            'DOGE': 'Dogecoin',
            'ADA': 'Cardano',
            'SOL': 'Solana',
            'AVAX': 'Avalanche',
            'MATIC': 'Polygon',
            'DOT': 'Polkadot',
            'LINK': 'Chainlink',
            'UNI': 'Uniswap'
        };
        
        const searchName = majorCryptoNames[query.toUpperCase()] || query;
        
        searchParams = {
            token_name: searchName,
            limit: 10  // Get more results to find best match
        } as any;
        
        tokenData = await callTokenMetricsAPI('/v2/tokens', searchParams, runtime);
        
        // DEBUG: Log the actual API response structure for name search
        elizaLogger.log(`🔬 API Response for name search:`, JSON.stringify(tokenData, null, 2));
        
        if (tokenData?.data && tokenData.data.length > 0) {
            // Find best match by checking if query matches token name or symbol
            const queryLower = query.toLowerCase();
            const bestMatch = tokenData.data.find((token: any) => 
                token.TOKEN_NAME?.toLowerCase().includes(queryLower) ||
                token.TOKEN_SYMBOL?.toLowerCase() === queryLower ||
                token.TOKEN_NAME?.toLowerCase() === queryLower
            ) || tokenData.data[0]; // Fallback to first result
            
            elizaLogger.log(`✅ Found token by name: ${bestMatch.TOKEN_NAME} (${bestMatch.TOKEN_SYMBOL}) - ID: ${bestMatch.TOKEN_ID}`);
            return bestMatch;
        }
        
        elizaLogger.log(`❌ No token found for query: "${query}"`);
        return null;
        
    } catch (error) {
        elizaLogger.error(`❌ Error searching for token "${query}":`, error);
        return null;
    }
}

// Standardized schema for price requests
const PriceRequestSchema = z.object({
    cryptocurrency: z.string().describe("The cryptocurrency name or symbol (e.g., 'Bitcoin', 'BTC', 'Ethereum', 'ETH', 'Dogecoin', 'DOGE', 'Avalanche', 'AVAX')"),
    symbol: z.string().optional().describe("The cryptocurrency symbol (e.g., 'BTC', 'ETH', 'SOL', 'DOGE', 'AVAX')"),
    analysisType: z.enum(["current", "trend", "technical", "all"]).optional().describe("Type of price analysis to focus on")
});

// Standardized AI extraction template
const PRICE_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting cryptocurrency PRICE requests from natural language.

CRITICAL INSTRUCTION: This is ONLY for PRICE requests, NOT token search/database requests.

ONLY MATCH PRICE REQUESTS:
- "What's the price of Bitcoin?" ✅
- "How much is ETH worth?" ✅  
- "Get Bitcoin price" ✅
- "Show me DOGE price" ✅
- "Bitcoin current price" ✅
- "Check ETH price" ✅
- "Price of Solana" ✅
- "What's the price of BONK?" ✅
- "DEGEN price" ✅
- "How much is PEPE worth?" ✅
- "Get FLOKI price" ✅
- "Check WIF price" ✅

DO NOT MATCH TOKEN SEARCH/DATABASE REQUESTS:
- "Find token details for Ethereum" ❌ (this is TOKEN SEARCH)
- "Search for Bitcoin token information" ❌ (this is TOKEN SEARCH)
- "Lookup token information for Dogecoin" ❌ (this is TOKEN SEARCH)
- "Get token details" ❌ (this is TOKEN SEARCH)
- "Search token database" ❌ (this is TOKEN SEARCH)
- "Find token info" ❌ (this is TOKEN SEARCH)
- "Token information" ❌ (this is TOKEN SEARCH)

ONLY extract if the user is asking for PRICE/VALUE information, not token details or database searches.

Extract the following information for PRICE requests only:

1. **cryptocurrency** (required): The EXACT cryptocurrency name or symbol they mentioned
   - Extract whatever cryptocurrency name the user said (Bitcoin, Ethereum, Dogecoin, Avalanche, BONK, DEGEN, PEPE, FLOKI, WIF, etc.)
   - Extract whatever symbol the user said (BTC, ETH, DOGE, AVAX, BONK, DEGEN, PEPE, FLOKI, WIF, etc.)
   - Accept ANY cryptocurrency name or symbol mentioned, including meme coins and new tokens
   - DO NOT change or substitute the cryptocurrency name

2. **symbol** (optional): The cryptocurrency symbol if mentioned or mappable
   - Common mappings: Bitcoin→BTC, Ethereum→ETH, Dogecoin→DOGE, Avalanche→AVAX, Solana→SOL

3. **analysisType** (optional, default: "current"): What type of price analysis they want
   - "current" - just the current price (default)
   - "trend" - price trends and changes  
   - "technical" - technical analysis
   - "all" - comprehensive analysis

CRITICAL: Only extract if this is clearly a PRICE request, not a token search/database request.

IMPORTANT: Accept ANY cryptocurrency name or symbol mentioned by the user, including:
- Major coins: Bitcoin, Ethereum, Solana, etc.
- Altcoins: Cardano, Polygon, Chainlink, etc.  
- Meme coins: DOGE, SHIB, PEPE, BONK, FLOKI, DEGEN, WIF, etc.
- New/obscure tokens: Any symbol or name the user mentions

Extract the price request details from the user's message and respond in XML format:

<response>
<cryptocurrency>exact cryptocurrency name or symbol from user's message</cryptocurrency>
<symbol>token symbol if mentioned</symbol>
<analysisType>current|trend|technical|all</analysisType>
</response>
`;

/**
 * Analyze price data based on analysis type
 */
function analyzePriceData(priceData: any, analysisType: string = "current"): any {
    const price = priceData.PRICE || priceData.CURRENT_PRICE;
    const change24h = priceData.CHANGE_24H || priceData.PRICE_CHANGE_24H || 0;
    const changePercent24h = priceData.CHANGE_PERCENT_24H || priceData.PRICE_CHANGE_PERCENT_24H || 0;
    const volume24h = priceData.VOLUME_24H || priceData.TRADING_VOLUME_24H;
    const marketCap = priceData.MARKET_CAP;

    const baseAnalysis = {
        current_price: price,
        change_24h: change24h,
        change_percent_24h: changePercent24h,
        trend: change24h >= 0 ? "bullish" : "bearish",
        volatility: Math.abs(changePercent24h) > 5 ? "high" : "moderate",
        market_cap: marketCap,
        volume_24h: volume24h
    };

    switch (analysisType) {
        case "trend":
            return {
                ...baseAnalysis,
                trend_analysis: {
                    momentum: Math.abs(changePercent24h) > 10 ? "strong" : "weak",
                    direction: change24h >= 0 ? "upward" : "downward",
                    volatility_level: Math.abs(changePercent24h) > 15 ? "very high" : Math.abs(changePercent24h) > 5 ? "high" : "normal"
                }
            };

        case "technical":
            return {
                ...baseAnalysis,
                technical_indicators: {
                    price_momentum: changePercent24h > 5 ? "bullish" : changePercent24h < -5 ? "bearish" : "neutral",
                    volume_analysis: volume24h ? "active trading" : "low volume",
                    market_sentiment: change24h >= 0 ? "positive" : "negative"
                }
            };

        case "all":
            return {
                ...baseAnalysis,
                comprehensive_analysis: {
                    price_action: change24h >= 0 ? "gaining" : "declining",
                    market_position: marketCap ? "established" : "emerging",
                    trading_activity: volume24h ? "active" : "quiet",
                    investor_sentiment: changePercent24h > 0 ? "optimistic" : "cautious"
                }
            };

        default: // "current"
            return baseAnalysis;
    }
}

/**
 * Format price response based on analysis type
 */
function formatPriceResponse(priceData: any, tokenInfo: any, analysisType: string = "current"): string {
    const symbol = priceData.SYMBOL || priceData.TOKEN_SYMBOL || tokenInfo.SYMBOL || tokenInfo.TOKEN_SYMBOL;
    const name = priceData.NAME || priceData.TOKEN_NAME || tokenInfo.NAME || tokenInfo.TOKEN_NAME;
    const price = priceData.PRICE || priceData.CURRENT_PRICE;
    const change24h = priceData.CHANGE_24H || priceData.PRICE_CHANGE_24H;
    const changePercent24h = priceData.CHANGE_PERCENT_24H || priceData.PRICE_CHANGE_PERCENT_24H;
    const volume24h = priceData.VOLUME_24H || priceData.TRADING_VOLUME_24H;
    const marketCap = priceData.MARKET_CAP;
    
    let response = `💰 **${name} (${symbol}) Price Information**\n\n`;
    
    response += `🎯 **Current Price**: ${formatCurrency(price)}\n`;
    
    if (change24h !== undefined && change24h !== null) {
        const changeEmoji = change24h >= 0 ? "📈" : "📉";
        response += `${changeEmoji} **24h Change**: ${formatCurrency(change24h)} (${formatPercentage(changePercent24h || 0)})\n`;
    }

    // Add analysis based on type
    switch (analysisType) {
        case "trend":
            response += `\n📊 **Trend Analysis**:\n`;
            response += `• Momentum: ${Math.abs(changePercent24h || 0) > 10 ? "Strong" : "Weak"}\n`;
            response += `• Direction: ${(change24h || 0) >= 0 ? "Upward" : "Downward"}\n`;
            response += `• Volatility: ${Math.abs(changePercent24h || 0) > 15 ? "Very High" : Math.abs(changePercent24h || 0) > 5 ? "High" : "Normal"}\n`;
            break;

        case "technical":
            response += `\n🔍 **Technical Analysis**:\n`;
            response += `• Price Momentum: ${(changePercent24h || 0) > 5 ? "Bullish" : (changePercent24h || 0) < -5 ? "Bearish" : "Neutral"}\n`;
            response += `• Market Sentiment: ${(change24h || 0) >= 0 ? "Positive" : "Negative"}\n`;
            if (volume24h) response += `• Trading Activity: Active\n`;
            break;

        case "all":
            if (volume24h) {
                response += `📊 **24h Volume**: ${formatCurrency(volume24h)}\n`;
            }
            if (marketCap) {
                response += `🏦 **Market Cap**: ${formatCurrency(marketCap)}\n`;
            }
            response += `\n📈 **Market Analysis**:\n`;
            response += `• Price Action: ${(change24h || 0) >= 0 ? "Gaining" : "Declining"}\n`;
            response += `• Volatility: ${Math.abs(changePercent24h || 0) > 5 ? "High" : "Moderate"}\n`;
            response += `• Investor Sentiment: ${(changePercent24h || 0) > 0 ? "Optimistic" : "Cautious"}\n`;
            break;
    }
    
    // Add timestamp and data source
    response += `\n📊 **Data Source**: TokenMetrics API (Real-time)\n`;
    response += `⏰ **Updated**: ${new Date().toLocaleString()}\n`;
    
    return response;
}

export const getPriceAction: Action = {
    name: "GET_PRICE_TOKENMETRICS",
    description: "Get real-time cryptocurrency price data and analysis from TokenMetrics with AI-powered natural language processing",
    similes: [
        "get price",
        "price check",
        "crypto price",
        "current price",
        "price data",
        "market price",
        "price analysis",
        "what's the price",
        "how much is",
        "price of",
        "check price",
        "show price",
        "get current price",
        "market value",
        "token value",
        "crypto value"
    ],
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "What's the price of Bitcoin?"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll get the current Bitcoin price from TokenMetrics for you.",
                    action: "GET_PRICE_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "How much is Ethereum worth right now?"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "Let me fetch the latest Ethereum price data from TokenMetrics.",
                    action: "GET_PRICE_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Get me Solana price trends"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll retrieve Solana price data with trend analysis from TokenMetrics.",
                    action: "GET_PRICE_TOKENMETRICS"
                }
            }
        ]
    ],

    validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        try {
            validateAndGetApiKey(runtime);
            return true;
        } catch (error) {
            elizaLogger.error("❌ Price action validation failed:", error);
            return false;
        }
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<ActionResult> => {
        try {
            const requestId = generateRequestId();
            elizaLogger.log(`[${requestId}] Processing price request...`);
            elizaLogger.log(`[${requestId}] 🔍 DEBUG: User message content: "${message.content.text}"`);
            
            // FORCE VISIBLE LOGGING
            console.log(`\n🔍 PRICE ACTION DEBUG [${requestId}]:`);
            console.log(`📝 User message: "${message.content.text}"`);

            // Ensure we have a proper state (ElizaOS 1.x pattern)
            let currentState = state;
            if (!currentState) {
                currentState = await runtime.composeState(message);
            } else {
                currentState = await runtime.composeState(message, ["RECENT_MESSAGES"]);
            }

            // Extract request using standardized AI helper with user message injection
            const userMessage = message.content?.text || "";
            
            // Inject user message directly into template
            const enhancedTemplate = PRICE_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;

            let priceRequest: any = await extractTokenMetricsRequest(
                runtime,
                message,
                currentState,
                enhancedTemplate,
                PriceRequestSchema,
                requestId
            );

            elizaLogger.log(`[${requestId}] 🎯 DEBUG: AI Extracted request:`, JSON.stringify(priceRequest, null, 2));
            
            // FORCE VISIBLE LOGGING
            console.log(`🎯 Extracted request:`, priceRequest);

            if (!priceRequest) {
                elizaLogger.log(`[${requestId}] ❌ DEBUG: AI extraction returned null - analyzing with fallback...`);
                console.log(`❌ AI extraction failed, trying fallback...`);
                
                // Try fallback extraction using dynamic pattern matching
                const cryptoFromText = extractCryptocurrencySimple(message.content?.text || '');
                
                if (!cryptoFromText) {
                    elizaLogger.log(`[${requestId}] ❌ DEBUG: Fallback extraction also failed`);
                    console.log(`❌ Fallback extraction failed too`);
                    console.log(`🔚 END DEBUG [${requestId}]\n`);
                    
                    if (callback) {
                        await callback({
                            text: `❌ I couldn't identify which cryptocurrency you're asking about.

I can get price data for any cryptocurrency supported by TokenMetrics including:
• Bitcoin (BTC), Ethereum (ETH), Solana (SOL)
• Cardano (ADA), Polygon (MATIC), Chainlink (LINK)
• Uniswap (UNI), Avalanche (AVAX), Polkadot (DOT)
• Dogecoin (DOGE), XRP, Litecoin (LTC)
• And many more!

Try asking: "What's the price of Bitcoin?" or "How much is ETH worth?"`,
                            content: { 
                                error: "No cryptocurrency identified",
                                request_id: requestId,
                                debug_extraction: priceRequest
                            }
                        });
                    }
                    return createActionResult({
                        success: false,
                        text: `❌ I couldn't identify which cryptocurrency you're asking about.

I can get price data for any cryptocurrency supported by TokenMetrics including:
• Bitcoin (BTC), Ethereum (ETH), Solana (SOL)
• Cardano (ADA), Polygon (MATIC), Chainlink (LINK)
• Uniswap (UNI), Avalanche (AVAX), Polkadot (DOT)
• Dogecoin (DOGE), XRP, Litecoin (LTC)
• And many more!

Try asking: "What's the price of Bitcoin?" or "How much is ETH worth?"`,
                        error: "No cryptocurrency identified"
                    });
                }
                
                // Use fallback data
                priceRequest = {
                    cryptocurrency: cryptoFromText,
                    analysisType: "current"
                };
                elizaLogger.log(`[${requestId}] ✅ DEBUG: Fallback extraction successful: "${cryptoFromText}"`);
                console.log(`✅ Fallback found: "${cryptoFromText}"`);
            }

            // Determine which cryptocurrency to resolve
            const cryptoToResolve = priceRequest.cryptocurrency || priceRequest.symbol;
            
            if (!cryptoToResolve) {
                elizaLogger.log(`[${requestId}] ❌ DEBUG: No cryptocurrency to resolve after extraction`);
                console.log(`❌ No cryptocurrency found after all extraction attempts`);
                console.log(`🔚 END DEBUG [${requestId}]\n`);
                
                if (callback) {
                    await callback({
                        text: `❌ I couldn't identify which cryptocurrency you're asking about.

I can get price data for any cryptocurrency supported by TokenMetrics including:
• Bitcoin (BTC), Ethereum (ETH), Solana (SOL)
• Cardano (ADA), Polygon (MATIC), Chainlink (LINK)
• Uniswap (UNI), Avalanche (AVAX), Polkadot (DOT)
• Dogecoin (DOGE), XRP, Litecoin (LTC)
• And many more!

Try asking: "What's the price of Bitcoin?" or "How much is ETH worth?"`,
                        content: { 
                            error: "No cryptocurrency identified",
                            request_id: requestId,
                            debug_extraction: priceRequest
                        }
                    });
                }
                return createActionResult({
                    success: false,
                    text: `❌ I couldn't identify which cryptocurrency you're asking about.

I can get price data for any cryptocurrency supported by TokenMetrics including:
• Bitcoin (BTC), Ethereum (ETH), Solana (SOL)
• Cardano (ADA), Polygon (MATIC), Chainlink (LINK)
• Uniswap (UNI), Avalanche (AVAX), Polkadot (DOT)
• Dogecoin (DOGE), XRP, Litecoin (LTC)
• And many more!

Try asking: "What's the price of Bitcoin?" or "How much is ETH worth?"`,
                    error: "No cryptocurrency identified"
                });
            }

            // Use FULLY DYNAMIC token search via /tokens endpoint
            elizaLogger.log(`[${requestId}] 🔍 DEBUG: Starting DYNAMIC token search for: "${cryptoToResolve}"`);
            console.log(`🔍 Starting DYNAMIC token search for: "${cryptoToResolve}"`);
            
            const tokenInfo = await searchTokenDynamically(cryptoToResolve, runtime);
            elizaLogger.log(`[${requestId}] 🎯 DEBUG: Dynamic token search result:`, tokenInfo ? {
                name: tokenInfo.TOKEN_NAME,
                symbol: tokenInfo.TOKEN_SYMBOL,
                id: tokenInfo.TOKEN_ID
            } : 'null');
            
            // FORCE VISIBLE LOGGING
            console.log(`🎯 Token found dynamically:`, tokenInfo ? {
                name: tokenInfo.TOKEN_NAME,
                symbol: tokenInfo.TOKEN_SYMBOL,
                id: tokenInfo.TOKEN_ID
            } : 'null');
            console.log(`🔚 END DEBUG [${requestId}]\n`);
            
            if (!tokenInfo) {
                elizaLogger.log(`[${requestId}] ❌ DEBUG: Token resolution failed for: "${cryptoToResolve}"`);
                if (callback) {
                    await callback({
                        text: `❌ I couldn't find information for "${cryptoToResolve}".

This might be:
• A very new token not yet in TokenMetrics database
• An alternative name or symbol I don't recognize
• A spelling variation

Try using the official name, such as:
• Bitcoin, Ethereum, Solana, Cardano, Dogecoin
• Uniswap, Chainlink, Polygon, Avalanche
• Or check the exact spelling on CoinMarketCap`,
                        content: { 
                            error: "Token not found",
                            requested_token: cryptoToResolve,
                            request_id: requestId,
                            debug_extraction: priceRequest
                        }
                    });
                }
                return createActionResult({
                    success: false,
                    text: `❌ I couldn't find information for "${cryptoToResolve}".

This might be:
• A very new token not yet in TokenMetrics database
• An alternative name or symbol I don't recognize
• A spelling variation

Try using the official name, such as:
• Bitcoin, Ethereum, Solana, Cardano, Dogecoin
• Uniswap, Chainlink, Polygon, Avalanche
• Or check the exact spelling on CoinMarketCap`,
                    error: "Token not found"
                });
            }

            elizaLogger.log(`[${requestId}] ✅ DEBUG: Successfully resolved token: ${tokenInfo.TOKEN_NAME || tokenInfo.NAME} (${tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL}) - ID: ${tokenInfo.TOKEN_ID}`);

            // Build API parameters
            const apiParams: any = {
                token_id: tokenInfo.TOKEN_ID,
                limit: 1
            };

            // Fetch price data
            const response = await callTokenMetricsAPI('/v2/price', apiParams, runtime);
            elizaLogger.log(`[${requestId}] API response received`);

            const priceData = Array.isArray(response) ? response[0] : response.data?.[0] || response;
            
            if (!priceData) {
                if (callback) {
                    await callback({
                        text: `❌ No price data available for ${tokenInfo.TOKEN_NAME || tokenInfo.NAME} at the moment.

This could be due to:
• Temporary data unavailability
• Market data processing delays
• Token not actively traded

Please try again in a few moments.`,
                        content: { 
                            error: "No price data",
                            token: tokenInfo,
                            request_id: requestId
                        }
                    });
                }
                return createActionResult({
                    success: false,
                    text: `❌ No price data available for ${tokenInfo.TOKEN_NAME || tokenInfo.NAME} at the moment.

This could be due to:
• Temporary data unavailability
• Market data processing delays
• Token not actively traded

Please try again in a few moments.`,
                    error: "No price data"
                });
            }

            // Analyze and format response
            const analysisType = priceRequest.analysisType || "current";
            const analysis = analyzePriceData(priceData, analysisType);
            const responseText = formatPriceResponse(priceData, tokenInfo, analysisType);

            elizaLogger.log(`[${requestId}] Successfully processed price request`);

            if (callback) {
                await callback({
                    text: responseText,
                    content: {
                        success: true,
                        request_id: requestId,
                        token_info: tokenInfo,
                        price_data: priceData,
                        analysis: analysis,
                        metadata: {
                            endpoint: "price",
                            analysis_type: analysisType,
                            data_source: "TokenMetrics API",
                            timestamp: new Date().toISOString()
                        }
                    }
                });
            }

            return createActionResult({
                success: true,
                text: responseText,
                data: {
                    token_info: tokenInfo,
                    price_data: priceData,
                    analysis: analysis,
                    source: "TokenMetrics Price API",
                    request_id: requestId
                }
            });

        } catch (error) {
            elizaLogger.error("❌ Error in price action:", error);
            
            if (callback) {
                await callback({
                    text: `❌ I encountered an error while fetching price data: ${error instanceof Error ? error.message : 'Unknown error'}

This could be due to:
• Network connectivity issues
• TokenMetrics API service problems
• Invalid API key or authentication issues
• Temporary system overload

Please check your TokenMetrics API key configuration and try again.`,
                    content: { 
                        error: error instanceof Error ? error.message : 'Unknown error',
                        troubleshooting: true
                    }
                });
            }
            
            return createActionResult({
                success: false,
                text: `❌ I encountered an error while fetching price data: ${error instanceof Error ? error.message : 'Unknown error'}

This could be due to:
• Network connectivity issues
• TokenMetrics API service problems
• Invalid API key or authentication issues
• Temporary system overload

Please check your TokenMetrics API key configuration and try again.`,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
};
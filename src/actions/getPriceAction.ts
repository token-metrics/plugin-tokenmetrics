import type { Action, ActionExample, HandlerCallback, IAgentRuntime, Memory, State } from "@elizaos/core";
import { elizaLogger } from "@elizaos/core";
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
 * TokenMetrics Price Action - Updated with standardized AI helper pattern
 */

/**
 * Simple regex-based extraction as fallback
 */
function extractCryptocurrencySimple(text: string): string | null {
    const message = text.toLowerCase();
    
    // Common cryptocurrency patterns
    const patterns = [
        // Full names
        /\b(bitcoin|btc)\b/i,
        /\b(ethereum|eth)\b/i,
        /\b(dogecoin|doge)\b/i,
        /\b(avalanche|avax)\b/i,
        /\b(solana|sol)\b/i,
        /\b(cardano|ada)\b/i,
        /\b(polygon|matic)\b/i,
        /\b(chainlink|link)\b/i,
        /\b(uniswap|uni)\b/i,
        /\b(polkadot|dot)\b/i,
        /\b(litecoin|ltc)\b/i,
        /\b(ripple|xrp)\b/i,
        /\b(binance coin|bnb)\b/i,
        /\b(shiba inu|shib)\b/i,
        /\b(pepe)\b/i,
        /\b(cosmos|atom)\b/i,
        /\b(near protocol|near)\b/i,
        /\b(fantom|ftm)\b/i,
        /\b(algorand|algo)\b/i,
        /\b(vechain|vet)\b/i,
        /\b(internet computer|icp)\b/i,
        /\b(flow)\b/i,
        /\b(the sandbox|sand)\b/i,
        /\b(decentraland|mana)\b/i,
        /\b(cronos|cro)\b/i,
        /\b(apecoin|ape)\b/i
    ];
    
    // Mapping from regex matches to proper names
    const nameMap: Record<string, string> = {
        'bitcoin': 'Bitcoin', 'btc': 'Bitcoin',
        'ethereum': 'Ethereum', 'eth': 'Ethereum',
        'dogecoin': 'Dogecoin', 'doge': 'Dogecoin',
        'avalanche': 'Avalanche', 'avax': 'Avalanche',
        'solana': 'Solana', 'sol': 'Solana',
        'cardano': 'Cardano', 'ada': 'Cardano',
        'polygon': 'Polygon', 'matic': 'Polygon',
        'chainlink': 'Chainlink', 'link': 'Chainlink',
        'uniswap': 'Uniswap', 'uni': 'Uniswap',
        'polkadot': 'Polkadot', 'dot': 'Polkadot',
        'litecoin': 'Litecoin', 'ltc': 'Litecoin',
        'ripple': 'XRP', 'xrp': 'XRP',
        'binance coin': 'BNB', 'bnb': 'BNB',
        'shiba inu': 'Shiba Inu', 'shib': 'Shiba Inu',
        'pepe': 'Pepe',
        'cosmos': 'Cosmos', 'atom': 'Cosmos',
        'near protocol': 'NEAR Protocol', 'near': 'NEAR Protocol',
        'fantom': 'Fantom', 'ftm': 'Fantom',
        'algorand': 'Algorand', 'algo': 'Algorand',
        'vechain': 'VeChain', 'vet': 'VeChain',
        'internet computer': 'Internet Computer', 'icp': 'Internet Computer',
        'flow': 'Flow',
        'the sandbox': 'The Sandbox', 'sand': 'The Sandbox',
        'decentraland': 'Decentraland', 'mana': 'Decentraland',
        'cronos': 'Cronos', 'cro': 'Cronos',
        'apecoin': 'ApeCoin', 'ape': 'ApeCoin'
    };
    
    for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match) {
            const found = match[0].toLowerCase();
            return nameMap[found] || found;
        }
    }
    
    return null;
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
   - Extract whatever cryptocurrency name the user said (Bitcoin, Ethereum, Dogecoin, Avalanche, etc.)
   - Extract whatever symbol the user said (BTC, ETH, DOGE, AVAX, etc.)
   - DO NOT change or substitute the cryptocurrency name

2. **symbol** (optional): The cryptocurrency symbol if mentioned or mappable
   - Common mappings: Bitcoin→BTC, Ethereum→ETH, Dogecoin→DOGE, Avalanche→AVAX, Solana→SOL

3. **analysisType** (optional, default: "current"): What type of price analysis they want
   - "current" - just the current price (default)
   - "trend" - price trends and changes  
   - "technical" - technical analysis
   - "all" - comprehensive analysis

CRITICAL: Only extract if this is clearly a PRICE request, not a token search/database request.

Extract the price request details from the user's message.
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
                user: "{{user1}}",
                content: {
                    text: "What's the price of Bitcoin?"
                }
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll get the current Bitcoin price from TokenMetrics for you.",
                    action: "GET_PRICE_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "How much is Ethereum worth right now?"
                }
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Let me fetch the latest Ethereum price data from TokenMetrics.",
                    action: "GET_PRICE_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get me Solana price trends"
                }
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll retrieve Solana price data with trend analysis from TokenMetrics.",
                    action: "GET_PRICE_TOKENMETRICS"
                }
            }
        ]
    ] as ActionExample[][],

    validate: async (runtime: IAgentRuntime, message: Memory) => {
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
        state: State | undefined,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        try {
            const requestId = generateRequestId();
            elizaLogger.log(`[${requestId}] Processing price request...`);
            elizaLogger.log(`[${requestId}] 🔍 DEBUG: User message content: "${message.content.text}"`);
            
            // FORCE VISIBLE LOGGING
            console.log(`\n🔍 PRICE ACTION DEBUG [${requestId}]:`);
            console.log(`📝 User message: "${message.content.text}"`);

            // Extract request using standardized AI helper
            const priceRequest = await extractTokenMetricsRequest(
                runtime,
                message,
                state || await runtime.composeState(message),
                PRICE_EXTRACTION_TEMPLATE,
                PriceRequestSchema,
                requestId
            );

            elizaLogger.log(`[${requestId}] 🎯 DEBUG: AI Extracted request:`, JSON.stringify(priceRequest, null, 2));
            
            // FORCE VISIBLE LOGGING
            console.log(`🎯 AI Extracted:`, JSON.stringify(priceRequest, null, 2));

            // Determine the cryptocurrency to look up
            let cryptoToResolve = priceRequest.cryptocurrency || priceRequest.symbol;
            
            // FALLBACK: Use regex-based extraction if AI extraction seems wrong
            const regexExtracted = extractCryptocurrencySimple(message.content.text);
            if (regexExtracted && cryptoToResolve && cryptoToResolve.toLowerCase() !== regexExtracted.toLowerCase()) {
                elizaLogger.log(`[${requestId}] 🔄 DEBUG: AI extracted "${cryptoToResolve}" but regex found "${regexExtracted}" - using regex result`);
                console.log(`🔄 AI vs Regex mismatch: AI="${cryptoToResolve}", Regex="${regexExtracted}" - using Regex`);
                cryptoToResolve = regexExtracted;
            } else if (!cryptoToResolve && regexExtracted) {
                elizaLogger.log(`[${requestId}] 🔄 DEBUG: AI extraction failed, using regex result: "${regexExtracted}"`);
                console.log(`🔄 AI extraction failed, using regex result: "${regexExtracted}"`);
                cryptoToResolve = regexExtracted;
            }
            
            elizaLogger.log(`[${requestId}] 🔍 DEBUG: Crypto to resolve: "${cryptoToResolve}"`);
            
            // FORCE VISIBLE LOGGING
            console.log(`🔍 Crypto to resolve: "${cryptoToResolve}"`);
            
            if (!cryptoToResolve) {
                elizaLogger.log(`[${requestId}] ❌ DEBUG: No cryptocurrency identified from extraction`);
                console.log(`❌ No cryptocurrency identified from extraction`);
                if (callback) {
                    callback({
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
                return false;
            }

            // Resolve token using smart resolution
            elizaLogger.log(`[${requestId}] 🔍 DEBUG: Starting token resolution for: "${cryptoToResolve}"`);
            console.log(`🔍 Starting token resolution for: "${cryptoToResolve}"`);
            
            const tokenInfo = await resolveTokenSmart(cryptoToResolve, runtime);
            elizaLogger.log(`[${requestId}] 🎯 DEBUG: Token resolution result:`, tokenInfo ? {
                name: tokenInfo.TOKEN_NAME || tokenInfo.NAME,
                symbol: tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL,
                id: tokenInfo.TOKEN_ID
            } : 'null');
            
            // FORCE VISIBLE LOGGING
            console.log(`🎯 Token resolved:`, tokenInfo ? {
                name: tokenInfo.TOKEN_NAME || tokenInfo.NAME,
                symbol: tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL,
                id: tokenInfo.TOKEN_ID
            } : 'null');
            console.log(`🔚 END DEBUG [${requestId}]\n`);
            
            if (!tokenInfo) {
                elizaLogger.log(`[${requestId}] ❌ DEBUG: Token resolution failed for: "${cryptoToResolve}"`);
                if (callback) {
                    callback({
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
                return false;
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
                    callback({
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
                return false;
            }

            // Analyze and format response
            const analysisType = priceRequest.analysisType || "current";
            const analysis = analyzePriceData(priceData, analysisType);
            const responseText = formatPriceResponse(priceData, tokenInfo, analysisType);

            elizaLogger.log(`[${requestId}] Successfully processed price request`);

            if (callback) {
                callback({
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

            return true;

        } catch (error) {
            elizaLogger.error("❌ Error in price action:", error);
            
            if (callback) {
                callback({
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
            
            return false;
        }
    }
};
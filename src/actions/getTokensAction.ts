import {
    type Action,
    type ActionResult,
    type IAgentRuntime,
    type Memory,
    type State,
    type HandlerCallback,
    type ActionExample,
    elizaLogger,
    composePromptFromState,
    parseKeyValueXml,
    ModelType,
    createActionResult
} from "@elizaos/core";
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

// Template for extracting tokens information from conversations (Updated to XML format)
const tokensTemplate = `Extract token search request information from the message.

IMPORTANT: This is for TOKEN SEARCH/DATABASE QUERIES, NOT price requests.

Based on the conversation context, identify what token information the user is requesting.

Instructions:
Look for TOKEN SEARCH/DATABASE requests, such as:
- Token listing requests ("list tokens", "available tokens", "supported cryptocurrencies")
- Token database searches ("search for [token] information", "find token details", "lookup token")
- Category filtering ("show me DeFi tokens", "gaming tokens", "meme tokens")
- Exchange filtering ("tokens on Binance", "Coinbase supported tokens")
- Market filtering ("high market cap tokens", "tokens by volume")

EXAMPLES OF TOKEN SEARCH REQUESTS:
- "List all available tokens"
- "Show me DeFi tokens"
- "Find token information for Bitcoin"
- "Search token database for Ethereum"
- "Get supported cryptocurrencies list"
- "Find token details for Solana"
- "Show me tokens with high market cap"
- "List tokens in gaming category"
- "Search for Avalanche token information"
- "Find SOL token details"

DO NOT MATCH PRICE REQUESTS:
- "What's the price of Bitcoin?" (this is a PRICE request)
- "How much is ETH worth?" (this is a PRICE request)
- "Get Bitcoin price" (this is a PRICE request)
- "Show me DOGE price" (this is a PRICE request)

Respond with an XML block containing only the extracted values:

<response>
<cryptocurrency>specific token name if mentioned</cryptocurrency>
<category>category filter if mentioned (e.g., DeFi, gaming, meme)</category>
<exchange>exchange filter if mentioned</exchange>
<search_type>general or specific or category or exchange</search_type>
<market_cap_filter>high, medium, low if mentioned</market_cap_filter>
<limit>number of results requested (default 20)</limit>
</response>`;

// Schema for the extracted data
const TokensRequestSchema = z.object({
    cryptocurrency: z.string().nullable().describe("The specific cryptocurrency symbol or name mentioned"),
    category: z.string().nullable().describe("Token category filter (e.g., defi, layer-1, gaming, meme)"),
    exchange: z.string().nullable().describe("Exchange filter"),
    market_filter: z.string().nullable().describe("Market cap, volume, or other filters"),
    search_type: z.enum(["all", "specific", "category", "exchange", "filtered"]).describe("Type of token search"),
    confidence: z.number().min(0).max(1).describe("Confidence in extraction")
});

type TokensRequest = z.infer<typeof TokensRequestSchema>;

/**
 * Normalize cryptocurrency names to their official names for better API matching
 */
function normalizeCryptocurrencyName(name: string): string {
    const nameMap: Record<string, string> = {
        // Common variations to official names
        'btc': 'Bitcoin',
        'bitcoin': 'Bitcoin',
        'eth': 'Ethereum', 
        'ethereum': 'Ethereum',
        'sol': 'Solana',
        'solana': 'Solana',
        'doge': 'Dogecoin',
        'dogecoin': 'Dogecoin',
        'avax': 'Avalanche',
        'avalanche': 'Avalanche',
        'ada': 'Cardano',
        'cardano': 'Cardano',
        'matic': 'Polygon',
        'polygon': 'Polygon',
        'dot': 'Polkadot',
        'polkadot': 'Polkadot',
        'link': 'Chainlink',
        'chainlink': 'Chainlink',
        'uni': 'Uniswap',
        'uniswap': 'Uniswap',
        'ltc': 'Litecoin',
        'litecoin': 'Litecoin',
        'xrp': 'XRP',
        'ripple': 'XRP',
        'bnb': 'BNB',
        'binance coin': 'BNB'
    };
    
    const normalized = nameMap[name.toLowerCase()];
    return normalized || name; // Return original if no mapping found
}

/**
 * Fetch tokens data from TokenMetrics API
 */
async function fetchTokens(params: Record<string, any>, runtime: IAgentRuntime): Promise<any> {
    elizaLogger.log(`📡 Fetching tokens with params:`, params);
    
    try {
        const data = await callTokenMetricsAPI('/v2/tokens', params, runtime);
        
        if (!data) {
            throw new Error("No data received from tokens API");
        }
        
        elizaLogger.log(`✅ Successfully fetched tokens data`);
        return data;
        
    } catch (error) {
        elizaLogger.error("❌ Error fetching tokens:", error);
        throw error;
    }
}

/**
 * Format tokens response for user
 */
function formatTokensResponse(data: any[], searchType: string, filters?: any): string {
    if (!data || data.length === 0) {
        return "❌ No tokens found for the specified criteria.";
    }

    const tokens = Array.isArray(data) ? data : [data];
    const tokenCount = tokens.length;
    
    let response = `📊 **TokenMetrics Supported Tokens**\n\n`;
    
    if (filters?.cryptocurrency) {
        response += `🎯 **Search**: ${filters.cryptocurrency}\n`;
    }
    if (filters?.category) {
        response += `📂 **Category**: ${filters.category}\n`;
    }
    if (filters?.exchange) {
        response += `🏪 **Exchange**: ${filters.exchange}\n`;
    }
    
    response += `📈 **Total Found**: ${tokenCount} tokens\n\n`;

    // Show token details
    const displayTokens = tokens.slice(0, 10); // Show first 10 tokens
    
    response += `🔍 **Token Details**:\n`;
    displayTokens.forEach((token, index) => {
        const symbol = token.TOKEN_SYMBOL || token.SYMBOL || 'N/A';
        const name = token.TOKEN_NAME || token.NAME || 'Unknown';
        const tokenId = token.TOKEN_ID || token.ID || 'N/A';
        const category = token.CATEGORY || 'N/A';
        
        response += `${index + 1}. **${symbol}** - ${name}\n`;
        response += `   • Token ID: ${tokenId}\n`;
        if (category !== 'N/A') {
            response += `   • Category: ${category}\n`;
        }
        if (token.MARKET_CAP) {
            response += `   • Market Cap: ${formatCurrency(token.MARKET_CAP)}\n`;
        }
        if (token.PRICE) {
            response += `   • Price: ${formatCurrency(token.PRICE)}\n`;
        }
        response += `\n`;
    });

    if (tokenCount > 10) {
        response += `... and ${tokenCount - 10} more tokens\n\n`;
    }

    // Category analysis if multiple tokens
    if (tokenCount > 1) {
        const categories = tokens
            .map(t => t.CATEGORY)
            .filter(c => c)
            .reduce((acc, cat) => {
                acc[cat] = (acc[cat] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        if (Object.keys(categories).length > 0) {
            response += `📊 **Category Distribution**:\n`;
            Object.entries(categories)
                .sort(([,a], [,b]) => (b as number) - (a as number))
                .slice(0, 5)
                .forEach(([category, count]) => {
                    response += `• ${category}: ${count} tokens\n`;
                });
            response += `\n`;
        }
    }

    response += `💡 **Usage Tips**:\n`;
    response += `• Use Token ID for precise API calls\n`;
    response += `• Symbol format: ${displayTokens[0]?.TOKEN_SYMBOL || 'BTC'} (standard format)\n`;
    response += `• Categories help filter by sector\n`;
    response += `• All tokens are actively tracked by TokenMetrics\n\n`;

    response += `📊 **Data Source**: TokenMetrics Token Database\n`;
    response += `⏰ **Updated**: ${new Date().toLocaleString()}\n`;
    
    return response;
}

/**
 * Analyze tokens data
 */
function analyzeTokens(data: any[]): any {
    if (!data || data.length === 0) {
        return { error: "No data to analyze" };
    }

    const tokens = Array.isArray(data) ? data : [data];
    
    // Category analysis
    const categories = tokens
        .map(t => t.CATEGORY)
        .filter(c => c)
        .reduce((acc, cat) => {
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

    // Exchange analysis
    const exchanges = tokens
        .map(t => t.EXCHANGE)
        .filter(e => e)
        .reduce((acc, ex) => {
            acc[ex] = (acc[ex] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

    const analysis = {
        total_tokens: tokens.length,
        categories: categories,
        exchanges: exchanges,
        top_tokens: tokens.slice(0, 10).map(t => ({
            symbol: t.TOKEN_SYMBOL || t.SYMBOL,
            name: t.TOKEN_NAME || t.NAME,
            token_id: t.TOKEN_ID || t.ID,
            category: t.CATEGORY,
            market_cap: t.MARKET_CAP,
            price: t.PRICE
        })),
        diversity_score: Object.keys(categories).length
    };

    return analysis;
}

export const getTokensAction: Action = {
    name: "GET_TOKENS_TOKENMETRICS",
    similes: [
        "GET_TOKENS",
        "LIST_TOKENS", 
        "GET_SUPPORTED_TOKENS",
        "FIND_TOKENS",
        "AVAILABLE_TOKENS",
        "SUPPORTED_CRYPTOCURRENCIES",
        "TOKEN_LIST",
        "SEARCH_TOKENS",
        "TOKEN_SEARCH",
        "FIND_TOKEN_INFO",
        "TOKEN_DETAILS",
        "TOKEN_DATABASE",
        "LOOKUP_TOKEN",
        "search for token",
        "find token",
        "token information",
        "token details",
        "search token",
        "lookup token",
        "find token info",
        "search for",
        "find information",
        "token database",
        "supported tokens",
        "available tokens",
        "list tokens"
    ],
    description: "Get list of supported cryptocurrencies and tokens from TokenMetrics database - for searching token information, not prices",
    
    validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        elizaLogger.log("🔍 Validating getTokensAction (1.x)");
        
        try {
            validateAndGetApiKey(runtime);
            return true;
        } catch (error) {
            elizaLogger.error("❌ Validation failed:", error);
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
        const requestId = generateRequestId();
        
        elizaLogger.log("🚀 Starting TokenMetrics tokens handler (1.x)");
        elizaLogger.log(`📝 Processing user message: "${message.content?.text || "No text content"}"`);
        elizaLogger.log(`🆔 Request ID: ${requestId}`);

        try {
            // STEP 1: Validate API key early
            validateAndGetApiKey(runtime);

            // Ensure we have a proper state
            if (!state) {
                state = await runtime.composeState(message);
            }

            // STEP 2: Extract request using AI helper
            const tokensRequest: any = await extractTokenMetricsRequest(
                runtime,
                message,
                state,
                tokensTemplate,
                TokensRequestSchema,
                requestId
            );

            elizaLogger.log(`🎯 AI extracted request: ${JSON.stringify(tokensRequest, null, 2)}`);
            elizaLogger.log(`🆔 Request ${requestId}: Extracted - ${JSON.stringify(tokensRequest)}`);

            // Handle case where AI couldn't extract meaningful request
            const hasValidCriteria = tokensRequest && (
                tokensRequest.cryptocurrency || 
                tokensRequest.category || 
                tokensRequest.exchange || 
                tokensRequest.search_type === "specific"
            );

            if (!hasValidCriteria) {
                elizaLogger.log(`🔄 No specific search criteria found, treating as general tokens list request`);
                elizaLogger.log(`🆔 Request ${requestId}: FALLBACK - General token list request`);
                
                // Default to general tokens list with reasonable defaults
                const fallbackRequest = {
                    list_request: true,
                    limit: 20,
                    page: 1,
                    confidence: 0.8
                };

                if (callback) {
                    // For general token list requests, provide a comprehensive overview
                    const response = await callTokenMetricsAPI('/v2/tokens', {
                        limit: fallbackRequest.limit,
                        page: fallbackRequest.page
                    }, runtime);

                    const tokens = Array.isArray(response) ? response : (response?.data || []);

                    if (tokens.length === 0) {
                        await callback({
                            text: `❌ Unable to fetch tokens data at the moment.

This could be due to:
• Temporary API service unavailability
• Network connectivity issues  
• API rate limiting

Please try again in a few moments.`,
                            content: { 
                                error: "No tokens data available",
                                request_id: requestId
                            }
                        });
                        return createActionResult({
                            success: false,
                            error: "No tokens data available"
                        });
                    }

                    const responseText = formatTokensResponse(tokens, "all", requestId);

                    await callback({
                        text: responseText,
                        content: {
                            success: true,
                            request_id: requestId,
                            tokens_data: tokens,
                            search_criteria: fallbackRequest,
                            metadata: {
                                endpoint: "tokens",
                                data_source: "TokenMetrics API",
                                timestamp: new Date().toISOString(),
                                total_tokens: tokens.length
                            }
                        }
                    });
                }

                return createActionResult({
                    success: true,
                    text: "Successfully retrieved tokens list",
                    data: {
                        tokens_data: [], // Return empty array for fallback
                        search_criteria: fallbackRequest,
                        metadata: {
                            endpoint: "tokens",
                            data_source: "TokenMetrics API",
                            timestamp: new Date().toISOString(),
                            total_tokens: 0
                        }
                    }
                });
            }

            // Use the extracted request for API call
            const apiParams: any = {
                limit: tokensRequest.limit || 20,
                page: tokensRequest.page || 1
            };

            // Add specific search parameters if provided
            if (tokensRequest.cryptocurrency) {
                // Use token_name parameter for more precise searches
                // This should return the actual token (e.g., Solana, Dogecoin) instead of multiple unrelated tokens
                apiParams.token_name = normalizeCryptocurrencyName(tokensRequest.cryptocurrency);
                elizaLogger.log(`🔍 Searching for specific token by name: ${apiParams.token_name}`);
                
                // Also try symbol search as fallback
                if (apiParams.token_name.length <= 5) {
                    // If it looks like a symbol (short), also search by symbol
                    apiParams.symbol = apiParams.token_name.toUpperCase();
                    elizaLogger.log(`🔍 Also searching by symbol: ${apiParams.symbol}`);
                }
            }

            // Handle category filtering
            if (tokensRequest.category) {
                apiParams.category = tokensRequest.category.toLowerCase();
                elizaLogger.log(`📂 Filtering by category: ${tokensRequest.category}`);
            }

            // Handle exchange filtering
            if (tokensRequest.exchange) {
                apiParams.exchange = tokensRequest.exchange;
                elizaLogger.log(`🏪 Filtering by exchange: ${tokensRequest.exchange}`);
            }

            // Adjust limit based on search type
            if (tokensRequest.search_type === "all") {
                apiParams.limit = 100; // Get more tokens for general listing
            } else if (tokensRequest.search_type === "specific") {
                apiParams.limit = 10; // Fewer for specific searches
            }

            elizaLogger.log(`📡 API parameters:`, apiParams);

            // STEP 5: Fetch tokens data
            elizaLogger.log(`📡 Fetching tokens data`);
            const tokensData = await fetchTokens(apiParams, runtime);
            
            if (!tokensData) {
                elizaLogger.log("❌ Failed to fetch tokens data");
                
                if (callback) {
                    await callback({
                        text: `❌ Unable to fetch tokens data at the moment.

This could be due to:
• TokenMetrics API connectivity issues
• Temporary service interruption  
• Rate limiting
• Invalid search criteria

Please try again in a few moments or try with different criteria.`,
                        content: { 
                            error: "API fetch failed",
                            request_id: requestId
                        }
                    });
                }
                return createActionResult({
                    success: false,
                    error: "API fetch failed"
                });
            }

            // Handle the response data
            const tokens = Array.isArray(tokensData) ? tokensData : (tokensData.data || []);
            
            elizaLogger.log(`🔍 Received ${tokens.length} tokens`);

            // STEP 6: Format and present the results
            const responseText = formatTokensResponse(tokens, tokensRequest.search_type, {
                cryptocurrency: tokensRequest.cryptocurrency,
                category: tokensRequest.category,
                exchange: tokensRequest.exchange
            });
            const analysis = analyzeTokens(tokens);

            elizaLogger.success("✅ Successfully processed tokens request");

            if (callback) {
                await callback({
                    text: responseText,
                    content: {
                        success: true,
                        tokens_data: tokens,
                        analysis: analysis,
                        source: "TokenMetrics Token Database",
                        request_id: requestId,
                        query_details: {
                            search_type: tokensRequest.search_type,
                            cryptocurrency: tokensRequest.cryptocurrency,
                            category: tokensRequest.category,
                            exchange: tokensRequest.exchange,
                            confidence: tokensRequest.confidence,
                            data_freshness: "real-time",
                            request_id: requestId,
                            extraction_method: "ai_with_cache_busting"
                        }
                    }
                });
            }

            return createActionResult({
                success: true,
                text: responseText,
                data: {
                    tokens_data: tokens,
                    analysis: analysis,
                    source: "TokenMetrics Token Database",
                    query_details: {
                        search_type: tokensRequest.search_type,
                        cryptocurrency: tokensRequest.cryptocurrency,
                        category: tokensRequest.category,
                        exchange: tokensRequest.exchange,
                        confidence: tokensRequest.confidence,
                        data_freshness: "real-time",
                        request_id: requestId,
                        extraction_method: "ai_with_cache_busting"
                    }
                }
            });

        } catch (error) {
            elizaLogger.error("❌ Error in TokenMetrics tokens handler:", error);
            elizaLogger.error(`🆔 Request ${requestId}: ERROR - ${error}`);
            
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            
            if (callback) {
                await callback({
                    text: `❌ I encountered an error while fetching tokens: ${errorMessage}

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
            
            return createActionResult({
                success: false,
                error: errorMessage
            });
        }
    },

    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "List all available tokens"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll fetch all available cryptocurrencies from TokenMetrics database.",
                    action: "GET_TOKENS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Show me DeFi tokens"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll get all DeFi category tokens from TokenMetrics database.",
                    action: "GET_TOKENS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Search for Bitcoin token information"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll search for Bitcoin token details in TokenMetrics database.",
                    action: "GET_TOKENS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Find token details for Ethereum"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll look up Ethereum token information from TokenMetrics database.",
                    action: "GET_TOKENS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Get supported cryptocurrencies list"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll retrieve the complete list of supported cryptocurrencies from TokenMetrics.",
                    action: "GET_TOKENS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Search token database for Solana"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll search the TokenMetrics database for Solana token information.",
                    action: "GET_TOKENS_TOKENMETRICS"
                }
            }
        ]
    ] as ActionExample[][],
};
import {
    type Action,
    type IAgentRuntime,
    type Memory,
    type State,
    type HandlerCallback,
    type ActionExample,
    elizaLogger,
    composeContext,
    generateObject,
    ModelClass
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

// Template for extracting tokens information from conversations
const tokensTemplate = `# Task: Extract Tokens Request Information

Based on the conversation context, identify what tokens information the user is requesting.

# Conversation Context:
{{recentMessages}}

# Instructions:
Look for any mentions of:
- Cryptocurrency symbols (BTC, ETH, SOL, ADA, MATIC, DOT, LINK, UNI, AVAX, etc.)
- Cryptocurrency names (Bitcoin, Ethereum, Solana, Cardano, Polygon, Uniswap, Avalanche, Chainlink, etc.)
- Token search requests ("list tokens", "available tokens", "supported cryptocurrencies", "find token")
- Token categories (DeFi, Layer-1, meme tokens, gaming, NFT, etc.)
- Exchange filters (Binance, Coinbase, Uniswap, etc.)
- Market filters (market cap, volume, price range)

The user might say things like:
- "List all available tokens"
- "Show me DeFi tokens"
- "Find tokens on Binance"
- "Get supported cryptocurrencies"
- "Show me tokens with high market cap"
- "List tokens in gaming category"
- "Find token by symbol BTC"

Extract the relevant information for the tokens request.

# Response Format:
Return a structured object with the tokens request information.`;

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
        "TOKEN_LIST"
    ],
    description: "Get list of supported cryptocurrencies and tokens from TokenMetrics",
    
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("🔍 Validating getTokensAction");
        
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
        state: State | undefined,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        const requestId = generateRequestId();
        
        elizaLogger.log("🚀 Starting TokenMetrics tokens handler");
        elizaLogger.log(`📝 Processing user message: "${message.content?.text || "No text content"}"`);
        elizaLogger.log(`🆔 Request ID: ${requestId}`);

        try {
            // STEP 1: Validate API key early
            validateAndGetApiKey(runtime);

            // STEP 2: Extract tokens request using AI
            const tokensRequest = await extractTokenMetricsRequest(
                runtime,
                message,
                state || await runtime.composeState(message),
                tokensTemplate,
                TokensRequestSchema,
                requestId
            );

            elizaLogger.log("🎯 AI Extracted tokens request:", tokensRequest);
            elizaLogger.log(`🆔 Request ${requestId}: AI Processing "${tokensRequest.cryptocurrency || tokensRequest.search_type}"`);

            // STEP 3: Validate that we have sufficient information
            if (tokensRequest.confidence < 0.2) {
                elizaLogger.log("❌ AI extraction failed or insufficient information");
                
                if (callback) {
                    callback({
                        text: `❌ I couldn't identify specific token search criteria from your request.

I can help you find tokens by:
• Listing all available tokens
• Searching by specific cryptocurrency (Bitcoin, Ethereum, etc.)
• Filtering by category (DeFi, Layer-1, gaming, meme tokens)
• Filtering by exchange (Binance, Coinbase, Uniswap)
• Market filters (high market cap, volume, etc.)

Try asking something like:
• "List all available tokens"
• "Show me DeFi tokens"
• "Find tokens on Binance"
• "Get supported cryptocurrencies"`,
                        content: { 
                            error: "Insufficient token search criteria",
                            confidence: tokensRequest?.confidence || 0,
                            request_id: requestId
                        }
                    });
                }
                return false;
            }

            elizaLogger.success("🎯 Final extraction result:", tokensRequest);

            // STEP 4: Build API parameters
            const apiParams: Record<string, any> = {
                limit: 50,
                page: 1
            };

            // Handle specific token search
            if (tokensRequest.cryptocurrency) {
                // Try to search by symbol first, then by name
                apiParams.symbol = tokensRequest.cryptocurrency.toUpperCase();
                elizaLogger.log(`🔍 Searching for specific token: ${tokensRequest.cryptocurrency}`);
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
                    callback({
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
                return false;
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
                callback({
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

            return true;

        } catch (error) {
            elizaLogger.error("❌ Error in TokenMetrics tokens handler:", error);
            elizaLogger.error(`🆔 Request ${requestId}: ERROR - ${error}`);
            
            if (callback) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                
                callback({
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
            
            return false;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "List all available tokens"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll fetch all available cryptocurrencies from TokenMetrics.",
                    action: "GET_TOKENS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me DeFi tokens"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get all DeFi category tokens from TokenMetrics.",
                    action: "GET_TOKENS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Find Bitcoin token details"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll search for Bitcoin token information in TokenMetrics database.",
                    action: "GET_TOKENS_TOKENMETRICS"
                }
            }
        ]
    ] as ActionExample[][],
};
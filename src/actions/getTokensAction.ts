import type { Action } from "@elizaos/core";
import {
    validateTokenMetricsParams,
    callTokenMetricsApi,
    buildTokenMetricsParams,
    formatTokenMetricsResponse,
    TOKENMETRICS_ENDPOINTS
} from "./action";
import type { TokensResponse, TokensRequest } from "../types";

/**
 * CORRECTED Tokens Action - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/tokens
 * 
 * This action gets the complete list of tokens supported by TokenMetrics platform.
 * Essential for discovering available cryptocurrencies and getting correct TOKEN_IDs.
 */
export const getTokensAction: Action = {
    name: "getTokens",
    description: "Get the complete list of cryptocurrencies and their TOKEN_IDs supported by TokenMetrics platform",
    similes: [
        "list available tokens",
        "get supported cryptocurrencies", 
        "find token by symbol",
        "get token reference data",
        "show available coins",
        "get TOKEN_ID for symbol",
        "discover supported tokens"
    ],
    
    async handler(_runtime, message, _state) {
        try {
            const messageContent = message.content as any;
            
            // CORRECTED: Build parameters based on actual API documentation
            const requestParams: TokensRequest = {
                // Based on actual API docs - supports these parameters
                token_id: typeof messageContent.token_id === 'number' ? messageContent.token_id : undefined,
                token_name: typeof messageContent.token_name === 'string' ? messageContent.token_name : undefined,
                symbol: typeof messageContent.symbol === 'string' ? messageContent.symbol : undefined,
                category: typeof messageContent.category === 'string' ? messageContent.category : undefined,
                exchange: typeof messageContent.exchange === 'string' ? messageContent.exchange : undefined,
                blockchain_address: typeof messageContent.blockchain_address === 'string' ? messageContent.blockchain_address : undefined,
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : 50,
                page: typeof messageContent.page === 'number' ? messageContent.page : 1
            };
            
            // Validate parameters according to actual API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters
            const apiParams = buildTokenMetricsParams(requestParams);
            
            
            // Make API call with corrected authentication
            const response = await callTokenMetricsApi<TokensResponse>(
                TOKENMETRICS_ENDPOINTS.tokens,
                apiParams,
                "GET"
            );
            
            // Format response data
            const formattedData = formatTokenMetricsResponse<TokensResponse>(response, "getTokens");
            const tokens = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Normalize field names to match expected format
            const normalizedTokens = tokens.map(token => ({
                ...token,
                SYMBOL: token.TOKEN_SYMBOL || token.SYMBOL, // Normalize TOKEN_SYMBOL to SYMBOL
                NAME: token.TOKEN_NAME || token.NAME // Normalize TOKEN_NAME to NAME
            }));

            return {
                success: true,
                message: `Successfully retrieved ${normalizedTokens.length} tokens from TokenMetrics`,
                tokens: normalizedTokens,
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.tokens,
                    total_tokens: normalizedTokens.length,
                    page: requestParams.page,
                    limit: requestParams.limit,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                usage_notes: {
                    token_id_usage: "Use TOKEN_ID (e.g., 3375 for Bitcoin) in other API calls",
                    symbol_format: "Symbols are in standard format (e.g., BTC, ETH, ADA)",
                    data_freshness: "Token list is updated regularly by TokenMetrics",
                    filtering_options: [
                        "Filter by symbol, category, or exchange",
                        "Use blockchain_address for specific token lookups",
                        "Paginate through results using page parameter"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getTokensAction:", error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve tokens from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/tokens is accessible",
                    auth_check: "Verify TOKENMETRICS_API_KEY is valid and uses x-api-key header",
                    common_solutions: [
                        "Check if your API key is properly set in environment variables",
                        "Verify your TokenMetrics subscription is active",
                        "Try the request without filters first",
                        "Check TokenMetrics API status"
                    ]
                }
            };
        }
    },
    
    validate: async (runtime, _message) => {
        const apiKey = runtime.getSetting("TOKENMETRICS_API_KEY");
        if (!apiKey) {
            console.warn("TokenMetrics API key not found. Please set TOKENMETRICS_API_KEY environment variable.");
            return false;
        }
        return true;
    },
    
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get me the list of available tokens on TokenMetrics"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll fetch all available cryptocurrencies from the TokenMetrics platform.",
                    action: "GET_TOKENS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Find tokens in the DeFi category",
                    category: "defi",
                    limit: 20
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get DeFi tokens from TokenMetrics with their details.",
                    action: "GET_TOKENS"
                }
            }
        ]
    ],
};
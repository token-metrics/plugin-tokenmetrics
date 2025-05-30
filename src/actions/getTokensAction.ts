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
 * Action to get the list of tokens and their TOKEN_IDs supported by TokenMetrics.
 * This is the foundational action that provides reference data for all other TokenMetrics operations.
 * 
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/tokens
 * 
 * This action is essential for:
 * - Discovering available cryptocurrencies on TokenMetrics platform
 * - Getting the correct TOKEN_ID for specific symbols (e.g., Bitcoin = 3375)
 * - Building token selection interfaces and dropdowns
 * - Validating token symbols before making other API calls
 * - Understanding the complete universe of tokens available for analysis
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
            // Extract parameters from the message content
            const messageContent = message.content as any;
            
            // Build request parameters for the real TokenMetrics tokens endpoint
            const requestParams: TokensRequest = {
                // TokenMetrics v2/tokens endpoint supports basic pagination
                limit: typeof messageContent.limit === 'number' ? messageContent.limit : undefined,
                offset: typeof messageContent.offset === 'number' ? messageContent.offset : undefined,
            };
            
            // Validate parameters according to real TokenMetrics API requirements
            validateTokenMetricsParams(requestParams);
            
            // Build clean parameters for the API request
            const apiParams = buildTokenMetricsParams(requestParams);
            
            console.log("Fetching tokens from TokenMetrics v2/tokens endpoint");
            
            // Make the API call to the real TokenMetrics tokens endpoint
            const response = await callTokenMetricsApi<TokensResponse>(
                TOKENMETRICS_ENDPOINTS.tokens,
                apiParams,
                "GET"
            );
            
            // Format the response data using the real API structure
            const formattedData = formatTokenMetricsResponse<TokensResponse>(response, "getTokens");
            
            // Process the real response structure
            const tokens = Array.isArray(formattedData) ? formattedData : formattedData.data || [];
            
            // Return structured response with real TokenMetrics data
            return {
                success: true,
                message: `Successfully retrieved ${tokens.length} tokens from TokenMetrics`,
                tokens: tokens,
                // Include metadata about the request
                metadata: {
                    endpoint: TOKENMETRICS_ENDPOINTS.tokens,
                    total_tokens: tokens.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                // Provide usage guidance for the real data
                usage_notes: {
                    token_id_usage: "Use TOKEN_ID (e.g., 3375 for Bitcoin) in other API calls",
                    symbol_format: "Symbols are in standard format (e.g., BTC, ETH, ADA)",
                    data_freshness: "Token list is updated regularly by TokenMetrics",
                    next_steps: [
                        "Use TOKEN_ID in quantmetrics, trader-grades, or other analysis endpoints",
                        "Store TOKEN_ID mapping locally to avoid repeated lookups",
                        "Verify token availability before making analysis requests"
                    ]
                }
            };
            
        } catch (error) {
            console.error("Error in getTokensAction:", error);
            
            // Return structured error response with helpful guidance
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred while fetching tokens",
                message: "Failed to retrieve tokens from TokenMetrics API",
                // Include specific troubleshooting for the real endpoint
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/tokens is accessible",
                    auth_check: "Verify TOKENMETRICS_API_KEY is valid and has basic access permissions",
                    common_solutions: [
                        "Check if your API key is properly set in environment variables",
                        "Verify your TokenMetrics subscription is active",
                        "Try the request without pagination parameters first",
                        "Check TokenMetrics API status at their developer portal"
                    ]
                }
            };
        }
    },
    
    /**
     * Validate that the runtime has proper TokenMetrics API access.
     * The tokens endpoint is usually available to all TokenMetrics API subscribers.
     */
    validate: async (runtime, _message) => {
        const apiKey = runtime.getSetting("TOKENMETRICS_API_KEY");
        if (!apiKey) {
            console.warn("TokenMetrics API key not found. Please set TOKENMETRICS_API_KEY environment variable.");
            return false;
        }
        return true;
    },
    
    /**
     * Examples showing different ways to use the tokens endpoint.
     * These examples reflect the real TokenMetrics API capabilities.
     */
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
                    text: "What's the TOKEN_ID for Bitcoin?",
                    limit: 100
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the token list and find Bitcoin's TOKEN_ID for you.",
                    action: "GET_TOKENS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me the first 50 tokens available for analysis"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve the first 50 tokens from TokenMetrics with their details.",
                    action: "GET_TOKENS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I need to see what cryptocurrencies TokenMetrics supports"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the complete list of supported cryptocurrencies from TokenMetrics.",
                    action: "GET_TOKENS"
                }
            }
        ]
    ],
};
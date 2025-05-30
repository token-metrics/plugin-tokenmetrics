// CORRECTED TokenMetrics Common Action Utilities
// Based on Real API Endpoints from developers.tokenmetrics.com

import axios, { type AxiosRequestConfig } from "axios";

// Default configuration values based on actual TokenMetrics API
export const DEFAULT_BASE_URL = process.env.TOKENMETRICS_BASE_URL || "https://api.tokenmetrics.com";
export const DEFAULT_API_VERSION = process.env.TOKENMETRICS_API_VERSION || "v2";
export const DEFAULT_TIMEOUT = 30000; // 30 seconds
export const DEFAULT_PAGE_LIMIT = Number.parseInt(process.env.TOKENMETRICS_PAGE_LIMIT || "100", 10);

// Real TokenMetrics API endpoints based on official documentation
export const TOKENMETRICS_ENDPOINTS = {
    tokens: "/v2/tokens",
    quantmetrics: "/v2/quantmetrics", 
    traderGrades: "/v2/trader-grades",
    marketMetrics: "/v2/market-metrics",
    tradingSignals: "/v2/trading-signals",
    price: "/v2/price",
    topMarketCap: "/v2/top-market-cap-tokens", // ✅ ADDED: Real endpoint for market leaders
    tmai: "/v2/tmai",
    correlation: "/v2/correlation",
    resistanceSupport: "/v2/resistance-support",
    aiReports: "/v2/ai-reports",
    sectorIndicesHoldings: "/v2/sector-indices-holdings",
    indexPerformance: "/v2/index-specific-performance",
    sectorIndexTransaction: "/v2/sector-index-transaction"
} as const;

/**
 * Validate input parameters for TokenMetrics API requests.
 * This function ensures we send properly formatted data to the real API endpoints.
 * The validation is based on the actual parameter requirements from TokenMetrics documentation.
 * 
 * @param params - The parameters object to validate
 * @throws Will throw an error if parameters don't meet TokenMetrics API requirements
 */
export function validateTokenMetricsParams(params: Record<string, any>): void {
    // Validate token_id - must be a positive integer when provided
    if (params.token_id !== undefined) {
        const tokenId = Number(params.token_id);
        if (!Number.isInteger(tokenId) || tokenId <= 0) {
            throw new Error("token_id must be a positive integer (e.g., Bitcoin = 3375)");
        }
    }

    // Validate symbol - must be a non-empty string in uppercase format
    if (params.symbol !== undefined) {
        if (typeof params.symbol !== 'string' || params.symbol.trim().length === 0) {
            throw new Error("symbol must be a non-empty string (e.g., 'BTC', 'ETH')");
        }
        // TokenMetrics expects symbols in uppercase
        params.symbol = params.symbol.toUpperCase();
    }

    // Validate date formats - TokenMetrics expects YYYY-MM-DD format
    const dateFields = ['start_date', 'end_date'];
    dateFields.forEach(field => {
        if (params[field] && !isValidDateFormat(params[field])) {
            throw new Error(`${field} must be in YYYY-MM-DD format (e.g., '2024-01-01')`);
        }
    });

    // Validate pagination parameters for endpoints that support them
    if (params.limit !== undefined) {
        const limit = Number(params.limit);
        if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
            throw new Error("limit must be between 1 and 1000");
        }
    }

    if (params.offset !== undefined) {
        const offset = Number(params.offset);
        if (!Number.isInteger(offset) || offset < 0) {
            throw new Error("offset must be a non-negative integer");
        }
    }

    // Validate signal_type for trading signals endpoint
    if (params.signal_type !== undefined) {
        const validSignalTypes = ['long', 'short', 'all'];
        if (!validSignalTypes.includes(params.signal_type.toLowerCase())) {
            throw new Error("signal_type must be 'long', 'short', or 'all'");
        }
        params.signal_type = params.signal_type.toLowerCase();
    }

    // Validate token_ids and symbols for price endpoint (comma-separated lists)
    if (params.token_ids !== undefined) {
        if (typeof params.token_ids !== 'string') {
            throw new Error("token_ids must be a comma-separated string (e.g., '3375,1027,825')");
        }
        // Validate that all token IDs are valid numbers
        const ids = params.token_ids.split(',').map(id => id.trim());
        ids.forEach(id => {
            const numId = Number(id);
            if (!Number.isInteger(numId) || numId <= 0) {
                throw new Error(`Invalid token_id in token_ids list: ${id}`);
            }
        });
    }

    if (params.symbols !== undefined) {
        if (typeof params.symbols !== 'string') {
            throw new Error("symbols must be a comma-separated string (e.g., 'BTC,ETH,ADA')");
        }
        // Convert all symbols to uppercase for consistency
        params.symbols = params.symbols.toUpperCase();
    }
}

/**
 * Helper function to validate date format according to TokenMetrics API requirements.
 * TokenMetrics expects dates in YYYY-MM-DD format for all date parameters.
 * 
 * @param dateString - The date string to validate
 * @returns True if the date is in correct format and represents a valid date
 */
function isValidDateFormat(dateString: string): boolean {
    // Check format with regex first
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
        return false;
    }
    
    // Verify it's actually a valid date
    const date = new Date(dateString + 'T00:00:00.000Z'); // Add time to avoid timezone issues
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    
    return date.getUTCFullYear() === year && 
           date.getUTCMonth() === month - 1 && 
           date.getUTCDate() === day;
}

/**
 * Validate the presence and format of the TokenMetrics API key.
 * TokenMetrics uses Bearer token authentication for all API requests.
 * 
 * @throws Will throw an error if the API key is missing or invalid format
 * @returns The validated API key
 */
export function validateApiKey(): string {
    const apiKey = process.env.TOKENMETRICS_API_KEY;
    if (!apiKey) {
        throw new Error(
            "TokenMetrics API key is not set. Please set TOKENMETRICS_API_KEY environment variable. " +
            "Get your API key from https://developers.tokenmetrics.com"
        );
    }

    // Basic format validation for TokenMetrics API keys
    if (apiKey.length < 10) {
        throw new Error("TokenMetrics API key appears to be invalid (too short)");
    }

    return apiKey;
}

/**
 * Send a request to the TokenMetrics API using the real endpoint structure.
 * This function handles authentication, error responses, and rate limiting
 * according to TokenMetrics API specifications.
 * 
 * @param endpoint - The API endpoint path from TOKENMETRICS_ENDPOINTS
 * @param params - Query parameters for the request
 * @param method - HTTP method (GET is default for all current TokenMetrics endpoints)
 * @returns The response data from TokenMetrics API
 * @throws Will throw detailed errors for various failure scenarios
 */
export async function callTokenMetricsApi<T>(
    endpoint: string,
    params: Record<string, any> = {},
    method: 'GET' | 'POST' = 'GET'
): Promise<T> {
    try {
        const apiKey = validateApiKey();
        
        // Construct the full URL using the real base URL
        const baseUrl = DEFAULT_BASE_URL;
        const url = `${baseUrl}${endpoint}`;

        // Prepare request configuration according to TokenMetrics API requirements
        const config: AxiosRequestConfig = {
            method,
            url,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // TokenMetrics may track user agents for analytics
                'User-Agent': 'ElizaOS-TokenMetrics-Plugin/1.0.0'
            },
            timeout: DEFAULT_TIMEOUT,
        };

        // Add parameters based on HTTP method
        if (method === 'GET') {
            config.params = params;
        } else {
            config.data = params;
        }

        console.log(`Making TokenMetrics API request to: ${endpoint}`, 
                   { params: Object.keys(params) });
        
        const response = await axios.request<T>(config);
        
        console.log(`TokenMetrics API request successful: ${endpoint} (${response.status})`);
        return response.data;
        
    } catch (error) {
        console.error(`TokenMetrics API error for ${endpoint}:`, 
                     error instanceof Error ? error.message : String(error));
        
        if (axios.isAxiosError(error)) {
            // Handle specific TokenMetrics API error responses
            const status = error.response?.status;
            const errorData = error.response?.data;
            
            switch (status) {
                case 401:
                    throw new Error(
                        "Invalid TokenMetrics API key. Please check your TOKENMETRICS_API_KEY. " +
                        "Get a valid key from https://developers.tokenmetrics.com"
                    );
                case 403:
                    throw new Error(
                        "Access forbidden. Your TokenMetrics API key may not have permission for this endpoint, " +
                        "or you may need to upgrade your subscription plan."
                    );
                case 404:
                    throw new Error(
                        `TokenMetrics API endpoint not found: ${endpoint}. ` +
                        "Please verify the endpoint URL is correct."
                    );
                case 429:
                    throw new Error(
                        "TokenMetrics API rate limit exceeded. Please wait before making more requests. " +
                        "Consider upgrading your plan for higher rate limits."
                    );
                case 422:
                    throw new Error(
                        `Invalid parameters for TokenMetrics API: ${JSON.stringify(errorData)}. ` +
                        "Please check your request parameters."
                    );
                case 500:
                case 502:
                case 503:
                    throw new Error(
                        "TokenMetrics API server error. Please try again later. " +
                        "If the problem persists, contact TokenMetrics support."
                    );
                default:
                    // Include any specific error message from TokenMetrics
                    const apiErrorMessage = errorData?.message || errorData?.error || error.message;
                    throw new Error(`TokenMetrics API error (${status}): ${apiErrorMessage}`);
            }
        }
        
        // Handle network and other errors
        throw new Error(
            "Failed to communicate with TokenMetrics API. Please check your internet connection. " +
            "Original error: " + (error instanceof Error ? error.message : String(error))
        );
    }
}

/**
 * Build standardized request parameters for TokenMetrics API calls.
 * This function ensures consistent parameter formatting and removes undefined values
 * that might cause issues with the TokenMetrics API.
 * 
 * @param baseParams - The core parameters for the request
 * @param additionalParams - Any additional endpoint-specific parameters
 * @returns Clean parameter object ready for API request
 */
export function buildTokenMetricsParams(
    baseParams: Record<string, any> = {},
    additionalParams: Record<string, any> = {}
): Record<string, any> {
    const params = { ...baseParams, ...additionalParams };
    
    // Remove undefined and null values to keep requests clean
    Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null) {
            delete params[key];
        }
        // Also remove empty strings that might cause API issues
        if (params[key] === '') {
            delete params[key];
        }
    });
    
    return params;
}

/**
 * Format and normalize TokenMetrics API response data.
 * TokenMetrics API responses may have different structures depending on the endpoint,
 * so this function provides consistent data access patterns.
 * 
 * @param rawResponse - The raw response from TokenMetrics API
 * @param actionName - The name of the action for logging purposes
 * @returns Normalized response data
 */
export function formatTokenMetricsResponse<T>(rawResponse: any, actionName: string): T {
    console.log(`TokenMetrics ${actionName} response processed successfully`);
    
    // TokenMetrics API typically returns data directly or in a 'data' field
    // Some endpoints may wrap the response differently
    if (rawResponse.data !== undefined) {
        return rawResponse.data;
    }
    
    // If there's no 'data' field, return the whole response
    // This handles cases where the API returns data directly
    return rawResponse;
}

/**
 * Extract token identifier from message content with enhanced logic.
 * This function intelligently parses user input to find token references
 * in various formats that users might provide.
 * 
 * @param messageContent - The content of the user's message
 * @returns Object containing extracted token_id and/or symbol
 */
export function extractTokenIdentifier(messageContent: any): { token_id?: number; symbol?: string } {
    const result: { token_id?: number; symbol?: string } = {};
    
    // Direct token_id extraction (various possible field names)
    const tokenIdFields = ['token_id', 'tokenId', 'TOKEN_ID', 'id'];
    for (const field of tokenIdFields) {
        if (typeof messageContent[field] === 'number' && messageContent[field] > 0) {
            result.token_id = messageContent[field];
            break;
        }
        // Handle string numbers
        if (typeof messageContent[field] === 'string') {
            const numValue = parseInt(messageContent[field], 10);
            if (!isNaN(numValue) && numValue > 0) {
                result.token_id = numValue;
                break;
            }
        }
    }
    
    // Symbol extraction (various possible field names)
    const symbolFields = ['symbol', 'SYMBOL', 'token', 'coin', 'cryptocurrency'];
    for (const field of symbolFields) {
        if (typeof messageContent[field] === 'string' && messageContent[field].trim().length > 0) {
            result.symbol = messageContent[field].trim().toUpperCase();
            break;
        }
    }
    
    // Try to extract symbol from text content using common patterns
    if (!result.symbol && typeof messageContent.text === 'string') {
        const text = messageContent.text.toUpperCase();
        
        // Common cryptocurrency symbols
        const commonSymbols = ['BTC', 'ETH', 'ADA', 'SOL', 'MATIC', 'DOT', 'LINK', 'UNI', 'AVAX', 'ATOM'];
        for (const symbol of commonSymbols) {
            if (text.includes(symbol)) {
                result.symbol = symbol;
                break;
            }
        }
        
        // Pattern matching for symbol-like strings (2-5 uppercase letters)
        const symbolMatch = text.match(/\b([A-Z]{2,5})\b/);
        if (symbolMatch && !result.symbol) {
            // Validate it's not a common English word
            const commonWords = ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'GET'];
            if (!commonWords.includes(symbolMatch[1])) {
                result.symbol = symbolMatch[1];
            }
        }
    }
    
    return result;
}

/**
 * Helper function to convert TokenMetrics timestamp formats to user-friendly dates.
 * TokenMetrics may return dates in various formats, so this normalizes them.
 * 
 * @param timestamp - Timestamp in various possible formats from TokenMetrics
 * @returns Formatted date string
 */
export function formatTokenMetricsDate(timestamp: string | number | Date): string {
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return String(timestamp); // Return as-is if can't parse
        }
        return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    } catch {
        return String(timestamp);
    }
}

/**
 * Helper function to format large numbers (market caps, prices, etc.) for display.
 * Makes TokenMetrics numerical data more readable for users.
 * 
 * @param value - Numerical value to format
 * @param type - Type of value for appropriate formatting
 * @returns Human-readable formatted string
 */
export function formatTokenMetricsNumber(value: number, type: 'currency' | 'percentage' | 'number' = 'number'): string {
    if (typeof value !== 'number' || isNaN(value)) {
        return 'N/A';
    }
    
    switch (type) {
        case 'currency':
            if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
            if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
            if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
            if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
            return `$${value.toFixed(value < 1 ? 6 : 2)}`;
            
        case 'percentage':
            return `${value.toFixed(2)}%`;
            
        default:
            return value.toLocaleString();
    }
}
// Based on ACTUAL API Documentation from developers.tokenmetrics.com

import axios, { type AxiosRequestConfig } from "axios";

// Configuration values based on actual TokenMetrics API
export const DEFAULT_BASE_URL = process.env.TOKENMETRICS_BASE_URL || "https://api.tokenmetrics.com";
export const DEFAULT_API_VERSION = process.env.TOKENMETRICS_API_VERSION || "v2";
export const DEFAULT_TIMEOUT = 30000; // 30 seconds
export const DEFAULT_PAGE_LIMIT = Number.parseInt(process.env.TOKENMETRICS_PAGE_LIMIT || "50", 10);

// COMPLETE TokenMetrics API endpoints based on actual documentation
export const TOKENMETRICS_ENDPOINTS = {
    // Core endpoints
    tokens: "/v2/tokens",
    quantmetrics: "/v2/quantmetrics", 
    traderGrades: "/v2/trader-grades",
    marketMetrics: "/v2/market-metrics",
    tradingSignals: "/v2/trading-signals",
    hourlyTradingSignals: "/v2/hourly-trading-signals",
    price: "/v2/price",
    topMarketCap: "/v2/top-market-cap-tokens",
    
    // OHLCV endpoints
    hourlyOhlcv: "/v2/hourly-ohlcv",
    dailyOhlcv: "/v2/daily-ohlcv",
    
    // Analysis endpoints
    investorGrades: "/v2/investor-grades",
    aiReports: "/v2/ai-reports",
    cryptoInvestors: "/v2/crypto-investors",
    resistanceSupport: "/v2/resistance-support",
    sentiment: "/v2/sentiments",
    scenarioAnalysis: "/v2/scenario-analysis",
    correlation: "/v2/correlation",
    
    // AI endpoint
    tmai: "/v2/tmai",
    
    // Indices endpoints
    indices: "/v2/indices",
    indicesHoldings: "/v2/indices-holdings",
    indicesPerformance: "/v2/indices-performance"
} as const;

/**
 * CORRECTED validation function based on actual TokenMetrics API requirements
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
        params.symbol = params.symbol.toUpperCase();
    }

    // CORRECTED: Validate date formats - API expects startDate/endDate, not start_date/end_date
    if (params.startDate && !isValidDateFormat(params.startDate)) {
        throw new Error("startDate must be in YYYY-MM-DD format (e.g., '2024-01-01')");
    }
    if (params.endDate && !isValidDateFormat(params.endDate)) {
        throw new Error("endDate must be in YYYY-MM-DD format (e.g., '2024-01-01')");
    }

    // CORRECTED: Validate pagination - API uses 'page' not 'offset'
    if (params.limit !== undefined) {
        const limit = Number(params.limit);
        if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
            throw new Error("limit must be between 1 and 1000");
        }
    }

    if (params.page !== undefined) {
        const page = Number(params.page);
        if (!Number.isInteger(page) || page < 1) {
            throw new Error("page must be a positive integer starting from 1");
        }
    }

    // CORRECTED: Validate top_k for top market cap endpoint (not limit)
    if (params.top_k !== undefined) {
        const topK = Number(params.top_k);
        if (!Number.isInteger(topK) || topK < 1 || topK > 1000) {
            throw new Error("top_k must be between 1 and 1000");
        }
    }

    // Validate indexName for indices endpoints (required)
    if (params.indexName !== undefined) {
        if (typeof params.indexName !== 'string' || params.indexName.trim().length === 0) {
            throw new Error("indexName must be a non-empty string (e.g., 'meme')");
        }
    }

    // Validate signal_type for trading signals endpoint
    if (params.signal !== undefined) {
        const validSignalTypes = ['1', '-1', '0']; // Based on actual API docs
        if (!validSignalTypes.includes(String(params.signal))) {
            throw new Error("signal must be '1' (bullish), '-1' (bearish), or '0' (no signal)");
        }
    }

    // Validate messages for TMAI endpoint
    if (params.messages !== undefined) {
        if (!Array.isArray(params.messages) || params.messages.length === 0) {
            throw new Error("messages must be a non-empty array for TMAI endpoint");
        }
    }
}

function isValidDateFormat(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
        return false;
    }
    
    const date = new Date(dateString + 'T00:00:00.000Z');
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    
    return date.getUTCFullYear() === year && 
           date.getUTCMonth() === month - 1 && 
           date.getUTCDate() === day;
}

/**
 * CORRECTED API key validation - returns the validated API key
 */
export function validateApiKey(): string {
    const apiKey = process.env.TOKENMETRICS_API_KEY;
    if (!apiKey) {
        throw new Error(
            "TokenMetrics API key is not set. Please set TOKENMETRICS_API_KEY environment variable. " +
            "Get your API key from https://developers.tokenmetrics.com"
        );
    }

    if (apiKey.length < 10) {
        throw new Error("TokenMetrics API key appears to be invalid (too short)");
    }

    return apiKey;
}

/**
 * CORRECTED API call function using the proper authentication method
 */
export async function callTokenMetricsApi<T>(
    endpoint: string,
    params: Record<string, any> = {},
    method: 'GET' | 'POST' = 'GET'
): Promise<T> {
    try {
        const apiKey = validateApiKey();
        
        const baseUrl = DEFAULT_BASE_URL;
        const url = `${baseUrl}${endpoint}`;

        // CORRECTED: Use x-api-key header instead of Authorization Bearer
        const config: AxiosRequestConfig = {
            method,
            url,
            headers: {
                'x-api-key': apiKey, // CORRECTED: This is the actual header format
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: DEFAULT_TIMEOUT,
        };

        if (method === 'GET') {
            config.params = params;
        } else {
            config.data = params;
        }
        
        const response = await axios.request<T>(config);
        
        return response.data;
        
    } catch (error) {
        console.error(`TokenMetrics API error for ${endpoint}:`, 
                     error instanceof Error ? error.message : String(error));
        
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const errorData = error.response?.data;
            
            switch (status) {
                case 401:
                    throw new Error(
                        "Invalid TokenMetrics API key. Please check your TOKENMETRICS_API_KEY. " +
                        "Ensure you're using the x-api-key header format."
                    );
                case 403:
                    throw new Error(
                        "Access forbidden. Your TokenMetrics API key may not have permission for this endpoint."
                    );
                case 404:
                    throw new Error(
                        `TokenMetrics API endpoint not found: ${endpoint}. ` +
                        "Please verify the endpoint URL is correct."
                    );
                case 429:
                    throw new Error(
                        "TokenMetrics API rate limit exceeded. Please wait before making more requests."
                    );
                case 422:
                    throw new Error(
                        `Invalid parameters for TokenMetrics API: ${JSON.stringify(errorData)}`
                    );
                default:
                    const apiErrorMessage = errorData?.message || errorData?.error || error.message;
                    throw new Error(`TokenMetrics API error (${status}): ${apiErrorMessage}`);
            }
        }
        
        throw new Error(
            "Failed to communicate with TokenMetrics API. " +
            "Original error: " + (error instanceof Error ? error.message : String(error))
        );
    }
}

/**
 * CORRECTED parameter building function
 */
export function buildTokenMetricsParams(
    baseParams: Record<string, any> = {},
    additionalParams: Record<string, any> = {}
): Record<string, any> {
    const params = { ...baseParams, ...additionalParams };
    
    // Remove undefined and null values
    Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
            delete params[key];
        }
    });
    
    return params;
}

/**
 * CORRECTED response formatting function
 */
export function formatTokenMetricsResponse<T>(rawResponse: any, actionName: string): T {
    // Handle the actual API response structure
    if (rawResponse.data !== undefined) {
        return rawResponse.data;
    }
    
    return rawResponse;
}

/**
 * IMPROVED: Extract token identifier from message content with better validation
 */
export function extractTokenIdentifier(messageContent: any): { token_id?: number; symbol?: string } {
    const result: { token_id?: number; symbol?: string } = {};
    
    // Direct token_id from message
    if (typeof messageContent.token_id === 'number' && messageContent.token_id > 0) {
        result.token_id = messageContent.token_id;
    }
    
    // Direct symbol from message (must be valid crypto symbol format)
    if (typeof messageContent.symbol === 'string') {
        const symbol = messageContent.symbol.trim().toUpperCase();
        // Only accept if it looks like a valid crypto symbol (2-10 chars, alphanumeric)
        if (/^[A-Z0-9]{2,10}$/.test(symbol) && isKnownCryptoSymbol(symbol)) {
            result.symbol = symbol;
        }
    }
    
    // Extract from text content using known patterns
    if (typeof messageContent.text === 'string') {
        const text = messageContent.text;
        
        // Look for known crypto symbols in the text
        const knownSymbols = ['BTC', 'ETH', 'ADA', 'SOL', 'MATIC', 'LINK', 'UNI', 'AVAX', 'DOT', 'ATOM', 'XRP', 'LTC', 'BCH', 'ETC', 'XLM', 'TRX', 'VET', 'FIL', 'THETA', 'EOS'];
        
        for (const symbol of knownSymbols) {
            // Look for symbol as whole word (case insensitive)
            const regex = new RegExp(`\\b${symbol}\\b`, 'i');
            if (regex.test(text)) {
                result.symbol = symbol;
                break; // Take the first match
            }
        }
        
        // Look for full coin names
        const coinNamePatterns = [
            { pattern: /\bbitcoin\b/i, symbol: 'BTC', id: 3375 },
            { pattern: /\bethereum\b/i, symbol: 'ETH', id: 3306 },
            { pattern: /\bcardano\b/i, symbol: 'ADA', id: 2010 },
            { pattern: /\bsolana\b/i, symbol: 'SOL', id: 5426 },
            { pattern: /\bpolygon\b/i, symbol: 'MATIC', id: 3890 },
            { pattern: /\bchainlink\b/i, symbol: 'LINK', id: 1975 },
            { pattern: /\buniswap\b/i, symbol: 'UNI', id: 7083 },
            { pattern: /\bavalanche\b/i, symbol: 'AVAX', id: 5805 }
        ];
        
        for (const { pattern, symbol, id } of coinNamePatterns) {
            if (pattern.test(text)) {
                result.symbol = symbol;
                result.token_id = id;
                break;
            }
        }
    }
    
    return result;
}

/**
 * Check if a symbol is a known cryptocurrency symbol
 */
function isKnownCryptoSymbol(symbol: string): boolean {
    const knownSymbols = [
        'BTC', 'ETH', 'ADA', 'SOL', 'MATIC', 'LINK', 'UNI', 'AVAX', 'DOT', 'ATOM', 
        'XRP', 'LTC', 'BCH', 'ETC', 'XLM', 'TRX', 'VET', 'FIL', 'THETA', 'EOS',
        'DOGE', 'SHIB', 'USDT', 'USDC', 'BNB', 'BUSD', 'DAI', 'WBTC', 'STETH',
        'MATIC', 'CRO', 'NEAR', 'ALGO', 'MANA', 'SAND', 'APE', 'LRC', 'ENJ',
        'COMP', 'MKR', 'AAVE', 'SNX', 'UMA', 'BAL', 'YFI', 'SUSHI', 'CRV'
    ];
    return knownSymbols.includes(symbol);
}

// Utility functions remain the same
export function formatTokenMetricsDate(timestamp: string | number | Date): string {
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return String(timestamp);
        }
        return date.toISOString().split('T')[0];
    } catch {
        return String(timestamp);
    }
}

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
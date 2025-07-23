import type { Action } from "@elizaos/core";
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
import type { HourlyOhlcvResponse } from "../types";
import type { IAgentRuntime, Memory, State } from "@elizaos/core";
import type { HandlerCallback } from "@elizaos/core";
import { elizaLogger } from "@elizaos/core";

// Zod schema for hourly OHLCV request validation
const HourlyOhlcvRequestSchema = z.object({
    cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
    token_id: z.number().optional().describe("Specific token ID if known"),
    symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
    token_name: z.string().optional().describe("Full name of the token"),
    startDate: z.string().optional().describe("Start date for data range (YYYY-MM-DD)"),
    endDate: z.string().optional().describe("End date for data range (YYYY-MM-DD)"),
    limit: z.number().min(1).max(1000).optional().describe("Number of data points to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["scalping", "intraday", "technical_patterns", "all"]).optional().describe("Type of analysis to focus on")
});

type HourlyOhlcvRequest = z.infer<typeof HourlyOhlcvRequestSchema>;

// AI extraction template for natural language processing
const HOURLY_OHLCV_EXTRACTION_TEMPLATE = `
CRITICAL INSTRUCTION: Extract the EXACT cryptocurrency name or symbol mentioned by the user. Do NOT substitute or change it.

You are an AI assistant specialized in extracting hourly OHLCV data requests from natural language.

The user wants to get hourly OHLCV (Open, High, Low, Close, Volume) data for cryptocurrency analysis. Extract the following information:

1. **cryptocurrency** (required): The EXACT name or symbol of the cryptocurrency mentioned by the user
   - Bitcoin, BTC → "Bitcoin"
   - Ethereum, ETH → "Ethereum" 
   - Dogecoin, DOGE → "Dogecoin"
   - Solana, SOL → "Solana"
   - Avalanche, AVAX → "Avalanche"
   - Cardano, ADA → "Cardano"
   - Polkadot, DOT → "Polkadot"
   - Chainlink, LINK → "Chainlink"
   - CRITICAL: Use the EXACT name/symbol the user mentioned

2. **symbol** (optional): Token symbol if mentioned
   - Extract symbols like "BTC", "ETH", "ADA", etc.

3. **token_id** (optional): Specific token ID if mentioned
   - Usually a number like "3375" for Bitcoin

4. **token_name** (optional): Full name of the token for API calls

5. **startDate** (optional): Start date for data range
   - Look for dates in YYYY-MM-DD format
   - Convert relative dates like "last week", "past 3 days"

6. **endDate** (optional): End date for data range
   - Look for dates in YYYY-MM-DD format

7. **limit** (optional, default: 50): Number of data points to return
   - Maximum 50 allowed by API

8. **page** (optional, default: 1): Page number for pagination

9. **analysisType** (optional, default: "all"): What type of analysis they want
   - "scalping" - focus on very short-term price movements
   - "intraday" - focus on day trading patterns
   - "technical_patterns" - focus on technical analysis patterns
   - "all" - comprehensive hourly analysis

CRITICAL EXAMPLES:
- "Get hourly OHLCV for Bitcoin" → {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Show me hourly candles for BTC" → {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Hourly data for ETH for scalping" → {cryptocurrency: "Ethereum", symbol: "ETH", analysisType: "scalping"}
- "DOGE hourly OHLCV" → {cryptocurrency: "Dogecoin", symbol: "DOGE", analysisType: "all"}
- "Solana intraday data" → {cryptocurrency: "Solana", symbol: "SOL", analysisType: "intraday"}

Extract the request details from the user's message.
`;

// Regex fallback function for cryptocurrency extraction
function extractCryptocurrencySimple(text: string): { cryptocurrency?: string; symbol?: string } {
    const cryptoPatterns = [
        { regex: /\b(bitcoin|btc)\b/i, name: "Bitcoin", symbol: "BTC" },
        { regex: /\b(ethereum|eth)\b/i, name: "Ethereum", symbol: "ETH" },
        { regex: /\b(dogecoin|doge)\b/i, name: "Dogecoin", symbol: "DOGE" },
        { regex: /\b(solana|sol)\b/i, name: "Solana", symbol: "SOL" },
        { regex: /\b(avalanche|avax)\b/i, name: "Avalanche", symbol: "AVAX" },
        { regex: /\b(cardano|ada)\b/i, name: "Cardano", symbol: "ADA" },
        { regex: /\b(polkadot|dot)\b/i, name: "Polkadot", symbol: "DOT" },
        { regex: /\b(chainlink|link)\b/i, name: "Chainlink", symbol: "LINK" },
        { regex: /\b(binance coin|bnb)\b/i, name: "BNB", symbol: "BNB" },
        { regex: /\b(ripple|xrp)\b/i, name: "XRP", symbol: "XRP" },
        { regex: /\b(litecoin|ltc)\b/i, name: "Litecoin", symbol: "LTC" },
        { regex: /\b(polygon|matic)\b/i, name: "Polygon", symbol: "MATIC" },
        { regex: /\b(uniswap|uni)\b/i, name: "Uniswap", symbol: "UNI" },
        { regex: /\b(shiba inu|shib)\b/i, name: "Shiba Inu", symbol: "SHIB" }
    ];
    
    for (const pattern of cryptoPatterns) {
        if (pattern.regex.test(text)) {
            return { 
                cryptocurrency: pattern.name, 
                symbol: pattern.symbol 
            };
        }
    }
    
    return {};
}

/**
 * HOURLY OHLCV ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/hourly-ohlcv
 * 
 * This action provides hourly OHLCV (Open, High, Low, Close, Volume) data for tokens.
 * Essential for technical analysis, chart generation, and intraday trading strategies.
 */
export const getHourlyOhlcvAction: Action = {
    name: "GET_HOURLY_OHLCV_TOKENMETRICS",
    description: "Get hourly OHLCV (Open, High, Low, Close, Volume) data for cryptocurrency tokens from TokenMetrics for intraday analysis",
    similes: [
        "get hourly ohlcv",
        "hourly price data",
        "hourly candles",
        "intraday price data",
        "hourly chart data",
        "technical analysis data",
        "hourly trading data",
        "scalping data"
    ],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get hourly OHLCV data for Bitcoin"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve hourly OHLCV data for Bitcoin from TokenMetrics for intraday analysis.",
                    action: "GET_HOURLY_OHLCV_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me hourly candle data for ETH for scalping"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get hourly OHLCV data for Ethereum optimized for scalping analysis.",
                    action: "GET_HOURLY_OHLCV_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get intraday trading data for the past 3 days"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve hourly OHLCV data for the past 3 days for intraday trading analysis.",
                    action: "GET_HOURLY_OHLCV_TOKENMETRICS"
                }
            }
        ]
    ],
    
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        try {
            const requestId = generateRequestId();
            elizaLogger.log(`[${requestId}] Processing hourly OHLCV request...`);
            
            // Ensure we have a proper state
            if (!state) {
                state = await runtime.composeState(message);
            }
            
            // Extract structured request using AI
            const ohlcvRequest = await extractTokenMetricsRequest<HourlyOhlcvRequest>(
                runtime,
                message,
                state,
                HOURLY_OHLCV_EXTRACTION_TEMPLATE,
                HourlyOhlcvRequestSchema,
                requestId
            );
            
            elizaLogger.log(`[${requestId}] Extracted request:`, ohlcvRequest);
            
            // Enhanced extraction with regex fallback for better symbol support
            let processedRequest = {
                cryptocurrency: ohlcvRequest.cryptocurrency,
                token_id: ohlcvRequest.token_id,
                symbol: ohlcvRequest.symbol,
                token_name: ohlcvRequest.token_name,
                startDate: ohlcvRequest.startDate,
                endDate: ohlcvRequest.endDate,
                limit: ohlcvRequest.limit || 50, // API maximum limit is 50
                page: ohlcvRequest.page || 1,
                analysisType: ohlcvRequest.analysisType || "all"
            };
            
            // Apply regex fallback if AI extraction failed or returned wrong data
            if (!processedRequest.cryptocurrency || processedRequest.cryptocurrency.toLowerCase().includes('unknown')) {
                elizaLogger.log(`[${requestId}] AI extraction failed, applying regex fallback...`);
                const regexResult = extractCryptocurrencySimple(message.content.text);
                if (regexResult.cryptocurrency) {
                    processedRequest.cryptocurrency = regexResult.cryptocurrency;
                    processedRequest.symbol = regexResult.symbol;
                    elizaLogger.log(`[${requestId}] Regex fallback found: ${regexResult.cryptocurrency} (${regexResult.symbol})`);
                }
            }
            
            // CRITICAL: Convert symbols to full names for API compatibility
            // The hourly OHLCV API only accepts full cryptocurrency names, not symbols
            if (processedRequest.cryptocurrency && processedRequest.cryptocurrency.length <= 5) {
                // This looks like a symbol, convert to full name
                const symbolToNameMap: Record<string, string> = {
                    'BTC': 'Bitcoin',
                    'ETH': 'Ethereum', 
                    'DOGE': 'Dogecoin',
                    'SOL': 'Solana',
                    'AVAX': 'Avalanche',
                    'ADA': 'Cardano',
                    'DOT': 'Polkadot',
                    'LINK': 'Chainlink',
                    'BNB': 'BNB',
                    'XRP': 'XRP',
                    'LTC': 'Litecoin',
                    'MATIC': 'Polygon',
                    'UNI': 'Uniswap',
                    'SHIB': 'Shiba Inu'
                };
                
                const fullName = symbolToNameMap[processedRequest.cryptocurrency.toUpperCase()];
                if (fullName) {
                    elizaLogger.log(`[${requestId}] Converting symbol ${processedRequest.cryptocurrency} to full name: ${fullName}`);
                    processedRequest.cryptocurrency = fullName;
                    if (!processedRequest.symbol) {
                        processedRequest.symbol = processedRequest.cryptocurrency.toUpperCase();
                    }
                }
            }
            
            // Resolve token if cryptocurrency name is provided
            let resolvedToken = null;
            if (processedRequest.cryptocurrency && !processedRequest.token_id && !processedRequest.symbol) {
                try {
                    resolvedToken = await resolveTokenSmart(processedRequest.cryptocurrency, runtime);
                    if (resolvedToken) {
                        processedRequest.token_id = resolvedToken.token_id;
                        processedRequest.symbol = resolvedToken.symbol;
                        elizaLogger.log(`[${requestId}] Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.symbol} (ID: ${resolvedToken.token_id})`);
                    }
                } catch (error) {
                    elizaLogger.log(`[${requestId}] Token resolution failed, proceeding with original request`);
                }
            }
            
            // Build API parameters - TokenMetrics hourly OHLCV accepts token_name parameter
            const apiParams: Record<string, any> = {
                limit: processedRequest.limit,
                page: processedRequest.page
            };
            
            // Add token identification parameter - use the full cryptocurrency name
            if (processedRequest.cryptocurrency) {
                apiParams.token_name = processedRequest.cryptocurrency;
                elizaLogger.log(`[${requestId}] Using token_name parameter: ${processedRequest.cryptocurrency}`);
            } else if (processedRequest.token_name) {
                apiParams.token_name = processedRequest.token_name;
                elizaLogger.log(`[${requestId}] Using provided token_name: ${processedRequest.token_name}`);
            }
            
            // Add date range parameters if provided
            if (processedRequest.startDate) apiParams.startDate = processedRequest.startDate;
            if (processedRequest.endDate) apiParams.endDate = processedRequest.endDate;
            
            // Make API call
            const response = await callTokenMetricsAPI(
                "/v2/hourly-ohlcv",
                apiParams,
                runtime
            );
            
            elizaLogger.log(`[${requestId}] API response received, processing data...`);
            
            // Process response data
            const ohlcvData = Array.isArray(response) ? response : response.data || [];
            
            // CRITICAL FIX: Handle mixed data issue where multiple tokens share same symbol
            // Example: BTC returns Bitcoin ($105K), batcat ($0.00003), and Osmosis allBTC ($105K)
            let filteredByToken = ohlcvData;
            
            if (ohlcvData.length > 0 && processedRequest.symbol) {
                // Group data by TOKEN_ID to identify multiple tokens with same symbol
                const tokenGroups = ohlcvData.reduce((groups: any, item: any) => {
                    const tokenId = item.TOKEN_ID;
                    if (!groups[tokenId]) {
                        groups[tokenId] = [];
                    }
                    groups[tokenId].push(item);
                    return groups;
                }, {});
                
                const tokenIds = Object.keys(tokenGroups);
                elizaLogger.log(`[${requestId}] Found ${tokenIds.length} different tokens for symbol ${processedRequest.symbol}:`, 
                    tokenIds.map(id => `${tokenGroups[id][0]?.TOKEN_NAME} (ID: ${id}, Price: ~$${tokenGroups[id][0]?.CLOSE})`));
                
                if (tokenIds.length > 1) {
                    // Multiple tokens found - select the main one based on criteria
                    let selectedTokenId = null;
                    let maxScore = -1;
                    
                    for (const tokenId of tokenIds) {
                        const tokenData = tokenGroups[tokenId];
                        const firstItem = tokenData[0];
                        
                        // Scoring criteria to identify the main token
                        let score = 0;
                        
                        // 1. Higher average price (main tokens usually have higher prices)
                        const avgPrice = tokenData.reduce((sum: number, item: any) => sum + (item.CLOSE || 0), 0) / tokenData.length;
                        if (avgPrice > 1000) score += 100;      // Very high price (like Bitcoin)
                        else if (avgPrice > 100) score += 50;   // High price
                        else if (avgPrice > 10) score += 20;    // Medium price
                        else if (avgPrice > 1) score += 10;     // Low price
                        // Very low prices (< $1) get no bonus
                        
                        // 2. Higher volume (main tokens have more trading activity)
                        const avgVolume = tokenData.reduce((sum: number, item: any) => sum + (item.VOLUME || 0), 0) / tokenData.length;
                        if (avgVolume > 1000000000) score += 50;    // Billions in volume
                        else if (avgVolume > 100000000) score += 30; // Hundreds of millions
                        else if (avgVolume > 10000000) score += 20;  // Tens of millions
                        else if (avgVolume > 1000000) score += 10;   // Millions
                        
                        // 3. Token name matching (exact matches get priority)
                        const tokenName = firstItem.TOKEN_NAME?.toLowerCase() || '';
                        const symbol = processedRequest.symbol?.toLowerCase() || '';
                        
                        if (tokenName === symbol) score += 30;                    // Exact match (e.g., "btc" === "btc")
                        else if (tokenName.includes(symbol)) score += 20;         // Contains symbol
                        else if (symbol === 'btc' && tokenName === 'bitcoin') score += 40;  // Special case: BTC -> Bitcoin
                        else if (symbol === 'eth' && tokenName === 'ethereum') score += 40; // Special case: ETH -> Ethereum
                        else if (symbol === 'doge' && tokenName === 'dogecoin') score += 40; // Special case: DOGE -> Dogecoin
                        
                        // 4. Avoid derivative/wrapped tokens
                        if (tokenName.includes('wrapped') || tokenName.includes('osmosis') || 
                            tokenName.includes('synthetic') || tokenName.includes('bridged')) {
                            score -= 20;
                        }
                        
                        elizaLogger.log(`[${requestId}] Token ${firstItem.TOKEN_NAME} (ID: ${tokenId}) score: ${score} (price: $${avgPrice.toFixed(6)}, volume: ${avgVolume.toFixed(0)})`);
                        
                        if (score > maxScore) {
                            maxScore = score;
                            selectedTokenId = tokenId;
                        }
                    }
                    
                    if (selectedTokenId) {
                        filteredByToken = tokenGroups[selectedTokenId];
                        const selectedToken = filteredByToken[0];
                        elizaLogger.log(`[${requestId}] Selected main token: ${selectedToken.TOKEN_NAME} (ID: ${selectedTokenId}) with score ${maxScore}`);
                    } else {
                        elizaLogger.log(`[${requestId}] No clear main token identified, using all data`);
                    }
                } else {
                    elizaLogger.log(`[${requestId}] Single token found: ${tokenGroups[tokenIds[0]][0]?.TOKEN_NAME}`);
                }
            }
            
            // Filter out invalid data points
            const validData = filteredByToken.filter((item: any) => {
                // Remove data points with zero or null values
                if (!item.OPEN || !item.HIGH || !item.LOW || !item.CLOSE || 
                    item.OPEN <= 0 || item.HIGH <= 0 || item.LOW <= 0 || item.CLOSE <= 0) {
                    elizaLogger.log(`[${requestId}] Filtering out invalid data point:`, item);
                    return false;
                }
                
                // Remove extreme outliers (price changes > 1000% in an hour)
                const priceRange = (item.HIGH - item.LOW) / item.LOW;
                if (priceRange > 10) { // 1000% hourly range is unrealistic
                    elizaLogger.log(`[${requestId}] Filtering out extreme outlier:`, item);
                    return false;
                }
                
                return true;
            });
            
            elizaLogger.log(`[${requestId}] Token filtering: ${ohlcvData.length} → ${filteredByToken.length} data points`);
            elizaLogger.log(`[${requestId}] Quality filtering: ${filteredByToken.length} → ${validData.length} valid points remaining`);
            
            // Sort data chronologically (oldest first for proper analysis)
            const sortedData = validData.sort((a: any, b: any) => new Date(a.DATE || a.TIMESTAMP).getTime() - new Date(b.DATE || b.TIMESTAMP).getTime());
            
            // Analyze the OHLCV data based on requested analysis type
            const ohlcvAnalysis = analyzeHourlyOhlcvData(sortedData, processedRequest.analysisType);
            
            // Format response text for user
            const tokenName = resolvedToken?.name || 
                             processedRequest.cryptocurrency || 
                             processedRequest.symbol || 
                             "the requested token";
            
            let responseText = `📊 **Hourly OHLCV Data for ${tokenName}**\n\n`;
            
            if (ohlcvData.length === 0) {
                responseText += `❌ No hourly OHLCV data found for ${tokenName}. This could mean:\n`;
                responseText += `• The token may not have sufficient trading history\n`;
                responseText += `• TokenMetrics may not have hourly data for this token\n`;
                responseText += `• Try using a different token name or symbol\n\n`;
                responseText += `💡 **Suggestion**: Try major cryptocurrencies like Bitcoin, Ethereum, or Solana.`;
            } else {
                // Show data quality info if filtering occurred
                if (ohlcvData.length > sortedData.length) {
                    const tokenFiltered = ohlcvData.length - filteredByToken.length;
                    const qualityFiltered = filteredByToken.length - sortedData.length;
                    
                    if (tokenFiltered > 0 && qualityFiltered > 0) {
                        responseText += `🔍 **Data Quality Note**: Filtered out ${tokenFiltered} mixed token data points and ${qualityFiltered} invalid data points for accurate analysis.\n\n`;
                    } else if (tokenFiltered > 0) {
                        responseText += `🔍 **Data Quality Note**: Selected main token from ${tokenFiltered + sortedData.length} mixed data points for accurate analysis.\n\n`;
                    } else if (qualityFiltered > 0) {
                        responseText += `🔍 **Data Quality Note**: Filtered out ${qualityFiltered} invalid data points for better analysis accuracy.\n\n`;
                    }
                }
                
                // Show recent OHLCV data points (most recent first for display)
                const recentData = sortedData.slice(-5).reverse(); // Get last 5 hours and reverse for display
                responseText += `📈 **Recent Hourly Data (Last ${recentData.length} hours):**\n`;
                
                recentData.forEach((item: any, index: number) => {
                    const date = new Date(item.DATE || item.TIMESTAMP);
                    const timeStr = date.toLocaleString();
                    responseText += `\n**Hour ${index + 1}** (${timeStr}):\n`;
                    responseText += `• Open: ${formatCurrency(item.OPEN)}\n`;
                    responseText += `• High: ${formatCurrency(item.HIGH)}\n`;
                    responseText += `• Low: ${formatCurrency(item.LOW)}\n`;
                    responseText += `• Close: ${formatCurrency(item.CLOSE)}\n`;
                    responseText += `• Volume: ${formatCurrency(item.VOLUME)}\n`;
                });
                
                // Add analysis summary
                if (ohlcvAnalysis && ohlcvAnalysis.summary) {
                    responseText += `\n\n📊 **Analysis Summary:**\n${ohlcvAnalysis.summary}\n`;
                }
                
                // Add price movement analysis
                if (ohlcvAnalysis?.price_analysis) {
                    const priceAnalysis = ohlcvAnalysis.price_analysis;
                    responseText += `\n💰 **Price Movement:**\n`;
                    responseText += `• Direction: ${priceAnalysis.direction}\n`;
                    responseText += `• Change: ${priceAnalysis.price_change} (${priceAnalysis.change_percent})\n`;
                    responseText += `• Range: ${priceAnalysis.lowest_price} - ${priceAnalysis.highest_price}\n`;
                }
                
                // Add volume analysis
                if (ohlcvAnalysis?.volume_analysis) {
                    const volumeAnalysis = ohlcvAnalysis.volume_analysis;
                    responseText += `\n📊 **Volume Analysis:**\n`;
                    responseText += `• Average Volume: ${volumeAnalysis.average_volume}\n`;
                    responseText += `• Volume Trend: ${volumeAnalysis.volume_trend}\n`;
                    responseText += `• Consistency: ${volumeAnalysis.volume_consistency}\n`;
                }
                
                // Add trading signals
                if (ohlcvAnalysis?.trading_signals?.signals?.length > 0) {
                    responseText += `\n🎯 **Trading Signals:**\n`;
                    ohlcvAnalysis.trading_signals.signals.forEach((signal: any) => {
                        responseText += `• ${signal.type}: ${signal.signal}\n`;
                    });
                }
                
                // Add analysis type specific insights
                if (processedRequest.analysisType === "scalping" && ohlcvAnalysis?.scalping_focus) {
                    responseText += `\n⚡ **Scalping Insights:**\n`;
                    ohlcvAnalysis.scalping_focus.scalping_insights?.forEach((insight: string) => {
                        responseText += `• ${insight}\n`;
                    });
                } else if (processedRequest.analysisType === "intraday" && ohlcvAnalysis?.intraday_focus) {
                    responseText += `\n📈 **Intraday Insights:**\n`;
                    ohlcvAnalysis.intraday_focus.intraday_insights?.forEach((insight: string) => {
                        responseText += `• ${insight}\n`;
                    });
                } else if (processedRequest.analysisType === "technical_patterns" && ohlcvAnalysis?.technical_focus) {
                    responseText += `\n🔍 **Technical Analysis:**\n`;
                    ohlcvAnalysis.technical_focus.technical_insights?.forEach((insight: string) => {
                        responseText += `• ${insight}\n`;
                    });
                }
                
                responseText += `\n\n📋 **Data Summary:**\n`;
                responseText += `• Total Data Points: ${sortedData.length}\n`;
                responseText += `• Timeframe: 1 hour intervals\n`;
                responseText += `• Analysis Type: ${processedRequest.analysisType}\n`;
                responseText += `• Data Source: TokenMetrics Official API\n`;
            }
            
            const result = {
                success: true,
                message: `Successfully retrieved ${sortedData.length} hourly OHLCV data points`,
                request_id: requestId,
                ohlcv_data: sortedData,
                analysis: ohlcvAnalysis,
                metadata: {
                    endpoint: "hourly-ohlcv",
                    requested_token: processedRequest.cryptocurrency || processedRequest.symbol || processedRequest.token_id,
                    resolved_token: resolvedToken,
                    date_range: {
                        start: processedRequest.startDate,
                        end: processedRequest.endDate
                    },
                    analysis_focus: processedRequest.analysisType,
                    pagination: {
                        page: processedRequest.page,
                        limit: processedRequest.limit
                    },
                    data_points: sortedData.length,
                    timeframe: "1 hour",
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                ohlcv_explanation: {
                    OPEN: "Opening price at the start of the hour",
                    HIGH: "Highest price during the hour",
                    LOW: "Lowest price during the hour", 
                    CLOSE: "Closing price at the end of the hour",
                    VOLUME: "Total trading volume during the hour",
                    usage_tips: [
                        "Use for intraday technical analysis and pattern recognition",
                        "Higher volume confirms price movements",
                        "Compare hourly ranges to identify volatility patterns",
                        "Ideal for scalping and day trading strategies"
                    ]
                }
            };
            
            elizaLogger.log(`[${requestId}] Hourly OHLCV analysis completed successfully`);
            
            // Use callback pattern to send formatted response
            if (callback) {
                callback({
                    text: responseText,
                    content: result
                });
            }
            return true;
            
        } catch (error) {
            elizaLogger.error("Error in getHourlyOhlcvAction:", error);
            
            const errorMessage = `❌ **Failed to retrieve hourly OHLCV data**\n\n`;
            const errorText = errorMessage + 
                `**Error**: ${error instanceof Error ? error.message : "Unknown error occurred"}\n\n` +
                `**Troubleshooting Tips:**\n` +
                `• Verify the token name or symbol is correct\n` +
                `• Check your TokenMetrics API key is valid\n` +
                `• Try using major cryptocurrencies like Bitcoin or Ethereum\n` +
                `• Ensure your subscription includes OHLCV data access\n\n` +
                `**Common Solutions:**\n` +
                `• Remove date filters to get recent data\n` +
                `• Reduce the limit if requesting too much data\n` +
                `• Check if the token has sufficient trading history`;
            
            const errorResult = {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                message: "Failed to retrieve hourly OHLCV data from TokenMetrics API",
                troubleshooting: {
                    endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/hourly-ohlcv is accessible",
                    parameter_validation: [
                        "Verify token_id is a valid number or symbol is a valid string",
                        "Check that date parameters use startDate/endDate format (YYYY-MM-DD)",
                        "Ensure your API key has access to OHLCV data",
                        "Confirm the token has sufficient trading history"
                    ],
                    common_solutions: [
                        "Try using a major token (BTC, ETH) to test functionality",
                        "Remove date filters to get recent data",
                        "Check if your subscription includes OHLCV data access",
                        "Reduce the limit if requesting too much data"
                    ]
                }
            };
            
            if (callback) {
                callback({
                    text: errorText,
                    content: errorResult
                });
            }
            return false;
        }
    },
    
    validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        elizaLogger.log("🔍 Validating getHourlyOhlcvAction (1.x)");
        
        try {
            validateAndGetApiKey(runtime);
            return true;
        } catch (error) {
            elizaLogger.error("❌ Validation failed:", error);
            return false;
        }
    }
};

/**
 * Analyze hourly OHLCV data for trading insights based on analysis type
 */
function analyzeHourlyOhlcvData(ohlcvData: any[], analysisType: string = "all"): any {
    if (!ohlcvData || ohlcvData.length === 0) {
        return {
            summary: "No hourly OHLCV data available for analysis",
            price_action: "Cannot assess",
            insights: []
        };
    }
    
    // Sort data chronologically (oldest first for proper analysis)
    const sortedData = ohlcvData.sort((a: any, b: any) => new Date(a.DATE || a.TIMESTAMP).getTime() - new Date(b.DATE || b.TIMESTAMP).getTime());
    
    // Core analysis components
    const priceAnalysis = analyzePriceMovement(sortedData);
    const volumeAnalysis = analyzeVolumePatterns(sortedData);
    const volatilityAnalysis = analyzeVolatility(sortedData);
    const trendAnalysis = analyzeTrend(sortedData);
    const technicalAnalysis = analyzeTechnicalPatterns(sortedData);
    
    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "scalping":
            focusedAnalysis = {
                scalping_focus: {
                    micro_movements: analyzeScalpingOpportunities(sortedData),
                    volume_spikes: identifyVolumeSpikes(sortedData),
                    scalping_signals: generateScalpingSignals(priceAnalysis, volumeAnalysis),
                    scalping_insights: [
                        `⚡ Micro-movements detected: ${priceAnalysis.micro_movements || 0}`,
                        `📊 Volume spikes: ${volumeAnalysis.volume_spikes || 0}`,
                        `🎯 Scalping opportunities: ${priceAnalysis.scalping_opportunities || 0}`
                    ]
                }
            };
            break;
            
        case "intraday":
            focusedAnalysis = {
                intraday_focus: {
                    day_trading_patterns: analyzeIntradayPatterns(sortedData),
                    session_analysis: analyzeSessionBreakdowns(sortedData),
                    intraday_signals: generateIntradaySignals(priceAnalysis, trendAnalysis),
                    intraday_insights: [
                        `📈 Intraday trend: ${trendAnalysis.direction}`,
                        `🕐 Best trading hours: ${identifyBestTradingHours(sortedData)}`,
                        `💹 Day trading setups: ${technicalAnalysis.day_trading_setups || 0}`
                    ]
                }
            };
            break;
            
        case "technical_patterns":
            focusedAnalysis = {
                technical_focus: {
                    chart_patterns: identifyChartPatterns(sortedData),
                    support_resistance: findHourlyLevels(sortedData),
                    technical_indicators: calculateHourlyIndicators(sortedData),
                    technical_insights: [
                        `📊 Chart patterns: ${technicalAnalysis.patterns_count || 0}`,
                        `🎯 Support/Resistance levels: ${technicalAnalysis.key_levels || 0}`,
                        `📈 Technical signals: ${technicalAnalysis.signals_count || 0}`
                    ]
                }
            };
            break;
    }
    
    return {
        summary: `Hourly analysis of ${sortedData.length} data points showing ${priceAnalysis.direction || 'neutral'} price action with ${volatilityAnalysis.level || 'unknown'} volatility`,
        analysis_type: analysisType,
        price_analysis: priceAnalysis,
        volume_analysis: volumeAnalysis,
        volatility_analysis: volatilityAnalysis,
        trend_analysis: trendAnalysis,
        technical_analysis: technicalAnalysis,
        trading_signals: generateTradingSignals(priceAnalysis, volumeAnalysis, trendAnalysis),
        insights: generateOhlcvInsights(priceAnalysis, volumeAnalysis, volatilityAnalysis, trendAnalysis),
        risk_assessment: determineRiskLevel(priceAnalysis, volumeAnalysis),
        ...focusedAnalysis,
        data_quality: {
            source: "TokenMetrics Official API",
            completeness: calculateDataCompleteness(sortedData),
            volume_consistency: calculateVolumeConsistency(sortedData.map(d => d.VOLUME).filter(v => v)),
            data_points: sortedData.length,
            timeframe_coverage: calculateTimeframeCoverage(sortedData)
        },
        trading_recommendations: generateHourlyTradingRecommendations(trendAnalysis, technicalAnalysis, analysisType)
    };
}

function analyzePriceMovement(data: any[]): any {
    if (data.length < 2) return { change: 0, change_percent: 0, direction: "Sideways" };
    
    const firstPrice = data[0].OPEN; // Oldest data point
    const lastPrice = data[data.length - 1].CLOSE; // Newest data point
    const highestPrice = Math.max(...data.map(d => d.HIGH));
    const lowestPrice = Math.min(...data.map(d => d.LOW));
    
    const priceChange = lastPrice - firstPrice;
    const changePercent = ((priceChange / firstPrice) * 100);
    const priceRange = highestPrice - lowestPrice;
    const rangePercent = ((priceRange / firstPrice) * 100);
    
    return {
        start_price: formatCurrency(firstPrice),
        end_price: formatCurrency(lastPrice),
        price_change: formatCurrency(priceChange),
        change_percent: formatPercentage(changePercent),
        highest_price: formatCurrency(highestPrice),
        lowest_price: formatCurrency(lowestPrice),
        price_range: formatCurrency(priceRange),
        range_percent: formatPercentage(rangePercent),
        direction: priceChange > 0 ? "Bullish" : priceChange < 0 ? "Bearish" : "Sideways",
        overall_direction: priceChange > 0 ? "Bullish" : priceChange < 0 ? "Bearish" : "Sideways" // Add this for backward compatibility
    };
}

function analyzeVolumePatterns(data: any[]): any {
    const volumes = data.map(d => d.VOLUME).filter(v => v > 0);
    if (volumes.length === 0) return { average_volume: 0, pattern: "No data" };
    
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    const maxVolume = Math.max(...volumes);
    const minVolume = Math.min(...volumes);
    
    // Calculate volume trend
    const firstHalf = volumes.slice(0, Math.floor(volumes.length / 2));
    const secondHalf = volumes.slice(Math.floor(volumes.length / 2));
    const firstHalfAvg = firstHalf.reduce((sum, vol) => sum + vol, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, vol) => sum + vol, 0) / secondHalf.length;
    
    const volumeTrend = secondHalfAvg > firstHalfAvg * 1.1 ? "Increasing" : 
                       secondHalfAvg < firstHalfAvg * 0.9 ? "Decreasing" : "Stable";
    
    return {
        average_volume: formatCurrency(avgVolume),
        max_volume: formatCurrency(maxVolume),
        min_volume: formatCurrency(minVolume),
        volume_trend: volumeTrend,
        volume_consistency: calculateVolumeConsistency(volumes)
    };
}

function analyzeVolatility(data: any[]): any {
    if (data.length < 2) return { level: "Unknown" };
    
    // Calculate hourly volatility using high-low ranges
    const hourlyRanges = data.map(d => (d.HIGH - d.LOW) / d.OPEN * 100);
    const avgRange = hourlyRanges.reduce((sum, range) => sum + range, 0) / hourlyRanges.length;
    
    let volatilityLevel;
    if (avgRange > 5) volatilityLevel = "Very High";
    else if (avgRange > 3) volatilityLevel = "High";
    else if (avgRange > 2) volatilityLevel = "Moderate";
    else if (avgRange > 1) volatilityLevel = "Low";
    else volatilityLevel = "Very Low";
    
    return {
        level: volatilityLevel,
        average_hourly_range: formatPercentage(avgRange),
        max_hourly_range: formatPercentage(Math.max(...hourlyRanges)),
        volatility_trend: calculateVolatilityTrend(hourlyRanges)
    };
}

function analyzeTrend(data: any[]): any {
    if (data.length < 2) return { direction: "Insufficient Data" };
    
    const closes = data.map(d => d.CLOSE);
    const periods = [5, 10, 20]; // Moving averages
    const trends = [];
    
    // Adapt analysis to available data
    for (const period of periods) {
        if (closes.length >= period) {
            const recentMA = closes.slice(-period).reduce((sum, price) => sum + price, 0) / period;
            if (closes.length >= period * 2) {
                const earlierMA = closes.slice(-period * 2, -period).reduce((sum, price) => sum + price, 0) / period;
                trends.push(recentMA > earlierMA ? 1 : -1);
            } else {
                // For limited data, compare recent MA to first price
                const firstPrice = closes[0];
                trends.push(recentMA > firstPrice ? 1 : -1);
            }
        }
    }
    
    // If no moving averages possible, use simple price comparison
    if (trends.length === 0) {
        const firstPrice = closes[0];
        const lastPrice = closes[closes.length - 1];
        const change = (lastPrice - firstPrice) / firstPrice;
        
        if (change > 0.01) trends.push(1);      // >1% up
        else if (change < -0.01) trends.push(-1); // >1% down
        else trends.push(0);                     // sideways
    }
    
    const overallTrend = trends.reduce((sum, trend) => sum + trend, 0);
    let direction;
    if (overallTrend > 0) direction = "Uptrend";
    else if (overallTrend < 0) direction = "Downtrend";
    else direction = "Sideways";
    
    // Determine strength based on available data
    let strength;
    if (data.length >= 10) {
        strength = Math.abs(overallTrend) > 2 ? "Strong" : "Weak";
    } else {
        // For limited data, use price change magnitude
        const firstPrice = closes[0];
        const lastPrice = closes[closes.length - 1];
        const change = Math.abs((lastPrice - firstPrice) / firstPrice);
        strength = change > 0.05 ? "Strong" : "Weak"; // 5% threshold for limited data
    }
    
    // Short-term bias calculation
    let shortTermBias;
    if (closes.length >= 6) {
        shortTermBias = closes[closes.length - 1] > closes[closes.length - 6] ? "Bullish" : "Bearish";
    } else {
        // Use available data for bias
        const midPoint = Math.floor(closes.length / 2);
        const recentAvg = closes.slice(midPoint).reduce((sum, price) => sum + price, 0) / (closes.length - midPoint);
        const earlierAvg = closes.slice(0, midPoint).reduce((sum, price) => sum + price, 0) / midPoint;
        shortTermBias = recentAvg > earlierAvg ? "Bullish" : "Bearish";
    }
    
    return {
        direction: direction,
        strength: strength,
        short_term_bias: shortTermBias,
        trend_confidence: trends.length > 1 ? "High" : "Moderate"
    };
}

function generateOhlcvInsights(priceAnalysis: any, volumeAnalysis: any, volatilityAnalysis: any, trendAnalysis: any): string[] {
    const insights = [];
    
    // Price movement insights
    if (parseFloat(priceAnalysis.change_percent) > 5) {
        insights.push(`Strong hourly movement of ${priceAnalysis.change_percent} indicates significant market activity`);
    }
    
    // Volume insights
    if (volumeAnalysis.volume_trend === "Increasing") {
        insights.push("Increasing volume confirms the price movement and suggests continuation");
    } else if (volumeAnalysis.volume_trend === "Decreasing") {
        insights.push("Decreasing volume suggests weakening momentum");
    }
    
    // Volatility insights
    if (volatilityAnalysis.level === "Very High") {
        insights.push("Very high volatility creates both opportunities and risks for intraday trading");
    } else if (volatilityAnalysis.level === "Very Low") {
        insights.push("Low volatility suggests consolidation phase or limited trading interest");
    }
    
    // Trend insights
    if (trendAnalysis.direction === "Uptrend" && trendAnalysis.strength === "Strong") {
        insights.push("Strong uptrend supported by multiple timeframes favors long positions");
    } else if (trendAnalysis.direction === "Downtrend" && trendAnalysis.strength === "Strong") {
        insights.push("Strong downtrend suggests continued selling pressure");
    }
    
    return insights;
}

function generateTradingSignals(priceAnalysis: any, volumeAnalysis: any, trendAnalysis: any): any {
    const signals = [];
    
    // Trend-based signals
    if (trendAnalysis.direction === "Uptrend" && volumeAnalysis.volume_trend === "Increasing") {
        signals.push({
            type: "BULLISH",
            signal: "Uptrend with increasing volume suggests buying opportunity",
            confidence: "High"
        });
    }
    
    if (trendAnalysis.direction === "Downtrend" && volumeAnalysis.volume_trend === "Increasing") {
        signals.push({
            type: "BEARISH", 
            signal: "Downtrend with increasing volume suggests selling pressure",
            confidence: "High"
        });
    }
    
    // Consolidation signals
    if (trendAnalysis.direction === "Sideways") {
        signals.push({
            type: "NEUTRAL",
            signal: "Sideways trend suggests range-bound trading opportunities",
            confidence: "Moderate"
        });
    }
    
    return {
        signals: signals,
        recommendation: signals.length > 0 ? signals[0].type : "HOLD",
        risk_level: determineRiskLevel(priceAnalysis, volumeAnalysis)
    };
}

function calculateDataCompleteness(data: any[]): string {
    if (data.length === 0) return "No data";
    
    const requiredFields = ['OPEN', 'HIGH', 'LOW', 'CLOSE', 'VOLUME'];
    let completeness = 0;
    
    data.forEach(item => {
        const presentFields = requiredFields.filter(field => 
            item[field] !== null && item[field] !== undefined && !isNaN(item[field])
        );
        completeness += presentFields.length / requiredFields.length;
    });
    
    const avgCompleteness = (completeness / data.length) * 100;
    
    if (avgCompleteness > 95) return "Excellent";
    if (avgCompleteness > 85) return "Good";
    if (avgCompleteness > 70) return "Fair";
    return "Poor";
}

function calculateVolumeConsistency(volumes: number[]): string {
    if (volumes.length < 2) return "Insufficient data";
    
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    const variance = volumes.reduce((sum, vol) => sum + Math.pow(vol - avgVolume, 2), 0) / volumes.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / avgVolume;
    
    if (coefficientOfVariation < 0.5) return "Very Consistent";
    if (coefficientOfVariation < 1.0) return "Consistent";
    if (coefficientOfVariation < 2.0) return "Moderate";
    return "Highly Variable";
}

function calculateVolatilityTrend(ranges: number[]): string {
    if (ranges.length < 3) return "Insufficient data";
    
    const recentRanges = ranges.slice(-5);
    const earlierRanges = ranges.slice(0, 5);
    
    const recentAvg = recentRanges.reduce((sum, range) => sum + range, 0) / recentRanges.length;
    const earlierAvg = earlierRanges.reduce((sum, range) => sum + range, 0) / earlierRanges.length;
    
    if (recentAvg > earlierAvg * 1.2) return "Increasing";
    if (recentAvg < earlierAvg * 0.8) return "Decreasing";
    return "Stable";
}

function determineRiskLevel(priceAnalysis: any, volumeAnalysis: any): string {
    const priceVolatility = parseFloat(priceAnalysis.range_percent?.replace('%', '') || '0');
    const volumeConsistency = volumeAnalysis.volume_consistency;
    
    if (priceVolatility > 10 || volumeConsistency === "Highly Variable") return "High";
    if (priceVolatility > 5 || volumeConsistency === "Moderate") return "Medium";
    return "Low";
}

function calculateTimeframeCoverage(data: any[]): string {
    if (data.length === 0) return "No coverage";
    
    const hours = data.length;
    if (hours >= 168) return `${Math.floor(hours / 24)} days`;
    if (hours >= 24) return `${Math.floor(hours / 24)} days, ${hours % 24} hours`;
    return `${hours} hours`;
}

function generateHourlyTradingRecommendations(trendAnalysis: any, technicalAnalysis: any, analysisType: string): any {
    const recommendations = [];
    
    // Base recommendations on trend
    if (trendAnalysis.direction === "Bullish") {
        recommendations.push("Consider long positions on pullbacks");
        recommendations.push("Look for breakout opportunities above resistance");
    } else if (trendAnalysis.direction === "Bearish") {
        recommendations.push("Consider short positions on rallies");
        recommendations.push("Look for breakdown opportunities below support");
    } else {
        recommendations.push("Range-bound trading strategies may be effective");
        recommendations.push("Wait for clear directional breakout");
    }
    
    // Analysis type specific recommendations
    if (analysisType === "scalping") {
        recommendations.push("Focus on 1-5 minute entries and exits");
        recommendations.push("Use tight stop losses (0.1-0.3%)");
        recommendations.push("Target quick profits (0.2-0.5%)");
    } else if (analysisType === "intraday") {
        recommendations.push("Plan entries during high volume periods");
        recommendations.push("Use hourly support/resistance levels");
        recommendations.push("Consider session-based strategies");
    }
    
    return {
        primary_recommendations: recommendations.slice(0, 3),
        risk_management: [
            "Use appropriate position sizing",
            "Set stop losses based on volatility",
            "Monitor volume for confirmation"
        ],
        timing_considerations: [
            "Higher volume hours typically offer better liquidity",
            "Avoid trading during low volume periods",
            "Consider market session overlaps"
        ]
    };
}

// New analysis functions for focused analysis types

function analyzeTechnicalPatterns(data: any[]): any {
    if (data.length < 10) {
        return {
            patterns_count: 0,
            key_levels: 0,
            signals_count: 0,
            day_trading_setups: 0
        };
    }
    
    const closes = data.map(d => d.CLOSE).filter(c => c);
    const highs = data.map(d => d.HIGH).filter(h => h);
    const lows = data.map(d => d.LOW).filter(l => l);
    
    // Simple pattern detection
    let patternsCount = 0;
    let signalsCount = 0;
    
    // Look for higher highs/lower lows patterns
    for (let i = 2; i < closes.length; i++) {
        if (closes[i] > closes[i-1] && closes[i-1] > closes[i-2]) {
            patternsCount++;
            signalsCount++;
        }
        if (closes[i] < closes[i-1] && closes[i-1] < closes[i-2]) {
            patternsCount++;
            signalsCount++;
        }
    }
    
    // Count potential support/resistance levels
    const keyLevels = findKeyLevels(highs, lows);
    
    return {
        patterns_count: patternsCount,
        key_levels: keyLevels.length,
        signals_count: signalsCount,
        day_trading_setups: Math.floor(patternsCount / 2),
        support_levels: keyLevels.filter(l => l.type === 'support').length,
        resistance_levels: keyLevels.filter(l => l.type === 'resistance').length
    };
}

function analyzeScalpingOpportunities(data: any[]): number {
    if (data.length < 5) return 0;
    
    let opportunities = 0;
    
    // Look for quick price movements with volume confirmation
    for (let i = 1; i < data.length; i++) {
        const priceChange = Math.abs((data[i].CLOSE - data[i-1].CLOSE) / data[i-1].CLOSE);
        const volumeRatio = data[i].VOLUME / (data[i-1].VOLUME || 1);
        
        // Scalping opportunity: quick price move with volume
        if (priceChange > 0.002 && volumeRatio > 1.2) { // 0.2% price move with 20% volume increase
            opportunities++;
        }
    }
    
    return opportunities;
}

function identifyVolumeSpikes(data: any[]): number {
    if (data.length < 5) return 0;
    
    const volumes = data.map(d => d.VOLUME).filter(v => v);
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    
    return volumes.filter(vol => vol > avgVolume * 2).length; // Volume spikes > 2x average
}

function generateScalpingSignals(priceAnalysis: any, volumeAnalysis: any): any {
    const signals = [];
    
    if (priceAnalysis.direction === "Bullish" && volumeAnalysis.volume_trend === "Increasing") {
        signals.push("Long scalp opportunity on momentum");
    }
    
    if (priceAnalysis.direction === "Bearish" && volumeAnalysis.volume_trend === "Increasing") {
        signals.push("Short scalp opportunity on momentum");
    }
    
    if (volumeAnalysis.volume_consistency === "Highly Variable") {
        signals.push("High volatility - good for scalping");
    }
    
    return {
        active_signals: signals,
        signal_strength: signals.length > 2 ? "Strong" : signals.length > 0 ? "Moderate" : "Weak"
    };
}

function analyzeIntradayPatterns(data: any[]): any {
    if (data.length < 24) {
        return {
            session_patterns: "Insufficient data",
            best_hours: "Unknown",
            volume_patterns: "Unknown"
        };
    }
    
    // Group by hour to find patterns
    const hourlyData = new Map();
    
    data.forEach(item => {
        const date = new Date(item.DATE || item.TIMESTAMP);
        const hour = date.getHours();
        
        if (!hourlyData.has(hour)) {
            hourlyData.set(hour, []);
        }
        hourlyData.get(hour).push(item);
    });
    
    // Find most active hours
    const hourlyVolumes = Array.from(hourlyData.entries()).map(([hour, items]) => ({
        hour,
        avgVolume: items.reduce((sum: number, item: any) => sum + (item.VOLUME || 0), 0) / items.length,
        count: items.length
    }));
    
    const bestHours = hourlyVolumes
        .sort((a, b) => b.avgVolume - a.avgVolume)
        .slice(0, 3)
        .map(h => `${h.hour}:00`);
    
    return {
        session_patterns: "Analyzed",
        best_hours: bestHours.join(", "),
        volume_patterns: hourlyVolumes.length > 12 ? "Clear patterns" : "Limited patterns",
        peak_activity_hours: bestHours
    };
}

function analyzeSessionBreakdowns(data: any[]): any {
    // Simplified session analysis
    const sessions = {
        asian: { start: 0, end: 8, volume: 0, count: 0 },
        european: { start: 8, end: 16, volume: 0, count: 0 },
        american: { start: 16, end: 24, volume: 0, count: 0 }
    };
    
    data.forEach(item => {
        const date = new Date(item.DATE || item.TIMESTAMP);
        const hour = date.getUTCHours();
        const volume = item.VOLUME || 0;
        
        if (hour >= sessions.asian.start && hour < sessions.asian.end) {
            sessions.asian.volume += volume;
            sessions.asian.count++;
        } else if (hour >= sessions.european.start && hour < sessions.european.end) {
            sessions.european.volume += volume;
            sessions.european.count++;
        } else {
            sessions.american.volume += volume;
            sessions.american.count++;
        }
    });
    
    // Calculate average volumes
    Object.keys(sessions).forEach(session => {
        const s = sessions[session as keyof typeof sessions];
        s.volume = s.count > 0 ? s.volume / s.count : 0;
    });
    
    return sessions;
}

function generateIntradaySignals(priceAnalysis: any, trendAnalysis: any): any {
    const signals = [];
    
    if (trendAnalysis.direction === "Bullish" && trendAnalysis.strength === "Strong") {
        signals.push("Strong intraday uptrend - consider long positions");
    }
    
    if (trendAnalysis.direction === "Bearish" && trendAnalysis.strength === "Strong") {
        signals.push("Strong intraday downtrend - consider short positions");
    }
    
    if (priceAnalysis.direction === "Sideways") {
        signals.push("Range-bound - consider mean reversion strategies");
    }
    
    return {
        signals: signals,
        confidence: signals.length > 1 ? "High" : signals.length > 0 ? "Medium" : "Low"
    };
}

function identifyBestTradingHours(data: any[]): string {
    if (data.length < 24) return "Insufficient data";
    
    const hourlyActivity = new Map();
    
    data.forEach(item => {
        const date = new Date(item.DATE || item.TIMESTAMP);
        const hour = date.getHours();
        
        if (!hourlyActivity.has(hour)) {
            hourlyActivity.set(hour, { volume: 0, volatility: 0, count: 0 });
        }
        
        const activity = hourlyActivity.get(hour);
        activity.volume += item.VOLUME || 0;
        activity.volatility += Math.abs((item.HIGH - item.LOW) / item.CLOSE) || 0;
        activity.count++;
    });
    
    // Calculate averages and find best hours
    const hourlyScores = Array.from(hourlyActivity.entries()).map(([hour, data]) => ({
        hour,
        score: (data.volume / data.count) * (data.volatility / data.count)
    }));
    
    const bestHours = hourlyScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(h => `${h.hour}:00`);
    
    return bestHours.join(", ");
}

function identifyChartPatterns(data: any[]): any {
    if (data.length < 10) {
        return {
            patterns: [],
            count: 0
        };
    }
    
    const patterns = [];
    const closes = data.map(d => d.CLOSE);
    
    // Simple pattern detection
    for (let i = 4; i < closes.length - 4; i++) {
        // Double top pattern
        if (closes[i-2] < closes[i] && closes[i+2] < closes[i] && 
            Math.abs(closes[i] - closes[i-4]) < closes[i] * 0.02) {
            patterns.push({ type: "Double Top", position: i, strength: "Medium" });
        }
        
        // Double bottom pattern
        if (closes[i-2] > closes[i] && closes[i+2] > closes[i] && 
            Math.abs(closes[i] - closes[i-4]) < closes[i] * 0.02) {
            patterns.push({ type: "Double Bottom", position: i, strength: "Medium" });
        }
    }
    
    return {
        patterns: patterns,
        count: patterns.length
    };
}

function findHourlyLevels(data: any[]): any {
    const levels = findKeyLevels(
        data.map(d => d.HIGH).filter(h => h),
        data.map(d => d.LOW).filter(l => l)
    );
    
    return {
        support_levels: levels.filter(l => l.type === 'support'),
        resistance_levels: levels.filter(l => l.type === 'resistance'),
        total_levels: levels.length
    };
}

function calculateHourlyIndicators(data: any[]): any {
    if (data.length < 20) {
        return {
            sma_20: null,
            rsi: null,
            bollinger_bands: null
        };
    }
    
    const closes = data.map(d => d.CLOSE).filter(c => c);
    
    // Simple Moving Average (20 periods)
    const sma20 = closes.slice(-20).reduce((sum, price) => sum + price, 0) / 20;
    
    // Simple RSI calculation
    let gains = 0;
    let losses = 0;
    for (let i = 1; i < Math.min(15, closes.length); i++) {
        const change = closes[i] - closes[i-1];
        if (change > 0) gains += change;
        else losses += Math.abs(change);
    }
    
    const avgGain = gains / 14;
    const avgLoss = losses / 14;
    const rs = avgGain / (avgLoss || 1);
    const rsi = 100 - (100 / (1 + rs));
    
    return {
        sma_20: sma20,
        rsi: rsi,
        bollinger_bands: {
            upper: sma20 * 1.02,
            lower: sma20 * 0.98,
            middle: sma20
        }
    };
}

function findKeyLevels(highs: number[], lows: number[]): Array<{price: number, type: string, strength: number}> {
    const levels: Array<{price: number, type: string, strength: number}> = [];
    
    // Find resistance levels from highs
    const sortedHighs = [...highs].sort((a, b) => b - a);
    const topHighs = sortedHighs.slice(0, 3);
    
    topHighs.forEach(high => {
        const occurrences = highs.filter(h => Math.abs(h - high) < high * 0.005).length;
        if (occurrences >= 2) {
            levels.push({ price: high, type: 'resistance', strength: occurrences });
        }
    });
    
    // Find support levels from lows
    const sortedLows = [...lows].sort((a, b) => a - b);
    const bottomLows = sortedLows.slice(0, 3);
    
    bottomLows.forEach(low => {
        const occurrences = lows.filter(l => Math.abs(l - low) < low * 0.005).length;
        if (occurrences >= 2) {
            levels.push({ price: low, type: 'support', strength: occurrences });
        }
    });
    
    return levels;
}
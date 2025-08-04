import type { Action, ActionResult } from "@elizaos/core";
import {
    type IAgentRuntime,
    type Memory,
    type State,
    type HandlerCallback,
    elizaLogger,
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
import type { DailyOhlcvResponse } from "../types";

// Zod schema for daily OHLCV request validation
const DailyOhlcvRequestSchema = z.object({
    cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
    token_id: z.number().optional().describe("Specific token ID if known"),
    symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
    token_name: z.string().optional().describe("Full name of the token"),
    startDate: z.string().optional().describe("Start date for data range (YYYY-MM-DD)"),
    endDate: z.string().optional().describe("End date for data range (YYYY-MM-DD)"),
    limit: z.number().min(1).max(1000).optional().describe("Number of data points to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["swing_trading", "trend_analysis", "technical_indicators", "all"]).optional().describe("Type of analysis to focus on")
});

type DailyOhlcvRequest = z.infer<typeof DailyOhlcvRequestSchema>;

// Enhanced AI extraction template for natural language processing
const DAILY_OHLCV_EXTRACTION_TEMPLATE = `
CRITICAL INSTRUCTION: Extract the EXACT cryptocurrency name or symbol mentioned by the user. Do NOT substitute or change it.

You are an AI assistant specialized in extracting daily OHLCV data requests from natural language.

The user wants to get daily OHLCV (Open, High, Low, Close, Volume) data for cryptocurrency analysis. Extract the following information:

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
   - Convert relative dates like "last month", "past 30 days"

6. **endDate** (optional): End date for data range
   - Look for dates in YYYY-MM-DD format

7. **limit** (optional, default: 50): Number of data points to return
   - Look for phrases like "50 days", "last 100 candles", "200 data points"

8. **page** (optional, default: 1): Page number for pagination

9. **analysisType** (optional, default: "all"): What type of analysis they want
   - "swing_trading" - focus on swing trading opportunities and signals
   - "trend_analysis" - focus on trend identification and direction
   - "technical_indicators" - focus on technical indicators and patterns
   - "all" - comprehensive OHLCV analysis

CRITICAL EXAMPLES:
- "Get daily OHLCV for Bitcoin" → {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Show me daily candles for BTC" → {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Daily data for ETH for swing trading" → {cryptocurrency: "Ethereum", symbol: "ETH", analysisType: "swing_trading"}
- "DOGE daily OHLCV" → {cryptocurrency: "Dogecoin", symbol: "DOGE", analysisType: "all"}
- "Solana trend analysis" → {cryptocurrency: "Solana", symbol: "SOL", analysisType: "trend_analysis"}

Extract the request details from the user's message and respond in XML format:

<response>
<cryptocurrency>exact cryptocurrency name or symbol from user's message</cryptocurrency>
<symbol>token symbol if mentioned</symbol>
<token_id>specific token ID if mentioned</token_id>
<token_name>full name of the token</token_name>
<startDate>start date in YYYY-MM-DD format</startDate>
<endDate>end date in YYYY-MM-DD format</endDate>
<limit>number of data points to return</limit>
<page>page number</page>
<analysisType>swing_trading|trend_analysis|technical_indicators|all</analysisType>
</response>
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
 * DAILY OHLCV ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/daily-ohlcv
 * 
 * This action provides daily OHLCV (Open, High, Low, Close, Volume) data for tokens.
 * Essential for swing trading, technical analysis, and medium-term investment strategies.
 */
export const getDailyOhlcvAction: Action = {
    name: "GET_DAILY_OHLCV_TOKENMETRICS",
    description: "Get daily OHLCV (Open, High, Low, Close, Volume) data for cryptocurrency tokens from TokenMetrics",
    similes: [
        "get daily ohlcv",
        "daily price data",
        "daily candles",
        "daily chart data",
        "swing trading data",
        "daily technical analysis",
        "daily market data"
    ],
    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Get daily OHLCV for Bitcoin"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll get the daily OHLCV data for Bitcoin.",
                    action: "GET_DAILY_OHLCV_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Show daily price data for ETH"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll retrieve daily OHLCV data for Ethereum.",
                    action: "GET_DAILY_OHLCV_TOKENMETRICS"
                }
            }
        ],
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Daily candles for long-term analysis"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll get daily OHLCV data for long-term analysis.",
                    action: "GET_DAILY_OHLCV_TOKENMETRICS"
                }
            }
        ]
    ],
    
    async handler(
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<ActionResult> {
        try {
            const requestId = generateRequestId();
            console.log(`[${requestId}] Processing daily OHLCV request...`);
            
            // Extract structured request using AI with user message injection
            const userMessage = message.content?.text || "";
            
            // Inject user message directly into template
            const enhancedTemplate = DAILY_OHLCV_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;

            const ohlcvRequest = await extractTokenMetricsRequest<DailyOhlcvRequest>(
                runtime,
                message,
                state || await runtime.composeState(message),
                enhancedTemplate,
                DailyOhlcvRequestSchema,
                requestId
            );
            
            console.log(`[${requestId}] Extracted request:`, ohlcvRequest);
            
            // Enhanced extraction with null checking and regex fallback
            let processedRequest = {
                cryptocurrency: ohlcvRequest?.cryptocurrency || null,
                token_id: ohlcvRequest?.token_id || null,
                symbol: ohlcvRequest?.symbol || null,
                token_name: ohlcvRequest?.token_name || null,
                startDate: ohlcvRequest?.startDate || null,
                endDate: ohlcvRequest?.endDate || null,
                limit: ohlcvRequest?.limit || 50,
                page: ohlcvRequest?.page || 1,
                analysisType: ohlcvRequest?.analysisType || "all"
            };
            
            // Apply regex fallback if AI extraction failed or returned wrong data
            if (!processedRequest.cryptocurrency || processedRequest.cryptocurrency.toLowerCase().includes('unknown')) {
                console.log(`[${requestId}] AI extraction failed, applying regex fallback...`);
                const regexResult = extractCryptocurrencySimple(message.content?.text || '');
                if (regexResult.cryptocurrency) {
                    processedRequest.cryptocurrency = regexResult.cryptocurrency;
                    processedRequest.symbol = regexResult.symbol || null;
                    console.log(`[${requestId}] Regex fallback found: ${regexResult.cryptocurrency} (${regexResult.symbol})`);
                }
            }
            
            // CRITICAL: Convert symbols to full names for API compatibility
            // The daily OHLCV API accepts both symbols and names, but we'll use symbols for consistency
            if (processedRequest.cryptocurrency && processedRequest.cryptocurrency.length <= 5) {
                // This looks like a symbol, convert to full name for better API compatibility
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
                    console.log(`[${requestId}] Converting symbol ${processedRequest.cryptocurrency} to full name: ${fullName}`);
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
                        processedRequest.token_id = resolvedToken.TOKEN_ID;
                        processedRequest.symbol = resolvedToken.TOKEN_SYMBOL;
                        console.log(`[${requestId}] Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.TOKEN_SYMBOL} (ID: ${resolvedToken.TOKEN_ID})`);
                    }
                } catch (error) {
                    console.log(`[${requestId}] Token resolution failed, proceeding with original request`);
                }
            }
            
            // Build API parameters - Daily OHLCV API accepts various parameters
            const apiParams: Record<string, any> = {
                limit: processedRequest.limit,
                page: processedRequest.page
            };
            
            // Add token identification parameters - prioritize symbol for daily OHLCV
            if (processedRequest.symbol) {
                apiParams.symbol = processedRequest.symbol;
                console.log(`[${requestId}] Using symbol parameter: ${processedRequest.symbol}`);
            } else if (processedRequest.cryptocurrency) {
                apiParams.token_name = processedRequest.cryptocurrency;
                console.log(`[${requestId}] Using token_name parameter: ${processedRequest.cryptocurrency}`);
            } else if (processedRequest.token_id) {
                apiParams.token_id = processedRequest.token_id;
                console.log(`[${requestId}] Using token_id parameter: ${processedRequest.token_id}`);
            }
            
            // Add date range parameters if provided
            if (processedRequest.startDate) apiParams.startDate = processedRequest.startDate;
            if (processedRequest.endDate) apiParams.endDate = processedRequest.endDate;
            
            // Make API call
            const response = await callTokenMetricsAPI(
                "/v2/daily-ohlcv",
                apiParams,
                runtime
            );
            
            console.log(`[${requestId}] API response received, processing OHLCV data...`);
            
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
                console.log(`[${requestId}] Found ${tokenIds.length} different tokens for symbol ${processedRequest.symbol}:`, 
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
                        
                        console.log(`[${requestId}] Token ${firstItem.TOKEN_NAME} (ID: ${tokenId}) score: ${score} (price: $${avgPrice.toFixed(6)}, volume: ${avgVolume.toFixed(0)})`);
                        
                        if (score > maxScore) {
                            maxScore = score;
                            selectedTokenId = tokenId;
                        }
                    }
                    
                    if (selectedTokenId) {
                        filteredByToken = tokenGroups[selectedTokenId];
                        const selectedToken = filteredByToken[0];
                        console.log(`[${requestId}] Selected main token: ${selectedToken.TOKEN_NAME} (ID: ${selectedTokenId}) with score ${maxScore}`);
                    } else {
                        console.log(`[${requestId}] No clear main token identified, using all data`);
                    }
                } else {
                    console.log(`[${requestId}] Single token found: ${tokenGroups[tokenIds[0]][0]?.TOKEN_NAME}`);
                }
            }
            
            // Filter out invalid data points
            const validData = filteredByToken.filter((item: any) => {
                // Remove data points with zero or null values
                if (!item.OPEN || !item.HIGH || !item.LOW || !item.CLOSE || 
                    item.OPEN <= 0 || item.HIGH <= 0 || item.LOW <= 0 || item.CLOSE <= 0) {
                    console.log(`[${requestId}] Filtering out invalid data point:`, item);
                    return false;
                }
                
                // Remove extreme outliers (price changes > 1000% in a day)
                const priceRange = (item.HIGH - item.LOW) / item.LOW;
                if (priceRange > 10) { // 1000% daily range is unrealistic
                    console.log(`[${requestId}] Filtering out extreme outlier:`, item);
                    return false;
                }
                
                return true;
            });
            
            console.log(`[${requestId}] Token filtering: ${ohlcvData.length} → ${filteredByToken.length} data points`);
            console.log(`[${requestId}] Quality filtering: ${filteredByToken.length} → ${validData.length} valid points remaining`);
            
            // Sort data chronologically (oldest first for proper analysis)
            const sortedData = validData.sort((a: any, b: any) => new Date(a.DATE || a.TIMESTAMP).getTime() - new Date(b.DATE || b.TIMESTAMP).getTime());
            
            // Analyze the daily OHLCV data based on requested analysis type
            const ohlcvAnalysis = analyzeDailyOhlcvData(sortedData, processedRequest.analysisType);
            
            // Format response text for user
            const tokenName = resolvedToken?.name || 
                             processedRequest.cryptocurrency || 
                             processedRequest.symbol || 
                             "the requested token";
            
            let responseText = `📊 **Daily OHLCV Data for ${tokenName}**\n\n`;
            
            if (sortedData.length === 0) {
                responseText += `❌ No valid daily OHLCV data found for ${tokenName}. This could mean:\n`;
                responseText += `• The token may not have sufficient trading history\n`;
                responseText += `• TokenMetrics may not have daily data for this token\n`;
                responseText += `• All data points were filtered out due to quality issues\n`;
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
                const recentData = sortedData.slice(-5).reverse(); // Get last 5 days and reverse for display
                responseText += `📈 **Recent Daily Data (Last ${recentData.length} days):**\n`;
                
                recentData.forEach((item: any, index: number) => {
                    const date = new Date(item.DATE || item.TIMESTAMP);
                    const dateStr = date.toLocaleDateString();
                    responseText += `\n**Day ${index + 1}** (${dateStr}):\n`;
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
                    responseText += `• Direction: ${priceAnalysis.direction || 'Unknown'}\n`;
                    responseText += `• Change: ${priceAnalysis.price_change || 'N/A'} (${priceAnalysis.change_percent || 'N/A'})\n`;
                    responseText += `• Range: ${priceAnalysis.lowest_price || 'N/A'} - ${priceAnalysis.highest_price || 'N/A'}\n`;
                }
                
                // Add trend analysis
                if (ohlcvAnalysis?.trend_analysis) {
                    const trendAnalysis = ohlcvAnalysis.trend_analysis;
                    responseText += `\n📈 **Trend Analysis:**\n`;
                    responseText += `• Primary Trend: ${trendAnalysis.primary_trend}\n`;
                    responseText += `• Trend Strength: ${trendAnalysis.trend_strength}\n`;
                    responseText += `• Momentum: ${trendAnalysis.momentum}\n`;
                }
                
                // Add volume analysis
                if (ohlcvAnalysis?.volume_analysis) {
                    const volumeAnalysis = ohlcvAnalysis.volume_analysis;
                    responseText += `\n📊 **Volume Analysis:**\n`;
                    responseText += `• Average Volume: ${volumeAnalysis.average_volume || 'N/A'}\n`;
                    responseText += `• Volume Trend: ${volumeAnalysis.volume_trend || 'Unknown'}\n`;
                    responseText += `• Volume Pattern: ${volumeAnalysis.volume_pattern || 'Unknown'}\n`;
                }
                
                // Add trading recommendations
                if (ohlcvAnalysis?.trading_recommendations?.primary_recommendations?.length > 0) {
                    responseText += `\n🎯 **Trading Recommendations:**\n`;
                    ohlcvAnalysis.trading_recommendations.primary_recommendations.forEach((rec: string) => {
                        responseText += `• ${rec}\n`;
                    });
                }
                
                // Add analysis type specific insights
                if (processedRequest.analysisType === "swing_trading" && ohlcvAnalysis?.swing_trading_focus) {
                    responseText += `\n⚡ **Swing Trading Insights:**\n`;
                    ohlcvAnalysis.swing_trading_focus.insights?.forEach((insight: string) => {
                        responseText += `• ${insight}\n`;
                    });
                } else if (processedRequest.analysisType === "trend_analysis" && ohlcvAnalysis?.trend_focus) {
                    responseText += `\n📈 **Trend Analysis Insights:**\n`;
                    ohlcvAnalysis.trend_focus.insights?.forEach((insight: string) => {
                        responseText += `• ${insight}\n`;
                    });
                } else if (processedRequest.analysisType === "technical_indicators" && ohlcvAnalysis?.technical_focus) {
                    responseText += `\n🔍 **Technical Analysis:**\n`;
                    ohlcvAnalysis.technical_focus.insights?.forEach((insight: string) => {
                        responseText += `• ${insight}\n`;
                    });
                }
                
                responseText += `\n\n📋 **Data Summary:**\n`;
                responseText += `• Total Data Points: ${sortedData.length}\n`;
                responseText += `• Timeframe: 1 day intervals\n`;
                responseText += `• Analysis Type: ${processedRequest.analysisType}\n`;
                responseText += `• Data Source: TokenMetrics Official API\n`;
            }
            
            const result = {
                success: true,
                message: `Successfully retrieved ${sortedData.length} daily OHLCV data points`,
                request_id: requestId,
                ohlcv_data: sortedData,
                analysis: ohlcvAnalysis,
                metadata: {
                    endpoint: "daily-ohlcv",
                    requested_token: processedRequest.symbol || processedRequest.cryptocurrency || processedRequest.token_id,
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
                    timeframe: "1 day",
                    api_version: "v2",
                    data_source: "TokenMetrics Official API"
                },
                ohlcv_explanation: {
                    OPEN: "Opening price at the start of the day",
                    HIGH: "Highest price during the day",
                    LOW: "Lowest price during the day", 
                    CLOSE: "Closing price at the end of the day",
                    VOLUME: "Total trading volume during the day",
                    usage_tips: [
                        "Use for swing trading and medium-term technical analysis",
                        "Daily data is ideal for trend identification and support/resistance levels",
                        "Volume analysis helps confirm breakouts and reversals"
                    ]
                }
            };
            
            console.log(`[${requestId}] Daily OHLCV analysis completed successfully`);
            console.log(`[${requestId}] Analysis completed successfully`);
            
            // Use callback to send response to user (like working actions)
            if (callback) {
                await callback({
                    text: responseText,
                    content: {
                        success: true,
                        request_id: requestId,
                        data: result,
                        metadata: {
                            endpoint: "daily-ohlcv",
                            data_source: "TokenMetrics Official API",
                            api_version: "v2"
                        }
                    }
                });
            }
            
            return createActionResult({ success: true, text: responseText });
        } catch (error) {
            console.error("Error in getDailyOhlcv action:", error);
            
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            const reqId = generateRequestId();
            
            if (callback) {
                await callback({
                    text: `❌ Error fetching daily OHLCV: ${errorMessage}`,
                    content: { 
                        error: errorMessage,
                        error_type: error instanceof Error ? error.constructor.name : 'Unknown',
                        troubleshooting: true,
                        request_id: reqId
                    }
                });
            }
            
            return createActionResult({
                success: false,
                error: errorMessage
            });
        }
    },

    validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        elizaLogger.log("🔍 Validating getDailyOhlcvAction (1.x)");
        
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
 * Analyze daily OHLCV data for swing trading and investment insights
 */
function analyzeDailyOhlcvData(ohlcvData: any[], analysisType: string = "all"): any {
    if (!ohlcvData || ohlcvData.length === 0) {
        return {
            summary: "No daily OHLCV data available for analysis",
            trend_analysis: "Cannot assess",
            insights: []
        };
    }
    
    // Sort data chronologically
    const sortedData = ohlcvData.sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
    
    // Comprehensive daily analysis
    const priceAnalysis = analyzeDailyPriceMovement(sortedData);
    const volumeAnalysis = analyzeDailyVolumePatterns(sortedData);
    const technicalAnalysis = analyzeTechnicalIndicators(sortedData);
    const trendAnalysis = analyzeDailyTrend(sortedData);
    const supportResistanceAnalysis = analyzeSupportResistance(sortedData);
    
    // Generate comprehensive insights
    const insights = generateDailyInsights(priceAnalysis, volumeAnalysis, technicalAnalysis, trendAnalysis);
    
    return {
        summary: `Daily analysis of ${sortedData.length} days shows ${trendAnalysis.primary_trend} trend with ${priceAnalysis.volatility_level} volatility`,
        price_analysis: priceAnalysis,
        volume_analysis: volumeAnalysis,
        technical_analysis: technicalAnalysis,
        trend_analysis: trendAnalysis,
        support_resistance: supportResistanceAnalysis,
        insights: insights,
        trading_recommendations: generateDailyTradingRecommendations(trendAnalysis, technicalAnalysis, volumeAnalysis),
        investment_signals: generateInvestmentSignals(priceAnalysis, trendAnalysis, technicalAnalysis),
        data_quality: {
            source: "TokenMetrics Official API",
            timeframe: "1 day",
            data_points: sortedData.length,
            date_range: `${sortedData[0]?.DATE || 'Unknown'} to ${sortedData[sortedData.length - 1]?.DATE || 'Unknown'}`,
            completeness: calculateDailyDataCompleteness(sortedData)
        }
    };
}

function analyzeDailyPriceMovement(data: any[]): any {
    if (data.length < 2) return { change: 0, change_percent: 0 };
    
    const firstPrice = data[0].OPEN;
    const lastPrice = data[data.length - 1].CLOSE;
    const highestPrice = Math.max(...data.map(d => d.HIGH));
    const lowestPrice = Math.min(...data.map(d => d.LOW));
    
    const priceChange = lastPrice - firstPrice;
    const changePercent = ((priceChange / firstPrice) * 100);
    const priceRange = highestPrice - lowestPrice;
    const rangePercent = ((priceRange / firstPrice) * 100);
    
    // Calculate daily volatility
    const dailyReturns = data.slice(1).map((day, i) => 
        ((day.CLOSE - data[i].CLOSE) / data[i].CLOSE) * 100
    );
    const avgDailyReturn = dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length;
    const volatility = Math.sqrt(dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - avgDailyReturn, 2), 0) / (dailyReturns.length - 1));
    
    let volatilityLevel;
    if (volatility > 8) volatilityLevel = "Very High";
    else if (volatility > 5) volatilityLevel = "High";
    else if (volatility > 3) volatilityLevel = "Moderate";
    else if (volatility > 1.5) volatilityLevel = "Low";
    else volatilityLevel = "Very Low";
    
    return {
        start_price: formatCurrency(firstPrice),
        end_price: formatCurrency(lastPrice),
        price_change: formatCurrency(priceChange),
        change_percent: formatPercentage(changePercent),
        highest_price: formatCurrency(highestPrice),
        lowest_price: formatCurrency(lowestPrice),
        price_range: formatCurrency(priceRange),
        range_percent: formatPercentage(rangePercent),
        daily_volatility: formatPercentage(volatility),
        volatility_level: volatilityLevel,
        direction: priceChange > 0 ? "Bullish" : priceChange < 0 ? "Bearish" : "Sideways",
        momentum: calculateMomentum(data)
    };
}

function analyzeDailyVolumePatterns(data: any[]): any {
    const volumes = data.map(d => d.VOLUME).filter(v => v > 0);
    if (volumes.length === 0) return { average_volume: 0, pattern: "No data" };
    
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    const maxVolume = Math.max(...volumes);
    const minVolume = Math.min(...volumes);
    
    // Analyze volume-price correlation
    const priceChanges = data.slice(1).map((day, i) => day.CLOSE - data[i].CLOSE);
    const volumePriceCorrelation = calculateCorrelation(volumes.slice(1), priceChanges);
    
    // Volume trend analysis
    const recentVolume = volumes.slice(-7).reduce((sum, vol) => sum + vol, 0) / 7; // Last 7 days
    const earlierVolume = volumes.slice(-14, -7).reduce((sum, vol) => sum + vol, 0) / 7; // Previous 7 days
    const volumeTrend = recentVolume > earlierVolume * 1.1 ? "Increasing" : 
                       recentVolume < earlierVolume * 0.9 ? "Decreasing" : "Stable";
    
    return {
        average_volume: formatCurrency(avgVolume),
        max_volume: formatCurrency(maxVolume),
        min_volume: formatCurrency(minVolume),
        volume_trend: volumeTrend,
        volume_price_correlation: volumePriceCorrelation.toFixed(3),
        volume_pattern: classifyVolumePattern(volumes),
        volume_confirmation: analyzeVolumeConfirmation(data)
    };
}

function analyzeTechnicalIndicators(data: any[]): any {
    if (data.length < 20) return { status: "Insufficient data for technical analysis" };
    
    const closes = data.map(d => d.CLOSE);
    
    // Moving averages
    const sma20 = calculateSMA(closes, 20);
    const sma50 = calculateSMA(closes, 50);
    const currentPrice = closes[closes.length - 1];
    
    // RSI calculation
    const rsi = calculateRSI(closes, 14);
    
    // MACD calculation (simplified)
    const ema12 = calculateEMA(closes, 12);
    const ema26 = calculateEMA(closes, 26);
    const macd = ema12[ema12.length - 1] - ema26[ema26.length - 1];
    
    return {
        moving_averages: {
            sma_20: formatCurrency(sma20),
            sma_50: formatCurrency(sma50),
            price_vs_sma20: currentPrice > sma20 ? "Above" : "Below",
            price_vs_sma50: currentPrice > sma50 ? "Above" : "Below",
            ma_alignment: sma20 > sma50 ? "Bullish" : "Bearish"
        },
        momentum_indicators: {
            rsi: rsi.toFixed(2),
            rsi_signal: interpretRSI(rsi),
            macd: macd.toFixed(4),
            macd_signal: macd > 0 ? "Bullish" : "Bearish"
        },
        technical_bias: determineTechnicalBias(currentPrice, sma20, sma50, rsi)
    };
}

function analyzeDailyTrend(data: any[]): any {
    if (data.length < 2) return { primary_trend: "Insufficient Data" };
    
    const closes = data.map(d => d.CLOSE);
    const highs = data.map(d => d.HIGH);
    const lows = data.map(d => d.LOW);
    
    // Trend identification using available data
    let shortTrend, mediumTrend, longTrend;
    
    if (closes.length >= 3) {
        shortTrend = identifyTrend(closes.slice(-3));  // Last 3 days (minimum)
    } else {
        shortTrend = identifyTrend(closes); // Use all available data
    }
    
    if (closes.length >= 5) {
        mediumTrend = identifyTrend(closes.slice(-5)); // Last 5 days if available
    } else {
        mediumTrend = shortTrend; // Use short trend as fallback
    }
    
    longTrend = identifyTrend(closes); // Full period
    
    // Higher highs and higher lows analysis (adapt to available data)
    const analysisWindow = Math.min(10, highs.length);
    const higherHighs = countHigherHighs(highs.slice(-analysisWindow));
    const higherLows = countHigherLows(lows.slice(-analysisWindow));
    
    // Primary trend determination
    let primaryTrend;
    if (data.length >= 5) {
        // Full analysis for 5+ days
        if (shortTrend === "Up" && mediumTrend === "Up") primaryTrend = "Strong Uptrend";
        else if (shortTrend === "Down" && mediumTrend === "Down") primaryTrend = "Strong Downtrend";
        else if (shortTrend === "Up") primaryTrend = "Uptrend";
        else if (shortTrend === "Down") primaryTrend = "Downtrend";
        else primaryTrend = "Sideways";
    } else {
        // Simplified analysis for 2-4 days
        if (shortTrend === "Up") primaryTrend = "Short-term Uptrend";
        else if (shortTrend === "Down") primaryTrend = "Short-term Downtrend";
        else primaryTrend = "Sideways";
    }
    
    return {
        primary_trend: primaryTrend,
        short_term_trend: shortTrend,
        medium_term_trend: mediumTrend,
        long_term_trend: longTrend,
        trend_strength: calculateTrendStrength(closes),
        higher_highs: higherHighs,
        higher_lows: higherLows,
        trend_consistency: analyzeTrendConsistency(closes),
        momentum: calculateMomentumFromTrend(closes)
    };
}

function analyzeSupportResistance(data: any[]): any {
    if (data.length < 10) return { levels: "Insufficient data" };
    
    const highs = data.map(d => d.HIGH);
    const lows = data.map(d => d.LOW);
    const closes = data.map(d => d.CLOSE);
    
    // Find potential support and resistance levels
    const resistanceLevels = findResistanceLevels(highs);
    const supportLevels = findSupportLevels(lows);
    const currentPrice = closes[closes.length - 1];
    
    return {
        nearest_resistance: findNearestLevel(currentPrice, resistanceLevels, "resistance"),
        nearest_support: findNearestLevel(currentPrice, supportLevels, "support"),
        key_levels: {
            major_resistance: formatCurrency(Math.max(...resistanceLevels)),
            major_support: formatCurrency(Math.min(...supportLevels))
        },
        level_strength: "Based on price action and volume confirmation"
    };
}

function generateDailyInsights(priceAnalysis: any, volumeAnalysis: any, technicalAnalysis: any, trendAnalysis: any): string[] {
    const insights = [];
    
    // Price movement insights
    const changePercent = parseFloat(priceAnalysis.change_percent);
    if (Math.abs(changePercent) > 20) {
        insights.push(`Significant price movement of ${priceAnalysis.change_percent} over the analyzed period indicates strong market sentiment`);
    }
    
    // Trend insights
    if (trendAnalysis.primary_trend === "Strong Uptrend") {
        insights.push("Strong uptrend with multiple timeframe confirmation suggests continued bullish momentum");
    } else if (trendAnalysis.primary_trend === "Strong Downtrend") {
        insights.push("Strong downtrend across timeframes indicates sustained selling pressure");
    }
    
    // Volume insights
    if (volumeAnalysis.volume_trend === "Increasing" && trendAnalysis.primary_trend.includes("Uptrend")) {
        insights.push("Increasing volume during uptrend confirms buyer interest and trend sustainability");
    } else if (volumeAnalysis.volume_trend === "Decreasing" && trendAnalysis.primary_trend.includes("Uptrend")) {
        insights.push("Decreasing volume during uptrend suggests potential weakening momentum");
    }
    
    // Technical insights
    if (technicalAnalysis.technical_bias === "Strongly Bullish") {
        insights.push("Technical indicators align bullishly - price above key moving averages with positive momentum");
    } else if (technicalAnalysis.technical_bias === "Strongly Bearish") {
        insights.push("Technical indicators show bearish alignment suggesting continued downside pressure");
    }
    
    return insights;
}

function generateDailyTradingRecommendations(trendAnalysis: any, technicalAnalysis: any, volumeAnalysis: any): any {
    const recommendations = [];
    let overallBias = "NEUTRAL";
    
    // Trend-based recommendations
    if (trendAnalysis.primary_trend === "Strong Uptrend") {
        recommendations.push("Consider long positions on pullbacks to support levels");
        overallBias = "BULLISH";
    } else if (trendAnalysis.primary_trend === "Strong Downtrend") {
        recommendations.push("Consider short positions or avoid longs until trend reversal");
        overallBias = "BEARISH";
    }
    
    // Technical recommendations
    if (technicalAnalysis.momentum_indicators?.rsi_signal === "Oversold") {
        recommendations.push("RSI oversold condition may present buying opportunity");
    } else if (technicalAnalysis.momentum_indicators?.rsi_signal === "Overbought") {
        recommendations.push("RSI overbought condition suggests caution for new long positions");
    }
    
    // Volume-based recommendations
    if (volumeAnalysis.volume_trend === "Increasing") {
        recommendations.push("Increasing volume supports current trend continuation");
    }
    
    return {
        overall_bias: overallBias,
        recommendations: recommendations,
        risk_management: [
            "Use appropriate position sizing based on volatility",
            "Set stop losses at key support/resistance levels",
            "Monitor volume for trend confirmation"
        ]
    };
}

function generateInvestmentSignals(priceAnalysis: any, trendAnalysis: any, technicalAnalysis: any): any {
    let investmentSignal = "HOLD";
    const signals = [];
    
    // Long-term investment signals
    if (trendAnalysis.long_term_trend === "Up" && technicalAnalysis.technical_bias === "Bullish") {
        investmentSignal = "BUY";
        signals.push("Long-term uptrend with positive technical indicators supports accumulation");
    } else if (trendAnalysis.long_term_trend === "Down" && technicalAnalysis.technical_bias === "Bearish") {
        investmentSignal = "SELL";
        signals.push("Long-term downtrend with negative technicals suggests distribution");
    }
    
    // Volatility considerations
    if (priceAnalysis.volatility_level === "Very High") {
        signals.push("High volatility suggests using dollar-cost averaging for entries");
    }
    
    return {
        signal: investmentSignal,
        confidence: determineSignalConfidence(trendAnalysis, technicalAnalysis),
        rationale: signals,
        time_horizon: "Medium to long-term (weeks to months)"
    };
}

// Helper functions for calculations

function calculateMomentum(data: any[]): string {
    if (data.length < 5) return "Unknown";
    
    const recentClose = data[data.length - 1].CLOSE;
    const pastClose = data[data.length - 5].CLOSE;
    const momentum = ((recentClose - pastClose) / pastClose) * 100;
    
    if (momentum > 5) return "Strong Positive";
    if (momentum > 2) return "Positive";
    if (momentum > -2) return "Neutral";
    if (momentum > -5) return "Negative";
    return "Strong Negative";
}

function calculateCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n < 2) return 0;
    
    const xMean = x.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
    const yMean = y.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let xSumSquares = 0;
    let ySumSquares = 0;
    
    for (let i = 0; i < n; i++) {
        const xDiff = x[i] - xMean;
        const yDiff = y[i] - yMean;
        numerator += xDiff * yDiff;
        xSumSquares += xDiff * xDiff;
        ySumSquares += yDiff * yDiff;
    }
    
    const denominator = Math.sqrt(xSumSquares * ySumSquares);
    return denominator === 0 ? 0 : numerator / denominator;
}

function calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1];
    return prices.slice(-period).reduce((sum, price) => sum + price, 0) / period;
}

function calculateEMA(prices: number[], period: number): number[] {
    const ema = [];
    const multiplier = 2 / (period + 1);
    
    ema[0] = prices[0];
    for (let i = 1; i < prices.length; i++) {
        ema[i] = (prices[i] * multiplier) + (ema[i - 1] * (1 - multiplier));
    }
    
    return ema;
}

function calculateRSI(prices: number[], period: number): number {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) gains += change;
        else losses -= change;
    }
    
    let avgGain = gains / period;
    let avgLoss = losses / period;
    
    for (let i = period + 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? -change : 0;
        
        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;
    }
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

function interpretRSI(rsi: number): string {
    if (rsi > 70) return "Overbought";
    if (rsi < 30) return "Oversold";
    return "Neutral";
}

function identifyTrend(prices: number[]): string {
    if (prices.length < 3) return "Unknown";
    
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const change = (lastPrice - firstPrice) / firstPrice;
    
    if (change > 0.02) return "Up";
    if (change < -0.02) return "Down";
    return "Sideways";
}

function countHigherHighs(highs: number[]): number {
    let count = 0;
    for (let i = 1; i < highs.length; i++) {
        if (highs[i] > highs[i - 1]) count++;
    }
    return count;
}

function countHigherLows(lows: number[]): number {
    let count = 0;
    for (let i = 1; i < lows.length; i++) {
        if (lows[i] > lows[i - 1]) count++;
    }
    return count;
}

function calculateTrendStrength(closes: number[]): string {
    if (closes.length < 2) return "Insufficient Data";
    
    const firstPrice = closes[0];
    const lastPrice = closes[closes.length - 1];
    const change = Math.abs((lastPrice - firstPrice) / firstPrice);
    
    // Adjust thresholds based on data availability
    if (closes.length >= 10) {
        // Full analysis for 10+ days
        if (change > 0.5) return "Very Strong";
        if (change > 0.3) return "Strong";
        if (change > 0.1) return "Moderate";
        return "Weak";
    } else {
        // Adjusted analysis for 2-9 days
        if (change > 0.2) return "Strong";
        if (change > 0.05) return "Moderate";
        if (change > 0.01) return "Weak";
        return "Very Weak";
    }
}

function analyzeTrendConsistency(closes: number[]): string {
    if (closes.length < 2) return "Insufficient Data";
    
    let directionalChanges = 0;
    let previousDirection = null;
    
    for (let i = 1; i < closes.length; i++) {
        const currentDirection = closes[i] > closes[i - 1] ? "up" : "down";
        if (previousDirection && currentDirection !== previousDirection) {
            directionalChanges++;
        }
        previousDirection = currentDirection;
    }
    
    const consistency = 1 - (directionalChanges / (closes.length - 1));
    
    if (consistency > 0.8) return "Very Consistent";
    if (consistency > 0.6) return "Consistent";
    if (consistency > 0.4) return "Moderate";
    return "Inconsistent";
}

function calculateMomentumFromTrend(closes: number[]): string {
    if (closes.length < 2) return "Unknown";
    
    const recentChange = closes[closes.length - 1] - closes[closes.length - 2];
    const recentPercent = (recentChange / closes[closes.length - 2]) * 100;
    
    if (closes.length >= 3) {
        const previousChange = closes[closes.length - 2] - closes[closes.length - 3];
        const previousPercent = (previousChange / closes[closes.length - 3]) * 100;
        
        if (recentPercent > previousPercent && recentPercent > 0) return "Accelerating Upward";
        if (recentPercent < previousPercent && recentPercent < 0) return "Accelerating Downward";
        if (recentPercent > 0) return "Positive";
        if (recentPercent < 0) return "Negative";
        return "Neutral";
    } else {
        // Simple momentum for 2 data points
        if (recentPercent > 2) return "Strong Positive";
        if (recentPercent > 0) return "Positive";
        if (recentPercent < -2) return "Strong Negative";
        if (recentPercent < 0) return "Negative";
        return "Neutral";
    }
}

function findResistanceLevels(highs: number[]): number[] {
    // Simplified resistance level detection
    const levels = [];
    for (let i = 1; i < highs.length - 1; i++) {
        if (highs[i] > highs[i - 1] && highs[i] > highs[i + 1]) {
            levels.push(highs[i]);
        }
    }
    return levels.sort((a, b) => b - a).slice(0, 3); // Top 3 resistance levels
}

function findSupportLevels(lows: number[]): number[] {
    // Simplified support level detection
    const levels = [];
    for (let i = 1; i < lows.length - 1; i++) {
        if (lows[i] < lows[i - 1] && lows[i] < lows[i + 1]) {
            levels.push(lows[i]);
        }
    }
    return levels.sort((a, b) => a - b).slice(0, 3); // Bottom 3 support levels
}

function findNearestLevel(currentPrice: number, levels: number[], type: string): string {
    if (levels.length === 0) return "None identified";
    
    const nearestLevel = levels.reduce((nearest, level) => {
        return Math.abs(level - currentPrice) < Math.abs(nearest - currentPrice) ? level : nearest;
    });
    
    const distance = ((nearestLevel - currentPrice) / currentPrice) * 100;
    return `${formatCurrency(nearestLevel)} (${distance.toFixed(2)}% ${distance > 0 ? 'above' : 'below'})`;
}

function determineTechnicalBias(price: number, sma20: number, sma50: number, rsi: number): string {
    let score = 0;
    
    if (price > sma20) score += 1;
    if (price > sma50) score += 1;
    if (sma20 > sma50) score += 1;
    if (rsi > 50) score += 1;
    
    if (score >= 3) return "Bullish";
    if (score <= 1) return "Bearish";
    return "Neutral";
}

function classifyVolumePattern(volumes: number[]): string {
    const recentAvg = volumes.slice(-5).reduce((sum, vol) => sum + vol, 0) / 5;
    const overallAvg = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    
    if (recentAvg > overallAvg * 1.5) return "High Volume Spike";
    if (recentAvg > overallAvg * 1.2) return "Above Average";
    if (recentAvg < overallAvg * 0.8) return "Below Average";
    return "Normal";
}

function analyzeVolumeConfirmation(data: any[]): string {
    if (data.length < 5) return "Insufficient data";
    
    const recentDays = data.slice(-5);
    let confirmedMoves = 0;
    
    for (let i = 1; i < recentDays.length; i++) {
        const priceChange = recentDays[i].CLOSE - recentDays[i - 1].CLOSE;
        const volumeIncrease = recentDays[i].VOLUME > recentDays[i - 1].VOLUME;
        
        if (Math.abs(priceChange) > 0 && volumeIncrease) {
            confirmedMoves++;
        }
    }
    
    const confirmationRate = confirmedMoves / (recentDays.length - 1);
    
    if (confirmationRate > 0.6) return "Strong Confirmation";
    if (confirmationRate > 0.4) return "Moderate Confirmation";
    return "Weak Confirmation";
}

function calculateDailyDataCompleteness(data: any[]): string {
    const requiredFields = ['OPEN', 'HIGH', 'LOW', 'CLOSE', 'VOLUME'];
    let completeness = 0;
    
    data.forEach(item => {
        const presentFields = requiredFields.filter(field => item[field] !== null && item[field] !== undefined);
        completeness += presentFields.length / requiredFields.length;
    });
    
    const completenessPercent = (completeness / data.length) * 100;
    return `${completenessPercent.toFixed(1)}%`;
}

function determineSignalConfidence(trendAnalysis: any, technicalAnalysis: any): string {
    let confidence = 0;
    
    if (trendAnalysis.trend_consistency === "Very Consistent") confidence += 2;
    else if (trendAnalysis.trend_consistency === "Consistent") confidence += 1;
    
    if (technicalAnalysis.technical_bias === "Bullish" || technicalAnalysis.technical_bias === "Bearish") {
        confidence += 1;
    }
    
    if (trendAnalysis.trend_strength === "Strong" || trendAnalysis.trend_strength === "Very Strong") {
        confidence += 1;
    }
    
    if (confidence >= 3) return "High";
    if (confidence >= 2) return "Moderate";
    return "Low";
}
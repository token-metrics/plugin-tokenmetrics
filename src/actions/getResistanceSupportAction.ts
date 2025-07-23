import type { Action } from "@elizaos/core";
import {
    type IAgentRuntime,
    type Memory,
    type State,
    type HandlerCallback,
    elizaLogger
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
import type { ResistanceSupportResponse } from "../types";

// Zod schema for resistance support request validation
const ResistanceSupportRequestSchema = z.object({
    cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
    token_id: z.number().optional().describe("Specific token ID if known"),
    symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
    limit: z.number().min(1).max(100).optional().describe("Number of levels to return"),
    page: z.number().min(1).optional().describe("Page number for pagination"),
    analysisType: z.enum(["trading_levels", "breakout_analysis", "risk_management", "all"]).optional().describe("Type of analysis to focus on")
});

type ResistanceSupportRequest = z.infer<typeof ResistanceSupportRequestSchema>;

// Simple regex-based extraction as fallback
function extractCryptocurrencySimple(text: string): { cryptocurrency?: string; symbol?: string } | null {
    const normalizedText = text.toLowerCase();
    
    // Common cryptocurrency patterns
    const patterns = [
        // Bitcoin patterns
        { regex: /\b(bitcoin|btc)\b/i, cryptocurrency: "Bitcoin", symbol: "BTC" },
        // Ethereum patterns  
        { regex: /\b(ethereum|eth)\b/i, cryptocurrency: "Ethereum", symbol: "ETH" },
        // Dogecoin patterns
        { regex: /\b(dogecoin|doge)\b/i, cryptocurrency: "Dogecoin", symbol: "DOGE" },
        // Solana patterns
        { regex: /\b(solana|sol)\b/i, cryptocurrency: "Solana", symbol: "SOL" },
        // Avalanche patterns
        { regex: /\b(avalanche|avax)\b/i, cryptocurrency: "Avalanche", symbol: "AVAX" },
        // Cardano patterns
        { regex: /\b(cardano|ada)\b/i, cryptocurrency: "Cardano", symbol: "ADA" },
        // Polkadot patterns
        { regex: /\b(polkadot|dot)\b/i, cryptocurrency: "Polkadot", symbol: "DOT" },
        // Chainlink patterns
        { regex: /\b(chainlink|link)\b/i, cryptocurrency: "Chainlink", symbol: "LINK" },
        // Polygon patterns
        { regex: /\b(polygon|matic)\b/i, cryptocurrency: "Polygon", symbol: "MATIC" },
        // Binance Coin patterns
        { regex: /\b(binance coin|bnb)\b/i, cryptocurrency: "BNB", symbol: "BNB" }
    ];
    
    for (const pattern of patterns) {
        if (pattern.regex.test(normalizedText)) {
            return {
                cryptocurrency: pattern.cryptocurrency,
                symbol: pattern.symbol
            };
        }
    }
    
    return null;
}

// AI extraction template for natural language processing
const RESISTANCE_SUPPORT_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting resistance and support level requests from natural language.

CRITICAL INSTRUCTION: Extract the EXACT cryptocurrency name or symbol mentioned by the user. Do NOT substitute or change it.

The user wants to get historical levels of resistance and support for cryptocurrency technical analysis. Extract the following information:

1. **cryptocurrency** (optional): The name or symbol of the cryptocurrency
   - Look for token names like "Bitcoin", "Ethereum", "BTC", "ETH", "Solana", "SOL", "Avalanche", "AVAX"
   - MUST extract the EXACT name/symbol mentioned by the user
   - Examples: "Bitcoin" → "Bitcoin", "BTC" → "Bitcoin", "ETH" → "Ethereum", "SOL" → "Solana", "AVAX" → "Avalanche"

2. **symbol** (optional): Token symbol
   - Extract symbols like "BTC", "ETH", "ADA", "SOL", "AVAX", "DOGE", etc.
   - If user says "Bitcoin" → symbol: "BTC"
   - If user says "Ethereum" → symbol: "ETH" 
   - If user says "Solana" → symbol: "SOL"
   - If user says "Avalanche" → symbol: "AVAX"

3. **token_id** (optional): Specific token ID if mentioned
   - Usually a number like "3375" for Bitcoin

4. **limit** (optional, default: 50): Number of levels to return

5. **page** (optional, default: 1): Page number for pagination

6. **analysisType** (optional, default: "all"): What type of analysis they want
   - "trading_levels" - focus on key trading levels and entry/exit points
   - "breakout_analysis" - focus on potential breakout/breakdown scenarios
   - "risk_management" - focus on stop-loss and risk management levels
   - "all" - comprehensive resistance and support analysis

Examples:
- "Get resistance and support levels for Bitcoin" → {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Show me key trading levels for ETH" → {cryptocurrency: "Ethereum", symbol: "ETH", analysisType: "trading_levels"}
- "Support and resistance for breakout analysis" → {analysisType: "breakout_analysis"}
- "Risk management levels for Solana" → {cryptocurrency: "Solana", symbol: "SOL", analysisType: "risk_management"}
- "Resistance analysis for SOL" → {cryptocurrency: "Solana", symbol: "SOL", analysisType: "all"}
- "Support levels for AVAX" → {cryptocurrency: "Avalanche", symbol: "AVAX", analysisType: "all"}

Extract the request details from the user's message.
`;

/**
 * RESISTANCE & SUPPORT ACTION - Based on actual TokenMetrics API documentation
 * Real Endpoint: GET https://api.tokenmetrics.com/v2/resistance-support
 * 
 * This action gets the historical levels of resistance and support for each token.
 * Essential for technical analysis, entry/exit planning, and risk management strategies.
 */
export const getResistanceSupportAction: Action = {
    name: "GET_RESISTANCE_SUPPORT_TOKENMETRICS",
    description: "Get historical levels of resistance and support for cryptocurrency tokens from TokenMetrics for technical analysis and trading strategies",
    similes: [
        "get resistance support",
        "support resistance levels",
        "technical levels",
        "price levels",
        "key levels",
        "support resistance analysis",
        "technical analysis levels",
        "trading levels",
        "breakout levels"
    ],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get resistance and support levels for Bitcoin"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll retrieve the key resistance and support levels for Bitcoin from TokenMetrics technical analysis.",
                    action: "GET_RESISTANCE_SUPPORT_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me support and resistance levels for Ethereum"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get the technical support and resistance levels for Ethereum to help with trading decisions.",
                    action: "GET_RESISTANCE_SUPPORT_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Risk management levels for Solana"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get resistance and support levels for Solana focused on risk management and stop-loss placement.",
                    action: "GET_RESISTANCE_SUPPORT_TOKENMETRICS"
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
            console.log(`[${requestId}] Processing resistance and support levels request...`);
            
            // Extract structured request using AI
            const levelsRequest = await extractTokenMetricsRequest<ResistanceSupportRequest>(
                runtime,
                message,
                state || await runtime.composeState(message),
                RESISTANCE_SUPPORT_EXTRACTION_TEMPLATE,
                ResistanceSupportRequestSchema,
                requestId
            );
            
            console.log(`[${requestId}] Extracted request:`, levelsRequest);
            
            // Enhanced extraction with regex fallback for better symbol support
            let processedRequest = {
                cryptocurrency: levelsRequest.cryptocurrency,
                token_id: levelsRequest.token_id,
                symbol: levelsRequest.symbol,
                limit: levelsRequest.limit || 50,
                page: levelsRequest.page || 1,
                analysisType: levelsRequest.analysisType || "all"
            };
            
            // Apply regex fallback if AI extraction seems incorrect or incomplete
            const userText = message.content.text || "";
            const regexResult = extractCryptocurrencySimple(userText);
            
            if (regexResult) {
                // Check if AI extraction missed something or extracted wrong token
                const aiExtracted = processedRequest.cryptocurrency?.toLowerCase() || "";
                const regexExtracted = regexResult.cryptocurrency?.toLowerCase() || "";
                
                // Use regex result if:
                // 1. AI didn't extract anything
                // 2. AI extracted something completely different from what regex found
                // 3. User used a symbol but AI extracted a different token name
                if (!processedRequest.cryptocurrency || 
                    (regexExtracted && aiExtracted && !aiExtracted.includes(regexExtracted.split(' ')[0]) && !regexExtracted.includes(aiExtracted))) {
                    
                    console.log(`[${requestId}] Using regex fallback: AI extracted "${processedRequest.cryptocurrency}" but regex found "${regexResult.cryptocurrency}"`);
                    processedRequest.cryptocurrency = regexResult.cryptocurrency;
                    processedRequest.symbol = regexResult.symbol;
                }
                
                // Always ensure symbol is set if regex found one
                if (regexResult.symbol && !processedRequest.symbol) {
                    processedRequest.symbol = regexResult.symbol;
                }
            }
            
            // Fix symbol-as-cryptocurrency issue: if cryptocurrency looks like a symbol, convert it
            if (processedRequest.cryptocurrency && !processedRequest.symbol) {
                const symbolMapping: Record<string, { name: string; symbol: string }> = {
                    'btc': { name: 'Bitcoin', symbol: 'BTC' },
                    'eth': { name: 'Ethereum', symbol: 'ETH' },
                    'doge': { name: 'Dogecoin', symbol: 'DOGE' },
                    'sol': { name: 'Solana', symbol: 'SOL' },
                    'avax': { name: 'Avalanche', symbol: 'AVAX' },
                    'ada': { name: 'Cardano', symbol: 'ADA' },
                    'dot': { name: 'Polkadot', symbol: 'DOT' },
                    'link': { name: 'Chainlink', symbol: 'LINK' },
                    'matic': { name: 'Polygon', symbol: 'MATIC' },
                    'bnb': { name: 'BNB', symbol: 'BNB' }
                };
                
                const cryptoLower = processedRequest.cryptocurrency.toLowerCase();
                if (symbolMapping[cryptoLower]) {
                    console.log(`[${requestId}] Converting symbol "${processedRequest.cryptocurrency}" to full name "${symbolMapping[cryptoLower].name}"`);
                    processedRequest.cryptocurrency = symbolMapping[cryptoLower].name;
                    processedRequest.symbol = symbolMapping[cryptoLower].symbol;
                }
            }
            
            console.log(`[${requestId}] Final processed request:`, processedRequest);
            
            // Resolve token if cryptocurrency name is provided (but not if it's just a symbol)
            let resolvedToken = null;
            if (processedRequest.cryptocurrency && !processedRequest.token_id) {
                // Only try to resolve if it looks like a full cryptocurrency name (not a symbol)
                const isLikelySymbol = processedRequest.cryptocurrency.length <= 5 && 
                                     processedRequest.cryptocurrency === processedRequest.cryptocurrency.toUpperCase();
                
                if (!isLikelySymbol) {
                    try {
                        resolvedToken = await resolveTokenSmart(processedRequest.cryptocurrency, runtime);
                        if (resolvedToken) {
                            processedRequest.token_id = resolvedToken.token_id;
                            processedRequest.symbol = resolvedToken.symbol;
                            console.log(`[${requestId}] Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.symbol} (ID: ${resolvedToken.token_id})`);
                        } else {
                            console.log(`[${requestId}] Token resolution returned null for "${processedRequest.cryptocurrency}"`);
                        }
                    } catch (error) {
                        console.log(`[${requestId}] Token resolution failed for "${processedRequest.cryptocurrency}": ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                } else {
                    console.log(`[${requestId}] Skipping token resolution for "${processedRequest.cryptocurrency}" (appears to be a symbol)`);
                }
            }
            
            // Build API parameters
            const apiParams: Record<string, any> = {
                limit: processedRequest.limit,
                page: processedRequest.page
            };
            
            // Add token identification parameters - prioritize token_id, then symbol
            if (processedRequest.token_id) {
                apiParams.token_id = processedRequest.token_id;
                console.log(`[${requestId}] Using token_id parameter: ${processedRequest.token_id}`);
            } else if (processedRequest.symbol) {
                apiParams.symbol = processedRequest.symbol;
                console.log(`[${requestId}] Using symbol parameter: ${processedRequest.symbol}`);
            } else if (processedRequest.cryptocurrency) {
                // Fallback: try to map cryptocurrency name to symbol
                const symbolMapping: Record<string, string> = {
                    'bitcoin': 'BTC',
                    'ethereum': 'ETH', 
                    'dogecoin': 'DOGE',
                    'solana': 'SOL',
                    'avalanche': 'AVAX',
                    'cardano': 'ADA',
                    'polkadot': 'DOT',
                    'chainlink': 'LINK',
                    'polygon': 'MATIC',
                    'binance coin': 'BNB',
                    'bnb': 'BNB'
                };
                
                const mappedSymbol = symbolMapping[processedRequest.cryptocurrency.toLowerCase()];
                if (mappedSymbol) {
                    apiParams.symbol = mappedSymbol;
                    console.log(`[${requestId}] Mapped ${processedRequest.cryptocurrency} to symbol: ${mappedSymbol}`);
                } else {
                    console.log(`[${requestId}] No symbol mapping found for: ${processedRequest.cryptocurrency}`);
                }
            }
            
            console.log(`[${requestId}] Final API parameters:`, apiParams);
            
            // Make API call
            const response = await callTokenMetricsAPI(
                "/v2/resistance-support",
                apiParams,
                runtime
            );
            
            console.log(`[${requestId}] API response received, processing data...`);
            
            // Process response data - handle actual API structure
            let levelsData: any[] = [];
            
            if (Array.isArray(response)) {
                // Direct array response
                levelsData = response;
            } else if (response.data && Array.isArray(response.data)) {
                // Response with data wrapper - select the correct token when multiple tokens have same symbol
                let selectedTokenData = null;
                
                if (response.data.length === 1) {
                    // Only one token, use it
                    selectedTokenData = response.data[0];
                } else if (response.data.length > 1) {
                    // Multiple tokens with same symbol - select the main/correct one
                    console.log(`[${requestId}] Multiple tokens found with same symbol, selecting main token...`);
                    
                    // Priority selection logic for main tokens
                    const mainTokenSelectors = [
                        // For Bitcoin - select the main Bitcoin, not wrapped versions
                        (token: any) => token.TOKEN_NAME === "Bitcoin" && token.TOKEN_SYMBOL === "BTC",
                        // For Dogecoin - select the main Dogecoin, not other DOGE tokens
                        (token: any) => token.TOKEN_NAME === "Dogecoin" && token.TOKEN_SYMBOL === "DOGE",
                        // For Ethereum - select the main Ethereum
                        (token: any) => token.TOKEN_NAME === "Ethereum" && token.TOKEN_SYMBOL === "ETH",
                        // For other tokens - prefer exact name matches or shortest/simplest names
                        (token: any) => {
                            const name = token.TOKEN_NAME.toLowerCase();
                            const symbol = token.TOKEN_SYMBOL.toLowerCase();
                            
                            // Avoid wrapped, bridged, or derivative tokens
                            const avoidKeywords = ['wrapped', 'bridged', 'peg', 'department', 'binance', 'osmosis'];
                            const hasAvoidKeywords = avoidKeywords.some(keyword => name.includes(keyword));
                            
                            if (hasAvoidKeywords) return false;
                            
                            // Prefer tokens where name matches the expected name for the symbol
                            if (symbol === 'btc' && name.includes('bitcoin')) return true;
                            if (symbol === 'eth' && name.includes('ethereum')) return true;
                            if (symbol === 'doge' && name.includes('dogecoin')) return true;
                            if (symbol === 'sol' && name.includes('solana')) return true;
                            if (symbol === 'avax' && name.includes('avalanche')) return true;
                            
                            return false;
                        }
                    ];
                    
                    // Try each selector until we find a match
                    for (const selector of mainTokenSelectors) {
                        const match = response.data.find(selector);
                        if (match) {
                            selectedTokenData = match;
                            console.log(`[${requestId}] Selected main token: ${match.TOKEN_NAME} (${match.TOKEN_SYMBOL}) - ID: ${match.TOKEN_ID}`);
                            break;
                        }
                    }
                    
                    // Fallback: if no main token found, use the first one
                    if (!selectedTokenData) {
                        selectedTokenData = response.data[0];
                        console.log(`[${requestId}] No main token identified, using first token: ${selectedTokenData.TOKEN_NAME} (${selectedTokenData.TOKEN_SYMBOL})`);
                    }
                } else {
                    console.log(`[${requestId}] No token data found in response`);
                }
                
                if (selectedTokenData && selectedTokenData.HISTORICAL_RESISTANCE_SUPPORT_LEVELS) {
                    // Extract historical levels and transform to expected format
                    const historicalLevels = selectedTokenData.HISTORICAL_RESISTANCE_SUPPORT_LEVELS;
                    
                    // Sort levels by price to classify as resistance/support
                    const sortedLevels = historicalLevels
                        .map((level: any) => ({
                            ...level,
                            price: parseFloat(level.level)
                        }))
                        .filter((level: any) => level.price > 0)
                        .sort((a: any, b: any) => a.price - b.price);
                    
                    // Get current/recent price for classification (use most recent level as proxy)
                    const recentLevels = sortedLevels
                        .filter((level: any) => new Date(level.date) > new Date('2024-01-01'))
                        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    
                    // Use the most recent level as current price reference, or median if no recent levels
                    let currentPrice = 0;
                    if (recentLevels.length > 0) {
                        currentPrice = recentLevels[0].price;
                        console.log(`[${requestId}] Using most recent level as current price reference: ${currentPrice} (${recentLevels[0].date})`);
                    } else if (sortedLevels.length > 0) {
                        // Use median price as fallback
                        const medianIndex = Math.floor(sortedLevels.length / 2);
                        currentPrice = sortedLevels[medianIndex].price;
                        console.log(`[${requestId}] Using median level as current price reference: ${currentPrice}`);
                    }
                    
                    // Transform to expected format and classify as resistance/support
                    levelsData = historicalLevels.map((level: any, index: number) => {
                        const price = parseFloat(level.level);
                        const isResistance = price > currentPrice;
                        const isSupport = price <= currentPrice;
                        
                        // Calculate strength based on recency and price significance
                        const levelDate = new Date(level.date);
                        const now = new Date();
                        const daysSinceLevel = (now.getTime() - levelDate.getTime()) / (1000 * 60 * 60 * 24);
                        
                        // More recent levels and extreme prices get higher strength
                        let strength = Math.max(20, 100 - (daysSinceLevel / 10));
                        if (price > currentPrice * 1.5 || price < currentPrice * 0.5) {
                            strength = Math.min(95, strength + 20); // Extreme levels get bonus
                        }
                        
                        return {
                            LEVEL_TYPE: isResistance ? 'RESISTANCE' : 'SUPPORT',
                            TYPE: isResistance ? 'RESISTANCE' : 'SUPPORT',
                            PRICE_LEVEL: price,
                            LEVEL_PRICE: price,
                            STRENGTH: Math.round(strength),
                            LEVEL_STRENGTH: Math.round(strength),
                            DATE: level.date,
                            TIMEFRAME: 'daily',
                            TOKEN_ID: selectedTokenData.TOKEN_ID,
                            TOKEN_NAME: selectedTokenData.TOKEN_NAME,
                            TOKEN_SYMBOL: selectedTokenData.TOKEN_SYMBOL,
                            DAYS_SINCE: Math.round(daysSinceLevel),
                            CURRENT_PRICE_REFERENCE: currentPrice
                        };
                    });
                    
                    console.log(`[${requestId}] Processed ${levelsData.length} historical levels for ${selectedTokenData.TOKEN_NAME} (${selectedTokenData.TOKEN_SYMBOL})`);
                    console.log(`[${requestId}] Current price reference: ${currentPrice}, Resistance levels: ${levelsData.filter(l => l.LEVEL_TYPE === 'RESISTANCE').length}, Support levels: ${levelsData.filter(l => l.LEVEL_TYPE === 'SUPPORT').length}`);
                } else {
                    console.log(`[${requestId}] No HISTORICAL_RESISTANCE_SUPPORT_LEVELS found in selected token data`);
                }
            } else {
                console.log(`[${requestId}] Unexpected response format:`, response);
            }
            
            // Analyze the resistance and support levels based on requested analysis type
            const levelsAnalysis = analyzeResistanceSupportLevels(levelsData, processedRequest.analysisType);
            
            const result = {
                success: true,
                message: `Successfully retrieved ${levelsData.length} resistance and support levels from TokenMetrics`,
                request_id: requestId,
                resistance_support_levels: levelsData,
                analysis: levelsAnalysis,
                metadata: {
                    endpoint: "resistance-support",
                    requested_token: processedRequest.cryptocurrency || processedRequest.symbol || processedRequest.token_id,
                    resolved_token: resolvedToken,
                    analysis_focus: processedRequest.analysisType,
                    pagination: {
                        page: processedRequest.page,
                        limit: processedRequest.limit
                    },
                    data_points: levelsData.length,
                    api_version: "v2",
                    data_source: "TokenMetrics Technical Analysis Engine"
                },
                levels_explanation: {
                    purpose: "Identify key price levels where buying or selling pressure typically emerges",
                    resistance_levels: "Price levels where selling pressure historically increases, limiting upward movement",
                    support_levels: "Price levels where buying pressure historically increases, limiting downward movement",
                    usage_guidelines: [
                        "Use support levels as potential entry points for long positions",
                        "Use resistance levels as potential exit points or profit-taking levels", 
                        "Monitor level breaks for trend continuation or reversal signals",
                        "Combine with volume analysis for confirmation of level significance"
                    ],
                    trading_applications: [
                        "Set stop-loss orders below support levels",
                        "Set take-profit orders near resistance levels",
                        "Plan position sizes based on distance to key levels",
                        "Identify potential breakout or breakdown scenarios"
                    ]
                }
            };
            
            // Format response text for user
            const tokenName = resolvedToken?.name || processedRequest.cryptocurrency || processedRequest.symbol || "the requested token";
            const resistanceLevels = levelsData.filter((level: any) => 
                level.LEVEL_TYPE === 'RESISTANCE' || level.TYPE === 'RESISTANCE'
            );
            const supportLevels = levelsData.filter((level: any) => 
                level.LEVEL_TYPE === 'SUPPORT' || level.TYPE === 'SUPPORT'
            );
            
            let responseText = `📊 **Resistance & Support Analysis for ${tokenName}**\n\n`;
            
            if (levelsData.length === 0) {
                responseText += `❌ No resistance and support levels found for ${tokenName}. This could mean:\n`;
                responseText += `• The token may not have sufficient price history\n`;
                responseText += `• TokenMetrics may not have performed technical analysis on this token yet\n`;
                responseText += `• Try using a major cryptocurrency like Bitcoin or Ethereum\n\n`;
            } else {
                responseText += `✅ **Found ${levelsData.length} key levels** (${resistanceLevels.length} resistance, ${supportLevels.length} support)\n\n`;
                
                // Show current price reference if available
                const currentPriceRef = levelsData[0]?.CURRENT_PRICE_REFERENCE;
                if (currentPriceRef) {
                    responseText += `💰 **Current Price Reference**: ${formatCurrency(currentPriceRef)}\n\n`;
                }
                
                // Show key resistance levels (top 5 most significant)
                if (resistanceLevels.length > 0) {
                    responseText += `🔴 **Key Resistance Levels** (${resistanceLevels.length} total):\n`;
                    const topResistance = resistanceLevels
                        .sort((a: any, b: any) => (b.STRENGTH || 0) - (a.STRENGTH || 0))
                        .slice(0, 5);
                    
                    topResistance.forEach((level: any, index: number) => {
                        const price = formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE);
                        const date = new Date(level.DATE).toLocaleDateString();
                        const strength = level.STRENGTH || level.LEVEL_STRENGTH || 0;
                        const strengthIcon = strength > 80 ? "🔥" : strength > 60 ? "💪" : "📊";
                        responseText += `${index + 1}. ${strengthIcon} **${price}** (${date}) - Strength: ${Math.round(strength)}/100\n`;
                    });
                    
                    if (resistanceLevels.length > 5) {
                        responseText += `   ... and ${resistanceLevels.length - 5} more resistance levels\n`;
                    }
                    responseText += `\n`;
                }
                
                // Show key support levels (top 5 most significant)
                if (supportLevels.length > 0) {
                    responseText += `🟢 **Key Support Levels** (${supportLevels.length} total):\n`;
                    const topSupport = supportLevels
                        .sort((a: any, b: any) => (b.STRENGTH || 0) - (a.STRENGTH || 0))
                        .slice(0, 5);
                    
                    topSupport.forEach((level: any, index: number) => {
                        const price = formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE);
                        const date = new Date(level.DATE).toLocaleDateString();
                        const strength = level.STRENGTH || level.LEVEL_STRENGTH || 0;
                        const strengthIcon = strength > 80 ? "🔥" : strength > 60 ? "💪" : "📊";
                        responseText += `${index + 1}. ${strengthIcon} **${price}** (${date}) - Strength: ${Math.round(strength)}/100\n`;
                    });
                    
                    if (supportLevels.length > 5) {
                        responseText += `   ... and ${supportLevels.length - 5} more support levels\n`;
                    }
                    responseText += `\n`;
                }
                
                // Show historical timeline of key levels (most recent 5)
                responseText += `📅 **Recent Historical Levels**:\n`;
                const recentLevels = levelsData
                    .sort((a: any, b: any) => new Date(b.DATE).getTime() - new Date(a.DATE).getTime())
                    .slice(0, 5);
                
                recentLevels.forEach((level: any) => {
                    const price = formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE);
                    const date = new Date(level.DATE).toLocaleDateString();
                    const type = level.LEVEL_TYPE || level.TYPE;
                    const typeIcon = type === 'RESISTANCE' ? '🔴' : '🟢';
                    const daysAgo = level.DAYS_SINCE ? `(${level.DAYS_SINCE} days ago)` : '';
                    responseText += `• ${typeIcon} **${price}** - ${date} ${daysAgo}\n`;
                });
                responseText += `\n`;
                
                // Analysis type specific summary
                if (processedRequest.analysisType === "trading_levels") {
                    responseText += `🎯 **Trading Levels Analysis:**\n`;
                    responseText += `• **Entry Opportunities**: ${supportLevels.length} support levels for potential long positions\n`;
                    responseText += `• **Exit Targets**: ${resistanceLevels.length} resistance levels for profit-taking\n`;
                    responseText += `• **Risk Management**: Use support levels for stop-loss placement\n\n`;
                } else if (processedRequest.analysisType === "breakout_analysis") {
                    responseText += `🚀 **Breakout Analysis:**\n`;
                    const strongResistance = resistanceLevels.filter((r: any) => (r.STRENGTH || 0) > 70);
                    const nearestResistance = resistanceLevels
                        .sort((a: any, b: any) => Math.abs((a.PRICE_LEVEL || 0) - currentPriceRef) - Math.abs((b.PRICE_LEVEL || 0) - currentPriceRef))[0];
                    
                    responseText += `• **Breakout Candidates**: ${strongResistance.length} strong resistance levels to watch\n`;
                    if (nearestResistance) {
                        responseText += `• **Next Key Level**: ${formatCurrency(nearestResistance.PRICE_LEVEL || 0)} resistance\n`;
                    }
                    responseText += `• **Breakout Strategy**: Monitor volume on approach to resistance levels\n\n`;
                } else if (processedRequest.analysisType === "risk_management") {
                    responseText += `🛡️ **Risk Management Guide:**\n`;
                    const nearestSupport = supportLevels
                        .sort((a: any, b: any) => Math.abs((a.PRICE_LEVEL || 0) - currentPriceRef) - Math.abs((b.PRICE_LEVEL || 0) - currentPriceRef))[0];
                    
                    responseText += `• **Stop-Loss Zones**: ${supportLevels.length} support levels for protection\n`;
                    if (nearestSupport) {
                        responseText += `• **Nearest Support**: ${formatCurrency(nearestSupport.PRICE_LEVEL || 0)} for stop placement\n`;
                    }
                    responseText += `• **Position Sizing**: Adjust based on distance to key support levels\n\n`;
                } else {
                    responseText += `📈 **Comprehensive Analysis:**\n`;
                    const priceRange = Math.max(...levelsData.map(l => l.PRICE_LEVEL || 0)) - Math.min(...levelsData.map(l => l.PRICE_LEVEL || 0));
                    const avgStrength = levelsData.reduce((sum, l) => sum + (l.STRENGTH || 0), 0) / levelsData.length;
                    
                    responseText += `• **Price Range Covered**: ${formatCurrency(priceRange)} across all levels\n`;
                    responseText += `• **Average Level Strength**: ${Math.round(avgStrength)}/100\n`;
                    responseText += `• **Data Timeframe**: ${new Date(Math.min(...levelsData.map(l => new Date(l.DATE).getTime()))).getFullYear()} - ${new Date().getFullYear()}\n\n`;
                }
                
                // Key insights
                if (levelsAnalysis.insights && levelsAnalysis.insights.length > 0) {
                    responseText += `💡 **Key Insights:**\n`;
                    levelsAnalysis.insights.slice(0, 3).forEach((insight: string) => {
                        responseText += `• ${insight}\n`;
                    });
                    responseText += `\n`;
                }
                
                // Technical outlook
                if (levelsAnalysis.technical_outlook) {
                    responseText += `🔮 **Technical Outlook:** ${levelsAnalysis.technical_outlook.market_bias || 'Neutral'}\n\n`;
                }
                
                responseText += `📋 **Trading Guidelines:**\n`;
                responseText += `• **Long Entries**: Consider positions near strong support levels\n`;
                responseText += `• **Profit Targets**: Set take-profits near resistance levels\n`;
                responseText += `• **Stop Losses**: Place stops below key support levels\n`;
                responseText += `• **Breakout Plays**: Watch for volume confirmation on level breaks\n`;
                responseText += `• **Risk Management**: Size positions based on distance to key levels\n`;
            }
            
            responseText += `\n🔗 **Data Source:** TokenMetrics Technical Analysis Engine (v2)`;
            
            console.log(`[${requestId}] Resistance and support analysis completed successfully`);
            console.log(`[${requestId}] Analysis completed successfully`);
            
            // Use callback to send response to user (like working actions)
            if (callback) {
                callback({
                    text: responseText,
                    content: {
                        success: true,
                        request_id: requestId,
                        data: result,
                        metadata: {
                            endpoint: "resistancesupport",
                            data_source: "TokenMetrics Official API",
                            api_version: "v2"
                        }
                    }
                });
            }
            
            return true;
        } catch (error) {
            console.error("Error in getResistanceSupportAction:", error);
            
            const errorMessage = `❌ **Failed to get resistance and support levels**\n\n` +
                `**Error:** ${error instanceof Error ? error.message : "Unknown error occurred"}\n\n` +
                `**Troubleshooting:**\n` +
                `• Ensure the token has sufficient price history for technical analysis\n` +
                `• Try using a major cryptocurrency like Bitcoin or Ethereum\n` +
                `• Check if your TokenMetrics subscription includes technical analysis data\n` +
                `• Verify the token is actively traded with sufficient volume\n\n` +
                `**Common Solutions:**\n` +
                `• Use full token names instead of symbols (e.g., "Bitcoin" instead of "BTC")\n` +
                `• Check if TokenMetrics has performed technical analysis on the requested token\n` +
                `• Ensure your API key has access to the resistance-support endpoint`;
            
            if (callback) {
                callback({
                    text: errorMessage,
                    content: {
                        success: false,
                        error: error instanceof Error ? error.message : "Unknown error occurred",
                        message: "Failed to retrieve resistance and support levels from TokenMetrics API"
                    }
                });
            }
            
            return false;
        }
    },
    
    validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        elizaLogger.log("🔍 Validating getResistanceSupportAction (1.x)");
        
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
 * Comprehensive analysis of resistance and support levels for trading strategies based on analysis type
 */
function analyzeResistanceSupportLevels(levelsData: any[], analysisType: string = "all"): any {
    if (!levelsData || levelsData.length === 0) {
        return {
            summary: "No resistance and support levels data available for analysis",
            key_levels: "Cannot identify",
            insights: []
        };
    }
    
    // Separate resistance and support levels
    const resistanceLevels = levelsData.filter(level => 
        level.LEVEL_TYPE === 'RESISTANCE' || level.TYPE === 'RESISTANCE'
    );
    const supportLevels = levelsData.filter(level => 
        level.LEVEL_TYPE === 'SUPPORT' || level.TYPE === 'SUPPORT'
    );
    
    // Core analysis components
    const levelStrength = analyzeLevelStrength(levelsData);
    const levelProximity = analyzeLevelProximity(levelsData);
    const tradingOpportunities = identifyTradingOpportunities(resistanceLevels, supportLevels);
    const riskManagement = generateRiskManagementGuidance(resistanceLevels, supportLevels);
    
    // Analysis type specific insights
    let focusedAnalysis = {};
    
    switch (analysisType) {
        case "trading_levels":
            focusedAnalysis = {
                trading_focus: {
                    key_entry_levels: identifyKeyEntryLevels(supportLevels),
                    key_exit_levels: identifyKeyExitLevels(resistanceLevels),
                    optimal_trading_zones: identifyOptimalTradingZones(resistanceLevels, supportLevels),
                    trading_insights: [
                        `🎯 Key support levels: ${supportLevels.length}`,
                        `🚧 Key resistance levels: ${resistanceLevels.length}`,
                        `📊 Trading opportunities: ${tradingOpportunities.immediate_setups || 0}`
                    ]
                }
            };
            break;
            
        case "breakout_analysis":
            focusedAnalysis = {
                breakout_focus: {
                    breakout_candidates: identifyBreakoutCandidates(resistanceLevels, supportLevels),
                    breakdown_risks: identifyBreakdownRisks(supportLevels),
                    momentum_levels: identifyMomentumLevels(levelsData),
                    breakout_insights: [
                        `🚀 Breakout candidates: ${resistanceLevels.filter(r => r.STRENGTH > 0.7).length}`,
                        `⚠️ Breakdown risks: ${supportLevels.filter(s => s.STRENGTH < 0.5).length}`,
                        `💪 Strong levels: ${levelStrength.strong_levels || 0}`
                    ]
                }
            };
            break;
            
        case "risk_management":
            focusedAnalysis = {
                risk_management_focus: {
                    stop_loss_levels: identifyStopLossLevels(supportLevels),
                    take_profit_levels: identifyTakeProfitLevels(resistanceLevels),
                    risk_reward_ratios: calculateRiskRewardRatios(resistanceLevels, supportLevels),
                    risk_insights: [
                        `🛡️ Stop-loss levels: ${supportLevels.length}`,
                        `🎯 Take-profit levels: ${resistanceLevels.length}`,
                        `⚖️ Risk/reward quality: ${riskManagement.overall_assessment || 'Unknown'}`
                    ]
                }
            };
            break;
    }
    
    return {
        summary: `Analysis of ${levelsData.length} levels (${resistanceLevels.length} resistance, ${supportLevels.length} support) with ${levelStrength.strong_levels} strong levels identified`,
        analysis_type: analysisType,
        level_breakdown: {
            resistance_levels: resistanceLevels.length,
            support_levels: supportLevels.length,
            total_levels: levelsData.length
        },
        level_strength: levelStrength,
        level_proximity: levelProximity,
        trading_opportunities: tradingOpportunities,
        risk_management: riskManagement,
        insights: generateTechnicalInsights(resistanceLevels, supportLevels, levelStrength),
        technical_outlook: generateTechnicalOutlook(resistanceLevels, supportLevels, levelStrength),
        ...focusedAnalysis,
        data_quality: {
            source: "TokenMetrics Technical Analysis Engine",
            level_count: levelsData.length,
            coverage: assessCoverageTimeframe(levelsData),
            analysis_depth: assessAnalysisDepth(levelsData),
            reliability: assessReliability(levelStrength.average_strength || 0, levelStrength.strong_levels || 0, levelsData.length)
        },
        level_classification: classifyLevels(resistanceLevels, supportLevels, analysisType)
    };
}

function analyzeLevelStrength(levelsData: any[]): any {
    const strengthScores = levelsData
        .map(level => level.STRENGTH || level.LEVEL_STRENGTH)
        .filter(strength => strength !== null && strength !== undefined);
    
    if (strengthScores.length === 0) {
        return { strong_levels: 0, average_strength: 0 };
    }
    
    const averageStrength = strengthScores.reduce((sum, strength) => sum + strength, 0) / strengthScores.length;
    
    // Categorize levels by strength
    const strongLevels = strengthScores.filter(s => s >= 80).length;
    const moderateLevels = strengthScores.filter(s => s >= 60 && s < 80).length;
    const weakLevels = strengthScores.filter(s => s < 60).length;
    
    return {
        average_strength: averageStrength.toFixed(1),
        strong_levels: strongLevels,
        moderate_levels: moderateLevels,
        weak_levels: weakLevels,
        strength_distribution: {
            strong: `${strongLevels} (${((strongLevels / strengthScores.length) * 100).toFixed(1)}%)`,
            moderate: `${moderateLevels} (${((moderateLevels / strengthScores.length) * 100).toFixed(1)}%)`,
            weak: `${weakLevels} (${((weakLevels / strengthScores.length) * 100).toFixed(1)}%)`
        },
        reliability_assessment: assessReliability(averageStrength, strongLevels, strengthScores.length)
    };
}

function analyzeLevelProximity(levelsData: any[]): any {
    // This would typically require current price data to calculate proximity
    // For now, we'll analyze the relative spacing of levels
    const priceLevels = levelsData
        .map(level => level.PRICE_LEVEL || level.LEVEL_PRICE)
        .filter(price => price && price > 0)
        .sort((a, b) => a - b);
    
    if (priceLevels.length < 2) {
        return { level_spacing: "Insufficient data" };
    }
    
    // Calculate spacing between consecutive levels
    const spacings = [];
    for (let i = 1; i < priceLevels.length; i++) {
        const spacing = ((priceLevels[i] - priceLevels[i-1]) / priceLevels[i-1]) * 100;
        spacings.push(spacing);
    }
    
    const averageSpacing = spacings.reduce((sum, spacing) => sum + spacing, 0) / spacings.length;
    const minSpacing = Math.min(...spacings);
    const maxSpacing = Math.max(...spacings);
    
    return {
        average_level_spacing: `${averageSpacing.toFixed(2)}%`,
        min_spacing: `${minSpacing.toFixed(2)}%`,
        max_spacing: `${maxSpacing.toFixed(2)}%`,
        price_range: {
            lowest_level: formatCurrency(priceLevels[0]),
            highest_level: formatCurrency(priceLevels[priceLevels.length - 1]),
            total_range: formatCurrency(priceLevels[priceLevels.length - 1] - priceLevels[0])
        },
        level_clustering: assessLevelClustering(spacings)
    };
}

function identifyTradingOpportunities(resistanceLevels: any[], supportLevels: any[]): any {
    const opportunities = [];
    
    // Identify strongest levels for trading setups
    const strongResistance = resistanceLevels
        .filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70)
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 3);
    
    const strongSupport = supportLevels
        .filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70)
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 3);
    
    // Generate trading opportunities
    strongSupport.forEach(level => {
        opportunities.push({
            type: "Long Entry Opportunity",
            description: `Strong support at ${formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE)}`,
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            strategy: "Consider long positions on bounces from this level",
            risk_management: "Set stop-loss below support level"
        });
    });
    
    strongResistance.forEach(level => {
        opportunities.push({
            type: "Short Entry Opportunity",
            description: `Strong resistance at ${formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE)}`,
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            strategy: "Consider short positions on rejections from this level",
            risk_management: "Set stop-loss above resistance level"
        });
    });
    
    // Breakout opportunities
    if (strongResistance.length > 0) {
        opportunities.push({
            type: "Breakout Opportunity",
            description: "Monitor for resistance level breaks for upside momentum",
            strategy: "Enter long positions on confirmed breaks above resistance",
            confirmation_needed: "Volume increase and sustained price action above level"
        });
    }
    
    if (strongSupport.length > 0) {
        opportunities.push({
            type: "Breakdown Opportunity", 
            description: "Monitor for support level breaks for downside momentum",
            strategy: "Enter short positions on confirmed breaks below support",
            confirmation_needed: "Volume increase and sustained price action below level"
        });
    }
    
    return {
        total_opportunities: opportunities.length,
        opportunities: opportunities,
        priority_levels: identifyPriorityLevels(strongResistance, strongSupport),
        setup_quality: assessSetupQuality(opportunities)
    };
}

function generateRiskManagementGuidance(resistanceLevels: any[], supportLevels: any[]): any {
    const guidance = [];
    
    // Stop-loss guidance
    if (supportLevels.length > 0) {
        const nearestSupport = supportLevels
            .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))[0];
        
        guidance.push({
            type: "Stop-Loss Placement",
            recommendation: `Place stop-losses below ${formatCurrency(nearestSupport.PRICE_LEVEL || nearestSupport.LEVEL_PRICE)} support level`,
            rationale: "Support break indicates trend reversal or acceleration"
        });
    }
    
    // Take-profit guidance
    if (resistanceLevels.length > 0) {
        const nearestResistance = resistanceLevels
            .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))[0];
        
        guidance.push({
            type: "Take-Profit Placement",
            recommendation: `Consider taking profits near ${formatCurrency(nearestResistance.PRICE_LEVEL || nearestResistance.LEVEL_PRICE)} resistance level`,
            rationale: "Resistance often causes price rejections and profit-taking"
        });
    }
    
    // Position sizing guidance
    guidance.push({
        type: "Position Sizing",
        recommendation: "Size positions based on distance to nearest support/resistance",
        calculation: "Risk 1-2% of portfolio per trade based on stop-loss distance"
    });
    
    // Risk monitoring
    guidance.push({
        type: "Risk Monitoring",
        recommendation: "Monitor for level breaks that invalidate trading thesis",
        action: "Exit or adjust positions when key levels are broken with volume"
    });
    
    return {
        guidance_points: guidance,
        key_principles: [
            "Always define risk before entering trades",
            "Use level strength to determine position confidence",
            "Monitor volume for level break confirmations",
            "Adjust position sizes based on level proximity"
        ],
        risk_factors: [
            "False breakouts can trigger stop-losses prematurely",
            "Market conditions can override technical levels",
            "High volatility can cause whipsaws around levels"
        ]
    };
}

function generateTechnicalInsights(resistanceLevels: any[], supportLevels: any[], levelAnalysis: any): string[] {
    const insights = [];
    
    // Level strength insights
    if (levelAnalysis.strong_levels > 0) {
        insights.push(`${levelAnalysis.strong_levels} high-strength levels identified provide reliable reference points for trading decisions`);
    } else {
        insights.push("Limited high-strength levels suggest less reliable technical guidance - use additional analysis");
    }
    
    // Level distribution insights
    if (resistanceLevels.length > supportLevels.length * 1.5) {
        insights.push("Heavy resistance overhead suggests potential selling pressure and upside challenges");
    } else if (supportLevels.length > resistanceLevels.length * 1.5) {
        insights.push("Strong support structure below current levels suggests downside protection");
    } else {
        insights.push("Balanced resistance and support structure indicates range-bound trading environment");
    }
    
    // Reliability insights
    if (levelAnalysis.reliability_assessment === "High") {
        insights.push("High reliability of technical levels supports confident position sizing and risk management");
    } else if (levelAnalysis.reliability_assessment === "Low") {
        insights.push("Low level reliability suggests using conservative position sizes and tight risk controls");
    }
    
    // Trading environment insights
    const totalLevels = resistanceLevels.length + supportLevels.length;
    if (totalLevels > 10) {
        insights.push("Dense level structure creates multiple trading opportunities but requires careful level selection");
    } else if (totalLevels < 5) {
        insights.push("Sparse level structure suggests fewer clear technical reference points");
    }
    
    return insights;
}

function generateTechnicalOutlook(resistanceLevels: any[], supportLevels: any[], levelAnalysis: any): any {
    let bias = "Neutral";
    let outlook = "Range-bound";
    
    // Determine bias based on level distribution and strength
    const strongResistance = resistanceLevels.filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70).length;
    const strongSupport = supportLevels.filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70).length;
    
    if (strongSupport > strongResistance) {
        bias = "Bullish";
        outlook = "Upside potential with strong support structure";
    } else if (strongResistance > strongSupport) {
        bias = "Bearish";
        outlook = "Downside risk with heavy resistance overhead";
    }
    
    const reliability = levelAnalysis.reliability_assessment;
    const confidence = reliability === "High" ? "High" : reliability === "Medium" ? "Moderate" : "Low";
    
    return {
        technical_bias: bias,
        outlook: outlook,
        confidence_level: confidence,
        key_factors: [
            `${strongResistance} strong resistance levels`,
            `${strongSupport} strong support levels`,
            `${levelAnalysis.average_strength} average level strength`
        ],
        trading_environment: classifyTradingEnvironment(resistanceLevels, supportLevels),
        next_key_events: identifyKeyEvents(resistanceLevels, supportLevels)
    };
}

// Helper functions

function identifyKeyLevels(levels: any[], type: string): any[] {
    return levels
        .filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 60)
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 5)
        .map(level => ({
            price_level: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            type: type,
            timeframe: level.TIMEFRAME || 'Unknown',
            significance: categorizeLevelSignificance(level.STRENGTH || level.LEVEL_STRENGTH || 0)
        }));
}

function calculateLevelDensity(levelsData: any[]): string {
    const priceRange = calculatePriceRange(levelsData);
    const levelCount = levelsData.length;
    
    if (priceRange === 0) return "Unknown";
    
    const density = levelCount / priceRange;
    
    if (density > 0.1) return "Very Dense";
    if (density > 0.05) return "Dense";
    if (density > 0.02) return "Moderate";
    return "Sparse";
}

function calculatePriceRange(levelsData: any[]): number {
    const prices = levelsData
        .map(level => level.PRICE_LEVEL || level.LEVEL_PRICE)
        .filter(price => price && price > 0);
    
    if (prices.length < 2) return 0;
    
    return Math.max(...prices) - Math.min(...prices);
}

function assessReliability(averageStrength: number, strongLevels: number, totalLevels: number): string {
    const strongRatio = strongLevels / totalLevels;
    
    if (averageStrength > 75 && strongRatio > 0.4) return "High";
    if (averageStrength > 60 && strongRatio > 0.25) return "Medium";
    if (averageStrength > 45) return "Low";
    return "Very Low";
}

function assessLevelClustering(spacings: number[]): string {
    const smallSpacings = spacings.filter(s => s < 2).length;
    const clusteringRatio = smallSpacings / spacings.length;
    
    if (clusteringRatio > 0.6) return "Highly Clustered";
    if (clusteringRatio > 0.4) return "Moderately Clustered";
    if (clusteringRatio > 0.2) return "Some Clustering";
    return "Well Distributed";
}

function identifyPriorityLevels(strongResistance: any[], strongSupport: any[]): any[] {
    const allLevels = [
        ...strongResistance.map(level => ({ ...level, type: 'resistance' })),
        ...strongSupport.map(level => ({ ...level, type: 'support' }))
    ];
    
    return allLevels
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 3)
        .map(level => ({
            price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            type: level.type,
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            priority: "High"
        }));
}

function assessSetupQuality(opportunities: any[]): string {
    if (opportunities.length === 0) return "No Setups";
    
    const highStrengthOpportunities = opportunities.filter(opp => 
        opp.strength && opp.strength >= 80
    ).length;
    
    if (highStrengthOpportunities > 2) return "Excellent";
    if (highStrengthOpportunities > 0) return "Good";
    if (opportunities.length > 3) return "Moderate";
    return "Limited";
}

function assessCoverageTimeframe(levelsData: any[]): string {
    const timeframes = new Set(levelsData.map(level => level.TIMEFRAME).filter(tf => tf));
    
    if (timeframes.has('daily') && timeframes.has('weekly')) return "Multi-timeframe";
    if (timeframes.has('daily')) return "Daily";
    if (timeframes.has('weekly')) return "Weekly";
    return "Unknown";
}

function assessAnalysisDepth(levelsData: any[]): string {
    const withStrength = levelsData.filter(level => level.STRENGTH || level.LEVEL_STRENGTH).length;
    const withTimeframe = levelsData.filter(level => level.TIMEFRAME).length;
    
    const depthScore = (withStrength + withTimeframe) / (levelsData.length * 2);
    
    if (depthScore > 0.8) return "Comprehensive";
    if (depthScore > 0.6) return "Detailed";
    if (depthScore > 0.4) return "Moderate";
    return "Basic";
}

function categorizeLevelSignificance(strength: number): string {
    if (strength >= 90) return "Critical";
    if (strength >= 80) return "Major";
    if (strength >= 70) return "Important";
    if (strength >= 60) return "Moderate";
    return "Minor";
}

function classifyTradingEnvironment(resistanceLevels: any[], supportLevels: any[]): string {
    const totalLevels = resistanceLevels.length + supportLevels.length;
    const strongLevels = [...resistanceLevels, ...supportLevels]
        .filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70).length;
    
    if (totalLevels > 10 && strongLevels > 5) return "Complex - Many strong levels";
    if (totalLevels > 6 && strongLevels > 2) return "Active - Good level structure";
    if (totalLevels > 3) return "Moderate - Some technical guidance";
    return "Simple - Limited level structure";
}

function identifyKeyEvents(resistanceLevels: any[], supportLevels: any[]): string[] {
    const events = [];
    
    const strongestResistance = resistanceLevels
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))[0];
    
    const strongestSupport = supportLevels
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))[0];
    
    if (strongestResistance) {
        events.push(`Break above ${formatCurrency(strongestResistance.PRICE_LEVEL || strongestResistance.LEVEL_PRICE)} resistance could trigger upside breakout`);
    }
    
    if (strongestSupport) {
        events.push(`Break below ${formatCurrency(strongestSupport.PRICE_LEVEL || strongestSupport.LEVEL_PRICE)} support could trigger downside breakdown`);
    }
    
    if (events.length === 0) {
        events.push("Monitor for clear level breaks to identify directional moves");
    }
    
    return events;
}

// Additional analysis functions for focused analysis types
function identifyKeyEntryLevels(supportLevels: any[]): any[] {
    return supportLevels
        .filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) > 0.6)
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 3)
        .map(level => ({
            price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            recommendation: "Strong support level for long entries"
        }));
}

function identifyKeyExitLevels(resistanceLevels: any[]): any[] {
    return resistanceLevels
        .filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) > 0.6)
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 3)
        .map(level => ({
            price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            recommendation: "Strong resistance level for profit taking"
        }));
}

function identifyOptimalTradingZones(resistanceLevels: any[], supportLevels: any[]): any[] {
    const zones = [];
    
    // Find zones between strong support and resistance levels
    for (const support of supportLevels.slice(0, 3)) {
        for (const resistance of resistanceLevels.slice(0, 3)) {
            const supportPrice = support.PRICE_LEVEL || support.LEVEL_PRICE;
            const resistancePrice = resistance.PRICE_LEVEL || resistance.LEVEL_PRICE;
            
            if (resistancePrice > supportPrice) {
                const range = ((resistancePrice - supportPrice) / supportPrice) * 100;
                if (range > 2 && range < 20) { // 2-20% range is optimal for trading
                    zones.push({
                        support_level: formatCurrency(supportPrice),
                        resistance_level: formatCurrency(resistancePrice),
                        range_percentage: `${range.toFixed(2)}%`,
                        quality: range > 5 ? "High" : "Medium"
                    });
                }
            }
        }
    }
    
    return zones.slice(0, 3);
}

function identifyBreakoutCandidates(resistanceLevels: any[], supportLevels: any[]): any[] {
    const candidates: any[] = [];
    
    // Strong resistance levels that could break
    const strongResistance = resistanceLevels.filter(level => 
        (level.STRENGTH || level.LEVEL_STRENGTH || 0) > 0.7
    );
    
    strongResistance.forEach(level => {
        candidates.push({
            type: "Upside Breakout",
            level: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            probability: level.STRENGTH > 0.8 ? "High" : "Medium"
        });
    });
    
    return candidates.slice(0, 3);
}

function identifyBreakdownRisks(supportLevels: any[]): any[] {
    const risks: any[] = [];
    
    // Weak support levels that could break
    const weakSupport = supportLevels.filter(level => 
        (level.STRENGTH || level.LEVEL_STRENGTH || 0) < 0.5
    );
    
    weakSupport.forEach(level => {
        risks.push({
            type: "Downside Breakdown",
            level: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            risk_level: level.STRENGTH < 0.3 ? "High" : "Medium"
        });
    });
    
    return risks.slice(0, 3);
}

function identifyMomentumLevels(levelsData: any[]): any[] {
    // Levels that could generate momentum on break
    return levelsData
        .filter(level => (level.STRENGTH || level.LEVEL_STRENGTH || 0) > 0.75)
        .map(level => ({
            price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            type: level.LEVEL_TYPE || level.TYPE || "Unknown",
            momentum_potential: "High",
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0
        }))
        .slice(0, 3);
}

function identifyStopLossLevels(supportLevels: any[]): any[] {
    return supportLevels
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 3)
        .map(level => ({
            price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            recommendation: "Place stop-loss below this level",
            risk_level: level.STRENGTH > 0.7 ? "Low" : "Medium"
        }));
}

function identifyTakeProfitLevels(resistanceLevels: any[]): any[] {
    return resistanceLevels
        .sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))
        .slice(0, 3)
        .map(level => ({
            price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
            strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
            recommendation: "Consider taking profits at this level",
            probability: level.STRENGTH > 0.7 ? "High" : "Medium"
        }));
}

function calculateRiskRewardRatios(resistanceLevels: any[], supportLevels: any[]): any[] {
    const ratios = [];
    
    if (supportLevels.length > 0 && resistanceLevels.length > 0) {
        const strongestSupport = supportLevels.reduce((prev, current) => 
            (prev.STRENGTH || prev.LEVEL_STRENGTH || 0) > (current.STRENGTH || current.LEVEL_STRENGTH || 0) ? prev : current
        );
        
        const strongestResistance = resistanceLevels.reduce((prev, current) => 
            (prev.STRENGTH || prev.LEVEL_STRENGTH || 0) > (current.STRENGTH || current.LEVEL_STRENGTH || 0) ? prev : current
        );
        
        const supportPrice = strongestSupport.PRICE_LEVEL || strongestSupport.LEVEL_PRICE;
        const resistancePrice = strongestResistance.PRICE_LEVEL || strongestResistance.LEVEL_PRICE;
        
        if (resistancePrice > supportPrice) {
            const reward = resistancePrice - supportPrice;
            const risk = supportPrice * 0.02; // Assume 2% stop loss
            const ratio = reward / risk;
            
            ratios.push({
                entry_level: formatCurrency(supportPrice),
                target_level: formatCurrency(resistancePrice),
                risk_reward_ratio: `1:${ratio.toFixed(2)}`,
                quality: ratio > 3 ? "Excellent" : ratio > 2 ? "Good" : "Fair"
            });
        }
    }
    
    return ratios;
}

function classifyLevels(resistanceLevels: any[], supportLevels: any[], analysisType: string): any {
    const classification = {
        by_strength: {
            strong_resistance: resistanceLevels.filter(r => (r.STRENGTH || r.LEVEL_STRENGTH || 0) > 0.7).length,
            medium_resistance: resistanceLevels.filter(r => {
                const strength = r.STRENGTH || r.LEVEL_STRENGTH || 0;
                return strength >= 0.4 && strength <= 0.7;
            }).length,
            weak_resistance: resistanceLevels.filter(r => (r.STRENGTH || r.LEVEL_STRENGTH || 0) < 0.4).length,
            strong_support: supportLevels.filter(s => (s.STRENGTH || s.LEVEL_STRENGTH || 0) > 0.7).length,
            medium_support: supportLevels.filter(s => {
                const strength = s.STRENGTH || s.LEVEL_STRENGTH || 0;
                return strength >= 0.4 && strength <= 0.7;
            }).length,
            weak_support: supportLevels.filter(s => (s.STRENGTH || s.LEVEL_STRENGTH || 0) < 0.4).length
        },
        by_analysis_type: {
            focus: analysisType,
            primary_levels: analysisType === "trading_levels" ? "Entry/Exit points" :
                           analysisType === "breakout_analysis" ? "Breakout candidates" :
                           analysisType === "risk_management" ? "Stop-loss/Take-profit" : "All levels",
            level_priority: determineLevelPriority(resistanceLevels, supportLevels, analysisType)
        },
        overall_assessment: {
            total_levels: resistanceLevels.length + supportLevels.length,
            balance: Math.abs(resistanceLevels.length - supportLevels.length) < 3 ? "Balanced" : "Imbalanced",
            market_structure: classifyMarketStructure(resistanceLevels, supportLevels)
        }
    };
    
    return classification;
}

function determineLevelPriority(resistanceLevels: any[], supportLevels: any[], analysisType: string): string {
    const avgResistanceStrength = resistanceLevels.length > 0 ? 
        resistanceLevels.reduce((sum, r) => sum + (r.STRENGTH || r.LEVEL_STRENGTH || 0), 0) / resistanceLevels.length : 0;
    const avgSupportStrength = supportLevels.length > 0 ? 
        supportLevels.reduce((sum, s) => sum + (s.STRENGTH || s.LEVEL_STRENGTH || 0), 0) / supportLevels.length : 0;
    
    switch (analysisType) {
        case "trading_levels":
            return avgSupportStrength > avgResistanceStrength ? "Support-focused" : "Resistance-focused";
        case "breakout_analysis":
            return "Resistance-focused";
        case "risk_management":
            return "Support-focused";
        default:
            return "Balanced";
    }
}

function classifyMarketStructure(resistanceLevels: any[], supportLevels: any[]): string {
    const strongResistance = resistanceLevels.filter(r => (r.STRENGTH || r.LEVEL_STRENGTH || 0) > 0.7).length;
    const strongSupport = supportLevels.filter(s => (s.STRENGTH || s.LEVEL_STRENGTH || 0) > 0.7).length;
    
    if (strongResistance > strongSupport + 2) return "Resistance-heavy";
    if (strongSupport > strongResistance + 2) return "Support-heavy";
    if (strongResistance > 2 && strongSupport > 2) return "Well-defined range";
    return "Developing structure";
}
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

// Template for extracting trading signals information from conversations
const tradingSignalsTemplate = `# Task: Extract Trading Signals Request Information

Based on the conversation context, identify what trading signals information the user is requesting.

# Conversation Context:
{{recentMessages}}

# Instructions:
Look for any mentions of:
- Cryptocurrency symbols (BTC, ETH, SOL, ADA, MATIC, DOT, LINK, UNI, AVAX, etc.)
- Cryptocurrency names (Bitcoin, Ethereum, Solana, Cardano, Polygon, Uniswap, Avalanche, Chainlink, etc.)
- Trading signal requests ("trading signals", "buy sell signals", "AI signals", "trading recommendations")
- Signal types ("bullish", "bearish", "long", "short", "buy", "sell")
- Time periods or date ranges
- Market filters (category, exchange, market cap, volume)

The user might say things like:
- "Get trading signals for Bitcoin"
- "Show me AI trading signals"
- "What are the current buy/sell signals?"
- "Get bullish signals for DeFi tokens"
- "Show trading recommendations for Ethereum"
- "Get signals for tokens with high volume"
- "What tokens have buy signals today?"

Extract the relevant information for the trading signals request.

# Response Format:
Return a structured object with the trading signals request information.`;

// Schema for the extracted data
const TradingSignalsRequestSchema = z.object({
    cryptocurrency: z.string().nullable().describe("The cryptocurrency symbol or name mentioned"),
    signal_type: z.enum(["bullish", "bearish", "long", "short", "buy", "sell", "any"]).nullable().describe("Type of signal requested"),
    category: z.string().nullable().describe("Token category filter (e.g., defi, layer-1, meme)"),
    exchange: z.string().nullable().describe("Exchange filter"),
    time_period: z.string().nullable().describe("Time period or date range"),
    market_filter: z.string().nullable().describe("Market cap, volume, or other filters"),
    confidence: z.number().min(0).max(1).describe("Confidence in extraction")
});

type TradingSignalsRequest = z.infer<typeof TradingSignalsRequestSchema>;

/**
 * Fetch trading signals data from TokenMetrics API
 */
async function fetchTradingSignals(params: Record<string, any>, runtime: IAgentRuntime): Promise<any> {
    elizaLogger.log(`📡 Fetching trading signals with params:`, params);
    
    try {
        const data = await callTokenMetricsAPI('/v2/trading-signals', params, runtime);
        
        if (!data) {
            throw new Error("No data received from trading signals API");
        }
        
        elizaLogger.log(`✅ Successfully fetched trading signals data`);
        return data;
        
    } catch (error) {
        elizaLogger.error("❌ Error fetching trading signals:", error);
        throw error;
    }
}

/**
 * Format trading signals response for user
 */
function formatTradingSignalsResponse(data: any[], tokenInfo?: any): string {
    if (!data || data.length === 0) {
        return "❌ No trading signals found for the specified criteria.";
    }

    const signals = Array.isArray(data) ? data : [data];
    const signalCount = signals.length;
    
    // Analyze signal distribution
    const bullishSignals = signals.filter(s => s.TRADING_SIGNAL === 1 || s.TRADING_SIGNAL === "1").length;
    const bearishSignals = signals.filter(s => s.TRADING_SIGNAL === -1 || s.TRADING_SIGNAL === "-1").length;
    const neutralSignals = signals.filter(s => s.TRADING_SIGNAL === 0 || s.TRADING_SIGNAL === "0").length;

    let response = `📊 **TokenMetrics Trading Signals Analysis**\n\n`;
    
    if (tokenInfo) {
        response += `🎯 **Token**: ${tokenInfo.TOKEN_NAME || tokenInfo.NAME} (${tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL})\n`;
    }
    
    response += `📈 **Signal Summary**: ${signalCount} signals analyzed\n`;
    response += `🟢 **Bullish**: ${bullishSignals} signals (${((bullishSignals/signalCount)*100).toFixed(1)}%)\n`;
    response += `🔴 **Bearish**: ${bearishSignals} signals (${((bearishSignals/signalCount)*100).toFixed(1)}%)\n`;
    response += `⚪ **Neutral**: ${neutralSignals} signals (${((neutralSignals/signalCount)*100).toFixed(1)}%)\n\n`;

    // Show recent signals
    const recentSignals = signals.slice(0, 5);
    response += `🔍 **Recent Signals**:\n`;
    
    recentSignals.forEach((signal, index) => {
        const signalEmoji = signal.TRADING_SIGNAL === 1 ? "🟢" : 
                           signal.TRADING_SIGNAL === -1 ? "🔴" : "⚪";
        const signalText = signal.TRADING_SIGNAL === 1 ? "BULLISH" : 
                          signal.TRADING_SIGNAL === -1 ? "BEARISH" : "NEUTRAL";
        
        response += `${signalEmoji} **${signal.TOKEN_SYMBOL || signal.TOKEN_NAME}**: ${signalText}`;
        if (signal.DATE) {
            response += ` (${signal.DATE})`;
        }
        response += `\n`;
    });

    // Trading recommendations
    response += `\n💡 **AI Recommendations**:\n`;
    if (bullishSignals > bearishSignals) {
        response += `• Market sentiment is predominantly bullish (${((bullishSignals/signalCount)*100).toFixed(1)}%)\n`;
        response += `• Consider long positions on tokens with strong bullish signals\n`;
        response += `• Monitor for entry opportunities on pullbacks\n`;
    } else if (bearishSignals > bullishSignals) {
        response += `• Market sentiment is predominantly bearish (${((bearishSignals/signalCount)*100).toFixed(1)}%)\n`;
        response += `• Exercise caution with new long positions\n`;
        response += `• Consider defensive strategies or short positions\n`;
    } else {
        response += `• Market sentiment is mixed - signals are balanced\n`;
        response += `• Wait for clearer directional signals before major moves\n`;
        response += `• Focus on risk management and position sizing\n`;
    }

    response += `\n📊 **Data Source**: TokenMetrics AI Trading Signals\n`;
    response += `⏰ **Analysis Time**: ${new Date().toLocaleString()}\n`;
    
    return response;
}

/**
 * Analyze trading signals data
 */
function analyzeTradingSignals(data: any[]): any {
    if (!data || data.length === 0) {
        return { error: "No data to analyze" };
    }

    const signals = Array.isArray(data) ? data : [data];
    
    const analysis = {
        total_signals: signals.length,
        signal_distribution: {
            bullish: signals.filter(s => s.TRADING_SIGNAL === 1 || s.TRADING_SIGNAL === "1").length,
            bearish: signals.filter(s => s.TRADING_SIGNAL === -1 || s.TRADING_SIGNAL === "-1").length,
            neutral: signals.filter(s => s.TRADING_SIGNAL === 0 || s.TRADING_SIGNAL === "0").length
        },
        top_tokens: signals.slice(0, 10).map(s => ({
            symbol: s.TOKEN_SYMBOL,
            name: s.TOKEN_NAME,
            signal: s.TRADING_SIGNAL,
            date: s.DATE
        })),
        market_sentiment: "neutral"
    };

    // Determine overall market sentiment
    const { bullish, bearish, neutral } = analysis.signal_distribution;
    if (bullish > bearish && bullish > neutral) {
        analysis.market_sentiment = "bullish";
    } else if (bearish > bullish && bearish > neutral) {
        analysis.market_sentiment = "bearish";
    }

    return analysis;
}

export const getTradingSignalsAction: Action = {
    name: "GET_TRADING_SIGNALS_TOKENMETRICS",
    similes: [
        "GET_TRADING_SIGNALS",
        "GET_AI_SIGNALS", 
        "GET_BUY_SELL_SIGNALS",
        "GET_TRADING_RECOMMENDATIONS",
        "TRADING_SIGNALS",
        "AI_SIGNALS",
        "MARKET_SIGNALS"
    ],
    description: "Get AI-generated trading signals and recommendations for cryptocurrencies from TokenMetrics",
    
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("🔍 Validating getTradingSignalsAction");
        
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
        
        elizaLogger.log("🚀 Starting TokenMetrics trading signals handler");
        elizaLogger.log(`📝 Processing user message: "${message.content?.text || "No text content"}"`);
        elizaLogger.log(`🆔 Request ID: ${requestId}`);

        try {
            // STEP 1: Validate API key early
            validateAndGetApiKey(runtime);

            // STEP 2: Extract trading signals request using AI
            const signalsRequest = await extractTokenMetricsRequest(
                runtime,
                message,
                state || await runtime.composeState(message),
                tradingSignalsTemplate,
                TradingSignalsRequestSchema,
                requestId
            );

            elizaLogger.log("🎯 AI Extracted signals request:", signalsRequest);
            elizaLogger.log(`🆔 Request ${requestId}: AI Processing "${signalsRequest.cryptocurrency || 'general market'}"`);

            // STEP 3: Validate that we have sufficient information
            // Allow general trading signals requests even without specific criteria
            if (!signalsRequest.cryptocurrency && !signalsRequest.signal_type && !signalsRequest.category && signalsRequest.confidence < 0.2) {
                elizaLogger.log("❌ AI extraction failed - very low confidence");
                
                if (callback) {
                    callback({
                        text: `❌ I couldn't identify specific trading signals criteria from your request.

I can get AI trading signals for:
• Specific cryptocurrencies (Bitcoin, Ethereum, Solana, etc.)
• Signal types (bullish, bearish, buy, sell signals)
• Token categories (DeFi, Layer-1, meme tokens)
• Market filters (high volume, large cap, etc.)
• General market signals

Try asking something like:
• "Get trading signals for Bitcoin"
• "Show me bullish signals for DeFi tokens"
• "What are the current buy signals?"
• "Get AI trading recommendations"
• "Show me trading signals"`,
                        content: { 
                            error: "Insufficient trading signals criteria",
                            confidence: signalsRequest?.confidence || 0,
                            request_id: requestId
                        }
                    });
                }
                return false;
            }

            elizaLogger.success("🎯 Final extraction result:", signalsRequest);

            // STEP 4: Build API parameters
            const apiParams: Record<string, any> = {
                limit: 50,
                page: 1
            };

            // Handle token-specific requests - but don't fail if token resolution fails
            let tokenInfo = null;
            if (signalsRequest.cryptocurrency) {
                elizaLogger.log(`🔍 Attempting to resolve token for: "${signalsRequest.cryptocurrency}"`);
                try {
                    tokenInfo = await resolveTokenSmart(signalsRequest.cryptocurrency, runtime);
                    
                    if (tokenInfo) {
                        // Use the correct parameter name from API docs
                        apiParams.token_id = tokenInfo.TOKEN_ID;
                        elizaLogger.log(`✅ Resolved to token ID: ${tokenInfo.TOKEN_ID}`);
                    } else {
                        // Try using symbol parameter if token resolution fails
                        apiParams.symbol = signalsRequest.cryptocurrency.toUpperCase();
                        elizaLogger.log(`🔍 Using symbol parameter: ${signalsRequest.cryptocurrency}`);
                    }
                } catch (error) {
                    elizaLogger.log(`⚠️ Token resolution failed, proceeding with general signals: ${error}`);
                    // Continue without token-specific filtering
                }
            }

            // Handle signal type filtering
            if (signalsRequest.signal_type) {
                if (signalsRequest.signal_type === "bullish" || signalsRequest.signal_type === "long" || signalsRequest.signal_type === "buy") {
                    apiParams.signal = 1;
                } else if (signalsRequest.signal_type === "bearish" || signalsRequest.signal_type === "short" || signalsRequest.signal_type === "sell") {
                    apiParams.signal = -1;
                }
            }

            // Handle category filtering
            if (signalsRequest.category) {
                apiParams.category = signalsRequest.category;
            }

            // Handle exchange filtering
            if (signalsRequest.exchange) {
                apiParams.exchange = signalsRequest.exchange;
            }

            elizaLogger.log(`📡 API parameters:`, apiParams);

            // STEP 5: Fetch trading signals data
            elizaLogger.log(`📡 Fetching trading signals data`);
            const signalsData = await fetchTradingSignals(apiParams, runtime);
            
            if (!signalsData) {
                elizaLogger.log("❌ Failed to fetch trading signals data");
                
                if (callback) {
                    callback({
                        text: `❌ Unable to fetch trading signals data at the moment.

This could be due to:
• TokenMetrics API connectivity issues
• Temporary service interruption  
• Rate limiting
• No signals available for the specified criteria

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
            const signals = Array.isArray(signalsData) ? signalsData : (signalsData.data || []);
            
            elizaLogger.log(`🔍 Received ${signals.length} trading signals`);

            // STEP 6: Format and present the results
            const responseText = formatTradingSignalsResponse(signals, tokenInfo);
            const analysis = analyzeTradingSignals(signals);

            elizaLogger.success("✅ Successfully processed trading signals request");

            if (callback) {
                callback({
                    text: responseText,
                    content: {
                        success: true,
                        signals_data: signals,
                        analysis: analysis,
                        source: "TokenMetrics AI Trading Signals",
                        request_id: requestId,
                        query_details: {
                            original_request: signalsRequest.cryptocurrency || "general market",
                            signal_type: signalsRequest.signal_type,
                            category: signalsRequest.category,
                            confidence: signalsRequest.confidence,
                            data_freshness: "real-time",
                            request_id: requestId,
                            extraction_method: "ai_with_cache_busting"
                        }
                    }
                });
            }

            return true;

        } catch (error) {
            elizaLogger.error("❌ Error in TokenMetrics trading signals handler:", error);
            elizaLogger.error(`🆔 Request ${requestId}: ERROR - ${error}`);
            
            if (callback) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                
                callback({
                    text: `❌ I encountered an error while fetching trading signals: ${errorMessage}

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
                    text: "Get trading signals for Bitcoin"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll fetch the latest AI trading signals for Bitcoin from TokenMetrics.",
                    action: "GET_TRADING_SIGNALS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me bullish signals for DeFi tokens"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "I'll get bullish trading signals for DeFi category tokens from TokenMetrics AI.",
                    action: "GET_TRADING_SIGNALS_TOKENMETRICS"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What are the current AI trading recommendations?"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Let me fetch the latest AI trading signals and recommendations from TokenMetrics.",
                    action: "GET_TRADING_SIGNALS_TOKENMETRICS"
                }
            }
        ]
    ] as ActionExample[][],
};
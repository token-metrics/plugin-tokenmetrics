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

// Template for extracting trading signals information (Updated to XML format)
const tradingSignalsTemplate = `Extract trading signals request information from the user's message.

IMPORTANT: Extract the EXACT cryptocurrency mentioned by the user in their message, not from the examples below.

Trading signals provide:
- Buy/Sell/Hold recommendations
- Entry and exit price targets
- Risk assessment levels
- Technical indicator analysis
- Market timing suggestions

Instructions:
Look for TRADING SIGNALS requests in the user's message, such as:
- Signal queries ("Trading signals for [TOKEN]", "Buy signals")
- Entry/exit requests ("When to buy [TOKEN]?", "Entry points")
- Market timing ("Best time to trade [TOKEN]", "Trading opportunities")
- Technical analysis ("Technical signals for [TOKEN]")

EXTRACTION RULE: Find the cryptocurrency name/symbol that the user specifically mentioned in their message.

Examples of request patterns (but extract the actual token from user's message):
- "Get trading signals for [TOKEN]" → extract [TOKEN]
- "Trading signals for [TOKEN]" → extract [TOKEN]
- "Should I buy [TOKEN]?" → extract [TOKEN]
- "Entry signals for [TOKEN]" → extract [TOKEN]

Respond with an XML block containing only the extracted values:

<response>
<cryptocurrency>EXACT token name or symbol from user's message</cryptocurrency>
<signal_type>bullish, bearish, buy, sell, hold, or general</signal_type>
<timeframe>1h, 4h, daily, weekly, or general</timeframe>
<analysis_depth>basic, detailed, comprehensive</analysis_depth>
</response>`;

// Schema for the extracted data - simplified like hourly OHLCV
const TradingSignalsRequestSchema = z.object({
    cryptocurrency: z.string().optional().describe("The cryptocurrency symbol or name mentioned"),
    signal_type: z.string().optional().describe("Type of signal requested"),
    category: z.string().optional().describe("Token category filter (e.g., defi, layer-1, meme)"),
    exchange: z.string().optional().describe("Exchange filter"),
    time_period: z.string().optional().describe("Time period or date range"),
    market_filter: z.string().optional().describe("Market cap, volume, or other filters")
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
    
    validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        elizaLogger.log("🔍 Validating getTradingSignalsAction (1.x)");
        
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
        
        elizaLogger.log("🚀 Starting TokenMetrics trading signals handler");
        elizaLogger.log(`📝 Processing user message: "${message.content?.text || "No text content"}"`);
        elizaLogger.log(`🆔 Request ID: ${requestId}`);

        try {
            // STEP 1: Validate API key early
            validateAndGetApiKey(runtime);

            // STEP 2: Extract trading signals request using AI with user message injection
            const userMessage = message.content?.text || "";
            
            // Inject user message directly into template (like getScenarioAnalysisAction does)
            const enhancedTemplate = tradingSignalsTemplate + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;

            const signalsRequest = await extractTokenMetricsRequest<TradingSignalsRequest>(
                runtime,
                message,
                state || await runtime.composeState(message),
                enhancedTemplate,
                TradingSignalsRequestSchema,
                requestId
            );

            elizaLogger.log("🎯 AI Extracted signals request:", signalsRequest);
            elizaLogger.log(`🆔 Request ${requestId}: AI Processing "${signalsRequest?.cryptocurrency || 'general market'}"`);
            elizaLogger.log(`🔍 DEBUG: AI extracted cryptocurrency: "${signalsRequest?.cryptocurrency}"`);
            console.log(`[${requestId}] Extracted request:`, signalsRequest);

            // STEP 3: Proceed without complex validation (like hourly OHLCV does)
            elizaLogger.success("🎯 Final extraction result:", signalsRequest);

            // STEP 4: Build API parameters
            const apiParams: Record<string, any> = {
                limit: 50,
                page: 1
            };

            // Handle token-specific requests - but don't fail if token resolution fails
            let tokenInfo = null;
            if (signalsRequest?.cryptocurrency) {
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
                    elizaLogger.log(`⚠️ Token resolution failed, using symbol fallback: ${error}`);
                    // Always set symbol parameter as fallback
                    apiParams.symbol = signalsRequest.cryptocurrency.toUpperCase();
                    elizaLogger.log(`🔍 Fallback to symbol parameter: ${signalsRequest.cryptocurrency.toUpperCase()}`);
                }
            }

            // Handle signal type filtering - COMMENTED OUT: causing 404 errors
            // if (signalsRequest?.signal_type) {
            //     if (signalsRequest.signal_type === "bullish" || signalsRequest.signal_type === "long" || signalsRequest.signal_type === "buy") {
            //         apiParams.signal = 1;
            //     } else if (signalsRequest.signal_type === "bearish" || signalsRequest.signal_type === "short" || signalsRequest.signal_type === "sell") {
            //         apiParams.signal = -1;
            //     }
            // }

            // Handle category filtering
            if (signalsRequest?.category) {
                apiParams.category = signalsRequest.category;
            }

            // Handle exchange filtering
            if (signalsRequest?.exchange) {
                apiParams.exchange = signalsRequest.exchange;
            }

            elizaLogger.log(`📡 API parameters:`, apiParams);
            elizaLogger.log(`🔍 DEBUG - About to call trading signals API with params:`, JSON.stringify(apiParams, null, 2));
            elizaLogger.log(`🔍 DEBUG - Resolved tokenInfo:`, tokenInfo ? {
                name: tokenInfo.TOKEN_NAME,
                symbol: tokenInfo.TOKEN_SYMBOL,
                id: tokenInfo.TOKEN_ID
            } : 'null');

            // STEP 5: Fetch trading signals data
            elizaLogger.log(`📡 Fetching trading signals data`);
            const signalsData = await fetchTradingSignals(apiParams, runtime);
            
            if (!signalsData) {
                elizaLogger.log("❌ Failed to fetch trading signals data");
                return createActionResult({
                    success: false,
                    text: `❌ Unable to fetch trading signals data at the moment. Please try again.`,
                    data: { error: "API fetch failed", request_id: requestId }
                });
            }

            // Handle the response data
            let signals = Array.isArray(signalsData) ? signalsData : (signalsData.data || []);
            elizaLogger.log(`🔍 Final signals count: ${signals.length}`);

            // STEP 6: Format and present the results
            const responseText = formatTradingSignalsResponse(signals, tokenInfo);
            const analysis = analyzeTradingSignals(signals);

            elizaLogger.success("✅ Successfully processed trading signals request");

            if (callback) {
                callback({
                    text: responseText,
                    data: {
                        success: true,
                        signals_data: signals,
                        analysis: analysis,
                        source: "TokenMetrics AI Trading Signals",
                        request_id: requestId
                    }
                });
            }

            return createActionResult({
                success: true,
                text: responseText,
                data: {
                    success: true,
                    signals_data: signals,
                    analysis: analysis,
                    source: "TokenMetrics AI Trading Signals",
                    request_id: requestId
                }
            });

        } catch (error) {
            elizaLogger.error("❌ Error in TokenMetrics trading signals handler:", error);
            
            return createActionResult({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    },

    examples: [
        [
            {
                name: "{{user1}}",
                content: {
                    text: "Get trading signals for Bitcoin"
                }
            },
            {
                name: "{{agent}}",
                content: {
                    text: "I'll fetch the latest AI trading signals for Bitcoin from TokenMetrics.",
                    action: "GET_TRADING_SIGNALS_TOKENMETRICS"
                }
            }
        ]
    ] as ActionExample[][],
};
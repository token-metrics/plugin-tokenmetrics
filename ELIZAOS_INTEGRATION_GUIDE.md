# TokenMetrics ElizaOS Plugin Integration Guide

## Overview
The TokenMetrics plugin provides comprehensive cryptocurrency market data, AI-powered insights, and trading signals for ElizaOS agents. This plugin integrates all 20 major TokenMetrics API endpoints with intelligent natural language processing.

## Installation

### 1. Add to package.json
```json
{
  "dependencies": {
    "@elizaos/plugin-tokenmetrics": "latest"
  }
}
```

### 2. Configure Character
```json
{
  "name": "CryptoAnalyst",
  "plugins": [
    "@elizaos/plugin-tokenmetrics"
  ],
  "settings": {
    "secrets": {
      "TOKENMETRICS_API_KEY": "your_tokenmetrics_api_key_here"
    }
  }
}
```

## Features

### Core Market Data
- **Token Discovery**: Search and filter cryptocurrency tokens
- **Price Data**: Real-time cryptocurrency prices
- **Market Cap Rankings**: Top cryptocurrencies by market capitalization
- **Trading Signals**: AI-generated buy/sell/hold recommendations
- **Market Metrics**: Overall market sentiment and statistics

### Advanced Analysis
- **Technical Analysis**: Resistance/support levels, OHLCV data
- **Investment Grades**: Long-term investment recommendations
- **Risk Assessment**: Quantitative risk metrics and volatility analysis
- **Sentiment Analysis**: Social media and news sentiment tracking
- **Correlation Analysis**: Portfolio diversification insights

### AI-Powered Features
- **TokenMetrics AI**: Direct access to TokenMetrics AI assistant
- **AI Reports**: Comprehensive AI-generated market analysis
- **Scenario Analysis**: Price predictions under different market conditions
- **Sector Analysis**: DeFi, Layer 1, Gaming sector performance

## Natural Language Queries

The plugin supports natural language queries like:

```
"What's the current price of Bitcoin?"
"Should I buy Ethereum? Show me the trading signals"
"How risky is Solana? Show me the volatility metrics"
"What's the overall crypto market sentiment today?"
"Compare Bitcoin and Ethereum correlation"
"Show me resistance and support levels for BTC"
"Generate an AI report for the DeFi sector"
```

## API Endpoints Covered

1. **getTokens** - Token database and search
2. **getTopMarketCap** - Top cryptocurrencies by market cap
3. **getPrice** - Real-time price data
4. **getTraderGrades** - Short-term trading grades
5. **getInvestorGrades** - Long-term investment grades
6. **getTradingSignals** - AI trading recommendations
7. **getMarketMetrics** - Market overview and sentiment
8. **getQuantmetrics** - Risk and volatility metrics
9. **getHourlyOhlcv** - Hourly price/volume data
10. **getDailyOhlcv** - Daily price/volume data
11. **getAiReports** - AI-generated analysis reports
12. **getCryptoInvestors** - Influential investor data
13. **getResistanceSupport** - Technical analysis levels
14. **getTMAI** - TokenMetrics AI assistant
15. **getSentiment** - Social sentiment analysis
16. **getScenarioAnalysis** - Price prediction scenarios
17. **getCorrelation** - Token correlation analysis
18. **getSectorIndicesHoldings** - Sector composition
19. **getIndexPerformance** - Sector performance metrics
20. **getSectorIndexTransaction** - Sector rebalancing data

## Memory & Context Management

The plugin includes advanced conversation management:
- **User Preferences**: Tracks favorite tokens and risk tolerance
- **Conversation Context**: Remembers recent queries and tokens discussed
- **Follow-up Queries**: Supports contextual questions like "What about its trading signals?"
- **Smart Suggestions**: Provides relevant follow-up questions

## Testing

Run the comprehensive test suite:
```bash
npm run test:all
npm run chat  # Interactive testing
```

## Configuration

Required environment variables:
- `TOKENMETRICS_API_KEY`: Your TokenMetrics API key

Optional settings:
- Analysis depth preferences
- Notification preferences
- Favorite tokens and sectors

## Error Handling

The plugin includes robust error handling for:
- API rate limiting
- Invalid API keys
- Network connectivity issues
- Malformed queries
- Missing token data

## Support

For issues or questions:
1. Check the manual testing guide: `manual-endpoint-tests.md`
2. Run diagnostic tests: `npm run test:connection`
3. Review API documentation: https://developers.tokenmetrics.com 
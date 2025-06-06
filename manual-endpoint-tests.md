# 🚀 TokenMetrics Endpoint Testing Guide

## Manual Testing Checklist - All 20 Endpoints

Test each endpoint by running: `echo "[PROMPT]" | npm run chat`

### ✅ **1. Tokens Database**
```bash
echo "Show me the tokens database" | npm run chat
```
**Expected**: List of tokens with TOKEN_ID, TOKEN_NAME, TOKEN_SYMBOL

### ✅ **2. Top Market Cap Tokens** 
```bash
echo "Get top cryptocurrencies by market capitalization" | npm run chat
```
**Expected**: Bitcoin, Ethereum, etc. with prices and market caps

### ✅ **3. Price Data**
```bash
echo "What is the current price of Bitcoin?" | npm run chat
```
**Expected**: Bitcoin price in USD with BTC symbol

### ✅ **4. Trader Grades**
```bash
echo "Show me trader grades for cryptocurrencies" | npm run chat
```
**Expected**: TA_GRADE, QUANT_GRADE with color-coded formatting

### ✅ **5. Investor Grades**
```bash
echo "What are the investor grades for top cryptocurrencies?" | npm run chat
```
**Expected**: TM_INVESTOR_GRADE with investment recommendations

### ✅ **6. Trading Signals**
```bash
echo "Show me trading signals for cryptocurrencies" | npm run chat
```
**Expected**: BUY/SELL/HOLD signals with trend analysis

### ✅ **7. Market Metrics**
```bash
echo "Get market metrics for cryptocurrency analysis" | npm run chat
```
**Expected**: Volume, market cap, and other market metrics

### ✅ **8. Quantmetrics**
```bash
echo "Show me quantmetrics data for crypto analysis" | npm run chat
```
**Expected**: Quantitative metrics and analysis data

### ✅ **9. Hourly OHLCV**
```bash
echo "Get hourly OHLCV data for Bitcoin" | npm run chat
```
**Expected**: Open, High, Low, Close, Volume data by hour

### ✅ **10. Daily OHLCV**
```bash
echo "Show me daily OHLCV data for Ethereum" | npm run chat
```
**Expected**: Daily OHLCV data with date ranges

### ✅ **11. AI Reports**
```bash
echo "Generate AI reports for cryptocurrency market" | npm run chat
```
**Expected**: AI-generated analysis and recommendations

### ✅ **12. Crypto Investors**
```bash
echo "Show me crypto investors data and analysis" | npm run chat
```
**Expected**: Investor data and investment patterns

### ✅ **13. Resistance & Support**
```bash
echo "What are the resistance and support levels for Bitcoin?" | npm run chat
```
**Expected**: Price levels for resistance and support

### ✅ **14. TokenMetrics AI**
```bash
echo "Ask TokenMetrics AI about the best cryptocurrency investments" | npm run chat
```
**Expected**: AI recommendations and investment analysis

### ✅ **15. Sentiments**
```bash
echo "Analyze cryptocurrency market sentiment" | npm run chat
```
**Expected**: Positive/negative/neutral sentiment analysis

### ✅ **16. Scenario Analysis**
```bash
echo "Show me scenario analysis for Bitcoin price predictions" | npm run chat
```
**Expected**: Bearish/bullish/base scenarios with ROI predictions

### ✅ **17. Correlation**
```bash
echo "Show me correlation analysis between cryptocurrencies" | npm run chat
```
**Expected**: Correlation coefficients and portfolio insights

### ✅ **18. Indices**
```bash
echo "Show me crypto indices data" | npm run chat
```
**Expected**: Active and passive indices with performance data, ID, name, type, status

### ✅ **19. Indices Holdings**
```bash
echo "What are the holdings of crypto index 1?" | npm run chat
```
**Expected**: Index composition with symbols, weights, prices, and values

### ✅ **20. Indices Performance**
```bash
echo "Show me performance data for crypto index 1" | npm run chat
```
**Expected**: Historical ROI data with performance trends and analysis

### ✅ **21. Hourly Trading Signals**
```bash
echo "Show me hourly trading signals for cryptocurrencies" | npm run chat
```
**Expected**: Trading signals with trend analysis

---

## 📊 Testing Results Template

| # | Endpoint | Status | Response Time | Notes |
|---|----------|--------|---------------|-------|
| 1 | Tokens Database | ⏳ | - | - |
| 2 | Top Market Cap | ⏳ | - | - |
| 3 | Price Data | ⏳ | - | - |
| 4 | Trader Grades | ⏳ | - | - |
| 5 | Investor Grades | ⏳ | - | - |
| 6 | Trading Signals | ⏳ | - | - |
| 7 | Market Metrics | ⏳ | - | - |
| 8 | Quantmetrics | ⏳ | - | - |
| 9 | Hourly OHLCV | ⏳ | - | - |
| 10 | Daily OHLCV | ⏳ | - | - |
| 11 | AI Reports | ⏳ | - | - |
| 12 | Crypto Investors | ⏳ | - | - |
| 13 | Resistance & Support | ⏳ | - | - |
| 14 | TokenMetrics AI | ⏳ | - | - |
| 15 | Sentiments | ⏳ | - | - |
| 16 | Scenario Analysis | ⏳ | - | - |
| 17 | Correlation | ⏳ | - | - |
| 18 | Indices | ⏳ | - | - |
| 19 | Indices Holdings | ⏳ | - | - |
| 20 | Indices Performance | ⏳ | - | - |
| 21 | Hourly Trading Signals | ⏳ | - | - |

## 🎯 Success Criteria
- ✅ Endpoint responds without errors
- ✅ Data is properly formatted with colors and structure
- ✅ Response contains expected keywords/data types
- ✅ Response time under 10 seconds
- ✅ Beautiful UX formatting applied 
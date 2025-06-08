# 🎯 TokenMetrics Actions Comprehensive Test Plan

## 📊 **Testing Progress Status**

### ✅ **COMPLETED & WORKING**
1. **getPriceAction** - ✅ Perfect (both names & symbols)
2. **getTradingSignalsAction** - ✅ Perfect (enhanced with symbol support)  
3. **getTopMarketCapAction** - ✅ Perfect (fixed callback pattern)

### 🔄 **TESTING QUEUE (18 remaining)**

---

## 🎯 **TIER 1: Core Market Data (Test Next)**

### **4. getMarketMetricsAction**
**Purpose**: Overall market overview and metrics
**Test Queries**:
```
Get market metrics
```
```
Show me overall market overview
```
```
What's the current market status?
```
```
Give me crypto market analysis
```
```
Market metrics summary
```

### **5. getTokensAction** 
**Purpose**: Token search and information
**Test Queries**:
```
Search for Bitcoin token information
```
```
Find token details for Ethereum
```
```
Get token info for DOGE
```
```
Show me available tokens
```
```
List tokens for Solana
```

---

## 🎯 **TIER 2: Technical Analysis**

### **6. getQuantmetricsAction**
**Purpose**: Quantitative metrics and risk analysis
**Test Queries**:
```
Get quantmetrics for Bitcoin
```
```
Show me risk analysis for Ethereum
```
```
Quantitative metrics for SOL
```
```
Risk assessment for DOGE
```
```
Get quant data for BTC
```

### **7. getTraderGradesAction**
**Purpose**: AI trader grades and scoring
**Test Queries**:
```
Get trader grades for Bitcoin
```
```
Show me trading grades for ETH
```
```
Trader score for Solana
```
```
Trading analysis grades for AVAX
```
```
Get AI trader ratings
```

### **8. getInvestorGradesAction**
**Purpose**: Investment grades and recommendations
**Test Queries**:
```
Get investor grades for Bitcoin
```
```
Show me investment grades for Ethereum
```
```
Investment rating for SOL
```
```
Investor analysis for DOGE
```
```
Get investment scores
```

---

## 🎯 **TIER 3: Advanced Analytics**

### **9. getScenarioAnalysisAction**
**Purpose**: Scenario-based price predictions
**Test Queries**:
```
Get scenario analysis for Bitcoin
```
```
Show me price scenarios for ETH
```
```
Scenario predictions for Solana
```
```
Price scenario analysis for AVAX
```
```
Get future scenarios for BTC
```

### **10. getResistanceSupportAction**
**Purpose**: Technical resistance and support levels
**Test Queries**:
```
Get resistance and support for Bitcoin
```
```
Show me support levels for Ethereum
```
```
Resistance analysis for SOL
```
```
Support and resistance for DOGE
```
```
Technical levels for BTC
```

### **11. getHourlyOhlcvAction**
**Purpose**: Hourly OHLCV (Open, High, Low, Close, Volume) data
**Test Queries**:
```
Get hourly OHLCV for Bitcoin
```
```
Show me hourly data for Ethereum
```
```
Hourly price data for SOL
```
```
OHLCV hourly for DOGE
```
```
Get hourly candles for BTC
```

### **12. getDailyOhlcvAction**
**Purpose**: Daily OHLCV data
**Test Queries**:
```
Get daily OHLCV for Bitcoin
```
```
Show me daily data for Ethereum
```
```
Daily price data for SOL
```
```
OHLCV daily for DOGE
```
```
Get daily candles for BTC
```

---

## 🎯 **TIER 4: Specialized Data**

### **13. getNewsAction**
**Purpose**: Cryptocurrency news and sentiment
**Test Queries**:
```
Get news for Bitcoin
```
```
Show me crypto news for Ethereum
```
```
Latest news for SOL
```
```
News analysis for DOGE
```
```
Get market news
```

### **14. getExchangeFlowAction**
**Purpose**: Exchange flow analysis
**Test Queries**:
```
Get exchange flow for Bitcoin
```
```
Show me exchange flows for Ethereum
```
```
Exchange flow analysis for SOL
```
```
Flow data for DOGE
```
```
Get exchange movements
```

### **15. getCorrelationAction**
**Purpose**: Asset correlation analysis
**Test Queries**:
```
Get correlation analysis for Bitcoin
```
```
Show me correlations for Ethereum
```
```
Correlation data for SOL
```
```
Asset correlation for DOGE
```
```
Get market correlations
```

### **16. getVolatilityAction**
**Purpose**: Volatility metrics and analysis
**Test Queries**:
```
Get volatility for Bitcoin
```
```
Show me volatility analysis for Ethereum
```
```
Volatility metrics for SOL
```
```
Volatility data for DOGE
```
```
Get price volatility
```

### **17. getLiquidityAction**
**Purpose**: Liquidity analysis
**Test Queries**:
```
Get liquidity for Bitcoin
```
```
Show me liquidity analysis for Ethereum
```
```
Liquidity metrics for SOL
```
```
Liquidity data for DOGE
```
```
Get market liquidity
```

---

## 🎯 **TIER 5: Portfolio & Risk Management**

### **18. getPortfolioOptimizationAction**
**Purpose**: Portfolio optimization recommendations
**Test Queries**:
```
Get portfolio optimization
```
```
Show me portfolio recommendations
```
```
Optimize my crypto portfolio
```
```
Portfolio allocation advice
```
```
Get investment optimization
```

### **19. getRiskAssessmentAction**
**Purpose**: Risk assessment and management
**Test Queries**:
```
Get risk assessment for Bitcoin
```
```
Show me risk analysis for Ethereum
```
```
Risk evaluation for SOL
```
```
Risk metrics for DOGE
```
```
Get portfolio risk
```

### **20. getBacktestingAction**
**Purpose**: Strategy backtesting
**Test Queries**:
```
Get backtesting results
```
```
Show me strategy backtest
```
```
Backtest trading strategy
```
```
Historical strategy performance
```
```
Get backtest analysis
```

### **21. getAlertAction**
**Purpose**: Price alerts and notifications
**Test Queries**:
```
Set price alert for Bitcoin
```
```
Get alerts for Ethereum
```
```
Create alert for SOL
```
```
Price notification for DOGE
```
```
Set crypto alerts
```

---

## 📋 **Testing Methodology**

### **For Each Action Test:**
1. ✅ **Action Recognition** - Does ElizaOS identify the correct action?
2. ✅ **AI Extraction** - Does it extract parameters correctly?
3. ✅ **API Call Success** - Does the TokenMetrics API respond?
4. ✅ **Data Processing** - Is the response data processed correctly?
5. ✅ **Formatted Response** - Does the user receive a formatted response?
6. ✅ **Real-time Data** - Is the data coming from live API calls?

### **Success Indicators:**
- ✅ **Formatted response appears** (not just "just a moment, please")
- ✅ **Real data displayed** (prices, names, symbols, etc.)
- ✅ **No error messages**
- ✅ **Appropriate action triggered**
- ✅ **Debug logs show successful processing**

### **Failure Indicators:**
- ❌ **Only "just a moment, please" with no response**
- ❌ **Error messages or API failures**
- ❌ **Wrong action triggered**
- ❌ **Incomplete or malformed responses**

---

## 🎯 **Next Testing Steps**

### **Current Priority: TIER 1**
1. **getMarketMetricsAction** - Test next
2. **getTokensAction** - After market metrics

### **Expected Issues to Watch For:**
- **Missing callback pattern** (like we fixed in getTopMarketCapAction)
- **Wrong action names** in enhanced handler
- **AI extraction problems**
- **API parameter mismatches**

### **Quick Fix Pattern:**
If an action shows "just a moment, please" but doesn't respond:
1. Check if it uses **callback pattern** vs **return object**
2. Verify **enhanced handler case statement** matches action name
3. Ensure **TypeScript compilation** is working
4. Confirm **API parameters** match TokenMetrics documentation

---

## 📊 **Progress Tracking**

**Completed**: 3/21 (14.3%)  
**Remaining**: 18/21 (85.7%)  
**Current Focus**: TIER 1 Core Market Data  
**Next Target**: getMarketMetricsAction 
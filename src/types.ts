// CORRECTED TokenMetrics API Type Definitions
// Based on Real API Endpoints from developers.tokenmetrics.com

// Base response interface for all TokenMetrics API calls
export interface TokenMetricsBaseResponse {
  success?: boolean;
  data?: any;
  message?: string;
  error?: string;
}

// ===== 1. TOKENS ENDPOINT =====
// GET /v2/tokens - Get list of supported tokens
export interface TokensRequest {
  // Add pagination and filtering parameters as supported by the real API
  limit?: number;
  offset?: number;
}

export interface TokenInfo {
  TOKEN_ID: number;
  NAME: string;
  SYMBOL: string;
  // Additional fields from real API response
}

export interface TokensResponse extends TokenMetricsBaseResponse {
  data: TokenInfo[];
}

// ===== 2. QUANTMETRICS ENDPOINT =====
// GET /v2/quantmetrics - Quantitative metrics for tokens
export interface QuantmetricsRequest {
  token_id?: number;
  symbol?: string;
  start_date?: string;  // YYYY-MM-DD format
  end_date?: string;
  limit?: number;
}

export interface QuantmetricsData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  DATE: string;
  VOLATILITY: number;
  ALL_TIME_RETURN: number;
  CAGR: number;
  SHARPE: number;
  SORTINO: number;
  MAX_DRAWDOWN: number;
  MARKET_CAP: number;
  VOLUME: number;
  FDV: number;
}

export interface QuantmetricsResponse extends TokenMetricsBaseResponse {
  data: QuantmetricsData[];
}

// ===== 3. TRADER GRADES ENDPOINT =====
// GET /v2/trader-grades - Short-term trading grades
export interface TraderGradesRequest {
  token_id?: number;
  symbol?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export interface TraderGradesData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  DATE: string;
  TM_TRADER_GRADE: number;
  TRADER_GRADE_24H_PERCENT_CHANGE: number;
  TA_GRADE: number;
  QUANTITATIVE_GRADE: number;
  ONCHAIN_GRADE: number;
}

export interface TraderGradesResponse extends TokenMetricsBaseResponse {
  data: TraderGradesData[];
}

// ===== 4. MARKET METRICS ENDPOINT =====
// GET /v2/market-metrics - Market analytics with bullish/bearish indicators
export interface MarketMetricsRequest {
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export interface MarketMetricsData {
  DATE: string;
  LAST_TM_GRADE_SIGNAL: number;  // Bullish/Bearish indicator
  TOTAL_CRYPTO_MCAP: number;
  MARKET_SENTIMENT?: string;
}

export interface MarketMetricsResponse extends TokenMetricsBaseResponse {
  data: MarketMetricsData[];
}

// ===== 5. TRADING SIGNALS ENDPOINT =====
// GET /v2/trading-signals - AI-generated trading signals
export interface TradingSignalsRequest {
  token_id?: number;
  symbol?: string;
  signal_type?: 'long' | 'short' | 'all';
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export interface TradingSignalsData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  DATE: string;
  SIGNAL_TYPE: 'LONG' | 'SHORT';
  SIGNAL_STRENGTH?: number;
  ENTRY_PRICE?: number;
  TARGET_PRICE?: number;
  STOP_LOSS?: number;
  AI_CONFIDENCE?: number;
}

export interface TradingSignalsResponse extends TokenMetricsBaseResponse {
  data: TradingSignalsData[];
}

// ===== 6. PRICE ENDPOINT =====
// GET /v2/price - Token price data
export interface PriceRequest {
  token_ids?: string;  // Comma-separated list of token IDs
  symbols?: string;    // Comma-separated list of symbols
}

export interface PriceData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  PRICE: number;
  PRICE_24H_CHANGE: number;
  PRICE_24H_CHANGE_PERCENT: number;
  MARKET_CAP: number;
  VOLUME_24H: number;
  TIMESTAMP: string;
}

export interface PriceResponse extends TokenMetricsBaseResponse {
  data: PriceData[];
}

// ===== 7. TMAI ENDPOINT =====
// GET /v2/tmai - TMAI functionality
export interface TMAIRequest {
  query?: string;
  token_id?: number;
  symbol?: string;
}

export interface TMAIResponse extends TokenMetricsBaseResponse {
  data: {
      response: string;
      confidence: number;
      related_tokens?: TokenInfo[];
      analysis?: any;
  };
}

// ===== 8. CORRELATION ENDPOINT =====
// GET /v2/correlation - Token correlation data
export interface CorrelationRequest {
  token_id?: number;
  symbol?: string;
  compare_with?: string;  // Token IDs or symbols to compare with
  timeframe?: string;
}

export interface CorrelationData {
  TOKEN_ID: number;
  SYMBOL: string;
  CORRELATIONS: Array<{
      TOKEN_ID: number;
      SYMBOL: string;
      CORRELATION_VALUE: number;
      TIMEFRAME: string;
  }>;
}

export interface CorrelationResponse extends TokenMetricsBaseResponse {
  data: CorrelationData[];
}

// ===== 9. TOP MARKET CAP TOKENS ENDPOINT =====
// GET /v2/top-market-cap-tokens
export interface TopMarketCapRequest {
  limit?: number;
  category?: string;
}

export interface TopMarketCapData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  MARKET_CAP: number;
  PRICE: number;
  VOLUME_24H: number;
  MARKET_CAP_RANK: number;
}

export interface TopMarketCapResponse extends TokenMetricsBaseResponse {
  data: TopMarketCapData[];
}

// ===== 10. RESISTANCE & SUPPORT ENDPOINT =====
// GET /v2/resistance-support
export interface ResistanceSupportRequest {
  token_id: number;  // Required parameter
  timeframe?: string;
}

export interface ResistanceSupportData {
  TOKEN_ID: number;
  SYMBOL: string;
  DATE: string;
  RESISTANCE_LEVEL?: number;
  SUPPORT_LEVEL?: number;
  LEVEL_TYPE: 'RESISTANCE' | 'SUPPORT';
  STRENGTH: number;
  TIMEFRAME: string;
}

export interface ResistanceSupportResponse extends TokenMetricsBaseResponse {
  data: ResistanceSupportData[];
}

// ===== 11. AI REPORTS ENDPOINT =====
// GET /v2/ai-reports
export interface AIReportsRequest {
  token_id?: number;
  symbol?: string;
  report_type?: string;
  start_date?: string;
  end_date?: string;
}

export interface AIReportsData {
  TOKEN_ID: number;
  SYMBOL: string;
  REPORT_TYPE: string;
  GENERATED_DATE: string;
  REPORT_CONTENT: string;
  CONFIDENCE_SCORE: number;
  KEY_INSIGHTS: string[];
  RECOMMENDATIONS: string[];
}

export interface AIReportsResponse extends TokenMetricsBaseResponse {
  data: AIReportsData[];
}

// ===== 12. SECTOR INDICES HOLDINGS ENDPOINT =====
// GET /v2/sector-indices-holdings
export interface SectorIndicesHoldingsRequest {
  sector?: string;
  index_name?: string;
}

export interface SectorIndicesHoldingsData {
  SECTOR: string;
  INDEX_NAME: string;
  TOKEN_ID: number;
  SYMBOL: string;
  WEIGHT: number;
  ALLOCATION_PERCENT: number;
}

export interface SectorIndicesHoldingsResponse extends TokenMetricsBaseResponse {
  data: SectorIndicesHoldingsData[];
}

// ===== 13. INDEX SPECIFIC PERFORMANCE ENDPOINT =====
// GET /v2/index-specific-performance
export interface IndexPerformanceRequest {
  index_name: string;
  start_date?: string;
  end_date?: string;
}

export interface IndexPerformanceData {
  INDEX_NAME: string;
  DATE: string;
  INDEX_VALUE: number;
  DAILY_RETURN: number;
  CUMULATIVE_RETURN: number;
  VOLATILITY: number;
}

export interface IndexPerformanceResponse extends TokenMetricsBaseResponse {
  data: IndexPerformanceData[];
}

// ===== 14. SECTOR INDEX TRANSACTION ENDPOINT =====
// GET /v2/sector-index-transaction
export interface SectorIndexTransactionRequest {
  sector?: string;
  transaction_type?: 'BUY' | 'SELL';
  start_date?: string;
  end_date?: string;
}

export interface SectorIndexTransactionData {
  SECTOR: string;
  TOKEN_ID: number;
  SYMBOL: string;
  TRANSACTION_TYPE: 'BUY' | 'SELL';
  TRANSACTION_DATE: string;
  PRICE: number;
  QUANTITY: number;
  REASONING: string;
}

export interface SectorIndexTransactionResponse extends TokenMetricsBaseResponse {
  data: SectorIndexTransactionData[];
}

// Common error response structure
export interface TokenMetricsErrorResponse {
  success: false;
  error: {
      code: string;
      message: string;
      details?: any;
  };
  timestamp: string;
}
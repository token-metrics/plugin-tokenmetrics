// CORRECTED TokenMetrics API Type Definitions
// Based on ACTUAL API Documentation from developers.tokenmetrics.com
// 
// CRITICAL CORRECTIONS MADE:
// 1. Authentication uses x-api-key headers (not Authorization Bearer)
// 2. Date parameters use camelCase: startDate/endDate (not start_date/end_date)
// 3. Pagination uses 'page' parameter (not 'offset')
// 4. Top market cap endpoint uses 'top_k' parameter (not 'limit')
// 5. Sector indices endpoints require 'indexName' parameter
// 6. Trading signals use numeric values: 1 (bullish), -1 (bearish), 0 (neutral)
// 7. Endpoint URLs corrected to match actual API paths

// Base response interface for all TokenMetrics API calls
export interface TokenMetricsBaseResponse {
  success?: boolean;
  data?: any;
  message?: string;
  error?: string;
}

// ===== 1. TOKENS ENDPOINT =====
// GET /v2/tokens - Get list of supported tokens
// CORRECTED: Added all the filtering parameters shown in actual API docs
export interface TokensRequest {
  token_id?: number;
  token_name?: string;
  symbol?: string;
  category?: string;
  exchange?: string;
  blockchain_address?: string;
  // CORRECTED: Use 'page' instead of 'offset' for pagination
  limit?: number;
  page?: number;
}

export interface TokenInfo {
  TOKEN_ID: number;
  NAME: string;
  SYMBOL: string;
  CATEGORY?: string;
  EXCHANGE?: string;
  // Additional fields that may be returned by the real API
  BLOCKCHAIN_ADDRESS?: string;
  MARKET_CAP?: number;
  PRICE?: number;
}

export interface TokensResponse extends TokenMetricsBaseResponse {
  data: TokenInfo[];
}

// ===== 2. TOP MARKET CAP TOKENS ENDPOINT =====
// GET /v2/top-market-cap-tokens - Get top cryptocurrencies by market cap
// CORRECTED: Use 'top_k' parameter as shown in actual API docs (not 'limit')
export interface TopMarketCapRequest {
  top_k?: number;  // CORRECTED: This is the actual parameter name in the API
  page?: number;
}

export interface TopMarketCapData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  MARKET_CAP: number;
  PRICE: number;
  VOLUME_24H?: number;
  MARKET_CAP_RANK?: number;
  // Additional fields from real API response
  CATEGORY?: string;
}

export interface TopMarketCapResponse extends TokenMetricsBaseResponse {
  data: TopMarketCapData[];
}

// ===== 3. PRICE ENDPOINT =====
// GET /v2/price - Get token price data
// CORRECTED: Simplified based on actual API docs - primarily uses token_id
export interface PriceRequest {
  token_id?: number;  // Primary parameter for getting specific token price
}

export interface PriceData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  PRICE: number;
  PRICE_24H_CHANGE?: number;
  PRICE_24H_CHANGE_PERCENT?: number;
  MARKET_CAP?: number;
  VOLUME_24H?: number;
  TIMESTAMP?: string;
  // Additional fields that may be returned
  CATEGORY?: string;
  EXCHANGE?: string;
}

export interface PriceResponse extends TokenMetricsBaseResponse {
  data: PriceData[];
}

// ===== 4. TRADER GRADES ENDPOINT =====
// GET /v2/trader-grades - Short-term trading grades
// CORRECTED: Use camelCase for date parameters and added all filtering options
export interface TraderGradesRequest {
  token_id?: number;
  symbol?: string;
  // CORRECTED: Use camelCase format as shown in actual API docs
  startDate?: string;  // YYYY-MM-DD format
  endDate?: string;    // YYYY-MM-DD format
  
  // Extensive filtering options from API documentation
  category?: string;
  exchange?: string;
  marketcap?: number;
  fdv?: number;
  volume?: number;
  traderGrade?: number;
  traderGradePercentChange?: number;
  
  // CORRECTED: Use 'page' instead of 'offset'
  limit?: number;
  page?: number;
}

export interface TraderGradesData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  DATE: string;
  TM_TRADER_GRADE: number;
  TRADER_GRADE_24H_PERCENT_CHANGE?: number;
  TA_GRADE?: number;
  QUANTITATIVE_GRADE?: number;
  ONCHAIN_GRADE?: number;
  // Additional fields from real API
  MARKET_CAP?: number;
  VOLUME?: number;
  CATEGORY?: string;
}

export interface TraderGradesResponse extends TokenMetricsBaseResponse {
  data: TraderGradesData[];
}

// ===== 5. QUANTMETRICS ENDPOINT =====
// GET /v2/quantmetrics - Quantitative metrics for tokens
// CORRECTED: Added all filtering parameters and fixed date parameter names
export interface QuantmetricsRequest {
  token_id?: number;
  symbol?: string;
  // CORRECTED: Use camelCase format
  startDate?: string;
  endDate?: string;
  
  // Filtering options from API documentation
  category?: string;
  exchange?: string;
  marketcap?: number;
  volume?: number;
  fdv?: number;
  
  // CORRECTED: Use 'page' instead of 'offset'
  limit?: number;
  page?: number;
}

export interface QuantmetricsData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  DATE: string;
  VOLATILITY?: number;
  ALL_TIME_RETURN?: number;
  CAGR?: number;
  SHARPE?: number;
  SORTINO?: number;
  MAX_DRAWDOWN?: number;
  MARKET_CAP?: number;
  VOLUME?: number;
  FDV?: number;
  // Additional fields that may be returned
  CATEGORY?: string;
}

export interface QuantmetricsResponse extends TokenMetricsBaseResponse {
  data: QuantmetricsData[];
}

// ===== 6. TRADING SIGNALS ENDPOINT =====
// GET /v2/trading-signals - AI-generated trading signals
// CORRECTED: Signal values are numeric and added all filtering options
export interface TradingSignalsRequest {
  token_id?: number;
  symbol?: string;
  // CORRECTED: Signal uses numeric values: 1 (bullish), -1 (bearish), 0 (neutral)
  signal?: number;  // 1, -1, or 0
  
  // CORRECTED: Use camelCase format for dates
  startDate?: string;
  endDate?: string;
  
  // Extensive filtering options from API documentation
  category?: string;
  exchange?: string;
  marketcap?: number;
  volume?: number;
  fdv?: number;
  
  // CORRECTED: Use 'page' instead of 'offset'
  limit?: number;
  page?: number;
}

export interface TradingSignalsData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  DATE: string;
  // CORRECTED: Signal is numeric value
  SIGNAL: number;  // 1 (bullish), -1 (bearish), 0 (neutral)
  SIGNAL_STRENGTH?: number;
  ENTRY_PRICE?: number;
  TARGET_PRICE?: number;
  STOP_LOSS?: number;
  AI_CONFIDENCE?: number;
  // Additional fields from real API
  MARKET_CAP?: number;
  VOLUME?: number;
  CATEGORY?: string;
  REASONING?: string;
}

export interface TradingSignalsResponse extends TokenMetricsBaseResponse {
  data: TradingSignalsData[];
}

// ===== 7. MARKET METRICS ENDPOINT =====
// GET /v2/market-metrics - Market analytics with bullish/bearish indicators
// CORRECTED: Use camelCase for date parameters
export interface MarketMetricsRequest {
  // CORRECTED: Use camelCase format
  startDate?: string;
  endDate?: string;
  
  // CORRECTED: Use 'page' instead of 'offset'
  limit?: number;
  page?: number;
}

export interface MarketMetricsData {
  DATE: string;
  LAST_TM_GRADE_SIGNAL?: number;  // Bullish/Bearish indicator
  TOTAL_CRYPTO_MCAP?: number;
  MARKET_SENTIMENT?: string;
  // Additional fields that may be returned by the API
  BTC_DOMINANCE?: number;
  ETH_DOMINANCE?: number;
}

export interface MarketMetricsResponse extends TokenMetricsBaseResponse {
  data: MarketMetricsData[];
}

// ===== 8. SECTOR INDICES HOLDINGS ENDPOINT =====
// GET /v2/indices-index-specific-tree-map
// CORRECTED: Fixed endpoint URL and added required indexName parameter
export interface SectorIndicesHoldingsRequest {
  // CRITICAL: indexName is REQUIRED for this endpoint
  indexName: string;  // e.g., 'meme', 'defi', 'gaming'
  
  // Pagination
  limit?: number;
  page?: number;
}

export interface SectorIndicesHoldingsData {
  INDEX_NAME: string;
  TOKEN_ID: number;
  SYMBOL: string;
  TOKEN_NAME?: string;
  WEIGHT?: number;
  ALLOCATION_PERCENT?: number;
  // Additional fields from real API
  MARKET_CAP?: number;
  CATEGORY?: string;
}

export interface SectorIndicesHoldingsResponse extends TokenMetricsBaseResponse {
  data: SectorIndicesHoldingsData[];
}

// ===== 9. INDEX PERFORMANCE ENDPOINT =====
// GET /v2/indices-index-specific-performance
// CORRECTED: Fixed endpoint URL and parameter naming
export interface IndexPerformanceRequest {
  // REQUIRED: indexName parameter
  indexName: string;  // e.g., 'meme', 'defi', 'gaming'
  
  // CORRECTED: Use camelCase format
  startDate?: string;
  endDate?: string;
}

export interface IndexPerformanceData {
  INDEX_NAME: string;
  DATE: string;
  INDEX_VALUE?: number;
  DAILY_RETURN?: number;
  CUMULATIVE_RETURN?: number;
  VOLATILITY?: number;
  // Additional performance metrics
  SHARPE_RATIO?: number;
  MAX_DRAWDOWN?: number;
}

export interface IndexPerformanceResponse extends TokenMetricsBaseResponse {
  data: IndexPerformanceData[];
}

// ===== 10. SECTOR INDEX TRANSACTION ENDPOINT =====
// GET /v2/indices-index-specific-index-transaction
// CORRECTED: Fixed endpoint URL and parameter requirements
export interface SectorIndexTransactionRequest {
  // REQUIRED: indexName parameter
  indexName: string;  // e.g., 'meme', 'defi', 'gaming'
  
  // Pagination
  limit?: number;
  page?: number;
}

export interface SectorIndexTransactionData {
  INDEX_NAME: string;
  TOKEN_ID: number;
  SYMBOL: string;
  TRANSACTION_TYPE: 'BUY' | 'SELL';
  TRANSACTION_DATE: string;
  PRICE: number;
  QUANTITY: number;
  REASONING?: string;
  // Additional transaction details
  TOTAL_VALUE?: number;
  WEIGHT_CHANGE?: number;
}

export interface SectorIndexTransactionResponse extends TokenMetricsBaseResponse {
  data: SectorIndexTransactionData[];
}

// ===== ADDITIONAL ENDPOINTS (for future expansion) =====

// TMAI Endpoint - AI Assistant functionality
export interface TMAIRequest {
  query: string;
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

// Correlation Endpoint - Token correlation data
export interface CorrelationRequest {
  token_id?: number;
  symbol?: string;
  compare_with?: string;
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

// Resistance & Support Endpoint
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

// AI Reports Endpoint
export interface AIReportsRequest {
  token_id?: number;
  symbol?: string;
  report_type?: string;
  startDate?: string;
  endDate?: string;
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

// Common error response structure for all endpoints
export interface TokenMetricsErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// ===== AUTHENTICATION CONFIGURATION =====
// CRITICAL: TokenMetrics API uses x-api-key header authentication
// NOT Authorization: Bearer as was used in the original implementation
export interface TokenMetricsAuthConfig {
  headers: {
    'x-api-key': string;  // CORRECTED: This is the actual authentication method
    'accept': 'application/json';
    'Content-Type': 'application/json';
  };
}

// ===== API ENDPOINT CONFIGURATION =====
// CORRECTED: All endpoint URLs based on actual API documentation
export const CORRECTED_ENDPOINTS = {
  // Core endpoints
  tokens: "/v2/tokens",
  topMarketCap: "/v2/top-market-cap-tokens",
  price: "/v2/price",
  traderGrades: "/v2/trader-grades",
  quantmetrics: "/v2/quantmetrics",
  tradingSignals: "/v2/trading-signals",
  marketMetrics: "/v2/market-metrics",
  
  // CORRECTED: Sector indices endpoints with proper URLs
  sectorIndicesHoldings: "/v2/indices-index-specific-tree-map",
  indexPerformance: "/v2/indices-index-specific-performance",
  sectorIndexTransaction: "/v2/indices-index-specific-index-transaction",
  
  // Additional endpoints for future expansion
  tmai: "/v2/tmai",
  correlation: "/v2/correlation",
  resistanceSupport: "/v2/resistance-support",
  aiReports: "/v2/ai-reports"
} as const;

// ===== PARAMETER VALIDATION HELPERS =====
// These help ensure parameters match the actual API requirements

export type ValidDateString = string; // YYYY-MM-DD format
export type ValidPageNumber = number; // Positive integer starting from 1
export type ValidLimitNumber = number; // 1-1000 for most endpoints
export type ValidTopK = number; // 1-1000 for top market cap endpoint
export type ValidSignalValue = 1 | -1 | 0; // For trading signals
export type ValidIndexName = string; // Required for sector indices endpoints

// Utility type for ensuring proper parameter formatting
export interface CorrectedRequestParams {
  // Date parameters must use camelCase
  startDate?: ValidDateString;
  endDate?: ValidDateString;
  
  // Pagination must use 'page' not 'offset'
  page?: ValidPageNumber;
  limit?: ValidLimitNumber;
  
  // Top market cap uses special parameter name
  top_k?: ValidTopK;
  
  // Signals use numeric values
  signal?: ValidSignalValue;
  
  // Sector indices require index name
  indexName?: ValidIndexName;
}
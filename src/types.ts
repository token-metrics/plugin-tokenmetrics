// COMPLETE TokenMetrics API Type Definitions
// Based on ACTUAL API Documentation from developers.tokenmetrics.com

// Base response interface for all TokenMetrics API calls
export interface TokenMetricsBaseResponse {
  success?: boolean;
  data?: any;
  message?: string;
  error?: string;
}

// ===== EXISTING ENDPOINTS =====

// TokensRequest/Response
export interface TokensRequest {
  token_id?: number;
  token_name?: string;
  symbol?: string;
  category?: string;
  exchange?: string;
  blockchain_address?: string;
  limit?: number;
  page?: number;
}

export interface TokenInfo {
  TOKEN_ID: number;
  NAME: string;
  SYMBOL: string;
  CATEGORY?: string;
  EXCHANGE?: string;
  BLOCKCHAIN_ADDRESS?: string;
  MARKET_CAP?: number;
  PRICE?: number;
}

export interface TokensResponse extends TokenMetricsBaseResponse {
  data: TokenInfo[];
}

// TopMarketCapRequest/Response
export interface TopMarketCapRequest {
  top_k?: number;
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
  CATEGORY?: string;
}

export interface TopMarketCapResponse extends TokenMetricsBaseResponse {
  data: TopMarketCapData[];
}

// PriceRequest/Response
export interface PriceRequest {
  token_id?: number;
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
  CATEGORY?: string;
  EXCHANGE?: string;
}

export interface PriceResponse extends TokenMetricsBaseResponse {
  data: PriceData[];
}

// TraderGradesRequest/Response
export interface TraderGradesRequest {
  token_id?: number;
  symbol?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  exchange?: string;
  marketcap?: number;
  fdv?: number;
  volume?: number;
  traderGrade?: number;
  traderGradePercentChange?: number;
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
  MARKET_CAP?: number;
  VOLUME?: number;
  CATEGORY?: string;
}

export interface TraderGradesResponse extends TokenMetricsBaseResponse {
  data: TraderGradesData[];
}

// QuantmetricsRequest/Response
export interface QuantmetricsRequest {
  token_id?: number;
  symbol?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  exchange?: string;
  marketcap?: number;
  volume?: number;
  fdv?: number;
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
  CATEGORY?: string;
}

export interface QuantmetricsResponse extends TokenMetricsBaseResponse {
  data: QuantmetricsData[];
}

// TradingSignalsRequest/Response
export interface TradingSignalsRequest {
  token_id?: number;
  symbol?: string;
  signal?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  exchange?: string;
  marketcap?: number;
  volume?: number;
  fdv?: number;
  limit?: number;
  page?: number;
}

export interface TradingSignalsData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  DATE: string;
  SIGNAL: number;
  SIGNAL_STRENGTH?: number;
  ENTRY_PRICE?: number;
  TARGET_PRICE?: number;
  STOP_LOSS?: number;
  AI_CONFIDENCE?: number;
  MARKET_CAP?: number;
  VOLUME?: number;
  CATEGORY?: string;
  REASONING?: string;
}

export interface TradingSignalsResponse extends TokenMetricsBaseResponse {
  data: TradingSignalsData[];
}

// MarketMetricsRequest/Response
export interface MarketMetricsRequest {
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export interface MarketMetricsData {
  DATE: string;
  LAST_TM_GRADE_SIGNAL?: number;
  TOTAL_CRYPTO_MCAP?: number;
  MARKET_SENTIMENT?: string;
  BTC_DOMINANCE?: number;
  ETH_DOMINANCE?: number;
}

export interface MarketMetricsResponse extends TokenMetricsBaseResponse {
  data: MarketMetricsData[];
}

// ===== NEW ENDPOINTS FROM YOUR IMPLEMENTATION =====

// HourlyOhlcvRequest/Response
export interface HourlyOhlcvRequest {
  token_id?: number;
  symbol?: string;
  token_name?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export interface HourlyOhlcvData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  TIMESTAMP: string;
  OPEN: number;
  HIGH: number;
  LOW: number;
  CLOSE: number;
  VOLUME: number;
  DATE?: string; // Some endpoints may use DATE instead of TIMESTAMP
}

export interface HourlyOhlcvResponse extends TokenMetricsBaseResponse {
  data: HourlyOhlcvData[];
}

// DailyOhlcvRequest/Response
export interface DailyOhlcvRequest {
  token_id?: number;
  symbol?: string;
  token_name?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export interface DailyOhlcvData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  DATE: string;
  OPEN: number;
  HIGH: number;
  LOW: number;
  CLOSE: number;
  VOLUME: number;
}

export interface DailyOhlcvResponse extends TokenMetricsBaseResponse {
  data: DailyOhlcvData[];
}

// InvestorGradesRequest/Response
export interface InvestorGradesRequest {
  token_id?: number;
  symbol?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  exchange?: string;
  marketcap?: number;
  fdv?: number;
  volume?: number;
  investorGrade?: number;
  limit?: number;
  page?: number;
}

export interface InvestorGradesData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  DATE: string;
  INVESTOR_GRADE: number;
  FUNDAMENTAL_GRADE?: number;
  TECHNOLOGY_GRADE?: number;
  MARKET_CAP?: number;
  VOLUME?: number;
  FDV?: number;
  CATEGORY?: string;
  EXCHANGE?: string;
}

export interface InvestorGradesResponse extends TokenMetricsBaseResponse {
  data: InvestorGradesData[];
}

// AiReportsRequest/Response
export interface AiReportsRequest {
  token_id?: number;
  symbol?: string;
  limit?: number;
  page?: number;
}

export interface AiReportsData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  REPORT_TYPE: string;
  GENERATED_DATE: string;
  REPORT_CONTENT: string;
  CONFIDENCE_SCORE?: number;
  KEY_INSIGHTS?: string[];
  RECOMMENDATIONS?: string[];
  CATEGORY?: string;
}

export interface AiReportsResponse extends TokenMetricsBaseResponse {
  data: AiReportsData[];
}

// CryptoInvestorsRequest/Response
export interface CryptoInvestorsRequest {
  limit?: number;
  page?: number;
}

export interface CryptoInvestorsData {
  INVESTOR_NAME: string;
  NAME?: string;
  INVESTOR_SCORE: number;
  PORTFOLIO_VALUE?: number;
  FOLLOWER_COUNT?: number;
  LAST_ACTIVITY?: string;
  PERFORMANCE_CHANGE?: number;
  CATEGORY?: string;
  REGION?: string;
}

export interface CryptoInvestorsResponse extends TokenMetricsBaseResponse {
  data: CryptoInvestorsData[];
}

// ResistanceSupportRequest/Response
export interface ResistanceSupportRequest {
  token_id?: number;
  symbol?: string;
  limit?: number;
  page?: number;
}

export interface ResistanceSupportData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  DATE: string;
  RESISTANCE_LEVEL?: number;
  SUPPORT_LEVEL?: number;
  LEVEL_TYPE: 'RESISTANCE' | 'SUPPORT';
  STRENGTH?: number;
  PRICE?: number;
}

export interface ResistanceSupportResponse extends TokenMetricsBaseResponse {
  data: ResistanceSupportData[];
}

// TMAIRequest/Response (POST endpoint)
export interface TMAIRequest {
  messages: Array<{
    user: string;
  }>;
}

export interface TMAIData {
  response: string;
  confidence?: number;
  related_tokens?: TokenInfo[];
  analysis?: any;
  timestamp?: string;
}

export interface TMAIResponse extends TokenMetricsBaseResponse {
  data: TMAIData;
}

// SentimentRequest/Response
export interface SentimentRequest {
  limit?: number;
  page?: number;
}

export interface SentimentData {
  DATE: string;
  SENTIMENT_SCORE: number;
  SENTIMENT_LABEL?: string;
  TWITTER_SENTIMENT?: number;
  REDDIT_SENTIMENT?: number;
  NEWS_SENTIMENT?: number;
  OVERALL_SENTIMENT?: string;
  VOLUME?: number;
}

export interface SentimentResponse extends TokenMetricsBaseResponse {
  data: SentimentData[];
}

// ScenarioAnalysisRequest/Response
export interface ScenarioAnalysisRequest {
  token_id?: number;
  symbol?: string;
  limit?: number;
  page?: number;
}

export interface ScenarioAnalysisData {
  TOKEN_ID: number;
  SYMBOL: string;
  NAME: string;
  SCENARIO_TYPE: string;
  PREDICTED_PRICE?: number;
  PROBABILITY?: number;
  TIMEFRAME?: string;
  ANALYSIS_DATE: string;
  RISK_LEVEL?: string;
  CONFIDENCE?: number;
}

export interface ScenarioAnalysisResponse extends TokenMetricsBaseResponse {
  data: ScenarioAnalysisData[];
}

// CorrelationRequest/Response
export interface CorrelationRequest {
  token_id?: number;
  symbol?: string;
  category?: string;
  exchange?: string;
  limit?: number;
  page?: number;
}

export interface CorrelationData {
  TOKEN_ID: number;
  SYMBOL: string;
  TOKEN_NAME?: string;
  NAME?: string;
  CORRELATION?: number;
  CORRELATION_VALUE?: number;
  CATEGORY?: string;
  MARKET_CAP?: number;
  VOLUME?: number;
}

export interface CorrelationResponse extends TokenMetricsBaseResponse {
  data: CorrelationData[];
}

// ===== SECTOR INDICES ENDPOINTS =====

// SectorIndicesHoldingsRequest/Response
export interface SectorIndicesHoldingsRequest {
  indexName: string;
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
  MARKET_CAP?: number;
  CATEGORY?: string;
}

export interface SectorIndicesHoldingsResponse extends TokenMetricsBaseResponse {
  data: SectorIndicesHoldingsData[];
}

// IndexPerformanceRequest/Response
export interface IndexPerformanceRequest {
  indexName: string;
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
  SHARPE_RATIO?: number;
  MAX_DRAWDOWN?: number;
}

export interface IndexPerformanceResponse extends TokenMetricsBaseResponse {
  data: IndexPerformanceData[];
}

// SectorIndexTransactionRequest/Response
export interface SectorIndexTransactionRequest {
  indexName: string;
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
  TOTAL_VALUE?: number;
  WEIGHT_CHANGE?: number;
}

export interface SectorIndexTransactionResponse extends TokenMetricsBaseResponse {
  data: SectorIndexTransactionData[];
}

// ===== UTILITY TYPES =====

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

// Authentication configuration
export interface TokenMetricsAuthConfig {
  headers: {
    'x-api-key': string;
    'accept': 'application/json';
    'Content-Type': 'application/json';
  };
}

// Validation types
export type ValidDateString = string; // YYYY-MM-DD format
export type ValidPageNumber = number; // Positive integer starting from 1
export type ValidLimitNumber = number; // 1-1000 for most endpoints
export type ValidTopK = number; // 1-1000 for top market cap endpoint
export type ValidSignalValue = 1 | -1 | 0; // For trading signals
export type ValidIndexName = string; // Required for sector indices endpoints

// Parameter correction utility type
export interface CorrectedRequestParams {
  startDate?: ValidDateString;
  endDate?: ValidDateString;
  page?: ValidPageNumber;
  limit?: ValidLimitNumber;
  top_k?: ValidTopK;
  signal?: ValidSignalValue;
  indexName?: ValidIndexName;
}
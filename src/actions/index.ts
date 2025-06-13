// ===== CORE ENDPOINTS =====
export { getTokensAction } from "./getTokensAction";
export { getQuantmetricsAction } from "./getQuantmetricsAction";
export { getTraderGradesAction } from "./getTraderGradesAction";
export { getMarketMetricsAction } from "./getMarketMetricsAction";
export { getTradingSignalsAction } from "./getTradingSignalsAction";
export { getHourlyTradingSignalsAction } from "./getHourlyTradingSignalsAction";
export { getPriceAction } from "./getPriceAction";
export { getTopMarketCapAction } from "./getTopMarketCapAction";

// ===== OHLCV ENDPOINTS =====
export { getHourlyOhlcvAction } from "./getHourlyOhlcvAction";
export { getDailyOhlcvAction } from "./getDailyOhlcvAction";

// ===== ANALYSIS ENDPOINTS =====
export { getInvestorGradesAction } from "./getInvestorGradesAction";
export { getAiReportsAction } from "./getAiReportsAction";
export { getCryptoInvestorsAction } from "./getCryptoInvestorsAction";
export { getResistanceSupportAction } from "./getResistanceSupportAction";
export { getSentimentAction } from "./getSentimentAction";
export { getScenarioAnalysisAction } from "./getScenarioAnalysisAction";
export { getCorrelationAction } from "./getCorrelationAction";

// ===== AI ENDPOINT =====
export { getTMAIAction } from "./getTmaiAction";

// ===== INDICES ENDPOINTS =====
export { getIndicesAction } from "./getIndicesAction";
export { getIndicesHoldingsAction } from "./getIndicesHoldingsAction";
export { getIndicesPerformanceAction } from "./getIndicesPerformanceAction";

// Export utility functions from action.ts
export { callTokenMetricsApi, TOKENMETRICS_ENDPOINTS, validateApiKey } from './action';

// ===== ENHANCED TOKENMETRICS ACTIONS ARRAY =====
import { getTokensAction } from "./getTokensAction";
import { getQuantmetricsAction } from "./getQuantmetricsAction";
import { getTraderGradesAction } from "./getTraderGradesAction";
import { getMarketMetricsAction } from "./getMarketMetricsAction";
import { getTradingSignalsAction } from "./getTradingSignalsAction";
import { getHourlyTradingSignalsAction } from "./getHourlyTradingSignalsAction";
import { getPriceAction } from "./getPriceAction";
import { getTopMarketCapAction } from "./getTopMarketCapAction";
import { getHourlyOhlcvAction } from "./getHourlyOhlcvAction";
import { getDailyOhlcvAction } from "./getDailyOhlcvAction";
import { getInvestorGradesAction } from "./getInvestorGradesAction";
import { getAiReportsAction } from "./getAiReportsAction";
import { getCryptoInvestorsAction } from "./getCryptoInvestorsAction";
import { getResistanceSupportAction } from "./getResistanceSupportAction";
import { getSentimentAction } from "./getSentimentAction";
import { getScenarioAnalysisAction } from "./getScenarioAnalysisAction";
import { getCorrelationAction } from "./getCorrelationAction";
import { getTMAIAction } from "./getTmaiAction";
import { getIndicesAction } from "./getIndicesAction";
import { getIndicesHoldingsAction } from "./getIndicesHoldingsAction";
import { getIndicesPerformanceAction } from "./getIndicesPerformanceAction";

export const enhancedTokenmetricsActions = [
    getTokensAction,
    getQuantmetricsAction,
    getTraderGradesAction,
    getMarketMetricsAction,
    getTradingSignalsAction,
    getHourlyTradingSignalsAction,
    getPriceAction,
    getTopMarketCapAction,
    getHourlyOhlcvAction,
    getDailyOhlcvAction,
    getInvestorGradesAction,
    getAiReportsAction,
    getCryptoInvestorsAction,
    getResistanceSupportAction,
    getSentimentAction,
    getScenarioAnalysisAction,
    getCorrelationAction,
    getTMAIAction,
    getIndicesAction,
    getIndicesHoldingsAction,
    getIndicesPerformanceAction,
]; 
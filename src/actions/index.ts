// Re-export all action implementations
export { getPriceAction } from "./getPriceAction";
export { getQuantmetricsAction } from "./getQuantmetricsAction";
export { getCorrelationAction } from "./getCorrelationAction";
export { getHourlyTradingSignalsAction } from "./getHourlyTradingSignalsAction";
export { getCryptoInvestorsAction } from "./getCryptoInvestorsAction";
export { getScenarioAnalysisAction } from "./getScenarioAnalysisAction";
export { getResistanceSupportAction } from "./getResistanceSupportAction";
export { getTradingSignalsAction } from "./getTradingSignalsAction";
export { getHourlyOhlcvAction } from "./getHourlyOhlcvAction";
export { getDailyOhlcvAction } from "./getDailyOhlcvAction";
export { getTmaiAction } from "./getTmaiAction";
export { getTokensAction } from "./getTokensAction";
export { getTopMarketCapAction } from "./getTopMarketCapAction";
export { getTraderGradesAction } from "./getTraderGradesAction";
export { getInvestorGradesAction } from "./getInvestorGradesAction";
export { getMarketMetricsAction } from "./getMarketMetricsAction";
export { getIndicesAction } from "./getIndicesAction";
export { getIndicesHoldingsAction } from "./getIndicesHoldingsAction";
export { getIndicesPerformanceAction } from "./getIndicesPerformanceAction";
export { getAiReportsAction } from "./getAiReportsAction";
export { getMoonshotTokensAction } from "./getMoonshotTokensAction";

// Export utility functions from action.ts
export { callTokenMetricsApi, LEGACY_TOKENMETRICS_ENDPOINTS, validateApiKey } from './action';

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
import { getMoonshotTokensAction } from "./getMoonshotTokensAction";
import { getScenarioAnalysisAction } from "./getScenarioAnalysisAction";
import { getCorrelationAction } from "./getCorrelationAction";
import { getTmaiAction } from "./getTmaiAction";
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
    getMoonshotTokensAction,
    getScenarioAnalysisAction,
    getCorrelationAction,
    getTmaiAction,
    getIndicesAction,
    getIndicesHoldingsAction,
    getIndicesPerformanceAction,
]; 
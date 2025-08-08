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

export { getTokensAction } from "./getTokensAction";
export { getTopMarketCapAction } from "./getTopMarketCapAction";
export { getTmGradeAction } from "./getTmGradeAction";
export { getTmGradeHistoryAction } from "./getTmGradeHistoryAction";
export { getTechnologyGradeAction } from "./getTechnologyGradeAction";
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
import { getTmGradeAction } from "./getTmGradeAction";
import { getTmGradeHistoryAction } from "./getTmGradeHistoryAction";
import { getTechnologyGradeAction } from "./getTechnologyGradeAction";
import { getMarketMetricsAction } from "./getMarketMetricsAction";
import { getTradingSignalsAction } from "./getTradingSignalsAction";
import { getHourlyTradingSignalsAction } from "./getHourlyTradingSignalsAction";
import { getPriceAction } from "./getPriceAction";
import { getTopMarketCapAction } from "./getTopMarketCapAction";
import { getHourlyOhlcvAction } from "./getHourlyOhlcvAction";
import { getDailyOhlcvAction } from "./getDailyOhlcvAction";

import { getAiReportsAction } from "./getAiReportsAction";
import { getCryptoInvestorsAction } from "./getCryptoInvestorsAction";
import { getResistanceSupportAction } from "./getResistanceSupportAction";
import { getMoonshotTokensAction } from "./getMoonshotTokensAction";
import { getScenarioAnalysisAction } from "./getScenarioAnalysisAction";
import { getCorrelationAction } from "./getCorrelationAction";

import { getIndicesAction } from "./getIndicesAction";
import { getIndicesHoldingsAction } from "./getIndicesHoldingsAction";
import { getIndicesPerformanceAction } from "./getIndicesPerformanceAction";

export const enhancedTokenmetricsActions = [
    getTokensAction,
    getQuantmetricsAction,
    getTmGradeAction,
    getTmGradeHistoryAction,
    getTechnologyGradeAction,
    getMarketMetricsAction,
    getTradingSignalsAction,
    getHourlyTradingSignalsAction,
    getPriceAction,
    getTopMarketCapAction,
    getHourlyOhlcvAction,
    getDailyOhlcvAction,

    getAiReportsAction,
    getCryptoInvestorsAction,
    getResistanceSupportAction,
    getMoonshotTokensAction,
    getScenarioAnalysisAction,
    getCorrelationAction,

    getIndicesAction,
    getIndicesHoldingsAction,
    getIndicesPerformanceAction,
]; 
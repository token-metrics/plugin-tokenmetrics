import axios from "axios";
import { TokenMetricsResponse } from "../types";

export const getMarketTrendsAction = {
  name: "getMarketTrends",
  description: "Get current market trends from Token Metrics",
  run: async (_: any, context: any): Promise<TokenMetricsResponse> => {
    const apiKey = process.env.TOKENMETRICS_API_KEY;
    if (!apiKey) throw new Error("Missing TOKENMETRICS_API_KEY");

    const response = await axios.get("https://api.tokenmetrics.com/market-trends", {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    return response.data;
  }
};

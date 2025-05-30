import axios from "axios";
import { TokenDetailsResponse } from "../types";

export const getTokenDetailsAction = {
  name: "getTokenDetails",
  description: "Fetch details for a specific token",
  parameters: {
    type: "object",
    properties: {
      symbol: {
        type: "string",
        description: "Token symbol (e.g., BTC)"
      }
    },
    required: ["symbol"]
  },
  run: async (params: { symbol: string }, context: any): Promise<TokenDetailsResponse> => {
    const apiKey = process.env.TOKENMETRICS_API_KEY;
    if (!apiKey) throw new Error("Missing TOKENMETRICS_API_KEY");

    const response = await axios.get(`https://api.tokenmetrics.com/token/${params.symbol}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    return response.data;
  }
};

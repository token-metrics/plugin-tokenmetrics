import type { Action } from "@elizaos/core";
import axios from "axios";
import { TopTokenResponse } from "../types";

export const getTopCryptosAction: Action = {
  name: "getTopCryptos",
  description: "Get top cryptocurrencies by ranking",
  similes: ["Give me the top 10 coins", "Show best performing tokens"],
  parameters: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Number of top cryptocurrencies to retrieve"
      }
    },
    required: ["limit"]
  },
  examples: [
    {
      input: {
        type: "tokenName",
        content: {
          limit: 3
      result: {
        data: [
          { name: "Bitcoin", symbol: "BTC" },
          { name: "Ethereum", symbol: "ETH" },
          { name: "Solana", symbol: "SOL" }
        ]
      }
    }
  ],
  async handler(runtime, message, _state) {
    // Directly retrieve the limit from the message object
    const { limit } = message.content;

    // Retrieve the API key from the runtime settings
    const apiKey = runtime.getSetting("TOKENMETRICS_API_KEY");
    if (!apiKey) {
      throw new Error("Missing TOKENMETRICS_API_KEY in runtime settings");
    }

    // Fetch the top cryptocurrencies
    const response = await axios.get<TopTokenResponse>("https://api.tokenmetrics.com/v2/ai-reports-tokens", {
      params: { limit },
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    // Return the fetched data
    return response.data;
  },
  async validate(runtime, message) {
    const { limit } = message.content;

    // Validate the limit parameter
    if (typeof limit !== "number" || limit <= 0) {
      throw new Error("`limit` must be a positive number");
    }

    // Validate the presence of the API key in runtime settings
    const hasApiKey = !!runtime.getSetting("TOKENMETRICS_API_KEY");
    if (!hasApiKey) {
      throw new Error("Missing TOKENMETRICS_API_KEY in runtime settings");
    }

    return true;
  }
};

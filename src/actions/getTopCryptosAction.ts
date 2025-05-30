import type { Action } from "@elizaos/core";
import axios from "axios";
import { TopMarketCapResponse } from "../types";

export const getTopCryptosAction: Action = {
  name: "getTopCryptos",
  description: "Get top cryptocurrencies by ranking",
  similes: ["Give me the top 10 coins", "Show best performing tokens"],
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Give me the top 3 cryptocurrencies",
          limit: 3
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get the top 3 cryptocurrencies for you.",
          action: "GET_TOP_CRYPTOS"
        }
      }
    ]
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
    const response = await axios.get<TopMarketCapResponse>("https://api.tokenmetrics.com/v2/ai-reports-tokens", {
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

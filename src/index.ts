import type { Plugin } from "@elizaos/core";
import { getTopCryptosAction } from "./actions/getTopCryptosAction";
import { getMarketTrendsAction } from "./actions/getMarketTrendsAction";
import { getTokenDetailsAction } from "./actions/getTokenDetailsAction";

// Console banner for visibility during ElizaOS plugin load
console.log("\n===============================");
console.log("   Token Metrics Plugin Loaded  ");
console.log("===============================");
console.log("Name      : tokenmetrics-plugin");
console.log("Version   : 0.1.0");
console.log("X Account : https://x.com/TokenMetricsInc");
console.log("GitHub    : https://github.com/tokenmetrics");
console.log("Actions   :");
console.log("  - getTopCryptosAction");
console.log("  - getMarketTrendsAction");
console.log("  - getTokenDetailsAction");
console.log("===============================\n");

export const tokenmetricsPlugin: Plugin = {
  name: "tokenmetrics",
  description: "Plugin for accessing Token Metrics API data",
  actions: [
    getTopCryptosAction,
    getMarketTrendsAction,
    getTokenDetailsAction
  ],
  evaluators: [],
  providers: [],
  // tests: [
  //   {
  //     name: "test-tokenmetrics-actions",
  //     tests: [
  //       {
  //         name: "basic-plugin-test",
  //         fn: async (runtime) => {
  //           const result = "Token Metrics plugin loaded successfully.";
  //           console.log(result);
  //           return true;
  //         }
  //       }
  //     ]
  //   }
  // ]
};

export default tokenmetricsPlugin;

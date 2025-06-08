import { DirectClient } from "@elizaos/client-direct";
import {
  AgentRuntime,
  elizaLogger,
  settings,
  stringToUuid,
  type Character,
} from "@elizaos/core";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import { createNodePlugin } from "@elizaos/plugin-node";
import { solanaPlugin } from "@elizaos/plugin-solana";
import fs from "fs";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";
import { initializeDbCache } from "./cache/index.ts";
import { character } from "./character.ts";
import { startChat } from "./chat/index.ts";
import { initializeClients } from "./clients/index.ts";
import {
  getTokenForProvider,
  loadCharacters,
  parseArguments,
} from "./config/index.ts";
import { initializeDatabase } from "./database/index.ts";

// CORRECTED: Import your TokenMetrics plugin
// This path should match where you placed your compiled plugin
import { tokenmetricsPlugin } from "./plugins/tokenmetrics/tokenmetrics-core.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const wait = (minTime: number = 1000, maxTime: number = 3000) => {
  const waitTime =
    Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  return new Promise((resolve) => setTimeout(resolve, waitTime));
};

let nodePlugin: any | undefined;

export function createAgent(
  character: Character,
  db: any,
  cache: any,
  token: string
) {
  elizaLogger.success(
    elizaLogger.successesTitle,
    "Creating runtime for character",
    character.name,
  );

  nodePlugin ??= createNodePlugin();

  // Enhanced plugin loading with clear conditional logic
  elizaLogger.log("🔌 Loading plugins...");
  
  const plugins = [];
  
  // Core plugins (always loaded)
  plugins.push(bootstrapPlugin);
  plugins.push(nodePlugin);
  
  // Conditional Solana plugin
  if (character.settings?.secrets?.WALLET_PUBLIC_KEY) {
    plugins.push(solanaPlugin);
    elizaLogger.log("✅ Solana plugin will be loaded (wallet configured)");
  } else {
    elizaLogger.log("⚠️  Solana plugin skipped (no wallet configured)");
  }
  
  // Conditional TokenMetrics plugin
  if (character.settings?.secrets?.TOKENMETRICS_API_KEY) {
    plugins.push(tokenmetricsPlugin);
    elizaLogger.log("✅ TokenMetrics plugin will be loaded (API key configured)");
  } else {
    elizaLogger.log("⚠️  TokenMetrics plugin skipped (no API key configured)");
    elizaLogger.log("💡 Add TOKENMETRICS_API_KEY to your character.ts to enable TokenMetrics features");
  }

  // Log final plugin count
  elizaLogger.log(`📋 Total plugins loaded: ${plugins.length}`);
  plugins.forEach((plugin, index) => {
    if (plugin?.name) {
      elizaLogger.log(`  ${index + 1}. ${plugin.name}`);
    }
  });

  return new AgentRuntime({
    databaseAdapter: db,
    token,
    modelProvider: character.modelProvider,
    evaluators: [],
    character,
    plugins: plugins,
    providers: [],
    actions: [],
    services: [],
    managers: [],
    cacheManager: cache,
  });
}

async function startAgent(character: Character, directClient: DirectClient) {
  try {
    character.id ??= stringToUuid(character.name);
    character.username ??= character.name;

    const token = getTokenForProvider(character.modelProvider, character);
    const dataDir = path.join(__dirname, "../data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const db = initializeDatabase(dataDir);
    await db.init();

    const cache = initializeDbCache(character, db);
    const runtime = createAgent(character, db, cache, token);

    await runtime.initialize();

    runtime.clients = await initializeClients(character, runtime);
    directClient.registerAgent(runtime);

    // Enhanced startup reporting with action details
    elizaLogger.debug(`Started ${character.name} as ${runtime.agentId}`);
    
    // List all available actions for debugging
    const availableActions = runtime.actions?.map(action => action.name) || [];
    if (availableActions.length > 0) {
      elizaLogger.log("🎬 Available actions:");
      availableActions.forEach(actionName => {
        const isTokenMetrics = actionName.includes('TOKENMETRICS');
        const prefix = isTokenMetrics ? '🎯' : '•';
        elizaLogger.log(`  ${prefix} ${actionName}`);
      });
      
      // Check specifically for TokenMetrics actions
      const tokenMetricsActions = availableActions.filter(name => name.includes('TOKENMETRICS'));
      if (tokenMetricsActions.length > 0) {
        elizaLogger.success(`🎉 TokenMetrics plugin successfully loaded with ${tokenMetricsActions.length} actions!`);
        elizaLogger.log("💬 Try asking: 'What's the price of Bitcoin?'");
      }
    } else {
      elizaLogger.warn("⚠️  No actions available - this might indicate a plugin loading issue");
    }

    return runtime;
  } catch (error) {
    elizaLogger.error(
      `Error starting agent for character ${character.name}:`,
      error,
    );
    console.error(error);
    throw error;
  }
}

// ... rest of your existing code (checkPortAvailable, startAgents, etc.)

const checkPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        resolve(false);
      }
    });

    server.once("listening", () => {
      server.close();
      resolve(true);
    });

    server.listen(port);
  });
};

const startAgents = async () => {
  elizaLogger.log("🚀 Starting ElizaOS agents with TokenMetrics integration...");
  
  const directClient = new DirectClient();
  let serverPort = parseInt(settings.SERVER_PORT || "3000");
  const args = parseArguments();

  let charactersArg = args.characters || args.character;
  let characters = [character];

  console.log("charactersArg", charactersArg);
  if (charactersArg) {
    characters = await loadCharacters(charactersArg);
  }
  console.log("characters", characters);
  
  try {
    for (const character of characters) {
      await startAgent(character, directClient as DirectClient);
    }
  } catch (error) {
    elizaLogger.error("Error starting agents:", error);
  }

  while (!(await checkPortAvailable(serverPort))) {
    elizaLogger.warn(`Port ${serverPort} is in use, trying ${serverPort + 1}`);
    serverPort++;
  }

  directClient.startAgent = async (character: Character) => {
    return startAgent(character, directClient);
  };

  directClient.start(serverPort);

  if (serverPort !== parseInt(settings.SERVER_PORT || "3000")) {
    elizaLogger.log(`Server started on alternate port ${serverPort}`);
  }

  elizaLogger.success("🎉 ElizaOS started successfully!");
  elizaLogger.log("💬 You can now chat with your agent");
  elizaLogger.log("🔍 Try asking: 'What's the price of Bitcoin?'");

  const isDaemonProcess = process.env.DAEMON_PROCESS === "true";
  if(!isDaemonProcess) {
    elizaLogger.log("Chat started. Type 'exit' to quit.");
    const chat = startChat(characters);
    chat();
  }
};

startAgents().catch((error) => {
  elizaLogger.error("Unhandled error in startAgents:", error);
  process.exit(1);
});
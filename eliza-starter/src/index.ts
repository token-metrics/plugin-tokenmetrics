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
import { tokenmetricsPlugin } from "../../dist/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store original logging functions
const originalConsoleLog = console.log;
const originalElizaLog = elizaLogger.log;

// Override console.log to filter out verbose debug messages
console.log = (...args: any[]) => {
  const message = args.join(' ');
  
  // Filter out verbose debug messages but keep important ones
  if (
    message.includes('🔍 AI EXTRACTION CONTEXT') ||
    message.includes('📋 Template being used:') ||
    message.includes('🔚 END CONTEXT') ||
    message.includes('🔍 PRICE ACTION DEBUG') ||
    message.includes('🔚 END DEBUG') ||
    message.includes('🎯 AI Extracted:') ||
    message.includes('🔄 AI vs Regex mismatch') ||
    message.includes('🔍 Crypto to resolve:') ||
    message.includes('🔍 Starting token resolution') ||
    message.includes('🎯 Token resolved:') ||
    message.includes('Processing') && message.includes('request...') ||
    message.includes('Extracted request:') ||
    message.includes('API response received') ||
    message.includes('analysis completed successfully') ||
    message.includes('Analysis completed successfully') ||
    message.includes('🔍 Resolving token for:') ||
    message.includes('🔍 Using symbol:') ||
    message.includes('🔍 Fallback to symbol') ||
    message.includes('🔍 Grade filter requested:') ||
    message.includes('🔍 Applying grade filter:') ||
    message.includes('🔍 Grade filtering:') ||
    message.includes('🔍 Multiple tokens found') ||
    message.includes('🔍 Final grades count:') ||
    message.includes('🔍 Also searching by symbol:') ||
    message.includes('🔍 Received') && message.includes('tokens') ||
    message.includes('🔍 Searching for specific token') ||
    message.includes('📝 User message:') ||
    message.includes('You are an AI assistant specialized in extracting') ||
    message.includes('CRITICAL INSTRUCTION:') ||
    message.includes('ONLY MATCH PRICE REQUESTS:') ||
    message.includes('DO NOT MATCH TOKEN SEARCH') ||
    message.includes('Extract the following information') ||
    message.includes('Cache Busting ID:') ||
    message.includes('Timestamp:') ||
    message.includes('USER MESSAGE:') ||
    message.includes('Please analyze the CURRENT user message')
  ) {
    // Suppress these verbose debug messages
    return;
  }
  
  // Keep important messages
  originalConsoleLog.apply(console, args);
};

// Override elizaLogger.log to reduce verbosity
elizaLogger.log = (...args: any[]) => {
  const message = args.join(' ');
  
  // Filter out verbose debug messages
  if (
    message.includes('🔍 Validating') ||
    message.includes('🔍 DEBUG:') ||
    message.includes('🎯 DEBUG:') ||
    message.includes('🔄 DEBUG:') ||
    message.includes('❌ DEBUG:') ||
    message.includes('✅ DEBUG:') ||
    message.includes('INFO: Loading embedding settings') ||
    message.includes('INFO: Loading character settings') ||
    message.includes('INFO: Parsed settings') ||
    message.includes('INFO: Eliza(') && message.includes('Initializing AgentRuntime') ||
    message.includes('INFO: Eliza(') && message.includes('Setting Model Provider') ||
    message.includes('INFO: Eliza(') && message.includes('Selected model provider') ||
    message.includes('INFO: Eliza(') && message.includes('Selected image model provider') ||
    message.includes('INFO: Eliza(') && message.includes('Selected image vision model provider') ||
    message.includes('INFO: Initializing LlamaService') ||
    message.includes('INFO: Generating text with options') ||
    message.includes('INFO: Selected model:') ||
    message.includes('Received response from OpenAI model') ||
    message.includes('INFO: Executing handler for action') ||
    message.includes('🔄 Mapped symbol') ||
    message.includes('🔍 Mapped symbol')
  ) {
    // Suppress these verbose debug messages
    return;
  }
  
  // Keep important messages
  originalElizaLog.apply(elizaLogger, args);
};

// Override elizaLogger.info to reduce INFO verbosity
const originalElizaInfo = elizaLogger.info;
elizaLogger.info = (...args: any[]) => {
  const message = args.join(' ');
  
  // Filter out verbose INFO messages
  if (
    message.includes('Loading embedding settings') ||
    message.includes('Loading character settings') ||
    message.includes('Parsed settings') ||
    message.includes('Initializing AgentRuntime') ||
    message.includes('Setting Model Provider') ||
    message.includes('Selected model provider') ||
    message.includes('Selected image model provider') ||
    message.includes('Selected image vision model provider') ||
    message.includes('Initializing LlamaService') ||
    message.includes('Generating text with options') ||
    message.includes('Selected model:') ||
    message.includes('Executing handler for action')
  ) {
    // Suppress these verbose INFO messages
    return;
  }
  
  // Keep important INFO messages
  originalElizaInfo.apply(elizaLogger, args);
};

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

  // Enhanced plugin loading with clean output
  const plugins = [];
  
  // Core plugins (always loaded)
  plugins.push(bootstrapPlugin);
  plugins.push(nodePlugin);
  
  // Conditional Solana plugin
  if (character.settings?.secrets?.WALLET_PUBLIC_KEY) {
    plugins.push(solanaPlugin);
  }
  
  // Conditional TokenMetrics plugin
  if (character.settings?.secrets?.TOKENMETRICS_API_KEY) {
    plugins.push(tokenmetricsPlugin);
    console.log("✅ TokenMetrics plugin loaded - Ready for crypto queries!");
  } else {
    console.log("⚠️  TokenMetrics plugin not loaded (no API key configured)");
  }

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

    // Clean startup reporting
    elizaLogger.debug(`Started ${character.name} as ${runtime.agentId}`);
    
    // Check if TokenMetrics actions are available
    const availableActions = runtime.actions?.map(action => action.name) || [];
    const tokenMetricsActions = availableActions.filter(name => name.includes('TOKENMETRICS'));
    
    if (tokenMetricsActions.length > 0) {
      console.log(`🎉 Ready! TokenMetrics plugin active with ${tokenMetricsActions.length} actions.`);
      console.log("💬 Try: 'What's the price of Bitcoin?' or 'Show me DOGE trading signals'");
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
  console.log("🚀 Starting ElizaOS with TokenMetrics...");
  
  const directClient = new DirectClient();
  let serverPort = parseInt(settings.SERVER_PORT || "3000");
  const args = parseArguments();

  let charactersArg = args.characters || args.character;
  let characters = [character];

  if (charactersArg) {
    characters = await loadCharacters(charactersArg);
  }

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
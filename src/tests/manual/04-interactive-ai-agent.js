/**
 * Interactive TokenMetrics AI Agent Terminal Interface
 * Chat with the AI agent just like ChatGPT/Claude for crypto analysis
 */

import { enhancedHandler } from '../../core/enhanced-action-handler.ts';
import readline from 'readline';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

// Mock runtime for the agent
const mockRuntime = {
    getSetting: (key) => {
        const settings = {
            'TOKENMETRICS_API_KEY': process.env.TOKENMETRICS_API_KEY,
            'TOKENMETRICS_BASE_URL': 'https://api.tokenmetrics.com'
        };
        return settings[key];
    }
};

// User session management
const userId = 'interactive-user-' + Date.now();
const sessionId = 'interactive-session-' + Date.now();

class TokenMetricsAIAgent {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: chalk.cyan('You: ')
        });
        
        this.conversationCount = 0;
        this.isProcessing = false;
    }

    async start() {
        this.displayWelcome();
        this.setupEventHandlers();
        this.rl.prompt();
    }

    displayWelcome() {
        console.clear();
        console.log(chalk.bold.blue('🤖 TokenMetrics AI Agent - Interactive Chat'));
        console.log(chalk.blue('═'.repeat(60)));
        console.log(chalk.green('Hello! I\'m your TokenMetrics AI assistant. I can help you with:'));
        console.log(chalk.white('• 📈 Real-time cryptocurrency prices & OHLCV data'));
        console.log(chalk.white('• 🎯 AI-powered trading signals & trader grades'));
        console.log(chalk.white('• 📊 Market sentiment & correlation analysis'));
        console.log(chalk.white('• 🔍 Risk analysis, investor grades & scenario planning'));
        console.log(chalk.white('• 🏆 Top performing tokens & crypto investors'));
        console.log(chalk.white('• 🏭 Sector analysis & technical levels'));
        console.log(chalk.white('• 🤖 Direct access to TokenMetrics AI assistant'));
        console.log(chalk.white('• 📋 AI reports & comprehensive market insights'));
        console.log('');
        console.log(chalk.yellow('💡 Try asking: "What\'s Bitcoin\'s price?" or "Ask TokenMetrics AI about DeFi"'));
        console.log(chalk.gray('Type "help" for more examples, "clear" to clear screen, or "exit" to quit.'));
        console.log(chalk.blue('═'.repeat(60)));
        console.log('');
    }

    setupEventHandlers() {
        this.rl.on('line', async (input) => {
            const query = input.trim();
            
            if (!query) {
                this.rl.prompt();
                return;
            }

            // Handle special commands
            if (await this.handleSpecialCommands(query)) {
                return;
            }

            // Process AI query
            await this.processAIQuery(query);
        });

        this.rl.on('close', () => {
            console.log(chalk.blue('\n👋 Thanks for using TokenMetrics AI Agent! Happy trading!'));
            process.exit(0);
        });

        // Handle Ctrl+C gracefully
        process.on('SIGINT', () => {
            if (this.isProcessing) {
                console.log(chalk.yellow('\n⏸️  Processing interrupted...'));
                this.isProcessing = false;
            }
            this.rl.close();
        });
    }

    async handleSpecialCommands(query) {
        const command = query.toLowerCase();

        switch (command) {
            case 'help':
                this.showHelp();
                return true;

            case 'clear':
                console.clear();
                this.displayWelcome();
                this.rl.prompt();
                return true;

            case 'exit':
            case 'quit':
            case 'bye':
                this.rl.close();
                return true;

            case 'examples':
                this.showExamples();
                return true;

            case 'status':
                await this.showStatus();
                return true;

            default:
                return false;
        }
    }

    async processAIQuery(query) {
        this.isProcessing = true;
        this.conversationCount++;

        try {
            // Show thinking indicator
            const thinkingInterval = this.showThinking();

            // Process the query with the AI agent
            const startTime = Date.now();
            const response = await enhancedHandler.processNaturalLanguageQuery(
                query,
                userId,
                sessionId,
                mockRuntime
            );
            const processingTime = Date.now() - startTime;

            // Clear thinking indicator
            clearInterval(thinkingInterval);
            process.stdout.write('\r' + ' '.repeat(50) + '\r');

            // Display AI response
            this.displayAIResponse(response, processingTime);

        } catch (error) {
            console.log(chalk.red('❌ Oops! I encountered an error: ' + error.message));
            console.log(chalk.gray('Please try rephrasing your question or check your API configuration.'));
        } finally {
            this.isProcessing = false;
            console.log('');
            this.rl.prompt();
        }
    }

    showThinking() {
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let i = 0;
        
        return setInterval(() => {
            process.stdout.write(`\r${chalk.cyan(frames[i])} ${chalk.gray('Analyzing your request...')}`);
            i = (i + 1) % frames.length;
        }, 100);
    }

    displayAIResponse(response, processingTime) {
        console.log(chalk.bold.green('🤖 TokenMetrics AI:'));
        console.log(chalk.blue('─'.repeat(50)));
        
        if (response.success) {
            // Main response
            console.log(chalk.white(response.naturalLanguageResponse));
            
            // Show metadata if interesting
            if (response.conversationContext) {
                console.log('');
                console.log(chalk.gray(`💭 Intent: ${response.conversationContext.intent} (${(response.conversationContext.confidence * 100).toFixed(0)}% confidence)`));
                
                if (response.conversationContext.detectedTokens.length > 0) {
                    const tokens = response.conversationContext.detectedTokens.map(t => t.symbol).join(', ');
                    console.log(chalk.gray(`🎯 Tokens: ${tokens}`));
                }
            }
            
            // Performance info
            console.log(chalk.gray(`⚡ Processed in ${processingTime}ms | Data: ${response.metadata.dataSource}`));
            
        } else {
            // Error response
            console.log(chalk.red(response.naturalLanguageResponse));
            if (response.error?.suggestions) {
                console.log('');
                console.log(chalk.yellow('💡 Suggestions:'));
                response.error.suggestions.forEach(suggestion => {
                    console.log(chalk.yellow(`   • ${suggestion}`));
                });
            }
        }
        
        console.log(chalk.blue('─'.repeat(50)));
    }

    showHelp() {
        console.log(chalk.bold.cyan('\n📚 TokenMetrics AI Agent - Help'));
        console.log(chalk.cyan('═'.repeat(40)));
        console.log(chalk.white('Available Commands:'));
        console.log(chalk.green('  help      ') + chalk.gray('- Show this help message'));
        console.log(chalk.green('  examples  ') + chalk.gray('- Show example queries'));
        console.log(chalk.green('  status    ') + chalk.gray('- Show API and system status'));
        console.log(chalk.green('  clear     ') + chalk.gray('- Clear the screen'));
        console.log(chalk.green('  exit      ') + chalk.gray('- Exit the agent'));
        console.log('');
        console.log(chalk.white('💬 Just type your crypto questions naturally!'));
        console.log(chalk.cyan('═'.repeat(40)));
        console.log('');
        this.rl.prompt();
    }

    showExamples() {
        console.log(chalk.bold.magenta('\n💡 Example Queries - Try These!'));
        console.log(chalk.magenta('═'.repeat(45)));
        
        const examples = [
            { category: '📈 Price & OHLCV Data', queries: [
                'What\'s Bitcoin\'s current price?',
                'How much is Ethereum worth?',
                'Show me daily OHLCV data for Solana',
                'Get hourly candles for Cardano'
            ]},
            { category: '🎯 Trading & Signals', queries: [
                'Should I buy Solana?',
                'Get trading signals for Cardano',
                'What are the bullish signals today?',
                'Show me trader grades for top tokens'
            ]},
            { category: '📊 Market Analysis', queries: [
                'How\'s the crypto market doing?',
                'What\'s the market sentiment?',
                'Show me market overview',
                'Get correlation analysis for Bitcoin and Ethereum'
            ]},
            { category: '🔍 Risk & Investment Analysis', queries: [
                'How risky is Polygon?',
                'Analyze Chainlink\'s volatility',
                'Show me investor grades for Bitcoin',
                'Get scenario analysis for Ethereum'
            ]},
            { category: '🏆 Top Tokens & Rankings', queries: [
                'Top 10 cryptocurrencies',
                'Best performing tokens',
                'Show me top market cap coins',
                'Get crypto investors data'
            ]},
            { category: '🏭 Sector & Technical Analysis', queries: [
                'How is DeFi performing?',
                'Gaming sector analysis',
                'Show resistance and support levels for Bitcoin',
                'Get AI reports for Ethereum'
            ]},
            { category: '🤖 AI Assistant & Advanced', queries: [
                'Ask TokenMetrics AI about the next 100x coin',
                'What does TokenMetrics AI think about DeFi?',
                'Get AI analysis on market conditions',
                'Ask AI about portfolio allocation'
            ]}
        ];

        examples.forEach(category => {
            console.log(chalk.bold.white(`\n${category.category}:`));
            category.queries.forEach(query => {
                console.log(chalk.gray(`  • "${query}"`));
            });
        });

        console.log(chalk.magenta('\n═'.repeat(45)));
        console.log('');
        this.rl.prompt();
    }

    async showStatus() {
        console.log(chalk.bold.yellow('\n🔧 System Status'));
        console.log(chalk.yellow('═'.repeat(30)));
        
        // Check API key
        const apiKey = process.env.TOKENMETRICS_API_KEY;
        if (apiKey) {
            console.log(chalk.green('✅ API Key: Configured'));
            console.log(chalk.gray(`   Key: ${apiKey.substring(0, 10)}...`));
        } else {
            console.log(chalk.red('❌ API Key: Not found'));
        }
        
        // Session info
        console.log(chalk.green(`✅ Session: Active (${this.conversationCount} queries)`));
        console.log(chalk.green('✅ AI Agent: Ready'));
        
        // Test API connection
        try {
            console.log(chalk.gray('🔄 Testing API connection...'));
            const testResponse = await enhancedHandler.processNaturalLanguageQuery(
                'test connection',
                userId + '-test',
                sessionId + '-test',
                mockRuntime
            );
            console.log(chalk.green('✅ API Connection: Working'));
        } catch (error) {
            console.log(chalk.red('❌ API Connection: Failed'));
            console.log(chalk.red(`   Error: ${error.message}`));
        }
        
        console.log(chalk.yellow('═'.repeat(30)));
        console.log('');
        this.rl.prompt();
    }
}

// Start the interactive AI agent
console.log(chalk.blue('🚀 Starting TokenMetrics AI Agent...'));

const agent = new TokenMetricsAIAgent();
agent.start().catch(error => {
    console.error(chalk.red('Failed to start AI agent:'), error);
    process.exit(1);
}); 
#!/usr/bin/env node

/**
 * Simple HTTP server for TokenMetrics UI testing
 * Serves the real-test-interface.html file for browser-based testing
 */

import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 8080;

const server = createServer((req, res) => {
    // Set CORS headers for development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    try {
        let filePath;
        let contentType;

        if (req.url === '/' || req.url === '/index.html') {
            filePath = join(__dirname, 'real-test-interface.html');
            contentType = 'text/html';
        } else if (req.url === '/real-agent-bridge.js') {
            filePath = join(__dirname, 'real-agent-bridge.js');
            contentType = 'application/javascript';
        } else if (req.url === '/agent-bridge.js') {
            filePath = join(__dirname, 'agent-bridge.js');
            contentType = 'application/javascript';
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }

        const content = readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);

    } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error');
    }
});

server.listen(PORT, () => {
    console.log(`🌐 TokenMetrics UI Test Server running at:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`   http://localhost:${PORT}/index.html`);
    console.log('');
    console.log('📋 Available endpoints:');
    console.log('   / or /index.html - Main test interface');
    console.log('   /real-agent-bridge.js - Real agent bridge module');
    console.log('   /agent-bridge.js - Agent bridge module');
    console.log('');
    console.log('🔧 To test:');
    console.log('   1. Open http://localhost:' + PORT + ' in your browser');
    console.log('   2. Ensure your .env file has TOKENMETRICS_API_KEY set');
    console.log('   3. Test real API calls through the interface');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down TokenMetrics UI test server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
}); 
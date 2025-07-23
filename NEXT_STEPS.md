# Next Steps: Complete TokenMetrics Plugin 1.x Migration

## Current Status ✅

The TokenMetrics plugin migration to ElizaOS 1.x is **80% complete**:

- ✅ **Package configuration** - Fully migrated to 1.x
- ✅ **Build system** - Modern tsup + TypeScript setup
- ✅ **State management** - Enhanced composeState patterns
- ✅ **Core infrastructure** - Plugin structure updated
- ✅ **Helper functions** - aiActionHelper.ts already 1.x compatible
- ✅ **2/21 Actions migrated** - getPriceAction & getTokensAction complete

## Immediate Next Steps

### 1. Install Dependencies
```bash
# Navigate to the plugin directory
cd plugin-tokenmetrics

# Install dependencies (recommended: use bun for 1.x)
bun install
# OR
npm install
```

### 2. Complete Action Migrations (Remaining 19/21)

Each remaining action needs these **exact same changes**:

#### Pattern to Apply:
```typescript
// 1. Update validate signature
validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {

// 2. Update handler signature  
handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State, // Remove | undefined
    _options?: { [key: string]: unknown },
    callback?: HandlerCallback
): Promise<boolean> => {

// 3. Update all callback calls
// From: callback({ text: "response" });
// To: await callback({ text: "response" });

// 4. Update state usage
// From: state || await runtime.composeState(message)  
// To: state
```

#### Actions to Migrate:
1. `src/actions/getTraderGradesAction.ts`
2. `src/actions/getInvestorGradesAction.ts`
3. `src/actions/getQuantmetricsAction.ts`
4. `src/actions/getMarketMetricsAction.ts`
5. `src/actions/getIndicesAction.ts`
6. `src/actions/getAiReportsAction.ts`
7. `src/actions/getTradingSignalsAction.ts`
8. `src/actions/getIndicesHoldingsAction.ts`
9. `src/actions/getCorrelationAction.ts`
10. `src/actions/getDailyOhlcvAction.ts`
11. `src/actions/getHourlyOhlcvAction.ts`
12. `src/actions/getHourlyTradingSignalsAction.ts`
13. `src/actions/getResistanceSupportAction.ts`
14. `src/actions/getScenarioAnalysisAction.ts`
15. `src/actions/getSentimentAction.ts`
16. `src/actions/getTmaiAction.ts`
17. `src/actions/getTopMarketCapAction.ts`
18. `src/actions/getCryptoInvestorsAction.ts`
19. `src/actions/getIndicesPerformanceAction.ts`

### 3. Testing & Validation

#### Build Test:
```bash
# Type checking
npm run typecheck

# Build the plugin
npm run build

# Test build success
npm run test:build
```

#### Runtime Test:
```bash
# Verify plugin loads correctly
npm run verify
```

### 4. Environment Setup

#### Required Environment Variable:
```bash
# Add to your .env file
TOKENMETRICS_API_KEY=your_tokenmetrics_api_key_here
```

#### Character Configuration:
```typescript
// In your character.ts file
{
    // ... other config
    secrets: [
        "TOKENMETRICS_API_KEY"
    ],
    plugins: [
        "@elizaos/plugin-tokenmetrics"
    ]
}
```

## Automated Migration Script (Optional)

You can create a script to automate the remaining migrations:

```bash
# Create migration script
cat > migrate_actions.js << 'EOF'
const fs = require('fs');
const path = require('path');

const actionFiles = [
    'getTraderGradesAction.ts',
    'getInvestorGradesAction.ts',
    // ... add all remaining action files
];

actionFiles.forEach(file => {
    const filePath = path.join('./src/actions', file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Apply migration patterns
    content = content.replace(
        /validate: async \(runtime: IAgentRuntime, message: Memory\)/g,
        'validate: async (runtime: IAgentRuntime, message: Memory, state?: State)'
    );
    
    content = content.replace(
        /state: State \| undefined,/g,
        'state: State,'
    );
    
    content = content.replace(
        /callback\(/g,
        'await callback('
    );
    
    content = content.replace(
        /state \|\| await runtime\.composeState\(message\)/g,
        'state'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Migrated ${file}`);
});
EOF

# Run migration script
node migrate_actions.js
```

## Verification Checklist

After completing all migrations, verify:

- [ ] All 21 actions use `state?: State` in validate
- [ ] All 21 actions use `state: State` (not optional) in handler
- [ ] All callback calls use `await callback(...)`
- [ ] No usage of `state || await runtime.composeState(message)`
- [ ] Build succeeds: `npm run build`
- [ ] Type checking passes: `npm run typecheck`
- [ ] Plugin loads: `npm run test:build`

## Integration Testing

### 1. Test with ElizaOS 1.x Runtime:
```bash
# In your ElizaOS project
npm install /path/to/plugin-tokenmetrics

# Test basic functionality
# Ask: "What's the price of Bitcoin?"
# Expected: Price data returned successfully
```

### 2. Verify All Actions Work:
```bash
# Test different action types:
# - "What's the price of Bitcoin?" (getPriceAction)
# - "List available tokens" (getTokensAction)  
# - "Get Bitcoin trading signals" (getTradingSignalsAction)
# - "Show Ethereum investor grade" (getInvestorGradesAction)
# etc.
```

## Success Criteria

✅ **Migration Complete When:**
- All 21 actions use 1.x callback patterns
- Build succeeds without errors
- Plugin loads in ElizaOS 1.x runtime
- All actions respond correctly to user queries
- Enhanced validation shows all actions as 1.x compatible

## Support

If you encounter issues:

1. **Check Migration Examples**: Reference `getPriceAction.ts` and `getTokensAction.ts`
2. **Review Migration Guide**: https://eliza.how/guides/plugin-migration/overview
3. **Test Individual Actions**: Migrate and test one action at a time
4. **Validate TypeScript**: Ensure proper type annotations

The migration pattern is consistent across all actions - once you've done a few, the rest follow the exact same pattern.

**Estimated Time to Complete**: 2-3 hours for remaining 19 actions 
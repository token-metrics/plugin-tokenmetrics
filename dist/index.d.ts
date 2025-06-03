import { Plugin } from '@elizaos/core';

declare const tokenmetricsPlugin: Plugin;
declare const tokenmetricsTests: {
    name: string;
    tests: {
        name: string;
        fn: (runtime: any) => Promise<boolean>;
    }[];
}[];

export { tokenmetricsPlugin as default, tokenmetricsPlugin, tokenmetricsTests };

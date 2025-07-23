import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    sourcemap: true,
    clean: true,
    format: ["esm"], // ESNext module format
    external: [
        "@elizaos/core",
        "fs",
        "path",
        "url"
    ],
    tsconfig: "./tsconfig.build.json"
}); 
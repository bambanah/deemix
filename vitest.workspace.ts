import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
    "./deezer-sdk/vitest.config.ts",
    "./webui/vitest.config.ts",
    "./deemix/vitest.config.ts",
    "./cli/vitest.config.ts",
    "./gui/vitest.config.ts",
]);

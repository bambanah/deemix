import { defineConfig } from "tsup";

// The Docker image and the pkg-compiled binaries both run the bundle without a
// node_modules tree, so the runtime dependencies must be bundled in.
export default defineConfig({
	entry: ["src/main.ts"],
	format: "cjs",
	noExternal: ["commander", "deemix", "deezer-sdk"],
});

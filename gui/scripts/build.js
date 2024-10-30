import * as esbuild from "esbuild";
import fsp from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import url from "node:url";
import { getArg, hasArg, log } from "./utils.js";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main(argv) {
	const IS_WATCH = hasArg(argv, "--watch");
	const BUILD_MODE = getArg(argv, "--mode") || "development";
	const MAIN_DIR = path.resolve(__dirname, "../");
	const DIST_DIR = path.resolve(MAIN_DIR, "dist");
	const WEBUI_DIR = path.resolve(MAIN_DIR, "../webui");

	// Clear the dist folder
	console.log("[build] Clear dist dir");
	try {
		await fsp.rm(DIST_DIR, { recursive: true });
		await fsp.mkdir(DIST_DIR, { recursive: true });
	} catch (error) {
		console.log("[build] Clear dist error", error.message);
	}

	// Copy Web static resources
	if (BUILD_MODE == "production" || BUILD_MODE == "prerelease") {
		// Copy Web static resources
		console.log("[build] Copy web static dist");
		await fsp.cp(
			path.resolve(WEBUI_DIR, "dist/public"),
			path.resolve(DIST_DIR, "public"),
			{ recursive: true }
		);
	}

	// Build main and preload
	console.log("[build] Build 'main' and 'preload'");
	await Promise.all([
		(async () => {
			/**
			 * @type {import('esbuild').BuildOptions}
			 */
			const options = {
				inject: ["./scripts/cjs-shim.js"],
				entryPoints: ["./src/main.ts"],
				bundle: true,
				platform: "node",
				outfile: "./dist/main.js",
				target: "esnext",
				format: "esm",
				external: ["electron", "lightningcss"],
				define: {
					"process.env.NODE_ENV": JSON.stringify(BUILD_MODE),
					"process.env.GUI_VERSION": JSON.stringify(packageJson.version),
				},
				loader: {
					".node": "copy",
					".png": "file",
				},
				plugins: [log],
			};

			if (IS_WATCH) {
				await esbuild.context(options).then((ctx) => ctx.watch());
			} else {
				await esbuild.build(options);
			}
		})(),
		(async () => {
			/**
			 * @type {import('esbuild').BuildOptions}
			 */
			const options = {
				entryPoints: ["./src/preload.ts"],
				bundle: true,
				platform: "browser",
				outfile: "./dist/preload.js",
				target: "es2017",
				format: "iife",
				external: ["electron"],
				sourcemap: true,
				plugins: [log],
			};

			if (IS_WATCH) {
				await esbuild.context(options).then((ctx) => ctx.watch());
			} else {
				await esbuild.build(options);
			}
		})(),
	]);

	console.log("[build] Complete.");
}

await main(process.argv);

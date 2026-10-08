import vue from "@vitejs/plugin-vue";
import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";
import svgLoader from "vite-svg-loader";

// Auto-syncs route segments: router/index.ts → index.html "var known" (for base-path detection).
// Single source of truth. Build fails on invalid route syntax.
function routeSegmentsPlugin(): Plugin {
	return {
		name: "route-segments",
		transformIndexHtml(html) {
			const routerPath = fileURLToPath(
				new URL("src/client/router/index.ts", import.meta.url),
			);
			const source = readFileSync(routerPath, "utf-8")
				.split("\n")
				.filter((line) => !line.trim().startsWith("//"))
				.join("\n");

			const allPathCount = (source.match(/\bpath\s*:/g) ?? []).length;
			const stringPathCount = (source.match(/\bpath\s*:\s*"/g) ?? []).length;
			if (stringPathCount === 0) {
				throw new Error(
					`route-segments: no route paths found in ${routerPath}`,
				);
			}
			if (allPathCount !== stringPathCount) {
				throw new Error(
					`route-segments: found ${allPathCount} "path:" occurrences in ${routerPath}, but only ${stringPathCount} double-quoted string literals - a route path uses unsupported syntax (single quotes, template literal, or a variable)`,
				);
			}

			const segments = new Set<string>();
			for (const match of source.matchAll(/\bpath\s*:\s*"([^"]+)"/g)) {
				if (match[1] !== "/") {
					const firstSegment = match[1].split("/")[1];
					if (firstSegment) segments.add(firstSegment);
				}
			}
			if (segments.size === 0) {
				throw new Error(
					`route-segments: no non-root route segments found in ${routerPath}`,
				);
			}

			const updated = html.replace(
				/var known = \[[^\]]*\]/,
				() => `var known = ${JSON.stringify([...segments])}`,
			);
			if (updated === html) {
				throw new Error(
					"route-segments: no 'var known = [...]' placeholder found in index.html",
				);
			}
			return updated;
		},
	};
}

// https://vitejs.dev/config/
export default defineConfig({
	base: "./",
	build: {
		outDir: "dist/public",
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("src/client", import.meta.url)),
		},
	},
	plugins: [vue(), svgLoader(), routeSegmentsPlugin()],
	server: { hmr: { port: 3001 } },
});

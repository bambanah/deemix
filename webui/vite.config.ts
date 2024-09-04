import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: "./src/client/dist",
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src/client", import.meta.url)),
		},
	},
	plugins: [vue(), svgLoader()],
	server: { hmr: { port: 3001 } },
});

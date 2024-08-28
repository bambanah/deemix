import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue2 from "@vitejs/plugin-vue2";
import vue2Jsx from "@vitejs/plugin-vue2-jsx";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue2(), vue2Jsx()],
	resolve: {
		alias: {
			"@/": fileURLToPath(new URL("./src/", import.meta.url)),
			"@/components": fileURLToPath(
				new URL("./src/components/", import.meta.url)
			),
		},
	},
});

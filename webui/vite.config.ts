import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		minify: false,
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			vue: "@vue/compat",
		},
	},
	plugins: [
		vue({
			template: {
				compilerOptions: {
					compatConfig: {
						MODE: 3,
					},
				},
			},
		}),
		svgLoader(),
	],
});

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import alias from "@rollup/plugin-alias";
import analyze from "rollup-plugin-analyzer";
import vue from "rollup-plugin-vue";
import svg from "rollup-plugin-svg";
import postcss from "rollup-plugin-postcss";

import { version } from "./package.json";

const isProduction = !process.env.ROLLUP_WATCH;
process.env.NODE_ENV = isProduction ? "production" : "development";

export default {
	input: "src/app.js",
	output: [
		{
			file: isProduction ? "public/js/bundle.temp.js" : "public/js/bundle.js",
			format: "module",
			sourcemap: !isProduction,
		},
	],
	plugins: [
		alias({
			entries: [
				{
					find: "vue",
					replacement: "vue/dist/vue.esm",
				},
				{
					find: "@",
					replacement: __dirname + "/src",
				},
				{
					find: "@components",
					replacement: __dirname + "/src/components",
				},
			],
		}),
		// Needed for Vue imports
		replace({
			preventAssignment: true,
			values: {
				"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
				__VER__: JSON.stringify(version),
			},
		}),
		resolve(), // Tells Rollup how to find imported modules in node_modules
		commonjs(), // Converts imported modules to ES modules, if necessary
		svg(),
		vue(),
		postcss(),
		isProduction && analyze({ summaryOnly: true, limit: 15 }), // Show useful information about bundles, only in production
	],
};

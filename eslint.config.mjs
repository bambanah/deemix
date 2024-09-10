import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";
import tslint from "typescript-eslint";

export default tslint.config(
	// ...tslint.configs.recommended,
	...pluginVue.configs["flat/recommended"],
	{
		files: ["webui/**/*"],
		plugins: {
			"typescript-eslint": tslint.plugin,
		},
		languageOptions: {
			parserOptions: {
				parser: tslint.parser,
				tsconfigRootDir: "./webui",
				sourceType: "module",
			},
		},
		rules: {
			"vue/no-v-html": "off",
			"vue/require-explicit-emits": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"no-console": ["error", { allow: ["warn", "error"] }],
		},
	},
	{
		ignores: ["**/node_modules/", "**/dist/"],
	},
	eslintConfigPrettier
);

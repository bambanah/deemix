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
			"vue/multi-word-component-names": "off",
			"vue/no-v-html": "off",
			"vue/no-deprecated-events-api": "off",
			"vue/no-deprecated-functional-template": "off",
			"vue/no-deprecated-dollar-listeners-api": "off",
			"vue/require-explicit-emits": "off",
			"@typescript-eslint/no-explicit-any": "off",
		},
	},
	{
		ignores: ["**/node_modules/", "**/dist/"],
	},
	eslintConfigPrettier
);

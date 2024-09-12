// @ts-check
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tslint from "typescript-eslint";

const extraFileExtensions = [".vue"];

export default tslint.config(
	eslint.configs.recommended,
	...tslint.configs.recommended,
	{
		files: ["**/*.ts"],
		languageOptions: {
			parserOptions: {
				parser: tslint.parser,
				extraFileExtensions,
			},
		},
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"no-console": ["error", { allow: ["warn", "error", "trace"] }],
		},
	},
	{ ignores: ["**/node_modules/", "**/dist/"] },
	eslintConfigPrettier
);

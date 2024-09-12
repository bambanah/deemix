// @ts-check
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tslint from "typescript-eslint";

export default tslint.config(
	eslint.configs.recommended,
	...tslint.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"no-console": ["error", { allow: ["warn", "error", "trace"] }],
		},
	},
	{ ignores: ["node_modules/", "dist/"] },
	eslintConfigPrettier
);

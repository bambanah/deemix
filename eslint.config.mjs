import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
	...pluginVue.configs["flat/recommended"],
	{
		rules: {
			"vue/multi-word-component-names": "off",
			"vue/no-v-html": "off",
			"vue/no-deprecated-events-api": "off",
			"vue/no-deprecated-functional-template": "off",
			"vue/no-deprecated-dollar-listeners-api": "off",
			"vue/require-explicit-emits": "off",
		},
	},
	{
		ignores: ["**/node_modules/", "**/dist/", "webui/public/js/"],
	},
	eslintConfigPrettier,
];

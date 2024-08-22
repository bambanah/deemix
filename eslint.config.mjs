import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
  ...pluginVue.configs["flat/base"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },

    rules: {},
  },
];

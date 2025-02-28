// @ts-check
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import vuePlugin from "eslint-plugin-vue";
import globals from "globals";
import * as tseslint from "typescript-eslint";

const extraFileExtensions = [".vue"];
const compat = new FlatCompat();

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...compat.config(vuePlugin.configs.recommended),
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        files: ["**/*.ts", "**/*.vue"],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                extraFileExtensions,
            },
        },
    },
    {
        files: ["webui/**/*"],
        rules: {
            "vue/no-v-html": "off",
            "vue/require-explicit-emits": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "no-console": ["error", { allow: ["warn", "error", "trace"] }],
        },
    },
    {
        files: ["deemix/**/*", "deezer-sdk/**/*"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "no-console": ["error", { allow: ["warn", "error", "trace"] }],
        },
    },
    { ignores: ["**/node_modules/", "**/dist/"] },
    prettier
);

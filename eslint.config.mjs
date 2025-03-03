// @ts-check
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import { parser as tsParser } from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const extraFileExtensions = [".vue"];
const compat = new FlatCompat();

export default [
    js.configs.recommended,
    {
        files: ['**/*.{ts,tsx,mts,cts}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaVersion: 'latest',
                sourceType: 'module'
            },
            globals: {
                ...globals.node,
                ...globals.browser
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': ['warn', {
                allowExpressions: true,
                allowTypedFunctionExpressions: true
            }],
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }],
            '@typescript-eslint/consistent-type-imports': ['error', {
                prefer: 'type-imports',
                fixStyle: 'inline-type-imports'
            }],
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/strict-boolean-expressions': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'warn',
            'no-alert': 'error',
            'no-duplicate-imports': 'error',
            'no-template-curly-in-string': 'error',
            'no-promise-executor-return': 'error',
            'no-unsafe-optional-chaining': 'error',
            'require-atomic-updates': 'error',
            'array-callback-return': 'error',
            'no-await-in-loop': 'warn',
            'no-constant-binary-expression': 'error',
            'no-constructor-return': 'error',
            'no-unmodified-loop-condition': 'error',
            'no-unreachable-loop': 'error',
            'no-unused-private-class-members': 'error',
            'no-use-before-define': ['error', {
                functions: false,
                classes: true,
                variables: true
            }],
            'prefer-const': 'error',
            'prefer-template': 'error',
            'prefer-destructuring': ['error', {
                array: true,
                object: true
            }],
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
            'object-shorthand': 'error',
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            'no-script-url': 'error',
            'no-param-reassign': 'error'
        }
    },
    {
        files: ['**/*.vue'],
        plugins: {
            vue: await import('eslint-plugin-vue')
        },
        rules: {
            'vue/component-api-style': ['error', ['script-setup']],
            'vue/component-name-in-template-casing': ['error', 'PascalCase'],
            'vue/define-macros-order': 'error',
            'vue/html-button-has-type': 'error',
            'vue/no-empty-component-block': 'error',
            'vue/no-ref-object-destructure': 'error',
            'vue/no-required-prop-with-default': 'error',
            'vue/no-unused-refs': 'error',
            'vue/no-useless-v-bind': 'error',
            'vue/prefer-separate-static-class': 'error',
            'vue/prefer-true-attribute-shorthand': 'error'
        }
    },
    {
        files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-explicit-any': 'off'
        }
    },
    prettier
];

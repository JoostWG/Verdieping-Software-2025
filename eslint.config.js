import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import typescript from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    ...typescript.configs.recommended,
    {
        ...react.configs.flat.recommended,
        ...react.configs.flat['jsx-runtime'], // Required for React 17+
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unescaped-entities': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
    {
        ignores: ['vendor', 'node_modules', 'public', 'bootstrap/ssr', 'tailwind.config.js'],
    },
    prettier, // Turn off all rules that might conflict with Prettier
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            js,
            stylistic,
        },
        languageOptions: {
            parser: typescript.parser,
            parserOptions: {
                project: './tsconfig.json', // make sure this path is correct
            },
        },
        rules: {
            // JS
            'prefer-template': 'warn',
            'arrow-body-style': 'warn',
            'object-shorthand': 'warn',
            'no-else-return': 'warn',
            'no-param-reassign': 'warn',
            'require-unicode-regexp': 'warn',
            'func-style': ['error', 'declaration'],
            'no-console': ['warn', { allow: ['error', 'warn', 'debug', 'info'] }],
            // Below is all disabled
            'default-case': 'warn',
            'sort-keys': 'off',
            'new-cap': 'off',
            'max-classes-per-file': 'off',
            'sort-imports': 'off',
            'one-var': 'off',
            'id-length': 'off',
            'no-await-in-loop': 'off',
            'prefer-named-capture-group': 'off',
            'no-duplicate-imports': 'off',
            'no-ternary': 'off',
            'no-continue': 'off',
            'max-statements': 'off',
            'camelcase': 'off',
            'no-undefined': 'off',
            'max-lines': 'off',
            'max-lines-per-function': 'off',
            'no-plusplus': 'off',
            'capitalized-comments': 'off',
            'no-nested-ternary': 'off',
            'no-warning-comments': 'off',
            'no-inline-comments': 'off',
            'no-void': 'off',

            // TS
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/prefer-nullish-coalescing': 'warn',
            '@typescript-eslint/member-ordering': 'warn',
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/no-unsafe-return': 'error',
            // '@typescript-eslint/naming-convention': [
            //     'warn',
            //     { selector: ['typeLike'], format: ['PascalCase'] },
            //     { selector: ['enumMember'], format: ['PascalCase', 'camelCase'] },
            //     { selector: ['typeProperty', 'parameterProperty', 'objectLiteralProperty'], format: ['PascalCase', 'camelCase', 'snake_case'] },
            //     { selector: ['variableLike', 'method', 'property', 'memberLike'], format: ['PascalCase', 'camelCase'], filter: { regex: '^_$', match: false } },
            // ],
            '@typescript-eslint/explicit-member-accessibility': 'error',
            '@typescript-eslint/prefer-regexp-exec': 'warn',
            '@typescript-eslint/prefer-optional-chain': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'error',
            // Below is all
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-unsafe-type-assertion': 'off',
            '@typescript-eslint/non-nullable-type-assertion-style': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/no-magic-numbers': 'off',
            '@typescript-eslint/prefer-readonly-parameter-types': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/prefer-readonly': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-extraneous-class': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/return-await': 'off',
            '@typescript-eslint/class-methods-use-this': 'off',
            '@typescript-eslint/await-thenable': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/consistent-return': 'off',
            '@typescript-eslint/init-declarations': 'off',
            '@typescript-eslint/require-await': 'off',

            // Things prettier doesn' cover
            'stylistic/lines-between-class-members': ['warn', {
                enforce: [
                    { prev: '*', next: 'method', blankLine: 'always' },
                    { prev: 'method', next: '*', blankLine: 'always' },
                    { prev: 'field', next: 'field', blankLine: 'never' },
                ],
            }],
        },
    },
];

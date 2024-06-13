/**
 * @type {import('@typescript-eslint/utils').ESLint.ConfigData}
 */

import lintParser from "@typescript-eslint/parser";
import n8nBasePlugin from "eslint-plugin-n8n-nodes-base";


const config = [
    {
    
    languageOptions: {
        parser: lintParser,
        parserOptions: {
            project: ['./tsconfig.json'],
            sourceType: 'module',
            extraFileExtensions: ['.json'],
        },
    },



    ignores: ['eslint.config.mjs', '**/*.js', '**/node_modules/**', '**/dist/**', ".history/**"],
},
{
    files: ['package.json'],
    plugins: {
        'eslint-plugin-n8n-nodes-base': n8nBasePlugin
    },
    rules: {
        'n8n-nodes-base/community-package-json-name-still-default': 'off',
    },
},
{
    files: ['./credentials/**/*.ts'],
    plugins: {
        'eslint-plugin-n8n-nodes-base': n8nBasePlugin
    },
    rules: {
        'n8n-nodes-base/cred-class-field-documentation-url-missing': 'off',
        'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
    },
},
{
    files: ['./nodes/**/*.ts'],
    plugins: {
        'eslint-plugin-n8n-nodes-base': n8nBasePlugin
    },
    rules: {
        'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'off',
        'n8n-nodes-base/node-resource-description-filename-against-convention': 'off',
        'n8n-nodes-base/node-param-fixed-collection-type-unsorted-items': 'off',
    },
},
];

export default config;
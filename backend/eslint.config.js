import js from '@eslint/js';
import nodePlugin from 'eslint-plugin-node';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      node: nodePlugin,
    },
    rules: {
      // Disable some rules that might be too strict for Node.js
      'no-unused-vars': 'warn',
      'no-console': 'off',
      // Node.js specific rules
      'node/no-missing-import': 'error',
      'node/no-unsupported-features/es-syntax': 'off', // Allow ES modules
    },
  },
  {
    ignores: ['node_modules/**', 'database.sqlite'],
  },
];

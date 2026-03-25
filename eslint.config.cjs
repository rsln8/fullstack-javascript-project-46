const js = require('@eslint/js');
const globals = require('globals');
const jestPlugin = require('eslint-plugin-jest');

module.exports = [
  js.configs.recommended,
  {
    ignores: ['node_modules/', 'coverage/', '__tests__/__fixtures__/', '**/*.json'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'no-console': 'off',
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
    },
  },
  {
    files: ['__tests__/**/*.js'],
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
  },
];
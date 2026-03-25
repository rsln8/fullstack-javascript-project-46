const js = require('@eslint/js')
const globals = require('globals')
const stylistic = require('@stylistic/eslint-plugin')
const jestPlugin = require('eslint-plugin-jest')

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
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'no-console': 'off',

      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
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
]
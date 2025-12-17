const { defineConfig } = require("eslint/config");
const js = require("@eslint/js");

module.exports = defineConfig([
  {
    ignores: ["node_modules/", "coverage/", "__tests__/__fixtures__/", "**/*.json"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...require("globals").node,  // Глобальные переменные Node.js
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-console": "off",
    },
  },
  {
    files: ["__tests__/**/*.js"],  // Отдельная конфигурация для тестов
    languageOptions: {
      globals: {
        ...require("globals").jest,  // Добавляем глобальные переменные Jest
      },
    },
  },
]);

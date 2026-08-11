/** @type {import("prettier").Config} */
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'always',

  plugins: ['@trivago/prettier-plugin-sort-imports'],

  importOrder: [
    '^node:(.*)$',
    '<BUILTIN_MODULES>',

    '<THIRD_PARTY_MODULES>',

    '^src/(.*)$',
    '^@/(.*)$',

    '^\\.\\./(.*)$',

    '^\\./(?!index)(.*)$',

    '^\\./index$',
  ],

  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
};

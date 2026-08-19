const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const importPlugin = require('eslint-plugin-import');
const unusedImports = require('eslint-plugin-unused-imports');
const promisePlugin = require('eslint-plugin-promise');
const globals = require('globals');

module.exports = [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.ts'],

    languageOptions: {
      parser: tseslint.parser,

      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },

      globals: {
        ...globals.node,
      },
    },

    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
      promise: promisePlugin,
    },

    rules: {
      /*
       |--------------------------------------------------------------------------
       | Typescript
       |--------------------------------------------------------------------------
       */

      '@typescript-eslint/no-explicit-any': 'off',

      '@typescript-eslint/no-unused-vars': 'off',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],

      /*
       |--------------------------------------------------------------------------
       | Imports
       |--------------------------------------------------------------------------
       */

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],

          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'no-duplicate-imports': 'error',

      /*
       |--------------------------------------------------------------------------
       | Unused Imports
       |--------------------------------------------------------------------------
       */

      'unused-imports/no-unused-imports': 'error',

      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      /*
       |--------------------------------------------------------------------------
       | Promise Handling
       |--------------------------------------------------------------------------
       */

      'promise/always-return': 'error',

      'promise/no-return-wrap': 'error',

      'promise/param-names': 'error',

      'promise/catch-or-return': 'error',

      /*
       |--------------------------------------------------------------------------
       | General
       |--------------------------------------------------------------------------
       */

      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

      eqeqeq: ['error', 'always'],

      curly: ['error', 'all'],

      'no-var': 'error',

      'prefer-const': 'error',

      'object-shorthand': 'error',
    },
  },

  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'uploads/**',
      'coverage/**',
      '*.config.js',
      '*.config.cjs',
      '*.config.mjs',
    ],
  },
];

import prettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

const perfectionistImportRule = [
  'error',
  {
    groups: [
      'type',
      'builtin',
      'external',
      'internal',
      ['parent', 'sibling', 'index'],
      'object',
      'unknown',
    ],
    internalPattern: ['^@/'],
    newlinesBetween: 'always',
    order: 'asc',
    type: 'natural',
  },
];

export default [
  // 0) Global ignores – keep ESLint focused on src/
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.output/**',
      '**/.nuxt/**',
      // blanket exclude everything then re-include src
      '**/*',
      '!src/**',
    ],
  },

  // 1) TS baseline
  ...tseslint.configs.recommended,

  // 2) Vue baseline
  ...vue.configs['flat/recommended'],

  // 3) Vue files
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser, // TS inside <script> / <script setup>
      },
    },
    plugins: { perfectionist },
    rules: {
      'vue/valid-v-slot': 'off',
      'perfectionist/sort-imports': perfectionistImportRule,
      'perfectionist/sort-exports': [
        'error',
        { order: 'asc', type: 'natural' },
      ],
      'perfectionist/sort-objects': [
        'warn',
        {
          order: 'asc',
          type: 'natural',
          partitionByComment: 'perfectionist:group',
        },
      ],

      'vue/component-tags-order': [
        'error',
        { order: ['template', 'script', 'style'] },
      ],
      'vue/script-setup-uses-vars': 'error',
      'vue/multi-word-component-names': 'off',
    },
  },

  // 4) Non-.vue TS/JS
  {
    files: ['src/**/*.{js,ts,jsx,tsx}'],
    plugins: { perfectionist },
    rules: {
      'perfectionist/sort-imports': perfectionistImportRule,
      'perfectionist/sort-exports': [
        'error',
        { order: 'asc', type: 'natural' },
      ],
      'perfectionist/sort-objects': [
        'warn',
        {
          order: 'asc',
          type: 'natural',
          partitionByComment: 'perfectionist:group',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  },

  // 5) Prettier last
  prettier,
];

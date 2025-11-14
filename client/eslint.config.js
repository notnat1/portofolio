import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['dist', 'eslint.config.js', 'postcss.config.js', 'tailwind.config.js', 'vite.config.ts'],
  },
  // Base ESLint recommended rules for all files
  js.configs.recommended,

  // TypeScript ESLint recommended rules (moved to top level)
  ...tseslint.configs.recommended,

  // Configuration for TypeScript files (specific overrides and plugins)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser, // Specify parser for TypeScript
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
        project: './tsconfig.app.json', // Important for type-aware linting
      },
    },
    // Add React Hooks rules
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Explicitly configure no-unused-expressions for TypeScript
      'no-unused-expressions': 'off', // Disable base ESLint rule
      '@typescript-eslint/no-unused-expressions': ['error', {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      }],
    },
  },
]
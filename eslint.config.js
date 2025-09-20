const globals = require('globals');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const pluginReact = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const prettierConfig = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    ignores: ['node_modules', '.expo', 'build', 'dist', '*.log'],
  },
  // Global recommended configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // --- Config for JS files (e.g., config files) ---
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // --- Config for TypeScript files (React Native) ---
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser, // for React Native environment
      },
    },
    plugins: {
      'react': pluginReact,
      'react-hooks': reactHooks,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // --- Prettier config (must be last) ---
  prettierConfig,
);
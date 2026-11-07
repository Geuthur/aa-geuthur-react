import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import importHeadingsRule from './eslint-rules/import-headings.js'

const importHeadingsPlugin = {
  rules: {
    'import-headings': importHeadingsRule,
  },
}

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    plugins: {
      'import-headings': importHeadingsPlugin,
    },
    rules: {
      'import-headings/import-headings': [
        'error',
        {
          groups: [
            // 1. React & Core-Frameworks
            { heading: '// React', pattern: '^react($|/)|^react-dom($|/)|^react-router' },

            // 2. Third Party
            { heading: '// Third Party', pattern: '^@?\\w' },

            // 3. This package
            { heading: '// AA Geuthur React', pattern: '^@/(?!.*\\.s?css$)' },

            // 4. Stylesheets
            { heading: '// Styles', pattern: '\\.s?css$' },
          ],
        },
      ],
    },
    languageOptions: {
      globals: globals.browser,
    },
  },
])

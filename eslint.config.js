import js from '@eslint/js';
import globals from 'globals';
import vue from 'eslint-plugin-vue';

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.husky/**', 'radiobrowser_stations_latest.json.gz']
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['server/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ['client/**/*.js', 'client/**/*.vue'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    }
  }
];

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  ignorePatterns: ['node_modules'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react'],
  overrides: [
    {
      files: ['.eslintrc.{js,cjs}', 'bin/**/*.{js,cjs,mjs}'],
      env: {
        node: true,
      },
      parser: 'espree',
      parserOptions: {
        sourceType: 'module',
      },
    },
    {
      files: ['src/**/*.ts'],
      extends: ['plugin:@typescript-eslint/recommended'],
    },
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};

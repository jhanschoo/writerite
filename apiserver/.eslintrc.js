module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    // "plugin:jsdoc/recommended",
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.lint.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['jsdoc', 'jest', '@typescript-eslint'],
  ignorePatterns: ['generated/'],
  settings: {
    jsdoc: {
      mode: 'typescript',
    },
  },
};

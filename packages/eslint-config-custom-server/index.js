module.exports = {
  env: {
    node: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    // "plugin:jsdoc/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["jsdoc", "jest", "@typescript-eslint"],
  settings: {
    jsdoc: {
      mode: "typescript",
    },
  },
  overrides: [
    {
      files: ["**/__tests__/**/*"],
      env: {
        jest: true,
      },
    },
  ],
};

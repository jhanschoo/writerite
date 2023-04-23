module.exports = {
  extends: [
    "prettier",
    "mantine",
    "next/core-web-vitals",
    "turbo",
    "plugin:jest/recommended",
    "plugin:storybook/recommended",
  ],
  plugins: ["testing-library", "jest"],
  // settings: {
  //   react: {
  //     version: "detect",
  //   },
  // },
  overrides: [
    {
      files: ["**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
  // parser: "@typescript-eslint/parser",
  // parserOptions: {
  //   babelOptions: {
  //     presets: [require.resolve("next/babel")],
  //   },
  // },
  // rules: {
  //   "react/react-in-jsx-scope": "off",
  //   "import/extensions": [1, { "pattern": { "@*": "never" } }]
  // }
};

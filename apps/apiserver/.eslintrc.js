module.exports = {
  root: true,
  extends: ['custom-server'],
  parserOptions: {
    project: ['./apps/apiserver/tsconfig.json'],
  },
  ignorePatterns: ["prettier.config.js", ".eslintrc.js"]
};

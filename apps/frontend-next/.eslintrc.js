module.exports = {
  root: true,
  extends: ['custom'],
  parserOptions: {
    project: ['./apps/frontend-next/tsconfig.json'],
  },
  ignorePatterns: ["generated/**/*", ".eslintrc.js"]
};

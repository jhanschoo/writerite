module.exports = {
  root: true,
  extends: ['custom'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  ignorePatterns: ['generated/**/*', '.eslintrc.js'],
};

module.exports = {
  root: true,
  extends: ['custom-server'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  ignorePatterns: ['prettier.config.js', '.eslintrc.js'],
};

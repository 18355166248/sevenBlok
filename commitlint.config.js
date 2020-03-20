module.exports = {
  extends: ["@commitlint/config-conventional"],
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
};

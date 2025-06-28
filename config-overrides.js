// config-overrides.js
module.exports = function override(config, env) {
  config.module.rules = config.module.rules.map(rule => {
    if (
      rule.use &&
      rule.use.some(u => u.loader && u.loader.includes('source-map-loader'))
    ) {
      return { ...rule, exclude: /node_modules\/firebase/ };
    }
    return rule;
  });
  return config;
};

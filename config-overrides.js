const webpack = require('webpack');

module.exports = function override(config) {
  // Remove the fallback property to fix invalid configuration error
  // You may need to find alternative ways to polyfill these modules if required

  // Remove fallback property completely
  if (config.resolve && config.resolve.fallback) {
    delete config.resolve.fallback;
  }

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    })
  ];

  return config;
};

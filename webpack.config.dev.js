const path = require('path');
const { merge } = require('webpack-merge');
const config = require('./webpack.config');

module.exports = merge(config, {
  mode: 'development',

  devtool: 'inline-source-map',

  output: {
    path: path.resolve(__dirname, 'dist')
  },

  devServer: {
    // Proxy used if you have a separate API backend development server.
    //   proxy: { '/api': 'http://localhost:3000' },
    hot: true,
    client: {
      overlay: {
        warnings: true,
        errors: true,
      },
      progress: true,
      reconnect: 5,
    },
    devMiddleware: {
      writeToDisk: true,
    },
  },

});

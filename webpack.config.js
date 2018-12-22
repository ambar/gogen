const path = require('path')

/**
 * https://webpack.js.org/configuration/
 */
module.exports = {
  target: 'node',
  mode: 'production',
  devtool: false,
  entry: './lib',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs',
  },
  resolve: {
    alias: require('./alias'),
  },
}

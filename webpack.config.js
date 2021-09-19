const path = require('path')

/**
 * @type {import('webpack').Configuration}
 * @see https://webpack.js.org/configuration/
 */
module.exports = {
  target: 'node',
  mode: 'production',
  devtool: process.env.SOURCE_MAP ? 'source-map' : false,
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

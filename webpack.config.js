const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },

  devServer: {
    contentBase: './dist'
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Weather Stats'
    }),
    new CopyPlugin([
      { from: 'data', to: 'data' }
    ])
  ]
};
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  entry: './src/app.js',
  module: {
    loaders: [{
      test: /\.tpl$/,
      use: ['ejs-loader']
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: 'css-loader'
      })
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      use: ['file-loader']
    }, {
      test: /\.(jpg|png)$/,
      use: ['file-loader']
    }]
  },
  devtool: 'sourcemap',
  output: {
    path: path.resolve('.', 'public'),
    filename: 'coog-bench.js'
  },
  plugins: [
    new ExtractTextPlugin('coog-bench.css'),
  ]
};

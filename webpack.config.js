var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  entry: './src/app.js',
  module: {
    loaders: [{
      test: /\.tpl$/,
      loader: 'ejs-loader'
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
    }, ]
  },
  output: {
    path: './public',
    filename: 'coog-bench.js'
  },
  plugins: [
    new ExtractTextPlugin('coog-bench.css', {
      allChunks: true
    })
  ]
};

var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  entry: './src/app.js',
  externals: {
    'jquery': '$',
    'moment': 'moment',
    'underscore': '_',
    'backbone': 'Backbone',
    'backbone.marionette': 'Backbone.Marionette',
    'tryton-session': 'Session'
  },
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
    path: './dist',
    filename: 'js/coog-bench.js'
  },
  plugins: [
    new ExtractTextPlugin('css/coog-bench.css', {
      allChunks: true
    })
  ]
};

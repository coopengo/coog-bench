module.exports = {
  entry: './src/index.js',
  externals: {
    'jquery': '$',
    'underscore': '_',
    'backbone': 'Backbone',
    'moment': 'moment',
    'tryton-session': 'Session'
  },
  module: {
    loaders: [{
      test: /\.tpl/,
      loader: 'ejs-loader'
    }]
  },
  output: {
    path: './dist/js',
    filename: 'coog-bench.js'
  }
};

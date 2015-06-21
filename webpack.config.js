'use strict';

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    path: './public',
    filename: 'index.js',
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          optional: ['runtime', 'es7.asyncFunctions', 'es7.objectRestSpread'],
        },
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          [
            'css-loader?modules&localIdentName=[local]---[hash:hex:5]',
            'postcss-loader',
            'sass-loader?outputStyle=expanded'
          ].join('!')
        ),
      },
    ],
  },

  postcss: [
    require('autoprefixer-core'),
  ],

  plugins: [
    new ExtractTextPlugin('index.css', { allChunks: true }),
  ],
};

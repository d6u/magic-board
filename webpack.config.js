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
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          [
            'css-loader?localIdentName=[local]__[hash:base64:5]',
            'postcss-loader',
            'sass-loader?outputStyle=expanded'
          ].join('!')
        ),
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          optional: ['runtime', 'es7.asyncFunctions'],
        },
      },
    ],
  },

  postcss: [
    require('autoprefixer-core'),
    require('postcss-local-scope'),
  ],

  plugins: [
    new ExtractTextPlugin('index.css', { allChunks: true }),
  ],
};

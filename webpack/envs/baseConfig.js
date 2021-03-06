// @ts-check

const path = require('path')
const webpack = require('webpack')
const helpers = require('../utils/webpackHelpers')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const { NODE_ENV, PORT } = process.env
const rootDir = process.cwd()

const baseConfig = {
  mode: NODE_ENV,
  devtool: 'cheap-module-source-map',
  context: rootDir,
  entry: {
    webpack: ['webpack-hot-middleware/client?reload=true'],
    ...helpers.getEntrypoints(),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(rootDir, 'public/assets'),
    publicPath: '/assets/',
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gif|svg|jpg|png)$/,
        loader: 'file-loader',
      },
      {
        test: /\.coffee$/,
        include: /src/,
        loader: 'coffee-loader',
      },
      {
        test: /\.(jade|pug)$/,
        include: /src/,
        loader: 'pug-loader',
        options: {
          doctype: 'html',
          root: rootDir,
        },
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: /src/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              cacheDirectory: '.cache',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`[Ervell] Listening on http://localhost:${PORT} \n`],
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
      },
    }),
    // Ignore moment locales
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      jade: 'jade/runtime.js',
      waypoints: 'jquery-waypoints/waypoints.js',
    }),
  ],
  resolve: {
    alias: {
      Images: path.join(rootDir, 'public', 'images'),
    },
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.jade',
      '.coffee',
      '.mjs',
    ],
    modules: ['node_modules'],
    symlinks: false,
  },
  externals: {
    request: 'request',
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      cacheGroups: {
        runtimeChunk: 'single',
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
        },
        default: {
          name: 'common',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
}

module.exports = baseConfig

const path = require('path');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'debug'),
    publicPath: '/',
    host: '0.0.0.0',
    port: 9091
  },

  entry: [
    'webpack-dev-server/client?http://localhost:9091',
    'webpack/hot/only-dev-server',

    './index.js'
  ],

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },

  context: path.resolve(__dirname, 'src'),
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  externals: {},
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: 'babel-loader'
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }, {
        test: /\.(jpg|png|gif|ttf|otf)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'img/[name].[ext]'
          },
        }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_PRODUCTION: JSON.stringify(false),
    }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new LodashModuleReplacementPlugin,
    new webpack.ProvidePlugin({}),
  ]
};

const path = require('path');
const webpack = require('webpack');
const ProgressPlugin = webpack.ProgressPlugin;
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const template = path.join(process.cwd(), 'public/index.html');

module.exports = {
  mode: 'development',
  devtool: 'cheap-source-map',
  entry: {
    app: path.join(__dirname, 'src/app.jsx'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  devServer: {
    disableHostCheck: true,
    publicPath: '/',
    contentBase: path.join(process.cwd(), 'dist'),
    hot: true,
    port: 8080,
    host: '0.0.0.0',
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['cache-loader', 'babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new ProgressPlugin(),
    new HtmlWebpackPlugin({
      template,
    }),
    new HotModuleReplacementPlugin(),
    // new CopyWebpackPlugin([
    //   {
    //     from: './public',
    //     to: './assets',
    //     toType: 'dir',
    //     ignore: ['.DS_Store', 'index.html'],
    //   },
    // ]),
  ],
};

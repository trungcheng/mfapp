const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    port: 3002,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    hot: true
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
  },
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react', '@babel/preset-typescript'],
        },
      },
      {
        test: /\.png$/,
        use: {
          loader: 'url-loader',
          options: { limit: 8192 },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
    }),
    new ModuleFederationPlugin({
      name: 'react_app',
      filename: 'remoteEntry.js',
      exposes: {
        ReactAppLoader: './src/loader.ts',
      },
      shared: {
        react: {
          eager: true,
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
      },
    }),
  ],
};

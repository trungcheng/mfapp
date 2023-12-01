const { ModuleFederationPlugin } = require("webpack").container;

/** @type {import('webpack').Configuration} */
module.exports = {
  output: {
    publicPath: "auto",
    uniqueName: "angular_app",
    scriptType: "text/javascript",
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  optimization: {
    runtimeChunk: false,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "angular_app",
      filename: "remoteEntry.js",
      exposes: {
        AngularAppLoader: "./src/app/loader.ts",
      },
      shared: {
        "@angular/core": { eager: true, singleton: true },
        "@angular/common": { eager: true, singleton: true },
        "@angular/router": { eager: true, singleton: true },
        "@angular/common/http": { eager: true, singleton: true },
      },
    }),
  ],
  devServer: {
    // this is to remove the error "ws://localhost:4200/ws failed" in the console when we disable live reload
    // also this solve websocket proxy issue in local
    webSocketServer: false,
  },
};

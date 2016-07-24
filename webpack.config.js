var path = require('path');

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "./dist/bundle.js"
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".js"]
  },

  module: {

    loaders: [
      { test: /\.ts$/, loader: "ts-loader" }
    ],

    preLoaders: [
      { test: /\.js$/, loader: "source-map-loader" }
    ]

  }
};

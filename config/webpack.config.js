"use strict";

const path = require("path");

module.exports = {
  entry: "./index.js",
  mode: "production",
  context: path.resolve(__dirname),
  watch: true,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "pathOrUrlWhenProductionBuild"
  },
  module: {
    rules: [
      {
        test: /(\.css$)|(\.scss$)/,
        loader: "style-loader!css-loader!sass-loader"
      }
    ]
  },
  resolve: {},
  devtool: "source-map",
  plugins: []
};

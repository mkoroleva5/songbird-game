const path = require("path");
const { HotModuleReplacementPlugin } = require("webpack");

const defaultUrls = [];

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "../dist"),
    },
    allowedHosts: "auto",
    open: true,
    compress: true,
    port: 3000,
    hot: true,
    proxy: {
      context: defaultUrls.map((iteUrl) => `/${iteUrl}`),
      "/api": {
        target: "http://localhost:3000",
        pathRewrite: { "^/api": "" },
      },
    },
  },
  plugins: [new HotModuleReplacementPlugin()],
};

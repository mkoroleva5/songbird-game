const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FriendlyWebpackPlugin = require("@soda/friendly-errors-webpack-plugin");
const isProd = process.env.NODE_ENV === "production";

const fileName = ["index"];

module.exports = {
  context: path.resolve(__dirname, "../src"),
  entry: fileName.reduce((config, page) => {
    config[page] = `./${page}.js`;
    return config;
  }, {}),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/[name].[contenthash].js",
    assetModuleFilename: (pathData) => {
      const filePath = path
        .dirname(pathData.filename)
        .split("/")
        .slice(1)
        .join("/");
      return `${filePath}/[name][ext]`;
    },
    clean: {
      keep: /\.git/,
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "../src") },
    extensions: [".ts", ".js", ".json", ".css", ".scss"],
  },
  plugins: [].concat(
    fileName.map(
      (file) =>
        new HtmlWebpackPlugin({
          inject: "head",
          template: `./${file}.html`,
          filename: `./${file}.html`,
          chunks: [file],
          minify: {
            html5: true,
          },
        })
        ,
        new MiniCssExtractPlugin({
          filename: 'main.css'
        })
    ),
    [
      new FriendlyWebpackPlugin({
        logLevel: "silent",
      }),
    ]
  ),
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: ["html-loader"],
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico|mp3)$/i,
        type: isProd ? "asset" : "asset/resource",
        generator: {
          filename: "assets/img/[name][hash][ext][query]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/font/[name].[ext]",
        },
      },
    ],
  },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [path.join(__dirname, "../webpack.config.js")],
    },
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  }
};

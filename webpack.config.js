const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

// Export a function to access the mode
module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  const config = {
    // mode is set via CLI flag, no need for it here
    entry: {
      background: "./src/background.ts",
      content: "./src/content.ts",
      popup: "./src/popup.js",
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: "manifest.json", to: "." },
          { from: "src/popup.html", to: "." }, // Add popup.html
        ],
      }),
      new Dotenv(),
    ],
    // Set devtool based on mode for CSP compatibility
    devtool: isDevelopment ? "cheap-module-source-map" : false,
  };

  return config;
};

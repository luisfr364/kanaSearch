import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path, { resolve } from "path";

const __dirname = import.meta.dirname;

const configs = {
  entry: {
    content: "./src/content.js",
    popupScript: "./src/scripts/popupScript.js",
    optionsScript: "./src/scripts/optionsScript.js",
    tesseractWorker: "./src/utils/tesseractWorker.js",
    background: "./src/background.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve("./dist"),
  },
  resolve: {
    extensions: [".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.css$/, // For CropperJS CSS
        use: ["style-loader", "css-loader"],
      },
      {
        test: /worker\.js$/,
        use: { loader: "worker-loader" },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/popup.html", // Your HTML template
      filename: "popup.html",
      chunks: ["popupScript"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/options.html", // Your HTML template
      filename: "options.html",
      chunks: ["optionsScript"],
    }),
    // Copy static assets
    new CopyPlugin({
      patterns: [
        {
          from: "./manifest.json",
          to: "./manifest.json",
        },
        {
          from: "./src/styles",
          to: "./styles",
        },
        {
          from: "./src/assets",
          to: "./assets",
        },
        {
          from: "./src/data",
          to: "./data",
        },
      ],
    }),
  ],
  mode: "production",
};

export default configs;

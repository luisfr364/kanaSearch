import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path, { resolve } from "path";

const __dirname = import.meta.dirname;

const configs = {
  entry: {
    content: "./src/content.js",
    popupScript: "./src/scripts/popupScript.js",
    optionsScript: "./src/scripts/optionsScript.js",
  }, // Your content script as the entry point
  output: {
    filename: "[name].bundle.js", // The bundled output file
    path: path.resolve("./dist"), // Output directory
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
    new CopyPlugin({
      patterns: [
        {
          from: "./manifest.json",
          to: "./manifest.json",
        },
        {
          from: "./src/background.js",
          to: "./background.js",
        },
        {
          from: "./src/styles",
          to: "./styles",
        },
        {
          from: "./src/assets",
          to: "./assets",
        },
      ],
    }),
  ],
  mode: "production",
};

export default configs;

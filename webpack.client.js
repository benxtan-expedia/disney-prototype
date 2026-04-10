//const path = require('path');
//const LoadablePlugin = require('@loadable/webpack-plugin');

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import LoadablePlugin from '@loadable/webpack-plugin';

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//module.exports = {
export default {
  mode: 'development',
  entry: './src/entry-client.tsx',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist/public'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: '/static/',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        // For CSS Modules (which you are using for the carousel), 
        // you need to enable the 'modules' option
        use: [
          "style-loader",
          "css-loader"
        ],
      },
      {
        test: /\.(svg|png|jpe?g|gif|webp|avif)$/i,
        type: 'asset/resource', // This emits a separate file and exports the URL
        generator: {
          filename: 'img/[name][ext]' // Organizes them in a folder
        }
      }
    ],
  },
  plugins: [
    new LoadablePlugin(),
  ],
};

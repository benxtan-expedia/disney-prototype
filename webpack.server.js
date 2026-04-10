import path from 'node:path';
import nodeExternals from 'webpack-node-externals';
import { fileURLToPath } from 'node:url';

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//module.exports = {
export default {
  mode: 'development',
  entry: './src/server/index.ts',
  target: 'node',
  experiments: {
    outputModule: true, // This is the magic switch
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
    chunkFormat: 'module', // Ensures chunks use 'import'
    library: {
      type: 'module',
    },
  },
  // Ensure externals don't use 'require'
  externalsPresets: { node: true },
  externals: [nodeExternals({ importType: 'module' })],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@server': path.resolve(__dirname, 'src/server'),
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
          {
            loader: "css-loader",
            options: {
              modules: true, // Set to true if using .module.css
            },
          },
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
};

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    popup: path.resolve('src/extension/popup/index.tsx'),
    options: path.resolve('src/extension/options/index.tsx'),
    background: path.resolve('src/extension/background/index.ts'),
    content: path.resolve('src/extension/content/index.ts'),
    report: path.resolve('src/extension/report/index.tsx')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/')
    }
  },
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'dist/extension'),
    clean: {
      keep: /icons\//  // 保留 icons 目录
    }
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/extension/manifest.json'),
          to: path.resolve('dist/extension/manifest.json'),
        },
        {
          from: path.resolve('src/extension/report/styles'),
          to: path.resolve('dist/extension/report/styles'),
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('src/extension/popup/index.html'),
      filename: 'popup/index.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('src/extension/options/index.html'),
      filename: 'options/index.html',
      chunks: ['options']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('src/extension/report/report.html'),
      filename: 'report/report.html',
      chunks: ['report']
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  }
};

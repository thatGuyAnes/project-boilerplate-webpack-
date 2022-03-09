const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const DEVELOPMENT = process.env.NODE.ENV === 'dev';

const dir = {
  app: path.join(__dirname, 'app'),
  assets: path.join(__dirname, 'assets'),
  images: path.join(__dirname, 'images'),
  styles: path.join(__dirname, 'styles'),
  nodes: 'node_modules',
};

module.exports = {
  entry: {
    index: path.join(dir.app, 'index.js'),
  },

  resolve: {
    modules: [dir.app, dir.images, dir.styles, dir.nodes],
  },

  plugins: [
    new CleanWebpackPlugin(),

    new webpack.DefinePlugin({
      DEVELOPMENT
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: './assets',
          to: '',
        },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),

    new HtmlWebpackPlugin(
      {
        filename: 'index.html',
        inject: true,
        chunks: ['index'],
      }
    )
  ],

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'scss-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|svg|gif|webp|fnt|woff2?)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(glsl|frag|vert)$/,
        type: 'asset/resource',
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/,
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
      // new TerserPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
            ],
          },
        },
      }),
    ],
  },
};

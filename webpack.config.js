const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugins = require('eslint-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    vue: './src/main.ts',
    test: './examples/test.ts'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@type': path.resolve(__dirname, 'typescript')
    }
  },
  devServer: {
    hot: true
  },
  output: {
    filename: '[name].js',
    clean: true,
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: path.resolve(__dirname, 'public', 'index.html')
    }),
    new ESLintPlugins({ extensions: ['ts', 'js'], fix: true })
  ]
}

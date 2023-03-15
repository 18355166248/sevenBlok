# 模块热替换 ( HMR )

<Card theme="#fbedb7" color="#8c8466">HMR 不适用于生产环境，这意味着它应当只在开发环境使用。更多详细信息，请查看生产环境构建指南。</Card>

## 启用 HMR

<Card theme="#DCF2FD" font-size="16px" color="#618ca0">如果你使用了 webpack-dev-middleware 而没有使用 webpack-dev-server，请使用 webpack-hot-middleware package 包，以在你的自定义服务或应用程序上启用 HMR。
</Card>

#### webpack.config.js

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    app: './src/index.js',
    print: './src/print.js'
    app: './src/index.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Hot Module Replacement'
    }),
    new webpack.NamedModulesPlugin(), // 以便更容易查看要修补(patch)的依赖
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

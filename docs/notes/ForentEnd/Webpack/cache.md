# 缓存

## 1. 输出文件的文件名

#### - 项目架构

```json
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
|- /node_modules
```

#### - webpack.config.js

```js {14}
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Caching'
    })
  ],
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

::: warning
如果不做修改，文件名可能会变，也可能不会
:::

## 2. 提取模板/模块标识符

将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，是比较推荐的做法
这是因为，它们很少像本地的源代码那样频繁修改
因此通过实现以上步骤，利用客户端的长效缓存机制，可以通过命中缓存来消除请求，并减少向服务器获取资源，同时还能保证客户端代码和服务器端代码版本一致。
这可以通过使用新的 entry(入口) 起点，以及再额外配置一个 CommonsChunkPlugin 实例的组合方式来实现

#### - webpack.config.js

```js
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: ['lodash']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ExtractTextPlugin({
      filename: getPath => {
        return getPath('css/[name]-[id].css').replace('css/js', 'css')
      },
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      title: '输出页面'
    }),
    new webpack.HashedModuleIdsPlugin(), // 解决vendor 文件后面的hash的 变化
    // new webpack.NamedModulesPlugin(), // 这个在打包的时候不要传  不然 vendors后面的hash值会同步,而不是缓存
    // new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    splitChunks: {
      // chunks: 'all', // 这表示将选择哪些块进行优化。当提供一个字符串，有效值为
      // all，async和initial。提供all可以特别强大，因为这意味着即使在异步和非异步块之间也可以共享块。
      minSize: 30000, // 要生成的块的最小大小（以字节为单位）
      maxSize: 0,
      minChunks: 1, // 分割前必须共享模块的最小块数
      maxAsyncRequests: 5, // 按需加载时的最大并行请求数
      maxInitialRequests: 3, // 入口点处的最大并行请求数
      automaticNameDelimiter: '~', // 允许您指定用于生成的名称的分隔符
      name: true, // 拆分块的名称。提供true将根据块和缓存组密钥自动生成名称。
      cacheGroups: {
        // 缓存组可以继承和/或覆盖任何选项splitChunks
        // default: {
        //   chunks: 'initial',
        //   minChunks: 2
        // },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendor',
          // filename: '[name].bundle.js',  // 写死文件名
          priority: 10,
          enforce: true // 讲述的WebPack忽略splitChunks.minSize，splitChunks.minChunks，
          // splitChunks.maxAsyncRequests和splitChunks.maxInitialRequests选项，只为这个高速缓存组创建块。
        }
      }
    }
  }
}
```

::: warning
1. 缓存打包的时候 new webpack.NamedModulesPlugin() 不用使用
2. vendor后面的hash每次打包都会变化, 使用 webpack.HashedModuleIdsPlugin() 解决
:::

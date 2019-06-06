# 代码分离

三种代码分离的方法:

- 入口起点：使用 entry 配置手动地分离代码。
- 防止重复：使用 [CommonsChunkPlugin](https://www.webpackjs.com/plugins/commons-chunk-plugin/) 去重和分离 chunk。
- 动态导入：通过模块的内联函数调用来分离代码。

## 1. 入口起点(entry points)

存在的问题:

- 如果入口 chunks 之间包含重复的模块，那些重复模块都会被引入到各个 bundle 中。
- 这种方法不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码。

<card-primary theme="#DCF2FD" font-size="16px" color="#618ca0">
以上两点中，第一点对我们的示例来说无疑是个问题，因为之前我们在 ./src/index.js 中也引入过 lodash，这样就在两个 bundle 中造成重复引用。接着，我们通过使用 CommonsChunkPlugin 来移除重复的模块。
</card-primary>

## 2. 防止重复

#### - webpack.config.js

```js
const path = require('path')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Code Splitting'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common' // 指定公共 bundle 的名称。
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

## 3. 动态导入

### 1. 使用符合 ECMAScript 提案 的 import() 语法

### 2. 使用 webpack 特定的 require.ensure

#### webpack.config.js

```js
output: {
  filename: '[name].bundle.js',
  chunkFilename: '[name].bundle.js',
  path: path.resolve(__dirname, 'dist')
}
```

`这里使用了 chunkFilename，它决定非入口 chunk 的名称`

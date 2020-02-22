# 管理输出

## 1. 设定 HtmlWebpackPlugin 处理 html

`npm install --save-dev html-webpack-plugin`

#### webpack-config.js

```js
  const path = require('path')
+ const HtmlWebpackPlugin = require('html-webpack-plugin')

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
+   plugins: [
+     new HtmlWebpackPlugin({
+       title: 'Output Management'
+     })
+   ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  }
```

[HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin) 会默认生成 index.html 文件. 会把 output 打包的文件自动添加到 html 中

## 2. 清理 /dist 文件夹 [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)

`npm install clean-webpack-plugin --save-dev`
::: warning
注意 clean-webpack-plugin 在 webpack 中使用的方法是错误的 请使用下面方法去调用
:::

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

plugins: [new CleanWebpackPlugin()]
```

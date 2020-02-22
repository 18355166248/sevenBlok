# 开发

## 1. 使用 source map

我们使用 inline-source-map 选项，这有助于解释说明我们的目的（仅解释说明，不要用于生产环境）

#### webpack-config.js

```js {6}
module.exports = {
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  devtool: 'inline-source-map'
}
```

## 2. 选择一个开发工具

webpack 提供了几个代码变化后自动编译代码的功能:

1. webpack's Watch Mode
2. webpack-dev-server
3. webpack-dev-middleware

多数场景中，你可能需要使用 webpack-dev-server

- 使用观察者模式 缺点就是需要刷新浏览器

```json
"scripts": {
  "watch": "webpack --watch"
}
```

- 使用 webpack-dev-server

`npm install --save-dev webpack-dev-server`

#### webpack-config.js

```js {2}
module.exports = {
  devServer: {
    contentBase: './dist'
  }
}
```

#### package.json

```json
"start": "webpack-dev-server --open"
```

- 使用 webpack-dev-middleware

> webpack-dev-middleware 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)

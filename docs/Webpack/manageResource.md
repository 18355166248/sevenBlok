# 管理资源

## 1. 加载 css

为了从 JavaScript 模块中 import 一个 CSS 文件，你需要在 module 配置中 安装并添加 style-loader 和 css-loader：

`npm install --save-dev style-loader css-loader`

#### webpack.config.js

```js
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: [
+           'style-loader',
+           'css-loader'
+         ]
+       }
+     ]
+   }
  };
```

## 2. css分离
<card-primary theme="red" font-size="20px" color="#fff">qasdadasdasdasdas</card-primary>


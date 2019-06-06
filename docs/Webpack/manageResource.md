# 管理资源

## 1. 加载 css

为了从 javascript 模块中 import 一个 CSS 文件，你需要在 module 配置中 安装并添加 style-loader 和 css-loader：

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

## 2. css 分离

<card-primary theme="#DCF2FD" font-size="16px" color="#618ca0">请注意，在多数情况下，你也可以进行 CSS 分离，以便在生产环境中节省加载时间。最重要的是，现有的 loader 可以支持任何你可以想到的 CSS 处理器风格 - postcss, sass 和 less 等。</card-primary>

- #### 安装

`npm install --save-dev extract-text-webpack-plugin@next 兼容wepack4.0`

- #### 用法

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },
  plugins: [new ExtractTextPlugin('styles.css')]
}
```

- #### 多个实例

> 如果有多于一个 ExtractTextPlugin 示例的情形，请使用此方法每个实例上的 extract 方法。

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// 创建多个实例
const extractCSS = new ExtractTextPlugin('stylesheets/[name]-one.css')
const extractLESS = new ExtractTextPlugin('stylesheets/[name]-two.css')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractCSS.extract(['css-loader', 'postcss-loader'])
      },
      {
        test: /\.less$/i,
        use: extractLESS.extract(['css-loader', 'less-loader'])
      }
    ]
  },
  plugins: [extractCSS, extractLESS]
}
```

- #### 提取 Sass 或 LESS

> 配置和上面是相同的，需要时可以将 sass-loader 切换为 less-loader

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css')
    //如果想要传入选项，你可以这样做：
    //new ExtractTextPlugin({
    //  filename: 'style.css'
    //})
  ]
}
```

- #### 修改文件名

> filename 参数可以是 Function。它通过 getPath 来处理格式，如 css/[name].css，并返回真实的文件名，你可以用 css 替换 css/js，你会得到新的路径 css/a.css。

- [name] chunk 的名称
- [id] chunk 的数量
- [contenthash] 根据提取文件的内容生成的 hash

```js
entry: {
  'js/a': "./a"
},
plugins: [
  new ExtractTextPlugin({
    filename:  (getPath) => {
      return getPath('css/[name]-[id].css').replace('css/js', 'css');
    },
    allChunks: true
  })
]
```

## 3. 加载图片

使用 file-loader 粗粒图标和图片

`npm install --save-dev file-loader`

#### webpack.config.js

```js
const path = require('path')

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
+       {
+         test: /\.(png|svg|jpg|gif)$/,
+         use: [
+           'file-loader'
+         ]
+       }
      ]
    }
  }
```

<card-primary theme="#DCF2FD" font-size="16px" color="#618ca0">
  压缩和优化你的图像。查看 [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader) 和 [url-loader](https://www.webpackjs.com/loaders/url-loader/)，以了解更多关于如果增强加载处理图片功能。
</card-primary>

## 4. 加载字体, json 文件, CSV, TSV 和 XML

使用 file-loader 和 url-loader 可以处理任何类型的文件, 包括字体
CSV、TSV 和 XML，你可以使用 csv-loader 和 xml-loader

`npm install --save-dev csv-loader xml-loader`

#### webpack.config.js

```js {26}
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        },
+       {
+         test: /\.(woff|woff2|eot|ttf|otf)$/,
+         use: [
+           'file-loader'
+         ]
+       },
+       {
+         test: /\.(csv|tsv)$/,
+         use: [
+           'csv-loader'
+         ]
+       },
+       {
+         test: /\.xml$/,
+         use: [
+           'xml-loader'
+         ]
+       }
      ]
    }
  };
```

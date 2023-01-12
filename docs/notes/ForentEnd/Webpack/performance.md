# 打包优化

这里使用供应链项目做优化

首先我们先安装 webpack 打包优化分析工具，这里我们推荐 webpack-bundle-analyzer

```ts
# NPM
npm install --save-dev webpack-bundle-analyzer
# Yarn
yarn add -D webpack-bundle-analyzer
```

<card-primary>
 <div>首先供应链项目第一次打包的体积是 187.3 MB 共 282 个项目
  js 的体积是 171.7 MB，共 164 个项目
  css 的体积是 15.5 MB，共 111 个项目
  打包时间6m</div>
</card-primary>

1.  @xmly/xm-all-address 地址数据库优化

我们搜索 js 文件夹下关键词 北京市, 发现有 35 个文件中存在, 也就是有 35 个文件中存在使用

![](@public/webpack/address-data.png)

我们先针对数据依赖库 @xmly/xm-all-address 优化

我们修改 webpack 的配置

```js
webpackConfig.optimization.splitChunks = {
  ...webpackConfig.optimization.splitChunks,
  ...{
    chunks: "all",
    name: true,
+   cacheGroups: {
+     "xm-all-address": {
+       test: /[\\/]node_modules[\\/](\@xmly\/xm-all-address)[\\/]/,
+       name: "xm-all-address",
+       chunks: "all",
+     },
+    },
  },
};
```

<card-primary>
<div>首先供应链项目第一次打包的体积是 189.2 MB 共 284 个项目
js 的体积是 173.8 MB，共 166 个项目
css 的体积是 15.5 MB，共 111 个项目</div>
</card-primary>

2. @xmly/xm-uploader 优化后

<card-primary>
<div>201 MB 共 284 个项目</div>
</card-primary>

3. react react-dom 优化后

<card-primary>
<div>203.6 MB 共 289 个项目
Done in 265.39s.</div>
</card-primary>

```js
{
  antd: {
    test: /[\\/]node_modules[\\/](antd|rc-tree|rc-picker)[\\/]/,
    name: 'antd',
    chunks: 'all',
  },
}
```

<card-primary>
<div>149.7 MB，共266个项目</div>
</card-primary>

```js
{
  '@ant-design/pro-table': {
    test: /[\\/]node_modules[\\/](\@ant-design\/pro-table|\@ant-design\/pro-field)[\\/]/,
    name: 'antd',
    chunks: 'all',
  },
  jquery: {
    test: /[\\/]node_modules[\\/](jquery)[\\/]/,
    name: 'jquery',
    chunks: 'all',
  },
}
```

<card-primary>
<div>121.7 MB），共 269 个项目</div>
</card-primary>

```js
{
  antd: {
    test: /[\\/]node_modules[\\/](antd|rc-).*[\\/]/,
    name: 'antd',
    chunks: 'all',
  },
  '@ant-design/pro': {
    test: /[\\/]node_modules[\\/](\@ant-design\/pro-).*[\\/]/,
    name: 'ant-design/pro',
    chunks: 'all',
  },
}
```

<card-primary>
<div>66.9 MB，共256个项目</div>
</card-primary>

```js
{
  jquery: {
    test: /[\\/]node_modules[\\/](jquery|jquery\/dist)[\\/]/,
    name: 'jquery',
    chunks: 'all',
  },
  '@xmly/xm-webuploader': {
    test: /[\\/]node_modules[\\/](\@xmly\/xm-webuploader|\@xmly\/xm-webuploader\/dist)[\\/]/,
    name: 'xm-webuploader',
    chunks: 'all',
  },
}
```

4. Dllplugin 优化

##### 尝试:

配置路径别名,解决重复打包的问题
根据各方的查找说解决这个重复打包的问题只需要 配置一个路径别名。就会强制引入同一个路径的文件，按道理来说也是这样。

```js
// 配置路径别名
config.resolve.alias
  .set("@", resolve("./../src"))
  .set("lib@", resolve("./../src/library"));
```

可是最终却怎么也不行，就算配置了路径别名还是重复打包了依赖。

可以发现他这个插件的引入方式只支持 CommonJS 引入方式，并不支持 es6 module 的引入方式。提到这个就要提提 CommonJS 跟 ES6 module 的模块化的区别了

CommonJs 和 ES6 Module 的区别

<card-primary type="warning">
<div>
  CommonJs导出的是变量的一份拷贝，ES6 Module导出的是变量的绑定（export default 是特殊的）
  CommonJs是单个值导出，ES6 Module可以导出多个
  CommonJs是动态语法可以写在判断里，ES6 Module静态语法只能写在顶层
  CommonJs的 this 是当前模块，ES6 Module的 this 是 undefined
</div>
</card-primary>

所以可以发现 CommonJs 导出的是变量的一份拷贝。这就知道为什么我们配置了路径别名还是会重复打包了，哪里有引入他就会拷贝一份。所以哪里用到了就会打包多少份。

##### 那怎么办?难道没办法了吗？

天无绝人之路，此时其实可以使用 dll 打包方式，将他打包到一个 dll.js 里面。因为 md5 这个库是不怎么变化的。而且都是公用的。

```js
{
  // dll文件中包含的第三方库列表
  jquery: ['jquery'],
  lodash: ['lodash'],
  'react-color': ['react-color'],
}
```

> webpack.dll.config.js

```js
const path = require("path");
const webpack = require("webpack");
const library = "[name]_dll_lib";

module.exports = {
  mode: "development",
  // 入口, 接收多个参数作为多个入口
  entry: {
    // dll文件中包含的第三方库列表
    jquery: ["jquery"],
    lodash: ["lodash"],
    react: ["react", "react-dom", "react-color"],
  },
  output: {
    // 文件名称
    filename: "dll/[name].dll.js",
    // 文件输出目录
    path: path.resolve(__dirname, "dist"),
    // 存放dll文件的全局变量名称，需要注意命名冲突
    library: library,
  },
  plugins: [
    new webpack.DllPlugin({
      // manifest文件中的name属性值, 需与output.library保持一致
      name: library,
      // mainfest文件输出路径和文件名称
      path: path.join(__dirname, "dist", "dll/[name].manifest.json"),
    }),
  ],
};
```

> webpack.config.js

```js
[
  new webpack.DllReferencePlugin({
    manifest: require("./dist/dll/jquery.manifest.json"),
  }),
  new webpack.DllReferencePlugin({
    manifest: require("./dist/dll/lodash.manifest.json"),
  }),
  new webpack.DllReferencePlugin({
    manifest: require("./dist/dll/react.manifest.json"),
  }),
];
```

package.json 中添加打包命令

```js
{
  "scripts": {
    "build:dll": "webpack --config webpack.dll.config.js",
  }
}
```

然后还需要将 dll 资源加载进 html 文件中

```js
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

{
  // 该插件如果不能正常向html中插入文件，可能是未在html-webpack-plugin之后执行或者版本兼容问题
  // 建议看add-asset-html-webpack-plugin的最新说明
  new AddAssetHtmlPlugin({
    // dll文件位置
    glob: path.resolve(__dirname, './dist/dll/*.js'),
    // dll 引用路径
    publicPath: process.env.PUBLIC_URL + '/dll',
    // dll最终输出的目录
    outputPath: './dll',
  }),
}
```

```js
{
  jquery: ['jquery'],
  lodash: ['lodash'],
  react: ['react', 'react-dom', 'react-color'],
}
```

<card-primary>
<div>49.4 MB），共263个项目</div>
</card-primary>

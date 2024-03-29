# 常用 plugin 集合

#### 1. 静态资源拷贝 [CopyWebpackPlugin](https://webpack.js.org/plugins/copy-webpack-plugin/)

另外，如果我们要拷贝一个目录下的很多文件，但是想过滤掉某个或某些文件，那么 `CopyWebpackPlugin` 还为我们提供了 `ignore` 参数。

```javascript
//webpack.config.js
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
  //...
  plugins: [
    new CopyWebpackPlugin(
      [
        {
          from: "public/js/*.js",
          to: path.resolve(__dirname, "dist", "js"),
          flatten: true,
        },
      ],
      {
        ignore: ["other.js"],
      }
    ),
  ],
};
```

##### 2. ProvidePlugin (配置全局变量)

`React` 大家都知道的，使用的时候，要在每个文件中引入 `React`，不然立刻抛错给你看。还有就是 `jquery`, `lodash` 这样的库，可能在多个文件中使用，但是懒得每次都引入，好嘛，一起来偷个懒，修改下 `webpack` 的配置:

```javascript
const webpack = require("webpack");
module.exports = {
  //...
  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
      Component: ["react", "Component"],
      Vue: ["vue/dist/vue.esm.js", "default"],
      $: "jquery",
      _map: ["lodash", "map"],
    }),
  ],
};
```

这样配置之后，你就可以在项目中随心所欲的使用 `$`、`_map`了，并且写 `React` 组件时，也不需要 `import` `React` 和 `Component` 了，如果你想的话，你还可以把 `React` 的 `Hooks` 都配置在这里。

另外呢，`Vue` 的配置后面多了一个 `default`，这是因为 `vue.esm.js` 中使用的是 `export default` 导出的，对于这种，必须要指定 `default`。`React` 使用的是 `module.exports` 导出的，因此不要写 `default`。

###### 另外，就是如果你项目启动了 `eslint` 的话，记得修改下 `eslint` 的配置文件，增加以下配置：

```
{
    "globals": {
        "React": true,
        "Vue": true,
        //....
    }
}
```

##### 3. CSS 文件压缩 optimize-css-assets-webpack-plugin (webpack4 使用)

##### 4. extract-text-webpack-plugin

主要是为了抽离 css 样式,防止将样式打包在 js 中引起页面样式加载错乱的现象。

##### 4. clean-webpack-plugin

自动清理构建目录

还可以用命令方式

```shell
rm -rf  路径
rimraf 路径
```

##### 5. css3 前缀兼容 postcss 插件 autoprefixer

##### 6. 动态 import @balbel/plugin-syntax-dynamic-import

##### 7. webpack 与 eslint 集成 eslint-webpack-plugin

还有过时的 eslint-loader

##### 8. webpack 构建日志展示 friendly-error-webpack-plugin

##### 9. webpack 主动捕获并处理构建的错误

```javascript
{
  plugins: [
    function() {
      this.hooks.done.tap("done", (stats) => {
        if (
          stats.compilation.errors &&
          stats.compilation.errors.length &&
          process.argv.indexOf("--watch") == -1
        ) {
          console.log("build error===>");
          process.exit(1);
        }
      });
    },
  ];
}
```

##### 10. 删除无用的 css purifyCSS [purgecss-webpack-plugin](https://github.com/FullHuman/purgecss/tree/master/packages/purgecss-webpack-plugin)

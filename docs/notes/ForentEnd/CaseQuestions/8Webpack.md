# webpack 面试题

[[toc]]

## 1. tree shaking 原理

- ES6 Module 引入进行静态分析, 故而编译的时候正确判断到底加载了哪些模块
- 静态分析程序流, 判断哪些模块和变量未被使用或者引用, 进行删除无用代码

## 2. babel-polyfill 和 babel-runtime 区别

::: details 点击查看

### babel-polyfill 使用场景

babel 默然只转换新的 Jvascript 语法, 而不转换新的 API. 比如 Iterator, Generator, Set, Maps, Proxy, Reflect, Symbol, Promise 等全局对象.
如果想使用这些新的对象和方法, 需要使用 babel-polyfill, 为当前环境提供一个垫片

### babel-runtime 使用场景

babel 转译后 的代码要实现源代码同样的功能需要借助一些帮助函数, 例如 { [name]: 'javaScript' }, 转译后的代码如下:

```js
"use strict";
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var obj = _defineProperty({}, "name", "JavaScript");
```

类似上面的帮助函数 \_defineProperty 可能会重复出现在一些模块里, 导致编译后的代码体积不断变大. Babel 为了解决这个问题, 提供了单独的报 babel-runtime 宫编译模板复用工具函数.
启用插件 babel-plugin-transform-runtime 后, Babel 就会使用 babel-runtime 下的工具函数, 转译代码如下:

```js
"use strict";
// 之前的 _defineProperty 函数已经作为公共模块 `babel-runtime/helpers/defineProperty` 使用
var _defineProperty2 = require("babel-runtime/helpers/defineProperty");
var _defineProperty3 = _interopRequireDefault(_defineProperty2);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var obj = (0, _defineProperty3.default)({}, "name", "JavaScript");
```

babel-runtime 也是为了做隔离, 将每个需要引入的遍历通过 require 引入, 避免污染全局变量

### 总结

Babel 只是转换 syntax 层语法,所有需要 @babel/polyfill 来处理 API 兼容,又因为 polyfill 体积太大，所以通过 preset 的 useBuiltIns 来实现按需加载,再接着为了满足 npm 组件开发的需要 出现了 @babel/runtime 来做隔离
:::

## 3. loader 和 plugin 的区别

::: details 点击

- Loader 直译为'加载器'. webpack 将一切文件视为模块, 但是 webpack 原生只有解析 js 文件的能力, 如果想将其他文件也解析打包的话, 就要用到 loader, 所以 loader 是为了让 webpack 能够解析打包非 webpack 文件的能力
- Plugin 直译为'插件'. Plugin 可以扩展 webpack 的能力, 让 webpack 更加灵活, webpack 本身在打包节点会暴露出不同的生命周期 API, Plugin 可以监听这些事件, 在合适的时机通过 webpack 提供的 API 多 webpack 的输出结果做出修改
  :::

## 4. webpack 热更新原理，有没有配置过 webpack，自己实现一些插件之类

::: details 点击查看
![](@public/Casequestion/webpackHmr.png)

HMR（Hot Module Replace）热模块替换

参考文档:

- [webpack 热更新原理](https://blog.csdn.net/bigname22/article/details/127362168)

热更新的实现主要是依靠 webpack-dev-server

1. 启动 webpack，生成 compiler 实例，compiler 实例的功能很多，比如用来启动 webpack 的编译工作，监听文件变化等。
2. 使用 Express 启动一个本地服务，使得浏览器可以访问本地服务
3. 启动 websocket 服务，用于浏览器和本地 node 服务进行通讯。

监听文件变化

webpack 监听文件变化主要是通过 webpack-dev-middleware 这个库来完成，它负责本地文件的编译、输出和监听 webpack-dev-middleware 中执行了 compiler.watch 方法，它主要做了两件事情

对本地文件编译打包
编译结束之后，开启监听，文件发生变化时重新编译，并持续进行监听
监听 webpack 编译结束

setupHooks 方法用来注册监听事件，当监听到 webpack 编译结束时，通过 websocket 给浏览器发通知，浏览器拿到 hash 只之后就可以做检查更新逻辑。
:::

## webpack 中 chunkHash 与 contentHash 区别；

::: details 点击查看
hash
所有文件哈希值相同，只要改变内容跟之前的不一致，所有哈希值都改变，没有做到缓存意义
chunkhash
当有多个 chunk，形成多个 bundle 时，如果只有一个 chunk 和一个 bundle 内容变了，其他的 bundle 的 hash 都会发生变化，因为大家都是公用的一个 hash，这个时候 chunkhash 的作用就出来了。它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。
contenthash
在打包的时候我们会在 js 中导入 css 文件，因为他们是同一个入口文件，如果我只改了 js 得代码，但是他的 css 抽取生成 css 文件时候 hash 也会跟着变换。这个时候 contenthash 的作用就出来了。

### 总结

hash 所有文件哈希值相同； chunkhash 根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值； contenthash 计算与文件内容本身相关，主要用在 css 抽取 css 文件时。
:::

## 写过 webpack 的 loader 和 plugin 么

[自己写的 demo](https://github.com/18355166248/webpack-custom-loader-plugin)

::: details 点击

### Loader

执行顺序: 相同优先级的 loader 执行顺序为：从右到左，从下到上

#### 开发 loader

可以使用官方的 [loader-runner](github.com/webpack/loader-runner) 调试自定义 loader

我们看一个简单的 babel-loader

```js
const babel = require("@babel/core");
const schemaJson = require("./scheme.json"); // 这个就是 loader 参数的格式规范 可以通过  schema-utils 做扩展校验 也可以使用 this.getOptions(scheme) 做校验

module.exports = function(content, map, meta) {
  const options = this.getOptions(schemaJson);
  const callback = this.async(); // 异步loader

  babel.transform(content, options, function(err, result) {
    if (err) {
      callback(err); // 报错
      return;
    }
    callback(null, result.code, map, meta); // 传递给下一个 loader
  });
};
```

### Plugin

写 plugin 可以看下官方提供的[钩子](https://www.webpackjs.com/api/compiler-hooks/)
插件就像是一个插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理。

钩子的本质就是：事件 实现是通过 [tapable](https://github.com/webpack/tapable) 实现的

Plugin 构建对象 需要知道两个概念 一个是 Compiler, 另一个是 Compilation

我们看一个简单的自定义 Plugin

```js
class BannerWebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    // 在资源输出之前触发
    compiler.hooks.emit.tap("BannerWebpackPlugin", (compilation) => {
      const extensions = ["js", "css"];
      // 1. 获取即将输出的资源文件: compilation.assets
      // 2. 过滤只保留js和css资源
      const assets = Object.keys(compilation.assets).filter((path) => {
        const splitted = path.split(".");
        const ext = splitted[splitted.length - 1];
        return extensions.includes(ext);
      });
      const prefix = `/*
      * Author: ${this.options.author}
      */`;
      // 3. 遍历资源在顶部添加注释
      assets.forEach((asset) => {
        // 获取代码
        const source = compilation.assets[asset].source();
        // 拼接上注释
        const content = prefix + source;
        // 修改资源
        compilation.assets[asset] = {
          source() {
            return content;
          },
          size() {
            return content.length;
          },
        };
      });
    });
  }
}

module.exports = BannerWebpackPlugin;
```

:::

## webpack 处理 image 是用哪个 loader，限制生成 image 大小的是哪个？

::: details 点击

- file-loader 将文件上的 import / require（）解析为 url，并将该文件发射到输出目录中。
- url-loader 可以识别图片的大小，然后把图片转换成 base64，从而减少代码的体积，如果图片超过设定的现在，就还是用 file-loader 来处理。

提示：给图片配了 url-loader 在配置里面就不要再给图片配 file-loader 了
:::

## webpack 怎么将 多个 css 文件 合并成一个

::: details 点击
使用 [mini-css-extract-plugin](https://webpack.docschina.org/plugins/mini-css-extract-plugin#root)

使用 optimization.splitChunks.cacheGroups 选项，所有的 CSS 可以被提取到一个 CSS 文件中。

webpack.config.js

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          type: "css/mini-extract",
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
```

:::

## webpack 的摇树对 commonjs 和 es6 module 都生效么，原理是？

::: details 点击
webpack4 对 commonjs 不生效
webpack5 对 commonjs 生效

es 的 import 引入是静态引入，commonjs 的 require 引入是动态引入。

原理:

1. 收集模块导出的内容
   （1）ESM 导出语句会转换为 Dependency 对象，记录到 module 对象的 dependencies 集合。

（2）webpack 使用 FlagDependencyExportsPlugin 插件从 entry 入口开始，遍历所有 module 对象，将其 dependencies 集合中的导出值，放入 ModuleGraph 中存储，完成模块导出内容的收集。

2. 标记模块导出的内容
   模块导出信息收集完毕后，Webpack 需要标记出各个模块哪些导出值有被其它模块用到，哪些没有：
   webpack 使用在 FlagDependencyUsagePlugin 插件中，逐步遍历 ModuleGraph 存储的所有 moudle 的导出值，每个导出值会被编译器方法（compilation.getDependencyReferencedExports 方法）所检验，确定其对应是否被其它模块使用，如果被其他模块所使用，将该导出值放入到 webpack 导出对象中（ **webpack_exports**），未被使用的值都不会定义在 **webpack_exports** 对象中，形成一段不可能被执行的 Dead Code 效果。

3. 删除无效代码
   由 Terser、UglifyJS 等 DCE 工具“摇”掉这部分无效代码，构成完整的 Tree Shaking 操作。

#### webpack4 和 webpack5 中 tree shaking 的区别

##### webpack4：

1. Tree Shaking 只支持 ES 模块的使用，不支持 require 这种动态引入模块的方式。

2. 只分析浅层的模块导出与引入关系，进行 dead-code 的去除。

##### webpack5: (尝试过 确实生效了)

1. Webpack 5 中增加了对一些 CommonJS 风格模块代码的静态分析功功能。
   支持 exports.xxx、this.exports.xxx、module.exports.xxx 语法的导出分析。
   支持 object.defineProperty(exports, "xxxx", ...) 语法的导出分析。
   支持 require('xxxx').xxx 语法的导入分析。

2. 支持对嵌套引入模块的依赖分析优化，还增加了分析模块中导出项与导入项的依赖关系的功能。

通过 optimization.innerGraph（生产环境下默认开启）选项，Webpack 5 可以分析特定类型导出项中对导入项的依赖关系，从而找到更多未被使用的导入模块并加以移除

### !!! 注意：确保没有编译器将您的 ES2015 模块语法转换为 CommonJS （这是现在常用的 @babel/preset-env 的默认行为），通常我们配置 js 兼容会有该配置项。

:::

## 为什么 vite、snowpack 可以比 webpack 快那么多？具体原理是

::: details 点击

- webpack 先打包，再启动开发服务器，请求服务器时直接给予打包后的结果；
- vite 直接启动开发服务器，请求哪个模块再对哪个模块进行实时编译；
- 由于现代浏览器本身就支持 ES Modules，会主动发起请求去获取所需文件。vite 充分利用这点，将开 发环境下的模块文件，就作为浏览器要执行的文件，而不是像 webpack 先打包，交给浏览器执行的文件是打包后的；
- 由于 vite 启动的时候不需要打包，也就无需分析模块依赖、编译，所以启动速度非常快。当浏览器请求 需要的模块时，再对模块进行编译，这种按需动态编译的模式，极大缩短了编译时间，当项目越大，文件 越多时，vite 的开发时优势越明显；
- 在 HRM 方面，当某个模块内容改变时，让浏览器去重新请求该模块即可，而不是像 webpack 重新将该模块的所有依赖重新编译；
- 当需要打包到生产环境时，vite 使用传统的 rollup 进行打包，所以，vite 的优势是体现在开发阶 段，另外，由于 vite 使用的是 ES Module，所以代码中不可以使用 CommonJs；

:::

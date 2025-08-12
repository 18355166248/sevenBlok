# webpack 面试题

[[toc]]

## 1. tree shaking 原理

- ES6 Module 引入进行静态分析，编译时正确判断加载的模块
- 静态分析程序流，判断未使用的模块和变量，删除无用代码

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

## 5. webpack 中 chunkHash 与 contentHash 区别

::: details 点击查看

- **hash**：所有文件哈希值相同，内容变化时所有哈希值都改变
- **chunkhash**：根据入口文件生成不同哈希值，只有变化的 chunk 哈希值改变
- **contenthash**：根据文件内容生成哈希值，主要用于 CSS 文件提取

**使用场景**：

- hash：开发环境
- chunkhash：生产环境 JS 文件
- contenthash：生产环境 CSS 文件
  :::

## 6. 写过 webpack 的 loader 和 plugin 么

::: details 点击查看

### Loader 开发

```js
module.exports = function (content, map, meta) {
  const callback = this.async();
  // 处理逻辑
  callback(null, processedContent, map, meta);
};
```

**执行顺序**：从右到左，从下到上

### Plugin 开发

```js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap("MyPlugin", (compilation) => {
      // 处理逻辑
    });
  }
}
```

**核心概念**：Compiler（编译器）、Compilation（构建过程）
:::

## 7. webpack 处理 image 是用哪个 loader

::: details 点击查看

- **file-loader**：将文件解析为 URL，发射到输出目录
- **url-loader**：识别图片大小，小图片转 base64，大图片用 file-loader 处理

**配置注意**：使用 url-loader 时无需再配置 file-loader
:::

## 8. webpack 怎么将多个 CSS 文件合并成一个

::: details 点击查看

使用 `mini-css-extract-plugin` 和 `optimization.splitChunks.cacheGroups`：

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
  plugins: [new MiniCssExtractPlugin()],
};
```

:::

## 9. webpack 的摇树对 commonjs 和 es6 module 都生效么

::: details 点击查看

- **webpack4**：只对 ES6 Module 生效
- **webpack5**：对 CommonJS 和 ES6 Module 都生效

**原理**：

1. 收集模块导出内容
2. 标记被使用的导出
3. 删除无效代码

**注意**：确保 Babel 配置不会将 ES6 Module 转换为 CommonJS
:::

## 10. 为什么 vite、snowpack 可以比 webpack 快那么多

::: details 点击查看

**webpack 方式**：先打包，再启动开发服务器

**vite 方式**：直接启动开发服务器，按需编译模块

**优势**：

- 启动速度快（无需打包）
- 按需编译（请求时编译）
- 利用浏览器 ES Module 支持
- HMR 更高效（只重新请求变化模块）

**生产环境**：vite 使用 rollup 打包，webpack 优势仍在
:::

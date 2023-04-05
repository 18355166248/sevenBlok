---
sidebar: auto
---

# webpack 面试题

## 1. tree shaking 原理

- ES6 Module 引入进行静态分析, 故而编译的时候正确判断到底加载了哪些模块
- 静态分析程序流, 判断哪些模块和变量未被使用或者引用, 进行删除无用代码

## 2. babel-polyfill 和 babel-runtime 区别

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

## loader 和 plugin 的区别

- Loader 直译为'加载器'. webpack 将一切文件视为模块, 但是 webpack 原生只有解析 js 文件的能力, 如果想将其他文件也解析打包的话, 就要用到 loader, 所以 loader 是为了让 webpack 能够解析打包非 webpack 文件的能力
- Plugin 直译为'插件'. Plugin 可以扩展 webpack 的能力, 让 webpack 更加灵活, webpack 本身在打包节点会暴露出不同的生命周期 API, Plugin 可以监听这些事件, 在合适的时机通过 webpack 提供的 API 多 webpack 的输出结果做出修改
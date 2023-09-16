# 学习 Babel

[[toc]]

- [Babel 手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md)

## 用户手册

### 配置 Babel

你或许已经注意到了，目前为止通过运行 Babel 自己我们并没能“翻译”代码，而仅仅是把代码从一处拷贝到了另一处。

这是因为我们还没告诉 Babel 要做什么。

> 由于 Babel 是一个可以用各种花样去使用的通用编译器，因此默认情况下它反而什么都不做。你必须明确地告诉 Babel 应该要做什么。

你可以通过安装 [插件（plugins）](https://babeljs.io/docs/plugins) 或 [预设（presets，也就是一组插件）](https://babeljs.io/docs/presets)来指示 Babel 去做什么事情。

#### [配置文件](https://babeljs.io/docs/config-files)

看官方文档我们可以知道, 配置 babel 文件的方式有好几种

- Project-wide configuration
  +babel.config.\* files, with the following extensions: .json, .js, .cjs, .mjs, .cts.
- File-relative configuration
  - .babelrc.\* files, with the following extensions: .json, .js, .cjs, .mjs, .cts.
  - .babelrc file, with no extension.
  - package.json files, with a "babel" key.

我们这里就以 .babelrc 为例, 首先在项目的根路径下创建 .babelrc 文件

然后在 package.json 中的 scripts 命令中配置

```js
 "scripts": {
    "babel-file": "babel src/Demo -d dist"
  },
```

执行 npm run babel-file 后会在根路径新增 dist 文件夹, 也就是打包结果

### @babel/register

Babel 应用: 利用 @babel/register 实现即时编译（在 Node 环境下使用 import/export ES6 语法

但请注意这种方法并不适合正式产品环境使用。 直接部署用此方式编译的代码不是好的做法。 在部署之前预先编译会更好。 不过用在构建脚本或是其他本地运行的脚本中是非常合适的。

#### [例子( 点击查看源码 )](https://github.com/18355166248/megalo-note/tree/main/packages/Babel/src/babel-register.js)

可以看到项目引入了 1.js, 但是 1.js 内部使用了 ES6 import 语法, import 语法是不能再 node 环境直接使用的, 所以直接报错了, 但是在顶部引入了 @babel/register, 并注册了 presets, 这样就可以正常执行了

### @babel/core

如果你需要以编程的方式来使用 Babel，可以使用 babel-core 这个包。

工具包有很多方法, 具体可看[官网文档](https://babeljs.io/docs/babel-core#transform)
看 API 我们可以大致分为 4 类, 转换字符串代码, 转换文件代码, 通过 ast 转换成代码, 将代码转换成 ast, 每个方法又有三种方法, callback 拿结果, 同步拿结果, promise 拿结果

#### [例子( 点击查看源码 )](https://github.com/18355166248/megalo-note/tree/main/packages/Babel/src/babel-core.js)

看例子可以看到我们通过 @babel/core 可以将代码转化成我们配置的兼容性代码

### @babel/preset-env

最重要的一个功能就是提供不同浏览器支持特性的数据来源

这里也有详细的介绍 [core-js-3-babel](https://github.com/zloirock/core-js/blob/master/docs/zh_CN/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md)

### @babel/preset-react

我们可以解析 react 组件

#### [例子( 点击查看源码 )](https://github.com/18355166248/megalo-note/tree/main/packages/Babel/src/babel-react.js)

### @babel/preset-typescript

我们可以解析 .ts 文件 的 typescript

#### [例子( 点击查看源码 )](https://github.com/18355166248/megalo-note/tree/main/packages/Babel/.babelrc) 下配置了 @babel/preset-typescript

### @babel/standalone

提供了独立构建方式

如果您在生产中使用 Babel，通常不应该使用@Babel/stalone。相反，您应该使用在 Node.js 上运行的构建系统，如 Webpack、Rollup 或 Parcel，提前传输 js。

但是，对于 @babel/standalone 有一些有效的用例：

- 它提供了一种简单、方便的使用 Babel 原型的方法。使用@babel/stalone，您只需在 HTML 中使用一个简单的脚本标记就可以开始使用 babel。
- 实时编译用户提供的 JavaScript 的网站，如 JSFiddle、JSBin、Babel 网站上的 REPL、JSitor 等。
- 直接嵌入 V8 等 JavaScript 引擎并希望使用 Babel 进行编译的应用程序
- 希望使用 JavaScript 作为脚本语言来扩展应用程序本身的应用程序，包括现代 ES 提供的所有好处。
- 其他非 Node.js 环境（ReactJS.NET、ruby babel transpiler、php-babel transpiler 等）。

#### [例子-html](https://github.com/18355166248/megalo-note/tree/main/packages/Babel/html/babel-standlone.html)

### @babel/plugin-transform-runtime

节约打包代码量 用于构建过程的代码转换

### @babel/runtime

节约打包代码量 实际导入项目代码的功能模块

我们可以这么理解, @babel/plugin-transform-runtime 是一个使用工具的人, @babel/runtime 是一个工具, 我们让使用工具的人对代码使用工具

也就是说让 @babel/plugin-transform-runtime 针对代码做转换, 转换后的代码用的就是 @babel/runtime

### @babel/parser

将代码转成 ast, 可以使用 [Ast 工具](https://astexplorer.net/) 做代码分析

### @babel/generator

将 ast 转成代码

#### [例子( 点击查看源码 )](https://github.com/18355166248/megalo-note/tree/main/packages/Babel/src/babel-generator.js)

### @babel/code-frame

针对代码转成代码块, 可以高亮标记

类似

```js
const rawLines = `class Foo {
  constructor() {
    console.log("hello");
  }
}`;

const location = {
  start: { line: 2, column: 17 },
  end: { line: 4, column: 3 },
};

转成如下

  1 | class Foo {
> 2 |   constructor() {
    |                 ^
> 3 |     console.log("hello");
    | ^^^^^^^^^^^^^^^^^^^^^^^^^
> 4 |   }
    | ^^^
  5 | }
```

### @babel/template

babel 模板功能, 支持动态替换字符串

#### [例子( 点击查看源码 )](https://github.com/18355166248/megalo-note/tree/main/packages/Babel/src/babel-template.js)

### @babel/traverse

模块维护整个树状态，并负责替换、删除和添加节点。

```js
import parser from "@babel/parser";
import traverse from "@babel/traverse";

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code);
// 解析 ast
traverse(ast, {
  enter(path) {
    if (path.node.type === "Identifier" && path.node.name === "n") {
      path.node.name = "x";
    }
  },
});
```

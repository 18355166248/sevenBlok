# 前端工程化-Babel

## core-js 是什么

它是 JavaScript 标准库的 polyfill
它尽可能的进行模块化，让你能选择你需要的功能
它可以不污染全局空间
它和 babel 高度集成，可以对 core-js 的引入进行最大程度的优化

以前我们实现 API 的时候，会引入整个 polyfill,其实 polyfill 只是包括了以下两个包

```
core-js
regenerator-runtime
```

你可能听过'babel-polyfill'，babel-polyfill 融合了 core-js 和 regenerator-runtime,因此'babel-polyfill'
本质就是'corejs'

## babel 的含义

1.Babel 也是可以配置和其他工具具有类似的配置：ESLint（`.eslintrc`），Prettier（`.prettierrc`）。
'babel'配置文件的优先级 'babel.config.json < .babelrc < programmatic options from @babel/cli' 2.看一个最简单配置，这里主要弄清楚'预设'和'插件'
{
"presets": [], // 预设
"plugins": [] // 插件
}
3.babel 是 JavaScript 编译器。但开箱即用的 babel 什么也不做。它只会把源文件复制到构建目录去。
要让 babel 做事情，必须配置'plugins（插件）'和'presets（预设）属性'。简单的说你不配置这两个
其中一个'babel' 也不知道你要转换的规则是什么
5.'plugins'是一个小型的 js 代码程序，告诉 Babel 如何转换你的源码，比如 @babel/plugin-transform-arrow-
functions 的作用就是将 es2015 的箭头函数转换成普通函数在看'plugins'整体可以分为两种
5.1.'转换 plugins 用于转换代码'
5.2.'语法 plugins 仅用于解析语法（不转换）'
注意'@babel/plugin-transform-arrow-functions'只是众多新语法中的一个查价，如果想组合出一个完整的
es6+的全部语法转译需要配置更多插件更多插件参考地址'https://babeljs.io/docs/en/plugins'
6.'Presets'为了解决不想一个一个的引入多新的语法，于是就产生了预设: Presets，它包含了一组我们需要的
plugins Babel 官方帮我们做了一些预设的插件集，称之为 Preset，这样我们只需要使用对应的 Preset 就可以
跟多的预设'https://babeljs.io/docs/en/presets'
了， 而 'babel-preset-env' 相当于 ES2015 ，ES2016 ，ES2017 及最新版本。 7.通过另一种思维来想这个事为了完成这些编译工作，Babel 不能实现一切，因此，Babel 的设计，在工程化的角
度上，需要秉承以下理念
7.1.'可插拔（Pluggable）'召集第三方开发者力量，同时还需要方便接入各种工具；
7.2.'可调式（Debuggable）'，比如 Babel 在编译过程中，要提供一套 Source Map，
来帮助使用者在编译结果和编译前源码之间建立映射关系
7.3.'基于协定（Compact）'，Compact 可以简单翻译为基于协定，主要是指实现灵活的配置方式，
Babel 提供 loose 选项，帮助开发者在'尽量还原规范'和'更小的编译产出体积'之间，找到平衡
所以可以明白为什么配置文件需要有'presets' 和'plugins' 最基本两项

1.刚才已经分析过了'babel' 帮我们转换的是语法，一般这种转换使用'抽象语法树(AST)',在 babel 中也不例外
整个过程:
1.1.解析（Parsing）：将代码字符串解析成抽象语法树。
1.2.转换（Transformation）：对抽象语法树进行转换操作。
1.3.生成（Code Generation）: 根据变换后的抽象语法树再生成代码字符串。
简单的说就是：'源代码 -> AST -> 转换过的 AST -> 转换过的代码' 2.整个复杂的过程是'@babel/core' 来做当然这个包也是依赖这些包
'@babel/parser、@babel/traverse、@babel/generator'
3.'@babel/core'主要的作用就是编译

![](~@public/Casequestion/babel.png)

## 兼容低版本浏览器配置

1.现在抛出一个问题，我随着低版本的浏览器逐步淘汰，一些新特性的语法在新浏览器已经支持，是否有必要
全部转换成'es5',我们更希望他可以根据你所配置的浏览器的列表，自动的去加载当前浏览器所需要的插件，
然后对 es 语法做转换 2.可以通过配置文件指定语法最低版本浏览器兼容这里其实配合的是'Browserslist',Browserslist 的数据都是来自
'https://caniuse.com/',现在我们知道各个版本浏览器支持的语法接下就是配置文件，配置文件是下面的优先级使用：
2.1.@babel/preset-env 里的 targets
2.2.package.json 里的 browserslist 字段
2.3.browserslistrc 配置文件

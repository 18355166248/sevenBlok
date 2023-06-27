# Modules 模块方法

[官方文档](https://webpack.docschina.org/api/module-methods/#es6-recommended)

## ES6(推荐)

### 魔法注释 (Magic Comments)

内联注释使这一特性得以实现。通过在 import 中添加注释，我们可以进行诸如给 chunk 命名或选择不同模式的操作。

```js
// 单个目标
import(
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  /* webpackExports: ["default", "named"] */
  "module"
);

// 多个可能的目标
import(
  /* webpackInclude: /\.json$/ */
  /* webpackExclude: /\.noimport\.json$/ */
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  /* webpackPrefetch: true */
  /* webpackPreload: true */
  `./locale/${language}`
);
```

```js
import(/_ webpackIgnore: true _/ 'ignored-module.js');
```

webpackIgnore：设置为 true 时，禁用动态导入解析。

::: warning
注意：将 webpackIgnore 设置为 true 则不进行代码分割。
:::

#### API

- webpackChunkName
  新 chunk 的名称。 从 webpack 2.6.0 开始，占位符 [index] 和 [request] 分别支持递增的数字或实际的解析文件名。 添加此注释后，将单独的给我们的 chunk 命名为 [my-chunk-name].js 而不是 [id].js。
- webpackMode 从 webpack 2.6.0 开始，可以指定以不同的模式解析动态导入。支持以下选项：
  - 'lazy' (默认值)：为每个 import() 导入的模块生成一个可延迟加载（lazy-loadable）的 chunk。
  - 'lazy-once'：生成一个可以满足所有 import() 调用的单个可延迟加载（lazy-loadable）的 chunk。此 chunk 将在第一次 import() 时调用时获取，随后的 import() 则使用相同的网络响应。注意，这种模式仅在部分动态语句中有意义，例如 import(`./locales/${language}.json`)，其中可能含有多个被请求的模块路径。
  - 'eager'：不会生成额外的 chunk。所有的模块都被当前的 chunk 引入，并且没有额外的网络请求。但是仍会返回一个 resolved 状态的 Promise。与静态导入相比，在调用 import() 完成之前，该模块不会被执行。
  - 'weak'：尝试加载模块，如果该模块函数已经以其他方式加载，（即另一个 chunk 导入过此模块，或包含模块的脚本被加载）。仍会返回 Promise， 但是只有在客户端上已经有该 chunk 时才会成功解析。如果该模块不可用，则返回 rejected 状态的 Promise，且网络请求永远都不会执行。当需要的 chunks 始终在（嵌入在页面中的）初始请求中手动提供，而不是在应用程序导航在最初没有提供的模块导入的情况下触发，这对于通用渲染（SSR）是非常有用的。
- webpackPrefetch：告诉浏览器将来可能需要该资源来进行某些导航跳转。查看指南，了解有关更多信息 [how webpackPrefetch works](https://webpack.docschina.org/guides/code-splitting/#prefetchingpreloading-modules)。

  你可以添加自己的 onerror 处理脚本，将会在错误发生时移除该 script。

  这会生成 <link rel="prefetch" href="**.js"> 并追加到页面头部，指示着浏览器在闲置时间预取 \*\*.js 文件。

  ```js
  <script
    src="https://example.com/dist/dynamicComponent.js"
    async
    onerror="this.remove()"
  ></script>
  ```

  在这种情况下，错误的 script 将被删除。Webpack 将创建自己的 script，并且任何错误都将被处理而没有任何超时。

- webpackPreload：告诉浏览器在当前导航期间可能需要该资源。 查阅指南，了解有关的更多信息 how webpackPreload works。
  与 prefetch 指令相比，preload 指令有许多不同之处：

  - preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
  - preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
  - preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。
  - 浏览器支持程度不同。

::: tip
注意：所有选项都可以像这样组合 /_ webpackMode: "lazy-once", webpackChunkName: "all-i18n-data" _/。这会按没有花括号的 JSON5 对象去解析。它会被包裹在 JavaScript 对象中，并使用 node VM 执行。所以你不需要添加花括号。
:::

- webpackInclude：在导入解析（import resolution）过程中，用于匹配的正则表达式。只有匹配到的模块才会被打包。
- webpackExclude：在导入解析（import resolution）过程中，用于匹配的正则表达式。所有匹配到的模块都不会被打包。
- webpackExports: 告知 webpack 只构建指定出口的动态 import() 模块。它可以减小 chunk 的大小。从 webpack 5.0.0-beta.18 起可用。 例:
  经过测试, mode: development 没有生效, production 才会生效

  ```js
    export default function Post() {
      return (
        <>
          <h1>Hello world</h1>
        </>
      );
    }
    export function getName(params) {
    return params + "111";
    }

    const named = "named11";

    exports = named;

    // import写法
    const Post = lazy(() =>
    import(
      "./Post" /\* webpackPrefetch: true,webpackChunkName: "post-name", webpackExports: ["default", "getName"]
      */
    )
    );
  ```

  上面的打包结果是 会生成一个单独的 js 但是名字不叫 post-name(生产环境), 会预加载, 且会导出 export default 和 export getName 数据 也会导出 exports = named 数据, 假如说

  ```js
  webpackExports: ["default"];
  ```

  那么 getName 方法不会导出

  如果是这么写

  ```js
  webpackExports: ["usedExports"];
  ```

  那么只会导出 exports = named, 当然 webpackExports 里面可以写任何变量名, 控制某个变量是否可以导出

  具体使用方法请看官方源码测试用例 [webpack/test/cases/chunks/inline-options/index.js](https://github.com/webpack/webpack/blob/main/test/cases/chunks/inline-options/index.js)

# tree shaking

tree shaking 是一个术语，通常用于描述移除 javascript 上下文中的未引用代码(dead-code)

新的 webpack 4 正式版本，扩展了这个检测能力，通过 package.json 的 "sideEffects" 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯的 ES2015 模块)"，由此可以安全地删除文件中未使用的部分。

## 1. 将文件标记为无副作用(side-effect-free)

#### - package.json

```json
{
  "name": "your-project",
  "sideEffects": false
}
```

如果你的代码确实有一些副作用，那么可以改为提供一个数组：

```js
{
  "name": "your-project",
  "sideEffects": [
    // 支持相关文件的相对路径、绝对路径和 glob 模式
    "./src/some-side-effectful-file.js"
  ]
}
```

<card-primary theme="#DCF2FD" font-size="16px" color="#618ca0">
注意，任何导入的文件都会受到 tree shaking 的影响。这意味着，如果在项目中使用类似 css-loader 并导入 CSS 文件，则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除：
</card-primary>

```json
{
  "name": "your-project",
  "sideEffects": ["./src/some-side-effectful-file.js", "*.css"]
}
```

还可以在 module.rules 配置选项 中设置 "sideEffects"

```js
module.rules: [
  {
    include: path.resolve("node_modules", "lodash"),
    sideEffects: false
  }
  // 或者这样写
  sideEffects: {
    "./x": false,
    "./y": true
  }
]
```

## 2. 压缩输出

从 webpack 4 开始，也可以通过 "mode" 配置选项轻松切换到压缩输出，只需设置为 "production"。

```js {3}
module.exports = {
  entry: "./src/index.js",
  mode: "production",
};
```

<card-primary theme="#DCF2FD" font-size="16px" color="#618ca0">
注意，也可以在命令行接口中使用 --optimize-minimize 标记，来使用 UglifyJSPlugin。
也就是在package.json 中的 script中使用 --optimize-minimize 可以使用 UglifyJSPlugin。
也就是没有被使用的代码会被移除

以上描述也可以通过命令行实现。例如，--optimize-minimize 标记将在后台引用 UglifyJSPlugin。和以上描述的 DefinePlugin 实例相同，--define process.env.NODE_ENV="'production'" 也会做同样的事情。并且，webpack -p 将自动地调用上述这些标记，从而调用需要引入的插件。
</card-primary>

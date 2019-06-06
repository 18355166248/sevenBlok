# 使用环境变量

要在开发和生产构建之间，消除 webpack.config.js 的差异，你可能需要环境变量。

webpack 命令行环境配置中，通过设置 --env 可以使你根据需要，传入尽可能多的环境变量。在 webpack.config.js 文件中可以访问到这些环境变量。例如，--env.production 或 --env.NODE_ENV=local（NODE_ENV 通常约定用于定义环境类型，查看这里）。

你可以使用 --env 配置很多的环境变量

<card-primary theme="#2B3A42" color="#a5cee1">
webpack --env.NODE_ENV=local --env.production --progress
</card-primary>

<card-primary theme="#DCF2FD" color="#618ca0">
如果设置 env 变量，却没有赋值，--env.production 默认将 --env.production 设置为 true。还有其他可以使用的语法。有关详细信息，请查看 [webpack CLI](https://www.webpackjs.com/api/cli/#environment-options) 文档。
</card-primary>

#### webpack.config.js

```js
module.exports = env => {
  // Use env.<YOUR VARIABLE> here:
  console.log('NODE_ENV: ', env.NODE_ENV) // 'local'
  console.log('Production: ', env.production) // true

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  }
}
```

## 1. 环境选项

当 webpack 配置对象导出为一个函数时，可以向起传入一个"环境对象(environment)"。

<card-primary theme="#2B3A42" color="#a5cee1">
webpack --env.production    # 设置 env.production == true
webpack --env.platform=web  # 设置 env.platform == "web"
</card-primary>

| 调用                                  |            结果            |
| ------------------------------------- | :------------------------: |
| webpack --env prod                    |           "prod"           |
| webpack --env.prod                    |       { prod: true }       |
| webpack --env.prod=1                  |        { prod: 1 }         |
| webpack --env.prod=foo                |      { prod: "foo" }       |
| webpack --env.prod --env.min          | { prod: true, min: true }  |
| webpack --env.prod --env min          |  [{ prod: true }, "min"]   |
| webpack --env.prod=foo --env.prod=bar | { prod: [ "foo", "bar" ] } |

## 2. 配置选项

| 调用                  | 结果                                                 | 输入类型 | 默认值                           |
| --------------------- | ---------------------------------------------------- | -------- | -------------------------------- |
| --config              | 配置文件的路径                                       | string   | webpack.config.js/webpackfile.js |
| --config-register, -r | 在 webpack 配置文件加载前先预加载一个或多个模块      | array    |                                  |
| --config-name         | { prod: 1 }                                          | string   |                                  |
| --env                 | 当配置文件是一个函数时，会将环境变量传给这个函数     |          |                                  |
| --mode                | 用到的模式，"development" 或 "production" 之中的一个 | string   |                                  |

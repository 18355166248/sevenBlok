# Module Federation 模块联邦

## 介绍

多个独立的构建可以组成一个应用程序，这些独立的构建之间不应该存在依赖关系，因此可以单独开发和部署它们。
这通常被称作微前端，但并不仅限于此。

## 底层概念

- 不同应用之间分为本地应用和远程应用, 远程模板不属于当前构建, 并在运行时从另外一个应用远程加载
- 远程加载属于异步操作, 所以需要用到webpack异步加载的概念, 所以通常使用import()实现, 但也支持像 require.ensure 或 require([...]) 之类的旧语法.

## 配置

配置属性：

- name，必须，唯一 ID，作为输出的模块名，使用的时通过 ${name}/${expose} 的方式使用；
- library，必须，其中这里的 name 为作为 umd 的 name；
- remotes，可选，表示作为 Host 时，去消费哪些 Remote；
- exposes，可选，表示作为 Remote 时，export 哪些属性被消费；
- shared，可选，优先用 Host 的依赖，如果 Host 没有，再用自己的；

## 打包后的产物

- main.js，应用主文件；
- remoteEntry.js，作为 remote 时被引的文件；
- 一堆异步加载的文件，main.js 或 remoteEntry.js 里可能加载的文件；

## shared共享原理

Remote（B）export override 方法，Host（A) 会调用其关联 Remote 的 override 方法，把 shared 的依赖写进去；

Remote（B) 获取模块时会优先从 override 里取，没有再从当前 Bundle 的模块索引里取；

这样，B 里面在 require react 时，就会用 A 的 react 模块。

## Demo

分为host和remote两个概念

项目: app1, app2

```js
// app1
new ModuleFederationPlugin({
  name: "app1",
  filename: "remoteEntry.js",
  // 这里说明需要使用哪个remote模块
  remotes: {
    app2: "app2@http://localhost:3002/remoteEntry.js",
  },
  // 这里说明自己作为remote需要提供给其他host使用的模块 (override)
  exposes: {
    "./Navigation": "./src/Navigation",
    "./routes": "./src/routes",
  },
  // 提供共享的模块
  shared: {
    ...deps,
    react: {
      eager: true, // 表示自己会打包一份依赖 优先使用host 的 如果版本不一样使用自身的
      singleton: true, // 表示全局只需要有一个react
      requiredVersion: deps.react, // 控制版本不能小于当前版本, 但是也不能大于当前版本的大版本号
    },
    "react-dom": {
      eager: true,
      singleton: true,
      requiredVersion: deps["react-dom"],
    },
  },
})
```

```js
// app2
new ModuleFederationPlugin({
  name: "app2",
  filename: "remoteEntry.js",
  remotes: {
    app1: "app1@http://localhost:3001/remoteEntry.js",
  },
  exposes: {
    "./routes": "./src/routes",
  },
  shared: {
    ...deps,
    react: {
      eager: true,
      singleton: true,
      requiredVersion: deps.react,
    },
    "react-dom": {
      eager: true,
      singleton: true,
      requiredVersion: deps["react-dom"],
    },
  },
})
```

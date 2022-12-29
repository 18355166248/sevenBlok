# React 路由

1. 切换路由不存入 history 记录中

![](@public/React/react-router-link-replace.jpg)

2. 调试 react-router 源码

下载 [官网](https://github.com/remix-run/react-router)的代码

在目录 examples 下有很多 demo 代码.

我们可以在对应 demo 下自己安装依赖 就可以 debug 源码了

或者我们 copy 出 demo 目录, 在 src 目录下 clone 官网的目录

```
git clone --branch main git@github.com:remix-run/react-router.git
```

修改 vite.config.ts 的配置

```ts

{
    resolve: process.env.USE_SOURCE
    ? {
        alias: {
          "@remix-run/router": path.resolve(
            __dirname,
            "./src/react-router/packages/router/index.ts"
          ),
          "react-router": path.resolve(
            __dirname,
            "./src/react-router/packages/react-router/index.ts"
          ),
          "react-router-dom": path.resolve(
            __dirname,
            "./src/react-router/packages/react-router-dom/index.tsx"
          ),
        },
      }
    : {},
}
```

因为还依赖环境变量 所以我们需要安装 cross-env 依赖

```
npm i -D cross-env
```

修改 package.json 的命令

```json
{
  "scripts": {
    "dev": "cross-env USE_SOURCE=1 vite",
    "build": "tsc && vite build",
    "serve": "vite preview"
  }
}
```

至此 我们一家可以调试我们的 react-router 的源码了

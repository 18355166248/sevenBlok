# 前言

#### 文档主要是看[webpack](https://www.webpackjs.com/guides/getting-started/)中文网和极客时间老师的教程进行学习记录的

#### 版本是 webpack4.0 的版本

webpack 打包的时候有时候服务器分配给 node 的内存可能会不够, 造成 javascript heap out of memory
处理办法:

```shell
node ./bin/config uat && node --max-old-space-size=5000 ./node_modules/.bin/webpack --config webpack/webpack.uat.config.js --mode production
```

#### 1. 打包时控制日志信息的展示

![stats](@public/webpack/stats.png)

#### 控制版本号方法

```javascript
"scripts": {
  "start": "PORT=4000 node ./webpack/start.js",
}
```

```javascript
const a = {
  devServer: {
    client: {
      webSocketURL: websocketPath,
    },
    static: {
      directory: assetPublicPath,
      watch: {
        ignored: (f: string) => {
          // 生成的类型定义不要监听，否则会引发全局的 reload 使 HMR 失去意义
          return f.endsWith(".d.ts");
        },
      },
    },
    allowedHosts: "all",
    hot: true,
    port: port,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
```

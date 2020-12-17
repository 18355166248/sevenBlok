# 前言

#### 文档主要是看[webpack](https://www.webpackjs.com/guides/getting-started/)中文网和极客时间老师的教程进行学习记录的

#### 版本是 webpack4.0 的版本

webpack 打包的时候有时候服务器分配给 node 的内存可能会不够, 造成 javascript heap out of memory
处理办法:

```shell
node ./bin/config uat && node --max-old-space-size=5000 ./node_modules/.bin/webpack --config webpack/webpack.uat.config.js --mode production
```

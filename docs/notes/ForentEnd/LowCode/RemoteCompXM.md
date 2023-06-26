# 低代码搭建简易版

可以参考 [搭建平台如何构建页面](http://localhost:8082/notes/Transshipment/FrontEnd/LowCode/XIMA.html)

## 功能

这篇文章主要介绍了搭建平台的活动页构建过程，即点击了页面配置页右上角的「发布」按钮后是如何构建出可访问的活动页面的

## 实现

- client 客户端
  也就是浏览器端渲染的页面 这里会在服务端执行一遍, 浏览器也会执行一遍

  1. 服务端会在已经初始化好第三方依赖 module.js 后, 执行客户端代码, 将第三方依赖的代码初始化在 repo.js 里.
  2. 通过 repo 渲染 window.serverData (也就是页面配置数据).
  3. 通过 rollup 进行打包, 打包到 dist/shell.js 下, 目的是为了给服务端暴露渲染页面的方法 renderAppHtml, 并且让服务端基于 dist/shell.js 再次打包成 dist/bundle.js 做压缩

  #### 解释:

  renderAppHtml 作用: 拿到页面配置, 和 public/index.html 的代码 , 通过 styled-components 的 ServerStyleSheet 方法, 做服务端渲染, 拆离节点和 css 并返回 包含页面节点和 css 的 html

- server 服务端
  通过 express 做服务端, 设置路由 '/', 当我访问改地址时, 会执行如下逻辑

  1. 解析 activity.json 页面配置数据, 动态安装页面所需要的第三方配置到 dist/node_modules 下,
  2. 再通过 server/generator.js 下的 writeModuleFile 基于已经安装好的依赖会生成 module.js 将上面的依赖按照 cjs 的模式导出, module.js 的格式如下:

  ```js
  const TextBox_1_2_2 = require("@xmc/text-box-1.2.2").default;

  const modules = {
    "@xmc/text-box@1.2.2": TextBox_1_2_2,
  };

  module.exports = modules;
  ```

  1.  上面的依赖已经打包好了 可以开始进行打包页面了. 通过 webpack 对客户端的打包结果 dist/shell.js 进行打包, 基于 dist/shell.js 再次打包成 dist/bundle.js 做压缩
  2.  读取 public/index.html 代码, 通过 require 获取 dist/shell.js 的暴露渲染页面的方法 renderAppHtml
  3.  通过 renderAppHtml 拿到 完整版 html, 写入到 dist/index.html 下(目前没看到用处), 并且返回给浏览器, 浏览拿到 html, 会渲染节点,css, 并执行 dist/bundle.js, 也就是会再次执行 client/index.js 的代码
  4.  注意: 再次执行 client/index.js 会执行如下代码, 也就是基于服务端的渲染的页面, 再次执行渲染页面的逻辑

  ```js
  if (typeof document !== "undefined") {
    const root = document.getElementById("root");
    hydrateRoot(root, <App config={window.serverData} />);
  }
  ```

## 结尾

至此, 低代码的动态渲染功能已经完成了

# 微信小程序

[官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

## 实现原理

### 小程序架构

微信小程序的框架包含两部分 View 视图层、App Service 逻辑层，View 层用来渲染页面结构，AppService 层用来逻辑处理、数据请求、接口调用，它们在两个进程（两个 Webview）里运行。
视图层和逻辑层通过系统层的 JSBridage 进行通信，逻辑层把数据变化通知到视图层，触发视图层页面更新，视图层把触发的事件通知到逻辑层进行业务处理。

### 小程序技术实现

小程序的 UI 视图和逻辑处理是用多个 webview 实现的，逻辑处理的 JS 代码全部加载到一个 Webview 里面，称之为 AppService，整个小程序只有一个，并且整个生命周期常驻内存，而所有的视图（wxml 和 wxss）都是单独的 Webview 来承载，称之为 AppView。所以一个小程序打开至少就会有 2 个 webview 进程，正式因为每个视图都是一个独立的 webview 进程，考虑到性能消耗，小程序不允许打开超过 5 个层级的页面，当然同是也是为了体验更好。

### 

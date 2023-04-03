# SingleSpaJiang

这里记录下如何实现一个简易的微前端

## 首先我们看下微前端需要具备什么功能

1. 多项目可以共存, 运行, 可以同时渲染多个不同框架的前端项目
2. js, css 实现沙箱隔离
3. 多项目可以实现通讯

## 实现

### 多项目可以共存, 运行

1. 首先 微前端需要我们提供3个生命周期, bootstrap, mount, unmount, 表示渲染前, 渲染方法, 销毁方法

2. 微前端会在 bootstrap 阶段获通过子应用的访问地址取到子应用的入口html, 通过递归解析 html, 将 html, style, link, script 提取出来, 然后将这些资源动态塞入到页面中, script的就通过 new Function 执行即可

3. 微前端会在 mount 阶段执行子应用暴露出来的 mount 方法, 执行子应用初始化, 将页面渲染到主应用配置子应用的 Dom 节点上

4. 微前端会在 unmount 节点执行子应用暴露出来的 unmount 方法, 执行子应用销毁

5. 一般浏览单页应用使用最多的是 history 和 hash 模式, 所以我们需要监听这两个模式的方法, 通过子应用的状态改变, 动态执行渲染子应用方法, 需要代理的方法有
   + pushState
   + replaceState
   + popstate
   + hashchange

### js 实现沙箱隔离

要想实现 js 沙箱, 需要用到 Proxy, 代理浏览器环境的 window, 拦截window的方法, 这块的实现比较多, 简单说下拦截的方法

+ setInterval
+ clearInterval
+ setTimeout
+ clearTimeout
+ requestIdleCallback
+ cancelIdleCallback
+ addEventListener
+ removeEventListener
+ eval
+ document
+ 原生的 onXXX 事件

也要拦截 Element 和 Document 方法, 以下:

+ appendChild
+ insertBefore
+ createElement
+ querySelector
+ querySelectorAll
+ getElementById
+ getElementsByClassName
+ getElementsByName
+ getElementsByTagName

同时注意, 在子应用销毁的时候, 这些方法都需要执行销毁, 回滚到原生方法

## css 实现沙箱隔离

css 实现的思路就是在获取到 style 标签(包括远程的和本地的), 动态修改添加 css 上层作用域, 效果如下

```ts
/**
 * 给每一条 css 选择符添加对应的子应用作用域
 * 1. a {} -> a[single-spa-name=${app.name}] {}
 * 2. a b c {} -> a[single-spa-name=${app.name}] b c {}
 * 3. a, b {} -> a[single-spa-name=${app.name}], b[single-spa-name=${app.name}] {}
 * 4. body {} -> #${子应用挂载容器的 id}[single-spa-name=${app.name}] {}
 * 5. @media 递归处理子样式 子样式效果同上
 * 5. @media @supports 递归处理子样式 子样式效果同上其他规则直接返回 cssText
 */
```

执行上面格式化的时机就是在向页面中插入 style 标签的时候

## 多项目可以实现通讯

通信的话就是在全局初始化一个状态池和事件池, 你可以往这个状态池里塞状态, 也可以监听状态池值的改变, 需要注意的是, 你需要通过 activeRule 判断当前路由页面子应用是否启动

使用方法如下:

```js
// 监听事件
window.spaJiangGloabalState.on(事件名, 回调函数)
// 触发监听
window.spaJiangGloabalState.emit(事件名, ...多余参数)
// 添加状态池
window.spaJiangGloabalState.set(key, value);
// 监听状态池值的改变 state: 状态池   operator: 行为   key: 变化的属性
window.spaJiangGloabalState.onChange((state, operator, key) => {})
```

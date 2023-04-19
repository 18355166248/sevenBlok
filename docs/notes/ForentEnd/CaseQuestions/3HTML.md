# HTML面试题

[[toc]]

## window.onload, window.DOMContentLoaded

window.onload的onload属性是一个事件处理程序用于处理window, XMLHttpRequest, <img />等元素的加载事件, 当资源已加载时被触发

window.DOMContentLoaded html文档被完全加载和解析之后, 事件触发, 无需等待样式表,图像和子框架的完全加载

#### 注意:

- 在文档装载完成后偶会触发onload时间, 这个时候, 在文档中所有对象都在DOM中, 所有图片, 脚本, 链接, 子框都完成了装载
- 同步的javascript会暂停DOM的解析

```js
<script>
  document.addEventListener("DOMContentLoaded", function(event) {
      console.log("DOM fully loaded and parsed");
  });

  for(var i=0; i<1000000000; i++){
      // 这个同步脚本将延迟DOM的解析。
      // 所以DOMContentLoaded事件稍后将启动。
  }
</script>
```

## html首屏, 白屏时间

```js
// 白屏计算: 在<head>标签的底部, 也就是</head>的前面即可
performance.timing.responseStart - performance.timing.navigationStart

//首屏时间
window.onload = () => {
    new Date() - performance.timing.responseStart
}
```


## Dom(documnet Object Modal 文档对象模型)和Cssom(css Object Modal)执行顺序

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAyMC8zLzMxLzE3MTMwZTA5N2RlYzFkYzU?x-oss-process=image/format,png)

在接收到HTML数据之后的预解析过程中，HTML预解析器识别出来了有CSS文件和JavaScript文件需要下载，然后就同时发起这两个文件的下载请求，需要注意的是，这两个文件的下载过程是重叠的，所以下载时间按照最久的那个文件来算。

但实际上，不管css文件和js文件哪个先下载好，只有css文件下载好了，构建CSSOM树完成了，才能开始解析JavaScript

### 优化

- 将一些css代码, js代码卸载html文件内联标签里, 减少下载时间
- 尽量减少文件大小, 可以通过webpack, 将代码压缩
- 可以将一些不需要再html解析阶段就需要用到的javascript外部文件通过async或者defer, 使得文件可以异步加载, 不影响页面的构建

## 轮播图如何实现

::: details 点击
方法1:
1、将所有的图片并排。
2、依次平移即可。

方法2:
1、将所有图片叠在一起。
2、如果为当前图片则设置 ( z-index )，使其在最顶层。
3、使用 opacity 过渡代替方法一中的平移过渡( left )：

方法2:
1、将所有图像复制一轮后并排。
2、同方法一, 依次平移。
3、重要：平移一轮到复制的图像的第一张[ 结束后 ] ，立即将 left 设置为 0px ( 我这里用了 jquery，也可不用 )。

:::

## hash模式和history模式的区别

::: details 点击
1. 原理不同。
hash模式的实现原理是通过监听hashChange事件来实现的，前端js把当前hash地址对应的组件渲染到浏览器中。history模式是通过调用 history.pushState方法(或者replaceState) 并且 监听popstate事件来实现的。history.pushState会追加历史记录，并更换地址栏地址信息，但是页面不会刷新，需要手动调用地址变化之后的处理函数，并在处理函数内部决定跳转逻辑；监听popstate事件是为了响应浏览器的前进后退功能。

2. 表现不同。
hash模式会在地址栏中有#号，而history模式没有；同时由于history模式的实现原理用到H5的新特性，所以它对浏览器的兼容性有要求(IE >= 10)。

3. history模式特点
history模式开发的SPA项目，需要服务器端做额外的配置，否则会出现刷新白屏（链接分享失效）。原因是页面刷新时，浏览器会向服务器真的发出对这个地址的请求，而这个文件资源又不存在，所以就报404。处理方式就由后端做一个保底映射:所有的请求全部拦截到index.html上

:::




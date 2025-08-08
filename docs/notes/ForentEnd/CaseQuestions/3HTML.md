# HTML面试题

[[toc]]

## window.onload, window.DOMContentLoaded

::: details 点击

### 1. 事件触发时机

**window.onload：**

- 当页面**所有资源**（包括图片、样式表、脚本、iframe等）完全加载完成后触发
- 等待所有外部资源下载完毕
- 触发时机最晚

**window.DOMContentLoaded：**

- 当 HTML 文档被**完全加载和解析**后触发
- 不等待样式表、图片、子框架等外部资源加载完成
- 触发时机较早

### 2. 执行顺序

```js
// 执行顺序：DOMContentLoaded → onload
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM 解析完成");
});

window.addEventListener("load", function () {
  console.log("所有资源加载完成");
});
```

### 3. 详细对比

| 特性     | DOMContentLoaded     | onload             |
| -------- | -------------------- | ------------------ |
| 触发时机 | DOM 解析完成         | 所有资源加载完成   |
| 等待资源 | 不等待图片、样式表等 | 等待所有外部资源   |
| 执行顺序 | 先执行               | 后执行             |
| 适用场景 | DOM 操作、初始化     | 依赖外部资源的操作 |

### 4. 代码示例

```js
// DOMContentLoaded 示例
document.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOM 完全加载和解析");

  // 可以安全地操作 DOM
  const element = document.getElementById("myElement");
  element.style.color = "red";
});

// onload 示例
window.addEventListener("load", function (event) {
  console.log("所有资源加载完成");

  // 可以安全地操作图片等外部资源
  const images = document.querySelectorAll("img");
  console.log("图片数量:", images.length);
});
```

### 5. 注意事项

**同步 JavaScript 会阻塞 DOM 解析：**

```js
<script>
document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM 完全加载和解析");
});

// 这个同步脚本会延迟 DOM 的解析
for(var i = 0; i < 1000000000; i++) {
    // 大量计算会阻塞 DOM 解析
    // 所以 DOMContentLoaded 事件会延迟触发
}
</script>
```

**异步脚本不会阻塞：**

```js
// async 脚本不会阻塞 DOM 解析
<script async src="script.js"></script>

// defer 脚本会在 DOM 解析完成后执行
<script defer src="script.js"></script>
```

### 6. 实际应用场景

**使用 DOMContentLoaded：**

- DOM 元素操作和初始化
- 绑定事件监听器
- 初始化页面组件
- 不需要等待图片等资源

**使用 onload：**

- 需要获取图片尺寸
- 依赖外部样式表计算布局
- 需要等待所有资源加载完成的操作
- 页面性能统计

### 7. 兼容性处理

```js
// 兼容性处理
function ready(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(function () {
  console.log("DOM 准备就绪");
});
```

### 8. 性能优化建议

- 优先使用 `DOMContentLoaded` 进行 DOM 操作
- 避免在 `<head>` 中放置阻塞的同步脚本
- 使用 `async` 或 `defer` 属性优化脚本加载
- 将非关键资源延迟加载

:::

## html首屏, 白屏时间

::: details 点击

```js
// 白屏计算: 在<head>标签的底部, 也就是</head>的前面即可
performance.timing.responseStart - performance.timing.navigationStart;

//首屏时间
window.onload = () => {
  new Date() - performance.timing.responseStart;
};
```

:::

## Dom(documnet Object Modal 文档对象模型)和Cssom(css Object Modal)执行顺序

::: details 点击
![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAyMC8zLzMxLzE3MTMwZTA5N2RlYzFkYzU?x-oss-process=image/format,png)

在接收到HTML数据之后的预解析过程中，HTML预解析器识别出来了有CSS文件和JavaScript文件需要下载，然后就同时发起这两个文件的下载请求，需要注意的是，这两个文件的下载过程是重叠的，所以下载时间按照最久的那个文件来算。

但实际上，不管css文件和js文件哪个先下载好，只有css文件下载好了，构建CSSOM树完成了，才能开始解析JavaScript

### 优化

- 将一些css代码, js代码卸载html文件内联标签里, 减少下载时间
- 尽量减少文件大小, 可以通过webpack, 将代码压缩
- 可以将一些不需要再html解析阶段就需要用到的javascript外部文件通过async或者defer, 使得文件可以异步加载, 不影响页面的构建
  :::

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

## HTML 列表中的dl,dt,dd,ul,ol,li区别及应用

::: details 点击 1.无序列表
无序列表是一个项目的列表，此列项目使用粗体圆点（通常）进行标记。无序列表始于 \<ul\> 标签。每个列表项始于 \<li\>。

2.有序列表
有序列表也是一列项目，列表项目使用数字进行标记。有序列表始于 \<ol\> 标签。每个列表项始于 \<li\> 标签。

3.定义列表
自定义列表不仅仅是一列项目，而是项目及其注释的组合。自定义列表以 \<dl\> 标签开始。每个自定义列表项以 \<dt\> 开始。每个自定义列表项的定义以 \<dd\> 开始。

![](@public/Casequestion/dl-dt-dd-ul-ol.png)
:::

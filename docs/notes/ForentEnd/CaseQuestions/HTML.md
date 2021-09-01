# HTML面试题

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

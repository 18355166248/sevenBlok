# HTML面试题

## window.onload, window.DOMContentLoaded

window.onload的onload属性是一个事件处理程序用于处理window, XMLHttpRequest, <img />等元素的加载事件, 当资源已加载时被触发

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

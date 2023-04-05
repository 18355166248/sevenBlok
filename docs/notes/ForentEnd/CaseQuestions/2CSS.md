# CSS面试题

## transition和animation的区别

animation和transiton大部分属性都是相同的, 他们都是随时间改变元素的属性值, 他们的主要区别是transition需要出发一个事件才能改变属性, 而animation不需要触发任何时间的情况下回随时间改变属性值, 并且transition为2帧,从from...to, 而animation可以一帧一帧的

## 行内元素和块级元素的区别

+ display: inline; 转换为行内元素
+ display: block; 转换为块级元素
+ display: inline-block; 转换为行内块级元素

```HTML
<div>
  <b>行内元素, 宽高无效, margin 左右有效, 上下无效 不会进行自动换行</b>
  <span>行内元素, 宽高无效, margin 左右有效, 上下无效 不会进行自动换行</span>
  <a href="JavaScript:;">a标签 不会进行自动换行</a>
</div>

<div>块级元素 识别宽高, margin, padding上下左右均有效 可以自动换行</div>

<div class="inlineBlock">行内块元素 不自动换行 能够识别宽高 默认排列方式从左到右</div>
```

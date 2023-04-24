# CSS 面试题

[[toc]]

## transition 和 animation 的区别

::: details 点击查看
animation 和 transiton 大部分属性都是相同的, 他们都是随时间改变元素的属性值, 他们的主要区别是 transition 需要出发一个事件才能改变属性, 而 animation 不需要触发任何时间的情况下回随时间改变属性值, 并且 transition 为 2 帧,从 from...to, 而 animation 可以一帧一帧的
:::

## 行内元素和块级元素的区别

::: details 点击查看

- display: inline; 转换为行内元素
- display: block; 转换为块级元素
- display: inline-block; 转换为行内块级元素

```HTML
<div>
  <b>行内元素, 宽高无效, margin 左右有效, 上下无效 不会进行自动换行</b>
  <span>行内元素, 宽高无效, margin 左右有效, 上下无效 不会进行自动换行</span>
  <a href="JavaScript:;">a标签 不会进行自动换行</a>
</div>

<div>块级元素 识别宽高, margin, padding上下左右均有效 可以自动换行</div>

<div class="inlineBlock">行内块元素 不自动换行 能够识别宽高 默认排列方式从左到右</div>
```

:::

## 怎么实现响应式布局的

::: details 点击查看
响应式布局指的是同一页面在不同屏幕尺寸下有不同的布局。传统的开发方式是 PC 端开发一套，手机端再开发一套，而使用响应式布局只要开发一套就够。

方案:
1. 媒体查询 @media screen
2. rem
3. vm vh
4. 百分比
5. flex
:::

## css 动画 animation 各个时间值含义

::: details 点击
1、animation-name ：xx   （设置关键帧的名称为xx）

2、animation-duration：5s  （动画持续时间为5s）

3、animation-timing-function： linear （动画时间曲线 也叫做运行速度为匀速）

取值：

linear 匀速、 ​ ease （默认）低速开始—>加速—>结束前减速   、

ease-in 以低速开始、ease-out 以低速结束、ease-in-out 以低速开始和结束。

cubic-bezier(n,n,n,n) 在 cubic-bezier 函数中自己的值。可能的值是从 0 到 1 的数值。

4、animation-delay:5s  (动画等待5后开始)

5、animatiom-iteration-count：1   （动画播放次数为1次）

取值：xx数字，定义应该播放xx次动画、 infinite-无限次执行

6、animation-direction： alternate（设置动画为反向播放 ）

取值：

nomal（默认）-执行完一次之后回到起点继续执行下一次
alternate-往返动画，执行完一次之后往回执行下一次

reverse-反向执行

7、animation-fill-mode： （动画结束的最后一帧）

取值：

none-不做任何改变
forwards-让元素结束状态保持动画最后一帧的样式

backwards-让元素等待状态的时候显示动画第一帧的样式

both-等待状态显示第一帧，结束状态保持最后一帧

8、animation-play-state：  （设置动画是否暂停）

取值：running-执行动画 、paused-暂停动画
:::


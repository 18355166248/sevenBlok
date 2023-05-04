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
1、animation-name ：xx （设置关键帧的名称为 xx）

2、animation-duration：5s （动画持续时间为 5s）

3、animation-timing-function： linear （动画时间曲线 也叫做运行速度为匀速）

取值：

linear 匀速、 ​ ease （默认）低速开始—>加速—>结束前减速 、

ease-in 以低速开始、ease-out 以低速结束、ease-in-out 以低速开始和结束。

cubic-bezier(n,n,n,n) 在 cubic-bezier 函数中自己的值。可能的值是从 0 到 1 的数值。

4、animation-delay:5s (动画等待 5 后开始)

5、animatiom-iteration-count：1 （动画播放次数为 1 次）

取值：xx 数字，定义应该播放 xx 次动画、 infinite-无限次执行

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

8、animation-play-state： （设置动画是否暂停）

取值：running-执行动画 、paused-暂停动画
:::

## 有兼容 retina 屏幕的经历吗？如何在移动端实现 1 px 的线

::: details 点击

#### viewport + rem 实现

同时通过设置对应 viewport 的 rem 基准值，这种方式就可以像以前一样轻松愉快的写 1px 了。
在 devicePixelRatio = 2 时，输出 viewport：

```HTML
<meta name="viewport" content="initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no">
```

在 devicePixelRatio = 3 时，输出 viewport：

```HTML
<meta name="viewport" content="initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no">
```

这种兼容方案相对比较完美，适合新的项目，老的项目修改成本过大。
对于这种方案，可以看看《使用 Flexible 实现手淘 H5 页面的终端适配》
优点：
所有场景都能满足 一套代码，可以兼容基本所有布局

缺点：
老项目修改代价过大，只适用于新项目

#### 伪类 + transform 实现

对于老项目，有没有什么办法能兼容 1px 的尴尬问题了，个人认为伪类+transform 是比较完美的方法了。
原理是把原先元素的 border 去掉，然后利用 :before 或者 :after 重做 border ，并 transform 的 scale 缩小一半，原先的元素相对定位，新做的 border 绝对定位。
单条 border 样式设置：

```css
.scale-1px {
  position: relative;
  border: none;
}

.scale-1px:after {
  content: "";
  position: absolute;
  bottom: 0;
  background: #000;
  width: 100%;
  height: 1px;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
```

四条 border 样式:

```CSS
.scale-1px {
  width: 100px;
  height: 100px;
  background-color: beige;
  position: relative;
  margin-bottom: 20px;
  border: none;
}

.scale-1px:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #000;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 200%;
  height: 200%;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  -webkit-transform-origin: left top;
  transform-origin: left top;
}
```

最好在使用前也判断一下，结合 JS 代码，判断是否 Retina 屏：

```js
if (window.devicePixelRatio && devicePixelRatio >= 2) {
  document.querySelector("ul").className = "scale-1px";
}
```

优点：所有场景都能满足 支持圆角(伪类和本体类都需要加 border-radius)

缺点：对于已经使用伪类的元素(例如 clearfix)，可能需要多层嵌套
:::

## 为什么说用 css 实现动画比 js 动画性能好

::: details 点击

1. js 动画是操作 dom 的样式属性, 每次改变元素的位置, 会造成回流, 造成浏览器不断的计算页面,导致浏览器内存堆积. 而且由于 js 运行在浏览器的主线程上, 主线程中还有其他重要的任务在运行, 因而可能受到干扰导致线程阻塞, 从而丢帧.
2. css 动画运行在合成线程, 不会阻塞主线程, 而且合成线程中完成的动作不会触发回流和重绘
3. js 动画运行在 CPU, css 动画运行在 GPU
   :::

## 什么是 合成层

::: details 点击
[浏览器渲染魔法之合成层](https://zhuanlan.zhihu.com/p/451219118)

#### 如何提升为合成层

- 设置 transform: translateZ(0)，注意它必须是 translateZ，因为它使用 GPU 来计算 perspective distortion（透视失真）。perspective 在 3D 设计中是一个重要的属性，有兴趣的同学可以看这份资料了解一下。如果你使用 translateX 或 translateY，元素将会被绘制在普通文档流中 demo。
- backface-visibility: hidden 指定当元素背面朝向观察者时是否可见 demo。
- will-change 该属性告诉浏览器该元素会有哪些变化，这样浏览器可以提前做好对应的优化准备工作。当该属性的值为 opacity、transform、top、left、bottom、right 时 demo。
- video、canvas、iframe 等元素。

## 隐式合成

比如说 如果有节点是合成层, 之后的节点 z-index 比合成层高, 会隐式提成成合成层
我们在浏览器控制台打开 layers 里面选中这个节点可以看到下面的 Details 上面的说明

![](@public/public/Casequestion/compositing-reasons.jpeg)

所以引用 [CSS GPU Animation](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/) 中关于隐式合成的描述那就是：

> This is called implicit compositing: One or more non-composited elements that should appear above a composited one in the stacking order are promoted to composite layers — i.e. painted to separate images that are then sent to the GPU.
> 一个或多个非合成元素应出现在堆叠顺序上的合成元素之上，会被提升为合成层。

:::

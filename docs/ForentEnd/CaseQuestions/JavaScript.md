# JavaScript

## 1.common.js 和 es6 中模块引入的区别？

1、CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
2、CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
3、CommonJs 是单个值导出，ES6 Module 可以导出多个
4、CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层
5、CommonJs 的 this 是当前模块，ES6 Module 的 this 是 undefined

## 2. 首屏和白屏时间如何计算

- 当页面的元素数小于 x 时, 则认为是白屏. 可以获取页面的 DOM 节点数, 判断 DOM 节点数小于某个阈值 X, 则认为是白屏
- 在判断初始化页面渲染出来的地方通过 Date.now() - performance.timing.navigationStart 去获取白屏时间

## 3. Virtual Dom 的优势在哪里？

其次是 VDOM 和真实 DOM 的区别和优化：

1. 虚拟 DOM 不会立马进行排版与重绘操作
2. 虚拟 DOM 进行频繁修改，然后一次性比较并修改真实 DOM 中需要改的部分，最后在真实 DOM 中进行排版与重绘，减少过多 DOM 节点排版与重绘损耗
3. 虚拟 DOM 有效降低大面积真实 DOM 的重绘与排版，因为最终与真实 DOM 比较差异，可以只渲染局部

## 4. 面向对象

封装：也就是把客观事物封装成抽象的类，并且类可以把自己的数据和方法只让可信的类或者对象操作，对不可信的进行信息隐藏。
继承：通过继承创建的新类称为“子类”或“派生类”。继承的过程，就是从一般到特殊的过程。
多态：对象的多功能，多方法，一个方法多种表现形式。
Javascript是一种基于对象（object-based）的语言。但是，它又不是一种真正的面向对象编程（OOP）语言，因为它的语法中没有class（类）—–es6以前是这样的。所以es5只有使用函数模拟的面向对象。

## 5. 原型链

构造函数有自己的原型
const Cat() = function() {}

Cat.prototype

原型的constructor = Cat

实例的__proto__指向构造函数的原型
const cat = new Cat()
cat.__proto__ = Cat.prototype

可以通过Object.getPrototypeOf(cat) === Cat.prototype // true

## undefined和null的区别

undefined表示一个无的原始值(基础类型), 转为数值为NaN, null表示一个无的对象, 转为数值为0


## 代码错误监控

首先我们可以关注一下Performance,下面就先讲一下其中的两个API

#### performance timing

具体可以查看w3.org/TR/navigation-timing、Navigation Timing API。

在chrome浏览器控制台输入Performance.timing，会得到记录了一个浏览器访问各阶段的时间的对象。

进行错误收集的时候，可以对比这些时间，看错误发生在什么阶段

- DNS 查询耗时 ：domainLookupEnd - domainLookupStart
- TCP 链接耗时 ：connectEnd - connectStart
- request 请求耗时 ：responseEnd - responseStart
- 解析 dom 树耗时 ： domComplete - domInteractive
- 白屏时间 ：responseStart - navigationStart
- domready 时间 ：domContentLoadedEventEnd - navigationStart
- onload 时间 ：loadEventEnd – navigationStart

#### 脚本错误信息收集

- window.onerror

window.onerror可以捕捉运行时错误，可以拿到出错的信息，堆栈，出错的文件、行号、列号

- promise的错误处理

promise除了使用catch方法来捕获错误, 还可以使用window的unhandledrejection时间来捕获异常
所以假如说你有用catch去捕获错误, 那么不会触发unhandledrejection, 只有在不用catch去捕获错的情况下会触发unhandledrejection

- try catch

无法捕捉到语法错误, 只能捕捉运行时错误
对回调 setTimeout promise 无能为力

#### 上报错误的方式

- 后端提供接口, ajax提交
- 创建一个图片, url参数带上错误信息

```js
function report(error) {
  var reportUrl = 'http://xxxx/report';
  new Image().src = reportUrl + 'error=' + error;
}
```

优点就是不需要解决跨域问题, 防止重复请求, 缺点就是上传大小有限制, 可携带数据有限



## map, object的区别

- map的key值可以是任何类型, object必须是字符串
- map是按插入的顺序排序的, object是无序的
- map和object获取值的方式不同
- map, object对数据的操作不一样 增删改查

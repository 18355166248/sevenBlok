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
Javascript 是一种基于对象（object-based）的语言。但是，它又不是一种真正的面向对象编程（OOP）语言，因为它的语法中没有 class（类）—–es6 以前是这样的。所以 es5 只有使用函数模拟的面向对象。

## 5. 原型链

构造函数有自己的原型
const Cat() = function() {}

Cat.prototype

原型的 constructor = Cat

实例的**proto**指向构造函数的原型
const cat = new Cat()
cat.**proto** = Cat.prototype

可以通过 Object.getPrototypeOf(cat) === Cat.prototype // true

## undefined 和 null 的区别

undefined 表示一个无的原始值(基础类型), 转为数值为 NaN, null 表示一个无的对象, 转为数值为 0

## 代码错误监控

首先我们可以关注一下 Performance,下面就先讲一下其中的两个 API

#### performance timing

具体可以查看 w3.org/TR/navigation-timing、Navigation Timing API。

在 chrome 浏览器控制台输入 Performance.timing，会得到记录了一个浏览器访问各阶段的时间的对象。

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

window.onerror 可以捕捉运行时错误，可以拿到出错的信息，堆栈，出错的文件、行号、列号

- promise 的错误处理

promise 除了使用 catch 方法来捕获错误, 还可以使用 window 的 unhandledrejection 时间来捕获异常
所以假如说你有用 catch 去捕获错误, 那么不会触发 unhandledrejection, 只有在不用 catch 去捕获错的情况下会触发 unhandledrejection

- try catch

无法捕捉到语法错误, 只能捕捉运行时错误
对回调 setTimeout promise 无能为力

#### 上报错误的方式

- 后端提供接口, ajax 提交
- 创建一个图片, url 参数带上错误信息

```js
function report(error) {
  var reportUrl = 'http://xxxx/report'
  new Image().src = reportUrl + 'error=' + error
}
```

优点就是不需要解决跨域问题, 防止重复请求, 缺点就是上传大小有限制, 可携带数据有限

## map, object 的区别

- map 的 key 值可以是任何类型, object 必须是字符串
- map 是按插入的顺序排序的, object 是无序的
- map 和 object 获取值的方式不同
- map, object 对数据的操作不一样 增删改查

## 箭头函数和普通函数的区别

1. 箭头函数语法上比普通函数更加简洁(ES6 中每一种函数都可以使用形参赋默认值和剩余运算符)
2. 箭头函数没有自己的 THIS，它里面的 THIS 是继承函数所处上下文中的 THIS（使用 CALL/APPY 等任何方式都无法改变 THIS 的指向） 3.箭头函数中没有 ARGUMENTS(类数组)，智能基于。。。ARG 获取传递的参数集合（数组）
3. 箭头函数不能被 NEW 执行（因为：箭头函数没有 THIS 也没有 prototype）

## 跨域的解决方案 并且解决前后端分离项目跨域，配置多个域名

体量大的情况跨域的解决方案, 不要让运维通过 nginx 改 通过 java 配置

项目前后端分离以后需要配置跨域，且需要允许浏览器多个域名跨域。我们知道 Access-Control-Allow-Origin 里面是只可以写一个域名的，但是我们可以通过配置一个可被允许的 origins 数组，然后判断前端请求中的 origin 是否在这个数组中来解决这个问题~

## 简单数据类型和复杂数据类型的区别

简单数据类型存储在栈中
引用数据类型值存储在堆中, 地址存储在栈中

值类型之间传递的值
引用类型之间的传递, 传递的是地址

## web除了cookie和webStorage还有啥存储

web SQL 和 indexedDB 两种存储方式

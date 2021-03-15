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

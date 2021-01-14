---
sidebar: auto
---

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

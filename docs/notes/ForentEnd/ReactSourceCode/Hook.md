# Hook

官方文档上专门用了一个版块来介绍 [Hook](https://zh-hans.reactjs.org/docs/hooks-intro.html), 这里摘抄了几个比较关心的问题(其他 [FAQ](https://zh-hans.reactjs.org/docs/hooks-faq.html) 请移步官网):

1. 引入 Hook 的动机?
   在组件之间复用状态逻辑很难; 复杂组件变得难以理解; 难以理解的 class. 为了解决这些实际开发痛点, 引入了 Hook.

2. Hook 是什么? 什么时候会用 Hook?
   Hook 是一个特殊的函数, 它可以让你“钩入” React 的特性. 如, useState 是允许你在 React 函数组件中添加 state 的 Hook.
   如果你在编写函数组件并意识到需要向其添加一些 state, 以前的做法是必须将其转化为 class. 现在你可以在现有的函数组件中使用 Hook.

3. Hook 会因为在渲染时创建函数而变慢吗?
   不会. 在现代浏览器中,闭包和类的原始性能只有在极端场景下才会有明显的差别. 除此之外,可以认为 Hook 的设计在某些方面更加高效:
   Hook 避免了 class 需要的额外开支,像是创建类实例和在构造函数中绑定事件处理器的成本.
   符合语言习惯的代码在使用 Hook 时不需要很深的组件树嵌套. 这个现象在使用高阶组件、render props、和 context 的代码库中非常普遍. 组件树小了, React 的工作量也随之减少.

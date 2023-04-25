# React 面试题

[[toc]]

## 1. HTML 和 React 的事件处理有何区别？React 中可以使用 return false 取消默认行为吗？（项目中遇到的问题）

::: details 点击
主要区别如下：

- 在 HTML 中，事件名称使用小写，而 React 中使用驼峰命名。

```js
<!-- HTML -->
<button onclick="handleClick()">
/* React */
<button onClick="handleClick()">
```

- 在 HTML 中，阻止事件的默认行为使用 return false，而 React 中必须调用 preventDefault。

```js
<!-- HTML -->
<button onclick="console.log('The link was clicked.'); return false">
/* React */
function handleClick(e) {
    e.preventDefault()
}
```
:::

## 2. useMemo 和 useCallback 的使用场景？

#### 共同作用

数据依赖发生变化，才会重新计算结果，起到缓存的作用

#### 区别

userMemo 计算结果是 return 回来的值
useCallback 计算结果是函数，用于缓存函数

## 3. 有没有使用过 react 的 useContext？如何避免 react context 导致的重复不必要的渲染问题？

::: details 点击
解决方案看 https://zhuanlan.zhihu.com/p/50336226

思路就是再使用 context 的时候，独立声明高阶组件包裹下面的 children，这样组件内部改变 context 不会影响外面调用 context 的组件，避免不必要的渲染

#### 作用

数据上下文初始化，用于所有子组件可以快速获取，使用
:::

## 4. useLayoutEffect 与 useEffect 区别, useLayoutEffect 使用场景？以及这两个执行的先后顺序？

## 5. 子组件不依赖父组件的任何 props 属性值，如果父组件状态改变了，子组件会不会进行 diff 以及 re-render？子组件的真实 DOM 会不会重新生成。如果子组件会重新渲染，那怎么才能在没有任何依赖的情况下，让子组件不渲染？

## 6. 在两个组件中使用相同的自定义 Hook 会共享 state 吗？

不会共享

> 注意：

自定义 Hook 必须以 “use” 开头
在两个组件中使用相同的 Hook 不会 共享 state
自定义 Hook 每次调用 Hook，它都会获取独立的 stat

## 7. 如何做到只有在更新时运行 effect ？

https://blog.csdn.net/NinthMonee/article/details/113564439

这是个比较罕见的使用场景。如果你需要的话，你可以 使用一个可变的 ref 手动存储一个布尔值来表示是首次渲染还是后续渲染，然后在你的 effect 中检查这个标识。（如果你发现自己经常在这么做，你可以为之创建一个自定义 Hook。）

## 8. 惰性初始值应用场景？

initialState 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。其应用场景在于：创建初始 state 很昂贵时，例如需要通过复杂计算获得；那么则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用：

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props)
  return initialState
})
```

## 9. 组件中定义的函数，在每次重新渲染中是否相同？

## 10. react 组件封装的看法，有没有做过 DOM 结构比较复杂的组件，以及怎么做复杂组件的性能测试？

## 11. React Portal 有哪些使用场景？

## 12.react hook、高阶组件、render Prop 适应场景？

## 13. setState 是异步还是同步？什么情况下是异步？什么情况下是同步？具体哪些场景?

## 14. hook 为什么不能写在判断语句里面

因为 hook 组件渲染必须有一样的渲染顺序, 假如 hook 写在判断语句里面, 那么渲染顺序就不可控了

hook 组件的状态初始化是用链表的形式存储的, 假如说你有 hook 在判断语句里面, 那么在组件重新执行的时候有可能不能拿到这个 hook 并放入进链表中, 这个时候 react 在更新的时候就会出现错乱, 造成 hook 更新不准确的情况

## 15. react-redux 在 react 和 redux 之间做了什么处理

> react-redux 是将 react 和 reudx 有机关联的组件

react-redux 有 2 个方法: Provider Connect

1. Provider 用做 redux 数据 store 的初始化

   1. 提供了 store 的 getState, dispatch, subscrib 三个方法
   2. Provider 使用了 Context, 解决 store 数据在嵌套组件使用一套数据的问题
   3. Provider 要求内部有且只能有一个组件, 这个使用到了 Children(this.props.children)

2. Connect
   1. 高阶函数, 通过 context 调用 store 里面暴露出来的方法,用于传递给组件, 同时订阅组件的渲染事件

react-redux 使用了 Context 上下文做数据的初始化, 这样所以子组件都可以通过 this.context.store 共享数据
然后内部实现了一套 Store 方法, 用于数据的删改查和发布订阅更新子组件
再用 HOC(高阶组件)把 store 上面的 store.gerState(), store.dispatch(), store.subscribe()封装起来, 这里就是 connect 组件干的事了

## React 项目兼容低版本浏览器

1.安装 react-app-polyfill 和 core-js

npm install react-app-polyfill core-js

2.在 index.js 中引入

```js
import 'core-js/es'
import 'react-app-polyfill/ie9'
import 'react-app-polyfill/stable' 3.修改 package.json 的配置

"browserslist": {
"production": [
">0.2%",
"not dead",
"not op_mini all",

-     "ie > 9"
  ],
  "development": [
  "last 1 chrome version",
  "last 1 firefox version",
  "last 1 safari version",
-     "ie > 9"
      ]
  },
```

4.如果没有效果删除 node_modules 文件夹重新下载 5.如果还不行，可能是没有设置 ie 文档模式的原因，在 index.html 中添加

<meta http-equiv="X-UA-Compatible" content="IE=edge" />
不是使用create-react-app创建的项目
无需配置react-app-polyfill和package.json，其他的同上

## React 有哪些常用的 hooks

::: details 点击
我们参考 [React18](https://react.dev/reference/react)

useCallback // 缓存函数
useMemo // 缓存数据
useContext // 读取和订阅 context 在组件中
useEffect // 订阅更新
useId // 生成唯一的 ID 可以传递给辅助功能属性
useImperativeHandle // 配合 forwardRef 传递数据给父组件
useLayoutEffect // 在浏览器重新绘制屏幕之前激发
useEffect // 组件的一些异步操作
useReducer // 添加一个 reducer 在你的组价内
useRef // 生成一个改变不会触发组件更新的值
useState // 生成一个状态变量在你的组件中
useTransition // 在不影响浏览器渲染的情况下执行
useDeferredValue // 允许您推迟更新UI的一部分

useSyncExternalStore // 提供给第三方库比如 redux 可以同步拿到最新的数据
useInsertionEffect // 在使用 css-in-js 会用到 插入样式在 DOM 渲染前
useDebugValue // 配合 React DevTools 使用
:::

## react16新增了哪些生命周期、有什么作用，为什么去掉某些15的生命周期



::: details 点击
react16 删除了 componentWillMount componentWillUpdate componentWillReceiveProps

#### 为何删除

<Card text='这里引用拉钩教育修言老师在深入浅出搞定React中的讲解，我觉得他这个讲解通俗易懂，实在无法超越

说回 getDerivedStateFromProps 这个 API，它相对于早期的 componentWillReceiveProps 来说，正是做了“合理的减法”。而做这个减法的决心之强烈，从 getDerivedStateFromProps 直接被定义为 static 方法这件事上就可见一斑—— static 方法内部拿不到组件实例的 this，这就导致你无法在 getDerivedStateFromProps 里面做任何类似于 this.fetch()、不合理的 this.setState（会导致死循环的那种）这类可能会产生副作用的操作。

因此，getDerivedStateFromProps 生命周期替代 componentWillReceiveProps 的背后，是 React 16 在强制推行“只用 getDerivedStateFromProps 来完成 props 到 state 的映射”这一最佳实践。意在确保生命周期函数的行为更加可控可预测，从根源上帮开发者避免不合理的编程方式，避免生命周期的滥用；同时，也是在为新的 Fiber 架构铺路。'></Card>

react16 新增了 getDerivedStateFromProps getSnapshotBeforeUpdate
:::

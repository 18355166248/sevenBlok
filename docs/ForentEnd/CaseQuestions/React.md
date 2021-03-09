# React 面试题

## 1. HTML 和 React 的事件处理有何区别？React 中可以使用 return false 取消默认行为吗？（项目中遇到的问题）

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

## 2. useMemo 和 useCallback 的使用场景？

#### 共同作用

数据依赖发生变化，才会重新计算结果，起到缓存的作用

#### 区别

userMemo 计算结果是 return 回来的值
useCallback 计算结果是函数，用于缓存函数

## 3. 有没有使用过 react 的 useContext？如何避免 react context 导致的重复不必要的渲染问题？

解决方案看 https://zhuanlan.zhihu.com/p/50336226

思路就是再使用 context 的时候，独立声明高阶组件包裹下面的 children，这样组件内部改变 context 不会影响外面调用 context 的组件，避免不必要的渲染

#### 作用

数据上下文初始化，用于所有子组件可以快速获取，使用

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
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

## 9. 组件中定义的函数，在每次重新渲染中是否相同？

## 10. react 组件封装的看法，有没有做过 DOM 结构比较复杂的组件，以及怎么做复杂组件的性能测试？

## 11. React Portal 有哪些使用场景？

## 12.react hook、高阶组件、render Prop 适应场景？

## 13. setState 是异步还是同步？什么情况下是异步？什么情况下是同步？具体哪些场景?

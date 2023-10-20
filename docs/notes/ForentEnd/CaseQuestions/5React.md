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

useLayoutEffect 和 useEffect 差不多，区别只是它是在 commit 阶段的 layout 阶段同步执行所有 fiber 节点的 updateQueue 中的 effect。

## 5. 子组件不依赖父组件的任何 props 属性值，如果父组件状态改变了，子组件会不会进行 diff 以及 re-render？子组件的真实 DOM 会不会重新生成。如果子组件会重新渲染，那怎么才能在没有任何依赖的情况下，让子组件不渲染？

::: details 打开

React 17 引入了一项优化措施，称为"跳过无关更新"（Skip unnecessary updates），它会在进行 diff 比较时跳过那些不会影响子组件的更新的情况。这意味着如果子组件没有依赖于父组件的 props 属性值，那么即使父组件的状态改变了，React 也会跳过子组件的 diff 和重新渲染，从而提高性能。

需要注意的是，这个优化只适用于函数组件和继承自 React.PureComponent 或 React.Component 的类组件。如果你使用的是继承自 React.Component 的普通类组件，而不是 PureComponent，那么即使子组件不依赖于父组件的 props 属性值，它仍然会进行 diff 和重新渲染。

:::

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

:::details 点开

在 React Hooks 组件中，定义的函数在每次重新渲染中是新的函数。

当 Hooks 组件重新渲染时，函数组件的整个函数体会被重新执行，包括函数内部定义的函数。这意味着每次重新渲染时，Hooks 组件中定义的函数都会被重新创建。

例如，考虑以下示例：

```jsx
import React, { useState } from "react";

function MyComponent() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}
```

在上面的示例中，每次 `MyComponent` 组件重新渲染时，`handleClick` 函数都会被重新创建。这是因为 Hooks 组件的函数体会在每次重新渲染时执行。

尽管函数的引用在每次重新渲染中是不同的，但它们仍然具有相同的功能。这意味着你可以在每次重新渲染时使用相同的函数名称，而不必担心函数的引用问题。

需要注意的是，由于闭包的特性，Hooks 组件中的函数可以访问到每次渲染时的最新状态和 props。这使得在函数组件中使用 Hooks 变得非常强大和灵活。

希望这个答案对你有所帮助。如果你有任何其他问题，请随时提问。

:::

## 10. react 组件封装的看法，有没有做过 DOM 结构比较复杂的组件，以及怎么做复杂组件的性能测试？

## 11. React Portal 有哪些使用场景？

## 12.react hook、高阶组件、render Prop 适应场景？

## 13. setState 是异步还是同步？什么情况下是异步？什么情况下是同步？具体哪些场景?

:::details 点开

react18 之前

setState 的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，

react18

[官方说明](https://github.com/reactwg/react-18/discussions/21)

从 react 18 开始, 使用了 createRoot 创建应用后, 所有的更新都会自动进行批处理(也就是异步合并).使用 render 的应用会保持之前的行为.
如果你想保持同步更新行为, 可以使用 ReactDOM.flushSync()

:::

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
useDeferredValue // 允许您推迟更新 UI 的一部分

useSyncExternalStore // 提供给第三方库比如 redux 可以同步拿到最新的数据
useInsertionEffect // 在使用 css-in-js 会用到 插入样式在 DOM 渲染前
useDebugValue // 配合 React DevTools 使用
:::

## react16 新增了哪些生命周期、有什么作用，为什么去掉某些 15 的生命周期

::: details 点击
react16 删除了 componentWillMount componentWillUpdate componentWillReceiveProps

#### 为何删除

<Card text='这里引用拉钩教育修言老师在深入浅出搞定 React 中的讲解，我觉得他这个讲解通俗易懂，实在无法超越

说回 getDerivedStateFromProps 这个 API，它相对于早期的 componentWillReceiveProps 来说，正是做了“合理的减法”。而做这个减法的决心之强烈，从 getDerivedStateFromProps 直接被定义为 static 方法这件事上就可见一斑—— static 方法内部拿不到组件实例的 this，这就导致你无法在 getDerivedStateFromProps 里面做任何类似于 this.fetch()、不合理的 this.setState（会导致死循环的那种）这类可能会产生副作用的操作。

因此，getDerivedStateFromProps 生命周期替代 componentWillReceiveProps 的背后，是 React 16 在强制推行“只用 getDerivedStateFromProps 来完成 props 到 state 的映射”这一最佳实践。意在确保生命周期函数的行为更加可控可预测，从根源上帮开发者避免不合理的编程方式，避免生命周期的滥用；同时，也是在为新的 Fiber 架构铺路。'></Card>

react16 新增了 getDerivedStateFromProps getSnapshotBeforeUpdate

#### 总结

相对于 React15，React16 的生命周期中去掉了 componentWillMout 和 componentWillUpdate 方法，并且使用 getDerivedStateFromProps 方法替代了之前的 componentWillReceiveprops，使得 React 的生命周期更纯粹，只用来做专门的事情，避免大量业务逻辑代码嵌入生命周期，同时也是在为 Fiber 架构铺路
:::

## fiber 怎样的，如何实现异步渲染

::: details 点击
fiberRoot fiber workInProgress

[原理](https://18355166248.github.io/notes/ForentEnd/ReactSourceCode/Scheduler.html)
scheduler 包中调度原理, 也就是 React 两大工作循环中的任务调度循环. 并介绍了时间切片和可中断渲染等特性在任务调度循环中的实现. scheduler 包是 React 运行时的心脏, 为了提升调度性能, 注册 task 之前, 在 react-reconciler 包中做了节流和防抖等措施.
:::

## redux 和 redux-saga 的区别和原理

::: details 点击

- redux: 状态管理的第三方实现
- redux-saga: 同 redux 一起使用，增强了 redux 的功能。之前 actions 返回一个对象，异步的 action 可以返回一个函数

  ```js
  export const initList = (list) => ({
    type: INIT_LIST,
    list,
  });

  export const getInitList = () => {
    return function(dispatch) {
      axios.get("/api/initList.json").then((res) => {
        //调用上面的initList，向store发送数据修改的请求
        //然后reducers通过action的type的值进行处理，返回一个新的state
        dispatch(initList(res.data));
      });
    };
  };
  ```

* redux-saga: redux-saga 也是 redux 的一个中间件，可以处理异步 action 通过 generator 实现
  :::

## useEffect 实现原理

::: details 点击

##### useEffect 的 hook 在 render 阶段会把 effect 放到 fiber 的 updateQueue 中，这是一个 lastEffect.next 串联的环形链表，然后 commit 阶段会异步执行所有 fiber 节点的 updateQueue 中的 effect。

useLayoutEffect 和 useEffect 差不多，区别只是它是在 commit 阶段的 layout 阶段同步执行所有 fiber 节点的 updateQueue 中的 effect。

##### useState 同样分为 mountState 和 updateState 两个阶段：

mountState 会返回 state 和 dispatch 函数，dispatch 函数里会记录更新到 hook.queue，然后标记当前 fiber 到根 fiber 的 lane 需要更新，之后调度下次渲染。

再次渲染的时候会执行 updateState，会取出 hook.queue，根据优先级确定最终的 state 返回，这样渲染出的就是最新的结果。
:::

## react 组件如何做性能优化，说说 pureComponent

::: details 点击

react/packages/react-reconciler/src/ReactFiberClassComponent.old.js

```js
function checkShouldComponentUpdate(
  workInProgress,
  ctor,
  oldProps,
  newProps,
  oldState,
  newState,
  nextContext
) {
  const instance = workInProgress.stateNode;
  // 先优先判断是否存在 shouldComponentUpdate 存在的话直接使用 shouldComponentUpdate
  if (typeof instance.shouldComponentUpdate === "function") {
    let shouldUpdate = instance.shouldComponentUpdate(
      newProps,
      newState,
      nextContext
    );

    return shouldUpdate;
  }
  // 判断是否是 pureComponent 类型
  if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    // 如果 props 和 state 都没有变化就不执行更新
    return (
      !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    );
  }

  return true;
}
```

:::

## react diff 算法

:::details 打开

[React 面试：谈谈虚拟 DOM，Diff 算法与 Key 机制](https://cloud.tencent.com/developer/article/2226886)

React 中的 Virtual DOM 和 Diff 算法是 React 实现高效更新和渲染的关键部分。

1. **Virtual DOM：** React 使用虚拟 DOM（Virtual DOM）来表示真实 DOM 树的副本。虚拟 DOM 是一个轻量级的 JavaScript 对象树，它映射了真实 DOM 树的结构。当组件状态发生变化时，React 会创建新的虚拟 DOM 树，然后通过 Diff 算法比较新旧虚拟 DOM 树的差异。

2. **Diff 算法：** React 的 Diff 算法是一种有效地找出两棵树之间的差异并更新视图的方式。Diff 算法的核心思想是尽量复用已有的 DOM 结构，最小化操作。

   - **深度优先遍历：** React 使用深度优先遍历策略来比较两棵虚拟 DOM 树的节点。

   - **同级比较：** 在进行深度优先遍历时，React 会首先比较同级的节点，而不会跨层级比较。

   - **节点更新策略：** React 根据节点类型进行不同的比较和更新策略。对于不同类型的节点，React 会直接替换整个节点；对于相同类型的节点，React 会比较节点属性，更新变化的属性；对于文本节点，React 会更新文本内容。

   - **Key 属性：** 在列表渲染时，为了更准确地找到新增、删除和移动的节点，React 鼓励使用 `key` 属性。`key` 使得 React 能够更好地识别同一级别节点的变化。

   - **Reconciliation（协调）：** Diff 算法的最终目标是在两棵树之间找到最小的变化集合，然后将这些变化应用到实际的 DOM 上。这个过程称为协调（Reconciliation）。

Diff 算法的设计目标是保持性能并最小化操作，以便在组件状态变化时尽可能高效地更新视图。虚拟 DOM 的引入以及差异比较的优化使得 React 能够高效地处理复杂的 UI 更新，从而提供更好的用户体验。

需要注意的是，React 18 中可能会引入一些新的特性或改进，因此最新的 React 版本可能会有一些变化。

:::

## react key 机制

:::details 打开

#### 1. key 的作用

当同一层级的某个节点添加了对于其他同级节点唯一的 key 属性，当它在当前层级的位置发生了变化后。react diff 算法通过新旧节点比较后，如果发现了 key 值相同的新旧节点，就会执行移动操作（然后依然按原策略深入节点内部的差异对比更新），而不会执行原策略的删除旧节点，创建新节点的操作。这无疑大大提高了 React 性能和渲染效率

#### 2. key 的具体执行过程

- 首先，对新集合中的节点进行循环遍历 for (name in nextChildren) ，通过唯一的 key 判断新旧集合中是否存在相同的节点 if (prevChild === nextChild)，如果存在相同节点，则进行移动操作，但在移动前需要将当前节点在旧集合中的位置与 lastIndex 进行比较 if (child.\_mountIndex < lastIndex)，否则不执行该操作。
- 完成新集合中所有节点 diff 后，对旧集合进行循环遍历，寻找新集合中不存在但就集合中的节点(此例中为 D)，删除 D 节点。

第一轮遍历：（4 种情况）

```js
1. newChildren 与 oldFiber 同时遍历完

那就是最理想的情况：只有组件更新。此时 Diff 结束。
```

```js
2. newChildren 没遍历完，oldFiber 遍历完

已有的 DOM 节点都复用了，这时还有新加入的节点，意味着本次更新有新节点插入
我们只需要遍历剩下的 newChildren 为生成的 workInProgress fiber 依次标记 Placement。
```

```js
3 .newChildren 遍历完，oldFiber 没遍历完

意味着本次更新比之前的节点数量少，有节点被删除了。所以需要遍历剩下的 oldFiber，依次标记 Deletion。

```

```js
4. newChildren 与 oldFiber 都没遍历完

这意味着有节点在这次更新中改变了位置。

改变了位置就需要我们处理移动的节点

由于有节点改变了位置，所以不能再用位置索引 i 对比前后的节点，那么如何才能将同一个节点在两次更新中对应上呢？
我们需要使用 key。

为了快速的找到 key 对应的 oldFiber，我们将所有还未处理的 oldFiber 存入以 key 为 key，oldFiber 为 value 的 Map 中。
```

```js
接下来遍历剩余的 newChildren，通过 newChildren[i].key 就能在 existingChildren 中找到 key 相同的 oldFiber

标记节点是否移动
```

#### !既然我们的目标是寻找移动的节点，那么我们需要明确：节点是否移动是以什么为参照物？

```js
我们的参照物是：最后一个可复用的节点在 oldFiber 中的位置索引（用变量 lastPlacedIndex 表示）。
```

```js
由于本次更新中节点是按 newChildren 的顺序排列。
在遍历 newChildren 过程中，每个遍历到的可复用节点一定是当前遍历到的所有可复用节点中最靠右的那个
即一定在 lastPlacedIndex 对应的可复用的节点在本次更新中位置的后面。

那么我们只需要比较遍历到的可复用节点在上次更新时是否也在 lastPlacedIndex 对应的 oldFiber 后面
就能知道两次更新中这两个节点的相对位置改变没有。

我们用变量 oldIndex 表示遍历到的可复用节点在 oldFiber 中的位置索引。

如果 oldIndex < lastPlacedIndex，代表本次更新该节点需要向右移动。

lastPlacedIndex 初始为 0，每遍历一个可复用的节点，如果 oldFiber >= lastPlacedIndex，则 lastPlacedIndex = oldFiber。
```

### 源码的位置

`/react-reconciler/src/ReactChildFiber.new.js`

`reconcileChildrenArray`
:::

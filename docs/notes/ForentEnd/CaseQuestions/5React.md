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

数据依赖发生变化，才会重新计算结果，起到缓存的作用，避免不必要的重复计算和渲染

#### 区别

- **useMemo**: 缓存计算结果，返回计算后的值
- **useCallback**: 缓存函数引用，返回缓存的函数

#### useMemo 使用场景

1. **昂贵的计算操作**

   ```jsx
   const expensiveValue = useMemo(() => {
     return computeExpensiveValue(a, b);
   }, [a, b]);
   ```

2. **避免子组件不必要的重新渲染**

   ```jsx
   const memoizedObject = useMemo(
     () => ({
       id: props.id,
       name: props.name,
     }),
     [props.id, props.name]
   );
   ```

3. **过滤或排序大量数据**
   ```jsx
   const filteredUsers = useMemo(() => {
     return users.filter((user) => user.age > 18);
   }, [users]);
   ```

#### useCallback 使用场景

1. **传递给子组件的回调函数**

   ```jsx
   const handleClick = useCallback(() => {
     console.log("Button clicked");
   }, []);
   ```

2. **避免子组件因为函数引用变化而重新渲染**

   ```jsx
   const handleSubmit = useCallback((data) => {
     submitData(data);
   }, []);
   ```

3. **作为 useEffect 的依赖项**

   ```jsx
   const fetchData = useCallback(() => {
     // 获取数据的逻辑
   }, []);

   useEffect(() => {
     fetchData();
   }, [fetchData]);
   ```

#### 注意事项

- 不要过度使用，只有在确实需要优化性能时才使用
- 依赖数组要准确，避免遗漏依赖导致的问题
- 对于简单的计算或对象创建，直接创建可能比使用 useMemo 更高效

## 3. 有没有使用过 react 的 useContext？如何避免 react context 导致的重复不必要的渲染问题？

::: details 点击
解决方案看 [https://zhuanlan.zhihu.com/p/50336226](https://zhuanlan.zhihu.com/p/50336226)

思路就是再使用 context 的时候，独立声明高阶组件包裹下面的 children，这样组件内部改变 context 不会影响外面调用 context 的组件，避免不必要的渲染

1.  合理拆分 Context（粒度化）
    ​​场景​​：单个 Context 包含过多数据（如用户信息、主题、配置）
    ​​方案​​：按数据用途拆分为多个独立 Context

2.  优化 Context 值引用

```js
const contextValue = useMemo(() => ({
user,
login: () => setUser(newUser)
}), [user]); // 仅当 user 变化时更新引用

return <MyContext.Provider value={contextValue}>;
```

3. 控制组件重渲染范围

- ​​策略 1​​：对纯展示组件使用 React.memo
- ​​策略 2​​：分离状态读取与交互逻辑

4. 结合 useReducer管理复杂状态

:::

## 4. useLayoutEffect 与 useEffect 区别, useLayoutEffect 使用场景？以及这两个执行的先后顺序？

### 主要区别

**useEffect：**

- 异步执行，不会阻塞浏览器绘制
- 在浏览器绘制完成后执行
- 适合大多数副作用操作

**useLayoutEffect：**

- 同步执行，会阻塞浏览器绘制
- 在 DOM 更新后、浏览器绘制前执行
- 适合需要同步更新 DOM 的场景

### 执行顺序

1. **组件渲染** → 2. **DOM 更新** → 3. **useLayoutEffect 执行** → 4. **浏览器绘制** → 5. **useEffect 执行**

### useLayoutEffect 使用场景

**适用场景：**

- 需要同步测量 DOM 元素尺寸
- 需要同步更新 DOM 样式，避免闪烁
- 需要同步操作 DOM 元素（如 focus、scroll 等）

**示例代码：**

```jsx
import React, { useLayoutEffect, useRef, useState } from "react";

function MeasureComponent() {
  const [width, setWidth] = useState(0);
  const ref = useRef();

  useLayoutEffect(() => {
    // 同步测量 DOM 元素尺寸
    setWidth(ref.current.offsetWidth);
  }, []);

  return <div ref={ref}>宽度: {width}px</div>;
}
```

**避免闪烁的示例：**

```jsx
function Tooltip({ children, position }) {
  const [tooltipStyle, setTooltipStyle] = useState({});
  const tooltipRef = useRef();

  useLayoutEffect(() => {
    // 同步计算位置，避免闪烁
    const rect = tooltipRef.current.getBoundingClientRect();
    setTooltipStyle({
      left: position.x - rect.width / 2,
      top: position.y - rect.height - 10,
    });
  }, [position]);

  return (
    <div ref={tooltipRef} style={tooltipStyle}>
      {children}
    </div>
  );
}
```

### 注意事项

- **性能影响**：useLayoutEffect 会阻塞浏览器绘制，过度使用会影响性能
- **默认选择**：优先使用 useEffect，只有在需要同步更新 DOM 时才使用 useLayoutEffect
- **服务端渲染**：useLayoutEffect 在服务端渲染时会产生警告，因为服务端没有 DOM

## 5. 子组件不依赖父组件的任何 props 属性值，如果父组件状态改变了，子组件会不会进行 diff 以及 re-render？子组件的真实 DOM 会不会重新生成。如果子组件会重新渲染，那怎么才能在没有任何依赖的情况下，让子组件不渲染？

::: details 打开

React 17 引入了一项优化措施，称为"跳过无关更新"（Skip unnecessary updates），它会在进行 diff 比较时跳过那些不会影响子组件的更新的情况。这意味着如果子组件没有依赖于父组件的 props 属性值，那么即使父组件的状态改变了，React 也会跳过子组件的 diff 和重新渲染，从而提高性能。

需要注意的是，这个优化只适用于函数组件和继承自 React.PureComponent 或 React.Component 的类组件。如果你使用的是继承自 React.Component 的普通类组件，而不是 PureComponent，那么即使子组件不依赖于父组件的 props 属性值，它仍然会进行 diff 和重新渲染。

:::

## 6. 在两个组件中使用相同的自定义 Hook 会共享 state 吗？

**不会共享 state**

### 原因分析

每个组件调用自定义 Hook 时，都会创建独立的 state 实例。这是因为：

1. **Hook 调用是独立的**：每次调用 Hook 都会创建新的 state 变量
2. **组件隔离**：不同组件之间的 state 是完全隔离的
3. **闭包特性**：每个 Hook 调用都有自己的闭包作用域

### 代码示例

```jsx
// 自定义 Hook
function useCounter(initialValue) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return { count, increment, decrement };
}

// 组件A
function ComponentA() {
  const { count, increment, decrement } = useCounter(0);

  return (
    <div>
      <h3>Component A: {count}</h3>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

// 组件B
function ComponentB() {
  const { count, increment, decrement } = useCounter(10);

  return (
    <div>
      <h3>Component B: {count}</h3>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

在上面的例子中：

- `ComponentA` 的 `count` 初始值为 0
- `ComponentB` 的 `count` 初始值为 10
- 两个组件的 state 完全独立，互不影响

### 注意事项

1. **命名规范**：自定义 Hook 必须以 "use" 开头
2. **调用规则**：Hook 只能在函数组件或自定义 Hook 的顶层调用
3. **状态隔离**：每次调用 Hook 都会获取独立的 state
4. **性能考虑**：虽然不共享 state，但 Hook 的逻辑可以复用

### 如果需要共享状态

如果确实需要在组件间共享状态，可以考虑：

1. **状态提升**：将状态提升到共同的父组件
2. **Context API**：使用 React Context 进行状态共享
3. **状态管理库**：如 Redux、Zustand 等
4. **自定义 Hook + Context**：结合使用实现状态共享

## 7. 如何做到只有在更新时运行 effect ？

[https://blog.csdn.net/NinthMonee/article/details/113564439](https://blog.csdn.net/NinthMonee/article/details/113564439)

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

:::details

### 组件封装的原则

1. **单一职责原则**：每个组件只负责一个功能
2. **可复用性**：组件应该能够在不同场景下复用
3. **可维护性**：组件结构清晰，易于理解和修改
4. **可测试性**：组件应该易于进行单元测试

### 复杂组件的性能测试方法

#### 1. React DevTools Profiler

```jsx
import { Profiler } from "react";

function onRenderCallback(
  id, // 发生提交的 Profiler 树的 "id"
  phase, // "mount" (首次挂载) 或 "update" (重新渲染)
  actualDuration, // 渲染花费的时间
  baseDuration, // 估计不使用 memoization 的情况下渲染整棵子树需要的时间
  startTime, // 本次渲染开始的时间
  commitTime // 本次渲染被提交的时间
) {
  console.log("渲染时间:", actualDuration);
}

<Profiler id="ComplexComponent" onRender={onRenderCallback}>
  <ComplexComponent />
</Profiler>;
```

#### 2. 性能监控工具

- **Lighthouse**：分析页面性能
- **WebPageTest**：详细的性能测试
- **React Performance**：专门的 React 性能分析

#### 3. 代码层面的性能优化

```jsx
// 使用 React.memo 避免不必要的重渲染
const ComplexComponent = React.memo(({ data }) => {
  // 组件逻辑
});

// 使用 useMemo 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// 使用 useCallback 缓存函数
const handleClick = useCallback(() => {
  // 处理逻辑
}, []);
```

#### 4. 虚拟化长列表

```jsx
import { FixedSizeList as List } from "react-window";

const VirtualizedList = ({ items }) => (
  <List height={400} itemCount={items.length} itemSize={35} itemData={items}>
    {({ index, style, data }) => <div style={style}>{data[index].name}</div>}
  </List>
);
```

:::

## 11. React Portal 有哪些使用场景？

:::details

### 什么是 React Portal

React Portal 提供了一种将子节点渲染到父组件 DOM 层级之外的 DOM 节点中的方法。通过 `ReactDOM.createPortal(child, container)` 实现。

### 主要使用场景

#### 1. 模态框（Modal）

```jsx
import ReactDOM from "react-dom";

function Modal({ children, isOpen }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>,
    document.body // 渲染到 body 下，避免 z-index 问题
  );
}
```

#### 2. 工具提示（Tooltip）

```jsx
function Tooltip({ children, content, position }) {
  const [show, setShow] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});

  const handleMouseEnter = (e) => {
    const rect = e.target.getBoundingClientRect();
    setTooltipStyle({
      position: "fixed",
      left: rect.left + rect.width / 2,
      top: rect.top - 10,
      transform: "translateX(-50%)",
    });
    setShow(true);
  };

  return (
    <>
      <span onMouseEnter={handleMouseEnter} onMouseLeave={() => setShow(false)}>
        {children}
      </span>
      {show &&
        ReactDOM.createPortal(
          <div className="tooltip" style={tooltipStyle}>
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
```

#### 3. 下拉菜单（Dropdown）

```jsx
function Dropdown({ trigger, menu }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({});

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 5,
      left: rect.left,
    });
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div onClick={handleClick}>{trigger}</div>
      {isOpen &&
        ReactDOM.createPortal(
          <div className="dropdown-menu" style={position}>
            {menu}
          </div>,
          document.body
        )}
    </>
  );
}
```

#### 4. 通知提示（Notification）

```jsx
function Notification({ message, type, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div className={`notification notification-${type}`}>{message}</div>,
    document.body
  );
}
```

### Portal 的优势

1. **避免 CSS 层级问题**：可以渲染到任何 DOM 节点，避免 z-index 和 overflow 问题
2. **更好的性能**：避免复杂的 CSS 定位计算
3. **更灵活的结构**：可以在 DOM 树中的任何位置渲染组件
4. **更好的可访问性**：可以确保组件在正确的 DOM 层级中

### 注意事项

1. **事件冒泡**：Portal 中的事件仍然会冒泡到 React 树中
2. **清理工作**：确保在组件卸载时清理 Portal 创建的元素
3. **服务端渲染**：Portal 在服务端渲染时需要注意兼容性

:::

## 12.react hook、高阶组件、render Prop 适应场景？

:::details

### 三种模式的对比

| 特性       | React Hooks | 高阶组件 (HOC) | Render Props |
| ---------- | ----------- | -------------- | ------------ |
| 学习成本   | 低          | 中等           | 中等         |
| 代码复用性 | 高          | 高             | 高           |
| 逻辑内聚性 | 高          | 中等           | 中等         |
| 性能优化   | 内置        | 需要手动优化   | 需要手动优化 |
| 调试友好性 | 好          | 中等           | 中等         |

### React Hooks 适用场景

```jsx
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// 使用
function Counter() {
  const { count, increment, decrement } = useCounter(0);
  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### 高阶组件 (HOC) 适用场景

```jsx
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
      return <LoginPage />;
    }

    return <WrappedComponent {...props} user={user} />;
  };
}
```

### Render Props 适用场景

```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  return <div onMouseMove={handleMouseMove}>{render(position)}</div>;
}

// 使用
<MouseTracker
  render={({ x, y }) => (
    <h1>
      鼠标位置: ({x}, {y})
    </h1>
  )}
/>;
```

### 选择建议

1. **优先使用 Hooks**：对于大部分场景，Hooks 是最佳选择
2. **HOC 用于横切关注点**：如权限控制、日志记录等
3. **Render Props 用于复杂渲染逻辑**：当需要灵活控制渲染内容时
4. **混合使用**：在实际项目中，三种模式可以结合使用

:::

## 13. setState 是异步还是同步？什么情况下是异步？什么情况下是同步？具体哪些场景?

:::details 点开

### React 18 之前的行为

setState 的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，

### React 18 的变化

[官方说明](https://github.com/reactwg/react-18/discussions/21)

从 React 18 开始，使用了 `createRoot` 创建应用后，所有的更新都会自动进行批处理（也就是异步合并）。使用 `render` 的应用会保持之前的行为。

如果你想保持同步更新行为，可以使用 `ReactDOM.flushSync()`。

### 具体场景分析

#### 1. 合成事件中的 setState（异步）

```jsx
function handleClick() {
  console.log("setState 前:", this.state.count); // 0
  this.setState({ count: this.state.count + 1 });
  console.log("setState 后:", this.state.count); // 仍然是 0
}

// 在 React 18 中，所有合成事件都是异步的
<button onClick={handleClick}>点击</button>;
```

#### 2. 生命周期中的 setState（异步）

```jsx
componentDidMount() {
  console.log('setState 前:', this.state.count); // 0
  this.setState({ count: this.state.count + 1 });
  console.log('setState 后:', this.state.count); // 仍然是 0
}
```

#### 3. 原生事件中的 setState（同步）

```jsx
componentDidMount() {
  // 原生 DOM 事件
  document.getElementById('button').addEventListener('click', () => {
    console.log('setState 前:', this.state.count); // 0
    this.setState({ count: this.state.count + 1 });
    console.log('setState 后:', this.state.count); // 1，同步更新
  });
}
```

#### 4. setTimeout 中的 setState（同步）

```jsx
handleClick = () => {
  setTimeout(() => {
    console.log("setState 前:", this.state.count); // 0
    this.setState({ count: this.state.count + 1 });
    console.log("setState 后:", this.state.count); // 1，同步更新
  }, 0);
};
```

#### 5. Promise 中的 setState（同步）

```jsx
handleClick = async () => {
  await Promise.resolve();
  console.log("setState 前:", this.state.count); // 0
  this.setState({ count: this.state.count + 1 });
  console.log("setState 后:", this.state.count); // 1，同步更新
};
```

### React 18 中的强制同步更新

```jsx
import { flushSync } from "react-dom";

function handleClick() {
  console.log("setState 前:", count); // 0

  // 强制同步更新
  flushSync(() => {
    setCount(count + 1);
  });

  console.log("setState 后:", count); // 1，同步更新
}
```

### 批处理的影响

#### 多个 setState 的合并

```jsx
function handleClick() {
  // React 18 中，这些会被自动批处理
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);

  // 最终结果：count 只增加 1，而不是 3
}
```

#### 避免批处理

```jsx
function handleClick() {
  // 使用 flushSync 避免批处理
  flushSync(() => {
    setCount(count + 1);
  });

  flushSync(() => {
    setCount(count + 1);
  });

  // 最终结果：count 增加 2
}
```

### 最佳实践

1. **不要依赖 setState 的同步性**：始终认为 setState 是异步的
2. **使用回调函数**：当需要基于之前的状态更新时
   ```jsx
   setCount((prevCount) => prevCount + 1);
   ```
3. **使用 useEffect**：当需要在状态更新后执行副作用时
   ```jsx
   useEffect(() => {
     console.log("count 更新后:", count);
   }, [count]);
   ```
4. **避免在事件处理中直接读取状态**：使用函数式更新或 useEffect

:::

## 14. hook 为什么不能写在判断语句里面

:::details 点开

### Hook 的调用规则

React Hooks 必须遵循以下规则：

1. **只能在函数组件的顶层调用 Hook**
2. **不能在循环、条件或嵌套函数中调用 Hook**
3. **只能在 React 函数组件或自定义 Hook 中调用 Hook**

### 为什么不能写在判断语句里面

#### 1. Hook 调用顺序必须保持一致

React 依赖 Hook 的调用顺序来正确地将 state 与对应的 Hook 关联起来。如果 Hook 在条件语句中，会导致调用顺序不一致：

```jsx
// ❌ 错误示例
function MyComponent({ condition }) {
  const [count, setCount] = useState(0);

  if (condition) {
    const [name, setName] = useState(""); // 这个 Hook 可能不会执行
  }

  const [age, setAge] = useState(0);

  return <div>{count}</div>;
}
```

#### 2. Hook 内部使用链表存储状态

React 内部使用链表来存储每个 Hook 的状态。Hook 的调用顺序决定了它们在链表中的位置：

```jsx
// 第一次渲染
function MyComponent() {
  const [count, setCount] = useState(0); // Hook 1: 位置 0
  const [name, setName] = useState(""); // Hook 2: 位置 1
  const [age, setAge] = useState(0); // Hook 3: 位置 2
}

// 第二次渲染（如果条件变化）
function MyComponent() {
  const [count, setCount] = useState(0); // Hook 1: 位置 0
  // const [name, setName] = useState('');      // Hook 2: 位置 1 (缺失)
  const [age, setAge] = useState(0); // Hook 3: 位置 2 (但实际是 Hook 2)
}
```

#### 3. 具体问题示例

```jsx
// ❌ 错误示例
function BuggyComponent({ shouldShowName }) {
  const [count, setCount] = useState(0);

  if (shouldShowName) {
    const [name, setName] = useState(""); // 条件性 Hook
  }

  const [age, setAge] = useState(0);

  // 当 shouldShowName 从 true 变为 false 时
  // React 会认为 name 状态变成了 age 状态
  // 导致状态混乱
}
```

### 正确的解决方案

#### 1. 将条件逻辑移到 Hook 内部

```jsx
// ✅ 正确示例
function MyComponent({ condition }) {
  const [count, setCount] = useState(0);

  // 将条件逻辑移到 Hook 内部
  const [name, setName] = useState("");
  const displayName = condition ? name : "";

  const [age, setAge] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      {condition && <p>Name: {displayName}</p>}
      <p>Age: {age}</p>
    </div>
  );
}
```

#### 2. 使用条件渲染而不是条件 Hook

```jsx
// ✅ 正确示例
function MyComponent({ condition }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      {condition && <NameInput name={name} setName={setName} />}
      <p>Age: {age}</p>
    </div>
  );
}

function NameInput({ name, setName }) {
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
```

#### 3. 使用自定义 Hook 封装条件逻辑

```jsx
// ✅ 正确示例
function useConditionalState(condition, initialValue) {
  const [state, setState] = useState(initialValue);

  if (!condition) {
    return [initialValue, () => {}]; // 返回默认值和不做任何事的函数
  }

  return [state, setState];
}

function MyComponent({ condition }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useConditionalState(condition, "");
  const [age, setAge] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      {condition && <p>Name: {name}</p>}
      <p>Age: {age}</p>
    </div>
  );
}
```

### 总结

Hook 不能写在判断语句里面的根本原因是：

1. **React 依赖 Hook 的调用顺序来管理状态**
2. **Hook 内部使用链表存储，顺序变化会导致状态错乱**
3. **违反 Hook 规则会导致不可预测的行为和错误**

正确的做法是将条件逻辑移到 Hook 内部，或者使用条件渲染来替代条件 Hook。

:::

## 15. react-redux 在 react 和 redux 之间做了什么处理

:::details 点开

### 什么是 react-redux

react-redux 是将 React 和 Redux 有机关联的组件，它提供了 React 组件与 Redux store 之间的绑定，使得 React 组件能够读取 Redux 状态并分发 actions。

### 核心组件

#### 1. Provider 组件

Provider 是一个高阶组件，用于将 Redux store 注入到 React 组件树中：

```jsx
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducers";

const store = createStore(rootReducer);

function App() {
  return (
    <Provider store={store}>
      <TodoApp />
    </Provider>
  );
}
```

**Provider 的作用：**

1. **提供 store 的 getState, dispatch, subscribe 三个方法**
2. **使用 React Context API**，解决 store 数据在嵌套组件中使用一套数据的问题
3. **要求内部有且只能有一个组件**，这个使用到了 `Children(this.props.children)`

**Provider 的实现原理：**

```jsx
// 简化版的 Provider 实现
class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: props.store,
    };
  }

  render() {
    return Children.only(this.props.children);
  }

  getChildContext() {
    return {
      store: this.state.store,
    };
  }
}
```

#### 2. Connect 高阶组件

Connect 是一个高阶函数，通过 context 调用 store 里面暴露出来的方法，用于传递给组件，同时订阅组件的渲染事件：

```jsx
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  todos: state.todos,
  visibilityFilter: state.visibilityFilter,
});

const mapDispatchToProps = (dispatch) => ({
  addTodo: (text) => dispatch({ type: "ADD_TODO", text }),
  toggleTodo: (id) => dispatch({ type: "TOGGLE_TODO", id }),
});

const TodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoListComponent);
```

**Connect 的工作原理：**

```jsx
// 简化版的 connect 实现
function connect(mapStateToProps, mapDispatchToProps) {
  return function (WrappedComponent) {
    return class ConnectedComponent extends Component {
      constructor(props, context) {
        super(props, context);
        this.store = context.store;
        this.state = mapStateToProps(this.store.getState());
      }

      componentDidMount() {
        this.unsubscribe = this.store.subscribe(() => {
          this.setState(mapStateToProps(this.store.getState()));
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        const dispatchProps = mapDispatchToProps(this.store.dispatch);
        return (
          <WrappedComponent
            {...this.props}
            {...this.state}
            {...dispatchProps}
          />
        );
      }
    };
  };
}
```

### 现代 React Redux 用法（Hooks）

#### 1. useSelector Hook

```jsx
import { useSelector } from "react-redux";

function TodoList() {
  const todos = useSelector((state) => state.todos);
  const visibilityFilter = useSelector((state) => state.visibilityFilter);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

#### 2. useDispatch Hook

```jsx
import { useDispatch } from "react-redux";

function AddTodo() {
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "ADD_TODO", text: e.target.todo.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="todo" />
      <button type="submit">Add Todo</button>
    </form>
  );
}
```

### 数据流机制

#### 1. 状态读取流程

```
React 组件 → useSelector → Redux Store → getState() → 返回状态
```

#### 2. 状态更新流程

```
React 组件 → useDispatch → dispatch(action) → Reducer → 更新 Store → 通知订阅者 → 重新渲染组件
```

### 性能优化

#### 1. 浅比较优化

```jsx
// 使用 shallowEqual 进行浅比较
import { shallowEqual, useSelector } from "react-redux";

function TodoList() {
  const todos = useSelector(
    (state) => state.todos,
    shallowEqual // 只在引用变化时重新渲染
  );

  return <TodoItems todos={todos} />;
}
```

#### 2. 选择器优化

```jsx
import { createSelector } from "reselect";

const selectTodos = (state) => state.todos;
const selectVisibilityFilter = (state) => state.visibilityFilter;

const selectVisibleTodos = createSelector(
  [selectTodos, selectVisibilityFilter],
  (todos, visibilityFilter) => {
    switch (visibilityFilter) {
      case "SHOW_ALL":
        return todos;
      case "SHOW_COMPLETED":
        return todos.filter((todo) => todo.completed);
      case "SHOW_ACTIVE":
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  }
);

function TodoList() {
  const visibleTodos = useSelector(selectVisibleTodos);
  return <TodoItems todos={visibleTodos} />;
}
```

### 总结

react-redux 在 React 和 Redux 之间做了以下处理：

1. **使用 Context API**：通过 Provider 将 store 注入到组件树中
2. **状态订阅机制**：通过 Connect 或 Hooks 订阅 store 变化
3. **自动重新渲染**：当 store 状态变化时，自动触发组件重新渲染
4. **性能优化**：提供浅比较和选择器优化，避免不必要的重新渲染
5. **类型安全**：支持 TypeScript，提供完整的类型定义

:::

## 16. React 项目兼容低版本浏览器

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

## 17. React 有哪些常用的 hooks

::: details 点击
我们参考 [React18](https://react.dev/reference/react)

useCallback // 缓存函数 <br/>
useMemo // 缓存数据 <br/>
useContext // 读取和订阅 context 在组件中 <br/>
useEffect // 订阅更新 <br/>
useId // 生成唯一的 ID 可以传递给辅助功能属性 <br/>
useImperativeHandle // 配合 forwardRef 传递数据给父组件 <br/>
useLayoutEffect // 在浏览器重新绘制屏幕之前激发 <br/>
useEffect // 组件的一些异步操作 <br/>
useReducer // 添加一个 reducer 在你的组价内 <br/>
useRef // 生成一个改变不会触发组件更新的值 <br/>
useState // 生成一个状态变量在你的组件中 <br/>
useTransition // 在不影响浏览器渲染的情况下执行 <br/>
useDeferredValue // 允许您推迟更新 UI 的一部分 <br/>

useSyncExternalStore // 提供给第三方库比如 redux 可以同步拿到最新的数据 <br/>
useInsertionEffect // 在使用 css-in-js 会用到 插入样式在 DOM 渲染前 <br/>
useDebugValue // 配合 React DevTools 使用 <br/>
:::

## 18. react16 新增了哪些生命周期、有什么作用，为什么去掉某些 15 的生命周期

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

## 19. fiber 怎样的，如何实现异步渲染

::: details 点击
fiberRoot fiber workInProgress

[原理](https://18355166248.github.io/notes/ForentEnd/ReactSourceCode/Scheduler.html)
scheduler 包中调度原理, 也就是 React 两大工作循环中的任务调度循环. 并介绍了时间切片和可中断渲染等特性在任务调度循环中的实现. scheduler 包是 React 运行时的心脏, 为了提升调度性能, 注册 task 之前, 在 react-reconciler 包中做了节流和防抖等措施.
:::

## 20. redux 和 redux-saga 的区别和原理

::: details 点击

- redux: 状态管理的第三方实现
- redux-saga: 同 redux 一起使用，增强了 redux 的功能。之前 actions 返回一个对象，异步的 action 可以返回一个函数

  ```js
  export const initList = (list) => ({
    type: INIT_LIST,
    list,
  });

  export const getInitList = () => {
    return function (dispatch) {
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

## 21. useEffect 实现原理

::: details 点击

##### useEffect 的 hook 在 render 阶段会把 effect 放到 fiber 的 updateQueue 中，这是一个 lastEffect.next 串联的环形链表，然后 commit 阶段会异步执行所有 fiber 节点的 updateQueue 中的 effect。

useLayoutEffect 和 useEffect 差不多，区别只是它是在 commit 阶段的 layout 阶段同步执行所有 fiber 节点的 updateQueue 中的 effect。

##### useState 同样分为 mountState 和 updateState 两个阶段：

mountState 会返回 state 和 dispatch 函数，dispatch 函数里会记录更新到 hook.queue，然后标记当前 fiber 到根 fiber 的 lane 需要更新，之后调度下次渲染。

再次渲染的时候会执行 updateState，会取出 hook.queue，根据优先级确定最终的 state 返回，这样渲染出的就是最新的结果。
:::

## 22. react 组件如何做性能优化，说说 pureComponent

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

## 23. react diff 算法

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

## 24. react key 机制

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
3. newChildren 遍历完，oldFiber 没遍历完

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

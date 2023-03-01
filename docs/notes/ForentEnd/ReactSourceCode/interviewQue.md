# 面试题

### 1. setState 是同步还是异步 (react18)

所谓同步还是异步指的是调用 setState 之后是否马上能得到最新的 state
在 react18 中, 正常操作执行 setState 全部都是异步的了

<card-primary>
<div>为什么呢？</div>
</card-primary>

1. setState 设计为异步，可以显著提升性能

如果每次调用 setState 都进行一次更新，意味着 render 函数会被频繁调用，界面重新渲染，最好的方法就是获取到多个更新，之后批量进行更新

2. 如果同步更新了 state，但是还没有执行 render 函数，那么 state 和 props 不能保持同步

在 React18 之前：setState 在原生事件和定时器是同步，在合成事件和生命周期函数里面是异步的，原理:合成事件和生命周期函数调用顺序在批处理和更新之前，导致在合成事件和生命周期函数里没法立刻拿到更新后的值，导致形成所谓的异步

<card-primary>
<div>如何执行同步 (flushSync)</div>
</card-primary>

```ts
constructor(props) {
  this.state = {
    count: 0,
  };
}
add = () => {
  // setState 同步
  flushSync(() => {
    this.setState((state) => ({ count: state.count + 1 }));
    this.setState((state) => ({ count: state.count + 1 }));
  });
  console.log(this.state.count); // 1
  flushSync(() => {
    this.setState((state) => ({ count: state.count + 1 }));
  });
  console.log(this.state.count); // 2
};
```

#### 同步原理

flushSync 是在 src/react/packages/react-reconciler/src/ReactFiberWorkLoop.old.js 下

```js
export function flushSync(fn) {
  const prevExecutionContext = executionContext;
  executionContext |= BatchedContext;

  const prevTransition = ReactCurrentBatchConfig.transition;
  const previousPriority = getCurrentUpdatePriority();

  try {
    ReactCurrentBatchConfig.transition = null;
    setCurrentUpdatePriority(DiscreteEventPriority);
    if (fn) {
      return fn(); // flushSync 的第一个回调函数
    } else {
      return undefined;
    }
  } finally {
    setCurrentUpdatePriority(previousPriority);
    ReactCurrentBatchConfig.transition = prevTransition;

    executionContext = prevExecutionContext;
    // Flush the immediate callbacks that were scheduled during this batch.
    // Note that this will happen even if batchedUpdates is higher up
    // the stack.
    if ((executionContext & (RenderContext | CommitContext)) === NoContext) {
      flushSyncCallbacks(); // 执行同步任务  任务注册是在 src/react/packages/react-reconciler/src/ReactFiberWorkLoop.old.js (ensureRootIsScheduled) 中 也就是渲染逻辑 直接会渲染到页面上
    }
  }
}
```

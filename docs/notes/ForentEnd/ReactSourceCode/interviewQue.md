---
sidebarDepth: 1
---

# 面试题

- [面试题](#面试题)
  - [1. setState 是同步还是异步 (react18)](#1-setstate-是同步还是异步-react18)
      - [同步原理](#同步原理)
  - [class 组件生命周期有哪些?](#class-组件生命周期有哪些)
    - [Initialization 初始化阶段](#initialization-初始化阶段)
    - [Mounting：挂载阶段](#mounting挂载阶段)
    - [Updation：更新阶段](#updation更新阶段)
    - [Unmounting 卸载阶段](#unmounting-卸载阶段)
    - [额外的](#额外的)
  - [重复调用 setState 会发生什么](#重复调用-setstate-会发生什么)
  - [什么是 fiber 架构?](#什么是-fiber-架构)
  - [调和算法具体干什么的?](#调和算法具体干什么的)
    - [主要作用](#主要作用)
    - [基本原理](#基本原理)
  - [useState()如何实现数据持久化?](#usestate如何实现数据持久化)
  - [useEffect()会有内存泄漏吗?](#useeffect会有内存泄漏吗)
  - [useEffect(function, deps)中第二个参数表示依赖项, 如何实现依赖项的对比?](#useeffectfunction-deps中第二个参数表示依赖项-如何实现依赖项的对比)

## 1. setState 是同步还是异步 (react18)

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

## class 组件生命周期有哪些?

React生命周期的四大阶段：

1. Initialization： 初始化阶段
2. Mounting：挂载阶段
3. Updation： 更新阶段
4. Unmounting： 销毁阶段

### Initialization 初始化阶段

其实这个阶段做的事情就是初始化。初始化属性props和状态state。

### Mounting：挂载阶段

Mounting阶段叫挂载阶段，伴随整个虚拟DOM的声明。它里面有三个小的生命周期函数，分别是：

1. UNSAFE_componentWillMount() 在组件即将被挂载到页面的时候执行
2. render：页面state或props发生变化时执行
3. componentDidMount：组件挂载完成之后执行

### Updation：更新阶段

Updation会在组件发生改变的时候执行。是生命周期中比较复杂的一个部分，由两个部分组成：一个是props属性改变，一个是state状态改变

1. shouldComponentUpdate 函数 该函数会在组件更新之前，自动被执行
2. UNSAFE_componentWillUpdate(nextProps, nextState)  该函数在组件更新之前，但shouldComponentUpdate之后被执行，如果shouldComponentUpdate返回false，那么该函数就不会被执行
3. componentDidUpdate(prevProps, prevState, snapshot?) 该函数在组件更新之后执行，它是组件更新的最后一个环节
4. UNSAFE_componentWillReceiveProps(nextProps, nextContext) 子组件接收父组件传递过来的参数，父组件render函数重新被执行，这个生命周期函数就会被执行

### Unmounting 卸载阶段

1. componentWillUnmount() 这个函数是组件从页面中删除时执行


### 额外的

1. componentDidCatch(error, info) 子组件报错的情况下回触发父组件该函数
2. static getDerivedStateFromError(error) 作为类组件的静态方法使用，子组件报错直接执行
3. static getDerivedStateFromProps(props, state)  从props中获取state
4. getSnapshotBeforeUpdate(prevProps, prevState)  获取更新之前的快照 此生命周期方法返回的任何值都将作为参数传递给componentDidUpdate

## 重复调用 setState 会发生什么

连续多次调动 setState 会多次触发 ensureRootIsScheduled

```js
function ensureRootIsScheduled (root: FiberRoot, currentTime: number) {
  // 前半部分: 判断是否需要注册新的调度 这里做了节流防抖操作 避免多次调用 优化性能
  const existingCallbackNode = root.callbackNode;

  // Determine the next lanes to work on, and their priority.
  // 调用 getNextLanes 计算出在本次更新中应该处理的这批lanes (nextLanes)，从而确定下一个要工作的lane车道及其优先级。
  // 任务优先级计算的原理是这样的：存储在root对象上的lanes (expiredLanes、suspendedLanes、pingedLanes等) 经过 getNextLanes 处理后，挑出那些当前需要紧急处理的 lanes，然后将这些lanes传入 getHighestPriorityLane 中，找出这些lanes的优先级，作为任务优先级。
  const nextLanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes,
  );

  // We use the highest priority lane to represent the priority of the callback.
  // 分离出最高优先级
  const newCallbackPriority = getHighestPriorityLane(nextLanes);

  // Check if there's an existing task. We may be able to reuse it.
  // 节流防抖
  // 上一个 newCallbackPriority
  const existingCallbackPriority = root.callbackPriority;
  // 判断当前的优先级 是不是等于之前任务优先级 如果等于 那就不要新建任务了
  // 如果多次调用setState 这里会拦截 不会注册多个任务 而是沿用之前的任务
  if (
    existingCallbackPriority === newCallbackPriority &&
    // Special case related to `act`. If the currently scheduled task is a
    // Scheduler task, rather than an `act` task, cancel it and re-scheduled
    // on the `act` queue.
    !(
      __DEV__ &&
      ReactCurrentActQueue.current !== null &&
      existingCallbackNode !== fakeActCallbackNode
    )
  ) {
    // The priority hasn't changed. We can reuse the existing task. Exit.
    return;
  }

   // 后半部分: 注册调度任务
  // Schedule a new callback.
  let newCallbackNode;
  if (newCallbackPriority === SyncLane) {
    // Special case: Sync React callbacks are scheduled on a special
    // internal queue
    // 同步情况下 将更新fiber构造方法放进 syncQueue 队列中
    if (root.tag === LegacyRoot) {
      if (__DEV__ && ReactCurrentActQueue.isBatchingLegacy !== null) {
        ReactCurrentActQueue.didScheduleLegacyUpdate = true;
      }
      scheduleLegacySyncCallback(performSyncWorkOnRoot.bind(null, root));
    } else {
      scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
    }
    if (supportsMicrotasks) {
      // Flush the queue in a microtask.
      if (__DEV__ && ReactCurrentActQueue.current !== null) {
        // Inside `act`, use our internal `act` queue so that these get flushed
        // at the end of the current scope even when using the sync version
        // of `act`.
        ReactCurrentActQueue.current.push(flushSyncCallbacks);
      } else {
        // 这里就是 setTimeout 执行一个宏任务 也就是在 flushSyncCallbacks 内部批量处理 多个 setState的回调
        scheduleMicrotask(() => {
          // In Safari, appending an iframe forces microtasks to run.
          // https://github.com/facebook/react/issues/22459
          // We don't support running callbacks in the middle of render
          // or commit so we need to check against that.
          if (
            (executionContext & (RenderContext | CommitContext)) ===
            NoContext
          ) {
            // Note that this would still prematurely flush the callbacks
            // if this happens outside render or commit phase (e.g. in an event).
            flushSyncCallbacks();
          }
        });
      }
    } else {
      // 不支持微任务的话 刷新即时任务中的队列。
      // Flush the queue in an Immediate task.
      scheduleCallback(ImmediateSchedulerPriority, flushSyncCallbacks);
    }
    newCallbackNode = null;
  } else {
    // 异步任务
  }
  // ...省略
}
```

<card-primary>
<div>
我们具体看下 flushSyncCallbacks 下面做了什么事情
</div>
</card-primary>

```js
// 自下而上
getStateFromUpdate // 这里执行每一个 setState回调
processUpdateQueue // 在这步批量执行setState的回调
updateClassInstance
updateClassComponent
beginWork
performUnitOfWork
workLoopSync
renderRootSync
performSyncWorkOnRoot
flushSyncCallbacks
```

## 什么是 fiber 架构?

React Fiber 是 React 核心算法的重新实现。
它的主要特点是渐进式渲染: 能够将渲染工作分割成块，并将其分散到多个帧。

- Fiber 树由链表构成，节点间通过 return（父节点）、child（第一个子节点）、sibling（下一个兄弟节点）相连。
- 当前视图对应的 Fiber 树称为 current 树，每次协调发起，都会构建新的 workInProgress 树，并在结束时替换 current 树。
- Fiber 树的遍历方式是深度优先遍历，向下的过程由 beginWork 发起，向上的过程由 completeUnitOfWork 发起。beginWork 每次只向下一步，completeUnitOfWork 则每次向上若干步（由其内部若干个一步循环达成）。
- Fiber 树是边构建边遍历的，构建在 beginWork 向下过程中发起。
- Fiber 树的 Diffing 策略体现在构建过程中：父节点已复用、key 和 type 相同是节点复用的基本条件；子节点 Diffing 从易向难，单节点 Diffing —> 多节点末尾增删（一轮循环） —> 多节点其他情况（二轮循环）。
- Diffing 的结果，诸如节点的删除、新增、移动，称为 effect，以 effectTag 的形式挂在节点上。
- completeUnitOfWork 的内部循环会自底向上收集 effect，不断把有 effectTag 的子节点和自身向上合并到父节点的 effectList 中，直至根节点。effectList 是个链表。
- 宿主相关组件节点会把宿主实例挂到 stateNode 上，间接调用宿主方法对其完成创建、更新，由此也会产生 effectTag。

## 调和算法具体干什么的?

### 主要作用

1. 给新增,移动,和删除节点设置fiber.flags(新增, 移动: Placement, 删除: Deletion)
2. 如果是需要删除的fiber, 除了自身打上Deletion之外, 还要将其添加到父节点的effects链表中(正常副作用队列的处理是在completeWork函数, 但是该节点(被删除)会脱离fiber树, 不会再进入completeWork阶段, 所以在beginWork阶段提前加入副作用队列).

### 基本原理

1. 比较对象: fiber对象与ReactElement对象相比较.
   - 注意: 此处有一个误区, 并不是两棵 fiber 树相比较, 而是旧fiber对象与新ReactElement对象向比较, 结果生成新的fiber子节点.
   - 可以理解为输入ReactElement, 经过reconcileChildren()之后, 输出fiber.

2. 比较方案

   - 单节点比较
   - 可迭代节点比较

## useState()如何实现数据持久化?

通过闭包的方式 生成一个 hook (src/react/packages/react-reconciler/src/ReactFiberHooks.old.js mountWorkInProgressHook)

并且将其放在对应 Fiber.memoizedState 上, 并生成一个 queue 将其放在 fiber.queue 上, 实现数据持久化

```js
function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  // 1. 创建hook
  // 这个 hook 就是 fiber.memoizedState
  const hook = mountWorkInProgressHook();
  if (typeof initialState === 'function') {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue: UpdateQueue<S, BasicStateAction<S>> = {
    pending: null,
    interleaved: null,
    lanes: NoLanes,
    dispatch: null,
    // 唯一的不同点是hook.queue.lastRenderedReducer 这里使用的是内置的   mountReducer使用的是外部传入自定义reducer
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  };
  hook.queue = queue;
  const dispatch: Dispatch<
    BasicStateAction<S>,
  > = (queue.dispatch = (dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ): any));
  return [hook.memoizedState, dispatch];
}
```

## useEffect()会有内存泄漏吗?

useEffect 也提供了类似于 componentWillUnmount 的方法 避免内存泄漏

## useEffect(function, deps)中第二个参数表示依赖项, 如何实现依赖项的对比?

通过 areHookInputsEqual(nextDeps, prevDeps) 进行对比

```js
// src/react/packages/shared/objectIs.js
function is(x: any, y: any) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y)
  );
}
// src/react/packages/react-reconciler/src/ReactFiberHooks.old.js
function areHookInputsEqual(
  nextDeps: Array<mixed>,
  prevDeps: Array<mixed> | null,
) {
  // 如果没有 直接返回 false
  if (prevDeps === null) {
    return false;
  }
  // 循环两个 deps 浅比较
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}

```

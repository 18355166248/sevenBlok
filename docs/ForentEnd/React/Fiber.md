# 完全理解 Fiber

> 借鉴文章 ![完全理解React Fiber](http://www.ayqy.net/blog/dive-into-react-fiber/)

> ![这可能是最通俗的 React Fiber(时间分片) 打开方式](https://juejin.cn/post/6844903975112671239#heading-10)

## Fiber reconciler

reconcile 过程分为 2 个阶段（phase）：

1. （可中断）render/reconciliation 通过构造 workInProgress tree 得出 change

2. （不可中断）commit 应用这些 DOM change

### render/reconciliation

以 fiber tree 为蓝本，把每个 fiber 作为一个工作单元，自顶向下逐节点构造 workInProgress tree（构建中的新 fiber tree）

具体过程如下（以组件节点为例）：

1. 如果当前节点不需要更新，直接把子节点 clone 过来，跳到 5；要更新的话打个 tag

2. 更新当前节点状态（props, state, context 等）

3. 调用 shouldComponentUpdate()，false 的话，跳到 5

4. 调用 render()获得新的子节点，并为子节点创建 fiber（创建过程会尽量复用现有 fiber，子节点增删也发生在这里）

5. 如果没有产生 child fiber，该工作单元结束，把 effect list 归并到 return，并把当前节点的 sibling 作为下一个工作单元；否则把 child 作为下一个工作单元

6. 如果没有剩余可用时间了，等到下一次主线程空闲时才开始下一个工作单元；否则，立即开始做

7. 如果没有下一个工作单元了（回到了 workInProgress tree 的根节点），第 1 阶段结束，进入 pendingCommit 状态

实际上是 1-6 的工作循环，7 是出口，工作循环每次只做一件事，做完看要不要喘口气。工作循环结束时，workInProgress tree 的根节点身上的 effect list 就是收集到的所有 side effect（因为每做完一个都向上归并）

所以，构建 workInProgress tree 的过程就是 diff 的过程，通过 requestIdleCallback 来调度执行一组任务，每完成一个任务后回来看看有没有插队的（更紧急的），每完成一组任务，把时间控制权交还给主线程，直到下一次 requestIdleCallback 回调再继续构建 workInProgress tree

### commit

第 2 阶段直接一口气做完：

1. 处理 effect list（包括 3 种处理：更新 DOM 树、调用组件生命周期函数以及更新 ref 等内部状态）

2. 出对结束，第 2 阶段结束，所有更新都 commit 到 DOM 树上了

注意，真的是一口气做完（同步执行，不能喊停）的，这个阶段的实际工作量是比较大的，所以尽量不要在后 3 个生命周期函数里干重活儿

### 生命周期 hook

生命周期函数也被分为 2 个阶段了：

```
// 第 1 阶段 render/reconciliation
componentWillMount
componentWillReceiveProps
shouldComponentUpdate
componentWillUpdate

// 第 2 阶段 commit
componentDidMount
componentDidUpdate
componentWillUnmount

```

第 1 阶段的生命周期函数可能会被多次调用，默认以 low 优先级（后面介绍的 6 种优先级之一）执行，被高优先级任务打断的话，稍后重新执行

## fiber tree 与 workInProgress tree

双缓冲技术（double buffering），就像 redux 里的 nextListeners，以 fiber tree 为主，workInProgress tree 为辅

双缓冲具体指的是 workInProgress tree 构造完毕，得到的就是新的 fiber tree，然后喜新厌旧（把 current 指针指向 workInProgress tree，丢掉旧的 fiber tree）就好了

这样做的好处：

能够复用内部对象（fiber）

节省内存分配、GC 的时间开销

## 优先级策略

每个工作单元运行时有 6 种优先级：

- synchronous 与之前的 Stack reconciler 操作一样，同步执行

- task 在 next tick 之前执行

- animation 下一帧之前执行

- high 在不久的将来立即执行

- low 稍微延迟（100-200ms）执行也没关系

- offscreen 下一次 render 时或 scroll 时才执行

synchronous 首屏（首次渲染）用，要求尽量快，不管会不会阻塞 UI 线程。animation 通过 requestAnimationFrame 来调度，这样在下一帧就能立即开始动画过程；后 3 个都是由 requestIdleCallback 回调执行的；offscreen 指的是当前隐藏的、屏幕外的（看不见的）元素

高优先级的比如键盘输入（希望立即得到反馈），低优先级的比如网络请求，让评论显示出来等等。另外，紧急的事件允许插队

这样的优先级机制存在 2 个问题：

生命周期函数怎么执行（可能被频频中断）：触发顺序、次数没有保证了

starvation（低优先级饿死）：如果高优先级任务很多，那么低优先级任务根本没机会执行（就饿死了）

生命周期函数的问题有一个官方例子：

```js
low A
componentWillUpdate()
---
high B
componentWillUpdate()
componentDidUpdate()
---
restart low A
componentWillUpdate()
componentDidUpdate()
```

第 1 个问题正在解决（还没解决），生命周期的问题会破坏一些现有 App，给平滑升级带来困难，Fiber 团队正在努力寻找优雅的升级途径

第 2 个问题通过尽量复用已完成的操作（reusing work where it can）来缓解，听起来也是正在想办法解决

这两个问题本身不太好解决，只是解决到什么程度的问题。比如第一个问题，如果组件生命周期函数掺杂副作用太多，就没有办法无伤解决。这些问题虽然会给升级 Fiber 带来一定阻力，但绝不是不可解的（退一步讲，如果新特性有足够的吸引力，第一个问题大家自己想办法就解决了）

## 总结

### 问题

#### 1. 拆什么？什么不能拆？

render/reconciliation 阶段的工作（diff）可以拆分，commit 阶段的工作（patch）不可拆分

#### 2. 怎么拆？

先凭空乱来几种 diff 工作拆分方案：

按组件结构拆。不好分，无法预估各组件更新的工作量

按实际工序拆。比如分为 getNextState(), shouldUpdate(), updateState(), checkChildren()再穿插一些生命周期函数

按组件拆太粗，显然对大组件不太公平。按工序拆太细，任务太多，频繁调度不划算。那么有没有合适的拆分单位？

有。Fiber 的拆分单位是 fiber（fiber tree 上的一个节点），实际上就是按虚拟 DOM 节点拆，因为 fiber tree 是根据 vDOM tree 构造出来的，树结构一模一样，只是节点携带的信息有差异

所以，实际上是 vDOM node 粒度的拆分（以 fiber 为工作单元），每个组件实例和每个 DOM 节点抽象表示的实例都是一个工作单元。工作循环中，每次处理一个 fiber，处理完可以中断/挂起整个工作循环

### 3. 如何调度任务？

分 2 部分：

工作循环

优先级机制

基本规则是：每个工作单元结束检查是否还有时间做下一个，没时间了就先“挂起”

优先级机制用来处理突发事件与优化次序，例如：

- 到 commit 阶段了，提高优先级

- 高优任务做一半出错了，给降一下优先级

- 抽空关注一下低优任务，别给饿死了

- 如果对应 DOM 节点此刻不可见，给降到最低优先级

#### 4. 如何中断/断点恢复？

中断：检查当前正在处理的工作单元，保存当前成果（firstEffect, lastEffect），修改 tag 标记一下，迅速收尾并再开一个 requestIdleCallback，下次有机会再做

断点恢复：下次再处理到该工作单元时，看 tag 是被打断的任务，接着做未完成的部分或者重做

#### 5. 如何收集任务结果?

Fiber reconciliation 的工作循环具体如下：

1. 找到根节点优先级最高的 workInProgress tree，取其待处理的节点（代表组件或 DOM 节点）

2. 检查当前节点是否需要更新，不需要的话，直接到 4

3. 标记一下（打个 tag），更新自己（组件更新 props，context 等，DOM 节点记下 DOM change），并为孩子生成 workInProgress node

4. 如果没有产生子节点，归并 effect list（包含 DOM change）到父级

5. 把孩子或兄弟作为待处理节点，准备进入下一个工作循环。如果没有待处理节点（回到了 workInProgress tree 的根节点），工作循环结束

通过每个节点更新结束时向上归并 effect list 来收集任务结果，reconciliation 结束后，根节点的 effect list 里记录了包括 DOM change 在内的所有 side effect


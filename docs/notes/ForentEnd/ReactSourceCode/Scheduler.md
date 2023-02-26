# Scheduler

[参考地址](https://7kms.github.io/react-illustration-series/main/scheduler)

## 调度实现

调度中心最核心的代码, 在 src/react/packages/scheduler/src/forks/Scheduler.js 下

```js
export let requestHostCallback; // 请求及时回调: port.postMessage
export let requestHostTimeout; // 请求延时回调: setTimeout
export let cancelHostTimeout; // 取消延时回调: cancelTimeout
export let shouldYieldToHost; // 是否让出主线程((currentTime >= frameInterval && needsPaint) || navigator.scheduling.isInputPending): 让浏览器能够执行更高优先级的任务(如ui绘制, 用户输入等)
export let requestPaint; // 请求绘制: 设置 needsPaint = true
export let getCurrentTime; // 获取当前时间
export let forceFrameRate; // 强制设置 frameInterval (设置时间切片的周期)
```

我们知道 react 可以在 nodejs 环境中使用, 所以在不同的 js 执行环境中, 这些函数的实现会有区别. 下面基于普通浏览器环境, 对这 7 个函数逐一分析 :

### 请求调度

- performWorkUntilDeadline
- schedulePerformWorkUntilDeadline
- requestHostCallback

```ts
//  创建任务之后, 最后请求调度requestHostCallback(flushWork)(创建任务源码中的第 5 步), flushWork函数作为参数被传入调度中心内核等待回调. requestHostCallback函数在上文调度内核中已经介绍过了, 在调度中心中, 只需下一个事件循环就会执行回调, 最终执行 flushWork.
const performWorkUntilDeadline = () => {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime(); // 获取当时时间
    // Keep track of the start time so we can measure how long the main thread
    // has been blocked.
    startTime = currentTime;
    const hasTimeRemaining = true;

    let hasMoreWork = true;
    try {
      // 这里的 scheduledHostCallback 等于 flushWork
      // 执行回调, 返回是否有还有剩余任务
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
    } finally {
      if (hasMoreWork) {
        // If there's more work, schedule the next message event at the end
        // of the preceding one.
        schedulePerformWorkUntilDeadline();
      } else {
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    isMessageLoopRunning = false;
  }
  // Yielding to the browser will give it a chance to paint, so we can
  // reset this.
  needsPaint = false;
};

// 我们更喜欢 MessageChannel 因为只有 4ms 的延迟
const channel = new MessageChannel();
const port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;
// 执行 schedulePerformWorkUntilDeadline 就会触发 performWorkUntilDeadline
schedulePerformWorkUntilDeadline = () => {
  port.postMessage(null);
};

function requestHostCallback(callback) {
  // scheduledHostCallback 会在 performWorkUntilDeadline 中执行
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    schedulePerformWorkUntilDeadline();
  }
}
```

很明显, 请求执行 requestHostCallback 回调之后 scheduledHostCallback = callback, 然后通过 MessageChannel 发消息的方式触发 performWorkUntilDeadline 函数, 最后执行回调 scheduledHostCallback.

此处需要注意: MessageChannel 在浏览器事件循环中属于宏任务, 所以调度中心永远是异步执行回调函数.

### 2. 时间切片

- getCurrentTime: 获取当前时间
- shouldYieldToHost: 是否让出主线程
- requestPaint: 请求绘制
- forceFrameRate: 强制设置 yieldInterval 设置时间切片的周期

```ts
let getCurrentTime;
// 判断当前浏览器支付支持 performance
const hasPerformanceNow =
  typeof performance === "object" && typeof performance.now === "function";

if (hasPerformanceNow) {
  const localPerformance = performance;
  getCurrentTime = () => localPerformance.now();
} else {
  const localDate = Date;
  const initialTime = localDate.now();
  getCurrentTime = () => localDate.now() - initialTime;
}

// 时间切片周期, 默认是5ms(如果一个task运行超过该周期, 下一个task执行之前, 会把控制权归还浏览器)
let frameInterval = frameYieldMs; // 5
const continuousInputInterval = continuousYieldMs; // 50
const maxInterval = maxYieldMs; // 300
const continuousOptions = { includeContinuous: true | false };

function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime;
  if (timeElapsed < frameInterval) {
    // 主线程只是被阻塞了很短的时间, 小于单个帧, 不要屈服
    return false;
  }

  if (enableIsInputPending) {
    if (needsPaint) {
      // 强制让出主线程
      return true;
    }
    if (timeElapsed < continuousInputInterval) {
      // 50ms以上 直接执行判断是否是正在输入 决定是否让出主线程
      if (isInputPending !== null) {
        return isInputPending();
      }
    } else if (timeElapsed < maxInterval) {
      // 如果是 300ms 以上 加上 continuousOptions 判断是不是用户正在连续输入
      if (isInputPending !== null) {
        return isInputPending(continuousOptions);
      }
    } else {
      return true;
    }
  }

  return true;
}

// 请求绘制
function requestPaint() {
  if (
    enableIsInputPending &&
    navigator !== undefined &&
    navigator.scheduling !== undefined &&
    navigator.scheduling.isInputPending !== undefined
  ) {
    needsPaint = true;
  }

  // Since we yield every frame regardless, `requestPaint` has no effect.
}

// 设置时间切片的周期
function forceFrameRate(fps) {
  if (fps < 0 || fps > 125) {
    // Using console['error'] to evade Babel and ESLint
    console["error"](
      "forceFrameRate takes a positive int between 0 and 125, " +
        "forcing frame rates higher than 125 fps is not supported"
    );
    return;
  }
  if (fps > 0) {
    frameInterval = Math.floor(1000 / fps);
  } else {
    // reset the framerate
    frameInterval = frameYieldMs;
  }
}
```

navigator.scheduling.isInputPending(): 这 facebook 官方贡献给 Chromium 的 api, 现在已经列入 W3C 标准([具体解释](https://engineering.fb.com/2019/04/22/developer-tools/isinputpending-api/)), 用于判断是否有输入事件(包括: input 框输入事件, 点击事件等).

调度中心的内核实现图:

![](@public/React/scheduler.png)

### 任务队列管理

通过上文的分析, 我们已经知道请求和取消调度的实现原理. 调度的目的是为了消费任务, 接下来就具体分析任务队列是如何管理与实现的.

在 Scheduler.js 中, 维护了一个 taskQueue, 任务队列管理就是围绕这个 taskQueue 展开.

```js
var taskQueue = []; // 任务队列 是一个小顶堆数组
var timerQueue = []; // 这个队列是预留给延时任务使用的
```

主要代码在 src/react/packages/scheduler/src/forks/Scheduler.js 下

注意:

- taskQueue 是一个小顶堆数组, 关于堆排序的详细解释, 可以查看 React 算法之堆排序.
- 源码中除了 taskQueue 队列之外还有一个 timerQueue 队列. 这个队列是预留给延时任务使用的, 在 react@17.0.2 版本里面, 从源码中的引用来看, 算一个保留功能, 没有用到.

#### 创建任务

先看 unstable_scheduleCallback 方法

```ts
function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = getCurrentTime(); // 1. 获取当前时间
  var startTime;
  if (typeof options === "object" && options !== null) {
    var delay = options.delay;
    if (typeof delay === "number" && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }
  // 2. 根据传入的优先级, 设置任务的过期时间 expirationTime
  var timeout;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;
    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
      break;
    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;
      break;
    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;
      break;
    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT;
      break;
  }
  var expirationTime = startTime + timeout;
  // 3. 创建新任务
  var newTask = {
    id: taskIdCounter++, // id: 一个自增编号
    callback, // callback: 传入的回调函数
    priorityLevel, // priorityLevel: 优先级等级
    startTime, // startTime: 创建task时的当前时间
    expirationTime, // expirationTime: task的过期时间, 优先级越高 expirationTime = startTime + timeout 越小
    sortIndex: -1,
  };
  if (enableProfiling) {
    newTask.isQueued = false;
  }

  if (startTime > currentTime) {
    // This is a delayed task.
    // 这是一个延迟任务
    newTask.sortIndex = startTime;
    // 4. 加入延迟任务队列
    push(timerQueue, newTask);
    // 这里判断是不是 taskQueue 为空 且 timerQueue 只有一个上面新建的任务  也就是说判断是否只有一个任务 如果是的话
    // 取消上一个settimeout 生成新的宏任务延时执行
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // All tasks are delayed, and this is the task with the earliest delay.
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      // Schedule a timeout. 使用一个宏任务 请求延迟回调
      // 目的就是延迟执行任务 requestHostCallback
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    // sortIndex: 排序索引, 全等于过期时间. 保证过期时间越小, 越紧急的任务排在最前面
    newTask.sortIndex = expirationTime;
    // 4. 加入实时任务队列
    push(taskQueue, newTask);
    if (enableProfiling) {
      markTaskStart(newTask, currentTime);
      newTask.isQueued = true;
    }
    // Schedule a host callback, if needed. If we're already performing work,
    // wait until the next time we yield.
    // 5. 请求调度
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}
```

#### 消费任务

创建任务之后, 最后请求调度 requestHostCallback(flushWork)(创建任务源码中的第 5 步), flushWork 函数作为参数被传入调度中心内核等待回调. requestHostCallback 函数在上文调度内核中已经介绍过了, 在调度中心中, 只需下一个事件循环就会执行回调, 最终执行 flushWork.

```ts
function flushWork(hasTimeRemaining, initialTime) {
  if (enableProfiling) {
    markSchedulerUnsuspended(initialTime);
  }
  // 1. 做好全局标记, 表示现在已经进入调度阶段
  // We'll need a host callback the next time work is scheduled.
  isHostCallbackScheduled = false;
  if (isHostTimeoutScheduled) {
    // We scheduled a timeout but it's no longer needed. Cancel it.
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  isPerformingWork = true;
  const previousPriorityLevel = currentPriorityLevel;
  try {
    if (enableProfiling) {
      try {
        // 2. 循环消费队列 任务调度循环
        return workLoop(hasTimeRemaining, initialTime);
      } catch (error) {
        if (currentTask !== null) {
          const currentTime = getCurrentTime();
          markTaskErrored(currentTask, currentTime);
          currentTask.isQueued = false;
        }
        throw error;
      }
    } else {
      // No catch in prod code path.
      return workLoop(hasTimeRemaining, initialTime);
    }
  } finally {
    // 3. 还原全局标记
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
    if (enableProfiling) {
      const currentTime = getCurrentTime();
      markSchedulerSuspended(currentTime);
    }
  }
}

// workLoop就是一个大循环, 虽然代码也不多, 但是非常精髓, 在此处实现了时间切片(time slicing)和fiber树的可中断渲染. 这 2 大特性的实现, 都集中于这个while循环.
function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime; // 保存当前时间, 用于判断任务是否过期
  advanceTimers(currentTime);
  currentTask = peek(taskQueue); // 获取队列中的第一个任务
  while (
    currentTask !== null &&
    !(enableSchedulerDebugging && isSchedulerPaused)
  ) {
    // 虽然currentTask没有过期, 但是执行时间超过了限制(毕竟只有5ms, shouldYieldToHost()返回true). 停止继续执行, 让出主线程
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      // This currentTask hasn't expired, and we've reached the deadline.
      break;
    }
    const callback = currentTask.callback;
    if (typeof callback === "function") {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      if (enableProfiling) {
        markTaskRun(currentTask, currentTime);
      }
      // 执行回调
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();
      // 回调完成, 判断是否还有连续(派生)回调
      if (typeof continuationCallback === "function") {
        // 产生了连续回调(如fiber树太大, 出现了中断渲染), 保留 currentTask
        currentTask.callback = continuationCallback;
        if (enableProfiling) {
          markTaskYield(currentTask, currentTime);
        }
      } else {
        if (enableProfiling) {
          markTaskCompleted(currentTask, currentTime);
          currentTask.isQueued = false;
        }
        // 把currentTask移出队列
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }
      advanceTimers(currentTime);
    } else {
      // 如果任务被取消(这时currentTask.callback = null), 将其移出队列
      pop(taskQueue);
    }
    // 更新currentTask
    currentTask = peek(taskQueue);
  }
  // Return whether there's additional work
  // 如果task队列没有清空, 返回true. 等待调度中心下一次回调
  if (currentTask !== null) {
    return true; // 这里也就是赋值给 hasMoreWork 判断是否还有任务 继续执行 postmessage
  } else {
    // 这里判断延迟任务队列是否为空  如果不为空 延迟执行 判断继续下一次 requestHostCallback
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    // task队列已经清空, 返回false.
    return false; // 这里也就是赋值给 hasMoreWork 判断是否还有任务 继续执行 postmessage
  }
}
```

每一次 while 循环的退出就是一个时间切片, 深入分析 while 循环的退出条件:

- 队列被完全清空: 这种情况就是很正常的情况, 一气呵成, 没有遇到任何阻碍.
- 执行超时: 在消费 taskQueue 时, 在执行 task.callback 之前, 都会检测是否超时, 所以超时检测是以 task 为单位.
- 如果某个 task.callback 执行时间太长(如: fiber 树很大, 或逻辑很重)也会造成超时
- 所以在执行 task.callback 过程中, 也需要一种机制检测是否超时, 如果超时了就立刻暂停 task.callback 的执行.

##### 时间切片原理

消费任务队列的过程中, 可以消费 1~n 个 task, 甚至清空整个 queue. 但是在每一次具体执行 task.callback 之前都要进行超时检测, 如果超时可以立即退出循环并等待下一次调用.

##### 可中断渲染原理

在时间切片的基础之上, 如果单个 task.callback 执行时间就很长(假设 200ms). 就需要 task.callback 自己能够检测是否超时, 所以在 fiber 树构造过程中, 每构造完成一个单元, 都会检测一次超时(源码链接), 如遇超时就退出 fiber 树构造循环, 并返回一个新的回调函数(就是此处的 continuationCallback)并等待下一次回调继续未完成的 fiber 树构造.

### 节流防抖 {#throttle-debounce}

通过上文的分析, 已经覆盖了 scheduler 包中的核心原理. 现在再次回到 react-reconciler 包中, 在调度过程中的关键路径中, 我们还需要理解一些细节.

在 reconciler 运作流程中总结的 4 个阶段中, 注册调度任务属于第 2 个阶段, 核心逻辑位于 ensureRootIsScheduled 函数中. 现在我们已经理解了调度原理, 再次分析 ensureRootIsScheduled(源码地址):

```ts
// 每次更新都会调用此函数
// exiting a task.
function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
  const existingCallbackNode = root.callbackNode;

  // Check if any lanes are being starved by other work. If so, mark them as
  // expired so we know to work on those next.
  markStarvedLanesAsExpired(root, currentTime);

  // Determine the next lanes to work on, and their priority.
  const nextLanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes
  );
  // 判断如果没有需要更新的 直接停止新建任务
  if (nextLanes === NoLanes) {
    // Special case: There's nothing to work on.
    // 没有需要工作的
    if (existingCallbackNode !== null) {
      cancelCallback(existingCallbackNode);
    }
    root.callbackNode = null;
    root.callbackPriority = NoLane;
    return;
  }

  // We use the highest priority lane to represent the priority of the callback.
  const newCallbackPriority = getHighestPriorityLane(nextLanes);

  // Check if there's an existing task. We may be able to reuse it.
  // 节流防抖
  const existingCallbackPriority = root.callbackPriority;
  // 判断当前的优先级 是不是等于之前任务优先级 如果等于 那就不要新建任务了
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
    if (__DEV__) {
      // If we're going to re-use an existing task, it needs to exist.
      // Assume that discrete update microtasks are non-cancellable and null.
      // TODO: Temporary until we confirm this warning is not fired.
      if (
        existingCallbackNode == null &&
        existingCallbackPriority !== SyncLane
      ) {
        console.error(
          "Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue."
        );
      }
    }
    // The priority hasn't changed. We can reuse the existing task. Exit.
    return;
  }

  if (existingCallbackNode != null) {
    // Cancel the existing callback. We'll schedule a new one below.
    cancelCallback(existingCallbackNode);
  }

  // Schedule a new callback.
  let newCallbackNode;
  if (newCallbackPriority === SyncLane) {
    // Special case: Sync React callbacks are scheduled on a special
    // internal queue
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
      // Flush the queue in an Immediate task.
      scheduleCallback(ImmediateSchedulerPriority, flushSyncCallbacks);
    }
    newCallbackNode = null;
  } else {
    let schedulerPriorityLevel;
    switch (lanesToEventPriority(nextLanes)) {
      case DiscreteEventPriority:
        schedulerPriorityLevel = ImmediateSchedulerPriority;
        break;
      case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingSchedulerPriority;
        break;
      case DefaultEventPriority:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
      case IdleEventPriority:
        schedulerPriorityLevel = IdleSchedulerPriority;
        break;
      default:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
    }
    // 执行 src/react/packages/scheduler/src/forks/Scheduler.js 下的 unstable_scheduleCallback
    // 会执行 performWorkUntilDeadline , performWorkUntilDeadline会执行 下面的 performConcurrentWorkOnRoot 也就是渲染
    // 注册一个任务队列 (小顶堆)
    newCallbackNode = scheduleCallback(
      schedulerPriorityLevel,
      performConcurrentWorkOnRoot.bind(null, root) // 执行初次渲染
    );
  }
  // 更新标记
  root.callbackPriority = newCallbackPriority;
  root.callbackNode = newCallbackNode;
}
```

## 总结

本节主要分析了 scheduler 包中调度原理, 也就是 React 两大工作循环中的任务调度循环. 并介绍了时间切片和可中断渲染等特性在任务调度循环中的实现. scheduler 包是 React 运行时的心脏, 为了提升调度性能, 注册 task 之前, 在 react-reconciler 包中做了节流和防抖等措施.

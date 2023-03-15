# reconciler 运作流程

先归纳下 reconciler 包的主要作用, 将主要功能分为四个方面:

1. 输入: 暴露 api (如: scheduleUpdateOnFiber), 供给其他包使用
2. 注册调度任务: 与调度中心(Scheduler 包)交互, 注册调度任务 task, 等待任务回调
3. 执行任务回调: 在内存中构造出 fiber 树, 同时与渲染器( react-dom )交互, 在内存中创建与 fiber 对应的 Dom 节点
4. 输出: 与渲染器( react-dom )交互, 渲染 Dom 节点

以上功能源码都集中在 src/react/packages/react-reconciler/src/ReactFiberWorkLoop.old.js 中, 现在将这些功能从输入到输出串联起来.

react 的渲染方法是 render 方法, 方法内部执行的方法是 updateContainer

代码是在 src/react/packages/react-reconciler/src/ReactFiberReconciler.old.js 下

```ts
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): Lane {
  const current = container.current;
  const eventTime = requestEventTime(); // 执行的是浏览器 performance.now 方法, 返回一个表示从性能测量时刻开始经过的毫秒数 自创建上下文以来经过的时间
  const lane = requestUpdateLane(current); // 这里最后拿到的是 src/react/packages/react-reconciler/src/ReactFiberLane.old.js 下的 DefaultLane 也就是 16

  if (enableSchedulingProfiler) {
    markRenderScheduled(lane);
  }

  // 初始化 context 是空对象
  const context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  // 根据车道优先级, 创建 update 对象
  const update = createUpdate(eventTime, lane);
  // Caution: React DevTools currently depends on this property
  // being called "element".
  update.payload = {element};

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    update.callback = callback;
  }
  // 并加入 fiber.updateQueue.pending 队列
  // 返回的 root 是根节点 fiber
  const root = enqueueUpdate(current, update, lane);
  if (root !== null) {
    // 进入 reconciler 运作流程中的`输入`环节
    scheduleUpdateOnFiber(root, current, lane, eventTime);
    entangleTransitions(root, current, lane);
  }

  return lane;
}
```

<Card  type="warning">
<div>
  scheduleUpdateOnFiber 里面主要执行了 ensureRootIsScheduled
  我们接下来重点看下 ensureRootIsScheduled (注册调度任务, 经过`Scheduler`包的调度, 间接进行`fiber构造`) 做了什么
</div>
</Card>

```ts
// src/react/packages/react-reconciler/src/ReactFiberWorkLoop.old.js
// 每次更新都会调用此函数
// 注册调度任务
function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
  // 前半部分: 判断是否需要注册新的调度 这里做了节流防抖操作 避免多次调用 优化性能
  const existingCallbackNode = root.callbackNode;

  // Check if any lanes are being starved by other work. If so, mark them as
  // expired so we know to work on those next.
  markStarvedLanesAsExpired(root, currentTime);

  // Determine the next lanes to work on, and their priority.
  const nextLanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes
  );
  // 节流防抖
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
  // 防抖
  const existingCallbackPriority = root.callbackPriority;
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
    // 异步任务 目前的主线
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
    // 这里就是将 performConcurrentWorkOnRoot 异步调用
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

ensureRootIsScheduled 的逻辑很清晰, 分为 2 部分:

1. 前半部分: 判断是否需要注册新的调度(如果无需新的调度, 会退出函数)
2. 后半部分: 注册调度任务 判断是同步还是异步 同步不考虑
   - performSyncWorkOnRoot 或 performConcurrentWorkOnRoot 被封装到了任务回调(scheduleCallback)中
   - 等待调度中心执行任务, 任务运行其实就是执行 performSyncWorkOnRoot 或 performConcurrentWorkOnRoot

我们 主要看下 performConcurrentWorkOnRoot

```ts
// 这是每个并发任务的入口点，即 通过调度器。
function performConcurrentWorkOnRoot(root, didTimeout) {
  if (enableProfilerTimer && enableProfilerNestedUpdatePhase) {
    resetNestedUpdateFlag();
  }

  // Since we know we're in a React event, we can clear the current
  // event time. The next update will compute a new event time.
  // 因为我们知道我们处于React事件中，所以我们可以清除事件时间。下一次更新将计算新的事件时间。
  currentEventTime = NoTimestamp;
  currentEventTransitionLane = NoLanes;

  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    throw new Error('Should not already be working.');
  }

  // Flush any pending passive effects before deciding which lanes to work on,
  // in case they schedule additional work.
  const originalCallbackNode = root.callbackNode;
  // 执行 render 的 effect 的回调
  const didFlushPassiveEffects = flushPassiveEffects();
  // 有可能某些effect会取消本次任务
  if (didFlushPassiveEffects) {
    // Something in the passive effect phase may have canceled the current task.
    // Check if the task node for this root was changed.
    if (root.callbackNode !== originalCallbackNode) {
      // The current task was canceled. Exit. We don't need to call
      // `ensureRootIsScheduled` because the check above implies either that
      // there's a new task, or that there's no remaining work on this root.
      return null;
    } else {
      // Current task was not canceled. Continue.
    }
  }

  // Determine the next lanes to work on, using the fields stored
  // on the root.
  let lanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes,
  );
  if (lanes === NoLanes) {
    // Defensive coding. This is never expected to happen.
    return null;
  }

  // We disable time-slicing in some cases: if the work has been CPU-bound
  // for too long ("expired" work, to prevent starvation), or we're in
  // sync-updates-by-default mode.
  // TODO: We only check `didTimeout` defensively, to account for a Scheduler
  // bug we're still investigating. Once the bug in Scheduler is fixed,
  // we can remove this, since we track expiration ourselves.
  const shouldTimeSlice =
    !includesBlockingLane(root, lanes) &&
    !includesExpiredLane(root, lanes) &&
    (disableSchedulerTimeoutInWorkLoop || !didTimeout);
  // 从root节点开始, 至上而下更新  构造fiber树
  let exitStatus = shouldTimeSlice
    ? renderRootConcurrent(root, lanes)
    : renderRootSync(root, lanes);
  if (exitStatus !== RootInProgress) {
    if (exitStatus === RootErrored) {
      // If something threw an error, try rendering one more time. We'll
      // render synchronously to block concurrent data mutations, and we'll
      // includes all pending updates are included. If it still fails after
      // the second attempt, we'll give up and commit the resulting tree.
      const errorRetryLanes = getLanesToRetrySynchronouslyOnError(root);
      if (errorRetryLanes !== NoLanes) {
        lanes = errorRetryLanes;
        exitStatus = recoverFromConcurrentError(root, errorRetryLanes);
      }
    }
    if (exitStatus === RootFatalErrored) {
      const fatalError = workInProgressRootFatalError;
      prepareFreshStack(root, NoLanes);
      markRootSuspended(root, lanes);
      ensureRootIsScheduled(root, now());
      throw fatalError;
    }

    if (exitStatus === RootDidNotComplete) {
      // The render unwound without completing the tree. This happens in special
      // cases where need to exit the current render without producing a
      // consistent tree or committing.
      //
      // This should only happen during a concurrent render, not a discrete or
      // synchronous update. We should have already checked for this when we
      // unwound the stack.
      markRootSuspended(root, lanes);
    } else {
      // The render completed.
      // 完成
      // Check if this render may have yielded to a concurrent event, and if so,
      // confirm that any newly rendered stores are consistent.
      // TODO: It's possible that even a concurrent render may never have yielded
      // to the main thread, if it was fast enough, or if it expired. We could
      // skip the consistency check in that case, too.
      const renderWasConcurrent = !includesBlockingLane(root, lanes);
      const finishedWork: Fiber = (root.current.alternate: any); // fiber 节点
      if (
        renderWasConcurrent &&
        !isRenderConsistentWithExternalStores(finishedWork)
      ) {
        // A store was mutated in an interleaved event. Render again,
        // synchronously, to block further mutations.
        exitStatus = renderRootSync(root, lanes);

        // We need to check again if something threw
        if (exitStatus === RootErrored) {
          const errorRetryLanes = getLanesToRetrySynchronouslyOnError(root);
          if (errorRetryLanes !== NoLanes) {
            lanes = errorRetryLanes;
            exitStatus = recoverFromConcurrentError(root, errorRetryLanes);
            // We assume the tree is now consistent because we didn't yield to any
            // concurrent events.
          }
        }
        if (exitStatus === RootFatalErrored) {
          const fatalError = workInProgressRootFatalError;
          prepareFreshStack(root, NoLanes);
          markRootSuspended(root, lanes);
          ensureRootIsScheduled(root, now());
          throw fatalError;
        }
      }

      // We now have a consistent tree. The next step is either to commit it,
      // or, if something suspended, wait to commit it after a timeout.
      // 把最新的fiber树挂载到 fiberRoot.finishedWork 上
      // 注意fiberRoot.finishedWork 和 fiberRoot.current 指针,在 commitRoot 阶段会进行处理
      root.finishedWork = finishedWork;
      root.finishedLanes = lanes;
      // 开始执行 commit 渲染 fiber 树
      finishConcurrentRender(root, exitStatus, lanes);
    }
  }
  // 递归执行
  // 退出前再次检测, 是否还有其他更新, 是否需要发起新调度
  ensureRootIsScheduled(root, now());
  if (root.callbackNode === originalCallbackNode) {
    // The task node scheduled for this root is the same one that's
    // currently executed. Need to return a continuation.
    // 渲染被阻断, 返回一个新的 performConcurrentWorkOnRoot 函数, 等待下一次调用
    return performConcurrentWorkOnRoot.bind(null, root);
  }
  return null;
}
```

##### performConcurrentWorkOnRoot 的逻辑与 performSyncWorkOnRoot 的不同之处在于, 对于可中断渲染的支持:

1. 调用 performConcurrentWorkOnRoot 函数时, 首先检查是否处于 render 过程中, 是否需要恢复上一次渲染.
2. 如果本次渲染被中断, 最后返回一个新的 performConcurrentWorkOnRoot 函数, 等待下一次调用.

performConcurrentWorkOnRoot 中 我们看下 workLoopConcurrent

```ts
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  // 相比 workLoopSync 多了一个停顿机制, 这个机制实现了时间切片和可终端渲染
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

```ts
// unitOfWork就是被传入的workInProgress
function performUnitOfWork(unitOfWork: Fiber): void {
  // The current, flushed, state of this fiber is the alternate. Ideally
  // nothing should rely on this, but relying on it here means that we don't
  // need an additional field on the work in progress.
  // current 就是放弃页面正在使用的 fiber 节点
  // unitOfWork 就是当前正在构造的 fiber 节点
  const current = unitOfWork.alternate;
  setCurrentDebugFiberInDEV(unitOfWork);

  let next;
  if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
    startProfilerTimer(unitOfWork);
    // 探寻阶段 beginWork 就是 src/react/packages/react-reconciler/src/ReactFiberBeginWork.old.js 下的 beginWork
    next = beginWork(current, unitOfWork, subtreeRenderLanes);
    stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
  } else {
    next = beginWork(current, unitOfWork, subtreeRenderLanes);
  }

  resetCurrentDebugFiberInDEV();
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // 如果没有派生出新的节点, 则进入 completeUnitOfWork 阶段, 传入的是当前 unitOfWork
    // 向上回溯 直到回到根节点结束
    // If this doesn't spawn new work, complete the current work.
    // completeUnitOfWork(unitOfWork)函数(源码地址)在初次创建和对比更新逻辑一致, 都是处理beginWork 阶段已经创建出来的 fiber 节点, 最后创建(更新)DOM 对象, 并上移副作用队列.
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }

  ReactCurrentOwner.current = null;
}
```

我们先看下 探寻节点(beginWork) 再看下 回溯阶段(completeUnitOfWork)

beginWork 的工作路径有四条：

1. mount （首屏渲染）时创建新的子 Fiber 节点，并返回该新建节点；
2. update 时若不满足复用条件，则与 mount 时一样创建新的子 Fiber 节点，并 diff 出相应的 effectTag 挂在子 Fiber 节点上，并返回该新建节点；
3. update 时若满足复用条件，且判断仍需继续处理其子节点的后代，则返回复用后的子 Fiber 节点
4. update 时若满足复用条件，且判断不需继续处理其子节点的后代，则直接返回 null 值；

```ts
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  if (current !== null) {
    // 进入对比 更新 update
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps ||
      hasLegacyContextChanged() ||
      // Force a re-render if the implementation changed due to hot reload:
      (__DEV__ ? workInProgress.type !== current.type : false)
    ) {
      // If props or context changed, mark the fiber as having performed work.
      // This may be unset if the props are determined to be equal later (memo).
      didReceiveUpdate = true;
    } else {
      // Neither props nor legacy context changes. Check if there's a pending
      // update or context change.
      const hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(
        current,
        renderLanes
      );
      if (
        !hasScheduledUpdateOrContext &&
        // If this is the second pass of an error or suspense boundary, there
        // may not be work scheduled on `current`, so we check for this flag.
        (workInProgress.flags & DidCapture) === NoFlags
      ) {
        // 当前fiber节点无需更新
        // No pending updates or context. Bail out now.
        didReceiveUpdate = false;
        return attemptEarlyBailoutIfNoScheduledUpdate(
          current,
          workInProgress,
          renderLanes
        );
      }
      if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
        // This is a special case that only exists for legacy mode.
        // See https://github.com/facebook/react/pull/19216.
        didReceiveUpdate = true;
      } else {
        // An update was scheduled on this fiber, but there are no new props
        // nor legacy context. Set this to false. If an update queue or context
        // consumer produces a changed value, it will set this to true. Otherwise,
        // the component will assume the children have not changed and bail out.
        didReceiveUpdate = false;
      }
    }
  } else {
    didReceiveUpdate = false;

    if (getIsHydrating() && isForkedChild(workInProgress)) {
      // Check if this child belongs to a list of muliple children in
      // its parent.
      //
      // In a true multi-threaded implementation, we would render children on
      // parallel threads. This would represent the beginning of a new render
      // thread for this subtree.
      //
      // We only use this for id generation during hydration, which is why the
      // logic is located in this special branch.
      const slotIndex = workInProgress.index;
      const numberOfForks = getForksAtLevel(workInProgress);
      pushTreeId(workInProgress, numberOfForks, slotIndex);
    }
  }

  // Before entering the begin phase, clear pending update priority.
  // TODO: This assumes that we're about to evaluate the component and process
  // the update queue. However, there's an exception: SimpleMemoComponent
  // sometimes bails out later in the begin phase. This indicates that we should
  // move this assignment out of the common path and into each branch.
  //  设置workInProgress优先级为NoLanes(最高优先级)
  workInProgress.lanes = NoLanes;

  // 根据workInProgress节点的类型, 用不同的方法派生出子节点
  switch (workInProgress.tag) {
    case FunctionComponent: {
      // 函数方法
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes
      );
    }
    // ... 省略
  }
}
```

我们再看下 updateFunctionComponent

updateFunctionComponent 是对一个函数组件的更新，目前包含两部分，一是就是调用 renderWithHooks 方法 实现对 Hooks 的支持，二是调用 reconcileChildren 调和子树。先看 renderWithHooks 方法。

```ts
function updateFunctionComponent(
  current,
  workInProgress,
  Component,
  nextProps: any,
  renderLanes
) {
  let context;
  if (!disableLegacyContext) {
    const unmaskedContext = getUnmaskedContext(workInProgress, Component, true);
    context = getMaskedContext(workInProgress, unmaskedContext);
  }

  let nextChildren;
  let hasId;
  prepareToReadContext(workInProgress, renderLanes);
  if (enableSchedulingProfiler) {
    markComponentRenderStarted(workInProgress);
  }
  if (__DEV__) {
    ReactCurrentOwner.current = workInProgress;
    setIsRendering(true);
    nextChildren = renderWithHooks(
      current,
      workInProgress,
      Component,
      nextProps,
      context,
      renderLanes
    );
    hasId = checkDidRenderIdHook();
    if (
      debugRenderPhaseSideEffectsForStrictMode &&
      workInProgress.mode & StrictLegacyMode
    ) {
      setIsStrictModeForDevtools(true);
      try {
        nextChildren = renderWithHooks(
          current,
          workInProgress,
          Component,
          nextProps,
          context,
          renderLanes
        );
        hasId = checkDidRenderIdHook();
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }
    setIsRendering(false);
  } else {
    // 实现对 Hooks 的支持
    nextChildren = renderWithHooks(
      current,
      workInProgress,
      Component,
      nextProps,
      context,
      renderLanes
    );
    hasId = checkDidRenderIdHook();
  }
  if (enableSchedulingProfiler) {
    markComponentRenderStopped();
  }

  // 表示无需更新
  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress, renderLanes);
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  if (getIsHydrating() && hasId) {
    pushMaterializedTreeId(workInProgress);
  }

  // React DevTools reads this flag.
  workInProgress.flags |= PerformedWork;
  // 调和函数
  // 调和函数是updateXXX函数中的一项重要逻辑, 它的作用是向下生成子节点, 并设置fiber.flags.
  // 初次创建时fiber节点没有比较对象, 所以在向下生成子节点的时候没有任何多余的逻辑, 只管创建就行.
  // 对比更新时需要把ReactElement对象与旧fiber对象进行比较, 来判断是否需要复用旧fiber对象.
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}
```

mount(首屏渲染) 时会根据不同的 workInProgress.tag(组件类型)来进入到不同的子节点创建逻辑，我们关注最常见的组件类型：FunctionComponent(函数组件) / ClassComponent(类组件) / HostComponent(对标 HTML 标签)，最终这些逻辑都会进入 reconcileChildren 方法。

```ts
function renderWithHooks<Props, SecondArg>(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: (p: Props, arg: SecondArg) => any,
  props: Props,
  secondArg: SecondArg,
  nextRenderLanes: Lanes,
): any {
  // --------------- 1. 设置全局变量 -------------------
  renderLanes = nextRenderLanes; // 当前渲染优先级
  currentlyRenderingFiber = workInProgress; // 当前fiber节点, 也就是function组件对应的fiber节点

  if (__DEV__) {
    hookTypesDev =
      current !== null
        ? ((current._debugHookTypes: any): Array<HookType>)
        : null;
    hookTypesUpdateIndexDev = -1;
    // Used for hot reloading:
    ignorePreviousDependencies =
      current !== null && current.type !== workInProgress.type;
  }
  // 清除当前fiber的遗留状态
  workInProgress.memoizedState = null;
  workInProgress.updateQueue = null;
  workInProgress.lanes = NoLanes;

  // The following should have already been reset
  // currentHook = null;
  // workInProgressHook = null;

  // didScheduleRenderPhaseUpdate = false;
  // localIdCounter = 0;

  // TODO Warn if no hooks are used at all during mount, then some are used during update.
  // Currently we will identify the update render as a mount because memoizedState === null.
  // This is tricky because it's valid for certain types of components (e.g. React.lazy)

  // Using memoizedState to differentiate between mount/update only works if at least one stateful hook is used.
  // Non-stateful hooks (e.g. context) don't get added to memoizedState,
  // so memoizedState would be null during updates and mounts.
  if (__DEV__) {
    if (current !== null && current.memoizedState !== null) {
      ReactCurrentDispatcher.current = HooksDispatcherOnUpdateInDEV;
    } else if (hookTypesDev !== null) {
      // This dispatcher handles an edge case where a component is updating,
      // but no stateful hooks have been used.
      // We want to match the production code behavior (which will use HooksDispatcherOnMount),
      // but with the extra DEV validation to ensure hooks ordering hasn't changed.
      // This dispatcher does that.
      ReactCurrentDispatcher.current = HooksDispatcherOnMountWithHookTypesInDEV;
    } else {
      // 初始化
      ReactCurrentDispatcher.current = HooksDispatcherOnMountInDEV;
    }
  } else {
    // 2. 调用function,生成子级 ReactElement 对象
    // 指定 dispatcher, 区分 mount 和 update 初次执行还是更新执行
    ReactCurrentDispatcher.current =
      current === null || current.memoizedState === null
        ? HooksDispatcherOnMount
        : HooksDispatcherOnUpdate;
  }
  // 执行 function 函数, 其中进行分析 Hooks 的使用
  let children = Component(props, secondArg);

  // Check if there was a render phase update
  // 当有更新要渲染时
  if (didScheduleRenderPhaseUpdateDuringThisPass) {
    // Keep rendering in a loop for as long as render phase updates continue to
    // be scheduled. Use a counter to prevent infinite loops.
    let numberOfReRenders: number = 0;
    do {
      // 第一步就是置为 false
      // 这个循环只执行一次
      didScheduleRenderPhaseUpdateDuringThisPass = false;
      localIdCounter = 0;

      if (numberOfReRenders >= RE_RENDER_LIMIT) {
        throw new Error(
          'Too many re-renders. React limits the number of renders to prevent ' +
            'an infinite loop.',
        );
      }
      // 记录循环次数，避免无限循环
      numberOfReRenders += 1;
      if (__DEV__) {
        // Even when hot reloading, allow dependencies to stabilize
        // after first render to prevent infinite render phase updates.
        ignorePreviousDependencies = false;
      }

      // Start over from the beginning of the list
      currentHook = null;
      workInProgressHook = null;

      workInProgress.updateQueue = null;

      if (__DEV__) {
        // Also validate hook order for cascading updates.
        hookTypesUpdateIndexDev = -1;
      }

      ReactCurrentDispatcher.current = __DEV__
        ? HooksDispatcherOnRerenderInDEV
        : HooksDispatcherOnRerender;
      // 重新渲染
      children = Component(props, secondArg);
    } while (didScheduleRenderPhaseUpdateDuringThisPass);
  }

  // We can assume the previous dispatcher is always this one, since we set it
  // at the beginning of the render phase and there's no re-entrance.
  ReactCurrentDispatcher.current = ContextOnlyDispatcher;

  if (__DEV__) {
    workInProgress._debugHookTypes = hookTypesDev;
  }

  // This check uses currentHook so that it works the same in DEV and prod bundles.
  // hookTypesDev could catch more cases (e.g. context) but only in DEV bundles.
  const didRenderTooFewHooks =
    currentHook !== null && currentHook.next !== null;
  // --------------- 3. 重置全局变量,并返回 -------------------
  // 执行function之后, 还原被修改的全局变量, 不影响下一次调用
  renderLanes = NoLanes;
  currentlyRenderingFiber = (null: any);

  currentHook = null;
  workInProgressHook = null;

  if (__DEV__) {
    currentHookNameInDev = null;
    hookTypesDev = null;
    hookTypesUpdateIndexDev = -1;

    // Confirm that a static flag was not added or removed since the last
    // render. If this fires, it suggests that we incorrectly reset the static
    // flags in some other part of the codebase. This has happened before, for
    // example, in the SuspenseList implementation.
    if (
      current !== null &&
      (current.flags & StaticMaskEffect) !==
        (workInProgress.flags & StaticMaskEffect) &&
      // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (current.mode & ConcurrentMode) !== NoMode
    ) {
      console.error(
        'Internal React error: Expected static flag was missing. Please ' +
          'notify the React team.',
      );
    }
  }

  didScheduleRenderPhaseUpdate = false;
  // This is reset by checkDidRenderIdHook
  // localIdCounter = 0;

  if (didRenderTooFewHooks) {
    throw new Error(
      'Rendered fewer hooks than expected. This may be caused by an accidental ' +
        'early return statement.',
    );
  }

  if (enableLazyContextPropagation) {
    if (current !== null) {
      if (!checkIfWorkInProgressReceivedUpdate()) {
        // If there were no changes to props or state, we need to check if there
        // was a context change. We didn't already do this because there's no
        // 1:1 correspondence between dependencies and hooks. Although, because
        // there almost always is in the common case (`readContext` is an
        // internal API), we could compare in there. OTOH, we only hit this case
        // if everything else bails out, so on the whole it might be better to
        // keep the comparison out of the common path.
        const currentDependencies = current.dependencies;
        if (
          currentDependencies !== null &&
          checkIfContextChanged(currentDependencies)
        ) {
          markWorkInProgressReceivedUpdate();
        }
      }
    }
  }
  return children;
}
```

HooksDispatcherOnMount 和 HooksDispatcherOnUpdate 中存放了处理 hooks 的处理方法(也就是初始化所有的内置 hook 方法)。 首次渲染使用的是 HooksDispatcherOnMount，后续的更新使用 HooksDispatcherOnUpdate。

所以 renderWithHooks 主要就是 初始化 ReactCurrentDispatcher.current 也就是 hook 的方法, 并且执行函数组件

reconcileChildren 里面主要是 生成或者更新 fiber 节点, 比如更新单节点或者多节点(数组节点) 的 diff 算法都是在这里做的 具体的优化我们会在后续单独拿出来说

我们接着说下 beginWork 后面执行的 回溯阶段(completeUnitOfWork)

```ts
function completeUnitOfWork(unitOfWork: Fiber): void {
  // Attempt to complete the current unit of work, then move to the next
  // sibling. If there are no more siblings, return to the parent fiber.
  let completedWork = unitOfWork;
  do {
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;

    // Check if the work completed or if something threw.
    if ((completedWork.flags & Incomplete) === NoFlags) {
      setCurrentDebugFiberInDEV(completedWork);
      let next;
      // 1. 处理Fiber节点, 会调用渲染器(调用react-dom包, 关联Fiber节点和dom对象, 绑定事件等)
      if (
        !enableProfilerTimer ||
        (completedWork.mode & ProfileMode) === NoMode
      ) {
        next = completeWork(current, completedWork, subtreeRenderLanes);
      } else {
        startProfilerTimer(completedWork);
        next = completeWork(current, completedWork, subtreeRenderLanes);
        // Update render duration assuming we didn't error.
        stopProfilerTimerIfRunningAndRecordDelta(completedWork, false);
      }
      resetCurrentDebugFiberInDEV();

      if (next !== null) {
        // 如果派生出其他的子节点, 则回到`beginWork`阶段进行处理
        // Completing this fiber spawned new work. Work on that next.
        workInProgress = next;
        return;
      }
    } else {
      // This fiber did not complete because something threw. Pop values off
      // the stack without entering the complete phase. If this is a boundary,
      // capture values if possible.
      const next = unwindWork(current, completedWork, subtreeRenderLanes);

      // Because this fiber did not complete, don't reset its lanes.

      if (next !== null) {
        // If completing this work spawned new work, do that next. We'll come
        // back here again.
        // Since we're restarting, remove anything that is not a host effect
        // from the effect tag.
        next.flags &= HostEffectMask;
        workInProgress = next;
        return;
      }

      if (
        enableProfilerTimer &&
        (completedWork.mode & ProfileMode) !== NoMode
      ) {
        // Record the render duration for the fiber that errored.
        stopProfilerTimerIfRunningAndRecordDelta(completedWork, false);

        // Include the time spent working on failed children before continuing.
        let actualDuration = completedWork.actualDuration;
        let child = completedWork.child;
        while (child !== null) {
          actualDuration += child.actualDuration;
          child = child.sibling;
        }
        completedWork.actualDuration = actualDuration;
      }

      if (returnFiber !== null) {
        // Mark the parent fiber as incomplete and clear its subtree flags.
        returnFiber.flags |= Incomplete;
        returnFiber.subtreeFlags = NoFlags;
        returnFiber.deletions = null;
      } else {
        // We've unwound all the way to the root.
        workInProgressRootExitStatus = RootDidNotComplete;
        workInProgress = null;
        return;
      }
    }

    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      // If there is more work to do in this returnFiber, do that next.
      // 回溯 发现有兄弟节点 继续执行 performUnitOfWork
      workInProgress = siblingFiber;
      return;
    }
    // Otherwise, return to the parent
    completedWork = returnFiber;
    // Update the next thing we're working on in case something throws.
    workInProgress = completedWork;
  } while (completedWork !== null);

  // We've reached the root.
  // 已回溯到根节点, 设置workInProgressRootExitStatus = RootCompleted
  if (workInProgressRootExitStatus === RootInProgress) {
    workInProgressRootExitStatus = RootCompleted;
  }
}
```

如果说“递”阶段的 beginWork 方法主要是创建子节点，那么“归”阶段的 completeWork 方法则主要是创建当前节点的 DOM 节点

<Card  type="warning">
<div>
  上面的 performConcurrentWorkOnRoot 在最后执行了 finishConcurrentRender 也就是要开始渲染 fiber 树了
  finishConcurrentRender 中主要执行了  commitRoot -> commitRootImpl
</div>
</Card>

```ts
function commitRootImpl(
  root: FiberRoot,
  recoverableErrors: null | Array<CapturedValue<mixed>>,
  transitions: Array<Transition> | null,
  renderPriorityLevel: EventPriority,
) {
  // 渲染前 准备
  const finishedWork = root.finishedWork; // 新 fiber 树
  const lanes = root.finishedLanes;

  if (enableSchedulingProfiler) {
    // 标记渲染开始
    markCommitStarted(lanes);
  }

  // 清空FiberRoot对象上的属性
  root.finishedWork = null;
  root.finishedLanes = NoLanes;

  // commitRoot never returns a continuation; it always finishes synchronously.
  // So we can clear these now to allow a new callback to be scheduled.
  root.callbackNode = null;
  root.callbackPriority = NoLane;

  // Update the first and last pending times on this root. The new first
  // pending time is whatever is left on the root fiber.
  let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  markRootFinished(root, remainingLanes);

  if (root === workInProgressRoot) {
    // We can reset these now that they are finished.
    workInProgressRoot = null;
    workInProgress = null;
    workInProgressRootRenderLanes = NoLanes;
  } else {
    // This indicates that the last root we worked on is not the same one that
    // we're committing now. This most commonly happens when a suspended root
    // times out.
  }

  // If there are pending passive effects, schedule a callback to process them.
  // Do this as early as possible, so it is queued before anything else that
  // might get scheduled in the commit phase. (See #16714.)
  // TODO: Delete all other places that schedule the passive effect callback
  // They're redundant.
  if (
    (finishedWork.subtreeFlags & PassiveMask) !== NoFlags ||
    (finishedWork.flags & PassiveMask) !== NoFlags
  ) {
    if (!rootDoesHavePassiveEffects) {
      rootDoesHavePassiveEffects = true;
      pendingPassiveEffectsRemainingLanes = remainingLanes;
      // workInProgressTransitions might be overwritten, so we want
      // to store it in pendingPassiveTransitions until they get processed
      // We need to pass this through as an argument to commitRoot
      // because workInProgressTransitions might have changed between
      // the previous render and commit if we throttle the commit
      // with setTimeout
      pendingPassiveTransitions = transitions;
      // 创建一个 task
      scheduleCallback(NormalSchedulerPriority, () => {
        // 执行上一次的销毁生命周期 并异步执行有回调的 useEffect
        flushPassiveEffects();
        // This render triggered passive effects: release the root cache pool
        // *after* passive effects fire to avoid freeing a cache pool that may
        // be referenced by a node in the tree (HostRoot, Cache boundary etc)
        return null;
      });
    }
  }

  // Check if there are any effects in the whole tree.
  // TODO: This is left over from the effect list implementation, where we had
  // to check for the existence of `firstEffect` to satisfy Flow. I think the
  // only other reason this optimization exists is because it affects profiling.
  // Reconsider whether this is necessary.
  const subtreeHasEffects =
    (finishedWork.subtreeFlags &
      (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !==
    NoFlags;
  const rootHasEffect =
    (finishedWork.flags &
      (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !==
    NoFlags;

  if (subtreeHasEffects || rootHasEffect) {
    const prevTransition = ReactCurrentBatchConfig.transition;
    ReactCurrentBatchConfig.transition = null;
    const previousPriority = getCurrentUpdatePriority();
    setCurrentUpdatePriority(DiscreteEventPriority);

    const prevExecutionContext = executionContext;
    executionContext |= CommitContext;

    // Reset this to null before calling lifecycles
    ReactCurrentOwner.current = null;

    // The commit phase is broken into several sub-phases. We do a separate pass
    // of the effect list for each phase: all mutation effects come before all
    // layout effects, and so on.

    // The first phase a "before mutation" phase. We use this phase to read the
    // state of the host tree right before we mutate it. This is where
    // getSnapshotBeforeUpdate is called.
    // 将 div#root 置空
    const shouldFireAfterActiveInstanceBlur = commitBeforeMutationEffects(
      root,
      finishedWork,
    );

    if (enableProfilerTimer) {
      // Mark the current commit time to be shared by all Profilers in this
      // batch. This enables them to be grouped later.
      // 重置 commitTime 时间为当前时间 performance.now()
      recordCommitTime();
    }

    if (enableProfilerTimer && enableProfilerNestedUpdateScheduledHook) {
      // Track the root here, rather than in commitLayoutEffects(), because of ref setters.
      // Updates scheduled during ref detachment should also be flagged.
      rootCommittingMutationOrLayoutEffects = root;
    }
    // 阶段2: dom突变, 界面发生改变
    // The next phase is the mutation phase, where we mutate the host tree.
    commitMutationEffects(root, finishedWork, lanes);

    if (enableCreateEventHandleAPI) {
      if (shouldFireAfterActiveInstanceBlur) {
        afterActiveInstanceBlur();
      }
    }
    // 恢复界面状态 root.containerInfo 根节点 Dom
    resetAfterCommit(root.containerInfo);

    // The work-in-progress tree is now the current tree. This must come after
    // the mutation phase, so that the previous tree is still current during
    // componentWillUnmount, but before the layout phase, so that the finished
    // work is current during componentDidMount/Update.
    // 切换current指针
    // 值得注意的是，commit 阶段 第三步 commitLayoutEffects 之前，
    // React 会将 FiberRootNode 的 current 属性指向创建好了 Fiber Tree。
    root.current = finishedWork;

    if (enableSchedulingProfiler) {
      markLayoutEffectsStarted(lanes);
    }
    //  阶段3: layout阶段, 调用生命周期 componentDidUpdate 和回调函数等
    // 执行 useLayoutEffect 回调函数
    commitLayoutEffects(finishedWork, root, lanes);

    if (enableSchedulingProfiler) {
      markLayoutEffectsStopped();
    }

    if (enableProfilerTimer && enableProfilerNestedUpdateScheduledHook) {
      rootCommittingMutationOrLayoutEffects = null;
    }

    // Tell Scheduler to yield at the end of the frame, so the browser has an
    // opportunity to paint.
    requestPaint();

    executionContext = prevExecutionContext;

    // Reset the priority to the previous non-sync value.
    setCurrentUpdatePriority(previousPriority);
    ReactCurrentBatchConfig.transition = prevTransition;
  } else {
    // No effects.
    root.current = finishedWork;
    // Measure these anyway so the flamegraph explicitly shows that there were
    // no effects.
    // TODO: Maybe there's a better way to report this.
    if (enableProfilerTimer) {
      recordCommitTime();
    }
  }

  const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

  if (rootDoesHavePassiveEffects) {
    // This commit has passive effects. Stash a reference to them. But don't
    // schedule a callback until after flushing layout work.
    rootDoesHavePassiveEffects = false;
    rootWithPendingPassiveEffects = root;
    pendingPassiveEffectsLanes = lanes;
  } else {
    // There were no passive effects, so we can immediately release the cache
    // pool for this render.
    releaseRootPooledCache(root, remainingLanes);
  }

  // Read this again, since an effect might have updated it
  remainingLanes = root.pendingLanes;

  // Check if there's remaining work on this root
  // TODO: This is part of the `componentDidCatch` implementation. Its purpose
  // is to detect whether something might have called setState inside
  // `componentDidCatch`. The mechanism is known to be flawed because `setState`
  // inside `componentDidCatch` is itself flawed — that's why we recommend
  // `getDerivedStateFromError` instead. However, it could be improved by
  // checking if remainingLanes includes Sync work, instead of whether there's
  // any work remaining at all (which would also include stuff like Suspense
  // retries or transitions). It's been like this for a while, though, so fixing
  // it probably isn't that urgent.
  if (remainingLanes === NoLanes) {
    // If there's no remaining work, we can clear the set of already failed
    // error boundaries.
    legacyErrorBoundariesThatAlreadyFailed = null;
  }

  // Always call this before exiting `commitRoot`, to ensure that any
  // additional work on this root is scheduled.
  // 初次渲染/对比更新
  ensureRootIsScheduled(root, now());

  if (recoverableErrors !== null) {
    // There were errors during this render, but recovered from them without
    // needing to surface it to the UI. We log them here.
    const onRecoverableError = root.onRecoverableError;
    for (let i = 0; i < recoverableErrors.length; i++) {
      const recoverableError = recoverableErrors[i];
      const componentStack = recoverableError.stack;
      const digest = recoverableError.digest;
      onRecoverableError(recoverableError.value, {componentStack, digest});
    }
  }

  // If the passive effects are the result of a discrete render, flush them
  // synchronously at the end of the current task so that the result is
  // immediately observable. Otherwise, we assume that they are not
  // order-dependent and do not need to be observed by external systems, so we
  // can wait until after paint.
  // TODO: We can optimize this by not scheduling the callback earlier. Since we
  // currently schedule the callback in multiple places, will wait until those
  // are consolidated.
  if (
    includesSomeLane(pendingPassiveEffectsLanes, SyncLane) &&
    root.tag !== LegacyRoot
  ) {
    flushPassiveEffects();
  }

  // Read this again, since a passive effect might have updated it
  remainingLanes = root.pendingLanes;
  if (includesSomeLane(remainingLanes, (SyncLane: Lane))) {
    if (enableProfilerTimer && enableProfilerNestedUpdatePhase) {
      markNestedUpdateScheduled();
    }

    // Count the number of times the root synchronously re-renders without
    // finishing. If there are too many, it indicates an infinite update loop.
    if (root === rootWithNestedUpdates) {
      nestedUpdateCount++;
    } else {
      nestedUpdateCount = 0;
      rootWithNestedUpdates = root;
    }
  } else {
    nestedUpdateCount = 0;
  }

  // If layout work was scheduled, flush it now.
  flushSyncCallbacks();

  if (enableSchedulingProfiler) {
    // 标记commit阶段结束
    markCommitStopped();
  }

  return null;
}
```

##### 在输出阶段,commitRoot 的实现逻辑是在 commitRootImpl 函数中, 其主要逻辑是处理副作用队列, 将最新的 fiber 树结构反映到 DOM 上.

核心逻辑分为 3 个步骤:

1. commitBeforeMutationEffects
   dom 变更之前, 主要处理副作用队列中带有 Snapshot,Passive 标记的 fiber 节点.
2. commitMutationEffects
   dom 变更, 界面得到更新. 主要处理副作用队列中带有 Placement, Update, Deletion, Hydrating 标记的 fiber 节点.
3. commitLayoutEffects
   dom 变更后, 主要处理副作用队列中带有 Update | Callback 标记的 fiber 节点.

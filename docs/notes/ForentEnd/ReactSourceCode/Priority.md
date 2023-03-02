# 优先级

[参考文档](https://juejin.cn/post/7032051193371164708)

## 事件优先级

React按照事件的紧急程度，将它们分成了三个等级：

1. **DiscreteEventPriority：**离散事件，如 click、keydown、focusin 等，这些事件的触发不是连续的，优先级最高

2. **ContinuousEventPriority：**阻塞事件，如 drag、mousemove、scroll 等，这些事件的特点是连续触发，会阻塞渲染，优先级为适中

3. **DefaultEventPriority：**如 load、animation 等事件，优先级最低

事件优先级的具体划分如下：

```js
export function getEventPriority(domEventName: DOMEventName): * {
  switch (domEventName) {
    // Used by SimpleEventPlugin:
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    case 'copy':
    case 'cut':
    case 'auxclick':
    case 'dblclick':
    case 'dragend':
    case 'dragstart':
    case 'drop':
    case 'focusin':
    case 'focusout':
    case 'input':
    case 'invalid':
    case 'keydown':
    case 'keypress':
    case 'keyup':
    case 'mousedown':
    case 'mouseup':
    case 'paste':
    case 'pause':
    case 'play':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerup':
    case 'ratechange':
    case 'reset':
    case 'resize':
    case 'seeked':
    case 'submit':
    case 'touchcancel':
    case 'touchend':
    case 'touchstart':
    case 'volumechange':
    // Used by polyfills:
    // eslint-disable-next-line no-fallthrough
    case 'change':
    case 'selectionchange':
    case 'textInput':
    case 'compositionstart':
    case 'compositionend':
    case 'compositionupdate':
    // Only enableCreateEventHandleAPI:
    // eslint-disable-next-line no-fallthrough
    case 'beforeblur':
    case 'afterblur':
    // Not used by React but could be by user code:
    // eslint-disable-next-line no-fallthrough
    case 'beforeinput':
    case 'blur':
    case 'fullscreenchange':
    case 'focus':
    case 'hashchange':
    case 'popstate':
    case 'select':
    case 'selectstart':
      return DiscreteEventPriority;
    case 'drag':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'mousemove':
    case 'mouseout':
    case 'mouseover':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'scroll':
    case 'toggle':
    case 'touchmove':
    case 'wheel':
    // Not used by React but could be by user code:
    // eslint-disable-next-line no-fallthrough
    case 'mouseenter':
    case 'mouseleave':
    case 'pointerenter':
    case 'pointerleave':
      return ContinuousEventPriority;
    case 'message': {
      // We might be in the Scheduler callback.
      // Eventually this mechanism will be replaced by a check
      // of the current priority on the native scheduler.
      const schedulerPriority = getCurrentSchedulerPriorityLevel();
      switch (schedulerPriority) {
        case ImmediateSchedulerPriority:
          return DiscreteEventPriority;
        case UserBlockingSchedulerPriority:
          return ContinuousEventPriority;
        case NormalSchedulerPriority:
        case LowSchedulerPriority:
          // TODO: Handle LowSchedulerPriority, somehow. Maybe the same lane as hydration.
          return DefaultEventPriority;
        case IdleSchedulerPriority:
          return IdleEventPriority;
        default:
          return DefaultEventPriority;
      }
    }
    default:
      return DefaultEventPriority;
  }
}
```

## 更新优先级

hook 对象的创建。它是一个链表，在每个hook上都有一个queue对象，它也是一个链表，存储着当前hook对象的所有update。这些 update，都是通过 createUpdate 构造函数创建的。源码如下：

```js
// src/react/packages/react-reconciler/src/ReactFiberClassUpdateQueue.old.js
export function createUpdate(eventTime: number, lane: Lane): Update<*> {
  const update: Update<*> = {
    eventTime,
    lane, // 在 update 对象中，它的 lane 属性代表它的优先级，即更新优先级。

    tag: UpdateState,
    payload: null,
    callback: null,

    next: null,
  };
  return update;
}
```

## 任务优先级

一个带有lane优先级的update会被一个React的更新任务执行掉，任务优先级用来区分多个更新任务的紧急程度，谁的优先级高，就先处理谁。任务优先级是根据更新优先级计算而来。

## 调度优先级

在React体系中，只有并发任务 (concurrent task) 才会经过Scheduler调度。在 Scheduler 中，这个任务会被 unstable_scheduleCallback 进行包装，生成一个属于 Scheduler 自己的 task，这个task持有的优先级就是调度优先级。这个调度优先级由事件优先级和任务优先级计算得出。

```js
// packages/scheduler/src/SchedulerPriorities.js
export type PriorityLevel = 0 | 1 | 2 | 3 | 4 | 5;

// TODO: Use symbols?
export const NoPriority = 0;
export const ImmediatePriority = 1;
export const UserBlockingPriority = 2;
export const NormalPriority = 3;
export const LowPriority = 4;
export const IdlePriority = 5;
```

```js
// 使用这个函数为 root 安排任务，每个 root 只有一个任务
// 每次更新时都会调用此函数，并在退出任务之前调用此函数。
function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {

  //...

  // if 逻辑处理的是同步任务，同步任务不需经过 Scheduler
  if (newCallbackPriority === SyncLane) {

    // ...

  } else {

    // else 逻辑处理的是并发任务，并发任务需要经过 Scheduler

    // 调度优先级等级
    let schedulerPriorityLevel;
    // 根据事件优先级决定调度优先级的等级
    switch (lanesToEventPriority(nextLanes)) {
      // DiscreteEventPriority  离散事件优先级最高，赋予 立即执行任务的优先级(最高)
      case DiscreteEventPriority:
        schedulerPriorityLevel = ImmediateSchedulerPriority;
        break;
        // ContinuousEventPriority：阻塞事件优先级为中优先级，赋予用户阻塞任务的优先级
      case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingSchedulerPriority;
        break;
      // DefaultEventPriority 优先级，赋予正常的调度优先级
      case DefaultEventPriority:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
      // IdleEventPriority  优先级，赋予最低的调度优先级
      case IdleEventPriority:
        schedulerPriorityLevel = IdleSchedulerPriority;
        break;
      default:
        // 默认情况下是正常的调度优先级
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
    }

    // 根据调度优先级，调度并发任务
    newCallbackNode = scheduleCallback(
      schedulerPriorityLevel,
      performConcurrentWorkOnRoot.bind(null, root),
    );
  }

  //...

}
```

在上面的代码中(else 语句模块)，首先定义了一个调度优先级变量schedulerPriorityLevel，然后把经过getNextLanes计算出来的任务优先级传入 lanesToEventPriority(nextLanes) 中，获取nextLanes的事件优先级，再根据nextLanes的事件优先级赋予相应的调度优先级。
下面我们来看看 lanesToEventPriority 是如何获取到nextLanes所对应的事件优先级的。

```js
// src/react/packages/react-reconciler/src/ReactEventPriorities.old.js
export function isHigherEventPriority(
  a: EventPriority,
  b: EventPriority,
): boolean {
  return a !== 0 && a < b;
}

// 任务优先级转换为事件优先级
export function lanesToEventPriority(lanes: Lanes): EventPriority {
  const lane = getHighestPriorityLane(lanes);
  if (!isHigherEventPriority(DiscreteEventPriority, lane)) {
    return DiscreteEventPriority;
  }
  if (!isHigherEventPriority(ContinuousEventPriority, lane)) {
    return ContinuousEventPriority;
  }
  if (includesNonIdleWork(lane)) {
    return DefaultEventPriority;
  }
  return IdleEventPriority;
}
```

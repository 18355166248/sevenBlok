# 事件机制

参考文章: [react 事件系统（新版本）](https://blog.csdn.net/lin_fightin/article/details/127997561)

## 初始化

接下来从 react18 版本的源码开始看看新版本的事件机制
下面的代码截图和代码块都是我自己项目 debugger react 源码的截图, 所有如果有需要看源码注释的可以参考以下仓库

[18355166248/my-debug-react18](https://github.com/18355166248/my-debug-react18)

## 正文

新版本事件机制主要表现在事件注册和事件触发, 先说事件注册

> src/react/packages/react-dom/src/events/DOMPluginEventSystem.js

### 事件注册

在新版本的事件注册中, 在 createRoot 执行的时候, 就会执行 listenToAllSupportedEvents 一口气向外层容易注册完全部事件, 而在 listenToAllSupportedEvents 对应的 js 中, 会直接执行初始化所有事件方法列表的方法

下面的方法就是初始化 allNativeEvents 的变量, 包括捕获, 冒泡的事件名, 有 81 个

![](@public/React/initRigisterEvents.jpg)

我们接着看 listenToAllSupportedEvents 做了什么

```js
export function listenToAllSupportedEvents(rootContainerElement: EventTarget) {
  if (!(rootContainerElement: any)[listeningMarker]) {
    (rootContainerElement: any)[listeningMarker] = true;
    // allNativeEvents 是所有原生事件的集合(set类型)
    console.log("allNativeEvents", allNativeEvents);
    allNativeEvents.forEach((domEventName) => {
      // We handle selectionchange separately because it
      // doesn't bubble and needs to be on the document.
      if (domEventName !== "selectionchange") {
        // 有些事件不需要冒泡 所有需要阻断
        if (!nonDelegatedEvents.has(domEventName)) {
          // false表示冒泡
          listenToNativeEvent(domEventName, false, rootContainerElement);
        }
        // true捕获
        listenToNativeEvent(domEventName, true, rootContainerElement);
      }
    });
    // 获取 document 节点
    const ownerDocument =
      (rootContainerElement: any).nodeType === DOCUMENT_NODE
        ? rootContainerElement
        : (rootContainerElement: any).ownerDocument;
    if (ownerDocument !== null) {
      // The selectionchange event also needs deduplication
      // but it is attached to the document.
      if (!(ownerDocument: any)[listeningMarker]) {
        (ownerDocument: any)[listeningMarker] = true;
        listenToNativeEvent("selectionchange", false, ownerDocument);
      }
    }
  }
}
```

<Card  type="warning">
<div>
  <div>这里需要注意几个点</div>
  <ul>
    <li>1. allNativeEvents 是一个set集合, 他保存了81个原生事件 <br /> 上面说过, 事件会在初始化的时候就会注册, 直接调用 registerEvents, 用 set 是因为 set 不会有重复的值. 这样当所有的插件注册完毕之后, 所有原生事件也就收集完毕了.</li>
    <li>2. nonDelegatedEvents 存放这不需要冒泡的事件, 这些事件不需要初始化捕获</li>
    <li>3. 如果事件不冒泡，即只执行listenToNativeEvent(domEventName, true, rootContainerElement);，如果冒泡，那么就会执行
    listenToNativeEvent(domEventName, true, rootContainerElement);和listenToNativeEvent(domEventName, false, rootContainerElement)
    其实这里就可以看出区别了，，第二个参数就是控制是否注册冒泡的，true表示注册俘获事件，false表示注册冒泡事件。</li>
  </ul>
</div>
</Card>

我们继续往下看 监听事件的注册方法 listenToNativeEvent 其实是执行了 addTrappedEventListener

![](@public/React/listenToNativeEvent.jpg)

```js
function addTrappedEventListener(
  targetContainer: EventTarget,
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags, // 区别捕获和冒泡 冒泡0 捕获4
  isCapturePhaseListener: boolean, // false冒泡  true捕获
  isDeferredListenerForLegacyFBSupport?: boolean
) {
  // 通过优先级获取 listener
  let listener = createEventListenerWrapperWithPriority(
    targetContainer,
    domEventName,
    eventSystemFlags
  );
  // If passive option is not supported, then the event will be
  // active and not passive.
  let isPassiveListener = undefined;
  if (passiveBrowserEventsSupported) {
    // https://github.com/facebook/react/issues/19651
    // https://blog.csdn.net/qq_40409143/article/details/116259308
    // 性能优化
    // 所以passive:true的意思就是告诉浏览器，不会阻止默认事件，你放心的滚动吧，不用等待了。
    if (
      domEventName === "touchstart" ||
      domEventName === "touchmove" ||
      domEventName === "wheel"
    ) {
      isPassiveListener = true;
    }
  }

  targetContainer =
    enableLegacyFBSupport && isDeferredListenerForLegacyFBSupport
      ? (targetContainer: any).ownerDocument
      : targetContainer;

  let unsubscribeListener;

  // TODO: There are too many combinations here. Consolidate them.
  // 在下面也有就用到了上面 createEventListenerWrapperWithPriority 获取到 listener 监听方法
  // 也就是将 listener 绑定到原生 addEventListener 方法上面 要么是冒泡, 要么是捕获, 还要主要是否需要配置 passive 参数
  if (isCapturePhaseListener) {
    // 捕获
    if (isPassiveListener !== undefined) {
      unsubscribeListener = addEventCaptureListenerWithPassiveFlag(
        targetContainer,
        domEventName,
        listener,
        isPassiveListener
      );
    } else {
      unsubscribeListener = addEventCaptureListener(
        targetContainer,
        domEventName,
        listener
      );
    }
  } else {
    // 冒泡
    if (isPassiveListener !== undefined) {
      unsubscribeListener = addEventBubbleListenerWithPassiveFlag(
        targetContainer,
        domEventName,
        listener,
        isPassiveListener
      );
    } else {
      unsubscribeListener = addEventBubbleListener(
        targetContainer,
        domEventName,
        listener
      );
    }
  }
}
```

<Card type="info">
<div>
  createEventListenerWrapperWithPriority 怎么获取 listener 事件监听器的
  监听器最后主要是用于执行 addEventListener 事件
  我们接着看
</div>
</Card>

```js
export function createEventListenerWrapperWithPriority(
  targetContainer: EventTarget, // 根节点 DOM
  domEventName: DOMEventName, // 事件名
  eventSystemFlags: EventSystemFlags // 区别捕获和冒泡 冒泡0 捕获4
): Function {
  // 针对不同的事件返回不同的数字(事件优先级) 数字对应的就行下面 switch 里面值
  // 根据不同的优先级获取不同的 dispatchEvent 函数, 最后都会通过 bind 绑定当前事件的名称, 也就是说当我们触发事件的时候, 最终执行的都是 dispatchEvent 等函数
  const eventPriority = getEventPriority(domEventName);
  let listenerWrapper;
  switch (eventPriority) {
    case DiscreteEventPriority: // 离散时间监听器 优先级为 1 例如这里有 click 事件
      listenerWrapper = dispatchDiscreteEvent;
      break;
    case ContinuousEventPriority: // 用户阻塞事件监听器 4
      listenerWrapper = dispatchContinuousEvent;
      break;
    case DefaultEventPriority: // 连续事件或其他事件监听器 16
    default:
      listenerWrapper = dispatchEvent;
      break;
  }
  return listenerWrapper.bind(
    null,
    domEventName,
    eventSystemFlags,
    targetContainer
  );
}
```

<Card type="info">
<div>
  根据不同的优先级获取不同的 dispatchEvent 函数，最后都会通过 bind 绑定当前事件的名称。也就是说当我们触发事件的时候，最终执行的都是 dispatchEvent 或者 dispatchDiscreteEvent …函数. 而 dispatchDiscreteEvent 里面其实也是执行的 dispatchEvent
</div>
</Card>

#### 自此，在 createRoot 初始化的时候，所有事件注册完毕。此时如果触发一次 click 事件, 就会先触发捕获事件, 从根节点开始执行事件, 依次往内执行, 直到执行到鼠标点击的节点事件再冒泡回根节点，那么会执行两次 dispatchEvent 了，一次是俘获阶段，一次是冒泡阶段，这也是跟 16 版本不同的地方。

所以其实 react 事件机制 跟原生事件不一样的地方在于其实 react 只是在根节点注册了所有的原生事件监听, 通过捕获, 冒泡的方式触发各个节点绑定的节点事件, 各个节点并没有绑定任何事件, 我们可以验证一下

首先在原生节点上绑定一个 onClick 事件

![](@public/React/onClick1.jpg)

然后运行本地项目在谷歌浏览器找到绑定事件的节点

![](@public/React/chorme-dom-click2.jpg)

可以看到其实捕获, 冒泡事件只绑定在了根节点, 然后我们可能会疑惑那 header 上面的 onClick 事件是怎么触发的呢, 下面我们详细说下 react 事件机制的另一个主要表现: 事件触发

### 事件触发

我们尝试页面点击触发 click 事件, 会执行 dispatchEvent 函数, 而该函数最终会执行 batchedUpdates

![](@public/React/batchUpdates.jpg)

```js
// 点击事件触发
export function dispatchEvent(
  domEventName: DOMEventName, // 事件名称
  eventSystemFlags: EventSystemFlags, // 区别捕获和冒泡 冒泡0 捕获4
  targetContainer: EventTarget, // 根 dom
  nativeEvent: AnyNativeEvent
): void {
  if (!_enabled) {
    return;
  }
  // 全局搜索了下, 没有看到赋值的地方
  // enableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay 这个值目前看一直为true
  if (enableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay) {
    dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay(
      domEventName,
      eventSystemFlags,
      targetContainer,
      nativeEvent
    );
  } else {
    dispatchEventOriginal(
      domEventName,
      eventSystemFlags,
      targetContainer,
      nativeEvent
    );
  }
}
```

```js
function dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay(
  domEventName: DOMEventName, // 事件名
  eventSystemFlags: EventSystemFlags, // 0冒泡   4捕获
  targetContainer: EventTarget, // DOM
  nativeEvent: AnyNativeEvent // 原生DOM事件
) {
  // 在这里面 赋值 return_targetInst 为对应事件 DOM 的 Fiber节点
  let blockedOn = findInstanceBlockingEvent(
    domEventName,
    eventSystemFlags,
    targetContainer,
    nativeEvent
  );
  if (blockedOn === null) {
    // 批量执行事件
    dispatchEventForPluginEventSystem(
      domEventName,
      eventSystemFlags,
      nativeEvent,
      return_targetInst, // 点击 DOM 的 FiberNode
      targetContainer
    );
    clearIfContinuousEvent(domEventName, nativeEvent);
    return;
  }

  // 下面省略
}
```

<Card type="info">
<div>
  dispatchEventForPluginEventSystem 主要做的就是批量执行事件
</div>
</Card>

```js
export function dispatchEventForPluginEventSystem(
  domEventName: DOMEventName,  // 事件名
  eventSystemFlags: EventSystemFlags, // 0冒泡 捕获4
  nativeEvent: AnyNativeEvent, // 原生 DOM 事件
  targetInst: null | Fiber, // 对应 DOM 的 fiber 节点
  targetContainer: EventTarget, // 根节点 DOM
): void {
  let ancestorInst = targetInst;
  if (
    (eventSystemFlags & IS_EVENT_HANDLE_NON_MANAGED_NODE) === 0 &&
    (eventSystemFlags & IS_NON_DELEGATED) === 0
  ) {
    const targetContainerNode = ((targetContainer: any): Node);

  ...省略

  // 批量更新事件
  // if (domEventName === 'click') debugger
  batchedUpdates(() =>
    dispatchEventsForPlugins(
      domEventName,
      eventSystemFlags,
      nativeEvent,
      ancestorInst,
      targetContainer,
    ),
  );
}
```

<Card type="info">
<div>
  batchedUpdates是批量更新的逻辑。主要看看 dispatchEventsForPlugins 函数。
</div>
</Card>

```js
function dispatchEventsForPlugins(
  domEventName: DOMEventName, // 事件名
  eventSystemFlags: EventSystemFlags, // 0冒泡 4捕获
  nativeEvent: AnyNativeEvent, // 原生事件
  targetInst: null | Fiber, // 对应DOM事件的Fiber节点
  targetContainer: EventTarget
): void {
  // 找到发生事件的元素, 如果是点击 那就是点击事件的 DOM 节点
  const nativeEventTarget = getEventTarget(nativeEvent);
  // 待更新队列
  const dispatchQueue: DispatchQueue = [];
  // 收集事件
  extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer
  );

  // dispatchQueue 大概长这样
  // [{
  // event: {...}// react合成的事件源。
  // listeners: [{instance: 当前fiber, listener: f(), currentTaget: dom},{...},{...}]
  // }]
  // 消费事件
  processDispatchQueue(dispatchQueue, eventSystemFlags);
}
```

<Card type="success">
<div>
  <h1>主要是4个逻辑</h1>
  <ul>
    <li>1. 通过 getEventTarget 获取点击事件的 DOM 节点</li>
    <li>2. 创建一个 待更新队列</li>
    <li>3. 执行 extractEvents 收集事件, 从当前节点往上找, 包括捕获, 冒泡事件, 一直找到根节点</li>
    <li>4. 执行 processDispatchQueue 执行这些收集到的事件</li>
  </ul>
</div>
</Card>

我们先看看 extractEvents 怎么做收集的
其实就是执行了 SimpleEventPlugin.extractEvents

```js
function extractEvents(
  dispatchQueue: DispatchQueue, // 待更新队列
  domEventName: DOMEventName, // 事件名
  targetInst: null | Fiber, // DOM Fiber
  nativeEvent: AnyNativeEvent, // DOM 事件
  nativeEventTarget: null | EventTarget, // 点击的对应DOM
  eventSystemFlags: EventSystemFlags, // 0冒泡  4捕获
  targetContainer: EventTarget // 根节点 DOM
) {
  SimpleEventPlugin.extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer
  );
}
```

```js
function extractEvents(
  dispatchQueue: DispatchQueue, // 待更新队列
  domEventName: DOMEventName, // 事件名
  targetInst: null | Fiber, // 对应DOM Fiber
  nativeEvent: AnyNativeEvent, // DOM事件
  nativeEventTarget: null | EventTarget, // 事件对应的DOM节点
  eventSystemFlags: EventSystemFlags, // 0冒泡  4捕获
  targetContainer: EventTarget
): void {
  // 获取事件对应的react事件(驼峰命名) 例: click 事件在 react 中叫 onClick
  const reactName = topLevelEventsToReactNames.get(domEventName);
  if (reactName === undefined) {
    return;
  }
  // react 自己实现了一套event事件 包装了一下原生的 nativeEvent 事件
  let SyntheticEventCtor = SyntheticEvent; // 默认事件源
  let reactEventType: string = domEventName;
  // 根据事件获取对应的事件源
  switch (domEventName) {
    case "click":
      // Firefox creates a click event on right mouse clicks. This removes the
      // unwanted click events.
      if (nativeEvent.button === 2) {
        return;
      }
    /* falls through */
    case "auxclick":
    case "dblclick":
    case "mousedown":
    case "mousemove":
    case "mouseup":
    // TODO: Disabled elements should not respond to mouse events
    /* falls through */
    case "mouseout":
    case "mouseover":
    case "contextmenu":
      SyntheticEventCtor = SyntheticMouseEvent;
      break;
    // ... 省略
  }

  // 是否的捕获
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  if (
    enableCreateEventHandleAPI &&
    eventSystemFlags & IS_EVENT_HANDLE_NON_MANAGED_NODE
  ) {
    const listeners = accumulateEventHandleNonManagedNodeListeners(
      // TODO: this cast may not make sense for events like
      // "focus" where React listens to e.g. "focusin".
      ((reactEventType: any): DOMEventName),
      targetContainer,
      inCapturePhase
    );
    if (listeners.length > 0) {
      // Intentionally create event lazily.
      const event = new SyntheticEventCtor(
        reactName,
        reactEventType,
        null,
        nativeEvent,
        nativeEventTarget
      );
      dispatchQueue.push({ event, listeners });
    }
  } else {
    // Some events don't bubble in the browser.
    // In the past, React has always bubbled them, but this can be surprising.
    // We're going to try aligning closer to the browser behavior by not bubbling
    // them in React either. We'll start by not bubbling onScroll, and then expand.
    //有些事件不会在浏览器中冒泡。
    //在过去，React总是让它们冒泡，但这可能令人惊讶。
    //我们将尝试通过不冒泡来更接近浏览器行为
    //他们也在React中。我们将从不在Scroll上冒泡开始，然后展开。
    const accumulateTargetOnly =
      !inCapturePhase &&
      // TODO: ideally, we'd eventually add all events from
      // nonDelegatedEvents list in DOMPluginEventSystem.
      // Then we can remove this special list.
      // This is a breaking change that can wait until React 18.
      domEventName === "scroll";

    // 获取真正的执行函数列表
    const listeners = accumulateSinglePhaseListeners(
      targetInst, // 对应DOM 的 Fiber
      reactName, // react事件名
      nativeEvent.type, // Dom 事件名 例: click
      inCapturePhase, // 是否捕获
      accumulateTargetOnly, // 是否冒泡
      nativeEvent // Dom事件
    );
    if (listeners.length > 0) {
      // 有的话就生成事件源
      // Intentionally create event lazily.
      const event = new SyntheticEventCtor(
        reactName,
        reactEventType,
        null,
        nativeEvent,
        nativeEventTarget
      );
      // push进更新队列
      dispatchQueue.push({ event, listeners });
    }
  }
}
```

这个函数的重点就是

- 根据不同的事件获取事件源。
- 执行 accumulateSinglePhaseListeners , 获取所有的 listener。
- 生成 react 的事件源，push 进 dispatchQueue 队列。

上面的代码针对事件源这块我们需要注意下 SyntheticEventCtor, 因为 react 自己实现了一套 event 事件 包装了一下原生的 nativeEvent 事件, 所以我们在写节点 onClick 事件的时候, 如果需要阻止冒泡, 我们需要执行 event.stopPropagation(), 这个 event 其实不是原生的 nativeEvent, 而是 SyntheticEventCtor, 所以 stopPropagation 方法也是经过包装的, 想了解细节的可以看
src/react/packages/react-dom/src/events/SyntheticEvent.js 下的 createSyntheticEvent 方法

接着我们着重看下 accumulateSinglePhaseListeners 做了什么

```js
export function accumulateSinglePhaseListeners(
  targetFiber: Fiber | null, // 对应DOM 的 Fiber
  reactName: string | null, // react事件名 比如说 onClick
  nativeEventType: string, // Dom 事件名 例: click
  inCapturePhase: boolean, // 是否捕获
  accumulateTargetOnly: boolean, // 是否冒泡
  nativeEvent: AnyNativeEvent // DOM事件
): Array<DispatchListener> {
  const captureName = reactName !== null ? reactName + "Capture" : null;
  // react 事件名 比如说 onClick
  const reactEventName = inCapturePhase ? captureName : reactName;
  let listeners: Array<DispatchListener> = [];

  let instance = targetFiber;
  let lastHostComponent = null;
  // Accumulate all instances and listeners via the target -> root path.
  // 这里已经说明了在目标节点到根节点的路径上找到所有实例的监听器进行收集
  while (instance !== null) {
    const { stateNode, tag } = instance;
    // Handle listeners that are on HostComponents (i.e. <div>)
    // HostComponent HTML 原生组件 如 a div标签
    if (tag === HostComponent && stateNode !== null) {
      lastHostComponent = stateNode;

      // ...省略
      // Standard React on* listeners, i.e. onClick or onClickCapture
      if (reactEventName !== null) {
        // 获取原生组件上的事件函数
        // 这里其实就拿到了对应节点的 onClick 事件的函数方法
        const listener = getListener(instance, reactEventName);
        if (listener != null) {
          // if (nativeEventType === 'click') debugger
          listeners.push(
            // 这里会返回一个对象 {instance,listener,currentTarget}
            createDispatchListener(instance, listener, lastHostComponent)
          );
        }
      }
    } else if (
      enableCreateEventHandleAPI &&
      enableScopeAPI &&
      tag === ScopeComponent &&
      lastHostComponent !== null &&
      stateNode !== null
    ) {
      // Scopes
      const reactScopeInstance = stateNode;
      const eventHandlerListeners = getEventHandlerListeners(
        reactScopeInstance
      );
      if (eventHandlerListeners !== null) {
        eventHandlerListeners.forEach((entry) => {
          if (
            entry.type === nativeEventType &&
            entry.capture === inCapturePhase
          ) {
            listeners.push(
              createDispatchListener(
                instance,
                entry.callback,
                (lastHostComponent: any)
              )
            );
          }
        });
      }
    }
    // ...省略
    instance = instance.return;
  }
  return listeners;
}
```

<Card type="info">
<div>
  最后看如何消费 dispatchQueue 队列 也就是执行 processDispatchQueue
</div>
</Card>

```js
export function processDispatchQueue(
  dispatchQueue: DispatchQueue, // 时间队列
  eventSystemFlags: EventSystemFlags // 0冒泡 4捕获
): void {
  // 是否是捕获
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  for (let i = 0; i < dispatchQueue.length; i++) {
    const { event, listeners } = dispatchQueue[i];
    processDispatchQueueItemsInOrder(event, listeners, inCapturePhase);
    //  event system doesn't use pooling.
  }
  // This would be a good time to rethrow if any of the event handlers threw.
  // 如果有错误 会抛出
  rethrowCaughtError();
}
```

```js
// 执行节点上的 Listeners
function processDispatchQueueItemsInOrder(
  event: ReactSyntheticEvent, // 事件源
  dispatchListeners: Array<DispatchListener>, // 事件列表
  inCapturePhase: boolean // 是否捕获
): void {
  let previousInstance;
  if (inCapturePhase) {
    // 捕获的话倒序执行
    for (let i = dispatchListeners.length - 1; i >= 0; i--) {
      const { instance, currentTarget, listener } = dispatchListeners[i];
      // 是否已经阻止冒泡
      // 这里可以判断是因为 react自己包装了一下原生event 模拟实现了阻止冒泡的事件
      if (instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }
      executeDispatch(event, listener, currentTarget);
      previousInstance = instance;
    }
  } else {
    // 冒泡的话正序执行
    for (let i = 0; i < dispatchListeners.length; i++) {
      const { instance, currentTarget, listener } = dispatchListeners[i];
      // 是否已经阻止冒泡
      if (instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }
      executeDispatch(event, listener, currentTarget);
      previousInstance = instance;
    }
  }
}
```

```js
// 执行事件函数
function executeDispatch(
  event: ReactSyntheticEvent,
  listener: Function,
  currentTarget: EventTarget
): void {
  const type = event.type || "unknown-event";
  event.currentTarget = currentTarget;
  // 这个里面包了很多层 目的就是为了执行 listener 这个事件方法
  invokeGuardedCallbackAndCatchFirstError(type, listener, undefined, event);
  event.currentTarget = null;
}
```

- 通过 for 循环消费 listeners 数组，这里俘获的时候，执行顺序是从后往前的，为的是更好模拟俘获顺序。
- 然后阻止冒泡的逻辑依然是判断 event.isPropagationStopped
- 执行 executeDispatch 函数，他是最终执行 listener 函数。

自此，事件触发阶段完毕。
一次点击，两次 dispatchEvent 函数触发。

![](@public/React/react-events-process.png)

(图片来自掘金的《react 进阶实践指南》)

新版本的在初始化的时候，就已经绑定事件了。而老版本是在遍历 fiber 节点的 props 遇到事件注册才会向容器绑定事件。

其次就是执行时机的不同，在老版本，所有事件不管是俘获还是冒泡，本质就是在冒泡的时候，遍历 fiber 树，收集俘获和冒泡的事件，形成事件队列，依次执行，以此模拟事件流。

而在新版本，一次事件的触发会执行两次 dispatchEvent，第一次收集所有的俘获事件执行。第二次收集所有的冒泡事件执行。执行时机与原生的俘获冒泡时机相同。

参考掘金的 《react 进阶实践指南》

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

### 1. 请求调度

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

主要代码在 src/react/packages/scheduler/src/forks/Scheduler.js 下

先看 unstable_scheduleCallback 方法

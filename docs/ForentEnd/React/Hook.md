# 使用 React Hook 编写函数组件

## 强制刷新组件

```js
const [data, setData] = useState(dataSource);
const [refreshKey, setRefreshKey] = useState(null); // 这里可以用时间戳

useEffect(() => {
  if (!_.isEqual(dataSource, data)) {
    setData(dataSource);
  }
}, [dataSource, refreshKey]);
```

当 refreshKey 变化的时候 就会触发 useEffect 然后做一些处理重新刷新组件

## 持久化 function 的 Hook ( usePersistFn )

[如何从 useCallback 读取一个经常变化的值？](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback)

官方的一句话:
在某些罕见场景中，你可能会需要用 useCallback 记住一个回调，但由于内部函数必须经常重新创建，记忆效果不是很好。如果你想要记住的函数是一个事件处理器并且在渲染期间没有被用到, 你可以 把 ref 当做实例变量 来用，并手动把最后提交的值保存在它当中.

具体实现如下:

```ts
import { useRef } from "react";

export type noop = (...args: any[]) => any;

export default function usePersistFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn; // 这地方如果不重新赋值 而是在useRef里面初始化赋值的话 函数内部拿不到最新的值
  // 原因分析: useRef也是有缓存的, 如果不重新赋值的话 fn 是不会重新赋值给fnRef的 但是这个时候 fn已经变了 所以需要重新赋值

  const persistFn = useRef<T>();

  if (!persistFn.current) {
    persistFn.current = function(...args) {
      console.log(this, args);
      return fnRef.current();
    } as T;
  }

  return persistFn.current;
}
```

从上面代码我们可以看到 其实就是将 fn 每次都存储到 fnRef 上, 然后再用另一个 persistFn 去声明一个函数缓存 fnRef 的方法, 这样的话 persistFn 的值永远都不会有变化, 不会生成新的函数, 但是 fn 每次组件刷新都会生成新的 fn.

这样的话就可以保证 fn 内部去获取经常变化的值都最新的了

因为 persistFn 每次返回的值都不会变化, 所以不会造成视图渲染, 优化了渲染性能
需要注意的是, 每次父组件都会渲染一次, 子组件如果不想渲染还是要用 React.memo 包裹一下, 不然还是会被重新渲染

### 案例

```js
import React, { useState, useCallback } from "react";
import { usePersistFn } from "jiang-hooks";
import { message } from "antd";

function ViewCount({ showCount }) {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  return (
    <div>
      <div>renderCountRef.current: {renderCountRef.current}</div>
      <button onClick={showCount}>显示count</button>
    </div>
  );
}

ViewCount = React.memo(ViewCount);

export default function() {
  const [count, setCount] = useState(1);

  const showCountPersistFn = usePersistFn(() => {
    message.success("showCountPersistFn: " + count);
  });

  const showCount = () => {
    message.success("showCountPersistFn: " + count);
  };

  const showCountCallback = useCallback(() => {
    message.success("showCountCallback: " + count);
  }, [count]);

  return (
    <div>
      <div>count: {count}</div>

      <button onClick={() => setCount((count) => count + 1)}>增加count</button>

      <div>
        {/* 弊端: 因为每次都会生成新的函数, 雷同于 useCallback 会重新渲染子组件 */}
        <div>原生组件</div>
        <ViewCount showCount={showCount} />
      </div>
      <div>
        {/* 内存会对新的函数包一层缓存, 缓存内部去调用新的函数, 所以不会触发子组件重新渲染 */}
        <div>usePersistFn组件</div>
        <ViewCount showCount={showCountPersistFn} />
      </div>
      <div>
        {/* 弊端: 因为每次都会生成新的函数, 会重新渲染子组件 */}
        <div>showCountCallback组件</div>
        <ViewCount showCount={showCountCallback} />
      </div>
    </div>
  );
}
```

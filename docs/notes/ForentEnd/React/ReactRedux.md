# ReactRedux 源码解析

## 依赖

| 项目             | 版本号 |
| ---------------- | ------ |
| react            | 18.2.0 |
| react-redux      | 8.0.5  |
| react-redux      | 4.2.0  |
| @reduxjs/toolkit | 1.9.1  |

[调试源码项目](https://github.com/18355166248/debug-redux-ts)

## 使用

我们先看下我们是怎么使用 react-redux 的

[Demo](https://github.com/18355166248/debug-redux-ts/blob/main/src/Example/one/index.tsx)

```ts
// src/Example/one/index.tsx
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// src/Example/one/app/store.ts
import { configureStore, ThunkAction, Action } from "redux-toolkit";
import counterReducer from "../features/counter/counterSlice";
// 这里生成 store
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// src/Example/one/features/counter/Counter.tsx
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { decrement } from './counterSlice';

export function Counter() {
  const count = useAppSelector(selectCount); // 这里触发 useSelector
  const dispatch = useAppDispatch(); // 这里触发 useDispatch

  return (
    <div>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  )
}
```

## 源码

react-redux 的 Provider 组件在 src/react-redux/src/components/Provider.tsx 下


<Card type="danger" text="注意: 入口文件我们初始化了 useSelector 下的 useSyncExternalStoreWithSelector 方法" />

```ts
// src/react-redux/src/components/Provider.tsx
function Provider<A extends Action = AnyAction, S = unknown>({
  store,
  context,
  children,
  serverState,
}: ProviderProps<A, S>) {
  const contextValue = useMemo(() => {
    // 创建监听参数 放入 react 的 context 中
    const subscription = createSubscription(store)
    return {
      store,
      subscription,
      getServerState: serverState ? () => serverState : undefined,
    }
  }, [store, serverState])

  const previousState = useMemo(() => store.getState(), [store])

  useIsomorphicLayoutEffect(() => {
    const { subscription } = contextValue
    // 声明 onStateChange 方法为 notifyNestedSubs 方法
    subscription.onStateChange = subscription.notifyNestedSubs
    // 初始化 store.subscribe 当执行 strore.dispatch 的时候 会触发 onStateChange( notifyNestedSubs ) 方法
    subscription.trySubscribe()
    console.log(
      'previousState !== store.getState()',
      previousState !== store.getState()
    )
    if (previousState !== store.getState()) {
      // 触发更新
      subscription.notifyNestedSubs()
    }
    return () => {
      console.log('销毁订阅')
      subscription.tryUnsubscribe()
      subscription.onStateChange = undefined
    }
  }, [contextValue, previousState])
  // 默认使用内部初始化的 context
  const Context = context || ReactReduxContext

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
```

我们看下 createSubscription 做了什么

```ts
function createListenerCollection() {
  const batch = getBatch()
  let first: Listener | null = null
  let last: Listener | null = null

  return {
    clear() {
      first = null
      last = null
    },

    notify () {
      batch(() => {
        debugger
        let listener = first
        while (listener) {
          // 这个callback 就是 react-dom 的 subscribeToStore 也就是 告知react重新渲染 那也就是能拿到最新的 redux 的值了
          listener.callback()
          listener = listener.next
        }
      })
    },

    get() {
      let listeners: Listener[] = []
      let listener = first
      while (listener) {
        listeners.push(listener)
        listener = listener.next
      }
      return listeners
    },

    subscribe (callback: () => void) {
      let isSubscribed = true

      let listener: Listener = (last = {
        callback,
        next: null,
        prev: last,
      })

      if (listener.prev) {
        listener.prev.next = listener
      } else {
        first = listener
      }

      return function unsubscribe() {
        if (!isSubscribed || first === null) return
        isSubscribed = false

        if (listener.next) {
          listener.next.prev = listener.prev
        } else {
          last = listener.prev
        }
        if (listener.prev) {
          listener.prev.next = listener.next
        } else {
          first = listener.next
        }
      }
    },
  }
}

export function createSubscription(store: any, parentSub?: Subscription) {
  let unsubscribe: VoidFunc | undefined
  let listeners: ListenerCollection = nullListeners

  function addNestedSub (listener: () => void) {
    trySubscribe()
    return listeners.subscribe(listener)
  }
  // 触发更新
  function notifyNestedSubs () {
    listeners.notify()
  }
  // 每次执行 dispatch 都会 触发这个方法 因为下面 subscribe 了
  // onStateChange 就是 notifyNestedSubs 也就是 notify
  function handleChangeWrapper () {
    if (subscription.onStateChange) {
      subscription.onStateChange()
    }
  }
  // 判断是否已经初始化订阅
  function isSubscribed() {
    return Boolean(unsubscribe)
  }
  // 初始化订阅
  function trySubscribe() {
    if (!unsubscribe) {
      unsubscribe = parentSub
        ? parentSub.addNestedSub(handleChangeWrapper)
        : store.subscribe(handleChangeWrapper)

      listeners = createListenerCollection()
    }
  }
  // 销毁订阅
  function tryUnsubscribe() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = undefined
      listeners.clear()
      listeners = nullListeners
    }
  }

  const subscription: Subscription = {
    addNestedSub,
    notifyNestedSubs,
    handleChangeWrapper,
    isSubscribed,
    trySubscribe,
    tryUnsubscribe,
    getListeners: () => listeners,
  }

  return subscription
}

```

到这里我们可以理解了, react-redux 主要就拿到 redux 生成的 store, store 张这样

```js
{
  @@observable:ƒ observable(),
  dispatch:action => {…}, // 触发 action
  getState:ƒ getState(), // 获取最新的 state
  replaceReducer:ƒ replaceReducer(nextReducer),
  subscribe:ƒ subscribe(listener), // 订阅功能 当执行 dispatch 会触发
}
```

<Card type="success" text="所以 react-redux 就是拿到 store, 然后通过 react 的 context 功能将数据绑定上去, 再暴露出 dispatch 方法, 当用户执行 dispatch 方法更新 state 的时候, 触发 subscribe, 从而触发 react-dom 方法, 触发更新, 重新执行 render. 触发组件执行, 页面重新渲染更新" />


我们再看下 useSelector, useDispatch 是怎么实现的 (其实就是一个自定义hook)

  ```ts
  export function createSelectorHook(
    context = ReactReduxContext
  ): <TState = unknown, Selected = unknown>(
    selector: (state: TState) => Selected,
    equalityFn?: EqualityFn<Selected>
  ) => Selected {
    // 这里拿到了 useContext
    const useReduxContext =
      context === ReactReduxContext
        ? useDefaultReduxContext
        : () => useContext(context)

    return function useSelector<TState, Selected extends unknown>(
      selector: (state: TState) => Selected,
      equalityFn: EqualityFn<NoInfer<Selected>> = refEquality
    ): Selected {
      if (process.env.NODE_ENV !== 'production') {
        if (!selector) {
          throw new Error(`You must pass a selector to useSelector`)
        }
        if (typeof selector !== 'function') {
          throw new Error(`You must pass a function as a selector to useSelector`)
        }
        if (typeof equalityFn !== 'function') {
          throw new Error(
            `You must pass a function as an equality function to useSelector`
          )
        }
      }
      // 这里拿到的 context 上的 value
      const { store, subscription, getServerState } = useReduxContext()!
      // 这里就是 react 自己封装的库 use-sync-external-store 暴露的方法 目的就是为了提供给三方库使用
      // 作用就是可以拿到最新的 state 因为在react18开始, concurrent 模式是异步的, 可中断的, 所以如果使用useState可能拿到的不是最新的值 这里的底层实现方式也就是将默认的异步更新强制转为同步模式, 所以可能会存在一直执行更新 我感觉这里也是不很优美 会消耗性能
      // selector 是一个函数 目的就是通过 store.getState() 拿到最新的 state, 然后格式化拿到具体需要的参数
      const selectedState = useSyncExternalStoreWithSelector(
        subscription.addNestedSub,
        store.getState,
        getServerState || store.getState,
        selector,
        equalityFn
      )

      useDebugValue(selectedState)

      return selectedState
    }
  }
  ```


  ```ts
  export function createDispatchHook<
    S = unknown,
    A extends Action = AnyAction
    // @ts-ignore
    > (context?: Context<ReactReduxContextValue<S, A>> = ReactReduxContext) {
      // @ts-ignore
    console.log('context === ReactReduxContext', context === ReactReduxContext) // true
    const useStore =
      // @ts-ignore
      context === ReactReduxContext ? useDefaultStore : createStoreHook(context)

    return function useDispatch<
      AppDispatch extends Dispatch<A> = Dispatch<A>
    >(): AppDispatch {
      const store = useStore()
      // @ts-ignore
      // 所以拿到的就是 redux 生成的 dispatch
      return store.dispatch
    }
  }
  ```

我们这里画一个流程图方便大家理解

![](~@public/React/react-redux8.jpg)

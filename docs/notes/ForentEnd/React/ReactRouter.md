# React 路由

1. 切换路由不存入 history 记录中

![](@public/React/react-router-link-replace.jpg)

2. 调试 react-router 源码

下载 [官网](https://github.com/remix-run/react-router)的代码

在目录 examples 下有很多 demo 代码.

我们可以在对应 demo 下自己安装依赖 就可以 debug 源码了

或者我们 copy 出 demo 目录, 在 src 目录下 clone 官网的目录

```
git clone --branch main git@github.com:remix-run/react-router.git
```

修改 vite.config.ts 的配置

```ts

{
    resolve: process.env.USE_SOURCE
    ? {
        alias: {
          "@remix-run/router": path.resolve(
            __dirname,
            "./src/react-router/packages/router/index.ts"
          ),
          "react-router": path.resolve(
            __dirname,
            "./src/react-router/packages/react-router/index.ts"
          ),
          "react-router-dom": path.resolve(
            __dirname,
            "./src/react-router/packages/react-router-dom/index.tsx"
          ),
        },
      }
    : {},
}
```

因为还依赖环境变量 所以我们需要安装 cross-env 依赖

```
npm i -D cross-env
```

修改 package.json 的命令

```json
{
  "scripts": {
    "dev": "cross-env USE_SOURCE=1 vite",
    "build": "tsc && vite build",
    "serve": "vite preview"
  }
}
```

至此 我们一家可以调试我们的 react-router 的源码了

## react-router6 源码解析

我们项目中使用的

```js
import { Routes, Route } from "react-router-dom";

<BrowserRouter>
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<PublicPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/protected"
        element={
          <RequireAuth>
            <ProtectedPage />
          </RequireAuth>
        }
      >
        <Route path="/protected/test1" element={<Test1 />} />
      </Route>
    </Route>
  </Routes>
  ;
</BrowserRouter>;
```

BrowserRouter 初始化

> src\react-router\packages\react-router-dom\index.tsx

```js
export function BrowserRouter({
  basename,
  children,
  window,
}: BrowserRouterProps) {
  let historyRef = React.useRef<BrowserHistory>();
  if (historyRef.current == null) {
    // 初始化 history
    historyRef.current = createBrowserHistory({ window, v5Compat: true });
  }

  let history = historyRef.current;
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  // 初始化lisnter 单例方法 执行 push replace 都会触发 setState(也就是 getUrlBasedHistory 里面的 listener)
  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}
```

> src\react-router\packages\router\history.ts

```js
export function createBrowserHistory(
  options: BrowserHistoryOptions = {}
): BrowserHistory {
  // 创建 loacation 对象
  function createBrowserLocation(
    window: Window,
    globalHistory: Window["history"]
  ) {
    let { pathname, search, hash } = window.location;
    return createLocation(
      "",
      { pathname, search, hash },
      // state defaults to `null` because `window.history.state` does
      (globalHistory.state && globalHistory.state.usr) || null,
      (globalHistory.state && globalHistory.state.key) || "default"
    );
  }

  // createPath 因为只传了一个参数 所以其实返回的就是 to
  function createBrowserHref(window: Window, to: To) {
    return typeof to === "string" ? to : createPath(to);
  }

  return getUrlBasedHistory(
    createBrowserLocation,
    createBrowserHref,
    null,
    options
  );
}
```

> src\react-router\packages\router\history.ts

```js
function getUrlBasedHistory(
  getLocation: (window: Window, globalHistory: Window["history"]) => Location,
  createHref: (window: Window, to: To) => string,
  validateLocation: ((location: Location, to: To) => void) | null,
  options: UrlHistoryOptions = {}
): UrlHistory {
  let { window = document.defaultView!, v5Compat = false } = options;
  let globalHistory = window.history;
  let action = Action.Pop;
  let listener: Listener | null = null;

  function handlePop() {
    action = Action.Pop;
    if (listener) {
      listener({ action, location: history.location });
    }
  }

  // push方法
  function push(to: To, state?: any) {
    action = Action.Push;
    // 创建 location
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);

    let historyState = getHistoryState(location);
    let url = history.createHref(location);

    // try...catch because iOS limits us to 100 pushState calls :/
    // 使用 window.pushState 新增访问记录 ios记录上限是100 所以需要try catch下 使用 window.location.assign 跳转新地址
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      // They are going to lose state here, but there is no real
      // way to warn them about it since the page will refresh...
      window.location.assign(url);
    }

    // v5Compat 是 true 触发监听
    if (v5Compat && listener) {
      listener({ action, location: history.location });
    }
  }

  function replace(to: To, state?: any) {
    action = Action.Replace;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);

    let historyState = getHistoryState(location);
    let url = history.createHref(location);
    // 执行 window.history replaceState 方法替换访问记录
    globalHistory.replaceState(historyState, "", url);

    if (v5Compat && listener) {
      listener({ action, location: history.location });
    }
  }

  let history: History = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window, globalHistory);
    },
    // 初始化 listener 单例
    listen(fn: Listener) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window.addEventListener(PopStateEventType, handlePop);
      listener = fn;

      return () => {
        window.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window, to);
    },
    encodeLocation(to) {
      // Encode a Location the same way window.location would
      let url = createClientSideURL(
        typeof to === "string" ? to : createPath(to)
      );
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
      };
    },
    push,
    replace,
    go(n) {
      return globalHistory.go(n);
    },
  };

  return history;
}
```

Router 初始化

> src\react-router\packages\react-router\lib\components.tsx

```js
export function Router({
  basename: basenameProp = "/",
  children = null,
  location: locationProp,
  navigationType = NavigationType.Pop,
  navigator,
  static: staticProp = false,
}: RouterProps): React.ReactElement | null {
  invariant(
    !useInRouterContext(),
    `You cannot render a <Router> inside another <Router>.` +
      ` You should never have more than one in your app.`
  );

  // Preserve trailing slashes on basename, so we can let the user control
  // the enforcement of trailing slashes throughout the app
  // navigator 就是 history
  let basename = basenameProp.replace(/^\/*/, "/"); // 将开头的多个斜杠替换成一个斜杠
  let navigationContext = React.useMemo(
    () => ({ basename, navigator, static: staticProp }),
    [basename, navigator, staticProp]
  );

  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }

  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default",
  } = locationProp;

  let location = React.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);

    if (trailingPathname == null) {
      return null;
    }

    return {
      pathname: trailingPathname,
      search,
      hash,
      state,
      key,
    };
  }, [basename, pathname, search, hash, state, key]);

  warning(
    location != null,
    `<Router basename="${basename}"> is not able to match the URL ` +
      `"${pathname}${search}${hash}" because it does not start with the ` +
      `basename, so the <Router> won't render anything.`
  );

  if (location == null) {
    return null;
  }

  // 初始化 context
  return (
    <NavigationContext.Provider value={navigationContext}>
      <LocationContext.Provider
        children={children}
        value={{ location, navigationType }}
      />
    </NavigationContext.Provider>
  );
}
```

Routes 初始化

> src\react-router\packages\react-router\lib\components.tsx

```js
export function Routes({
  children,
  location,
}: RoutesProps): React.ReactElement | null {
  let dataRouterContext = React.useContext(DataRouterContext);
  // 这里会判断假如说外层有 DataRouterContext 就用 dataRouterContext 的路由
  // 如果没有 就递归循环 children 生成routes
  let routes =
    dataRouterContext && !children
      ? (dataRouterContext.router.routes as DataRouteObject[])
      : createRoutesFromChildren(children);
  return useRoutes(routes, location);
}
```

useRotues

> src\react-router\packages\react-router\lib\hooks.tsx

```js
export function useRoutes(
  routes: RouteObject[],
  locationArg?: Partial<Location> | string
): React.ReactElement | null {
  let { navigator } = React.useContext(NavigationContext);
  let dataRouterStateContext = React.useContext(DataRouterStateContext);
  let { matches: parentMatches } = React.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;

  let locationFromContext = useLocation();

  let location;
  if (locationArg) {
    let parsedLocationArg =
      typeof locationArg === "string" ? parsePath(locationArg) : locationArg;

    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }

  let pathname = location.pathname || "/";
  let remainingPathname =
    parentPathnameBase === "/"
      ? pathname
      : pathname.slice(parentPathnameBase.length) || "/";

  // 过滤当前匹配路由的组件
  let matches = matchRoutes(routes, { pathname: remainingPathname });

  // 渲染 RenderedRoute
  let renderedMatches = _renderMatches(
    matches &&
      matches.map((match) =>
        Object.assign({}, match, {
          params: Object.assign({}, parentParams, match.params),
          pathname: joinPaths([
            parentPathnameBase,
            // Re-encode pathnames that were decoded inside matchRoutes
            navigator.encodeLocation
              ? navigator.encodeLocation(match.pathname).pathname
              : match.pathname,
          ]),
          pathnameBase:
            match.pathnameBase === "/"
              ? parentPathnameBase
              : joinPaths([
                  parentPathnameBase,
                  // Re-encode pathnames that were decoded inside matchRoutes
                  navigator.encodeLocation
                    ? navigator.encodeLocation(match.pathnameBase).pathname
                    : match.pathnameBase,
                ]),
        })
      ),
    parentMatches,
    dataRouterStateContext || undefined
  );

  // When a user passes in a `locationArg`, the associated routes need to
  // be wrapped in a new `LocationContext.Provider` in order for `useLocation`
  // to use the scoped location instead of the global location.
  if (locationArg && renderedMatches) {
    return (
      <LocationContext.Provider
        value={{
          location: {
            pathname: "/",
            search: "",
            hash: "",
            state: null,
            key: "default",
            ...location,
          },
          navigationType: NavigationType.Pop,
        }}
      >
        {renderedMatches}
      </LocationContext.Provider>
    );
  }

  return renderedMatches;
}
```

\_renderMatches 渲染命中的路由组件

> src\react-router\packages\react-router\lib\hooks.tsx

```js
export function _renderMatches(
  matches: RouteMatch[] | null, // 路由嵌套数组
  parentMatches: RouteMatch[] = [],
  dataRouterState?: RemixRouter["state"]
): React.ReactElement | null {
  if (matches == null) {
    if (dataRouterState?.errors) {
      // Don't bail if we have data router errors so we can render them in the
      // boundary.  Use the pre-matched (or shimmed) matches
      matches = dataRouterState.matches as DataRouteMatch[];
    } else {
      return null;
    }
  }

  let renderedMatches = matches;

  // If we have data errors, trim matches to the highest error boundary
  let errors = dataRouterState?.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex(
      (m) => m.route.id && errors?.[m.route.id]
    );
    invariant(
      errorIndex >= 0,
      `Could not find a matching route for the current errors: ${errors}`
    );
    renderedMatches = renderedMatches.slice(
      0,
      Math.min(renderedMatches.length, errorIndex + 1)
    );
  }

  // 遍历数组 从尾部向前
  return renderedMatches.reduceRight((outlet, match, index) => {
    let error = match.route.id ? errors?.[match.route.id] : null;
    // Only data routers handle errors
    let errorElement = dataRouterState
      ? match.route.errorElement || <DefaultErrorElement />
      : null;
    let matches = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => (
      <RenderedRoute match={match} routeContext={{ outlet, matches }}>
        {error
          ? errorElement
          : match.route.element !== undefined
          ? match.route.element
          : outlet}
      </RenderedRoute>
    );
    // Only wrap in an error boundary within data router usages when we have an
    // errorElement on this route.  Otherwise let it bubble up to an ancestor
    // errorElement
    return dataRouterState && (match.route.errorElement || index === 0) ? (
      <RenderErrorBoundary
        location={dataRouterState.location}
        component={errorElement}
        error={error}
        children={getChildren()}
        routeContext={{ outlet: null, matches }}
      />
    ) : (
      getChildren()
    );
  }, null as React.ReactElement | null);
}
```

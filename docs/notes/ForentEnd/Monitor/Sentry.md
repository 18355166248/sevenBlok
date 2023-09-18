# Sentry

Package: npm:@sentry/react
Version: 7.69.0

本文将采用 @sentry/react 进行搭建

## 导航

- [sentry 官方文档](https://docs.sentry.io/platforms/javascript/)

### 安装依赖

```js
yarn add @sentry/react
yarn add -D @sentry/webpack-plugin
```

### 初始化

```javascript
// https://docs.sentry.io/platforms/javascript/guides/react/features/react-router/?original_referrer=https%3A%2F%2Fdocs.sentry.io%2Fplatforms%2Fjavascript%2Fguides%2Freact%2F
/**
 * 初始化 Sentry
 */
isProd &&
  Sentry.init({
    dsn: "", // 填写 Client Keys DSN
    tracesSampleRate: 0.1, // 它的值决定了性能指标数据上报的频率 如果 tracesSampleRate 为 0.7, 那么用户在使用应用时，70% 的几率会上报性能数据，30% 的几率不会上报性能数据。注意，如果 tracesSampleRate 设置为 0，则不上报性能指标数据。
    release: packageInfo.version || "last", // 版本号控制

    replaysSessionSampleRate: 0.1, // 上传报错视频回顾采样率10%

    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    // 对整个报错会话采用100%采样
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      new Sentry.Replay(),
      new Sentry.BrowserTracing({
        // react-router 确保收集有关页面加载和相关请求的运行状况的有意义的性能数据
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
    ],
  });
```

#### [Sentry Common Options](https://docs.sentry.io/platforms/javascript/configuration/options/)

- dsn
  sentry 项目配置会自动生成
- debug
  如果发送事件时出现问题，SDK 将尝试打印出有用的调试信息
- release
  SDK 会尝试从环境变量 SENTRY_RELEASE 中读取该值（在浏览器 SDK 中，将从 window.SENTRY_RELEASE 中读取该值，如果可用）。
  以下不符合命名规范:
  - 包含换行符、制表符、正斜杠 (/) 或反斜杠 (\)
  - 句号 (.)、双句号 (..) 或空格 ( )
  - 超过 200 个字符
- environment
  默认情况下，SDK 将尝试从 SENTRY_ENVIRONMENT 环境变量中读取该值（浏览器 SDK 除外）

#### 如果你要删除很多重复的数据用下面这种方式

```javascript
import * as Sentry from "@sentry/browser";
import { Dedupe as DedupeIntegration } from "@sentry/integrations";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  integrations: [new DedupeIntegration()],
});
```

### [sourcemap](https://docs.sentry.io/platforms/javascript/sourcemaps/)

If you use Webpack in your project, we recommend generating and uploading your source maps by way of [sentry-webpack-plugin](https://github.com/getsentry/sentry-webpack-plugin). If you use a different tool to generate source maps, you can use sentry-cli to upload them to Sentry.

```javascript
// webpack.config.js
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");

module.exports = {
  // ... other config above ...

  devtool: "source-map", // Source map generation must be turned on
  plugins: [
    sentryWebpackPlugin({
      url: process.env.REACT_APP_SOURCE_MAPPING_URL, // 上传 sourcemap 的地址
      org: "xmly", // 组织名
      project: projectName, // package.json 的name
      authToken: process.env.SENTRY_AUTH_TOKEN, // 用户的授权token
    }),
  ],
};
```

### [react 配置](https://docs.sentry.io/platforms/javascript/guides/react/features/?original_referrer=https%3A%2F%2Fcn.bing.com%2F)

react 项目一般需要配置下才能上报报错, 如下

#### React Error Boundary

Learn how the React SDK exports an error boundary component that leverages React component APIs.

```js
import React from "react";
import * as Sentry from "@sentry/react";

import { Example } from "../example";

function FallbackComponent() {
  return <div>An error has occurred</div>;
}

const myFallback = <FallbackComponent />;
// Alternatively:
// const myFallback = () => <FallbackComponent />;

class App extends React.Component {
  render() {
    return (
      <Sentry.ErrorBoundary fallback={myFallback} showDialog>
        <Example />
      </Sentry.ErrorBoundary>
    );
  }
}

export default App;
```

当然也可以自己手动上报

```js
import React from "react";
import { isFunction } from "lodash-es";
import "./index.scoped.scss";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import * as Sentry from "@sentry/react";

// 出错后显示的元素类型
type FallbackElement = React.ReactElement<
  unknown,
  string | React.FC | typeof React.Component
> | null;

// 出错显示组件的 props
export interface FallbackProps {
  error: Error;
}

type ErrorInfoType = Record<string, unknown>;

// 本组件 ErrorBoundary 的 props
interface ErrorBoundaryProps {
  fallback?: FallbackElement;
  onError?: (error: Error, info: ErrorInfoType) => void;
}

// 本组件 ErrorBoundary 的 props
interface ErrorBoundaryState {
  error: Error | null; // 将 hasError 的 boolean 改为 Error 类型，提供更丰富的报错信息
}

// 初始状态
const initialState: ErrorBoundaryState = {
  error: null,
};

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  state = initialState;

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    if (process.env.NODE_ENV === "production") {
      // 手动上报
      Sentry.captureException(error, { extra: errorInfo });
    }

    if (isFunction(this.props.onError)) {
      this.props.onError(error, errorInfo.componentStack);
    }
  }

  try = () => {
    this.setState(initialState);
  };

  render() {
    const { fallback } = this.props;
    const { error } = this.state;

    if (error !== null) {
      if (React.isValidElement(fallback)) {
        return fallback;
      }

      return (
        <div className="error pt-20">
          <div>
            <CloseCircleOutlined className="close-icon" />
          </div>
          <div className="my-4">出错了, 请刷新重试</div>
          <div>
            <Button type="primary" size="small" onClick={this.try}>
              重试
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

#### React Router

Learn about Sentry's React Router integration.

这里我这边只说下 React Router6 的接入方法

> 需要 sentry (Available in version 7.21.0 and above)

```js
import { createBrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
  ],
  tracesSampleRate: 1.0,
});

// 使用的是 createBrowserRouter
const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouter(
  createBrowserRouter
);

const router = sentryCreateBrowserRouter([
  // ...
]);
```

#### Redux

Learn about Sentry's Redux integration.

[文档](https://docs.sentry.io/platforms/javascript/guides/react/features/redux/?original_referrer=https%3A%2F%2Fcn.bing.com%2F)

#### Track React Components

Learn how Sentry's React SDK allows you to monitor the rendering performance of your application and its components.

[文档](https://docs.sentry.io/platforms/javascript/guides/react/features/component-tracking/?original_referrer=https%3A%2F%2Fcn.bing.com%2F)

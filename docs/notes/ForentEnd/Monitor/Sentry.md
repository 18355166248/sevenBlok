# Sentry

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

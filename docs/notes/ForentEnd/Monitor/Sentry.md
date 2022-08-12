# Sentry

本文将采用 @sentry/react 进行搭建

### 初始化

```javascript
Sentry.init({
  dsn: CLIENT_KEY,
  environment: BUILD_ENV,
  sampleRate: 0.1,
  release: `${projectName}:last`,
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
- sampleRate
  配置错误事件的采样率，范围为 0.0 到 1.0。默认值为 1.0，表示发送了 100％ 的错误事件
- maxBreadcrumbs
  捕获面包屑-路径最长
- initialScope

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
const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = {
  // other webpack configuration
  devtool: "source-map",
  plugins: [
    new SentryWebpackPlugin({
      // sentry-cli configuration - can also be done directly through sentry-cli
      // see https://docs.sentry.io/product/cli/configuration/ for details
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "example-org",
      project: "example-project",
      release: process.env.SENTRY_RELEASE,

      // other SentryWebpackPlugin configuration
      include: ".",
      ignore: ["node_modules", "webpack.config.js"],
    }),
  ],
};
```

使用[SourceMapDevToolPlugin](https://webpack.js.org/plugins/source-map-dev-tool-plugin/)自定义 sourcemap 的上传地址

本插件实现了对 source map 生成，进行更细粒度的控制。它可以替代 devtool 选项。

```javascript
new webpack.SourceMapDevToolPlugin({
  publicPath: sourceMappingURL,
  filename: "[file].map",
});
```

### 注意

1. @sentry/webpack-plugin 和 sentry.Init 的 release 要保证一致, 不然 sentry 后端找不到对应的 map

## 导航

- [sentry 官方文档](https://docs.sentry.io/platforms/javascript/)

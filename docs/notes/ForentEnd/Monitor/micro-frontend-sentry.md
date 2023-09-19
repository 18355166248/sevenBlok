# Sentry 在微前端的支持

[官方文档 Micro Frontend Support](https://docs.sentry.io/platforms/javascript/guides/react/configuration/micro-frontend-support/)

## 依赖

注意: 我们说一下的功能点对版本有一定的要求, 如果版本低的话会不生效

- @sentry/webpack-plugin@2.5.0
- @sentry/react@7.59.0

### 安装依赖

```js
yarn add -D @sentry/webpack-plugin
yarn add @sentry/react
```

## 识别来源

要确定错误的来源，必须注入元数据，以帮助确定哪些捆绑包对错误负责。您可以通过启用 @sentry/webpack-plugin 的 \_experiments.moduleMetadata 选项，使用任何 Sentry bundler 插件来实现这一点。

这样的话我们就可以在微前端的主项目和的子应用配置 moduleMetadata, 然后传入子应用的 dsn 动态区分确认的来源

一旦元数据被注入到模块中， moduleMetadata 集成就可以用来查找元数据，并将其附加到具有匹配文件名的堆栈帧中。然后，该元数据在其他集成中 比如 beforeSend 回调中可用，作为每个 StackFrame 上的 module_metadata 属性。这可用于识别哪些捆绑包可能对错误负责，并用于标记或路由事件。

例子:

```js
// webpack.config.js
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");

module.exports = {
  devtool: "source-map",
  plugins: [
    sentryWebpackPlugin({
      /* Other plugin config */
      // 我们在配置 @sentry/webpack-plugin 的时候 可以自定义一些 moduleMetadata 数据
      // 这些数据可以在 sentry.init下的 beforeSend 拿到
      _experiments: {
        moduleMetadata: ({ org, project, release }) => {
          return { team: 'frontend', release },
        }
      },
    }),
  ],
};
```

```js
import * as Sentry from "@sentry/browser";
import { ModuleMetadata } from "@sentry/core";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  integrations: [ new ModuleMetadata() ]
  // 这里就可以拿到上面 @sentry/webpack-plugin 配置的 module_metadata 数据
  // 通过动态过滤就可以添加额外参数
  // 当然这样直接添加额外参数一般情况是不需要用到的 所以下面要提到自定义多虑传输 Transports
  beforeSend: (event) => {
    const frames = event?.exception?.values?.[0].stacktrace.frames || [];
    // Get all team names in the stack frames
    const teams = frames.filter(frame => frame.module_metadata && frame.module_metadata.team)
                        .map(frame => frame.module_metadata.team);
    // If there are teams, add them as extra data to the event
    if(teams.length > 0){
      event.extra = {
        ...event.extra,
        teams
      };
    }

    return event;
  },
});

Sentry.captureException(new Error("oh no!"));
```

但是我们在识别了不同子应用的报错后应该怎么准备的将错误上报到对应的子应用的 sentry 呢

这个时候我们就需要用到 sentry 为我们提供的自定义多路传输 [Transports](https://docs.sentry.io/platforms/javascript/guides/react/configuration/transports/)

例子:

```ts
import { captureException, init, makeFetchTransport } from "@sentry/browser";
import { makeMultiplexedTransport } from "@sentry/core";
import { Envelope, EnvelopeItemType } from "@sentry/types";

interface MatchParam {
  /** The envelope to be sent */
  envelope: Envelope;
  /**
   * A function that returns an event from the envelope if one exists. You can optionally pass an array of envelope item
   * types to filter by - only envelopes matching the given types will be returned.
   *
   * @param types Defaults to ['event'] (only error events will be returned)
   */
  getEvent(types?: EnvelopeItemType[]): Event | undefined;
}

function dsnFromFeature({ getEvent }: MatchParam) {
  const event = getEvent();
  switch (event?.tags?.feature) {
    case "cart":
      return [{ dsn: "__CART_DSN__", release: "cart@1.0.0" }];
    case "gallery":
      return [{ dsn: "__GALLERY_DSN__", release: "gallery@1.2.0" }];
    default:
  }
  return [];
}

init({
  dsn: "__FALLBACK_DSN__",
  // 我们可以通过 transport 自定义多虑上传, 将我们前面自定义的数据动态传递给其他sentry项目
  transport: makeMultiplexedTransport(makeFetchTransport, dsnFromFeature),
});

captureException(new Error("oh no!"), (scope) => {
  scope.setTag("feature", "cart");
  return scope;
});
```

## 微前端配置

那我们接下来看下成果吧

### 主应用:

```js
// webpack.config.js
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");

sentryWebpackPlugin({
  url: sourceMappingURL, // 上传 sourcemap 的cdn地址
  org: "组织名称",
  project: projectName, // 项目名称
  authToken: process.env.SENTRY_AUTH_TOKEN, // 用户的授权token
  // TODO: 主应用必须要有 不然子应用的 _experiments 不能触发拿到
  _experiments: {
    moduleMetadata: ({ org, project, release }) => {
      // 这里参数可以随便写
      return { team: projectName, release };
    },
  },
});
```

```js
const EXTRA_KEY = "ROUTE_TO"; // 这个可以写死 也就是在当前js使用 用于 beforeSend 和 transport 传递值

// 自定义多路上传
const transport = makeMultiplexedTransport(
  Sentry.makeFetchTransport,
  (args) => {
    const event = args.getEvent();
    if (
      event &&
      event.extra &&
      EXTRA_KEY in event.extra &&
      Array.isArray(event.extra[EXTRA_KEY])
    ) {
      // 这里返回的就是子应用配置的 dsn和release 用于将错误上传到子应用的sentry
      return event.extra[EXTRA_KEY];
    }
    return [];
  }
);

Sentry.init({
  dsn: "", // 填写 Client Keys DSN
  sampleRate: isDev ? 1 : 0.5,
  tracesSampleRate: 0.1,
  release: packageInfo.version || "last",
  integrations: [new ModuleMetadata()],
  transport, // 自定义上传策略
  beforeSend: (event: any) => {
    if (event?.exception?.values?.[0].stacktrace.frames) {
      const frames: any[] = event.exception.values[0].stacktrace.frames;
      // TODO 官方demo有误请使用如下方案
      // Find the last frame with module metadata containing a DSN
      let routeToList = frames
        .filter((frame) => frame.module_metadata && frame.module_metadata.dsn)
        .map((v) => v.module_metadata);

      if (routeToList.length) {
        event.extra = {
          ...event.extra,
          [EXTRA_KEY]: routeToList,
        };
      }
    }

    return event;
  },
});
```

注意:

- 主应用初始化 @sentry/webpack-plugin 的时候一定要带上 \_experiments.moduleMetadata, 不然就识别不到子应用的数据, 也就拿不到 routeToList 做多路上传了
- 官方的 demo 针对 frame.module_metadata 的处理有误, 我已经提了 pr, 我这边已经改过了.

### 子应用

```ts
// webpack.config.js
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");

sentryWebpackPlugin({
  url: process.env.REACT_APP_SOURCE_MAPPING_URL, // 上传 sourcemap 的地址
  org: "xmly", // 组织名
  project: projectName, // package.json 的name
  authToken: process.env.SENTRY_AUTH_TOKEN, // 用户的授权token
  _experiments: {
    moduleMetadata: ({ org, project, release }) => {
      return {
        team: projectName,
        // dsn 和release是必填的 其他参数都无所谓
        dsn: 子应用的sentry dsn,
        release,
      };
    },
  },
});
```

子应用初始化 dsn 和 release 是必填的 其他参数都无所谓

## 总结

我们看下主应用的报错和子应用的报错 sentry 如何展示的

主应用是 SETTLEMENT-PLATFORM-ADMIN, 子应用是 BALANCE-SERVICE-MANAGE

#### 主应用的报错

![](http://audiotest.cos.tx.xmcdn.com/storages/bb83-audiotest/21/A4/GKwaD2cI3wxJAAKGHgAA5bZZ.jpg)

#### 子应用的报错

![](http://audiotest.cos.tx.xmcdn.com/storages/f8da-audiotest/2A/BE/GKwaD2cI3wy_AAKglwAA5bZv.jpg)

我们看上面的截图可以看到, 两个不同的 sentry 项目, 报错的地址是一个项目, 至此, 我们实现了微前端项目中配置 sentry 的功能, 助力我们更加精确的排查前端项目报错

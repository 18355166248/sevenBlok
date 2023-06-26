# 搭建平台如何构建页面

这篇文章主要介绍了搭建平台的活动页构建过程，即点击了页面配置页右上角的「发布」按钮后是如何构建出可访问的活动页面的。由于搭建平台的项目比较复杂，本文只能做原理性的说明。
希望阅读本文前满足如下前提：

- 使用过搭建平台创建发布过活动页面
- 开发过搭建平台组件（不必须）

### 搭建平台的项目关系

从前端开发的角度，每个活动页都可以看做是一个单独的 React 应用，而组件都是一个 npm 包，在发布一个活动页面的过程就是在打包这个应用。不同的活动页就是不同的 React 应用，它们的组件配置及页面设置（分享、背景等）不同，除去这些不同的部分还有保持不变的部分，这就是 activity-maker-shell 这个项目的作用。activity-maker-shell 项目（后文简称 shell 项目）作为「壳应用」可视为活动页的一个框架。

```js
shell + 组件配置 + 页面配置 = 活动页应用;
```

和我们平时写的 React 应用一样，这里得到的活动页应用也是需要打包的。打包的过程是由 activity-maker-builder 项目（后文简称 builder 项目）来完成的，这是一个 node 服务，在获取到页面配置后会进行打包操作。

活动页的构建使用了服务端渲染技术，需要先对此有个基础的了解。

### 服务端渲染（SSR）介绍

观察一下使用 create-react-app 创建的项目，其 html 结构是这样的，只有一个 root 节点。

```html
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
```

如果打开一个搭建平台的页面，查看获得的 html 文件，可以看到不单是一个 root 节点，而是一个完整的 html 结构。

![](http://fdfs.xmcdn.com/storages/daa8-audiofreehighqps/9D/8A/GKwRIJIIWFExAAFtagInSAmX.png)

这里就是服务端渲染（SSR） 发挥了作用。

明确一下概念，一般 SSR 的流程是：用户访问页面 -> 服务端渲染生成完整的页面 -> 用户获得页面文件，不同用户获得的页面可能是不同的。

在搭建平台的流程中，点击「发布」按钮后就是在执行生成页面步骤，当用户访问一个页面时，它的文件已经在服务端准备好了。对应流程：服务端渲染生成页面文件 -> 用户访问页面 -> 用户获得页面文件，每个用户获得的 html 文件都是相同的。

更精确地来说，搭建平台使用的技术应该被称为预渲染（prerender），不过涉及到 React 的实现方面两者很相似，所以本文后面的部分不会严格区分。

### 基础的 SSR 例子

假设我们想将一个普通的 React 单页面应用改造成 SSR 应用需要做哪些改造。这篇文章给出了一个例子：[How to Enable Server-Side Rendering for a React App](https://www.digitalocean.com/community/tutorials/react-server-side-rendering)

React 组件部分使用 [ReactDOM.hydrateRoot()](https://react.dev/reference/react-dom/client/hydrateRoot) 来代替 ReactDOM.render():

```js
import ReactDOM from "react-dom/client";

ReactDOM.hydrateRoot(document.getElementById("root"), <App />);
```

(在新版的 React 中，使用了 [ReactDOM.hydrateRoot()](https://react.dev/reference/react-dom/client/hydrateRoot) 这个方法来代替)
使用 Express 实现的服务器端使用 [ReactDOMServer.renderToString()](https://react.dev/reference/react-dom/server/renderToString) 来获取 HTML 结构：

```ts
import ReactDOMServer from "react-dom/server";

// app: <h1 data-reactroot="">Hello <!-- -->Sammy<!-- -->!</h1>
const app = ReactDOMServer.renderToString(<App />);

// 替换 html 文件中的空节点
html.replace('<div id="root"></div>', `<div id="root">${app}</div>`);
```

### 什么是 Hydration

SSR 中有一个 hydration 的概念，比如上面的 api 就是使用了 ReactDOM.hydrate() 的命名，需要说明下 hydration 指的是什么。

使用 SSR，client side 在加载 script 之前得到了如下的 HTML 内容：

```html
<html>
  <head></head>
  <body>
    <div id="root">
      <h1>Hello Saeloun!</h1>
    </div>
  </body>
</html>
```

我们想要的是下图这样的，绿色的表示这部分页面可交互，比如所有的事件处理函数都挂载了（JS 完全加载）

![](http://fdfs.xmcdn.com/storages/dd71-audiofreehighqps/9D/6A/GMCoOSAIWFFHAAz5WQInSBJu.png)

使用 CSR，当加载 JS 时，用户只能看到空白页面：

对于 SSR，用户提前得到了完整的 HTML，在 JS 还在加载时就能看到东西。但是页面并不能完全交互，比如点击按钮无效。

![](http://fdfs.xmcdn.com/storages/798f-audiofreehighqps/06/7C/GMCoOScIWFFbAAoE2gInSBq6.png)

Hydration 就是在 client 端将 JavaScript 逻辑和在 server 端生成的 HTML 联系起来。
React 会在内存中 render 组件树，但不会为它生成 DOM 节点，而是将逻辑 attach 到已有的 HTML 上。

> We tell React to attach event handlers to the HTML to make the app interactive. This process of rendering our components and attaching event handlers is known as “hydration”. It is like watering the ‘dry’ HTML with the ‘water’ of interactivity and event handlers. After hydration, our application becomes interactive, responding to clicks, and so on.

[Understanding Hydration in React applications(SSR)](https://blog.saeloun.com/2021/12/16/hydration/)

### 简化的项目

我写了一个简化的项目 [render-test](https://github.com/18355166248/xm-build-platform/tree/main/render-test) ，仅做说明页面构建原理之用。这个简化项目中的代码和 shell 及 builder 项目并不完全一致，但尽量保证了函数名相关，通过搜索对应的函数名可以找到原项目中的相关代码。

#### 项目功能及结构

项目中主要分为 client 和 server 两部分：

- client - 对应于 shell 项目，包括 React 应用相关内容
- server - 对应于 builder 项目，包括打包页面的部分

server/activity.json 是一个页面配置文件，其中配置了文本组件、图片容器、倒计时组件，运行 npm run start:clean 将会依据这个配置构建页面，打开对应端口可查看。

##### 组件配置解析

首先看下配置页面保存的数据结构是什么样的，以下来自点击「保存」按钮后调用的接口数据：

![](http://fdfs.xmcdn.com/storages/d6e9-audiofreehighqps/99/A5/GKwRIUEIWFFuAALVoQInSCFx.png)

config 字段是一个 json 的字符串，parse 之后得到的结构如下，包括按组件类型区分的组件配置数据及页面配置数据。

```js
 {
   staticElements: [],
   fixedElements: [],
   modalElements: [],
   nestedElements: [],
   global: [],
 }
```

项目中将 config 数据保存 server/activity.json 中，接下来就是如何依据这个 json 文件打包页面。

对于 shell 项目来说，它会提前被打包成一个 npm 包，即 @xmly/activity-maker-shell ，在打包 shell 项目的时候它并不知道页面上会用到哪些组件，它会如何渲染？

解决方案是页面构建时读取页面配置，生成一个记录了页面用到的组件的文件。

以本简化项目为例，client 中的部分会打包至 dist/shell.js 文件中，server 在解析了页面配置后，在 dist/module.js 中写入如下内容：

```js
// module.js
const TextBox_1_2_2 = require("@xmc/text-box-1.2.2").default;
const ImageContainer_3_1_3 = require("@xmc/image-container-3.1.3").default;
const Countdown_1_1_7 = require("@xmc/countdown-1.1.7").default;

const modules = {
  "@xmc/text-box@1.2.2": TextBox_1_2_2,
  "@xmc/image-container@3.1.3": ImageContainer_3_1_3,
  "@xmc/countdown@1.1.7": Countdown_1_1_7,
};

module.exports = modules;
```

因为这个文件是动态生成的，构建不同的页面都会生成对应的文件，自然就知道了页面上使用了哪些组件。module.js 文件会在 client/repo.js 中使用，文件内容如下，其中的 initializeRepo() 会引入 module.js：

```js
class Repository {
  constructor() {
    this.modules = {};
  }

  add(name, module) {
    this.modules[name] = module;
  }

  get(name) {
    return this.modules[name] ?? null;
  }
}

export const repo = new Repository();

export function initializeRepo() {
  const modules = require("./module");

  Object.keys(modules).forEach((key) => {
    repo.add(key, modules[key]);
  });
}
```

调用 initializeRepo() 初始化完成后，从 repo.modules 中就可以找到需要的组件了。在 App 组件中这样使用导出的 repo：

```js
// client/App.jsx
import { repo } from "./repo";

const App = ({ config }) => {
  return (
    <div>
      {config.map((element) => {
        const Component = repo.modules[`${element.name}@${element.version}`];

        return (
          <Component
            id={element.id}
            alias={element.alias}
            forms={element.forms}
          />
        );
      })}
           
    </div>
  );
};
```

上述流程如下：

![](http://fdfs.xmcdn.com/storages/050e-audiofreehighqps/A5/09/GMCoOSIIWFGpAAA5BAInSDOR.png)

### 执行构建

现在我们知道了页面上用到的组件，到了打包构建的步骤。从 HTML 模板文件 public/index.html 看起，其内容如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />

    **STYLE_TAGS**

    <title>App</title>
  </head>
  <script>
     try {
       window.serverData = **SERVER_DATA**;
    } catch (error) {
       console.error(error);
    }
  </script>

  <body>
    <div id="root"></div>

    <script src="./bundle.js"></script>
  </body>
</html>
```

其中留下了几个标志位：

- \_\_SERVER_DATA\_\_ - 页面配置数据，对应 hydration 过程
- \_\_STYLE_TAGS\_\_ - 样式内容
- <div id="root"></div> - HTML 结构

构建过程中会生成 bundle.js 文件，并用页面的真实数据来替换上述位置。

运行 npm run build:client 会将 client 目录打包，生成 dist/shell.js 文件，提供 renderAppToHTML 方法。

```js
export function renderAppToHtml(config, htmlTemplate) {
  const { app, styleTags } = renderAppToString(config);

  const lastHtml = htmlTemplate
    .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
    .replace("**SERVER_DATA**", JSON.stringify(config))
    .replace("**STYLE_TAGS**", styleTags);

  return lastHtml;
}
```

可以看到这个方法做的事情就是在对模板文件做了替换，后面会对此详细解释。

#### js 的编译

首先从熟悉的 js 打包过程开始了解构建过程，在这个简化项目中只是建立了一个基础的 webpack 配置。之前的步骤中已生成 dist/shell.js 文件，然后以此为 webpack 打包入口，生成的文件位于 dist/bundle.js 中。

#### serverData 注入

随便打开一个活动页面，在控制台中可以查看 window.serverData 变量的值，其中保存了活动页所有相关的配置：

![](http://fdfs.xmcdn.com/storages/5c18-audiofreehighqps/8B/5B/GKwRIRwIWFHCAAEFEgInSEAe.png)

它在 html 模板文件中对应于：

```html
<script>
  try {
    window.serverData = __SERVER_DATA__;
  } catch (error) {
    console.error(error);
  }
</script>
```

需要将其中的 \_\_SERVER_DATA\_\_ 替换成页面配置的 json 字符串：

```js
htmlTemplate.replace("__SERVER_DATA__", JSON.stringify(config));
```

这样就得到了一个普通的 inline script，运行后就注入了 window.serverData 这个变量。

![](http://fdfs.xmcdn.com/storages/2fac-audiofreehighqps/09/86/GKwRIW4IWFHRAADuSgInSEcX.png)

而 React 应用在 hydration 这一步的时候就会取出这里的数据作为 props 传入：

```js
import { hydrateRoot } from "react-dom/client";

const root = document.getElementById("root");
hydrateRoot(root, <App config={window.serverData} />);
```

#### 样式提取

如果你开发过搭建平台的组件，会注意到所有的组件样式都是用 styled-components 来处理，在 SSR 的过程中可以利用 styled-components 提供的 API 将所有组件的样式统一提取出来：

```js
import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";

const sheet = new ServerStyleSheet();
const html = renderToString(sheet.collectStyles(<YourApp />));
const styleTags = sheet.getStyleTags(); // or sheet.getStyleElement();
```

上述代码修改自 [styled-components 的 Server Side Rendering](https://styled-components.com/docs/advanced#server-side-rendering) 文档。

这里得到的 styleTags 就是提取自应用/组件中的样式，用其替换 html 模板中的 \_\_STYLE_TAGS\_\_。

#### 替换 root 节点

然后就是将 <div id="root"></div> 替换成完整的 html 结构：

```js
function renderAppToString(config) {
  let app = "";
  let styleTags = "";

  const sheet = new ServerStyleSheet();

  app = ReactDOMServer.renderToString(
    sheet.collectStyles(<App config={config} />)
  );
  styleTags = sheet.getStyleTags();

  return { app, styleTags };
}
```

在这里得到了 app 和 styleTags 两个字符串，app 是组件对应的页面结构，styleTags 是提取出来的样式内容，分别替换：

```js
htmlTemplate
  .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
  .replace("**STYLE_TAGS**", styleTags);
```

至此，一个简化的构建流程就完成了。

## 线上项目说明

在这个简化项目中，省略了很多步骤。比如构建过程中 js 文件是会上传至 CDN 的，还有使用了 redis 来作为 html 文件的缓存。这些可以从 builder 项目代码 activity-maker-builder/src/service/builder.ts 看起。

在简化项目中当前仅处理了 static 类型的组件，nested 类型的组件比如热区暂不支持。热区主要是通过组件的递归渲染来实现的，具体可看 activity-maker-shell/src/components/recursive.tsx 的组件实现。

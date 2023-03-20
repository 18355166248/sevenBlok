# Plugin

[官方文档](https://babel.dev/docs/plugins)

## custom babel-plugin

这里我们记录下怎么实现一个自定义 babel-plugin

[Plugin Development 文档](https://babel.dev/docs/plugins#plugin-development)

[插件仓库](https://www.npmjs.com/package/babel-plugin-import-jiang)

[代码仓库](https://github.com/18355166248/babel-plugin-import-jiang)

首先我们需要安装几个依赖

| 依赖                         | 版本    | 作用                         |
| ---------------------------- | ------- | ---------------------------- |
| @babel/core                  | ^7.21.3 | babel 转译代码               |
| @babel/preset-react          | ^7.18.6 | 转译react代码                |
| father                       | ^4.1.7  | ts转commonjs打包工具         |
| np                           | ^7.6.3  | npm包发布工具                |
| umi-test                     | ^1.9.7  | babel-plugin单元测试( jest ) |
| @babel/helper-module-imports | ^1.9.7  | 修改 Ast 代码工具            |

我们再看下 package.json scripts 命令配置

```json
  "scripts": {
    "build": "father build", // 打包
    "test": "umi-test", // 单元测试
    "prepublishOnly": "npm run build && father doctor && np --no-cleanup --yolo --no-publish --any-branch" // npm publish 会触发的声明周期 主要做了打包和项目依赖检测还有发布代码
  },
```

我们再看下项目的结构

```tree
.
├── README.md
├── __tests__ // 单元测试文件夹
│   ├── index.test.js // 单元测试主要执行文件 动态读取 packages 下的 actual.js 并编译 和 expected.js 做对比
│   └── packages
│       ├── antd-custom-name
│       │   ├── actual.js
│       │   └── expected.js
│       ├── antd-library-directory
│       │   ├── actual.js
│       │   └── expected.js
│       ├── antd-name
│       │   ├── actual.js
│       │   └── expected.js
│       ├── antd-style-css-name
│       │   ├── actual.js
│       │   └── expected.js
│       └── antd-style-name
│           ├── actual.js
│           └── expected.js
├── index.d.ts
├── lib               // 打包文件
│   ├── Plugin.js
│   ├── index.js
│   └── utls.js
├── package.json
└── src               // 主代码
    ├── Plugin.ts
    ├── index.ts
    └── utls.ts
```

我们主要看下 文件夹 src 和 __test__ 文件夹

src/index.ts

自定义 babel-plugin [官网文档](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)比较详细, 可以参考

```ts
import { addDefault, addSideEffect } from "@babel/helper-module-imports";
import { windowPath } from "./utls";
import { join } from "path";

export interface Opts_Props {
  libraryName: string;
  libraryDirectory?: string;
  style: boolean | "css";
  types: any;
  customNameCB: ((name: string, file: any) => string) | undefined;
  index?: number;
}

export default class Plugin implements Opts_Props {
  libraryName: string; // 依赖仓库的名 比如 antd
  libraryDirectory: string; // 需要自定义配置的依赖路径 默认是 lib
  style: boolean | "css"; // 自定义引入样式文件路径格式
  pluginStateKey: string;
  types: any; // [babel-types](https://babel.dev/docs/babel-types)
  customNameCB: ((name: string, file: any) => string) | undefined; // 自定义依赖路径拼接
  index?: number | undefined;

  constructor(
    libraryName: string,
    libraryDirectory: string | undefined,
    style: boolean | "css" | undefined,
    customNameCB: ((name: string, file: any) => string) | undefined,
    types: any,
    index = 0
  ) {
    this.libraryName = libraryName;
    this.libraryDirectory =
      typeof libraryDirectory === "undefined" ? "lib" : libraryDirectory;
    this.style = style || false;
    this.customNameCB = customNameCB;
    this.types = types;
    this.pluginStateKey = `pluginStateKey${index}`;
  }
  // 基于 state 维护好字典 pluginState
  getPluginState(state) {
    if (!state[this.pluginStateKey]) {
      state[this.pluginStateKey] = {};
    }

    return state[this.pluginStateKey];
  }
  // 初始化字典
  ProgramEnter(path, state) {
    const pluginState = this.getPluginState(state);
    pluginState.specifiers = Object.create(null);
    pluginState.pateToRemove = []; // 待删除节点列表
    pluginState.selectedMethods = []; // 已选中(格式化)节点列表
  }
  // 删除已经被标记需要删除的节点
  ProgramExit(path, state) {
    this.getPluginState(state).pateToRemove.forEach(
      (p) => !p.removed && p.remove()
    );
  }
  // ast import 节点编译触发的钩子
  // 这里主要就是拿到左侧的值 比如说 Button 放入字典 pluginState.specifiers 中, 后续使用, 并把该 import 节点放入 pateToRemove 中, 在节点退出的时候删除该节点
  ImportDeclaration(path, state) {
    const { node } = path; // 节点
    if (!node) return;
    const { value } = node.source;
    const { libraryName, types } = this;
    const pluginState = this.getPluginState(state);

    if (value === libraryName) {
      // 拿到左侧的值
      node.specifiers.forEach((spec) => {
        // https://babeljs.io/docs/babel-types.html
        // 判断是否是解构内的值 也就是 Button 之类的
        if (types.isImportSpecifier(spec)) {
          pluginState.specifiers[spec.local.name] = spec.imported.name;
        }
      });
      pluginState.pateToRemove.push(path);
    }
  }
  // 引入的依赖执行的时候会触发该钩子
  // 主要就是拿到对应的 pluginState, 遍历 arguments 拿到需要引入的遍历名, 触发 importMethod 用于新增 import 代码
  CallExpression(path, state) {
    const { node } = path;
    const file = path && path.hub && path.hub.file;
    const pluginState = this.getPluginState(state);

    node.arguments = node.arguments.map((arg) => {
      const { name } = arg;

      if (
        pluginState.specifiers[name] &&
        path.scope.hasBinding(name) &&
        path.scope.getBinding(name).path.type === "ImportSpecifier"
      ) {
        this.importMethod(pluginState.specifiers[name], file, pluginState);
      }

      return arg;
    });
  }
  // 新增代码
  // 通过 @babel/helper-module-imports 提供新增 ast 代码的方法 新增格式化后的代码 包括组件和组件的样式
  // 注意: 需要通过 pluginState.selectedMethods 做好缓存, 避免同一个依赖多次触发新增代码, 不然新增的代码会递增出现异常, 具体可以自己试一下
  importMethod(methodName, file, pluginState) {
    const { customNameCB, libraryDirectory, libraryName, style } = this;
    if (!pluginState.selectedMethods[methodName]) {
      const path = windowPath(
        customNameCB
          ? customNameCB(methodName, file)
          : windowPath(join(libraryName, libraryDirectory, methodName))
      );
      // 防止重复添加 复用节点
      pluginState.selectedMethods[methodName] = addDefault(file.path, path, {
        nameHint: methodName,
      });

      if (style === true) {
        addSideEffect(file.path, `${path}/style`);
      } else if (style === "css") {
        addSideEffect(file.path, `${path}/style/css`);
      }
    }

    return { ...pluginState.selectedMethods[methodName] };
  }
}
```

## 至此 自定义 babel-plugin 已经写完了

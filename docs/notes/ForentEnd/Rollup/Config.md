# 配置

## rollup.config.js

```js
import path from "path";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript";
import { DEFAULT_EXTENSIONS } from "@babel/core";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import cleaner from "rollup-plugin-cleaner";
import alias from "@rollup/plugin-alias";

const fs = require("fs");

const isProd = process.env.NODE_ENV === "production";

const projectRootDir = path.resolve(__dirname);

// 按需加载方式进行打包
const packages = {};
const dir = path.join(__dirname, "/src/components");
const files = fs.readdirSync(dir);

if (files.includes(".DS_Store")) {
  files.splice(0, 1);
}

const all = `index`;

packages[all] = path.join(__dirname, "/src/components/index.js");

const components = ["ChargePolymerizationDrawer", "CouponDebtChargeDrawer"];

files.forEach((file) => {
  if (file !== "index.js" && components.includes(file)) {
    packages[file] = `src/components/${file}/index.tsx`;
  }
});

const createRollupConfig = (file, name) => {
  const config = {
    input: file,
    output: [
      {
        file: name === all ? "lib/src/index.js" : `lib/src/${name}/index.js`,
        format: "es", // 因为已经是多入口打包了，所以本身引入的时候就是打算单独引入组件实现按需加载
        name,
        globals: {
          antd: "antd",
          react: "react",
          lodash: "_",
          moment: "moment",
        },
      },
      // {
      //   file: name === all ? 'module/index.js' : `module/${name}/index.js`,
      //   format: 'umd', // 因为已经是多入口打包了，所以本身引入的时候就是打算单独引入组件实现按需加载
      //   name,
      //   globals: {
      //     antd: 'antd',
      //     react: 'react',
      //     lodash: '_',
      //     moment: 'moment',
      //   },
      // },
    ],
    plugins: [
      name === all &&
        cleaner({
          targets: ["./lib", "./module"],
        }),
      name === all &&
        copy({
          targets: [
            { src: "./src/services", dest: "lib/src" },

            { src: "./src/theme", dest: "lib" },
            { src: "./src/utils", dest: "lib" },
            { src: "./src/config", dest: "lib" },
            { src: "./src/services", dest: "lib" },
            { src: "./src/hooks", dest: "lib" },
            { src: "./src/const", dest: "lib" },
          ],
        }),
      alias({
        entries: [
          { find: "@", replacement: path.resolve(projectRootDir, "src") },
          {
            find: "utils",
            replacement: path.resolve(projectRootDir, "src/utils"),
          },
          {
            find: "@/services",
            replacement: path.resolve(projectRootDir, "src/services"),
          },
          {
            find: "components",
            replacement: path.resolve(projectRootDir, "src/components"),
          },
          {
            find: "hooks",
            replacement: path.resolve(projectRootDir, "src/hooks"),
          },
          {
            find: "const",
            replacement: path.resolve(projectRootDir, "src/const"),
          },
        ],
      }),
      json(),
      nodeResolve({ browser: true }),
      babel({
        exclude: "node_modules/**",
        runtimeHelpers: true,
        // babel 默认不支持 ts 需要手动添加
        // 很重要,  如果ts, tsx不加的话 , babel不会去主动编译ts, tsx的文件
        extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
      }),_
      typescript(),
      // 使得 rollup 支持 commonjs 规范，识别 commonjs 规范的依赖
      commonjs({
        include: ["node_modules/**"],
        exclude: ["node_modules/process-es6/**"],
        namedExports: {
          "node_modules/react-is/index.js": [
            "isValidElementType",
            "isContextConsumer",
          ],
          "node_modules/react-virtualized/dist/commonjs/CellMeasurer/index.js": [
            "CellMeasurerCache",
            "CellMeasurer",
          ],
          "node_modules/@arctic/ui-component-pc-react/lib/index.js": [
            "CCToothPositionMap",
          ],
        },
      }),
      postcss({
        // 单独打包css文件, 默认false
        extract: true, // 也可以指定打包后的路径或css文件名
        // Minimize CSS, boolean or options for cssnano.
        minimize: isProd,
        // Enable sourceMap.
        sourceMap: !isProd,
        // This plugin will process files ending with these extensions and the extensions supported by custom loaders.
        extensions: [".less", ".css"],
        modules: true,
      }),
      isProd && terser(), // 压缩js
    ],
    // 指出应将哪些模块视为外部模块，如 Peer dependencies 中的依赖
    external: ["antd", "react", "react-dom", "lodash", "moment"],
  };

  return config;
};

const buildPackages = [];

Object.keys(packages).forEach((name) => {
  const file = packages[name];

  buildPackages.push(createRollupConfig(file, name));
});

export default buildPackages;
```

## babel.config.js

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        targets: {
          ie: 10,
        },
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    // 解决多个地方使用相同代码导致打包重复的问题
    ["@babel/plugin-transform-runtime"],
    // ['import', { libraryName: 'antd', style: true }],
    "@babel/plugin-proposal-optional-chaining",
  ],
  ignore: ["node_modules/**"],
};
```

### @babel/plugin-transform-runtime 作用

babel 在转译的过程中，对 syntax 的处理可能会使用到 helper 函数，对 api 的处理会引入 polyfill。

默认情况下，babel 在每个需要使用 helper 的地方都会定义一个 helper，导致最终的产物里有大量重复的 helper；引入 polyfill 时会直接修改全局变量及其原型，造成原型污染。

@babel/plugin-transform-runtime 的作用是将 helper 和 polyfill 都改为从一个统一的地方引入，并且引入的对象和全局变量是完全隔离的，这样解决了上面的两个问题。

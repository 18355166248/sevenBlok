# UMD 模块入门

## 什么是 UMD

所谓 <text-line>UMD (Universal Module Definition)</text-line>, 就是 <text-line>javascript</text-line> 通用模块定义规范, 让你的模块在 <text-line>javascript</text-line> 所有运行环境都能使用

## 原理

实现一个 UMD 模块，就要考虑现有的主流 javascript 模块规范了，如 CommonJS, AMD, CMD 等。那么如何才能同时满足这几种规范呢

首先要想到，模块最终是要导出一个对象，函数，或者变量。
而不同的模块规范，关于模块导出这部分的定义是完全不一样的。
因此，我们需要一种过渡机制。

## 实现

```javascript
(function(root, factory) {
  if (typeof exports === "object" && typeof module === "object") {
    // CommonJS规范 node 环境 判断是否支持 module.exports 支持 require 这种方法
    module.exports = factory(require);
  } else if (typeof define === "function" && define.md) {
    // AMD 如果环境中有define函数，并且define函数具备amd属性，则可以判断当前环境满足AMD规范
    console.log("是AMD模块规范，如require.js");
    define(factory());
  } else if (typeof exports === "object") {
    // 不支持 module 但是支持 exports 的情况下使用 exports导出 是CommonJS 规范
    exports["jiang-hooks"] = factory();
  } else {
    // 直接挂载在全局对象上
    root.umdModule = factory();
  }
})(this, function() {
  return {
    name: "Umd模块",
  };
});
```

## 顺便解析下搭配 <text-line>webpack</text-line> 使用 <text-line>UMD</text-line> 方案

### 使用

我们通常在做项目时可能会把第三方库打包到 bundle 中，比如下面这张图

![](~@public/javascript/UMD/webpack_require.png)

如果不想把第三方库打包到 bundle 中，这就有了 externals。官方的使用 externals 比较简单，只需三步——

1. HTML 中引入第三方库的 UMD 格式
2. 在 webpack 中配置 externals

```js
externals: {
  "jiang-hooks": "jiangHooks",
}

这里的key就是你require 或者 import 需要使用这个模块要用的名字
这里的value就是你 umd 文件 绑定在 全局对象 (window) 上的变量名

// 使用
import { useBoolean } from 'jiang-hooks'
```

<Card type="danger">
这里有个坑, 就是我在给自己组件打包umd的时候, 用的是 jiang-hooks 这种方式命名, 这种命名会直接报错, 因为在从 window找的时候 会只取 符号 - 前面的字符串 也就是 module.exports jiang , 这样肯定是找不到的, 所以建议使用驼峰命名 也就是 jiangHooks
</Card>

#### 配置

```js
 output: {
    filename: 'jiang-hooks.js',
    library: 'jiangHooks', // 这里不要用符号拼接名 如果是umd打包的话
    path: path.resolve(__dirname, './dist'),
  },
```

### 剖析代码

![]('~@public/javascript/UMD/webpack_externals.jpg')

图中 395 的函数就是将已经绑定在 window 上的 UMD 的引用通过 module.exports 的方式提供给其他组件使用

## 动态使用 UMD 包方案

```javascript
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Toast from "light-toast";
import axios from "axios";

const load = async () => {
  try {
    // 请求组件js资源
    let { data } = await axios.get(
      "https://pcsdata.baidu.com/rest/2.0/docview/text?object=7b8cb85bfm0b8758c97de03eed161cd5&expires=24h&dp_logid=387718267315671031&rt=pr&sign=FOTRE-DCb740ccc5511e5e8fedcff06b081203-3z%252FRgdEamUYWk2m57ePBDQ3mCOY%253D&file_size=377529&timestamp=1646705730&method=info&fid=373039462-250528-417266335324728&client_type=web&file_type=js&channel=chunlei&web=1&app_id=250528&bdstoken=263676acc60bdabd2a53c52adb5b652a&logid=QjVEM0Q3QUMyQTRGMjdCMUY1QUNFREUwMzM4NTI0QjA6Rkc9MQ==&clienttype=0"
    );

    // 执行组件js
    let run = new Function(
      "exports",
      "require",
      "globalThis",
      `return ${data}`
    );
    // 手动提供exports对象和require函数
    const exports = { a: 1 };
    const require = (key: string) => {
      switch (key) {
        case "react":
          return React;

        default:
          break;
      }
    };
    const global: any = {
      popupCheckstand: null,
      React,
      ReactDOM,
      styled,
      Toast,
      axios,
      require$$0: {
        inspect: {
          custom: "",
        },
      },
    };
    // 执行函数
    run(exports, require, global);

    return global.popupCheckstand.default;
    // 获取组件选项对象，扔给动态组件进行渲染
  } catch (error) {
    console.error(error);
  }
};

export const loadResult = load();
```

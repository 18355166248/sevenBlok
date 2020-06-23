# 前言

如果只是想简单定制主题 参考[官网 AntdV4](https://ant.design/docs/react/customize-theme-cn)即可

## 自定义动态切换主题色

使用插件 [antd-theme-generator](https://github.com/mzohaibqc/antd-theme-generator#readme)

## 步骤

### 1. 修改 index.html

```html
<body>
  <link rel="stylesheet/less" type="text/css" href="static/color.less" />
  //主要是这个起作用
  <script>
    window.less = {
      async: false,
      env: "production", // devlopment
    };
  </script>
  <script
    type="text/javascript"
    src="https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js"
  ></script>
  <noscript>
    You need to enable JavaScript to run this app.
  </noscript>
  <div id="root"></div>
</body>
```

### 2. 在路径比较清晰的位置 比如根目录添加 theme.js

```js
const path = require("path");
const { generateTheme } = require("antd-theme-generator");

const options = {
  stylesDir: path.join(__dirname, "../src/theme"), // less主题设置对应具体文件夹路径
  antDir: path.join(__dirname, "../node_modules/antd"), // antd的路径
  varFile: path.join(__dirname, "../src/theme/vars.less"), // antd设置变量的位置
  mainLessFile: path.join(__dirname, "../src/theme/main.less"), // 占位 避免报错 (发现没有这个配置 可能是多余的)
  themeVariables: [
    //需要动态切换的主题变量
    "@primary-color",
    "@text-color",
    "@menu-inline-toplevel-item-height",
    "@menu-item-height",
    "@menu-dark-submenu-bg",
    "@menu-dark-bg",
    "@btn-default-color",
    "@btn-default-border",
    "@form-item-margin-bottom",
    "@radio-button-color",
  ],
  indexFileName: "index.html",
  outputFilePath: path.join(__dirname, "../src/color.less"), //页面引入的主题变量文件保存路径
};

generateTheme(options)
  .then(() => {
    console.log("Theme generated successfully");
  })
  .catch((error) => {
    console.log("Error", error);
  });
```

新建 theme 文件夹 里面包含 var.less 和 main.less

```less
//vars.less
@import "~antd/lib/style/themes/default.less";
@link-color: #00375b;
@primary-color: #00375b;
:root {
  --PC: @primary-color; //color.less中加入css原生变量：--PC
}

//main.less
//可为空，只是为了不报错才引入
```

### 3. 修改下 package.json

```json
//为了每次自动node theme.js，所以scripts里面修改下  (也可以不用)
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "node color &&  webpack-dev-server --config webpack.config.dev.js",
    "start": "npm run dev",
    "build": "node color && webpack --config webpack.config.prod.js"
  },
```

### 4. 项目启动后在需要的地方执行下面吗代码就可以动态修改主题配色了

```js
window.less
  .modifyVars({
    "@primary-color": "#ee5e7b",
    "@link-color": "#ee5e7b",
    "@btn-primary-bg": "ee5e7b",
  })
  .then(() => {})
  .catch((error) => {
    message.error(`Failed to update theme`);
  });
```

## 注意点

### 1. 如果样式没成功 可以在入口 main.js 里面添加 import 'antd/dist/antd.css' 重点!重点!重点!

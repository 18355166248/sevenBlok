# 前言

> 之前写过一个动态改变 antd 主题色的教程, 近期发现这个方案有些步骤是不需要的, 所以重新整理下

## 准备工作

1. 使用 create-react-app 初始化项目
2. 使用 craco 将加载 antd.css 改成 less 加载 antd 的样式
3. 使用 craco.config.js 初始化项目

```js
const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "pink",
              "@link-color": "pink",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
```

4. 在 index.html 的 body 顶层放入下面代码

```html
<link rel="stylesheet/less" type="text/css" href="./antd.less" />
<script>
  window.less = {
    async: false,
    env: "production",
  };
</script>
<script type="text/javascript" src="./less.min.js"></script>
```

5. 在需要切换主题的地方执行以下代码就可以切换主题了

```js
const themeColor = [
  "#ccc",
  "pink",
  "gray",
  "blue",
  "yellow",
  "yellowGreen",
  "green",
];

function changeTheme() {
  window.less
    .modifyVars({
      "@primary-color": themeColor[Math.ceil(Math.random() * 7)],
    })
    .then(() => {})
    .catch((err) => {
      console.error(err.message, "Failed to update theme");
    });
}
```

## 后言

还有一种方案就是通过 css 原生变量来控制主题, 如果有兴趣可以研究下!应该是可行的, 核心代码如下

```js
document.documentElement.style.setProperty("--PC", "color色号");
```

# 按需加载组件

使用 babel-plugin-import 插件实现
[git 项目地址](https://github.com/ant-design/babel-plugin-import)

在项目 babel.config.js 里面配置:

```js
module.exports = {
  plugins: [
    ["import", { libraryName: "antd", style: true }],
    [
      "import",
      {
        // 导入一个插件
        libraryName: "arctic-business-component", // 暴露的库名
        camel2DashComponentName: false, // 关闭驼峰转换
        customName: (name) => {
          return `arctic-business-component/lib/${name}`; // 核心配置 根据你自己的组件目录配置
        },
        style: (name) => `arctic-business-component/lib/${name}/index.css`, // 转换后的路径
      },
      "arctic-business-component",
    ],
  ],
};
```

#### [使用组件按需加载地址](https://github.com/18355166248/create-react-app-demo)

#### [antd 业务组件](https://github.com/18355166248/arctic-business-component)

const path = require("path");
const autoGetSidebarOptionBySrcDir = require("../../utils/autoSidebar.js");

function resolve(pathname) {
  return path.resolve(__dirname, pathname);
}

const sidebar = autoGetSidebarOptionBySrcDir(
  path.resolve(__dirname, "../notes")
);

module.exports = {
  title: "Swell",
  description: "2021, 学习进步!",
  port: 8082,
  base: "/",
  dest: "docs/.vuepress/distBlok",
  head: [
    [
      "link",
      {
        rel: "shortcut con",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
    ],
  ],
  markdown: {
    lineNumbers: true,
    toc: { includeLevel: [2, 3, 4] },
  },
  configureWebpack: {
    resolve: {
      alias: {
        docs: resolve("../../docs"),
        "@public": resolve("./public"),
      },
    },
  },
  postcss: {},
  themeConfig: {
    lastUpdated: "Last Updated",
    sidebarDepth: 0,
    displayAllHeaders: true,
    nav: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "前端",
        items: [
          {
            text: "JavaScript",
            link: "/notes/ForentEnd/JavaScript/",
          },
          {
            text: "Node",
            link: "/notes/ForentEnd/Node/",
          },
          {
            text: "TypeScript",
            link: "/notes/ForentEnd/TypeScript/",
          },
          {
            text: "HTML",
            link: "/notes/ForentEnd/HTML/",
          },
          {
            text: "CSS",
            link: "/notes/ForentEnd/CSS/",
          },
          {
            text: "Vue",
            link: "/notes/ForentEnd/Vue/",
          },
          {
            text: "React",
            link: "/notes/ForentEnd/React/",
          },
          {
            text: "React源码",
            link: "/notes/ForentEnd/ReactSourceCode/",
          },
          {
            text: "Webpack",
            link: "/notes/ForentEnd/Webpack/",
          },
          {
            text: "正则表达式",
            link: "/notes/ForentEnd/Regex/",
          },
          {
            text: "Eslint",
            link: "/notes/ForentEnd/Eslint/",
          },
          {
            text: "组件封装",
            link: "/notes/ForentEnd/Component/",
          },
          {
            text: "性能优化",
            link: "/notes/ForentEnd/Performance/",
          },
          {
            text: "常用工具",
            link: "/notes/ForentEnd/Utils/",
          },
          {
            text: "面试题",
            link: "/notes/ForentEnd/CaseQuestions/",
          },
          {
            text: "单元测试",
            link: "/notes/ForentEnd/Test/",
          },
          {
            text: "前端监控",
            link: "/notes/ForentEnd/Monitor/",
          },
          {
            text: "Babel",
            link: "/notes/ForentEnd/Babel/",
          },
          {
            text: "微前端",
            link: "/notes/ForentEnd/MicroFrontEnd/",
          },
          {
            text: "低代码",
            link: "/notes/ForentEnd/LowCode/",
          },
        ],
      },
      {
        text: "转载文章",
        items: [
          {
            text: "前端",
            link: "/notes/Transshipment/FrontEnd/",
          },
        ],
      },
      {
        text: "业务",
        items: [
          {
            text: "XIXIMA",
            link: "/notes/Business/XIXIMA/",
          },
        ],
      },
      {
        text: "代码管理",
        items: [
          {
            text: "Git",
            link: "/notes/CodeManage/Git/",
          },
          {
            text: "NPM",
            link: "/notes/CodeManage/NPM/",
          },
          {
            text: "Lerna",
            link: "/notes/CodeManage/Lerna/",
          },
          {
            text: "GitHub",
            link: "/notes/CodeManage/GitHub/",
          },
        ],
      },
      {
        text: "工具",
        items: [
          {
            text: "Jenkins",
            link: "/notes/Tools/Jenkins/",
          },
          {
            text: "VsCode",
            link: "/notes/Tools/Vscode/",
          },
          {
            text: "Editor",
            link: "/notes/Tools/Editor/",
          },
        ],
      },
      {
        text: "算法",
        items: [
          {
            text: "LeetCode",
            link: "/notes/Algorithm/LeetCode/",
          },
        ],
      },
      {
        text: "数据库",
        items: [
          {
            text: "MySql",
            link: "/notes/Databases/MySql/",
          },
        ],
      },
      {
        text: "GitHub",
        link: "https://github.com/18355166248",
      },
    ],
    sidebar,
    search: true, // 内置搜索
    searchMaxSuggestions: 20, // 默认搜索框显示的搜索结果数量
  },
  plugins: [
    [
      "@vuepress/search",
      {
        searchMaxSuggestions: 10,
      },
    ],
  ],
};

const path = require("path");
const leecodeSidebar = require("./sidebar/leecode.json");

function resolve(pathname) {
  return path.resolve(__dirname, pathname);
}

module.exports = {
  title: "柒世(SMegalo)",
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
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@public": resolve("./public"),
      },
    },
  },
  postcss: {},
  themeConfig: {
    lastUpdated: "Last Updated",
    sidebarDepth: 2,
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
            link: "/ForentEnd/JavaScript/",
          },
          {
            text: "Node",
            link: "/ForentEnd/Node/",
          },
          {
            text: "TypeScript",
            link: "/ForentEnd/TypeScript/",
          },
          {
            text: "HTML",
            link: "/ForentEnd/HTML/",
          },
          {
            text: "CSS",
            link: "/ForentEnd/CSS/",
          },
          {
            text: "Vue",
            link: "/ForentEnd/Vue/",
          },
          {
            text: "React",
            link: "/ForentEnd/React/",
          },
          {
            text: "Webpack",
            link: "/ForentEnd/Webpack/",
          },
          {
            text: "正则表达式",
            link: "/ForentEnd/Regex/",
          },
          {
            text: "Eslint",
            link: "/ForentEnd/Eslint/",
          },
          {
            text: "组件封装",
            link: "/ForentEnd/Component/",
          },
          {
            text: "性能优化",
            link: "/ForentEnd/Performance/",
          },
          {
            text: "常用工具",
            link: "/ForentEnd/Utils/",
          },
          {
            text: "面试题",
            link: "/ForentEnd/CaseQuestions/",
          },
          {
            text: "单元测试",
            link: "/ForentEnd/Test/",
          },
        ],
      },
      {
        text: "代码管理",
        items: [
          {
            text: "Git",
            link: "/CodeManage/Git/",
          },
          {
            text: "NPM",
            link: "/CodeManage/NPM/",
          },
          {
            text: "Lerna",
            link: "/CodeManage/Lerna/",
          },
        ],
      },
      {
        text: "工具",
        items: [
          {
            text: "Jenkins",
            link: "/Tools/Jenkins/",
          },
        ],
      },
      {
        text: "算法",
        items: [
          {
            text: "LeetCode",
            link: "/Algorithm/LeetCode/",
          },
        ],
      },
      {
        text: "数据库",
        items: [
          {
            text: "MySql",
            link: "/Databases/MySql/",
          },
        ],
      },
      {
        text: "GitHub",
        link: "https://github.com/18355166248",
      },
    ],
    sidebar: {
      "/ForentEnd/JavaScript/": [
        "",
        {
          title: "JavaScript技巧",
          collapsable: false,
          children: ["/ForentEnd/JavaScript/js28"],
        },
        {
          title: "数组",
          children: [
            "/ForentEnd/JavaScript/array1", // 以ForentEnd为根目录来查找文件
            // 上面地址查找的是：ForentEnd>JavaScript>JS>array1.md 文件
          ],
        },
        {
          title: "异步Promise",
          children: ["/ForentEnd/JavaScript/promise"],
        },
        {
          title: "控制器初始化层级状态",
          children: [
            {
              title: "测试代码",
              children: ["/ForentEnd/JavaScript/Blocking/BlockingTest"],
            },
            {
              title: "代码实现",
              children: ["/ForentEnd/JavaScript/Blocking/"],
            },
          ],
        },
        {
          title: "多语言配置",
          children: ["/ForentEnd/JavaScript/MultilingualTranslation/"],
        },
        {
          title: "手动实现一个词法编译器",
          children: ["/ForentEnd/JavaScript/SuperTinyCompiler"],
        },
        {
          title: "微信",
          children: ["/ForentEnd/JavaScript/WeiXin"],
        },
        {
          title: "接口缓存",
          children: ["/ForentEnd/JavaScript/oneHandler"],
        },
        {
          title: "UMD",
          children: ["/ForentEnd/JavaScript/Umd"],
        },
        {
          title: "Cookie",
          children: ["/ForentEnd/JavaScript/Cookie"],
        },
      ],
      "/ForentEnd/Node/": [""],
      "/ForentEnd/TypeScript/": [
        "",
        "./dataTypes",
        "./declare",
        "./function",
        "./interface",
        "./top",
      ],
      "/ForentEnd/HTML/": ["", "/ForentEnd/HTML/HTMLTransformPDF"],
      "/ForentEnd/CSS/": ["", "/ForentEnd/CSS/Less", "/ForentEnd/CSS/Style.md"],
      "/ForentEnd/Vue/": [
        "",
        {
          title: "进阶散点",
          collapsable: false,
          children: ["/ForentEnd/Vue/scatter"],
        },
        {
          title: "压缩图片",
          children: ["/ForentEnd/Vue/CompressPictures"],
        },
        {
          title: "组件",
          children: [
            {
              title: "前言",
              children: ["/ForentEnd/Vue/Components/"],
            },
            {
              title: "组件通讯",
              children: ["/ForentEnd/Vue/Components/Communication"],
            },
            {
              title: "删除组件",
              children: ["/ForentEnd/Vue/Components/DeleteComponent"],
            },
            "/ForentEnd/Vue/Components/Tree",
          ],
        },
      ],
      "/ForentEnd/Webpack/": [
        "",
        {
          title: "指南",
          collapsable: true,
          children: [
            "/ForentEnd/Webpack/manageResource",
            "/ForentEnd/Webpack/manageOutput",
            "/ForentEnd/Webpack/development",
            "/ForentEnd/Webpack/HMR",
            "/ForentEnd/Webpack/treeShaking",
            "/ForentEnd/Webpack/productionBuild",
            "/ForentEnd/Webpack/lazyLoading",
            "/ForentEnd/Webpack/cache",
            "/ForentEnd/Webpack/shimming",
            "/ForentEnd/Webpack/NODE_ENV",
            "/ForentEnd/Webpack/moduleFederation",
          ],
        },
        {
          title: "优化",
          children: [
            "/ForentEnd/Webpack/optimize",
            "/ForentEnd/Webpack/plugins",
          ],
        },
      ],
      "/ForentEnd/React/": [
        "",
        "/ForentEnd/React/Hook",
        {
          title: "Antd动态主题",
          children: ["/ForentEnd/React/AntdTheme"],
        },
        {
          title: "优化Antd动态主题",
          children: ["/ForentEnd/React/NewAntdTheme"],
        },
        {
          title: "antd",
          children: ["/ForentEnd/React/antd"],
        },
        {
          title: "Fiber",
          children: ["/ForentEnd/React/Fiber"],
        },
        {
          title: "ReactNative",
          children: ["/ForentEnd/React/ReactNative"],
        },
      ],
      "/ForentEnd/Regex/": ["", "/ForentEnd/Regex/use"],
      "/ForentEnd/Eslint/": ["", "/ForentEnd/Eslint/jiang-eslint-setting"],
      "/ForentEnd/Component/": [
        "",
        "/ForentEnd/Component/reactWithAntd",
        "/ForentEnd/Component/importNeed",
      ],
      "/ForentEnd/Performance/": ["", "/ForentEnd/Performance/sitespeed"],
      "/ForentEnd/CaseQuestions/": [
        {
          title: "JavaScript",
          children: [
            "/ForentEnd/CaseQuestions/JavaScript",
            "/ForentEnd/CaseQuestions/JavascriptCode",
          ],
        },
        {
          title: "Webpack",
          children: [
            "/ForentEnd/CaseQuestions/Webpack",
            "/ForentEnd/CaseQuestions/Webpack",
          ],
        },
        {
          title: "Babel",
          children: ["/ForentEnd/CaseQuestions/Babel"],
        },
        {
          title: "React",
          children: ["/ForentEnd/CaseQuestions/React"],
        },
        {
          title: "Vue",
          children: ["/ForentEnd/CaseQuestions/Vue"],
        },
        {
          title: "Project",
          children: ["/ForentEnd/CaseQuestions/project"],
        },
        {
          title: "Http",
          children: ["/ForentEnd/CaseQuestions/Http"],
        },
        {
          title: "HTML",
          children: ["/ForentEnd/CaseQuestions/HTML"],
        },
        {
          title: "CSS",
          children: ["/ForentEnd/CaseQuestions/CSS"],
        },
      ],
      "/ForentEnd/Test/": ["", "/ForentEnd/Test/Jest"],
      "/CodeManage/Git/": ["", "/CodeManage/Git/Git-Hooks"],
      "/CodeManage/NPM/": [""],
      "/CodeManage/Lerna/": [""],
      "/Tools/Jenkins/": ["", "/Tools/Jenkins/WithGitHub"],
      "/Algorithm/LeetCode/": leecodeSidebar,
    },
  },
};

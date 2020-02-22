module.exports = {
  title: "柒世(SMegalo)",
  description: "2020, 学习进步!",
  port: 8082,
  base: "/",
  dest: "docs/.vuepress/distBlok",
  head: [
    [
      "link",
      {
        rel: "shortcut con",
        type: "image/x-icon",
        href: "/favicon.ico"
      }
    ]
  ],
  markdown: {
    lineNumbers: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@public": "./public"
      }
    }
  },
  postcss: {},
  themeConfig: {
    lastUpdated: "Last Updated",
    sidebarDepth: 2,
    displayAllHeaders: true,
    nav: [
      {
        text: "首页",
        link: "/"
      },
      {
        text: "前端",
        items: [
          {
            text: "JavaScript",
            link: "/ForentEnd/JavaScript/"
          },
          {
            text: "HTML",
            link: "/ForentEnd/HTML/"
          },
          {
            text: "Vue",
            link: "/ForentEnd/Vue/"
          },
          {
            text: "Webpack",
            link: "/ForentEnd/Webpack/"
          },
          {
            text: "正则表达式",
            link: "/ForentEnd/Regex/"
          }
        ]
      },
      {
        text: "代码管理",
        items: [
          {
            text: "Git",
            link: "/CodeManage/Git/"
          }
        ]
      },
      {
        text: "GitHub",
        link: "https://github.com/18355166248"
      }
    ],
    sidebar: {
      "/ForentEnd/JavaScript/": [
        "",
        {
          title: "JavaScript技巧",
          collapsable: false,
          children: ["/ForentEnd/JavaScript/js28"]
        },
        {
          title: "数组",
          children: [
            "/ForentEnd/JavaScript/array1" // 以docs为根目录来查找文件
            // 上面地址查找的是：docs>accumulate>JS>test.md 文件
          ]
        },
        {
          title: "异步Promise",
          children: ["/ForentEnd/JavaScript/promise"]
        }
      ],
      "/ForentEnd/Vue/": [
        "",
        {
          title: "进阶散点",
          collapsable: false,
          children: ["/ForentEnd/Vue/scatter"]
        },
        {
          title: "压缩图片",
          collapsable: false,
          children: ["/ForentEnd/Vue/CompressPictures"]
        }
      ],
      "/ForentEnd/Webpack/": [
        "",
        {
          title: "指南",
          collapsable: false,
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
            "/ForentEnd/Webpack/NODE_ENV"
          ]
        }
      ],
      "/ForentEnd/Regex/": ["", "/ForentEnd/Regex/use"]
    }
  }
};

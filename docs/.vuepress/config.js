module.exports = {
  title: '柒世',
  description: '一直在路上',
  port: 8082,
  base: '/',
  dest: 'docs/.vuepress/distBlok',
  head: [
    ['link', {
      rel: 'shortcut con',
      type: "image/x-icon",
      href: '/favicon.ico'
    }]
  ],
  markdown: {
    lineNumbers: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@public': './public'
      }
    }
  },
  postcss: {

  },
  themeConfig: {
    lastUpdated: 'Last Updated',
    sidebarDepth: 2,
    displayAllHeaders: true,
    nav: [{
        text: '首页',
        link: '/'
      },
      {
        text: '前端',
        items: [{
          text: 'JavaScript',
          link: '/JavaScript/'
        }, {
          text: 'HTML',
          link: '/HTML/'
        }, {
          text: 'Vue',
          link: '/Vue/'
        }, {
          text: 'Webpack',
          link: '/Webpack/'
        }]
      },
      {
        text: 'GitHub',
        link: 'https://github.com/18355166248'
      }
    ],
    sidebar: {
      '/JavaScript/': [
        '/JavaScript/',
        {
          title: 'JavaScript技巧',
          children: [
            '/JavaScript/js28'
          ]
        },
        {
          title: '数组',
          children: [
            '/JavaScript/array1', // 以docs为根目录来查找文件 
            // 上面地址查找的是：docs>accumulate>JS>test.md 文件
          ]
        }
      ],
      '/Vue/': [
        '/Vue/',
        {
          title: '进阶散点',
          collapsable: false,
          children: [
            '/Vue/scatter'
          ]
        }
      ],
      '/Webpack/': [
        '/Webpack/',
        {
          title: '指南',
          collapsable: false,
          children: [
            '/Webpack/manageResource'
          ]
        }
      ]
    }
  }
}
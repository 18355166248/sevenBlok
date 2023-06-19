# 远程组件

这里记录下我是如何通过 [Module Federation](https://webpack.docschina.org/concepts/module-federation/) 实现远程组件配置化的

## 动机

我们在开发低代码的过程中, 在原生可用的组件不满足实际业务场景的情况下, 我们就需要自己开发组件然后再低代码的项目中加载并使用

基于这个需求, 我想到了 webpack5 新的 plugin 模块联邦(Module Federation) 正好可以满足我的期望, 并且跟 npm 加载的方式完全不一样, 可以更加灵活的动态加载远程组件

## 思路

1. 我们首先需要一个远程组件开发的模板仓库, 我们可以在这里开发我们的组件, 包含低代码左侧的配置, 和中间的预览组件, 还有右侧的编辑配置
2. 然后我们需要在低代码后台维护一个远程组件列表, 里面包含组件的名称和版本还有组件打包后的路径地址, 版本是可以自定义配置到底使用哪个版本
3. 当我们做完远程组件列表后, 我们就可以自己开发好组件然后导报上传到我们的远程组件后台列表中
4. 当我们进入搭建页面的时候, 首先动态加载左侧的远程组件, 然后中间的预览部分是另外一个项目, 所以中间的预览项目需要自己加远程组件的预览部门, 右侧编辑配置当我们在选中组件的情况下, 初始化的时候判断是否是远程组件, 如果是就动态远程加载右侧的组件配置

## 实现

低代码平台包含以下项目

- [slow-components 基础组件库](https://github.com/18355166248/s-low-code)
- [slow-control 低代码前端后台管理系统](https://github.com/18355166248/s-low-code)
- [slow-render 低代码 h5](https://github.com/18355166248/s-low-code)
- [slow-remote-comp 低代码远程组件模板](https://github.com/18355166248/s-low-remote-comp)
- [slow-code-node 低代码 node 后端 nestjs](https://github.com/18355166248/s-low-code-node)

最后的项目成品请看 [在线地址](http://110.42.188.221:11000/application/remoteComp)

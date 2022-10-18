# GitPage 使用

我们在使用 Git 仓库的时候, 很多开源仓库都会有打包部署资源的配置
下面我们说说 Git Page 的配置

### 步骤:

1. 首先我们需要新建一个 git 仓库
2. 代码全部弄好以后, 我们需要安装推送打包静态资源的依赖 [gh-pages](https://github.com/tschaub/gh-pages) 默认提交的分支是 gh-pages
3. 需要在 package.json 中添加命令

   ```json
   "scripts": {
      "build": "",
      "deploy": "gh-pages -d 打包命令" //方便使用命令直接推送到github
   }
   ```

4. 本地先执行 build 再执行 deploy 就可以将打包后的代码发布到仓库的 gh-pages 分支
5. 然后打开以下图片, 按如下配置, 点击访问地址即可看到我们的部署代码页面了

![](@public/CodeManage/GitPage.jpeg)

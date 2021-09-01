# 使用 Jenkins 自动化部署 GitHub

这里分享下我再 mac 上搭建 jenkins 并且实现通讯 github, 当 github 上的项目触发 push 钩子的时候通知 jenkins 并执行特定代码, 自动打包部署博客

## 实现步骤

1. 初始化 jenkins, 登录 jenkins
2. 点击右上角用户, 左侧点击设置, 在 API Token 这里点击生成 token, 后期有用 ( 其实这里没用, 可以不用操作了 )
3. 找到 Manage Jenkins -> 系统设置, 在 Jenkins Location 下可以配置访问 Url, 这里后期需要配置成服务器的 Url,
   这里我使用 ngrok 内网穿透, 做了一个外网可以访问的 url http://sevenblok.free.idcfengye.com/
   具体怎么实现内网穿透, 可以看这里 [ngrok](https://www.ngrok.cc/)

   ![](@public/location.jpg)

4. 有时候环境变量需要配置一下, 比如 ndoe, npm, yarn 可以在系统设置里面配置,例如

![](@public/environment.jpg)

5. 点击新建 Item, 输入名称, 选择 Freestyle project

6. 在 Views 里面可以配置(重点),

7. 源码管理, 在里面输入项目地址, 添加账号密码, 默认分支是 master, 可以修改成自己需要的分支, 这里是为了拉取项目代码

8. 构建触发器, 这里需要选中 GitHub hook trigger for GITScm polling

![githook](@public/gitHook.jpg)
这里是为了跟 github 进行通讯, 触发 push 的钩子, 所以在设置这里的时候也需要去 github 项目中设置下 webhook

9. github 项目中, 点击 setting -> Webhooks, 点击添加 这里面需要输入一个 url
   这个 url 需要在 jenkins 里面的系统设置里面进行配置, 位置在系统设置下面的(如果找不到, 需要点击右边的高级,就看到了)

   ![](@public/githookUrl.jpg)

   这里的 url 可以添加你的服务器的地址 例如: http://sevenblok.free.idcfengye.com/github-webhook/

   ![](@public/gitHubWebHooks.jpg)

参考配置教程可以看这里[Jenkins 与 Github 集成 webhook 配置](https://blog.csdn.net/qq_21768483/article/details/80177920)

10. 如果需要 node, 要去插件里面安装好, 然后在 Global Tool Configuration 里面就可以安装 node, 名字随便取

![](@public/node.jpg)

然后这里就可以选择你安装好的 node

![](@public/nodeUse.jpg)

11. 重点来了, 我这里需要用到自己写的一个脚本 deploy.sh, 当时配置的时候一直报错, 就是因为环境变量没有配置好, 所以这里需要在最开始执行下 <text-line txt="source /etc/profile" />, 不然会一直报错

![](@public/shell.jpg)

12. 然后这里就配置成功了, 可以点击 Build Now 测试下 应该是可以跑通的

## 实现自动化部署

这里需要一个可以外网访问的 Ip, 我没有服务器 所以使用的 ngrok 弄了一个网址, 选择用免费的 http, 不要用 https

[ngrok](https://www.ngrok.cc/user.html)

[ngrok 教程](http://www.ngrok.cc/_book/start/ngrok_linux.html?q=)

前面也有提到, 这里配置好网址, 需要去 jenkins 里面设置下 2 个地方, 都是在系统设置里面设置

一个是 Jenkins URL

另一个是 Github 服务器 > 高级按钮 -> 覆盖 Hook URL (勾选为 Github 指定另外一个 Hook URL, 输入地址, 例如: http://sevenblok.free.idcfengye.com/github-webhook/)

这样的话在代码 push 到 github 的时候回触发钩子, 然后告诉 jenkins, 然后执行相应的 view, 实现自动化部署

## 结语

至此, 就全部弄好了! 一开始弄很迷惑,而且差点就放弃了

查了很多资料, 最后还是弄好了, 对于 jenkins 自动化部署也有了一定的了解, 当前还是入门, 不过还是很开心的!

希望大家可以学习坚持!

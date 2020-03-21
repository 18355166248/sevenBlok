# Jenkins 介绍

Jenkins 是一款开源 CI&CD 软件，用于自动化各种任务，包括构建、测试和部署软件。

Jenkins 支持各种运行方式，可通过系统包、Docker 或者通过一个独立的 Java 程序。

### 前置需要

1. Java 8 ( JRE 或者 JDK 都可以)
2. Docker （导航到网站顶部的 Get Docker 链接以访问适合您平台的 Docker 下载）(也可以不需要, 使用安装包就行)

### 安装

去官网下载包 或者 docker 安装, 安装过程中可能会有权限问题, 我再 Mac 上安装的时候, 后期遇到很多权限问题这里给出几个解决办法:

1. sudo chmod -R 777 需要赋予权限的文件夹路径<text-line txt="(一定要加 sudo)" />
2. 右击文件夹或者文件, 选择显示简介, 设置权限读与写

### 注意点

1. 默认是 8080 端口 localhost:8080, 可以修改! 如果需要需改, 不仅可以在 jenkins 登录后的页面的系统设置里面修改, 也可以在文件中进行修改!

#### xml 设定文件方式

通过如下 xml 设定文件即可修改 Jenkins 的 root URL

- 文件名称: jenkins.model.JenkinsLocationConfiguration.xml
- 放置路径: \${JENKINS_HOME}
- 起效方式: Jenkins 服务重启之后
- 文件内容示例

```xml
<?xml version='1.1' encoding='UTF-8'?>

<jenkins.model.JenkinsLocationConfiguration>
<adminAddress>643546122@qq.com</adminAddress>
<jenkinsUrl>http://localhost:8080</jenkinsUrl>
</jenkins.model.JenkinsLocationConfiguration>
```

[参考地址](https://blog.csdn.net/liumiaocn/article/details/94379257)

### 常用方法快捷命令

1. 安装包安装的 Jenkins, 修改默认端口的方法：

- 先关闭 jenkins ;
- 命令行下修改端口：sudo defaults write /Library/Preferences/org.jenkins-ci httpPort 7071
- 启动 jenkins： sudo launchctl load /Library/LaunchDaemons/org.jenkins-ci.plist
- 停止 jenkins：sudo launchctl unload /Library/LaunchDaemons/org.jenkins-ci.plist

2. 用 brew 安装的的 Jenkins, 修改默认端口的方法：

- 打开文件 vi /usr/local/opt/jenkins/homebrew.mxcl.jenkins.plist 修改默认端口号
- 启动 jenkins： brew services start jenkins
- 停止 jenkins：brew services stop jenkins
- 重启 Jenkins：brew services restart jenkins
- 更新：切换到目录 cd ~/.jenkins，然后用最新下载的 war 包替换文件夹中的 war

3. 修改 jenkins wrokSpace 目录<text-line txt="注意：在 Jenkins 运行时是不能更改的. 请先将 Jenkins 停止运行。" />

- /Library/LaunchDaemons  
  #编缉里面的 jenkinshome 和 username  
  sudo vim org.jenkins-ci.plist
- 修改环境变量 (变量名: JENKINS_HOME)

- 在启动 Web 容器之前设置 JENKINS_HOME 环境变量.

  用 root 用户登录
  编辑 profile 文件：vi ~/.zshrc
  在最后加入：export JENKINS_HOME=xxxx
  保存，退出后执行：source ~/.zshrc
  让配置生效

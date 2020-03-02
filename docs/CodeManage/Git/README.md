# Git 常用功能记录

## git 功能

1. git reset --soft HEAD^ 撤销 git commit
   - HEAD^的意思是上一个版本，也可以写成 HEAD~1
   - 如果你进行了 2 次 commit，想都撤回，可以使用 HEAD~2
2. 如果想修改 git commit 的注释 git commit --amend

## git 远程地址操作

1. git remote add origin git@github.com:nanfei9330/learngit.git
2. git push -u origin master

   - 第一次使用加上了-u 参数，是推送内容并关联分支。
   - 推送成功后就可以看到远程和本地的内容一模一样，下次只要本地作了提交，就可以通过命令：git push origin master

3. git remote update origin -p 更新本地远程分支列表

## 多人协作开发

1. 首先将项目 form 到个人仓库
2. 配置本地项目的 git 仓库地址， 按如下设置

```
$ git remote set-url origin <主仓库地址>
$ git remote set-url --push origin <自己的 fork 仓库地址>
$ git remote -v  #查看 fetch的地址
#origin <主仓库地址> (fetch)
#origin <自己的 fork 仓库地址> (push)
```

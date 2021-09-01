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

## 常用命令

1. git 克隆远程指定分支 git clone -b <指定分支名> <远程仓库地址>

## git pull 代码的时候默认使用 rebase 而不是 merge

git pull 实际会有两个操作，一个是 git fetch，另外一个是 git merge。一般 merge 的情况下会产生一个新的提交名字为 Merge branch \*\*\*\*，如下图所示：

这个新的提交会导致提交记录中产生多余的提交信息，实际与解决问题相关的提交不符而且对于一些洁癖来说这种难以接受，所以 git 提供了一个 rebase 的方式来替代 merge，rebase 可以按顺序结构重新整合提交顺序而不是产生一个新的提交。具体的区别大家可到网络上搜索一下这里重点不是介绍他们两个的区别。

而如果你希望每次拉代码的时候不需要执行 git fetch 后再执行一次 git rebase，而是像以前一样直接执行 git pull 而是使用 rebase 来合并代码的话，那以下命令可以帮到你。

```js
git config --global pull.rebase true
```

执行次命令后，每次 git pull 都将是一个 git fetch + git rebase 的过程了，而不是以前的那种方式。

## GitHub contributions 没有绿色显示提交问题

1. Issues 和 pull requests
   这个操作是在一年之内
   这个操作是针对一个独立的仓库，不能是 fork

2. Commits
   当你的 commits 满足以下条件时，它才会被展示出来：

   一年之内提交的 commits
   commits 使用的 email 地址是与你的 Github 账号相关联的
   这些 commits 是在一个独立的仓库而不是 fork 仓库
   这些 commits 是在：
   在默认分支上（通常是 master）
   在 gh-pages 分支(包含 Project Pages sites 的仓库)
   此外，至少满足下面条件中的一个（主要针对你 Commit 的仓库不是你创建的）：

   你是这个仓库的协作者，或者是这个版本库的拥有组织中的一员
   你 fork 过这个仓库
   你对这个仓库发起过 pull request 或者 issue
   你对这个仓库标记了 Star
   　　注意：私有库的贡献仅仅对私有库成员显示

3. Contributions 未被 Github 计入的几个常见原因
   进行 Commits 的用户没有被关联到你的 Github 帐号中。
   不是在这个版本库的默认分支进行的 Commit。
   这个仓库是一个 Fork 仓库，而不是独立仓库。

4. git config user.email
   你的 git config user.email 需要是账号绑定的
   可能会存在绑定了还是不显示的情况
   我这边有 2 个方法:

   1. 在项目的根目录 进入.git/config 下 添加

   ```
   [user]
      user.name = '名字'
      user.email = '邮箱'
   ```

   这样的话是可以的

   2. 再次设置全局的配置

   ```
   git config --global user.name = '名字'
   git config --global user.email = '邮箱'
   ```

   然后你再次 push 代码后就可以实时看到绿点了

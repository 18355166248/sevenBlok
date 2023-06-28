# Git Rebase

[官方文档](https://git-scm.com/docs/git-rebase)

## -i --interactive

合并多个 commit

```js
git rebase -i commitID
```

将连续的 commit id 合并，假如是不连续的话，那么你也是拿最早的 commit id 来执行 git  rebase -i  commit id，然后进入弹出框，你会看到 pick 中没有最早你要合并的那个 commitid，
但是只需要一条提交记录，因此先按“i”键进入 INSERT 模式，将后三次 commit id 前面的“pick”字样改为“s”，只有第一次的 commit id 前面是“pick”，然后按 ESC 键退出编辑模式，并输入:wq 进行保存。注意如果是在 Intellij IDEA 的 Terminal 框里编辑 rebase 信息，那么在按 ESC 之后光标会回到代码区，此时输入的“:wq”会写到代码里，所以这种情况下按 ESC 键之后，要重新用鼠标点一下 Terminal 框里的区域，重新把光标定位回 Terminal 框中。

当然更好的方式是上图中后 3 条提交记录都从“pick”改成“f”，这样:wq 保存后就不用进行下面第三步了，会自动并入第一条提交记录中。

在上一个 pick 与 squash 编辑界面用:wq 保存后，会跳出最后的 commit 描述编辑界面，如下图所示：

这里按“i”键进入 INSERT 模式后，可以把不需要的后三条 commit 描述用“#”号注释掉，只留下第一次提交时那条蓝色高亮的“Support”描述，然后用 ESC 键退出编辑模式，再输入:wq 进行保存。

在经历上面两个 rebase 编辑步骤后，本地 Git 的 commit 记录已经成功合并，需要将合并好的单条记录覆盖掉远程 GitLab 上的四条记录，在命令行输入以下命令即可：
git push -f origin 分支名

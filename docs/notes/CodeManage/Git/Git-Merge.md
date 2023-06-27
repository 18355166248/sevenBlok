# Git merge

[官方文档](https://git-scm.com/docs/git-merge)

## –ff –no-ff --ff-only

### fast-forward

Git 合并两个分支时，如果顺着一个分支走下去可以到达另一个分支的话，那么 Git 在合并两者时，只会简单地把指针右移，叫做“快进”（fast-forward）不过这种情况如果删除分支，则会丢失 merge 分支信息。

### –squash

把一些不必要 commit 进行压缩，比如说，你的 feature 在开发的时候写的 commit 很乱，那么我们合并的时候不希望把这些历史 commit 带过来，于是使用–squash 进行合并，此时文件已经同合并后一样了，但不移动 HEAD，不提交。需要进行一次额外的 commit 来“总结”一下，然后完成最终的合并。

### –no-ff

关闭 fast-forward 模式，在提交的时候，会创建一个 merge 的 commit 信息，然后合并的和 master 分支
merge 的不同行为，向后看，其实最终都会将代码合并到 master 分支，而区别仅仅只是分支上的简洁清晰的问题，然后，向前看，也就是我们使用 reset 的时候，就会发现，不同的行为就带来了不同的影响

### 分析

![](@public/CodeManage/git-merge-no-ff.jpg)

上图是使用 merge --no-ff 的时候的效果，此时 git reset HEAD^ --hard 的时候，整个分支会回退到 dev2-commit-2

![](@public/CodeManage/git-merge-ff.jpg)

上图是使用 fast-forward 模式的时候，即 git merge ，这时候 git reset HEAD^ --hard，整个分支会回退到 dev1-commit-3

通常我们把 master 作为主分支，上面存放的都是比较稳定的代码，提交频率也很低，而 develop 是用来开发特性的，上面会存在许多零碎的提交，快进式合并会把 develop 的提交历史混入到 master 中，搅乱 master 的提交历史。所以如果你根本不在意提交历史，也不爱管 master 干不干净，那么 –no-ff 其实没什么用。不过，如果某一次 master 出现了问题，你需要回退到上个版本的时候，比如上例，你就会发现退一个版本到了 commint-3，而不是想要的 commit-2，因为 feature 的历史合并进了 master 里。这也就是很多人都会推荐 –no-ff 的原因了吧

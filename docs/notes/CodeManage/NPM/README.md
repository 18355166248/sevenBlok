# NPM 日常操作

## 更新依赖

```shell
npm audit // 查看有哪些版本过低, 哪些版本过高
npm audit fix --force
npm install
```

## 更新版本号

```shell
npm version info
npm version patch
npm versipn prepatch
```

### 注意点

1. 不要在 package.json 的 scripts 下面写 publish version 什么的 npm 命令, 会造成命令行执行 npm publish 的时候默认再执行 scripts 下的命令一次, 出现 2 次执行的情况

## npm 发布如何忽略指定的文件

如何发布用户需要使用的相关文件呢？

1. 方法一：使用 .gitignore 设置忽略哪些文件
   .gitignore 设置的忽略文件，在 git 代码管理和 npm publish 都会被忽略

2. 方法二：使用 .npmignore 设置忽略哪些文件
   .npmignore 的写法跟**.gitignore** 的规则完全一样。若同时使用了**.npmignore 和.gitignore**，只有**.npmignore**会生效，优先级比较高

3. 方法三：使用 package.json 的 files 字段选择发布哪些文件
   在 package.json 中 files 字段设置发布哪些文件或目录。这个优先级高于 .npmignore 和 .gitignore

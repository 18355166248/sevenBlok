# Lerna 项目代码管理

## lerna.json

```json
{
  "npmClient": "npm",
  "version": "1.0.0 或者 independent",
  "command": {
    "publish": {
      "ignoreChanges": ["ignored-file", "*.md"]
    },
    "bootstrap": {
      "ignore": "component-*",
      "npmClientArgs": ["--no-package-lock"]
    }
  },
  "packages": ["packages/*"]
}
// version , 当前库的版本
// npmClient , 允许指定命令使用的client， 默认是 npm， 可以设置成 yarn
// command.publish.ignoreChanges ， 可以指定那些目录或者文件的变更不会被publish
// command.bootstrap.ignore ， 指定不受 bootstrap 命令影响的包
// command.bootstrap.npmClientArgs ， 指定默认传给 lerna bootstrap 命令的参数
// command.bootstrap.scope ， 指定那些包会受 lerna bootstrap 命令影响
// packages ， 指定包所在的目录
```

## lerna publish

我使用的是 independent 独立模式.
允许管理者对每个库单独改变版本号，每次发布的时候，你需要为每个改动的库指定版本号。

```shell
lerna publish  // 发布最新commit的修改
lerna publish <commit-id> // 发布指定commit-id的代码
```

### 命令

#### canary

```json
lerna publish --canary
# 1.0.0 => 1.0.1-alpha.0+${SHA} of packages changed since the previous commit
# a subsequent canary publish will yield 1.0.1-alpha.1+${SHA}, etc

lerna publish --canary --preid beta
# 1.0.0 => 1.0.1-beta.0+${SHA}

# The following are equivalent:
lerna publish --canary minor
lerna publish --canary preminor
# 1.0.0 => 1.1.0-alpha.0+${SHA}
```

### --registry <url> 指定 registry

### --npm-client 指定安装用的 npm client

```shell
lerna bootstrap --npm-client=yarn
```

也可以在 lerna.json 中设置

```json
{
  "npmClient": "yarn"
}
```

### lerna run

执行每个包 package.json 中的脚本命令

### 说下 publish 遇到的坑

1. 我之前 npm 源设置的是公司内部源地址, 所以每次 lerna publish 的时候都是往公司地址上 publish 其实有问题的

2. 因为 npm 源设置的是公司内部源地址, 所以我每次 npm login 的时候登录的也是公司内部私服, 所以 publish 也不成功

3. 在根目录的 package.json 中

```json
 "repository": {
    "type": "git",
    "url": "git+https://github.com/18355166248/jiang-hooks.git" // 在publish 的时候会自动将代码更新带对应的代码仓库中 不需要自己push
  },
  "authors": {
    "name": "18355166248",
    "email": "643546122@qq.com"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "repository": "https://github.com/18355166248/jiang-hooks",
  "homepage": "https://github.com/18355166248/jiang-hooks",
```

4. 在对应子仓库的 package.json 中

我只希望上传到 npm 指定文件 这个时候有多个方案 可以看 NPM 下的说明

1. 方法一：使用 .gitignore 设置忽略哪些文件
   .gitignore 设置的忽略文件，在 git 代码管理和 npm publish 都会被忽略

2. 方法二：使用 .npmignore 设置忽略哪些文件
   .npmignore 的写法跟**.gitignore** 的规则完全一样。若同时使用了**.npmignore 和.gitignore**，只有**.npmignore**会生效，优先级比较高

3. 方法三：使用 package.json 的 files 字段选择发布哪些文件
   在 package.json 中 files 字段设置发布哪些文件或目录。这个优先级高于 .npmignore 和 .gitignore

我这里用了第三种

```json
"files": [
  "dist",
  "es",
  "lib",
  "package.json",
  "README.md"
]
```

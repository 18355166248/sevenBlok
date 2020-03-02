# Git Hooks (钩子)

Git 能在特定的重要动作发生时触发自定义脚本。 有两组这样的钩子：客户端的和服务器端的。 客户端钩子由诸如提交和合并这样的操作所调用，而服务器端钩子作用于诸如接收被推送的提交这样的联网操作。 你可以随心所欲地运用这些钩子。

我们通常用 husky 来处理 Git Hook

## 安装

1. husky，lint-staged，@commitlint/cli，@commitlint/config-conventional
   lint-staged: 用于实现每次提交只检查本次提交所修改的文件。

```
yarn add -D husky lint-staged

yarn add -D @commitlint/config-conventional @commitlint/cli
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
```

::: warning
注意：一定要使用 npm 安装 eslint 和 husky，因为在 windows 操作系统下, 用 yarn 安装依赖，不会触发 husky pre-commit 钩子命令。
cnpm 也不要用, husky 会不能触发 pre-commit
:::

```
<type>[optional scope]: <des>
[空行]
[optional body]
[空行]
[optional footer]
```

commitlint(约定式提交)一些常用规则的意义:

- fix: 修复一个 bug
- feat: 添加新功能
- build: 改变构建系统、配置或添加依赖（作用域例子：gulp、webpack、npm 等）
- ci: 改变 CI 配置
- docs: 文档的改变
- perf: 没有改变逻辑，但是提升了性能（performance）
- refactor: 没有改变逻辑的代码重构
- style: 改变代码样式，格式化代码等（不是指 css 文件）
- test: 添加和改变测试代码

:::warning
每个提交都必须使用类型字段前缀，它由一个名词组成，诸如 feat 或 fix ，其后接一个可选的作用域字段，以及一个必要的冒号（英文半角）和空格。例如
:::

```
feat: 图片查看器新增滚动预览

BREAKING CHAGNE: `url` 字段已经被 `source` 字段代替
```

## 使用

### 创建 .huskyrc 或者 package.json 配置

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
```

### 创建.lintstagedrc 或者 package.json 配置

```json
"lint-staged": {
  "*.{js, vue, css}": [
    "eslint", // 设置 --fix 可以开启启动修复
    "prettier" // --write 自动格式化代码(不建议使用)
  ]
}
```

### 创建 commitlint.config.js

```json
(module.exports = {
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      [
        "feat", // 新功能（feature）
        "fix", // 修补bug
        "docs", // 文档（documentation）
        "style", // 格式（不影响代码运行的变动）
        "refactor", // 重构（即不是新增功能，也不是修改bug的代码变动）
        "test", // 增加测试
        "revert", // 回滚
        "config", // 构建过程或辅助工具的变动
        "chore" // 其他改动
      ]
    ],
    "type-empty": [2, "never"], // 提交不符合规范时,也可以提交,但是会有警告
    "subject-empty": [2, "never"], // 提交不符合规范时,也可以提交,但是会有警告
    "subject-full-stop": [0, "never"],
    "subject-case": [0, "never"]
  }
})
```

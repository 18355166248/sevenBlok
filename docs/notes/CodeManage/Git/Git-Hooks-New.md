# Git Hooks (钩子)

Git 能在特定的重要动作发生时触发自定义脚本。 有两组这样的钩子：客户端的和服务器端的。 客户端钩子由诸如提交和合并这样的操作所调用，而服务器端钩子作用于诸如接收被推送的提交这样的联网操作。 你可以随心所欲地运用这些钩子。

我们通常用 [husky@8](https://typicode.github.io/husky/#/) 来处理 Git Hook

## 安装

1. [husky](https://github.com/typicode/husky), [lint-staged](https://github.com/okonet/lint-staged), [commitlint](https://github.com/conventional-changelog/commitlint)

> lint-staged: 用于实现每次提交只检查本次提交所修改的文件。

```javascript
pnpm install -D husky lint-staged @commitlint/config-conventional @commitlint/cli eslint prettier

yarn add -D husky lint-staged @commitlint/config-conventional @commitlint/cli eslint prettier
```

动态写入文件 commitlintrc 或者自己新建文件

```javascript
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
```

## 配置

1. 修改 package.json

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint:eslint": "eslint --fix --ext .js,.ts,.vue,.tsx ./src",
    "lint:prettier": "prettier --write src/"
  },
  "lint-staged": {
    "*.{js,jsx,vue,ts,tsx}": ["pnpm run lint:eslint", "pnpm run lint:prettier"]
  }
}
// prepare脚本会在npm install（不带参数）之后自动执行。也就是说当我们执行npm install安装完项目依赖后会执行 husky install命令，该命令会创建.husky/目录并指定该目录为git hooks所在的目录。
```

::: warning
注意：Yarn 2+ doesn't support prepare lifecycle script, so husky needs to be installed differently (this doesn't apply to Yarn 1 though). See [Yarn 2+ install](https://typicode.github.io/husky/#/?id=yarn-2).
:::

2. 创建一个 hook (不要忘记在执行之前执行 husky install )

```js
npx husky add .husky/pre-commit "npx --no-install lint-staged"

git add .husky/pre-commit
```

3. commitlint 配置 (或者手动创建)

```js
npx husky add .husky/commit-msg  "npx --no -- commitlint --edit ${1}"
```

4. 配置 eslint prettier

这里我们使用 谷歌的开源 [gts](https://github.com/google/gts) 配置

```js
npx gts init
```

.eslintrc.json

```json
{
  "extends": "./node_modules/gts/"
}
```

.prettierrc.js

```js
module.exports = {
  ...require("gts/.prettierrc.json"),
  endOfLine: "auto",
};
```

## commit msg 提交规范

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

## 开始

大家经常使用的 **create-react-app**, **vue-cli** 都是脚手架. 这里整理下在开发这样一套脚手架需要用到的工具

### 1. [Commander](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md)

commander 是一个轻巧的 nodejs 模块，提供了用户命令行输入和参数解析强大功能

### 2. [Chalk](https://github.com/chalk/chalk)

美化终端命令的样式

```js
const chalk = require("chalk");

const log = console.log;
const error = chalk.bold.red;
const warning = chalk.hex("#FFA500");

log(error("Error!"));
log(warning("Warning!"));

log(chalk.blue("Hello") + " World" + chalk.red("!"));

log(chalk.blue.bgRed.bold("Hello world!"));
```

效果:

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97908ad3c3a7446dae81190b685a478f~tplv-k3u1fbpfcp-watermark.image)

### 3. [node-semver](https://github.com/npm/node-semver)

规范版本号的控制, [semver](https://semver.org/lang/zh-CN/) 这里详细介绍了如何规范版本

常用的方法:

- valid 校验版本号是否符合标准, 正确直接返回, 错误的话返回 null
- coerce 将字符串强制转为正确的版本号
- clean 将字符串在可能的情况下转为正确的版本号
- satisfies 接收 2 个参数, 判断第一个参数是否符合第二个参数的要求, 一般用于判断当期版本号是否是期望的版本号

### 4. [didyoumean](https://github.com/dcporter/didyoumean.js)

简单的 JS 匹配引擎

简单理解就是提前准备好一个命令列表数据, 然后对你输入的结果跟列表数据进行匹配, 在你输入错误的情况下判断你是否是想要的哪个命令

举个 🌰

```js
// 准备好一个命令列表数据 list
var list = ['facebook', 'twitter', 'instagram', 'linkedin'];
// 输入一个值 insargrm
var input = 'insargrm'
// 使用 didYouMean 去匹配
console.log(didYouMean(input, list));
// 得到结果 instagram
> 'instagram'
```

#### 可配置的参数:

- threshold 搜索阈值 默认: 0.4 值越大搜索范围越大, 反之越小
- thresholdAbsolute 绝对阈值 默认: 20
- caseSensitive 控制大小写, 如果设置为 true, 则大小写不一样也不会匹配. 默认忽略大小写

### 5. [is-git-url](https://github.com/jonschlinkert/is-git-url)

校验 git 地址

```js
isGitUrl('git://github.com/jonschlinkert/is-git-url.git');
=> true

isGitUrl('https://github.com/jonschlinkert/');
=> false
```

### 6. [ora](https://github.com/sindresorhus/ora)

优雅的终端旋转器

```js
const ora = require("ora");
const chalk = require("chalk");
const { red } = require("chalk");

const spinner = ora({
  text: "加载中",
  prefixText: "前缀文本->",
  color: "gray",
});

spinner.start();

setTimeout(() => {
  spinner.color = "yellow";
  spinner.text = "加载变色了";
}, 1000);

setTimeout(() => {
  // spinner.stop();
  // spinner.succeed(chalk.green('加载成功'));
  // spinner.fail(chalk.green('加载失败'));
  spinner.warn(chalk.green("加载警告"));
}, 2000);
```

### 7. [execa](https://github.com/sindresorhus/execa)

execa 是更好的子进程管理工具（A better child_process）。本质上就是衍生一个 shell，传入的 command 字符串在该 shell 中直接处理。

例如 npm 初始化:

```js
const execa = require("execa");

execa("npm", ["init", "-y"]);
```

### 8. [node-fs-extra](https://github.com/jprichardson/node-fs-extra)

文件操作工具库

### 9. [node-lru-cache](https://github.com/isaacs/node-lru-cache)

lru 缓存工具

### 10. [inquirer](https://github.com/SBoudrias/Inquirer.js)

命令行的交互工具 比较常用的工具了 想学习的话直接看[官网 Demo](https://github.com/SBoudrias/Inquirer.js/tree/master/packages/inquirer/examples)

### 11. [validate-npm-package-name](https://github.com/npm/validate-npm-package-name)

校验 npm 包名是否合法

## 结语

目前我用到就是这些, 感觉学不动了! 后面准备再整理下怎么从 0 到 1 开发一个脚手架 Cli.

我是一个默默无闻的搬砖人 🧱

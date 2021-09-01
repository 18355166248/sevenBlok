# 自定义 Eslint 规则分享

因为特殊的业务场景靠 eslint 自身配置已经无法满足业务需求了，如：

- [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)
- [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue)
- [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest)
- [eslint-plugin-jiang-eslint](https://www.npmjs.com/package/eslint-plugin-jiang-eslint)

一般特殊场景的自定义规则都使用 eslint-plugin-\* 的命名，使用时可以方便的写成

```json
{
  "plugins": ["vue", "react", "jest", "jiang-eslint]
}
```

当然 eslint-config-\* 同理，不过配置时需要写成

```json
{
  "extends": ["plugin:vue/essential", "plugin:jiang-eslint/base"]
}
```

## 开发规则流程

### 1. 项目初始化

官方推荐使用 yeoman 生成项目，感觉生成的项目比较守旧，推荐下习惯我的项目结构

```tree
eslint-plugin-jiang-eslint
  |- __tests__
  |  |- rules
  |     |- api.test.js
  |  |- utils
  |
  |- lib
  |- |- config
  |     |- base.js 扩展rules默认配置
  |  |- rules
  |      |- api.js
  |  |- utils
  |  |- index.js
  |
  |- jest.config.js
  |
  |- package.json
  |
  |- README.md
```

- 用了 vscode 的调试功能进行 jest 测试, 方法: [vscode-jest-tests](https://github.com/Microsoft/vscode-recipes/tree/master/debugging-jest-tests)

- jest 的配置也就是基本配置:

```json
(module.exports = {
  "testEnvironment": "node",
  "roots": ["__tests__"],
  "resetModules": true,
  "clearMocks": true,
  "verbose": true
})
```

### 2. 开发一个规则

<card-leftLine>
  <span>
    前期准备
  </span>
</card-leftLine>

- [官当文档](https://eslint.org/docs/developer-guide/working-with-rules)
- [官方规则测试- RuleTester](https://eslint.org/docs/developer-guide/nodejs-api#ruletester)
- [Ast 编辑器](https://astexplorer.net/)
  Eslint 使用的是 espree(eslint 使用的语法解析库) 所以选择 espress 查看 Ast 结构

1. 写个简单的

```js
module.exports = {
  meta: {
    docs: {
      description: "禁止块级注释",
      category: "Stylistic Issues",
      recommended: true
    }
  },

  create(context) {
    const sourceCode = context.getSourceCode();[getSourceCode](https://eslint.org/docs/developer-guide/working-with-rules#context-getsourcecode)

    return {
      Program() {
        const comments = sourceCode.getAllComments(); // 获取全部注释

        const blockComments = comments.filter(({ type }) => type === "Block");

        blockComments.length &&
          context.report({
            message: "No block comments"
          });
      }
    };
  }
};
```

### 3. 测试

测试 lint 只有两种情况( valid, invalid )，通过与不通过，只需要把通过和不通过的情况整理成两个数组，剩下的工作交给 eslint 的 RuleTester 处理就行了

禁止块级注释测试代码:

```js
const RuleTester = require("eslint").RuleTester;
const rule = require("../../lib/rules/no-block-comments");

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6 }
}); // You do have to tell eslint what js you're using

ruleTester.run("no-block-comments", rule, {
  valid: ["var a = 1; console.log(a)"],
  invalid: [
    {
      code: "var a = 1; /* block comments */ console.log(a)",
      errors: [
        {
          message: "No block comments",
          type: "Program",
          nodeType: "Block"
        }
      ]
    }
  ]
});
```

<card-leftLine>
  <span>
    valid 中是希望通过的代码，invalid 中是不希望通过的代码和错误信息，到这里一个 rule 算是真正完成了。
  </span>
</card-leftLine>

#### rules 可能会有很多 这个时候怎么优雅的将多个 rules 打包导出呢

这里推荐使用 requireindex 批量导出一个文件夹下的所有文件
当然前提是保证 rules 文件夹下都是 rule 文件，不要把 utils 写进去哈

```js
const requireIndex = require("requireindex");

module.exports = {
  configs: {
    base: require("./config/base")
  },
  rules: requireIndex(`${__dirname}/rules`)
};
```

#### 很多使用我们想使用插件内部的默认配置, 而不是引入插件还得去自己在 rules 里面配置, 怎么设置默认配置规则呢

1. 在 rules > config 文件夹下配置默认配置

```js
module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    es6: true
  },
  plugins: ["jiang-eslint"],
  rules: {
    "jiang-eslint/no-block-comments": "warn",
    "jiang-eslint/object-sort": "warn",
    "jiang-eslint/api-file-format": "error",
    "jiang-eslint/util-file-format": "error"
  }
};
```

2. 然后在 runles > index 下引入默认配置并导出

```js
module.exports = {
  configs: {
    base: require("./config/base")
  }
};
```

:::warning
需要注意的是插件初始化导出 js 需要在 package.json 中的 main 配置
{
"main": "lib/index.js",
}
:::

### 4. 打包输出

最后写好的 rules 需要发一个 npm 包，以便于在项目中使用

1. 设置 package.json
   - private false
   - varsion 版本号
2. npm login 输入用户名, 密码, 邮箱
3. npm publish 发布

### 5. 插件使用

1. yarn 安装插件
2. 在.eslintrc 中进行配置

```json
(module.exports = {
  "root": true,
  "env": {
    "node": true,
    "browser": true,
    "es6": true
  },
  "plugins": ["vue", "jiang-eslint"],
  "extends": [
    "plugin:vue/essential",
    "plugin:jiang-eslint/base" // 使用了默认配置 在上面有提到过
  ],
  // "off" or 0 - 关闭(禁用)规则
  // "warn" or 1 - 将规则视为一个警告（并不会导致检查不通过）
  // "error" or 2 - 将规则视为一个错误 (退出码为1，检查不通过)
  "rules": {
    "prettier/prettier": "error",
    "no-console": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  "parserOptions": {
    "parser": "babel-eslint",
    "sourceType": "module"
  }
})
```

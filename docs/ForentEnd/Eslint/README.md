# Eslint 入门

## 1. 使用

在项目的根目录, 运行 eslint -init 将会产生一个.elsintrc 的文件, 内容包含一些校验规则

Eslint 提供了 error 的级别

1. "off" or 0 - 关闭(禁用)规则
2. "warn" or 1 - 将规则视为一个警告（并不会导致检查不通过）
3. "error" or 2 - 将规则视为一个错误 (退出码为 1，检查不通过)

### 自定义 Eslint 配置

之前提到你可以关掉所有 EsLint 默认的验证，自行添加所确切需要的验证规则。为此 EsLint 提供了 2 个种方式进行设置：

1. Configuration Comments: 在所要验证的文件中，直接使用 Javascript 注释嵌套配置信息
2. Configuration Files: 使用 JavaScript、JSON 或 YAML 文件，比如前面提到的.eslintrc 文件，当然你也可以在 package.json 文件里添加 eslintConfig 字段，EsLint 都会自动读取验证。

#### parserOptions

EsLint 通过 parserOptions，允许指定校验的 ecma 的版本，及 ecma 的一些特性

```json
{
  "parserOptions": {
    "ecmaVersion": 6, //指定ECMAScript支持的版本，6为ES6
    "sourceType": "module", //指定来源的类型，有两种”script”或”module”
    "ecmaFeatures": {
      "jsx": true //启动JSX
    }
  }
}
```

#### Parser

EsLint 默认使用 esprima 做脚本解析，当然你也切换他，比如切换成 babel-eslint 解析

```json
{
  "parser": "esprima" //默认，可以设置成babel-eslint，支持jsx
}
```

#### Environments

Environment 可以预设好的其他环境的全局变量，如 brower、node 环境变量、es6 环境变量、mocha 环境变量等

```json
{
  "env": {
    "browser": true,
    "node": true
  }
}
```

如果你想使用插件中的环境变量，你可以使用 plugins 指定，如下

```json
{
  "plugins": ["example"],
  "env": {
    "example/custom": true
  }
}
```

#### Globals

指定你所要使用的全局变量，true 代表允许重写、false 代表不允许重写

```json
{
  "globals": {
    "var1": true,
    "var2": false
  }
}
```

#### Plugins

EsLint 允许使用第三方插件

```json
{
  "plugins": ["react"]
}
```

#### Rules

自定义规则，一般格式：”规则名称”:error 级别系数。系数 0 为不提示(off)、1 为警告(warn)、2 为错误抛出(error)，可指定范围，如[1,4]

可以包括 Strict 模式、也可以是 code 的方式提醒，如符号等。还可以是第三方的校验，如 react。

<card-leftLine>
  <span>
    默认校验的地址http://eslint.org/docs/rules/
  </span>
</card-leftLine>

```json
{
  "plugins": ["react"],
  "rules": {
    //Javascript code 默认校验
    "eqeqeq": "off", //off = 0
    "curly": "error", //error = 2
    "quotes": ["warn", "double"], //warn = 1
    //使用第三方插件的校验规则
    "react/jsx-quotes": 0
  }
}
```

### 常用的 eslint 插件

- [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)，此链接是 react 的 eslint 使用
- [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue)，此链接是 vue 的 eslint 使用
- [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest)，此链接是 jest 的 eslint 使用

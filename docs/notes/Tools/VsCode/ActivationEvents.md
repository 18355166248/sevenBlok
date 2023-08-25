# VScode 插件中 package.json 文件 activationEvents 字段详解

[搬运](https://blog.csdn.net/guoqiankunmiss/article/details/118380533)

一、activationEvents
插件在 VScode 中默认是没有激活的，通过 activationEvents 来进行配置：

- onLanguage:\${language}
- onCommand:\${command}
- onDebug
  - onDebugInitialConfigurations
  - onDebugResolve
- workspaceContains:\${toplevelfilename}
- onFileSystem:\${scheme}
- onView:\${viewId}
- onUri
- onWebviewPanel
- onCustomEditor
- onStartupFinished
- \*

1. onLanguage
   > 当打开为特定语言的文件时, 插件被激活。
   > 请注意，大小写对于精确的标识符匹配很重要（‘Markdown’ != ‘markdown’）

```js
"activationEvents": [
"onLanguage:python"
]
```

可以支持多个语言，往数组里面添加即可

```js
"activationEvents": [
  "onLanguage:json",
  "onLanguage:markdown",
  "onLanguage:typescript"
]
```

2. onCommand
   > 当调用命令时，插件被激活。

```js
"activationEvents": [
"onCommand:extension.sayHello"
]
```

3. onDebug
   > 调试

```js
"activationEvents": [
"onDebug"
]
```

4. workspaceContains
   > 当打开文件夹并且该文件夹包含至少一个与 glob 模式匹配的文件时，插件被激活。

```js
"activationEvents": [
"workspaceContains:**/.editorconfig"
]
```

5. onFileSystem
   > 每当读取来自特定方案的文件或文件夹时，插件被激活。例如 ftp 或 ssh。

```js
"activationEvents": [
"onFileSystem:sftp"
]
```

6. onView
   > 当在 VS Code 侧栏中展开指定 id 的视图（扩展或源代码管理是内置视图的示例）时，插件被激活。

```js
"activationEvents": [
"onView:nodeDependencies"
]
```

每当具有 nodeDependencies id 的视图可见时，就会触发下面的激活事件

7. onUri
   > 当打开该扩展的系统范围的 Uri 时，插件被激活。

```js
"activationEvents": [
"onUri"
]
```

8. onWebviewPanel
   > 当 VS Code 需要使用匹配的 viewType 恢复 webview 时，插件被激活。

```js
"activationEvents": [
"onWebviewPanel:catCoding"
]
```

9. onCustomEditor

```js
"activationEvents": [
"onCustomEditor:catCustoms.pawDraw"
]
```

10. \*

    > 启动 vscode，插件就会被激活，为了用户体验，官方不推荐这么做。

11. onStartupFinished
    > 类似于 \* 激活事件，但它不会减慢 VS Code 的启动速度。

```js
"activationEvents": [
"onStartupFinished"
]
```

> 一个扩展可以监听多个激活事件，这比监听 \* 更合适

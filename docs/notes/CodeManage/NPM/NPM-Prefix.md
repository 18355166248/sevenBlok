# NPM 安装包到指定的路径下

从 npm 版本 3.8.6 开始，您可以使用：

```js
npm install --prefix ./install/here
```

安装在指定的目录中。node_modules 即使 node_modules 较高层次结构中已存在目录，NPM 也会自动创建文件夹。您还可以 package.json 在当前目录中拥有 a ，然后使用以下--prefix 选项将其安装在指定目录中：

```js
npm install --prefix ./install/here
```

从 npm 6.0.0 开始，您可以使用：

```js
npm install --prefix ./install/here ./
```

将当前目录中的 package.json 安装到“./install/here”目录。我在 Mac 上注意到有一件事它会在 node_modules 目录中创建一个符号链接到父文件夹。但是，它仍然有效。

最推荐的用法指令：
npm install --prefix ./(当前路径下)/（要安装的文件夹位置，如果没有这个文件夹，会自动新增一个文件夹） @vue/vli (包名) -g （全局安装）

举例子：

```js
npm install --prefix ./cli @vue.cli -g
```

注意：NPM 遵循您通过该--prefix 选项指定的路径。它根据文件夹上的 npm 文档解析，仅在 npm install 没有--prefix 选项的情况下使用。

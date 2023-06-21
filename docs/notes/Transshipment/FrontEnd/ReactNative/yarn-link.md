# 在 react-native 项目中使用 yarn link

预览
最近把项目中沉淀出来的一些工具函数整理出来编写成一个代码仓库，准备先在本地把每个函数都调试一遍之后再发布，需要使用 yarn link 或者 npm link 在测试的项目中 link 指定的本地依赖库，在这过程中遇到一些问题

问题
在 React Native 项目下无法使用 yarn link 或者 npm link 来 link 本地的依赖，原因是 RN 使用的打包工具 Metro 不支持 symlinks

逛了一番 issues 后，找到了一个可行的解决方案

解决方案
使用第三方库 [metro-symlinked-deps](https://github.com/Carimus/metro-symlinked-deps)

这个库可以用来自定义 metro 的打包配置，使用方法可以参考 metro-symlinked-deps 的文档

这里贴一下 metro-symlinked-deps 给出的例子

// metro.config.js

```js
const {
  applyConfigForLinkedDependencies,
} = require("@carimus/metro-symlinked-deps");

module.exports = applyConfigForLinkedDependencies(
  {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
  },
  {
    projectRoot: \\_dirname,
    blacklistLinkedModules: ["react-native"],
  }
);
```

但是在使用这个库的时候也遇到了一些问题

另一个问题
一开始使用这个库并没有解决 yarn link 无效的问题。确定自己配置没错之后，就开始寻找问题。因为看到有人说这个库有用，有人说没用。就开始看这个库的源码，看看它到底干了啥

于是，发现这个库会拿到项目下 node_modules 里面使用 symlink 的依赖的真实地址。

那么按理来说我用 yarn link 是符合他的这个逻辑的， 并且我使用 ls -l 命令查看我 link 的本地依赖也是正确返回了软链的地址。于是带着疑问我查看了这个库用来收集 link 的依赖的方法，最终发现这个库使用了 get-dev-paths 来检查 link 的依赖

```js
//  Resolve all detected linked directories to unique absolute paths without a trailing slash.
//  @param {string} projectRoot

function resolveDevPaths(projectRoot) {
  return Array.from(
    new Set(
      getDevPaths(projectRoot)
        .map((linkPath) => {
          return `${fs.realpathSync(linkPath)}`.replace(/\/+\$/, "");
        })
        .filter((absLinkPath) => !!absLinkPath)
    )
  );
}
```

所以目光来到了 get-dev-paths

首先看看它是如何返回 link 的依赖的

```js
addPath = function(dep) {
  var target;
  if (!fs.lstatSync(dep).isSymbolicLink()) {
    return;
  }
  try {
    target = realpath.sync(dep);
  } catch (error) {
    err = error;
    return typeof opts.onError === "function" ? opts.onError(err) : void 0;
  }
  // Skip target paths with "/node_modules/" in them.
  if (nodeModulesRE.test(target)) {
    return typeof opts.onError === "function"
      ? opts.onError(new Error(`Symlink leads to nothing: '${dep}'`))
      : void 0;
  }
  if (opts.preserveLinks) {
    paths.push(dep);
  }
  if (!visited.has(target)) {
    visited.add(target);
    if (!opts.preserveLinks) {
      paths.push(target);
    }
    queue.push(dep);
  }
};
```

addPath 方法通过判断一个文件路径是否是软链，并文件的真实路径添加最终的输出结果中

那么 addPath 在哪调用的呢，在这个库的源码里发现下面这段代码

```js
return fs.readdirSync(depsDir).forEach(function(name) {
  var scope;
  if (name[0] === ".") {
    // Skip hidden directories.
    return;
  }
  if (name[0] === "@") {
    scope = name;
    fs.readdirSync(path.join(depsDir, name)).forEach(function(name) {
      if (deps[(name = scope + "/" + name)]) {
        return addPath(path.join(depsDir, name));
      }
    });
  } else if (deps[name]) {
    addPath(path.join(depsDir, name));
  }
});
```

上面代码中 deps[name] 的 deps 是获取了项目目录下的 package.json 中的 dependencies 里的依赖，并且与 fs.readdirSync 方法获取的文件名来比对，如果文件名出现在了 dependencies 就执行 addPath 方法来获取真实路径并添加到最终结果中。

于是我发现，我使用 yarn link 的依赖的名字并没有出现在我的 package.json 中的 dependencies 里，于是我在 package.json 中的 dependencies 里添加了本地依赖的名字

```js
"dependencies": {
"myPackageName" : "\*"
},
```

再次尝试 react-native start ，终于编译成功。

One more thing
到这里就可以开始测试自己的本地依赖了，但是还有一个小小问题，可能会报错。本地依赖的依赖找不到了。这时候需要改一下配置

// metro.config.js

```js
const {
  applyConfigForLinkedDependencies,
} = require("@carimus/metro-symlinked-deps");

module.exports = applyConfigForLinkedDependencies(
  {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
  },
  {
    projectRoot: \_\_\_dirname,
    blacklistLinkedModules: ["react-native"],
    // 新增这个
    resolveNodeModulesAtRoot: true,
  }
);
```

终于可以在 React Native 项目中调试本地依赖了～

### 最后
以上是我寻找在 React Native 项目中使用 yarn link 的解决办法的全过程。

### 参考

[metro-symlinked-deps](https://github.com/Carimus/metro-symlinked-deps)

[get-dev-paths](https://github.com/aleclarson/get-dev-paths)

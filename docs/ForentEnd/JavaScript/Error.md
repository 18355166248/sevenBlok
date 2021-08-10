# 前端错误监控

### 1. window.onerror

当发生 JavaScript 运行时错误(包括处理程序中引发的语法错误和异常)时，会触发 window.onerror 的回调。
但是 window.onerror 捕获不到资源加载错误

### 2. window.addEventListener('error')

使用 window.addEventListener('error')捕获资源错误，但是 window.addEventListener('error')也可以捕获到 js 运行错误，可以通过 target?.src || target?.href 区分是资源加载错误还是 js 运行时错误。

既然 window.addEventListener('error')也可以捕获到错误，那么我们为什么要用 window.onerror 呢？
因为 window.onerror 的事件对象数据更加多，更加清晰。

### 3. window.addEventListener('unhandledrejection')

捕获 promise 未 catch 的错误

## 问:

### 1. 为何不用 try catch

能被 try catch 捕捉到的异常, 必须是在报错的时候, 线程执行已经 try catch 代码块, 且处于 try catch 里面, 这个时候才能被捕捉到
如果在之前, 或者之后, 都无法捕捉异常

## 代码块 ( copy 的 还没具体看 )

### 对错误进行格式化处理 formatError

```js
let formatError = (errObj) => {
  let col = errObj.column || errObj.columnNumber; // Safari Firefox 浏览器中才有的信息
  let row = errObj.line || errObj.lineNumber; // Safari Firefox   浏览器中才有的信息
  let message = errObj.message;
  let name = errObj.name;

  let { stack } = errObj;
  if (stack) {
    let matchUrl = stack.match(/https?:\/\/[^\n]+/); // 匹配从http?s 开始到出现换行符的信息, 这个不仅包括报错的文件信息而且还包括了报错的行列信息
    let urlFirstStack = matchUrl ? matchUrl[0] : "";
    // 获取到报错的文件
    let regUrlCheck = /https?:\/\/(\S)*\.js/;

    let resourceUrl = "";
    if (regUrlCheck.test(urlFirstStack)) {
      resourceUrl = urlFirstStack.match(regUrlCheck)[0];
    }

    let stackCol = null; // 获取statck中的列信息
    let stackRow = null; // 获取statck中的行信息
    let posStack = urlFirstStack.match(/:(\d+):(\d+)/); // // :行:列
    if (posStack && posStack.length >= 3) {
      [, stackCol, stackRow] = posStack;
    }

    // TODO formatStack
    return {
      content: stack,
      col: Number(col || stackCol),
      row: Number(row || stackRow),
      message,
      name,
      resourceUrl,
    };
  }

  return {
    row,
    col,
    message,
    name,
  };
};
```

### 对 webpack 打包的项目单独处理一次

```js
let frameError = async (errObj) => {
  const result = await $.get(
    `http://localhost:3000/sourcemap?col=${errObj.col}&row=${errObj.row}`
  );
  return result;
};
```

### window.onerror

```js
let _originOnerror = window.onerror;
window.onerror = async (...arg) => {
  let [errorMessage, scriptURI, lineNumber, columnNumber, errorObj] = arg;
  let errorInfo = formatError(errorObj);
  // 如果是使用webpack打包的框架代码报错，在处理一次，这里暂时使用resourceUrl字段进行区分是否是框架代码报错
  if (
    errorInfo.resourceUrl ===
    "http://localhost:3000/react-app/dist/main.bundle.js"
  ) {
    let frameResult = await frameError(errorInfo);

    errorInfo.col = frameResult.column;
    errorInfo.row = frameResult.line;
    errorInfo.name = frameResult.name;
    errorInfo.source = frameResult.source;
    errorInfo.sourcesContentMap = frameResult.sourcesContentMap;
  }

  errorInfo._errorMessage = errorMessage;
  errorInfo._scriptURI = scriptURI;
  errorInfo._lineNumber = lineNumber;
  errorInfo._columnNumber = columnNumber;
  errorInfo.type = "onerror";
  cb(errorInfo);
  _originOnerror && _originOnerror.apply(window, arg);
};
```

### window.onunhandledrejection

```js
let _originOnunhandledrejection = window.onunhandledrejection;
window.onunhandledrejection = (...arg) => {
  let e = arg[0];
  let reason = e.reason;
  cb({
    type: e.type || "unhandledrejection",
    reason,
  });
  _originOnunhandledrejection && _originOnunhandledrejection.apply(window, arg);
};
```

### window.addEventListener('error')

```js
window.addEventListener(
  "error",
  (event) => {
    // 过滤js error
    let target = event.target || event.srcElement;
    let isElementTarget =
      target instanceof HTMLScriptElement ||
      target instanceof HTMLLinkElement ||
      target instanceof HTMLImageElement;
    if (!isElementTarget) return false;
    // 上报资源地址
    let url = target.src || target.href;
    cb({
      url,
    });
  },
  true
);
```

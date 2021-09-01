# Ts 声明文件

> 语法索引

- [declare var](https://ts.xcatliu.com/basics/declaration-files.html#declare-var) 声明全局变量
- [declare function](https://ts.xcatliu.com/basics/declaration-files.html#declare-function) 声明全局方法
- [declare class](https://ts.xcatliu.com/basics/declaration-files.html#declare-class) 声明全局类
- [declare enum](https://ts.xcatliu.com/basics/declaration-files.html#declare-enum) 声明全局枚举类型
- [declare namespace](https://ts.xcatliu.com/basics/declaration-files.html#declare-namespace) 声明（含有子属性的）全局对象
- [interface 和 type](https://ts.xcatliu.com/basics/declaration-files.html#interface-和-type) 声明全局类型
- [export](https://ts.xcatliu.com/basics/declaration-files.html#export) 导出变量
- [export namespace](https://ts.xcatliu.com/basics/declaration-files.html#export-namespace) 导出（含有子属性的）对象
- [export default](https://ts.xcatliu.com/basics/declaration-files.html#export-default) ES6 默认导出
- [export =](https://ts.xcatliu.com/basics/declaration-files.html#export-1) commonjs 导出模块
- [export as namespace](https://ts.xcatliu.com/basics/declaration-files.html#export-as-namespace) UMD 库声明全局变量
- [declare global](https://ts.xcatliu.com/basics/declaration-files.html#declare-global) 扩展全局变量
- [declare module](https://ts.xcatliu.com/basics/declaration-files.html#declare-module) 扩展模块
- [/// ](https://ts.xcatliu.com/basics/declaration-files.html#san-xie-xian-zhi-ling) 三斜线指令

## 声明语句

假如我们要使用 Jquery, 在 Ts 中我们并不知道 $ 和 jQuery 是什么

这时我们使用 declare var 来定义他的类型

```js
declare var jQuery: (selector: string) => any;
```

## 声明文件

通常我们会把声明语句放到一个单独的文件（`jQuery.d.ts`）中，这就是声明文件

#### 第三方声明文件

推荐的是使用 `@types` 统一管理第三方库的声明文件

可以在 [这里](https://www.typescriptlang.org/dt/search?search=) 搜索你需要的声明文件

以 jQuery 为例

```shell
npm install @types/jquery --save-dev
```

## 书写声明文件

### 全局变量

主要用以下几个语法:

- declare var | let | const 声明全局变量
- declare function 声明全局方法
- declare class 声明全局类
- declare enum 声明全局枚举类型
- declare namespace 声明 ( 含有子属性的 ) 全局对象 (就是 es6 之前的 module, 后面跟 es6 的模块化化命名冲突, 就改名叫 namespace 了)
- interface 和 type 声明全局类型

#### 声明合并

```ts
// src/jQuery.d.ts

declare function jQuery(selector: string): any;
declare namespace jQuery {
  function ajax(url: string, settings?: any): void;
}
// src/index.ts

jQuery("#foo");
jQuery.ajax("/api/get_something");
```

### npm 包

npm 包的声明文件主要有以下几种语法：

- [`export`](https://ts.xcatliu.com/basics/declaration-files.html#export) 导出变量 ( 只有 import 才能使用, 所以不同于 declare 的全局变量, 这个是局部变量 )
- [`export namespace`](https://ts.xcatliu.com/basics/declaration-files.html#export-namespace) 导出（含有子属性的）对象
- [`export default`](https://ts.xcatliu.com/basics/declaration-files.html#export-default) ES6 默认导出
- [`export =`](https://ts.xcatliu.com/basics/declaration-files.html#export-1) commonjs 导出模块

## 发布声明文件

此时有两种方案：

1. 将声明文件和源码放在一起
2. 将声明文件发布到 `@types` 下

3. 比如 `package.json` 是这样时：

```json
{
  "name": "foo",
  "version": "1.0.0",
  "main": "lib/index.js"
}
```

就会先识别 `package.json` 中是否存在 `types` 或 `typings` 字段。发现不存在，那么就会寻找是否存在 `index.d.ts` 文件。如果还是不存在，那么就会寻找是否存在 `lib/index.d.ts` 文件。假如说连 `lib/index.d.ts` 都不存在的话，就会被认为是一个没有提供类型声明文件的库了。

2. 与普通的 npm 模块不同，`@types` 是统一由 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/) 管理的。要将声明文件发布到 `@types` 下，就需要给 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/) 创建一个 pull-request，其中包含了类型声明文件，测试代码，以及 `tsconfig.json` 等。

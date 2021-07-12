# 原始数据类型

原始数据类型包括：布尔值、数值、字符串、`null`、`undefined` 以及 ES6 中的新类型 [`Symbol`](http://es6.ruanyifeng.com/#docs/symbol) 和 ES10 中的新类型 [`BigInt`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)。

## 布尔值

```typescript
const name: boolean = false;
```

## 数值

```typescript
let num: number = 1;
let num1: number = NaN;
let num2: number = Infinity;
// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010; // 会被编译成十进制
// ES6 中的八进制表示法
let octalLiteral: number = 0o744; // 会被编译成十进制
```

## 字符串

```typescript
let name: string = "Week";
let template: string = `My name is ${name}`; //
```

## 空值 (void)

JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 `void` 表示没有任何返回值的函数：

```ts
function alertName(): void {
  alert("My name is Tom");
}
```

## Null 和 Undefined

null 和 undefined 是所有数据类型的子类型, 所以 undefined 类型的变量可以赋值给 number 类型的变量

而 void 类型的变量不能赋值给 number 类型的变量

```typescript
let num: number = undefined;
let u: void;
let num1: number = u; // Type 'void' is not assignable to type 'number'.
```

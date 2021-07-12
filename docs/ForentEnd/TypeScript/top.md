# TS 进阶学习

## 类型别名

```ts
type NN = string;
type FN = (p: string) => string;
type NNOrFN = NN | FN; // 这里用到了类型别名
function getName(params: NNOrFN): NN {
  if (typeof params === "string") {
    return params;
  } else {
    return params("1");
  }
}
```

## 字符串字面量类型

```ts
type EventNames = "click" | "scroll" | "mousemove";
function handleEvent(ele: Element, event: EventNames) {
  // do something
}

handleEvent(document.getElementById("hello"), "scroll"); // 没问题
handleEvent(document.getElementById("world"), "dblclick"); // 报错，event 不能为 'dblclick'

// index.ts(7,47): error TS2345: Argument of type '"dblclick"' is not assignable to parameter of type 'EventNames'.
```

## 元祖

越界的元素

当添加越界的元素的时候, 它的类型将被限制为元祖中每个类型的联合类型

```ts
const arr: [string, number] = ["1", 1];
arr.push(2);
arr.push(boolean);
```

## 声明合并

### 函数的合并

```ts
function reverse(param: string) => string
function reverse(param: number) => number
function reverse(param: string | number): string | number | void {
  if (typeof param === 'string') {
    return param.split('').reverse().join('')
  } else if (param === 'number') {
    return Number(param.toString().split('').reverse().join(''))
  }
}
```

### 接口的合并

```ts
interface Alarm {
  open(): string;
}
interface Alarm {
  price: number;
  open(title: string): number;
}

// 相当于
interface Ararm {
  open(): string;
  open(title: string): number;
  price: number;
}

// 注意: 合并的属性的类型必须是唯一的
```

## 类的合并

类的合并规则和接口的合并规则一样

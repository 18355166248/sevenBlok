# TypeScript 面试

[[toc]]

## 类型体操地址

- [type-challenges](https://github.com/type-challenges/type-challenges)
- [liaoyio challenges](https://liaoyio.github.io/notes/web/ts/challenges)

## type 和 interface 的差别

type: 类型别名 interface: 接口

1. 定义类型范围
   interface 只能定义对象类型
   type 可以声明任何类型;
2. 都支持拓展, 但是写法不一样
   interface 使用 extends, type 使用符号 &

```ts
interface Name {
  age: number
}

type Sex {
  gender: string
}
// interface 继承interface
interface Person extends Name {
  name: string
}
// interface继承type
interface Person extends Sex {
  name: string
}
// type继承interface
type PP = Name & { name: string }
// type继承type
type Phone { mo: number }

type People = Sex & { name: string }
```

3. interface 可以声明合并

```ts
interface User {
  name: string
}
interface User {
  age: number
}

/**
 * User接口为 {
 * name: string
 * age: number
 * }
 * /
```

### 总结

能用 interface 优先使用 interface, 如果不能就用 type;

## infer

:::details 点开

infer 的作用一言蔽之：推导泛型参数

```TypeScript
type numberPromise = Promise<number>;
type n = numberPromise extends Promise<infer P> ? P : never; // number
```

在 `Promise` 输入了 `number` 获得一个新的类型，那么 infer 就可以通过已知的类型和获得它泛型反推出泛型参数

还有注意一点，infer 只能在 extends 的右边使用，infer P 的 P 也只能在条件类型为 True 的一边使用，下文会讲解这个限制的意义。

```TypeScript
type getIntersection<T> = T extends (a: infer P,b: infer P) => void ? P : never;
type Intersection = getIntersection<(a: string, b: number)=> void> // string & number
```

因为`(a: string, b: number)=> void extends (a: infer P,b: infer P) => void，所以(a: string, b: number)=> void`是 `(a: infer P,b: infer P) => void` 子类型，所以 P 到 string 或者 number 是逆变，然而我们这里是反过来推 P，所以 string 或 number 到 P 是协变，最终就推出 `string & numner`

- 协变：类型推导到其子类型的过程，A | B -> A & B 就是一个协变
- 逆变：类型推导到其超类型的过程

:::

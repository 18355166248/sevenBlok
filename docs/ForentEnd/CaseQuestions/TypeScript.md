# TypeScript面试

## type和interface的差别

type: 类型别名  interface: 接口

1. 定义类型范围
interface只能定义对象类型
type可以声明任何类型;
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

3. interface可以声明合并

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

能用interface优先使用interface, 如果不能就用type;

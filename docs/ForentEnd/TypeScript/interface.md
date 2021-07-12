# 接口

在 ts 中, 我们使用 interfaces 来定义对象的类型

```typescript
interface Name {
  readonly name: string; // 只读属性
  age: number;
  sex?: 0 | 1; // 可选属性
  [param: string]: string; // 注意 这里写了值为string, 跟上面的age和sex的值是相斥的会报错, 解决方案如下
}

// 解决方案
type Name =
  | {
      readonly name: string;
      age: number;
      sex?: 0 | 1; // 可选属性
    }
  | {
      readonly name: string; // 只读属性
      age: never;
      sex: never; // 可选属性
      [param: string]: string; // 注意 这里写了值为string, 跟上面的age和sex的值是相斥的会报错, 解决方案如下
    };

const name: Name = {
  age: 1,
  sex: 1,
  name: "week",
};
```

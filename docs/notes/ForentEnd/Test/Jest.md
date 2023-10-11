## jest

## jest 测试代码片段

```js
describe("number test", () => {
  it("1 is true", () => {
    expect(1).toBeTruthy();
  });
  test("2 is true", () => {
    expect(2).toBeTruthy();
  });
});
```

- describe 描述, decribe 会形成一个作用域
- it 断言
- expect 期望
- test 测试，类似 it

## jest 怎么用

1. 新增配置
   可以直接在 package.json 增加 jest 属性，也可以添加默认 jest 的配置文件: jest.config.js，记住，这个配置文件需要 module.export 出一个对象
2. 关于 jest.config.js 的配置
   详细的官方配置请见文档：jestjs.io/docs/en/con…
   moduleFileExtensions 指定要测试的文件类型的后缀

```js
// jest.config.js
const { defaults } = require("jest-config");
module.exports = {
  // ...
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
  // ...
};
```

coverageThreshold 指定覆盖率目标

- branches 分支覆盖率
- functions 函数执行的覆盖率
- lines 代码函数覆盖率
- statements 声明的覆盖率

- stmts 是语句覆盖率（statement coverage）：是不是每个语句都执行了？
- Branch 分支覆盖率（branch coverage）：是不是每个 if 代码块都执行了？
- Funcs 函数覆盖率（function coverage）：是不是每个函数都调用了？
- Lines 行覆盖率（line coverage）：是不是每一行都执行了？

```json
{
  jest: {
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: -10,
      },
    },
  },
};
```

global 指的是全局，你也可以指定特定文件夹具有不同的覆盖率。通常，函数类及组件类，都可以指定 100%的覆盖率
coveragePathIgnorePatterns 过滤无需统计的代码范围
Default: ["/node_modules/"]

默认，代码中引入的 node_modules 的部分的代码是不计入覆盖率统计范围的，所以如果我们某些文件夹被测试了，但是不想被统计入覆盖率或者也不应该被统计入覆盖率的话，可以在这个数组添加你想要的文件夹
setupFilesAfterEnv jest 执行前的钩子函数
比如，因为 jest 是在 node 端跑的，所以有一些兼容的代码我们可以写在这里，比如，location.href 在 node 端是会出错的，可以在这个钩子函数中执行一些兼容
先在 jest.setup.js 中写入钩子函数所在的路径
module.exports = {
setupFilesAfterEnv: ['./jest.setup.js'],
}

接着，在对应位置新建一个 jest.setup.js 文件
jest.setTimeout(10000)

那么所有的测试文件都会执行这个语句
jest 使用技巧
toMatchSnapshot 代码快照
这个对于组件单元测试很有用，特别是重构的时候可以对比，重构前后是否对组件的元素结构有所改变
配合 enzyme 的示例代码如下：
import React from 'react
import { shallow } from 'enzyme'
import CustomButton from './customButton

describe('test', () => {
it('test render html', () => {
const wrapper = shallow(<CustomButton />)
expect(wrapper).toMathchSnapshot()
})
})

执行该测试用例后，会在测试文件的当前文件夹创建一个快照文件夹。
如果后面代码更改的时候，jest 测试是会报错的

如果是快照应该更新的时候，则可以执行

```
jest -u
```

这个命令会将新的快照更新到已有快照

## 常见问题

1. module is not defined

```js
ReferenceError: module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and '/Users/xmly/Study/code/swell-node-core/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
```

这个问题只需要将 package.json 里面的"type": "module" 删除即可

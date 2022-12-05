# 学习 antd 级联选择器

## 前言

看了 antd@4.X 的级联选择器源码之后, 发现它的功能经过多次迭代后还是比较复杂的, 我们先学习它的基本功能, 完成一个简易版级联选择器

## css 名

全局会有一个 ConfigContext, 默认设置全局的类名前缀, 我们只需要通过 useContext 获取对应的 prefixCls 变量, 动态拼接类名即可

```ts
const { getPrefixCls } = React.useContext(ConfigContext);
const prefixCls = getPrefixCls("cascade");
```

## props 定义

我们简单定义几个 props, 实现简单功能

### Props

| `prop`     |                     `说明`                      |                                                                                                `类型` |
| :--------- | :---------------------------------------------: | ----------------------------------------------------------------------------------------------------: |
| children   |                 用于自定义展示                  |                                                                                             ReactNode |
| options    |                  可选项数据源                   |                                                                                              Option[] |
| fieldNames | 自定义 options 中 label, value, children 的字段 |                                                         {label:label, value:value, children:children} |
| onChange   |                完成选择后的回调                 | (value: SingleValueType \| SingleValueType[], selectOptions: OptionType[] \| OptionType[][]) => void; |

### Option

```ts
interface Option {
  label: React.ReactNode;
  value?: string | number | null;
  children?: Option[];
}
```

### 外部依赖

| `名称`     |  `版本` |
| :--------- | ------: |
| react      |  18.2.0 |
| react-dom  |  18.2.0 |
| rc-select  | 14.1.13 |
| classNames |   2.3.2 |

### 状态管理

cascade 本身也需要一个状态管理用于维护全局的数据, 我们这里使用 Context, 将 options, fieldNames, onSelect 事件放置于全局状态管理中

```ts
const cascadeContext = React.useMemo(
  () => ({
    options: mergeOptions,
    fieldNames: mergeFieldNames,
    onSelect: onInternalSelect, // 触发 change 回调
  }),
  [mergeOptions]
);
```

### 入口渲染组件

```ts
import { BaseSelect } from "rc-select";

<CascadeContext.Provider value={cascadeContext}>
  <BaseSelect
    ref={ref as any}
    prefixCls={prefixCls}
    displayValues={[]}
    searchValue=""
    OptionList={OptionList} // 渲染下拉框的参数
    emptyOptions={false}
    id=""
    onDisplayValuesChange={onDisplayValuesChange}
    onSearch={onSearch}
    getRawInputElement={() => children}
  />
</CascadeContext.Provider>;
```

### 渲染下拉框

我们接下来主要看下 OptionList 这个参数里面做了什么处理, 也是比较核心的地方

OptionList 里面包含子组件 Column, 也就是每一列的数据

我们准备一个 mock 数据

```js
const addressOptions = [
  {
    label: "福建",
    value: "fj",
    children: [
      {
        label: "福州",
        value: "fuzhou",
        children: [
          {
            label: "马尾",
            value: "mawei",
          },
        ],
      },
      {
        label: "泉州",
        value: "quanzhou",
      },
    ],
  },
  {
    label: "浙江",
    value: "zj",
    children: [
      {
        label: "杭州",
        value: "hangzhou",
        children: [
          {
            label: "余杭",
            value: "yuhang",
          },
        ],
      },
    ],
  },
  {
    label: "北京",
    value: "bj",
    children: [
      {
        label: "朝阳区",
        value: "chaoyang",
      },
      {
        label: "海淀区",
        value: "haidian",
      },
    ],
  },
];
```

初始化只有第一列也就是第一层的数据

```ts
const optionColumns = React.useMemo(() => {
  const optionList = [{ options: mergeOptions }]; // mergeOptions 就是组件外层传递进来的 options 这里只取第一层 用户默认展示
  let currentList = mergeOptions;

  // activeValueCells 就是你每次点击用于记录点击路线的
  // 循环 activeValueCells 层层往下找到这条点击路线上的每个点击列表, 组合成一个一维数据列表
  for (let i = 0; i < activeValueCells.length; i++) {
    const activeValueCell = activeValueCells[i];
    const currentOption = currentList.find(
      (current) => current[fieldNames.value] === activeValueCell
    );
    const subOptions = currentOption?.[fieldNames.children];
    if (!subOptions?.length) {
      break;
    }

    currentList = subOptions;
    optionList.push({ options: subOptions });
  }

  return optionList;
}, [mergeOptions, fieldNames, activeValueCells]);
```

```js
// 最终数据如下
const optionColumns = [
  {
    options: [
      { label: "福建", value: "fj", children: Array(2) },
      { label: "浙江", value: "zj", children: Array(1) },
      { label: "北京", value: "bj", children: Array(2) },
    ],
  },
  {
    options: [
      { label: "福州", value: "fuzhou", children: Array(1) },
      { label: "泉州", value: "quanzhou" },
    ],
  },
  {
    options: [{ label: "马尾", value: "mawei" }],
  },
];
```

已经拿到一维数组列表了, 只用循环列表, 每列用 Column 组件进行渲染就能渲染出点击路线上每列的下一个列表了

### 点击

相对应的, 我们需要在 Column 上绑定点击事件, 用于记录点击路线

```ts
const columnNodes: React.ReactElement[] = optionColumns.map((col, index) => {
  const prevValuePath = activeValueCells.slice(0, index);
  const activeValue = activeValueCells[index];

  // 记录点击路线
  function onPathOpen(newValueCells: React.Key[]) {
    setActiveValueCells(newValueCells);
  }

  function onPathSelect(valuePath: SingleValueType, isLeaf: boolean) {
    onSelect(valuePath);

    if (isLeaf) {
      toggleOpen(false);
    }
  }

  return (
    <Column
      key={index}
      options={col.options}
      prevValuePath={prevValuePath} // 每个节点上级路径组成的列表
      activeValue={activeValue}
      onActive={onPathOpen} // 点击每个卡片都会触发该事件
      onSelect={onPathSelect} // 判断如果点击的是叶子节点(没有子节点了) 就触发该方法
      prefixCls={prefixCls}
    />
  );
});
```

### 结尾

文章比较简单, 具体实现细节可以查看 [jiang-design](https://github.com/18355166248/jiang-design/tree/main/src/components/Cascade)

线上访问: [地址](https://18355166248.github.io/jiang-design/components/common/cascade)

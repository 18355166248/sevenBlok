# 实现 Tree 组件的思路

## 组件功能

1. 节点可以无限延伸(递归)
2. 可以展开/收缩有子节点的节点
3. 可以选中某个节点, 选中父节点, 所有子节点都选中, 反之都不选中
4. 如果子节点全部选中, 那么父节点也要选中, 子节点只有有一个不选中, 父节点也要不选中

mock 数据:

```json
[
  {
    title: "parent 1",
    children: [
      {
        title: "parent 1-1",
        children: [
          {
            title: "leaf 1-1-1"
          },
          {
            title: "leaf 1-1-2"
          }
        ]
      },
      {
        title: "parent 1-2",
        children: [
          {
            title: "leaf 1-2-1"
          },
          {
            title: "leaf 1-2-1"
          }
        ]
      }
    ]
  }
];
```

每个节点的配置(props):

- title 标题
- children 子节点
- expand 是否展开
- checked 是否选中

再提供两个 events:

- on-toggle-expand 有节点触发展开收缩 参数: 当前节点的 Node 对象, 当前节点的数据，
- on-check-change 有节点复选框被点击的时候触发 参数: 当前节点的 Node 对象, 当前节点的数据，

## 组件功能实现

1. 入口 jTree

功能:

- 讲传入的数据深拷贝, 不影响原始数据
- 声明方法, 用于触发调用组件传入的监听方法, 也就是 on-toggle-expand 和 on-check-change
- 将数据循环遍历传入递归组件 jTreeNode

2. 递归组件 jTreeNode

功能:

- 渲染每一行的节点样式, 包含展开收缩按钮, 复选框(checkbox)按钮, 标题(title)名称
- 点击展开收缩按钮, 控制节点 expand 的值, false 的时候隐藏所有子节点, true 的时候显示所有子节点, 并通过 findComponentUpward 方法找到 jTree 实例触发特定方法用于触发调用组件传入的监听方法
- 点击 checkbox, 控制节点 checked 的值, 如果有子节点, 递归所有子节点设置为当前 checked 的值
- 监听当前节点的子节点, 如果节点存在, 判断所有节点是否存在 checked 不选中, 如果有, 当前节点 checked 就为 false, 如果所有子节点都选中, 当前节点就为 true 测试9999999100000


## 具体代码实现Demo

[gitHub地址](https://github.com/18355166248/vue-component-lecture-Demo/blob/master/src/views/componentList/TreeDemo.vue)
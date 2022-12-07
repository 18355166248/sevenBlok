# 学习 antd 弹窗

## 前言

看了 antd@4.X 的弹窗源码之后, 发现它的功能经过多次迭代后还是比较复杂的, 我们先学习它的基本功能, 完成一个简易版弹窗

## css 名

全局会有一个 ConfigContext, 默认设置全局的类名前缀, 我们只需要通过 useContext 获取对应的 prefixCls 变量, 动态拼接类名即可

```ts
const { getPrefixCls } = React.useContext(ConfigContext);
const prefixCls = getPrefixCls("cascade");
```

## 设计&实现

我们简单定义几个 props, 实现简单功能

### Props

| `prop`         |                             `说明`                              |        `类型` |
| :------------- | :-------------------------------------------------------------: | ------------: |
| children       |                            弹窗内容                             |     ReactNode |
| open           |                            显示/隐藏                            |       boolean |
| getContainer   | 指定 Modal 挂载的节点，但依旧为全局展示，false 为挂载在当前位置 | document.body |
| title          |                            弹窗标题                             |        string |
| footer         |    底部内容，当不需要默认底部按钮时，可以设为 footer={null}     |     ReactNode |
| destroyOnClose |                   关闭时销毁 Modal 里的子元素                   |         false |

### 外部依赖

| `名称`     | `版本` |
| :--------- | -----: |
| react      | 18.2.0 |
| react-dom  | 18.2.0 |
| classNames |  2.3.2 |

### 组件

Modal 组件我们组要将其分为两个部分, 一个是 Portal(传送门), 一个是 Dialog;
Portal 主要负责的功能是状态管理和弹窗节点渲染逻辑的控制, 包裹渲染到指定 Dom 的功能
Dialog 主要负责的功能是弹窗的样式处理, 包含蒙层, 类名初始化, 标题, 尾部, 内容区域的渲染

#### Portal

是否使用 react 的传送门 createPortal 方法, 取决于用户是否期望指定 Modal 挂载的节点, 也就是 getContainer 参数支付赋值并符合规则

在这里面重点需要注意的是我们使用了自定义 hook, useDom

useDom 主要是处理节点渲染和销毁的功能, 内部还实现了一个队列的概念, 具体是做啥的我还没仔细研究

### 结尾

文章比较简单, 具体实现细节可以查看 [jiang-design](https://github.com/18355166248/jiang-design/tree/main/src/components/Modal)

线上访问: [地址](https://18355166248.github.io/jiang-design/components/common/modal)

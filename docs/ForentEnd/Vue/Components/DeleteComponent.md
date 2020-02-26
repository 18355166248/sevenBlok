# 删除组件

## 方法

### 动态添加到 Dom 中的组件

1. 找到 Dom 的父集, 然后使用 removeChild 删除这个组件的 Dom
2. 组件如果存在实例, 需要使用 removeChild 删除这个实例下面的\$el 的 Dom 元素
3. 使用实例的\$destroy 方法销毁组件
4. 将实例重置为 null

```js
destroyCode () {
  const $target = document.getElementById(this.id);
  if ($target) $target.parentNode.removeChild($target);

  if (this.component) {
    this.$refs.display.removeChild(this.component.$el);
    this.component.$destroy();
    this.component = null;
  }
}
```

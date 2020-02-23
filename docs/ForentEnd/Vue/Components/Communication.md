# 组件的通讯

通过 Mixins 注入到需要通讯的组件, 并$on注册监听函数, 最后通过dispatch向上查找和broadcast向下查找的方法 $emit 去出发监听函数, 达到组件通讯的目的

## 向上查找通讯 dispatch && 向下查找通讯 broadcast

```js
const commonMixins = {
  methods: {
    // 向下查找
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    },
    // 向上查找
    dispatch(componentNames, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.name;

      while (parent && (!name || name !== componentNames)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.name;
        }
      }

      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    }
  }
};

function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.name;

    if (componentName === name) {
      child.$emit.call(child, eventName, params);
    } else {
      broadcast.call(child, componentName, eventName, params);
    }
  });
}

export default commonMixins;
```

## 使用方法

- 首先在需要通讯的父子组件传入Mixins方法, 这样组件内部就具备了dispatch, broadcast的方法
- 在一个组件内部$on绑定监听函数 this.$on(监听方法名, 回调函数)
- 在另外一个想要触发监听函数的组件内部, 调用this.dispatch或者this.broadcase
  this.dispatch(需要通讯的组件名, 监听方法名, 参数)
  this.broadcast(需要通讯的组件名, 监听方法名, 参数)
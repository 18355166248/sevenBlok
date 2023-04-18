# Vue 面试题

## vue-cli 脚手架做了啥

他里面有一个操作 叫 check version 你知道咋实现的么
用 update-check 库 传入 package.json 对比线上仓库 判断是否需要更新

## Vue Router 路由实现

#### hashHistory

两个方法：HashHistory.push() 和 HashHistory.replace()
通过 onHashChange 监听变化

#### HTML5hisTory

::: details 点击查看
back(), forward(), go()等方法，我们可以读取浏览器历史记录栈的信息
pushState(), replaceState() 这下不仅是读取了，还可以对浏览器历史记录栈进行修改
在 HTML5History 的构造函数中监听 popState（window.onpopstate）

需要注意的是，存储当前路由的变量 this.app.current 非一般的变量，而是借用 Vue 的响应式定义的，所以当路由变化时只需要给这个 this.app.current 赋值，而 router-view 组件刚好引用到这个值，当其改变时所有的引用到的地方都会改变，则得到的要展示的组件也就响应式的变化了。

history 路由模式的实现主要基于存在下面几个特性：

pushState 和 repalceState 两个 API 来操作实现 URL 的变化 ；
我们可以使用 popstate 事件来监听 url 的变化，从而对页面进行跳转（渲染）；
history.pushState() 或 history.replaceState() 不会触发 popstate 事件，这时我们需要手动触发页面跳转（渲染）。 路由记录的数据是响应式的, 数据的变化会触发重新渲染
:::

## Vue 的父组件和子组件生命周期钩子函数执行顺序？

::: details 点击查看
Vue 的父组件和子组件生命周期钩子函数执行顺序可以归类为以下 4 部分：

- 加载渲染过程
  父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

* 子组件更新过程
  父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

- 父组件更新过程
  父 beforeUpdate -> 父 updated

* 销毁过程
  父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed
  :::

## 在哪个生命周期内调用异步请求？

可以在钩子函数 created、beforeMount、mounted 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。但是本人推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

能更快获取到服务端数据，减少页面  loading 时间；
ssr  不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性；

## 父组件可以监听到子组件的生命周期吗？

::: details 点击查看
比如有父组件 Parent 和子组件 Child，如果父组件监听到子组件挂载 mounted 就做一些逻辑处理，可以通过以下写法实现：

```js
// Parent.vue
<Child @mounted="doSomething"/>

// Child.vue
mounted() {
  this.$emit("mounted");
}
```

以上需要手动通过 \$emit 触发父组件的事件，更简单的方式可以在父组件引用子组件时通过 @hook 来监听即可，如下所示：

```js
//  Parent.vue
<Child @hook:mounted="doSomething" ></Child>

doSomething() {
   console.log('父组件监听到 mounted 钩子函数 ...');
},

//  Child.vue
mounted(){
   console.log('子组件触发 mounted 钩子函数 ...');
},
```

// 以上输出顺序为：
// 子组件触发 mounted 钩子函数 ...
// 父组件监听到 mounted 钩子函数 ...
:::

## 谈谈你对 keep-alive 的了解？

keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，避免重新渲染 ，其有以下特性：

一般结合路由和动态组件一起使用，用于缓存组件；
提供 include 和 exclude 属性，两者都支持字符串或正则表达式， include 表示只有名称匹配的组件会被缓存，exclude 表示任何名称匹配的组件都不会被缓存 ，其中 exclude 的优先级比 include 高；
对应两个钩子函数 activated 和 deactivated ，当组件被激活时，触发钩子函数 activated，当组件被移除时，触发钩子函数 deactivated。

## Vue 是如何实现数据双向绑定的？

::: details 点击查看

1. 实现一个监听器 Observer : 对数据对象进行遍历, 包括子属性对象的属性, 利用 Object.defineProperty() 对象属性都加上 getter 和 setter. 这样的话, 给这个对象的某个赋值, 就会被 setter 监听到

2. 实现一个解析器 Compile : 解析 Vue 的模板指令, 将模板中的变量都替换成数据, 然后初始化渲染页面视图, 并将每个指令对应的节点绑定更新函数, 添加监听数据的订阅者 Watcher, 一旦数据有变动, 收到通知, 调用更新函数进行数据更新

3. 实现一个订阅者 Watcher : Watcher 订阅者是 Observer 和 Compile 之间通讯的桥梁, 主要的任务就是订阅 Observer 中数据值变化的消息, 当收到属性值变化的消息, 就会通知 Compile 对应的更新函数

4. 实现一个订阅器 Dep: 订阅器采用订阅发布模式, 用来手机订阅者 Watcher, 对监听器 Observer 和 订阅者 Watcher 统一管理

![](~@public/Casequestion/vueDataStream.png)

:::

## Vue 框架怎么实现对象和数组的监听？

::: details 点击查看

```js
  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])  // observe 功能为监测数据的变化
    }
  }

  /**
   * 对属性进行递归遍历
   */
  let childOb = !shallow && observe(val) // observe 功能为监测数据的变化
```

通过以上 Vue 源码部分查看，我们就能知道 Vue 框架是通过遍历数组 和递归遍历对象，从而达到利用 Object.defineProperty() 也能对对象和数组（部分方法的操作）进行监听。
:::

## Proxy 与 Object.defineProperty 优劣对比

::: details 点击查看

- Proxy 的优势如下:

  Proxy 可以直接监听对象而非属性；
  Proxy 可以直接监听数组的变化；
  Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
  Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；
  Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

- Object.defineProperty 的优势如下:

  兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题,而且无法用 polyfill 磨平，因此 Vue 的作者才声明需要等到下个大版本( 3.0 )才能用 Proxy 重写。

:::

## Vue 怎么用 vm.\$set() 解决对象新增属性不能响应的问题 ？

我们阅读以上源码可知，vm.\$set 的实现原理是：

如果目标是数组，直接使用数组的 splice 方法触发相应式；

如果目标是对象，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用 defineReactive 方法进行响应式处理（ defineReactive 方法就是 Vue 在初始化对象时，给对象属性采用 Object.defineProperty 动态添加 getter 和 setter 的功能所调用的方法）

## 虚拟 DOM 实现原理

1. 用 Javascript 对象模拟真实的 Dom 树结构, 对真实 Dom 树进行抽象
2. diff 算法: 对新旧的模拟 Dom 进行对比, 找出差异
3. patch 算法: 将两个新旧 Dom 树的差异应用到真实的 Dom 树上

## vue 中有什么作用

vue 中有一些节点是重复节点, 也就是通过 v-for 指令循环生成的, key 是循环生成的 vnode 的唯一标记, 可以让我们的 diff 操作更快, 更便捷

更准确: 因为带了 key 就不会就地复用不做更新了, 在比较过程中, 如果 a 节点的 key === b 空节点的 key, 这种对比就可以避免就地复用的情况, 会更加准确的进行更新

更快: 利用 key 的唯一性生成 map 对象来获取对应节点, 比遍历方式更快

## 你有对 Vue 项目进行哪些优化？

::: details 点击查看
（1）代码层面的优化

v-if 和 v-show 区分使用场景
computed 和 watch 区分使用场景
v-for 遍历必须为 item 添加 key，且避免同时使用 v-if
长列表性能优化
事件的销毁
图片资源懒加载
路由懒加载
第三方插件的按需引入
优化无限列表性能
服务端渲染 SSR or 预渲染

（2）Webpack 层面的优化

Webpack 对图片进行压缩
减少 ES6 转为 ES5 的冗余代码
提取公共代码
模板预编译
提取组件的 CSS
优化 SourceMap
构建结果输出分析
Vue 项目的编译优化

（3）基础的 Web 技术的优化

开启 gzip 压缩
浏览器缓存
CDN 的使用
使用 Chrome Performance 查找性能瓶颈
:::

## vue 双向数据绑定实现，用 Object.defineProperty()实现的缺点，有什么场景是不能用它实现的。那么其他场景如何实现。不用 Object.defineProperty()如何实现？

::: details 点击查看

1. object.defineproperty 无法监控到数组下标的变化，导致通过数组下标添加元素，无法实时响应
2. object.defineProperty 只能劫持对象的属性，从而需要对每个对象，每个属性进行遍历，如果，属性值是对象，还需要深度遍历。Proxy 可以劫持整个对象，并返回一个新的对象
3. proxy 不仅可以代理对象，还可以代理数组，还可以代理动态增加的属性
   :::

## Vuex 中为什么分为 mutations 和 actions 来执行同步和异步

::: details 点击查看
[作者解释](https://www.zhihu.com/question/48759748/answer/112823337)

事实上在 vuex 里面 actions 只是一个架构性的概念，并不是必须的，说到底只是一个函数，你在里面想干嘛都可以，只要最后触发 mutation 就行。异步竞态怎么处理那是用户自己的事情。vuex 真正限制你的只有 mutation 必须是同步的这一点（在 redux 里面就好像 reducer 必须同步返回下一个状态一样）。同步的意义在于这样每一个 mutation 执行完成后都可以对应到一个新的状态（和 reducer 一样），这样 devtools 就可以打个 snapshot 存下来，然后就可以随便 time-travel 了。

其实就是做了代码隔离
不非受控的代码集中到 action
mutation 只做纯函数的状态改变
mvvm 一般强调的就是直接面对 view 的那层不要做复杂的逻辑
:::

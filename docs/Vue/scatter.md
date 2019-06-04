# 总

## 1. 实现最简易的 vuex

```js
// 封装
import Vue from 'vue'
const Store = function (options = {}) {
  const {state = {}, mutations = {}} = options
  this._vm = new Vue({
    data: {
      $$state: state
    }
  })
  this._mutations = mutations
}

Store.prototype.commit = function (type, payload) {
  if (this._mutations[type]) {
    this._mutations[type](this.state, payload)
  }
}

Object.defineProperties(Store.prototype, {
  state: {
    get () {
      return this._vm._data.$$state
    }
  }
})

export default { Store }


// main.js，使用
// 首先导入我们封装的vuex
import Vuex from './min-store/index'

// 简易挂载
Vue.prototype.$store = new Vuex.Store({
  state: {
    count: 1
  },
  getters: {
    getterCount: state => state.count
  },
  mutations: {
    updateCount (state) {
      state.count ++
    }
  }
})

// 页面使用
computed: {
    count () {
      return this.$store.state.count
    }
  },
  methods: {
    addCount () {
      this.$store.commit('updateCount')
    }
},

```

## 2. vue 中的页面刷新

> vue 应用的刷新我们不能采取 reload 的方式. 所以需要另辟蹊径

#### 1. 方案一: 当路由 query 部分发生变化的时候, 配合 router-view 的 key 属性, 路由是会重新刷新的

```js
<router-view :key="$router.path">

this.$router.replace({
  path: this.$route.fullPath,
  query: {
    timestamp: Date.now()
  }
})
```

::: warning
这种方法的弊端就是 url 无缘无故多了一个参数, 不是很好看
:::

#### 2. 方案二: 新建一个 redirect 空页面, 刷新就从当前页面跳转到 redirect 页面，然后在 redirect 页面理解 replace 跳转回来。

```js
// redirect页面
<script>
export default {
  name: 'redirect',
  // 在路由进入redirect前立即返回原页面，从而达到刷新原页面的一个效果
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$router.replace({
        path: to.params.redirect
      })
    })
  },
  // 渲染一个空内容
  render(h) {
    return h()
  }
}
</script>

// 跳转方法，我们可以封装在utils公共函数中
// 在utils/index.js文件中：

import router from '../router'

/**
 * 刷新当前路由
 */
export const refreshCurrentRoute = () => {
  const { fullPath } = router.currentRoute
  router.replace({
    name: 'redirect',
    params: {
      redirect: fullPath
    }
  })
}

```

## 3. 提升编译速度

> 可以通过在本地环境使用同步加载组件，生产环境异步加载组件

```js
// 安装插件
cnpm i babel-plugin-dynamic-import-node --save-dev

// .bablerc文件的dev增加配置
"env": {
    // 新增插件配置
    "development": {
      "plugins": ["dynamic-import-node"]
    }
    // 其他的内容
    ……
}

// 然后路由文件的引入依旧可以使用之前的异步加载的方式
component: () => import('xxx/xxx')
// 通过注释可以使多个模块打包到一起
component: () => import(/* user */ 'xxx/xxx')

```

> 该方式修改本地环境和生产环境的文件加载方式，对代码的侵入性最小，在不需要的时候直接删去.bablerc 文件中的配置就好，而不需要修改文件代码 [github 传送门](https://github.com/airbnb/babel-plugin-dynamic-import-node)

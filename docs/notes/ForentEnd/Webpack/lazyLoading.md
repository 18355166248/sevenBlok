# 懒加载 ( 按需加载 )

#### - 项目架构

```json
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
+ |- print.js
|- /node_modules
```

#### - src/print.js

```js
console.log(
  'The print.js module has loaded! See the network tab in dev tools...'
)

export default () => {
  console.log('Button Clicked: Here\'s "some text"!')
}
```

#### - src/index.js

```js {14}
+ import _ from 'lodash';
+
+ function component() {
    var element = document.createElement('div');
+   var button = document.createElement('button');
+   var br = document.createElement('br');

+   button.innerHTML = 'Click me and look at the console!';
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.appendChild(br);
+   element.appendChild(button);

+   button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
+     var print = module.default;
+
+     print();
+   });

    return element;
  }

+ document.body.appendChild(component());
```

<Card theme="##fbedb7" color="#8c8466">
注意当调用 ES6 模块的 import() 方法（引入模块）时，必须指向模块的 .default 值，因为它才是 promise 被处理后返回的实际的 module 对象。
</Card>

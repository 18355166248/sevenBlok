# JavaScript

[[toc]]

### common.js 和 es6 中模块引入的区别？

::: details 点击查看实现代码
1、CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
2、CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
3、CommonJs 是单个值导出，ES6 Module 可以导出多个
4、CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层
5、CommonJs 的 this 是当前模块，ES6 Module 的 this 是 undefined
:::

### 首屏和白屏时间如何计算

::: details 点击查看实现代码

- 当页面的元素数小于 x 时, 则认为是白屏. 可以获取页面的 DOM 节点数, 判断 DOM 节点数小于某个阈值 X, 则认为是白屏
- 在判断初始化页面渲染出来的地方通过 Date.now() - performance.timing.navigationStart 去获取白屏时间
  :::

### Virtual Dom 的优势在哪里？

::: details 点击查看实现代码
其次是 VDOM 和真实 DOM 的区别和优化：

1. 虚拟 DOM 不会立马进行排版与重绘操作
2. 虚拟 DOM 进行频繁修改，然后一次性比较并修改真实 DOM 中需要改的部分，最后在真实 DOM 中进行排版与重绘，减少过多 DOM 节点排版与重绘损耗
3. 虚拟 DOM 有效降低大面积真实 DOM 的重绘与排版，因为最终与真实 DOM 比较差异，可以只渲染局部
   :::

### 面向对象

::: details 点击查看实现代码
封装：也就是把客观事物封装成抽象的类，并且类可以把自己的数据和方法只让可信的类或者对象操作，对不可信的进行信息隐藏。
继承：通过继承创建的新类称为“子类”或“派生类”。继承的过程，就是从一般到特殊的过程。
多态：对象的多功能，多方法，一个方法多种表现形式。
Javascript 是一种基于对象（object-based）的语言。但是，它又不是一种真正的面向对象编程（OOP）语言，因为它的语法中没有 class（类）—–es6 以前是这样的。所以 es5 只有使用函数模拟的面向对象。
:::

### 原型链

::: details 点击查看实现代码
构造函数有自己的原型
const Cat() = function() {}

Cat.prototype

原型的 constructor = Cat

实例的**proto**指向构造函数的原型
const cat = new Cat()
cat.**proto** = Cat.prototype

可以通过 Object.getPrototypeOf(cat) === Cat.prototype // true
:::

### undefined 和 null 的区别

::: details 点击查看实现代码
undefined 表示一个无的原始值(基础类型), 转为数值为 NaN, null 表示一个无的对象, 转为数值为 0
:::

### 代码错误监控

首先我们可以关注一下 Performance,下面就先讲一下其中的两个 API

##### performance timing

::: details 点击查看实现代码
具体可以查看 w3.org/TR/navigation-timing、Navigation Timing API。

在 chrome 浏览器控制台输入 Performance.timing，会得到记录了一个浏览器访问各阶段的时间的对象。

进行错误收集的时候，可以对比这些时间，看错误发生在什么阶段

- DNS 查询耗时 ：domainLookupEnd - domainLookupStart
- TCP 链接耗时 ：connectEnd - connectStart
- request 请求耗时 ：responseEnd - responseStart
- 解析 dom 树耗时 ： domComplete - domInteractive
- 白屏时间 ：responseStart - navigationStart
- domready 时间 ：domContentLoadedEventEnd - navigationStart
- onload 时间 ：loadEventEnd – navigationStart
  :::

##### 脚本错误信息收集

::: details 点击查看实现代码

- window.onerror

window.onerror 可以捕捉运行时错误，可以拿到出错的信息，堆栈，出错的文件、行号、列号

- promise 的错误处理

promise 除了使用 catch 方法来捕获错误, 还可以使用 window 的 unhandledrejection 时间来捕获异常
所以假如说你有用 catch 去捕获错误, 那么不会触发 unhandledrejection, 只有在不用 catch 去捕获错的情况下会触发 unhandledrejection

- try catch

无法捕捉到语法错误, 只能捕捉运行时错误
对回调 setTimeout promise 无能为力
:::

##### 上报错误的方式

::: details 点击查看实现代码

- 后端提供接口, ajax 提交
- 创建一个图片, url 参数带上错误信息

```js
function report(error) {
  var reportUrl = "http://xxxx/report";
  new Image().src = reportUrl + "error=" + error;
}
```

优点就是不需要解决跨域问题, 防止重复请求, 缺点就是上传大小有限制, 可携带数据有限
:::

### map, object 的区别

- map 的 key 值可以是任何类型, object 必须是字符串
- map 是按插入的顺序排序的, object 是无序的
- map 和 object 获取值的方式不同
- map, object 对数据的操作不一样 增删改查

### 箭头函数和普通函数的区别

::: details 点击查看实现代码

1. 箭头函数语法上比普通函数更加简洁(ES6 中每一种函数都可以使用形参赋默认值和剩余运算符)
2. 箭头函数没有自己的 THIS，它里面的 THIS 是继承函数所处上下文中的 THIS（使用 CALL/APPY 等任何方式都无法改变 THIS 的指向） 3.箭头函数中没有 ARGUMENTS(类数组)，智能基于。。。ARG 获取传递的参数集合（数组）
3. 箭头函数不能被 NEW 执行（因为：箭头函数没有 THIS 也没有 prototype）
   :::

### 跨域的解决方案 并且解决前后端分离项目跨域，配置多个域名

::: details 点击查看实现代码
体量大的情况跨域的解决方案, 不要让运维通过 nginx 改 通过 java 配置

项目前后端分离以后需要配置跨域，且需要允许浏览器多个域名跨域。我们知道 Access-Control-Allow-Origin 里面是只可以写一个域名的，但是我们可以通过配置一个可被允许的 origins 数组，然后判断前端请求中的 origin 是否在这个数组中来解决这个问题~
:::

### 简单数据类型和复杂数据类型的区别

简单数据类型存储在栈中
引用数据类型值存储在堆中, 地址存储在栈中

值类型之间传递的值
引用类型之间的传递, 传递的是地址

### web 除了 cookie 和 webStorage 还有啥存储

web SQL 和 indexedDB 两种存储方式

### Promise.all()实现原理

::: details 点击查看实现代码

- promise.all()的入参是一个数组，可以传基本类型，也可以传 promise 对象；
- 返回结果是一个 Promise 对象；
- 入参数组中每一个都返回成功，此函数才返回成功；
- 只要有一个执行失败，则返回失败；

```js {10}
// 封装Promise.all方法
// 判断是否为promise对象，或者使用 obj instanceof Promise方法判断
function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
}
Promise.all = function(values) {
  return new Promise((resolve, reject) => {
    let result = [];
    let counter = 0;
    function processData(key, value) {
      result[key] = value;
      // values中每个promise对象返回成功，计数器加1；
      // 直到全部promise都返回成功，与values长度一致，
      // 则认定都为成功，此时返回全部的promise回调结果；
      if (++counter === values.length) {
        resolve(result);
      }
    }
    // 遍历values,先判断是否当前项为promise对象；
    // 如果是，则执行回调函数；否，则直接返回该值；
    for (let i = 0; i < values.length; i++) {
      if (isPromise(values[i])) {
        values[i]
          .then((data) => {
            processData(i, data);
          })
          .catch((err) => {
            reject(err);
            return;
          }); // values[i]如果成功则返回回调数据，失败则reject
      } else {
        // 如果不是promise对象，则直接返回；
        processData(i, values[i]);
      }
    }
  });
};
```

:::

### decodeURIComponent 解析字符串带 % 报错 Uncaught URIError: URI malformed

::: details 点击查看实现代码
浏览器在对 % 执行 **decodeURI、decodeURIComponent、encodeURI、encodeURIComponent **的时候会报错。因为 % 在浏览器属于不安全字符

##### 解决方案

1. 首先要对 param 中的不安全字符进行转译，转译完毕再进行编码和解码 ps(对于浏览器默认编码了的，如 haorooms%E5%8D%9A%E5%AE%A2%E5%A5%BD%E8%AF%84%E7%8E%8790%，不能再进行字符替换了。)
   // 对查询关键字中的特殊字符进行编码

```js
function encodeSearchKey(key) {
  const encodeArr = [
    {
      code: "%",
      encode: "%25",
    },
    {
      code: "?",
      encode: "%3F",
    },
    {
      code: "#",
      encode: "%23",
    },
    {
      code: "&",
      encode: "%26",
    },
    {
      code: "=",
      encode: "%3D",
    },
  ];
  return key.replace(/[%?#&=]/g, ($, index, str) => {
    for (const k of encodeArr) {
      if (k.code === $) {
        return k.encode;
      }
    }
  });
}
```

2. 对于已经被浏览器编译了的，可以采用如下方式，避免报错

方法 1:

```js
function decodeURIComponentSafe(uri, mod) {
  var out = new String(),
    arr,
    i = 0,
    l,
    x;
  typeof mod === "undefined" ? (mod = 0) : 0;
  // 分割 不保存匹配的值 也就是说不pieing %d0 %d1
  arr = uri.split(/(%(?:d0|d1)%.{2})/);
  for (l = arr.length; i < l; i++) {
    try {
      x = decodeURIComponent(arr[i]);
    } catch (e) {
      // 捕获不以数字结尾的 %
      x = mod ? arr[i].replace(/%(?!\d+)/g, "%25") : arr[i];
    }
    out += x;
  }
  return out;
}
```

方法 2:

```js
function decodeURIComponentSafely(uri) {
  try {
    return decodeURIComponent(uri);
  } catch (e) {
    console.log("URI Component not decodable: " + uri);
    return uri;
  }
}
```

浏览器 url 参数中 不建议使用不安全字符!!!
:::

### 数组去重，数组里面有重复的函数对象

::: details 点击查看

```js
function filterRepeat(list) {
  const set = new Set();
  const res = new Set();
  for (let i = 0; i < list.length; i++) {
    if (!set.has(list[i])) {
      set.add(list[i]);
      res.add(list[i]);
    }
  }

  return Array.from(res);
}
```

:::

### class 实现继承如何使用 es5 实现

::: details 点击查看
方法 1:

```JavaScript
function inherit(Child, Parent) {
     // 继承原型上的属性
    Child.prototype = Object.create(Parent.prototype)
     // 修复 constructor
    Child.prototype.constructor = Child
    // 存储超类
    Child.super = Parent
    // 静态属性继承
    if (Object.setPrototypeOf) {
        // setPrototypeOf es6
        Object.setPrototypeOf(Child, Parent)
    } else if (Child.__proto__) {
        // __proto__ es6 引入，但是部分浏览器早已支持
        Child.__proto__ = Parent
    } else {
        // 兼容 IE10 等陈旧浏览器
        // 将 Parent 上的静态属性和方法拷贝一份到 Child 上，不会覆盖 Child 上的方法
        for (var k in Parent) {
            if (Parent.hasOwnProperty(k) && !(k in Child)) {
                Child[k] = Parent[k]
            }
        }
    }
}

```

方法 2:

```JavaScript
function createObject(P) {
  var f = function f() {};
  f.prototype = P;
  return new f();
}
function inherit(Child, Parent) {
  Child.prototype = createObject(Parent.prototype);
  Object.defineProperty(Child.prototype, "constructor", {
    configurable: true,
    enumerable: false,
    writable: true,
    value: Child,
  });
  // 下面这种是官方建议继承 但是也不建议使用 因为性能不好
  // Object.setPrototypeOf(Child.prototype, Parent.prototype);
}
function Person(name, age, height) {
  this.name = name;
  this.age = age;
  this.height = height;
}
Person.prototype.running = function () {
  console.log("running");
};
Person.prototype.eating = function () {
  console.log("eating");
};

function Student(name, age, height, sno, score) {
  Person.call(this, name, age, height);
  this.sno = sno;
  this.score = score;
}
inherit(Student, Person);
Student.prototype.call1 = function () {
  console.log(this.name);
};

var stu1 = new Student("yjx", 18, 1.88, 111, 100);
// var stu2 = new Student("wyt", 38, 1.88, 111, 100);
console.log(stu1.prototype);
console.log(stu1.running);
stu1.running();
stu1.eating();
stu1.call1();
```

:::

### 判断数组的多种方式

::: details 点击

1. instanceof 运算符 arr instanceof Array
2. constructor 构造函数 arr.constructor === Array
3. isArray
4. Object.property.toString.call(arr) [object Array]
5. Array.property.isPrototypeOf(arr)
6. Object.getPrototypeOf(arr) === Array.prototype
   :::

### 判断对象是否有某个 key

::: details 点击

1. in key in obj
2. hasOwnProperty obj.hasOwnProperty(key)
3. Reflect Reflect.has(obj, key)
4. propertyIsEnumerable object.propertyIsEnumerable(key)

### 数组扁平化方法，除了用递归还有什么方法

方法 1: 如果是数字嵌套数组

```js
function flatten(arr) {
  return arr.toString().split(',').map((item) => Number(item));
},
```

方法 2: while 判断子集是否存在数组 循环

```js
function flatten(arr) {
  while (arr.findIndex((item) => Array.isArray(item)) > 0) {
    arr = [].concat(...arr);
  }
  return arr;
}
```

方法 3: Array 上的 flat 方法

```js
function flatten(arr) {
  return arr.flat(Infinity);
}
```

方法 4: 转字符串 正则替换 [ ]

```js
function flatten(list) {
  let listStr = JSON.stringify(list).replace(/(\[|\])/g, "");
  listStr = "[" + listStr + "]";

  return JSON.parse(listStr);
}
```

方法 4: 使用堆栈 stack

```js
function flatten(list) {
  const stack = [...list];
  const res = [];

  while (stack.length) {
    // 从后往前
    const next = stack.pop();
    if (Array.isArray(next)) {
      stack.push(...next);
    } else {
      res.unshift(next);
    }
  }

  return res;
}
```

方法 5: 使用 Generator 与递归结合

```js
function* flatten(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield* flatten(item);
    } else {
      yield item;
    }
  }
}

console.log([...flatten(arr)]);
```

### 实现一下「模版字符串」功能

::: details 点击

```js
const html = "{a  }开始了{  b}! 2023{ a  }";
function getStr2(html, obj) {
  return html.replace(/\{(.+?)\}/g, (_, key) => obj[key.trim()]);
}
console.log(getStr2(html, { a: "江浪", b: "泽丽" }));
```

:::

### 手写实现一下 Promise.all (Promise 不用写)；

::: details 点击查看

```js
function PromiseAll(list) {
  return new Promise((resolve, reject) => {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      list[i]
        .then((r) => {
          res[i] = r;
          if (res.filter((v) => v).length === list.length) {
            resolve(res);
          }
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
}
```

:::

### 观察者模式和发布订阅模式的区别

::: details 点击
![](@public/Casequestion/subscrib-watch.png)

可以看出，发布订阅模式相比观察者模式多了个事件通道，事件通道作为调度中心，管理事件的订阅和发布工作，彻底隔绝了订阅者和发布者的依赖关系。即订阅者在订阅事件的时候，只关注事件本身，而不关心谁会发布这个事件；发布者在发布事件的时候，只关注事件本身，而不关心谁订阅了这个事件。

#### 代码实现

订阅发布模式

```js
class PubSub {
  constructor() {
    this.subscribers = [];
  }

  subscribe(topic, callback) {
    let callbacks = this.subscribers[topic];
    if (!callbacks) {
      this.subscribers[topic] = [callback];
    } else {
      callbacks.push(callback);
    }
  }

  publish(topic, ...args) {
    let callbacks = this.subscribers[topic] || [];
    callbacks.forEach((callback) => callback(...args));
  }
}

// 创建事件调度中心，为订阅者和发布者提供调度服务
let pubSub = new PubSub();
// A订阅了SMS事件（A只关注SMS本身，而不关心谁发布这个事件）
pubSub.subscribe("SMS", console.log);
// B订阅了SMS事件
pubSub.subscribe("SMS", console.log);
// C发布了SMS事件（C只关注SMS本身，不关心谁订阅了这个事件）
pubSub.publish("SMS", "I published `SMS` event");
```

观察者模式

```js
class Subject {
  constructor() {
    this.observers = [];
  }

  add(observer) {
    this.observers.push(observer);
  }

  notify(...args) {
    this.observers.forEach((observer) => observer.update(...args));
  }
}

class Observer {
  update(...args) {
    console.log(...args);
  }
}

// 创建观察者ob1
let ob1 = new Observer();
// 创建观察者ob2
let ob2 = new Observer();
// 创建目标sub
let sub = new Subject();
// 目标sub添加观察者ob1 （目标和观察者建立了依赖关系）
sub.add(ob1);
// 目标sub添加观察者ob2
sub.add(ob2);
// 目标sub触发SMS事件（目标主动通知观察者）
sub.notify("I fired `SMS` event");
```

:::

## 说说 typeof 与 instanceof 的区别

::: details 点击

#### 区别

typeof 与 instanceof 都是判断数据类型的方法，区别如下：

typeof 会返回一个运算数的基本类型，instanceof 返回的是布尔值
instanceof 可以准确判断引用数据类型，但是不能正确判断原始数据类型
typeof 虽然可以判断原始数据类型（null 除外），但是无法判断引用数据类型（function 除外）
:::

## 说说 new 操作符

::: details 点击

- 创建一个新的对象 obj
- 将对象与构建函数通过原型链连接起来
- 将构建函数中的 this 绑定到新建的对象 obj 上
- 根据构建函数返回类型作判断，如果是原始值则被忽略，如果是返回对象，需要正常处理

```js
function myNew(Func, ...args) {
  // 1.创建一个新对象
  const obj = {};
  // 2.新对象原型指向构造函数原型对象
  obj.__proto__ = Func.prototype;
  // 3.将构建函数的this指向新对象
  let result = Func.apply(obj, args);
  // 4.根据返回值判断
  return result instanceof Object ? result : obj;
}
```

:::

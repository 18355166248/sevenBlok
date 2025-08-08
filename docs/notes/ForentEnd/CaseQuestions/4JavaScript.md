# JavaScript

[[toc]]

### common.js 和 es6 中模块引入的区别？

::: details 点击查看实现代码
1、CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。

2、CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

3、CommonJS 是单个值导出，ES6 Module 可以导出多个

4、CommonJS 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层

5、CommonJS 的 this 是当前模块，ES6 Module 的 this 是 undefined
:::

### 首屏和白屏时间如何计算

::: details 点击查看实现代码

- 当页面的元素数小于 x 时, 则认为是白屏. 可以获取页面的 DOM 节点数, 判断 DOM 节点数小于某个阈值 X, 则认为是白屏
- 在判断初始化页面渲染出来的地方通过 Date.now() - performance.timing.navigationStart 去获取白屏时间
  :::

### Virtual Dom 的优势在哪里？

::: details 点击查看实现代码
Virtual DOM 的优势主要体现在以下几个方面：

#### 1. 性能优化

- **批量更新**：Virtual DOM 可以将多个 DOM 操作批量处理，减少重排重绘次数
- **差异对比**：通过 diff 算法只更新真正变化的部分，避免不必要的 DOM 操作
- **内存优化**：Virtual DOM 在内存中操作，比直接操作真实 DOM 更高效

#### 2. 跨平台能力

- **抽象层**：Virtual DOM 提供了一个抽象层，可以渲染到不同平台（Web、移动端、桌面端）
- **统一接口**：React Native、React VR 等都基于 Virtual DOM 实现跨平台

#### 3. 开发体验

- **声明式编程**：开发者只需要关注数据变化，不需要手动操作 DOM
- **组件化**：Virtual DOM 天然支持组件化开发
- **状态管理**：与状态管理库（Redux、Vuex）配合使用更自然

#### 4. 具体优化机制

- **避免直接操作 DOM**：Virtual DOM 不会立即进行排版与重绘操作
- **批量处理**：进行频繁修改后，一次性比较并修改真实 DOM 中需要改的部分
- **局部更新**：最终与真实 DOM 比较差异，可以只渲染局部，有效降低大面积真实 DOM 的重绘与排版

#### 5. 与真实 DOM 的区别

- **操作方式**：Virtual DOM 在内存中操作，真实 DOM 直接操作浏览器 DOM 树
- **更新策略**：Virtual DOM 采用批量更新 + 差异对比，真实 DOM 每次操作都会触发重排重绘
- **性能表现**：Virtual DOM 在复杂应用中性能更优，简单应用中可能不如直接操作 DOM
  :::

### 面向对象

::: details 点击查看实现代码

#### 1. 面向对象的三大特性

**封装（Encapsulation）**：把客观事物封装成抽象的类，并且类可以把自己的数据和方法只让可信的类或者对象操作，对不可信的进行信息隐藏。

```javascript
// ES5 封装示例
function Person(name, age) {
  // 私有属性
  var _name = name;
  var _age = age;

  // 公有方法
  this.getName = function () {
    return _name;
  };

  this.setName = function (name) {
    _name = name;
  };

  this.getAge = function () {
    return _age;
  };
}

// ES6 封装示例
class Person {
  constructor(name, age) {
    this._name = name; // 约定私有属性
    this._age = age;
  }

  getName() {
    return this._name;
  }

  setName(name) {
    this._name = name;
  }
}
```

**继承（Inheritance）**：通过继承创建的新类称为"子类"或"派生类"。继承的过程，就是从一般到特殊的过程。

```javascript
// ES5 继承
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function () {
  console.log(this.name + " makes a sound");
};

function Dog(name, breed) {
  Animal.call(this, name); // 调用父类构造函数
  this.breed = breed;
}

// 原型链继承
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function () {
  console.log(this.name + " barks");
};

// ES6 继承
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(this.name + " makes a sound");
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 调用父类构造函数
    this.breed = breed;
  }

  bark() {
    console.log(this.name + " barks");
  }
}
```

**多态（Polymorphism）**：对象的多功能，多方法，一个方法多种表现形式。

```javascript
// 多态示例
class Shape {
  area() {
    return 0;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

// 多态使用
function calculateArea(shape) {
  return shape.area(); // 根据对象类型调用不同的area方法
}

const circle = new Circle(5);
const rectangle = new Rectangle(4, 6);

console.log(calculateArea(circle)); // 78.54...
console.log(calculateArea(rectangle)); // 24
```

#### 2. JavaScript 面向对象的特点

JavaScript 是一种基于对象（object-based）的语言，但 ES6 之前不是真正的面向对象编程（OOP）语言，因为语法中没有 class（类）。ES5 使用函数模拟面向对象。

#### 3. 构造函数 vs 类

```javascript
// ES5 构造函数方式
function Car(brand, model) {
  this.brand = brand;
  this.model = model;
}

Car.prototype.start = function () {
  console.log(this.brand + " " + this.model + " is starting...");
};

// ES6 类方式
class Car {
  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
  }

  start() {
    console.log(this.brand + " " + this.model + " is starting...");
  }

  // 静态方法
  static create(brand, model) {
    return new Car(brand, model);
  }

  // getter/setter
  get info() {
    return `${this.brand} ${this.model}`;
  }

  set info(value) {
    [this.brand, this.model] = value.split(" ");
  }
}
```

#### 4. 私有字段和方法（ES2022）

```javascript
class BankAccount {
  #balance = 0; // 私有字段

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  #validateAmount(amount) {
    // 私有方法
    return amount > 0;
  }

  deposit(amount) {
    if (this.#validateAmount(amount)) {
      this.#balance += amount;
      return true;
    }
    return false;
  }

  getBalance() {
    return this.#balance;
  }
}
```

#### 5. 实际应用场景

```javascript
// 购物车系统
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        ...product,
        quantity,
      });
    }
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  clear() {
    this.items = [];
  }
}

// 使用示例
const cart = new ShoppingCart();
cart.addItem({ id: 1, name: "iPhone", price: 999 }, 2);
cart.addItem({ id: 2, name: "AirPods", price: 199 }, 1);
console.log(cart.getTotal()); // 2197
```

:::

### 原型链

::: details 点击查看实现代码

#### 1. 原型链的基本概念

原型链是 JavaScript 实现继承的主要方式，每个对象都有一个内部属性 `[[Prototype]]`（可通过 `__proto__` 访问），指向其原型对象。

#### 2. 构造函数、原型和实例的关系

```javascript
// 构造函数
function Cat(name) {
  this.name = name;
}

// 原型对象
Cat.prototype.sayHello = function () {
  console.log("喵喵喵");
};

// 实例对象
const cat = new Cat("小花");

// 关系验证
console.log(cat.__proto__ === Cat.prototype); // true
console.log(Cat.prototype.constructor === Cat); // true
console.log(Object.getPrototypeOf(cat) === Cat.prototype); // true
```

#### 3. 原型链的查找机制

```javascript
// 当访问对象的属性时，JavaScript 会沿着原型链向上查找
console.log(cat.name); // '小花' - 实例自身的属性
console.log(cat.sayHello); // function - 从原型链上找到的方法

// 属性查找顺序：实例自身 → 原型对象 → 原型的原型 → ... → Object.prototype → null
```

#### 4. 原型链的完整示例

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function () {
  console.log(this.name + "正在吃东西");
};

function Cat(name, color) {
  Animal.call(this, name); // 继承父类属性
  this.color = color;
}

// 继承父类方法 - 方法1：直接赋值
Cat.prototype = Animal.prototype;

// 继承父类方法 - 方法2：创建中间对象（推荐）
Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.constructor = Cat; // 修正构造函数指向

Cat.prototype.sayHello = function () {
  console.log(this.name + "喵喵喵");
};

const cat = new Cat("小花", "白色");
cat.eat(); // 小花正在吃东西
cat.sayHello(); // 小花喵喵喵

// 原型链验证
console.log(cat.__proto__ === Cat.prototype); // true
console.log(Cat.prototype.__proto__ === Animal.prototype); // true
console.log(Animal.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true
```

#### 5. ES6 类的原型链

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  eat() {
    console.log(this.name + "正在吃东西");
  }
}

class Cat extends Animal {
  constructor(name, color) {
    super(name); // 调用父类构造函数
    this.color = color;
  }

  sayHello() {
    console.log(this.name + "喵喵喵");
  }
}

const cat = new Cat("小花", "白色");

// ES6 类本质上还是基于原型链
console.log(cat.__proto__ === Cat.prototype); // true
console.log(Cat.prototype.__proto__ === Animal.prototype); // true
```

#### 6. 原型链的注意事项

```javascript
// 1. 属性遮蔽（Shadowing）
function Parent() {}
Parent.prototype.value = "parent";

function Child() {}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

const child = new Child();
console.log(child.value); // 'parent'

// 在实例上设置同名属性会遮蔽原型上的属性
child.value = "child";
console.log(child.value); // 'child'

// 2. 原型链过长会影响性能
// 3. 所有对象最终都继承自 Object.prototype
console.log(cat.toString); // function - 来自 Object.prototype
console.log(cat.hasOwnProperty); // function - 来自 Object.prototype
```

#### 7. 常用的原型链相关方法

```javascript
// 检查属性是否在实例自身
console.log(cat.hasOwnProperty("name")); // true
console.log(cat.hasOwnProperty("sayHello")); // false

// 检查属性是否在原型链上
console.log("sayHello" in cat); // true

// 获取原型对象
console.log(Object.getPrototypeOf(cat) === Cat.prototype); // true

// 设置原型对象（不推荐，影响性能）
const obj = {};
Object.setPrototypeOf(obj, Cat.prototype);
```

![](@public/Casequestion/js_prototype.png)

:::

### undefined 和 null 的区别

::: details 点击查看实现代码

#### 基本概念

- **undefined**: 表示一个变量已声明但未赋值，或者访问对象不存在的属性时返回的值
- **null**: 表示一个空对象指针，通常用于表示"空值"或"无对象"

#### 主要区别

1. **类型不同**

   ```js
   typeof undefined; // "undefined"
   typeof null; // "object"
   ```

2. **转换为数值时的结果不同**

   ```js
   Number(undefined); // NaN
   Number(null); // 0
   ```

3. **使用场景不同**

   - `undefined`: 通常表示变量未初始化或函数没有返回值
   - `null`: 通常表示对象不存在或清空对象引用

4. **相等性比较**

   ```js
   undefined == null; // true (宽松相等)
   undefined === null; // false (严格相等)
   ```

5. **JSON 序列化**

   ```js
   JSON.stringify(undefined); // undefined (会被忽略)
   JSON.stringify(null); // "null"
   ```

6. **函数参数默认值**
   ```js
   function test(a = 1) {
     console.log(a);
   }
   test(undefined); // 1 (会使用默认值)
   test(null); // null (不会使用默认值)
   ```

#### 最佳实践

- 使用 `undefined` 表示变量未定义或函数无返回值
- 使用 `null` 表示对象不存在或清空对象引用
- 在比较时使用严格相等 `===` 来区分两者

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
Promise.all = function (values) {
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

::: details 点击查看实现代码

#### 方法对比

1. **in 操作符** - 检查属性是否在对象及其原型链上

   ```js
   const obj = { a: 1 };
   "a" in obj; // true
   "toString" in obj; // true (继承自原型链)
   "b" in obj; // false
   ```

2. **hasOwnProperty()** - 只检查对象自身的属性

   ```js
   const obj = { a: 1 };
   obj.hasOwnProperty("a"); // true
   obj.hasOwnProperty("toString"); // false (原型链上的属性)
   obj.hasOwnProperty("b"); // false
   ```

3. **Reflect.has()** - ES6 新增，功能与 in 操作符相同

   ```js
   const obj = { a: 1 };
   Reflect.has(obj, "a"); // true
   Reflect.has(obj, "toString"); // true
   Reflect.has(obj, "b"); // false
   ```

4. **propertyIsEnumerable()** - 检查属性是否可枚举且为自身属性

   ```js
   const obj = { a: 1 };
   obj.propertyIsEnumerable("a"); // true
   obj.propertyIsEnumerable("toString"); // false
   ```

5. **Object.prototype.hasOwnProperty.call()** - 安全的方式调用 hasOwnProperty

   ```js
   const obj = { a: 1 };
   Object.prototype.hasOwnProperty.call(obj, "a"); // true
   ```

6. **Object.hasOwn()** - ES2022 新增，推荐使用
   ```js
   const obj = { a: 1 };
   Object.hasOwn(obj, "a"); // true
   ```

#### 使用场景

- **检查自身属性**: 使用 `hasOwnProperty()` 或 `Object.hasOwn()`
- **检查所有属性**: 使用 `in` 操作符或 `Reflect.has()`
- **检查可枚举属性**: 使用 `propertyIsEnumerable()`

#### 注意事项

```js
// 避免直接调用 hasOwnProperty，可能被重写
const obj = {
  hasOwnProperty: function () {
    return false;
  },
  a: 1,
};

obj.hasOwnProperty("a"); // false (被重写了)
Object.prototype.hasOwnProperty.call(obj, "a"); // true (安全调用)
Object.hasOwn(obj, "a"); // true (推荐使用)
```

:::

### 数组扁平化方法，除了用递归还有什么方法

::: details 点击查看实现代码

#### 方法 1: toString() + split() - 适用于数字数组

```js
function flatten(arr) {
  return arr
    .toString()
    .split(",")
    .map((item) => Number(item));
}

// 测试
const arr = [1, [2, 3], [4, [5, 6]]];
console.log(flatten(arr)); // [1, 2, 3, 4, 5, 6]
```

#### 方法 2: while 循环 + findIndex

```js
function flatten(arr) {
  while (arr.findIndex((item) => Array.isArray(item)) >= 0) {
    arr = [].concat(...arr);
  }
  return arr;
}

// 测试
const arr = [1, [2, 3], [4, [5, 6]]];
console.log(flatten(arr)); // [1, 2, 3, 4, 5, 6]
```

#### 方法 3: Array.flat() - ES2019 原生方法

```js
function flatten(arr) {
  return arr.flat(Infinity);
}

// 测试
const arr = [1, [2, 3], [4, [5, 6]]];
console.log(flatten(arr)); // [1, 2, 3, 4, 5, 6]
```

#### 方法 4: JSON 序列化 + 正则替换

```js
function flatten(arr) {
  let str = JSON.stringify(arr).replace(/(\[|\])/g, "");
  str = "[" + str + "]";
  return JSON.parse(str);
}

// 测试
const arr = [1, [2, 3], [4, [5, 6]]];
console.log(flatten(arr)); // [1, 2, 3, 4, 5, 6]
```

#### 方法 5: 使用堆栈 (Stack)

```js
function flatten(arr) {
  const stack = [...arr];
  const result = [];

  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.unshift(item);
    }
  }

  return result;
}

// 测试
const arr = [1, [2, 3], [4, [5, 6]]];
console.log(flatten(arr)); // [1, 2, 3, 4, 5, 6]
```

#### 方法 6: Generator 函数

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

// 测试
const arr = [1, [2, 3], [4, [5, 6]]];
console.log([...flatten(arr)]); // [1, 2, 3, 4, 5, 6]
```

#### 方法 7: reduce() + 递归

```js
function flatten(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

// 测试
const arr = [1, [2, 3], [4, [5, 6]]];
console.log(flatten(arr)); // [1, 2, 3, 4, 5, 6]
```

#### 方法 8: 使用 some() + 循环

```js
function flatten(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

// 测试
const arr = [1, [2, 3], [4, [5, 6]]];
console.log(flatten(arr)); // [1, 2, 3, 4, 5, 6]
```

#### 性能对比

- **最快**: `Array.flat()` (原生方法)
- **最通用**: `reduce()` + 递归
- **最简洁**: `toString()` + `split()` (仅限数字)
- **最灵活**: Generator 函数

#### 注意事项

1. `toString()` 方法只适用于数字数组
2. `JSON.stringify()` 方法不能处理函数、undefined、Symbol 等
3. 递归方法在深度嵌套时可能导致栈溢出
4. `Array.flat()` 是 ES2019 特性，需要考虑兼容性

:::

### 实现一下「模版字符串」功能

::: details 点击查看实现代码

#### 基础实现 - 简单模板替换

```js
const html = "{a  }开始了{  b}! 2023{ a  }";
function getStr2(html, obj) {
  return html.replace(/\{(.+?)\}/g, (_, key) => obj[key.trim()]);
}
console.log(getStr2(html, { a: "江浪", b: "泽丽" }));
// 输出: "江浪开始了泽丽! 2023江浪"
```

#### 增强实现 - 支持表达式和默认值

```js
function template(template, data) {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
    const trimmed = expression.trim();

    // 支持默认值语法: {{name || 'default'}}
    if (trimmed.includes("||")) {
      const [key, defaultValue] = trimmed.split("||").map((s) => s.trim());
      return data[key] !== undefined ? data[key] : defaultValue;
    }

    // 支持嵌套属性: {{user.name}}
    const keys = trimmed.split(".");
    let value = data;
    for (const key of keys) {
      value = value && value[key];
      if (value === undefined) break;
    }

    return value !== undefined ? value : "";
  });
}

// 测试
const templateStr =
  "Hello {{name}}, you are {{age || 'unknown'}} years old. Your email is {{user.email || 'not provided'}}";
const data = {
  name: "张三",
  user: {
    email: "zhangsan@example.com",
  },
};

console.log(template(templateStr, data));
// 输出: "Hello 张三, you are unknown years old. Your email is zhangsan@example.com"
```

#### 高级实现 - 支持函数调用和条件判断

```js
function advancedTemplate(template, data) {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
    const trimmed = expression.trim();

    // 支持函数调用: {{formatDate(date)}}
    if (trimmed.includes("(") && trimmed.includes(")")) {
      const funcName = trimmed.split("(")[0].trim();
      const args = trimmed
        .match(/\(([^)]+)\)/)[1]
        .split(",")
        .map((arg) => {
          const key = arg.trim();
          return data[key];
        });

      if (typeof data[funcName] === "function") {
        return data[funcName](...args);
      }
      return "";
    }

    // 支持三元运算符: {{age > 18 ? 'adult' : 'minor'}}
    if (trimmed.includes("?")) {
      const [condition, options] = trimmed.split("?");
      const [trueValue, falseValue] = options.split(":").map((s) => s.trim());

      // 简单的条件判断
      const key = condition.trim();
      const value = data[key];
      return value ? trueValue : falseValue;
    }

    // 普通属性访问
    return data[trimmed] !== undefined ? data[trimmed] : "";
  });
}

// 测试
const templateStr2 =
  "{{name}} is {{age > 18 ? 'an adult' : 'a minor'}}. Today is {{formatDate(date)}}";
const data2 = {
  name: "李四",
  age: 20,
  date: new Date(),
  formatDate: (date) => date.toLocaleDateString(),
};

console.log(advancedTemplate(templateStr2, data2));
// 输出: "李四 is an adult. Today is 2024/1/15"
```

#### 安全实现 - 防止 XSS 攻击

```js
function safeTemplate(template, data) {
  // HTML 转义函数
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  return template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
    const trimmed = expression.trim();
    const value = data[trimmed];

    // 自动转义 HTML 特殊字符
    return value !== undefined ? escapeHtml(String(value)) : "";
  });
}

// 测试
const unsafeTemplate = "Hello {{name}}, your message is: {{message}}";
const unsafeData = {
  name: "王五",
  message: "<script>alert('xss')</script>",
};

console.log(safeTemplate(unsafeTemplate, unsafeData));
// 输出: "Hello 王五, your message is: &lt;script&gt;alert('xss')&lt;/script&gt;"
```

#### 性能优化版本

```js
function optimizedTemplate(template, data) {
  // 缓存编译结果
  const cache = new Map();

  if (!cache.has(template)) {
    const regex = /\{\{([^}]+)\}\}/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(template)) !== null) {
      parts.push(template.slice(lastIndex, match.index));
      parts.push(match[1].trim());
      lastIndex = match.index + match[0].length;
    }

    parts.push(template.slice(lastIndex));
    cache.set(template, parts);
  }

  const parts = cache.get(template);
  let result = "";

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      result += parts[i];
    } else {
      result += data[parts[i]] !== undefined ? data[parts[i]] : "";
    }
  }

  return result;
}

// 测试
const templateStr3 = "Hello {{name}}, welcome to {{company}}!";
const data3 = { name: "赵六", company: "TechCorp" };

console.log(optimizedTemplate(templateStr3, data3));
// 输出: "Hello 赵六, welcome to TechCorp!"
```

#### 使用场景

1. **简单变量替换**: 基础实现
2. **复杂模板**: 增强实现
3. **用户输入**: 安全实现
4. **高频调用**: 性能优化版本

:::

:::

### 手写实现一下 Promise.all (Promise 不用写)；

::: details 点击查看实现代码

#### 基础实现

```js
function PromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    // 处理空数组的情况
    if (promises.length === 0) {
      resolve(results);
      return;
    }

    promises.forEach((promise, index) => {
      // 确保每个元素都是 Promise
      Promise.resolve(promise)
        .then((result) => {
          results[index] = result;
          completed++;

          // 所有 Promise 都完成时返回结果
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch((error) => {
          // 任何一个 Promise 失败就立即返回错误
          reject(error);
        });
    });
  });
}

// 测试
const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];

PromiseAll(promises).then((results) => {
  console.log(results); // [1, 2, 3]
});
```

#### 增强实现 - 支持非 Promise 值

```js
function PromiseAllEnhanced(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) {
      resolve(results);
      return;
    }

    promises.forEach((item, index) => {
      // 处理非 Promise 值
      if (item instanceof Promise) {
        item
          .then((result) => {
            results[index] = result;
            completed++;
            if (completed === promises.length) {
              resolve(results);
            }
          })
          .catch(reject);
      } else {
        // 非 Promise 值直接放入结果数组
        results[index] = item;
        completed++;
        if (completed === promises.length) {
          resolve(results);
        }
      }
    });
  });
}

// 测试
const mixedPromises = [
  Promise.resolve(1),
  2, // 非 Promise 值
  Promise.resolve(3),
];

PromiseAllEnhanced(mixedPromises).then((results) => {
  console.log(results); // [1, 2, 3]
});
```

#### 完整实现 - 包含错误处理和边界情况

```js
function PromiseAllComplete(promises) {
  return new Promise((resolve, reject) => {
    // 参数验证
    if (!Array.isArray(promises)) {
      reject(new TypeError("Promise.all requires an array"));
      return;
    }

    const results = [];
    let completed = 0;
    const length = promises.length;

    if (length === 0) {
      resolve(results);
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((result) => {
          results[index] = result;
          completed++;

          if (completed === length) {
            resolve(results);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
}

// 测试各种情况
async function testPromiseAll() {
  try {
    // 正常情况
    const results1 = await PromiseAllComplete([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ]);
    console.log("Success:", results1); // [1, 2, 3]

    // 包含非 Promise 值
    const results2 = await PromiseAllComplete([
      Promise.resolve(1),
      2,
      Promise.resolve(3),
    ]);
    console.log("Mixed:", results2); // [1, 2, 3]

    // 空数组
    const results3 = await PromiseAllComplete([]);
    console.log("Empty:", results3); // []

    // 包含错误的 Promise
    await PromiseAllComplete([
      Promise.resolve(1),
      Promise.reject(new Error("Failed")),
      Promise.resolve(3),
    ]);
  } catch (error) {
    console.log("Error caught:", error.message); // "Failed"
  }
}

testPromiseAll();
```

#### 性能优化版本

```js
function PromiseAllOptimized(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    const length = promises.length;

    if (length === 0) {
      resolve(results);
      return;
    }

    // 使用 for 循环而不是 forEach 以获得更好的性能
    for (let i = 0; i < length; i++) {
      Promise.resolve(promises[i])
        .then((result) => {
          results[i] = result;
          completed++;

          if (completed === length) {
            resolve(results);
          }
        })
        .catch(reject);
    }
  });
}
```

#### 与其他 Promise 方法的对比

```js
// Promise.allSettled 的实现
function PromiseAllSettled(promises) {
  return new Promise((resolve) => {
    const results = [];
    let completed = 0;
    const length = promises.length;

    if (length === 0) {
      resolve(results);
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = { status: "fulfilled", value };
        })
        .catch((reason) => {
          results[index] = { status: "rejected", reason };
        })
        .finally(() => {
          completed++;
          if (completed === length) {
            resolve(results);
          }
        });
    });
  });
}

// Promise.race 的实现
function PromiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      Promise.resolve(promise).then(resolve).catch(reject);
    });
  });
}
```

#### 使用场景

1. **并行请求**: 同时发起多个 API 请求
2. **数据聚合**: 收集多个数据源的结果
3. **批量操作**: 同时处理多个文件或任务
4. **依赖管理**: 等待多个异步操作完成

:::

:::

### 观察者模式和发布订阅模式的区别

::: details 点击查看实现代码

#### 架构对比

![](@public/Casequestion/subscrib-watch.png)

可以看出，发布订阅模式相比观察者模式多了个事件通道，事件通道作为调度中心，管理事件的订阅和发布工作，彻底隔绝了订阅者和发布者的依赖关系。即订阅者在订阅事件的时候，只关注事件本身，而不关心谁会发布这个事件；发布者在发布事件的时候，只关注事件本身，而不关心谁订阅了这个事件。

#### 主要区别

| 特性           | 观察者模式                     | 发布订阅模式             |
| -------------- | ------------------------------ | ------------------------ |
| **耦合度**     | 高耦合，观察者直接依赖被观察者 | 低耦合，通过事件中心解耦 |
| **关系**       | 一对多，被观察者直接通知观察者 | 多对多，通过事件中心通信 |
| **通信方式**   | 直接通信                       | 间接通信                 |
| **灵活性**     | 相对固定                       | 更加灵活                 |
| **实现复杂度** | 简单                           | 相对复杂                 |

#### 代码实现

##### 发布订阅模式 (Pub/Sub)

```js
class PubSub {
  constructor() {
    this.subscribers = {};
  }

  // 订阅事件
  subscribe(topic, callback) {
    if (!this.subscribers[topic]) {
      this.subscribers[topic] = [];
    }
    this.subscribers[topic].push(callback);

    // 返回取消订阅的函数
    return () => {
      this.unsubscribe(topic, callback);
    };
  }

  // 发布事件
  publish(topic, ...args) {
    const callbacks = this.subscribers[topic] || [];
    callbacks.forEach((callback) => callback(...args));
  }

  // 取消订阅
  unsubscribe(topic, callback) {
    const callbacks = this.subscribers[topic] || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  // 清除所有订阅
  clear(topic) {
    if (topic) {
      delete this.subscribers[topic];
    } else {
      this.subscribers = {};
    }
  }
}

// 使用示例
const pubSub = new PubSub();

// 订阅者 A 订阅 SMS 事件
const unsubscribeA = pubSub.subscribe("SMS", (message) => {
  console.log("A received:", message);
});

// 订阅者 B 订阅 SMS 事件
pubSub.subscribe("SMS", (message) => {
  console.log("B received:", message);
});

// 发布者 C 发布 SMS 事件
pubSub.publish("SMS", "Hello from C!");

// 取消订阅
unsubscribeA();

// 再次发布，A 不会收到消息
pubSub.publish("SMS", "Hello again!");
```

##### 观察者模式 (Observer)

```js
class Subject {
  constructor() {
    this.observers = [];
  }

  // 添加观察者
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  // 移除观察者
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  // 通知所有观察者
  notify(...args) {
    this.observers.forEach((observer) => observer.update(...args));
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }

  update(...args) {
    console.log(`${this.name} received:`, ...args);
  }
}

// 使用示例
const subject = new Subject();

const observer1 = new Observer("Observer1");
const observer2 = new Observer("Observer2");

// 添加观察者
subject.addObserver(observer1);
subject.addObserver(observer2);

// 通知观察者
subject.notify("Hello from Subject!");

// 移除观察者
subject.removeObserver(observer1);

// 再次通知
subject.notify("Hello again!");
```

#### 增强版发布订阅模式

```js
class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 订阅事件
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  // 只订阅一次
  once(event, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }

  // 发布事件
  emit(event, ...args) {
    const callbacks = this.events[event] || [];
    callbacks.forEach((callback) => callback(...args));
  }

  // 取消订阅
  off(event, callback) {
    const callbacks = this.events[event] || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  // 移除所有监听器
  removeAllListeners(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}

// 使用示例
const emitter = new EventEmitter();

emitter.on("userLogin", (user) => {
  console.log("User logged in:", user);
});

emitter.once("userLogout", (user) => {
  console.log("User logged out:", user);
});

emitter.emit("userLogin", { id: 1, name: "John" });
emitter.emit("userLogout", { id: 1, name: "John" });
emitter.emit("userLogout", { id: 1, name: "John" }); // 不会触发
```

#### 实际应用场景

##### 观察者模式应用

```js
// Vue 的响应式系统
class Dep {
  constructor() {
    this.subscribers = [];
  }

  depend() {
    if (activeEffect) {
      this.subscribers.push(activeEffect);
    }
  }

  notify() {
    this.subscribers.forEach((effect) => effect());
  }
}

// React 组件状态管理
class Component {
  constructor() {
    this.state = {};
    this.listeners = [];
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}
```

##### 发布订阅模式应用

```js
// DOM 事件系统
document.addEventListener("click", (event) => {
  console.log("Clicked:", event);
});

// Node.js EventEmitter
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.on("event", (arg1, arg2) => {
  console.log("Event occurred:", arg1, arg2);
});

myEmitter.emit("event", "arg1", "arg2");
```

#### 选择建议

- **使用观察者模式**：当对象间存在一对多的依赖关系，且需要直接通信时
- **使用发布订阅模式**：当需要解耦发布者和订阅者，或者需要支持多对多通信时

:::

:::

## 说说 typeof 与 instanceof 的区别

::: details 点击查看实现代码

#### 基本概念

- **typeof**: 一元操作符，返回一个表示操作数类型的字符串
- **instanceof**: 二元操作符，检查构造函数的 prototype 是否出现在对象的原型链上

#### 主要区别

| 特性          | typeof          | instanceof |
| ------------- | --------------- | ---------- |
| **返回值**    | 字符串          | 布尔值     |
| **适用类型**  | 所有类型        | 引用类型   |
| **null 处理** | 返回 "object"   | 返回 false |
| **函数处理**  | 返回 "function" | 返回 true  |
| **原始类型**  | 准确判断        | 无法判断   |

#### 详细对比

##### typeof 的行为

```js
// 原始类型
typeof "hello"; // "string"
typeof 123; // "number"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof Symbol(); // "symbol"
typeof BigInt(123); // "bigint"

// 特殊情况
typeof null; // "object" (这是 JavaScript 的 bug)
typeof function () {}; // "function"

// 引用类型
typeof {}; // "object"
typeof []; // "object"
typeof new Date(); // "object"
typeof /regex/; // "object"
```

##### instanceof 的行为

```js
// 原始类型 - 都返回 false
"hello" instanceof String;     // false
123 instanceof Number;         // false
true instanceof Boolean;       // false
undefined instanceof Object;   // false
null instanceof Object;        // false

// 引用类型 - 返回 true
[] instanceof Array;           // true
{} instanceof Object;          // true
function(){} instanceof Function; // true
new Date() instanceof Date;    // true

// 包装对象
new String("hello") instanceof String; // true
new Number(123) instanceof Number;     // true
```

#### 实际应用示例

##### 类型检查函数

```js
function getType(value) {
  if (value === null) {
    return "null";
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return "array";
    }
    if (value instanceof Date) {
      return "date";
    }
    if (value instanceof RegExp) {
      return "regexp";
    }
    return "object";
  }

  return typeof value;
}

// 测试
console.log(getType("hello")); // "string"
console.log(getType(123)); // "number"
console.log(getType(true)); // "boolean"
console.log(getType(null)); // "null"
console.log(getType(undefined)); // "undefined"
console.log(getType([])); // "array"
console.log(getType({})); // "object"
console.log(getType(new Date())); // "date"
console.log(getType(/regex/)); // "regexp"
console.log(getType(function () {})); // "function"
```

##### 安全的类型检查

```js
// 检查是否为数组
function isArray(value) {
  return Array.isArray(value);
  // 或者: return value instanceof Array;
}

// 检查是否为对象
function isObject(value) {
  return value !== null && typeof value === "object";
}

// 检查是否为函数
function isFunction(value) {
  return typeof value === "function";
}

// 检查是否为原始类型
function isPrimitive(value) {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "undefined" ||
    typeof value === "symbol" ||
    typeof value === "bigint"
  );
}
```

#### 常见陷阱和注意事项

##### typeof 的陷阱

```js
// null 被错误地识别为 object
typeof null; // "object"

// 函数被正确识别
typeof function () {}; // "function"

// 包装对象
typeof new String("hello"); // "object"
typeof new Number(123); // "object"
```

##### instanceof 的陷阱

```js
// 原始类型无法判断
"hello" instanceof String; // false
123 instanceof Number; // false

// 跨窗口/iframe 问题
// 在不同窗口创建的数组，instanceof 可能返回 false
const iframe = document.createElement("iframe");
document.body.appendChild(iframe);
const iframeArray = iframe.contentWindow.Array;
const arr = new iframeArray();
console.log(arr instanceof Array); // false (在某些浏览器中)
```

#### 最佳实践

##### 推荐的类型检查方法

```js
// 使用 Object.prototype.toString.call()
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

// 测试
console.log(getType("hello")); // "string"
console.log(getType(123)); // "number"
console.log(getType(null)); // "null"
console.log(getType(undefined)); // "undefined"
console.log(getType([])); // "array"
console.log(getType({})); // "object"
console.log(getType(new Date())); // "date"
```

##### 现代 JavaScript 的类型检查

```js
// ES6+ 方法
Array.isArray([]); // true
Number.isInteger(123); // true
Number.isNaN(NaN); // true

// 可选链和空值合并
const obj = { a: { b: 1 } };
obj?.a?.b; // 1
obj?.c?.d ?? "default"; // "default"
```

#### 性能考虑

```js
// typeof 性能最好
typeof value === "string"; // 最快

// instanceof 性能中等
value instanceof Array; // 中等

// Object.prototype.toString 性能较差
Object.prototype.toString.call(value); // 较慢
```

#### 总结

- **typeof**: 适用于所有类型检查，但对 null 有 bug
- **instanceof**: 适用于引用类型检查，不能用于原始类型
- **Object.prototype.toString**: 最准确但性能较差
- **现代方法**: 使用专门的检查方法（如 Array.isArray）

:::
:::

## 说说 new 操作符

::: details 点击查看实现代码

#### 基本概念

`new` 操作符用于创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一。

#### 执行步骤

1. **创建一个新的空对象**
2. **将新对象的原型指向构造函数的 prototype**
3. **将构造函数的 this 绑定到新对象**
4. **执行构造函数代码**
5. **返回新对象（如果构造函数返回对象，则返回该对象；否则返回新创建的对象）**

#### 基础实现

```js
function myNew(Func, ...args) {
  // 1. 创建一个新对象
  const obj = {};

  // 2. 新对象原型指向构造函数原型对象
  obj.__proto__ = Func.prototype;

  // 3. 将构造函数的 this 指向新对象
  let result = Func.apply(obj, args);

  // 4. 根据返回值判断
  return result instanceof Object ? result : obj;
}
```

#### 增强实现 - 包含错误处理

```js
function myNewEnhanced(Func, ...args) {
  // 检查 Func 是否为函数
  if (typeof Func !== "function") {
    throw new TypeError("Constructor must be a function");
  }

  // 1. 创建一个新对象
  const obj = Object.create(null);

  // 2. 新对象原型指向构造函数原型对象
  Object.setPrototypeOf(obj, Func.prototype);

  // 3. 将构造函数的 this 指向新对象并执行
  const result = Func.apply(obj, args);

  // 4. 根据返回值判断
  if (result !== null && typeof result === "object") {
    return result;
  }

  return obj;
}
```

#### 完整实现 - 支持所有边界情况

```js
function myNewComplete(Func, ...args) {
  // 参数验证
  if (typeof Func !== "function") {
    throw new TypeError("Constructor must be a function");
  }

  // 1. 创建新对象
  const obj = {};

  // 2. 设置原型链
  if (Func.prototype) {
    Object.setPrototypeOf(obj, Func.prototype);
  }

  // 3. 绑定 this 并执行构造函数
  const result = Func.apply(obj, args);

  // 4. 处理返回值
  if (
    result !== null &&
    (typeof result === "object" || typeof result === "function")
  ) {
    return result;
  }

  return obj;
}
```

#### 测试示例

```js
// 测试构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHello = function () {
  console.log(`Hello, I'm ${this.name}`);
};

// 使用原生 new
const person1 = new Person("张三", 25);
console.log(person1.name); // "张三"
person1.sayHello(); // "Hello, I'm 张三"

// 使用自定义 myNew
const person2 = myNew(Person, "李四", 30);
console.log(person2.name); // "李四"
person2.sayHello(); // "Hello, I'm 李四"

// 测试返回值
function TestReturn() {
  this.value = 42;
  return { custom: "returned object" };
}

const test1 = new TestReturn();
console.log(test1); // { custom: "returned object" }

const test2 = myNew(TestReturn);
console.log(test2); // { custom: "returned object" }
```

#### 特殊情况处理

##### 构造函数返回原始值

```js
function ReturnPrimitive() {
  this.value = "test";
  return "primitive value";
}

const obj1 = new ReturnPrimitive();
console.log(obj1); // ReturnPrimitive { value: "test" }
// 返回原始值被忽略，返回新创建的对象

const obj2 = myNew(ReturnPrimitive);
console.log(obj2); // ReturnPrimitive { value: "test" }
```

##### 构造函数返回对象

```js
function ReturnObject() {
  this.value = "test";
  return { custom: "returned" };
}

const obj1 = new ReturnObject();
console.log(obj1); // { custom: "returned" }
// 返回对象，使用返回的对象

const obj2 = myNew(ReturnObject);
console.log(obj2); // { custom: "returned" }
```

##### 构造函数返回 null

```js
function ReturnNull() {
  this.value = "test";
  return null;
}

const obj1 = new ReturnNull();
console.log(obj1); // ReturnNull { value: "test" }
// null 被当作原始值处理

const obj2 = myNew(ReturnNull);
console.log(obj2); // ReturnNull { value: "test" }
```

#### 性能优化版本

```js
function myNewOptimized(Func, ...args) {
  // 使用 Object.create 一次性完成对象创建和原型设置
  const obj = Object.create(Func.prototype);

  // 执行构造函数
  const result = Func.apply(obj, args);

  // 处理返回值
  return result && typeof result === "object" ? result : obj;
}
```

#### 与 Object.create 的区别

```js
// new 操作符
function Person(name) {
  this.name = name;
}
const person1 = new Person("张三");

// Object.create
const person2 = Object.create(Person.prototype);
Person.call(person2, "李四");

// 两者结果相同，但 new 更简洁
console.log(person1.name); // "张三"
console.log(person2.name); // "李四"
```

#### 实际应用场景

##### 工厂函数模式

```js
function createUser(name, email) {
  return new User(name, email);
}

function User(name, email) {
  this.name = name;
  this.email = email;
}

const user = createUser("张三", "zhangsan@example.com");
```

##### 单例模式

```js
function Singleton() {
  if (Singleton.instance) {
    return Singleton.instance;
  }

  this.data = [];
  Singleton.instance = this;
}

const instance1 = new Singleton();
const instance2 = new Singleton();
console.log(instance1 === instance2); // true
```

#### 注意事项

1. **构造函数必须使用 `new` 调用**，否则 `this` 指向全局对象
2. **返回值处理**：如果构造函数返回对象，则使用该对象；否则使用新创建的对象
3. **原型链设置**：新对象的 `__proto__` 指向构造函数的 `prototype`
4. **性能考虑**：`Object.create` 比手动设置 `__proto__` 性能更好

:::

:::

## GC 垃圾回收机制 Garbage Collection

::: details 点击查看实现代码

#### 基本概念

垃圾回收（Garbage Collection，GC）是自动内存管理的一种形式，它会自动释放不再被程序使用的内存。JavaScript 引擎会自动进行垃圾回收，开发者通常不需要手动管理内存。

#### 垃圾回收算法

现代浏览器主要使用以下两种垃圾回收算法：

##### 1. 标记清除（Mark and Sweep）- 主流算法

**工作原理：**

1. **标记阶段**：从根对象（全局对象、当前执行栈）开始，递归遍历所有可达对象，标记为"活动对象"
2. **清除阶段**：遍历整个堆内存，清除所有未被标记的对象

**优点：**

- 解决了循环引用问题
- 算法相对简单
- 内存碎片较少

**缺点：**

- 需要暂停程序执行（Stop-The-World）
- 标记阶段需要遍历整个对象图

```js
// 标记清除示例
function markAndSweep() {
  // 模拟标记阶段
  const reachable = new Set();

  function mark(obj) {
    if (reachable.has(obj)) return;
    reachable.add(obj);

    // 递归标记所有可达对象
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === "object") {
        mark(obj[key]);
      }
    }
  }

  // 从根对象开始标记
  mark(globalObject);

  // 清除阶段：删除未标记的对象
  // 这里只是概念演示，实际由引擎处理
}
```

##### 2. 引用计数（Reference Counting）- 已淘汰

**工作原理：**

- 为每个对象维护一个引用计数器
- 当对象被引用时，计数器加1
- 当引用被删除时，计数器减1
- 当计数器为0时，立即回收对象

**缺点：**

- 无法处理循环引用
- 计数器维护开销大

```js
// 引用计数的问题示例
function circularReference() {
  const obj1 = {};
  const obj2 = {};

  obj1.ref = obj2; // obj2 引用计数 +1
  obj2.ref = obj1; // obj1 引用计数 +1

  // 函数执行完毕后，obj1 和 obj2 的引用计数仍为 1
  // 导致内存泄漏
}
```

#### V8 引擎的垃圾回收

##### 分代回收策略

V8 将堆内存分为两个区域：

1. **新生代（New Space）**：存放新创建的对象

   - 使用 **Scavenge 算法**（复制算法）
   - 分为 From 空间和 To 空间
   - 回收频率高，速度快

2. **老生代（Old Space）**：存放存活时间较长的对象
   - 使用 **标记清除 + 标记整理算法**
   - 回收频率低，但回收时间长

```js
// 新生代垃圾回收示例
function scavengeExample() {
  // 模拟新生代空间
  let fromSpace = [];
  let toSpace = [];

  // 分配新对象
  const obj1 = { name: "obj1" };
  const obj2 = { name: "obj2" };
  fromSpace.push(obj1, obj2);

  // Scavenge 算法：将存活对象复制到 To 空间
  function scavenge() {
    toSpace = fromSpace.filter((obj) => isAlive(obj));
    fromSpace = [];
    [fromSpace, toSpace] = [toSpace, fromSpace];
  }
}
```

##### 增量标记和并发回收

**增量标记：**

- 将标记过程分成多个小步骤
- 在步骤之间允许程序继续执行
- 减少暂停时间

**并发回收：**

- 垃圾回收器在后台线程运行
- 主线程继续执行程序
- 提高用户体验

#### 内存泄漏的常见原因

##### 1. 全局变量

```js
// 错误示例
function createGlobalVariable() {
  // 意外创建全局变量
  globalVar = "I'm global";

  // 正确做法
  let localVar = "I'm local";
}
```

##### 2. 闭包

```js
// 可能导致内存泄漏的闭包
function createClosure() {
  const largeData = new Array(1000000).fill("data");

  return function () {
    console.log(largeData.length);
  };
}

const closure = createClosure();
// largeData 不会被回收，因为闭包持有引用
```

##### 3. 事件监听器

```js
// 忘记移除事件监听器
function addEventListener() {
  const button = document.getElementById("button");
  button.addEventListener("click", handleClick);

  // 页面卸载时应该移除监听器
  // button.removeEventListener('click', handleClick);
}
```

##### 4. DOM 引用

```js
// 保持对 DOM 元素的引用
const elements = [];

function addElement() {
  const div = document.createElement("div");
  elements.push(div); // 即使元素被移除，引用仍然存在
  document.body.appendChild(div);
}
```

#### 内存优化技巧

##### 1. 及时释放引用

```js
// 及时设置为 null
let largeObject = { data: new Array(1000000) };
largeObject = null; // 释放引用
```

##### 2. 使用 WeakMap/WeakSet

```js
// WeakMap 不会阻止垃圾回收
const cache = new WeakMap();

function cacheData(obj, data) {
  cache.set(obj, data);
  // 当 obj 被回收时，cache 中的条目也会被回收
}
```

##### 3. 避免闭包陷阱

```js
// 优化闭包
function createOptimizedClosure() {
  const largeData = new Array(1000000).fill("data");

  return function () {
    // 只访问需要的属性
    console.log(largeData.length);
  };
}

// 使用完毕后释放
const closure = createOptimizedClosure();
closure();
closure = null; // 释放引用
```

##### 4. 使用对象池

```js
// 对象池模式
class ObjectPool {
  constructor(createFn) {
    this.pool = [];
    this.createFn = createFn;
  }

  get() {
    return this.pool.pop() || this.createFn();
  }

  release(obj) {
    this.pool.push(obj);
  }
}

// 使用示例
const pool = new ObjectPool(() => ({ x: 0, y: 0 }));
const obj = pool.get();
pool.release(obj);
```

#### 性能监控

##### 使用 Performance API

```js
// 监控内存使用
function monitorMemory() {
  if (performance.memory) {
    console.log("Used JS Heap Size:", performance.memory.usedJSHeapSize);
    console.log("Total JS Heap Size:", performance.memory.totalJSHeapSize);
    console.log("JS Heap Size Limit:", performance.memory.jsHeapSizeLimit);
  }
}

// 定期监控
setInterval(monitorMemory, 1000);
```

##### 使用 Chrome DevTools

```js
// 在代码中添加标记
console.time("operation");
// 执行操作
console.timeEnd("operation");

// 内存快照
// 在 DevTools 中查看 Memory 面板
```

#### 最佳实践

1. **避免全局变量**：使用模块模式或立即执行函数
2. **及时清理事件监听器**：在组件卸载时移除监听器
3. **使用 WeakMap/WeakSet**：对于缓存和映射关系
4. **避免深层嵌套**：减少对象图的深度
5. **定期监控内存**：使用工具检测内存泄漏
6. **合理使用闭包**：避免在闭包中持有大量数据

:::

:::

# JavascriptCode

## 以下代码输出什么，为什么？

```js
try {
  let a = 0;
  (async function () {
    a += 1;
    console.log("inner", a);
    throw new Error("123");
    // a()
  })();
  console.log("outer", a);
} catch (e) {
  console.warn("Error", e);
}
```

## 请按照用例实现代码

// 页面上有三个按钮，分别为 A、B、C，点击各个按钮都会发送异步请求且互不影响，每次请求回来的数据都为按钮的名字。
// 请实现当用户依次点击 A、B、C、A、C、B 的时候，最终获取的数据为 ABCACB。

```js
// 请使用原生代码实现一个Events模块，可以实现自定义事件的订阅、触发、移除功能
const fn1 = (...args) => console.log("I want sleep1", ...args);
const fn2 = (...args) => console.log("I want sleep2", ...args);
const event = new Events();
event.on("sleep", fn1, 1, 2, 3);
event.on("sleep", fn2, 1, 2, 3);
event.fire("sleep", 4, 5, 6);
// I want sleep1 1 2 3 4 5 6
// I want sleep2 1 2 3 4 5 6
event.off("sleep", fn1);
event.once("sleep", () => console.log("I want sleep"));
event.fire("sleep");
// I want sleep2 1 2 3
// I want sleep
event.fire("sleep");
// I want sleep2 1 2 3
```

### 解

```js
function Events() {
  this.tasks = [];
  this.onceTasks = [];
}

Events.prototype = {
  on: function () {
    const eventName = arguments[0];
    const fn = arguments[1];
    const params = [...arguments].slice(2);

    if (eventName === "sleep") {
      this.tasks.push({ fn, params });
    }
  },
  fire: function () {
    const eventName = arguments[0];
    const params = [...arguments].slice(1);

    if (eventName === "sleep") {
      this.tasks.forEach((task, index) => {
        task.fn([...task.params, ...params].join(" "));

        if (index === this.tasks.length - 1 && this.onceTasks.length > 0) {
          this.onceTasks.forEach((onceTask) => onceTask.fn());

          this.onceTasks = [];
        }
      });
    }
  },
  off: function () {
    const eventName = arguments[0];

    if (eventName === "sleep") {
      const fn = arguments[1];
      const index = this.tasks.findIndex((task) => task.fn === fn);
      if (index > -1) this.tasks.splice(index, 1);
    }
  },
  once: function () {
    const eventName = arguments[0];
    if (eventName === "sleep") {
      this.onceTasks.push({ fn: arguments[1] });
    }
  },
};
```

## Promise 并发控制

```js
const Create = function () {
  const tasks = [];
  let first = true;

  async function clean() {
    if (tasks.length > 0) {
      tasks[0].then((res) => {
        console.log(res);
        tasks.splice(0, 1);
        clean();
      });
    }
  }

  return function (promise) {
    tasks.push(promise);

    first && (clean(), (first = false));
  };
};

const create = Create();

function A() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("A");
    }, 1000);
  });
}
function B() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("B");
    }, 3000);
  });
}
function C() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("C");
    }, 4000);
  });
}

create(A());
create(B());
create(C());
create(A());
create(C());
create(B());
```

## 闭包原理, 并分析下优点和缺点

::: details 点击查看

### 闭包原理

闭包（Closure）是指有权访问另一个函数作用域中的变量的函数。简单来说，闭包让你可以从内部函数访问外部函数的作用域。

**核心原理：**

1. **词法作用域**：JavaScript 采用词法作用域，函数的作用域在函数定义时就确定了
2. **作用域链**：内部函数可以访问外部函数的作用域，形成作用域链
3. **变量保持**：即使外部函数执行完毕，内部函数仍然可以访问外部函数的变量

**示例代码：**

```js
function outerFunction(x) {
  // 外部函数的作用域
  let outerVariable = "外部变量";

  function innerFunction(y) {
    // 内部函数可以访问外部函数的变量
    console.log(outerVariable); // 访问外部变量
    console.log(x); // 访问外部函数的参数
    return x + y;
  }

  return innerFunction; // 返回内部函数
}

const closure = outerFunction(10);
console.log(closure(5)); // 输出: 15
```

### 闭包的优点

1. **数据私有化**

   - 可以创建私有变量，避免全局污染
   - 实现模块化编程

2. **状态保持**

   - 函数执行完毕后，变量仍然保存在内存中
   - 可以实现函数的状态记忆

3. **函数工厂**

   - 可以动态创建函数
   - 实现柯里化和偏函数

4. **事件处理**
   - 在事件回调中保持对特定数据的引用

**优点示例：**

```js
// 数据私有化
function createCounter() {
  let count = 0; // 私有变量

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter();
console.log(counter.getCount()); // 0
counter.increment();
console.log(counter.getCount()); // 1
```

### 闭包的缺点

1. **内存泄漏风险**

   - 闭包会保持对外部变量的引用，阻止垃圾回收
   - 可能导致内存占用过多

2. **性能影响**

   - 每次创建闭包都会创建新的作用域
   - 可能影响执行效率

3. **调试困难**

   - 闭包的作用域链复杂，调试时难以追踪变量来源
   - 错误定位困难

4. **变量污染**
   - 如果不小心，可能意外修改外部变量
   - 代码逻辑复杂，难以维护

**缺点示例：**

```js
// 内存泄漏示例
function createFunctions() {
  const functions = [];

  for (let i = 0; i < 1000; i++) {
    functions.push(function () {
      console.log(i); // 每个函数都保持对 i 的引用
    });
  }

  return functions;
}

const funcs = createFunctions(); // 创建1000个闭包，占用大量内存
```

### 如何正确使用闭包

1. **及时释放引用**

   ```js
   function createHandler() {
     const data = "大量数据";

     return function () {
       console.log(data);
     };
   }

   const handler = createHandler();
   // 使用完毕后
   handler = null; // 释放引用
   ```

2. **避免循环中的闭包**

   ```js
   // 错误方式
   for (let i = 0; i < 5; i++) {
     setTimeout(() => console.log(i), 1000);
   }

   // 正确方式
   for (let i = 0; i < 5; i++) {
     (function (index) {
       setTimeout(() => console.log(index), 1000);
     })(i);
   }
   ```

3. **使用模块模式**

   ```js
   const module = (function () {
     let privateVar = "私有变量";

     function privateMethod() {
       return privateVar;
     }

     return {
       publicMethod: function () {
         return privateMethod();
       },
     };
   })();
   ```

:::

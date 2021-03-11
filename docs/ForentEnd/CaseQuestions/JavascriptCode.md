---
sidebar: auto
---

# JavascriptCode.md

## 以下代码输出什么，为什么？

```js
try {
  let a = 0
  ;(async function() {
      a += 1
      console.log('inner', a)
      throw new Error('123')
      // a()
  })()
  console.log('outer', a)
} catch(e) {
  console.warn('Error', e)
}
```

## 请按照用例实现代码

// 页面上有三个按钮，分别为 A、B、C，点击各个按钮都会发送异步请求且互不影响，每次请求回来的数据都为按钮的名字。
// 请实现当用户依次点击 A、B、C、A、C、B 的时候，最终获取的数据为 ABCACB。

```js
// 请使用原生代码实现一个Events模块，可以实现自定义事件的订阅、触发、移除功能
const fn1 = (... args)=>console.log('I want sleep1', ... args)
const fn2 = (... args)=>console.log('I want sleep2', ... args)
const event = new Events();
event.on('sleep', fn1, 1, 2, 3);
event.on('sleep', fn2, 1, 2, 3);
event.fire('sleep', 4, 5, 6);
// I want sleep1 1 2 3 4 5 6
// I want sleep2 1 2 3 4 5 6
event.off('sleep', fn1);
event.once('sleep', () => console.log('I want sleep'));
event.fire('sleep');
// I want sleep2 1 2 3
// I want sleep
event.fire('sleep');
// I want sleep2 1 2 3
```

### 解

```js
function Events () {
  this.tasks = []
  this.onceTasks = []
}

Events.prototype = {
  on: function () {
    const eventName = arguments[0]
    const fn = arguments[1]
    const params = [...arguments].slice(2)

    if (eventName === 'sleep') {
      this.tasks.push({fn, params})
    }
  },
  fire: function () {
    const eventName = arguments[0]
    const params = [...arguments].slice(1)

    if (eventName === 'sleep') {
      this.tasks.forEach((task, index) => {
        task.fn([...task.params, ...params].join(' '))

        if (index === this.tasks.length - 1 && this.onceTasks.length > 0) {
          this.onceTasks.forEach(onceTask => onceTask.fn())

          this.onceTasks = []
        }
      })
    }
  },
  off: function () {
    const eventName = arguments[0]

    if (eventName === 'sleep') {
      const fn = arguments[1]
      const index = this.tasks.findIndex(task => task.fn === fn)
      if (index > -1) this.tasks.splice(index, 1)
    }
  },
  once: function () {
    const eventName = arguments[0]
    if (eventName === 'sleep') {
      this.onceTasks.push({fn: arguments[1]})
    }
  }
}
```

## Promise 并发控制

```js
const Create = function() {
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

  return function(promise) {
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

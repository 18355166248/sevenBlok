function Promise(fn) {
  let state = "pending";
  let value;
  const callbacks = [];

  // onFulfilled: Function 状态变成fulfilled后的回调函数
  this.then = function(onFulfilled) {
    return new Promise((resolve) => {
      console.log("then", onFulfilled);
      handle({
        onFulfilled,
        resolve,
      });
    });
  };

  // 这里会吧state改成fulfilled, 将val缓存再value, 执行then里面的回调函数
  function resolve(val) {
    const fn = () => {
      if (state !== "pending") return;

      state = "fulfilled";
      value = val;
      handleCb();
    };

    setTimeout(fn, 0);
  }

  function handleCb() {
    while (callbacks.length) {
      const fulfilledFn = callbacks.shift();

      handle(fulfilledFn);
    }
  }

  function handle(callback) {
    if (state === "pending") {
      callbacks.push(callback);
      return;
    }

    if (state === "fulfilled") {
      if (!callback.onFulfilled) {
        callback.resolve(value);
        return;
      }
      const res = callback.onFulfilled(value);
      callback.resolve(res);
    }
  }

  fn(resolve);
}

const p = new Promise((resolve) => {
  console.log(4444);

  resolve(111);
});

p.then((res) => {
  console.log(res);
})
  .then()
  .then((res) => {
    console.log("二次then", res);
  });

// 回顾

// 1. 初始化Promise, 设置state变量, 用于控制Promise的三种状态, 不可逆. pending fulfilled rejected  并初始化Promise回调函数里面改变状态传输的值value, 再缓存then里面回调函数的缓存函数

// 2. 执行then的回调函数, 并传入一个resolve方法

// 3. resolve方法是为了改变state从pending到fulfilled的, 他的执行需要再setTimeout中, 目的是为了让所有的then内部的回调函数缓存再callbacks数组内

// 4. 执行resolve方法, 缓存val的值, 改变了state的值为fulfilled, 执行缓存回调函数内部的函数

// 5. 在执行then回调函数的时候, 需要做边界处理, 如果then的回调函数不传的话, 那么默认执行resolve并将上一个value的缓存值传下去

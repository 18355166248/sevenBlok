# PromiseRetry

```js
/**
 *
 * @param {函数} fn
 * @param {重试次数} times
 * @param {重试延迟ms} delay
 */
Promise.retry = function(fn, times, delay) {
  return new Promise((resolve, reject) => {
    const cb = function() {
      Promise.resolve(fn())
        .then(resolve)
        .catch((err) => {
          if (times--) {
            delay > 0
              ? setTimeout(() => {
                  cb();
                }, delay)
              : cb();
          } else {
            reject(err);
          }
        });
    };

    cb();
  });
};

function getUser() {
  return new Promise((resolve, reject) => {
    const result = Math.floor(Math.random() * 10);
    return result < 3
      ? resolve({
          id: result,
          username: "ming",
        })
      : reject(new Error(`The ${result} is greater than 3`));
  });
}

Promise.retry(getUser, 5, 10)
  .then((r) => {
    console.log(`The result is ${r.username}`);
  })
  .catch((err) => {
    console.log(err);
  });
```